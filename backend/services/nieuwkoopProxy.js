const axios = require('axios');
const NodeCache = require('node-cache');
const logger = require('../utils/logger');

class NieuwkoopProxy {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache 1h
    this.rateLimitMap = new Map();
  }

  // Rate limiting par utilisateur
  checkRateLimit(userId, limit = 100, window = 3600000) { // 100 req/heure
    const now = Date.now();
    const userLimits = this.rateLimitMap.get(userId) || [];

    // Nettoyer les anciennes entrées
    const validLimits = userLimits.filter(time => now - time < window);

    if (validLimits.length >= limit) {
      throw new Error('Rate limit exceeded');
    }

    validLimits.push(now);
    this.rateLimitMap.set(userId, validLimits);
    return true;
  }

  async getItemImage(itemCode, userId) {
    try {
      this.checkRateLimit(userId);

      // Vérifier le cache
      const cached = this.cache.get(`img_${itemCode}`);
      if (cached) return cached;

      const response = await axios.get(
        `https://customerapi.nieuwkoop-europe.com/items/${itemCode}/image`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(
              `${process.env.NIEUWKOOP_USER}:${process.env.NIEUWKOOP_PASS}`
            ).toString('base64')}`,
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      const imageData = response.data;

      // Valider la réponse
      if (!imageData.Image || typeof imageData.Image !== 'string') {
        throw new Error('Invalid image response');
      }

      // Mettre en cache
      this.cache.set(`img_${itemCode}`, imageData);

      logger.log(`✅ Image Nieuwkoop récupérée pour ${itemCode}`);
      return imageData;

    } catch (error) {
      logger.error(`❌ Erreur proxy Nieuwkoop: ${error.message}`);
      throw error;
    }
  }

  async getItemDetails(itemCode, userId) {
    this.checkRateLimit(userId);

    const cached = this.cache.get(`details_${itemCode}`);
    if (cached) return cached;

    const response = await axios.get(
      'https://customerapi.nieuwkoop-europe.com/items',
      {
        params: {
          itemCode,
          sysmodified: '2020-01-01T00:00:00Z'
        },
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.NIEUWKOOP_USER}:${process.env.NIEUWKOOP_PASS}`
          ).toString('base64')}`
        }
      }
    );

    const itemData = response.data[0];
    if (itemData) {
      this.cache.set(`details_${itemCode}`, itemData);
    }

    return itemData;
  }
}

module.exports = new NieuwkoopProxy();
