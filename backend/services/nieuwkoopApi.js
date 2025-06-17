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

// Client Customer API pour détails produit + prix
const customerClient = axios.create({
  baseURL: process.env.NIEUWKOOP_CUSTOMER_BASE_URL,
  timeout: 5000,
  auth: {
    username: process.env.NIEUWKOOP_BASIC_USER,
    password: process.env.NIEUWKOOP_BASIC_PASS,
  },
});

async function fetchItem(productId) {
  const res = await customerClient.get(`/items?itemCode=${productId}`);
  return res.data[0]; // premier élément
}

async function fetchItemPrice(productId) {
  const res = await customerClient.get(`/prices?itemCode=${productId}`);
  return res.data[0];
}

module.exports = {
  fetchItems: () => authorizedRequest({ method: 'GET', url: '/items' }),
  fetchItem, // Customer API
  fetchItemPrice, // Customer API
  fetchItemImage: fetchItemImageBasic,
  fetchCatalog: () => authorizedRequest({ method: 'GET', url: '/catalog' }),
  fetchCatalogById: (catalogId) => authorizedRequest({ method: 'GET', url: `/catalog/${catalogId}` }),
  fetchStock: () => authorizedRequest({ method: 'GET', url: '/stock' }),
  fetchStockById: (productId) => authorizedRequest({ method: 'GET', url: `/stock/${productId}` }),
  fetchHealth: () => authorizedRequest({ method: 'GET', url: '/health' }),
};
