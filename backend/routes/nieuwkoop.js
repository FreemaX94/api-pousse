// backend/routes/nieuwkoop.js
const express = require('express');
const axios = require('axios');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware());

// GET /api/nieuwkoop/plantes
router.get(
  '/plantes',
  async (req, res) => {
    try {
      const auth = Buffer.from(
        `${process.env.NIEUWKOOP_USER}:${process.env.NIEUWKOOP_PASS}`
      ).toString('base64');

      const response = await axios.get(
        'https://customerapi.nieuwkoop-europe.com/stock?categorie=Plantes',
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return res.json(response.data);
    } catch (err) {
      console.error('Erreur proxy Nieuwkoop Plantes :', err.message);
      const status = err.response?.status || 500;
      return res.status(status).json({ error: err.message });
    }
  }
);

module.exports = router;
