import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SunIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon,
  BoltIcon,
  FireIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  EyeIcon,
  SparklesIcon,
  CpuChipIcon,
  BeakerIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  StopCircleIcon,
  ArrowPathIcon,
  BellAlertIcon,
  LightBulbIcon,
  StarIcon,
  FlagIcon,
  MapPinIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const StatistiquesJourneeUltraPremium = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState('overview');
  const [animatedValues, setAnimatedValues] = useState({});

  // Mise à jour de l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animation des valeurs
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues({
        productivity: Math.random() * 15 + 75,
        tasksCompleted: Math.floor(Math.random() * 3) + 12,
        efficiency: Math.random() * 10 + 85,
        focus: Math.random() * 20 + 70
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Données du jour
  const todayStats = {
    date: currentTime.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    tasksCompleted: 14,
    tasksTotal: 18,
    hoursWorked: 6.5,
    hoursPlanned: 8,
    productivity: 87.5,
    efficiency: 92.3,
    breaks: 3,
    meetings: 2,
    urgentTasks: 2,
    score: 4.7
  };

  // Comparaison avec hier
  const yesterdayComparison = {
    tasksCompleted: +2,
    productivity: +5.2,
    efficiency: -1.8,
    hoursWorked: +0.5,
    score: +0.3
  };

  // Moyennes
  const averageStats = {
    tasksCompleted: 12.4,
    productivity: 82.1,
    efficiency: 88.7,
    hoursWorked: 7.2,
    score: 4.4
  };

  // Timeline des activités de la journée
  const timeline = [
    { time: '08:00', activity: 'Arrivée bureau', type: 'start', status: 'completed', duration: null },
    { time: '08:15', activity: 'Check emails et planning', type: 'admin', status: 'completed', duration: 15 },
    { time: '08:30', activity: 'Réunion équipe technique', type: 'meeting', status: 'completed', duration: 30 },
    { time: '09:00', activity: 'Installation système arrosage - Jardin Botanique', type: 'task', status: 'completed', duration: 120 },
    { time: '11:00', activity: 'Pause café', type: 'break', status: 'completed', duration: 15 },
    { time: '11:15', activity: 'Diagnostic problème - Villa Moderne', type: 'task', status: 'completed', duration: 90 },
    { time: '12:45', activity: 'Déjeuner', type: 'break', status: 'completed', duration: 60 },
    { time: '13:45', activity: 'Préparation devis - Résidence Harmony', type: 'task', status: 'completed', duration: 75 },
    { time: '15:00', activity: 'Appel client - TechCorp', type: 'communication', status: 'completed', duration: 20 },
    { time: '15:20', activity: 'Formation nouveau matériel', type: 'training', status: 'inProgress', duration: 40 },
    { time: '16:00', activity: 'Rapport hebdomadaire', type: 'admin', status: 'pending', duration: 60 },
    { time: '17:00', activity: 'Planification demain', type: 'planning', status: 'pending', duration: 30 }
  ];

  // Graphique productivité par heure
  const productivityByHour = {
    labels: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h'],
    datasets: [
      {
        label: 'Productivité aujourd\'hui',
        data: [65, 78, 92, 88, 45, 72, 85, 89, 75, 68],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Productivité hier',
        data: [58, 72, 85, 82, 40, 68, 78, 83, 79, 71],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.05)',
        tension: 0.4,
        fill: false,
        borderDash: [5, 5]
      },
      {
        label: 'Moyenne hebdo',
        data: [62, 75, 88, 85, 42, 70, 82, 86, 77, 69],
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        borderWidth: 1
      }
    ]
  };

  // Top 5 des tâches du jour
  const topTasks = [
    { 
      id: 1, 
      name: 'Installation système arrosage', 
      client: 'Jardin Botanique', 
      status: 'completed', 
      priority: 'haute',
      duration: '2h', 
      points: 85,
      satisfaction: 4.8 
    },
    { 
      id: 2, 
      name: 'Diagnostic problème technique', 
      client: 'Villa Moderne', 
      status: 'completed', 
      priority: 'urgente',
      duration: '1h30', 
      points: 75,
      satisfaction: 4.5 
    },
    { 
      id: 3, 
      name: 'Préparation devis détaillé', 
      client: 'Résidence Harmony', 
      status: 'completed', 
      priority: 'normale',
      duration: '1h15', 
      points: 65,
      satisfaction: 4.2 
    },
    { 
      id: 4, 
      name: 'Formation nouveau matériel', 
      client: 'Interne', 
      status: 'inProgress', 
      priority: 'normale',
      duration: '40min', 
      points: 45,
      satisfaction: null 
    },
    { 
      id: 5, 
      name: 'Rapport hebdomadaire', 
      client: 'Administratif', 
      status: 'pending', 
      priority: 'basse',
      duration: '1h', 
      points: 0,
      satisfaction: null 
    }
  ];

  // Objectifs vs réalisé
  const objectives = [
    { 
      name: 'Tâches terminées', 
      target: 15, 
      achieved: 14, 
      unit: '', 
      progress: 93.3,
      trend: 'up'
    },
    { 
      name: 'Heures productives', 
      target: 7, 
      achieved: 6.5, 
      unit: 'h', 
      progress: 92.9,
      trend: 'up'
    },
    { 
      name: 'Satisfaction client', 
      target: 4.5, 
      achieved: 4.7, 
      unit: '/5', 
      progress: 104.4,
      trend: 'up'
    },
    { 
      name: 'Efficacité processus', 
      target: 90, 
      achieved: 92.3, 
      unit: '%', 
      progress: 102.6,
      trend: 'up'
    }
  ];

  // Alertes et événements importants
  const alerts = [
    { 
      type: 'success', 
      title: 'Objectif dépassé', 
      message: 'Satisfaction client 104.4% de l\'objectif !',
      time: '15:20',
      priority: 'info'
    },
    { 
      type: 'warning', 
      title: 'Réunion dans 30min', 
      message: 'Formation nouveau matériel - Salle de réunion',
      time: '15:30',
      priority: 'medium'
    },
    { 
      type: 'info', 
      title: 'Tâche en retard', 
      message: 'Rapport hebdomadaire prévu à 16h00',
      time: '16:00',
      priority: 'low'
    }
  ];

  // Distribution du temps
  const timeDistribution = {
    labels: ['Tâches clients', 'Réunions', 'Administration', 'Formation', 'Pauses'],
    datasets: [{
      data: [65, 12, 15, 5, 3],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderWidth: 3,
      borderColor: '#fff'
    }]
  };

  // Utilitaires
  const getActivityIcon = (type) => {
    switch(type) {
      case 'start': return <PlayCircleIcon className="w-5 h-5" />;
      case 'task': return <DocumentTextIcon className="w-5 h-5" />;
      case 'meeting': return <UserIcon className="w-5 h-5" />;
      case 'break': return <PauseCircleIcon className="w-5 h-5" />;
      case 'admin': return <DocumentTextIcon className="w-5 h-5" />;
      case 'training': return <LightBulbIcon className="w-5 h-5" />;
      case 'planning': return <CalendarDaysIcon className="w-5 h-5" />;
      case 'communication': return <UserIcon className="w-5 h-5" />;
      default: return <ClockIcon className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type, status) => {
    if (status === 'completed') return 'bg-green-100 border-green-300 text-green-800';
    if (status === 'inProgress') return 'bg-blue-100 border-blue-300 text-blue-800';
    return 'bg-gray-100 border-gray-300 text-gray-600';
  };

  const getTaskStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'inProgress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgente': return 'text-red-600';
      case 'haute': return 'text-orange-600';
      case 'normale': return 'text-blue-600';
      case 'basse': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend, value) => {
    if (trend === 'up' || value > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (trend === 'down' || value < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <MinusIcon className="w-4 h-4 text-gray-500" />;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'from-green-500 to-green-600';
    if (progress >= 80) return 'from-blue-500 to-blue-600';
    if (progress >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
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
            className="absolute grid grid-cols-12 gap-1 w-full h-full"
            animate={{ rotate: [0, 1, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          >
            {[...Array(48)].map((_, i) => (
              <motion.div 
                key={i} 
                className="bg-white/10 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <SunIcon className="w-8 h-8 mr-3" />
                Statistiques Journée Ultra Premium
              </h1>
              <p className="text-purple-100">Suivi en temps réel avec analyse prédictive</p>
              <p className="text-sm text-purple-200 mt-1">{todayStats.date}</p>
              
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Live Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">IA Insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-5 h-5" />
                  <span className="text-sm">Prédictions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Performance Max</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{formatTime(currentTime)}</div>
              <div className="text-purple-100">Temps actuel</div>
              <div className="mt-2 flex items-center justify-end space-x-2">
                <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm font-bold">
                  Score: {todayStats.score}/5
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {todayStats.productivity}% productivité
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs du jour */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {todayStats.tasksCompleted}/{todayStats.tasksTotal}
              </div>
              <div className="text-sm text-gray-600">Tâches terminées</div>
            </div>
            <div className="flex flex-col items-end">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mb-1" />
              {getTrendIcon('up', yesterdayComparison.tasksCompleted)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(todayStats.tasksCompleted / todayStats.tasksTotal) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Vs hier: {yesterdayComparison.tasksCompleted > 0 ? '+' : ''}{yesterdayComparison.tasksCompleted}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring" }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {todayStats.hoursWorked}h
              </div>
              <div className="text-sm text-gray-600">Temps travaillé</div>
            </div>
            <div className="flex flex-col items-end">
              <ClockIcon className="w-6 h-6 text-blue-500 mb-1" />
              {getTrendIcon('up', yesterdayComparison.hoursWorked)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(todayStats.hoursWorked / todayStats.hoursPlanned) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Sur {todayStats.hoursPlanned}h planifiées
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {todayStats.productivity}%
              </div>
              <div className="text-sm text-gray-600">Productivité</div>
            </div>
            <div className="flex flex-col items-end">
              <BoltIcon className="w-6 h-6 text-yellow-500 mb-1" />
              {getTrendIcon('up', yesterdayComparison.productivity)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${todayStats.productivity}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Moy.: {averageStats.productivity}%
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.25, type: "spring" }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {todayStats.efficiency}%
              </div>
              <div className="text-sm text-gray-600">Efficacité</div>
            </div>
            <div className="flex flex-col items-end">
              <TrophyIcon className="w-6 h-6 text-purple-500 mb-1" />
              {getTrendIcon('down', yesterdayComparison.efficiency)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${todayStats.efficiency}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Vs hier: {yesterdayComparison.efficiency > 0 ? '+' : ''}{yesterdayComparison.efficiency}%
          </div>
        </motion.div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphiques et timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline des activités */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarDaysIcon className="w-6 h-6 mr-2 text-purple-500" />
              Timeline de la journée
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex items-start space-x-4 p-3 rounded-lg border-l-4 ${getActivityColor(item.type, item.status)}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.activity}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.time} {item.duration && `• ${item.duration}min`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.status === 'completed' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                        {item.status === 'inProgress' && <PlayCircleIcon className="w-4 h-4 text-blue-500 animate-pulse" />}
                        {item.status === 'pending' && <ClockIcon className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Graphique productivité */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivité par heure</h3>
            <div className="h-64">
              <Line
                data={productivityByHour}
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
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Top 5 tâches */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
              Top 5 Tâches du jour
            </h3>
            <div className="space-y-3">
              {topTasks.map((task, index) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                      index === 0 ? 'from-yellow-400 to-yellow-500' :
                      index === 1 ? 'from-green-400 to-green-500' :
                      index === 2 ? 'from-blue-400 to-blue-500' :
                      'from-gray-400 to-gray-500'
                    } flex items-center justify-center text-white font-bold text-sm`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{task.name}</div>
                      <div className="text-xs text-gray-500 flex items-center space-x-2">
                        <span>{task.client}</span>
                        <span>•</span>
                        <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full ${getTaskStatusColor(task.status)}`}>
                      {task.status === 'completed' && 'Terminé'}
                      {task.status === 'inProgress' && 'En cours'}
                      {task.status === 'pending' && 'En attente'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{task.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Objectifs vs réalisé */}
          <motion.div 
            className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrophyIcon className="w-5 h-5 mr-2" />
              Objectifs vs Réalisé
            </h3>
            <div className="space-y-4">
              {objectives.map((obj, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{obj.name}</span>
                    <span className="text-sm font-bold">
                      {obj.achieved}{obj.unit} / {obj.target}{obj.unit}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(obj.progress)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(obj.progress, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs opacity-90">{obj.progress.toFixed(1)}%</span>
                    {getTrendIcon(obj.trend)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Distribution du temps */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution du temps</h3>
            <div className="h-48">
              <Doughnut
                data={timeDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { padding: 10, usePointStyle: true, font: { size: 10 } }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Alertes */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BellAlertIcon className="w-5 h-5 mr-2" />
              Alertes & Événements
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{alert.title}</div>
                      <div className="text-xs opacity-90 mt-1">{alert.message}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs opacity-75">{alert.time}</div>
                      {alert.type === 'success' && <CheckCircleIcon className="w-4 h-4 text-green-300 mt-1" />}
                      {alert.type === 'warning' && <ExclamationTriangleIcon className="w-4 h-4 text-yellow-300 mt-1" />}
                      {alert.type === 'info' && <ClockIcon className="w-4 h-4 text-blue-300 mt-1" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatistiquesJourneeUltraPremium;