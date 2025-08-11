import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  CameraIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
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
import { Doughnut, Bar, Line, PolarArea } from 'react-chartjs-2';
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

const PointagesPremium = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fonction pour obtenir les couleurs du thème
  const getThemeColors = () => {
    const themeSpecificColors = {
      light: {
        cardBg: 'from-white/95 to-blue-50/90',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-600',
        accent: 'from-blue-500 to-indigo-600',
        border: 'border-blue-200/50',
        glassBg: 'bg-white/80',
        chartColors: {
          primary: ['rgba(59, 130, 246, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(59, 130, 246, 0.7)',
          text: '#374151'
        }
      },
      dark: {
        cardBg: 'from-gray-900/95 to-teal-900/20',
        textPrimary: 'text-gray-100',
        textSecondary: 'text-gray-400',
        accent: 'from-teal-500 to-cyan-600',
        border: 'border-teal-500/30',
        glassBg: 'bg-gray-900/80',
        chartColors: {
          primary: ['rgba(20, 184, 166, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(20, 184, 166, 0.7)',
          text: '#ffffff'
        }
      },
      beige: {
        cardBg: 'from-amber-50/95 to-orange-50/90',
        textPrimary: 'text-amber-900',
        textSecondary: 'text-amber-700',
        accent: 'from-amber-600 to-orange-600',
        border: 'border-amber-300/50',
        glassBg: 'bg-amber-50/80',
        chartColors: {
          primary: ['rgba(217, 119, 6, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(217, 119, 6, 0.7)',
          text: '#451a03'
        }
      },
      dawn: {
        cardBg: 'from-pink-50/95 to-rose-100/90',
        textPrimary: 'text-pink-900',
        textSecondary: 'text-pink-700',
        accent: 'from-pink-500 to-rose-600',
        border: 'border-pink-300/50',
        glassBg: 'bg-pink-50/80',
        chartColors: {
          primary: ['rgba(236, 72, 153, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(236, 72, 153, 0.7)',
          text: '#831843'
        }
      },
      neon: {
        cardBg: 'from-black/95 to-purple-900/40',
        textPrimary: 'text-cyan-100',
        textSecondary: 'text-fuchsia-400',
        accent: 'from-fuchsia-500 to-cyan-500',
        border: 'border-fuchsia-500/50',
        glassBg: 'bg-black/80',
        special: 'neon-glow',
        chartColors: {
          primary: ['rgba(236, 72, 153, 0.9)', 'rgba(6, 182, 212, 0.9)', 'rgba(239, 68, 68, 0.9)'],
          secondary: 'rgba(236, 72, 153, 0.8)',
          text: '#00ffff'
        }
      },
      ocean: {
        cardBg: 'from-blue-900/95 to-cyan-800/30',
        textPrimary: 'text-cyan-100',
        textSecondary: 'text-blue-300',
        accent: 'from-blue-500 to-cyan-400',
        border: 'border-cyan-400/40',
        glassBg: 'bg-blue-900/80',
        chartColors: {
          primary: ['rgba(59, 130, 246, 0.8)', 'rgba(6, 182, 212, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(59, 130, 246, 0.7)',
          text: '#ecfeff'
        }
      },
      tropical: {
        cardBg: 'from-green-900/95 to-teal-800/30',
        textPrimary: 'text-green-100',
        textSecondary: 'text-emerald-300',
        accent: 'from-green-500 to-teal-500',
        border: 'border-emerald-400/40',
        glassBg: 'bg-green-900/80',
        chartColors: {
          primary: ['rgba(34, 197, 94, 0.8)', 'rgba(20, 184, 166, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(34, 197, 94, 0.7)',
          text: '#ecfdf5'
        }
      },
      lavender: {
        cardBg: 'from-purple-50/95 to-violet-100/90',
        textPrimary: 'text-purple-900',
        textSecondary: 'text-violet-700',
        accent: 'from-purple-500 to-violet-600',
        border: 'border-purple-300/50',
        glassBg: 'bg-purple-50/80',
        chartColors: {
          primary: ['rgba(147, 51, 234, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(147, 51, 234, 0.7)',
          text: '#581c87'
        }
      },
      galaxy: {
        cardBg: 'from-indigo-900/95 to-purple-900/50',
        textPrimary: 'text-indigo-100',
        textSecondary: 'text-purple-300',
        accent: 'from-indigo-500 to-purple-600',
        border: 'border-indigo-400/40',
        glassBg: 'bg-indigo-900/80',
        special: 'galaxy-stars',
        chartColors: {
          primary: ['rgba(99, 102, 241, 0.8)', 'rgba(147, 51, 234, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(99, 102, 241, 0.7)',
          text: '#e0e7ff'
        }
      },
      autumn: {
        cardBg: 'from-orange-100/95 to-red-50/90',
        textPrimary: 'text-orange-900',
        textSecondary: 'text-red-700',
        accent: 'from-orange-600 to-red-600',
        border: 'border-orange-300/50',
        glassBg: 'bg-orange-50/80',
        chartColors: {
          primary: ['rgba(249, 115, 22, 0.8)', 'rgba(220, 38, 38, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(249, 115, 22, 0.7)',
          text: '#9a3412'
        }
      },
      glacier: {
        cardBg: 'from-blue-50/95 to-cyan-50/90',
        textPrimary: 'text-blue-900',
        textSecondary: 'text-cyan-700',
        accent: 'from-blue-600 to-cyan-600',
        border: 'border-blue-300/50',
        glassBg: 'bg-blue-50/80',
        chartColors: {
          primary: ['rgba(37, 99, 235, 0.8)', 'rgba(6, 182, 212, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(37, 99, 235, 0.7)',
          text: '#1e3a8a'
        }
      },
      sakura: {
        cardBg: 'from-pink-50/95 to-fuchsia-50/90',
        textPrimary: 'text-pink-900',
        textSecondary: 'text-fuchsia-700',
        accent: 'from-pink-500 to-fuchsia-500',
        border: 'border-pink-300/50',
        glassBg: 'bg-pink-50/80',
        chartColors: {
          primary: ['rgba(236, 72, 153, 0.8)', 'rgba(217, 70, 239, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(236, 72, 153, 0.7)',
          text: '#831843'
        }
      },
      midnight: {
        cardBg: 'from-slate-900/95 to-gray-900/50',
        textPrimary: 'text-slate-100',
        textSecondary: 'text-amber-300',
        accent: 'from-slate-600 to-amber-600',
        border: 'border-amber-500/30',
        glassBg: 'bg-slate-900/80',
        chartColors: {
          primary: ['rgba(100, 116, 139, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(100, 116, 139, 0.7)',
          text: '#f1f5f9'
        }
      },
      lava: {
        cardBg: 'from-red-900/95 to-orange-900/50',
        textPrimary: 'text-red-100',
        textSecondary: 'text-orange-300',
        accent: 'from-red-600 to-orange-600',
        border: 'border-red-500/40',
        glassBg: 'bg-red-900/80',
        special: 'lava-bubbles',
        chartColors: {
          primary: ['rgba(220, 38, 38, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          secondary: 'rgba(220, 38, 38, 0.7)',
          text: '#fef2f2'
        }
      }
    };

    return themeSpecificColors[theme] || themeSpecificColors.dark;
  };

  // Mise à jour de l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Données mock des pointages
  const [pointages] = useState([
    {
      id: 1,
      employe: 'Jean Dupont',
      poste: 'Jardinier',
      photo: '👨‍🌾',
      statut: 'present',
      heureArrivee: '07:45',
      heureDepart: null,
      pauseDebut: '12:00',
      pauseFin: '13:00',
      heuresTravaillees: 5.25,
      heuresSupp: 0,
      site: 'Parc Monceau',
      coordonnees: { lat: 48.8794, lng: 2.3088 },
      methodePointage: 'mobile',
      retard: false,
      anomalie: false,
      commentaire: '',
      validation: 'auto',
      taches: ['Taille haies', 'Désherbage', 'Arrosage'],
      tauxProductivite: 92,
      incidents: 0
    },
    {
      id: 2,
      employe: 'Marie Martin',
      poste: 'Chef d\'équipe',
      photo: '👩‍💼',
      statut: 'present',
      heureArrivee: '07:30',
      heureDepart: null,
      pauseDebut: '12:30',
      pauseFin: '13:15',
      heuresTravaillees: 5.5,
      heuresSupp: 0.5,
      site: 'Jardin des Tuileries',
      coordonnees: { lat: 48.8634, lng: 2.3275 },
      methodePointage: 'badge',
      retard: false,
      anomalie: false,
      commentaire: 'Supervision chantier',
      validation: 'auto',
      taches: ['Supervision', 'Coordination', 'Rapport'],
      tauxProductivite: 95,
      incidents: 0
    },
    {
      id: 3,
      employe: 'Pierre Dubois',
      poste: 'Paysagiste',
      photo: '👨‍🔧',
      statut: 'retard',
      heureArrivee: '08:45',
      heureDepart: null,
      pauseDebut: null,
      pauseFin: null,
      heuresTravaillees: 4.25,
      heuresSupp: 0,
      site: 'Résidence Les Jardins',
      coordonnees: { lat: 48.8566, lng: 2.3522 },
      methodePointage: 'qrcode',
      retard: true,
      anomalie: true,
      commentaire: 'Embouteillage',
      validation: 'pending',
      taches: ['Plantation', 'Aménagement'],
      tauxProductivite: 78,
      incidents: 1
    },
    {
      id: 4,
      employe: 'Sophie Laurent',
      poste: 'Technicienne',
      photo: '👩‍🔬',
      statut: 'absent',
      heureArrivee: null,
      heureDepart: null,
      pauseDebut: null,
      pauseFin: null,
      heuresTravaillees: 0,
      heuresSupp: 0,
      site: null,
      coordonnees: null,
      methodePointage: null,
      retard: false,
      anomalie: true,
      commentaire: 'Maladie',
      validation: 'validated',
      taches: [],
      tauxProductivite: 0,
      incidents: 0
    },
    {
      id: 5,
      employe: 'Lucas Petit',
      poste: 'Apprenti',
      photo: '👨‍🎓',
      statut: 'present',
      heureArrivee: '08:00',
      heureDepart: null,
      pauseDebut: '12:15',
      pauseFin: '13:00',
      heuresTravaillees: 4.75,
      heuresSupp: 0,
      site: 'Centre Commercial',
      coordonnees: { lat: 48.8606, lng: 2.3376 },
      methodePointage: 'wifi',
      retard: false,
      anomalie: false,
      commentaire: '',
      validation: 'auto',
      taches: ['Assistance', 'Nettoyage', 'Transport'],
      tauxProductivite: 85,
      incidents: 0
    }
  ]);

  const themeColors = getThemeColors();

  // KPIs calculés
  const kpis = {
    totalEmployes: pointages.length,
    presents: pointages.filter(p => p.statut === 'present').length,
    absents: pointages.filter(p => p.statut === 'absent').length,
    retards: pointages.filter(p => p.retard).length,
    heuresMoyennes: (pointages.reduce((sum, p) => sum + p.heuresTravaillees, 0) / pointages.filter(p => p.statut === 'present').length).toFixed(1),
    tauxPresence: Math.round((pointages.filter(p => p.statut === 'present').length / pointages.length) * 100)
  };

  // Graphique Doughnut - Répartition présence
  const presenceChart = {
    labels: ['Présents', 'Absents', 'Retards'],
    datasets: [{
      data: [
        pointages.filter(p => p.statut === 'present' && !p.retard).length,
        pointages.filter(p => p.statut === 'absent').length,
        pointages.filter(p => p.retard).length
      ],
      backgroundColor: themeColors.chartColors.primary,
      borderColor: themeColors.chartColors.primary.map(color => color.replace('0.8', '1')),
      borderWidth: 2
    }]
  };

  // Graphique Bar - Heures par employé
  const hoursChart = {
    labels: pointages.map(p => p.employe.split(' ')[0]),
    datasets: [{
      label: 'Heures travaillées',
      data: pointages.map(p => p.heuresTravaillees),
      backgroundColor: themeColors.chartColors.secondary,
      borderColor: themeColors.chartColors.secondary.replace('0.7', '1'),
      borderWidth: 2
    }, {
      label: 'Heures supp',
      data: pointages.map(p => p.heuresSupp),
      backgroundColor: 'rgba(168, 85, 247, 0.7)',
      borderColor: 'rgba(168, 85, 247, 1)',
      borderWidth: 2
    }]
  };

  // Graphique Line - Productivité
  const productivityChart = {
    labels: ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h'],
    datasets: [{
      label: 'Productivité moyenne',
      data: [85, 92, 95, 94, 88, 75, 90, 93, 91, 87],
      borderColor: themeColors.chartColors.primary[1].replace('0.8', '1'),
      backgroundColor: themeColors.chartColors.primary[1].replace('0.8', '0.1'),
      fill: true,
      tension: 0.4
    }]
  };

  const handleStartWork = (employe) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const PointageCard = ({ pointage }) => {
    const statusColors = {
      present: 'from-green-600 to-emerald-500',
      absent: 'from-red-600 to-pink-500',
      retard: 'from-orange-600 to-amber-500',
      pause: 'from-blue-600 to-cyan-500'
    };

    // Définir les icônes alternatives d'abord
    const CreditCardIcon = DocumentTextIcon;
    const QrCodeIcon = CameraIcon;

    const methodeIcons = {
      mobile: DevicePhoneMobileIcon,
      badge: CreditCardIcon,
      qrcode: QrCodeIcon,
      wifi: WifiIcon
    };

    const MethodeIcon = methodeIcons[pointage.methodePointage] || DocumentTextIcon;

    return (
      <div className="relative group">
        {/* Effets spéciaux pour les thèmes spéciaux */}
        {themeColors.special === 'neon-glow' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-300 animate-pulse" />
        )}
        {themeColors.special === 'galaxy-stars' && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </div>
        )}
        {themeColors.special === 'lava-bubbles' && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-30"
                style={{
                  bottom: '10%',
                  left: `${20 + i * 30}%`
                }}
                animate={{
                  y: [-5, -20, -5],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.8
                }}
              />
            ))}
          </div>
        )}

        {/* Effet de bordure au hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-75 transition duration-300 blur" />
        
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
          {/* Header avec statut */}
          <div className={`relative h-2 bg-gradient-to-r ${statusColors[pointage.statut]}`} />

          {/* Badge anomalie */}
          {pointage.anomalie && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-lg animate-pulse" />
                <div className="relative bg-gradient-to-br from-red-500 to-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* En-tête avec photo et infos */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{pointage.photo}</div>
                <div>
                  <h3 className={`text-lg font-bold ${themeColors.textPrimary}`}>{pointage.employe}</h3>
                  <p className={`text-sm ${themeColors.textSecondary}`}>{pointage.poste}</p>
                  {pointage.site && (
                    <p className={`text-xs ${themeColors.textSecondary} flex items-center gap-1 mt-1`}>
                      <MapPinIcon className="w-3 h-3" />
                      {pointage.site}
                    </p>
                  )}
                </div>
              </div>
              <div className={`
                px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                ${pointage.statut === 'present' ? 'bg-green-500/20 text-green-400' :
                  pointage.statut === 'absent' ? 'bg-red-500/20 text-red-400' :
                  pointage.statut === 'retard' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-gray-500/20 text-gray-400'}
              `}>
                {pointage.statut === 'present' ? <CheckCircleIcon className="w-3 h-3" /> :
                 pointage.statut === 'absent' ? <XCircleIcon className="w-3 h-3" /> :
                 <ExclamationTriangleIcon className="w-3 h-3" />}
                {pointage.statut}
              </div>
            </div>

            {/* Timeline de la journée */}
            {pointage.statut !== 'absent' && (
              <div className="bg-black/20 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={themeColors.textSecondary}>Journée de travail</span>
                  <span className={`${themeColors.textPrimary} font-bold`}>{pointage.heuresTravaillees}h</span>
                </div>
                <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-full flex">
                    {/* Arrivée */}
                    {pointage.heureArrivee && (
                      <div 
                        className="absolute h-full w-1 bg-green-500"
                        style={{ left: `${((parseInt(pointage.heureArrivee.split(':')[0]) - 7) / 12) * 100}%` }}
                      />
                    )}
                    {/* Pause */}
                    {pointage.pauseDebut && (
                      <div 
                        className="absolute h-full bg-blue-500/50"
                        style={{ 
                          left: `${((parseInt(pointage.pauseDebut.split(':')[0]) - 7) / 12) * 100}%`,
                          width: '8.33%'
                        }}
                      />
                    )}
                    {/* Progression actuelle */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${(pointage.heuresTravaillees / 8) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">7h</span>
                  <span className="text-xs text-gray-500">12h</span>
                  <span className="text-xs text-gray-500">19h</span>
                </div>
              </div>
            )}

            {/* Horaires */}
            {pointage.statut !== 'absent' && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <ArrowRightOnRectangleIcon className="w-4 h-4 text-green-400" />
                  <div>
                    <div className={`text-xs ${themeColors.textSecondary}`}>Arrivée</div>
                    <div className={`text-sm font-bold ${themeColors.textPrimary}`}>
                      {pointage.heureArrivee || '-'}
                      {pointage.retard && (
                        <span className="text-xs text-red-400 ml-1">(retard)</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowLeftOnRectangleIcon className="w-4 h-4 text-red-400" />
                  <div>
                    <div className={`text-xs ${themeColors.textSecondary}`}>Départ</div>
                    <div className={`text-sm font-bold ${themeColors.textPrimary}`}>
                      {pointage.heureDepart || 'En cours'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center bg-black/20 rounded-lg p-2">
                <div className={`text-xs ${themeColors.textSecondary}`}>H. Supp</div>
                <div className="text-lg font-bold text-purple-400">
                  {pointage.heuresSupp}h
                </div>
              </div>
              <div className="text-center bg-black/20 rounded-lg p-2">
                <div className={`text-xs ${themeColors.textSecondary}`}>Productivité</div>
                <div className="text-lg font-bold text-blue-400">
                  {pointage.tauxProductivite}%
                </div>
              </div>
              <div className="text-center bg-black/20 rounded-lg p-2">
                <div className={`text-xs ${themeColors.textSecondary}`}>Tâches</div>
                <div className="text-lg font-bold text-green-400">
                  {pointage.taches.length}
                </div>
              </div>
            </div>

            {/* Méthode de pointage et validation */}
            <div className="flex items-center justify-between mb-4">
              {pointage.methodePointage && (
                <div className="flex items-center gap-2 text-xs">
                  <MethodeIcon className={`w-4 h-4 ${themeColors.textSecondary}`} />
                  <span className={themeColors.textSecondary}>{pointage.methodePointage}</span>
                </div>
              )}
              <div className={`
                px-2 py-1 rounded-full text-xs font-semibold
                ${pointage.validation === 'auto' ? 'bg-green-500/20 text-green-400' :
                  pointage.validation === 'validated' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-orange-500/20 text-orange-400'}
              `}>
                {pointage.validation === 'auto' ? 'Auto' :
                 pointage.validation === 'validated' ? 'Validé' : 'En attente'}
              </div>
            </div>

            {/* Commentaire */}
            {pointage.commentaire && (
              <div className="bg-black/20 rounded-lg p-2 mb-4">
                <p className={`text-xs ${themeColors.textSecondary} italic`}>"{pointage.commentaire}"</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {pointage.statut === 'present' && !pointage.heureDepart ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-orange-500 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-1"
                  >
                    <PauseIcon className="w-4 h-4" />
                    Pause
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-red-500 hover:to-pink-500 transition-all shadow-lg flex items-center justify-center gap-1"
                  >
                    <StopIcon className="w-4 h-4" />
                    Fin
                  </motion.button>
                </>
              ) : pointage.statut === 'absent' ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg"
                >
                  Justifier absence
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStartWork(pointage)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg flex items-center justify-center gap-1"
                >
                  <PlayIcon className="w-4 h-4" />
                  Commencer
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header avec horloge temps réel */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-4xl font-bold ${themeColors.textPrimary} mb-2 flex items-center gap-3`}>
              <ClockIcon className="w-10 h-10 text-blue-400" />
              Pointages
              <SparklesIcon className="w-8 h-8 text-yellow-400" />
            </h1>
            <p className={themeColors.textSecondary}>Gestion des présences et temps de travail</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${themeColors.textPrimary} font-mono`}>
              {currentTime.toLocaleTimeString('fr-FR')}
            </div>
            <div className={`text-sm ${themeColors.textSecondary}`}>
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total Employés', value: kpis.totalEmployes, icon: UserGroupIcon, trend: '5', color: 'from-blue-600 to-cyan-500' },
            { label: 'Présents', value: kpis.presents, icon: CheckCircleIcon, trend: `${kpis.tauxPresence}%`, color: 'from-green-600 to-emerald-500' },
            { label: 'Absents', value: kpis.absents, icon: XCircleIcon, trend: '-1', color: 'from-red-600 to-pink-500' },
            { label: 'Retards', value: kpis.retards, icon: ExclamationTriangleIcon, trend: '+1', color: 'from-orange-600 to-amber-500' },
            { label: 'Heures Moyennes', value: `${kpis.heuresMoyennes}h`, icon: ClockIcon, trend: '+0.5h', color: 'from-purple-600 to-indigo-500' },
            { label: 'Taux Présence', value: `${kpis.tauxPresence}%`, icon: ChartBarIcon, trend: '+3%', color: 'from-indigo-600 to-purple-500' }
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
                      kpi.trend.includes('+') ? 'text-green-400' :
                      kpi.trend.includes('-') ? 'text-red-400' :
                      'text-blue-400'
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
            placeholder="Rechercher un employé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} rounded-lg ${themeColors.textPrimary} ${themeColors.textSecondary.replace('text-', 'placeholder-')} focus:outline-none focus:border-white/40`}
          />
        </div>
        
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={`px-4 py-2 ${themeColors.glassBg} backdrop-blur-xl ${themeColors.border} rounded-lg ${themeColors.textPrimary} focus:outline-none focus:border-white/40`}
        />

        <div className="flex gap-2">
          {['all', 'present', 'absent', 'retard'].map(filter => (
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
               filter === 'present' ? 'Présents' :
               filter === 'absent' ? 'Absents' : 'Retards'}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Pointage groupé
        </motion.button>
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
          <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Répartition Présence</h3>
          <Doughnut data={presenceChart} options={{ plugins: { legend: { position: 'bottom', labels: { color: themeColors.chartColors.text } } } }} />
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
          <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Heures Travaillées</h3>
          <Bar data={hoursChart} options={{ 
            plugins: { legend: { position: 'bottom', labels: { color: themeColors.chartColors.text } } },
            scales: { 
              y: { ticks: { color: themeColors.chartColors.text }, grid: { color: 'rgba(255,255,255,0.1)' } },
              x: { ticks: { color: themeColors.chartColors.text }, grid: { color: 'rgba(255,255,255,0.1)' } }
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
          <h3 className={`text-lg font-bold ${themeColors.textPrimary} mb-4`}>Productivité Journée</h3>
          <Line data={productivityChart} options={{ 
            plugins: { legend: { display: false } },
            scales: { 
              y: { ticks: { color: themeColors.chartColors.text }, grid: { color: 'rgba(255,255,255,0.1)' } },
              x: { ticks: { color: themeColors.chartColors.text }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
          }} />
        </motion.div>
      </div>

      {/* Liste des pointages */}
      <div className="grid grid-cols-2 gap-6">
        {pointages
          .filter(p => selectedFilter === 'all' || p.statut === selectedFilter)
          .filter(p => p.employe.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.poste.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(pointage => (
            <PointageCard key={pointage.id} pointage={pointage} />
          ))}
      </div>
    </div>
  );
};

export default PointagesPremium;