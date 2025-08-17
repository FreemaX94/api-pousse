import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, Reorder } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  BriefcaseIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellAlertIcon,
  FireIcon,
  SparklesIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  HeartIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  CurrencyEuroIcon,
  SunIcon,
  CloudIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  Cog6ToothIcon,
  CubeTransparentIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  ShareIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  SignalIcon,
  WifiIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const PlanningGeneralUltraPremium = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Nouvelles fonctionnalités avancées
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showMultiResourceView, setShowMultiResourceView] = useState(false);
  const [showConflictDetection, setShowConflictDetection] = useState(true);
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
  const [showiCalModal, setShowiCalModal] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [resources, setResources] = useState(['Marc L.', 'Paul M.', 'Luc B.', 'Jean D.', 'Pierre M.']);
  const [selectedResources, setSelectedResources] = useState([]);
  const [websocketStatus, setWebsocketStatus] = useState('connected');
  const [liveUpdates, setLiveUpdates] = useState(true);
  
  const dragControls = useDragControls();
  const calendarRef = useRef(null);

  // Données des événements enrichies
  const events = [
    {
      id: 1,
      date: new Date(2024, 7, 15),
      time: '09:00',
      endTime: '11:00',
      title: 'Élagage Urgent - Tempête',
      client: 'Villa Moderne',
      type: 'urgent',
      technicien: 'Marc Leblanc',
      status: 'confirmed',
      priority: 'high',
      amount: 450,
      location: '12 Rue des Jardins, Lyon',
      weather: 'sunny',
      completion: 0,
      team: ['Marc L.', 'Paul M.']
    },
    {
      id: 2,
      date: new Date(2024, 7, 15),
      time: '14:00',
      endTime: '17:00',
      title: 'Installation Arrosage Auto',
      client: 'Château de Versant',
      type: 'installation',
      technicien: 'Paul Moreau',
      status: 'in_progress',
      priority: 'normal',
      amount: 1200,
      location: '45 Avenue des Roses',
      weather: 'cloudy',
      completion: 65,
      team: ['Paul M.', 'Luc B.', 'Jean D.']
    },
    {
      id: 3,
      date: new Date(2024, 7, 16),
      time: '08:30',
      endTime: '12:30',
      title: 'Entretien Mensuel',
      client: 'Résidence Harmony',
      type: 'maintenance',
      technicien: 'Luc Bernard',
      status: 'scheduled',
      priority: 'low',
      amount: 280,
      location: '78 Chemin des Oliviers',
      weather: 'rainy',
      completion: 0,
      team: ['Luc B.']
    },
    {
      id: 4,
      date: new Date(2024, 7, 18),
      time: '10:00',
      endTime: '16:00',
      title: 'Création Jardin Japonais',
      client: 'Entreprise TechCorp',
      type: 'creation',
      technicien: 'Équipe complète',
      status: 'confirmed',
      priority: 'high',
      amount: 3500,
      location: '156 Boulevard Innovation',
      weather: 'sunny',
      completion: 0,
      team: ['Marc L.', 'Paul M.', 'Luc B.', 'Jean D.', 'Pierre M.']
    }
  ];

  // Stats en temps réel
  const stats = {
    totalEvents: 156,
    thisWeek: 24,
    inProgress: 8,
    completed: 132,
    revenue: 45780,
    satisfaction: 4.8,
    teamUtilization: 87,
    weatherImpact: 12
  };

  // Fonctions avancées pour les nouvelles fonctionnalités
  const detectConflicts = useCallback(() => {
    const detectedConflicts = [];
    events.forEach((event, index) => {
      events.slice(index + 1).forEach(otherEvent => {
        // Vérifier les chevauchements temporels et de ressources
        if (event.date.toDateString() === otherEvent.date.toDateString() &&
            event.team.some(member => otherEvent.team.includes(member))) {
          const eventStart = parseInt(event.time.replace(':', ''));
          const eventEnd = parseInt(event.endTime.replace(':', ''));
          const otherStart = parseInt(otherEvent.time.replace(':', ''));
          const otherEnd = parseInt(otherEvent.endTime.replace(':', ''));
          
          if ((eventStart < otherEnd && eventEnd > otherStart)) {
            detectedConflicts.push({
              id: `conflict-${event.id}-${otherEvent.id}`,
              event1: event,
              event2: otherEvent,
              type: 'overlap',
              severity: 'high'
            });
          }
        }
      });
    });
    setConflicts(detectedConflicts);
  }, [events]);

  // Simulation WebSocket pour mises à jour temps réel
  useEffect(() => {
    if (!liveUpdates) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // Simuler une mise à jour d'événement
        console.log('Mise à jour temps réel reçue');
        detectConflicts();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [liveUpdates, detectConflicts]);

  // Détection initiale des conflits
  useEffect(() => {
    if (showConflictDetection) {
      detectConflicts();
    }
  }, [showConflictDetection, detectConflicts]);

  // Fonctions drag & drop
  const handleDragStart = useCallback((event, eventData) => {
    setDraggedEvent(eventData);
    setIsDragging(true);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.target);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedEvent(null);
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event, targetDate, targetHour) => {
    event.preventDefault();
    if (draggedEvent) {
      // Logique de déplacement d'événement
      console.log(`Déplacer ${draggedEvent.title} vers ${targetDate} à ${targetHour}h`);
      // Ici vous pourriez mettre à jour l'état des événements
      detectConflicts();
    }
  }, [draggedEvent, detectConflicts]);

  // Génération iCal
  const generateiCalData = useCallback(() => {
    let icalData = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PousseApp//Planning//EN\n';
    
    events.forEach(event => {
      const startDate = new Date(event.date);
      const [hours, minutes] = event.time.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes));
      
      const endDate = new Date(event.date);
      const [endHours, endMinutes] = event.endTime.split(':');
      endDate.setHours(parseInt(endHours), parseInt(endMinutes));
      
      icalData += 'BEGIN:VEVENT\n';
      icalData += `UID:${event.id}@pousseapp.com\n`;
      icalData += `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
      icalData += `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
      icalData += `SUMMARY:${event.title}\n`;
      icalData += `DESCRIPTION:Client: ${event.client}\\nTechnicien: ${event.technicien}\\nMontant: ${event.amount}€\n`;
      icalData += `LOCATION:${event.location}\n`;
      icalData += 'END:VEVENT\n';
    });
    
    icalData += 'END:VCALENDAR';
    return icalData;
  }, [events]);

  const exportiCal = useCallback(() => {
    const icalData = generateiCalData();
    const blob = new Blob([icalData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'planning-pousse.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generateiCalData]);

  // Gestion des récurrences
  const createRecurrentEvent = useCallback((baseEvent, recurrence) => {
    const recurrentEvents = [];
    const { frequency, interval, endDate, daysOfWeek } = recurrence;
    
    let currentDate = new Date(baseEvent.date);
    const finalDate = new Date(endDate);
    
    while (currentDate <= finalDate) {
      if (frequency === 'weekly' && daysOfWeek.includes(currentDate.getDay())) {
        recurrentEvents.push({
          ...baseEvent,
          id: `${baseEvent.id}-${currentDate.getTime()}`,
          date: new Date(currentDate),
          isRecurrent: true,
          recurrenceId: baseEvent.id
        });
      }
      
      // Avancer selon la fréquence
      switch (frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7 * interval);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + interval);
          break;
        default:
          return recurrentEvents;
      }
    }
    
    return recurrentEvents;
  }, []);

  const getEventColor = (type) => {
    switch(type) {
      case 'urgent': return 'from-red-500 to-orange-500';
      case 'installation': return 'from-blue-500 to-indigo-500';
      case 'maintenance': return 'from-green-500 to-emerald-500';
      case 'creation': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <FireIcon className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'normal': return <BoltIcon className="w-4 h-4 text-yellow-500" />;
      case 'low': return <SparklesIcon className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getWeatherIcon = (weather) => {
    switch(weather) {
      case 'sunny': return <SunIcon className="w-4 h-4 text-yellow-500" />;
      case 'cloudy': return <CloudIcon className="w-4 h-4 text-gray-500" />;
      case 'rainy': return '🌧️';
      default: return null;
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Ultra Premium */}
      <motion.div 
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Planning Général Intelligence</h1>
              <p className="text-purple-100">Vue d'ensemble avec IA prédictive et optimisation</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5 inline mr-2" />
              Nouvelle Intervention
            </motion.button>
          </div>

          {/* KPIs Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <div className="text-xs text-purple-100">Total interventions</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <div className="text-xs text-purple-100">Cette semaine</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold flex items-center">
                {stats.inProgress}
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
              </div>
              <div className="text-xs text-purple-100">En cours</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-xs text-purple-100">Terminées</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">{(stats.revenue/1000).toFixed(0)}k€</div>
              <div className="text-xs text-purple-100">CA prévisionnel</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">⭐ {stats.satisfaction}</div>
              <div className="text-xs text-purple-100">Satisfaction</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">{stats.teamUtilization}%</div>
              <div className="text-xs text-purple-100">Utilisation équipe</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">☔ {stats.weatherImpact}%</div>
              <div className="text-xs text-purple-100">Impact météo</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Barre d'outils Ultra Premium avec nouvelles fonctionnalités */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Filtres */}
          <div className="flex items-center space-x-2">
            {['all', 'urgent', 'installation', 'maintenance', 'creation'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filterType === type
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'Tous' : type}
              </button>
            ))}
          </div>

          {/* Recherche et outils avancés */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none w-64"
              />
            </div>

            {/* Nouvelles fonctionnalités */}
            <div className="flex items-center space-x-2">
              {/* Multi-ressources */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMultiResourceView(!showMultiResourceView)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  showMultiResourceView 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Vue multi-ressources"
              >
                <UserGroupIcon className="w-5 h-5" />
              </motion.button>

              {/* Détection de conflits */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConflictDetection(!showConflictDetection)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  showConflictDetection
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Détection de conflits"
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
                {conflicts.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conflicts.length}
                  </span>
                )}
              </motion.button>

              {/* Import/Export iCal */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowiCalModal(true)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
                title="Import/Export iCal"
              >
                <ShareIcon className="w-5 h-5" />
              </motion.button>

              {/* Récurrences */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRecurrenceModal(true)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
                title="Gestion des récurrences"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </motion.button>

              {/* Status websocket */}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                websocketStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${websocketStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>Live</span>
              </div>
            </div>

            {/* Sélecteur de vue */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {['month', 'week', 'day'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded ${
                    viewMode === mode ? 'bg-white shadow' : ''
                  }`}
                >
                  {mode === 'month' ? 'Mois' : mode === 'week' ? 'Semaine' : 'Jour'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alertes de conflits */}
        <AnimatePresence>
          {conflicts.length > 0 && showConflictDetection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg"
            >
              <div className="flex items-center space-x-2 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-red-700">{conflicts.length} conflit(s) détecté(s)</span>
              </div>
              <div className="space-y-1">
                {conflicts.slice(0, 3).map(conflict => (
                  <div key={conflict.id} className="text-sm text-red-600">
                    • {conflict.event1.title} et {conflict.event2.title} - {conflict.event1.date.toLocaleDateString()}
                  </div>
                ))}
                {conflicts.length > 3 && (
                  <div className="text-sm text-red-500">... et {conflicts.length - 3} autre(s)</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier Principal */}
        <div className="lg:col-span-3">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Navigation Calendrier */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4">
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold">
                  {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h2>
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grille Calendrier */}
            <div className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  const dayEvents = day ? getEventsForDate(day) : [];
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  
                  return (
                    <motion.div
                      key={day ? day.toISOString() : `empty-${index}`}
                      className={`min-h-[120px] p-2 rounded-lg border-2 ${
                        day ? 'bg-white hover:shadow-lg cursor-pointer' : 'bg-gray-50'
                      } ${isToday ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                      whileHover={day ? { scale: 1.02 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-purple-600' : 'text-gray-700'}`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <motion.div
                                key={event.id}
                                className={`p-1 rounded text-xs text-white bg-gradient-to-r ${getEventColor(event.type)} cursor-pointer select-none`}
                                onClick={() => setSelectedEvent(event)}
                                whileHover={{ scale: 1.05 }}
                                whileDrag={{ scale: 1.1, zIndex: 1000 }}
                                drag={true}
                                dragConstraints={calendarRef}
                                onDragStart={(e) => handleDragStart(e, event)}
                                onDragEnd={handleDragEnd}
                                dragElastic={0.2}
                                dragMomentum={false}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate font-medium">{event.time}</span>
                                  {getPriorityIcon(event.priority)}
                                </div>
                                <div className="truncate">{event.title}</div>
                                {showMultiResourceView && (
                                  <div className="text-xs opacity-80 truncate">
                                    👥 {event.team.slice(0, 2).join(', ')}
                                  </div>
                                )}
                              </motion.div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-center text-gray-500 font-medium">
                                +{dayEvents.length - 2} autres
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Statistiques */}
        <div className="space-y-6">
          {/* Performance Équipe */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2 text-purple-500" />
              Performance Équipe
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Marc Leblanc', tasks: 8, completion: 87, status: 'active' },
                { name: 'Paul Moreau', tasks: 6, completion: 92, status: 'active' },
                { name: 'Luc Bernard', tasks: 5, completion: 78, status: 'pause' },
                { name: 'Jean Durand', tasks: 7, completion: 95, status: 'active' }
              ].map((member, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.tasks} tâches</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-600">{member.completion}%</div>
                    <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Météo Impact */}
          <motion.div 
            className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">Prévisions Météo</h3>
            <div className="space-y-2">
              {[
                { day: 'Aujourd\'hui', weather: '☀️', temp: '24°C', impact: 'Optimal' },
                { day: 'Demain', weather: '⛅', temp: '22°C', impact: 'Bon' },
                { day: 'Mercredi', weather: '🌧️', temp: '18°C', impact: 'Limité' }
              ].map((day, index) => (
                <div key={index} className="flex items-center justify-between bg-white/20 backdrop-blur-lg rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{day.weather}</span>
                    <div>
                      <div className="text-sm font-medium">{day.day}</div>
                      <div className="text-xs opacity-80">{day.temp}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    day.impact === 'Optimal' ? 'bg-green-400/30' : 
                    day.impact === 'Bon' ? 'bg-yellow-400/30' : 'bg-red-400/30'
                  }`}>
                    {day.impact}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions Rapides */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                <CheckCircleIcon className="w-5 h-5 inline mr-2" />
                Valider planning
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                Générer rapport
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                <BellAlertIcon className="w-5 h-5 inline mr-2" />
                Notifier équipes
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal Détail Event */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${getEventColor(selectedEvent.type)} p-6 text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedEvent.title}</h3>
                    <p className="opacity-90 mt-1">{selectedEvent.client}</p>
                  </div>
                  <div className="text-right">
                    {getPriorityIcon(selectedEvent.priority)}
                    <div className="text-2xl font-bold mt-2">{selectedEvent.amount}€</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{selectedEvent.date.toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{selectedEvent.time} - {selectedEvent.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{selectedEvent.team.join(', ')}</span>
                  </div>
                </div>

                {selectedEvent.completion > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span className="font-semibold">{selectedEvent.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                        style={{ width: `${selectedEvent.completion}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    <EyeIcon className="w-5 h-5 inline mr-2" />
                    Voir détails
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    <PencilIcon className="w-5 h-5 inline mr-2" />
                    Modifier
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal iCal Import/Export */}
      <AnimatePresence>
        {showiCalModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowiCalModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h3 className="text-xl font-bold flex items-center">
                  <ShareIcon className="w-6 h-6 mr-2" />
                  Import/Export iCal
                </h3>
                <p className="opacity-90 text-sm mt-1">Synchronisation avec calendriers externes</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={exportiCal}
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <ArrowDownTrayIcon className="w-8 h-8 mb-2" />
                    <span className="font-semibold">Exporter</span>
                    <span className="text-xs opacity-80">Télécharger .ics</span>
                  </button>
                  
                  <label className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <ArrowUpTrayIcon className="w-8 h-8 mb-2" />
                    <span className="font-semibold">Importer</span>
                    <span className="text-xs opacity-80">Fichier .ics</span>
                    <input type="file" accept=".ics" className="hidden" />
                  </label>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Synchronisation automatique</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
                      <div className="flex-1">
                        <div className="font-medium">Google Calendar</div>
                        <div className="text-xs text-gray-500">Synchronisation bidirectionnelle</div>
                      </div>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs">Connecter</button>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">O</div>
                      <div className="flex-1">
                        <div className="font-medium">Outlook</div>
                        <div className="text-xs text-gray-500">Import/export manuel</div>
                      </div>
                      <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-xs">Bientôt</button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowiCalModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Récurrences */}
      <AnimatePresence>
        {showRecurrenceModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRecurrenceModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <h3 className="text-xl font-bold flex items-center">
                  <ArrowPathIcon className="w-6 h-6 mr-2" />
                  Gestion des Récurrences
                </h3>
                <p className="opacity-90 text-sm mt-1">Créer des événements répétitifs intelligents</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="daily">Quotidien</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuel</option>
                      <option value="yearly">Annuel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intervalle</label>
                    <div className="flex items-center space-x-2">
                      <input type="number" min="1" max="30" defaultValue="1" className="w-16 px-2 py-2 border border-gray-300 rounded-lg" />
                      <span className="text-sm text-gray-600">semaine(s)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jours de la semaine</label>
                    <div className="flex space-x-2">
                      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                        <button
                          key={index}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-500 hover:text-white transition-colors text-sm font-medium"
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jusqu'au</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <LightBulbIcon className="w-5 h-5 text-purple-500" />
                      <span className="font-medium text-purple-800">IA Suggérée</span>
                    </div>
                    <div className="text-sm text-purple-700">
                      <p>• Entretiens: tous les 15 jours</p>
                      <p>• Élagages: selon saison</p>
                      <p>• Diagnostics: trimestriels</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    <CheckCircleIcon className="w-5 h-5 inline mr-2" />
                    Créer Récurrence
                  </button>
                  <button 
                    onClick={() => setShowRecurrenceModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlanningGeneralUltraPremium;