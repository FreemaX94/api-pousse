import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  Battery100Icon,
  SignalIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  HashtagIcon,
  TagIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  ArrowUturnLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const RecurrenceUltraPremium = () => {
  const [selectedRecurrence, setSelectedRecurrence] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');
  const [filterType, setFilterType] = useState('all');
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [showNextOccurrences, setShowNextOccurrences] = useState(3);

  // Simulation de mise à jour automatique
  useEffect(() => {
    if (autoSchedule) {
      const interval = setInterval(() => {
        // Simulation de planification automatique
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoSchedule]);

  // Interventions récurrentes
  const recurrentInterventions = [
    {
      id: 1,
      title: 'Entretien mensuel Résidence Harmony',
      client: 'Résidence Harmony',
      type: 'entretien',
      frequency: 'monthly',
      dayOfMonth: 15,
      duration: 3,
      team: 'Équipe A',
      price: 450,
      status: 'active',
      nextDate: new Date('2024-09-15'),
      lastDate: new Date('2024-08-15'),
      totalOccurrences: 24,
      completedOccurrences: 18,
      missedOccurrences: 0,
      satisfaction: 4.7,
      tasks: ['Tonte pelouse', 'Taille haies', 'Nettoyage allées'],
      equipment: ['Tondeuse', 'Taille-haie', 'Souffleur'],
      notes: 'Accès par portail latéral, code: 1234',
      customizations: [],
      autoRenew: true,
      contractEnd: new Date('2025-12-31')
    },
    {
      id: 2,
      title: 'Arrosage hebdomadaire Villa Moderne',
      client: 'Villa Moderne',
      type: 'arrosage',
      frequency: 'weekly',
      dayOfWeek: 3,
      duration: 2,
      team: 'Technicien solo',
      price: 120,
      status: 'active',
      nextDate: new Date('2024-08-21'),
      lastDate: new Date('2024-08-14'),
      totalOccurrences: 52,
      completedOccurrences: 48,
      missedOccurrences: 1,
      satisfaction: 4.9,
      tasks: ['Arrosage automatique', 'Vérification système', 'Ajustement programmation'],
      equipment: ['Kit diagnostic', 'Outils réglage'],
      notes: 'Système connecté - accès app mobile',
      customizations: [
        { date: '2024-08-28', modification: 'Report au lendemain - client absent' }
      ],
      autoRenew: true,
      contractEnd: new Date('2024-12-31')
    },
    {
      id: 3,
      title: 'Diagnostic phytosanitaire trimestriel',
      client: 'Jardin Botanique',
      type: 'diagnostic',
      frequency: 'quarterly',
      monthInterval: 3,
      dayOfMonth: 1,
      duration: 4,
      team: 'Spécialiste',
      price: 850,
      status: 'active',
      nextDate: new Date('2024-10-01'),
      lastDate: new Date('2024-07-01'),
      totalOccurrences: 8,
      completedOccurrences: 7,
      missedOccurrences: 0,
      satisfaction: 5.0,
      tasks: ['Analyse complète', 'Prélèvements', 'Rapport détaillé', 'Recommandations'],
      equipment: ['Kit diagnostic complet', 'Microscope portable'],
      notes: 'Rapport à envoyer sous 48h',
      customizations: [],
      autoRenew: false,
      contractEnd: new Date('2025-06-30')
    },
    {
      id: 4,
      title: 'Tonte bi-hebdomadaire Parc Municipal',
      client: 'Mairie de Lyon',
      type: 'tonte',
      frequency: 'bi-weekly',
      daysOfWeek: [1, 4],
      duration: 5,
      team: 'Équipe complète',
      price: 750,
      status: 'active',
      nextDate: new Date('2024-08-19'),
      lastDate: new Date('2024-08-15'),
      totalOccurrences: 104,
      completedOccurrences: 96,
      missedOccurrences: 2,
      satisfaction: 4.6,
      tasks: ['Tonte grandes surfaces', 'Finitions', 'Ramassage déchets'],
      equipment: ['Tondeuse autoportée', 'Débroussailleuse', 'Aspirateur'],
      notes: 'Intervention tôt le matin (7h)',
      customizations: [
        { date: '2024-07-04', modification: 'Annulé - jour férié' },
        { date: '2024-08-12', modification: 'Report cause météo' }
      ],
      autoRenew: true,
      contractEnd: new Date('2026-12-31')
    },
    {
      id: 5,
      title: 'Fertilisation saisonnière Entreprise TechCorp',
      client: 'Entreprise TechCorp',
      type: 'traitement',
      frequency: 'seasonal',
      season: 'spring',
      duration: 6,
      team: 'Équipe B',
      price: 1200,
      status: 'paused',
      nextDate: new Date('2025-03-21'),
      lastDate: new Date('2024-03-21'),
      totalOccurrences: 4,
      completedOccurrences: 4,
      missedOccurrences: 0,
      satisfaction: 4.8,
      tasks: ['Application engrais', 'Traitement préventif', 'Analyse sol'],
      equipment: ['Épandeur', 'Pulvérisateur', 'pH-mètre'],
      notes: 'Produits bio uniquement',
      customizations: [],
      autoRenew: true,
      contractEnd: new Date('2027-12-31')
    }
  ];

  // Calcul des prochaines occurrences
  const calculateNextOccurrences = (intervention) => {
    const occurrences = [];
    let currentDate = new Date(intervention.nextDate);
    
    for (let i = 0; i < showNextOccurrences; i++) {
      occurrences.push(new Date(currentDate));
      
      switch(intervention.frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'bi-weekly':
          currentDate.setDate(currentDate.getDate() + 3.5);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'quarterly':
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case 'seasonal':
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        default:
          break;
      }
    }
    
    return occurrences;
  };

  // Stats globales
  const globalStats = {
    totalActive: recurrentInterventions.filter(r => r.status === 'active').length,
    totalPaused: recurrentInterventions.filter(r => r.status === 'paused').length,
    monthlyRevenue: recurrentInterventions.reduce((acc, r) => {
      if (r.status !== 'active') return acc;
      switch(r.frequency) {
        case 'daily': return acc + (r.price * 30);
        case 'weekly': return acc + (r.price * 4);
        case 'bi-weekly': return acc + (r.price * 8);
        case 'monthly': return acc + r.price;
        case 'quarterly': return acc + (r.price / 3);
        case 'seasonal': return acc + (r.price / 12);
        default: return acc;
      }
    }, 0),
    completionRate: 96,
    avgSatisfaction: 4.8,
    upcomingToday: 3,
    upcomingWeek: 12
  };

  // Graphique revenus récurrents
  const revenueChart = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [{
      label: 'Revenus récurrents',
      data: [8500, 8500, 9200, 9200, 10400, 10400, 10400, 10400, 9200, 9200, 8500, 8500],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  // Distribution par fréquence
  const frequencyDistribution = {
    labels: ['Quotidien', 'Hebdo', 'Bi-hebdo', 'Mensuel', 'Trimestriel', 'Saisonnier'],
    datasets: [{
      data: [0, 1, 1, 1, 1, 1],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      'daily': 'Quotidien',
      'weekly': 'Hebdomadaire',
      'bi-weekly': 'Bi-hebdomadaire',
      'monthly': 'Mensuel',
      'quarterly': 'Trimestriel',
      'seasonal': 'Saisonnier'
    };
    return labels[frequency] || frequency;
  };

  const getFrequencyColor = (frequency) => {
    switch(frequency) {
      case 'daily': return 'from-red-500 to-orange-500';
      case 'weekly': return 'from-blue-500 to-indigo-500';
      case 'bi-weekly': return 'from-purple-500 to-pink-500';
      case 'monthly': return 'from-green-500 to-emerald-500';
      case 'quarterly': return 'from-yellow-500 to-amber-500';
      case 'seasonal': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'stopped': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Cyclique */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation de rotation */}
        <div className="absolute top-4 right-4 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <ArrowPathIcon className="w-24 h-24" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <ArrowPathIcon className="w-8 h-8 mr-3" />
                Récurrence Automatisée
              </h1>
              <p className="text-green-100">Gestion intelligente des interventions récurrentes</p>
              
              {/* Indicateurs système */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Planification auto</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">IA: Optimisation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Efficacité: {globalStats.completionRate}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalIcon className="w-5 h-5" />
                  <span className="text-sm">Sync active</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{globalStats.monthlyRevenue.toFixed(0)}€</div>
              <div className="text-green-100">Revenus mensuels récurrents</div>
              <div className="mt-3 flex items-center justify-end space-x-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {globalStats.totalActive} actifs
                </span>
                <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300">
                  <PlusIcon className="w-5 h-5 inline mr-1" />
                  Nouvelle récurrence
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Actifs', value: globalStats.totalActive, icon: '🔄', color: 'from-green-500 to-emerald-500', pulse: true },
          { label: 'En pause', value: globalStats.totalPaused, icon: '⏸️', color: 'from-yellow-500 to-amber-500' },
          { label: 'Rev. mensuel', value: `${globalStats.monthlyRevenue.toFixed(0)}€`, icon: '💰', color: 'from-purple-500 to-pink-500' },
          { label: 'Taux réussite', value: `${globalStats.completionRate}%`, icon: '📊', color: 'from-blue-500 to-indigo-500' },
          { label: 'Satisfaction', value: `⭐ ${globalStats.avgSatisfaction}`, icon: '', color: 'from-yellow-400 to-orange-400' },
          { label: 'Cette semaine', value: globalStats.upcomingWeek, icon: '📅', color: 'from-cyan-500 to-blue-500' }
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
                {kpi.pulse && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              </div>
              <div className="text-xs text-gray-600">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contrôles et filtres */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Filtre type */}
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="all">Toutes fréquences</option>
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
            </select>

            {/* Mode vue */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded ${viewMode === 'calendar' ? 'bg-white shadow' : ''}`}
              >
                Calendrier
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded ${viewMode === 'timeline' ? 'bg-white shadow' : ''}`}
              >
                Timeline
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setAutoSchedule(!autoSchedule)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                autoSchedule ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Cog6ToothIcon className={`w-5 h-5 inline mr-2 ${autoSchedule ? 'animate-spin' : ''}`} />
              Planification auto {autoSchedule ? 'ON' : 'OFF'}
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des récurrences */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Interventions Récurrentes
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recurrentInterventions.map((intervention, index) => (
                  <motion.div
                    key={intervention.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedRecurrence(intervention)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{intervention.title}</h4>
                        <p className="text-sm text-gray-600">{intervention.client}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(intervention.status)}`}>
                          {intervention.status === 'active' ? 'Actif' : 'En pause'}
                        </span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getFrequencyColor(intervention.frequency)}`}>
                          {getFrequencyLabel(intervention.frequency)}
                        </div>
                      </div>
                    </div>

                    {/* Infos principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        <span>Prochaine: {intervention.nextDate.toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span>{intervention.duration}h</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-400" />
                        <span>{intervention.team}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CurrencyEuroIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-bold">{intervention.price}€</span>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{intervention.completedOccurrences}</div>
                        <div className="text-xs text-gray-500">Réalisées</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{intervention.totalOccurrences}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-lg font-bold text-gray-900">{intervention.satisfaction}</span>
                        </div>
                        <div className="text-xs text-gray-500">Satisfaction</div>
                      </div>
                    </div>

                    {/* Prochaines occurrences */}
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-2">Prochaines occurrences:</div>
                      <div className="flex flex-wrap gap-2">
                        {calculateNextOccurrences(intervention).map((date, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {date.toLocaleDateString('fr-FR')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Barre de progression contrat */}
                    {intervention.contractEnd && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Contrat jusqu'au {intervention.contractEnd.toLocaleDateString('fr-FR')}</span>
                          <span className="font-semibold">
                            {Math.round((intervention.completedOccurrences / intervention.totalOccurrences) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(intervention.completedOccurrences / intervention.totalOccurrences) * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions rapides */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        {intervention.autoRenew && (
                          <span className="flex items-center text-xs text-green-600">
                            <ArrowPathIcon className="w-3 h-3 mr-1" />
                            Renouvellement auto
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {intervention.status === 'active' ? (
                          <button className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">
                            <PauseIcon className="w-4 h-4" />
                          </button>
                        ) : (
                          <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                            <PlayIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <PencilIcon className="w-4 h-4" />
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
          {/* Revenus récurrents */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus Récurrents</h3>
            <div className="h-48">
              <Line
                data={revenueChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `${value}€`
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Distribution par fréquence */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Fréquences</h3>
            <div className="h-48">
              <Doughnut
                data={frequencyDistribution}
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
            className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BellAlertIcon className="w-5 h-5 mr-2" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">3 interventions demain</span>
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300" />
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Contrat à renouveler</span>
                  <ClockIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              <CalendarDaysIcon className="w-5 h-5 inline mr-2" />
              Voir planning complet
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecurrenceUltraPremium;