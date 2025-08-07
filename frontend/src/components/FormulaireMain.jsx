import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const categories = ['Plantes', 'Contenants', 'Éléments de décor'];
const fieldOrder = ['Nom du produit', 'Concepteur', 'Date de sortie', 'Quantité', 'Date de retour', 'Quantité retour', 'Commentaire'];

export default function FormulaireMain() {
  const [fields, setFields] = useState({});
  const [values, setValues] = useState({});

  useEffect(() => {
    categories.forEach(cat => {
      setFields(prev => ({ ...prev, [cat]: fieldOrder }));
      setValues(prev => ({ ...prev, [cat]: {} }));
    });
  }, []);

  const handleChange = (cat, field, v) => {
    setValues(prev => ({
      ...prev,
      [cat]: { ...(prev[cat] || {}), [field]: v }
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h3 className="text-center text-3xl font-bold text-yellow-100 mb-6" style={{ fontFamily: 'Kepler Std, serif' }}>
        Gestion des Stocks
      </h3>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat} className="bg-green-800 p-6 rounded-xl shadow-lg">
              <h4 className="text-center text-xl font-semibold bg-yellow-100 text-green-900 py-2 rounded mb-4" style={{ fontFamily: 'Kepler Std, serif' }}>
                {cat.toUpperCase()}
              </h4>
              {fieldOrder.map(f => (
                <div key={f} className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-yellow-100">{f}</label>
                  {(f === 'Nom du produit' || f === 'Concepteur') ? (
                    <select
                      value={(values[cat] && values[cat][f]) || ''}
                      onChange={e => handleChange(cat, f, e.target.value)}
                      className="w-full bg-yellow-100 text-green-900 p-2 rounded-lg"
                    >
                      <option value="">Sélectionner</option>
                      {/* options dynamiques */}
                    </select>
                  ) : f.toLowerCase().includes('date') ? (
                    <input
                      type="date"
                      value={(values[cat] && values[cat][f]) || ''}
                      onChange={e => handleChange(cat, f, e.target.value)}
                      className="w-full bg-yellow-100 text-green-900 p-2 rounded-lg"
                    />
                  ) : f.toLowerCase().includes('commentaire') ? (
                    <textarea
                      rows={3}
                      value={(values[cat] && values[cat][f]) || ''}
                      onChange={e => handleChange(cat, f, e.target.value)}
                      className="w-full bg-yellow-100 text-green-900 p-2 rounded-lg"
                    />
                  ) : (
                    <input
                      type="number"
                      value={(values[cat] && values[cat][f]) || ''}
                      onChange={e => handleChange(cat, f, e.target.value)}
                      placeholder="0"
                      className="w-full bg-yellow-100 text-green-900 p-2 rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
