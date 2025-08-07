// Demandes Client Premium - Gestion Intelligente des Tickets 🎫
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useDragControls } from 'framer-motion';
import {
  TicketIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  BellAlertIcon,
  FireIcon,
  SparklesIcon,
  BoltIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  FlagIcon,
  TagIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PaperClipIcon,
  PhotoIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  WifiIcon,
  SignalIcon,
  BugAntIcon,
  WrenchScrewdriverIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  ChatBubbleBottomCenterTextIcon,
  PlusIcon,
  MinusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArchiveBoxIcon,
  InboxIcon,
  FolderIcon,
  StarIcon,
  BookmarkIcon,
  ShareIcon,
  PrinterIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
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

// Enregistrement des composants Chart.js
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

// Composant de carte de ticket ultra-moderne avec effets 3D
const TicketCard = ({ ticket, onOpen, onAssign, onResolve, onEscalate, onArchive }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [satisfaction, setSatisfaction] = useState(null);
  const dragControls = useDragControls();

  const getPriorityConfig = (priority) => {
    const configs = {
      'critique': {
        gradient: 'from-red-600 via-red-500 to-orange-500',
        icon: FireIcon,
        label: 'CRITIQUE',
        glow: 'shadow-red-500/50',
        pulse: true,
        borderColor: 'border-red-500/50',
        bgPattern: 'bg-gradient-to-br from-red-900/20 to-orange-900/20'
      },
      'haute': {
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        icon: ExclamationTriangleIcon,
        label: 'Haute',
        glow: 'shadow-orange-500/30',
        pulse: false,
        borderColor: 'border-orange-500/30',
        bgPattern: 'bg-gradient-to-br from-orange-900/20 to-yellow-900/20'
      },
      'normale': {
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        icon: ClockIcon,
        label: 'Normale',
        glow: 'shadow-blue-500/20',
        pulse: false,
        borderColor: 'border-blue-500/20',
        bgPattern: 'bg-gradient-to-br from-blue-900/20 to-purple-900/20'
      },
      'basse': {
        gradient: 'from-gray-500 via-slate-500 to-zinc-500',
        icon: ArrowDownIcon,
        label: 'Basse',
        glow: 'shadow-gray-500/10',
        pulse: false,
        borderColor: 'border-gray-500/10',
        bgPattern: 'bg-gradient-to-br from-gray-900/20 to-zinc-900/20'
      }
    };
    return configs[priority] || configs['normale'];
  };

  const getStatusConfig = (status) => {
    const configs = {
      'nouveau': { color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: SparklesIcon },
      'en_cours': { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: ArrowPathIcon },
      'en_attente': { color: 'text-orange-400', bgColor: 'bg-orange-500/20', icon: ClockIcon },
      'resolu': { color: 'text-green-400', bgColor: 'bg-green-500/20', icon: CheckCircleIcon },
      'ferme': { color: 'text-gray-400', bgColor: 'bg-gray-500/20', icon: XCircleIcon }
    };
    return configs[status] || configs['nouveau'];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'bug': BugAntIcon,
      'feature': LightBulbIcon,
      'support': QuestionMarkCircleIcon,
      'maintenance': WrenchScrewdriverIcon,
      'urgence': FireIcon,
      'information': ChatBubbleLeftRightIcon
    };
    return icons[category] || ChatBubbleLeftRightIcon;
  };

  const priorityConfig = getPriorityConfig(ticket.priorite);
  const statusConfig = getStatusConfig(ticket.statut);
  const PriorityIcon = priorityConfig.icon;
  const StatusIcon = statusConfig.icon;
  const CategoryIcon = getCategoryIcon(ticket.categorie);
  
  const responseTime = Math.floor((new Date() - new Date(ticket.dateCreation)) / (1000 * 60 * 60));
  const isOverdue = responseTime > ticket.sla;

  return (
    <motion.div
      layout
      drag
      dragControls={dragControls}
      dragListener={false}
      dragElastic={0.2}
      initial={{ opacity: 0, rotateX: -20, scale: 0.8 }}
      animate={{ opacity: 1, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, rotateX: 20, scale: 0.8 }}
      whileHover={{ 
        y: -8,
        rotateY: 3,
        transition: { duration: 0.3 }
      }}
      className="relative group perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Effet de lueur néon pour priorité critique */}
      {priorityConfig.pulse && (
        <>
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${priorityConfig.gradient} rounded-3xl blur-3xl opacity-20`}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </>
      )}

      {/* Badge priorité flottant 3D */}
      {ticket.priorite === 'critique' && (
        <motion.div
          className="absolute -top-4 -right-4 z-20"
          animate={{ 
            y: [-3, 3, -3],
            rotateZ: [-5, 5, -5]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-lg opacity-75 animate-pulse" />
            <div className="relative px-4 py-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white text-xs rounded-full font-black shadow-2xl border-2 border-white/30 flex items-center space-x-1">
              <FireIcon className="w-4 h-4 animate-pulse" />
              <span className="uppercase tracking-wider">{priorityConfig.label}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Indicateur SLA */}
      {isOverdue && (
        <div className="absolute top-4 left-4 z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="relative"
          >
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
            <div className="relative w-3 h-3 bg-red-500 rounded-full" />
          </motion.div>
        </div>
      )}

      <div className={`relative ${priorityConfig.bgPattern} backdrop-blur-xl rounded-3xl border-2 ${priorityConfig.borderColor} hover:border-purple-500/50 transition-all overflow-hidden shadow-2xl ${priorityConfig.glow} hover:shadow-purple-500/30`}>
        {/* Bande de gradient supérieure animée */}
        <motion.div 
          className={`h-1.5 bg-gradient-to-r ${priorityConfig.gradient}`}
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{ backgroundSize: '200% 100%' }}
        />
        
        {/* En-tête avec numéro et statut */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Icône de catégorie avec effet 3D */}
              <motion.div
                className="relative"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                onPointerDownCapture={(e) => dragControls.start(e)}
                style={{ cursor: 'grab' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${priorityConfig.gradient} rounded-2xl blur-lg opacity-50`} />
                <div className={`relative p-3 bg-gradient-to-br ${priorityConfig.gradient} rounded-2xl text-white shadow-xl border border-white/20`}>
                  <CategoryIcon className="w-6 h-6" />
                </div>
              </motion.div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-400 font-mono">#{ticket.numero}</p>
                  <span className={`px-2 py-0.5 ${statusConfig.bgColor} ${statusConfig.color} text-xs rounded-full font-medium flex items-center space-x-1`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{ticket.statut.replace('_', ' ')}</span>
                  </span>
                </div>
                <p className="text-sm font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {ticket.categorie.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Timer SLA */}
            <div className="text-right">
              <p className="text-xs text-gray-400">Temps de réponse</p>
              <p className={`text-lg font-bold ${isOverdue ? 'text-red-400' : 'text-green-400'}`}>
                {responseTime}h / {ticket.sla}h
              </p>
            </div>
          </div>

          {/* Titre du ticket */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
            {ticket.titre}
          </h3>

          {/* Informations client avec glassmorphism */}
          <div className="mb-4 p-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <UserIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{ticket.client}</p>
                  <p className="text-xs text-gray-400">{ticket.contact}</p>
                </div>
              </div>
              {ticket.vip && (
                <motion.span 
                  className="px-3 py-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white text-xs rounded-full font-bold shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⭐ VIP
                </motion.span>
              )}
            </div>
            
            {/* Coordonnées */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <PhoneIcon className="w-3 h-3" />
                <span>{ticket.telephone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <EnvelopeIcon className="w-3 h-3" />
                <span className="truncate">{ticket.email}</span>
              </div>
            </div>
          </div>

          {/* Description (expandable) */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : '60px' }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              {ticket.description}
            </p>
          </motion.div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-purple-400 hover:text-purple-300 mb-4"
          >
            {isExpanded ? 'Voir moins' : 'Voir plus'}
          </button>

          {/* Tags et métadonnées */}
          <div className="flex items-center space-x-2 mb-4">
            {ticket.tags?.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Pièces jointes */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mb-4 flex items-center space-x-2">
              <PaperClipIcon className="w-4 h-4 text-gray-400" />
              <div className="flex space-x-1">
                {ticket.attachments.map((attachment, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    className="p-1.5 bg-white/10 rounded-lg"
                  >
                    {attachment.type === 'image' && <PhotoIcon className="w-4 h-4 text-green-400" />}
                    {attachment.type === 'document' && <DocumentTextIcon className="w-4 h-4 text-blue-400" />}
                    {attachment.type === 'video' && <VideoCameraIcon className="w-4 h-4 text-red-400" />}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Agent assigné */}
          {ticket.agent && (
            <div className="mb-4 p-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {ticket.agent.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Agent assigné</p>
                    <p className="text-sm text-white font-medium">{ticket.agent}</p>
                  </div>
                </div>
                <div className="text-xs text-green-400">En traitement</div>
              </div>
            </div>
          )}

          {/* Barre de satisfaction */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Satisfaction client</p>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSatisfaction(level)}
                  className={`p-2 rounded-lg transition-all ${
                    satisfaction >= level 
                      ? 'bg-yellow-500/30 text-yellow-400' 
                      : 'bg-white/10 text-gray-500 hover:bg-white/20'
                  }`}
                >
                  <StarIcon className="w-4 h-4" fill={satisfaction >= level ? 'currentColor' : 'none'} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Actions rapides avec animations */}
          <div className="grid grid-cols-2 gap-2">
            {ticket.statut !== 'resolu' && ticket.statut !== 'ferme' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onResolve(ticket)}
                  className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Résoudre</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEscalate(ticket)}
                  className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                  <span>Escalader</span>
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpen(ticket)}
              className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
            >
              <EyeIcon className="w-4 h-4" />
              <span>Ouvrir</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAssign(ticket)}
              className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
            >
              <UserIcon className="w-4 h-4" />
              <span>Assigner</span>
            </motion.button>
          </div>
        </div>

        {/* Footer avec timeline */}
        <div className="px-6 py-3 bg-gradient-to-r from-white/5 to-white/10 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3 text-gray-400">
              <span className="flex items-center space-x-1">
                <CalendarDaysIcon className="w-3 h-3" />
                <span>{new Date(ticket.dateCreation).toLocaleDateString('fr-FR')}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ClockIcon className="w-3 h-3" />
                <span>{new Date(ticket.dateCreation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {ticket.resolutions > 0 && (
                <span className="text-green-400">
                  {ticket.resolutions} résolution(s)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant de statistiques des tickets
const TicketsStats = ({ tickets }) => {
  const stats = useMemo(() => {
    const total = tickets.length;
    const nouveaux = tickets.filter(t => t.statut === 'nouveau').length;
    const enCours = tickets.filter(t => t.statut === 'en_cours').length;
    const resolus = tickets.filter(t => t.statut === 'resolu').length;
    const critiques = tickets.filter(t => t.priorite === 'critique').length;
    
    const tempsResolutionMoyen = tickets
      .filter(t => t.statut === 'resolu')
      .reduce((acc, t) => acc + t.tempsResolution, 0) / (resolus || 1);
    
    const tauxResolution = total > 0 ? (resolus / total * 100).toFixed(1) : 0;
    const tauxSatisfaction = tickets
      .filter(t => t.satisfaction)
      .reduce((acc, t) => acc + t.satisfaction, 0) / (tickets.filter(t => t.satisfaction).length || 1);

    return {
      total,
      nouveaux,
      enCours,
      resolus,
      critiques,
      tempsResolutionMoyen: Math.round(tempsResolutionMoyen),
      tauxResolution,
      tauxSatisfaction: tauxSatisfaction.toFixed(1)
    };
  }, [tickets]);

  // Données pour le graphique polar
  const polarData = {
    labels: ['Nouveaux', 'En cours', 'En attente', 'Résolus', 'Fermés'],
    datasets: [{
      data: [
        stats.nouveaux,
        stats.enCours,
        tickets.filter(t => t.statut === 'en_attente').length,
        stats.resolus,
        tickets.filter(t => t.statut === 'ferme').length
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(250, 204, 21, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const kpis = [
    {
      label: 'Total tickets',
      value: stats.total,
      icon: TicketIcon,
      gradient: 'from-blue-500 to-indigo-500',
      trend: '+15%',
      subValue: 'Ce mois'
    },
    {
      label: 'Tickets critiques',
      value: stats.critiques,
      icon: FireIcon,
      gradient: 'from-red-500 to-orange-500',
      trend: '+8%',
      subValue: 'À traiter',
      alert: stats.critiques > 0
    },
    {
      label: 'Taux résolution',
      value: `${stats.tauxResolution}%`,
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-emerald-500',
      trend: '+12%',
      subValue: `~${stats.tempsResolutionMoyen}h moy.`
    },
    {
      label: 'Satisfaction',
      value: `${stats.tauxSatisfaction}/5`,
      icon: StarIcon,
      gradient: 'from-yellow-500 to-amber-500',
      trend: '+3%',
      subValue: 'Score moyen'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {kpi.alert && (
              <motion.div
                className="absolute -top-2 -right-2 z-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
              </motion.div>
            )}
            
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${kpi.gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />
              <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className={`p-3 bg-gradient-to-r ${kpi.gradient} rounded-xl shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <kpi.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className={`text-xs font-medium ${
                    kpi.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-white">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.subValue}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphique polaire */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Répartition des tickets</h3>
        <div className="h-64">
          <PolarArea data={polarData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { color: '#fff' } } }
          }} />
        </div>
      </motion.div>
    </div>
  );
};

// Composant principal
const DemandesClientPremium = ({ themeColors }) => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      numero: 'TIC-2025-001',
      titre: 'Système de climatisation en panne - Urgent',
      description: 'Le système de climatisation du bâtiment principal ne fonctionne plus depuis ce matin. La température monte rapidement et affecte le travail des employés. Intervention urgente requise.',
      categorie: 'urgence',
      priorite: 'critique',
      statut: 'nouveau',
      client: 'Crystal Tech Solutions',
      contact: 'Jean Dupont',
      telephone: '01 23 45 67 89',
      email: 'jean.dupont@crystaltech.fr',
      vip: true,
      dateCreation: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sla: 4,
      agent: null,
      tags: ['climatisation', 'urgent', 'batiment-principal'],
      attachments: [
        { type: 'image', name: 'photo1.jpg' },
        { type: 'document', name: 'rapport.pdf' }
      ],
      tempsResolution: 0,
      satisfaction: null,
      resolutions: 0
    },
    {
      id: 2,
      numero: 'TIC-2025-002',
      titre: 'Demande d\'amélioration interface utilisateur',
      description: 'Nous aimerions avoir une interface plus moderne avec des animations et un meilleur design pour notre tableau de bord.',
      categorie: 'feature',
      priorite: 'normale',
      statut: 'en_cours',
      client: 'Green Energy Corp',
      contact: 'Marie Martin',
      telephone: '04 78 90 12 34',
      email: 'marie.martin@greenenergy.fr',
      vip: false,
      dateCreation: new Date(Date.now() - 24 * 60 * 60 * 1000),
      sla: 48,
      agent: 'Sophie Laurent',
      tags: ['ui', 'design', 'amélioration'],
      attachments: [],
      tempsResolution: 0,
      satisfaction: null,
      resolutions: 1
    },
    {
      id: 3,
      numero: 'TIC-2025-003',
      titre: 'Problème de connexion au serveur',
      description: 'Impossible de se connecter au serveur depuis plusieurs postes. Message d\'erreur: "Connection timeout".',
      categorie: 'bug',
      priorite: 'haute',
      statut: 'en_attente',
      client: 'Digital Innovation Lab',
      contact: 'Pierre Bernard',
      telephone: '01 45 67 89 01',
      email: 'pierre.bernard@digilab.fr',
      vip: false,
      dateCreation: new Date(Date.now() - 6 * 60 * 60 * 1000),
      sla: 8,
      agent: 'Thomas Petit',
      tags: ['réseau', 'serveur', 'connexion'],
      attachments: [
        { type: 'image', name: 'screenshot.png' }
      ],
      tempsResolution: 0,
      satisfaction: null,
      resolutions: 2
    },
    {
      id: 4,
      numero: 'TIC-2025-004',
      titre: 'Formation équipe sur nouveau logiciel',
      description: 'Demande de formation pour l\'équipe sur le nouveau logiciel de gestion installé la semaine dernière.',
      categorie: 'support',
      priorite: 'basse',
      statut: 'resolu',
      client: 'Luxury Hotels Group',
      contact: 'Lucie Moreau',
      telephone: '01 42 86 82 00',
      email: 'lucie.moreau@luxuryhotels.fr',
      vip: true,
      dateCreation: new Date(Date.now() - 72 * 60 * 60 * 1000),
      sla: 96,
      agent: 'Alexandre Roux',
      tags: ['formation', 'logiciel', 'équipe'],
      attachments: [],
      tempsResolution: 48,
      satisfaction: 5,
      resolutions: 1
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');

  // Filtrage et tri
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtres
    if (filterPriority !== 'all') {
      filtered = filtered.filter(t => t.priorite === filterPriority);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.statut === filterStatus);
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.categorie === filterCategory);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateCreation) - new Date(a.dateCreation);
        case 'priority':
          const priorityOrder = { critique: 0, haute: 1, normale: 2, basse: 3 };
          return priorityOrder[a.priorite] - priorityOrder[b.priorite];
        case 'client':
          return a.client.localeCompare(b.client);
        case 'status':
          return a.statut.localeCompare(b.statut);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tickets, searchTerm, filterPriority, filterStatus, filterCategory, sortBy]);

  const handleResolve = (ticket) => {
    setTickets(prev => prev.map(t =>
      t.id === ticket.id ? { ...t, statut: 'resolu', tempsResolution: Math.floor((new Date() - new Date(t.dateCreation)) / (1000 * 60 * 60)) } : t
    ));
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleEscalate = (ticket) => {
    setTickets(prev => prev.map(t =>
      t.id === ticket.id ? { ...t, priorite: 'critique' } : t
    ));
  };

  const handleOpen = (ticket) => {
    console.log('Ouvrir ticket:', ticket);
  };

  const handleAssign = (ticket) => {
    console.log('Assigner ticket:', ticket);
  };

  const handleArchive = (ticket) => {
    console.log('Archiver ticket:', ticket);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
            <TicketIcon className="w-8 h-8 text-purple-400" />
            <span>Demandes Client Premium</span>
            <motion.span
              className="ml-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AI POWERED
            </motion.span>
          </h1>
          <p className="text-gray-400 mt-1">Centre de support intelligent avec IA et automatisation</p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center space-x-2"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>IA Assistant</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nouveau ticket</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <TicketsStats tickets={tickets} />

      {/* Barre de recherche et filtres */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un ticket, client, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Toutes priorités</option>
              <option value="critique">Critique</option>
              <option value="haute">Haute</option>
              <option value="normale">Normale</option>
              <option value="basse">Basse</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Tous statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="en_cours">En cours</option>
              <option value="en_attente">En attente</option>
              <option value="resolu">Résolu</option>
              <option value="ferme">Fermé</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="support">Support</option>
              <option value="maintenance">Maintenance</option>
              <option value="urgence">Urgence</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Liste des tickets */}
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        <AnimatePresence mode="popLayout">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onOpen={handleOpen}
              onAssign={handleAssign}
              onResolve={handleResolve}
              onEscalate={handleEscalate}
              onArchive={handleArchive}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DemandesClientPremium;