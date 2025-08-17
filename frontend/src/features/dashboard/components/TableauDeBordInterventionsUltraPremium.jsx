import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  TruckIcon,
  CurrencyEuroIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellAlertIcon,
  FireIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CpuChipIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  Battery100Icon,
  SignalIcon,
  PhotoIcon,
  DocumentTextIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2';

const TableauDeBordInterventionsUltraPremium = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [liveMetrics, setLiveMetrics] = useState({});
  const [pulseAnimation, setPulseAnimation] = useState(true);

  // Simulation de métriques en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics({
        activeInterventions: Math.floor(Math.random() * 5) + 8,
        techsOnField: Math.floor(Math.random() * 3) + 12,
        completionRate: Math.floor(Math.random() * 10) + 85,
        avgDuration: Math.floor(Math.random() * 30) + 90
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // KPIs dynamiques
  const kpis = {
    today: {
      total: 24,
      completed: 18,
      inProgress: 4,
      pending: 2,
      urgent: 3,
      revenue: 8450,
      satisfaction: 4.8,
      efficiency: 92
    },
    week: {
      total: 156,
      completed: 134,
      inProgress: 15,
      pending: 7,
      urgent: 12,
      revenue: 42350,
      satisfaction: 4.7,
      efficiency: 89
    },
    month: {
      total: 624,
      completed: 578,
      inProgress: 28,
      pending: 18,
      urgent: 35,
      revenue: 168900,
      satisfaction: 4.8,
      efficiency: 91
    }
  };

  const currentKpis = kpis[selectedPeriod];

  // Données pour graphiques
  const performanceData = {
    labels: ['8h', '10h', '12h', '14h', '16h', '18h'],
    datasets: [{
      label: 'Interventions',
      data: [3, 5, 8, 12, 10, 6],
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4,
      fill: true
    }, {
      label: 'Complétées',
      data: [2, 4, 7, 10, 9, 5],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const typeDistribution = {
    labels: ['Élagage', 'Taille', 'Abattage', 'Diagnostic', 'Plantation', 'Entretien'],
    datasets: [{
      data: [35, 25, 15, 10, 8, 7],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const teamPerformance = {
    labels: ['Efficacité', 'Rapidité', 'Qualité', 'Sécurité', 'Communication', 'Satisfaction'],
    datasets: [{
      label: 'Équipe A',
      data: [92, 88, 95, 98, 85, 94],
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgb(147, 51, 234)',
      pointBackgroundColor: 'rgb(147, 51, 234)',
    }, {
      label: 'Équipe B',
      data: [88, 92, 90, 95, 88, 91],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
    }]
  };

  // Interventions en cours
  const activeInterventions = [
    {
      id: 1,
      title: 'Élagage d\'urgence - Tempête',
      client: 'Mairie de Lyon',
      address: 'Parc de la Tête d\'Or',
      team: 'Équipe A',
      technicien: 'Marc L.',
      startTime: '08:00',
      progress: 75,
      priority: 'urgent',
      status: 'in_progress',
      estimatedEnd: '10:30',
      photos: 3
    },
    {
      id: 2,
      title: 'Installation système arrosage',
      client: 'Villa Moderne',
      address: '45 Rue des Jardins',
      team: 'Équipe B',
      technicien: 'Paul M.',
      startTime: '09:00',
      progress: 45,
      priority: 'normal',
      status: 'in_progress',
      estimatedEnd: '12:00',
      photos: 1
    },
    {
      id: 3,
      title: 'Diagnostic phytosanitaire',
      client: 'Jardin Botanique',
      address: '8 Bd des Sciences',
      team: 'Équipe C',
      technicien: 'Luc B.',
      startTime: '10:00',
      progress: 30,
      priority: 'low',
      status: 'in_progress',
      estimatedEnd: '11:30',
      photos: 5
    },
    {
      id: 4,
      title: 'Création jardin japonais',
      client: 'Entreprise TechCorp',
      address: '156 Avenue Innovation',
      team: 'Équipe D',
      technicien: 'Jean D.',
      startTime: '08:30',
      progress: 60,
      priority: 'normal',
      status: 'in_progress',
      estimatedEnd: '16:00',
      photos: 8
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'from-red-500 to-orange-500';
      case 'normal': return 'from-blue-500 to-indigo-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'in_progress': return <BoltIcon className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending': return <ClockIcon className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Futuriste */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation de fond */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <CommandLineIcon className="w-8 h-8 mr-3" />
                Centre de Contrôle Interventions
              </h1>
              <p className="text-purple-100">Supervision en temps réel avec IA prédictive</p>
              
              {/* Indicateurs Live */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Live</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5 text-green-300" />
                  <span className="text-sm">IA: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Capacité: {liveMetrics.completionRate || 90}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalIcon className="w-5 h-5" />
                  <span className="text-sm">Signal: Excellent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Mode: Performance Max</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {currentKpis.revenue.toLocaleString()}€
              </div>
              <div className="text-purple-100">Chiffre du jour</div>
              <div className="flex items-center justify-end mt-2 space-x-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-300" />
                <span className="text-green-300 font-semibold">+22%</span>
              </div>
            </div>
          </div>

          {/* Filtres période */}
          <div className="flex space-x-2 mt-6">
            {['today', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {period === 'today' ? 'Aujourd\'hui' : period === 'week' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Total', value: currentKpis.total, icon: '📊', color: 'from-blue-500 to-indigo-500' },
          { label: 'Terminées', value: currentKpis.completed, icon: '✅', color: 'from-green-500 to-emerald-500' },
          { label: 'En cours', value: liveMetrics.activeInterventions || currentKpis.inProgress, icon: '🔄', color: 'from-yellow-500 to-orange-500', pulse: true },
          { label: 'En attente', value: currentKpis.pending, icon: '⏳', color: 'from-gray-500 to-gray-600' },
          { label: 'Urgentes', value: currentKpis.urgent, icon: '🚨', color: 'from-red-500 to-pink-500', pulse: true },
          { label: 'Techniciens', value: liveMetrics.techsOnField || 15, icon: '👷', color: 'from-purple-500 to-violet-500' },
          { label: 'Satisfaction', value: `⭐ ${currentKpis.satisfaction}`, icon: '', color: 'from-yellow-400 to-yellow-600' },
          { label: 'Efficacité', value: `${currentKpis.efficiency}%`, icon: '⚡', color: 'from-cyan-500 to-blue-500' }
        ].map((kpi) => (
          <motion.div
            key={kpi.label}
            className={`bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`h-1 bg-gradient-to-r ${kpi.color}`} />
            <div className="p-4">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                {kpi.icon} {kpi.value}
                {kpi.pulse && (
                  <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <div className="text-xs text-gray-600 mt-1">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique Performance */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-purple-500" />
            Performance Temps Réel
          </h3>
          <div className="h-64">
            <Line
              data={performanceData}
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
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(147, 51, 234, 0.05)'
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Distribution par Type */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-purple-500" />
            Répartition par Type
          </h3>
          <div className="h-64">
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

        {/* Performance Équipes */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserGroupIcon className="w-5 h-5 mr-2 text-purple-500" />
            Performance Équipes
          </h3>
          <div className="h-64">
            <Radar
              data={teamPerformance}
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
                  r: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                      stepSize: 20
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Interventions en Cours */}
      <motion.div 
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
          <h3 className="text-lg font-semibold flex items-center">
            <FireIcon className="w-5 h-5 mr-2" />
            Interventions en Cours - Temps Réel
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeInterventions.map((intervention, index) => (
              <motion.div
                key={intervention.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{intervention.title}</h4>
                    <p className="text-sm text-gray-600">{intervention.client}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{intervention.address}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getPriorityColor(intervention.priority)}`}>
                    {intervention.priority === 'urgent' ? 'URGENT' : intervention.priority === 'normal' ? 'NORMAL' : 'FAIBLE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="w-4 h-4 text-gray-400" />
                    <span>{intervention.team}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span>{intervention.startTime} - {intervention.estimatedEnd}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progression</span>
                    <span className="font-semibold text-gray-900">{intervention.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${intervention.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <PhotoIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-600 ml-1">{intervention.photos}</span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <PhoneIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  {getStatusIcon(intervention.status)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Alertes et Notifications */}
      <motion.div 
        className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* Alertes */}
        <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BellAlertIcon className="w-5 h-5 mr-2" />
            Alertes Temps Réel
          </h3>
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Retard intervention #1823</span>
                </div>
                <span className="text-xs">Il y a 2 min</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FireIcon className="w-5 h-5 text-red-300" />
                  <span className="text-sm font-medium">Nouvelle urgence signalée</span>
                </div>
                <span className="text-xs">Il y a 5 min</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">Intervention #1820 terminée</span>
                </div>
                <span className="text-xs">Il y a 10 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Actions Rapides IA
          </h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              Optimiser planning du jour
            </button>
            <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              Réaffecter équipes disponibles
            </button>
            <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              Générer rapport journalier
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TableauDeBordInterventionsUltraPremium;