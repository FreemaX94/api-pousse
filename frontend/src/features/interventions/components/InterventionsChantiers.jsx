import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import AjouterChantierModal from './AjouterChantierModal';

const InterventionsChantiers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChantier, setSelectedChantier] = useState(null);

  // Données de démonstration pour les chantiers
  const mockChantiers = [
    {
      id: '1',
      nom: 'Aménagement bureau BNP',
      client: 'BNP PARIBAS',
      etape: 'Exécution',
      dateDebut: '2025-01-20',
      dateFin: '2025-02-15',
      termine: false,
      nombreInterventions: 5,
      statut: 'En cours'
    },
    {
      id: '2',
      nom: 'Installation plantes Hermès',
      client: 'HERMES',
      etape: 'Facturation',
      dateDebut: '2025-01-15',
      dateFin: '2025-01-30',
      termine: true,
      nombreInterventions: 3,
      statut: 'Terminé'
    },
    {
      id: '3',
      nom: 'Entretien jardins Sephora',
      client: 'SEPHORA',
      etape: 'Planification',
      dateDebut: '2025-02-01',
      dateFin: '2025-02-28',
      termine: false,
      nombreInterventions: 8,
      statut: 'Planifié'
    }
  ];

  const filteredChantiers = mockChantiers.filter(chantier =>
    chantier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chantier.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEtapeColor = (etape) => {
    const colors = {
      'Choix': 'bg-gray-100 text-gray-800',
      'Facturation': 'bg-blue-100 text-blue-800',
      'Exécution': 'bg-green-100 text-green-800',
      'Commande': 'bg-orange-100 text-orange-800',
      'Planification': 'bg-purple-100 text-purple-800'
    };
    return colors[etape] || 'bg-gray-100 text-gray-800';
  };

  const getStatutColor = (statut) => {
    const colors = {
      'En cours': 'bg-yellow-100 text-yellow-800',
      'Terminé': 'bg-green-100 text-green-800',
      'Planifié': 'bg-blue-100 text-blue-800',
      'Annulé': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header avec actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Chantiers</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gestion des chantiers et interventions associées
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Barre de recherche */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un chantier..."
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

            {/* Bouton Ajouter un chantier */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter un chantier
            </motion.button>
          </div>
        </div>
      </div>

      {/* Table des chantiers */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chantier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Étape
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interventions
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
            {filteredChantiers.map((chantier) => (
              <motion.tr
                key={chantier.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {chantier.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {chantier.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{chantier.client}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEtapeColor(chantier.etape)}`}>
                    {chantier.etape}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span>
                      {new Date(chantier.dateDebut).toLocaleDateString('fr-FR')} - {new Date(chantier.dateFin).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{chantier.nombreInterventions}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(chantier.statut)}`}>
                    {chantier.statut}
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
                        setSelectedChantier(chantier);
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

      {/* Message si aucun chantier */}
      {filteredChantiers.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Aucun chantier trouvé pour cette recherche.' : 'Aucun chantier créé.'}
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Créer votre premier chantier
            </motion.button>
          )}
        </div>
      )}

      {/* Modal Ajouter/Modifier Chantier */}
      <AjouterChantierModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedChantier(null);
        }}
        chantier={selectedChantier}
      />
    </div>
  );
};

export default InterventionsChantiers;