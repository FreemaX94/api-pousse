// src/api/produits.js
import API_BASE_URL from './config';
import axios from 'axios';

export const getProduits = async () => {
  const res = await axios.get(`${API_BASE_URL}/produits`);
  return res.data;
};
