// src/api/produits.js
import api from './clientApi';

export const getProduits = async () => {
  const res = await api.get('/produits');
  return res.data;
};
