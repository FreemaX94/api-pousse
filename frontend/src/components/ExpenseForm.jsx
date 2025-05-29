import React, { useState } from 'react'

export default function ExpenseForm({ onSuccess }) {
  const [employee, setEmployee] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const baseUrl = import.meta.env.VITE_API_URL || window.location.origin

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      employee,
      amount: parseFloat(amount),
      date,
      description
    }

    console.log("📦 Payload envoyé :", payload)

    try {
      const res = await fetch(`${baseUrl}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log("🧾 Réponse brute :", res)

      if (res.status === 405) throw new Error('Méthode non autorisée (405)')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || `Erreur ${res.status}`)
      }

      const newNote = await res.json()
      onSuccess(newNote)
      setEmployee('')
      setAmount('')
      setDate('')
      setDescription('')
    } catch (err) {
      console.error("❌ Erreur fetch :", err)
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
        <label className="block text-sm font-semibold text-gray-700">Montant (€)</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          placeholder="0.00"
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label className="block text-sm font-semibold text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="Motif avancé par le salarié"
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
        {loading ? 'Envoi...' : 'Ajouter une note de frais'}
      </button>
    </form>
  )
}
