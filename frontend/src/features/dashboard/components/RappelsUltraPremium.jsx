import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  BellIcon,
  BellAlertIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
  InboxStackIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  QueueListIcon,
  ArrowTrendingUpIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';
import { toast } from 'react-hot-toast';
import { format, addDays, subDays, isAfter, isBefore, differenceInDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../../../api/clientApi';
import confetti from 'canvas-confetti';

const RappelsUltraPremium = () => {
  const { theme, getClasses, currentTheme } = useThemeUltraPremium();
  const [activeTab, setActiveTab] = useState('Tous');
  const [loading, setLoading] = useState(false);
  const [rappels, setRappels] = useState([]);
  const [selectedRappel, setSelectedRappel] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoMode, setAutoMode] = useState(true);
  const wsRef = useRef(null);

  // Configuration des seuils
  const [seuilsConfig, setSeuilsConfig] = useState({
    devis: { 
      delai: 7, 
      enabled: true, 
      priorite: 'haute',
      actions: ['email', 'notification'],
      escalade: { niveau1: 7, niveau2: 14, niveau3: 30 }
    },
    factures: { 
      delai: 30, 
      enabled: true, 
      priorite: 'critique',
      actions: ['email', 'sms', 'notification'],
      escalade: { niveau1: 30, niveau2: 45, niveau3: 60 }
    },
    interventions: { 
      delai: 1, 
      enabled: true, 
      priorite: 'normale',
      actions: ['notification'],
      escalade: { niveau1: 1, niveau2: 3, niveau3: 7 }
    },
    contrats: { 
      delai: 60, 
      enabled: true, 
      priorite: 'haute',
      actions: ['email', 'notification'],
      escalade: { niveau1: 60, niveau2: 30, niveau3: 15 }
    },
    pointages: { 
      delai: 0, 
      enabled: true, 
      priorite: 'immediate',
      actions: ['notification', 'sms'],
      escalade: { niveau1: 0, niveau2: 1, niveau3: 2 }
    }
  });

  // Templates de messages
  const [messageTemplates, setMessageTemplates] = useState([
    {
      id: 1,
      name: 'Rappel Facture Impayée',
      type: 'factures',
      channel: 'email',
      subject: 'Rappel: Facture {numero} en attente de paiement',
      body: `Bonjour {client_name},

Nous vous rappelons que la facture n°{numero} d'un montant de {montant}€ 
émise le {date_emission} est toujours en attente de paiement.

Échéance dépassée de {jours_retard} jours.

Merci de procéder au règlement dans les plus brefs délais.

Cordialement,
L'équipe comptabilité`,
      variables: ['client_name', 'numero', 'montant', 'date_emission', 'jours_retard'],
      active: true
    },
    {
      id: 2,
      name: 'Relance Devis',
      type: 'devis',
      channel: 'email',
      subject: 'Votre devis {numero} expire bientôt',
      body: `Bonjour {client_name},

Le devis n°{numero} que nous vous avons transmis le {date_envoi} 
arrive à expiration dans {jours_restants} jours.

Montant: {montant}€ TTC

N'hésitez pas à nous contacter pour toute question.

Cordialement`,
      variables: ['client_name', 'numero', 'date_envoi', 'jours_restants', 'montant'],
      active: true
    },
    {
      id: 3,
      name: 'SMS Intervention',
      type: 'interventions',
      channel: 'sms',
      subject: '',
      body: 'Rappel: Intervention prévue demain à {heure} - {adresse}. Répondez STOP pour annuler.',
      variables: ['heure', 'adresse'],
      active: true
    },
    {
      id: 4,
      name: 'Notification Contrat',
      type: 'contrats',
      channel: 'notification',
      subject: 'Renouvellement de contrat',
      body: 'Le contrat {numero} avec {client} arrive à échéance le {date_echeance}',
      variables: ['numero', 'client', 'date_echeance'],
      active: true
    },
    {
      id: 5,
      name: 'Email Documents',
      type: 'documents',
      channel: 'email',
      subject: 'Documents en attente',
      body: 'Bonjour {client}, nous attendons toujours les documents suivants: {liste_documents}',
      variables: ['client', 'liste_documents'],
      active: true
    },
    {
      id: 6,
      name: 'SMS Stock',
      type: 'stock',
      channel: 'sms',
      subject: 'Alerte stock',
      body: 'Alerte: Le stock de {produit} est en dessous du seuil minimum ({quantite} restants)',
      variables: ['produit', 'quantite'],
      active: true
    }
  ]);

  // Historique des rappels
  const [rappelHistory, setRappelHistory] = useState([]);

  // Planification des relances
  const [scheduledReminders, setScheduledReminders] = useState([]);

  // Chargement initial
  useEffect(() => {
    fetchRappels();
    setupWebSocket();
    loadConfiguration();
    
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [activeTab, filterStatus]);

  // WebSocket pour alertes temps réel
  const setupWebSocket = () => {
    // Simulation WebSocket - à remplacer par vraie connexion
    const interval = setInterval(() => {
      checkForNewAlerts();
    }, 30000); // Check toutes les 30 secondes
    
    return () => clearInterval(interval);
  };

  // Récupération des rappels
  const fetchRappels = async () => {
    setLoading(true);
    try {
      // Simulation API - à remplacer par vrais appels
      const mockRappels = generateMockRappels();
      setRappels(mockRappels);
      
      // Vérifier les alertes automatiques
      if (autoMode) {
        processAutomaticAlerts(mockRappels);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des rappels');
    } finally {
      setLoading(false);
    }
  };

  // Génération données mock
  const generateMockRappels = () => {
    const types = ['devis', 'factures', 'interventions', 'contrats', 'documents', 'demandes', 'affaires', 'produits', 'pointages'];
    const priorities = ['immediate', 'critique', 'haute', 'normale', 'basse'];
    const statuses = ['pending', 'sent', 'acknowledged', 'resolved', 'escalated'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      type: types[Math.floor(Math.random() * types.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      title: `Rappel #${1000 + i}`,
      client: `Client ${String.fromCharCode(65 + (i % 26))}`,
      montant: Math.floor(Math.random() * 10000) + 500,
      dateEcheance: format(addDays(new Date(), Math.floor(Math.random() * 60) - 30), 'yyyy-MM-dd'),
      joursRetard: Math.floor(Math.random() * 30) - 10,
      lastReminder: format(subDays(new Date(), Math.floor(Math.random() * 10)), 'yyyy-MM-dd HH:mm'),
      nextReminder: format(addDays(new Date(), Math.floor(Math.random() * 7)), 'yyyy-MM-dd HH:mm'),
      remindersCount: Math.floor(Math.random() * 5),
      escalationLevel: Math.floor(Math.random() * 3),
      autoSend: Math.random() > 0.5,
      channels: ['email', Math.random() > 0.5 ? 'sms' : null, 'notification'].filter(Boolean)
    }));
  };

  // Traitement des alertes automatiques
  const processAutomaticAlerts = (rappelsList) => {
    const alertsToSend = rappelsList.filter(rappel => {
      if (!rappel.autoSend) return false;
      
      const config = seuilsConfig[rappel.type];
      if (!config || !config.enabled) return false;
      
      const daysOverdue = rappel.joursRetard;
      
      // Vérifier les niveaux d'escalade
      if (daysOverdue >= config.escalade.niveau3) {
        return rappel.escalationLevel < 3;
      } else if (daysOverdue >= config.escalade.niveau2) {
        return rappel.escalationLevel < 2;
      } else if (daysOverdue >= config.escalade.niveau1) {
        return rappel.escalationLevel < 1;
      }
      
      return false;
    });
    
    if (alertsToSend.length > 0) {
      toast.info(`${alertsToSend.length} alertes automatiques détectées`);
      alertsToSend.forEach(alert => {
        scheduleAutomaticReminder(alert);
      });
    }
  };

  // Planifier un rappel automatique
  const scheduleAutomaticReminder = (rappel) => {
    const config = seuilsConfig[rappel.type];
    const template = messageTemplates.find(t => t.type === rappel.type && t.active);
    
    if (!template) {
      toast.error(`Aucun template actif pour ${rappel.type}`);
      return;
    }
    
    const scheduledReminder = {
      id: `auto_${Date.now()}_${rappel.id}`,
      rappelId: rappel.id,
      type: rappel.type,
      client: rappel.client,
      scheduledDate: rappel.nextReminder,
      template: template.name,
      channels: config.actions,
      status: 'scheduled',
      priority: config.priorite
    };
    
    setScheduledReminders(prev => [...prev, scheduledReminder]);
    
    // Simuler l'envoi après délai
    setTimeout(() => {
      sendReminder(rappel, template, config.actions);
    }, 5000);
  };

  // Envoyer un rappel
  const sendReminder = async (rappel, template, channels) => {
    try {
      // Préparer le message avec les variables
      let message = template.body;
      const variables = {
        client_name: rappel.client,
        numero: rappel.title,
        montant: rappel.montant,
        jours_retard: Math.abs(rappel.joursRetard),
        date_emission: rappel.dateEcheance,
        // ... autres variables
      };
      
      Object.keys(variables).forEach(key => {
        message = message.replace(`{${key}}`, variables[key]);
      });
      
      // Simuler l'envoi sur différents canaux
      for (const channel of channels) {
        if (channel === 'email') {
          // await api.post('/rappels/email', { ...rappel, message });
          console.log('Email envoyé:', message);
        } else if (channel === 'sms') {
          // await api.post('/rappels/sms', { ...rappel, message });
          console.log('SMS envoyé:', message);
        } else if (channel === 'notification') {
          toast.success(`Rappel envoyé: ${rappel.title}`);
        }
      }
      
      // Ajouter à l'historique
      const historyEntry = {
        id: Date.now(),
        rappelId: rappel.id,
        date: new Date().toISOString(),
        type: rappel.type,
        client: rappel.client,
        channels,
        template: template.name,
        status: 'sent',
        message
      };
      
      setRappelHistory(prev => [historyEntry, ...prev]);
      
      // Mettre à jour le rappel
      setRappels(prev => prev.map(r => 
        r.id === rappel.id 
          ? { ...r, lastReminder: new Date().toISOString(), remindersCount: r.remindersCount + 1 }
          : r
      ));
      
      // Effet visuel
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du rappel');
    }
  };

  // Vérifier nouvelles alertes
  const checkForNewAlerts = () => {
    const newAlerts = rappels.filter(r => {
      const daysSinceLastReminder = differenceInDays(new Date(), parseISO(r.lastReminder));
      return daysSinceLastReminder >= 7 && r.status === 'pending';
    });
    
    if (newAlerts.length > 0) {
      toast.warning(`${newAlerts.length} nouveaux rappels à traiter`);
    }
  };

  // Charger configuration
  const loadConfiguration = () => {
    const saved = localStorage.getItem('rappelsConfig');
    if (saved) {
      setSeuilsConfig(JSON.parse(saved));
    }
  };

  // Sauvegarder configuration
  const saveConfiguration = () => {
    localStorage.setItem('rappelsConfig', JSON.stringify(seuilsConfig));
    toast.success('Configuration sauvegardée');
  };

  // Export des rappels
  const exportRappels = (format) => {
    const data = filteredRappels;
    
    if (format === 'csv') {
      const csv = [
        ['Type', 'Client', 'Montant', 'Échéance', 'Retard', 'Statut', 'Priorité'],
        ...data.map(r => [
          r.type,
          r.client,
          r.montant,
          r.dateEcheance,
          r.joursRetard,
          r.status,
          r.priority
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rappels_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      toast.success('Export réussi');
    }
  };

  // Filtrage des rappels
  const filteredRappels = rappels.filter(rappel => {
    // Mapping des onglets vers les types de rappels
    const tabTypeMapping = {
      'Tous': null,
      'Devis': 'devis',
      'Factures': 'factures',
      'Interventions': 'interventions',
      'Envoi documents': 'documents',
      'Demandes client': 'demandes',
      'Affaires': 'affaires',
      'Contrats': 'contrats',
      'Produits/services': 'produits',
      'Pointages': 'pointages'
    };
    
    const matchesTab = activeTab === 'Tous' || rappel.type === tabTypeMapping[activeTab];
    const matchesStatus = filterStatus === 'all' || rappel.status === filterStatus;
    const matchesSearch = rappel.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rappel.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesStatus && matchesSearch;
  });

  // Statistiques
  const stats = {
    total: rappels.length,
    pending: rappels.filter(r => r.status === 'pending').length,
    sent: rappels.filter(r => r.status === 'sent').length,
    overdue: rappels.filter(r => r.joursRetard > 0).length,
    critical: rappels.filter(r => r.priority === 'critique').length,
    automated: rappels.filter(r => r.autoSend).length
  };

  // Onglets disponibles
  const tabs = [
    'Tous',
    'Devis',
    'Factures', 
    'Interventions',
    'Envoi documents',
    'Demandes client',
    'Affaires',
    'Contrats',
    'Produits/services',
    'Pointages'
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'immediate': return 'from-red-600 to-red-700';
      case 'critique': return 'from-red-500 to-orange-600';
      case 'haute': return 'from-orange-500 to-yellow-600';
      case 'normale': return 'from-blue-500 to-indigo-600';
      case 'basse': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'acknowledged': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <UltraPremiumContainer
      title="Centre de Rappels Intelligent"
      icon={BellAlertIcon}
    >
      {/* Header avec stats */}
      <div className="mb-6">
        <div className="grid grid-cols-6 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: QueueListIcon, color: 'from-blue-500 to-indigo-600' },
            { label: 'En attente', value: stats.pending, icon: ClockIcon, color: 'from-yellow-500 to-orange-600' },
            { label: 'Envoyés', value: stats.sent, icon: PaperAirplaneIcon, color: 'from-green-500 to-emerald-600' },
            { label: 'En retard', value: stats.overdue, icon: ExclamationTriangleIcon, color: 'from-red-500 to-pink-600' },
            { label: 'Critiques', value: stats.critical, icon: FireIcon, color: 'from-red-600 to-red-700' },
            { label: 'Automatisés', value: stats.automated, icon: BoltIcon, color: 'from-purple-500 to-violet-600' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={getClasses('card', 'relative overflow-hidden')}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${theme.accent}`} />
                  <span className={`text-2xl font-bold ${theme.text}`}>{stat.value}</span>
                </div>
                <p className={`text-xs ${theme.textSecondary}`}>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {/* Onglets */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ?
                  getClasses('button', 'px-3 py-2 text-sm') :
                  'px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
                }
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {/* Mode automatique */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAutoMode(!autoMode)}
            className={autoMode ?
              getClasses('button', 'px-4 py-2 flex items-center gap-2') :
              getClasses('glass', 'px-4 py-2 rounded-xl flex items-center gap-2')
            }
          >
            <BoltIcon className="w-4 h-4" />
            {autoMode ? 'Auto ON' : 'Auto OFF'}
          </motion.button>

          {/* Actions */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfigModal(true)}
            className={getClasses('glass', 'p-2 rounded-xl')}
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTemplateModal(true)}
            className={getClasses('glass', 'p-2 rounded-xl')}
          >
            <DocumentTextIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistoryModal(true)}
            className={getClasses('glass', 'p-2 rounded-xl')}
          >
            <ClockIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowScheduleModal(true)}
            className={getClasses('glass', 'p-2 rounded-xl')}
          >
            <CalendarDaysIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportRappels('csv')}
            className={getClasses('glass', 'p-2 rounded-xl')}
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchRappels}
            className={getClasses('glass', 'p-2 rounded-xl')}
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textSecondary}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un client, un rappel..."
            className={getClasses('input', 'pl-10')}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={getClasses('glass', 'px-4 py-3 rounded-xl')}
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="sent">Envoyés</option>
          <option value="acknowledged">Accusés</option>
          <option value="resolved">Résolus</option>
          <option value="escalated">Escaladés</option>
        </select>
      </div>

      {/* Liste des rappels */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRappels.map((rappel) => (
          <motion.div
            key={rappel.id}
            whileHover={{ x: 5 }}
            className={getClasses('card', 'relative overflow-hidden')}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getPriorityColor(rappel.priority)}`} />
            
            <div className="pl-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`font-semibold ${theme.text}`}>{rappel.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(rappel.status)}`}>
                      {rappel.status}
                    </span>
                    {rappel.autoSend && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                        <BoltIcon className="w-3 h-3" />
                        Auto
                      </span>
                    )}
                    {rappel.escalationLevel > 0 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Escalade N{rappel.escalationLevel}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className={theme.textSecondary}>Client:</span>
                      <p className={theme.text}>{rappel.client}</p>
                    </div>
                    <div>
                      <span className={theme.textSecondary}>Type:</span>
                      <p className={theme.text}>{rappel.type}</p>
                    </div>
                    <div>
                      <span className={theme.textSecondary}>Montant:</span>
                      <p className={theme.text}>€{rappel.montant.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className={theme.textSecondary}>Échéance:</span>
                      <p className={theme.text}>{format(parseISO(rappel.dateEcheance), 'dd/MM/yyyy', { locale: fr })}</p>
                    </div>
                    <div>
                      <span className={theme.textSecondary}>Retard:</span>
                      <p className={rappel.joursRetard > 0 ? 'text-red-500' : 'text-green-500'}>
                        {rappel.joursRetard > 0 ? `+${rappel.joursRetard}j` : `${rappel.joursRetard}j`}
                      </p>
                    </div>
                    <div>
                      <span className={theme.textSecondary}>Rappels:</span>
                      <p className={theme.text}>{rappel.remindersCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex gap-2">
                      {rappel.channels.map((channel) => (
                        <span key={channel} className={getClasses('badge')}>
                          {channel === 'email' && <EnvelopeIcon className="w-3 h-3" />}
                          {channel === 'sms' && <DevicePhoneMobileIcon className="w-3 h-3" />}
                          {channel === 'notification' && <BellIcon className="w-3 h-3" />}
                        </span>
                      ))}
                    </div>
                    
                    <span className={`text-xs ${theme.textSecondary}`}>
                      Dernier: {format(parseISO(rappel.lastReminder), 'dd/MM HH:mm', { locale: fr })}
                    </span>
                    
                    <span className={`text-xs ${theme.textSecondary}`}>
                      Prochain: {format(parseISO(rappel.nextReminder), 'dd/MM HH:mm', { locale: fr })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const template = messageTemplates.find(t => t.type === rappel.type);
                      if (template) {
                        sendReminder(rappel, template, rappel.channels);
                      }
                    }}
                    className={getClasses('button', 'px-3 py-2 text-sm')}
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedRappel(rappel)}
                    className={getClasses('glass', 'p-2 rounded-lg')}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Configuration */}
      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowConfigModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto')}
            >
              <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Configuration des Seuils</h3>
              
              <div className="space-y-6">
                {Object.entries(seuilsConfig).map(([key, config]) => (
                  <div key={key} className={getClasses('glass', 'p-4 rounded-xl')}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-semibold ${theme.text} capitalize`}>{key}</h4>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSeuilsConfig(prev => ({
                          ...prev,
                          [key]: { ...prev[key], enabled: !prev[key].enabled }
                        }))}
                        className={config.enabled ?
                          getClasses('button', 'px-3 py-1 text-sm') :
                          getClasses('glass', 'px-3 py-1 rounded-lg text-sm')
                        }
                      >
                        {config.enabled ? 'Activé' : 'Désactivé'}
                      </motion.button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className={`text-sm ${theme.textSecondary}`}>Délai (jours)</label>
                        <input
                          type="number"
                          value={config.delai}
                          onChange={(e) => setSeuilsConfig(prev => ({
                            ...prev,
                            [key]: { ...prev[key], delai: parseInt(e.target.value) }
                          }))}
                          className={getClasses('input', 'mt-1')}
                        />
                      </div>
                      
                      <div>
                        <label className={`text-sm ${theme.textSecondary}`}>Priorité</label>
                        <select
                          value={config.priorite}
                          onChange={(e) => setSeuilsConfig(prev => ({
                            ...prev,
                            [key]: { ...prev[key], priorite: e.target.value }
                          }))}
                          className={getClasses('input', 'mt-1')}
                        >
                          <option value="immediate">Immédiate</option>
                          <option value="critique">Critique</option>
                          <option value="haute">Haute</option>
                          <option value="normale">Normale</option>
                          <option value="basse">Basse</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`text-sm ${theme.textSecondary}`}>Escalade N1</label>
                        <input
                          type="number"
                          value={config.escalade.niveau1}
                          onChange={(e) => setSeuilsConfig(prev => ({
                            ...prev,
                            [key]: { 
                              ...prev[key], 
                              escalade: { ...prev[key].escalade, niveau1: parseInt(e.target.value) }
                            }
                          }))}
                          className={getClasses('input', 'mt-1')}
                        />
                      </div>
                      
                      <div>
                        <label className={`text-sm ${theme.textSecondary}`}>Actions</label>
                        <div className="flex gap-2 mt-1">
                          {['email', 'sms', 'notification'].map((action) => (
                            <label key={action} className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={config.actions.includes(action)}
                                onChange={(e) => {
                                  const newActions = e.target.checked
                                    ? [...config.actions, action]
                                    : config.actions.filter(a => a !== action);
                                  setSeuilsConfig(prev => ({
                                    ...prev,
                                    [key]: { ...prev[key], actions: newActions }
                                  }));
                                }}
                              />
                              <span className={`text-sm ${theme.text}`}>{action}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfigModal(false)}
                  className={getClasses('glass', 'px-6 py-3 rounded-xl')}
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    saveConfiguration();
                    setShowConfigModal(false);
                  }}
                  className={getClasses('button', 'px-6 py-3')}
                >
                  Sauvegarder
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default RappelsUltraPremium;