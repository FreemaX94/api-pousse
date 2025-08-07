import React, { useState } from 'react'
import api, { handleApiError } from '../../../api/axios'

export default function EntreeInventaires() {
  const [formData, setFormData] = useState({
    onglet: 'Plantes',
    quantite: '',
    date: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await api.post('/entree-inventaire', formData)
      alert('✅ Inventaire enregistré')
      setFormData({ onglet: 'Plantes', quantite: '', date: '' })
    } catch (err) {
      console.error(err)
      const errorInfo = handleApiError(err)
      setError(errorInfo.message)
      alert('❌ Erreur: ' + errorInfo.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 text-gray-800">
      <h2 className="text-2xl font-bold text-green-800 text-center">
        📄 Entrée Inventaire
      </h2>

      {loading && <p className="text-blue-600 text-center">Enregistrement en cours...</p>}
      {error && <p className="text-red-600 text-center">Erreur : {error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Onglet
          </label>
          <select
            className="w-full bg-gray-50 p-2 rounded-md text-gray-800 border border-gray-200"
            value={formData.onglet}
            onChange={(e) => handleChange('onglet', e.target.value)}
          >
            <option>Plantes</option>
            <option>Contenants</option>
            <option>Décor</option>
            <option>Artificiels</option>
            <option>Séchés</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantité
          </label>
          <input
            type="number"
            className="w-full bg-gray-50 p-2 rounded-md text-gray-800 border border-gray-200"
            value={formData.quantite}
            onChange={(e) => handleChange('quantite', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            className="w-full bg-gray-50 p-2 rounded-md text-gray-800 border border-gray-200"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
      >
        Valider et continuer
      </button>
    </div>
  )
}
