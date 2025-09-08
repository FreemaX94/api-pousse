const { Router } = require('express');
const multer = require('multer');
const {
  getAllProjets,
  getProjetById,
  createProjet,
  updateProjet,
  completeProjet,
  deleteProjet
} = require('../controllers/projetController');
const {
  createProjetValidator,
  updateProjetValidator,
  idParamValidator
} = require('../validators/projetValidator');

const router = Router();

// Multer : stockage sur disque dans /uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10 Mo max
});

// POST et PUT avec upload.array('files')
router.post(
  '/',
  upload.array('files'),
  createProjetValidator,
  createProjet
);

router.get('/', getAllProjets);
router.get('/:id', idParamValidator, getProjetById);

// Route de test publique pour créer un projet (sans authentification)
router.post('/test-create', upload.array('files'), async (req, res) => {
  try {
    console.log('🧪 Test création projet reçu:', req.body);
    
    // Utiliser le contrôleur existant mais sans validation stricte
    const projectData = {
      title: req.body.title || req.body.client || 'Projet Test',
      client: {
        type: 'individual',
        name: req.body.client || 'Client Test',
        contact: {
          address: {
            street: req.body.address || 'Adresse Test',
            city: 'Ville Test',
            postalCode: '12345',
            country: 'France'
          }
        }
      },
      type: 'Installation',
      dates: {
        start: req.body.dateDebut ? new Date(req.body.dateDebut) : new Date(),
        end: req.body.dateFin ? new Date(req.body.dateFin) : new Date(Date.now() + 7*24*60*60*1000)
      },
      location: {
        address: req.body.address || 'Adresse Test'
      },
      description: req.body.description || 'Projet créé via route de test',
      status: 'active',
      materials: [],
      documents: []
    };

    const Projet = require('../models/Projet');
    const projet = await Projet.create(projectData);
    
    console.log('✅ Projet test créé:', projet._id);
    res.status(201).json(projet);
  } catch (error) {
    console.error('❌ Erreur création projet test:', error);
    res.status(500).json({ 
      error: 'Erreur création projet test', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
router.put(
  '/:id',
  upload.array('files'),
  updateProjetValidator,
  updateProjet
);
// Route pour terminer un projet et finaliser les stocks
router.put('/:id/complete', idParamValidator, completeProjet);
router.delete('/:id', idParamValidator, deleteProjet);

module.exports = router;