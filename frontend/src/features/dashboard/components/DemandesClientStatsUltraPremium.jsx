import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  ChartPieIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  BoltIcon,
  TrophyIcon,
  FireIcon,
  BellAlertIcon,
  CpuChipIcon,
  BeakerIcon,
  RocketLaunchIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  TagIcon,
  UsersIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const DemandesClientStatsUltraPremium = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedChart, setSelectedChart] = useState('evolution');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [showPredictions, setShowPredictions] = useState(true);
  const [viewMode, setViewMode] = useState('dashboard');
  const [compareMode, setCompareMode] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({});

  // Animation des valeurs en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues({
        totalRequests: Math.random() * 50 + 150,
        completionRate: Math.random() * 10 + 85,
        avgResponseTime: Math.random() * 2 + 4,
        satisfaction: Math.random() * 0.5 + 4.3
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Données globales
  const globalStats = {
    total: 1247,
    pending: 89,
    inProgress: 134,
    completed: 967,
    cancelled: 57,
    avgResponseTime: 4.2,
    avgResolutionTime: 24.5,
    satisfactionScore: 4.6,
    completionRate: 87.3
  };

  // Evolution temporelle des demandes
  const evolutionData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Demandes reçues 2024',
        data: [89, 95, 112, 134, 145, 156, 167, 178, 165, 142, 128, 134],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Demandes résolues 2024',
        data: [85, 92, 108, 128, 140, 152, 162, 174, 160, 138, 125, 130],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Demandes 2023',
        data: [76, 82, 89, 95, 102, 118, 125, 132, 128, 115, 108, 112],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.05)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Objectif mensuel',
        data: [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155],
        borderColor: 'rgb(251, 191, 36)',
        borderDash: [5, 5],
        tension: 0.2,
        fill: false
      }
    ]
  };

  // Répartition par catégories
  const categoriesData = {
    labels: ['Technique', 'Commercial', 'Support', 'Facturation', 'Réclamation', 'Information'],
    datasets: [{
      data: [35, 25, 20, 12, 5, 3],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderWidth: 3,
      borderColor: '#fff'
    }]
  };

  // Répartition par priorités
  const prioritiesData = {
    labels: ['Urgente', 'Haute', 'Normale', 'Basse'],
    datasets: [{
      data: [15, 25, 45, 15],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderWidth: 3,
      borderColor: '#fff'
    }]
  };

  // Performance des équipes
  const teamPerformanceData = {
    labels: ['Réactivité', 'Qualité', 'Satisfaction', 'Efficacité', 'Communication'],
    datasets: [
      {
        label: 'Équipe Technique',
        data: [85, 92, 88, 90, 82],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.3)',
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(34, 197, 94)'
      },
      {
        label: 'Équipe Commercial',
        data: [78, 85, 92, 87, 90],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      },
      {
        label: 'Équipe Support',
        data: [88, 78, 85, 83, 88],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.3)',
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(147, 51, 234)'
      }
    ]
  };

  // Performance mensuelle par équipe
  const monthlyTeamPerformance = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
    datasets: [
      {
        label: 'Équipe Technique',
        data: [89, 92, 87, 94, 88, 91, 93, 89],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      },
      {
        label: 'Équipe Commercial',
        data: [82, 85, 90, 87, 92, 89, 86, 91],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Équipe Support',
        data: [85, 88, 83, 89, 86, 90, 88, 87],
        backgroundColor: 'rgba(147, 51, 234, 0.7)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2
      },
      {
        label: 'Équipe Admin',
        data: [78, 82, 85, 81, 83, 86, 84, 85],
        backgroundColor: 'rgba(251, 191, 36, 0.7)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 2
      }
    ]
  };

  // KPIs temps réel
  const realtimeKPIs = [
    { label: 'Demandes/jour', value: 23, target: 20, unit: '', trend: 15, icon: DocumentTextIcon },
    { label: 'Temps réponse', value: 4.2, target: 6, unit: 'h', trend: -30, icon: ClockIcon },
    { label: 'Taux résolution', value: 87.3, target: 85, unit: '%', trend: 2.3, icon: CheckCircleIcon },
    { label: 'Satisfaction', value: 4.6, target: 4.5, unit: '/5', trend: 2.2, icon: TrophyIcon }
  ];

  // Prédictions et tendances
  const predictions = {
    nextWeek: {
      requests: 165,
      confidence: 92,
      trend: 'stable',
      factors: ['Activité normale', 'Fin de mois', 'Nouveau produit']
    },
    nextMonth: {
      requests: 680,
      confidence: 78,
      trend: 'up',
      growth: 12,
      factors: ['Campagne marketing', 'Saison haute', 'Extension équipe']
    },
    insights: [
      { type: 'peak', time: '14h-16h', description: 'Pic d\'activité détecté' },
      { type: 'team', team: 'Support', description: 'Surcharge prévue jeudi' },
      { type: 'category', category: 'Technique', description: 'Hausse demandes +25%' }
    ],
    recommendations: [
      'Renforcer équipe technique jeudi après-midi',
      'Préparer FAQ pour nouveau produit',
      'Anticiper pic demandes 14h-16h'
    ]
  };

  // Top catégories par équipe
  const topCategories = [
    { category: 'Technique', count: 456, team: 'Technique', avgTime: 6.2, satisfaction: 4.8 },
    { category: 'Commercial', count: 324, team: 'Commercial', avgTime: 3.8, satisfaction: 4.7 },
    { category: 'Support', count: 267, team: 'Support', avgTime: 2.1, satisfaction: 4.9 },
    { category: 'Facturation', count: 156, team: 'Admin', avgTime: 4.5, satisfaction: 4.4 },
    { category: 'Réclamation', count: 44, team: 'Manager', avgTime: 8.3, satisfaction: 4.2 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'inProgress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <span className="w-4 h-4 inline-block bg-gray-400 rounded-full" />;
  };

  const renderChart = () => {
    switch(selectedChart) {
      case 'evolution':
        return <Line data={evolutionData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 15, usePointStyle: true, font: { size: 11 } }
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }} />;
      case 'categories':
        return <Doughnut data={categoriesData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { padding: 15, usePointStyle: true, font: { size: 11 } }
            }
          }
        }} />;
      case 'priorities':
        return <Doughnut data={prioritiesData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { padding: 15, usePointStyle: true, font: { size: 11 } }
            }
          }
        }} />;
      case 'teams':
        return <Radar data={teamPerformanceData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 10, usePointStyle: true, font: { size: 10 } }
            }
          },
          scales: {
            r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } }
          }
        }} />;
      case 'monthly':
        return <Bar data={monthlyTeamPerformance} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 10, usePointStyle: true, font: { size: 10 } }
            }
          },
          scales: {
            y: { beginAtZero: true, max: 100 }
          }
        }} />;
      default:
        return <div>Graphique non trouvé</div>;
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Analytics */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute grid grid-cols-8 gap-4 w-full h-full"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            {[...Array(32)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-lg" />
            ))}
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <ChartBarIcon className="w-8 h-8 mr-3" />
                Statistiques Demandes Clients Ultra Premium
              </h1>
              <p className="text-purple-100">Analyse avancée avec IA prédictive et insights temps réel</p>
              
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Live Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">IA Prédictive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-5 h-5" />
                  <span className="text-sm">ML Insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Performance Max</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{globalStats.total}</div>
              <div className="text-purple-100">Demandes totales</div>
              <div className="mt-2 flex items-center justify-end space-x-2">
                <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm font-bold">
                  {globalStats.completionRate}% résolues
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {globalStats.satisfactionScore}/5 satisfaction
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contrôles et sélecteurs */}
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
              <option value="year">Cette année</option>
            </select>

            <select 
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="evolution">Évolution temporelle</option>
              <option value="categories">Répartition catégories</option>
              <option value="priorities">Répartition priorités</option>
              <option value="teams">Performance équipes</option>
              <option value="monthly">Mensuel par équipe</option>
            </select>

            <select 
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="all">Toutes les équipes</option>
              <option value="technique">Équipe Technique</option>
              <option value="commercial">Équipe Commercial</option>
              <option value="support">Équipe Support</option>
              <option value="admin">Équipe Admin</option>
            </select>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1 rounded ${viewMode === 'dashboard' ? 'bg-white shadow' : ''}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('details')}
                className={`px-3 py-1 rounded ${viewMode === 'details' ? 'bg-white shadow' : ''}`}
              >
                Détails
              </button>
              <button
                onClick={() => setViewMode('predictions')}
                className={`px-3 py-1 rounded ${viewMode === 'predictions' ? 'bg-white shadow' : ''}`}
              >
                Prédictions
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
              onClick={() => setShowPredictions(!showPredictions)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showPredictions ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <SparklesIcon className="w-5 h-5 inline mr-2" />
              IA Insights
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
                animate={{ width: `${(kpi.value / kpi.target) * 100}%` }}
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
        {/* Graphique principal */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
              <span>
                {selectedChart === 'evolution' && 'Évolution Temporelle des Demandes'}
                {selectedChart === 'categories' && 'Répartition par Catégories'}
                {selectedChart === 'priorities' && 'Répartition par Priorités'}
                {selectedChart === 'teams' && 'Performance des Équipes'}
                {selectedChart === 'monthly' && 'Performance Mensuelle par Équipe'}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-purple-600 font-medium">
                  Période: {selectedPeriod}
                </span>
                <PresentationChartLineIcon className="w-5 h-5 text-purple-600" />
              </div>
            </h3>
            <div className="h-80">
              {renderChart()}
            </div>
          </motion.div>

          {/* Top catégories détaillées */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Catégories de Demandes</h3>
            <div className="space-y-3">
              {topCategories.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                      index === 0 ? 'from-yellow-400 to-yellow-500' :
                      index === 1 ? 'from-green-400 to-green-500' :
                      index === 2 ? 'from-blue-400 to-blue-500' :
                      index === 3 ? 'from-purple-400 to-purple-500' :
                      'from-red-400 to-red-500'
                    } flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.category}</div>
                      <div className="text-sm text-gray-600">Équipe {item.team}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-right">
                    <div>
                      <div className="font-bold text-gray-900">{item.count} demandes</div>
                      <div className="text-sm text-gray-600">{item.avgTime}h moy.</div>
                    </div>
                    <div className="text-yellow-600 font-bold">
                      {item.satisfaction}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar insights */}
        <div className="space-y-6">
          {/* Prédictions IA */}
          {showPredictions && (
            <motion.div 
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Prédictions IA
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">Semaine prochaine</div>
                  <div className="text-2xl font-bold">{predictions.nextWeek.requests} demandes</div>
                  <div className="text-xs opacity-90 mt-1">
                    Confiance: {predictions.nextWeek.confidence}%
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {predictions.nextWeek.factors.map((factor, i) => (
                      <span key={i} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">Mois prochain</div>
                  <div className="text-2xl font-bold">{predictions.nextMonth.requests} demandes</div>
                  <div className="text-xs opacity-90 mt-1">
                    Croissance: +{predictions.nextMonth.growth}%
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Recommandations IA</div>
                  <div className="space-y-1">
                    {predictions.recommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className="bg-white/20 backdrop-blur-lg rounded-lg p-2 text-xs">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Insights temps réel */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BoltIcon className="w-5 h-5 mr-2 text-purple-500" />
              Insights Temps Réel
            </h3>
            <div className="space-y-3">
              {predictions.insights.map((insight, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {insight.type === 'peak' && 'Pic d\'activité'}
                      {insight.type === 'team' && 'Alerte équipe'}
                      {insight.type === 'category' && 'Tendance catégorie'}
                    </span>
                    {insight.type === 'peak' && <FireIcon className="w-4 h-4 text-orange-500" />}
                    {insight.type === 'team' && <UsersIcon className="w-4 h-4 text-blue-500" />}
                    {insight.type === 'category' && <TagIcon className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="text-xs text-gray-600">{insight.description}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alertes et actions */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BellAlertIcon className="w-5 h-5 mr-2" />
              Alertes & Actions
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{globalStats.pending} demandes en attente</span>
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-xs opacity-90 mt-1">Action requise</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Performance {globalStats.completionRate}%</span>
                  <TrophyIcon className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-xs opacity-90 mt-1">Objectif dépassé !</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Satisfaction {globalStats.satisfactionScore}/5</span>
                  <CheckCircleIcon className="w-5 h-5 text-green-300" />
                </div>
                <div className="text-xs opacity-90 mt-1">Excellent niveau</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DemandesClientStatsUltraPremium;