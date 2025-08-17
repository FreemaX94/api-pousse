import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  BellIcon,
  EyeIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  CpuChipIcon,
  SignalIcon,
  Battery100Icon,
  WifiIcon,
  GlobeAltIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  ExclamationCircleIcon,
  ArrowUpIcon,
  ChatBubbleBottomCenterTextIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  EnvelopeOpenIcon,
  LockClosedIcon,
  KeyIcon,
  IdentificationIcon,
  QrCodeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import UltraPremiumContainer from './UltraPremiumContainer';

const TableauDeBordDemandesClientUltraPremium = () => {
  const [realTimeData, setRealTimeData] = useState({
    activeRequests: 45,
    completedToday: 12,
    revenue: 28500,
    teamEfficiency: 94,
    avgResponseTime: 2.5,
    satisfactionScore: 4.7
  });
  
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showSlaModal, setShowSlaModal] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [showClientPortalModal, setShowClientPortalModal] = useState(false);
  const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'urgent', message: 'Demande urgente: Élagage tempête - Mairie Lyon', time: '09:15' },
    { id: 2, type: 'warning', message: 'Équipe retardée de 30min - Intervention Villa Beausoleil', time: '09:45' },
    { id: 3, type: 'success', message: 'Intervention terminée - Jardin Botanique', time: '10:20' },
    { id: 4, type: 'info', message: 'Nouvelle demande reçue - TechCorp Solutions', time: '10:35' }
  ]);

  // Simulation de données temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activeRequests: prev.activeRequests + Math.floor(Math.random() * 3) - 1,
        completedToday: prev.completedToday + (Math.random() > 0.8 ? 1 : 0),
        revenue: prev.revenue + Math.floor(Math.random() * 1000) - 500,
        teamEfficiency: Math.max(85, Math.min(98, prev.teamEfficiency + Math.random() * 2 - 1)),
        satisfactionScore: Math.max(4.0, Math.min(5.0, prev.satisfactionScore + Math.random() * 0.2 - 0.1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const kpis = [
    { 
      title: 'Demandes Actives', 
      value: realTimeData.activeRequests, 
      change: '+5%', 
      trend: 'up', 
      color: 'from-blue-500 to-blue-600',
      icon: ChartBarIcon 
    },
    { 
      title: 'Complétées Aujourd\'hui', 
      value: realTimeData.completedToday, 
      change: '+12%', 
      trend: 'up', 
      color: 'from-green-500 to-green-600',
      icon: CheckCircleIcon 
    },
    { 
      title: 'CA du Jour', 
      value: `${(realTimeData.revenue/1000).toFixed(0)}K€`, 
      change: '+8%', 
      trend: 'up', 
      color: 'from-purple-500 to-purple-600',
      icon: CurrencyEuroIcon 
    },
    { 
      title: 'Efficacité Équipe', 
      value: `${realTimeData.teamEfficiency.toFixed(0)}%`, 
      change: '+2%', 
      trend: 'up', 
      color: 'from-orange-500 to-orange-600',
      icon: UserGroupIcon 
    },
    { 
      title: 'Temps Moyen', 
      value: `${realTimeData.avgResponseTime.toFixed(1)}h`, 
      change: '-15%', 
      trend: 'down', 
      color: 'from-teal-500 to-teal-600',
      icon: ClockIcon 
    },
    { 
      title: 'Satisfaction', 
      value: `${realTimeData.satisfactionScore.toFixed(1)}/5`, 
      change: '+0.2', 
      trend: 'up', 
      color: 'from-pink-500 to-pink-600',
      icon: SparklesIcon 
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Nouvelle demande', client: 'Villa Moderne', time: '10:45', status: 'new' },
    { id: 2, action: 'Intervention terminée', client: 'Parc Tête d\'Or', time: '10:30', status: 'completed' },
    { id: 3, action: 'Équipe en route', client: 'TechCorp', time: '10:15', status: 'in_progress' },
    { id: 4, action: 'Devis approuvé', client: 'Château Fontaines', time: '09:50', status: 'approved' },
    { id: 5, action: 'Matériel livré', client: 'Résidence Harmonie', time: '09:30', status: 'delivered' }
  ];

  const topClients = [
    { name: 'Mairie de Lyon', requests: 24, revenue: '150K€', satisfaction: 4.9 },
    { name: 'TechCorp Solutions', requests: 18, revenue: '85K€', satisfaction: 4.8 },
    { name: 'Château de Fontaines', requests: 8, revenue: '95K€', satisfaction: 4.7 },
    { name: 'Résidence Harmonie', requests: 36, revenue: '42K€', satisfaction: 4.6 },
    { name: 'Jardin Botanique', requests: 15, revenue: '25K€', satisfaction: 4.8 }
  ];

  const teamPerformance = [
    { name: 'Marc Leblanc', efficiency: 96, interventions: 45, rating: 4.9 },
    { name: 'Paul Moreau', efficiency: 94, interventions: 42, rating: 4.8 },
    { name: 'Luc Bernard', efficiency: 92, interventions: 38, rating: 4.7 },
    { name: 'Jean Durand', efficiency: 90, interventions: 40, rating: 4.6 },
    { name: 'Pierre Martin', efficiency: 88, interventions: 35, rating: 4.5 }
  ];
  
  // Données de workflow
  const workflowSteps = [
    { id: 1, name: 'Réception', status: 'active', duration: '5 min', auto: true },
    { id: 2, name: 'Validation', status: 'waiting', duration: '15 min', auto: false },
    { id: 3, name: 'Attribution', status: 'pending', duration: '10 min', auto: true },
    { id: 4, name: 'Planification', status: 'pending', duration: '20 min', auto: false },
    { id: 5, name: 'Exécution', status: 'pending', duration: '120 min', auto: false },
    { id: 6, name: 'Validation Client', status: 'pending', duration: '30 min', auto: false }
  ];
  
  // Critères d'attribution automatique
  const assignmentCriteria = [
    { id: 1, name: 'Proximité géographique', weight: 40, enabled: true },
    { id: 2, name: 'Expertise requise', weight: 30, enabled: true },
    { id: 3, name: 'Charge de travail', weight: 20, enabled: true },
    { id: 4, name: 'Disponibilité', weight: 10, enabled: true }
  ];
  
  // SLA et alertes
  const slaRules = [
    { type: 'Réponse initiale', time: '2h', status: 'OK', alerts: 2 },
    { type: 'Intervention urgente', time: '4h', status: 'WARNING', alerts: 1 },
    { type: 'Résolution standard', time: '24h', status: 'OK', alerts: 0 },
    { type: 'Validation client', time: '48h', status: 'CRITICAL', alerts: 3 }
  ];
  
  // Escalade automatique
  const escalationRules = [
    { level: 1, trigger: 'SLA dépassé > 25%', action: 'Notification manager', enabled: true },
    { level: 2, trigger: 'SLA dépassé > 50%', action: 'Réattribution automatique', enabled: true },
    { level: 3, trigger: 'SLA dépassé > 100%', action: 'Escalade direction', enabled: false }
  ];

  const getAlertIcon = (type) => {
    switch(type) {
      case 'urgent': return <FireIcon className="w-5 h-5 text-red-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'info': return <BellIcon className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <UltraPremiumContainer
      title="Dashboard Demandes Client Quantum"
      icon={ChartBarIcon}
    >
      <div className="space-y-6">
        {/* Header avec indicateurs système */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Centre de Contrôle Temps Réel</h2>
              <p className="text-gray-200">Supervision avancée des demandes clients</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Système Actif</span>
              </div>
              <div className="flex items-center space-x-2">
                <SignalIcon className="w-5 h-5" />
                <span className="text-sm">Signal: Fort</span>
              </div>
              <div className="flex items-center space-x-2">
                <Battery100Icon className="w-5 h-5" />
                <span className="text-sm">Performance: 98%</span>
              </div>
              <div className="flex items-center space-x-2">
                <WifiIcon className="w-5 h-5 text-green-300" />
                <span className="text-sm">Connecté</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                className={`bg-gradient-to-br ${kpi.color} rounded-xl p-4 text-white relative overflow-hidden`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-8 h-8 text-white/80" />
                    <div className={`flex items-center space-x-1 ${kpi.trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
                      {kpi.trend === 'up' ? 
                        <ArrowTrendingUpIcon className="w-4 h-4" /> : 
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                      }
                      <span className="text-xs font-semibold">{kpi.change}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                  <div className="text-sm text-white/80">{kpi.title}</div>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-20">
                  <Icon className="w-16 h-16" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Alertes et Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alertes Temps Réel</h3>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                {alerts.filter(a => a.type === 'urgent').length} Urgente(s)
              </span>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.client}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Clients et Performance Équipe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clients</h3>
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <p className="font-semibold text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.requests} demandes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{client.revenue}</p>
                    <div className="flex items-center space-x-1">
                      <SparklesIcon className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{client.satisfaction}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Équipe</h3>
            <div className="space-y-3">
              {teamPerformance.map((member, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.interventions} interventions</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${member.efficiency}%` }}
                          transition={{ duration: 1, delay: 0.2 * index }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-green-600">{member.efficiency}%</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <SparklesIcon className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{member.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Panneaux de contrôle avancés */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <motion.div 
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowWorkflowModal(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CogIcon className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold">Workflow</h3>
                <p className="text-blue-100 text-sm">Validation multi-étapes</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">6</p>
                <p className="text-blue-100 text-xs">Étapes</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowAutoAssignModal(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <UserPlusIcon className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold">Attribution Auto</h3>
                <p className="text-green-100 text-sm">Selon critères</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">87%</p>
                <p className="text-green-100 text-xs">Précision</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowSlaModal(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <ClockIcon className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold">SLA</h3>
                <p className="text-orange-100 text-sm">Gestion temps</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">92%</p>
                <p className="text-orange-100 text-xs">Respect</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowClientPortalModal(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <ComputerDesktopIcon className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold">Portail Client</h3>
                <p className="text-purple-100 text-sm">Interface dédiée</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">45</p>
                <p className="text-purple-100 text-xs">Connectés</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Graphiques de tendances (simulés) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Demandes</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Graphique interactif des tendances</p>
                <p className="text-sm text-gray-500 mt-2">
                  +25% ce mois • Pic à 14h-16h • Croissance régulière
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Type</h3>
            <div className="space-y-3">
              {[
                { type: 'Élagage', count: 18, color: 'bg-green-500' },
                { type: 'Entretien', count: 15, color: 'bg-blue-500' },
                { type: 'Installation', count: 8, color: 'bg-purple-500' },
                { type: 'Diagnostic', count: 4, color: 'bg-orange-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${item.color} rounded`} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">{item.type}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <motion.div
                        className={`${item.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / 45) * 100}%` }}
                        transition={{ duration: 1, delay: 0.1 * index }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Modal de workflow de validation */}
        {showWorkflowModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Workflow de Validation Multi-Étapes</h2>
                <button
                  onClick={() => setShowWorkflowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <ExclamationCircleIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Étapes du workflow */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Étapes du Processus</h3>
                    <div className="space-y-3">
                      {workflowSteps.map((step, index) => {
                        const getStatusColor = (status) => {
                          switch(status) {
                            case 'active': return 'bg-blue-100 border-blue-300 text-blue-800';
                            case 'waiting': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
                            case 'pending': return 'bg-gray-100 border-gray-300 text-gray-600';
                            default: return 'bg-gray-100 border-gray-300 text-gray-600';
                          }
                        };
                        
                        return (
                          <motion.div
                            key={step.id}
                            className={`border-2 rounded-lg p-4 ${getStatusColor(step.status)}`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-sm">
                                  {step.id}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{step.name}</h4>
                                  <p className="text-sm opacity-75">Durée: {step.duration}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {step.auto && (
                                  <span className="px-2 py-1 bg-white/30 rounded text-xs font-medium">
                                    Auto
                                  </span>
                                )}
                                {step.status === 'active' && <PlayIcon className="w-5 h-5" />}
                                {step.status === 'waiting' && <PauseIcon className="w-5 h-5" />}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Configuration</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3">Validateurs par Étape</h4>
                        <div className="space-y-2">
                          {['Chef d\'equipe', 'Manager', 'Client'].map((validator, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <span className="text-sm">{validator}</span>
                              <input type="checkbox" defaultChecked className="rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3">Actions Automatiques</h4>
                        <div className="space-y-2">
                          {['Notification email', 'Mise à jour statut', 'Attribution équipe'].map((action, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <span className="text-sm">{action}</span>
                              <input type="checkbox" defaultChecked={i < 2} className="rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Performance</h4>
                        <div className="space-y-2 text-sm text-blue-800">
                          <div className="flex justify-between">
                            <span>Temps moyen total:</span>
                            <span className="font-semibold">3h 45min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Validation automatique:</span>
                            <span className="font-semibold">67%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taux de rejet:</span>
                            <span className="font-semibold">8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Sauvegarder
                </button>
                <button 
                  onClick={() => setShowWorkflowModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Modal d'attribution automatique */}
        {showAutoAssignModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-3xl w-full p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Attribution Automatique</h2>
                <button
                  onClick={() => setShowAutoAssignModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <ExclamationCircleIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Système Actif</h3>
                      <p className="text-green-700">87% de précision sur les 30 derniers jours</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Critères d'Attribution</h3>
                  <div className="space-y-4">
                    {assignmentCriteria.map(criteria => (
                      <div key={criteria.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              checked={criteria.enabled}
                              className="rounded"
                            />
                            <h4 className="font-medium">{criteria.name}</h4>
                          </div>
                          <span className="text-sm font-semibold text-blue-600">{criteria.weight}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${criteria.weight}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Statistiques Récentes</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">124</p>
                      <p className="text-sm text-blue-800">Attributions auto</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">18</p>
                      <p className="text-sm text-green-800">Réattributions</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">2.3h</p>
                      <p className="text-sm text-orange-800">Temps moyen</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Appliquer Modifications
                </button>
                <button 
                  onClick={() => setShowAutoAssignModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Modal de gestion SLA */}
        {showSlaModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-4xl w-full p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestion SLA & Alertes</h2>
                <button
                  onClick={() => setShowSlaModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <ExclamationCircleIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Règles SLA</h3>
                  <div className="space-y-4">
                    {slaRules.map((rule, index) => {
                      const getStatusColor = (status) => {
                        switch(status) {
                          case 'OK': return 'text-green-600 bg-green-100';
                          case 'WARNING': return 'text-yellow-600 bg-yellow-100';
                          case 'CRITICAL': return 'text-red-600 bg-red-100';
                          default: return 'text-gray-600 bg-gray-100';
                        }
                      };
                      
                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{rule.type}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(rule.status)}`}>
                              {rule.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Temps limite: <strong>{rule.time}</strong></span>
                            <span>Alertes actives: <strong>{rule.alerts}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Escalade Automatique</h3>
                    <div className="space-y-3">
                      {escalationRules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <input type="checkbox" checked={rule.enabled} className="rounded" />
                            <div>
                              <p className="font-medium text-sm">Niveau {rule.level}</p>
                              <p className="text-xs text-gray-600">{rule.trigger}</p>
                            </div>
                          </div>
                          <span className="text-sm text-blue-600 font-medium">{rule.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tableau de Bord Temps Réel</h3>
                  <div className="bg-gray-900 rounded-lg p-6 text-white">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-400">92%</p>
                        <p className="text-gray-300 text-sm">SLA Respecté</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-400">3</p>
                        <p className="text-gray-300 text-sm">Alertes Actives</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Demandes en cours</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                          <span>45</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>SLA dépassé</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                          <span>4</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Escalade en cours</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                          <span>1</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold">
                        ESCALADE D'URGENCE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Mettre à Jour SLA
                </button>
                <button 
                  onClick={() => setShowSlaModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Modal portail client */}
        {showClientPortalModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Portail Client Simulé</h2>
                <button
                  onClick={() => setShowClientPortalModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <ExclamationCircleIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <ComputerDesktopIcon className="w-12 h-12 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">Interface Client Dédiée</h3>
                    <p className="text-blue-700">Accès sécurisé pour le suivi en temps réel</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/80 rounded-lg p-4 text-center">
                    <IdentificationIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Connexion Sécurisée</p>
                    <p className="text-xs text-gray-600">SSO & 2FA</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 text-center">
                    <ClockIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Suivi Temps Réel</p>
                    <p className="text-xs text-gray-600">Statuts live</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 text-center">
                    <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Communication</p>
                    <p className="text-xs text-gray-600">Chat intégré</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 text-center">
                    <DocumentCheckIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Validation</p>
                    <p className="text-xs text-gray-600">Signature électronique</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vue Client - Tableau de Bord</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-gray-900">Mes Demandes</h4>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">3 actives</span>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { id: 'D001', title: 'Élagage chênes - Entrée principale', status: 'En cours', progress: 65 },
                        { id: 'D002', title: 'Entretien pelouse - Zone A', status: 'Planifié', progress: 25 },
                        { id: 'D003', title: 'Taille haies - Périmètre', status: 'Validation', progress: 90 }
                      ].map(demand => (
                        <div key={demand.id} className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-gray-900">{demand.title}</h5>
                            <span className="text-xs text-gray-500">#{demand.id}</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-blue-600 font-medium">{demand.status}</span>
                            <span className="text-sm text-gray-600">{demand.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${demand.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Nouvelle Demande
                      </button>
                      <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                        Historique
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fonctionnalités Avancées</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <DevicePhoneMobileIcon className="w-8 h-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold text-green-900">Application Mobile</h4>
                          <p className="text-green-700 text-sm">Notifications push et géolocalisation</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <QrCodeIcon className="w-8 h-8 text-purple-600" />
                        <div>
                          <h4 className="font-semibold text-purple-900">QR Codes</h4>
                          <p className="text-purple-700 text-sm">Accès rapide depuis le terrain</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <ShareIcon className="w-8 h-8 text-orange-600" />
                        <div>
                          <h4 className="font-semibold text-orange-900">Partage de Données</h4>
                          <p className="text-orange-700 text-sm">Export et intégration API</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <LockClosedIcon className="w-8 h-8 text-red-600" />
                        <div>
                          <h4 className="font-semibold text-red-900">Sécurité Renforcée</h4>
                          <p className="text-red-700 text-sm">Chiffrement bout-en-bout</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-900 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Statistiques d'Usage</h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-400">45</p>
                        <p className="text-gray-300 text-sm">Clients connectés</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-400">98%</p>
                        <p className="text-gray-300 text-sm">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Générer Accès Client
                </button>
                <button 
                  onClick={() => setShowClientPortalModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </UltraPremiumContainer>
  );
};

export default TableauDeBordDemandesClientUltraPremium;