import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellAlertIcon,
  FireIcon,
  SparklesIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SunIcon,
  CloudIcon,
  ArrowPathIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  PhoneIcon,
  VideoCameraIcon,
  GlobeAltIcon,
  Battery100Icon,
  SignalIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const SemaineUltraPremium = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterTeam, setFilterTeam] = useState('all');
  const [showTaskDetail, setShowTaskDetail] = useState(null);
  const [liveUpdates, setLiveUpdates] = useState(true);

  // Animation des valeurs
  useEffect(() => {
    if (liveUpdates) {
      const interval = setInterval(() => {
        // Simulation de mises à jour en temps réel
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [liveUpdates]);

  // Jours de la semaine
  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
  // Planning hebdomadaire enrichi
  const weekPlanning = {
    lundi: [
      {
        id: 1,
        time: '08:00-10:00',
        title: 'Élagage Parc Central',
        client: 'Mairie de Lyon',
        team: ['Marc L.', 'Paul M.'],
        priority: 'high',
        status: 'confirmed',
        revenue: 850,
        progress: 100,
        type: 'elagage',
        weather: 'sunny',
        equipment: ['Nacelle', 'Tronçonneuse'],
        risk: 'medium'
      },
      {
        id: 2,
        time: '10:30-12:30',
        title: 'Installation Arrosage',
        client: 'Villa Horizon',
        team: ['Luc B.'],
        priority: 'normal',
        status: 'confirmed',
        revenue: 420,
        progress: 100,
        type: 'installation',
        weather: 'sunny',
        equipment: ['Kit arrosage'],
        risk: 'low'
      },
      {
        id: 3,
        time: '14:00-17:00',
        title: 'Création Jardin Zen',
        client: 'Entreprise Tech',
        team: ['Marc L.', 'Paul M.', 'Jean D.'],
        priority: 'high',
        status: 'in_progress',
        revenue: 1200,
        progress: 45,
        type: 'creation',
        weather: 'cloudy',
        equipment: ['Matériaux', 'Outillage complet'],
        risk: 'low'
      }
    ],
    mardi: [
      {
        id: 4,
        time: '09:00-11:00',
        title: 'Entretien Résidence',
        client: 'Résidence Harmony',
        team: ['Paul M.'],
        priority: 'normal',
        status: 'confirmed',
        revenue: 280,
        progress: 0,
        type: 'entretien',
        weather: 'rainy',
        equipment: ['Tondeuse', 'Taille-haie'],
        risk: 'low'
      },
      {
        id: 5,
        time: '14:00-16:00',
        title: 'Diagnostic Sanitaire',
        client: 'Jardin Botanique',
        team: ['Marc L.'],
        priority: 'urgent',
        status: 'pending',
        revenue: 180,
        progress: 0,
        type: 'diagnostic',
        weather: 'cloudy',
        equipment: ['Kit diagnostic'],
        risk: 'high'
      }
    ],
    mercredi: [
      {
        id: 6,
        time: '08:00-12:00',
        title: 'Abattage Urgent',
        client: 'Particulier',
        team: ['Marc L.', 'Paul M.', 'Luc B.'],
        priority: 'urgent',
        status: 'confirmed',
        revenue: 1500,
        progress: 0,
        type: 'abattage',
        weather: 'sunny',
        equipment: ['Nacelle', 'Tronçonneuse', 'Broyeur'],
        risk: 'high'
      },
      {
        id: 7,
        time: '14:00-17:00',
        title: 'Plantation Haie',
        client: 'École Primaire',
        team: ['Jean D.', 'Pierre M.'],
        priority: 'normal',
        status: 'confirmed',
        revenue: 650,
        progress: 0,
        type: 'plantation',
        weather: 'sunny',
        equipment: ['Plants', 'Terreau'],
        risk: 'low'
      }
    ],
    jeudi: [
      {
        id: 8,
        time: '09:00-12:00',
        title: 'Taille Formation',
        client: 'Château Versant',
        team: ['Marc L.'],
        priority: 'high',
        status: 'confirmed',
        revenue: 450,
        progress: 0,
        type: 'taille',
        weather: 'cloudy',
        equipment: ['Sécateur', 'Échelle'],
        risk: 'medium'
      }
    ],
    vendredi: [
      {
        id: 9,
        time: '08:00-10:00',
        title: 'Traitement Bio',
        client: 'Verger Municipal',
        team: ['Paul M.', 'Luc B.'],
        priority: 'normal',
        status: 'confirmed',
        revenue: 320,
        progress: 0,
        type: 'traitement',
        weather: 'sunny',
        equipment: ['Pulvérisateur', 'Produits bio'],
        risk: 'medium'
      },
      {
        id: 10,
        time: '11:00-17:00',
        title: 'Aménagement Paysager',
        client: 'Hotel Luxury',
        team: ['Équipe complète'],
        priority: 'high',
        status: 'confirmed',
        revenue: 2200,
        progress: 0,
        type: 'amenagement',
        weather: 'sunny',
        equipment: ['Tout équipement'],
        risk: 'medium'
      }
    ],
    samedi: [
      {
        id: 11,
        time: '09:00-12:00',
        title: 'Entretien Particuliers',
        client: 'Divers',
        team: ['Jean D.'],
        priority: 'normal',
        status: 'confirmed',
        revenue: 450,
        progress: 0,
        type: 'entretien',
        weather: 'sunny',
        equipment: ['Matériel standard'],
        risk: 'low'
      }
    ],
    dimanche: []
  };

  // Stats hebdomadaires
  const weekStats = {
    totalRevenue: 9280,
    totalInterventions: 11,
    avgSatisfaction: 4.8,
    teamUtilization: 87,
    completionRate: 95,
    weatherImpact: 15,
    efficiency: 92,
    newClients: 3
  };

  // Performance par jour
  const dailyPerformance = {
    labels: weekDays,
    datasets: [{
      label: 'Revenus',
      data: [2490, 460, 2150, 450, 2520, 450, 0],
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4,
      fill: true
    }, {
      label: 'Heures travaillées',
      data: [9, 4, 9, 3, 10, 3, 0],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      yAxisID: 'y1'
    }]
  };

  const getTypeColor = (type) => {
    const colors = {
      elagage: 'from-red-500 to-orange-500',
      installation: 'from-blue-500 to-indigo-500',
      creation: 'from-purple-500 to-pink-500',
      entretien: 'from-green-500 to-emerald-500',
      diagnostic: 'from-yellow-500 to-amber-500',
      abattage: 'from-red-600 to-red-800',
      plantation: 'from-green-600 to-teal-600',
      taille: 'from-indigo-500 to-purple-500',
      traitement: 'from-cyan-500 to-blue-500',
      amenagement: 'from-pink-500 to-rose-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getWeatherIcon = (weather) => {
    switch(weather) {
      case 'sunny': return <SunIcon className="w-4 h-4 text-yellow-500" />;
      case 'cloudy': return <CloudIcon className="w-4 h-4 text-gray-500" />;
      case 'rainy': return '🌧️';
      default: return null;
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getTasksForDay = (day) => {
    return weekPlanning[day.toLowerCase()] || [];
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Ultra Premium */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <CalendarDaysIcon className="w-8 h-8 mr-3" />
              Planning Hebdomadaire Intelligent
            </h1>
            <p className="text-purple-100">Vue d'ensemble optimisée avec IA prédictive</p>
            
            {/* Live Status */}
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Battery100Icon className="w-5 h-5" />
                <span className="text-sm">Charge: {weekStats.teamUtilization}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <SignalIcon className="w-5 h-5" />
                <span className="text-sm">Performance: {weekStats.efficiency}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <RocketLaunchIcon className="w-5 h-5" />
                <span className="text-sm">Productivité: Excellente</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Live</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold mb-1">{weekStats.totalRevenue.toLocaleString()}€</div>
            <div className="text-purple-100">Revenus prévus</div>
            <div className="flex items-center justify-end mt-2 space-x-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-300" />
              <span className="text-green-300 font-semibold">+18%</span>
            </div>
          </div>
        </div>

        {/* KPIs Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">{weekStats.totalInterventions}</div>
            <div className="text-xs text-purple-100">Interventions</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">⭐ {weekStats.avgSatisfaction}</div>
            <div className="text-xs text-purple-100">Satisfaction</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">{weekStats.completionRate}%</div>
            <div className="text-xs text-purple-100">Complétion</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">38h</div>
            <div className="text-xs text-purple-100">Heures prévues</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-purple-100">Équipes actives</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">{weekStats.newClients}</div>
            <div className="text-xs text-purple-100">Nouveaux clients</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">☔ {weekStats.weatherImpact}%</div>
            <div className="text-xs text-purple-100">Impact météo</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">{weekStats.efficiency}%</div>
            <div className="text-xs text-purple-100">Efficacité</div>
          </div>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Semaine du {currentWeek.toLocaleDateString('fr-FR')}
            </h2>
            <button 
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <select 
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="all">Toutes les équipes</option>
              <option value="marc">Marc L.</option>
              <option value="paul">Paul M.</option>
              <option value="luc">Luc B.</option>
              <option value="jean">Jean D.</option>
            </select>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded ${viewMode === 'timeline' ? 'bg-white shadow' : ''}`}
              >
                Timeline
              </button>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowPathIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
              <PlusIcon className="w-5 h-5 inline mr-1" />
              Nouvelle tâche
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Planning Grid */}
        <div className="lg:col-span-3">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Days Header */}
            <div className="grid grid-cols-7 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {weekDays.map((day, index) => (
                <div 
                  key={day}
                  className="p-3 text-center border-r border-purple-400 last:border-r-0 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setSelectedDay(day)}
                >
                  <div className="font-semibold">{day}</div>
                  <div className="text-xs opacity-80">
                    {getTasksForDay(day).length} tâches
                  </div>
                </div>
              ))}
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-7 min-h-[600px]">
              {weekDays.map((day, dayIndex) => {
                const tasks = getTasksForDay(day);
                return (
                  <div 
                    key={day}
                    className="border-r border-gray-200 last:border-r-0 p-2 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-2">
                      {tasks.map((task, taskIndex) => (
                        <motion.div
                          key={task.id}
                          className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(task.type)} text-white text-xs cursor-pointer hover:shadow-lg transition-all duration-300`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: dayIndex * 0.05 + taskIndex * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setShowTaskDetail(task)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">{task.time}</span>
                            {getWeatherIcon(task.weather)}
                          </div>
                          <div className="font-medium truncate">{task.title}</div>
                          <div className="truncate opacity-90">{task.client}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold">{task.revenue}€</span>
                            {task.priority === 'urgent' && (
                              <ExclamationTriangleIcon className="w-4 h-4 animate-pulse" />
                            )}
                          </div>
                          {task.progress > 0 && (
                            <div className="mt-2 w-full bg-white/30 rounded-full h-1">
                              <div 
                                className="bg-white h-1 rounded-full"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Chart */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Semaine</h3>
            <div className="h-64">
              <Line
                data={dailyPerformance}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 10,
                        usePointStyle: true,
                        font: { size: 11 }
                      }
                    }
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Revenus (€)'
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Heures'
                      },
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Team Status */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2 text-purple-500" />
              État des Équipes
            </h3>
            <div className="space-y-3">
              {['Marc L.', 'Paul M.', 'Luc B.', 'Jean D.'].map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member}</div>
                      <div className="text-xs text-gray-500">En intervention</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-600">Actif</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                Rapport hebdo
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <PhoneIcon className="w-5 h-5 inline mr-2" />
                Brief équipe
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <VideoCameraIcon className="w-5 h-5 inline mr-2" />
                Visio planning
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {showTaskDetail && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTaskDetail(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${getTypeColor(showTaskDetail.type)} p-6 text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{showTaskDetail.title}</h3>
                    <p className="opacity-90 mt-1">{showTaskDetail.client}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{showTaskDetail.revenue}€</div>
                    <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${getRiskColor(showTaskDetail.risk)}`}>
                      Risque: {showTaskDetail.risk}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{showTaskDetail.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{showTaskDetail.team.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <WrenchScrewdriverIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{showTaskDetail.equipment.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getWeatherIcon(showTaskDetail.weather)}
                    <span className="text-sm capitalize">{showTaskDetail.weather}</span>
                  </div>
                </div>

                {showTaskDetail.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span className="font-semibold">{showTaskDetail.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${showTaskDetail.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    <EyeIcon className="w-5 h-5 inline mr-2" />
                    Voir détails
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    <PencilIcon className="w-5 h-5 inline mr-2" />
                    Modifier
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SemaineUltraPremium;