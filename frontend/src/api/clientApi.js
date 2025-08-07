// frontend/src/api/clientApi.js

import axios from 'axios';
import { log } from '../utils/logger';

// Base URL de l’API (défini dans .env ou localhost par défaut)
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
log('✅ API utilisée :', baseURL);

// Création de l’instance Axios
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
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

export const deleteMovement = async (id) => {
  await api.delete(`/movements/${id}`);
};

// ─── Stock (Entrées) ────────────────────────────────────────────────────────────
/**
 * Récupère les articles du stock pour la barre de recherche.
 * Combine les plantes déjà en stock ET les nouvelles plantes du catalogue Nieuwkoop.
 * @param {string} search – chaîne de recherche optionnelle (≥2 caractères).
 * @returns {Promise<Array>} liste des articles de stock et catalogue.
 */
export const getStockItems = async (search = '') => {
  try {
    // Récupérer uniquement les plantes déjà en stock (avec quantités disponibles)
    const stockRes = await api.get('/nieuwkoop/stock', {
      params: search.length >= 2 ? { search } : {}
    });
    let stockItems = Array.isArray(stockRes.data) ? stockRes.data : [];

    // Marquer les plantes du stock comme "déjà rentrées"
    stockItems = stockItems.map(item => ({
      ...item,
      isNewPlant: false
    }));

    // Filtrage côté client si nécessaire
    if (search.length >= 2) {
      const q = search.toLowerCase();
      return stockItems.filter(
        i =>
          (i.reference && i.reference.toLowerCase().includes(q)) ||
          (i.name && i.name.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q))
      );
    }

    return stockItems;
  } catch (error) {
    console.error('Erreur lors de la récupération des items:', error);
    return [];
  }
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

// ─── Concepteurs ─────────────────────────────────────────────────────────────
/**
 * Récupère la liste des concepteurs actifs
 */
export const getConcepteurs = async () => {
  const res = await api.get('/concepteurs');
  return Array.isArray(res.data) ? res.data : [];
};

export const createProject = async (data) => {
  const isFormData = data instanceof FormData;
  console.log('🚀 API createProject called with:', isFormData ? 'FormData' : 'JSON');
  
  if (isFormData) {
    // Debug FormData contents
    console.log('📦 FormData entries:');
    for (let [key, value] of data.entries()) {
      console.log(`  ${key}:`, value);
    }
  } else {
    console.log('📦 JSON data being sent:', JSON.stringify(data, null, 2));
    if (data.materials) {
      console.log('🌱 Materials count:', data.materials.length);
      console.log('🌱 Materials details:', data.materials);
    }
  }
  
  // Pour s'assurer que les données sont bien envoyées en JSON
  const requestConfig = {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' }
  };
  
  console.log('📡 Sending request to /projets with config:', requestConfig);
  const res = await api.post('/projets', data, requestConfig);
  console.log('✅ Project created response:', res.data);
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
