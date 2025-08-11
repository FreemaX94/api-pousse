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
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CogIcon,
  PrinterIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentCheckIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
  LightBulbIcon,
  GlobeAltIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar, Scatter, Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DemandesClientStatsPremium = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [animatedValue, setAnimatedValue] = useState(0);
  const [pulseAnimation, setPulseAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(100);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Super KPIs avec tendances
  const superKPIs = {
    nouvelles: { value: 24, trend: +15, status: 'hot', urgence: 8 },
    enCours: { value: 67, trend: +8, status: 'active', completion: 73 },
    urgentes: { value: 12, trend: +3, status: 'critical', delai: '2h' },
    retard: { value: 5, trend: -2, status: 'warning', impact: 'high' },
    completees: { value: 342, trend: +22, status: 'success', satisfaction: 4.8 },
    annulees: { value: 18, trend: -5, status: 'info', raison: 'Client' }
  };

  // Performance metrics avancées
  const performanceMetrics = {
    tempsReponse: { current: 1.2, target: 2, unit: 'heures' },
    tauxResolution: { current: 94.5, target: 90, unit: '%' },
    satisfactionClient: { current: 4.7, target: 4.5, unit: '/5' },
    tempsIntervention: { current: 3.4, target: 4, unit: 'heures' },
    tauxRappel: { current: 5.2, target: 10, unit: '%' },
    coutMoyen: { current: 285, target: 300, unit: '€' }
  };

  // Données pour graphiques avancés
  const evolutionData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
    datasets: [
      {
        label: 'Nouvelles demandes',
        data: [145, 159, 168, 182, 195, 212, 228, 245],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Demandes traitées',
        data: [132, 148, 155, 171, 185, 198, 215, 232],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Satisfaction',
        data: [85, 87, 88, 91, 92, 94, 95, 96],
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'hot': return <FireIcon className="w-6 h-6 text-red-500 animate-pulse" />;
      case 'active': return <BoltIcon className="w-6 h-6 text-blue-500" />;
      case 'critical': return <ExclamationTriangleIcon className="w-6 h-6 text-orange-500 animate-bounce" />;
      case 'warning': return <BellAlertIcon className="w-6 h-6 text-yellow-500" />;
      case 'success': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'info': return <LightBulbIcon className="w-6 h-6 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Ultra Premium */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <motion.h1 
                className="text-4xl font-bold mb-2"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                Centre de Commande Demandes Client
              </motion.h1>
              <p className="text-purple-100 text-lg">Intelligence artificielle et analytics avancés</p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <GlobeAltIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Mode: Temps Réel</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <ShieldCheckIcon className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">Système: Optimal</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <HeartIcon className="w-5 h-5 text-red-300 animate-pulse" />
                  <span className="text-sm font-medium">Santé: 98%</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-purple-100">Support Actif</div>
              <div className="mt-3">
                <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg">
                  Nouveau Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Super KPIs Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(superKPIs).map(([key, data], index) => (
          <motion.div
            key={key}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="p-4 relative z-10">
              <div className="flex justify-between items-start mb-3">
                {getStatusIcon(data.status)}
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  data.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {data.trend > 0 ? '+' : ''}{data.trend}%
                </span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {data.value}
              </div>
              <div className="text-xs text-gray-600 mt-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              {data.urgence && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-1.5 rounded-full animate-pulse" 
                    style={{ width: `${data.urgence * 10}%` }}></div>
                </div>
              )}
              {data.completion && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full" 
                    style={{ width: `${data.completion}%` }}></div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filtres Intelligents */}
      <motion.div 
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 mb-8"
      >
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25"></div>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="relative px-6 py-3 bg-white border-2 border-purple-200 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                >
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
              
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg flex items-center">
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filtres avancés
              </button>

              <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-lg font-medium hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 text-purple-500" />
                IA Insights
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Recherche intelligente..."
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 w-80 font-medium"
                />
              </div>
              <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <CogIcon className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <PrinterIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics Dashboard */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(performanceMetrics).map(([key, metric], index) => (
          <motion.div
            key={key}
            className="bg-white rounded-xl shadow-lg p-4 border-2 border-transparent hover:border-purple-200 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-xs text-gray-500 mb-2 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </div>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className={`text-2xl font-bold ${
                metric.current > metric.target ? 'text-green-600' : 
                metric.current < metric.target * 0.9 ? 'text-red-600' : 'text-blue-600'
              }`}>
                {metric.current}
              </span>
              <span className="text-sm text-gray-500">{metric.unit}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Cible: {metric.target}</span>
              {metric.current >= metric.target ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <motion.div 
                className={`h-1 rounded-full ${
                  metric.current >= metric.target ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                  'bg-gradient-to-r from-yellow-400 to-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Graphiques Avancés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Evolution Multi-Axes */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2" />
              Évolution & Performance
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Line
                data={evolutionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                          size: 11,
                          weight: '600'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(147, 51, 234, 0.9)',
                      titleFont: {
                        size: 14,
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 13
                      },
                      padding: 12,
                      cornerRadius: 8
                    }
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      grid: {
                        color: 'rgba(147, 51, 234, 0.05)'
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Satisfaction (%)'
                      },
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Répartition Intelligente */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ChartPieIcon className="w-6 h-6 mr-2" />
              Analyse par Catégorie
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Doughnut
                data={{
                  labels: ['Urgente', 'Normale', 'Planifiée', 'Maintenance', 'Support', 'Autre'],
                  datasets: [{
                    data: [12, 35, 28, 15, 8, 2],
                    backgroundColor: [
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(251, 191, 36, 0.8)',
                      'rgba(147, 51, 234, 0.8)',
                      'rgba(107, 114, 128, 0.8)'
                    ],
                    borderColor: [
                      'rgb(239, 68, 68)',
                      'rgb(59, 130, 246)',
                      'rgb(34, 197, 94)',
                      'rgb(251, 191, 36)',
                      'rgb(147, 51, 234)',
                      'rgb(107, 114, 128)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 10
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                          size: 12,
                          weight: '500'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(99, 102, 241, 0.9)',
                      titleFont: {
                        size: 14,
                        weight: 'bold'
                      },
                      callbacks: {
                        label: function(context) {
                          const value = context.parsed;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${context.label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Radar des Compétences */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <WrenchScrewdriverIcon className="w-6 h-6 mr-2" />
            Analyse Multidimensionnelle des Demandes
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <Radar
                data={{
                  labels: ['Urgence', 'Complexité', 'Coût', 'Temps', 'Ressources', 'Impact'],
                  datasets: [
                    {
                      label: 'Mois actuel',
                      data: [85, 75, 60, 90, 70, 95],
                      backgroundColor: 'rgba(147, 51, 234, 0.2)',
                      borderColor: 'rgb(147, 51, 234)',
                      pointBackgroundColor: 'rgb(147, 51, 234)',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: 'rgb(147, 51, 234)'
                    },
                    {
                      label: 'Mois précédent',
                      data: [75, 80, 65, 85, 65, 88],
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      borderColor: 'rgb(59, 130, 246)',
                      pointBackgroundColor: 'rgb(59, 130, 246)',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: 'rgb(59, 130, 246)'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    }
                  },
                  scales: {
                    r: {
                      angleLines: {
                        display: true,
                        color: 'rgba(147, 51, 234, 0.1)'
                      },
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
            
            {/* Métriques détaillées */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Indicateurs Clés en Temps Réel</h4>
              {[
                { label: 'Taux de résolution premier contact', value: 76, color: 'purple' },
                { label: 'Temps moyen de traitement', value: 84, color: 'blue' },
                { label: 'Satisfaction client immédiate', value: 92, color: 'green' },
                { label: 'Efficacité des interventions', value: 88, color: 'indigo' },
                { label: 'Optimisation des ressources', value: 79, color: 'yellow' }
              ].map((metric, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          metric.color === 'purple' ? 'from-purple-400 to-purple-600' :
                          metric.color === 'blue' ? 'from-blue-400 to-blue-600' :
                          metric.color === 'green' ? 'from-green-400 to-green-600' :
                          metric.color === 'indigo' ? 'from-indigo-400 to-indigo-600' :
                          'from-yellow-400 to-yellow-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-12 text-right">{metric.value}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DemandesClientStatsPremium;