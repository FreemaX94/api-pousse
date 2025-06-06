// backend/routes/concepteurs.js
const express = require('express');
const { getAllConcepteurs, createConcepteur, validateCreateConcepteur } = require('../controllers/concepteurController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

const router = express.Router();
router.use(authMiddleware());

router.get('/', getAllConcepteurs);
router.post('/', adminMiddleware, validateCreateConcepteur, createConcepteur);

module.exports = router;
