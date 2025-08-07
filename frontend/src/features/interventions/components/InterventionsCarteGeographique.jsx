import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  PlusIcon,
  FunnelIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  MapIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ClockIcon,
  BuildingOfficeIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import AjouterInterventionModal from '../../planning/components/AjouterInterventionModal';
import ResourceFilterModal from '../../planning/components/ResourceFilterModal';
import { PlanningFiltersProvider } from '../../planning/context/PlanningFiltersContext';

// Données de démonstration avec coordonnées GPS
const mockInterventions = [
  {
    id: '1',
    numeroIntervention: 'INT-2025-001',
    client: {
      nom: 'ADAGIO OPERA',
      adresse: '9 Rue de la Michodière, 75002 Paris'
    },
    adresse: {
      rue: '9 Rue de la Michodière',
      codePostal: '75002',
      ville: 'Paris',
      coordonnees: {
        latitude: 48.8698,
        longitude: 2.3354
      }
    },
    dateDebut: '2025-01-25',
    heureDebut: '09:00',
    heureFin: '10:30',
    status: 'planifie',
    typeIntervention: 'bureau',
    collaborateur: {
      nom: 'Jean Dupont',
      couleur: '#3B82F6'
    },
    is_done: false
  },
  {
    id: '2',
    numeroIntervention: 'INT-2025-002',
    client: {
      nom: 'HERMES',
      adresse: '24 Rue du Faubourg Saint-Honoré, 75008 Paris'
    },
    adresse: {
      rue: '24 Rue du Faubourg Saint-Honoré',
      codePostal: '75008',
      ville: 'Paris',
      coordonnees: {
        latitude: 48.8678,
        longitude: 2.3241
      }
    },
    dateDebut: '2025-01-25',
    heureDebut: '11:00',
    heureFin: '12:30',
    status: 'termine',
    typeIntervention: 'terrain',
    collaborateur: {
      nom: 'Marie Martin',
      couleur: '#10B981'
    },
    is_done: true
  },
  {
    id: '3',
    numeroIntervention: 'INT-2025-003',
    client: {
      nom: 'SEPHORA',
      adresse: '70 Avenue des Champs-Élysées, 75008 Paris'
    },
    adresse: {
      rue: '70 Avenue des Champs-Élysées',
      codePostal: '75008',
      ville: 'Paris',
      coordonnees: {
        latitude: 48.8708,
        longitude: 2.3048
      }
    },
    dateDebut: '2025-01-25',
    heureDebut: '14:00',
    heureFin: '15:30',
    status: 'planifie',
    typeIntervention: 'bureau',
    collaborateur: {
      nom: 'Pierre Durand',
      couleur: '#F59E0B'
    },
    is_done: false
  },
  {
    id: '4',
    numeroIntervention: 'INT-2025-004',
    client: {
      nom: 'SPOTIFY',
      adresse: '84 Rue de Grenelle, 75007 Paris'
    },
    adresse: {
      rue: '84 Rue de Grenelle',
      codePostal: '75007',
      ville: 'Paris',
      coordonnees: {
        latitude: 48.8568,
        longitude: 2.3258
      }
    },
    dateDebut: '2025-01-24',
    heureDebut: '16:00',
    heureFin: '17:30',
    status: 'termine',
    typeIntervention: 'terrain',
    collaborateur: {
      nom: 'Sophie Bernard',
      couleur: '#EF4444'
    },
    is_done: true
  },
  {
    id: '5',
    numeroIntervention: 'INT-2025-005',
    client: {
      nom: 'WINAMAX',
      adresse: '16 Rue Auber, 75009 Paris'
    },
    adresse: {
      rue: '16 Rue Auber',
      codePostal: '75009',
      ville: 'Paris',
      coordonnees: {
        latitude: 48.8724,
        longitude: 2.3302
      }
    },
    dateDebut: '2025-01-25',
    status: 'planifie',
    typeIntervention: 'bureau',
    collaborateur: {
      nom: 'Luc Moreau',
      couleur: '#8B5CF6'
    },
    is_done: false
  },
  {
    id: '6',
    numeroIntervention: 'INT-2025-006',
    client: {
      nom: 'NICKEL',
      adresse: '43 Avenue de l\'Opéra, 75002 Paris'
    },
    adresse: {
      rue: '43 Avenue de l\'Opéra',
      codePostal: '75002',
      ville: 'Paris',
      coordonnees: {
        latitude: 48.8684,
        longitude: 2.3329
      }
    },
    dateDebut: '2025-01-24',
    heureDebut: '10:00',
    heureFin: '11:00',
    status: 'termine',
    typeIntervention: 'terrain',
    collaborateur: {
      nom: 'Emma Petit',
      couleur: '#14B8A6'
    },
    is_done: true
  }
];

