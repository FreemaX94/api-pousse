import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  TruckIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  ArrowPathIcon,
  Battery100Icon,
  SignalIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  PhotoIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

const JourneeUltraPremium = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(null);
  const [viewMode, setViewMode] = useState('timeline');
  const [dayProgress, setDayProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const hours = new Date().getHours();
      const minutes = new Date().getMinutes();
      const progress = ((hours * 60 + minutes) / (24 * 60)) * 100;
      setDayProgress(progress);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Planning de la journée heure par heure
  const hourlySchedule = [
    { hour: '07:00', interventions: 0, team: [], status: 'preparation' },
    { hour: '08:00', interventions: 3, team: ['Marc L.', 'Paul M.'], status: 'active', tasks: ['Élagage urgent', 'Installation système'] },
    { hour: '09:00', interventions: 5, team: ['Marc L.', 'Paul M.', 'Luc B.'], status: 'peak', tasks: ['Élagage urgent', 'Diagnostic', 'Entretien'] },
    { hour: '10:00', interventions: 6, team: ['Équipe complète'], status: 'peak' },
    { hour: '11:00', interventions: 4, team: ['Marc L.', 'Paul M.', 'Jean D.'], status: 'active' },
    { hour: '12:00', interventions: 2, team: ['Luc B.'], status: 'lunch' },
    { hour: '13:00', interventions: 1, team: ['Jean D.'], status: 'lunch' },
    { hour: '14:00', interventions: 5, team: ['Équipe complète'], status: 'active' },
    { hour: '15:00', interventions: 6, team: ['Équipe complète'], status: 'peak' },
    { hour: '16:00', interventions: 4, team: ['Marc L.', 'Paul M.'], status: 'active' },
    { hour: '17:00', interventions: 3, team: ['Luc B.', 'Jean D.'], status: 'active' },
    { hour: '18:00', interventions: 1, team: ['Marc L.'], status: 'closing' },
    { hour: '19:00', interventions: 0, team: [], status: 'closed' }
  ];

  // Stats de la journée
  const dayStats = {
    totalInterventions: 42,
    completedInterventions: 28,
    inProgressInterventions: 8,
    pendingInterventions: 6,
    totalRevenue: 12450,
    totalDistance: 156,
    avgDuration: 2.3,
    satisfaction: 4.8,
    efficiency: 89
  };

  // Données pour le graphique de charge
  const workloadData = {
    labels: hourlySchedule.map(h => h.hour),
    datasets: [{
      label: 'Charge de travail',
      data: hourlySchedule.map(h => h.interventions),
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  // Distribution par équipe
  const teamDistribution = {
    labels: ['Marc L.', 'Paul M.', 'Luc B.', 'Jean D.', 'Pierre M.'],
    datasets: [{
      data: [12, 10, 8, 9, 3],
      backgroundColor: [
        'rgba(147, 51, 234, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'peak': return 'from-red-500 to-orange-500';
      case 'active': return 'from-blue-500 to-indigo-500';
      case 'lunch': return 'from-yellow-500 to-amber-500';
      case 'preparation': return 'from-green-500 to-emerald-500';
      case 'closing': return 'from-purple-500 to-pink-500';
      case 'closed': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 18) return <SunIcon className="w-5 h-5 text-yellow-500" />;
    return <MoonIcon className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Dynamique */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-orange-600 via-yellow-600 to-amber-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation soleil/lune */}
        <div className="absolute top-4 right-4 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {getTimeIcon()}
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <CalendarDaysIcon className="w-8 h-8 mr-3" />
                Planning Journée Dynamique
              </h1>
              <p className="text-yellow-100">Supervision en temps réel et optimisation continue</p>
              
              {/* Progression de la journée */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression de la journée</span>
                  <span>{Math.round(dayProgress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div 
                    className="bg-white h-2 rounded-full"
                    animate={{ width: `${dayProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-yellow-100">
                {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div className="mt-3 flex items-center justify-end space-x-4">
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">{dayStats.efficiency}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalIcon className="w-5 h-5" />
                  <span className="text-sm">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs de la journée */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Total interventions', value: dayStats.totalInterventions, icon: '📋', color: 'from-blue-500 to-indigo-500' },
          { label: 'Terminées', value: dayStats.completedInterventions, icon: '✅', color: 'from-green-500 to-emerald-500' },
          { label: 'En cours', value: dayStats.inProgressInterventions, icon: '🔄', color: 'from-yellow-500 to-orange-500', pulse: true },
          { label: 'CA journée', value: `${dayStats.totalRevenue}€`, icon: '💰', color: 'from-purple-500 to-pink-500' },
          { label: 'Distance', value: `${dayStats.totalDistance}km`, icon: '🚗', color: 'from-cyan-500 to-blue-500' },
          { label: 'Satisfaction', value: `⭐ ${dayStats.satisfaction}`, icon: '', color: 'from-yellow-400 to-orange-400' }
        ].map((kpi, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05, type: "spring" }}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`h-1 bg-gradient-to-r ${kpi.color}`} />
            <div className="p-4">
              <div className="text-2xl font-bold text-gray-900 flex items-center">
                {kpi.icon} {kpi.value}
                {kpi.pulse && <div className="ml-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
              </div>
              <div className="text-xs text-gray-600 mt-1">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline horaire */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Timeline Horaire
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {hourlySchedule.map((slot, index) => {
                  const isCurrent = currentTime.getHours() === parseInt(slot.hour.split(':')[0]);
                  const isPast = currentTime.getHours() > parseInt(slot.hour.split(':')[0]);
                  
                  return (
                    <motion.div
                      key={index}
                      className={`relative p-4 rounded-lg border-2 ${
                        isCurrent ? 'border-orange-500 bg-orange-50' : 
                        isPast ? 'border-gray-300 bg-gray-50 opacity-60' : 
                        'border-gray-200 bg-white'
                      } hover:shadow-lg transition-all duration-300 cursor-pointer`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedHour(slot)}
                    >
                      {isCurrent && (
                        <div className="absolute -top-2 -right-2">
                          <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-bold text-gray-900">{slot.hour}</div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(slot.status)}`}>
                            {slot.status}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <UserGroupIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{slot.team.length} tech.</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TruckIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-900">{slot.interventions}</span>
                          </div>
                        </div>
                      </div>
                      
                      {slot.interventions > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${getStatusColor(slot.status)}`}
                              style={{ width: `${(slot.interventions / 6) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          {/* Charge de travail */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Charge de Travail</h3>
            <div className="h-48">
              <Line
                data={workloadData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 8
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Répartition équipe */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Équipe</h3>
            <div className="h-48">
              <Doughnut
                data={teamDistribution}
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

          {/* Actions rapides */}
          <motion.div 
            className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <ArrowPathIcon className="w-5 h-5 inline mr-2" />
                Optimiser planning
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                Rapport journée
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default JourneeUltraPremium;