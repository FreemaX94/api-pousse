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