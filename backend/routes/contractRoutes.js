const express = require('express');
const { postContract, getContracts, getContract, validatePostContract, validateGetContracts, validateGetContract } = require('../controllers/contractController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/', authMiddleware, validatePostContract, postContract);
router.get('/', authMiddleware, validateGetContracts, getContracts);
router.get('/:id', authMiddleware, validateGetContract, getContract);

module.exports = router;