// frontend/src/components/InvoiceForm.jsx

import React, { useState } from 'react'

export default function InvoiceForm({ onSuccess }) {
  const [employee, setEmployee] = useState('')
  const [pole, setPole] = useState('Entretien')
  const [detail, setDetail] = useState('')
  const [date, setDate] = useState('')
  const [clientName, setClientName] = useState('')
  const [total, setTotal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const rawBase = import.meta.env.VITE_API_URL || window.location.origin
  const baseUrl = rawBase.replace(/\/$/, '')

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      employee,
      pole,
      detail,
      date,
      clientName,
      total: parseFloat(total)
    }

    console.log("📦 Payload envoyé :", payload) // Debug ici

    try {
      const res = await fetch(`${baseUrl}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 405) throw new Error('Méthode non autorisée (405)')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || `Erreur ${res.status}`)
      }

      const newInv = await res.json()
      onSuccess(newInv)
      setEmployee('')
      setPole('Entretien')
      setDetail('')
      setDate('')
      setClientName('')
      setTotal('')
    } catch (err) {
      console.error("❌ Erreur Invoice POST :", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-semibold text-gray-700">Salarié</label>
        <input
          type="text"
          value={employee}
          onChange={e => setEmployee(e.target.value)}
          required
          placeholder="Nom du salarié"
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Pôle</label>
        <select
          value={pole}
          onChange={e => setPole(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Entretien">Entretien</option>
          <option value="Création">Création</option>
          <option value="Evenements">Evenements</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Détails</label>
        <textarea
          value={detail}
          onChange={e => setDetail(e.target.value)}
          required
          placeholder="Description de la facture"
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Client</label>
        <input
          type="text"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          required
          placeholder="Nom du client"
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Montant (€)</label>
        <input
          type="number"
          step="0.01"
          value={total}
          onChange={e => setTotal(e.target.value)}
          required
          placeholder="0.00"
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white rounded-lg shadow-md transition ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Envoi…' : 'Créer la facture'}
      </button>
    </form>
  )
}
