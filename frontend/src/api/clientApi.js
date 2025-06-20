// frontend/src/api/clientApi.js

import axios from 'axios';
import { log } from '../utils/logger';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
log('✅ API utilisée :', baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
export { api };

// ✅ Fonctions pour les mouvements de stock
export const getMovements = async () => {
  const res = await api.get("/movements");
  return res.data;
};

export const createMovement = async (data) => {
  const res = await api.post("/movements", data);
  return res.data;
};

export const validateMovement = async (id) => {
  await api.put(`/movements/${id}/validate`);
};

export const markReturned = async (id) => {
  await api.put(`/movements/${id}/return`);
};

// ✅ Fonctions pour les articles partenaires
export const createPartnerItem = async (data) => {
  const res = await api.post("/partneritems", data);
  return res.data;
};

export const getPartnerItems = async () => {
  const res = await api.get("/partneritems");
  return res.data;
};
