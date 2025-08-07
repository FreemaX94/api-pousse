import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
  UserIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import AjouterVehiculeModal from './AjouterVehiculeModal';

const InterventionsVehicules = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicule, setSelectedVehicule] = useState(null);

  // Données de démonstration pour les véhicules
  const mockVehicules = [
    {
      id: '1',
      nom: 'Camion Benne',
      collaborateur: 'Aymeric Tireau',
      marque: 'Renault Master',
      couleur: 'Blanc',
      immatriculation: 'AB-123-CD',
      compteurKm: 125000,
      dateReleveKm: '2025-01-20',
      compteurHeures: 3500,
      dateReleveHeures: '2025-01-20',
      derniereRevision: '2024-12-15',
      prochaineRevisionKm: 130000,
      prochaineRevisionHeures: 3800,
      prochaineRevisionDate: '2025-06-15',
      statut: 'Actif',
      prochainEntretien: 15
    },
    {
      id: '2',
      nom: 'Utilitaire',
      collaborateur: 'David Celeste',
      marque: 'Peugeot Partner',
      couleur: 'Gris',
      immatriculation: 'EF-456-GH',
      compteurKm: 89000,
      dateReleveKm: '2025-01-18',
      compteurHeures: 2200,
      dateReleveHeures: '2025-01-18',
      derniereRevision: '2024-11-20',
      prochaineRevisionKm: 95000,
      prochaineRevisionHeures: 2500,
      prochaineRevisionDate: '2025-05-20',
      statut: 'Actif',
      prochainEntretien: 45
    },
    {
      id: '3',
      nom: 'Fourgon Équipé',
      collaborateur: 'Marine Sandoz',
      marque: 'Ford Transit',
      couleur: 'Bleu',
      immatriculation: 'IJ-789-KL',
      compteurKm: 156000,
      dateReleveKm: '2025-01-22',
      compteurHeures: 4100,
      dateReleveHeures: '2025-01-22',
      derniereRevision: '2025-01-10',
      prochaineRevisionKm: 165000,
      prochaineRevisionHeures: 4500,
      prochaineRevisionDate: '2025-07-10',
      statut: 'En maintenance',
      prochainEntretien: 8
    }
  ];

  const filteredVehicules = mockVehicules.filter(vehicule =>
    vehicule.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicule.collaborateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicule.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutColor = (statut) => {
    const colors = {
      'Actif': 'bg-green-100 text-green-800',
      'En maintenance': 'bg-orange-100 text-orange-800',
      'Hors service': 'bg-red-100 text-red-800',
      'Révision': 'bg-blue-100 text-blue-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getEntretienColor = (jours) => {
    if (jours <= 7) return 'bg-red-100 text-red-800';
    if (jours <= 30) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header avec actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Véhicules</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gestion de la flotte de véhicules et planning d'entretien
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Barre de recherche */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un véhicule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* Bouton Filtres */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtres
            </motion.button>

            {/* Bouton Ajouter un véhicule */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter un véhicule
            </motion.button>
          </div>
        </div>
      </div>

      {/* Alertes véhicules */}
      <div className="p-4 bg-amber-50 border-b border-amber-200">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mr-2" />
          <span className="text-sm text-amber-800">
            <strong>2 véhicules</strong> nécessitent un entretien dans les 30 prochains jours
          </span>
        </div>
      </div>

      {/* Table des véhicules */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Véhicule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Immatriculation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kilométrage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prochain entretien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVehicules.map((vehicule) => (
              <motion.tr
                key={vehicule.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <TruckIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {vehicule.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicule.marque} - {vehicule.couleur}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{vehicule.collaborateur}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-900">{vehicule.immatriculation}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vehicule.compteurKm.toLocaleString('fr-FR')} km
                  </div>
                  <div className="text-xs text-gray-500">
                    {vehicule.compteurHeures.toLocaleString('fr-FR')} h
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntretienColor(vehicule.prochainEntretien)}`}>
                      {vehicule.prochainEntretien} jours
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(vehicule.statut)}`}>
                    {vehicule.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Voir"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedVehicule(vehicule);
                        setShowAddModal(true);
                      }}
                      className="text-gray-600 hover:text-gray-900 p-1"
                      title="Modifier"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-orange-600 hover:text-orange-900 p-1"
                      title="Planifier entretien"
                    >
                      <WrenchScrewdriverIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message si aucun véhicule */}
      {filteredVehicules.length === 0 && (
        <div className="text-center py-12">
          <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Aucun véhicule trouvé pour cette recherche.' : 'Aucun véhicule enregistré.'}
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter votre premier véhicule
            </motion.button>
          )}
        </div>
      )}

      {/* Modal Ajouter/Modifier Véhicule */}
      <AjouterVehiculeModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedVehicule(null);
        }}
        vehicule={selectedVehicule}
      />
    </div>
  );
};

export default InterventionsVehicules;