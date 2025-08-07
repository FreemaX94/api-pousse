import React from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyEuroIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useExpenseStats, useExpensesByCategory, usePendingExpenses } from '../../hooks/useExpenses';
import { useInvoices } from '../../hooks/useExpenses';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AccountingStats = () => {
  const { data: expenseStats, isLoading: statsLoading } = useExpenseStats();
  const { data: expensesByCategory, isLoading: categoryLoading } = useExpensesByCategory();
  const { data: pendingExpenses, isLoading: pendingLoading } = usePendingExpenses();
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices({ limit: 1000 });

  if (statsLoading || categoryLoading || pendingLoading || invoicesLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const invoices = invoicesData?.data?.invoices || [];
  const totalInvoices = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalExpenses = expenseStats?.[0]?.totalExpenses || 0;
  const expenseCount = expenseStats?.[0]?.count || 0;
  const avgExpense = expenseStats?.[0]?.avgExpense || 0;

  // Calculer le bénéfice/perte
  const profit = totalInvoices - totalExpenses;
  const profitPercentage = totalInvoices > 0 ? ((profit / totalInvoices) * 100) : 0;

  const statsCards = [
    {
      title: 'Revenus (Factures)',
      value: totalInvoices.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: '+12%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Dépenses totales',
      value: totalExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
      icon: ArrowTrendingDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      subtitle: `${expenseCount} dépenses`,
      trend: '+8%',
      trendColor: 'text-red-600'
    },
    {
      title: profit >= 0 ? 'Bénéfice net' : 'Perte nette',
      value: Math.abs(profit).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
      icon: profit >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      color: profit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: profit >= 0 ? 'bg-green-50' : 'bg-red-50',
      borderColor: profit >= 0 ? 'border-green-200' : 'border-red-200',
      subtitle: `${profitPercentage.toFixed(1)}% du CA`,
      trend: profit >= 0 ? '+5%' : '-2%',
      trendColor: profit >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'En attente d\'approbation',
      value: pendingExpenses?.length || 0,
      icon: ExclamationTriangleIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      subtitle: 'Dépenses à valider'
    }
  ];

  // Préparer les données pour le graphique des catégories
  const categoryColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
  ];

  const categoryChartData = (expensesByCategory || []).map((cat, index) => ({
    name: cat._id,
    value: cat.totalAmount,
    count: cat.count,
    color: categoryColors[index % categoryColors.length]
  }));

  // Données pour le graphique mensuel (simulation pour l'exemple)
  const monthlyData = [
    { month: 'Jan', revenus: 15000, depenses: 8000 },
    { month: 'Fév', revenus: 18000, depenses: 9500 },
    { month: 'Mar', revenus: 22000, depenses: 11000 },
    { month: 'Avr', revenus: 19000, depenses: 10200 },
    { month: 'Mai', revenus: 25000, depenses: 12500 },
    { month: 'Jun', revenus: 28000, depenses: 13800 }
  ];

  return (
    <div className="space-y-8 mb-8">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, shadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              className={`bg-white rounded-xl p-6 shadow-sm border-l-4 border-r border-t border-b border-gray-200 ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500">
                      {stat.subtitle}
                    </p>
                  )}
                  {stat.trend && (
                    <p className={`text-xs ${stat.trendColor} mt-1`}>
                      {stat.trend} vs mois dernier
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Évolution mensuelle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Évolution mensuelle</h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white'
                  }}
                  formatter={(value) => [
                    value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
                    ''
                  ]}
                />
                <Legend />
                <Bar dataKey="revenus" name="Revenus" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="depenses" name="Dépenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Répartition par catégorie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Dépenses par catégorie</h3>
            <CurrencyEuroIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-80">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [
                      value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
                      'Montant'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Indicateurs supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">Dépense moyenne</h4>
            <DocumentTextIcon className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {avgExpense.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Par dépense</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">Taux d'approbation</h4>
            <CheckCircleIcon className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-green-600">92%</p>
          <p className="text-xs text-gray-500 mt-1">Ce mois-ci</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">Délai moyen</h4>
            <CalendarIcon className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600">2.3 jours</p>
          <p className="text-xs text-gray-500 mt-1">Pour approbation</p>
        </motion.div>
      </div>

      {/* Alerte si des dépenses sont en attente */}
      {pendingExpenses && pendingExpenses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6"
        >
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Dépenses en attente d'approbation
              </h3>
              <p className="text-sm text-orange-800 mb-3">
                {pendingExpenses.length} dépense{pendingExpenses.length > 1 ? 's' : ''} 
                {pendingExpenses.length > 1 ? ' nécessitent' : ' nécessite'} votre attention.
              </p>
              <div className="flex flex-wrap gap-2">
                {pendingExpenses.slice(0, 3).map((expense) => (
                  <span 
                    key={expense._id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800"
                  >
                    {expense.description.substring(0, 30)}... - 
                    {expense.amount.toLocaleString('fr-FR', { style: 'currency', currency: expense.currency })}
                  </span>
                ))}
                {pendingExpenses.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-200 text-orange-900">
                    +{pendingExpenses.length - 3} autres
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AccountingStats;