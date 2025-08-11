import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellAlertIcon,
  FireIcon,
  SparklesIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SunIcon,
  CloudIcon,
  ArrowPathIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  PhoneIcon,
  VideoCameraIcon,
  GlobeAltIcon,
  Battery100Icon,
  SignalIcon,
  RocketLaunchIcon,
  StarIcon,
  HeartIcon,
  TrophyIcon,
  LightBulbIcon,
  BeakerIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2';

const MoisUltraPremium = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');
  const [filterType, setFilterType] = useState('all');
  const [showEventDetail, setShowEventDetail] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({});

  // Animation des statistiques
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedStats(prev => ({
        ...prev,
        liveInterventions: Math.floor(Math.random() * 5) + 12,
        teamActivity: Math.floor(Math.random() * 20) + 75
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Génération des jours du mois
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = new Date(year, month, -i);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    return days;
  };

  // Événements du mois avec données enrichies
  const monthEvents = [
    {
      date: new Date(2024, 7, 5),
      events: [
        { id: 1, title: 'Élagage urgent', type: 'urgent', amount: 850, status: 'completed' },
        { id: 2, title: 'Installation système', type: 'installation', amount: 1200, status: 'completed' }
      ]
    },
    {
      date: new Date(2024, 7, 8),
      events: [
        { id: 3, title: 'Création jardin', type: 'creation', amount: 3500, status: 'in_progress' }
      ]
    },
    {
      date: new Date(2024, 7, 12),
      events: [
        { id: 4, title: 'Entretien parc', type: 'maintenance', amount: 450, status: 'scheduled' },
        { id: 5, title: 'Diagnostic', type: 'diagnostic', amount: 180, status: 'scheduled' },
        { id: 6, title: 'Abattage', type: 'abattage', amount: 1800, status: 'scheduled' }
      ]
    },
    {
      date: new Date(2024, 7, 15),
      events: [
        { id: 7, title: 'Formation équipe', type: 'formation', amount: 0, status: 'scheduled' }
      ]
    },
    {
      date: new Date(2024, 7, 18),
      events: [
        { id: 8, title: 'Grand projet', type: 'creation', amount: 5500, status: 'confirmed' }
      ]
    },
    {
      date: new Date(2024, 7, 22),
      events: [
        { id: 9, title: 'Maintenance préventive', type: 'maintenance', amount: 680, status: 'scheduled' }
      ]
    },
    {
      date: new Date(2024, 7, 25),
      events: [
        { id: 10, title: 'Audit jardin', type: 'diagnostic', amount: 320, status: 'scheduled' },
        { id: 11, title: 'Taille haies', type: 'taille', amount: 280, status: 'scheduled' }
      ]
    },
    {
      date: new Date(2024, 7, 28),
      events: [
        { id: 12, title: 'Réunion client', type: 'meeting', amount: 0, status: 'scheduled' },
        { id: 13, title: 'Plantation automne', type: 'plantation', amount: 890, status: 'confirmed' }
      ]
    }
  ];

  // Stats mensuelles avancées
  const monthStats = {
    totalRevenue: 87650,
    totalInterventions: 156,
    completedInterventions: 134,
    avgSatisfaction: 4.9,
    newClients: 18,
    recurringClients: 42,
    teamUtilization: 89,
    weatherImpact: 8,
    profitMargin: 34,
    growthRate: 22
  };

  // Performance mensuelle pour graphiques
  const monthlyPerformance = {
    labels: ['S1', 'S2', 'S3', 'S4'],
    datasets: [
      {
        label: 'Revenus (k€)',
        data: [18.5, 22.3, 24.8, 22.0],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Interventions',
        data: [38, 42, 45, 31],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  // Distribution par type
  const typeDistribution = {
    labels: ['Élagage', 'Création', 'Entretien', 'Installation', 'Diagnostic', 'Autre'],
    datasets: [{
      data: [28, 22, 35, 18, 12, 15],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const getEventsForDate = (date) => {
    const event = monthEvents.find(e => 
      e.date.toDateString() === date.toDateString()
    );
    return event ? event.events : [];
  };

  const getEventTypeColor = (type) => {
    const colors = {
      urgent: 'from-red-500 to-orange-500',
      installation: 'from-blue-500 to-indigo-500',
      creation: 'from-purple-500 to-pink-500',
      maintenance: 'from-green-500 to-emerald-500',
      diagnostic: 'from-yellow-500 to-amber-500',
      abattage: 'from-red-600 to-red-800',
      formation: 'from-indigo-500 to-blue-500',
      plantation: 'from-green-600 to-teal-600',
      taille: 'from-cyan-500 to-blue-500',
      meeting: 'from-gray-500 to-gray-600'
    };
    return colors[type] || 'from-gray-400 to-gray-500';
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Ultra Futuriste */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Effet de particules animées */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * 1000,
                y: Math.random() * 200,
                opacity: Math.random()
              }}
              animate={{
                x: Math.random() * 1000,
                y: Math.random() * 200,
                opacity: [0.2, 1, 0.2]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <CalendarDaysIcon className="w-8 h-8 mr-3" />
                Planning Mensuel Quantum
              </h1>
              <p className="text-purple-100">Intelligence artificielle & prédictions avancées</p>
              
              {/* Status en temps réel */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5 text-green-300" />
                  <span className="text-sm">IA: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Charge: {monthStats.teamUtilization}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalIcon className="w-5 h-5" />
                  <span className="text-sm">Performance: Optimale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Mode: Turbo</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {monthStats.totalRevenue.toLocaleString()}€
              </div>
              <div className="text-purple-100">Chiffre d'affaires prévu</div>
              <div className="flex items-center justify-end mt-2 space-x-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-300" />
                <span className="text-green-300 font-semibold">+{monthStats.growthRate}%</span>
              </div>
            </div>
          </div>

          {/* Super KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3 mt-6">
            {[
              { label: 'Interventions', value: monthStats.totalInterventions, icon: '📋' },
              { label: 'Complétées', value: monthStats.completedInterventions, icon: '✅' },
              { label: 'Satisfaction', value: `⭐ ${monthStats.avgSatisfaction}`, icon: '' },
              { label: 'Nouveaux clients', value: monthStats.newClients, icon: '👥' },
              { label: 'Récurrents', value: monthStats.recurringClients, icon: '🔄' },
              { label: 'Utilisation', value: `${monthStats.teamUtilization}%`, icon: '⚡' },
              { label: 'Météo impact', value: `${monthStats.weatherImpact}%`, icon: '☔' },
              { label: 'Marge', value: `${monthStats.profitMargin}%`, icon: '💰' },
              { label: 'En cours', value: animatedStats.liveInterventions || 15, icon: '🔴' },
              { label: 'Activité', value: `${animatedStats.teamActivity || 85}%`, icon: '📊' }
            ].map((kpi, index) => (
              <motion.div 
                key={index}
                className="bg-white/20 backdrop-blur-lg rounded-lg p-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xl font-bold">
                  {kpi.icon} {kpi.value}
                </div>
                <div className="text-xs text-purple-100">{kpi.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                const newDate = new Date(currentMonth);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentMonth(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => {
                const newDate = new Date(currentMonth);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentMonth(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              Aujourd'hui
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="all">Tous types</option>
              <option value="urgent">Urgent</option>
              <option value="creation">Création</option>
              <option value="maintenance">Entretien</option>
              <option value="installation">Installation</option>
            </select>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded ${viewMode === 'calendar' ? 'bg-white shadow' : ''}`}
              >
                Calendrier
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`px-3 py-1 rounded ${viewMode === 'stats' ? 'bg-white shadow' : ''}`}
              >
                Stats
              </button>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowPathIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
              <PlusIcon className="w-5 h-5 inline mr-1" />
              Nouveau
            </button>
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
            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-semibold">
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 p-px">
              {getDaysInMonth().map((dayInfo, index) => {
                const events = getEventsForDate(dayInfo.date);
                const hasEvents = events.length > 0;
                const dayIsToday = isToday(dayInfo.date);
                const dayIsWeekend = isWeekend(dayInfo.date);
                
                return (
                  <motion.div
                    key={index}
                    className={`
                      bg-white min-h-[120px] p-2 cursor-pointer transition-all duration-300
                      ${!dayInfo.isCurrentMonth ? 'opacity-40' : ''}
                      ${dayIsToday ? 'ring-2 ring-purple-500 bg-purple-50' : ''}
                      ${dayIsWeekend && dayInfo.isCurrentMonth ? 'bg-gray-50' : ''}
                      hover:shadow-lg hover:z-10
                    `}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDate(dayInfo.date)}
                  >
                    <div className={`text-sm font-semibold mb-1 ${dayIsToday ? 'text-purple-600' : 'text-gray-700'}`}>
                      {dayInfo.date.getDate()}
                    </div>
                    
                    {hasEvents && (
                      <div className="space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <motion.div
                            key={event.id}
                            className={`px-1 py-0.5 rounded text-xs text-white bg-gradient-to-r ${getEventTypeColor(event.type)} cursor-pointer`}
                            whileHover={{ scale: 1.05 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowEventDetail(event);
                            }}
                          >
                            <div className="truncate font-medium">{event.title}</div>
                            {event.amount > 0 && (
                              <div className="text-xs opacity-90">{event.amount}€</div>
                            )}
                          </motion.div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-center text-gray-500 font-medium">
                            +{events.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {hasEvents && (
                      <div className="mt-1 flex justify-center">
                        <div className="flex space-x-1">
                          {events.map((_, i) => (
                            <div key={i} className="w-1 h-1 bg-purple-400 rounded-full" />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          {/* Performance Chart */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Mensuelle</h3>
            <div className="h-64">
              <Line
                data={monthlyPerformance}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 10,
                        usePointStyle: true,
                        font: { size: 11 }
                      }
                    }
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Revenus (k€)'
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Interventions'
                      },
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Type Distribution */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Type</h3>
            <div className="h-48">
              <Doughnut
                data={typeDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 10,
                        usePointStyle: true,
                        font: { size: 10 }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div 
            className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BeakerIcon className="w-5 h-5 mr-2" />
              Insights IA
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <TrophyIcon className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">Performance</span>
                </div>
                <p className="text-xs opacity-90">Meilleur mois depuis 6 mois</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <LightBulbIcon className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">Opportunité</span>
                </div>
                <p className="text-xs opacity-90">3 créneaux libres semaine 3</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <ExclamationTriangleIcon className="w-4 h-4 text-orange-300" />
                  <span className="text-sm font-semibold">Attention</span>
                </div>
                <p className="text-xs opacity-90">Surcharge prévue fin de mois</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                Rapport mensuel
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                <PhoneIcon className="w-5 h-5 inline mr-2" />
                Planifier réunion
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                <CheckCircleIcon className="w-5 h-5 inline mr-2" />
                Valider planning
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {showEventDetail && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventDetail(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${getEventTypeColor(showEventDetail.type)} p-6 text-white`}>
                <h3 className="text-xl font-bold">{showEventDetail.title}</h3>
                <p className="opacity-90 mt-1">Type: {showEventDetail.type}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Montant</span>
                  <span className="text-2xl font-bold text-gray-900">{showEventDetail.amount}€</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Statut</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    showEventDetail.status === 'completed' ? 'bg-green-100 text-green-700' :
                    showEventDetail.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    showEventDetail.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {showEventDetail.status}
                  </span>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    <EyeIcon className="w-5 h-5 inline mr-2" />
                    Détails
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    <PencilIcon className="w-5 h-5 inline mr-2" />
                    Modifier
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

export default MoisUltraPremium;