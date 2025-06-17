const axios = require('axios');

// Client Axios configuré pour l'API Customer de Nieuwkoop avec Basic Auth
const customerClient = axios.create({
  baseURL: process.env.NIEUWKOOP_CUSTOMER_BASE_URL,
  timeout: 5000,
  auth: {
    username: process.env.NIEUWKOOP_BASIC_USER,
    password: process.env.NIEUWKOOP_BASIC_PASS,
  },
});

/**
 * Récupère et décode l'image d'un produit Nieuwkoop
 * @param {string} productId - ex: 4HOFOBX12
 * @returns {Promise<Buffer>} - buffer d’image décodable
 */
async function fetchItemImageBasic(productId) {
  console.log("🔍 Appel image Nieuwkoop pour:", productId);

  try {
    const response = await customerClient.get(`/items/${productId}/image`, {
      headers: {
        Accept: 'application/json'
      }
    });

    const base64String = response.data.Image;

    if (!base64String || typeof base64String !== 'string') {
      throw new Error("Image base64 manquante ou invalide");
    }

    const buffer = Buffer.from(base64String, 'base64');
    return buffer;
  } catch (err) {
    console.error("❌ Erreur récupération image Nieuwkoop:", err.message);
    throw err;
  }
}

module.exports = { fetchItemImageBasic };
