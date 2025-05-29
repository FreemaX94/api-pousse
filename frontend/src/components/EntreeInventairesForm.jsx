import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StockViewerDrawer from './StockViewerDrawer';
import axios from 'axios';

const categories = ['Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés'];

function StockFormBloc({ categorie, produits = [], concepteurs = [] }) {
  const [data, setData] = useState({
    produit: '',
    concepteur: '',
    dateSortie: '',
    quantiteSortie: '',
    dateRetour: '',
    quantiteRetour: '',
    commentaire: ''
  });
  const [message, setMessage] = useState(null);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setMessage(null);
    console.log('🛰️ POST /stocks payload:', { categorie, ...data });
    try {
      const res = await axios.post('/stocks', { categorie, ...data });
      console.log('🎉 Response:', res.data);
      setMessage('✅ Enregistré avec succès');
      setData({
        produit: '',
        concepteur: '',
        dateSortie: '',
        quantiteSortie: '',
        dateRetour: '',
        quantiteRetour: '',
        commentaire: ''
      });
    } catch (err) {
      console.error('❌ Erreur lors de l’envoi :', err);
      setMessage('❌ Erreur lors de l’envoi');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4 text-gray-800">
      <h3 className="text-center text-lg font-bold">{categorie}</h3>

      <div>
        <label className="block text-sm mb-1">Nom du produit</label>
        <select
          className="w-full bg-gray-50 p-2 rounded-md text-gray-800 border border-gray-200"
          value={data.produit}
          onChange={e => handleChange('produit', e.target.value)}
        >
          <option value="">-- Sélectionner un produit --</option>
          {produits.map(p => (
            <option key={p._id || p.id} value={p._id || p.id}>
              {p.nom || p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Concepteur</label>
        <select
          className="w-full bg-gray-50 p-2 rounded-md text-gray-800 border border-gray-200"
          value={data.concepteur}
          onChange={e => handleChange('concepteur', e.target.value)}
        >
          <option value="">-- Sélectionner --</option>
          {concepteurs.map(c => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.nom || c.name}
            </option>
          ))}
        </select>
      </div>

      {[
        ['Date de sortie', 'dateSortie', 'date'],
        ['Quantité sortie', 'quantiteSortie', 'number'],
        ['Date de retour', 'dateRetour', 'date'],
        ['Quantité retour', 'quantiteRetour', 'number']
      ].map(([label, field, type]) => (
        <div key={field}>
          <label className="block text-sm mb-1">{label}</label>
          <input
            type={type}
            className="w-full bg-gray-50 p-2 rounded-md text-gray-800 border border-gray-200"
            value={data[field]}
            onChange={e => handleChange(field, e.target.value)}
          />
        </div>
      ))}

      <div>
        <label className="block text-sm mb-1">Commentaire</label>
        <textarea
          className="w-full bg-gray-50 p-2 rounded-md text-gray-800 border border-gray-200"
          rows={2}
          value={data.commentaire}
          onChange={e => handleChange('commentaire', e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
      >
        Valider
      </button>

      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </div>
  );
}

export default function EntreeInventairesForm() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [concepteurs, setConcepteurs] = useState([]);
  const [produitsMap, setProduitsMap] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const concRes = await axios.get('/concepteurs');
        const cs = Array.isArray(concRes.data)
          ? concRes.data
          : Array.isArray(concRes.data.data)
          ? concRes.data.data
          : [];
        setConcepteurs(cs);

        const results = await Promise.all(
          categories.map(cat =>
            axios
              .get(`/catalogue/${encodeURIComponent(cat)}`)
              .then(res => ({
                cat,
                produits: Array.isArray(res.data)
                  ? res.data
                  : Array.isArray(res.data.data)
                  ? res.data.data
                  : []
              }))
          )
        );
        const map = {};
        results.forEach(({ cat, produits }) => {
          map[cat] = produits;
        });
        setProduitsMap(map);
      } catch (err) {
        console.error('Erreur chargement global :', err);
      }
    };
    fetchAll();
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex justify-end max-w-7xl mx-auto px-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-gray-100 text-gray-800 shadow px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
        >
          📋 Voir les enregistrements
        </button>
      </div>

      <h2 className="text-center text-3xl font-bold text-green-800">
        ✎ Gestion des Stocks
      </h2>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {categories.map(cat => (
          <StockFormBloc
            key={cat}
            categorie={cat}
            produits={produitsMap[cat] || []}
            concepteurs={concepteurs}
          />
        ))}
      </div>

      <StockViewerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </motion.div>
  );
}
