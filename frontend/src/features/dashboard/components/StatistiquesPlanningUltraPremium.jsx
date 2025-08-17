import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BoltIcon,
  CpuChipIcon,
  BeakerIcon,
  RocketLaunchIcon,
  SparklesIcon,
  LightBulbIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  PresentationChartLineIcon,
  ScaleIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  CalendarDaysIcon,
  EyeIcon,
  BellAlertIcon,
  FireIcon,
  ShieldExclamationIcon,
  MapPinIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Bar, Line, Doughnut, Scatter } from 'react-chartjs-2';

const StatistiquesPlanningUltraPremium = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedView, setSelectedView] = useState('overview');
  const [showOptimization, setShowOptimization] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({});

  // Animation des valeurs temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues({
        occupationRate: Math.random() * 10 + 75,
        efficiency: Math.random() * 15 + 80,
        conflicts: Math.floor(Math.random() * 3) + 2,
        optimization: Math.random() * 20 + 65
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Données globales du planning
  const planningStats = {
    totalResources: 24,
    activeResources: 22,
    occupationRate: 87.5,
    efficiency: 92.3,
    conflicts: 3,
    optimizationPotential: 15.2,
    avgUtilization: 84.7,
    peakHours: '10h-16h'
  };

  // Taux d'occupation par ressource (graphique gauge simulé)
  const resourceOccupation = [
    { name: 'Jean Dupont', team: 'Technique', occupation: 95, capacity: 100, projects: 4, efficiency: 88 },
    { name: 'Sophie Dubois', team: 'Entretien', occupation: 92, capacity: 100, projects: 6, efficiency: 95 },
    { name: 'Pierre Lambert', team: 'Création', occupation: 88, capacity: 100, projects: 2, efficiency: 85 },
    { name: 'Marie Rousseau', team: 'Traitement', occupation: 85, capacity: 100, projects: 3, efficiency: 90 },
    { name: 'Antoine Moreau', team: 'Commercial', occupation: 78, capacity: 100, projects: 8, efficiency: 82 },
    { name: 'Camille Durand', team: 'Aménagement', occupation: 75, capacity: 100, projects: 2, efficiency: 92 }
  ];

  // Charge de travail par équipe
  const teamWorkload = {
    labels: ['Technique', 'Entretien', 'Création', 'Traitement', 'Commercial', 'Aménagement'],
    datasets: [
      {
        label: 'Charge actuelle (%)',
        data: [87, 91, 82, 78, 65, 73],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Capacité optimale (%)',
        data: [85, 85, 85, 85, 85, 85],
        backgroundColor: 'rgba(251, 191, 36, 0.3)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 2,
        borderDash: [5, 5]
      },
      {
        label: 'Charge projetée (%)',
        data: [92, 88, 89, 85, 72, 78],
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2
      }
    ]
  };

  // Prévisionnel vs réel
  const forecastVsActual = {
    labels: ['Sem -4', 'Sem -3', 'Sem -2', 'Sem -1', 'Cette sem', 'Sem +1', 'Sem +2', 'Sem +3', 'Sem +4'],
    datasets: [
      {
        label: 'Charge réelle',
        data: [78, 82, 85, 88, 87, null, null, null, null],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Prévisionnel initial',
        data: [75, 80, 82, 85, 83, 86, 84, 88, 90],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.05)',
        tension: 0.4,
        fill: false,
        borderDash: [3, 3]
      },
      {
        label: 'Prévisionnel ajusté',
        data: [null, null, null, null, 87, 89, 86, 84, 87],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Capacité max',
        data: [100, 100, 100, 100, 100, 100, 100, 100, 100],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'transparent',
        tension: 0,
        fill: false,
        borderDash: [5, 5],
        borderWidth: 1
      }
    ]
  };

  // Conflits et surcharges détectés
  const conflicts = [
    {
      type: 'overload',
      resource: 'Jean Dupont',
      team: 'Technique',
      date: '2024-08-15',
      severity: 'high',
      impact: 'Retard potentiel de 2h sur projet Jardin Botanique',
      solution: 'Réassigner tâche maintenance à Sophie'
    },
    {
      type: 'conflict',
      resource: 'Pierre Lambert',
      team: 'Création',
      date: '2024-08-16',
      severity: 'medium',
      impact: 'Double booking 14h-16h',
      solution: 'Reporter réunion client à 16h30'
    },
    {
      type: 'underload',
      resource: 'Antoine Moreau',
      team: 'Commercial',
      date: '2024-08-14',
      severity: 'low',
      impact: 'Capacité disponible 4h',
      solution: 'Assigner prospection nouveaux clients'
    }
  ];

  // Optimisation des ressources suggérée
  const optimizations = [
    {
      title: 'Rééquilibrage équipe Technique',
      impact: '+12% efficacité',
      effort: 'Moyen',
      timeframe: '2 jours',
      description: 'Redistribuer 2 tâches de Jean vers Sophie et Marie',
      roi: '85%',
      priority: 'high'
    },
    {
      title: 'Optimisation planning Commercial',
      impact: '+8% utilisation',
      effort: 'Faible',
      timeframe: '1 jour',
      description: 'Grouper rendez-vous clients par zone géographique',
      roi: '92%',
      priority: 'medium'
    },
    {
      title: 'Formation croisée équipes',
      impact: '+15% flexibilité',
      effort: 'Élevé',
      timeframe: '2 semaines',
      description: 'Former 2 personnes sur compétences transverses',
      roi: '78%',
      priority: 'low'
    }
  ];

  // Projection sur les semaines à venir
  const weeklyProjection = [
    {
      week: 'Semaine +1',
      expectedLoad: 89,
      riskLevel: 'medium',
      criticalResources: ['Jean Dupont', 'Sophie Dubois'],
      recommendations: 'Anticiper surcharge technique'
    },
    {
      week: 'Semaine +2', 
      expectedLoad: 86,
      riskLevel: 'low',
      criticalResources: ['Pierre Lambert'],
      recommendations: 'Planning équilibré'
    },
    {
      week: 'Semaine +3',
      expectedLoad: 84,
      riskLevel: 'low',
      criticalResources: [],
      recommendations: 'Capacité disponible pour urgences'
    },
    {
      week: 'Semaine +4',
      expectedLoad: 87,
      riskLevel: 'medium',
      criticalResources: ['Marie Rousseau'],
      recommendations: 'Prévoir renfort traitement'
    }
  ];

  // Distribution des types de tâches
  const taskDistribution = {
    labels: ['Maintenance', 'Création', 'Urgences', 'Commercial', 'Formation', 'Admin'],
    datasets: [{
      data: [35, 25, 15, 12, 8, 5],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderWidth: 3,
      borderColor: '#fff'
    }]
  };

  // KPIs temps réel
  const realtimeKPIs = [
    { label: 'Taux occupation', value: 87.5, target: 85, unit: '%', trend: 2.5, icon: ChartBarIcon },
    { label: 'Efficacité', value: 92.3, target: 90, unit: '%', trend: 2.3, icon: BoltIcon },
    { label: 'Conflits actifs', value: 3, target: 5, unit: '', trend: -40, icon: ExclamationTriangleIcon },
    { label: 'Optimisation', value: 15.2, target: 20, unit: '%', trend: -4.8, icon: LightBulbIcon }
  ];

  // Utilitaires
  const getOccupationColor = (rate) => {
    if (rate > 95) return 'from-red-500 to-red-600';
    if (rate > 85) return 'from-orange-500 to-orange-600';
    if (rate > 70) return 'from-green-500 to-green-600';
    return 'from-blue-500 to-blue-600';
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency > 90) return 'text-green-600';
    if (efficiency > 80) return 'text-blue-600';
    if (efficiency > 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  };

  const getConflictIcon = (type) => {
    switch(type) {
      case 'overload': return <FireIcon className="w-5 h-5 text-red-500" />;
      case 'conflict': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'underload': return <ClockIcon className="w-5 h-5 text-blue-500" />;
      default: return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute grid grid-cols-16 gap-1 w-full h-full"
            animate={{ 
              rotateX: [0, 10, 0],
              rotateY: [0, 5, 0] 
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          >
            {[...Array(64)].map((_, i) => (
              <motion.div 
                key={i} 
                className="bg-white/10 rounded-sm"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  delay: i * 0.05, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <CalendarIcon className="w-8 h-8 mr-3" />
                Statistiques Planning Ultra Premium
              </h1>
              <p className="text-purple-100">Optimisation intelligente des ressources avec IA prédictive</p>
              
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Temps réel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">IA Optimisation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-5 h-5" />
                  <span className="text-sm">Prédictions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Auto-Balance</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{planningStats.occupationRate}%</div>
              <div className="text-purple-100">Taux d'occupation</div>
              <div className="mt-2 flex items-center justify-end space-x-2">
                <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm font-bold">
                  {planningStats.activeResources}/{planningStats.totalResources} actifs
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {planningStats.conflicts} conflits
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contrôles */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
            </select>

            <select 
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="all">Toutes les équipes</option>
              <option value="technique">Technique</option>
              <option value="entretien">Entretien</option>
              <option value="creation">Création</option>
              <option value="commercial">Commercial</option>
            </select>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('overview')}
                className={`px-3 py-1 rounded ${selectedView === 'overview' ? 'bg-white shadow' : ''}`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setSelectedView('resources')}
                className={`px-3 py-1 rounded ${selectedView === 'resources' ? 'bg-white shadow' : ''}`}
              >
                Ressources
              </button>
              <button
                onClick={() => setSelectedView('conflicts')}
                className={`px-3 py-1 rounded ${selectedView === 'conflicts' ? 'bg-white shadow' : ''}`}
              >
                Conflits
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <ShareIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowOptimization(!showOptimization)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showOptimization ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <SparklesIcon className="w-5 h-5 inline mr-2" />
              IA Optimisation
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPIs temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {realtimeKPIs.map((kpi) => (
          <motion.div
            key={kpi.label}
            className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {kpi.value}{kpi.unit}
                </div>
                <div className="text-sm text-gray-600">{kpi.label}</div>
              </div>
              <div className="flex flex-col items-end">
                <kpi.icon className="w-6 h-6 text-purple-500 mb-1" />
                <div className={`text-sm font-bold ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Objectif: {kpi.target}{kpi.unit}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphiques principaux */}
        <div className="lg:col-span-2 space-y-6">
          {/* Taux d'occupation des ressources */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="w-6 h-6 mr-2 text-purple-500" />
              Taux d'occupation des ressources
            </h3>
            <div className="space-y-4">
              {resourceOccupation.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getOccupationColor(resource.occupation)} flex items-center justify-center text-white font-bold relative`}>
                        {resource.occupation}%
                        <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={`${(resource.occupation / 100) * 175.84} 175.84`}
                            className="text-white/30"
                          />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Gauge</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{resource.name}</div>
                      <div className="text-sm text-gray-600">Équipe {resource.team}</div>
                      <div className="text-xs text-gray-500">{resource.projects} projets actifs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getEfficiencyColor(resource.efficiency)}`}>
                      {resource.efficiency}% eff.
                    </div>
                    <div className="text-sm text-gray-600">
                      {resource.capacity - resource.occupation}% libre
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Charge de travail par équipe */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Charge de travail par équipe</h3>
            <div className="h-64">
              <Bar
                data={teamWorkload}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { padding: 15, usePointStyle: true, font: { size: 11 } }
                    }
                  },
                  scales: {
                    y: { 
                      beginAtZero: true, 
                      max: 100,
                      ticks: {
                        callback: (value) => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Prévisionnel vs réel */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prévisionnel vs Réel</h3>
            <div className="h-64">
              <Line
                data={forecastVsActual}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { padding: 15, usePointStyle: true, font: { size: 11 } }
                    }
                  },
                  scales: {
                    y: { 
                      beginAtZero: true, 
                      max: 110,
                      ticks: {
                        callback: (value) => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Conflits détectés */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-500" />
              Conflits & Surcharges
            </h3>
            <div className="space-y-3">
              {conflicts.map((conflict, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(conflict.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      {getConflictIcon(conflict.type)}
                      <div>
                        <div className="font-medium text-sm">{conflict.resource}</div>
                        <div className="text-xs text-gray-600">{conflict.team} • {conflict.date}</div>
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-700">{conflict.impact}</div>
                    <div className="text-xs text-blue-600 mt-1 font-medium">
                      💡 {conflict.solution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Optimisations suggérées */}
          {showOptimization && (
            <motion.div 
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Optimisations IA
              </h3>
              <div className="space-y-4">
                {optimizations.map((opt, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">{opt.title}</div>
                      <div className={`text-xs px-2 py-1 rounded-full bg-white/20 ${getPriorityColor(opt.priority)}`}>
                        {opt.priority}
                      </div>
                    </div>
                    <div className="text-xs opacity-90 mb-2">{opt.description}</div>
                    <div className="flex justify-between items-center text-xs">
                      <span>{opt.impact} • ROI {opt.roi}</span>
                      <span>{opt.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projection semaines à venir */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarDaysIcon className="w-5 h-5 mr-2 text-blue-500" />
              Projection 4 semaines
            </h3>
            <div className="space-y-3">
              {weeklyProjection.map((week, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">{week.week}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getRiskColor(week.riskLevel)}`}>
                      {week.riskLevel}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Charge prévue:</span>
                    <span className="font-bold text-gray-900">{week.expectedLoad}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${getOccupationColor(week.expectedLoad)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${week.expectedLoad}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    {week.criticalResources.length > 0 && (
                      <div>Ressources critiques: {week.criticalResources.join(', ')}</div>
                    )}
                    <div className="text-blue-600 font-medium mt-1">
                      💡 {week.recommendations}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Distribution des tâches */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution des tâches</h3>
            <div className="h-48">
              <Doughnut
                data={taskDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { padding: 8, usePointStyle: true, font: { size: 9 } }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatistiquesPlanningUltraPremium;