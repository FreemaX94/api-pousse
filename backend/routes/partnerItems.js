const express = require("express");
const router = express.Router();
const partnerItemController = require("../controllers/partnerItemController");

// POST → Ajouter un article partenaire
router.post("/", partnerItemController.createPartnerItem);

// GET → Récupérer tous les articles partenaires
router.get("/", partnerItemController.getAllPartnerItems);

module.exports = router;
