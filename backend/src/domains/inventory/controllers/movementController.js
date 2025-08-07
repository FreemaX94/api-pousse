// backend/controllers/movementController.js

const mongoose      = require('mongoose');
const Movement      = require('../models/movementModel');
const NieuwkoopItem = require('../../catalog/models/nieuwkoopItemModel');
const Project       = require('../../projects/models/Projet');

// Création d’un mouvement (entrée ou sortie), project optionnel
exports.createMovement = async (req, res) => {
  try {
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

    // Date de l’événement : soit fournie, soit maintenant
    const eventDate = req.body.eventDate
      ? new Date(req.body.eventDate)
      : new Date();

    // Validation minimale (project n'est plus obligatoire)
    if (!type || !reference || !name || !quantity || !createdBy) {
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
    const item = await NieuwkoopItem.findOne({ reference });
    if (!item) {
      return res.status(404).json({ error: 'Article introuvable' });
    }
    
    // Récupérer le prix de l'article
    const itemPrice = item.pricing?.price || 0;

    // Si sortie, vérifier et réserver la quantité
    if (type === 'sortie') {
      
      // Debug: afficher les valeurs
      console.log('🔍 Article trouvé:', item.name);
      console.log('📦 Stock total:', item.stock?.quantity || 0);
      console.log('🔒 Stock réservé:', item.stock?.reservedQuantity || 0);
      console.log('📤 Quantité demandée:', quantity);
      
      const stockTotal = item.stock?.quantity || 0;
      const stockReserve = item.stock?.reservedQuantity || 0;
      const disponible = stockTotal - stockReserve;
      
      console.log('✅ Stock disponible:', disponible);
      
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
      
      item.stock.reservedQuantity = stockReserve + quantity;
      await item.save();
    }

    // Création du mouvement
    const movementData = {
      type,
      subType: subType || 'definitive',  // Sous-type pour les sorties
      reference,
      name,
      quantity,
      price: itemPrice,  // Prix récupéré de l'article
      eventDate,
      project: projId,  // pourra être null
      note,
      createdBy,
      concepteur: concepteur || null,  // Concepteur responsable
      image: req.body.image || '',
      // Champs pour le mode multiple
      coef: coef || 1,
      isNewPlant: isNewPlant || false,
      height: height || 0,
      diameter: diameter || 0,
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

// Supprimer un mouvement
exports.deleteMovement = async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id);
    if (!movement) {
      return res.status(404).json({ error: 'Mouvement introuvable' });
    }

    // Si c'est une sortie et qu'elle n'est pas retournée, libérer le stock réservé
    if (movement.type === 'sortie' && !movement.returned) {
      const item = await NieuwkoopItem.findOne({ reference: movement.reference });
      if (item && item.stock) {
        item.stock.reservedQuantity = Math.max(0, (item.stock.reservedQuantity || 0) - movement.quantity);
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
