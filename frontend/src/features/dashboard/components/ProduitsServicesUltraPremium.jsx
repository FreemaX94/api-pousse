import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CubeIcon,
  TagIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  StarIcon,
  ShoppingBagIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  PhotoIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  FireIcon,
  TruckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProduitsServicesUltraPremium = () => {
  const { theme, getClasses, currentTheme } = useThemeUltraPremium();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Données simulées des produits et services
  const products = [
    {
      id: 1,
      name: 'Palmier Phoenix Canariensis',
      type: 'product',
      category: 'Plantes',
      subcategory: 'Palmiers',
      price: 450,
      cost: 280,
      stock: 25,
      minStock: 10,
      maxStock: 50,
      status: 'available',
      popularity: 95,
      rating: 4.8,
      reviews: 156,
      supplier: 'Nieuwkoop Plants',
      description: 'Magnifique palmier des Canaries, idéal pour créer une ambiance tropicale.',
      image: '🌴',
      dimensions: { height: '300cm', width: '200cm', weight: '150kg' },
      care: { water: 'Modéré', light: 'Plein soleil', temp: '15-25°C' },
      tags: ['Extérieur', 'Résistant', 'Décoratif', 'Tropical'],
      lastOrder: '2024-03-20',
      orderHistory: [15, 8, 12, 22, 18, 25],
      profit: 170,
      margin: 37.8,
      trends: 'up',
      seasonal: true,
      featured: true
    },
    {
      id: 2,
      name: 'Service Aménagement Complet',
      type: 'service',
      category: 'Services',
      subcategory: 'Aménagement',
      price: 2500,
      cost: 1800,
      stock: null,
      minStock: null,
      maxStock: null,
      status: 'available',
      popularity: 88,
      rating: 4.9,
      reviews: 89,
      supplier: 'Équipe interne',
      description: 'Service complet d\'aménagement paysager incluant conception, plantation et suivi.',
      image: '🏗️',
      dimensions: null,
      care: null,
      tags: ['Premium', 'Conception', 'Plantation', 'Suivi'],
      lastOrder: '2024-03-18',
      orderHistory: [3, 5, 4, 7, 6, 8],
      profit: 700,
      margin: 28,
      trends: 'up',
      seasonal: false,
      featured: true,
      duration: '2-4 semaines',
      warranty: '1 an'
    },
    {
      id: 3,
      name: 'Olivier Centenaire',
      type: 'product',
      category: 'Plantes',
      subcategory: 'Arbres',
      price: 1200,
      cost: 750,
      stock: 5,
      minStock: 3,
      maxStock: 15,
      status: 'low_stock',
      popularity: 92,
      rating: 4.7,
      reviews: 78,
      supplier: 'Provence Oliviers',
      description: 'Olivier centenaire authentique, pièce unique pour jardin prestigieux.',
      image: '🫒',
      dimensions: { height: '400cm', width: '300cm', weight: '800kg' },
      care: { water: 'Faible', light: 'Plein soleil', temp: '5-30°C' },
      tags: ['Prestige', 'Authentique', 'Résistant', 'Méditerranéen'],
      lastOrder: '2024-03-15',
      orderHistory: [2, 1, 3, 4, 2, 5],
      profit: 450,
      margin: 37.5,
      trends: 'stable',
      seasonal: false,
      featured: true
    },
    {
      id: 4,
      name: 'Terreau Premium Bio',
      type: 'product',
      category: 'Substrats',
      subcategory: 'Terreaux',
      price: 15.50,
      cost: 8.20,
      stock: 150,
      minStock: 50,
      maxStock: 200,
      status: 'available',
      popularity: 75,
      rating: 4.5,
      reviews: 234,
      supplier: 'Bio Substrats France',
      description: 'Terreau biologique enrichi, idéal pour toutes plantations.',
      image: '🪨',
      dimensions: { volume: '40L', weight: '25kg' },
      care: null,
      tags: ['Bio', 'Enrichi', 'Universel', 'Qualité'],
      lastOrder: '2024-03-22',
      orderHistory: [45, 38, 52, 48, 41, 55],
      profit: 7.30,
      margin: 47.1,
      trends: 'up',
      seasonal: true,
      featured: false
    },
    {
      id: 5,
      name: 'Maintenance Mensuelle',
      type: 'service',
      category: 'Services',
      subcategory: 'Maintenance',
      price: 180,
      cost: 120,
      stock: null,
      minStock: null,
      maxStock: null,
      status: 'available',
      popularity: 85,
      rating: 4.6,
      reviews: 145,
      supplier: 'Équipe maintenance',
      description: 'Service de maintenance mensuelle pour espaces verts.',
      image: '🔧',
      dimensions: null,
      care: null,
      tags: ['Récurrent', 'Entretien', 'Professionnel', 'Flexible'],
      lastOrder: '2024-03-21',
      orderHistory: [25, 28, 22, 30, 27, 32],
      profit: 60,
      margin: 33.3,
      trends: 'up',
      seasonal: false,
      featured: false,
      duration: '4h/mois',
      warranty: 'Garantie travaux'
    },
    {
      id: 6,
      name: 'Rosier Grimpant Pierre de Ronsard',
      type: 'product',
      category: 'Plantes',
      subcategory: 'Rosiers',
      price: 35,
      cost: 18,
      stock: 0,
      minStock: 20,
      maxStock: 80,
      status: 'out_of_stock',
      popularity: 90,
      rating: 4.9,
      reviews: 312,
      supplier: 'Meilland Richardier',
      description: 'Rosier grimpant aux fleurs romantiques blanc rosé.',
      image: '🌹',
      dimensions: { height: '300cm', width: '150cm' },
      care: { water: 'Modéré', light: 'Mi-ombre', temp: '-15-30°C' },
      tags: ['Parfumé', 'Grimpant', 'Romantique', 'Résistant'],
      lastOrder: '2024-03-10',
      orderHistory: [35, 42, 38, 45, 40, 0],
      profit: 17,
      margin: 48.6,
      trends: 'down',
      seasonal: true,
      featured: true
    },
    {
      id: 7,
      name: 'Système d\'Arrosage Automatique',
      type: 'product',
      category: 'Équipements',
      subcategory: 'Arrosage',
      price: 850,
      cost: 520,
      stock: 12,
      minStock: 5,
      maxStock: 20,
      status: 'available',
      popularity: 78,
      rating: 4.4,
      reviews: 67,
      supplier: 'Irritec Solutions',
      description: 'Système d\'arrosage automatique intelligent avec programmation.',
      image: '💧',
      dimensions: { coverage: '100m²' },
      care: null,
      tags: ['Intelligent', 'Économique', 'Programmable', 'Efficace'],
      lastOrder: '2024-03-19',
      orderHistory: [4, 6, 5, 8, 7, 9],
      profit: 330,
      margin: 38.8,
      trends: 'up',
      seasonal: true,
      featured: false
    },
    {
      id: 8,
      name: 'Consultation Paysagiste',
      type: 'service',
      category: 'Services',
      subcategory: 'Conseil',
      price: 120,
      cost: 40,
      stock: null,
      minStock: null,
      maxStock: null,
      status: 'available',
      popularity: 82,
      rating: 4.8,
      reviews: 198,
      supplier: 'Expert paysagiste',
      description: 'Consultation personnalisée avec expert paysagiste.',
      image: '👨‍🎓',
      dimensions: null,
      care: null,
      tags: ['Expertise', 'Personnalisé', 'Conseil', 'Projet'],
      lastOrder: '2024-03-21',
      orderHistory: [12, 15, 18, 14, 16, 20],
      profit: 80,
      margin: 66.7,
      trends: 'up',
      seasonal: false,
      featured: false,
      duration: '2h',
      warranty: 'Suivi gratuit 1 mois'
    }
  ];

  // KPIs globaux
  const kpis = {
    totalProducts: products.length,
    available: products.filter(p => p.status === 'available').length,
    lowStock: products.filter(p => p.status === 'low_stock').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
    totalValue: products.filter(p => p.type === 'product').reduce((sum, p) => sum + (p.price * p.stock), 0),
    avgMargin: Math.round(products.reduce((sum, p) => sum + p.margin, 0) / products.length),
    avgRating: (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1),
    featured: products.filter(p => p.featured).length
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'available': return <CheckBadgeIcon className="w-5 h-5 text-green-400" />;
      case 'low_stock': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'out_of_stock': return <ArchiveBoxIcon className="w-5 h-5 text-red-400" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusGradient = (status) => {
    switch(status) {
      case 'available': return 'from-green-500 to-emerald-600';
      case 'low_stock': return 'from-yellow-500 to-orange-600';
      case 'out_of_stock': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Plantes': return '🌱';
      case 'Services': return '🛠️';
      case 'Substrats': return '🪨';
      case 'Équipements': return '⚙️';
      default: return '📦';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Configuration des graphiques
  const chartColors = {
    primary: currentTheme === 'neon' ? 'rgba(0, 255, 255, 1)' : 
            currentTheme === 'galaxy' ? 'rgba(147, 51, 234, 1)' :
            currentTheme === 'ocean' ? 'rgba(6, 182, 212, 1)' :
            'rgba(59, 130, 246, 1)',
    secondary: currentTheme === 'neon' ? 'rgba(255, 0, 255, 1)' :
              currentTheme === 'galaxy' ? 'rgba(168, 85, 247, 1)' :
              currentTheme === 'ocean' ? 'rgba(34, 211, 238, 1)' :
              'rgba(99, 102, 241, 1)'
  };

  const categoryDistributionData = {
    labels: ['Plantes', 'Services', 'Substrats', 'Équipements'],
    datasets: [{
      data: [
        products.filter(p => p.category === 'Plantes').length,
        products.filter(p => p.category === 'Services').length,
        products.filter(p => p.category === 'Substrats').length,
        products.filter(p => p.category === 'Équipements').length
      ],
      backgroundColor: [
        'rgba(52, 211, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(147, 51, 234, 0.8)'
      ],
      borderColor: [
        'rgba(52, 211, 153, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(147, 51, 234, 1)'
      ],
      borderWidth: 2
    }]
  };

  const popularityData = {
    labels: products.map(p => p.name.substring(0, 15) + '...'),
    datasets: [{
      label: 'Popularité',
      data: products.map(p => p.popularity),
      borderColor: chartColors.primary,
      backgroundColor: chartColors.primary.replace('1)', '0.1)'),
      tension: 0.4,
      fill: true
    }]
  };

  const ProductCard = ({ product }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedProduct(product)}
      className={getClasses('card', 'cursor-pointer relative overflow-hidden')}
    >
      {/* Badge featured */}
      {product.featured && (
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <StarIcon className={`w-6 h-6 text-yellow-400 fill-yellow-400`} />
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getStatusGradient(product.status)} flex items-center justify-center text-white shadow-lg text-2xl`}>
            {product.image}
          </div>
          <div>
            <h3 className={`text-lg font-bold ${theme.text}`}>{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm ${theme.textSecondary}`}>
                {getCategoryIcon(product.category)} {product.category}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${getStatusGradient(product.status)} text-white`}>
                {product.type === 'product' ? 'Produit' : 'Service'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prix et marge */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={getClasses('glass', 'text-center p-3 rounded-lg')}>
          <CurrencyEuroIcon className={`w-5 h-5 mx-auto mb-1 ${theme.accent}`} />
          <div className={`text-lg font-bold ${theme.text}`}>
            {product.price}€
          </div>
          <div className={`text-xs ${theme.textSecondary}`}>Prix</div>
          <div className={`text-xs ${product.margin > 40 ? 'text-green-400' : product.margin > 25 ? 'text-yellow-400' : 'text-red-400'}`}>
            Marge: {product.margin.toFixed(1)}%
          </div>
        </div>
        
        {product.type === 'product' ? (
          <div className={getClasses('glass', 'text-center p-3 rounded-lg')}>
            <ArchiveBoxIcon className={`w-5 h-5 mx-auto mb-1 ${theme.accent}`} />
            <div className={`text-lg font-bold ${theme.text}`}>
              {product.stock}
            </div>
            <div className={`text-xs ${theme.textSecondary}`}>Stock</div>
            <div className={`text-xs ${
              product.stock <= product.minStock ? 'text-red-400' :
              product.stock <= product.minStock * 2 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              Min: {product.minStock}
            </div>
          </div>
        ) : (
          <div className={getClasses('glass', 'text-center p-3 rounded-lg')}>
            <ClockIcon className={`w-5 h-5 mx-auto mb-1 ${theme.accent}`} />
            <div className={`text-sm font-bold ${theme.text}`}>
              {product.duration || 'Variable'}
            </div>
            <div className={`text-xs ${theme.textSecondary}`}>Durée</div>
            <div className={`text-xs ${theme.accent}`}>
              {product.warranty || 'Standard'}
            </div>
          </div>
        )}
      </div>

      {/* Popularité et note */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FireIcon className={`w-4 h-4 ${product.popularity > 85 ? 'text-red-400' : 'text-yellow-400'}`} />
          <span className={`text-sm ${theme.textSecondary}`}>
            {product.popularity}% populaire
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : theme.textSecondary}`}
              />
            ))}
          </div>
          <span className={`text-sm ${theme.textSecondary}`}>
            ({product.reviews})
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.tags.slice(0, 3).map((tag, idx) => (
          <span key={idx} className={getClasses('badge', 'text-xs')}>
            {tag}
          </span>
        ))}
        {product.tags.length > 3 && (
          <span className={getClasses('badge', 'text-xs')}>
            +{product.tags.length - 3}
          </span>
        )}
      </div>

      {/* Tendance et dernière commande */}
      <div className={getClasses('glass', 'p-3 rounded-lg mb-4')}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTrendIcon(product.trends)}</span>
            <span className={`text-sm ${theme.textSecondary}`}>Tendance</span>
          </div>
          <span className={`text-xs ${theme.textSecondary}`}>
            Dernière commande: {new Date(product.lastOrder).toLocaleDateString()}
          </span>
        </div>
        <div className="h-8">
          <Line 
            data={{
              labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
              datasets: [{
                data: product.orderHistory,
                borderColor: product.trends === 'up' ? 'rgba(52, 211, 153, 1)' : 
                           product.trends === 'down' ? 'rgba(239, 68, 68, 1)' : 'rgba(156, 163, 175, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { display: false },
                y: { display: false }
              }
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getClasses('button', 'flex-1 py-2 text-sm')}
        >
          Voir détails
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getClasses('glass', 'px-3 py-2 rounded-xl')}
        >
          <PencilSquareIcon className={`w-4 h-4 ${theme.accent}`} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getClasses('glass', 'px-3 py-2 rounded-xl')}
        >
          <ShoppingBagIcon className={`w-4 h-4 ${theme.accent}`} />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <UltraPremiumContainer
      title="Catalogue Produits & Services Ultra Premium"
      icon={CubeIcon}
    >
      {/* KPIs */}
      <div className="grid grid-cols-8 gap-4 mb-6">
        {[
          { label: 'Total items', value: kpis.totalProducts, icon: CubeIcon, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Disponibles', value: kpis.available, icon: CheckBadgeIcon, gradient: 'from-green-500 to-emerald-600' },
          { label: 'Stock bas', value: kpis.lowStock, icon: ExclamationTriangleIcon, gradient: 'from-yellow-500 to-orange-600' },
          { label: 'Rupture', value: kpis.outOfStock, icon: ArchiveBoxIcon, gradient: 'from-red-500 to-pink-600' },
          { label: 'Valeur stock', value: `${(kpis.totalValue / 1000).toFixed(0)}k€`, icon: CurrencyEuroIcon, gradient: 'from-purple-500 to-pink-600' },
          { label: 'Marge moy.', value: `${kpis.avgMargin}%`, icon: ChartBarIcon, gradient: 'from-cyan-500 to-blue-600' },
          { label: 'Note moy.', value: kpis.avgRating, icon: StarIcon, gradient: 'from-yellow-500 to-orange-600' },
          { label: 'Vedettes', value: kpis.featured, icon: FireIcon, gradient: 'from-orange-500 to-red-600' }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className={getClasses('card', 'relative overflow-hidden')}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-10`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-6 h-6 ${theme.accent}`} />
              </div>
              <div className={`text-2xl font-bold ${theme.text}`}>{kpi.value}</div>
              <div className={`text-xs ${theme.textSecondary} mt-1`}>{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textSecondary}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un produit ou service..."
            className={getClasses('input', 'pl-10')}
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'Plantes', 'Services', 'Substrats', 'Équipements'].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCategory(category)}
              className={filterCategory === category ? 
                getClasses('button', 'px-4 py-3') : 
                getClasses('glass', 'px-4 py-3 rounded-xl font-medium')}
            >
              {category === 'all' ? 'Tous' : category}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-2">
          {['all', 'available', 'low_stock', 'out_of_stock'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 
                getClasses('button', 'px-4 py-3') : 
                getClasses('glass', 'px-4 py-3 rounded-xl font-medium')}
            >
              {status === 'all' ? 'Tous' : 
               status === 'available' ? 'Disponible' :
               status === 'low_stock' ? 'Stock bas' : 'Rupture'}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getClasses('button', 'px-4 py-3 flex items-center gap-2')}
        >
          <PlusIcon className="w-5 h-5" />
          Ajouter
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={getClasses('button', 'px-4 py-3 flex items-center gap-2')}
        >
          <ChartBarIcon className="w-5 h-5" />
          Analytics
        </motion.button>
      </div>

      {/* Section Analytics */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-6 mb-8"
          >
            <div className={getClasses('card')}>
              <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Répartition par catégorie</h3>
              <div className="h-64">
                <Doughnut data={categoryDistributionData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: theme.text }
                    }
                  }
                }} />
              </div>
            </div>

            <div className={getClasses('card')}>
              <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Popularité des produits</h3>
              <div className="h-64">
                <Line data={popularityData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { 
                      grid: { display: false },
                      ticks: { color: theme.textSecondary, maxRotation: 45 }
                    },
                    y: { 
                      grid: { color: theme.border },
                      ticks: { color: theme.textSecondary }
                    }
                  }
                }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grille des produits */}
      <div className="grid grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Modal détails produit */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'w-full max-w-6xl max-h-[90vh] overflow-y-auto')}
            >
              <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>
                {selectedProduct.name}
              </h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div className={getClasses('glass', 'p-4 rounded-xl')}>
                  <h3 className={`font-semibold ${theme.text} mb-3`}>Informations produit</h3>
                  <div className="space-y-3">
                    <div>
                      <span className={`font-medium ${theme.text}`}>Prix: </span>
                      <span className={theme.textSecondary}>{selectedProduct.price}€</span>
                    </div>
                    <div>
                      <span className={`font-medium ${theme.text}`}>Coût: </span>
                      <span className={theme.textSecondary}>{selectedProduct.cost}€</span>
                    </div>
                    <div>
                      <span className={`font-medium ${theme.text}`}>Marge: </span>
                      <span className={`${selectedProduct.margin > 40 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {selectedProduct.margin.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className={`font-medium ${theme.text}`}>Fournisseur: </span>
                      <span className={theme.textSecondary}>{selectedProduct.supplier}</span>
                    </div>
                  </div>
                </div>
                
                <div className={getClasses('glass', 'p-4 rounded-xl')}>
                  <h3 className={`font-semibold ${theme.text} mb-3`}>Performance</h3>
                  <div className="space-y-3">
                    <div>
                      <span className={`font-medium ${theme.text}`}>Note: </span>
                      <span className={theme.textSecondary}>{selectedProduct.rating}/5</span>
                    </div>
                    <div>
                      <span className={`font-medium ${theme.text}`}>Avis: </span>
                      <span className={theme.textSecondary}>{selectedProduct.reviews}</span>
                    </div>
                    <div>
                      <span className={`font-medium ${theme.text}`}>Popularité: </span>
                      <span className={theme.textSecondary}>{selectedProduct.popularity}%</span>
                    </div>
                    <div>
                      <span className={`font-medium ${theme.text}`}>Tendance: </span>
                      <span className={theme.textSecondary}>{getTrendIcon(selectedProduct.trends)} {selectedProduct.trends}</span>
                    </div>
                  </div>
                </div>

                <div className={getClasses('glass', 'p-4 rounded-xl')}>
                  <h3 className={`font-semibold ${theme.text} mb-3`}>
                    {selectedProduct.type === 'product' ? 'Stock' : 'Service'}
                  </h3>
                  {selectedProduct.type === 'product' ? (
                    <div className="space-y-3">
                      <div>
                        <span className={`font-medium ${theme.text}`}>Actuel: </span>
                        <span className={theme.textSecondary}>{selectedProduct.stock}</span>
                      </div>
                      <div>
                        <span className={`font-medium ${theme.text}`}>Min: </span>
                        <span className={theme.textSecondary}>{selectedProduct.minStock}</span>
                      </div>
                      <div>
                        <span className={`font-medium ${theme.text}`}>Max: </span>
                        <span className={theme.textSecondary}>{selectedProduct.maxStock}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <span className={`font-medium ${theme.text}`}>Durée: </span>
                        <span className={theme.textSecondary}>{selectedProduct.duration || 'Variable'}</span>
                      </div>
                      <div>
                        <span className={`font-medium ${theme.text}`}>Garantie: </span>
                        <span className={theme.textSecondary}>{selectedProduct.warranty || 'Standard'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className={`font-semibold ${theme.text} mb-3`}>Description</h3>
                <p className={theme.textSecondary}>{selectedProduct.description}</p>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={getClasses('glass', 'px-6 py-3 rounded-xl font-medium')}
                  onClick={() => setSelectedProduct(null)}
                >
                  Fermer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={getClasses('button', 'px-6 py-3')}
                >
                  Modifier
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={getClasses('button', 'px-6 py-3')}
                >
                  Commander
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default ProduitsServicesUltraPremium;