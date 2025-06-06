const axios = require('axios');
const createError = require('http-errors');

const AUTH_URL = process.env.NIEUWKOOP_TOKEN_URL || process.env.NIEUWKOOP_AUTH_URL;
const CLIENT_ID = process.env.NIEUWKOOP_CLIENT_ID;
const CLIENT_SECRET = process.env.NIEUWKOOP_CLIENT_SECRET;

let tokenCache = { token: null, expiresAt: 0 };

exports.getToken = async function getToken() {
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }
  try {
    const res = await axios.post(
      AUTH_URL,
      'grant_type=client_credentials',
      {
        auth: { username: CLIENT_ID, password: CLIENT_SECRET },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    const { access_token, expires_in } = res.data;
    tokenCache = {
      token: access_token,
      expiresAt: Date.now() + (expires_in - 60) * 1000
    };
    return access_token;
  } catch (err) {
    throw createError(502, 'Failed to authenticate with Nieuwkoop');
  }
};
