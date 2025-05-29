import React from 'react'

export default function ProcessInfo() {
  const etapes = [
    '📦 Réception du matériel au dépôt',
    '📋 Vérification du matériel prévu vs livré',
    '🛠 Préparation du matériel spécifique par événement',
    '🚚 Organisation du chargement',
    '✅ Check final avant départ sur site',
    '🔁 Retour du matériel et rangement',
    '📝 Mise à jour du stock et notes'
  ]

  const handleAcknowledge = () => {
    alert('Merci ! ✅ Vous avez approuvé le process.')
    // tu peux ajouter de la logique d’enregistrement ici
  }

  return (
    <div className="max-w-3xl mx-auto text-center space-y-6 text-gray-800">
      <h2 className="text-2xl font-bold text-green-800">📌 Étapes du process événementiel</h2>
      <ul className="space-y-2">
        {etapes.map((etape, i) => (
          <li key={i} className="text-md">
            {etape}
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500">
        Ce process peut évoluer en fonction des événements ou des saisons.
      </p>
      <button
        onClick={handleAcknowledge}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
      >
        ✅ J’ai lu et approuvé
      </button>
    </div>
  )
}
