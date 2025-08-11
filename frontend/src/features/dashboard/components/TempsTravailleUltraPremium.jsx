import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  Battery100Icon,
  SignalIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  StarIcon,
  LightBulbIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const TempsTravailleUltraPremium = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [viewMode, setViewMode] = useState('overview');
  const [realTimeUpdate, setRealTimeUpdate] = useState(new Date());
  const [animateValues, setAnimateValues] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRealTimeUpdate(new Date());
      setAnimateValues(true);
      setTimeout(() => setAnimateValues(false), 1000);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Données des employés avec temps détaillé
  const employeesTime = [
    {
      id: 1,
      name: 'Marc Leblanc',
      avatar: '👨‍🔧',
      role: 'Chef d\'équipe',
      status: 'active',
      currentTask: 'Élagage parc municipal',
      todayHours: 7.5,
      weekHours: 38.5,
      monthHours: 152,
      overtime: 2.5,
      productivity: 94,
      tasksCompleted: 12,
      revenue: 4250,
      satisfaction: 4.8,
      breaks: { coffee: 2, lunch: 1 },
      efficiency: 'excellent',
      projects: ['Parc Municipal', 'Villa Moderne', 'Jardin Zen']
    },
    {
      id: 2,
      name: 'Paul Moreau',
      avatar: '👷',
      role: 'Technicien senior',
      status: 'active',
      currentTask: 'Installation système arrosage',
      todayHours: 6.25,
      weekHours: 35,
      monthHours: 140,
      overtime: 0,
      productivity: 88,
      tasksCompleted: 10,
      revenue: 3200,
      satisfaction: 4.6,
      breaks: { coffee: 1, lunch: 1 },
      efficiency: 'good',
      projects: ['Villa Moderne', 'Résidence Harmony']
    },
    {
      id: 3,
      name: 'Luc Bernard',
      avatar: '🧑‍🌾',
      role: 'Spécialiste diagnostic',
      status: 'break',
      currentTask: 'Pause déjeuner',
      todayHours: 4,
      weekHours: 32,
      monthHours: 128,
      overtime: 0,
      productivity: 92,
      tasksCompleted: 8,
      revenue: 2800,
      satisfaction: 4.9,
      breaks: { coffee: 3, lunch: 1 },
      efficiency: 'excellent',
      projects: ['Jardin Botanique', 'Diagnostic Villa']
    },
    {
      id: 4,
      name: 'Jean Durand',
      avatar: '👨‍🌾',
      role: 'Technicien',
      status: 'inactive',
      currentTask: 'Terminé',
      todayHours: 8,
      weekHours: 40,
      monthHours: 160,
      overtime: 0,
      productivity: 85,
      tasksCompleted: 15,
      revenue: 2400,
      satisfaction: 4.5,
      breaks: { coffee: 2, lunch: 1 },
      efficiency: 'standard',
      projects: ['Entretien Résidence', 'Tonte municipale']
    },
    {
      id: 5,
      name: 'Pierre Martin',
      avatar: '👨‍💼',
      role: 'Technicien junior',
      status: 'active',
      currentTask: 'Création massif floral',
      todayHours: 5.75,
      weekHours: 28,
      monthHours: 112,
      overtime: 0,
      productivity: 78,
      tasksCompleted: 6,
      revenue: 1800,
      satisfaction: 4.3,
      breaks: { coffee: 1, lunch: 1 },
      efficiency: 'improving',
      projects: ['Massif TechCorp', 'Jardin privé']
    }
  ];

  // Stats globales
  const globalStats = {
    totalHoursToday: employeesTime.reduce((acc, emp) => acc + emp.todayHours, 0),
    totalHoursWeek: employeesTime.reduce((acc, emp) => acc + emp.weekHours, 0),
    totalHoursMonth: employeesTime.reduce((acc, emp) => acc + emp.monthHours, 0),
    totalOvertime: employeesTime.reduce((acc, emp) => acc + emp.overtime, 0),
    avgProductivity: Math.round(employeesTime.reduce((acc, emp) => acc + emp.productivity, 0) / employeesTime.length),
    totalRevenue: employeesTime.reduce((acc, emp) => acc + emp.revenue, 0),
    activeEmployees: employeesTime.filter(emp => emp.status === 'active').length,
    totalTasks: employeesTime.reduce((acc, emp) => acc + emp.tasksCompleted, 0)
  };

  // Graphique évolution heures
  const hoursEvolution = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Heures travaillées',
        data: [42, 45, 43, 48, 46, 20, 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Heures supplémentaires',
        data: [2, 3, 1, 4, 3, 0, 0],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Distribution par projet
  const projectDistribution = {
    labels: ['Élagage', 'Installation', 'Entretien', 'Création', 'Diagnostic'],
    datasets: [{
      data: [45, 28, 52, 38, 25],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(147, 51, 234, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Radar de productivité
  const productivityRadar = {
    labels: ['Efficacité', 'Rapidité', 'Qualité', 'Ponctualité', 'Satisfaction', 'Rentabilité'],
    datasets: [{
      label: 'Performance globale',
      data: [92, 85, 94, 88, 91, 87],
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(147, 51, 234)'
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'break': return 'from-yellow-500 to-amber-500';
      case 'inactive': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getEfficiencyBadge = (efficiency) => {
    switch(efficiency) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'standard': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'improving': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Futuriste */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation de fond */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-ping" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <ClockIcon className="w-8 h-8 mr-3 animate-spin-slow" />
                Temps Travaillé Quantum
              </h1>
              <p className="text-blue-100">Analyse temporelle et productivité en temps réel</p>
              
              {/* Indicateurs temps réel */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Tracking actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Productivité: {globalStats.avgProductivity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalIcon className="w-5 h-5" />
                  <span className="text-sm">Synchronisation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Mode optimisé</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {globalStats.totalHoursToday.toFixed(1)}h
              </div>
              <div className="text-blue-100">Heures aujourd'hui</div>
              <div className="mt-3 flex items-center justify-end space-x-3">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {globalStats.activeEmployees} actifs
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Heures jour', value: `${globalStats.totalHoursToday.toFixed(1)}h`, icon: '⏰', color: 'from-blue-500 to-indigo-500' },
          { label: 'Heures semaine', value: `${globalStats.totalHoursWeek}h`, icon: '📅', color: 'from-purple-500 to-pink-500' },
          { label: 'Heures mois', value: `${globalStats.totalHoursMonth}h`, icon: '📆', color: 'from-cyan-500 to-blue-500' },
          { label: 'Heures sup.', value: `${globalStats.totalOvertime}h`, icon: '⚡', color: 'from-red-500 to-orange-500', pulse: globalStats.totalOvertime > 0 },
          { label: 'Productivité', value: `${globalStats.avgProductivity}%`, icon: '📊', color: 'from-green-500 to-emerald-500' },
          { label: 'CA généré', value: `${globalStats.totalRevenue}€`, icon: '💰', color: 'from-yellow-500 to-amber-500' },
          { label: 'Tâches', value: globalStats.totalTasks, icon: '✅', color: 'from-indigo-500 to-purple-500' },
          { label: 'Équipe', value: `${globalStats.activeEmployees}/${employeesTime.length}`, icon: '👥', color: 'from-gray-500 to-gray-600' }
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
              <div className={`text-xl font-bold text-gray-900 flex items-center ${animateValues ? 'animate-pulse' : ''}`}>
                {kpi.icon} {kpi.value}
                {kpi.pulse && <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </div>
              <div className="text-xs text-gray-600">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sélecteurs et filtres */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Sélection période */}
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>

            {/* Sélection employé */}
            <select 
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Tous les employés</option>
              {employeesTime.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>

            {/* Mode d'affichage */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1 rounded ${viewMode === 'overview' ? 'bg-white shadow' : ''}`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1 rounded ${viewMode === 'detailed' ? 'bg-white shadow' : ''}`}
              >
                Détails
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1 rounded ${viewMode === 'analytics' ? 'bg-white shadow' : ''}`}
              >
                Analytique
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <DocumentArrowDownIcon className="w-5 h-5 inline mr-2" />
              Export
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des employés avec temps */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2" />
                Suivi Temps par Employé
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {employeesTime.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header employé */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{employee.avatar}</div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{employee.name}</h4>
                          <p className="text-sm text-gray-600">{employee.role}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(employee.status)}`}>
                          {employee.status === 'active' ? 'Actif' : employee.status === 'break' ? 'Pause' : 'Inactif'}
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getEfficiencyBadge(employee.efficiency)}`}>
                        {employee.efficiency}
                      </span>
                    </div>

                    {/* Tâche actuelle */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {employee.status === 'active' ? (
                            <PlayIcon className="w-4 h-4 text-green-500 animate-pulse" />
                          ) : employee.status === 'break' ? (
                            <PauseIcon className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <StopIcon className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">{employee.currentTask}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{employee.todayHours}h</span>
                      </div>
                    </div>

                    {/* Statistiques temps */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{employee.todayHours}h</div>
                        <div className="text-xs text-gray-500">Aujourd'hui</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{employee.weekHours}h</div>
                        <div className="text-xs text-gray-500">Semaine</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{employee.monthHours}h</div>
                        <div className="text-xs text-gray-500">Mois</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{employee.overtime}h</div>
                        <div className="text-xs text-gray-500">Heures sup.</div>
                      </div>
                    </div>

                    {/* Indicateurs performance */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <ChartBarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Prod: {employee.productivity}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{employee.tasksCompleted} tâches</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CurrencyEuroIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{employee.revenue}€</span>
                      </div>
                    </div>

                    {/* Barre de productivité */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Productivité</span>
                        <span className="font-semibold">{employee.productivity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            employee.productivity >= 90 ? 'from-green-500 to-emerald-500' :
                            employee.productivity >= 75 ? 'from-blue-500 to-indigo-500' :
                            employee.productivity >= 60 ? 'from-yellow-500 to-amber-500' :
                            'from-red-500 to-orange-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${employee.productivity}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Projets et satisfaction */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{employee.projects.length} projets</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold">{employee.satisfaction}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          {/* Évolution des heures */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Hebdomadaire</h3>
            <div className="h-48">
              <Line
                data={hoursEvolution}
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
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Distribution par type */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Type</h3>
            <div className="h-48">
              <Doughnut
                data={projectDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 10,
                        usePointStyle: true,
                        font: { size: 10 }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Radar de productivité */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Globale</h3>
            <div className="h-48">
              <Radar
                data={productivityRadar}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Actions rapides */}
          <motion.div 
            className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <CalculatorIcon className="w-5 h-5 inline mr-2" />
                Calculer paie
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <DocumentArrowDownIcon className="w-5 h-5 inline mr-2" />
                Export feuilles de temps
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <ChartBarIcon className="w-5 h-5 inline mr-2" />
                Rapport productivité
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TempsTravailleUltraPremium;