// Devis Premium - Interface Ultra Moderne avec IA 💎
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyEuroIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  SparklesIcon,
  BoltIcon,
  PaperAirplaneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ShareIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  TagIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut } from 'react-chartjs-2';
import confetti from 'canvas-confetti';

// Composant de carte de devis moderne
const DevisCard = ({ devis, onView, onEdit, onDuplicate, onDelete, onConvert }) => {
  const getStatusColor = (statut) => {
    const colors = {
      'En attente': 'from-yellow-500 to-amber-500',
      'Accepté': 'from-green-500 to-emerald-500',
      'Refusé': 'from-red-500 to-rose-500',
      'Expiré': 'from-gray-500 to-slate-500'
    };
    return colors[statut] || 'from-blue-500 to-indigo-500';
  };

  const getStatusIcon = (statut) => {
    const icons = {
      'En attente': ClockIcon,
      'Accepté': CheckCircleIcon,
      'Refusé': XCircleIcon,
      'Expiré': ExclamationTriangleIcon
    };
    const Icon = icons[statut] || DocumentTextIcon;
    return <Icon className="w-4 h-4" />;
  };

  const daysUntilExpiry = Math.ceil((new Date(devis.dateExpiration) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntilExpiry <= 3 && daysUntilExpiry > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group"
    >
      {/* Badge urgent */}
      {isUrgent && (
        <motion.div
          className="absolute -top-2 -right-2 z-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            {daysUntilExpiry}j restants
          </div>
        </motion.div>
      )}

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all">
        {/* Header avec statut */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-gradient-to-r ${getStatusColor(devis.statut)} rounded-lg text-white`}>
              {getStatusIcon(devis.statut)}
            </div>
            <div>
              <p className="text-xs text-gray-400">N° {devis.numero}</p>
              <p className="text-sm text-white font-semibold">{devis.statut}</p>
            </div>
          </div>
          
          {/* Menu actions rapides */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onView(devis)}
              className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30"
            >
              <EyeIcon className="w-4 h-4 text-blue-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(devis)}
              className="p-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30"
            >
              <PencilIcon className="w-4 h-4 text-purple-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDuplicate(devis)}
              className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30"
            >
              <DocumentDuplicateIcon className="w-4 h-4 text-green-400" />
            </motion.button>
          </div>
        </div>

        {/* Informations client */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-white">{devis.client}</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <PhoneIcon className="w-4 h-4" />
              <span>{devis.telephone || 'Non renseigné'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <EnvelopeIcon className="w-4 h-4" />
              <span>{devis.email || 'Non renseigné'}</span>
            </span>
          </div>
        </div>

        {/* Montant avec progression */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Montant Total</span>
            <span className="text-2xl font-bold text-white">
              {devis.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          {/* Barre de progression du taux de marge */}
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${(devis.marge || 30)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Marge: {devis.marge || 30}%</p>
        </div>

        {/* Dates importantes */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Créé le</p>
              <p className="text-sm text-white">{new Date(devis.dateDevis).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Expire le</p>
              <p className="text-sm text-white">{new Date(devis.dateExpiration).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>

        {/* Tags et labels */}
        <div className="flex flex-wrap gap-2 mb-4">
          {devis.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions principales */}
        {devis.statut === 'En attente' && (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onConvert(devis);
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              }}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium"
            >
              Convertir en facture
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-medium"
            >
              Relancer
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Composant de statistiques
const DevisStats = ({ devis }) => {
  const stats = useMemo(() => {
    const total = devis.length;
    const enAttente = devis.filter(d => d.statut === 'En attente').length;
    const acceptes = devis.filter(d => d.statut === 'Accepté').length;
    const refuses = devis.filter(d => d.statut === 'Refusé').length;
    const montantTotal = devis.reduce((acc, d) => acc + d.totalTTC, 0);
    const montantAccepte = devis.filter(d => d.statut === 'Accepté').reduce((acc, d) => acc + d.totalTTC, 0);
    const tauxConversion = total > 0 ? (acceptes / total * 100).toFixed(1) : 0;

    return {
      total,
      enAttente,
      acceptes,
      refuses,
      montantTotal,
      montantAccepte,
      tauxConversion
    };
  }, [devis]);

  const chartData = {
    labels: ['En attente', 'Acceptés', 'Refusés'],
    datasets: [{
      data: [stats.enAttente, stats.acceptes, stats.refuses],
      backgroundColor: [
        'rgba(250, 204, 21, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const kpis = [
    {
      label: 'Total devis',
      value: stats.total,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-indigo-500',
      trend: '+12%'
    },
    {
      label: 'Montant total',
      value: stats.montantTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
      icon: CurrencyEuroIcon,
      color: 'from-green-500 to-emerald-500',
      trend: '+28%'
    },
    {
      label: 'Taux conversion',
      value: `${stats.tauxConversion}%`,
      icon: ArrowTrendingUpIcon,
      color: 'from-purple-500 to-pink-500',
      trend: '+5%'
    },
    {
      label: 'En attente',
      value: stats.enAttente,
      icon: ClockIcon,
      color: 'from-yellow-500 to-amber-500',
      trend: '-3%'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* KPI Cards */}
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${kpi.color} rounded-xl`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xs font-medium ${
                kpi.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Composant principal
const DevisPremium = ({ themeColors }) => {
  const [devis, setDevis] = useState([
    {
      numero: 'DEV-2025-001',
      dateDevis: '2025-01-01',
      dateExpiration: '2025-01-31',
      client: 'Crystal Tech Solutions',
      telephone: '01 23 45 67 89',
      email: 'contact@crystaltech.fr',
      statut: 'En attente',
      totalTTC: 15750,
      marge: 35,
      tags: ['Urgent', 'VIP', 'Récurrent']
    },
    {
      numero: 'DEV-2025-002',
      dateDevis: '2025-01-02',
      dateExpiration: '2025-02-01',
      client: 'Green Energy Corp',
      telephone: '01 98 76 54 32',
      email: 'info@greenenergy.fr',
      statut: 'Accepté',
      totalTTC: 28500,
      marge: 42,
      tags: ['Stratégique', 'Long terme']
    },
    {
      numero: 'DEV-2025-003',
      dateDevis: '2025-01-03',
      dateExpiration: '2025-01-20',
      client: 'Digital Innovation Lab',
      telephone: '01 11 22 33 44',
      email: 'contact@digilab.fr',
      statut: 'En attente',
      totalTTC: 8900,
      marge: 28,
      tags: ['Startup', 'Tech']
    },
    {
      numero: 'DEV-2025-004',
      dateDevis: '2025-01-04',
      dateExpiration: '2025-02-03',
      client: 'Luxury Hotels Group',
      telephone: '01 55 66 77 88',
      email: 'pro@luxuryhotels.fr',
      statut: 'Refusé',
      totalTTC: 45200,
      marge: 48,
      tags: ['Premium', 'International']
    },
    {
      numero: 'DEV-2025-005',
      dateDevis: '2025-01-05',
      dateExpiration: '2025-01-10',
      client: 'Smart City Solutions',
      telephone: '01 44 55 66 77',
      email: 'contact@smartcity.fr',
      statut: 'En attente',
      totalTTC: 32100,
      marge: 38,
      tags: ['Innovation', 'IoT', 'Urgent']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban
  const [showStats, setShowStats] = useState(true);
  const [selectedDevis, setSelectedDevis] = useState(null);

  // Filtrage et tri
  const filteredDevis = useMemo(() => {
    let filtered = [...devis];

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.numero.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(d => d.statut === filterStatus);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateDevis) - new Date(a.dateDevis);
        case 'montant':
          return b.totalTTC - a.totalTTC;
        case 'client':
          return a.client.localeCompare(b.client);
        default:
          return 0;
      }
    });

    return filtered;
  }, [devis, searchTerm, filterStatus, sortBy]);

  const handleView = (devis) => {
    setSelectedDevis(devis);
    // Ouvrir modal ou naviguer
  };

  const handleEdit = (devis) => {
    console.log('Edit devis:', devis);
  };

  const handleDuplicate = (devis) => {
    const newDevis = {
      ...devis,
      numero: `DEV-2025-${String(devis.length + 1).padStart(3, '0')}`,
      dateDevis: new Date().toISOString().split('T')[0],
      statut: 'En attente'
    };
    setDevis([...devis, newDevis]);
  };

  const handleDelete = (devis) => {
    setDevis(prev => prev.filter(d => d.numero !== devis.numero));
  };

  const handleConvert = (devis) => {
    // Convertir en facture
    console.log('Convert to invoice:', devis);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header avec titre et actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
            <DocumentTextIcon className="w-8 h-8 text-purple-400" />
            <span>Devis</span>
            <span className="ml-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
              BETA
            </span>
          </h1>
          <p className="text-gray-400 mt-1">Gérez vos devis avec intelligence artificielle</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bouton IA Assistant */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center space-x-2"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>IA Assistant</span>
          </motion.button>

          {/* Bouton nouveau devis */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nouveau devis</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <AnimatePresence>
        {showStats && <DevisStats devis={devis} />}
      </AnimatePresence>

      {/* Barre de recherche et filtres */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un devis, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Filtres */}
          <div className="flex items-center space-x-3">
            {/* Filtre statut */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="Accepté">Accepté</option>
              <option value="Refusé">Refusé</option>
              <option value="Expiré">Expiré</option>
            </select>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="date">Date</option>
              <option value="montant">Montant</option>
              <option value="client">Client</option>
            </select>

            {/* Toggle stats */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(!showStats)}
              className="p-3 bg-purple-500/20 rounded-lg text-purple-400"
            >
              <ChartBarIcon className="w-5 h-5" />
            </motion.button>

            {/* Export */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-blue-500/20 rounded-lg text-blue-400"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Liste des devis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDevis.map((devis) => (
            <DevisCard
              key={devis.numero}
              devis={devis}
              onView={handleView}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onConvert={handleConvert}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Message si aucun résultat */}
      {filteredDevis.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <DocumentTextIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucun devis trouvé</h3>
          <p className="text-gray-400">Modifiez vos filtres ou créez un nouveau devis</p>
        </motion.div>
      )}
    </div>
  );
};

export default DevisPremium;