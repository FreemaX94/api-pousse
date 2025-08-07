import React, { useEffect, useState } from 'react';
import api from '../api/clientApi';

const CatalogueAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nom: '', categorie: '', infos: '{}' });
  const [editingId, setEditingId] = useState(null);

  const fetchCatalogue = async () => {
    const res = await api.get('/catalogueitems');
    setItems(res.data);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingId) {
      await api.put('/catalogueitems/' + editingId, {
        ...form,
        infos: JSON.parse(form.infos),
      });
    } else {
      await api.post('/catalogueitems', {
        ...form,
        infos: JSON.parse(form.infos),
      });
    }
    setForm({ nom: '', categorie: '', infos: '{}' });
    setEditingId(null);
    fetchCatalogue();
  };

  const handleEdit = item => {
    setEditingId(item._id);
    setForm({
      nom: item.nom,
      categorie: item.categorie,
      infos: JSON.stringify(item.infos, null, 2),
    });
  };

  const handleDelete = async id => {
    if (window.confirm('Supprimer cet item ?')) {
      await api.delete('/catalogueitems/' + id);
      fetchCatalogue();
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Catalogue Admin</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          className="p-2 border rounded"
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
        />
        <input
          className="p-2 border rounded"
          name="categorie"
          placeholder="Catégorie"
          value={form.categorie}
          onChange={handleChange}
        />
        <textarea
          className="p-2 border rounded col-span-1 md:col-span-3"
          name="infos"
          placeholder="Infos JSON"
          rows="4"
          value={form.infos}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {editingId ? 'Modifier' : 'Ajouter'}
      </button>

      <table className="w-full mt-8 table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Catégorie</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id} className="border-t">
              <td className="p-2 border">{item.nom}</td>
              <td className="p-2 border">{item.categorie}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                >
                  Éditer
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CatalogueAdmin;
