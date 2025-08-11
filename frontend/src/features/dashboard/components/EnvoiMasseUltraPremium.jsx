import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  FunnelIcon,
  DocumentTextIcon,
  PhotoIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  RocketLaunchIcon,
  Battery100Icon,
  SignalIcon,
  CpuChipIcon,
  TagIcon,
  HashtagIcon,
  AtSymbolIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  GiftIcon,
  HeartIcon,
  StarIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
  LinkIcon,
  PhoneIcon,
  GlobeAltIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  BeakerIcon,
  CurrencyEuroIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

const EnvoiMasseUltraPremium = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [composerMode, setComposerMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [sendingProgress, setSendingProgress] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  // Simulation d'envoi en cours
  useEffect(() => {
    if (sendingProgress > 0 && sendingProgress < 100) {
      const timer = setTimeout(() => {
        setSendingProgress(prev => Math.min(prev + 5, 100));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [sendingProgress]);

  // Campagnes existantes
  const campaigns = [
    {
      id: 1,
      name: 'Promotion Été 2024',
      type: 'email',
      status: 'sent',
      recipients: 856,
      sent: 856,
      opened: 412,
      clicked: 156,
      bounced: 12,
      unsubscribed: 3,
      date: new Date('2024-07-15'),
      subject: '☀️ Offre spéciale été: -20% sur l\'entretien jardin',
      template: 'seasonal_promo',
      tags: ['promotion', 'été', 'entretien'],
      performance: {
        openRate: 48.1,
        clickRate: 18.2,
        conversionRate: 5.4,
        revenue: 8750
      }
    },
    {
      id: 2,
      name: 'Newsletter Mensuelle',
      type: 'email',
      status: 'scheduled',
      recipients: 1245,
      sent: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      date: new Date('2024-09-01'),
      subject: '🌿 Conseils jardinage de septembre',
      template: 'newsletter',
      tags: ['newsletter', 'conseils', 'mensuel'],
      performance: null
    },
    {
      id: 3,
      name: 'Rappel Entretien',
      type: 'sms',
      status: 'draft',
      recipients: 320,
      sent: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      date: null,
      subject: 'Rappel: Entretien programmé',
      template: 'reminder',
      tags: ['rappel', 'entretien', 'automatique'],
      performance: null
    },
    {
      id: 4,
      name: 'Satisfaction Client',
      type: 'email',
      status: 'sent',
      recipients: 145,
      sent: 145,
      opened: 98,
      clicked: 45,
      bounced: 2,
      unsubscribed: 0,
      date: new Date('2024-08-10'),
      subject: '⭐ Votre avis compte pour nous',
      template: 'survey',
      tags: ['satisfaction', 'enquête', 'feedback'],
      performance: {
        openRate: 67.6,
        clickRate: 31.0,
        responseRate: 28.3,
        avgRating: 4.6
      }
    }
  ];

  // Templates disponibles
  const templates = [
    {
      id: 'seasonal_promo',
      name: 'Promotion Saisonnière',
      icon: '🎯',
      category: 'marketing',
      description: 'Template optimisé pour les promotions',
      variables: ['season', 'discount', 'service'],
      performance: { avgOpen: 52, avgClick: 22 }
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      icon: '📰',
      category: 'information',
      description: 'Format newsletter avec conseils',
      variables: ['month', 'tips', 'featured'],
      performance: { avgOpen: 45, avgClick: 15 }
    },
    {
      id: 'reminder',
      name: 'Rappel',
      icon: '⏰',
      category: 'transactionnel',
      description: 'Rappel d\'intervention ou RDV',
      variables: ['date', 'time', 'service', 'technician'],
      performance: { avgOpen: 78, avgClick: 35 }
    },
    {
      id: 'survey',
      name: 'Enquête Satisfaction',
      icon: '📊',
      category: 'feedback',
      description: 'Collecte d\'avis clients',
      variables: ['client', 'intervention', 'link'],
      performance: { avgOpen: 65, avgClick: 30 }
    },
    {
      id: 'welcome',
      name: 'Bienvenue',
      icon: '👋',
      category: 'onboarding',
      description: 'Email de bienvenue nouveaux clients',
      variables: ['name', 'services', 'contact'],
      performance: { avgOpen: 85, avgClick: 40 }
    },
    {
      id: 'special_offer',
      name: 'Offre Spéciale',
      icon: '🎁',
      category: 'marketing',
      description: 'Offre limitée dans le temps',
      variables: ['offer', 'deadline', 'code'],
      performance: { avgOpen: 58, avgClick: 25 }
    }
  ];

  // Segments de destinataires
  const recipientSegments = [
    { id: 'all', name: 'Tous les contacts', count: 1854, icon: '👥' },
    { id: 'active', name: 'Clients actifs', count: 742, icon: '✅' },
    { id: 'prospects', name: 'Prospects', count: 356, icon: '🎯' },
    { id: 'vip', name: 'Clients VIP', count: 89, icon: '⭐' },
    { id: 'inactive', name: 'Clients inactifs', count: 234, icon: '😴' },
    { id: 'residential', name: 'Résidentiels', count: 567, icon: '🏠' },
    { id: 'commercial', name: 'Entreprises', count: 198, icon: '🏢' },
    { id: 'monthly', name: 'Contrats mensuels', count: 145, icon: '📅' }
  ];

  // Stats globales
  const globalStats = {
    totalSent: 24567,
    avgOpenRate: 51.2,
    avgClickRate: 19.8,
    totalRevenue: 45200,
    activeSubscribers: 1854,
    unsubscribeRate: 0.8,
    bestPerformingTime: '10:00',
    bestPerformingDay: 'Mardi'
  };

  // Graphique performance campagnes
  const campaignPerformance = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
    datasets: [
      {
        label: 'Taux d\'ouverture',
        data: [45, 48, 52, 49, 54, 51, 53, 52],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Taux de clic',
        data: [15, 17, 20, 18, 22, 19, 21, 20],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Distribution par type
  const typeDistribution = {
    labels: ['Email', 'SMS', 'Push', 'WhatsApp'],
    datasets: [{
      data: [65, 20, 10, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(147, 51, 234, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'sent': return 'from-green-500 to-emerald-500';
      case 'scheduled': return 'from-blue-500 to-indigo-500';
      case 'draft': return 'from-gray-400 to-gray-500';
      case 'sending': return 'from-yellow-500 to-amber-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'marketing': return 'bg-purple-100 text-purple-700';
      case 'transactionnel': return 'bg-blue-100 text-blue-700';
      case 'information': return 'bg-green-100 text-green-700';
      case 'feedback': return 'bg-yellow-100 text-yellow-700';
      case 'onboarding': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Communication */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation d'envoi */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute"
            animate={{
              x: ['-100%', '100%'],
              y: ['-50%', '50%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <PaperAirplaneIcon className="w-32 h-32" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <MegaphoneIcon className="w-8 h-8 mr-3" />
                Centre de Communication Avancé
              </h1>
              <p className="text-purple-100">Campagnes intelligentes et personnalisation IA</p>
              
              {/* Indicateurs système */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Serveur mail actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">IA: Personnalisation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="text-sm">Conformité RGPD</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Mode Pro</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{globalStats.activeSubscribers}</div>
              <div className="text-purple-100">Contacts actifs</div>
              <div className="mt-3">
                <button 
                  onClick={() => setComposerMode(true)}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg"
                >
                  <PlusIcon className="w-5 h-5 inline mr-2" />
                  Nouvelle campagne
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Communication */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Envoyés', value: (globalStats.totalSent / 1000).toFixed(1) + 'K', icon: '📤', color: 'from-blue-500 to-indigo-500' },
          { label: 'Taux ouverture', value: `${globalStats.avgOpenRate}%`, icon: '👁️', color: 'from-green-500 to-emerald-500' },
          { label: 'Taux clic', value: `${globalStats.avgClickRate}%`, icon: '🖱️', color: 'from-purple-500 to-pink-500' },
          { label: 'CA généré', value: `${(globalStats.totalRevenue / 1000).toFixed(0)}K€`, icon: '💰', color: 'from-yellow-500 to-amber-500' },
          { label: 'Abonnés', value: globalStats.activeSubscribers, icon: '👥', color: 'from-cyan-500 to-blue-500' },
          { label: 'Désinscription', value: `${globalStats.unsubscribeRate}%`, icon: '🚪', color: 'from-red-500 to-orange-500' },
          { label: 'Meilleur jour', value: globalStats.bestPerformingDay, icon: '📅', color: 'from-indigo-500 to-purple-500' },
          { label: 'Meilleure heure', value: globalStats.bestPerformingTime, icon: '⏰', color: 'from-green-400 to-emerald-400' }
        ].map((kpi, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05, type: "spring" }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className={`h-1 bg-gradient-to-r ${kpi.color}`} />
            <div className="p-3">
              <div className="text-xl font-bold text-gray-900 flex items-center">
                {kpi.icon} {kpi.value}
              </div>
              <div className="text-xs text-gray-600">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des campagnes */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Campagnes Récentes
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedCampaign(campaign)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header campagne */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">{campaign.subject}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(campaign.status)}`}>
                          {campaign.status === 'sent' ? 'Envoyé' :
                           campaign.status === 'scheduled' ? 'Programmé' :
                           campaign.status === 'draft' ? 'Brouillon' : campaign.status}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {campaign.type === 'email' ? '✉️ Email' : '💬 SMS'}
                        </span>
                      </div>
                    </div>

                    {/* Stats campagne */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{campaign.recipients}</div>
                        <div className="text-xs text-gray-500">Destinataires</div>
                      </div>
                      {campaign.status === 'sent' && (
                        <>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{campaign.opened}</div>
                            <div className="text-xs text-gray-500">Ouverts</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{campaign.clicked}</div>
                            <div className="text-xs text-gray-500">Cliqués</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">{campaign.bounced}</div>
                            <div className="text-xs text-gray-500">Rejetés</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">{campaign.unsubscribed}</div>
                            <div className="text-xs text-gray-500">Désinscrits</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Performance si envoyé */}
                    {campaign.performance && (
                      <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <EyeIcon className="w-4 h-4 text-blue-500 mr-1" />
                            <span className="text-sm font-bold">{campaign.performance.openRate}%</span>
                          </div>
                          <div className="text-xs text-gray-500">Ouverture</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <LinkIcon className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm font-bold">{campaign.performance.clickRate}%</span>
                          </div>
                          <div className="text-xs text-gray-500">Clics</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <CurrencyEuroIcon className="w-4 h-4 text-purple-500 mr-1" />
                            <span className="text-sm font-bold">
                              {campaign.performance.revenue || campaign.performance.conversionRate + '%'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {campaign.performance.revenue ? 'Revenus' : 'Conversion'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex flex-wrap gap-1">
                        {campaign.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {campaign.date && (
                        <span className="text-xs text-gray-500">
                          {campaign.date.toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-200 space-x-2">
                      <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                        <ChartBarIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Templates */}
          <motion.div 
            className="mt-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Templates Disponibles
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedTemplate(template)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{template.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-xs text-gray-600">{template.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <span>📧 {template.performance.avgOpen}% ouv.</span>
                        <span>🖱️ {template.performance.avgClick}% clics</span>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Segments destinataires */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Segments Destinataires</h3>
            <div className="space-y-2">
              {recipientSegments.map((segment) => (
                <button
                  key={segment.id}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedRecipients([segment.id])}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{segment.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{segment.name}</span>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {segment.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Performance graphiques */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Globale</h3>
            <div className="h-48">
              <Line
                data={campaignPerformance}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 10,
                        usePointStyle: true,
                        font: { size: 10 }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 60,
                      ticks: {
                        callback: (value) => `${value}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Actions rapides */}
          <motion.div 
            className="bg-gradient-to-br from-violet-500 to-purple-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <LightBulbIcon className="w-5 h-5 mr-2" />
              Suggestions IA
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-start">
                  <SparklesIcon className="w-5 h-5 mr-2 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Meilleur moment</div>
                    <div className="text-xs opacity-90 mt-1">
                      Envoyez mardi à 10h pour +15% d'ouverture
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-start">
                  <TrophyIcon className="w-5 h-5 mr-2 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Segment performant</div>
                    <div className="text-xs opacity-90 mt-1">
                      Les clients VIP ont 3x plus de conversion
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              <BeakerIcon className="w-5 h-5 inline mr-2" />
              Test A/B automatique
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnvoiMasseUltraPremium;