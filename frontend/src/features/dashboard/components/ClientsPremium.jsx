import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserGroupIcon, 
  StarIcon, 
  TrophyIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  ClockIcon,
  TagIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { Doughnut, Line, Bar, Radar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import confetti from 'canvas-confetti';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ClientsPremium = ({ theme = 'dark' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const getThemeColors = () => {
    const themes = {
      neon: {
        cardBg: 'from-black/95 to-purple-900/40',
        textPrimary: 'text-cyan-100',
        textSecondary: 'text-fuchsia-400',
        accent: 'from-fuchsia-500 to-cyan-500',
        border: 'border-fuchsia-500/50',
        glassBg: 'bg-black/80',
        special: 'neon-glow'
      },
      galaxy: {
        cardBg: 'from-indigo-900/90 to-purple-900/50',
        textPrimary: 'text-blue-100',
        textSecondary: 'text-purple-300',
        accent: 'from-blue-400 to-purple-600',
        border: 'border-purple-400/30',
        glassBg: 'bg-slate-900/80',
        special: 'galaxy-stars'
      },
      sunset: {
        cardBg: 'from-orange-900/80 to-pink-900/40',
        textPrimary: 'text-orange-100',
        textSecondary: 'text-pink-300',
        accent: 'from-orange-400 to-pink-500',
        border: 'border-orange-400/30',
        glassBg: 'bg-rose-950/70',
        special: 'sunset-glow'
      },
      ocean: {
        cardBg: 'from-blue-900/90 to-teal-900/50',
        textPrimary: 'text-blue-100',
        textSecondary: 'text-teal-300',
        accent: 'from-blue-400 to-teal-500',
        border: 'border-teal-400/30',
        glassBg: 'bg-blue-950/80',
        special: 'ocean-waves'
      },
      dark: {
        cardBg: 'from-gray-900 to-gray-800',
        textPrimary: 'text-gray-100',
        textSecondary: 'text-gray-400',
        accent: 'from-gray-600 to-gray-700',
        border: 'border-gray-700',
        glassBg: 'bg-gray-900/90',
        special: null
      }
    };
    return themes[theme] || themes.dark;
  };

  const themeColors = getThemeColors();

  // Données simulées des clients
  const clients = [
    {
      id: 1,
      name: 'Entreprise Luxor',
      type: 'Entreprise',
      segment: 'premium',
      value: 125000,
      score: 95,
      contracts: 5,
      lastOrder: '2024-03-15',
      status: 'actif',
      email: 'contact@luxor.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Rue de la République, Paris',
      loyalty: 98,
      trend: 'up',
      tags: ['VIP', 'Fidèle', 'Grand compte'],
      revenue: [45000, 52000, 48000, 61000, 58000, 65000],
      orderFrequency: 12,
      avgOrderValue: 10416,
      paymentDelay: 15,
      satisfaction: 4.8,
      referrals: 3
    },
    {
      id: 2,
      name: 'Jean Dupont',
      type: 'Particulier',
      segment: 'standard',
      value: 8500,
      score: 72,
      contracts: 1,
      lastOrder: '2024-03-20',
      status: 'actif',
      email: 'jean.dupont@email.com',
      phone: '+33 6 12 34 56 78',
      address: '45 Avenue des Fleurs, Lyon',
      loyalty: 65,
      trend: 'stable',
      tags: ['Régulier'],
      revenue: [1500, 1800, 1200, 1500, 1600, 1900],
      orderFrequency: 6,
      avgOrderValue: 1416,
      paymentDelay: 30,
      satisfaction: 4.2,
      referrals: 1
    },
    {
      id: 3,
      name: 'Green Garden SARL',
      type: 'Entreprise',
      segment: 'premium',
      value: 87000,
      score: 88,
      contracts: 3,
      lastOrder: '2024-03-18',
      status: 'actif',
      email: 'info@greengarden.fr',
      phone: '+33 4 56 78 90 12',
      address: '78 Boulevard Nature, Marseille',
      loyalty: 85,
      trend: 'up',
      tags: ['Écologique', 'Contrat annuel'],
      revenue: [28000, 31000, 29000, 35000, 32000, 38000],
      orderFrequency: 10,
      avgOrderValue: 8700,
      paymentDelay: 20,
      satisfaction: 4.6,
      referrals: 2
    },
    {
      id: 4,
      name: 'Marie Martin',
      type: 'Particulier',
      segment: 'occasionnel',
      value: 2300,
      score: 45,
      contracts: 0,
      lastOrder: '2024-02-10',
      status: 'inactif',
      email: 'marie.martin@email.com',
      phone: '+33 6 98 76 54 32',
      address: '12 Rue des Lilas, Bordeaux',
      loyalty: 30,
      trend: 'down',
      tags: ['À relancer'],
      revenue: [800, 600, 0, 900, 0, 0],
      orderFrequency: 3,
      avgOrderValue: 766,
      paymentDelay: 45,
      satisfaction: 3.8,
      referrals: 0
    },
    {
      id: 5,
      name: 'Tech Solutions SAS',
      type: 'Entreprise',
      segment: 'premium',
      value: 156000,
      score: 99,
      contracts: 8,
      lastOrder: '2024-03-22',
      status: 'vip',
      email: 'ceo@techsolutions.com',
      phone: '+33 1 87 65 43 21',
      address: '200 Avenue Innovation, Paris',
      loyalty: 100,
      trend: 'up',
      tags: ['VIP', 'Stratégique', 'Innovation'],
      revenue: [48000, 51000, 52000, 58000, 61000, 68000],
      orderFrequency: 18,
      avgOrderValue: 8666,
      paymentDelay: 10,
      satisfaction: 4.9,
      referrals: 5
    }
  ];

  // KPIs globaux
  const kpis = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'actif' || c.status === 'vip').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.value, 0),
    avgSatisfaction: (clients.reduce((sum, c) => sum + c.satisfaction, 0) / clients.length).toFixed(1),
    vipClients: clients.filter(c => c.segment === 'premium').length,
    retentionRate: 89
  };

  const handleUpgradeClient = (client) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF00FF', '#00FFFF', '#FFD700']
    });
    // Client upgraded
  };

  const getSegmentColor = (segment) => {
    switch(segment) {
      case 'premium': return 'from-yellow-500 to-amber-600';
      case 'standard': return 'from-blue-500 to-indigo-600';
      case 'occasionnel': return 'from-gray-500 to-slate-600';
      case 'vip': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'actif': return 'from-green-500 to-emerald-600';
      case 'inactif': return 'from-red-500 to-pink-600';
      case 'vip': return 'from-purple-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = filterSegment === 'all' || client.segment === filterSegment;
    return matchesSearch && matchesSegment;
  });

  // Configuration des graphiques
  const segmentationData = {
    labels: ['Premium', 'Standard', 'Occasionnel'],
    datasets: [{
      data: [
        clients.filter(c => c.segment === 'premium').length,
        clients.filter(c => c.segment === 'standard').length,
        clients.filter(c => c.segment === 'occasionnel').length
      ],
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderColor: [
        'rgba(255, 215, 0, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(107, 114, 128, 1)'
      ],
      borderWidth: 2
    }]
  };

  const revenueEvolutionData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Chiffre d\'affaires',
      data: [120000, 135000, 128000, 145000, 152000, 168000],
      borderColor: theme === 'neon' ? 'rgba(0, 255, 255, 1)' : 'rgba(59, 130, 246, 1)',
      backgroundColor: theme === 'neon' ? 'rgba(0, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const satisfactionData = {
    labels: ['Service', 'Qualité', 'Prix', 'Délai', 'Communication'],
    datasets: [{
      label: 'Satisfaction moyenne',
      data: [4.5, 4.7, 4.2, 4.3, 4.6],
      backgroundColor: theme === 'neon' ? 'rgba(255, 0, 255, 0.6)' : 'rgba(147, 51, 234, 0.6)',
      borderColor: theme === 'neon' ? 'rgba(255, 0, 255, 1)' : 'rgba(147, 51, 234, 1)',
      borderWidth: 2
    }]
  };

  const ClientCard = React.forwardRef(({ client, delay }, ref) => (
    <div
      ref={ref}
      onClick={() => setSelectedClient(client)}
      className="relative group cursor-pointer"
    >
      {/* Effet de bordure au hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${themeColors.accent} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
      
      <div className={`relative overflow-hidden rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border shadow-xl transition-all duration-300 group-hover:shadow-2xl`}>
        {/* Badge VIP - seulement pour les clients VIP */}
        {client.status === 'vip' && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl" />
              <div className="relative bg-gradient-to-br from-purple-400 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrophyIcon className="w-3 h-3" />
                VIP
              </div>
            </div>
          </div>
        )}

        {/* Header avec avatar et infos */}
        <div className={`p-6 bg-gradient-to-br ${getSegmentColor(client.segment)} bg-opacity-10`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${getSegmentColor(client.segment)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
              >
                {client.type === 'Entreprise' ? 
                  <BuildingOfficeIcon className="w-8 h-8" /> : 
                  client.name.split(' ').map(n => n[0]).join('')
                }
              </div>
              <div>
                <h3 className={`text-xl font-bold ${themeColors.textPrimary}`}>{client.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm ${themeColors.textSecondary}`}>{client.type}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${getStatusColor(client.status)} text-white`}>
                    {client.status === 'vip' ? 'VIP' : client.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Score de fidélité */}
            <div className="text-right">
              <div className={`text-2xl font-bold ${themeColors.textPrimary}`}>
                {client.score}
                <span className="text-sm">%</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(client.satisfaction) ? 'text-yellow-400 fill-yellow-400' : themeColors.textSecondary}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {client.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 text-xs rounded-full ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textSecondary}`}
              >
                <TagIcon className="w-3 h-3 inline mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Métriques clés */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className={`text-center p-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
              <CurrencyEuroIcon className={`w-5 h-5 mx-auto mb-1 ${themeColors.textSecondary}`} />
              <div className={`text-lg font-bold ${themeColors.textPrimary}`}>
                {(client.value / 1000).toFixed(0)}k€
              </div>
              <div className={`text-xs ${themeColors.textSecondary}`}>CA Total</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
              <DocumentTextIcon className={`w-5 h-5 mx-auto mb-1 ${themeColors.textSecondary}`} />
              <div className={`text-lg font-bold ${themeColors.textPrimary}`}>
                {client.contracts}
              </div>
              <div className={`text-xs ${themeColors.textSecondary}`}>Contrats</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
              <HeartIcon className={`w-5 h-5 mx-auto mb-1 ${themeColors.textSecondary}`} />
              <div className={`text-lg font-bold ${themeColors.textPrimary}`}>
                {client.loyalty}%
              </div>
              <div className={`text-xs ${themeColors.textSecondary}`}>Fidélité</div>
            </div>
          </div>

          {/* Graphique mini de l'évolution */}
          <div className={`p-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border mb-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${themeColors.textSecondary}`}>Évolution CA</span>
              <span className={`flex items-center gap-1 text-xs ${client.trend === 'up' ? 'text-green-400' : client.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                {client.trend === 'up' ? <ArrowTrendingUpIcon className="w-3 h-3" /> : 
                 client.trend === 'down' ? <ArrowTrendingDownIcon className="w-3 h-3" /> : null}
                {client.trend === 'up' ? '+12%' : client.trend === 'down' ? '-8%' : '0%'}
              </span>
            </div>
            <div className="h-16">
              <Line 
                data={{
                  labels: ['J', 'F', 'M', 'A', 'M', 'J'],
                  datasets: [{
                    data: client.revenue,
                    borderColor: client.trend === 'up' ? 'rgba(52, 211, 153, 1)' : 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { display: false },
                    y: { display: false }
                  }
                }}
              />
            </div>
          </div>

          {/* Contact rapide */}
          <div className={`p-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
            <div className="flex items-center justify-between gap-2">
              <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <EnvelopeIcon className="w-4 h-4" />
                <span className="truncate">{client.email}</span>
              </a>
              <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors">
                <PhoneIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2 rounded-lg bg-gradient-to-r ${themeColors.accent} text-white font-medium transition-all duration-300`}
            >
              Voir détails
            </motion.button>
            {client.segment !== 'premium' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpgradeClient(client);
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium transition-all duration-300"
              >
                <SparklesIcon className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Effet spécial selon le thème */}
        {themeColors.special === 'neon-glow' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-300 animate-pulse" />
        )}
      </div>
    </div>
  ));

  return (
    <div className={`min-h-screen ${themeColors.glassBg} backdrop-blur-xl p-6`}>
      {/* Header avec titre et KPIs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-4xl font-bold ${themeColors.textPrimary} mb-2`}>
              Gestion Clients
            </h1>
            <p className={themeColors.textSecondary}>
              Gérez vos clients avec une interface ultra-moderne et des analyses avancées
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-6 py-3 rounded-lg bg-gradient-to-r ${themeColors.accent} text-white font-medium flex items-center gap-2`}
            >
              <ChartPieIcon className="w-5 h-5" />
              Analytics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Nouveau Client
            </motion.button>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total Clients', value: kpis.totalClients, icon: UserGroupIcon, color: 'from-blue-500 to-indigo-600', trend: '+5' },
            { label: 'Clients Actifs', value: kpis.activeClients, icon: CheckBadgeIcon, color: 'from-green-500 to-emerald-600', trend: '+3' },
            { label: 'CA Total', value: `${(kpis.totalRevenue / 1000).toFixed(0)}k€`, icon: CurrencyEuroIcon, color: 'from-yellow-500 to-amber-600', trend: '+12%' },
            { label: 'Satisfaction', value: kpis.avgSatisfaction, icon: StarIcon, color: 'from-purple-500 to-pink-600', trend: '+0.2' },
            { label: 'Clients VIP', value: kpis.vipClients, icon: TrophyIcon, color: 'from-orange-500 to-red-600', trend: '+1' },
            { label: 'Rétention', value: `${kpis.retentionRate}%`, icon: HeartIcon, color: 'from-pink-500 to-rose-600', trend: '+2%' }
          ].map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative overflow-hidden rounded-xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border p-4`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-10`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`w-6 h-6 ${themeColors.textSecondary}`} />
                  <span className="text-xs text-green-400 font-medium">{kpi.trend}</span>
                </div>
                <div className={`text-2xl font-bold ${themeColors.textPrimary}`}>{kpi.value}</div>
                <div className={`text-xs ${themeColors.textSecondary} mt-1`}>{kpi.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeColors.textSecondary}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un client..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary} placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'premium', 'standard', 'occasionnel'].map((segment) => (
              <motion.button
                key={segment}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterSegment(segment)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  filterSegment === segment
                    ? `bg-gradient-to-r ${themeColors.accent} text-white`
                    : `${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary}`
                }`}
              >
                {segment === 'all' ? 'Tous' : segment.charAt(0).toUpperCase() + segment.slice(1)}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className={`px-4 py-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary}`}
            >
              {viewMode === 'grid' ? 'Liste' : 'Grille'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Section Analytics (toggle) */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-3 gap-6">
              {/* Segmentation */}
              <div className={`p-6 rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}>
                <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Segmentation Clients</h3>
                <div className="h-64">
                  <Doughnut data={segmentationData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: theme === 'dark' ? '#9CA3AF' : '#E5E7EB' }
                      }
                    }
                  }} />
                </div>
              </div>

              {/* Évolution CA */}
              <div className={`p-6 rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}>
                <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Évolution du CA</h3>
                <div className="h-64">
                  <Line data={revenueEvolutionData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      x: { 
                        grid: { display: false },
                        ticks: { color: theme === 'dark' ? '#9CA3AF' : '#E5E7EB' }
                      },
                      y: { 
                        grid: { color: theme === 'dark' ? '#374151' : '#E5E7EB' },
                        ticks: { color: theme === 'dark' ? '#9CA3AF' : '#E5E7EB' }
                      }
                    }
                  }} />
                </div>
              </div>

              {/* Satisfaction */}
              <div className={`p-6 rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}>
                <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Satisfaction Clients</h3>
                <div className="h-64">
                  <Radar data={satisfactionData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    scales: {
                      r: {
                        grid: { color: theme === 'dark' ? '#374151' : '#E5E7EB' },
                        angleLines: { color: theme === 'dark' ? '#374151' : '#E5E7EB' },
                        ticks: { 
                          color: theme === 'dark' ? '#9CA3AF' : '#E5E7EB',
                          backdropColor: 'transparent'
                        },
                        suggestedMin: 0,
                        suggestedMax: 5
                      }
                    },
                    plugins: {
                      legend: { display: false }
                    }
                  }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grille de clients */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={viewMode === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}
        >
          {filteredClients.map((client, idx) => (
            <ClientCard key={client.id} client={client} delay={idx} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Modal détails client */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedClient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-4xl rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border p-8 max-h-[90vh] overflow-y-auto`}
            >
              <h2 className={`text-2xl font-bold ${themeColors.textPrimary} mb-6`}>
                Détails de {selectedClient.name}
              </h2>
              {/* Contenu détaillé du client */}
              <div className="space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
                    <h3 className={`font-semibold ${themeColors.textPrimary} mb-3`}>Informations</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4" />
                        <span className={themeColors.textSecondary}>{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        <span className={themeColors.textSecondary}>{selectedClient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span className={themeColors.textSecondary}>{selectedClient.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
                    <h3 className={`font-semibold ${themeColors.textPrimary} mb-3`}>Métriques</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                          {selectedClient.orderFrequency}
                        </div>
                        <div className={`text-xs ${themeColors.textSecondary}`}>Commandes/an</div>
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                          {selectedClient.avgOrderValue}€
                        </div>
                        <div className={`text-xs ${themeColors.textSecondary}`}>Panier moyen</div>
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                          {selectedClient.paymentDelay}j
                        </div>
                        <div className={`text-xs ${themeColors.textSecondary}`}>Délai paiement</div>
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                          {selectedClient.referrals}
                        </div>
                        <div className={`text-xs ${themeColors.textSecondary}`}>Parrainages</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary} font-medium`}
                    onClick={() => setSelectedClient(null)}
                  >
                    Fermer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium"
                  >
                    Modifier
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientsPremium;