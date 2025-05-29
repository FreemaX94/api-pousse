import React, { useState, useEffect } from 'react';
import api from "../api/clientApi";
import VehicleForm from '../components/VehicleForm';

export default function Vehicules() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleEdit = vehicle => {
    setSelectedVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce véhicule ?')) return;
    await api.delete(`/vehicles/${id}`);
    setVehicles(vehicles.filter(v => v._id !== id));
  };

  // Upload carte grise ou assurance
  const handleFileUpload = async (id, field, file) => {
    const form = new FormData();
    form.append(field, file);
    await api.put(`/vehicles/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    fetchVehicles();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Véhicules</h1>
      <button
        className="mb-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        onClick={() => { setSelectedVehicle(null); setShowForm(true); }}
      >
        Ajouter un véhicule
      </button>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">Erreur : {error.message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {vehicles.map(v => (
          <div key={v._id} className="bg-white shadow rounded overflow-hidden">
            <img
              src={v.vehiclePhotoUrl}
              alt={`${v.marque} ${v.modele}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{v.marque} {v.modele}</h2>
              <p><strong>Immatriculation :</strong> {v.immatriculation}</p>
              <p><strong>Type :</strong> {v.fuelType}</p>

              <div className="mt-4">
                <p className="mb-1 font-semibold">Carte grise :</p>
                {v.registrationCardUrl
                  ? <img src={v.registrationCardUrl} alt="Carte grise" className="w-full h-32 object-contain border rounded" />
                  : <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={e => handleFileUpload(v._id, 'registrationCard', e.target.files[0])}
                      className="w-full"
                    />
                }
              </div>

              <div className="mt-4">
                <p className="mb-1 font-semibold">Assurance :</p>
                {v.insuranceUrl
                  ? <img src={v.insuranceUrl} alt="Assurance" className="w-full h-32 object-contain border rounded" />
                  : <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={e => handleFileUpload(v._id, 'insurance', e.target.files[0])}
                      className="w-full"
                    />
                }
              </div>

              <div className="flex justify-between items-center mt-4">
                <button onClick={() => handleEdit(v)} className="text-blue-500">Éditer</button>
                <button onClick={() => handleDelete(v._id)} className="text-red-500">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <VehicleForm
          vehicle={selectedVehicle}
          onClose={() => { setShowForm(false); setSelectedVehicle(null); }}
          onSubmit={updated => {
            setShowForm(false);
            setSelectedVehicle(null);
            // rafraîchir la liste
            fetchVehicles();
          }}
        />
      )}
    </div>
  );
}

