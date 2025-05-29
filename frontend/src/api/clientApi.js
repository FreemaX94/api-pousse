// frontend/src/api/api.js

import axios from 'axios';

// Récupère la base URL de l'API depuis les variables d'environnement
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.warn(
    "⚠️ VITE_API_BASE_URL n'est pas définie. " +
    "Ajoutez VITE_API_BASE_URL=http://localhost:3000/api dans votre .env"
  );
}

const api = axios.create({
  baseURL,
  withCredentials: true, // transmet les cookies HttpOnly (JWT)
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
export { api };
