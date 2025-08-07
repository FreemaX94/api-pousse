// backend/controllers/movementController.js

const mongoose      = require('mongoose');
const Movement      = require('../models/movementModel');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');
const Project       = require('../models/Projet');

// Création d’un mouvement (entrée ou sortie), project optionnel
exports.createMovement = async (req, res) => {
  try {
    console.log('🔍 Création mouvement - données reçues:', req.body);
    
    const {
      type,       // "entrée" ou "sortie"
      subType,    // "definitive" ou "locative" (pour les sorties)
      reference,  // code article
      name,       // nom article
      quantity,   // quantité à déplacer
      project,    // id du projet (optionnel)
      note,       // commentaire optionnel
      createdBy   // utilisateur qui crée le mouvement
    } = req.body;

    // Date de l’événement : soit fournie, soit maintenant
    const eventDate = req.body.eventDate
      ? new Date(req.body.eventDate)
      : new Date();

    // Validation minimale (project n'est plus obligatoire)
    if (!type || !reference || !name || !quantity || !createdBy) {
      console.log('❌ Validation échouée - champs manquants:', {
        type: !!type,
        reference: !!reference,
        name: !!name,
        quantity: !!quantity,
        createdBy: !!createdBy
      });
      return res.status(400).json({ error: 'Champs requis manquants' });
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

    // Récupérer l'article pour obtenir le prix
    let item = await NieuwkoopItem.findOne({ 
      reference,
      $or: [
        { 'availability.isActive': true },
        { 'availability.isActive': { $exists: false } }
      ]
    });
    console.log('🔍 Article brut depuis MongoDB:', JSON.stringify(item, null, 2));
    
    // Si l'article n'existe pas dans le stock local mais qu'on a des infos dans le body, le créer
    if (!item && req.body.isNewPlant) {
      console.log('🆕 Création automatique d\'un nouvel article:', reference);
      
      try {
        // Récupérer les infos depuis l'API Nieuwkoop si nécessaire
        let itemInfo = {
          name: req.body.name || 'Nouveau produit',
          price: req.body.price || 0,
          height: req.body.height || 0,
          diameter: req.body.diameter || 0
        };
        
        // Créer l'article dans le stock local
        item = await NieuwkoopItem.create({
          reference,
          name: itemInfo.name,
          dimensions: {
            height: itemInfo.height,
            diameter: itemInfo.diameter
          },
          pricing: {
            price: itemInfo.price
          },
          images: [{
            url: `/api/nieuwkoop/items/${reference}/image`,
            isPrimary: true
          }],
          stock: {
            quantity: 0, // Nouveau produit, pas encore en stock
            reservedQuantity: 0,
            availableQuantity: 0
          },
          category: req.body.category || 'autre',
          availability: {
            isActive: true,
            status: 'out_of_stock' // Pas encore en stock
          }
        });
        
        console.log('✅ Nouvel article créé:', item.name);
      } catch (createError) {
        console.error('❌ Erreur création article:', createError);
        return res.status(500).json({ error: 'Impossible de créer le nouvel article' });
      }
    }
    
    if (!item) {
      return res.status(404).json({ error: 'Article introuvable et impossible à créer' });
    }
    
    // Récupérer le prix de l'article
    const itemPrice = item.pricing?.price || 0;

    // Si sortie, vérifier et réserver la quantité (sauf pour les nouvelles plantes)
    if (type === 'sortie') {
      const isNewPlant = req.body.isNewPlant || false;
      
      // Debug: afficher les valeurs avec tous les formats possibles
      console.log('🔍 Article trouvé:', item.name);
      console.log('📦 Stock imbriqué:', item.stock);
      console.log('📦 Stock direct:', { quantity: item.quantity, reservedQuantity: item.reservedQuantity });
      console.log('📤 Quantité demandée:', quantity);
      console.log('🆕 Nouvelle plante:', isNewPlant);
      
      // Utiliser exactement la même logique que getNieuwkoopItems
      const stockTotal = item.stock?.quantity || item.quantity || 0;
      const stockReserve = item.stock?.reservedQuantity || item.reservedQuantity || 0;
      const disponible = Math.max(0, stockTotal - stockReserve);
      
      console.log('✅ Stock calculé - Total:', stockTotal, 'Réservé:', stockReserve, 'Disponible:', disponible);
      
      // Pour les plantes déjà en stock, vérifier la disponibilité (seulement si stockTotal > 0)
      if (!isNewPlant && stockTotal > 0) {
        if (disponible < quantity) {
          return res.status(400).json({ 
            error: 'Stock insuffisant',
            details: {
              stockTotal,
              stockReserve,
              disponible,
              demande: quantity
            }
          });
        }
        
        // Réserver la quantité
        if (item.stock && typeof item.stock.reservedQuantity === 'number') {
          item.stock.reservedQuantity = stockReserve + quantity;
          await item.save();
        } else if (typeof item.reservedQuantity === 'number') {
          item.reservedQuantity = stockReserve + quantity;
          await item.save();
        }
      } else {
        console.log('🆕 Nouvelle plante ou ancien article sans stock structuré - pas de réservation');
      }
    }

    // Création du mouvement
    const movementData = {
      type,
      subType: type === 'sortie' ? subType : null,  // subType seulement pour les sorties
      reference,
      name,
      quantity,
      price: itemPrice,  // Prix récupéré de l'article
      eventDate,
      project: projId,  // pourra être null
      note,
      createdBy,
      image: req.body.image || ''
    };

    // Pour les sorties locatives, ajouter les dates
    if (type === 'sortie' && subType === 'locative' && req.body.returnPlannedAt) {
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
    const item = await NieuwkoopItem.findOne({ reference: m.reference });
    if (item) {
      item.stock.reservedQuantity = Math.max(0, (item.stock.reservedQuantity || 0) - m.quantity);
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
