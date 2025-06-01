const express = require('express');
const { getAllConcepteurs, createConcepteur, validateCreateConcepteur } = require('../controllers/concepteurController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

const router = express.Router();
router.use(authMiddleware());

router.get('/', getAllConcepteurs);
router.post('/', authMiddleware, adminMiddleware, validateCreateConcepteur, createConcepteur);

module.exports = router;