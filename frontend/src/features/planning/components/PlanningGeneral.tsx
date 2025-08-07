import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import LegendeModal from './LegendeModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/PlanningGeneral.css';

// Configuration de moment
const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: {
    client?: string;
    address?: string;
    collaborator?: string;
    type?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
  };
}

const PlanningGeneral: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('week');
  const [searchClient, setSearchClient] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showLegendeModal, setShowLegendeModal] = useState(false);

  // Palette de couleurs pour les différents types d'interventions
  const eventColors = {
    maintenance: { bg: '#10B981', border: '#059669', text: '#FFFFFF' },
    installation: { bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF' },
    diagnostic: { bg: '#F59E0B', border: '#D97706', text: '#FFFFFF' },
    reparation: { bg: '#EF4444', border: '#DC2626', text: '#FFFFFF' },
    entretien: { bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF' },
    livraison: { bg: '#06B6D4', border: '#0891B2', text: '#FFFFFF' },
    formation: { bg: '#84CC16', border: '#65A30D', text: '#FFFFFF' },
    autre: { bg: '#6B7280', border: '#4B5563', text: '#FFFFFF' }
  };

  // Données d'exemple pour les événements
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Entretien jardins BNP',
      start: new Date(2025, 6, 14, 9, 0),
      end: new Date(2025, 6, 14, 11, 0),
      resource: {
        client: 'BNP PARIBAS',
        address: '16 Boulevard des Italiens, 75009 Paris',
        collaborator: 'Sophie Leroy',
        type: 'entretien',
        backgroundColor: eventColors.entretien.bg,
        borderColor: eventColors.entretien.border,
        textColor: eventColors.entretien.text
      }
    },
    {
      id: '2',
      title: 'Installation plantes SOCIETE GENERALE',
      start: new Date(2025, 6, 14, 14, 0),
      end: new Date(2025, 6, 14, 15, 30),
      resource: {
        client: 'SOCIETE GENERALE',
        address: '29 Boulevard Haussmann, 75009 Paris',
        collaborator: 'Pierre Martin',
        type: 'installation',
        backgroundColor: eventColors.installation.bg,
        borderColor: eventColors.installation.border,
        textColor: eventColors.installation.text
      }
    },
    {
      id: '3',
      title: 'Maintenance bureaux CREDIT MUTUEL',
      start: new Date(2025, 6, 15, 9, 0),
      end: new Date(2025, 6, 15, 11, 0),
      resource: {
        client: 'CREDIT MUTUEL',
        address: '88 Rue de Rivoli, 75001 Paris',
        collaborator: 'Marie Dubois',
        type: 'maintenance',
        backgroundColor: eventColors.maintenance.bg,
        borderColor: eventColors.maintenance.border,
        textColor: eventColors.maintenance.text
      }
    },
    {
      id: '4',
      title: 'CE Singular',
      start: new Date(2025, 6, 15, 11, 0),
      end: new Date(2025, 6, 15, 12, 0),
      resource: {
        client: 'Singular',
        address: '38 Rue Des Jeûneurs, 75002 Paris',
        collaborator: 'Simon Henry',
        type: 'autre',
        backgroundColor: eventColors.autre.bg,
        borderColor: eventColors.autre.border,
        textColor: eventColors.autre.text
      }
    },
    {
      id: '5',
      title: 'Diagnostic plantes DANONE',
      start: new Date(2025, 6, 15, 14, 0),
      end: new Date(2025, 6, 15, 15, 0),
      resource: {
        client: 'DANONE',
        address: '17 Boulevard Haussmann, 75009 Paris',
        collaborator: 'Lucas Bernard',
        type: 'diagnostic',
        backgroundColor: eventColors.diagnostic.bg,
        borderColor: eventColors.diagnostic.border,
        textColor: eventColors.diagnostic.text
      }
    },
    {
      id: '6',
      title: 'CE L\'OREAL',
      start: new Date(2025, 6, 16, 10, 0),
      end: new Date(2025, 6, 16, 11, 0),
      resource: {
        client: 'L\'OREAL',
        address: '41 Rue Martre, 92110 Clichy',
        collaborator: 'Jean Dupont',
        type: 'autre',
        backgroundColor: eventColors.autre.bg,
        borderColor: eventColors.autre.border,
        textColor: eventColors.autre.text
      }
    },
    {
      id: '7',
      title: 'Formation équipe',
      start: new Date(2025, 6, 17),
      end: new Date(2025, 6, 17),
      allDay: true,
      resource: {
        client: 'Formation interne',
        type: 'formation',
        backgroundColor: eventColors.formation.bg,
        borderColor: eventColors.formation.border,
        textColor: eventColors.formation.text
      }
    },
    {
      id: '8',
      title: 'Arrosage automatique TOTAL',
      start: new Date(2025, 6, 14, 16, 0),
      end: new Date(2025, 6, 14, 17, 30),
      resource: {
        client: 'TOTAL ENERGIES',
        address: '2 Place Jean Millier, 92400 Courbevoie',
        collaborator: 'Emma Moreau',
        type: 'reparation',
        backgroundColor: eventColors.reparation.bg,
        borderColor: eventColors.reparation.border,
        textColor: eventColors.reparation.text
      }
    }
  ];

  const views = [
    { key: 'day', label: 'Jour' },
    { key: 'week', label: 'Semaine' },
    { key: 'month', label: 'Mois' },
    { key: 'agenda', label: 'Liste' }
  ];

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

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

  const formatDateRange = (date: Date, view: View) => {
    if (view === 'week') {
      const startOfWeek = moment(date).startOf('week').add(1, 'day'); // Lundi
      const endOfWeek = moment(date).endOf('week').add(1, 'day'); // Dimanche
      
      const startStr = startOfWeek.format('DD');
      const endStr = endOfWeek.format('DD MMM YYYY');
      
      return `${startStr} – ${endStr}`.toUpperCase();
    } else if (view === 'month') {
      return moment(date).format('MMMM YYYY').toUpperCase();
    } else {
      return moment(date).format('DD MMMM YYYY').toUpperCase();
    }
  };

  // Configuration des messages en français
  const messages = {
    allDay: 'Toute la journée',
    previous: 'Précédent',
    next: 'Suivant',
    today: 'Aujourd\'hui',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Liste',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement dans cette période',
    showMore: (total: number) => `+ ${total} de plus`
  };

  // Configuration des formats
  const formats = {
    dateFormat: 'DD',
    dayFormat: (date: Date) => moment(date).format('ddd DD/MM'),
    dayHeaderFormat: (date: Date) => moment(date).format('ddd DD/MM'),
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => 
      `${moment(start).format('DD')} – ${moment(end).format('DD MMM YYYY')}`,
    monthHeaderFormat: (date: Date) => moment(date).format('MMMM YYYY'),
    timeGutterFormat: (date: Date) => moment(date).format('HH:mm'),
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => 
      `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
    agendaTimeFormat: (date: Date) => moment(date).format('HH:mm'),
    agendaDateFormat: (date: Date) => moment(date).format('ddd DD MMM'),
    agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => 
      `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
  };

  // Style personnalisé pour les événements
  const eventStyleGetter = (event: Event) => {
    const backgroundColor = event.resource?.backgroundColor || '#3B82F6';
    const borderColor = event.resource?.borderColor || '#2563EB';
    const color = event.resource?.textColor || '#FFFFFF';
    
    return {
      style: {
        backgroundColor,
        borderColor,
        color,
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: '500',
        padding: '2px 4px'
      }
    };
  };

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {/* Ligne 1: Navigation et titre */}
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
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium flex items-center space-x-2"
          >
            <span>Légende et couleurs</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
          >
            Interventions sans date
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Ligne 2: Bouton + Ajouter intervention */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
          onClick={() => handleViewChange('day')}
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
          onClick={() => handleViewChange('day')}
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
          onClick={() => handleViewChange('week')}
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
          onClick={() => handleViewChange('month')}
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
          onClick={() => handleViewChange('agenda')}
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

  const CustomEvent = ({ event }: { event: Event }) => (
    <div className="custom-event">
      <div className="font-medium text-xs truncate">{event.title}</div>
      {event.resource?.client && (
        <div className="text-xs opacity-90 truncate">{event.resource.client}</div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {renderHeader()}
      {renderViewSwitcher()}
      
      <div className="flex-1 p-6">
        <div className="h-full calendar-container">
          <Calendar
            localizer={localizer}
            events={mockEvents}
            view={currentView}
            onView={handleViewChange}
            date={currentDate}
            onNavigate={handleNavigate}
            views={['month', 'week', 'day', 'agenda']}
            messages={messages}
            formats={formats}
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEvent
            }}
            popup={true}
            showMultiDayTimes={true}
            step={60}
            timeslots={1}
            min={new Date(0, 0, 0, 7, 0, 0)}
            max={new Date(0, 0, 0, 18, 0, 0)}
            onSelectEvent={(event) => {
              console.log('Event selected:', event);
            }}
            onSelectSlot={({ start, end }) => {
              console.log('Slot selected:', { start, end });
            }}
            selectable={true}
            style={{ height: '100%' }}
          />
        </div>
      </div>
      
      {/* Modal Légende */}
      <LegendeModal 
        isOpen={showLegendeModal} 
        onClose={() => setShowLegendeModal(false)} 
      />
    </div>
  );
};

export default PlanningGeneral;