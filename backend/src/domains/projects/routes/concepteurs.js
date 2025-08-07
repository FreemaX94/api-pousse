// backend/routes/concepteurs.js
const express = require('express');
const { getAllConcepteurs, createConcepteur, validateCreateConcepteur } = require('../controllers/concepteurController.js');
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const adminMiddleware = require('../../../shared/middleware/adminMiddleware.js');

const router = express.Router();
router.use(authMiddleware());

router.get('/', getAllConcepteurs);
router.post('/', adminMiddleware, validateCreateConcepteur, createConcepteur);

module.exports = router;
