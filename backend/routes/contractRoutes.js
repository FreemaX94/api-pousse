// backend/routes/contractRoutes.js
const express = require('express');
const { postContract, getContracts, getContract, validatePostContract, validateGetContracts, validateGetContract } = require('../controllers/contractController.js');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware());

router.post('/', validatePostContract, postContract);
router.get('/', validateGetContracts, getContracts);
router.get('/:id', validateGetContract, getContract);

module.exports = router;
