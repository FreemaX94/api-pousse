import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon,
  BuildingOfficeIcon,
  HomeIcon,
  TruckIcon,
  ClockIcon,
  GlobeAltIcon,
  MapIcon,
  FlagIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  SignalIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Doughnut, Bar, Line, Radar, PolarArea } from 'react-chartjs-2';
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

const AdressesPremium = ({ theme = 'dark' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Animation du temps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Données simulées des adresses
  const addresses = [
    {
      id: 1,
      name: 'Siège Social Luxor',
      type: 'siege',
      client: 'Entreprise Luxor',
      address: '123 Rue de la République',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      zone: 'Zone A - Centre',
      priority: 'haute',
      status: 'actif',
      deliveryTime: '08:00 - 12:00',
      accessCode: 'A4523',
      contact: 'M. Dubois',
      phone: '+33 1 23 45 67 89',
      email: 'contact@luxor.com',
      lastVisit: '2024-03-20',
      visitFrequency: 'hebdomadaire',
      avgDeliveryTime: 45,
      deliverySuccess: 98,
      notes: 'Accès par portail automatique',
      services: ['Entretien', 'Livraison', 'Installation'],
      distance: 5.2,
      accessibility: 'excellent',
      parkingAvailable: true,
      restrictions: [],
      interventions: 24,
      revenue: 45000
    },
    {
      id: 2,
      name: 'Résidence Les Jardins',
      type: 'residence',
      client: 'Syndic Immobilier',
      address: '45 Avenue des Fleurs',
      city: 'Lyon',
      postalCode: '69000',
      country: 'France',
      coordinates: { lat: 45.7640, lng: 4.8357 },
      zone: 'Zone B - Périphérie',
      priority: 'normale',
      status: 'actif',
      deliveryTime: '14:00 - 18:00',
      accessCode: 'B7896',
      contact: 'Mme Martin',
      phone: '+33 4 56 78 90 12',
      email: 'syndic@jardins.fr',
      lastVisit: '2024-03-18',
      visitFrequency: 'mensuelle',
      avgDeliveryTime: 30,
      deliverySuccess: 95,
      notes: 'Gardien présent',
      services: ['Entretien', 'Urgence'],
      distance: 12.8,
      accessibility: 'bon',
      parkingAvailable: true,
      restrictions: ['Pas de livraison le dimanche'],
      interventions: 12,
      revenue: 18000
    },
    {
      id: 3,
      name: 'Entrepôt Logistique Nord',
      type: 'entrepot',
      client: 'Green Garden SARL',
      address: '78 Boulevard Industriel',
      city: 'Marseille',
      postalCode: '13000',
      country: 'France',
      coordinates: { lat: 43.2965, lng: 5.3698 },
      zone: 'Zone C - Industrielle',
      priority: 'haute',
      status: 'actif',
      deliveryTime: '06:00 - 22:00',
      accessCode: 'C1234',
      contact: 'M. Leclerc',
      phone: '+33 4 91 23 45 67',
      email: 'depot@greengarden.fr',
      lastVisit: '2024-03-22',
      visitFrequency: 'quotidienne',
      avgDeliveryTime: 60,
      deliverySuccess: 92,
      notes: 'Quai de chargement n°3',
      services: ['Stock', 'Distribution', 'Préparation'],
      distance: 25.5,
      accessibility: 'moyen',
      parkingAvailable: true,
      restrictions: ['Poids lourd uniquement'],
      interventions: 156,
      revenue: 87000
    },
    {
      id: 4,
      name: 'Bureau Régional',
      type: 'bureau',
      client: 'Tech Solutions SAS',
      address: '200 Avenue Innovation',
      city: 'Bordeaux',
      postalCode: '33000',
      country: 'France',
      coordinates: { lat: 44.8378, lng: -0.5792 },
      zone: 'Zone D - Tertiaire',
      priority: 'critique',
      status: 'vip',
      deliveryTime: '09:00 - 18:00',
      accessCode: 'VIP999',
      contact: 'CEO Direct',
      phone: '+33 5 56 00 11 22',
      email: 'ceo@techsolutions.com',
      lastVisit: '2024-03-21',
      visitFrequency: 'bi-hebdomadaire',
      avgDeliveryTime: 25,
      deliverySuccess: 100,
      notes: 'Client VIP - Priorité absolue',
      services: ['Premium', 'Express', 'Conciergerie'],
      distance: 8.3,
      accessibility: 'excellent',
      parkingAvailable: true,
      restrictions: [],
      interventions: 48,
      revenue: 156000
    },
    {
      id: 5,
      name: 'Chantier Temporaire',
      type: 'chantier',
      client: 'Marie Martin',
      address: '12 Rue des Lilas',
      city: 'Nice',
      postalCode: '06000',
      country: 'France',
      coordinates: { lat: 43.7102, lng: 7.2620 },
      zone: 'Zone E - Temporaire',
      priority: 'basse',
      status: 'temporaire',
      deliveryTime: '10:00 - 16:00',
      accessCode: null,
      contact: 'Mme Martin',
      phone: '+33 6 98 76 54 32',
      email: 'marie.martin@email.com',
      lastVisit: '2024-02-10',
      visitFrequency: 'ponctuelle',
      avgDeliveryTime: 40,
      deliverySuccess: 85,
      notes: 'Accès difficile, prévoir matériel',
      services: ['Installation'],
      distance: 35.2,
      accessibility: 'difficile',
      parkingAvailable: false,
      restrictions: ['Accès piéton uniquement'],
      interventions: 3,
      revenue: 2300
    }
  ];

  // KPIs globaux
  const kpis = {
    totalAddresses: addresses.length,
    activeAddresses: addresses.filter(a => a.status === 'actif' || a.status === 'vip').length,
    avgDeliveryTime: Math.round(addresses.reduce((sum, a) => sum + a.avgDeliveryTime, 0) / addresses.length),
    successRate: Math.round(addresses.reduce((sum, a) => sum + a.deliverySuccess, 0) / addresses.length),
    totalDistance: addresses.reduce((sum, a) => sum + a.distance, 0).toFixed(1),
    criticalZones: addresses.filter(a => a.priority === 'critique' || a.priority === 'haute').length
  };

  const handleOptimizeRoute = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#F59E0B']
    });
    // Route optimized
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'siege': return BuildingOfficeIcon;
      case 'residence': return HomeIcon;
      case 'entrepot': return TruckIcon;
      case 'bureau': return BuildingOfficeIcon;
      case 'chantier': return FlagIcon;
      default: return MapPinIcon;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'siege': return 'from-blue-500 to-indigo-600';
      case 'residence': return 'from-green-500 to-emerald-600';
      case 'entrepot': return 'from-orange-500 to-red-600';
      case 'bureau': return 'from-purple-500 to-pink-600';
      case 'chantier': return 'from-yellow-500 to-amber-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critique': return 'from-red-600 to-pink-600';
      case 'haute': return 'from-orange-500 to-amber-600';
      case 'normale': return 'from-blue-500 to-indigo-600';
      case 'basse': return 'from-gray-500 to-slate-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredAddresses = addresses.filter(address => {
    const matchesSearch = address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          address.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || address.type === filterType;
    return matchesSearch && matchesType;
  });

  // Configuration des graphiques
  const zoneDistributionData = {
    labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'],
    datasets: [{
      data: [1, 1, 1, 1, 1],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(147, 51, 234, 1)',
        'rgba(107, 114, 128, 1)'
      ],
      borderWidth: 2
    }]
  };

  const deliveryPerformanceData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    datasets: [{
      label: 'Temps moyen (min)',
      data: [35, 42, 38, 45, 40, 50],
      backgroundColor: theme === 'neon' ? 'rgba(0, 255, 255, 0.6)' : 'rgba(59, 130, 246, 0.6)',
      borderColor: theme === 'neon' ? 'rgba(0, 255, 255, 1)' : 'rgba(59, 130, 246, 1)',
      borderWidth: 2
    }]
  };

  const accessibilityData = {
    labels: ['Excellent', 'Bon', 'Moyen', 'Difficile'],
    datasets: [{
      label: 'Accessibilité',
      data: [2, 1, 1, 1],
      backgroundColor: theme === 'neon' ? 'rgba(255, 0, 255, 0.6)' : 'rgba(147, 51, 234, 0.6)',
      borderColor: theme === 'neon' ? 'rgba(255, 0, 255, 1)' : 'rgba(147, 51, 234, 1)',
      borderWidth: 2,
      pointBackgroundColor: theme === 'neon' ? 'rgba(255, 0, 255, 1)' : 'rgba(147, 51, 234, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: theme === 'neon' ? 'rgba(255, 0, 255, 1)' : 'rgba(147, 51, 234, 1)'
    }]
  };

  const AddressCard = React.forwardRef(({ address, delay }, ref) => {
    const TypeIcon = getTypeIcon(address.type);
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: delay * 0.1 }}
        onClick={() => setSelectedAddress(address)}
        className="relative cursor-pointer"
      >
        
        <div className={`relative overflow-hidden rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border shadow-xl`}>
          {/* Badge de priorité */}
          {(address.priority === 'critique' || address.priority === 'haute') && (
            <div className="absolute -top-2 -right-2 z-10">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
                className="relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${getPriorityColor(address.priority)} rounded-full blur-xl animate-pulse`} />
                <div className={`relative bg-gradient-to-br ${getPriorityColor(address.priority)} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                  {address.priority === 'critique' ? <FireIcon className="w-3 h-3" /> : <BoltIcon className="w-3 h-3" />}
                  {address.priority.toUpperCase()}
                </div>
              </motion.div>
            </div>
          )}

          {/* Header avec type et zone */}
          <div className={`p-6 bg-gradient-to-br ${getTypeColor(address.type)} bg-opacity-10`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${getTypeColor(address.type)} flex items-center justify-center text-white shadow-lg`}
                >
                  <TypeIcon className="w-7 h-7" />
                </motion.div>
                <div>
                  <h3 className={`text-lg font-bold ${themeColors.textPrimary}`}>{address.name}</h3>
                  <p className={`text-sm ${themeColors.textSecondary}`}>{address.client}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapIcon className="w-3 h-3" />
                    <span className={`text-xs ${themeColors.textSecondary}`}>{address.zone}</span>
                  </div>
                </div>
              </div>
              
              {/* Distance et temps */}
              <div className="text-right">
                <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                  {address.distance}
                  <span className="text-sm">km</span>
                </div>
                <div className={`text-xs ${themeColors.textSecondary}`}>
                  ~{Math.round(address.distance * 3)}min
                </div>
              </div>
            </div>

            {/* Adresse complète */}
            <div className={`p-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border mb-3`}>
              <div className="flex items-start gap-2">
                <MapPinIcon className={`w-4 h-4 ${themeColors.textSecondary} mt-0.5`} />
                <div className="flex-1">
                  <p className={`text-sm ${themeColors.textPrimary}`}>{address.address}</p>
                  <p className={`text-xs ${themeColors.textSecondary}`}>
                    {address.postalCode} {address.city}, {address.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className={`text-center p-2 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
                <ClockIcon className={`w-4 h-4 mx-auto mb-1 ${themeColors.textSecondary}`} />
                <div className={`text-sm font-bold ${themeColors.textPrimary}`}>
                  {address.avgDeliveryTime}min
                </div>
                <div className={`text-xs ${themeColors.textSecondary}`}>Moy.</div>
              </div>
              <div className={`text-center p-2 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
                <CheckCircleIcon className={`w-4 h-4 mx-auto mb-1 ${themeColors.textSecondary}`} />
                <div className={`text-sm font-bold ${themeColors.textPrimary}`}>
                  {address.deliverySuccess}%
                </div>
                <div className={`text-xs ${themeColors.textSecondary}`}>Succès</div>
              </div>
              <div className={`text-center p-2 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
                <CalendarIcon className={`w-4 h-4 mx-auto mb-1 ${themeColors.textSecondary}`} />
                <div className={`text-sm font-bold ${themeColors.textPrimary}`}>
                  {address.interventions}
                </div>
                <div className={`text-xs ${themeColors.textSecondary}`}>Visites</div>
              </div>
            </div>

            {/* Informations de livraison */}
            <div className={`p-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border mb-3`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${themeColors.textSecondary}`}>Horaires</span>
                <span className={`text-xs font-bold ${themeColors.textPrimary}`}>{address.deliveryTime}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${themeColors.textSecondary}`}>Fréquence</span>
                <span className={`text-xs font-bold ${themeColors.textPrimary}`}>{address.visitFrequency}</span>
              </div>
              {address.accessCode && (
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${themeColors.textSecondary}`}>Code d'accès</span>
                  <span className={`text-xs font-mono font-bold ${themeColors.textPrimary} bg-black/20 px-2 py-1 rounded`}>
                    {address.accessCode}
                  </span>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="flex flex-wrap gap-2 mb-3">
              {address.services.map((service, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className={`px-2 py-1 text-xs rounded-full ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textSecondary}`}
                >
                  {service}
                </motion.span>
              ))}
            </div>

            {/* Accessibilité */}
            <div className={`p-2 rounded-lg ${themeColors.glassBg} ${themeColors.border} border mb-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SignalIcon className={`w-4 h-4 ${
                    address.accessibility === 'excellent' ? 'text-green-400' :
                    address.accessibility === 'bon' ? 'text-blue-400' :
                    address.accessibility === 'moyen' ? 'text-yellow-400' : 'text-red-400'
                  }`} />
                  <span className={`text-xs ${themeColors.textSecondary}`}>Accessibilité: </span>
                  <span className={`text-xs font-bold ${themeColors.textPrimary}`}>{address.accessibility}</span>
                </div>
                {address.parkingAvailable && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    P
                  </span>
                )}
              </div>
            </div>

            {/* Contact rapide */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${address.phone}`;
                }}
                className={`flex-1 py-2 rounded-lg ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary} flex items-center justify-center gap-2 hover:bg-white/10 transition-colors`}
              >
                <PhoneIcon className="w-4 h-4" />
                <span className="text-sm">Appeler</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://maps.google.com/?q=${address.coordinates.lat},${address.coordinates.lng}`, '_blank');
                }}
                className={`flex-1 py-2 rounded-lg bg-gradient-to-r ${themeColors.accent} text-white flex items-center justify-center gap-2`}
              >
                <MapIcon className="w-4 h-4" />
                <span className="text-sm">Itinéraire</span>
              </motion.button>
            </div>
          </div>

          {/* Effet spécial selon le thème */}
          {themeColors.special === 'neon-glow' && address.status === 'vip' && (
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl opacity-30 group-hover:opacity-50 blur-lg transition-opacity duration-300 animate-pulse" />
          )}
        </div>
      </motion.div>
    );
  });

  // Vue carte simulée
  const MapView = () => (
    <div className={`relative h-[600px] rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border overflow-hidden`}>
      {/* Fond de carte simulé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-green-900/20 to-purple-900/20">
        {/* Grille de carte */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${theme === 'dark' ? '#374151' : '#E5E7EB'}33 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? '#374151' : '#E5E7EB'}33 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Points sur la carte */}
        {filteredAddresses.map((address, idx) => (
          <motion.div
            key={address.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="absolute"
            style={{
              left: `${20 + (idx * 15)}%`,
              top: `${20 + (idx * 12)}%`
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
              className={`relative`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(address.type)} rounded-full blur-xl`} />
              <div 
                className={`relative w-12 h-12 bg-gradient-to-br ${getTypeColor(address.type)} rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                onClick={() => setSelectedAddress(address)}
              >
                <MapPinIcon className="w-6 h-6" />
              </div>
            </motion.div>
            <div className={`mt-2 text-xs ${themeColors.textPrimary} text-center whitespace-nowrap`}>
              {address.name.length > 15 ? address.name.substring(0, 15) + '...' : address.name}
            </div>
          </motion.div>
        ))}

        {/* Lignes de connexion */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {filteredAddresses.slice(0, -1).map((address, idx) => (
            <motion.line
              key={idx}
              x1={`${20 + (idx * 15)}%`}
              y1={`${20 + (idx * 12)}%`}
              x2={`${20 + ((idx + 1) * 15)}%`}
              y2={`${20 + ((idx + 1) * 12)}%`}
              stroke={theme === 'neon' ? '#00FFFF' : '#3B82F6'}
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: idx * 0.2 }}
            />
          ))}
        </svg>
      </div>

      {/* Légende */}
      <div className={`absolute bottom-4 left-4 p-3 rounded-lg ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}>
        <h4 className={`text-sm font-bold ${themeColors.textPrimary} mb-2`}>Légende</h4>
        <div className="space-y-1">
          {['siege', 'residence', 'entrepot', 'bureau', 'chantier'].map(type => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getTypeColor(type)}`} />
              <span className={`text-xs ${themeColors.textSecondary} capitalize`}>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton optimisation */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOptimizeRoute}
        className={`absolute top-4 right-4 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium flex items-center gap-2 shadow-lg`}
      >
        <ArrowPathIcon className="w-5 h-5" />
        Optimiser le trajet
      </motion.button>
    </div>
  );

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
              Gestion des Adresses
            </h1>
            <p className={themeColors.textSecondary}>
              Optimisez vos trajets avec cartographie intelligente et zones de livraison
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-6 py-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary} font-medium flex items-center gap-2`}
            >
              <GlobeAltIcon className="w-5 h-5" />
              Heatmap
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Nouvelle Adresse
            </motion.button>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total Adresses', value: kpis.totalAddresses, icon: MapPinIcon, color: 'from-blue-500 to-indigo-600', trend: '+2' },
            { label: 'Adresses Actives', value: kpis.activeAddresses, icon: CheckCircleIcon, color: 'from-green-500 to-emerald-600', trend: '+1' },
            { label: 'Temps Moyen', value: `${kpis.avgDeliveryTime}min`, icon: ClockIcon, color: 'from-yellow-500 to-amber-600', trend: '-5min' },
            { label: 'Taux Succès', value: `${kpis.successRate}%`, icon: ChartBarIcon, color: 'from-purple-500 to-pink-600', trend: '+3%' },
            { label: 'Distance Totale', value: `${kpis.totalDistance}km`, icon: TruckIcon, color: 'from-orange-500 to-red-600', trend: '+12km' },
            { label: 'Zones Critiques', value: kpis.criticalZones, icon: ExclamationTriangleIcon, color: 'from-red-500 to-pink-600', trend: '0' }
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
                  <span className={`text-xs ${kpi.trend.startsWith('+') ? 'text-green-400' : kpi.trend.startsWith('-') ? 'text-blue-400' : 'text-gray-400'} font-medium`}>
                    {kpi.trend}
                  </span>
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
              placeholder="Rechercher une adresse, client ou ville..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary} placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'siege', 'residence', 'entrepot', 'bureau', 'chantier'].map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterType(type)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  filterType === type
                    ? `bg-gradient-to-r ${themeColors.accent} text-white`
                    : `${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary}`
                }`}
              >
                {type === 'all' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1)}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === 'map' ? 'grid' : 'map')}
              className={`px-4 py-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary}`}
            >
              {viewMode === 'map' ? 'Grille' : 'Carte'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Graphiques d'analyse */}
      <AnimatePresence>
        {showHeatmap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-3 gap-6">
              {/* Distribution par zones */}
              <div className={`p-6 rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}>
                <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Distribution par Zones</h3>
                <div className="h-64">
                  <Doughnut data={zoneDistributionData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: theme === 'dark' ? '#9CA3AF' : '#E5E7EB' }
                      }
                    }
                  }} />
                </div>
              </div>

              {/* Performance de livraison */}
              <div className={`p-6 rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}>
                <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Performance Hebdomadaire</h3>
                <div className="h-64">
                  <Bar data={deliveryPerformanceData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
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

              {/* Accessibilité */}
              <div className={`p-6 rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}>
                <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Niveau d'Accessibilité</h3>
                <div className="h-64">
                  <Radar data={accessibilityData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        grid: { color: theme === 'dark' ? '#374151' : '#E5E7EB' },
                        angleLines: { color: theme === 'dark' ? '#374151' : '#E5E7EB' },
                        ticks: { 
                          color: theme === 'dark' ? '#9CA3AF' : '#E5E7EB',
                          backdropColor: 'transparent'
                        }
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

      {/* Vue principale */}
      <AnimatePresence mode="wait">
        {viewMode === 'map' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MapView />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-6"
          >
            {filteredAddresses.map((address, idx) => (
              <AddressCard key={address.id} address={address} delay={idx} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal détails adresse */}
      <AnimatePresence>
        {selectedAddress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedAddress(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-4xl rounded-2xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border p-8 max-h-[90vh] overflow-y-auto`}
            >
              <h2 className={`text-2xl font-bold ${themeColors.textPrimary} mb-6`}>
                {selectedAddress.name}
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Informations */}
                <div className={`p-4 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
                  <h3 className={`font-semibold ${themeColors.textPrimary} mb-3`}>Informations</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={themeColors.textSecondary}>Client:</span>
                      <span className={themeColors.textPrimary}>{selectedAddress.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeColors.textSecondary}>Contact:</span>
                      <span className={themeColors.textPrimary}>{selectedAddress.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeColors.textSecondary}>Téléphone:</span>
                      <span className={themeColors.textPrimary}>{selectedAddress.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeColors.textSecondary}>Email:</span>
                      <span className={themeColors.textPrimary}>{selectedAddress.email}</span>
                    </div>
                  </div>
                </div>

                {/* Notes et restrictions */}
                <div className={`p-4 rounded-lg ${themeColors.glassBg} ${themeColors.border} border`}>
                  <h3 className={`font-semibold ${themeColors.textPrimary} mb-3`}>Notes</h3>
                  <p className={`text-sm ${themeColors.textSecondary} mb-3`}>{selectedAddress.notes}</p>
                  {selectedAddress.restrictions.length > 0 && (
                    <>
                      <h4 className={`font-semibold ${themeColors.textPrimary} mb-2`}>Restrictions</h4>
                      <ul className="list-disc list-inside">
                        {selectedAddress.restrictions.map((restriction, idx) => (
                          <li key={idx} className={`text-sm ${themeColors.textSecondary}`}>{restriction}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg ${themeColors.glassBg} ${themeColors.border} border ${themeColors.textPrimary} font-medium`}
                  onClick={() => setSelectedAddress(null)}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdressesPremium;