import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Cog6ToothIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import LegendeModal from './LegendeModal';
import InterventionsSansDate from './InterventionsSansDate';
import OptionsAffichageModal from './OptionsAffichageModal';
import AjouterInterventionModal from './AjouterInterventionModal';
import { PlanningFiltersProvider, usePlanningFilters } from '../context/PlanningFiltersContext';
import { useDisplayOptions } from '../hooks/useDisplayOptions';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: string;
  client?: string;
  address?: string;
  collaborator?: string;
}

const PlanningGeneralContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('week');
  const [searchClient, setSearchClient] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showLegendeModal, setShowLegendeModal] = useState(false);
  const [showInterventionsSansDate, setShowInterventionsSansDate] = useState(false);
  const [showOptionsAffichage, setShowOptionsAffichage] = useState(false);
  const [showAjouterIntervention, setShowAjouterIntervention] = useState(false);
  const { filters } = usePlanningFilters();
  const { options } = useDisplayOptions();

  // Palette de couleurs pour les différents types d'interventions
  const eventColors = {
    maintenance: '#10B981',
    installation: '#3B82F6',
    diagnostic: '#F59E0B',
    reparation: '#EF4444',
    entretien: '#8B5CF6',
    livraison: '#06B6D4',
    formation: '#84CC16',
    autre: '#6B7280'
  };

  // Données d'exemple pour les événements
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Entretien jardins BNP',
      start: new Date(2025, 6, 14, 9, 0),
      end: new Date(2025, 6, 14, 11, 0),
      type: 'entretien',
      client: 'BNP PARIBAS',
      address: '16 Boulevard des Italiens, 75009 Paris',
      collaborator: 'Sophie Leroy'
    },
    {
      id: '2',
      title: 'Installation plantes SOCIETE GENERALE',
      start: new Date(2025, 6, 14, 14, 0),
      end: new Date(2025, 6, 14, 15, 30),
      type: 'installation',
      client: 'SOCIETE GENERALE',
      address: '29 Boulevard Haussmann, 75009 Paris',
      collaborator: 'Pierre Martin'
    },
    {
      id: '3',
      title: 'Maintenance bureaux CREDIT MUTUEL',
      start: new Date(2025, 6, 15, 9, 0),
      end: new Date(2025, 6, 15, 11, 0),
      type: 'maintenance',
      client: 'CREDIT MUTUEL',
      address: '88 Rue de Rivoli, 75001 Paris',
      collaborator: 'Marie Dubois'
    },
    {
      id: '4',
      title: 'CE Singular',
      start: new Date(2025, 6, 15, 11, 0),
      end: new Date(2025, 6, 15, 12, 0),
      type: 'autre',
      client: 'Singular',
      address: '38 Rue Des Jeûneurs, 75002 Paris',
      collaborator: 'Simon Henry'
    },
    {
      id: '5',
      title: 'Formation équipe',
      start: new Date(2025, 6, 17),
      end: new Date(2025, 6, 17),
      allDay: true,
      type: 'formation',
      client: 'Formation interne'
    }
  ];

  const views = [
    { key: 'day', label: 'Jour' },
    { key: 'week', label: 'Semaine' },
    { key: 'month', label: 'Mois' },
    { key: 'agenda', label: 'Liste' }
  ];

  const handlePrevious = () => {
    let newDate = new Date(currentDate);
    switch (currentView) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      default:
        newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    let newDate = new Date(currentDate);
    switch (currentView) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      default:
        newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateRange = (date: Date, view: string) => {
    if (view === 'week') {
      const startOfWeek = new Date(date);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Lundi
      startOfWeek.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const startStr = startOfWeek.getDate().toString().padStart(2, '0');
      const endStr = `${endOfWeek.getDate().toString().padStart(2, '0')} ${getMonthName(endOfWeek.getMonth()).toUpperCase()} ${endOfWeek.getFullYear()}`;
      
      return `${startStr} – ${endStr}`;
    } else if (view === 'month') {
      return `${getMonthName(date.getMonth()).toUpperCase()} ${date.getFullYear()}`;
    } else {
      return `${date.getDate().toString().padStart(2, '0')} ${getMonthName(date.getMonth()).toUpperCase()} ${date.getFullYear()}`;
    }
  };

  const getMonthName = (monthIndex: number) => {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    return months[monthIndex];
  };

  const getDayName = (dayIndex: number) => {
    const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
    return days[dayIndex];
  };

  const generateWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Lundi
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push(currentDay);
    }
    return days;
  };

  const getEventsForDay = (date: Date) => {
    return getFilteredEvents().filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Fonction pour filtrer les événements selon les filtres actifs
  const getFilteredEvents = () => {
    return mockEvents.filter(event => {
      // Filtrage par client (recherche)
      if (searchClient && !event.client?.toLowerCase().includes(searchClient.toLowerCase())) {
        return false;
      }

      // Filtrage par type d'activité
      if (filters.activityTypes.length > 0 && !filters.activityTypes.includes(event.type)) {
        return false;
      }

      // Filtrage par collaborateur
      if (filters.collaborators.none) {
        return !event.collaborator;
      }
      
      if (filters.collaborators.selected.length > 0 && event.collaborator) {
        // Mapper les noms aux IDs des collaborateurs
        const collaboratorMap: Record<string, string> = {
          'Sophie Leroy': 'estelle',
          'Pierre Martin': 'florence', 
          'Marie Dubois': 'lucie',
          'Simon Henry': 'simon',
          'Lucas Bernard': 'aymeric',
          'Jean Dupont': 'david',
          'Emma Moreau': 'elodie'
        };
        
        const collaboratorId = collaboratorMap[event.collaborator];
        if (collaboratorId && !filters.collaborators.selected.includes(collaboratorId)) {
          return false;
        }
      }

      return true;
    });
  };

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-4">
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
          {formatDateRange(currentDate, currentView)}
        </h1>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLegendeModal(true)}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
          >
            Légende et couleurs
          </motion.button>
          
          {options.interventionsSansDate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInterventionsSansDate(!showInterventionsSansDate)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showInterventionsSansDate
                  ? 'bg-[#2170E3] text-white border-[#2170E3]'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Interventions sans date
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOptionsAffichage(true)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            title="Options d'affichage"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAjouterIntervention(true)}
          className="flex items-center space-x-2 bg-[#2170E3] text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Ajouter une intervention</span>
        </motion.button>
      </div>
    </div>
  );

  const renderViewSwitcher = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex space-x-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('day')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'day'
              ? 'bg-[#2170E3] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          4 Jours
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('day')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'day'
              ? 'bg-[#2170E3] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Jour
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('week')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'week'
              ? 'bg-[#2170E3] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Semaine
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'month'
              ? 'bg-[#2170E3] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Mois
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('agenda')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
            currentView === 'agenda'
              ? 'bg-[#2170E3] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ListBulletIcon className="w-4 h-4" />
          <span>Liste</span>
        </motion.button>
      </div>
    </div>
  );

  const renderWeekView = () => {
    const weekDays = generateWeekDays(currentDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7h à 18h

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="bg-gray-50 p-4 border-r border-gray-200"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="bg-gray-50 p-4 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-sm font-medium text-gray-600">
                {getDayName((day.getDay() + 6) % 7 + 1)}. {day.getDate().toString().padStart(2, '0')}/{(day.getMonth() + 1).toString().padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Ligne "Toute la journée" */}
        <div className="grid grid-cols-8 bg-blue-50 border-b border-gray-200">
          <div className="p-2 text-xs text-gray-500 border-r border-gray-200 bg-gray-50">
            Toute la journée
          </div>
          {weekDays.map((day, index) => {
            const allDayEvents = getEventsForDay(day).filter(event => event.allDay);
            return (
              <div key={index} className="p-2 min-h-[40px] border-r border-gray-200 last:border-r-0">
                {allDayEvents.map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded text-white mb-1"
                    style={{ backgroundColor: eventColors[event.type as keyof typeof eventColors] }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Grille horaire */}
        <div className="max-h-96 overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-2 text-sm text-gray-500 border-r border-gray-200 bg-gray-50 w-16">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day).filter(event => 
                  !event.allDay && 
                  event.start.getHours() === hour
                );
                return (
                  <div key={dayIndex} className="p-1 min-h-[40px] border-r border-gray-200 last:border-r-0 relative hover:bg-gray-50">
                    {dayEvents.map(event => (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.02 }}
                        className="text-xs p-2 rounded text-white mb-1 cursor-pointer"
                        style={{ backgroundColor: eventColors[event.type as keyof typeof eventColors] }}
                        title={`${event.title} - ${event.client}`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="opacity-90">{event.client}</div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (currentView === 'week') {
      return renderWeekView();
    }
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Vue {currentView}</h3>
        <p className="text-gray-500">Cette vue sera implémentée prochainement.</p>
        <div className="mt-4 grid gap-4">
          {getFilteredEvents().map(event => (
            <div
              key={event.id}
              className="p-3 rounded-lg text-left"
              style={{ backgroundColor: eventColors[event.type as keyof typeof eventColors] + '20', borderLeft: `4px solid ${eventColors[event.type as keyof typeof eventColors]}` }}
            >
              <div className="font-medium text-gray-900">{event.title}</div>
              <div className="text-sm text-gray-600">{event.client}</div>
              <div className="text-xs text-gray-500">
                {event.start.toLocaleDateString()} {!event.allDay && `${event.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${event.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {renderHeader()}
      {renderViewSwitcher()}
      
      {/* Bandeau Interventions sans date */}
      {options.interventionsSansDate && (
        <InterventionsSansDate
          isOpen={showInterventionsSansDate}
          onClose={() => setShowInterventionsSansDate(false)}
        />
      )}
      
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
      
      <LegendeModal 
        isOpen={showLegendeModal} 
        onClose={() => setShowLegendeModal(false)} 
      />
      
      <OptionsAffichageModal
        isOpen={showOptionsAffichage}
        onClose={() => setShowOptionsAffichage(false)}
        context="planning-general"
      />
      
      <AjouterInterventionModal
        isOpen={showAjouterIntervention}
        onClose={() => setShowAjouterIntervention(false)}
      />
    </div>
  );
};

const PlanningGeneralSimple: React.FC = () => {
  return (
    <PlanningFiltersProvider>
      <PlanningGeneralContent />
    </PlanningFiltersProvider>
  );
};

export default PlanningGeneralSimple;