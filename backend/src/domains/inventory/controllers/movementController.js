// backend/controllers/movementController.js

const mongoose      = require('mongoose');
const Movement      = require('../models/movementModel');
const NieuwkoopItem = require('../../catalog/models/nieuwkoopItemModel');
const Project       = require('../../projects/models/Projet');
const { uploadFile, isSpacesConfigured } = require('../../../shared/services/spacesService');

// Création d'un mouvement (entrée ou sortie), project optionnel
exports.createMovement = async (req, res) => {
  try {
    console.log('🚀 [MOVEMENT CONTROLLER] Création mouvement démarrée');

    const {
      type,       // "entrée" ou "sortie"
      subType,    // "definitive" ou "locative" (pour sorties)
      reference,  // code article
      name,       // nom article
      quantity,   // quantité à déplacer
      project,    // id du projet (optionnel)
      note,       // commentaire optionnel
      createdBy,  // utilisateur qui crée le mouvement
      concepteur, // concepteur responsable (optionnel)
      coef,       // coefficient multiplicateur (mode multiple)
      isNewPlant, // nouvelle plante (mode multiple)
      height,     // hauteur de la plante (mode multiple)
      diameter,   // diamètre de la plante (mode multiple)
      category    // catégorie de la plante (mode multiple)
    } = req.body;

    // Convertir les valeurs numériques car FormData envoie tout en string
    const parsedQuantity = parseInt(quantity, 10);
    const parsedCoef = coef ? parseInt(coef, 10) : 1;
    const parsedHeight = height ? parseFloat(height) : 0;
    const parsedDiameter = diameter ? parseFloat(diameter) : 0;

    // Pour les entrées externes sans référence, générer une référence unique
    const finalReference = reference || `EXT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Date de l’événement : soit fournie, soit maintenant
    const eventDate = req.body.eventDate
      ? new Date(req.body.eventDate)
      : new Date();

    // Validation minimale (project n'est plus obligatoire)
    if (!type || !name || !parsedQuantity || !createdBy) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Validation de la quantité
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ error: 'Quantité invalide' });
    }

    // Si un project est passé, on peut l'accepter comme chaîne ou ObjectId
    let projId = null;
    if (project) {
      // Si c'est un ObjectId valide, on vérifie qu'il existe
      if (mongoose.Types.ObjectId.isValid(project)) {
        try {
          const proj = await Project.findById(project);
          if (proj) {
            projId = project;
          }
        } catch {
          // Si erreur, on utilise le projet comme chaîne
          projId = project;
        }
      } else {
        // Si ce n'est pas un ObjectId, on l'utilise comme chaîne
        projId = project;
      }
    }

    // Récupérer l'article pour obtenir le prix (pour les articles du catalogue uniquement)
    let item = null;
    let itemPrice = 0;
    let imageUrl = ''; // URL de l'image (Spaces ou local)
    
    // Si c'est une référence d'origine (pas générée automatiquement), chercher dans le catalogue
    if (reference && !reference.startsWith('EXT-')) {
      item = await NieuwkoopItem.findOne({ reference: finalReference });
      if (!item) {
        return res.status(404).json({ error: 'Article introuvable' });
      }
      itemPrice = item.pricing?.price || 0;
    } else {
      // Pour les entrées externes, utiliser le prix fourni par l'utilisateur
      itemPrice = req.body.price ? parseFloat(req.body.price) : 0;
      
      // Pour les entrées externes de type "entrée", créer automatiquement un article dans le catalogue
      if (type === 'entrée') {
        try {
          // Gérer l'upload d'image (Spaces si configuré, sinon local)
          let imageUrl = '';
          if (req.file) {
            console.log('🔍 [NEW ARTICLE] NODE_ENV:', process.env.NODE_ENV);
            console.log('🔍 [NEW ARTICLE] DO_SPACES_KEY:', process.env.DO_SPACES_KEY ? 'Configuré' : 'Non configuré');
            console.log('🔍 [NEW ARTICLE] DO_SPACES_SECRET:', process.env.DO_SPACES_SECRET ? 'Configuré' : 'Non configuré');
            console.log('🔍 [NEW ARTICLE] DO_SPACES_BUCKET:', process.env.DO_SPACES_BUCKET);
            console.log('🔍 [NEW ARTICLE] isSpacesConfigured():', isSpacesConfigured());
            
            const useSpaces = process.env.NODE_ENV === 'production' && isSpacesConfigured();
            console.log('🔍 [NEW ARTICLE] useSpaces:', useSpaces);
            
            if (useSpaces) {
              console.log('🗂️ [NEW ARTICLE] Upload vers Spaces:', req.file.originalname);
              try {
                // Générer nom de fichier unique pour Spaces
                const timestamp = Date.now();
                const ext = require('path').extname(req.file.originalname);
                const cleanName = require('path').basename(req.file.originalname, ext)
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-zA-Z0-9\-_]/g, '_')
                  .replace(/_+/g, '_')
                  .replace(/^_|_$/g, '');
                const filename = `movement_${cleanName}_${timestamp}${ext}`;
                
                // Upload vers Spaces
                imageUrl = await uploadFile(req.file.buffer, filename, req.file.mimetype, 'movements');
                console.log('✅ [NEW ARTICLE] Image uploadée vers Spaces:', imageUrl);
              } catch (spacesError) {
                console.error('❌ [NEW ARTICLE] Erreur upload Spaces, fallback local:', spacesError.message);
                // Fallback vers le système local actuel
                imageUrl = `/api/uploads/movements/${req.file.filename}`;
              }
            } else {
              // Système local existant (développement ou si Spaces non configuré)  
              imageUrl = `/api/uploads/movements/${req.file.filename}`;
            }
          }

          // Créer un nouvel article dans le catalogue Nieuwkoop
          const newItem = await NieuwkoopItem.create({
            reference: finalReference,
            name: name,
            description: note || `Article externe: ${name}`,
            category: 'externe',
            dimensions: {
              height: parsedHeight || 0,
              diameter: parsedDiameter || 0,
              unit: 'cm'
            },
            pricing: {
              price: itemPrice,
              currency: 'EUR'
            },
            stock: {
              quantity: parsedQuantity,
              reservedQuantity: 0,
              minimumAlert: 0
            },
            images: imageUrl ? [{
              url: imageUrl,
              isPrimary: true,
              alt: name
            }] : [],
            metadata: {
              isExternal: true,
              source: 'external'
            },
            availability: {
              status: 'available',
              isActive: true
            },
            supplier: {
              name: 'Externe',
              code: 'EXT'
            }
          });
          
          item = newItem;
          console.log('✅ Article externe créé dans le catalogue:', finalReference);
        } catch (error) {
          console.error('❌ Erreur création article externe:', error);
          // Continuer même si la création de l'article échoue
        }
      }
    }

    // Si sortie, gérer le stock selon le sous-type (seulement pour les articles du catalogue)
    if (type === 'sortie' && item) {
      
      // Debug: afficher les valeurs
      console.log('🔍 Article trouvé:', item.name);
      console.log('📦 Stock total:', item.stock?.quantity || 0);
      console.log('🔒 Stock réservé:', item.stock?.reservedQuantity || 0);
      console.log('📤 Quantité demandée:', parsedQuantity);
      console.log('🎯 Type de sortie:', subType || 'definitive');
      
      const stockTotal = item.stock?.quantity || 0;
      const stockReserve = item.stock?.reservedQuantity || 0;
      const disponible = stockTotal - stockReserve;
      
      console.log('✅ Stock disponible:', disponible);
      
      if (disponible < parsedQuantity) {
        return res.status(400).json({ 
          error: 'Stock insuffisant',
          details: {
            stockTotal,
            stockReserve,
            disponible,
            demande: parsedQuantity
          }
        });
      }
      
      // Gestion différenciée selon le sous-type de sortie
      if (subType === 'locative') {
        // Sortie locative : réserver le stock (les plantes reviendront)
        item.stock.reservedQuantity = stockReserve + parsedQuantity;
        console.log('🔄 Sortie locative : stock réservé');
      } else {
        // Sortie définitive : décrémenter définitivement le stock total
        item.stock.quantity = stockTotal - parsedQuantity;
        console.log('🗑️ Sortie définitive : stock décrémenté définitivement');
      }
      
      await item.save();
    }

    // Création du mouvement
    const movementData = {
      type,
      subType: subType || 'definitive',  // Sous-type pour les sorties
      reference: finalReference,
      name,
      quantity: parsedQuantity,
      price: itemPrice,  // Prix récupéré de l'article ou fourni par l'utilisateur
      eventDate,
      project: projId,  // pourra être null
      note,
      createdBy,
      concepteur: concepteur || null,  // Concepteur responsable
      image: (type === 'entrée' && imageUrl) ? imageUrl : (req.file ? `/api/catalog/nieuwkoop/movement-image/${req.file.filename}` : (req.body.image || '')),
      // Champs pour le mode multiple
      coef: parsedCoef,
      isNewPlant: isNewPlant === 'true' || isNewPlant === true,
      height: parsedHeight,
      diameter: parsedDiameter,
      category: category || 'autre'
    };

    // Pour les sorties locatives, ajouter les dates
    if (type === 'sortie' && req.body.returnPlannedAt) {
      movementData.departureDate = eventDate;
      movementData.returnPlannedAt = new Date(req.body.returnPlannedAt);
    }

    const movement = await Movement.create(movementData);

    return res.status(201).json(movement);
  } catch (err) {
    console.error('Erreur création mouvement :', err);
    return res.status(500).json({ error: 'Erreur serveur lors de la création du mouvement' });
  }
};

// Récupérer tous les mouvements
exports.getAllMovements = async (req, res) => {
  try {
    const movements = await Movement.find().sort({ createdAt: -1 });
    
    // Populer les projets qui sont des ObjectIds
    const populatedMovements = await Promise.all(
      movements.map(async (movement) => {
        if (movement.project && mongoose.Types.ObjectId.isValid(movement.project)) {
          try {
            await movement.populate('project', 'name client description');
          } catch (err) {
            // Si l'ObjectId n'existe pas, on garde la valeur originale
            console.warn('Projet non trouvé:', movement.project);
          }
        }
        return movement;
      })
    );
    
    return res.json(populatedMovements);
  } catch (err) {
    console.error('Erreur chargement mouvements :', err);
    return res.status(500).json({ error: 'Erreur serveur lors du chargement des mouvements' });
  }
};

// Récupérer les mouvements d’un projet spécifié
exports.getMovementsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const proj = await Project.findById(projectId);
    if (!proj) {
      return res.status(404).json({ error: 'Projet introuvable' });
    }
    const movements = await Movement.find({ project: projectId }).sort({ createdAt: -1 });
    return res.json(movements);
  } catch (err) {
    console.error('Erreur chargement mouvements par projet :', err);
    return res.status(500).json({ error: 'Erreur serveur lors du chargement des mouvements par projet' });
  }
};

// Valider (confirmer) un mouvement
exports.validateMovement = async (req, res) => {
  try {
    const m = await Movement.findById(req.params.id);
    if (!m) {
      return res.status(404).json({ error: 'Mouvement introuvable' });
    }
    m.validated = true;
    await m.save();
    return res.json(m);
  } catch (err) {
    console.error('Erreur validation du mouvement :', err);
    return res.status(500).json({ error: 'Erreur serveur lors de la validation du mouvement' });
  }
};

// Marquer une sortie comme retournée
exports.markAsReturned = async (req, res) => {
  try {
    const m = await Movement.findById(req.params.id);
    if (!m || m.type !== 'sortie') {
      return res.status(400).json({ error: 'Mouvement non valide pour retour' });
    }

    // Vérifier si le mouvement est déjà marqué comme retourné
    if (m.returned) {
      return res.status(400).json({ error: 'Ce mouvement est déjà marqué comme retourné' });
    }

    const item = await NieuwkoopItem.findOne({ reference: m.reference });
    if (item) {
      console.log('🔄 Retour de marchandise:', {
        reference: m.reference,
        quantity: m.quantity,
        subType: m.subType,
        stockAvant: item.stock?.quantity || 0,
        reserveAvant: item.stock?.reservedQuantity || 0
      });

      if (m.subType === 'locative') {
        // Sortie locative : libérer les réservations et remettre en stock
        const currentReserved = item.stock?.reservedQuantity || 0;
        item.stock.reservedQuantity = Math.max(0, currentReserved - m.quantity);
        item.stock.quantity = (item.stock?.quantity || 0) + m.quantity;
        console.log('✅ Retour sortie locative : stock libéré et réintégré');
      } else {
        // Sortie définitive : en théorie, pas de retour possible, mais si ça arrive...
        // On peut choisir de remettre en stock ou d'ignorer
        console.log('⚠️ Tentative de retour d\'une sortie définitive - remise en stock');
        item.stock.quantity = (item.stock?.quantity || 0) + m.quantity;
      }

      console.log('📊 Nouvel état stock:', {
        stockTotal: item.stock.quantity,
        stockReserve: item.stock.reservedQuantity
      });

      await item.save();
    }

    m.returned = true;
    m.returnedAt = new Date();
    await m.save();
    return res.json(m);
  } catch (err) {
    console.error('Erreur marquage retour :', err);
    return res.status(500).json({ error: 'Erreur serveur lors du marquage de retour' });
  }
};

// Supprimer un mouvement
exports.deleteMovement = async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id);
    if (!movement) {
      return res.status(404).json({ error: 'Mouvement introuvable' });
    }

    // Si c'est une sortie et qu'elle n'est pas retournée, restaurer le stock
    if (movement.type === 'sortie' && !movement.returned) {
      const item = await NieuwkoopItem.findOne({ reference: movement.reference });
      if (item && item.stock) {
        console.log('🗑️ Suppression mouvement de sortie:', {
          reference: movement.reference,
          quantity: movement.quantity,
          subType: movement.subType,
          stockAvant: item.stock?.quantity || 0,
          reserveAvant: item.stock?.reservedQuantity || 0
        });

        if (movement.subType === 'locative') {
          // Sortie locative : libérer les réservations (le stock total n'avait pas été touché)
          item.stock.reservedQuantity = Math.max(0, (item.stock.reservedQuantity || 0) - movement.quantity);
          console.log('✅ Suppression sortie locative : réservation libérée');
        } else {
          // Sortie définitive : remettre en stock (annuler la décrémentation)
          item.stock.quantity = (item.stock?.quantity || 0) + movement.quantity;
          console.log('✅ Suppression sortie définitive : stock restauré');
        }

        console.log('📊 Nouvel état stock après suppression:', {
          stockTotal: item.stock.quantity,
          stockReserve: item.stock.reservedQuantity
        });

        await item.save();
      }
    }

    // Supprimer le mouvement
    await Movement.findByIdAndDelete(req.params.id);
    
    return res.json({ message: 'Mouvement supprimé avec succès' });
  } catch (err) {
    console.error('Erreur suppression mouvement :', err);
    return res.status(500).json({ error: 'Erreur serveur lors de la suppression du mouvement' });
  }
};
