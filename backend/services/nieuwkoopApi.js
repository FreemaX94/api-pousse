// backend/services/nieuwkoopApi.js

const axios = require('axios');
const { getToken } = require('./nieuwkoopAuth');
const { fetchItemImageBasic } = require('./nieuwkoopCustomerApi');

// Client principal pour l’API OAuth2
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

// Client pour l’API Customer (authentification Basic)
const customerClient = axios.create({
  baseURL: process.env.NIEUWKOOP_CUSTOMER_BASE_URL,
  timeout: 5000,
  auth: {
    username: process.env.NIEUWKOOP_BASIC_USER,
    password: process.env.NIEUWKOOP_BASIC_PASS,
  },
});

/**
 * Récupère les infos détaillées d'un produit Nieuwkoop
 */
async function fetchItem(productId) {
  const res = await customerClient.get(`/items`, {
    params: {
      itemCode: productId,
      sysmodified: '2020-01-01T00:00:00Z'
    }
  });
  return res.data[0];
}

/**
 * Récupère le prix d’un produit Nieuwkoop
 */
async function fetchItemPrice(productId) {
  const res = await customerClient.get(`/prices`, {
    params: {
      itemCode: productId,
      sysmodified: '2020-01-01T00:00:00Z'
    }
  });
  return res.data[0];
}

module.exports = {
  fetchItems: () => authorizedRequest({ method: 'GET', url: '/items' }),
  fetchItem,
  fetchItemPrice,
  fetchItemImage: fetchItemImageBasic,
  fetchCatalog: () => authorizedRequest({ method: 'GET', url: '/catalog' }),
  fetchCatalogById: (catalogId) => authorizedRequest({ method: 'GET', url: `/catalog/${catalogId}` }),
  fetchStock: () => authorizedRequest({ method: 'GET', url: '/stock' }),
  fetchStockById: (productId) => authorizedRequest({ method: 'GET', url: `/stock/${productId}` }),
  fetchHealth: () => authorizedRequest({ method: 'GET', url: '/health' }),
};
