const express = require("express");
const router = express.Router();
const movementController = require("../controllers/movementController");

// ➕ Créer un nouveau mouvement
router.post("/", movementController.createMovement);

// 📋 Obtenir tous les mouvements
router.get("/", movementController.getAllMovements);

// ✅ Valider un mouvement
router.put("/:id/validate", movementController.validateMovement);

// ♻️ Marquer un mouvement comme retourné
router.put("/:id/return", movementController.markAsReturned);

module.exports = router;
