import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartPieIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalculatorIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CpuChipIcon,
  PresentationChartLineIcon,
  ScaleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  InformationCircleIcon,
  LightBulbIcon,
  BeakerIcon,
  GlobeAltIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  HomeIcon,
  BellAlertIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar, PolarArea, Scatter, Bubble } from 'react-chartjs.js';

const StatistiquesFacturationUltraPremium = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [viewMode, setViewMode] = useState('dashboard');
  const [compareMode, setCompareMode] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({});
  const [showInsights, setShowInsights] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Animation des valeurs
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues({
        revenue: Math.random() * 10000 + 75000,
        growth: Math.random() * 5 + 12,
        efficiency: Math.random() * 10 + 85,
        satisfaction: Math.random() * 0.5 + 4.5
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Statistiques globales
  const globalStats = {
    revenue: {
      current: 78456.50,
      previous: 65234.20,
      growth: 20.3,
      target: 85000,
      completion: 92.3
    },
    invoices: {
      total: 156,
      paid: 142,
      pending: 10,
      overdue: 4,
      avgValue: 503.59,
      avgPaymentTime: 12.5
    },
    quotes: {
      total: 234,
      converted: 89,
      pending: 45,
      expired: 100,
      conversionRate: 38.0,
      avgValue: 1245.80
    },
    creditNotes: {
      total: 12,
      amount: 3456.78,
      percentage: 4.4,
      avgProcessingTime: 3.2
    },
    deposits: {
      total: 45,
      amount: 23456.00,
      percentage: 29.9,
      avgPercentage: 35
    },
    clients: {
      total: 89,
      new: 12,
      recurring: 67,
      vip: 15,
      retention: 94.5,
      ltv: 8945.60
    }
  };

  // Évolution CA sur 12 mois
  const revenueEvolution = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'CA 2024',
        data: [45000, 52000, 48000, 61000, 58000, 72000, 68000, 78456, 0, 0, 0, 0],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'CA 2023',
        data: [38000, 42000, 45000, 48000, 52000, 58000, 62000, 65234, 68000, 71000, 73000, 75000],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Objectif',
        data: [50000, 55000, 55000, 65000, 65000, 75000, 75000, 85000, 85000, 90000, 90000, 95000],
        borderColor: 'rgb(251, 191, 36)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false
      }
    ]
  };

  // Performance par type de client
  const clientTypePerformance = {
    labels: ['Entreprises', 'Particuliers', 'Syndics', 'Administrations', 'Commerces'],
    datasets: [
      {
        label: 'CA généré',
        data: [35000, 18000, 12000, 8000, 5456],
        backgroundColor: 'rgba(147, 51, 234, 0.6)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2
      },
      {
        label: 'Nombre clients',
        data: [25, 35, 12, 8, 9],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  };

  // Répartition services
  const servicesDistribution = {
    labels: ['Entretien', 'Création', 'Taille', 'Traitement', 'Arrosage', 'Autres'],
    datasets: [{
      data: [35, 25, 15, 10, 8, 7],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Analyse rentabilité
  const profitabilityAnalysis = {
    labels: ['Marge brute', 'Coûts directs', 'Coûts indirects', 'Marge nette', 'ROI'],
    datasets: [{
      label: 'Performance',
      data: [65, 35, 20, 45, 125],
      backgroundColor: 'rgba(34, 197, 94, 0.3)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(34, 197, 94)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(34, 197, 94)'
    }]
  };

  // Saisonnalité
  const seasonalityData = {
    labels: ['Printemps', 'Été', 'Automne', 'Hiver'],
    datasets: [{
      label: 'CA par saison',
      data: [95000, 120000, 65000, 35000],
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ]
    }]
  };

  // Top clients
  const topClients = [
    { name: 'Jardin Botanique', revenue: 24500, invoices: 18, satisfaction: 4.9, trend: 'up' },
    { name: 'Mairie de Lyon', revenue: 18900, invoices: 12, satisfaction: 4.7, trend: 'up' },
    { name: 'Résidence Harmony', revenue: 15600, invoices: 24, satisfaction: 4.8, trend: 'stable' },
    { name: 'TechCorp', revenue: 12300, invoices: 8, satisfaction: 4.6, trend: 'up' },
    { name: 'Villa Moderne', revenue: 8900, invoices: 15, satisfaction: 4.5, trend: 'down' }
  ];

  // Prédictions IA
  const predictions = {
    nextMonth: {
      revenue: 82000,
      confidence: 87,
      factors: ['Haute saison', 'Nouveaux contrats', 'Fidélisation']
    },
    nextQuarter: {
      revenue: 265000,
      confidence: 75,
      growth: 15
    },
    risks: [
      { type: 'Impayés', probability: 25, impact: 'medium' },
      { type: 'Saisonnalité', probability: 60, impact: 'high' },
      { type: 'Concurrence', probability: 40, impact: 'low' }
    ],
    opportunities: [
      { type: 'Upselling', potential: 15000, probability: 70 },
      { type: 'Nouveaux marchés', potential: 25000, probability: 45 },
      { type: 'Services premium', potential: 10000, probability: 60 }
    ]
  };

  // Scatter plot pour corrélation prix/satisfaction
  const correlationData = {
    datasets: [{
      label: 'Prix vs Satisfaction',
      data: topClients.map(c => ({
        x: c.revenue / c.invoices,
        y: c.satisfaction,
        r: Math.sqrt(c.revenue) / 10
      })),
      backgroundColor: 'rgba(147, 51, 234, 0.6)',
      borderColor: 'rgb(147, 51, 234)'
    }]
  };

  // KPIs temps réel
  const realtimeKPIs = [
    { label: 'CA du jour', value: 3456.78, target: 3000, unit: '€', trend: 15.2 },
    { label: 'Factures émises', value: 5, target: 4, unit: '', trend: 25 },
    { label: 'Devis envoyés', value: 8, target: 6, unit: '', trend: 33.3 },
    { label: 'Taux conversion', value: 42, target: 35, unit: '%', trend: 7 }
  ];

  const getPeriodLabel = (period) => {
    switch(period) {
      case 'day': return 'Aujourd\'hui';
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      case 'quarter': return 'Ce trimestre';
      case 'year': return 'Cette année';
      default: return period;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <span className="w-4 h-4 inline-block bg-gray-400 rounded-full" />;
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
        {/* Animation de fond */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute grid grid-cols-8 gap-4 w-full h-full"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
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
                <ChartPieIcon className="w-8 h-8 mr-3" />
                Analytics & Business Intelligence
              </h1>
              <p className="text-purple-100">Tableau de bord avancé avec prédictions IA</p>
              
              {/* Indicateurs système */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Données temps réel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">IA active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-5 h-5" />
                  <span className="text-sm">Analyse prédictive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Performance optimale</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {globalStats.revenue.current.toFixed(0)}€
              </div>
              <div className="text-purple-100">CA total ce mois</div>
              <div className="mt-2 flex items-center justify-end space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  globalStats.revenue.growth > 0 ? 'bg-green-500/30' : 'bg-red-500/30'
                }`}>
                  {globalStats.revenue.growth > 0 ? '+' : ''}{globalStats.revenue.growth}%
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {globalStats.revenue.completion}% objectif
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sélecteurs et contrôles */}
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
              <option value="day">Jour</option>
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
              <option value="quarter">Trimestre</option>
              <option value="year">Année</option>
            </select>

            {/* Métrique */}
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="revenue">Chiffre d'affaires</option>
              <option value="invoices">Factures</option>
              <option value="quotes">Devis</option>
              <option value="clients">Clients</option>
              <option value="services">Services</option>
            </select>

            {/* Mode vue */}
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

            {/* Comparaison */}
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                compareMode ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <ScaleIcon className="w-5 h-5 inline mr-2" />
              Comparer
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
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
              onClick={() => setShowInsights(!showInsights)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showInsights ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <LightBulbIcon className="w-5 h-5 inline mr-2" />
              Insights IA
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPIs temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {realtimeKPIs.map((kpi, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05, type: "spring" }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {kpi.value}{kpi.unit}
                </div>
                <div className="text-sm text-gray-600">{kpi.label}</div>
              </div>
              <div className={`text-sm font-bold ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
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

      {/* Dashboard principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphiques principaux */}
        <div className="lg:col-span-2 space-y-6">
          {/* Évolution CA */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
              <span>Évolution du Chiffre d'Affaires</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-600 font-medium">
                  +{globalStats.revenue.growth}% vs N-1
                </span>
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
              </div>
            </h3>
            <div className="h-64">
              <Line
                data={revenueEvolution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: { size: 11 }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `${value / 1000}K€`
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Performance clients et services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance par Type Client</h3>
              <div className="h-48">
                <Bar
                  data={clientTypePerformance}
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
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => value > 1000 ? `${value / 1000}K` : value
                        }
                      }
                    }
                  }}
                />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Services</h3>
              <div className="h-48">
                <Doughnut
                  data={servicesDistribution}
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
          </div>

          {/* Top clients */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Clients</h3>
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                      index === 0 ? 'from-yellow-400 to-yellow-500' :
                      index === 1 ? 'from-gray-300 to-gray-400' :
                      index === 2 ? 'from-orange-400 to-orange-500' :
                      'from-purple-400 to-purple-500'
                    } flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-600">{client.invoices} factures</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{(client.revenue / 1000).toFixed(1)}K€</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                        {client.satisfaction}
                      </div>
                    </div>
                    {getTrendIcon(client.trend)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar insights */}
        <div className="space-y-6">
          {/* Analyse rentabilité */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse Rentabilité</h3>
            <div className="h-48">
              <Radar
                data={profitabilityAnalysis}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 150,
                      ticks: {
                        stepSize: 30
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Saisonnalité */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saisonnalité</h3>
            <div className="h-48">
              <PolarArea
                data={seasonalityData}
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

          {/* Prédictions IA */}
          {showInsights && (
            <motion.div 
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Prédictions IA
              </h3>
              
              <div className="space-y-4">
                {/* Prévision mois prochain */}
                <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">Mois prochain</div>
                  <div className="text-2xl font-bold">{(predictions.nextMonth.revenue / 1000).toFixed(0)}K€</div>
                  <div className="text-xs opacity-90 mt-1">
                    Confiance: {predictions.nextMonth.confidence}%
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {predictions.nextMonth.factors.map((factor, i) => (
                      <span key={i} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Opportunités */}
                <div>
                  <div className="text-sm font-medium mb-2">Opportunités détectées</div>
                  <div className="space-y-2">
                    {predictions.opportunities.slice(0, 2).map((opp, i) => (
                      <div key={i} className="bg-white/20 backdrop-blur-lg rounded-lg p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">{opp.type}</span>
                          <span className="text-xs font-bold">+{(opp.potential / 1000).toFixed(0)}K€</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                          <div 
                            className="bg-white h-1 rounded-full"
                            style={{ width: `${opp.probability}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                  <ChartBarIcon className="w-5 h-5 inline mr-2" />
                  Rapport complet
                </button>
              </div>
            </motion.div>
          )}

          {/* Alertes */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BellAlertIcon className="w-5 h-5 mr-2" />
              Alertes & Actions
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">4 factures en retard</span>
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-xs opacity-90 mt-1">Impact: 5,600€</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Objectif mensuel 92%</span>
                  <TrophyIcon className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-xs opacity-90 mt-1">Manque: 6,544€</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatistiquesFacturationUltraPremium;