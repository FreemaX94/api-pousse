import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  CubeIcon,
  TagIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  SparklesIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PhotoIcon,
  StarIcon,
  CalendarDaysIcon,
  BoltIcon,
  FireIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PlusIcon,
  ArchiveBoxIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2';
import confetti from 'canvas-confetti';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Filler
);

const ProduitsServicesPremium = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Fonction pour obtenir les couleurs du thème
  const getThemeColors = () => {
    const themeSpecificColors = {
      light: {
        cardBg: 'from-white/95 to-green-50/90',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-600',
        accent: 'from-green-500 to-emerald-600',
        border: 'border-green-200/50',
        glassBg: 'bg-white/80',
        chartColors: {
          primary: ['rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(34, 197, 94, 0.7)',
          text: '#374151'
        }
      },
      dark: {
        cardBg: 'from-gray-900/95 to-emerald-900/20',
        textPrimary: 'text-gray-100',
        textSecondary: 'text-gray-400',
        accent: 'from-emerald-500 to-teal-600',
        border: 'border-emerald-500/30',
        glassBg: 'bg-gray-900/80',
        chartColors: {
          primary: ['rgba(16, 185, 129, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(16, 185, 129, 0.7)',
          text: '#ffffff'
        }
      },
      beige: {
        cardBg: 'from-amber-50/95 to-yellow-50/90',
        textPrimary: 'text-amber-900',
        textSecondary: 'text-yellow-700',
        accent: 'from-yellow-600 to-amber-600',
        border: 'border-yellow-300/50',
        glassBg: 'bg-amber-50/80',
        chartColors: {
          primary: ['rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(245, 158, 11, 0.7)',
          text: '#451a03'
        }
      },
      dawn: {
        cardBg: 'from-rose-50/95 to-pink-100/90',
        textPrimary: 'text-rose-900',
        textSecondary: 'text-pink-700',
        accent: 'from-rose-500 to-pink-600',
        border: 'border-rose-300/50',
        glassBg: 'bg-rose-50/80',
        chartColors: {
          primary: ['rgba(244, 63, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(244, 63, 94, 0.7)',
          text: '#881337'
        }
      },
      neon: {
        cardBg: 'from-black/95 to-green-900/40',
        textPrimary: 'text-green-100',
        textSecondary: 'text-lime-400',
        accent: 'from-lime-500 to-green-500',
        border: 'border-lime-500/50',
        glassBg: 'bg-black/80',
        special: 'neon-glow',
        chartColors: {
          primary: ['rgba(132, 204, 22, 0.9)', 'rgba(6, 182, 212, 0.9)', 'rgba(236, 72, 153, 0.9)', 'rgba(239, 68, 68, 0.9)'],
          secondary: 'rgba(132, 204, 22, 0.8)',
          text: '#00ff00'
        }
      },
      ocean: {
        cardBg: 'from-blue-900/95 to-teal-800/30',
        textPrimary: 'text-teal-100',
        textSecondary: 'text-blue-300',
        accent: 'from-teal-500 to-blue-400',
        border: 'border-teal-400/40',
        glassBg: 'bg-blue-900/80',
        chartColors: {
          primary: ['rgba(20, 184, 166, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(20, 184, 166, 0.7)',
          text: '#ecfeff'
        }
      },
      tropical: {
        cardBg: 'from-lime-900/95 to-green-800/30',
        textPrimary: 'text-lime-100',
        textSecondary: 'text-green-300',
        accent: 'from-lime-500 to-green-500',
        border: 'border-lime-400/40',
        glassBg: 'bg-lime-900/80',
        chartColors: {
          primary: ['rgba(132, 204, 22, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(20, 184, 166, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(132, 204, 22, 0.7)',
          text: '#f7fee7'
        }
      },
      lavender: {
        cardBg: 'from-violet-50/95 to-purple-100/90',
        textPrimary: 'text-violet-900',
        textSecondary: 'text-purple-700',
        accent: 'from-violet-500 to-purple-600',
        border: 'border-violet-300/50',
        glassBg: 'bg-violet-50/80',
        chartColors: {
          primary: ['rgba(139, 69, 19, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(139, 69, 19, 0.7)',
          text: '#581c87'
        }
      },
      galaxy: {
        cardBg: 'from-purple-900/95 to-indigo-900/50',
        textPrimary: 'text-purple-100',
        textSecondary: 'text-indigo-300',
        accent: 'from-purple-500 to-indigo-600',
        border: 'border-purple-400/40',
        glassBg: 'bg-purple-900/80',
        special: 'galaxy-stars',
        chartColors: {
          primary: ['rgba(147, 51, 234, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(147, 51, 234, 0.7)',
          text: '#ede9fe'
        }
      },
      autumn: {
        cardBg: 'from-red-100/95 to-orange-50/90',
        textPrimary: 'text-red-900',
        textSecondary: 'text-orange-700',
        accent: 'from-red-600 to-orange-600',
        border: 'border-red-300/50',
        glassBg: 'bg-red-50/80',
        chartColors: {
          primary: ['rgba(220, 38, 38, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(220, 38, 38, 0.7)',
          text: '#7f1d1d'
        }
      },
      glacier: {
        cardBg: 'from-cyan-50/95 to-sky-50/90',
        textPrimary: 'text-cyan-900',
        textSecondary: 'text-sky-700',
        accent: 'from-cyan-600 to-sky-600',
        border: 'border-cyan-300/50',
        glassBg: 'bg-cyan-50/80',
        chartColors: {
          primary: ['rgba(6, 182, 212, 0.8)', 'rgba(14, 165, 233, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(6, 182, 212, 0.7)',
          text: '#164e63'
        }
      },
      sakura: {
        cardBg: 'from-pink-50/95 to-rose-50/90',
        textPrimary: 'text-pink-900',
        textSecondary: 'text-rose-700',
        accent: 'from-pink-500 to-rose-500',
        border: 'border-pink-300/50',
        glassBg: 'bg-pink-50/80',
        chartColors: {
          primary: ['rgba(236, 72, 153, 0.8)', 'rgba(244, 63, 94, 0.8)', 'rgba(217, 70, 239, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(236, 72, 153, 0.7)',
          text: '#831843'
        }
      },
      midnight: {
        cardBg: 'from-gray-900/95 to-slate-900/50',
        textPrimary: 'text-gray-100',
        textSecondary: 'text-yellow-300',
        accent: 'from-gray-600 to-yellow-600',
        border: 'border-yellow-500/30',
        glassBg: 'bg-gray-900/80',
        chartColors: {
          primary: ['rgba(107, 114, 128, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(107, 114, 128, 0.7)',
          text: '#f9fafb'
        }
      },
      lava: {
        cardBg: 'from-orange-900/95 to-red-900/50',
        textPrimary: 'text-orange-100',
        textSecondary: 'text-red-300',
        accent: 'from-orange-600 to-red-600',
        border: 'border-orange-500/40',
        glassBg: 'bg-orange-900/80',
        special: 'lava-bubbles',
        chartColors: {
          primary: ['rgba(249, 115, 22, 0.8)', 'rgba(220, 38, 38, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(249, 115, 22, 0.7)',
          text: '#fed7aa'
        }
      }
    };

    return themeSpecificColors[theme] || themeSpecificColors.dark;
  };

  // Données mock des produits et services
  const [produitsServices] = useState([
    {
      id: 1,
      reference: 'PRD-001',
      nom: 'Taille de haie premium',
      type: 'service',
      categorie: 'Entretien',
      prix: 45,
      unite: 'heure',
      stock: null,
      disponibilite: 'disponible',
      description: 'Service de taille de haie professionnel avec finition soignée',
      dureeValidite: 30,
      ventesMois: 125,
      tendance: 'hausse',
      margeUnitaire: 28,
      evaluation: 4.8,
      nombreAvis: 45,
      tempsRealisation: '2-4h',
      garantie: '100% satisfaction',
      echeance: null,
      image: '🌳',
      popularite: 95
    },
    {
      id: 2,
      reference: 'PRD-002',
      nom: 'Engrais bio universel 25kg',
      type: 'produit',
      categorie: 'Fournitures',
      prix: 85,
      unite: 'sac',
      stock: 45,
      stockMin: 20,
      disponibilite: 'disponible',
      description: 'Engrais biologique certifié pour tous types de plantations',
      dureeValidite: 365,
      ventesMois: 68,
      tendance: 'stable',
      margeUnitaire: 35,
      evaluation: 4.5,
      nombreAvis: 23,
      tempsRealisation: null,
      garantie: 'Certifié bio',
      echeance: '2026-08-15',
      image: '🌱',
      popularite: 78
    },
    {
      id: 3,
      reference: 'SRV-003',
      nom: 'Installation système arrosage',
      type: 'service',
      categorie: 'Installation',
      prix: 1200,
      unite: 'forfait',
      stock: null,
      disponibilite: 'sur_devis',
      description: 'Installation complète système d\'arrosage automatique',
      dureeValidite: 90,
      ventesMois: 8,
      tendance: 'hausse',
      margeUnitaire: 42,
      evaluation: 4.9,
      nombreAvis: 15,
      tempsRealisation: '2-3 jours',
      garantie: '2 ans pièces et main d\'œuvre',
      echeance: null,
      image: '💧',
      popularite: 65
    },
    {
      id: 4,
      reference: 'PRD-004',
      nom: 'Terreau plantation 50L',
      type: 'produit',
      categorie: 'Fournitures',
      prix: 12.5,
      unite: 'sac',
      stock: 8,
      stockMin: 30,
      disponibilite: 'stock_faible',
      description: 'Terreau enrichi spécial plantation arbustes et vivaces',
      dureeValidite: 730,
      ventesMois: 156,
      tendance: 'hausse',
      margeUnitaire: 45,
      evaluation: 4.7,
      nombreAvis: 67,
      tempsRealisation: null,
      garantie: 'Qualité garantie',
      echeance: '2025-09-30',
      image: '🪴',
      popularite: 88
    },
    {
      id: 5,
      reference: 'SRV-005',
      nom: 'Élagage arbres dangereux',
      type: 'service',
      categorie: 'Sécurité',
      prix: 350,
      unite: 'arbre',
      stock: null,
      disponibilite: 'urgent',
      description: 'Intervention urgente élagage arbres présentant un danger',
      dureeValidite: 7,
      ventesMois: 22,
      tendance: 'stable',
      margeUnitaire: 38,
      evaluation: 5.0,
      nombreAvis: 18,
      tempsRealisation: '24-48h',
      garantie: 'Intervention garantie',
      echeance: '2025-08-10',
      image: '🌲',
      popularite: 72
    }
  ]);

  const themeColors = getThemeColors();

  // KPIs calculés
  const kpis = {
    totalProduits: produitsServices.filter(p => p.type === 'produit').length,
    totalServices: produitsServices.filter(p => p.type === 'service').length,
    ventesMensuelles: produitsServices.reduce((sum, p) => sum + p.ventesMois, 0),
    stockFaible: produitsServices.filter(p => p.disponibilite === 'stock_faible').length,
    margeMoyenne: Math.round(produitsServices.reduce((sum, p) => sum + p.margeUnitaire, 0) / produitsServices.length),
    satisfactionMoyenne: (produitsServices.reduce((sum, p) => sum + p.evaluation, 0) / produitsServices.length).toFixed(1)
  };

  // Graphique Doughnut - Répartition par catégorie
  const categoryChart = {
    labels: ['Entretien', 'Fournitures', 'Installation', 'Sécurité'],
    datasets: [{
      data: [125, 224, 8, 22],
      backgroundColor: themeColors.chartColors.primary,
      borderColor: themeColors.chartColors.primary.map(color => color.replace('0.8', '1')),
      borderWidth: 2
    }]
  };

  // Graphique Bar - Top 5 ventes
  const salesChart = {
    labels: produitsServices.slice(0, 5).map(p => p.nom.substring(0, 15) + '...'),
    datasets: [{
      label: 'Ventes mensuelles',
      data: produitsServices.slice(0, 5).map(p => p.ventesMois),
      backgroundColor: themeColors.chartColors.secondary,
      borderColor: themeColors.chartColors.secondary.replace('0.7', '1'),
      borderWidth: 2
    }]
  };

  // Graphique Radar - Performance
  const performanceChart = {
    labels: ['Ventes', 'Marge', 'Satisfaction', 'Popularité', 'Stock'],
    datasets: [{
      label: 'Performance globale',
      data: [75, kpis.margeMoyenne, kpis.satisfactionMoyenne * 20, 80, 65],
      backgroundColor: themeColors.chartColors.primary[2],
      borderColor: themeColors.chartColors.primary[2].replace('0.8', '1'),
      borderWidth: 2
    }]
  };

  const handleAddToCart = (produit) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const ProduitServiceCard = ({ item }) => {
    const typeColors = {
      produit: 'from-green-600 to-emerald-500',
      service: 'from-blue-600 to-cyan-500'
    };

    const disponibiliteColors = {
      disponible: 'bg-green-500/20 text-green-400',
      stock_faible: 'bg-orange-500/20 text-orange-400',
      sur_devis: 'bg-blue-500/20 text-blue-400',
      urgent: 'bg-red-500/20 text-red-400',
      rupture: 'bg-gray-500/20 text-gray-400'
    };

    return (
      <div className="relative group">
        {/* Effets spéciaux pour les thèmes spéciaux */}
        {themeColors.special === 'neon-glow' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-300 animate-pulse" />
        )}
        {themeColors.special === 'galaxy-stars' && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0]
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.7
                }}
              />
            ))}
          </div>
        )}
        {themeColors.special === 'lava-bubbles' && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-red-500 rounded-full opacity-40"
                style={{
                  bottom: '15%',
                  left: `${15 + i * 25}%`
                }}
                animate={{
                  y: [-8, -25, -8],
                  scale: [0.6, 1.2, 0.6]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  delay: i * 1
                }}
              />
            ))}
          </div>
        )}

        {/* Effet de bordure au hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-75 transition duration-300 blur"></div>
        
        <div className={`
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br ${themeColors.cardBg}
          backdrop-blur-xl ${themeColors.border}
          shadow-xl transition-all duration-300
          group-hover:shadow-2xl group-hover:border-white/40
          ${themeColors.glassBg ? `${themeColors.glassBg} border` : 'border border-white/20'}
        `} style={{
          background: theme === 'light' ? 'var(--glass-bg)' : undefined,
          backdropFilter: 'var(--glass-blur)',
          boxShadow: 'var(--shadow-xl)'
        }}>
          {/* Header avec type */}
          <div className={`relative h-2 bg-gradient-to-r ${typeColors[item.type]}`} />

          {/* Badge popularité */}
          {item.popularite > 85 && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 rounded-full blur-lg animate-pulse" />
                <div className="relative bg-gradient-to-br from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <FireIcon className="w-3 h-3" />
                  TOP
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* En-tête avec image */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{item.image}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {item.type === 'produit' ? 
                      <CubeIcon className="w-4 h-4 text-green-400" /> :
                      <WrenchScrewdriverIcon className="w-4 h-4 text-blue-400" />
                    }
                    <span className={`text-xs font-mono ${themeColors.textSecondary}`}>{item.reference}</span>
                  </div>
                  <h3 className={`text-lg font-bold ${themeColors.textPrimary} line-clamp-2`}>{item.nom}</h3>
                  <p className={`text-xs ${themeColors.textSecondary} mt-1`}>{item.categorie}</p>
                </div>
              </div>
            </div>

            {/* Prix et unité */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className={`text-2xl font-bold ${themeColors.textPrimary}`}>
                  {item.prix}€
                  <span className={`text-sm ${themeColors.textSecondary} font-normal`}>/{item.unite}</span>
                </div>
                <div className="text-xs text-green-400 font-semibold">
                  Marge: {item.margeUnitaire}%
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${disponibiliteColors[item.disponibilite]}`}>
                {item.disponibilite.replace('_', ' ')}
              </div>
            </div>

            {/* Stock ou temps de réalisation */}
            {item.type === 'produit' ? (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs ${themeColors.textSecondary}`}>Stock</span>
                  <span className={`text-xs font-bold ${themeColors.textPrimary}`}>{item.stock} unités</span>
                </div>
                <div className="relative h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      item.stock < item.stockMin ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                      'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.stock / item.stockMin) * 100, 100)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-black/20 rounded-lg p-2 mb-4">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-blue-400" />
                  <span className={`text-sm ${themeColors.textPrimary}`}>{item.tempsRealisation}</span>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className={`text-xs ${themeColors.textSecondary}`}>Ventes/mois</div>
                <div className={`text-lg font-bold ${themeColors.textPrimary} flex items-center justify-center gap-1`}>
                  {item.ventesMois}
                  {item.tendance === 'hausse' ? 
                    <ArrowTrendingUpIcon className="w-3 h-3 text-green-400" /> :
                    item.tendance === 'baisse' ?
                    <ArrowTrendingDownIcon className="w-3 h-3 text-red-400" /> :
                    null
                  }
                </div>
              </div>
              <div className="text-center">
                <div className={`text-xs ${themeColors.textSecondary}`}>Évaluation</div>
                <div className="text-lg font-bold text-yellow-400 flex items-center justify-center gap-1">
                  <StarIcon className="w-4 h-4 fill-current" />
                  {item.evaluation}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-xs ${themeColors.textSecondary}`}>Popularité</div>
                <div className="text-lg font-bold text-purple-400">
                  {item.popularite}%
                </div>
              </div>
            </div>

            {/* Garantie */}
            {item.garantie && (
              <div className="flex items-center gap-2 mb-4 text-xs">
                <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                <span className={themeColors.textSecondary}>{item.garantie}</span>
              </div>
            )}

            {/* Échéance pour produits */}
            {item.echeance && (
              <div className="flex items-center gap-2 mb-4 text-xs">
                <CalendarDaysIcon className="w-4 h-4 text-orange-400" />
                <span className={themeColors.textSecondary}>Expire: {item.echeance}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg"
              >
                Voir détails
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddToCart(item)}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg"
              >
                <ShoppingCartIcon className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header avec KPIs */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-4xl font-bold ${themeColors.textPrimary} mb-2 flex items-center gap-3`}>
              <CubeIcon className="w-10 h-10 text-green-400" />
              Produits & Services
              <SparklesIcon className="w-8 h-8 text-yellow-400" />
            </h1>
            <p className={themeColors.textSecondary}>Catalogue complet des produits et services</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <ExclamationTriangleIcon className="w-5 h-5" />
              Stock faible ({kpis.stockFaible})
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Nouveau
            </motion.button>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total Produits', value: kpis.totalProduits, icon: CubeIcon, trend: '+5', color: 'from-green-600 to-emerald-500' },
            { label: 'Total Services', value: kpis.totalServices, icon: WrenchScrewdriverIcon, trend: '+3', color: 'from-blue-600 to-cyan-500' },
            { label: 'Ventes/Mois', value: kpis.ventesMensuelles, icon: ShoppingCartIcon, trend: '+18%', color: 'from-purple-600 to-pink-500' },
            { label: 'Stock Faible', value: kpis.stockFaible, icon: ArchiveBoxIcon, trend: '-2', color: 'from-orange-600 to-red-500' },
            { label: 'Marge Moyenne', value: `${kpis.margeMoyenne}%`, icon: ChartBarIcon, trend: '+3%', color: 'from-indigo-600 to-purple-500' },
            { label: 'Satisfaction', value: `${kpis.satisfactionMoyenne}⭐`, icon: StarIcon, trend: '+0.2', color: 'from-yellow-600 to-orange-500' }
          ].map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div className={`
                relative overflow-hidden rounded-xl
                bg-gradient-to-br ${themeColors.cardBg}
                backdrop-blur-xl ${themeColors.border}
                shadow-xl hover:shadow-2xl transition-all duration-300
                p-4
              `} style={{
                background: theme === 'light' ? 'var(--glass-bg)' : undefined,
                backdropFilter: 'var(--glass-blur)',
                boxShadow: 'var(--shadow-xl)'
              }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-10`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className={`w-5 h-5 ${themeColors.textPrimary.replace('text-', 'text-').replace('-900', '-400').replace('-100', '-600')}`} />
                    <span className={`text-xs font-semibold ${
                      kpi.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {kpi.trend}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${themeColors.textPrimary}`}>{kpi.value}</div>
                  <div className={`text-xs ${themeColors.textSecondary} mt-1`}>{kpi.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex gap-4"
      >
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeColors.textSecondary}`} />
          <input
            type="text"
            placeholder="Rechercher un produit ou service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} rounded-lg ${themeColors.textPrimary} ${themeColors.textSecondary.replace('text-', 'placeholder-')} focus:outline-none focus:border-white/40`}
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-4 py-2 ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} rounded-lg ${themeColors.textPrimary} focus:outline-none focus:border-white/40`}
        >
          <option value="all">Toutes catégories</option>
          <option value="Entretien">Entretien</option>
          <option value="Fournitures">Fournitures</option>
          <option value="Installation">Installation</option>
          <option value="Sécurité">Sécurité</option>
        </select>

        <div className="flex gap-2">
          {['all', 'produit', 'service'].map(filter => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedFilter === filter
                  ? `bg-gradient-to-r ${themeColors.accent} text-white shadow-lg`
                  : `${themeColors.glassBg.replace('bg-', 'bg-').replace('/80', '/10')} ${themeColors.textSecondary} hover:bg-white/20`
              }`}
            >
              {filter === 'all' ? 'Tous' :
               filter === 'produit' ? 'Produits' : 'Services'}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white/20' : 'bg-white/10'}`}
          >
            <Squares2X2Icon className={`w-5 h-5 ${themeColors.textPrimary}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white/20' : 'bg-white/10'}`}
          >
            <ListBulletIcon className={`w-5 h-5 ${themeColors.textPrimary}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Graphiques */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-xl bg-gradient-to-br ${themeColors.cardBg} backdrop-blur-xl ${themeColors.border}`}
          style={{
            background: theme === 'light' ? 'var(--glass-bg)' : undefined,
            backdropFilter: 'var(--glass-blur)',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Répartition Catégories</h3>
          <Doughnut data={categoryChart} options={{ plugins: { legend: { position: 'bottom', labels: { color: themeColors.chartColors.text } } } }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl bg-gradient-to-br ${themeColors.cardBg} backdrop-blur-xl ${themeColors.border}`}
          style={{
            background: theme === 'light' ? 'var(--glass-bg)' : undefined,
            backdropFilter: 'var(--glass-blur)',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Top Ventes</h3>
          <Bar data={salesChart} options={{ 
            plugins: { legend: { display: false } },
            scales: { 
              y: { ticks: { color: themeColors.chartColors.text }, grid: { color: 'rgba(255,255,255,0.1)' } },
              x: { ticks: { color: themeColors.chartColors.text, maxRotation: 45, minRotation: 45 }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
          }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl bg-gradient-to-br ${themeColors.cardBg} backdrop-blur-xl ${themeColors.border}`}
          style={{
            background: theme === 'light' ? 'var(--glass-bg)' : undefined,
            backdropFilter: 'var(--glass-blur)',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Performance Globale</h3>
          <Radar data={performanceChart} options={{ 
            plugins: { legend: { display: false } },
            scales: { r: { ticks: { color: themeColors.chartColors.text }, grid: { color: 'rgba(255,255,255,0.1)' } } }
          }} />
        </motion.div>
      </div>

      {/* Liste des produits/services */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-6">
          {produitsServices
            .filter(p => selectedFilter === 'all' || p.type === selectedFilter)
            .filter(p => selectedCategory === 'all' || p.categorie === selectedCategory)
            .filter(p => p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(item => (
              <ProduitServiceCard key={item.id} item={item} />
            ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Vue liste à implémenter */}
        </div>
      )}
    </div>
  );
};

export default ProduitsServicesPremium;