// frontend/src/api/clientApi.js

import axios from 'axios';
import { log } from '../../../utils/logger';

// Base URL de l’API (défini dans .env ou localhost par défaut)
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
log('✅ API utilisée :', baseURL);

// Création de l'instance Axios
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  // Vérifier différents formats de stockage du token
  const token = localStorage.getItem('token') || 
                localStorage.getItem('auth') ||
                localStorage.getItem('authToken');
  
  if (token) {
    // Si le token est stocké en JSON, on l'extrait
    try {
      const parsed = JSON.parse(token);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Si ce n'est pas du JSON, on l'utilise directement
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Export de l’instance pour usages génériques si besoin
export default api;
export { api };

// ─── Mouvements (Entrées/Sorties) ────────────────────────────────────────────
export const getMovements = async () => {
  const res = await api.get('/movements');
  return res.data;
};

export const createMovement = async (data) => {
  const res = await api.post('/movements', data);
  return res.data;
};

export const validateMovement = async (id) => {
  await api.put(`/movements/${id}/validate`);
};

export const markReturned = async (id) => {
  await api.put(`/movements/${id}/return`);
};

// ─── Stock (Entrées) ────────────────────────────────────────────────────────────
/**
 * Récupère les articles du stock pour la barre de recherche.
 * @param {string} search – chaîne de recherche optionnelle (≥2 caractères).
 * @returns {Promise<Array>} liste des articles de stock.
 */
export const getStockItems = async (search = '') => {
  // 1) Appel de l'endpoint backend existant
  const res = await api.get('/nieuwkoop/stock', {
    params: search.length >= 2 ? { search } : {}
  });
  let items = Array.isArray(res.data) ? res.data : [];

  // 2) Fallback : filtrage côté client si le backend ne gère pas ?search=
  if (search.length >= 2) {
    const q = search.toLowerCase();
    items = items.filter(
      i =>
        (i.reference && i.reference.toLowerCase().includes(q)) ||
        (i.name      && i.name.toLowerCase().includes(q))
    );
  }

  return items;
};

// ─── Articles partenaires ───────────────────────────────────────────────────
export const getPartnerItems = async () => {
  const res = await api.get('/partneritems');
  return res.data;
};

export const createPartnerItem = async (data) => {
  const res = await api.post('/partneritems', data);
  return res.data;
};

// ─── Projets ─────────────────────────────────────────────────────────────────
/**
 * Récupère la liste des projets existants, en normalisant la réponse selon le format
 * renvoyé par le backend.
 */
export const getProjects = async () => {
  // Adapter le chemin si ton backend est en anglais : '/projects'
  const res = await api.get('/projets');
  const data = res.data;

  if (Array.isArray(data)) {
    return data;
  }
  if (data.projets && Array.isArray(data.projets)) {
    return data.projets;
  }
  if (data.projects && Array.isArray(data.projects)) {
    return data.projects;
  }
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }
  // Retourne un tableau vide si on ne reconnaît pas la structure
  return [];
};

export const createProject = async (data) => {
  const isFormData = data instanceof FormData;
  const res = await api.post('/projets', data, {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : undefined
  });
  return res.data;
};

export const updateProject = async (id, data) => {
  const isFormData = data instanceof FormData;
  const res = await api.put(`/projets/${id}`, data, {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : undefined
  });
  return res.data;
};

export const deleteProject = async (id) => {
  await api.delete(`/projets/${id}`);
};

// ─── Assignation d’un article du stock à un projet ──────────────────────────
export const assignItemToProject = async ({
  itemId,
  projectId,
  quantity,
  note,
  reference,
  name,
  createdBy,
  image
}) => {
  const res = await api.post('/movements', {
    type: 'sortie',
    reference,
    name,
    image,
    quantity,
    eventDate: new Date().toISOString(),
    project: projectId,
    note,
    createdBy
  });
  return res.data;
};
