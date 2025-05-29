import React, { useState, useEffect } from 'react';
import axios from 'axios';

const categories = ['Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés'];

export default function StockViewer() {
  const [selected, setSelected] = useState("Plantes");
  const [search, setSearch] = useState('');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isAdmin = true;

  const fetchStocks = async (categorie) => {
    if (!categorie) return;
    setLoading(true);
    try {
      const res = await axios.get(`/stocks?categorie=${categorie}`);
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setStocks(data);
    } catch (err) {
      console.error('Erreur chargement stocks :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks(selected);
  }, [selected, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((v) => v + 1);

  const handleDelete = async (id) => {
    if (!window.confirm('🗑️ Supprimer cette fiche ?')) return;
    try {
      await axios.delete(`/stocks/${encodeURIComponent(id)}`);
      alert('✅ Supprimé avec succès');
      handleRefresh();
    } catch (err) {
      console.error('Erreur suppression :', err);
      alert('❌ Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-full font-semibold text-sm border transition $\{
              selected === cat
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-green-600 border-green-600 hover:bg-green-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-green-800">📋 {selected}</h3>
            
            <div className="flex gap-2">
              <button
                onClick={() => window.open('/stocks/export?format=csv', '_blank')}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                📄 Export CSV
              </button>
              <button
                onClick={() => window.open('/stocks/export?format=pdf', '_blank')}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                🖨️ Export PDF
              </button>

              <button
                onClick={handleRefresh}
                className="text-sm px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-md transition"
              >
                🔄 Actualiser
              </button>
              <button
                onClick={() => window.print()}
                className="text-sm px-3 py-1 bg-gray-50 text-gray-800 border border-gray-200 rounded-md transition"
              >
                🖨️ Imprimer
              </button>
            </div>
          </div>

          
      <input
        type="text"
        placeholder="🔍 Rechercher un produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full md:w-1/3 mb-4"
      />

{loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : stocks.length === 0 ? (
            <p className="text-gray-400">
              Aucune donnée enregistrée pour cette catégorie.
            </p>
          ) : (
            <div className="grid gap-4">
              {stocks.map((entry) => (
                <div
                  key={entry._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-2 relative"
                >
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-700 text-lg"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  )}
                  <h4 className="text-lg font-bold text-green-800">
                    🌿 {entry.product?.nom ?? '[Sans nom]'}
                  </h4>
                  <p className="text-sm text-gray-600 italic">
                    Catégorie : {entry.categorie}
                  </p>
                  {entry.product?.infos && (
                    <>
                      <p><span className="font-semibold">📦 Quantité :</span> {entry.product.infos['Quantité totale'] ?? '—'}</p>
                      <p><span className="font-semibold">📏 Dimensions :</span> {entry.product.infos['Dimensions'] ?? '—'}</p>
                      <p><span className="font-semibold">💶 Coût :</span> {entry.product.infos["Coût d'achat H.T."] ?? '—'}</p>
                      <p><span className="font-semibold">📊 Stock réel :</span> {entry.product.infos['Stock réel'] ?? '—'}</p>
                      <p><span className="font-semibold">📍 Disponibilité :</span> {entry.product.infos.DISPONIBILITÉ ?? '—'}</p>
                      <p><span className="font-semibold">🎨 Couleur :</span> {entry.product.infos.Couleur ?? '—'}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}