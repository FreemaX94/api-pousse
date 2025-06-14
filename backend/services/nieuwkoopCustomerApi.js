// backend/services/nieuwkoopCustomerApi.js

const axios = require('axios');

// Client Axios pour le Customer API avec Basic Auth
const customerClient = axios.create({
  baseURL: process.env.NIEUWKOOP_CUSTOMER_BASE_URL,
  timeout: 5000,
  auth: {
    username: process.env.NIEUWKOOP_BASIC_USER,
    password: process.env.NIEUWKOOP_BASIC_PASS,
  },
});

/**
 * Récupère l'image d'un produit depuis le Customer API en Basic Auth.
 * @param {string} productId
 * @returns {Promise<Buffer>}
 */
async function fetchItemImageBasic(productId) {
  const response = await customerClient.get(`/items/${productId}/image`, {
    responseType: 'arraybuffer',
  });
  return response.data;
}

module.exports = { fetchItemImageBasic };

