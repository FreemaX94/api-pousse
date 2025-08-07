import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  FunnelIcon,
  EyeSlashIcon,
  EyeIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CheckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { PlanningFiltersProvider } from '../context/PlanningFiltersContext';
import AjouterInterventionModal from './AjouterInterventionModal';
import ResourceFilterModal from './ResourceFilterModal';
import OptionsAffichageModal from './OptionsAffichageModal';
import { type ResourceFilters } from '../hooks/useResourceFilters';

interface DayStatistics {
  date: Date;
  aFaire: number;
  termines: number;
  interventions: Intervention[];
}

interface Intervention {
  id: string;
  title: string;
  client: string;
  startTime?: string;
  endTime?: string;
  collaborator?: string;
  status: 'planifie' | 'effectue' | 'a_faire';
  type: string;
}

const PlanningMoisContent: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hideWeekends, setHideWeekends] = useState(false);
  const [showAjouterIntervention, setShowAjouterIntervention] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showOptionsAffichage, setShowOptionsAffichage] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDayPopover, setSelectedDayPopover] = useState<{ date: Date; x: number; y: number } | null>(null);
  const [activeFilters, setActiveFilters] = useState<ResourceFilters>({
    numero: '',
    titre: '',
    client: '',
    collaborateur: 'tous',
    categorie: 'toutes',
    actif: 'tous'
  });

  // Données d'exemple pour les interventions du mois
  const mockInterventions: Intervention[] = [
    {
      id: '1',
      title: 'Entretien jardins BNP',
      client: 'BNP PARIBAS',
      startTime: '09:00',
      endTime: '11:00',
      collaborator: 'Sophie Leroy',
      status: 'effectue',
      type: 'entretien'
    },
    {
      id: '2',
      title: 'Installation plantes SOCIETE GENERALE',
      client: 'SOCIETE GENERALE',
      startTime: '14:00',
      endTime: '16:00',
      collaborator: 'Pierre Martin',
      status: 'a_faire',
      type: 'installation'
    },
    {
      id: '3',
      title: 'Maintenance bureaux CREDIT MUTUEL',
      client: 'CREDIT MUTUEL',
      startTime: '10:00',
      endTime: '12:00',
      collaborator: 'Marie Dubois',
      status: 'effectue',
      type: 'maintenance'
    },
    {
      id: '4',
      title: 'Diagnostic plantes TOTAL',
      client: 'TOTAL ENERGIES',
      startTime: '15:00',
      endTime: '17:00',
      collaborator: 'Lucas Bernard',
      status: 'a_faire',
      type: 'diagnostic'
    },
    {
      id: '5',
      title: 'Formation équipe',
      client: 'Formation interne',
      collaborator: 'Simon Henry',
      status: 'planifie',
      type: 'formation'
    }
  ];

  // Navigation
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Gestion des filtres
  const handleFiltersChange = (filters: ResourceFilters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
  };

  // Formatage du mois
  const formatMonth = (date: Date) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Génération des jours du mois avec semaines
  const generateMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculer le premier lundi de la grille
    const startOfGrid = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Lundi = 1
    startOfGrid.setDate(firstDay.getDate() + diff);
    
    // Générer toutes les dates de la grille (6 semaines max)
    const days: Date[] = [];
    const weeksToShow = 6;
    const daysPerWeek = hideWeekends ? 5 : 7;
    
    for (let week = 0; week < weeksToShow; week++) {
      for (let day = 0; day < daysPerWeek; day++) {
        const currentDay = new Date(startOfGrid);
        currentDay.setDate(startOfGrid.getDate() + (week * 7) + day);
        days.push(currentDay);
      }
    }
    
    return days.filter(day => {
      // Garder seulement les jours proches du mois actuel
      const dayMonth = day.getMonth();
      return dayMonth === month || 
             dayMonth === (month - 1 + 12) % 12 || 
             dayMonth === (month + 1) % 12;
    });
  };

  const monthDays = useMemo(() => generateMonthDays(currentDate), [currentDate, hideWeekends]);

  // Calculer les statistiques pour un jour
  const getStatisticsForDay = (date: Date): DayStatistics => {
    const dayInterventions = mockInterventions.filter(intervention => {
      // Pour l'exemple, on attribue des interventions à des jours spécifiques
      const dayOfMonth = date.getDate();
      const interventionDay = (parseInt(intervention.id) * 3 + 14) % 31 + 1;
      return interventionDay === dayOfMonth;
    });

    return {
      date,
      aFaire: dayInterventions.filter(i => i.status === 'a_faire' || i.status === 'planifie').length,
      termines: dayInterventions.filter(i => i.status === 'effectue').length,
      interventions: dayInterventions
    };
  };

  // Vérifier si un jour appartient au mois actuel
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Vérifier si c'est aujourd'hui
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Gérer le clic sur un jour
  const handleDayClick = (date: Date, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedDayPopover({
      date,
      x: rect.right + 10,
      y: rect.top
    });
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
          {formatMonth(currentDate)}
        </h1>

        <div className="flex items-center space-x-3">
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

  // En-têtes des jours de la semaine
  const renderWeekHeaders = () => {
    const days = hideWeekends 
      ? ['LUN', 'MAR', 'MER', 'JEU', 'VEN']
      : ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

    return (
      <div className={`grid ${hideWeekends ? 'grid-cols-5' : 'grid-cols-7'} border-b border-gray-200`}>
        {days.map((day) => (
          <div key={day} className="bg-gray-50 p-4 text-center border-r border-gray-200 last:border-r-0">
            <span className="text-sm font-medium text-gray-600">{day}</span>
          </div>
        ))}
      </div>
    );
  };

  // Grille mensuelle
  const renderMonthGrid = () => {
    const weeks: Date[][] = [];
    const daysPerWeek = hideWeekends ? 5 : 7;
    
    for (let i = 0; i < monthDays.length; i += daysPerWeek) {
      weeks.push(monthDays.slice(i, i + daysPerWeek));
    }

    return (
      <div className="bg-white">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className={`grid ${hideWeekends ? 'grid-cols-5' : 'grid-cols-7'} border-b border-gray-100 last:border-b-0`}>
            {week.map((day, dayIndex) => {
              const stats = getStatisticsForDay(day);
              const isCurrentMonthDay = isCurrentMonth(day);
              const isTodayDay = isToday(day);
              
              return (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={(e) => handleDayClick(day, e)}
                  className={`
                    relative min-h-[100px] p-3 border-r border-gray-200 last:border-r-0 cursor-pointer
                    flex flex-col justify-start items-start
                    ${!isCurrentMonthDay ? 'bg-gray-50 text-gray-400' : ''}
                    ${isTodayDay ? 'bg-blue-50 border-blue-200' : ''}
                  `}
                >
                  {/* Numéro du jour */}
                  <div className={`text-sm font-medium mb-2 ${isTodayDay ? 'text-blue-600' : isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'}`}>
                    {day.getDate()}
                  </div>
                  
                  {/* Statistiques */}
                  {isCurrentMonthDay && (
                    <div className="space-y-1">
                      {/* À faire */}
                      <div className="flex items-center space-x-1">
                        <XCircleIcon className="w-3 h-3 text-red-500" />
                        <span className={`text-xs ${stats.aFaire > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                          {stats.aFaire} à faire
                        </span>
                      </div>
                      
                      {/* Terminés */}
                      <div className="flex items-center space-x-1">
                        <CheckIcon className="w-3 h-3 text-green-500" />
                        <span className={`text-xs ${stats.termines > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                          {stats.termines} terminé{stats.termines > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Mini-popover pour les détails du jour
  const renderDayPopover = () => {
    if (!selectedDayPopover) return null;

    const stats = getStatisticsForDay(selectedDayPopover.date);
    
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50" onClick={() => setSelectedDayPopover(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            style={{
              left: selectedDayPopover.x,
              top: selectedDayPopover.y
            }}
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedDayPopover.date.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </h3>
              <button
                onClick={() => setSelectedDayPopover(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            {/* Résumé */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="text-sm text-red-800">À faire</span>
                <span className="text-sm font-medium text-red-900">{stats.aFaire}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm text-green-800">Terminées</span>
                <span className="text-sm font-medium text-green-900">{stats.termines}</span>
              </div>
            </div>
            
            {/* Liste des interventions */}
            {stats.interventions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Interventions</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {stats.interventions.map(intervention => (
                    <div key={intervention.id} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="font-medium text-gray-900">{intervention.title}</div>
                      <div className="text-gray-600">{intervention.client}</div>
                      {intervention.startTime && (
                        <div className="text-gray-500">{intervention.startTime} - {intervention.endTime}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {stats.interventions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucune intervention prévue
              </p>
            )}
            
            {/* Lien vers vue jour */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Voir la vue jour →
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {renderHeader()}
      {renderActionSection()}
      
      <div className="flex-1 overflow-auto">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {renderWeekHeaders()}
          {renderMonthGrid()}
        </div>
      </div>

      {renderDayPopover()}
      
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
      
      <OptionsAffichageModal
        isOpen={showOptionsAffichage}
        onClose={() => setShowOptionsAffichage(false)}
        context="planning-general"
      />
    </div>
  );
};

const PlanningMois: React.FC = () => {
  return (
    <PlanningFiltersProvider>
      <PlanningMoisContent />
    </PlanningFiltersProvider>
  );
};

export default PlanningMois;