const InterventionsCarteGeographiqueContent = () => {
  const [activeTab, setActiveTab] = useState('tout');
  const [mapType, setMapType] = useState('roadmap');
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: new Date('2025-01-24'),
    end: new Date('2025-01-25')
  });

  // Gestionnaire pour les changements de filtres
  const handleFiltersChange = (filters) => {
    console.log('Filtres appliqués:', filters);
    // Ici on pourrait filtrer les interventions selon les critères sélectionnés
    // Pour l'instant on se contente d'afficher dans la console
  };

  // Filtrer les interventions selon l'onglet actif
  const filteredInterventions = useMemo(() => {
    switch (activeTab) {
      case 'planifie':
        return mockInterventions.filter(i => !i.is_done && i.adresse.coordonnees);
      case 'effectue':
        return mockInterventions.filter(i => i.is_done && i.adresse.coordonnees);
      case 'tout':
      default:
        return mockInterventions.filter(i => i.adresse.coordonnees);
    }
  }, [activeTab]);

  // Gestion des markers
  const getMarkerColor = (intervention) => {
    if (intervention.is_done) {
      return intervention.typeIntervention === 'terrain' ? 'text-green-500' : 'text-blue-500';
    }
    return intervention.typeIntervention === 'terrain' ? 'text-amber-500' : 'text-red-500';
  };

  const getMarkerIcon = (intervention) => {
    return intervention.typeIntervention === 'terrain' ? TruckIcon : BuildingOfficeIcon;
  };

  // Composant Légende
  const Legend = () => (
    <AnimatePresence>
      {showLegend && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-48 bg-white rounded-lg shadow-lg p-4 z-10"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Légende</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <BuildingOfficeIcon className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-700">Bureau - Effectué</span>
            </div>
            <div className="flex items-center space-x-2">
              <TruckIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Terrain - Effectué</span>
            </div>
            <div className="flex items-center space-x-2">
              <BuildingOfficeIcon className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-700">Bureau - Planifié</span>
            </div>
            <div className="flex items-center space-x-2">
              <TruckIcon className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-gray-700">Terrain - Planifié</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Collaborateurs</h4>
            <div className="space-y-1">
              {Array.from(new Set(mockInterventions.map(i => i.collaborateur?.nom))).map((nom, index) => {
                const couleur = mockInterventions.find(i => i.collaborateur?.nom === nom)?.collaborateur?.couleur;
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: couleur }} />
                    <span className="text-xs text-gray-600">{nom}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Barre d'outils */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter une intervention
            </motion.button>

            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-600">Période :</span>
              <span className="text-sm font-medium text-gray-900">
                {format(selectedDateRange.start, 'dd/MM/yyyy', { locale: fr })} – {format(selectedDateRange.end, 'dd/MM/yyyy', { locale: fr })}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtres
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLegend(!showLegend)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <InformationCircleIcon className="w-4 h-4 mr-2" />
                Légende
              </motion.button>
              <Legend />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <Cog6ToothIcon className="w-4 h-4 mr-2" />
              Options d'affichage
            </motion.button>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMapType('roadmap')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  mapType === 'roadmap' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                <MapIcon className="w-4 h-4 inline mr-1" />
                Plan
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  mapType === 'satellite' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                <GlobeAltIcon className="w-4 h-4 inline mr-1" />
                Satellite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sous-onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {[
            { key: 'tout', label: 'Tout', count: mockInterventions.filter(i => i.adresse.coordonnees).length },
            { key: 'planifie', label: 'Planifié', count: mockInterventions.filter(i => !i.is_done && i.adresse.coordonnees).length },
            { key: 'effectue', label: 'Effectué', count: mockInterventions.filter(i => i.is_done && i.adresse.coordonnees).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Carte ou message d'alerte */}
      <div className="relative">
        {filteredInterventions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 text-center"
          >
            <ExclamationTriangleIcon className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">
              Oups, il n'y a aucune adresse avec coordonnées GPS à afficher.
            </p>
          </motion.div>
        ) : (
          <div className="h-[600px] bg-gray-100 relative overflow-hidden">
            {/* Carte statique de démonstration */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=48.8566,2.3522&zoom=13&size=1200x600&maptype=${mapType}&style=feature:poi|visibility:off&key=YOUR_API_KEY`}
                alt="Carte de Paris"
                className="w-full h-full object-cover opacity-50"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Grille de fond comme fallback */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }} />
            </div>

            {/* Interventions en liste avec positionnement simulé */}
            <div className="absolute inset-0 p-6 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {filteredInterventions.map((intervention) => {
                  const Icon = getMarkerIcon(intervention);
                  return (
                    <motion.div
                      key={intervention.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.random() * 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedIntervention(intervention)}
                      className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          intervention.is_done
                            ? intervention.typeIntervention === 'terrain' ? 'bg-green-100' : 'bg-blue-100'
                            : intervention.typeIntervention === 'terrain' ? 'bg-amber-100' : 'bg-red-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${getMarkerColor(intervention)}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {intervention.numeroIntervention}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            <ClockIcon className="w-3 h-3 inline mr-1" />
                            {intervention.heureDebut || '?'} – {intervention.heureFin || '?'}
                          </p>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900">
                              {intervention.client.nom}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              <MapPinIcon className="w-3 h-3 inline mr-1" />
                              {intervention.adresse.rue}
                            </p>
                            <p className="text-xs text-gray-600">
                              {intervention.adresse.codePostal} {intervention.adresse.ville}
                            </p>
                          </div>
                          {intervention.collaborateur && (
                            <div className="mt-2 flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: intervention.collaborateur.couleur }} 
                              />
                              <span className="text-xs text-gray-600">
                                {intervention.collaborateur.nom}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'intervention sélectionnée */}
      <AnimatePresence>
        {selectedIntervention && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedIntervention(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Détails de l'intervention
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Numéro</label>
                    <p className="text-gray-900">{selectedIntervention.numeroIntervention}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Client</label>
                    <p className="text-gray-900">{selectedIntervention.client.nom}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Adresse</label>
                    <p className="text-gray-900">
                      {selectedIntervention.adresse.rue}, {selectedIntervention.adresse.codePostal} {selectedIntervention.adresse.ville}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Horaires</label>
                    <p className="text-gray-900">
                      {selectedIntervention.heureDebut || '?'} – {selectedIntervention.heureFin || '?'}
                    </p>
                  </div>
                  {selectedIntervention.collaborateur && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Collaborateur</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: selectedIntervention.collaborateur.couleur }} 
                        />
                        <span className="text-gray-900">{selectedIntervention.collaborateur.nom}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedIntervention(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(true);
                      // Le modal restera ouvert avec les données de l'intervention sélectionnée
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Ajouter une intervention */}
      <AjouterInterventionModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        selectedDate={selectedDateRange.start}
      />

      {/* Modal Filtres */}
      <ResourceFilterModal 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

const InterventionsCarteGeographique = () => {
  return (
    <PlanningFiltersProvider>
      <InterventionsCarteGeographiqueContent />
    </PlanningFiltersProvider>
  );
};

export default InterventionsCarteGeographique;