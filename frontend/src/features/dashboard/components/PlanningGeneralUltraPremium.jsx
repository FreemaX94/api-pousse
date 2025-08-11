import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  TrashIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const PlanningGeneralUltraPremium = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

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

      {/* Filtres et Vue */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
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

          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none w-64"
              />
            </div>

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
                      key={index}
                      className={`min-h-[120px] p-2 rounded-lg border-2 ${
                        day ? 'bg-white hover:shadow-lg cursor-pointer' : 'bg-gray-50'
                      } ${isToday ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                      whileHover={day ? { scale: 1.02 } : {}}
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
                                className={`p-1 rounded text-xs text-white bg-gradient-to-r ${getEventColor(event.type)} cursor-pointer`}
                                onClick={() => setSelectedEvent(event)}
                                whileHover={{ scale: 1.05 }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate font-medium">{event.time}</span>
                                  {getPriorityIcon(event.priority)}
                                </div>
                                <div className="truncate">{event.title}</div>
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
    </motion.div>
  );
};

export default PlanningGeneralUltraPremium;