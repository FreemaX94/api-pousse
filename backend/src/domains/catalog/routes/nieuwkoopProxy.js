const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../../shared/middleware/authMiddleware');
const nieuwkoopProxy = require('../services/nieuwkoopProxy');
const { celebrate, Joi, Segments } = require('celebrate');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware());

// Validation des paramètres
const validateItemCode = celebrate({
  [Segments.PARAMS]: Joi.object({
    itemCode: Joi.string().alphanum().min(3).max(20).required()
  })
});

// GET /api/nieuwkoop-proxy/items/:itemCode/image
router.get('/items/:itemCode/image', validateItemCode, async (req, res) => {
  try {
    const imageData = await nieuwkoopProxy.getItemImage(
      req.params.itemCode,
      req.user._id
    );

    // Convertir base64 en buffer et envoyer comme image
    const buffer = Buffer.from(imageData.Image, 'base64');
    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff'
    });
    res.send(buffer);

  } catch (error) {
    if (error.message === 'Rate limit exceeded') {
      return res.status(429).json({ 
        error: 'Trop de requêtes. Veuillez réessayer plus tard.' 
      });
    }
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'image' });
  }
});

// GET /api/nieuwkoop-proxy/items/:itemCode
router.get('/items/:itemCode', validateItemCode, async (req, res) => {
  try {
    const itemData = await nieuwkoopProxy.getItemDetails(
      req.params.itemCode,
      req.user._id
    );

    if (!itemData) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Nettoyer les données sensibles
    const cleanData = {
      itemCode: itemData.Itemcode,
      description: itemData.ItemDescription_FR,
      height: itemData.Height,
      diameter: itemData.DiameterCulturePot,
      potSize: itemData.PotSize,
      price: itemData.Salesprice
    };

    res.json(cleanData);

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des détails' });
  }
});

module.exports = router;
