import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMovements } from "../../../shared/api/domains/inventory/clientApi";

export default function Mouvements() {
  // State global des mouvements
  const [mouvements, setMouvements] = useState([]);
  // Listes partitionnées
  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);

  // Chargement initial
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getMovements();
      setMouvements(data);
      // Partitionner selon type
      setEntries(data.filter((m) => m.type === "entrée"));
      setExits(data.filter((m) => m.type === "sortie"));
    } catch (err) {
      console.error("Erreur fetch mouvements :", err);
    }
  };

  // Totaux
  const totalEntries   = entries.reduce((sum, m) => sum + m.quantity, 0);
  const totalExits     = exits.reduce((sum, m) => sum + m.quantity, 0);
  const totalReserved  = exits
    .filter((m) => !m.returned)
    .reduce((sum, m) => sum + m.quantity, 0);
  const totalAvailable = totalEntries - totalExits;

  // 15 derniers mouvements
  const latestEntries = [...entries].slice(-15).reverse();
  const latestExits   = [...exits].slice(-15).reverse();

  return (
    <div className="flex w-full h-full p-4 bg-gray-100">
      {/* Colonne Entrées */}
      <div className="w-1/2 pr-4">
        <h2 className="text-2xl font-semibold mb-4">Entrées</h2>

        {/* Totaux */}
        <div className="flex gap-6 mb-4 text-sm">
          <div>Total Entrées : <strong>{totalEntries}</strong></div>
          <div>Total Sorties : <strong>{totalExits}</strong></div>
          <div>Total Disponible : <strong>{totalAvailable}</strong></div>
          <div>Total Réservé : <strong>{totalReserved}</strong></div>
        </div>

        {/* Formulaire d'entrée (à connecter) */}
        <form className="mb-6 bg-white p-4 rounded shadow">
          {/* TODO: connecter onSubmit */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Article</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Référence ou nom" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Quantité</label>
            <input type="number" className="w-full border rounded px-3 py-2" placeholder="Nombre à ajouter" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ➕ Ajouter l'entrée
          </button>
        </form>

        {/* Tableau des entrées */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Article</th>
                <th className="px-4 py-2 text-left">Quantité</th>
                <th className="px-4 py-2 text-left">Utilisateur</th>
              </tr>
            </thead>
            <tbody>
              {latestEntries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                    Aucune entrée enregistrée.
                  </td>
                </tr>
              ) : (
                latestEntries.map((e, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{new Date(e.eventDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{e.name}</td>
                    <td className="px-4 py-2">{e.quantity}</td>
                    <td className="px-4 py-2">{e.createdBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Lien Historique complet */}
        <div className="mt-2">
          <Link to="/mouvements/history" className="text-blue-600 hover:underline text-sm">
            Voir l'historique complet
          </Link>
        </div>
      </div>

      {/* Séparateur vertical */}
      <div className="w-px bg-gray-300 mx-4" />

      {/* Colonne Sorties */}
      <div className="w-1/2 pl-4">
        <h2 className="text-2xl font-semibold mb-4">Sorties</h2>

        {/* Totaux (mêmes données) */}
        <div className="flex gap-6 mb-4 text-sm">
          <div>Total Entrées : <strong>{totalEntries}</strong></div>
          <div>Total Sorties : <strong>{totalExits}</strong></div>
          <div>Total Disponible : <strong>{totalAvailable}</strong></div>
          <div>Total Réservé : <strong>{totalReserved}</strong></div>
        </div>

        {/* Formulaire de sortie (à connecter) */}
        <form className="mb-6 bg-white p-4 rounded shadow">
          {/* TODO: connecter onSubmit */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Article</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Référence ou nom" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Quantité</label>
            <input type="number" className="w-full border rounded px-3 py-2" placeholder="Nombre à retirer" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Projet / Destinataire</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Nom du projet ou client" />
          </div>
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            ➖ Enregistrer la sortie
          </button>
        </form>

        {/* Tableau des sorties */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Article</th>
                <th className="px-4 py-2 text-left">Quantité</th>
                <th className="px-4 py-2 text-left">Projet</th>
                <th className="px-4 py-2 text-left">Utilisateur</th>
              </tr>
            </thead>
            <tbody>
              {latestExits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                    Aucune sortie enregistrée.
                  </td>
                </tr>
              ) : (
                latestExits.map((e, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{new Date(e.eventDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{e.name}</td>
                    <td className="px-4 py-2">{e.quantity}</td>
                    <td className="px-4 py-2">{e.project}</td>
                    <td className="px-4 py-2">{e.createdBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Lien Historique complet */}
        <div className="mt-2">
          <Link to="/mouvements/history" className="text-blue-600 hover:underline text-sm">
            Voir l'historique complet
          </Link>
        </div>
      </div>
    </div>
  );
}
