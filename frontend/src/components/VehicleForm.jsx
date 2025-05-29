// frontend/src/components/VehicleForm.jsx
import React, { useState } from 'react';
import api from "../api/clientApi";


export default function VehicleForm({ vehicle, onSubmit, onClose }) {
  const [immatriculation, setImmatriculation] = useState(vehicle?.immatriculation || '');
  const [marque, setMarque] = useState(vehicle?.marque || '');
  const [modele, setModele] = useState(vehicle?.modele || '');
  const [capacite, setCapacite] = useState(vehicle?.capacite || '');
  const [statut, setStatut] = useState(vehicle?.statut || '');
  const [fuelType, setFuelType] = useState(vehicle?.fuelType || '');
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState(vehicle?.vehiclePhotoUrl || '');
  const [registrationCardFile, setRegistrationCardFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append('immatriculation', immatriculation);
    form.append('marque', marque);
    form.append('modele', modele);
    form.append('capacite', Number(capacite));
    form.append('statut', statut);
    form.append('fuelType', fuelType);
    form.append('vehiclePhotoUrl', vehiclePhotoUrl);

    if (registrationCardFile) {
      form.append('registrationCard', registrationCardFile);
    }
    if (insuranceFile) {
      form.append('insurance', insuranceFile);
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const res = vehicle
        ? await api.put(`/vehicles/${vehicle._id}`, form, config)
        : await api.post('/vehicles', form, config);
      onSubmit(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-bold">
          {vehicle ? 'Éditer un véhicule' : 'Ajouter un véhicule'}
        </h2>
        {error && <p className="text-red-500">Erreur : {error.message}</p>}

        {/* Champs de base */}
        <div>
          <label className="block mb-1">Immatriculation</label>
          <input
            type="text"
            value={immatriculation}
            onChange={e => setImmatriculation(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Marque</label>
          <input
            type="text"
            value={marque}
            onChange={e => setMarque(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Modèle</label>
          <input
            type="text"
            value={modele}
            onChange={e => setModele(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Capacité</label>
          <input
            type="number"
            value={capacite}
            onChange={e => setCapacite(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Statut</label>
          <input
            type="text"
            value={statut}
            onChange={e => setStatut(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Type de carburant</label>
          <input
            type="text"
            value={fuelType}
            onChange={e => setFuelType(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* Champs optionnels */}
        <div>
          <label className="block mb-1">URL Photo Véhicule</label>
          <input
            type="url"
            value={vehiclePhotoUrl}
            onChange={e => setVehiclePhotoUrl(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Carte grise (PDF/JPG)</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={e => setRegistrationCardFile(e.target.files[0])}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Assurance (PDF/JPG)</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={e => setInsuranceFile(e.target.files[0])}
            className="w-full"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Envoi…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
