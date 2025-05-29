import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddContract() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    client: '',
    titre: '',
    duree: '',          // format "HH:MM"
    budget: '',         // en €, ex: "1200.50"
    dateDebut: '',      // "YYYY-MM-DD"
    dateFin: '',        // "YYYY-MM-DD"
    ferme: false,       // true = Oui, false = Non
    rapportPerso: '',   // id ou nom du modèle de rapport
    commentaire: '',
    typeClient: 'B2B',        // B2B ou B2C
    typeContrat: 'Entretien', // Entretien ou Abonnement
  })
  const [error, setError] = useState(null)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked
               : type === 'radio'   ? (value === 'true')
               : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/contrats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(await res.text())
      navigate('/entretien')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow">
      <h2 className="text-2xl font-heading text-center mb-6">Ajouter un contrat</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client */}
        <div>
          <label className="block mb-1 font-medium">Client *</label>
          <input
            type="text"
            name="client"
            value={form.client}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Titre */}
        <div>
          <label className="block mb-1 font-medium">Titre</label>
          <input
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Durée & Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Durée (HH:MM)</label>
            <input
              type="time"
              name="duree"
              value={form.duree}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Budget (€)</label>
            <input
              type="number"
              name="budget"
              step="0.01"
              value={form.budget}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={form.dateDebut}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Date de fin</label>
            <input
              type="date"
              name="dateFin"
              value={form.dateFin}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Fermé ? */}
        <div>
          <span className="block mb-1 font-medium">Fermé ?</span>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="ferme"
              value="true"
              checked={form.ferme === true}
              onChange={handleChange}
            />
            <span className="ml-2">Oui</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="ferme"
              value="false"
              checked={form.ferme === false}
              onChange={handleChange}
            />
            <span className="ml-2">Non</span>
          </label>
        </div>

        {/* Rapport personnalisé */}
        <div>
          <label className="block mb-1 font-medium">Rapport personnalisé</label>
          <select
            name="rapportPerso"
            value={form.rapportPerso}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Modèle générique</option>
            <option value="modeleA">Modèle A</option>
            <option value="modeleB">Modèle B</option>
            {/* etc. */}
          </select>
        </div>

        {/* Commentaire */}
        <div>
          <label className="block mb-1 font-medium">Commentaire</label>
          <textarea
            name="commentaire"
            rows={3}
            value={form.commentaire}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Type Client & Type Contrat */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Type de client</label>
            <select
              name="typeClient"
              value={form.typeClient}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="B2B">Professionnel (B2B)</option>
              <option value="B2C">Particulier (B2C)</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Type de contrat</label>
            <select
              name="typeContrat"
              value={form.typeContrat}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option>Entretien</option>
              <option>Abonnement</option>
            </select>
          </div>
        </div>

        {/* Soumettre */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  )
}
