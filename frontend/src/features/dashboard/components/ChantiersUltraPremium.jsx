import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  PaperClipIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  RocketLaunchIcon,
  Battery100Icon,
  SignalIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  BeakerIcon,
  GlobeAltIcon,
  SunIcon,
  CloudIcon,
  FlagIcon,
  StarIcon,
  HeartIcon,
  CubeIcon,
  Square3Stack3DIcon,
  HomeModernIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const ChantiersUltraPremium = () => {
  const [selectedChantier, setSelectedChantier] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMetrics, setShowMetrics] = useState(true);
  const [realTimeProgress, setRealTimeProgress] = useState({});

  // Simulation progression temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeProgress(prev => ({
        ...prev,
        global: Math.min(100, (prev.global || 0) + Math.random() * 2)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Liste des chantiers majeurs
  const chantiers = [
    {
      id: 1,
      name: 'Parc Municipal - Réaménagement complet',
      code: 'PM-2024-001',
      client: 'Mairie de Lyon',
      type: 'amenagement',
      priority: 'high',
      status: 'in_progress',
      phase: 'Terrassement',
      location: {
        address: 'Parc de la Tête d\'Or, Lyon',
        coordinates: { lat: 45.7751, lng: 4.8525 },
        surface: '12000m²',
        access: 'Multiple'
      },
      schedule: {
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-10-31'),
        currentWeek: 7,
        totalWeeks: 17,
        workDays: 85,
        remainingDays: 45
      },
      team: {
        chef: 'Marc Leblanc',
        workers: 8,
        subcontractors: 3,
        vehicles: ['Camion', 'Mini-pelle', 'Nacelle'],
        currentOnSite: 6
      },
      progress: {
        global: 42,
        phases: {
          preparation: 100,
          terrassement: 65,
          plantation: 15,
          finition: 0
        },
        milestones: [
          { name: 'Début chantier', date: '2024-07-01', completed: true },
          { name: 'Terrassement', date: '2024-08-15', completed: false },
          { name: 'Plantations', date: '2024-09-30', completed: false },
          { name: 'Livraison', date: '2024-10-31', completed: false }
        ]
      },
      financial: {
        budget: 185000,
        spent: 78000,
        committed: 45000,
        remaining: 62000,
        margin: 15,
        invoiced: 35000,
        paid: 25000
      },
      resources: {
        materials: ['Terre végétale', 'Graviers', 'Plants', 'Mobilier urbain'],
        equipment: ['Système arrosage', 'Éclairage LED', 'Clôtures'],
        suppliers: 4,
        deliveries: 12
      },
      risks: [
        { type: 'weather', level: 'medium', description: 'Période pluvieuse' },
        { type: 'supply', level: 'low', description: 'Délai fournisseur plants' }
      ],
      quality: {
        score: 92,
        inspections: 3,
        nonConformities: 1,
        correctedIssues: 1
      },
      documentation: {
        photos: 145,
        reports: 8,
        plans: 12,
        permits: 4
      },
      weather: {
        impact: 'low',
        delayDays: 2
      },
      safety: {
        incidents: 0,
        nearMisses: 1,
        safetyMeetings: 7
      }
    },
    {
      id: 2,
      name: 'Jardin Zen - Création complète',
      code: 'JZ-2024-002',
      client: 'Entreprise TechCorp',
      type: 'creation',
      priority: 'normal',
      status: 'planning',
      phase: 'Conception',
      location: {
        address: '156 Avenue Innovation',
        coordinates: { lat: 45.7485, lng: 4.8467 },
        surface: '800m²',
        access: 'Portail principal'
      },
      schedule: {
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-10-15'),
        currentWeek: 0,
        totalWeeks: 6,
        workDays: 30,
        remainingDays: 30
      },
      team: {
        chef: 'Paul Moreau',
        workers: 5,
        subcontractors: 2,
        vehicles: ['Utilitaire', 'Mini-pelle'],
        currentOnSite: 0
      },
      progress: {
        global: 15,
        phases: {
          conception: 80,
          preparation: 0,
          construction: 0,
          finition: 0
        },
        milestones: [
          { name: 'Validation plans', date: '2024-08-25', completed: false },
          { name: 'Début travaux', date: '2024-09-01', completed: false },
          { name: 'Bassins', date: '2024-09-20', completed: false },
          { name: 'Livraison', date: '2024-10-15', completed: false }
        ]
      },
      financial: {
        budget: 45000,
        spent: 5000,
        committed: 12000,
        remaining: 28000,
        margin: 25,
        invoiced: 0,
        paid: 0
      },
      resources: {
        materials: ['Pierres naturelles', 'Sable', 'Bambous', 'Érable japonais'],
        equipment: ['Fontaine', 'Éclairage', 'Pont'],
        suppliers: 6,
        deliveries: 8
      },
      risks: [
        { type: 'design', level: 'low', description: 'Modifications client' }
      ],
      quality: {
        score: 95,
        inspections: 0,
        nonConformities: 0,
        correctedIssues: 0
      },
      documentation: {
        photos: 25,
        reports: 2,
        plans: 8,
        permits: 2
      },
      weather: {
        impact: 'none',
        delayDays: 0
      },
      safety: {
        incidents: 0,
        nearMisses: 0,
        safetyMeetings: 0
      }
    },
    {
      id: 3,
      name: 'Toiture végétalisée - Immeuble Green',
      code: 'TV-2024-003',
      client: 'Syndic Horizon',
      type: 'toiture',
      priority: 'urgent',
      status: 'in_progress',
      phase: 'Installation substrat',
      location: {
        address: '23 Boulevard Vert, Villeurbanne',
        coordinates: { lat: 45.7640, lng: 4.8800 },
        surface: '450m²',
        access: 'Accès toit sécurisé'
      },
      schedule: {
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-08-31'),
        currentWeek: 3,
        totalWeeks: 4,
        workDays: 20,
        remainingDays: 8
      },
      team: {
        chef: 'Luc Bernard',
        workers: 4,
        subcontractors: 1,
        vehicles: ['Nacelle', 'Grue'],
        currentOnSite: 4
      },
      progress: {
        global: 68,
        phases: {
          etancheite: 100,
          drainage: 100,
          substrat: 60,
          plantation: 20
        },
        milestones: [
          { name: 'Étanchéité', date: '2024-08-05', completed: true },
          { name: 'Drainage', date: '2024-08-10', completed: true },
          { name: 'Substrat', date: '2024-08-20', completed: false },
          { name: 'Plantations', date: '2024-08-31', completed: false }
        ]
      },
      financial: {
        budget: 65000,
        spent: 42000,
        committed: 15000,
        remaining: 8000,
        margin: 18,
        invoiced: 30000,
        paid: 30000
      },
      resources: {
        materials: ['Membrane EPDM', 'Substrat allégé', 'Sedums', 'Système drainage'],
        equipment: ['Système arrosage intégré', 'Garde-corps'],
        suppliers: 3,
        deliveries: 5
      },
      risks: [
        { type: 'safety', level: 'high', description: 'Travail en hauteur' },
        { type: 'weather', level: 'medium', description: 'Vents forts' }
      ],
      quality: {
        score: 88,
        inspections: 2,
        nonConformities: 1,
        correctedIssues: 0
      },
      documentation: {
        photos: 78,
        reports: 4,
        plans: 6,
        permits: 3
      },
      weather: {
        impact: 'medium',
        delayDays: 1
      },
      safety: {
        incidents: 0,
        nearMisses: 2,
        safetyMeetings: 3
      }
    }
  ];

  // Stats globales
  const globalStats = {
    totalChantiers: chantiers.length,
    activeChantiers: chantiers.filter(c => c.status === 'in_progress').length,
    totalBudget: chantiers.reduce((acc, c) => acc + c.financial.budget, 0),
    totalSpent: chantiers.reduce((acc, c) => acc + c.financial.spent, 0),
    avgProgress: Math.round(chantiers.reduce((acc, c) => acc + c.progress.global, 0) / chantiers.length),
    totalWorkers: chantiers.reduce((acc, c) => acc + c.team.workers, 0),
    avgQuality: Math.round(chantiers.reduce((acc, c) => acc + c.quality.score, 0) / chantiers.length),
    totalIncidents: chantiers.reduce((acc, c) => acc + c.safety.incidents, 0)
  };

  // Graphique progression
  const progressChart = {
    labels: chantiers.map(c => c.name.split(' - ')[0]),
    datasets: [
      {
        label: 'Progression',
        data: chantiers.map(c => c.progress.global),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      },
      {
        label: 'Budget consommé',
        data: chantiers.map(c => Math.round((c.financial.spent / c.financial.budget) * 100)),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  };

  // Radar qualité/sécurité
  const qualityRadar = {
    labels: ['Qualité', 'Sécurité', 'Délais', 'Budget', 'Ressources', 'Documentation'],
    datasets: [{
      label: 'Performance globale',
      data: [92, 95, 78, 85, 88, 90],
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(147, 51, 234)'
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in_progress': return 'from-blue-500 to-indigo-500';
      case 'planning': return 'from-yellow-500 to-amber-500';
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'paused': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'amenagement': return '🏞️';
      case 'creation': return '🎨';
      case 'toiture': return '🏢';
      case 'renovation': return '🔨';
      default: return '🏗️';
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Chantiers */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation de construction */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
            animation: 'slide 20s linear infinite'
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <BuildingOfficeIcon className="w-8 h-8 mr-3" />
                Gestion Chantiers Avancée
              </h1>
              <p className="text-orange-100">Supervision multi-sites et coordination d'équipes</p>
              
              {/* Indicateurs temps réel */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">{globalStats.activeChantiers} actifs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">Optimisation: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Performance: {globalStats.avgQuality}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="text-sm">Sécurité: Optimale</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{globalStats.avgProgress}%</div>
              <div className="text-orange-100">Progression moyenne</div>
              <div className="mt-3">
                <div className="text-sm mb-1">Budget global</div>
                <div className="text-2xl font-bold">{(globalStats.totalBudget / 1000).toFixed(0)}K€</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Chantiers', value: globalStats.totalChantiers, icon: '🏗️', color: 'from-orange-500 to-amber-500' },
          { label: 'En cours', value: globalStats.activeChantiers, icon: '⚡', color: 'from-blue-500 to-indigo-500', pulse: true },
          { label: 'Budget total', value: `${(globalStats.totalBudget / 1000).toFixed(0)}K€`, icon: '💰', color: 'from-purple-500 to-pink-500' },
          { label: 'Dépensé', value: `${(globalStats.totalSpent / 1000).toFixed(0)}K€`, icon: '💸', color: 'from-red-500 to-orange-500' },
          { label: 'Progression', value: `${globalStats.avgProgress}%`, icon: '📊', color: 'from-green-500 to-emerald-500' },
          { label: 'Équipes', value: globalStats.totalWorkers, icon: '👷', color: 'from-cyan-500 to-blue-500' },
          { label: 'Qualité', value: `${globalStats.avgQuality}%`, icon: '⭐', color: 'from-yellow-400 to-orange-400' },
          { label: 'Incidents', value: globalStats.totalIncidents, icon: '⚠️', color: globalStats.totalIncidents > 0 ? 'from-red-500 to-rose-500' : 'from-gray-400 to-gray-500' }
        ].map((kpi, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05, type: "spring" }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className={`h-1 bg-gradient-to-r ${kpi.color}`} />
            <div className="p-3">
              <div className="text-xl font-bold text-gray-900 flex items-center">
                {kpi.icon} {kpi.value}
                {kpi.pulse && <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
              </div>
              <div className="text-xs text-gray-600">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des chantiers */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Square3Stack3DIcon className="w-5 h-5 mr-2" />
                Chantiers en Cours
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {chantiers.map((chantier, index) => (
                  <motion.div
                    key={chantier.id}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedChantier(chantier)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header chantier */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-2xl">{getTypeIcon(chantier.type)}</span>
                          <span className="text-xs font-mono text-gray-500">#{chantier.code}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{chantier.name}</h4>
                        <p className="text-sm text-gray-600">{chantier.client}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityBadge(chantier.priority)}`}>
                          {chantier.priority === 'urgent' ? 'Urgent' : 
                           chantier.priority === 'high' ? 'Priorité haute' : 'Normal'}
                        </span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(chantier.status)}`}>
                          {chantier.phase}
                        </div>
                      </div>
                    </div>

                    {/* Infos principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{chantier.location.surface}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">J+{chantier.schedule.currentWeek * 7}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{chantier.team.currentOnSite}/{chantier.team.workers}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CurrencyEuroIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold">{(chantier.financial.budget / 1000).toFixed(0)}K€</span>
                      </div>
                    </div>

                    {/* Progression globale */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progression globale</span>
                        <span className="font-bold text-gray-900">{chantier.progress.global}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full bg-gradient-to-r ${
                            chantier.progress.global >= 75 ? 'from-green-500 to-emerald-500' :
                            chantier.progress.global >= 50 ? 'from-blue-500 to-indigo-500' :
                            chantier.progress.global >= 25 ? 'from-yellow-500 to-amber-500' :
                            'from-red-500 to-orange-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${chantier.progress.global}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    {/* Phases du projet */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {Object.entries(chantier.progress.phases).map(([phase, progress]) => (
                        <div key={phase} className="text-center">
                          <div className="text-xs text-gray-500 capitalize mb-1">{phase}</div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  progress === 100 ? 'bg-green-500' :
                                  progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-xs font-semibold mt-1">{progress}%</div>
                        </div>
                      ))}
                    </div>

                    {/* Indicateurs clés */}
                    <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-lg font-bold">{chantier.quality.score}%</span>
                        </div>
                        <div className="text-xs text-gray-500">Qualité</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <ClockIcon className="w-4 h-4 text-blue-500 mr-1" />
                          <span className="text-lg font-bold">{chantier.schedule.remainingDays}j</span>
                        </div>
                        <div className="text-xs text-gray-500">Restants</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <ScaleIcon className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-lg font-bold">{chantier.financial.margin}%</span>
                        </div>
                        <div className="text-xs text-gray-500">Marge</div>
                      </div>
                    </div>

                    {/* Risques et alertes */}
                    {chantier.risks.length > 0 && (
                      <div className="mt-3 flex items-center space-x-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-600">
                          {chantier.risks.length} risque{chantier.risks.length > 1 ? 's' : ''} identifié{chantier.risks.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {/* Actions rapides */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <PhotoIcon className="w-4 h-4" />
                          <span className="text-xs">{chantier.documentation.photos}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <DocumentTextIcon className="w-4 h-4" />
                          <span className="text-xs">{chantier.documentation.reports}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <TruckIcon className="w-4 h-4" />
                          <span className="text-xs">{chantier.team.vehicles.length}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <ChartBarIcon className="w-4 h-4" />
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
          {/* Graphique progression */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression vs Budget</h3>
            <div className="h-48">
              <Bar
                data={progressChart}
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

          {/* Radar performance */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Globale</h3>
            <div className="h-48">
              <Radar
                data={qualityRadar}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
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

          {/* Centre de contrôle */}
          <motion.div 
            className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <RocketLaunchIcon className="w-5 h-5 mr-2" />
              Centre de Contrôle
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Livraison proche</span>
                  <FlagIcon className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-xs mt-1 opacity-90">Toiture - 8 jours</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Inspection qualité</span>
                  <BeakerIcon className="w-5 h-5" />
                </div>
                <div className="text-xs mt-1 opacity-90">Parc Municipal - Demain</div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              <ChartBarIcon className="w-5 h-5 inline mr-2" />
              Tableau de bord complet
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChantiersUltraPremium;