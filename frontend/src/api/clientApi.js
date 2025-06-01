// frontend/src/api/clientApi.js

import axios from 'axios';

// Récupère l'URL depuis le .env ou fallback
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://144.126.228.24:3001/api';

console.log("✅ API utilisée :", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true, // transmet les cookies HttpOnly (JWT)
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
export { api };
