const Evenement = require('../models/Evenement');

/**
 * Controller pour l'entité Événement
 */

/**
 * GET /api/evenements
 * Récupère la liste de tous les événements
 */
async function getAllEvenements(req, res, next) {
  try {
    const evenements = await Evenement.find().sort({ dateDebut: 1 });
    res.json(evenements);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/evenements/:id
 * Récupère un événement par son ID
 */
async function getEvenementById(req, res, next) {
  try {
    const { id } = req.params;
    const evenement = await Evenement.findById(id);
    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé.' });
    }
    res.json(evenement);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/evenements
 * Crée un nouvel événement
 */
async function createEvenement(req, res, next) {
  try {
    const data = req.body;
    const nouvelEvenement = new Evenement(data);
    const saved = await nouvelEvenement.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/evenements/:id
 * Met à jour un événement existant
 */
async function updateEvenement(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await Evenement.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Événement non trouvé pour mise à jour.' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/evenements/:id
 * Supprime un événement par son ID
 */
async function deleteEvenement(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Evenement.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Événement non trouvé pour suppression.' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllEvenements,
  getEvenementById,
  createEvenement,
  updateEvenement,
  deleteEvenement,
};
