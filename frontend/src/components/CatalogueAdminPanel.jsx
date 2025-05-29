import React, { useEffect, useState } from 'react'

const CatalogueAdminPanel = () => {
  const [catalogue, setCatalogue] = useState([])
  const [filtered, setFiltered] = useState([])
  const [categorie, setCategorie] = useState('')
  const [search, setSearch] = useState('')

  const fetchCatalogue = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/catalogue/all`)
      const data = await res.json()
      setCatalogue(data)
      setFiltered(data)
    } catch (err) {
      console.error('Erreur chargement catalogue :', err)
    }
  }

  useEffect(() => {
    fetchCatalogue()
  }, [])

  useEffect(() => {
    let result = [...catalogue]
    if (categorie) {
      result = result.filter((item) => item.categorie === categorie)
    }
    if (search) {
      result = result.filter((item) => item.nom.toLowerCase().includes(search.toLowerCase()))
    }
    setFiltered(result)
  }, [categorie, search, catalogue])

  const categories = [...new Set(catalogue.map((item) => item.categorie))]

  return (
    <div 
      id="admin-catalogue"
      className="mt-16 bg-green-950 rounded-xl shadow-inner p-6 text-white"
    >
      <h2 className="text-2xl font-bold mb-4 text-yellow-100">🔐 Admin Catalogue</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="border px-3 py-2 rounded-md text-black"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md flex-1 text-black"
        />
      </div>

      <div className="mb-4 text-sm text-green-200">
        <p><strong>Total produits :</strong> {filtered.length}</p>
        <p><strong>Catégories :</strong> {categories.length}</p>
      </div>

      <div className="grid gap-4">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item._id}
              className="bg-green-800 rounded-lg p-4 shadow-md space-y-2 border border-green-700"
            >
              <h4 className="text-lg font-bold text-yellow-100">🌿 {item.nom}</h4>
              <p><span className="font-semibold">📁 Catégorie :</span> {item.categorie}</p>
              <p><span className="font-semibold">📦 Quantité :</span> {item.infos?.['Quantité totale'] ?? '—'}</p>
              <p><span className="font-semibold">📊 Stock réel :</span> {item.infos?.['Stock réel'] ?? '—'}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-300">Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  )
}

export default CatalogueAdminPanel
