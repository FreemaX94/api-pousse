import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  BriefcaseIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  CalendarIcon,
  ChartPieIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  ArrowRightIcon,
  FlagIcon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  BanknotesIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  PresentationChartLineIcon,
  CogIcon
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

const AffairesUltraPremium = () => {
  const { theme, getClasses, currentTheme } = useThemeUltraPremium();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('pipeline');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Structure du pipeline commercial
  const [pipelineStages] = useState([
    { 
      id: 'prospect', 
      name: 'Prospects', 
      color: 'from-blue-400 to-blue-600',
      probability: 10,
      description: 'Premiers contacts et qualification'
    },
    { 
      id: 'qualified', 
      name: 'Qualifiés', 
      color: 'from-purple-400 to-purple-600',
      probability: 25,
      description: 'Besoins identifiés et validés'
    },
    { 
      id: 'proposal', 
      name: 'Proposition', 
      color: 'from-orange-400 to-orange-600',
      probability: 50,
      description: 'Offre commerciale envoyée'
    },
    { 
      id: 'negotiation', 
      name: 'Négociation', 
      color: 'from-yellow-400 to-yellow-600',
      probability: 75,
      description: 'Discussions tarifaires en cours'
    },
    { 
      id: 'closed-won', 
      name: 'Gagnées', 
      color: 'from-green-400 to-green-600',
      probability: 100,
      description: 'Affaires conclues avec succès'
    },
    { 
      id: 'closed-lost', 
      name: 'Perdues', 
      color: 'from-red-400 to-red-600',
      probability: 0,
      description: 'Opportunités non concrétisées'
    }
  ]);

  // Données des affaires avec informations commerciales enrichies
  const [deals, setDeals] = useState([
    {
      id: 'deal-1',
      title: 'Aménagement Corporate Bouygues',
      company: 'Bouygues Construction',
      value: 450000,
      stage: 'negotiation',
      probability: 85,
      expectedCloseDate: '2025-01-30',
      lastActivity: '2025-01-12',
      contactPerson: {
        name: 'Jean Dupuis',
        role: 'Directeur Immobilier',
        email: 'j.dupuis@bouygues.fr',
        phone: '+33 1 23 45 67 89'
      },
      assignedTo: {
        name: 'Sophie Martin',
        role: 'Business Developer Senior',
        avatar: '👩‍💼',
        performance: 92
      },
      nextSteps: [
        'Finaliser la proposition tarifaire',
        'Présentation executive la semaine prochaine',
        'Négocier les conditions de paiement'
      ],
      tags: ['Corporate', 'Grande Entreprise', 'Récurrent'],
      priority: 'high',
      competitors: ['Eiffage', 'Vinci'],
      budget: 500000,
      timeline: '6 mois',
      location: 'La Défense, Paris',
      surface: '15000m²',
      activities: [
        { date: '2025-01-12', type: 'call', description: 'Call de négociation - réduction 8%' },
        { date: '2025-01-10', type: 'meeting', description: 'Présentation technique équipe' },
        { date: '2025-01-08', type: 'email', description: 'Envoi proposition révisée' }
      ],
      documents: ['Proposition commerciale v2.1', 'Plans techniques', 'Références clients'],
      forecast: {
        q1: 200000,
        q2: 250000,
        confidence: 85
      }
    },
    {
      id: 'deal-2',
      title: 'Espaces Verts Carrefour Property',
      company: 'Carrefour Property',
      value: 320000,
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: '2025-02-15',
      lastActivity: '2025-01-11',
      contactPerson: {
        name: 'Marie Leblanc',
        role: 'Responsable Développement',
        email: 'm.leblanc@carrefour.fr',
        phone: '+33 1 34 56 78 90'
      },
      assignedTo: {
        name: 'Thomas Durand',
        role: 'Account Manager',
        avatar: '👨‍💼',
        performance: 87
      },
      nextSteps: [
        'Relancer après présentation',
        'Organiser visite site pilote',
        'Préciser cahier des charges'
      ],
      tags: ['Retail', 'Multi-sites', 'Maintenance'],
      priority: 'medium',
      competitors: ['ISS', 'Sodexo'],
      budget: 350000,
      timeline: '12 mois',
      location: 'National (50+ sites)',
      surface: '25000m²',
      activities: [
        { date: '2025-01-11', type: 'presentation', description: 'Pitch commercial - feedback positif' },
        { date: '2025-01-09', type: 'email', description: 'Envoi dossier de candidature' },
        { date: '2025-01-05', type: 'call', description: 'Call découverte - 45min' }
      ],
      documents: ['Proposition initiale', 'Catalogue services', 'Présentation entreprise'],
      forecast: {
        q1: 80000,
        q2: 240000,
        confidence: 60
      }
    },
    {
      id: 'deal-3',
      title: 'Jardins Thérapeutiques Korian',
      company: 'Groupe Korian',
      value: 180000,
      stage: 'qualified',
      probability: 40,
      expectedCloseDate: '2025-03-01',
      lastActivity: '2025-01-10',
      contactPerson: {
        name: 'Dr. Claire Moreau',
        role: 'Directrice Médicale',
        email: 'c.moreau@korian.fr',
        phone: '+33 1 45 67 89 01'
      },
      assignedTo: {
        name: 'Emma Leroy',
        role: 'Spécialiste Santé',
        avatar: '👩‍⚕️',
        performance: 94
      },
      nextSteps: [
        'Audit des besoins thérapeutiques',
        'Présentation expertise santé',
        'Visite références EHPAD'
      ],
      tags: ['Santé', 'Thérapeutique', 'Innovation'],
      priority: 'high',
      competitors: ['Jardins de Gally'],
      budget: 200000,
      timeline: '4 mois',
      location: 'Île-de-France (8 sites)',
      surface: '3500m²',
      activities: [
        { date: '2025-01-10', type: 'meeting', description: 'RDV découverte sur site - 2h' },
        { date: '2025-01-07', type: 'call', description: 'Pré-qualification téléphonique' },
        { date: '2025-01-03', type: 'lead', description: 'Lead généré via salon professionnel' }
      ],
      documents: ['Cahier des charges médical', 'Études de cas'],
      forecast: {
        q1: 45000,
        q2: 135000,
        confidence: 40
      }
    },
    {
      id: 'deal-4',
      title: 'Rénovation Paysagère Accor',
      company: 'Accor Hotels',
      value: 280000,
      stage: 'closed-won',
      probability: 100,
      expectedCloseDate: '2025-01-05',
      lastActivity: '2025-01-05',
      contactPerson: {
        name: 'Laurent Petit',
        role: 'Directeur Technique',
        email: 'l.petit@accor.com',
        phone: '+33 1 56 78 90 12'
      },
      assignedTo: {
        name: 'Marc Dubois',
        role: 'Key Account Manager',
        avatar: '👨‍💼',
        performance: 96
      },
      nextSteps: [
        'Kick-off projet la semaine prochaine',
        'Mise en place équipe projet',
        'Planning détaillé travaux'
      ],
      tags: ['Hôtellerie', 'Rénovation', 'Premium'],
      priority: 'high',
      competitors: [],
      budget: 280000,
      timeline: '8 mois',
      location: 'Paris & Région parisienne',
      surface: '12000m²',
      activities: [
        { date: '2025-01-05', type: 'contract', description: 'Signature contrat - DEAL WON! 🎉' },
        { date: '2025-01-03', type: 'negotiation', description: 'Finalisation conditions contractuelles' },
        { date: '2024-12-20', type: 'presentation', description: 'Présentation finale direction' }
      ],
      documents: ['Contrat signé', 'Planning projet', 'Spécifications techniques'],
      forecast: {
        q1: 280000,
        q2: 0,
        confidence: 100
      }
    },
    {
      id: 'deal-5',
      title: 'Smart Garden Orange Business',
      company: 'Orange Business Services',
      value: 520000,
      stage: 'prospect',
      probability: 15,
      expectedCloseDate: '2025-04-30',
      lastActivity: '2025-01-09',
      contactPerson: {
        name: 'Nathalie Roy',
        role: 'Innovation Manager',
        email: 'nathalie.roy@orange.com',
        phone: '+33 1 67 89 01 23'
      },
      assignedTo: {
        name: 'Alex Chen',
        role: 'Innovation Specialist',
        avatar: '👨‍💻',
        performance: 89
      },
      nextSteps: [
        'Demo solution IoT smart garden',
        'Atelier co-création innovation',
        'Étude faisabilité technique'
      ],
      tags: ['Innovation', 'IoT', 'Tech', 'Smart'],
      priority: 'medium',
      competitors: ['Schneider Electric', 'Legrand'],
      budget: 600000,
      timeline: '18 mois',
      location: 'Campus Orange Chatillon',
      surface: '8000m²',
      activities: [
        { date: '2025-01-09', type: 'demo', description: 'Demo IoT sensors - très intéressés' },
        { date: '2025-01-04', type: 'meeting', description: 'Premier RDV innovation lab' },
        { date: '2024-12-28', type: 'lead', description: 'Contact via partenaire tech' }
      ],
      documents: ['Présentation innovation', 'Roadmap technique'],
      forecast: {
        q1: 0,
        q2: 130000,
        confidence: 15
      }
    },
    {
      id: 'deal-6',
      title: 'Maintenance Multi-Sites SNCF',
      company: 'SNCF Connect',
      value: 720000,
      stage: 'closed-lost',
      probability: 0,
      expectedCloseDate: '2024-12-15',
      lastActivity: '2024-12-20',
      contactPerson: {
        name: 'Pierre Martin',
        role: 'Acheteur Services',
        email: 'p.martin@sncf.fr',
        phone: '+33 1 78 90 12 34'
      },
      assignedTo: {
        name: 'Julie Moreau',
        role: 'Business Developer',
        avatar: '👩‍💼',
        performance: 83
      },
      nextSteps: [
        'Débriefing échec commercial',
        'Analyse concurrence gagnante',
        'Plan reconquête 2025'
      ],
      tags: ['Transport', 'Public', 'Multi-sites'],
      priority: 'low',
      competitors: ['Vinci Facilities', 'Elis'],
      budget: 800000,
      timeline: '36 mois',
      location: 'National (200+ gares)',
      surface: '45000m²',
      activities: [
        { date: '2024-12-20', type: 'feedback', description: 'LOST - tarif 15% au-dessus concurrent 😞' },
        { date: '2024-12-15', type: 'presentation', description: 'Présentation finale commission' },
        { date: '2024-12-10', type: 'negotiation', description: 'Dernière tentative négociation' }
      ],
      documents: ['Post-mortem analyse', 'Débriefing client'],
      forecast: {
        q1: 0,
        q2: 0,
        confidence: 0
      }
    }
  ]);

  // Équipe commerciale
  const [salesTeam] = useState([
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Business Developer Senior',
      avatar: '👩‍💼',
      email: 'sophie.martin@company.com',
      performance: {
        deals: 8,
        revenue: 1250000,
        conversionRate: 67,
        avgDealSize: 156250,
        targetAchievement: 112
      },
      specialties: ['Corporate', 'Grande Entreprise'],
      dealsActive: 3,
      dealsWon: 5,
      lastActivity: '2025-01-12'
    },
    {
      id: 2,
      name: 'Thomas Durand',
      role: 'Account Manager',
      avatar: '👨‍💼',
      email: 'thomas.durand@company.com',
      performance: {
        deals: 12,
        revenue: 980000,
        conversionRate: 58,
        avgDealSize: 81667,
        targetAchievement: 98
      },
      specialties: ['Retail', 'PME'],
      dealsActive: 4,
      dealsWon: 8,
      lastActivity: '2025-01-11'
    },
    {
      id: 3,
      name: 'Emma Leroy',
      role: 'Spécialiste Santé',
      avatar: '👩‍⚕️',
      email: 'emma.leroy@company.com',
      performance: {
        deals: 6,
        revenue: 720000,
        conversionRate: 75,
        avgDealSize: 120000,
        targetAchievement: 105
      },
      specialties: ['Santé', 'Thérapeutique'],
      dealsActive: 2,
      dealsWon: 4,
      lastActivity: '2025-01-10'
    },
    {
      id: 4,
      name: 'Marc Dubois',
      role: 'Key Account Manager',
      avatar: '👨‍💼',
      email: 'marc.dubois@company.com',
      performance: {
        deals: 5,
        revenue: 1420000,
        conversionRate: 80,
        avgDealSize: 284000,
        targetAchievement: 124
      },
      specialties: ['Grands Comptes', 'Premium'],
      dealsActive: 2,
      dealsWon: 3,
      lastActivity: '2025-01-05'
    }
  ]);

  // Calculs de performance et KPIs
  const calculateKPIs = () => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDeals = deals.filter(d => d.stage === 'closed-won');
    const lostDeals = deals.filter(d => d.stage === 'closed-lost');
    const activeDeals = deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage));
    
    const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const lostValue = lostDeals.reduce((sum, deal) => sum + deal.value, 0);
    const pipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedPipeline = activeDeals.reduce((sum, deal) => {
      const stage = pipelineStages.find(s => s.id === deal.stage);
      return sum + (deal.value * (stage?.probability || 0) / 100);
    }, 0);

    const conversionRate = Math.round(((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) || 0);
    const avgDealSize = Math.round(wonValue / Math.max(wonDeals.length, 1));
    const avgSalesCycle = 45; // Simulé
    
    return {
      totalValue,
      wonValue,
      lostValue,
      pipelineValue,
      weightedPipeline,
      totalDeals: deals.length,
      wonDeals: wonDeals.length,
      lostDeals: lostDeals.length,
      activeDeals: activeDeals.length,
      conversionRate,
      avgDealSize,
      avgSalesCycle
    };
  };

  const kpis = calculateKPIs();

  // Prévisions CA
  const generateForecast = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    const forecast = months.map((month, idx) => {
      const baseRevenue = 150000 + (idx * 25000);
      const seasonality = Math.sin((idx / 12) * 2 * Math.PI) * 0.2 + 1;
      const growth = 1 + (idx * 0.05);
      return Math.round(baseRevenue * seasonality * growth);
    });
    
    return { months, forecast };
  };

  const { months, forecast } = generateForecast();

  // Drag & Drop handlers
  const onDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    setDeals(prevDeals => {
      const newDeals = [...prevDeals];
      const dealIndex = newDeals.findIndex(deal => deal.id === draggableId);
      if (dealIndex !== -1) {
        newDeals[dealIndex] = {
          ...newDeals[dealIndex],
          stage: destination.droppableId
        };
      }
      return newDeals;
    });
  }, []);

  // Données pour les graphiques
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

  const pipelineChartData = {
    labels: pipelineStages.map(stage => stage.name),
    datasets: [{
      data: pipelineStages.map(stage => 
        deals.filter(deal => deal.stage === stage.id).length
      ),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const revenueChartData = {
    labels: months,
    datasets: [{
      label: 'Prévisions CA',
      data: forecast,
      borderColor: chartColors.primary,
      backgroundColor: `${chartColors.primary.replace('1)', '0.2)')}`,
      fill: true,
      tension: 0.4
    }]
  };

  const teamPerformanceData = {
    labels: salesTeam.map(member => member.name.split(' ')[0]),
    datasets: [{
      label: 'CA généré (K€)',
      data: salesTeam.map(member => Math.round(member.performance.revenue / 1000)),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 2
    }]
  };

  const DealCard = ({ deal, index }) => (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className={`${getClasses('card', 'mb-3 cursor-pointer transition-all duration-200')} ${
            snapshot.isDragging ? 'shadow-2xl rotate-2' : ''
          }`}
          onClick={() => setSelectedDeal(deal)}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className={getClasses('text', 'font-bold text-sm mb-1')}>{deal.title}</h4>
                <div className="flex items-center space-x-2">
                  <BuildingOfficeIcon className={`w-4 h-4 ${theme.accent}`} />
                  <span className={getClasses('textMuted', 'text-xs')}>{deal.company}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <FlagIcon className={`w-3 h-3 ${
                  deal.priority === 'high' ? 'text-red-400' :
                  deal.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`} />
                <span className={`text-xs font-bold ${theme.accent}`}>
                  {Math.round(deal.value / 1000)}K€
                </span>
              </div>
            </div>

            {/* Probability & Value */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={theme.textSecondary}>Probabilité</span>
                <span className={`font-bold ${theme.text}`}>{deal.probability}%</span>
              </div>
              <div className={`w-full bg-gray-700 rounded-full h-2 ${theme.glass}`}>
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-green-400"
                  style={{ width: `${deal.probability}%` }}
                />
              </div>
            </div>

            {/* Contact & Assigned */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2">
                <UserIcon className={`w-3 h-3 ${theme.accent}`} />
                <span className={`text-xs ${theme.textSecondary}`}>
                  {deal.contactPerson.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{deal.assignedTo.avatar}</span>
                <span className={`text-xs ${theme.text}`}>
                  {deal.assignedTo.name.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {deal.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className={getClasses('badge', 'text-xs')}>
                  {tag}
                </span>
              ))}
              {deal.tags.length > 2 && (
                <span className={`text-xs ${theme.textSecondary}`}>
                  +{deal.tags.length - 2}
                </span>
              )}
            </div>

            {/* Next Step */}
            <div className="text-xs">
              <span className={theme.textSecondary}>Prochaine étape:</span>
              <p className={`${theme.text} mt-1 line-clamp-2`}>
                {deal.nextSteps[0]}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );

  return (
    <UltraPremiumContainer
      title="Pipeline Commercial Ultra Premium"
      icon={PresentationChartLineIcon}
    >
      {/* KPIs Dashboard */}
      <div className="grid grid-cols-8 gap-4 mb-6">
        {[
          { label: 'Pipeline Total', value: `${Math.round(kpis.pipelineValue / 1000)}K€`, icon: BriefcaseIcon, gradient: 'from-blue-500 to-indigo-600', change: '+12%' },
          { label: 'Pipeline Pondéré', value: `${Math.round(kpis.weightedPipeline / 1000)}K€`, icon: ChartPieIcon, gradient: 'from-purple-500 to-purple-600', change: '+8%' },
          { label: 'CA Réalisé', value: `${Math.round(kpis.wonValue / 1000)}K€`, icon: TrophyIcon, gradient: 'from-green-500 to-emerald-600', change: '+15%' },
          { label: 'Taux Conversion', value: `${kpis.conversionRate}%`, icon: ArrowTrendingUpIcon, gradient: 'from-yellow-500 to-amber-600', change: '+3pt' },
          { label: 'Deal Moyen', value: `${Math.round(kpis.avgDealSize / 1000)}K€`, icon: BanknotesIcon, gradient: 'from-red-500 to-pink-600', change: '+5%' },
          { label: 'Cycle Moyen', value: `${kpis.avgSalesCycle}j`, icon: ClockIcon, gradient: 'from-cyan-500 to-blue-600', change: '-7j' },
          { label: 'Affaires Actives', value: kpis.activeDeals, icon: FireIcon, gradient: 'from-orange-500 to-red-600', change: '+2' },
          { label: 'Équipe Active', value: salesTeam.length, icon: UsersIcon, gradient: 'from-teal-500 to-cyan-600', change: 'stable' }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={getClasses('card', 'relative overflow-hidden')}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-10`} />
            <div className="relative p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-6 h-6 ${theme.accent}`} />
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  kpi.change.includes('+') ? 'bg-green-100 text-green-700' :
                  kpi.change.includes('-') ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className={`text-2xl font-bold ${theme.text}`}>{kpi.value}</div>
              <div className={`text-xs ${theme.textSecondary} mt-1`}>{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textSecondary}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une affaire..."
              className={getClasses('input', 'pl-10 w-80')}
            />
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'pipeline', label: 'Pipeline', icon: ClipboardDocumentCheckIcon },
              { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
              { id: 'team', label: 'Équipe', icon: UsersIcon }
            ].map((view) => (
              <motion.button
                key={view.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === view.id ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <view.icon className="w-4 h-4" />
                <span>{view.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForecastModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <PresentationChartLineIcon className="w-5 h-5" />
            <span>Prévisions</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTeamManagement(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <UserGroupIcon className="w-5 h-5" />
            <span>Gérer Équipe</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nouvelle Affaire</span>
          </motion.button>
        </div>
      </div>

      {/* Vue Pipeline avec Drag & Drop */}
      {activeView === 'pipeline' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-6 gap-4">
            {pipelineStages.map((stage, stageIndex) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stageIndex * 0.1 }}
                className={getClasses('card', 'min-h-[600px]')}
              >
                {/* En-tête de la colonne */}
                <div className="p-4 border-b border-gray-200">
                  <div className={`w-full h-2 bg-gradient-to-r ${stage.color} rounded-full mb-3`} />
                  <h3 className={`font-bold text-lg ${theme.text} mb-1`}>{stage.name}</h3>
                  <p className={`text-xs ${theme.textSecondary} mb-2`}>{stage.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${theme.accent}`}>
                      {deals.filter(deal => deal.stage === stage.id).length} affaires
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700`}>
                      {stage.probability}%
                    </span>
                  </div>
                  <div className={`text-xs ${theme.textSecondary} mt-1`}>
                    {Math.round(
                      deals
                        .filter(deal => deal.stage === stage.id)
                        .reduce((sum, deal) => sum + deal.value, 0) / 1000
                    )}K€ total
                  </div>
                </div>

                {/* Zone de drop */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-3 min-h-[500px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      }`}
                    >
                      {deals
                        .filter(deal => deal.stage === stage.id)
                        .filter(deal => 
                          searchTerm === '' ||
                          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          deal.company.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((deal, index) => (
                          <DealCard key={deal.id} deal={deal} index={index} />
                        ))}
                      {provided.placeholder}
                      
                      {deals.filter(deal => deal.stage === stage.id).length === 0 && (
                        <div className={`text-center py-8 ${theme.textSecondary}`}>
                          <BriefcaseIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Aucune affaire</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </motion.div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Vue Analytics */}
      {activeView === 'analytics' && (
        <div className="grid grid-cols-2 gap-6">
          <div className={getClasses('card')}>
            <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Répartition Pipeline</h3>
            <div className="h-64">
              <Doughnut data={pipelineChartData} options={{
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
            <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Prévisions Revenus</h3>
            <div className="h-64">
              <Line data={revenueChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    labels: { color: theme.text } 
                  }
                },
                scales: {
                  x: { 
                    grid: { display: false },
                    ticks: { color: theme.textSecondary }
                  },
                  y: { 
                    grid: { color: theme.border },
                    ticks: { color: theme.textSecondary }
                  }
                }
              }} />
            </div>
          </div>

          <div className={getClasses('card')}>
            <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Performance Équipe</h3>
            <div className="h-64">
              <Bar data={teamPerformanceData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    labels: { color: theme.text } 
                  }
                },
                scales: {
                  x: { 
                    grid: { display: false },
                    ticks: { color: theme.textSecondary }
                  },
                  y: { 
                    grid: { color: theme.border },
                    ticks: { color: theme.textSecondary }
                  }
                }
              }} />
            </div>
          </div>

          <div className={getClasses('card')}>
            <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Analyse Conversion</h3>
            <div className="space-y-4">
              {pipelineStages.slice(0, -1).map((stage, idx) => {
                const currentStageDeals = deals.filter(d => d.stage === stage.id).length;
                const nextStage = pipelineStages[idx + 1];
                const nextStageDeals = deals.filter(d => d.stage === nextStage?.id).length;
                const conversionRate = currentStageDeals > 0 ? Math.round((nextStageDeals / currentStageDeals) * 100) : 0;

                return (
                  <div key={stage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className={`font-medium ${theme.text}`}>
                        {stage.name} → {nextStage?.name}
                      </p>
                      <p className={`text-sm ${theme.textSecondary}`}>
                        {currentStageDeals} → {nextStageDeals} affaires
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        conversionRate >= 70 ? 'text-green-600' :
                        conversionRate >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {conversionRate}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Vue Équipe */}
      {activeView === 'team' && (
        <div className="grid grid-cols-2 gap-6">
          {salesTeam.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={getClasses('card', 'cursor-pointer')}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{member.avatar}</div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${theme.text}`}>{member.name}</h3>
                    <p className={`text-sm ${theme.textSecondary}`}>{member.role}</p>
                    <p className={`text-xs ${theme.textSecondary}`}>{member.email}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      member.performance.targetAchievement >= 110 ? 'text-green-600' :
                      member.performance.targetAchievement >= 90 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {member.performance.targetAchievement}%
                    </div>
                    <div className={`text-xs ${theme.textSecondary}`}>Objectif</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${theme.text}`}>
                      {Math.round(member.performance.revenue / 1000)}K€
                    </div>
                    <div className={`text-xs ${theme.textSecondary}`}>CA généré</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${theme.text}`}>
                      {member.performance.conversionRate}%
                    </div>
                    <div className={`text-xs ${theme.textSecondary}`}>Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${theme.text}`}>
                      {member.performance.deals}
                    </div>
                    <div className={`text-xs ${theme.textSecondary}`}>Affaires</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${theme.text}`}>
                      {Math.round(member.performance.avgDealSize / 1000)}K€
                    </div>
                    <div className={`text-xs ${theme.textSecondary}`}>Deal moyen</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className={`text-sm font-medium ${theme.text} mb-2`}>Spécialités</div>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, sIdx) => (
                      <span key={sIdx} className={getClasses('badge', 'text-xs')}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className={theme.textSecondary}>
                    Actives: <span className={`font-bold ${theme.text}`}>{member.dealsActive}</span>
                  </div>
                  <div className={theme.textSecondary}>
                    Gagnées: <span className={`font-bold text-green-600`}>{member.dealsWon}</span>
                  </div>
                  <div className={theme.textSecondary}>
                    Dernière activité: <span className={theme.text}>{member.lastActivity}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Détails Affaire */}
      <AnimatePresence>
        {selectedDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedDeal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'w-full max-w-6xl max-h-[90vh] overflow-y-auto')}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-3xl font-bold ${theme.text} mb-2`}>
                      {selectedDeal.title}
                    </h2>
                    <div className="flex items-center space-x-4">
                      <span className={`text-xl font-bold ${theme.accent}`}>
                        {Math.round(selectedDeal.value / 1000)}K€
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedDeal.priority === 'high' ? 'bg-red-100 text-red-700' :
                        selectedDeal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        Priorité {selectedDeal.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700`}>
                        {selectedDeal.probability}% de réussite
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDeal(null)}
                    className={`text-2xl ${theme.textSecondary} hover:text-red-500 transition-colors`}
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-bold ${theme.text} mb-3`}>Informations Client</h3>
                      <div className={getClasses('glass', 'p-4 rounded-xl space-y-3')}>
                        <div>
                          <label className={`text-sm font-medium ${theme.textSecondary}`}>Entreprise</label>
                          <p className={`font-bold ${theme.text}`}>{selectedDeal.company}</p>
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${theme.textSecondary}`}>Contact principal</label>
                          <p className={`font-medium ${theme.text}`}>{selectedDeal.contactPerson.name}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>{selectedDeal.contactPerson.role}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>{selectedDeal.contactPerson.email}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>{selectedDeal.contactPerson.phone}</p>
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${theme.textSecondary}`}>Localisation</label>
                          <p className={theme.text}>{selectedDeal.location}</p>
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${theme.textSecondary}`}>Surface concernée</label>
                          <p className={theme.text}>{selectedDeal.surface}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${theme.text} mb-3`}>Équipe Assignée</h3>
                      <div className={getClasses('glass', 'p-4 rounded-xl')}>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-3xl">{selectedDeal.assignedTo.avatar}</span>
                          <div>
                            <p className={`font-bold ${theme.text}`}>{selectedDeal.assignedTo.name}</p>
                            <p className={`text-sm ${theme.textSecondary}`}>{selectedDeal.assignedTo.role}</p>
                            <p className={`text-sm font-medium ${
                              selectedDeal.assignedTo.performance >= 90 ? 'text-green-600' :
                              selectedDeal.assignedTo.performance >= 70 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              Performance: {selectedDeal.assignedTo.performance}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-bold ${theme.text} mb-3`}>Détails Commercial</h3>
                      <div className={getClasses('glass', 'p-4 rounded-xl space-y-3')}>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`text-sm font-medium ${theme.textSecondary}`}>Valeur affaire</label>
                            <p className={`text-xl font-bold ${theme.accent}`}>
                              {selectedDeal.value.toLocaleString()}€
                            </p>
                          </div>
                          <div>
                            <label className={`text-sm font-medium ${theme.textSecondary}`}>Budget client</label>
                            <p className={`text-xl font-bold ${theme.text}`}>
                              {selectedDeal.budget.toLocaleString()}€
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${theme.textSecondary}`}>Timeline projet</label>
                          <p className={theme.text}>{selectedDeal.timeline}</p>
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${theme.textSecondary}`}>Date clôture prévue</label>
                          <p className={theme.text}>{new Date(selectedDeal.expectedCloseDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        {selectedDeal.competitors.length > 0 && (
                          <div>
                            <label className={`text-sm font-medium ${theme.textSecondary}`}>Concurrents identifiés</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedDeal.competitors.map((comp, idx) => (
                                <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${theme.text} mb-3`}>Prochaines Étapes</h3>
                      <div className={getClasses('glass', 'p-4 rounded-xl space-y-2')}>
                        {selectedDeal.nextSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className={`mt-1 w-2 h-2 rounded-full ${
                              idx === 0 ? 'bg-red-500' : 'bg-gray-400'
                            }`} />
                            <span className={`text-sm ${theme.text}`}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-bold ${theme.text} mb-3`}>Activités Récentes</h3>
                      <div className={getClasses('glass', 'p-4 rounded-xl space-y-3')}>
                        {selectedDeal.activities.map((activity, idx) => (
                          <div key={idx} className="border-l-2 border-blue-500 pl-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                activity.type === 'call' ? 'bg-blue-100 text-blue-700' :
                                activity.type === 'meeting' ? 'bg-green-100 text-green-700' :
                                activity.type === 'email' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {activity.type}
                              </span>
                              <span className={`text-xs ${theme.textSecondary}`}>{activity.date}</span>
                            </div>
                            <p className={`text-sm ${theme.text}`}>{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${theme.text} mb-3`}>Documents</h3>
                      <div className={getClasses('glass', 'p-4 rounded-xl space-y-2')}>
                        {selectedDeal.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <DocumentTextIcon className={`w-4 h-4 ${theme.accent}`} />
                              <span className={`text-sm ${theme.text}`}>{doc}</span>
                            </div>
                            <button className={`text-xs ${theme.accent} hover:underline`}>
                              Télécharger
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${theme.text} mb-3`}>Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDeal.tags.map((tag, idx) => (
                          <span key={idx} className={getClasses('badge')}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={getClasses('glass', 'px-6 py-3 rounded-xl font-medium')}
                    onClick={() => setSelectedDeal(null)}
                  >
                    Fermer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={getClasses('button', 'px-6 py-3')}
                  >
                    <PencilSquareIcon className="w-5 h-5 mr-2" />
                    Modifier
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default AffairesUltraPremium;