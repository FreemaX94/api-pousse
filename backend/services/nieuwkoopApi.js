const axios = require('axios');
const createError = require('http-errors');
const { getToken } = require('./nieuwkoopAuth');

const API_URL = process.env.NIEUWKOOP_BASE_URL;
const MAX_RETRIES = 3;

const client = axios.create({
  baseURL: API_URL,
  timeout: 5000
});

client.interceptors.response.use(
  response => response,
  async error => {
    const { config, response } = error;
    const shouldRetry =
      !config.__isRetryRequest && (!response || response.status >= 500);
    if (shouldRetry && config.__retryCount < MAX_RETRIES) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      return client(config);
    }
    return Promise.reject(
      createError(response?.status || 500, error.message)
    );
  }
);

async function authorizedRequest(options) {
  const token = await getToken();
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  return client({ ...options, headers });
}

exports.fetchCatalog = async function () {
  try {
    const res = await authorizedRequest({ method: 'get', url: '/catalog' });
    return res.data;
  } catch (err) {
    throw err;
  }
};

exports.fetchStock = async function (productId) {
  try {
    const res = await authorizedRequest({
      method: 'get',
      url: `/stock/${productId}`
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
