// src/pages/Entretien.jsx
import React, { useState, useMemo } from 'react'
import { FaCalendarAlt, FaFilter, FaPlus } from 'react-icons/fa'

export default function Entretien() {
  // Liste complète des contrats (extrait du PDF)
  const initialRows = [
    { client: 'ADAGIO OPERA', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'ADVANCY', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'AE75 SAS', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'AQUILAE GESTION PRIVÉE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'ASSOCIATION DENTAIRE FRANCAISE - ADF', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'AVEROUS', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Aareal Bank', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Accornero', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Adagio Boulogne', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Adagio Buttes chaumont', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Adikteev', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Adonys Rambuteau', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Adonys Verrerie', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Adveris', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Aecom', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Allianz - My flex office', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Annette K / Javel', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Arolla', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Assouline Séverine', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'B-CE-EURO ARIANE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'BERENBERG BANK', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'BEWIZ', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'BM&A Partners', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Banque Palatine', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Banque Palatine Val de Fontenay', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Banque de France', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Bour Maud', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Bruno Nicolas', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'CLAREO', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Cabinet GILLIER', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Caravane', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Care Promotion', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Carole Neret', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'ComReal', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Copropriété Crussol', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Coupert', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Courtyard', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Cunanan Lara', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'DCS Easyware', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'DELRIEU Agnès', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'DELSOL Avocats', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'DIACONESSES CROIX ST SIMON', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Dadu', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'David Benichou', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Deborah Yacharel', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Delaval Anne', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Delbourg', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Delphine Eskenazi', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Domaine Clarence Dillon', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Doudeauville', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Eiffage Nanterre', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Eloise Fontaine', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Europa Group', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Exalt', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'FRENCH THEORY', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Fabien Marcantetti', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Flexim SAS', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Florie Garnier', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'François Levoir', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'GMBA & CO', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Gustave Collection Palais Garnier', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Gustave Collection Vendôme', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Gustave collection Opéra / rue de la paix', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'HAVEA', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'HERMES', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'HIG Capital', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'HONORE GAMING/SPORTYTOTE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'HOTEL DE L\'UNIVERSITE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'HTL', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'HUOT LOURADOUR Isabelle', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Haggarty / VILLA REANT', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Ami', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Artus', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Hôtel Doisy', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Florida', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Kyriad / ADIX', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Le swann', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Oratio', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Orphée / Devillas', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel de Buci', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'INNOVEN', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'IRCEC', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Charonne', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Haussmann', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Saint Honoré', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Saintonge', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Seine', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Victor Hugo', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabelle Draux Bobin', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'JOKO/WYRL', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'JPB Audioviuel', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Jean-Loup Wirotius', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Josyane Durand', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Juanita Sonigo', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Karim Sadli', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'L\'Arche à Paris', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'LBP AM', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'LOSAM', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'La Fabrique', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Le Prado', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Ledger-Bompard', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Legars', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Lelezec Céline', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Lightspeed', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Linesight', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Luca Faloni', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Lydia Solutions', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MATERA', typeClient: 'Professionnel', typeContrat: 'nan' },
    { client: 'MC2I', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MG Motor', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MITSUI', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MUE', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'MY OFFICE MATE', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MYREPORT/ REPORT ONE', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Magellan', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Margot Dromer / Jamais Contente', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Marie Curdy', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Marjolaine Besnard', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Maxime Delauney - Nolita', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Mazmez', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Morning Laffitte', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Morning Sahar', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'NATHALIE JALABERT', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'NEGIAR - DUFETELLE', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'NHOOD Services France', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Nathalie Hazan', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Nathalie Peyron', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Nathalie SMADJA', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Navan - My flex office', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'New Flag', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Nickel / FINANCIERE DES PAIEMENTS ELECTRONIQUES', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Nicolas Cottereau', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'No Place Like Work', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Nolita', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Notaires 1768', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'OH BIBI', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'OTCFLOW', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'PECASSOU', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'PRETTY SIMPLE', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'PUBLICIS MEDIA', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'PUK - Valentino', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Pierre Sequier', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'RASMUSSEN', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Renaud Doppelt', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Roquette Frères', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Rubis énergie', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'SAS NATION / CITEO', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SCI Doisy', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SEPHORA', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'SHARP VISION', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'SIA PARTNERS Berri', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SIA PARTNERS Sentier', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SMART TRADE TECHNOLOGIES', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'SOC grande loge de France', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SPORTS SOLUTIONS MAKERS', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Sauvage Aliénor', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Scannell Management France', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Schneider', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Scibids / DoubleVerify', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Shein', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Singular', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Siparex', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Sophie KRICK', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Spotify', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Stanislas Huin', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Swile', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Systra', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'TEYSSEDOU Céline', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'THE BUREAU 4septembre', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'TORAY CFE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Terrass hôtel', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Tevah Systemes', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'The Bureau NDV', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'The bureau - Albert 1er', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Tommasi', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'UMS - Autonomia', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Unique Héritage Média', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'UpsideCS', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'VFJ', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Veron - Vesper', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Vinci énergies', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Véronique GROSMAN', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'WE FIIT', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'WEWARD', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'WINAMAX', typeClient: 'Professionnel', typeContrat: 'Entretien' },

 
  ]

  const [rows] = useState(initialRows)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    client: '',
    typeClient: 'Professionnel',
    typeContrat: 'Entretien',
    titre: '',
    duree: '',
    budget: '',
    dateDebut: '',
    dateFin: '',
    fermee: false,
    rapport: 'Modèle générique',
    commentaire: ''
  })

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // ... votre POST fetch si nécessaire
    // pour la démo on insère juste en local :
    setShowForm(false)
    setForm({
      client: '',
      typeClient: 'Professionnel',
      typeContrat: 'Entretien',
      titre: '',
      duree: '',
      budget: '',
      dateDebut: '',
      dateFin: '',
      fermee: false,
      rapport: 'Modèle générique',
      commentaire: ''
    })
  }

  // Filtrer les lignes par client
  const filteredRows = useMemo(() => {
    return rows.filter(r =>
      r.client.toLowerCase().includes(search.toLowerCase())
    )
  }, [rows, search])

  return (
    <div className="p-6 bg-[var(--bg)] min-h-screen">
      <h1 className="text-3xl font-heading text-center mb-8">Organipousse</h1>

      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50">
          <FaCalendarAlt className="mr-2 text-blue-600" /> date min – date max
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50">
          <FaFilter className="mr-2 text-blue-600" /> Filtres
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="ml-auto flex items-center px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          <FaPlus className="mr-2" /> Ajouter un contrat
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-2xl border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Formulaire inline */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Champ Client */}
            <div>
              <label className="block text-sm font-medium mb-1">Client *</label>
              <input
                name="client"
                value={form.client}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Type Client */}
            <div>
              <label className="block text-sm font-medium mb-1">Type Client</label>
              <select
                name="typeClient"
                value={form.typeClient}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option>Professionnel</option>
                <option>Particulier</option>
              </select>
            </div>
            {/* Type de contrat */}
            <div>
              <label className="block text-sm font-medium mb-1">Type de contrat</label>
              <select
                name="typeContrat"
                value={form.typeContrat}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option>Entretien</option>
                <option>Abonnement</option>
              </select>
            </div>
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input
                name="titre"
                value={form.titre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Durée */}
            <div>
              <label className="block text-sm font-medium mb-1">Durée (HH:MM)</label>
              <input
                name="duree"
                type="time"
                value={form.duree}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-1">Budget (€)</label>
              <input
                name="budget"
                type="number"
                min="0"
                value={form.budget}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Date début */}
            <div>
              <label className="block text-sm font-medium mb-1">Date de début</label>
              <input
                name="dateDebut"
                type="date"
                value={form.dateDebut}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Date fin */}
            <div>
              <label className="block text-sm font-medium mb-1">Date de fin</label>
              <input
                name="dateFin"
                type="date"
                value={form.dateFin}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Fermé ? */}
            <div className="md:col-span-2 flex items-center space-x-6">
              <span className="text-sm font-medium">Fermé ?</span>
              <label className="flex items-center">
                <input
                  name="fermee"
                  type="radio"
                  checked={form.fermee}
                  onChange={() => setForm(f => ({ ...f, fermee: true }))}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm">Oui</span>
              </label>
              <label className="flex items-center">
                <input
                  name="fermee"
                  type="radio"
                  checked={!form.fermee}
                  onChange={() => setForm(f => ({ ...f, fermee: false }))}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm">Non</span>
              </label>
            </div>
            {/* Rapport personnalisé */}
            <div>
              <label className="block text-sm font-medium mb-1">Rapport personnalisé</label>
              <select
                name="rapport"
                value={form.rapport}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option>Modèle générique</option>
              </select>
            </div>
            {/* Commentaire */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Commentaire</label>
              <textarea
                name="commentaire"
                value={form.commentaire}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* Tableau */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Client</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type Client</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type de contrat</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm text-gray-800">{r.client}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{r.typeClient}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{r.typeContrat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
