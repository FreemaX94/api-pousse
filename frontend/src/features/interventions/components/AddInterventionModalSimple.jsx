import React, { useState } from 'react';
import { 
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AddInterventionModalSimple = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    heure: '09:00',
    duree: '120',
    collaborateur: '',
    client: '',
    adresse: '',
    categorie: 'Entretien',
    description: '',
    statut: 'planifie'
  });

  const collaborateurs = [
    'Simon Henry',
    'Elodie Treveten',
    'Marie Dubois',
    'Pierre Martin',
    'Sophie Leroy',
    'Jean Dupont',
    'Lucas Bernard',
    'Emma Moreau'
  ];

  const clients = [
    'Singular',
    'TORAY CE',
    'CREDIT MUTUEL',
    'SOCIETE GENERALE',
    'BNP PARIBAS',
    'L\'OREAL',
    'DANONE',
    'TOTAL ENERGIES'
  ];

  const categories = [
    'Entretien',
    'Taille',
    'Nettoyage',
    'Fertilisation',
    'Rempotage',
    'Arrosage',
    'Installation',
    'Diagnostic'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici on pourrait appeler l'API pour créer l'intervention
    console.log('Nouvelle intervention:', formData);
    // Réinitialiser le formulaire
    setFormData({
      date: new Date().toISOString().split('T')[0],
      heure: '09:00',
      duree: '120',
      collaborateur: '',
      client: '',
      adresse: '',
      categorie: 'Entretien',
      description: '',
      statut: 'planifie'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Ajouter une intervention</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date et heure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Heure
              </label>
              <input
                type="time"
                name="heure"
                value={formData.heure}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée (minutes)
            </label>
            <select
              name="duree"
              value={formData.duree}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 heure</option>
              <option value="90">1h30</option>
              <option value="120">2 heures</option>
              <option value="150">2h30</option>
              <option value="180">3 heures</option>
              <option value="240">4 heures</option>
            </select>
          </div>

          {/* Collaborateur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <UserIcon className="w-4 h-4 inline mr-1" />
              Collaborateur
            </label>
            <select
              name="collaborateur"
              value={formData.collaborateur}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Sélectionner un collaborateur</option>
              {collaborateurs.map(collab => (
                <option key={collab} value={collab}>{collab}</option>
              ))}
            </select>
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <UserIcon className="w-4 h-4 inline mr-1" />
              Client
            </label>
            <select
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPinIcon className="w-4 h-4 inline mr-1" />
              Adresse
            </label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Ex: 38 Rue Des Jeûneurs, 75002, Paris"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TagIcon className="w-4 h-4 inline mr-1" />
              Catégorie
            </label>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DocumentTextIcon className="w-4 h-4 inline mr-1" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Description de l'intervention..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="planifie">Planifié</option>
              <option value="en-cours">En cours</option>
              <option value="effectue">Effectué</option>
              <option value="non-effectue">Non effectué</option>
              <option value="annule">Annulé</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Ajouter l'intervention
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInterventionModalSimple;