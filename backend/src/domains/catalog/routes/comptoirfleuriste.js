// File: backend/routes/comptoirfleuriste.js

const express = require('express');
const { importComptoirFleuriste } = require('../controllers/comptoirfleuriste.controller');
const router = express.Router();

// Route utilisée par l'extension Chrome pour importer un produit ComptoirFleuriste
router.post('/save', importComptoirFleuriste);

module.exports = router;
