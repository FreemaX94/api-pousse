import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  RocketLaunchIcon,
  Battery100Icon,
  SignalIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  TagIcon,
  HashtagIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  StarIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  CalculatorIcon,
  ScaleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const DevisFacturationUltraPremium = () => {
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [conversionPrediction, setConversionPrediction] = useState({});

  // Simulation IA prédiction
  useEffect(() => {
    const interval = setInterval(() => {
      setConversionPrediction({
        rate: Math.floor(Math.random() * 20) + 70,
        confidence: Math.floor(Math.random() * 10) + 85
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Liste des devis
  const devisList = [
    {
      id: 'DEV-2024-001',
      reference: 'DEV-AUG-001',
      client: {
        name: 'Mairie de Lyon',
        type: 'Institution',
        category: 'VIP',
        email: 'contact@mairie-lyon.fr',
        phone: '04 72 10 30 30',
        address: '1 Place de la Comédie, 69001 Lyon'
      },
      project: 'Aménagement Parc Municipal',
      status: 'sent',
      montant: {
        ht: 45000,
        tva: 9000,
        ttc: 54000,
        acompte: 10800,
        reste: 43200
      },
      items: [
        { description: 'Terrassement et préparation', qty: 1, price: 12000, total: 12000 },
        { description: 'Plantation arbres et arbustes', qty: 50, price: 200, total: 10000 },
        { description: 'Installation système arrosage', qty: 1, price: 8000, total: 8000 },
        { description: 'Mobilier urbain', qty: 10, price: 1500, total: 15000 }
      ],
      dates: {
        created: new Date('2024-08-01'),
        sent: new Date('2024-08-02'),
        validity: new Date('2024-09-01'),
        followUp: new Date('2024-08-20')
      },
      probability: 85,
      score: 92,
      interactions: [
        { type: 'email', date: '2024-08-02', status: 'opened' },
        { type: 'call', date: '2024-08-05', status: 'interested' },
        { type: 'meeting', date: '2024-08-10', status: 'scheduled' }
      ],
      competitors: ['JardinPro', 'VertNature'],
      notes: 'Client très intéressé, décision en conseil municipal le 25/08',
      tags: ['urgent', 'public', 'gros-projet'],
      margin: 35,
      discount: 5
    },
    {
      id: 'DEV-2024-002',
      reference: 'DEV-AUG-002',
      client: {
        name: 'Villa Moderne',
        type: 'Particulier',
        category: 'Premium',
        email: 'contact@villa-moderne.fr',
        phone: '06 12 34 56 78',
        address: '45 Rue des Jardins, 69006 Lyon'
      },
      project: 'Création Jardin Zen',
      status: 'draft',
      montant: {
        ht: 18000,
        tva: 3600,
        ttc: 21600,
        acompte: 4320,
        reste: 17280
      },
      items: [
        { description: 'Conception paysagère', qty: 1, price: 2000, total: 2000 },
        { description: 'Terrassement', qty: 1, price: 3000, total: 3000 },
        { description: 'Bassins et fontaines', qty: 2, price: 4000, total: 8000 },
        { description: 'Plantes japonaises', qty: 1, price: 5000, total: 5000 }
      ],
      dates: {
        created: new Date('2024-08-10'),
        sent: null,
        validity: new Date('2024-09-10'),
        followUp: new Date('2024-08-25')
      },
      probability: 60,
      score: 78,
      interactions: [
        { type: 'email', date: '2024-08-10', status: 'sent' }
      ],
      competitors: ['ZenGarden'],
      notes: 'En attente de validation du design',
      tags: ['design', 'premium', 'zen'],
      margin: 42,
      discount: 0
    },
    {
      id: 'DEV-2024-003',
      reference: 'DEV-AUG-003',
      client: {
        name: 'Entreprise TechCorp',
        type: 'Entreprise',
        category: 'VIP',
        email: 'facilities@techcorp.com',
        phone: '04 78 12 34 56',
        address: '156 Avenue Innovation, 69003 Lyon'
      },
      project: 'Entretien Annuel Espaces Verts',
      status: 'accepted',
      montant: {
        ht: 24000,
        tva: 4800,
        ttc: 28800,
        acompte: 5760,
        reste: 23040
      },
      items: [
        { description: 'Tonte et entretien pelouses', qty: 12, price: 800, total: 9600 },
        { description: 'Taille haies et arbustes', qty: 12, price: 600, total: 7200 },
        { description: 'Fertilisation saisonnière', qty: 4, price: 1200, total: 4800 },
        { description: 'Nettoyage et désherbage', qty: 12, price: 200, total: 2400 }
      ],
      dates: {
        created: new Date('2024-07-15'),
        sent: new Date('2024-07-16'),
        validity: new Date('2024-08-15'),
        followUp: null,
        accepted: new Date('2024-07-20')
      },
      probability: 100,
      score: 98,
      interactions: [
        { type: 'email', date: '2024-07-16', status: 'opened' },
        { type: 'call', date: '2024-07-18', status: 'negotiation' },
        { type: 'email', date: '2024-07-20', status: 'accepted' }
      ],
      competitors: [],
      notes: 'Contrat signé, début des prestations le 01/09',
      tags: ['contrat-annuel', 'récurrent', 'fidélité'],
      margin: 38,
      discount: 10
    },
    {
      id: 'DEV-2024-004',
      reference: 'DEV-AUG-004',
      client: {
        name: 'Résidence Harmony',
        type: 'Syndic',
        category: 'Standard',
        email: 'syndic@harmony.fr',
        phone: '04 78 98 76 54',
        address: '23 Rue de la Paix, 69002 Lyon'
      },
      project: 'Réfection Jardins Communs',
      status: 'expired',
      montant: {
        ht: 15000,
        tva: 3000,
        ttc: 18000,
        acompte: 3600,
        reste: 14400
      },
      items: [
        { description: 'Rénovation pelouses', qty: 500, price: 15, total: 7500 },
        { description: 'Nouveaux massifs floraux', qty: 5, price: 800, total: 4000 },
        { description: 'Réparation arrosage', qty: 1, price: 2000, total: 2000 },
        { description: 'Éclairage jardin', qty: 1, price: 1500, total: 1500 }
      ],
      dates: {
        created: new Date('2024-06-01'),
        sent: new Date('2024-06-02'),
        validity: new Date('2024-07-01'),
        followUp: new Date('2024-06-20')
      },
      probability: 20,
      score: 45,
      interactions: [
        { type: 'email', date: '2024-06-02', status: 'opened' },
        { type: 'call', date: '2024-06-15', status: 'no-answer' }
      ],
      competitors: ['GreenSpace', 'JardinPlus'],
      notes: 'Budget non validé en AG',
      tags: ['perdu', 'relancer', 'syndic'],
      margin: 30,
      discount: 0
    },
    {
      id: 'DEV-2024-005',
      reference: 'DEV-AUG-005',
      client: {
        name: 'Restaurant Le Jardin',
        type: 'Commerce',
        category: 'Premium',
        email: 'direction@lejardin.fr',
        phone: '04 72 45 67 89',
        address: '78 Quai du Rhône, 69006 Lyon'
      },
      project: 'Terrasse Végétalisée',
      status: 'negotiation',
      montant: {
        ht: 12000,
        tva: 2400,
        ttc: 14400,
        acompte: 2880,
        reste: 11520
      },
      items: [
        { description: 'Jardinières sur mesure', qty: 10, price: 500, total: 5000 },
        { description: 'Plantes méditerranéennes', qty: 1, price: 3000, total: 3000 },
        { description: 'Système irrigation', qty: 1, price: 2500, total: 2500 },
        { description: 'Installation et mise en place', qty: 1, price: 1500, total: 1500 }
      ],
      dates: {
        created: new Date('2024-08-05'),
        sent: new Date('2024-08-06'),
        validity: new Date('2024-09-05'),
        followUp: new Date('2024-08-18')
      },
      probability: 70,
      score: 82,
      interactions: [
        { type: 'email', date: '2024-08-06', status: 'opened' },
        { type: 'meeting', date: '2024-08-08', status: 'completed' },
        { type: 'email', date: '2024-08-12', status: 'negotiation' }
      ],
      competitors: ['TerrasseVerte'],
      notes: 'Client demande révision du prix',
      tags: ['négociation', 'terrasse', 'commercial'],
      margin: 40,
      discount: 8
    }
  ];

  // Stats globales
  const globalStats = {
    totalDevis: devisList.length,
    montantTotal: devisList.reduce((acc, d) => acc + d.montant.ht, 0),
    tauxConversion: 45,
    devisEnCours: devisList.filter(d => d.status === 'sent').length,
    devisAcceptes: devisList.filter(d => d.status === 'accepted').length,
    devisExpires: devisList.filter(d => d.status === 'expired').length,
    margeAverage: Math.round(devisList.reduce((acc, d) => acc + d.margin, 0) / devisList.length),
    scoreAverage: Math.round(devisList.reduce((acc, d) => acc + d.score, 0) / devisList.length)
  };

  // Graphique évolution
  const evolutionChart = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
    datasets: [
      {
        label: 'Devis émis',
        data: [12, 15, 18, 22, 19, 24, 28, 25],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Devis acceptés',
        data: [5, 7, 8, 11, 9, 10, 13, 11],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Distribution par statut
  const statusDistribution = {
    labels: ['Brouillon', 'Envoyé', 'Négociation', 'Accepté', 'Expiré'],
    datasets: [{
      data: [1, 1, 1, 1, 1],
      backgroundColor: [
        'rgba(156, 163, 175, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Radar performance
  const performanceRadar = {
    labels: ['Rapidité', 'Précision', 'Suivi', 'Conversion', 'Satisfaction', 'Rentabilité'],
    datasets: [{
      label: 'Performance commerciale',
      data: [88, 92, 85, 75, 90, 82],
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(147, 51, 234)'
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return 'from-gray-400 to-gray-500';
      case 'sent': return 'from-blue-500 to-indigo-500';
      case 'negotiation': return 'from-yellow-500 to-amber-500';
      case 'accepted': return 'from-green-500 to-emerald-500';
      case 'expired': return 'from-red-500 to-rose-500';
      case 'rejected': return 'from-red-600 to-red-700';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { text: 'Brouillon', class: 'bg-gray-100 text-gray-700 border-gray-200' },
      sent: { text: 'Envoyé', class: 'bg-blue-100 text-blue-700 border-blue-200' },
      negotiation: { text: 'Négociation', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      accepted: { text: 'Accepté', class: 'bg-green-100 text-green-700 border-green-200' },
      expired: { text: 'Expiré', class: 'bg-red-100 text-red-700 border-red-200' },
      rejected: { text: 'Refusé', class: 'bg-red-100 text-red-800 border-red-300' }
    };
    return badges[status] || badges.draft;
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-blue-600';
    if (probability >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Ultra Premium */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation de fond */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              backgroundSize: '200% 200%'
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <DocumentTextIcon className="w-8 h-8 mr-3" />
                Devis & Propositions Commerciales
              </h1>
              <p className="text-blue-100">Gestion intelligente et suivi prédictif des conversions</p>
              
              {/* Indicateurs IA */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Système actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">IA: Prédiction {conversionPrediction.rate}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Confiance: {conversionPrediction.confidence}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Mode Pro</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {(globalStats.montantTotal / 1000).toFixed(0)}K€
              </div>
              <div className="text-blue-100">Volume total HT</div>
              <div className="mt-3 flex items-center justify-end space-x-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  Taux: {globalStats.tauxConversion}%
                </span>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300">
                  <PlusIcon className="w-5 h-5 inline mr-1" />
                  Nouveau devis
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Total devis', value: globalStats.totalDevis, icon: '📄', color: 'from-blue-500 to-indigo-500' },
          { label: 'En cours', value: globalStats.devisEnCours, icon: '⏳', color: 'from-yellow-500 to-amber-500', pulse: true },
          { label: 'Acceptés', value: globalStats.devisAcceptes, icon: '✅', color: 'from-green-500 to-emerald-500' },
          { label: 'Expirés', value: globalStats.devisExpires, icon: '❌', color: 'from-red-500 to-rose-500' },
          { label: 'Volume HT', value: `${(globalStats.montantTotal / 1000).toFixed(0)}K€`, icon: '💰', color: 'from-purple-500 to-pink-500' },
          { label: 'Conversion', value: `${globalStats.tauxConversion}%`, icon: '📈', color: 'from-cyan-500 to-blue-500' },
          { label: 'Marge moy.', value: `${globalStats.margeAverage}%`, icon: '💎', color: 'from-indigo-500 to-purple-500' },
          { label: 'Score moy.', value: globalStats.scoreAverage, icon: '⭐', color: 'from-yellow-400 to-orange-400' }
        ].map((kpi) => (
          <motion.div
            key={kpi.label}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`h-1 bg-gradient-to-r ${kpi.color}`} />
            <div className="p-3">
              <div className="text-xl font-bold text-gray-900 flex items-center">
                {kpi.icon} {kpi.value}
                {kpi.pulse && <div className="ml-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />}
              </div>
              <div className="text-xs text-gray-600">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre de contrôle */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par client, projet, référence..."
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
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyé</option>
              <option value="negotiation">Négociation</option>
              <option value="accepted">Accepté</option>
              <option value="expired">Expiré</option>
            </select>

            {/* Vue */}
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
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-3 py-2 rounded-lg font-medium ${
                showAnalytics ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <ChartBarIcon className="w-5 h-5 inline mr-1" />
              Analytics
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des devis */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Devis Actifs
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {devisList.map((devis, index) => (
                  <motion.div
                    key={devis.id}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedDevis(devis)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header devis */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-mono text-gray-500">#{devis.reference}</span>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusBadge(devis.status).class}`}>
                            {getStatusBadge(devis.status).text}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{devis.project}</h4>
                        <p className="text-sm text-gray-600">{devis.client.name} - {devis.client.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{(devis.montant.ht / 1000).toFixed(0)}K€</div>
                        <div className="text-xs text-gray-500">HT</div>
                        {devis.discount > 0 && (
                          <span className="text-xs text-orange-600">-{devis.discount}% remise</span>
                        )}
                      </div>
                    </div>

                    {/* Infos principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {devis.dates.created.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Validité: {Math.ceil((devis.dates.validity - new Date()) / (1000 * 60 * 60 * 24))}j
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ScaleIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          Marge: {devis.margin}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ChartBarIcon className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm font-semibold ${getProbabilityColor(devis.probability)}`}>
                          {devis.probability}% prob.
                        </span>
                      </div>
                    </div>

                    {/* Barre de progression probabilité */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Probabilité de conversion</span>
                        <span className="font-semibold">{devis.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            devis.probability >= 80 ? 'from-green-500 to-emerald-500' :
                            devis.probability >= 60 ? 'from-blue-500 to-indigo-500' :
                            devis.probability >= 40 ? 'from-yellow-500 to-amber-500' :
                            'from-red-500 to-orange-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${devis.probability}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    {/* Interactions */}
                    <div className="flex items-center space-x-4 mb-3">
                      {devis.interactions.map((interaction, i) => (
                        <div key={i} className="flex items-center space-x-1 text-xs text-gray-600">
                          {interaction.type === 'email' && <EnvelopeIcon className="w-3 h-3" />}
                          {interaction.type === 'call' && <PhoneIcon className="w-3 h-3" />}
                          {interaction.type === 'meeting' && <UserGroupIcon className="w-3 h-3" />}
                          <span>{interaction.status}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags et Score */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {devis.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold ml-1">{devis.score}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-200 space-x-2">
                      <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                        <PaperAirplaneIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Analytics */}
        {showAnalytics && (
          <div className="space-y-6">
            {/* Graphique évolution */}
            <motion.div 
              className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Mensuelle</h3>
              <div className="h-48">
                <Line
                  data={evolutionChart}
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
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* Distribution statuts */}
            <motion.div 
              className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Statuts</h3>
              <div className="h-48">
                <Doughnut
                  data={statusDistribution}
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

            {/* Performance radar */}
            <motion.div 
              className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Commerciale</h3>
              <div className="h-48">
                <Radar
                  data={performanceRadar}
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

            {/* Centre d'actions */}
            <motion.div 
              className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Actions Recommandées
              </h3>
              <div className="space-y-3">
                <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">3 devis à relancer</span>
                    <BellAlertIcon className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div className="text-xs mt-1 opacity-90">Validité < 7 jours</div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">2 négociations en cours</span>
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  </div>
                  <div className="text-xs mt-1 opacity-90">Action requise</div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <CalculatorIcon className="w-5 h-5 inline mr-2" />
                Optimiser les prix
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DevisFacturationUltraPremium;