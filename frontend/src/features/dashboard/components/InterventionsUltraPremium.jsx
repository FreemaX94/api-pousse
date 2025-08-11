import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  TruckIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  PhotoIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  ShieldCheckIcon,
  StarIcon,
  HeartIcon,
  GlobeAltIcon,
  SignalIcon,
  Battery100Icon,
  RocketLaunchIcon,
  CpuChipIcon,
  CommandLineIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  QrCodeIcon,
  HashtagIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const InterventionsUltraPremium = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [liveUpdates, setLiveUpdates] = useState(true);

  // Simulation de mises à jour en temps réel
  useEffect(() => {
    if (liveUpdates) {
      const interval = setInterval(() => {
        // Simulation de changements de statut
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [liveUpdates]);

  // Liste des interventions enrichie
  const interventions = [
    {
      id: 'INT-2024-001',
      reference: 'URG-TEMP-001',
      title: 'Élagage d\'urgence suite tempête',
      client: {
        name: 'Mairie de Lyon',
        type: 'Institution',
        priority: 'VIP',
        contact: '04 72 10 30 30'
      },
      location: {
        address: 'Parc de la Tête d\'Or',
        coordinates: { lat: 45.7751, lng: 4.8525 },
        zone: 'Zone A',
        accessCode: 'A4521'
      },
      schedule: {
        date: new Date('2024-08-15'),
        startTime: '08:00',
        endTime: '12:00',
        duration: 4,
        flexible: false
      },
      team: {
        lead: 'Marc Leblanc',
        members: ['Paul M.', 'Jean D.'],
        vehicle: 'Camion nacelle #3',
        equipment: ['Tronçonneuse', 'Nacelle', 'Broyeur']
      },
      status: 'in_progress',
      priority: 'urgent',
      type: 'elagage',
      progress: 65,
      financial: {
        quote: 2500,
        cost: 1800,
        margin: 700,
        paid: false
      },
      documentation: {
        photos: 12,
        reports: 2,
        signature: true,
        invoice: false
      },
      risks: ['Hauteur', 'Lignes électriques'],
      weather: { condition: 'sunny', impact: 'none' },
      notes: 'Arbres endommagés par la tempête, sécurisation urgente requise',
      satisfaction: null,
      tags: ['urgent', 'tempête', 'sécurité']
    },
    {
      id: 'INT-2024-002',
      reference: 'INST-ARR-002',
      title: 'Installation système arrosage automatique',
      client: {
        name: 'Villa Moderne',
        type: 'Particulier',
        priority: 'Standard',
        contact: '06 12 34 56 78'
      },
      location: {
        address: '45 Rue des Jardins, Villeurbanne',
        coordinates: { lat: 45.7640, lng: 4.8800 },
        zone: 'Zone B',
        accessCode: null
      },
      schedule: {
        date: new Date('2024-08-15'),
        startTime: '14:00',
        endTime: '17:00',
        duration: 3,
        flexible: true
      },
      team: {
        lead: 'Paul Moreau',
        members: ['Luc B.'],
        vehicle: 'Utilitaire #1',
        equipment: ['Kit arrosage', 'Perceuse', 'Programmateur']
      },
      status: 'scheduled',
      priority: 'normal',
      type: 'installation',
      progress: 0,
      financial: {
        quote: 1200,
        cost: 600,
        margin: 600,
        paid: false
      },
      documentation: {
        photos: 0,
        reports: 0,
        signature: false,
        invoice: false
      },
      risks: [],
      weather: { condition: 'sunny', impact: 'none' },
      notes: 'Installation complète avec programmateur connecté',
      satisfaction: null,
      tags: ['installation', 'arrosage', 'smart']
    },
    {
      id: 'INT-2024-003',
      reference: 'DIAG-PHY-003',
      title: 'Diagnostic phytosanitaire complet',
      client: {
        name: 'Jardin Botanique',
        type: 'Institution',
        priority: 'Premium',
        contact: '04 72 69 47 60'
      },
      location: {
        address: '8 Boulevard des Sciences',
        coordinates: { lat: 45.7290, lng: 4.8270 },
        zone: 'Zone C',
        accessCode: 'JB789'
      },
      schedule: {
        date: new Date('2024-08-16'),
        startTime: '09:00',
        endTime: '11:00',
        duration: 2,
        flexible: false
      },
      team: {
        lead: 'Luc Bernard',
        members: [],
        vehicle: 'Véhicule léger #2',
        equipment: ['Kit diagnostic', 'Loupe', 'pH-mètre']
      },
      status: 'scheduled',
      priority: 'normal',
      type: 'diagnostic',
      progress: 0,
      financial: {
        quote: 350,
        cost: 150,
        margin: 200,
        paid: true
      },
      documentation: {
        photos: 0,
        reports: 0,
        signature: false,
        invoice: true
      },
      risks: [],
      weather: { condition: 'cloudy', impact: 'none' },
      notes: 'Analyse complète des maladies et parasites',
      satisfaction: null,
      tags: ['diagnostic', 'maladie', 'expertise']
    },
    {
      id: 'INT-2024-004',
      reference: 'CREA-JAR-004',
      title: 'Création jardin zen japonais',
      client: {
        name: 'Entreprise TechCorp',
        type: 'Entreprise',
        priority: 'VIP',
        contact: '04 78 12 34 56'
      },
      location: {
        address: '156 Avenue Innovation',
        coordinates: { lat: 45.7485, lng: 4.8467 },
        zone: 'Zone A',
        accessCode: 'TECH2024'
      },
      schedule: {
        date: new Date('2024-08-17'),
        startTime: '08:00',
        endTime: '18:00',
        duration: 10,
        flexible: false
      },
      team: {
        lead: 'Marc Leblanc',
        members: ['Paul M.', 'Luc B.', 'Jean D.', 'Pierre M.'],
        vehicle: 'Camion + Remorque',
        equipment: ['Matériaux', 'Outillage complet', 'Mini-pelle']
      },
      status: 'confirmed',
      priority: 'high',
      type: 'creation',
      progress: 0,
      financial: {
        quote: 8500,
        cost: 4500,
        margin: 4000,
        paid: false
      },
      documentation: {
        photos: 0,
        reports: 0,
        signature: false,
        invoice: false
      },
      risks: ['Travaux lourds'],
      weather: { condition: 'sunny', impact: 'favorable' },
      notes: 'Projet complet avec bassins et éclairage',
      satisfaction: null,
      tags: ['création', 'premium', 'zen', 'japonais']
    },
    {
      id: 'INT-2024-005',
      reference: 'ENT-MEN-005',
      title: 'Entretien mensuel espaces verts',
      client: {
        name: 'Résidence Harmony',
        type: 'Syndic',
        priority: 'Standard',
        contact: '04 78 98 76 54'
      },
      location: {
        address: '23 Rue de la Paix',
        coordinates: { lat: 45.7600, lng: 4.8350 },
        zone: 'Zone B',
        accessCode: null
      },
      schedule: {
        date: new Date('2024-08-18'),
        startTime: '09:00',
        endTime: '12:00',
        duration: 3,
        flexible: true
      },
      team: {
        lead: 'Jean Durand',
        members: ['Pierre M.'],
        vehicle: 'Utilitaire #3',
        equipment: ['Tondeuse', 'Taille-haie', 'Souffleur']
      },
      status: 'completed',
      priority: 'low',
      type: 'entretien',
      progress: 100,
      financial: {
        quote: 450,
        cost: 200,
        margin: 250,
        paid: true
      },
      documentation: {
        photos: 8,
        reports: 1,
        signature: true,
        invoice: true
      },
      risks: [],
      weather: { condition: 'sunny', impact: 'none' },
      notes: 'Contrat mensuel régulier',
      satisfaction: 4.8,
      tags: ['entretien', 'contrat', 'récurrent']
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'in_progress': return 'from-blue-500 to-indigo-500';
      case 'scheduled': return 'from-yellow-500 to-amber-500';
      case 'confirmed': return 'from-purple-500 to-pink-500';
      case 'cancelled': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'urgent': return <FireIcon className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'high': return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      case 'normal': return <BoltIcon className="w-5 h-5 text-blue-500" />;
      case 'low': return <SparklesIcon className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'elagage': return '🌳';
      case 'installation': return '🔧';
      case 'diagnostic': return '🔬';
      case 'creation': return '🎨';
      case 'entretien': return '🧹';
      default: return '📋';
    }
  };

  const filteredInterventions = interventions.filter(intervention => {
    if (filterStatus !== 'all' && intervention.status !== filterStatus) return false;
    if (searchTerm && !intervention.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !intervention.client.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedInterventions = [...filteredInterventions].sort((a, b) => {
    switch(sortBy) {
      case 'date': return new Date(a.schedule.date) - new Date(b.schedule.date);
      case 'priority': 
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'client': return a.client.name.localeCompare(b.client.name);
      case 'amount': return b.financial.quote - a.financial.quote;
      default: return 0;
    }
  });

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Ultra Moderne */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Effet de grille animée */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%), linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)',
            backgroundSize: '50px 50px',
            animation: 'grid 20s linear infinite'
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <CommandLineIcon className="w-8 h-8 mr-3" />
                Gestion Interventions Quantum
              </h1>
              <p className="text-blue-100">Centre de contrôle et supervision avancée</p>
              
              {/* Indicateurs Live */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Système actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalIcon className="w-5 h-5" />
                  <span className="text-sm">Connexion: Excellente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Performance: 98%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Mode: Turbo</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold mb-1">{interventions.length}</div>
              <div className="text-blue-100">Interventions actives</div>
              <button className="mt-3 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg">
                <PlusIcon className="w-5 h-5 inline mr-2" />
                Nouvelle intervention
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Barre de contrôle */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Recherche */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par client, intervention, référence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filtres */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Tous statuts</option>
              <option value="scheduled">Planifiées</option>
              <option value="confirmed">Confirmées</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminées</option>
            </select>

            {/* Tri */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="date">Date</option>
              <option value="priority">Priorité</option>
              <option value="client">Client</option>
              <option value="amount">Montant</option>
            </select>
          </div>

          {/* Vue et Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded ${viewMode === 'kanban' ? 'bg-white shadow' : ''}`}
              >
                Kanban
              </button>
            </div>

            <button 
              onClick={() => setLiveUpdates(!liveUpdates)}
              className={`p-2 rounded-lg transition-colors ${liveUpdates ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <ArrowPathIcon className={`w-5 h-5 ${liveUpdates ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Vue Grille */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedInterventions.map((intervention, index) => (
            <motion.div
              key={intervention.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedIntervention(intervention)}
            >
              {/* Header avec gradient */}
              <div className={`h-2 bg-gradient-to-r ${getStatusColor(intervention.status)}`} />
              
              {/* Badge de référence */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">#{intervention.reference}</span>
                      <span className="text-2xl">{getTypeIcon(intervention.type)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{intervention.title}</h3>
                  </div>
                  {getPriorityIcon(intervention.priority)}
                </div>
              </div>

              {/* Infos client */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{intervention.client.name}</p>
                    <p className="text-xs text-gray-500">{intervention.client.type}</p>
                  </div>
                  {intervention.client.priority === 'VIP' && (
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                      VIP
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {intervention.location.address}
                </div>
              </div>

              {/* Planning et équipe */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(intervention.schedule.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {intervention.schedule.startTime} - {intervention.schedule.endTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{intervention.team.lead}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TruckIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{intervention.team.vehicle}</span>
                  </div>
                </div>

                {/* Progress bar si en cours */}
                {intervention.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progression</span>
                      <span className="font-semibold">{intervention.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${intervention.progress}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                )}

                {/* Infos financières */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{intervention.financial.quote}€</span>
                    <span className="text-xs text-gray-500 ml-2">Devis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {intervention.documentation.photos > 0 && (
                      <div className="flex items-center space-x-1">
                        <PhotoIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{intervention.documentation.photos}</span>
                      </div>
                    )}
                    {intervention.documentation.signature && (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    )}
                    {intervention.financial.paid && (
                      <CurrencyEuroIcon className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Tags */}
                {intervention.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {intervention.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions rapides */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                  <EyeIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                  <PencilIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                  <PhoneIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                  <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vue Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['scheduled', 'confirmed', 'in_progress', 'completed'].map((status) => (
            <div key={status} className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4">
              <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 border-gradient-to-r ${getStatusColor(status)}`}>
                <h3 className="font-semibold text-gray-900 capitalize">
                  {status.replace('_', ' ')}
                </h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {sortedInterventions.filter(i => i.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {sortedInterventions
                  .filter(i => i.status === status)
                  .map((intervention, index) => (
                    <motion.div
                      key={intervention.id}
                      className="p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-mono text-gray-500">#{intervention.reference}</span>
                        {getPriorityIcon(intervention.priority)}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{intervention.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{intervention.client.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(intervention.schedule.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-sm font-bold text-gray-900">{intervention.financial.quote}€</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default InterventionsUltraPremium;