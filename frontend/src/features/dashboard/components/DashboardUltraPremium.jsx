import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  TrophyIcon,
  BoltIcon,
  SparklesIcon,
  RocketLaunchIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CalendarIcon,
  BellIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CpuChipIcon,
  GlobeAltIcon,
  BanknotesIcon,
  HeartIcon,
  StarIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  FunnelIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';
import confetti from 'canvas-confetti';
import api from '../../../api/clientApi';
import { toast } from 'react-hot-toast';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const DashboardUltraPremium = () => {
  const { theme, getClasses, currentTheme } = useThemeUltraPremium();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [widgets, setWidgets] = useState([
    { id: 'kpi', name: 'Indicateurs clés', visible: true, position: 0, size: 'full' },
    { id: 'revenue', name: 'Graphique revenus', visible: true, position: 1, size: 'large' },
    { id: 'performance', name: 'Performance', visible: true, position: 2, size: 'medium' },
    { id: 'activities', name: 'Activités récentes', visible: true, position: 3, size: 'large' },
    { id: 'achievements', name: 'Achievements', visible: true, position: 4, size: 'medium' }
  ]);
  const [userPreferences, setUserPreferences] = useState(() => {
    const saved = localStorage.getItem('dashboardPreferences');
    return saved ? JSON.parse(saved) : {
      defaultPeriod: 'month',
      autoRefresh: true,
      refreshInterval: 30000,
      theme: currentTheme,
      notifications: true,
      compactMode: false
    };
  });
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [drillDownData, setDrillDownData] = useState(null);
  const wsRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  // Chargement initial et connexion WebSocket
  useEffect(() => {
    fetchDashboardData();
    setupWebSocket();
    
    // Configuration auto-refresh
    if (userPreferences.autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        fetchDashboardData();
      }, userPreferences.refreshInterval);
    }
    
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [selectedPeriod, customDateRange]);

  // Sauvegarde des préférences
  useEffect(() => {
    localStorage.setItem('dashboardPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Configuration WebSocket pour temps réel
  const setupWebSocket = () => {
    // Simulation WebSocket - à remplacer par vraie connexion
    const simulateRealTimeUpdates = () => {
      const interval = setInterval(() => {
        setRealTimeData(prev => ({
          ...prev,
          lastUpdate: new Date().toISOString(),
          activeUsers: Math.floor(Math.random() * 50) + 100,
          liveOrders: Math.floor(Math.random() * 10) + 5
        }));
      }, 5000);
      return () => clearInterval(interval);
    };
    simulateRealTimeUpdates();
  };

  // Récupération des données depuis l'API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const dateRange = getDateRange();
      
      // Simulation API - à remplacer par vrais appels
      // const response = await api.get('/dashboard/stats', { params: dateRange });
      
      // Données simulées avec variation selon la période
      const mockData = generateMockData(dateRange);
      setRealTimeData(mockData);
      
      // Charger données de comparaison
      if (userPreferences.compactMode) {
        const compData = await fetchComparisonData(dateRange);
        setComparisonData(compData);
      }
      
      toast.success('Données mises à jour');
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Calcul de la période sélectionnée
  const getDateRange = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'day':
        return { start: format(now, 'yyyy-MM-dd'), end: format(now, 'yyyy-MM-dd') };
      case 'week':
        return { start: format(subDays(now, 7), 'yyyy-MM-dd'), end: format(now, 'yyyy-MM-dd') };
      case 'month':
        return { start: format(startOfMonth(now), 'yyyy-MM-dd'), end: format(endOfMonth(now), 'yyyy-MM-dd') };
      case 'year':
        return { start: format(startOfYear(now), 'yyyy-MM-dd'), end: format(endOfYear(now), 'yyyy-MM-dd') };
      case 'custom':
        return customDateRange;
      default:
        return { start: format(startOfMonth(now), 'yyyy-MM-dd'), end: format(endOfMonth(now), 'yyyy-MM-dd') };
    }
  };

  // Génération de données mock
  const generateMockData = (dateRange) => {
    const multiplier = selectedPeriod === 'year' ? 12 : selectedPeriod === 'month' ? 30 : selectedPeriod === 'week' ? 7 : 1;
    return {
      revenue: 125430 * multiplier,
      orders: 1832 * multiplier,
      clients: 248 + Math.floor(Math.random() * 50),
      satisfaction: 4.8,
      trends: {
        revenue: +12.5,
        orders: +15.3,
        clients: +8.2,
        satisfaction: +0.3
      }
    };
  };

  // Récupération données de comparaison
  const fetchComparisonData = async (dateRange) => {
    // Simulation comparaison avec période précédente
    return {
      previousRevenue: 110000,
      previousOrders: 1590,
      previousClients: 229,
      previousSatisfaction: 4.5
    };
  };

  // Export des KPIs
  const exportDashboard = (format) => {
    const data = {
      period: selectedPeriod,
      dateRange: getDateRange(),
      kpis: mainKPIs,
      revenue: realTimeData?.revenue || 0,
      generated: new Date().toISOString()
    };
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard_${format(new Date(), 'yyyy-MM-dd')}.json`;
      a.click();
      toast.success('Export JSON réussi');
    } else if (format === 'csv') {
      const csv = [
        ['Indicateur', 'Valeur', 'Tendance'],
        ...mainKPIs.map(kpi => [kpi.title, kpi.value, kpi.trend])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      toast.success('Export CSV réussi');
    } else if (format === 'pdf') {
      toast.info('Export PDF en cours de développement');
    }
  };

  // Drill-down sur un KPI
  const handleDrillDown = async (kpi) => {
    setSelectedKPI(kpi);
    setLoading(true);
    try {
      // Simulation chargement détails
      setTimeout(() => {
        setDrillDownData({
          title: kpi.title,
          details: generateDrillDownData(kpi),
          breakdown: [
            { label: 'Segment A', value: 40, color: 'blue' },
            { label: 'Segment B', value: 30, color: 'green' },
            { label: 'Segment C', value: 20, color: 'yellow' },
            { label: 'Autres', value: 10, color: 'gray' }
          ]
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error('Erreur lors du chargement des détails');
      setLoading(false);
    }
  };

  // Génération données drill-down
  const generateDrillDownData = (kpi) => {
    const days = selectedPeriod === 'month' ? 30 : selectedPeriod === 'week' ? 7 : 365;
    return Array.from({ length: days }, (_, i) => ({
      date: format(subDays(new Date(), days - i), 'dd/MM'),
      value: Math.floor(Math.random() * 1000) + 500
    }));
  };

  // Gestion widgets
  const toggleWidget = (widgetId) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ));
  };

  const reorderWidgets = (newOrder) => {
    setWidgets(newOrder);
  };

  // Déclencher des confettis pour les achievements
  const triggerAchievement = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF00FF', '#00FFFF', '#FFD700']
    });
  };

  // KPIs principaux avec données temps réel
  const mainKPIs = [
    {
      id: 'revenue',
      title: 'Chiffre d\'Affaires',
      value: realTimeData ? `€${realTimeData.revenue.toLocaleString()}` : '€125,430',
      previousValue: comparisonData?.previousRevenue,
      trend: realTimeData?.trends?.revenue ? `${realTimeData.trends.revenue > 0 ? '+' : ''}${realTimeData.trends.revenue}%` : '+12.5%',
      isUp: realTimeData?.trends?.revenue > 0,
      icon: CurrencyEuroIcon,
      gradient: 'from-green-500 to-emerald-600',
      sparkline: [45, 52, 48, 61, 58, 65, 72],
      drillDownEnabled: true
    },
    {
      id: 'clients',
      title: 'Nouveaux Clients',
      value: realTimeData?.clients || '248',
      previousValue: comparisonData?.previousClients,
      trend: realTimeData?.trends?.clients ? `${realTimeData.trends.clients > 0 ? '+' : ''}${realTimeData.trends.clients}%` : '+8.2%',
      isUp: realTimeData?.trends?.clients > 0,
      icon: UserGroupIcon,
      gradient: 'from-blue-500 to-indigo-600',
      sparkline: [30, 35, 32, 38, 42, 45, 48],
      drillDownEnabled: true
    },
    {
      id: 'orders',
      title: 'Commandes',
      value: realTimeData?.orders?.toLocaleString() || '1,832',
      previousValue: comparisonData?.previousOrders,
      trend: realTimeData?.trends?.orders ? `${realTimeData.trends.orders > 0 ? '+' : ''}${realTimeData.trends.orders}%` : '+15.3%',
      isUp: realTimeData?.trends?.orders > 0,
      icon: ShoppingCartIcon,
      gradient: 'from-purple-500 to-pink-600',
      sparkline: [58, 62, 65, 70, 68, 75, 82],
      drillDownEnabled: true
    },
    {
      id: 'satisfaction',
      title: 'Satisfaction',
      value: realTimeData?.satisfaction ? `${realTimeData.satisfaction}/5` : '4.8/5',
      previousValue: comparisonData?.previousSatisfaction,
      trend: realTimeData?.trends?.satisfaction ? `${realTimeData.trends.satisfaction > 0 ? '+' : ''}${realTimeData.trends.satisfaction}` : '+0.3',
      isUp: realTimeData?.trends?.satisfaction > 0,
      icon: StarIcon,
      gradient: 'from-yellow-500 to-orange-600',
      sparkline: [4.5, 4.6, 4.5, 4.7, 4.7, 4.8, 4.8],
      drillDownEnabled: false
    }
  ];

  // Activités récentes
  const recentActivities = [
    { type: 'order', message: 'Nouvelle commande #1832', time: 'Il y a 5 min', icon: ShoppingCartIcon, color: 'text-blue-500' },
    { type: 'client', message: 'Nouveau client VIP inscrit', time: 'Il y a 15 min', icon: UserGroupIcon, color: 'text-green-500' },
    { type: 'payment', message: 'Paiement reçu €5,240', time: 'Il y a 1h', icon: BanknotesIcon, color: 'text-emerald-500' },
    { type: 'delivery', message: 'Livraison complétée #1825', time: 'Il y a 2h', icon: TruckIcon, color: 'text-purple-500' },
    { type: 'alert', message: 'Stock faible: Produit XYZ', time: 'Il y a 3h', icon: ExclamationTriangleIcon, color: 'text-yellow-500' }
  ];

  // Achievements
  const achievements = [
    { title: '1000 Ventes', icon: TrophyIcon, unlocked: true, progress: 100 },
    { title: 'Client Fidèle', icon: HeartIcon, unlocked: true, progress: 100 },
    { title: 'Top Vendeur', icon: FireIcon, unlocked: false, progress: 85 },
    { title: 'Expert 2024', icon: RocketLaunchIcon, unlocked: false, progress: 65 }
  ];

  // Configuration des graphiques
  const chartColors = {
    primary: currentTheme === 'neon' ? 'rgba(0, 255, 255, 1)' : 
            currentTheme === 'galaxy' ? 'rgba(147, 51, 234, 1)' :
            'rgba(59, 130, 246, 1)',
    secondary: currentTheme === 'neon' ? 'rgba(255, 0, 255, 1)' :
              currentTheme === 'galaxy' ? 'rgba(168, 85, 247, 1)' :
              'rgba(99, 102, 241, 1)'
  };

  const revenueChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [{
      label: 'Revenus 2024',
      data: [65000, 72000, 68000, 85000, 92000, 98000, 125430],
      borderColor: chartColors.primary,
      backgroundColor: chartColors.primary.replace('1)', '0.1)'),
      tension: 0.4,
      fill: true
    }]
  };

  const performanceRadarData = {
    labels: ['Ventes', 'Marketing', 'Service', 'Qualité', 'Innovation', 'Efficacité'],
    datasets: [{
      label: 'Performance',
      data: [88, 92, 85, 94, 78, 90],
      backgroundColor: chartColors.secondary.replace('1)', '0.3)'),
      borderColor: chartColors.secondary,
      borderWidth: 2
    }]
  };

  const KPICard = ({ kpi }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={() => kpi.drillDownEnabled && handleDrillDown(kpi)}
      className={`${getClasses('card', 'relative overflow-hidden')} ${kpi.drillDownEnabled ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-10`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className={`text-sm ${theme.textSecondary} mb-1`}>{kpi.title}</p>
            <h3 className={`text-3xl font-bold ${theme.text}`}>{kpi.value}</h3>
            {kpi.previousValue && comparisonData && (
              <p className={`text-xs ${theme.textSecondary} mt-1`}>
                vs {kpi.previousValue.toLocaleString()} (période préc.)
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.gradient} bg-opacity-20`}>
              <kpi.icon className={`w-6 h-6 ${theme.accent}`} />
            </div>
            {kpi.drillDownEnabled && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={getClasses('glass', 'p-2 rounded-lg')}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDrillDown(kpi);
                }}
              >
                <ArrowsPointingOutIcon className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 text-sm ${kpi.isUp ? 'text-green-500' : 'text-red-500'}`}>
            {kpi.isUp ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
            <span>{kpi.trend}</span>
          </div>
          
          {/* Mini sparkline */}
          <div className="h-8 w-24">
            <Line
              data={{
                labels: kpi.sparkline.map((_, i) => i),
                datasets: [{
                  data: kpi.sparkline,
                  borderColor: kpi.isUp ? 'rgba(52, 211, 153, 1)' : 'rgba(239, 68, 68, 1)',
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
        
        {/* Indicateur temps réel */}
        {realTimeData?.lastUpdate && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Effet de lueur au hover */}
      {theme.neon && (
        <div className={`absolute -inset-1 bg-gradient-to-r ${kpi.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`} />
      )}
    </motion.div>
  );

  return (
    <UltraPremiumContainer
      title="Dashboard Ultra Premium"
      icon={ChartBarIcon}
    >
      {/* Barre d'actions rapides */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2 items-center">
          {['day', 'week', 'month', 'year', 'custom'].map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedPeriod(period);
                if (period === 'custom') setShowCustomDatePicker(true);
              }}
              className={selectedPeriod === period ? 
                getClasses('button', 'px-4 py-2 text-sm') : 
                getClasses('glass', 'px-4 py-2 rounded-xl text-sm font-medium')}
            >
              {period === 'day' ? 'Jour' : 
               period === 'week' ? 'Semaine' :
               period === 'month' ? 'Mois' : 
               period === 'year' ? 'Année' : 
               <CalendarDaysIcon className="w-4 h-4" />}
            </motion.button>
          ))}
          
          {/* Comparaison périodes */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUserPreferences(prev => ({ ...prev, compactMode: !prev.compactMode }))}
            className={userPreferences.compactMode ? 
              getClasses('button', 'px-3 py-2 text-sm flex items-center gap-1') : 
              getClasses('glass', 'px-3 py-2 rounded-xl text-sm')}
          >
            <ChartPieIcon className="w-4 h-4" />
            Comparer
          </motion.button>
        </div>

        <div className="flex gap-3">
          {/* Export */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={getClasses('glass', 'p-2 rounded-xl')}
            >
              <ArrowDownTrayIcon className={`w-5 h-5 ${theme.accent}`} />
            </motion.button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button 
                onClick={() => exportDashboard('csv')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              >
                Export CSV
              </button>
              <button 
                onClick={() => exportDashboard('json')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export JSON
              </button>
              <button 
                onClick={() => exportDashboard('pdf')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
              >
                Export PDF
              </button>
            </div>
          </div>
          
          {/* Refresh */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchDashboardData}
            className={getClasses('glass', 'p-2 rounded-xl')}
            disabled={loading}
          >
            <ArrowPathIcon className={`w-5 h-5 ${theme.accent} ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
          
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className={getClasses('glass', 'p-2 rounded-xl relative')}
          >
            <BellIcon className={`w-5 h-5 ${theme.accent}`} />
            {realTimeData?.liveOrders > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {realTimeData.liveOrders}
              </span>
            )}
          </motion.button>
          
          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className={getClasses('glass', 'p-2 rounded-xl')}
          >
            <Cog6ToothIcon className={`w-5 h-5 ${theme.accent}`} />
          </motion.button>
          
          {/* Personnalisation widgets */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={getClasses('glass', 'p-2 rounded-xl')}
          >
            <ViewColumnsIcon className={`w-5 h-5 ${theme.accent}`} />
          </motion.button>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {loading && (
        <div className="fixed top-4 right-4 z-50">
          <div className={getClasses('glass', 'px-4 py-2 rounded-lg flex items-center gap-2')}>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className={theme.text}>Mise à jour...</span>
          </div>
        </div>
      )}

      {/* KPIs principaux avec widgets personnalisables */}
      {widgets.find(w => w.id === 'kpi')?.visible && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          {mainKPIs.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      )}

      {/* Graphiques principaux avec widgets */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Graphique des revenus */}
        {widgets.find(w => w.id === 'revenue')?.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={getClasses('card', 'col-span-2 relative')}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-lg font-bold ${theme.text}`}>Évolution des Revenus</h3>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDrillDown({ title: 'Revenus', id: 'revenue' })}
                  className={getClasses('glass', 'p-1 rounded')}
                >
                  <ArrowsPointingOutIcon className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWidget('revenue')}
                  className={getClasses('glass', 'p-1 rounded')}
                >
                  <XMarkIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            <div className="h-64">
              <Line 
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  onClick: (event, elements) => {
                    if (elements.length > 0) {
                      const index = elements[0].index;
                      const label = revenueChartData.labels[index];
                      toast.info(`Détails pour ${label}`);
                    }
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `Revenus: €${context.parsed.y.toLocaleString()}`
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: theme.textSecondary }
                    },
                    y: {
                      grid: { color: theme.border },
                      ticks: { 
                        color: theme.textSecondary,
                        callback: (value) => '€' + value.toLocaleString()
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Radar de performance */}
        {widgets.find(w => w.id === 'performance')?.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={getClasses('card', 'relative')}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-lg font-bold ${theme.text}`}>Performance Globale</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWidget('performance')}
                className={getClasses('glass', 'p-1 rounded')}
              >
                <XMarkIcon className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="h-64">
              <Radar
                data={performanceRadarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      grid: { color: theme.border },
                      ticks: {
                        color: theme.textSecondary,
                        backdropColor: 'transparent'
                      },
                      suggestedMin: 0,
                      suggestedMax: 100
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Activités et Achievements */}
      <div className="grid grid-cols-3 gap-6">
        {/* Activités récentes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={getClasses('card', 'col-span-2')}
        >
          <h3 className={`text-lg font-bold ${theme.text} mb-4 flex items-center gap-2`}>
            <ClockIcon className="w-5 h-5" />
            Activités Récentes
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.message}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className={getClasses('glass', 'p-3 rounded-lg flex items-center gap-3')}
              >
                <div className={`p-2 rounded-lg ${theme.glass}`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className={theme.text}>{activity.message}</p>
                  <p className={`text-xs ${theme.textSecondary}`}>{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={getClasses('card')}
        >
          <h3 className={`text-lg font-bold ${theme.text} mb-4 flex items-center gap-2`}>
            <TrophyIcon className="w-5 h-5" />
            Achievements
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => achievement.unlocked && triggerAchievement()}
                className={`${getClasses('glass', 'p-3 rounded-lg cursor-pointer')} ${
                  !achievement.unlocked && 'opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 
                    `bg-gradient-to-br ${theme.primary}` : 
                    theme.glass
                  }`}>
                    <achievement.icon className={`w-5 h-5 ${
                      achievement.unlocked ? 'text-white' : theme.textSecondary
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${theme.text}`}>{achievement.title}</p>
                    <div className="mt-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${
                          achievement.unlocked ? theme.primary : 'from-gray-500 to-gray-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`fixed right-0 top-0 h-full w-80 ${theme.card} ${theme.border} border-l shadow-2xl z-50 p-6`}
          >
            <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Notifications</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.message} className={getClasses('glass', 'p-3 rounded-lg')}>
                  <p className={`text-sm ${theme.text}`}>{activity.message}</p>
                  <p className={`text-xs ${theme.textSecondary} mt-1`}>{activity.time}</p>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(false)}
              className={getClasses('button', 'w-full mt-4')}
            >
              Fermer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'w-full max-w-2xl mx-4')}
            >
              <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Paramètres du Dashboard</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={theme.text}>Actualisation automatique</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserPreferences(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
                    className={userPreferences.autoRefresh ? 
                      getClasses('button', 'px-4 py-2 text-sm') : 
                      getClasses('glass', 'px-4 py-2 rounded-xl text-sm')}
                  >
                    {userPreferences.autoRefresh ? 'Activé' : 'Désactivé'}
                  </motion.button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={theme.text}>Intervalle d'actualisation</span>
                  <select 
                    value={userPreferences.refreshInterval}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                    className={getClasses('glass', 'px-4 py-2 rounded-xl')}
                  >
                    <option value="10000">10 secondes</option>
                    <option value="30000">30 secondes</option>
                    <option value="60000">1 minute</option>
                    <option value="300000">5 minutes</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={theme.text}>Notifications</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
                    className={userPreferences.notifications ? 
                      getClasses('button', 'px-4 py-2 text-sm') : 
                      getClasses('glass', 'px-4 py-2 rounded-xl text-sm')}
                  >
                    {userPreferences.notifications ? 'Activées' : 'Désactivées'}
                  </motion.button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={theme.text}>Période par défaut</span>
                  <select 
                    value={userPreferences.defaultPeriod}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, defaultPeriod: e.target.value }))}
                    className={getClasses('glass', 'px-4 py-2 rounded-xl')}
                  >
                    <option value="day">Jour</option>
                    <option value="week">Semaine</option>
                    <option value="month">Mois</option>
                    <option value="year">Année</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    localStorage.removeItem('dashboardPreferences');
                    window.location.reload();
                  }}
                  className={getClasses('glass', 'px-6 py-3 rounded-xl')}
                >
                  Réinitialiser
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(false)}
                  className={getClasses('button', 'px-6 py-3')}
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Drill-down */}
      <AnimatePresence>
        {selectedKPI && drillDownData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => {
              setSelectedKPI(null);
              setDrillDownData(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto')}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className={`text-xl font-bold ${theme.text}`}>Détails: {drillDownData.title}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSelectedKPI(null);
                    setDrillDownData(null);
                  }}
                  className={getClasses('glass', 'p-2 rounded-xl')}
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Graphique détaillé */}
              <div className="h-64 mb-6">
                <Line
                  data={{
                    labels: drillDownData.details.map(d => d.date),
                    datasets: [{
                      label: drillDownData.title,
                      data: drillDownData.details.map(d => d.value),
                      borderColor: chartColors.primary,
                      backgroundColor: chartColors.primary.replace('1)', '0.1)'),
                      tension: 0.4,
                      fill: true
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
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
                  }}
                />
              </div>
              
              {/* Répartition */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold ${theme.text} mb-3`}>Répartition par segment</h4>
                  <div className="h-48">
                    <Doughnut
                      data={{
                        labels: drillDownData.breakdown.map(b => b.label),
                        datasets: [{
                          data: drillDownData.breakdown.map(b => b.value),
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(251, 191, 36, 0.8)',
                            'rgba(156, 163, 175, 0.8)'
                          ]
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: { color: theme.text }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-semibold ${theme.text} mb-3`}>Statistiques</h4>
                  <div className="space-y-3">
                    <div className={getClasses('glass', 'p-3 rounded-lg')}>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>Moyenne</span>
                        <span className={`font-semibold ${theme.text}`}>
                          {Math.floor(drillDownData.details.reduce((a, b) => a + b.value, 0) / drillDownData.details.length).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className={getClasses('glass', 'p-3 rounded-lg')}>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>Maximum</span>
                        <span className={`font-semibold ${theme.text}`}>
                          {Math.max(...drillDownData.details.map(d => d.value)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className={getClasses('glass', 'p-3 rounded-lg')}>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>Minimum</span>
                        <span className={`font-semibold ${theme.text}`}>
                          {Math.min(...drillDownData.details.map(d => d.value)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className={getClasses('glass', 'p-3 rounded-lg')}>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>Total</span>
                        <span className={`font-semibold ${theme.text}`}>
                          {drillDownData.details.reduce((a, b) => a + b.value, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default DashboardUltraPremium;