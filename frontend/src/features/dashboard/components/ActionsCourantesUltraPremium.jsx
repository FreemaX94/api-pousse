import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BoltIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  FireIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  SignalIcon,
  Battery100Icon,
  ArrowTrendingUpIcon,
  BellAlertIcon,
  DocumentTextIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  PhotoIcon,
  PaperClipIcon,
  FlagIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

const ActionsCourantesUltraPremium = () => {
  const [activeActions, setActiveActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [liveTimer, setLiveTimer] = useState({});
  const [realTimeStats, setRealTimeStats] = useState({});

  // Simulation temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats({
        activeNow: Math.floor(Math.random() * 5) + 12,
        completionRate: Math.floor(Math.random() * 10) + 85,
        avgDuration: Math.floor(Math.random() * 20) + 40
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Actions courantes en temps réel
  const currentActions = [
    {
      id: 1,
      title: 'Élagage urgent - Arbre dangereux',
      type: 'urgent',
      priority: 'critical',
      status: 'in_progress',
      startTime: '08:00',
      elapsedTime: '2h 15min',
      progress: 65,
      technicien: 'Marc Leblanc',
      client: 'Mairie de Lyon',
      location: 'Parc de la Tête d\'Or',
      estimatedEnd: '10:30',
      tools: ['Tronçonneuse', 'Nacelle', 'Cordes'],
      risk: 'high',
      photos: 3,
      messages: 2
    },
    {
      id: 2,
      title: 'Installation arrosage automatique',
      type: 'installation',
      priority: 'normal',
      status: 'in_progress',
      startTime: '09:30',
      elapsedTime: '45min',
      progress: 30,
      technicien: 'Paul Moreau',
      client: 'Villa Moderne',
      location: '45 Rue des Jardins',
      estimatedEnd: '12:00',
      tools: ['Kit arrosage', 'Perceuse'],
      risk: 'low',
      photos: 1,
      messages: 0
    },
    {
      id: 3,
      title: 'Diagnostic maladie rosiers',
      type: 'diagnostic',
      priority: 'high',
      status: 'paused',
      startTime: '10:00',
      elapsedTime: '15min',
      progress: 20,
      technicien: 'Luc Bernard',
      client: 'Jardin Botanique',
      location: '8 Boulevard des Sciences',
      estimatedEnd: '11:00',
      tools: ['Kit diagnostic', 'Microscope'],
      risk: 'medium',
      photos: 5,
      messages: 1
    },
    {
      id: 4,
      title: 'Tonte et entretien pelouse',
      type: 'maintenance',
      priority: 'low',
      status: 'waiting',
      startTime: '14:00',
      elapsedTime: '0min',
      progress: 0,
      technicien: 'Jean Durand',
      client: 'Résidence Harmony',
      location: '23 Rue de la Paix',
      estimatedEnd: '16:00',
      tools: ['Tondeuse', 'Coupe-bordure'],
      risk: 'low',
      photos: 0,
      messages: 0
    },
    {
      id: 5,
      title: 'Création massif floral',
      type: 'creation',
      priority: 'normal',
      status: 'in_progress',
      startTime: '08:30',
      elapsedTime: '1h 45min',
      progress: 50,
      technicien: 'Pierre Martin',
      client: 'Entreprise TechCorp',
      location: '156 Avenue Innovation',
      estimatedEnd: '17:00',
      tools: ['Bêche', 'Terreau', 'Plants'],
      risk: 'low',
      photos: 4,
      messages: 3
    }
  ];

  // Stats globales
  const globalStats = {
    totalActive: 15,
    inProgress: realTimeStats.activeNow || 12,
    paused: 2,
    waiting: 1,
    completionRate: realTimeStats.completionRate || 89,
    avgDuration: realTimeStats.avgDuration || 52,
    satisfaction: 4.7,
    incidents: 1
  };

  // Graphique de charge par heure
  const workloadData = {
    labels: ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h'],
    datasets: [{
      label: 'Actions actives',
      data: [3, 5, 8, 7, 4, 2, 6, 8, 5, 3],
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  // Distribution par type
  const typeDistribution = {
    labels: ['Urgent', 'Installation', 'Diagnostic', 'Maintenance', 'Création'],
    datasets: [{
      data: [3, 4, 2, 5, 1],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(147, 51, 234, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'from-red-500 to-orange-500';
      case 'high': return 'from-orange-500 to-yellow-500';
      case 'normal': return 'from-blue-500 to-indigo-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'in_progress': return <PlayIcon className="w-5 h-5 text-green-500" />;
      case 'paused': return <PauseIcon className="w-5 h-5 text-yellow-500" />;
      case 'waiting': return <ClockIcon className="w-5 h-5 text-gray-400" />;
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  const getRiskBadge = (risk) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[risk] || colors.low;
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Dynamique */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Effet de pulsation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <BoltIcon className="w-8 h-8 mr-3 animate-pulse" />
                Actions Courantes Live
              </h1>
              <p className="text-green-100">Supervision temps réel et gestion dynamique</p>
              
              {/* Indicateurs Live */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Système actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5 text-green-300" />
                  <span className="text-sm">IA: Optimisation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Efficacité: {globalStats.completionRate}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalIcon className="w-5 h-5" />
                  <span className="text-sm">Temps réel</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{globalStats.inProgress}</div>
              <div className="text-green-100">Actions en cours</div>
              <div className="flex items-center justify-end mt-2 space-x-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-300" />
                <span className="text-green-300 font-semibold">Performance optimale</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Total actif', value: globalStats.totalActive, icon: '⚡', color: 'from-blue-500 to-indigo-500' },
          { label: 'En cours', value: globalStats.inProgress, icon: '🔄', color: 'from-green-500 to-emerald-500', pulse: true },
          { label: 'En pause', value: globalStats.paused, icon: '⏸️', color: 'from-yellow-500 to-amber-500' },
          { label: 'En attente', value: globalStats.waiting, icon: '⏳', color: 'from-gray-500 to-gray-600' },
          { label: 'Taux complétion', value: `${globalStats.completionRate}%`, icon: '📊', color: 'from-purple-500 to-pink-500' },
          { label: 'Durée moy.', value: `${globalStats.avgDuration}min`, icon: '⏱️', color: 'from-cyan-500 to-blue-500' },
          { label: 'Satisfaction', value: `⭐ ${globalStats.satisfaction}`, icon: '', color: 'from-yellow-400 to-orange-400' },
          { label: 'Incidents', value: globalStats.incidents, icon: '⚠️', color: 'from-red-500 to-rose-500', pulse: globalStats.incidents > 0 }
        ].map((kpi, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05, type: "spring" }}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`h-1 bg-gradient-to-r ${kpi.color}`} />
            <div className="p-3">
              <div className="text-xl font-bold text-gray-900 flex items-center">
                {kpi.icon} {kpi.value}
                {kpi.pulse && <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </div>
              <div className="text-xs text-gray-600">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des actions courantes */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <FireIcon className="w-5 h-5 mr-2" />
                Actions en Temps Réel
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {currentActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    className={`border-2 rounded-xl p-4 ${
                      action.status === 'in_progress' ? 'border-green-500 bg-green-50' :
                      action.status === 'paused' ? 'border-yellow-500 bg-yellow-50' :
                      'border-gray-200 bg-white'
                    } hover:shadow-lg transition-all duration-300 cursor-pointer`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedAction(action)}
                  >
                    {/* Header de l'action */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getPriorityColor(action.priority)} text-white`}>
                          {getStatusIcon(action.status)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{action.title}</h4>
                          <p className="text-sm text-gray-600">{action.client} - {action.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getRiskBadge(action.risk)}`}>
                          Risque: {action.risk}
                        </span>
                      </div>
                    </div>

                    {/* Infos de l'action */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-400" />
                        <span>{action.technicien}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span>{action.elapsedTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FlagIcon className="w-4 h-4 text-gray-400" />
                        <span>Fin: {action.estimatedEnd}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className="w-4 h-4 text-gray-400" />
                        <span>{action.tools.length} outils</span>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    {action.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progression</span>
                          <span className="font-semibold">{action.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${action.progress}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions rapides */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {action.photos > 0 && (
                          <div className="flex items-center space-x-1 text-gray-600">
                            <PhotoIcon className="w-4 h-4" />
                            <span className="text-xs">{action.photos}</span>
                          </div>
                        )}
                        {action.messages > 0 && (
                          <div className="flex items-center space-x-1 text-gray-600">
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                            <span className="text-xs">{action.messages}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {action.status === 'in_progress' && (
                          <button className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">
                            <PauseIcon className="w-4 h-4" />
                          </button>
                        )}
                        {action.status === 'paused' && (
                          <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                            <PlayIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <PhoneIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                          <DocumentTextIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          {/* Graphique de charge */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Charge de Travail</h3>
            <div className="h-48">
              <Line
                data={workloadData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 10
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Distribution par type */}
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

          {/* Alertes et Actions */}
          <motion.div 
            className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BellAlertIcon className="w-5 h-5 mr-2" />
              Alertes Actives
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Action critique en retard</span>
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300" />
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">3 actions en pause</span>
                  <PauseIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              <ArrowPathIcon className="w-5 h-5 inline mr-2" />
              Optimiser automatiquement
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActionsCourantesUltraPremium;