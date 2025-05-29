import React from 'react'

export default function ExpenseList({ notesFrais }) {
  if (!notesFrais || notesFrais.length === 0) {
    return <p className="text-gray-500 text-center">Aucune note de frais pour le moment.</p>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Liste des notes de frais</h2>
      <ul className="space-y-2">
        {notesFrais.map(note => (
          <li key={note._id} className="text-gray-800 text-base">
            {note.employee} – {parseFloat(note.amount).toFixed(2)} euros
          </li>
        ))}
      </ul>
    </div>
  )
}
