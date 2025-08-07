// Route de test pour création de projet sans Multer
const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet');

// Route de test simple sans multer ni validation
router.post('/test-create', async (req, res) => {
  try {
    console.log('📥 Test création projet - Body reçu:', req.body);
    
    const newProjet = new Projet({
      client: req.body.client || 'Client Test',
      description: req.body.description || 'Description test',
      dateDebut: req.body.dateDebut || new Date(),
      dateFin: req.body.dateFin || new Date(),
      statut: req.body.statut || 'En cours',
      files: [],
      materials: {
        nieuwkoopItems: []
      }
    });
    
    const saved = await newProjet.save();
    console.log('✅ Projet test créé avec succès:', saved._id);
    
    res.status(201).json({
      success: true,
      message: 'Projet test créé',
      data: saved
    });
  } catch (error) {
    console.error('❌ Erreur création projet test:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;