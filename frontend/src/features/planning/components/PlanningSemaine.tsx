import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  MapPinIcon,
  CogIcon,
  EyeSlashIcon,
  EyeIcon,
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { PlanningFiltersProvider, usePlanningFilters } from '../context/PlanningFiltersContext';
import AjouterInterventionModal from './AjouterInterventionModal';
import ResourceFilterModal from './ResourceFilterModal';
import { type ResourceFilters } from '../hooks/useResourceFilters';

interface Intervention {
  id: string;
  title: string;
  client: string;
  address: string;
  startTime?: string;
  endTime?: string;
  date: Date;
  collaboratorId: string;
  type: string;
  status: 'planifie' | 'effectue' | 'a_faire';
  category: string;
}

interface Collaborator {
  id: string;
  name: string;
  group: 'bureau' | 'terrain';
  hasPermisB: boolean;
  hasLocationMarker: boolean; // Icône localisation "à venir"
}

const PlanningSemaineContent: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hideWeekends, setHideWeekends] = useState(false);
  const [showAjouterIntervention, setShowAjouterIntervention] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [activeFilters, setActiveFilters] = useState<ResourceFilters>({
    numero: '',
    titre: '',
    client: '',
    collaborateur: 'tous',
    categorie: 'toutes',
    actif: 'tous'
  });
  const { collaborators } = usePlanningFilters();

  // Données d'exemple pour les interventions
  const mockInterventions: Intervention[] = [
    {
      id: '1',
      title: 'Entretien jardins BNP',
      client: 'BNP PARIBAS',
      address: '16 Boulevard des Italiens, 75009 Paris',
      startTime: '09:00',
      endTime: '11:00',
      date: new Date(2025, 6, 14), // 14 juillet
      collaboratorId: 'estelle',
      type: 'entretien',
      status: 'planifie',
      category: 'maintenance'
    },
    {
      id: '2',
      title: 'Installation plantes',
      client: 'SOCIETE GENERALE',
      address: '29 Boulevard Haussmann, 75009 Paris',
      startTime: '14:00',
      endTime: '16:00',
      date: new Date(2025, 6, 14),
      collaboratorId: 'florence',
      type: 'installation',
      status: 'a_faire',
      category: 'creation'
    },
    {
      id: '3',
      title: 'Diagnostic plantes',
      client: 'TOTAL ENERGIES',
      address: '2 Place Jean Millier, 92400 Courbevoie',
      startTime: '10:00',
      endTime: '12:00',
      date: new Date(2025, 6, 15),
      collaboratorId: 'aymeric',
      type: 'diagnostic',
      status: 'effectue',
      category: 'maintenance'
    },
    {
      id: '4',
      title: 'Formation équipe',
      client: 'Formation interne',
      address: 'Siège social',
      date: new Date(2025, 6, 16),
      collaboratorId: 'simon',
      type: 'formation',
      status: 'a_faire',
      category: 'autre'
    }
  ];

  // Palette de couleurs selon le statut
  const statusColors = {
    planifie: '#3B82F6', // Bleu
    a_faire: '#F59E0B', // Orange
    effectue: '#10B981'  // Vert
  };

  const categoryColors = {
    maintenance: '#10B981',
    creation: '#3B82F6',
    entretien: '#8B5CF6',
    formation: '#84CC16',
    autre: '#6B7280'
  };

  // Navigation
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Génération des jours de la semaine
  const generateWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Lundi
    startOfWeek.setDate(diff);
    
    const days = [];
    const endDay = hideWeekends ? 5 : 7; // 5 jours ou 7 jours
    
    for (let i = 0; i < endDay; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push(currentDay);
    }
    return days;
  };

  const weekDays = useMemo(() => generateWeekDays(currentDate), [currentDate, hideWeekends]);

  // Formatage de la plage de dates
  const formatDateRange = (date: Date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startStr = startOfWeek.getDate().toString().padStart(2, '0');
    const endStr = `${endOfWeek.getDate().toString().padStart(2, '0')} ${getMonthName(endOfWeek.getMonth()).toUpperCase()} ${endOfWeek.getFullYear()}`;
    
    return `${startStr} – ${endStr}`;
  };

  const getMonthName = (monthIndex: number) => {
    const months = [
      'JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN',
      'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'
    ];
    return months[monthIndex];
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[dayIndex];
  };

  // Gestion des filtres
  const handleFiltersChange = (filters: ResourceFilters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
    // TODO: Ici vous pourriez déclencher un appel API avec les filtres
  };

  // Filtrer les interventions selon les filtres actifs
  const getFilteredInterventions = () => {
    return mockInterventions.filter(intervention => {
      // Filtre par numéro
      if (activeFilters.numero && !intervention.id.includes(activeFilters.numero)) {
        return false;
      }
      
      // Filtre par titre
      if (activeFilters.titre && !intervention.title.toLowerCase().includes(activeFilters.titre.toLowerCase())) {
        return false;
      }
      
      // Filtre par client
      if (activeFilters.client && !intervention.client.toLowerCase().includes(activeFilters.client.toLowerCase())) {
        return false;
      }
      
      // Filtre par collaborateur
      if (activeFilters.collaborateur !== 'tous') {
        if (activeFilters.collaborateur === 'non-defini') {
          if (intervention.collaboratorId) return false;
        } else if (intervention.collaboratorId !== activeFilters.collaborateur) {
          return false;
        }
      }
      
      // Filtre par catégorie
      if (activeFilters.categorie !== 'toutes') {
        if (activeFilters.categorie === 'non-defini') {
          if (intervention.category) return false;
        } else if (intervention.category !== activeFilters.categorie) {
          return false;
        }
      }
      
      // Filtre par statut actif (pour l'exemple, on considère que toutes les interventions sont actives)
      if (activeFilters.actif === 'supprime') {
        return false; // Pas d'interventions supprimées dans les données d'exemple
      }
      
      return true;
    });
  };

  // Obtenir les interventions pour un collaborateur et un jour (avec filtres)
  const getInterventionsForCollaboratorAndDay = (collaboratorId: string, date: Date) => {
    const filteredInterventions = getFilteredInterventions();
    return filteredInterventions
      .filter(intervention => 
        intervention.collaboratorId === collaboratorId &&
        intervention.date.toDateString() === date.toDateString()
      )
      .sort((a, b) => {
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      });
  };

  // Calculer les compteurs par jour (avec filtres)
  const getCountersForDay = (date: Date) => {
    const filteredInterventions = getFilteredInterventions();
    const dayInterventions = filteredInterventions.filter(
      intervention => intervention.date.toDateString() === date.toDateString()
    );
    
    return {
      aFaire: dayInterventions.filter(i => i.status === 'a_faire').length,
      effectuees: dayInterventions.filter(i => i.status === 'effectue').length
    };
  };

  // Interventions non assignées (avec filtres)
  const unassignedInterventions = getFilteredInterventions().filter(
    intervention => !intervention.collaboratorId || intervention.collaboratorId === ''
  );

  // Composant Carte d'intervention
  const InterventionCard: React.FC<{ intervention: Intervention }> = ({ intervention }) => {
    const [showActions, setShowActions] = useState(false);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-shadow relative"
        style={{ borderLeft: `4px solid ${statusColors[intervention.status]}` }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-gray-500">#{intervention.id}</span>
              <span className="text-xs text-gray-600">
                {intervention.startTime && intervention.endTime 
                  ? `${intervention.startTime} – ${intervention.endTime}`
                  : '? – ?'
                }
              </span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {intervention.title}
            </h4>
            <p className="text-xs text-gray-600 truncate">{intervention.client}</p>
            <p className="text-xs text-gray-500 truncate">{intervention.address}</p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <CogIcon className="w-4 h-4 text-gray-400" />
            </button>
            
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]"
              >
                <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>Date</span>
                </button>
                <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <PencilIcon className="w-4 h-4" />
                  <span>Éditer</span>
                </button>
                <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <TrashIcon className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // En-tête
  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToday}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
          >
            Aujourd'hui
          </motion.button>
        </div>

        <h1 className="text-xl font-semibold text-gray-900">
          {formatDateRange(currentDate)}
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setHideWeekends(!hideWeekends)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            hideWeekends
              ? 'bg-[#2170E3] text-white border-[#2170E3]'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {hideWeekends ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          <span>Masquer les week-ends</span>
        </motion.button>
      </div>
    </div>
  );

  // Panneaux compteurs
  const renderCounters = () => (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Interventions à faire */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Interventions à faire</h3>
          <div className="flex space-x-4">
            {weekDays.map((day, index) => {
              const counters = getCountersForDay(day);
              return (
                <div key={index} className="text-center">
                  <div className="text-lg font-semibold text-orange-600">
                    {counters.aFaire}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getDayName(day.getDay()).slice(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interventions effectuées */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Interventions effectuées</h3>
          <div className="flex space-x-4">
            {weekDays.map((day, index) => {
              const counters = getCountersForDay(day);
              return (
                <div key={index} className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {counters.effectuees}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getDayName(day.getDay()).slice(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interventions non assignées */}
      {unassignedInterventions.length > 0 && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Attribué à aucun intervenant ({unassignedInterventions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {unassignedInterventions.map(intervention => (
              <InterventionCard key={intervention.id} intervention={intervention} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Grille des ressources
  const renderResourceGrid = () => (
    <div className="flex-1 overflow-auto">
      <div className="min-w-max">
        {/* En-têtes des collaborateurs */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="grid" style={{ gridTemplateColumns: `120px repeat(${collaborators.length}, 250px)` }}>
            <div className="p-4 border-r border-gray-200 bg-gray-50">
              <span className="text-sm font-medium text-gray-500">Jours</span>
            </div>
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="p-4 border-r border-gray-200 last:border-r-0 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {collaborator.name}
                      </span>
                      {collaborator.hasLocationMarker && (
                        <MapPinIcon className="w-4 h-4 text-blue-500" title="À venir" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      {collaborator.hasPermisB && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Permis B
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        collaborator.group === 'bureau' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {collaborator.group === 'bureau' ? 'Bureau' : 'Terrain'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setSelectedCollaborator(collaborator.id);
                        setSelectedDate(new Date());
                        setShowAjouterIntervention(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Ajouter une intervention"
                    >
                      <PlusIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <EllipsisVerticalIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grille des jours */}
        <div className="bg-white">
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="grid border-b border-gray-100" style={{ gridTemplateColumns: `120px repeat(${collaborators.length}, 250px)` }}>
              {/* Colonne jour */}
              <div className="p-4 border-r border-gray-200 bg-gray-50">
                <div className="text-sm font-medium text-gray-900">
                  {getDayName(day.getDay())}
                </div>
                <div className="text-xs text-gray-500">
                  {day.getDate().toString().padStart(2, '0')}/{(day.getMonth() + 1).toString().padStart(2, '0')}
                </div>
              </div>
              
              {/* Colonnes collaborateurs */}
              {collaborators.map((collaborator) => {
                const interventions = getInterventionsForCollaboratorAndDay(collaborator.id, day);
                return (
                  <div key={collaborator.id} className="p-2 border-r border-gray-200 last:border-r-0 min-h-[100px] bg-white hover:bg-gray-50">
                    {interventions.map(intervention => (
                      <InterventionCard key={intervention.id} intervention={intervention} />
                    ))}
                    {interventions.length === 0 && (
                      <button
                        onClick={() => {
                          setSelectedCollaborator(collaborator.id);
                          setSelectedDate(day);
                          setShowAjouterIntervention(true);
                        }}
                        className="w-full h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      >
                        <PlusIcon className="w-5 h-5 text-gray-400" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Section boutons d'action
  const renderActionSection = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAjouterIntervention(true)}
          className="flex items-center space-x-2 bg-[#2170E3] text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Ajouter une intervention</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilterModal(true)}
          className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          <FunnelIcon className="w-5 h-5" />
          <span>Filtres</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {renderHeader()}
      {renderActionSection()}
      {renderCounters()}
      {renderResourceGrid()}
      
      <AjouterInterventionModal
        isOpen={showAjouterIntervention}
        onClose={() => setShowAjouterIntervention(false)}
        selectedDate={selectedDate}
      />
      
      <ResourceFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

const PlanningSemaine: React.FC = () => {
  return (
    <PlanningFiltersProvider>
      <PlanningSemaineContent />
    </PlanningFiltersProvider>
  );
};

export default PlanningSemaine;