const axios = require('axios');
const createError = require('http-errors');

const API_URL = process.env.NIEUWKOOP_BASE_URL;
const API_KEY = process.env.NIEUWKOOP_API_KEY;
const MAX_RETRIES = 3;

const client = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});

client.interceptors.response.use(null, async error => {
  const { config, response } = error;
  const shouldRetry = !config.__isRetryRequest && (!response || response.status >= 500);
  if (shouldRetry && config.__retryCount < MAX_RETRIES) {
    config.__retryCount = (config.__retryCount || 0) + 1;
    return client(config);
  }
  return Promise.reject(createError(response?.status || 500, error.message));
});

exports.fetchCatalog() {
  try {
    const res = await client.get('/catalog');
    return res.data;
  } catch (err) {
    throw err;
  }
}

exports.fetchStock(productId) {
  try {
    const res = await client.get(`/stock/${productId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}