// backend/services/nieuwkoopApi.js

const axios = require('axios');
const { getToken } = require('./nieuwkoopAuth');
const { fetchItemImageBasic } = require('./nieuwkoopCustomerApi');

// Client OAuth2 pour l'API principale
const apiClient = axios.create({
  baseURL: process.env.NIEUWKOOP_BASE_URL,
  timeout: 5000,
});

async function authorizedRequest(options) {
  const token = await getToken();
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const response = await apiClient(options);
  return response.data;
}

module.exports = {
  // Items endpoints OAuth2
  fetchItems: () => authorizedRequest({ method: 'GET', url: '/items' }),
  fetchItem: (productId) => authorizedRequest({ method: 'GET', url: `/items/${productId}` }),

  // Fetch image via Customer API Basic Auth
  fetchItemImage: fetchItemImageBasic,

  // Catalog endpoints OAuth2
  fetchCatalog: () => authorizedRequest({ method: 'GET', url: '/catalog' }),
  fetchCatalogById: (catalogId) =>
    authorizedRequest({ method: 'GET', url: `/catalog/${catalogId}` }),

  // Stock endpoints OAuth2
  fetchStock: () => authorizedRequest({ method: 'GET', url: '/stock' }),
  fetchStockById: (productId) =>
    authorizedRequest({ method: 'GET', url: `/stock/${productId}` }),

  // Health endpoint OAuth2
  fetchHealth: () => authorizedRequest({ method: 'GET', url: '/health' }),
};
