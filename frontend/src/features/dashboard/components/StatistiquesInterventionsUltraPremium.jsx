import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  TrophyIcon,
  StarIcon,
  RocketLaunchIcon,
  Battery100Icon,
  SignalIcon,
  CpuChipIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  ArrowPathIcon,
  PresentationChartLineIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  LightBulbIcon,
  AcademicCapIcon,
  BeakerIcon,
  CommandLineIcon,
  ScaleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar, Scatter, PolarArea } from 'react-chartjs-2';

const StatistiquesInterventionsUltraPremium = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [realTimeData, setRealTimeData] = useState({});
  const [animateCharts, setAnimateCharts] = useState(true);

  // Simulation de données temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        todayRevenue: Math.floor(Math.random() * 1000) + 4000,
        currentEfficiency: Math.floor(Math.random() * 10) + 85,
        activeInterventions: Math.floor(Math.random() * 5) + 10
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Métriques globales
  const globalMetrics = {
    totalInterventions: 342,
    completedInterventions: 298,
    cancelledInterventions: 12,
    pendingInterventions: 32,
    totalRevenue: 185420,
    avgRevenuePerIntervention: 542,
    totalHours: 1456,
    avgDuration: 4.3,
    clientSatisfaction: 4.7,
    teamEfficiency: 89,
    onTimeDelivery: 94,
    recurringRevenue: 45200,
    newClients: 28,
    returnClients: 156,
    topPerformer: 'Marc Leblanc',
    topClient: 'Mairie de Lyon'
  };

  // Évolution temporelle
  const timeSeriesData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
    datasets: [
      {
        label: 'Chiffre d\'affaires',
        data: [18500, 22300, 19800, 24500, 28900, 26700, 31200, 29500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Nombre d\'interventions',
        data: [32, 38, 35, 42, 48, 44, 52, 45],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Distribution par type
  const typeDistribution = {
    labels: ['Élagage', 'Installation', 'Entretien', 'Création', 'Diagnostic', 'Urgence'],
    datasets: [{
      data: [85, 62, 98, 45, 38, 14],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Performance équipes (Radar)
  const teamPerformance = {
    labels: ['Productivité', 'Qualité', 'Ponctualité', 'Satisfaction', 'Rentabilité', 'Sécurité'],
    datasets: [
      {
        label: 'Équipe A',
        data: [92, 88, 95, 91, 87, 98],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Équipe B',
        data: [85, 92, 88, 89, 90, 95],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      },
      {
        label: 'Moyenne',
        data: [88, 90, 91, 90, 88, 96],
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 2,
        borderDash: [5, 5]
      }
    ]
  };

  // Top clients par CA
  const topClients = {
    labels: ['Mairie Lyon', 'TechCorp', 'Jardin Bot.', 'Villa Moderne', 'Rés. Harmony'],
    datasets: [{
      label: 'Chiffre d\'affaires',
      data: [45000, 32000, 28000, 22000, 18000],
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 2
    }]
  };

  // Analyse saisonnière (Polar)
  const seasonalAnalysis = {
    labels: ['Printemps', 'Été', 'Automne', 'Hiver'],
    datasets: [{
      label: 'Activité saisonnière',
      data: [95, 100, 75, 45],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Corrélation prix/satisfaction (Scatter)
  const priceQualityCorrelation = {
    datasets: [{
      label: 'Interventions',
      data: Array.from({ length: 30 }, () => ({
        x: Math.random() * 1000 + 100,
        y: Math.random() * 2 + 3.5
      })),
      backgroundColor: 'rgba(147, 51, 234, 0.6)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 1
    }]
  };

  // Tendances et prévisions
  const trends = {
    revenue: { current: 29500, previous: 26700, trend: 'up', percentage: 10.5 },
    interventions: { current: 45, previous: 44, trend: 'up', percentage: 2.3 },
    avgDuration: { current: 4.3, previous: 4.8, trend: 'down', percentage: -10.4 },
    satisfaction: { current: 4.7, previous: 4.6, trend: 'up', percentage: 2.2 },
    efficiency: { current: 89, previous: 85, trend: 'up', percentage: 4.7 },
    costs: { current: 18500, previous: 17200, trend: 'up', percentage: 7.6 }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />;
    return <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />;
  };

  const getMetricColor = (percentage) => {
    if (percentage > 0) return 'text-green-600';
    if (percentage < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Analytique */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation de données */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,.1) 2px, rgba(255,255,255,.1) 4px)',
            animation: 'slide 10s linear infinite'
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <ChartBarIcon className="w-8 h-8 mr-3" />
                Analytics & Intelligence Dashboard
              </h1>
              <p className="text-purple-100">Analyse avancée et prédictions IA</p>
              
              {/* Indicateurs IA */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Analyse en cours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">Machine Learning actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-5 h-5" />
                  <span className="text-sm">Prédictions: 95% précision</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Mode avancé</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {(globalMetrics.totalRevenue / 1000).toFixed(0)}K€
              </div>
              <div className="text-purple-100">Chiffre d'affaires total</div>
              <div className="mt-3 flex items-center justify-end space-x-3">
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  ROI: +23%
                </div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {globalMetrics.totalInterventions} interventions
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs principaux avec tendances */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(trends).map(([key, data], index) => (
          <motion.div
            key={key}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05, type: "spring" }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                {getTrendIcon(data.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {typeof data.current === 'number' && data.current > 1000 
                  ? `${(data.current / 1000).toFixed(1)}K` 
                  : data.current}
                {key === 'revenue' || key === 'costs' ? '€' : key === 'satisfaction' ? '/5' : key === 'efficiency' ? '%' : ''}
              </div>
              <div className={`text-xs mt-1 font-semibold ${getMetricColor(data.percentage)}`}>
                {data.percentage > 0 ? '+' : ''}{data.percentage}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sélecteurs et filtres */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Période */}
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>

            {/* Métrique */}
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="revenue">Chiffre d'affaires</option>
              <option value="interventions">Interventions</option>
              <option value="satisfaction">Satisfaction</option>
              <option value="efficiency">Efficacité</option>
            </select>

            {/* Mode comparaison */}
            <button 
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                comparisonMode ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <ScaleIcon className="w-5 h-5 inline mr-2" />
              Comparaison {comparisonMode ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <DocumentArrowDownIcon className="w-5 h-5 inline mr-2" />
              Export rapport
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grille de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Évolution temporelle */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PresentationChartLineIcon className="w-5 h-5 mr-2 text-purple-600" />
            Évolution Mensuelle
          </h3>
          <div className="h-64">
            <Line
              data={timeSeriesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 10,
                      usePointStyle: true,
                      font: { size: 10 }
                    }
                  }
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                      callback: (value) => `${value / 1000}K€`
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                      drawOnChartArea: false
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Distribution par type */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartPieIcon className="w-5 h-5 mr-2 text-indigo-600" />
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

        {/* Performance équipes */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-yellow-600" />
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
                      font: { size: 10 }
                    }
                  }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Top clients */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <StarIcon className="w-5 h-5 mr-2 text-purple-600" />
            Top Clients
          </h3>
          <div className="h-64">
            <Bar
              data={topClients}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  x: {
                    ticks: {
                      callback: (value) => `${value / 1000}K€`
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Analyse saisonnière */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GlobeAltIcon className="w-5 h-5 mr-2 text-green-600" />
            Activité Saisonnière
          </h3>
          <div className="h-64">
            <PolarArea
              data={seasonalAnalysis}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
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

        {/* Corrélation prix/qualité */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BeakerIcon className="w-5 h-5 mr-2 text-blue-600" />
            Prix vs Satisfaction
          </h3>
          <div className="h-64">
            <Scatter
              data={priceQualityCorrelation}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Prix (€)'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Satisfaction'
                    },
                    min: 0,
                    max: 5
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Insights et recommandations IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights clés */}
        <motion.div 
          className="lg:col-span-2 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-500" />
            Insights & Recommandations IA
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <div className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Opportunité de croissance</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Les interventions de type "Création" montrent une marge 35% supérieure. 
                    Recommandation: Augmenter la capacité de l'équipe spécialisée.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <div className="flex items-start">
                <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Tendance positive</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    La satisfaction client a augmenté de 8% ce trimestre. 
                    Les délais de réponse réduits sont le facteur principal.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Point d'attention</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Les heures supplémentaires ont augmenté de 15%. 
                    Considérer le recrutement ou l'optimisation des plannings.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
              <div className="flex items-start">
                <RocketLaunchIcon className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Prédiction IA</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Basé sur les tendances, le CA devrait atteindre 235K€ d'ici fin d'année 
                    (+27% vs année précédente).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scorecard performance */}
        <motion.div 
          className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2" />
            Performance Globale
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Efficacité opérationnelle</span>
                <span className="font-bold">{globalMetrics.teamEfficiency}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full"
                  style={{ width: `${globalMetrics.teamEfficiency}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Satisfaction client</span>
                <span className="font-bold">⭐ {globalMetrics.clientSatisfaction}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-yellow-300 h-2 rounded-full"
                  style={{ width: `${(globalMetrics.clientSatisfaction / 5) * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Livraisons à temps</span>
                <span className="font-bold">{globalMetrics.onTimeDelivery}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-green-300 h-2 rounded-full"
                  style={{ width: `${globalMetrics.onTimeDelivery}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/20 backdrop-blur-lg rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">A+</div>
              <div className="text-sm opacity-90">Score global excellent</div>
            </div>
          </div>
          
          <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
            <CommandLineIcon className="w-5 h-5 inline mr-2" />
            Analyse détaillée
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatistiquesInterventionsUltraPremium;