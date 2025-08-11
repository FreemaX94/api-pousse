import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumKPICard } from './OrganipoussV2Premium';
import {
  CurrencyEuroIcon,
  UsersIcon,
  ChartBarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPremium = ({ themeColors }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    // Réduction du délai pour affichage plus rapide
    const timer = setTimeout(() => setAnimateCharts(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Configuration des graphiques avec style premium
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(147, 51, 234, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: themeColors?.textSecondary || '#9CA3AF'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: themeColors?.textSecondary || '#9CA3AF'
        }
      }
    }
  };

  // Données pour le graphique de revenus
  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [{
      label: 'Revenus',
      data: [65000, 72000, 68000, 85000, 92000, 98000, 125000],
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(147, 51, 234)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  // Données pour le graphique des interventions
  const interventionsData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [{
      label: 'Interventions',
      data: [12, 19, 15, 25, 22, 18, 8],
      backgroundColor: [
        'rgba(147, 51, 234, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(163, 163, 163, 0.8)'
      ],
      borderRadius: 8
    }]
  };

  // Données pour le graphique circulaire
  const satisfactionData = {
    labels: ['Très satisfait', 'Satisfait', 'Neutre', 'Insatisfait'],
    datasets: [{
      data: [65, 25, 8, 2],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header avec titre animé et sélecteur de période */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className={`text-3xl font-bold ${themeColors?.text || 'text-white'} flex items-center space-x-2`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <SparklesIcon className="w-8 h-8 text-purple-500" />
            </motion.div>
            <span>Dashboard</span>
          </h1>
          <p className={`${themeColors?.textSecondary || 'text-gray-400'} mt-1`}>
            Vue d'ensemble de votre activité
          </p>
        </div>

        {/* Sélecteur de période animé */}
        <div className="flex space-x-2">
          {['day', 'week', 'month', 'year'].map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : `${themeColors?.text || 'text-white'} hover:bg-white/10`
              }`}
            >
              {period === 'day' && 'Jour'}
              {period === 'week' && 'Semaine'}
              {period === 'month' && 'Mois'}
              {period === 'year' && 'Année'}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Grille de KPIs Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumKPICard
          title="Chiffre d'affaires"
          value="125,000€"
          trend={27.5}
          icon={CurrencyEuroIcon}
          color="from-purple-600 to-pink-600"
          delay={0}
        />
        <PremiumKPICard
          title="Nouveaux clients"
          value="342"
          trend={14.8}
          icon={UsersIcon}
          color="from-blue-600 to-cyan-600"
          delay={0.1}
        />
        <PremiumKPICard
          title="Interventions"
          value="1,247"
          trend={5.7}
          icon={ChartBarIcon}
          color="from-green-600 to-teal-600"
          delay={0.2}
        />
        <PremiumKPICard
          title="Satisfaction"
          value="4.8/5"
          trend={4.3}
          icon={StarIcon}
          color="from-yellow-600 to-orange-600"
          delay={0.3}
        />
      </div>

      {/* Graphiques avec animations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique de revenus */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`lg:col-span-2 ${themeColors?.glass || 'bg-gray-800/50'} 
                     backdrop-blur-xl rounded-2xl p-6 border border-white/10`}
        >
          <h3 className={`text-lg font-semibold ${themeColors?.text || 'text-white'} mb-4`}>
            Évolution du chiffre d'affaires
          </h3>
          <div className="h-64">
            {animateCharts && <Line data={revenueData} options={chartOptions} />}
          </div>
        </motion.div>

        {/* Graphique de satisfaction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`${themeColors?.glass || 'bg-gray-800/50'} 
                     backdrop-blur-xl rounded-2xl p-6 border border-white/10`}
        >
          <h3 className={`text-lg font-semibold ${themeColors?.text || 'text-white'} mb-4`}>
            Satisfaction clients
          </h3>
          <div className="h-64">
            {animateCharts && <Doughnut data={satisfactionData} options={{...chartOptions, maintainAspectRatio: true}} />}
          </div>
        </motion.div>
      </div>

      {/* Section des actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`${themeColors?.glass || 'bg-gray-800/50'} 
                   backdrop-blur-xl rounded-2xl p-6 border border-white/10`}
      >
        <h3 className={`text-lg font-semibold ${themeColors?.text || 'text-white'} mb-4`}>
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Nouveau devis', icon: BoltIcon, color: 'from-purple-600 to-pink-600' },
            { label: 'Planifier intervention', icon: CalendarIcon, color: 'from-blue-600 to-cyan-600' },
            { label: 'Créer facture', icon: CurrencyEuroIcon, color: 'from-green-600 to-teal-600' },
            { label: 'Ajouter client', icon: UsersIcon, color: 'from-orange-600 to-red-600' }
          ].map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden rounded-xl"
            >
              <div className={`bg-gradient-to-r ${action.color} p-4 
                             flex flex-col items-center space-y-2`}>
                <action.icon className="w-8 h-8 text-white" />
                <span className="text-white font-medium text-sm">{action.label}</span>
              </div>
              
              {/* Effet de brillance */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: -200 }}
                whileHover={{ x: 200 }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Alertes et notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alertes importantes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className={`${themeColors?.glass || 'bg-gray-800/50'} 
                     backdrop-blur-xl rounded-2xl p-6 border border-white/10`}
        >
          <h3 className={`text-lg font-semibold ${themeColors?.text || 'text-white'} mb-4 flex items-center space-x-2`}>
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
            <span>Alertes importantes</span>
          </h3>
          <div className="space-y-3">
            {[
              { text: '5 factures en retard de paiement', type: 'danger' },
              { text: '3 devis expirent cette semaine', type: 'warning' },
              { text: 'Maintenance préventive à planifier', type: 'info' }
            ].map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  alert.type === 'danger' ? 'border-red-500/30 bg-red-500/10' :
                  alert.type === 'warning' ? 'border-yellow-500/30 bg-yellow-500/10' :
                  'border-blue-500/30 bg-blue-500/10'
                }`}
              >
                <p className={`text-sm ${themeColors?.text || 'text-white'}`}>{alert.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className={`${themeColors?.glass || 'bg-gray-800/50'} 
                     backdrop-blur-xl rounded-2xl p-6 border border-white/10`}
        >
          <h3 className={`text-lg font-semibold ${themeColors?.text || 'text-white'} mb-4 flex items-center space-x-2`}>
            <ClockIcon className="w-5 h-5 text-purple-500" />
            <span>Activité récente</span>
          </h3>
          <div className="space-y-3">
            {[
              { text: 'Nouveau client : Crystal Tech', time: 'Il y a 2h' },
              { text: 'Intervention terminée chez BNP', time: 'Il y a 4h' },
              { text: 'Devis accepté : 12,450€', time: 'Il y a 6h' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <p className={`text-sm ${themeColors?.text || 'text-white'}`}>{activity.text}</p>
                </div>
                <span className={`text-xs ${themeColors?.textSecondary || 'text-gray-400'}`}>
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPremium;