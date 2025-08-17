import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CalendarIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  ChartBarIcon,
  MapPinIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  StarIcon,
  ArrowTrendingUpIcon
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

const PointagesUltraPremium = () => {
  const { theme, getClasses, currentTheme } = useThemeUltraPremium();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Données simulées des pointages
  const timesheets = [
    {
      id: 1,
      employee: {
        name: 'Sophie Leblanc',
        role: 'Chef de projet',
        avatar: '👩‍💼',
        id: 'emp_001'
      },
      date: '2024-03-22',
      startTime: '08:00',
      endTime: '17:30',
      breakTime: 60,
      totalHours: 8.5,
      regularHours: 8,
      overtimeHours: 0.5,
      status: 'validated',
      project: 'Aménagement Parc Luxor',
      location: 'Paris 16ème',
      tasks: [
        { name: 'Réunion client', duration: 2, status: 'completed' },
        { name: 'Supervision travaux', duration: 4.5, status: 'completed' },
        { name: 'Rapport avancement', duration: 2, status: 'completed' }
      ],
      notes: 'Journée productive, client très satisfait de l\'avancement',
      approvedBy: 'Thomas Leroy',
      approvedAt: '2024-03-22 18:00',
      billableHours: 8.5,
      hourlyRate: 45,
      totalCost: 382.5
    },
    {
      id: 2,
      employee: {
        name: 'Marc Durand',
        role: 'Paysagiste',
        avatar: '👨‍🌾',
        id: 'emp_002'
      },
      date: '2024-03-22',
      startTime: '07:30',
      endTime: '16:00',
      breakTime: 30,
      totalHours: 8,
      regularHours: 8,
      overtimeHours: 0,
      status: 'pending',
      project: 'Jardin Résidentiel Martin',
      location: 'Versailles',
      tasks: [
        { name: 'Préparation terrain', duration: 3, status: 'completed' },
        { name: 'Plantation arbustes', duration: 4, status: 'completed' },
        { name: 'Arrosage installation', duration: 1, status: 'completed' }
      ],
      notes: 'Terrain plus dur que prévu, retard possible',
      approvedBy: null,
      approvedAt: null,
      billableHours: 8,
      hourlyRate: 35,
      totalCost: 280
    },
    {
      id: 3,
      employee: {
        name: 'Julie Martin',
        role: 'Architecte',
        avatar: '👩‍🎨',
        id: 'emp_003'
      },
      date: '2024-03-22',
      startTime: '09:00',
      endTime: '18:30',
      breakTime: 90,
      totalHours: 8,
      regularHours: 8,
      overtimeHours: 0,
      status: 'rejected',
      project: 'Design Terrasse Prestige',
      location: 'Bureau',
      tasks: [
        { name: 'Conception 3D', duration: 4, status: 'in_progress' },
        { name: 'Sélection matériaux', duration: 2, status: 'completed' },
        { name: 'Présentation client', duration: 2, status: 'pending' }
      ],
      notes: 'Modélisation 3D complexe, besoin de plus de temps',
      approvedBy: null,
      approvedAt: null,
      rejectionReason: 'Heures de pause trop longues',
      billableHours: 6,
      hourlyRate: 42,
      totalCost: 252
    },
    {
      id: 4,
      employee: {
        name: 'Pierre Lefevre',
        role: 'Technicien maintenance',
        avatar: '👨‍🔧',
        id: 'emp_004'
      },
      date: '2024-03-22',
      startTime: '06:00',
      endTime: '14:00',
      breakTime: 30,
      totalHours: 7.5,
      regularHours: 7.5,
      overtimeHours: 0,
      status: 'validated',
      project: 'Maintenance Parc Municipal',
      location: 'Boulogne-Billancourt',
      tasks: [
        { name: 'Tonte pelouse', duration: 3, status: 'completed' },
        { name: 'Taille haies', duration: 2.5, status: 'completed' },
        { name: 'Nettoyage allées', duration: 2, status: 'completed' }
      ],
      notes: 'Travail de routine, RAS',
      approvedBy: 'Sophie Leblanc',
      approvedAt: '2024-03-22 15:30',
      billableHours: 7.5,
      hourlyRate: 28,
      totalCost: 210
    },
    {
      id: 5,
      employee: {
        name: 'Emma Dubois',
        role: 'Designer',
        avatar: '👩‍🎨',
        id: 'emp_005'
      },
      date: '2024-03-21',
      startTime: '08:30',
      endTime: '17:00',
      breakTime: 60,
      totalHours: 7.5,
      regularHours: 7.5,
      overtimeHours: 0,
      status: 'validated',
      project: 'Jardin Thérapeutique EHPAD',
      location: 'Créteil',
      tasks: [
        { name: 'Analyse besoins spécifiques', duration: 3, status: 'completed' },
        { name: 'Esquisse aménagement', duration: 3, status: 'completed' },
        { name: 'Formation équipe', duration: 1.5, status: 'completed' }
      ],
      notes: 'Projet passionnant, équipe très impliquée',
      approvedBy: 'Thomas Leroy',
      approvedAt: '2024-03-21 18:15',
      billableHours: 7.5,
      hourlyRate: 38,
      totalCost: 285
    }
  ];

  // KPIs globaux
  const kpis = {
    totalTimesheets: timesheets.length,
    validated: timesheets.filter(t => t.status === 'validated').length,
    pending: timesheets.filter(t => t.status === 'pending').length,
    rejected: timesheets.filter(t => t.status === 'rejected').length,
    totalHours: timesheets.reduce((sum, t) => sum + t.totalHours, 0),
    totalCost: timesheets.reduce((sum, t) => sum + t.totalCost, 0),
    avgHoursPerDay: (timesheets.reduce((sum, t) => sum + t.totalHours, 0) / timesheets.length).toFixed(1),
    overtimeHours: timesheets.reduce((sum, t) => sum + t.overtimeHours, 0)
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'validated': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'pending': return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case 'rejected': return <XCircleIcon className="w-5 h-5 text-red-400" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusGradient = (status) => {
    switch(status) {
      case 'validated': return 'from-green-500 to-emerald-600';
      case 'pending': return 'from-yellow-500 to-orange-600';
      case 'rejected': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTaskStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesSearch = timesheet.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          timesheet.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || timesheet.status === filterStatus;
    const matchesEmployee = filterEmployee === 'all' || timesheet.employee.id === filterEmployee;
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  // Configuration des graphiques
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

  const statusDistributionData = {
    labels: ['Validé', 'En attente', 'Rejeté'],
    datasets: [{
      data: [kpis.validated, kpis.pending, kpis.rejected],
      backgroundColor: [
        'rgba(52, 211, 153, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(52, 211, 153, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2
    }]
  };

  const hoursPerEmployeeData = {
    labels: [...new Set(timesheets.map(t => t.employee.name))],
    datasets: [{
      label: 'Heures travaillées',
      data: [...new Set(timesheets.map(t => t.employee.name))].map(name => 
        timesheets.filter(t => t.employee.name === name).reduce((sum, t) => sum + t.totalHours, 0)
      ),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2
    }]
  };

  const TimesheetCard = ({ timesheet }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedTimesheet(timesheet)}
      className={getClasses('card', 'cursor-pointer relative overflow-hidden')}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
            {timesheet.employee.avatar}
          </div>
          <div>
            <h3 className={`text-lg font-bold ${theme.text}`}>{timesheet.employee.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm ${theme.textSecondary}`}>{timesheet.employee.role}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${getStatusGradient(timesheet.status)} text-white`}>
                {timesheet.status}
              </span>
            </div>
          </div>
        </div>
        
        {getStatusIcon(timesheet.status)}
      </div>

      {/* Date et projet */}
      <div className={getClasses('glass', 'p-3 rounded-lg mb-4')}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className={`w-4 h-4 ${theme.accent}`} />
            <span className={`text-sm font-medium ${theme.text}`}>
              {new Date(timesheet.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className={`w-4 h-4 ${theme.accent}`} />
            <span className={`text-sm ${theme.textSecondary}`}>
              {timesheet.startTime} - {timesheet.endTime}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BriefcaseIcon className={`w-4 h-4 ${theme.accent}`} />
          <span className={`text-sm ${theme.textSecondary}`}>{timesheet.project}</span>
        </div>
      </div>

      {/* Heures et coûts */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={getClasses('glass', 'text-center p-2 rounded-lg')}>
          <div className={`text-lg font-bold ${theme.text}`}>
            {timesheet.totalHours}h
          </div>
          <div className={`text-xs ${theme.textSecondary}`}>Total</div>
        </div>
        <div className={getClasses('glass', 'text-center p-2 rounded-lg')}>
          <div className={`text-lg font-bold ${theme.text}`}>
            {timesheet.billableHours}h
          </div>
          <div className={`text-xs ${theme.textSecondary}`}>Facturable</div>
        </div>
        <div className={getClasses('glass', 'text-center p-2 rounded-lg')}>
          <div className={`text-lg font-bold ${theme.text}`}>
            {timesheet.totalCost}€
          </div>
          <div className={`text-xs ${theme.textSecondary}`}>Coût</div>
        </div>
      </div>

      {/* Tâches */}
      <div className={getClasses('glass', 'p-3 rounded-lg mb-4')}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${theme.text}`}>Tâches</span>
          <span className={`text-xs ${theme.textSecondary}`}>
            {timesheet.tasks.filter(t => t.status === 'completed').length}/{timesheet.tasks.length}
          </span>
        </div>
        <div className="space-y-1">
          {timesheet.tasks.slice(0, 2).map((task, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className={`text-xs ${theme.textSecondary}`}>{task.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${getTaskStatusColor(task.status)}`}>
                  {task.duration}h
                </span>
              </div>
            </div>
          ))}
          {timesheet.tasks.length > 2 && (
            <div className={`text-xs ${theme.textSecondary} text-center`}>
              +{timesheet.tasks.length - 2} autres tâches
            </div>
          )}
        </div>
      </div>

      {/* Localisation */}
      <div className="flex items-center gap-2 mb-4">
        <MapPinIcon className={`w-4 h-4 ${theme.accent}`} />
        <span className={`text-sm ${theme.textSecondary}`}>{timesheet.location}</span>
      </div>

      {/* Heures supplémentaires */}
      {timesheet.overtimeHours > 0 && (
        <div className={getClasses('glass', 'p-2 rounded-lg mb-4 text-center')}>
          <span className={`text-xs ${theme.accent} font-medium`}>
            +{timesheet.overtimeHours}h supplémentaires
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getClasses('button', 'flex-1 py-2 text-sm')}
        >
          Voir détails
        </motion.button>
        {timesheet.status === 'pending' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 rounded-xl bg-green-500 text-white"
            >
              ✓
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 rounded-xl bg-red-500 text-white"
            >
              ✗
            </motion.button>
          </>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getClasses('glass', 'px-3 py-2 rounded-xl')}
        >
          <PencilSquareIcon className={`w-4 h-4 ${theme.accent}`} />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <UltraPremiumContainer
      title="Système de Pointage Ultra Premium"
      icon={ClockIcon}
    >
      {/* KPIs */}
      <div className="grid grid-cols-8 gap-4 mb-6">
        {[
          { label: 'Total feuilles', value: kpis.totalTimesheets, icon: DocumentTextIcon, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Validées', value: kpis.validated, icon: CheckCircleIcon, gradient: 'from-green-500 to-emerald-600' },
          { label: 'En attente', value: kpis.pending, icon: ClockIcon, gradient: 'from-yellow-500 to-orange-600' },
          { label: 'Rejetées', value: kpis.rejected, icon: XCircleIcon, gradient: 'from-red-500 to-pink-600' },
          { label: 'Total heures', value: `${kpis.totalHours}h`, icon: ClockIcon, gradient: 'from-purple-500 to-pink-600' },
          { label: 'Coût total', value: `${kpis.totalCost}€`, icon: CurrencyEuroIcon, gradient: 'from-cyan-500 to-blue-600' },
          { label: 'Moy./jour', value: `${kpis.avgHoursPerDay}h`, icon: ChartBarIcon, gradient: 'from-teal-500 to-cyan-600' },
          { label: 'Heures sup.', value: `${kpis.overtimeHours}h`, icon: ArrowTrendingUpIcon, gradient: 'from-orange-500 to-red-600' }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className={getClasses('card', 'relative overflow-hidden')}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-10`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-6 h-6 ${theme.accent}`} />
              </div>
              <div className={`text-2xl font-bold ${theme.text}`}>{kpi.value}</div>
              <div className={`text-xs ${theme.textSecondary} mt-1`}>{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textSecondary}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par employé ou projet..."
            className={getClasses('input', 'pl-10')}
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'validated', 'pending', 'rejected'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 
                getClasses('button', 'px-4 py-3') : 
                getClasses('glass', 'px-4 py-3 rounded-xl font-medium')}
            >
              {status === 'all' ? 'Tous' : 
               status === 'validated' ? 'Validés' :
               status === 'pending' ? 'En attente' : 'Rejetés'}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getClasses('button', 'px-4 py-3 flex items-center gap-2')}
        >
          <PlusIcon className="w-5 h-5" />
          Nouveau pointage
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={getClasses('button', 'px-4 py-3 flex items-center gap-2')}
        >
          <ChartBarIcon className="w-5 h-5" />
          Analytics
        </motion.button>
      </div>

      {/* Section Analytics */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-6 mb-8"
          >
            <div className={getClasses('card')}>
              <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Répartition des statuts</h3>
              <div className="h-64">
                <Doughnut data={statusDistributionData} options={{
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
              <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Heures par employé</h3>
              <div className="h-64">
                <Bar data={hoursPerEmployeeData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      display: false
                    }
                  },
                  scales: {
                    x: { 
                      grid: { display: false },
                      ticks: { color: theme.textSecondary, maxRotation: 45 }
                    },
                    y: { 
                      grid: { color: theme.border },
                      ticks: { color: theme.textSecondary }
                    }
                  }
                }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grille des pointages */}
      <div className="grid grid-cols-3 gap-6">
        {filteredTimesheets.map((timesheet) => (
          <TimesheetCard key={timesheet.id} timesheet={timesheet} />
        ))}
      </div>

      {/* Modal détails pointage */}
      <AnimatePresence>
        {selectedTimesheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedTimesheet(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'w-full max-w-4xl max-h-[90vh] overflow-y-auto')}
            >
              <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>
                Pointage - {selectedTimesheet.employee.name}
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className={getClasses('glass', 'p-4 rounded-xl')}>
                  <h3 className={`font-semibold ${theme.text} mb-3`}>Informations générales</h3>
                  <div className="space-y-3">
                    <div>
                      <span className={`font-medium ${theme.text}`}>Date: </span>
                      <span className={theme.textSecondary}>
                        {new Date(selectedTimesheet.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className={`font-medium ${theme.text}`}>Horaires: </span>
                      <span className={theme.textSecondary}>
                        {selectedTimesheet.startTime} - {selectedTimesheet.endTime}
                      </span>
                    </div>
                    <div>
                      <span className={`font-medium ${theme.text}`}>Pause: </span>
                      <span className={theme.textSecondary}>{selectedTimesheet.breakTime} min</span>
                    </div>
                    <div>
                      <span className={`font-medium ${theme.text}`}>Lieu: </span>
                      <span className={theme.textSecondary}>{selectedTimesheet.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className={getClasses('glass', 'p-4 rounded-xl')}>
                  <h3 className={`font-semibold ${theme.text} mb-3`}>Détail des tâches</h3>
                  <div className="space-y-3">
                    {selectedTimesheet.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <div className={`font-medium ${theme.text}`}>{task.name}</div>
                          <div className={`text-sm ${getTaskStatusColor(task.status)}`}>
                            {task.status}
                          </div>
                        </div>
                        <div className={`text-sm ${theme.textSecondary}`}>
                          {task.duration}h
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedTimesheet.notes && (
                <div className="mt-6">
                  <h3 className={`font-semibold ${theme.text} mb-3`}>Notes</h3>
                  <p className={`${theme.textSecondary} ${getClasses('glass', 'p-4 rounded-xl')}`}>
                    {selectedTimesheet.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={getClasses('glass', 'px-6 py-3 rounded-xl font-medium')}
                  onClick={() => setSelectedTimesheet(null)}
                >
                  Fermer
                </motion.button>
                {selectedTimesheet.status === 'pending' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-green-500 text-white font-medium"
                    >
                      Valider
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-red-500 text-white font-medium"
                    >
                      Rejeter
                    </motion.button>
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={getClasses('button', 'px-6 py-3')}
                >
                  Modifier
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default PointagesUltraPremium;