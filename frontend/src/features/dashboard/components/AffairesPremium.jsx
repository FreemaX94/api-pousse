import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  BriefcaseIcon, 
  CurrencyEuroIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  TagIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon
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
import { Doughnut, Bar, Radar, Line } from 'react-chartjs-2';
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

const AffairesPremium = () => {
  const { theme, currentThemeConfig } = useTheme();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAffaire, setSelectedAffaire] = useState(null);
  const [showKanban, setShowKanban] = useState(false);
  const controls = useAnimation();

  // Données mock des affaires
  const [affaires] = useState([
    {
      id: 1,
      reference: 'AFF-2025-001',
      client: 'Entreprise Durand SA',
      titre: 'Aménagement espace vert corporate',
      montant: 45000,
      marge: 35,
      statut: 'en_cours',
      priorite: 'haute',
      dateEcheance: '2025-08-15',
      joursRestants: 8,
      avancement: 65,
      responsable: 'Marie Martin',
      type: 'Aménagement',
      secteur: 'Corporate',
      documents: 12,
      taches: { total: 24, completees: 18 },
      risque: 'faible',
      paiements: { recu: 20000, attendu: 25000 },
      phases: [
        { nom: 'Conception', statut: 'complete' },
        { nom: 'Préparation', statut: 'complete' },
        { nom: 'Réalisation', statut: 'en_cours' },
        { nom: 'Finition', statut: 'attente' }
      ]
    },
    {
      id: 2,
      reference: 'AFF-2025-002',
      client: 'Mairie de Versailles',
      titre: 'Rénovation jardins publics',
      montant: 120000,
      marge: 28,
      statut: 'retard',
      priorite: 'critique',
      dateEcheance: '2025-08-05',
      joursRestants: -2,
      avancement: 45,
      responsable: 'Pierre Dubois',
      type: 'Rénovation',
      secteur: 'Public',
      documents: 28,
      taches: { total: 36, completees: 16 },
      risque: 'eleve',
      paiements: { recu: 40000, attendu: 80000 },
      phases: [
        { nom: 'Étude', statut: 'complete' },
        { nom: 'Planification', statut: 'en_cours' },
        { nom: 'Exécution', statut: 'attente' },
        { nom: 'Livraison', statut: 'attente' }
      ]
    },
    {
      id: 3,
      reference: 'AFF-2025-003',
      client: 'Résidence Les Jardins',
      titre: 'Entretien annuel espaces verts',
      montant: 18000,
      marge: 42,
      statut: 'nouveau',
      priorite: 'normale',
      dateEcheance: '2025-08-20',
      joursRestants: 13,
      avancement: 10,
      responsable: 'Sophie Laurent',
      type: 'Entretien',
      secteur: 'Résidentiel',
      documents: 5,
      taches: { total: 12, completees: 1 },
      risque: 'faible',
      paiements: { recu: 0, attendu: 18000 },
      phases: [
        { nom: 'Signature', statut: 'complete' },
        { nom: 'Planification', statut: 'en_cours' },
        { nom: 'Intervention', statut: 'attente' },
        { nom: 'Clôture', statut: 'attente' }
      ]
    },
    {
      id: 4,
      reference: 'AFF-2025-004',
      client: 'Hôtel Luxe Palace',
      titre: 'Création jardin zen intérieur',
      montant: 75000,
      marge: 40,
      statut: 'en_cours',
      priorite: 'haute',
      dateEcheance: '2025-08-25',
      joursRestants: 18,
      avancement: 80,
      responsable: 'Jean Petit',
      type: 'Création',
      secteur: 'Hôtellerie',
      documents: 20,
      taches: { total: 30, completees: 24 },
      risque: 'moyen',
      paiements: { recu: 50000, attendu: 25000 },
      phases: [
        { nom: 'Design', statut: 'complete' },
        { nom: 'Installation', statut: 'complete' },
        { nom: 'Plantation', statut: 'en_cours' },
        { nom: 'Décoration', statut: 'attente' }
      ]
    }
  ]);

  // KPIs calculés
  const kpis = {
    totalAffaires: affaires.length,
    montantTotal: affaires.reduce((sum, a) => sum + a.montant, 0),
    margemoyenne: Math.round(affaires.reduce((sum, a) => sum + a.marge, 0) / affaires.length),
    affairesEnRetard: affaires.filter(a => a.statut === 'retard').length,
    tauxCompletion: Math.round(affaires.reduce((sum, a) => sum + a.avancement, 0) / affaires.length),
    chiffreAffairesPotentiel: affaires.filter(a => a.statut === 'nouveau').reduce((sum, a) => sum + a.montant, 0)
  };

  // Graphique Doughnut - Répartition par statut
  const statusChart = {
    labels: ['En cours', 'En retard', 'Nouveaux', 'Terminés'],
    datasets: [{
      data: [
        affaires.filter(a => a.statut === 'en_cours').length,
        affaires.filter(a => a.statut === 'retard').length,
        affaires.filter(a => a.statut === 'nouveau').length,
        affaires.filter(a => a.statut === 'termine').length || 0
      ],
      backgroundColor: theme === 'neon' ? 
        ['rgba(0, 255, 255, 0.8)', 'rgba(255, 0, 255, 0.8)', 'rgba(0, 255, 0, 0.8)', 'rgba(255, 255, 0, 0.8)'] :
        theme === 'galaxy' ?
        ['rgba(123, 31, 162, 0.8)', 'rgba(255, 193, 7, 0.8)', 'rgba(74, 20, 140, 0.8)', 'rgba(255, 215, 0, 0.8)'] :
        ['rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(168, 85, 247, 0.8)'],
      borderColor: theme === 'neon' ?
        ['rgba(0, 255, 255, 1)', 'rgba(255, 0, 255, 1)', 'rgba(0, 255, 0, 1)', 'rgba(255, 255, 0, 1)'] :
        theme === 'galaxy' ?
        ['rgba(123, 31, 162, 1)', 'rgba(255, 193, 7, 1)', 'rgba(74, 20, 140, 1)', 'rgba(255, 215, 0, 1)'] :
        ['rgba(59, 130, 246, 1)', 'rgba(239, 68, 68, 1)', 'rgba(34, 197, 94, 1)', 'rgba(168, 85, 247, 1)'],
      borderWidth: 2
    }]
  };

  // Graphique Bar - Montants par type
  const typeChart = {
    labels: ['Aménagement', 'Rénovation', 'Entretien', 'Création'],
    datasets: [{
      label: 'Montant (€)',
      data: [45000, 120000, 18000, 75000],
      backgroundColor: theme === 'neon' ? 'rgba(0, 255, 255, 0.7)' : 
                       theme === 'lava' ? 'rgba(255, 69, 0, 0.7)' :
                       'rgba(99, 102, 241, 0.7)',
      borderColor: theme === 'neon' ? 'rgba(0, 255, 255, 1)' :
                   theme === 'lava' ? 'rgba(255, 69, 0, 1)' :
                   'rgba(99, 102, 241, 1)',
      borderWidth: 2
    }]
  };

  // Graphique Radar - Performance par secteur
  const sectorChart = {
    labels: ['Corporate', 'Public', 'Résidentiel', 'Hôtellerie', 'Commercial'],
    datasets: [{
      label: 'Nombre d\'affaires',
      data: [1, 1, 1, 1, 0],
      backgroundColor: 'rgba(251, 146, 60, 0.3)',
      borderColor: 'rgba(251, 146, 60, 1)',
      borderWidth: 2
    }, {
      label: 'Marge moyenne (%)',
      data: [35, 28, 42, 40, 0],
      backgroundColor: 'rgba(34, 197, 94, 0.3)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 2
    }]
  };

  const handleConvertToProject = (affaire) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    // Logique de conversion
  };

  const getThemeColors = () => {
    const themeSpecificColors = {
      light: {
        cardBg: 'from-white/95 to-blue-50/90',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-600',
        accent: 'from-blue-500 to-indigo-600',
        border: 'border-blue-200/50',
        glassBg: 'bg-white/80'
      },
      dark: {
        cardBg: 'from-gray-900/95 to-teal-900/20',
        textPrimary: 'text-gray-100',
        textSecondary: 'text-gray-400',
        accent: 'from-teal-500 to-cyan-600',
        border: 'border-teal-500/30',
        glassBg: 'bg-gray-900/80'
      },
      beige: {
        cardBg: 'from-amber-50/95 to-orange-50/90',
        textPrimary: 'text-amber-900',
        textSecondary: 'text-amber-700',
        accent: 'from-amber-600 to-orange-600',
        border: 'border-amber-300/50',
        glassBg: 'bg-amber-50/80'
      },
      dawn: {
        cardBg: 'from-pink-50/95 to-rose-100/90',
        textPrimary: 'text-pink-900',
        textSecondary: 'text-pink-700',
        accent: 'from-pink-500 to-rose-600',
        border: 'border-pink-300/50',
        glassBg: 'bg-pink-50/80'
      },
      neon: {
        cardBg: 'from-black/95 to-purple-900/40',
        textPrimary: 'text-cyan-100',
        textSecondary: 'text-fuchsia-400',
        accent: 'from-fuchsia-500 to-cyan-500',
        border: 'border-fuchsia-500/50',
        glassBg: 'bg-black/80'
      },
      ocean: {
        cardBg: 'from-blue-900/95 to-cyan-800/30',
        textPrimary: 'text-cyan-100',
        textSecondary: 'text-blue-300',
        accent: 'from-blue-500 to-cyan-400',
        border: 'border-cyan-400/40',
        glassBg: 'bg-blue-900/80'
      },
      tropical: {
        cardBg: 'from-green-50/95 to-emerald-100/90',
        textPrimary: 'text-green-900',
        textSecondary: 'text-orange-600',
        accent: 'from-green-500 to-orange-500',
        border: 'border-green-400/50',
        glassBg: 'bg-green-50/80'
      },
      lavender: {
        cardBg: 'from-purple-50/95 to-violet-100/90',
        textPrimary: 'text-purple-900',
        textSecondary: 'text-purple-600',
        accent: 'from-purple-500 to-violet-600',
        border: 'border-purple-300/50',
        glassBg: 'bg-purple-50/80'
      },
      galaxy: {
        cardBg: 'from-indigo-950/95 to-purple-900/40',
        textPrimary: 'text-purple-100',
        textSecondary: 'text-yellow-400',
        accent: 'from-purple-600 to-yellow-500',
        border: 'border-yellow-400/30',
        glassBg: 'bg-indigo-950/80'
      },
      autumn: {
        cardBg: 'from-orange-50/95 to-red-50/90',
        textPrimary: 'text-orange-900',
        textSecondary: 'text-red-700',
        accent: 'from-orange-600 to-red-600',
        border: 'border-orange-400/50',
        glassBg: 'bg-orange-50/80'
      },
      glacier: {
        cardBg: 'from-blue-50/95 to-slate-100/90',
        textPrimary: 'text-blue-900',
        textSecondary: 'text-slate-600',
        accent: 'from-blue-400 to-slate-500',
        border: 'border-blue-300/50',
        glassBg: 'bg-blue-50/80'
      },
      sakura: {
        cardBg: 'from-pink-50/95 to-rose-50/90',
        textPrimary: 'text-pink-900',
        textSecondary: 'text-rose-600',
        accent: 'from-pink-400 to-rose-500',
        border: 'border-pink-200/50',
        glassBg: 'bg-pink-50/80'
      },
      midnight: {
        cardBg: 'from-indigo-950/95 to-slate-900/40',
        textPrimary: 'text-yellow-100',
        textSecondary: 'text-yellow-400',
        accent: 'from-indigo-600 to-yellow-500',
        border: 'border-yellow-500/30',
        glassBg: 'bg-indigo-950/80'
      },
      lava: {
        cardBg: 'from-red-950/95 to-orange-900/40',
        textPrimary: 'text-orange-100',
        textSecondary: 'text-yellow-400',
        accent: 'from-red-600 to-yellow-500',
        border: 'border-orange-500/50',
        glassBg: 'bg-red-950/80'
      }
    };
    return themeSpecificColors[theme] || themeSpecificColors.dark;
  };

  const themeColors = getThemeColors();

  const AffaireCard = ({ affaire }) => {
    const getStatusGradient = () => {
      const statusMap = {
        light: {
          en_cours: 'from-blue-500 to-indigo-500',
          retard: 'from-red-500 to-pink-500',
          nouveau: 'from-green-500 to-emerald-500',
          termine: 'from-purple-500 to-violet-500'
        },
        dark: {
          en_cours: 'from-teal-500 to-cyan-500',
          retard: 'from-red-600 to-orange-500',
          nouveau: 'from-green-500 to-emerald-400',
          termine: 'from-purple-500 to-pink-500'
        },
        beige: {
          en_cours: 'from-amber-600 to-yellow-600',
          retard: 'from-red-600 to-orange-600',
          nouveau: 'from-green-600 to-lime-600',
          termine: 'from-purple-600 to-pink-600'
        },
        dawn: {
          en_cours: 'from-pink-500 to-rose-500',
          retard: 'from-red-500 to-orange-500',
          nouveau: 'from-orange-400 to-yellow-400',
          termine: 'from-purple-500 to-pink-500'
        },
        neon: {
          en_cours: 'from-cyan-400 to-blue-500',
          retard: 'from-red-500 to-fuchsia-500',
          nouveau: 'from-green-400 to-cyan-400',
          termine: 'from-purple-400 to-pink-500'
        },
        ocean: {
          en_cours: 'from-blue-400 to-cyan-400',
          retard: 'from-red-500 to-orange-400',
          nouveau: 'from-teal-400 to-green-400',
          termine: 'from-indigo-400 to-purple-400'
        },
        tropical: {
          en_cours: 'from-green-500 to-teal-500',
          retard: 'from-red-500 to-orange-500',
          nouveau: 'from-lime-500 to-green-500',
          termine: 'from-purple-500 to-pink-500'
        },
        lavender: {
          en_cours: 'from-purple-500 to-violet-500',
          retard: 'from-red-500 to-pink-500',
          nouveau: 'from-violet-400 to-purple-400',
          termine: 'from-indigo-500 to-purple-500'
        },
        galaxy: {
          en_cours: 'from-purple-600 to-indigo-600',
          retard: 'from-red-600 to-orange-500',
          nouveau: 'from-yellow-500 to-amber-500',
          termine: 'from-purple-500 to-pink-600'
        },
        autumn: {
          en_cours: 'from-orange-600 to-amber-600',
          retard: 'from-red-600 to-crimson-600',
          nouveau: 'from-yellow-600 to-orange-600',
          termine: 'from-brown-600 to-orange-700'
        },
        glacier: {
          en_cours: 'from-blue-400 to-slate-500',
          retard: 'from-red-400 to-pink-400',
          nouveau: 'from-cyan-400 to-blue-400',
          termine: 'from-indigo-400 to-blue-500'
        },
        sakura: {
          en_cours: 'from-pink-400 to-rose-400',
          retard: 'from-red-400 to-rose-500',
          nouveau: 'from-pink-300 to-rose-300',
          termine: 'from-purple-400 to-pink-400'
        },
        midnight: {
          en_cours: 'from-indigo-600 to-blue-600',
          retard: 'from-red-600 to-orange-500',
          nouveau: 'from-yellow-500 to-amber-500',
          termine: 'from-purple-600 to-indigo-600'
        },
        lava: {
          en_cours: 'from-orange-600 to-red-600',
          retard: 'from-red-700 to-crimson-600',
          nouveau: 'from-yellow-600 to-orange-600',
          termine: 'from-red-600 to-orange-700'
        }
      };
      return (statusMap[theme] || statusMap.dark)[affaire.statut] || statusMap.dark.en_cours;
    };

    const priorityGlow = {
      critique: theme === 'neon' ? 'shadow-fuchsia-500/70' : 'shadow-red-500/50',
      haute: theme === 'neon' ? 'shadow-cyan-500/70' : 'shadow-orange-500/50',
      normale: theme === 'neon' ? 'shadow-blue-500/50' : 'shadow-blue-500/30',
      basse: 'shadow-gray-500/20'
    };

    return (
      <div className={`relative group`}>
        {/* Effet de bordure lumineux au hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-75 transition duration-300 blur"></div>
        
        <div 
          className={`
            relative overflow-hidden rounded-2xl
            bg-gradient-to-br ${themeColors.cardBg}
            backdrop-blur-xl ${themeColors.border} border
            shadow-xl ${priorityGlow[affaire.priorite]}
            transition-all duration-300
            group-hover:shadow-2xl group-hover:-translate-y-1
          `}
          style={{
            backgroundColor: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)',
            boxShadow: theme === 'neon' ? 'var(--neon-glow)' : 
                      theme === 'galaxy' ? '0 0 30px rgba(123, 31, 162, 0.3)' :
                      theme === 'lava' ? '0 0 25px rgba(255, 69, 0, 0.4)' :
                      'var(--shadow-xl)'
          }}
        >
          {/* Header avec gradient animé */}
          <div className={`
            relative h-3 bg-gradient-to-r ${getStatusGradient()}
            overflow-hidden
          `}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          {/* Badge priorité flottant */}
          {affaire.priorite === 'critique' && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <FireIcon className="w-3 h-3" />
                  URGENT
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* En-tête */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BriefcaseIcon className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-mono text-gray-400">{affaire.reference}</span>
                </div>
                <h3 className={`text-lg font-bold ${themeColors.textPrimary} line-clamp-1`}>{affaire.titre}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  {affaire.client}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${themeColors.textPrimary}`}>
                  {affaire.montant.toLocaleString()}€
                </div>
                <div className={`text-sm font-semibold ${affaire.marge >= 35 ? 'text-green-400' : 'text-orange-400'}`}>
                  Marge: {affaire.marge}%
                </div>
              </div>
            </div>

            {/* Barre de progression avec milestones */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Avancement</span>
                <span className={`text-xs font-bold ${themeColors.textPrimary}`}>{affaire.avancement}%</span>
              </div>
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${themeColors.accent} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${affaire.avancement}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                {/* Milestones */}
                <div className="absolute inset-0 flex justify-between px-1">
                  {affaire.phases.map((phase, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        phase.statut === 'complete' ? 'bg-green-400' :
                        phase.statut === 'en_cours' ? 'bg-yellow-400 animate-pulse' :
                        'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-1">
                {affaire.phases.map((phase, idx) => (
                  <span key={idx} className="text-xs text-gray-500">{phase.nom.substring(0, 3)}</span>
                ))}
              </div>
            </div>

            {/* Stats en grille */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-black/20 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                  <CalendarDaysIcon className="w-3 h-3" />
                  Échéance
                </div>
                <div className={`text-sm font-bold ${affaire.joursRestants < 0 ? 'text-red-400' : affaire.joursRestants < 7 ? 'text-orange-400' : 'text-green-400'}`}>
                  {affaire.joursRestants < 0 ? `${Math.abs(affaire.joursRestants)}j retard` : `${affaire.joursRestants}j restants`}
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                  <DocumentTextIcon className="w-3 h-3" />
                  Tâches
                </div>
                <div className={`text-sm font-bold ${themeColors.textPrimary}`}>
                  {affaire.taches.completees}/{affaire.taches.total}
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                  <CurrencyEuroIcon className="w-3 h-3" />
                  Paiements
                </div>
                <div className="text-sm font-bold text-green-400">
                  {Math.round((affaire.paiements.recu / affaire.montant) * 100)}%
                </div>
              </div>
            </div>

            {/* Responsable et risque */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {affaire.responsable.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm text-gray-400">{affaire.responsable}</span>
              </div>
              <div className={`
                px-2 py-1 rounded-full text-xs font-semibold
                ${affaire.risque === 'eleve' ? 'bg-red-500/20 text-red-400' :
                  affaire.risque === 'moyen' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'}
              `}>
                Risque {affaire.risque}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAffaire(affaire)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg"
              >
                Voir détails
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleConvertToProject(affaire)}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg"
              >
                <ArrowPathIcon className="w-4 h-4" />
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
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BriefcaseIcon className="w-10 h-10 text-indigo-400" />
              Affaires
              <SparklesIcon className="w-8 h-8 text-yellow-400" />
            </h1>
            <p className="text-gray-400">Gestion avancée des affaires et projets</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowKanban(!showKanban)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Vue Kanban
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Nouvelle Affaire
            </motion.button>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total Affaires', value: kpis.totalAffaires, icon: BriefcaseIcon, trend: '+12%', color: 'from-blue-600 to-cyan-500' },
            { label: 'Montant Total', value: `${(kpis.montantTotal / 1000).toFixed(0)}K€`, icon: CurrencyEuroIcon, trend: '+25%', color: 'from-green-600 to-emerald-500' },
            { label: 'Marge Moyenne', value: `${kpis.margemoyenne}%`, icon: ChartBarIcon, trend: '+5%', color: 'from-purple-600 to-pink-500' },
            { label: 'En Retard', value: kpis.affairesEnRetard, icon: ExclamationTriangleIcon, trend: '-2', color: 'from-red-600 to-orange-500' },
            { label: 'Taux Completion', value: `${kpis.tauxCompletion}%`, icon: CheckCircleIcon, trend: '+8%', color: 'from-indigo-600 to-purple-500' },
            { label: 'CA Potentiel', value: `${(kpis.chiffreAffairesPotentiel / 1000).toFixed(0)}K€`, icon: TrophyIcon, trend: '+15%', color: 'from-yellow-600 to-orange-500' }
          ].map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div className={`
                relative overflow-hidden rounded-xl
                bg-gradient-to-br ${themeColors.cardGradient}
                backdrop-blur-xl border border-white/20
                shadow-xl hover:shadow-2xl transition-all duration-300
                p-4
              `}>
                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-10`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className={`w-5 h-5 text-white/70`} />
                    <span className={`text-xs font-semibold ${kpi.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.trend}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{kpi.label}</div>
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
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une affaire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'en_cours', 'retard', 'nouveau'].map(filter => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedFilter === filter
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {filter === 'all' ? 'Toutes' :
               filter === 'en_cours' ? 'En cours' :
               filter === 'retard' ? 'En retard' : 'Nouvelles'}
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
            <Squares2X2Icon className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white/20' : 'bg-white/10'}`}
          >
            <ListBulletIcon className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Graphiques */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}
          style={{
            backgroundColor: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)'
          }}
        >
          <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Répartition par Statut</h3>
          <Doughnut data={statusChart} options={{ plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}
          style={{
            backgroundColor: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)'
          }}
        >
          <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Montants par Type</h3>
          <Bar data={typeChart} options={{ 
            plugins: { legend: { display: false } },
            scales: { 
              y: { ticks: { color: theme === 'light' || theme === 'beige' || theme === 'dawn' || theme === 'tropical' || theme === 'lavender' || theme === 'autumn' || theme === 'glacier' || theme === 'sakura' ? '#333' : '#fff' }, grid: { color: 'rgba(128,128,128,0.1)' } },
              x: { ticks: { color: theme === 'light' || theme === 'beige' || theme === 'dawn' || theme === 'tropical' || theme === 'lavender' || theme === 'autumn' || theme === 'glacier' || theme === 'sakura' ? '#333' : '#fff' }, grid: { color: 'rgba(128,128,128,0.1)' } }
            }
          }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} border`}
          style={{
            backgroundColor: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)'
          }}
        >
          <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Performance Secteurs</h3>
          <Radar data={sectorChart} options={{ 
            plugins: { legend: { position: 'bottom', labels: { color: 'white' } } },
            scales: { r: { ticks: { color: theme === 'light' || theme === 'beige' || theme === 'dawn' || theme === 'tropical' || theme === 'lavender' || theme === 'autumn' || theme === 'glacier' || theme === 'sakura' ? '#333' : '#fff' }, grid: { color: 'rgba(128,128,128,0.1)' } } }
          }} />
        </motion.div>
      </div>

      {/* Liste des affaires */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-6">
          {affaires
            .filter(a => selectedFilter === 'all' || a.statut === selectedFilter)
            .filter(a => a.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.client.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(affaire => (
              <AffaireCard key={affaire.id} affaire={affaire} />
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

export default AffairesPremium;