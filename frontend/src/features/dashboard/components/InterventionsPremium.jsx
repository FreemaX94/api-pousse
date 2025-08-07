// Interventions Premium - Gestion des Rappels et Échéances 🚀
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WrenchScrewdriverIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  BellAlertIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  TruckIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ExclamationCircleIcon,
  ClipboardDocumentCheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FireIcon,
  ShieldExclamationIcon,
  LightBulbIcon,
  WifiIcon,
  BoltIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  StopCircleIcon,
  ArrowsRightLeftIcon,
  ChatBubbleLeftRightIcon,
  CameraIcon,
  PaperClipIcon,
  FlagIcon,
  TagIcon,
  CogIcon,
  SignalIcon,
  BeakerIcon
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
import confetti from 'canvas-confetti';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Enregistrement des composants Chart.js nécessaires
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

// Composant Timeline des interventions
const InterventionTimeline = ({ interventions }) => {
  const groupedByDate = useMemo(() => {
    const groups = {};
    interventions.forEach(intervention => {
      const date = new Date(intervention.dateEcheance).toLocaleDateString('fr-FR');
      if (!groups[date]) groups[date] = [];
      groups[date].push(intervention);
    });
    return groups;
  }, [interventions]);

  return (
    <div className="relative">
      {/* Ligne de temps verticale avec gradient */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-yellow-500 to-green-500" />
      
      {Object.entries(groupedByDate).map(([date, items], dateIndex) => (
        <motion.div
          key={date}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: dateIndex * 0.1 }}
          className="mb-8"
        >
          {/* Date header */}
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <CalendarDaysIcon className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-white">{date}</h3>
              <p className="text-sm text-gray-400">{items.length} intervention(s)</p>
            </div>
          </div>

          {/* Interventions du jour */}
          <div className="ml-20 space-y-3">
            {items.map((intervention, index) => (
              <motion.div
                key={intervention.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dateIndex * 0.1 + index * 0.05 }}
                whileHover={{ x: 5 }}
                className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {intervention.priorite === 'urgent' && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="p-1 bg-red-500 rounded-full"
                        >
                          <FireIcon className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <h4 className="text-white font-semibold">{intervention.client}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        intervention.statut === 'En retard' ? 'bg-red-500/20 text-red-400' :
                        intervention.statut === 'Aujourd\'hui' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {intervention.statut}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{intervention.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{intervention.adresse}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4" />
                        <span>{intervention.technicien}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{intervention.duree}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions rapides */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-yellow-500/20 rounded-lg hover:bg-yellow-500/30"
                    >
                      <ArrowPathIcon className="w-5 h-5 text-yellow-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30"
                    >
                      <PhoneIcon className="w-5 h-5 text-blue-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Carte d'intervention avec animations ultra-modernes
const InterventionCard = React.forwardRef(({ intervention, onStatusChange, onReschedule, onStart, onComplete }, ref) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const getPriorityConfig = (priorite) => {
    const configs = {
      'urgent': {
        gradient: 'from-red-600 via-orange-500 to-yellow-500',
        glow: 'shadow-red-500/50',
        icon: FireIcon,
        pulse: true,
        label: 'URGENT',
        animation: 'animate-pulse',
        borderColor: 'border-red-500/50'
      },
      'haute': {
        gradient: 'from-yellow-500 via-amber-500 to-orange-500',
        glow: 'shadow-yellow-500/30',
        icon: ExclamationTriangleIcon,
        pulse: false,
        label: 'Haute',
        animation: '',
        borderColor: 'border-yellow-500/30'
      },
      'normale': {
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        glow: 'shadow-blue-500/20',
        icon: ClockIcon,
        pulse: false,
        label: 'Normale',
        animation: '',
        borderColor: 'border-blue-500/20'
      },
      'basse': {
        gradient: 'from-gray-500 via-slate-500 to-zinc-500',
        glow: 'shadow-gray-500/10',
        icon: ArrowDownIcon,
        pulse: false,
        label: 'Basse',
        animation: '',
        borderColor: 'border-gray-500/10'
      }
    };
    return configs[priorite] || configs['normale'];
  };

  const getStatusIndicator = (statut) => {
    const indicators = {
      'En retard': { color: 'bg-red-500', animation: 'animate-ping' },
      'Aujourd\'hui': { color: 'bg-yellow-500', animation: 'animate-pulse' },
      'À venir': { color: 'bg-green-500', animation: '' },
      'En cours': { color: 'bg-blue-500', animation: 'animate-pulse' },
      'Terminé': { color: 'bg-gray-500', animation: '' }
    };
    return indicators[statut] || { color: 'bg-gray-500', animation: '' };
  };

  const priorityConfig = getPriorityConfig(intervention.priorite);
  const statusIndicator = getStatusIndicator(intervention.statut);
  const PriorityIcon = priorityConfig.icon;
  const daysOverdue = Math.ceil((new Date() - new Date(intervention.dateEcheance)) / (1000 * 60 * 60 * 24));
  const isOverdue = daysOverdue > 0;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, rotateY: -180, scale: 0.8 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      exit={{ opacity: 0, rotateY: 180, scale: 0.8 }}
      whileHover={{ 
        y: -8,
        rotateX: 5,
        transition: { duration: 0.3 }
      }}
      className="relative group perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
        {/* Effet de lueur néon pour urgences */}
        {priorityConfig.pulse && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-orange-500/30 to-yellow-500/30 rounded-3xl blur-2xl"
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-yellow-500/20 rounded-3xl blur-xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}

        {/* Badge priorité flottant avec effet 3D */}
        {intervention.priorite === 'urgent' && (
          <motion.div
            className="absolute -top-4 -right-4 z-20"
            animate={{ 
              y: [-2, 2, -2],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-full blur-md opacity-75" />
              <div className="relative bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white text-xs px-4 py-2 rounded-full font-black shadow-2xl flex items-center space-x-1 border border-white/30">
                <FireIcon className="w-4 h-4 animate-pulse" />
                <span className="uppercase tracking-wider">{priorityConfig.label}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Indicateur de statut animé */}
        <div className="absolute top-4 left-4 z-10">
          <div className="relative">
            <div className={`absolute inset-0 ${statusIndicator.color} rounded-full ${statusIndicator.animation} opacity-75`} />
            <div className={`relative w-3 h-3 ${statusIndicator.color} rounded-full`} />
          </div>
        </div>

        <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border-2 ${priorityConfig.borderColor} hover:border-purple-500/50 transition-all overflow-hidden shadow-2xl ${priorityConfig.glow} hover:shadow-purple-500/30`}>
          {/* Bande de gradient en haut */}
          <div className={`h-1 bg-gradient-to-r ${priorityConfig.gradient} ${priorityConfig.animation}`} />
          
          {/* Header avec statut */}
          <div className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${priorityConfig.gradient} rounded-2xl blur-lg opacity-50`} />
                  <div className={`relative p-3 bg-gradient-to-br ${priorityConfig.gradient} rounded-2xl text-white shadow-xl border border-white/20`}>
                    <PriorityIcon className="w-6 h-6" />
                  </div>
                </motion.div>
                <div>
                  <p className="text-xs text-gray-400 font-mono">#{intervention.numero}</p>
                  <p className="text-sm font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {intervention.type}
                  </p>
                </div>
              </div>

              {/* Indicateur de retard */}
              {isOverdue && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 rounded-full"
                >
                  <ExclamationCircleIcon className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400 font-medium">
                    {daysOverdue}j de retard
                  </span>
                </motion.div>
              )}
            </div>

            {/* Informations client avec effet glassmorphism */}
            <div className="mb-4 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BuildingOfficeIcon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white flex-1">{intervention.client}</h3>
                {intervention.clientVIP && (
                  <motion.span 
                    className="px-3 py-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white text-xs rounded-full font-bold shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⭐ VIP
                  </motion.span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPinIcon className="w-4 h-4" />
                <span>{intervention.adresse}</span>
              </div>
            </div>

            {/* Description de l'intervention avec style moderne */}
            <div className="mb-4 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-start space-x-2">
                <div className="p-1 bg-blue-500/20 rounded-lg mt-0.5">
                  <DocumentTextIcon className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed flex-1">{intervention.description}</p>
              </div>
            </div>

            {/* Informations techniques */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Technicien</p>
                  <p className="text-sm text-white">{intervention.technicien || 'Non assigné'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Durée estimée</p>
                  <p className="text-sm text-white">{intervention.duree}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Date prévue</p>
                  <p className="text-sm text-white">{new Date(intervention.dateEcheance).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="text-sm text-white">{intervention.telephone || 'Non renseigné'}</p>
                </div>
              </div>
            </div>

            {/* Barre de progression avec effets avancés */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 flex items-center space-x-1">
                  <ChartBarIcon className="w-3 h-3" />
                  <span>Progression</span>
                </span>
                <motion.span 
                  className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {intervention.progression}%
                </motion.span>
              </div>
              <div className="relative h-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-400 shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${intervention.progression}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </motion.div>
                {/* Points de milestone */}
                {[25, 50, 75].map((milestone) => (
                  <div
                    key={milestone}
                    className={`absolute top-0 w-0.5 h-full bg-white/20 ${intervention.progression >= milestone ? 'opacity-100' : 'opacity-50'}`}
                    style={{ left: `${milestone}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {intervention.statut !== 'Terminé' && (
                <>
                  {intervention.statut === 'Non commencé' ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onStart(intervention)}
                      className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <PlayCircleIcon className="w-4 h-4" />
                      <span>Démarrer</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onComplete(intervention)}
                      className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Terminer</span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReschedule(intervention)}
                    className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Replanifier</span>
                  </motion.button>
                </>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
              >
                <PhoneIcon className="w-4 h-4" />
                <span>Appeler</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Détails</span>
              </motion.button>
            </div>
          </div>

          {/* Footer avec tags et infos supplémentaires */}
          <div className="px-6 py-3 bg-white/5 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {intervention.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                {intervention.hasPhotos && <CameraIcon className="w-4 h-4 text-gray-400" />}
                {intervention.hasDocuments && <PaperClipIcon className="w-4 h-4 text-gray-400" />}
                {intervention.hasNotes && <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
          </div>
        </div>
    </motion.div>
  );
});

// Ajout du displayName pour le débogage
InterventionCard.displayName = 'InterventionCard';

// Composant de statistiques des interventions
const InterventionsStats = ({ interventions }) => {
  const stats = useMemo(() => {
    const total = interventions.length;
    const enRetard = interventions.filter(i => i.statut === 'En retard').length;
    const aujourdhui = interventions.filter(i => i.statut === 'Aujourd\'hui').length;
    const aCommen = interventions.filter(i => i.statut === 'À venir').length;
    const urgentes = interventions.filter(i => i.priorite === 'urgent').length;
    const moyenneRetard = enRetard > 0 ? 
      Math.round(interventions.filter(i => i.statut === 'En retard')
        .reduce((acc, i) => acc + Math.ceil((new Date() - new Date(i.dateEcheance)) / (1000 * 60 * 60 * 24)), 0) / enRetard) : 0;
    
    return {
      total,
      enRetard,
      aujourdhui,
      aVenir: aCommen,
      urgentes,
      moyenneRetard,
      tauxRetard: total > 0 ? (enRetard / total * 100).toFixed(1) : 0
    };
  }, [interventions]);

  // Données pour le graphique radar
  const radarData = {
    labels: ['En retard', 'Urgent', 'Aujourd\'hui', 'Planifié', 'En cours', 'Terminé'],
    datasets: [{
      label: 'Interventions',
      data: [stats.enRetard, stats.urgentes, stats.aujourdhui, stats.aVenir, 8, 45],
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgb(147, 51, 234)',
      pointBackgroundColor: 'rgb(147, 51, 234)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(147, 51, 234)'
    }]
  };

  const kpis = [
    {
      label: 'En retard',
      value: stats.enRetard,
      subValue: `${stats.moyenneRetard}j moy.`,
      icon: ExclamationCircleIcon,
      color: 'from-red-500 to-rose-500',
      trend: '+15%',
      alert: true
    },
    {
      label: 'Aujourd\'hui',
      value: stats.aujourdhui,
      subValue: '8h-20h',
      icon: CalendarDaysIcon,
      color: 'from-yellow-500 to-amber-500',
      trend: '+5%'
    },
    {
      label: 'Urgentes',
      value: stats.urgentes,
      subValue: 'À traiter',
      icon: FireIcon,
      color: 'from-orange-500 to-red-500',
      trend: '+25%',
      alert: true
    },
    {
      label: 'À venir',
      value: stats.aVenir,
      subValue: 'Cette semaine',
      icon: ClockIcon,
      color: 'from-blue-500 to-indigo-500',
      trend: '-10%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs avec alertes visuelles */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Alerte visuelle */}
            {kpi.alert && (
              <motion.div
                className="absolute -top-2 -right-2 z-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </motion.div>
            )}
            
            <div className={`relative bg-gradient-to-br ${kpi.color.replace('from-', 'from-').replace('to-', '/20 to-')}/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${kpi.color} rounded-xl`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs font-medium ${
                  kpi.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'
                }`}>
                  {kpi.trend}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-1">{kpi.label}</p>
              <p className="text-3xl font-bold text-white">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.subValue}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphique radar des interventions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Vue d'ensemble des interventions</h3>
        <div className="h-64">
          <Radar data={radarData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              r: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.6)' },
                pointLabels: { color: 'rgba(255, 255, 255, 0.8)' }
              }
            }
          }} />
        </div>
      </motion.div>
    </div>
  );
};

// Composant principal
const InterventionsPremium = ({ themeColors }) => {
  const [interventions, setInterventions] = useState([
    {
      id: '1',
      numero: 'INT-2025-001',
      type: 'Maintenance préventive',
      client: 'Crystal Tech Solutions',
      clientVIP: true,
      adresse: '15 Avenue des Champs, Paris',
      telephone: '01 23 45 67 89',
      technicien: 'Jean Dupont',
      dateEcheance: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      duree: '2h30',
      statut: 'En retard',
      priorite: 'urgent',
      progression: 0,
      description: 'Vérification complète du système de climatisation et remplacement des filtres',
      tags: ['Climatisation', 'Urgent'],
      hasPhotos: true,
      hasDocuments: true,
      hasNotes: false
    },
    {
      id: '2',
      numero: 'INT-2025-002',
      type: 'Dépannage',
      client: 'Green Energy Corp',
      clientVIP: false,
      adresse: '28 Rue de la République, Lyon',
      telephone: '04 78 90 12 34',
      technicien: 'Marie Martin',
      dateEcheance: new Date(),
      duree: '1h30',
      statut: 'Aujourd\'hui',
      priorite: 'haute',
      progression: 25,
      description: 'Panne électrique sur l\'installation principale',
      tags: ['Électricité', 'Dépannage'],
      hasPhotos: false,
      hasDocuments: true,
      hasNotes: true
    },
    {
      id: '3',
      numero: 'INT-2025-003',
      type: 'Installation',
      client: 'Digital Innovation Lab',
      clientVIP: false,
      adresse: '42 Boulevard Haussmann, Paris',
      telephone: '01 45 67 89 01',
      technicien: 'Pierre Bernard',
      dateEcheance: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      duree: '4h',
      statut: 'En retard',
      priorite: 'normale',
      progression: 75,
      description: 'Installation du nouveau système de sécurité',
      tags: ['Sécurité', 'Installation'],
      hasPhotos: true,
      hasDocuments: false,
      hasNotes: true
    },
    {
      id: '4',
      numero: 'INT-2025-004',
      type: 'Contrôle annuel',
      client: 'Luxury Hotels Group',
      clientVIP: true,
      adresse: '10 Place Vendôme, Paris',
      telephone: '01 42 86 82 00',
      technicien: null,
      dateEcheance: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duree: '3h',
      statut: 'À venir',
      priorite: 'normale',
      progression: 0,
      description: 'Contrôle annuel des installations de plomberie',
      tags: ['Plomberie', 'Contrôle'],
      hasPhotos: false,
      hasDocuments: false,
      hasNotes: false
    },
    {
      id: '5',
      numero: 'INT-2025-005',
      type: 'Urgence',
      client: 'Smart City Solutions',
      clientVIP: false,
      adresse: '5 Rue de Rivoli, Paris',
      telephone: '01 44 55 66 77',
      technicien: 'Sophie Leroy',
      dateEcheance: new Date(),
      duree: '1h',
      statut: 'Aujourd\'hui',
      priorite: 'urgent',
      progression: 50,
      description: 'Fuite d\'eau importante au 3ème étage',
      tags: ['Urgence', 'Plomberie'],
      hasPhotos: true,
      hasDocuments: false,
      hasNotes: true
    }
  ]);

  const [viewMode, setViewMode] = useState('cards'); // cards, timeline, calendar, kanban
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Filtrage et tri
  const filteredInterventions = useMemo(() => {
    let filtered = [...interventions];

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(i =>
        i.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(i => i.statut === filterStatus);
    }

    // Filtre par priorité
    if (filterPriority !== 'all') {
      filtered = filtered.filter(i => i.priorite === filterPriority);
    }

    // Tri par priorité et date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 0, haute: 1, normale: 2, basse: 3 };
      if (priorityOrder[a.priorite] !== priorityOrder[b.priorite]) {
        return priorityOrder[a.priorite] - priorityOrder[b.priorite];
      }
      return new Date(a.dateEcheance) - new Date(b.dateEcheance);
    });

    return filtered;
  }, [interventions, searchTerm, filterStatus, filterPriority]);

  const handleStart = (intervention) => {
    setInterventions(prev => prev.map(i =>
      i.id === intervention.id
        ? { ...i, statut: 'En cours', progression: 10 }
        : i
    ));
  };

  const handleComplete = (intervention) => {
    setInterventions(prev => prev.map(i =>
      i.id === intervention.id
        ? { ...i, statut: 'Terminé', progression: 100 }
        : i
    ));
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleReschedule = (intervention) => {
    // Ouvrir modal de replanification
    console.log('Replanifier:', intervention);
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
            <WrenchScrewdriverIcon className="w-8 h-8 text-orange-400" />
            <span>Interventions Premium</span>
            <motion.span
              className="ml-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              RAPPELS ACTIFS
            </motion.span>
          </h1>
          <p className="text-gray-400 mt-1">Gestion intelligente des échéances et rappels automatiques</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bouton urgence */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg flex items-center space-x-2"
          >
            <ShieldExclamationIcon className="w-5 h-5" />
            <span>Urgence</span>
          </motion.button>

          {/* Bouton planning */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCalendar(!showCalendar)}
            className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg flex items-center space-x-2"
          >
            <CalendarDaysIcon className="w-5 h-5" />
            <span>Planning</span>
          </motion.button>

          {/* Bouton nouvelle intervention */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg flex items-center space-x-2"
          >
            <BoltIcon className="w-5 h-5" />
            <span>Nouvelle intervention</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <InterventionsStats interventions={interventions} />

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
              placeholder="Rechercher une intervention, client, adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Filtres et vues */}
          <div className="flex items-center space-x-3">
            {/* Filtre statut */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="En retard">En retard</option>
              <option value="Aujourd'hui">Aujourd'hui</option>
              <option value="À venir">À venir</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>

            {/* Filtre priorité */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Toutes priorités</option>
              <option value="urgent">Urgent</option>
              <option value="haute">Haute</option>
              <option value="normale">Normale</option>
              <option value="basse">Basse</option>
            </select>

            {/* Sélecteur de vue */}
            <div className="flex bg-white/10 rounded-lg p-1">
              {['cards', 'timeline', 'kanban'].map((mode) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode === 'cards' && 'Cartes'}
                  {mode === 'timeline' && 'Timeline'}
                  {mode === 'kanban' && 'Kanban'}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calendrier (si activé) */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="react-calendar-premium"
              tileClassName={({ date }) => {
                const hasIntervention = interventions.some(i =>
                  new Date(i.dateEcheance).toDateString() === date.toDateString()
                );
                return hasIntervention ? 'has-intervention' : null;
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Affichage selon le mode de vue */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredInterventions.map((intervention) => (
              <InterventionCard
                key={intervention.id}
                intervention={intervention}
                onStatusChange={() => {}}
                onReschedule={handleReschedule}
                onStart={handleStart}
                onComplete={handleComplete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {viewMode === 'timeline' && (
        <InterventionTimeline interventions={filteredInterventions} />
      )}

      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {['En retard', 'Aujourd\'hui', 'À venir', 'En cours'].map((status) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
                <span>{status}</span>
                <span className="text-sm text-gray-400">
                  {filteredInterventions.filter(i => i.statut === status).length}
                </span>
              </h3>
              <div className="space-y-3">
                {filteredInterventions
                  .filter(i => i.statut === status)
                  .map((intervention) => (
                    <motion.div
                      key={intervention.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{intervention.client}</span>
                        {intervention.priorite === 'urgent' && (
                          <FireIcon className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{intervention.type}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{intervention.technicien || 'Non assigné'}</span>
                        <span className="text-xs text-gray-500">{intervention.duree}</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message si aucun résultat */}
      {filteredInterventions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <WrenchScrewdriverIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucune intervention trouvée</h3>
          <p className="text-gray-400">Modifiez vos filtres ou créez une nouvelle intervention</p>
        </motion.div>
      )}
    </div>
  );
};

export default InterventionsPremium;