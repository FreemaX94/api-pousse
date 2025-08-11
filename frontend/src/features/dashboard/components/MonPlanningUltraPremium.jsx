import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CameraIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  HeartIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
  CurrencyEuroIcon,
  ArrowPathIcon,
  Battery50Icon,
  SignalIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

const MonPlanningUltraPremium = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTask, setActiveTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (taskStatus === 'running') {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [taskStatus]);

  // Mes tâches personnelles
  const myTasks = [
    {
      id: 1,
      time: '08:00 - 10:00',
      title: 'Élagage Chêne Centenaire',
      client: 'Villa Moderne',
      location: '12 Rue des Jardins, Lyon',
      distance: '8.5 km',
      priority: 'high',
      status: 'completed',
      progress: 100,
      payment: 450,
      duration: '2h',
      team: ['Moi', 'Paul M.'],
      tools: ['Tronçonneuse', 'Nacelle', 'EPI'],
      notes: 'Client très satisfait, pourboire de 50€',
      photos: 4,
      satisfaction: 5
    },
    {
      id: 2,
      time: '10:30 - 12:00',
      title: 'Diagnostic Phytosanitaire',
      client: 'Jardin Botanique',
      location: '45 Avenue des Fleurs',
      distance: '12.3 km',
      priority: 'normal',
      status: 'in_progress',
      progress: 65,
      payment: 180,
      duration: '1h30',
      team: ['Moi'],
      tools: ['Kit diagnostic', 'Loupe', 'pH-mètre'],
      notes: 'Présence de pucerons détectée',
      photos: 2,
      satisfaction: null
    },
    {
      id: 3,
      time: '14:00 - 17:00',
      title: 'Installation Système Arrosage',
      client: 'Résidence Harmony',
      location: '78 Boulevard Innovation',
      distance: '15.7 km',
      priority: 'high',
      status: 'pending',
      progress: 0,
      payment: 850,
      duration: '3h',
      team: ['Moi', 'Marc L.', 'Luc B.'],
      tools: ['Perceuse', 'Tuyaux', 'Programmateur'],
      notes: 'Matériel déjà sur place',
      photos: 0,
      satisfaction: null
    },
    {
      id: 4,
      time: '17:30 - 18:30',
      title: 'Suivi Client - Entretien',
      client: 'Entreprise TechCorp',
      location: '156 Rue Digital',
      distance: '6.2 km',
      priority: 'low',
      status: 'pending',
      progress: 0,
      payment: 120,
      duration: '1h',
      team: ['Moi'],
      tools: ['Tondeuse', 'Coupe-bordure'],
      notes: 'Contrat mensuel',
      photos: 0,
      satisfaction: null
    }
  ];

  // Stats personnelles
  const myStats = {
    todayEarnings: 1600,
    weekEarnings: 7250,
    tasksCompleted: 2,
    tasksTotal: 4,
    avgSatisfaction: 4.9,
    efficiency: 92,
    kmDriven: 42.7,
    energyLevel: 75
  };

  // Performance hebdomadaire
  const weekPerformance = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    datasets: [{
      label: 'Revenus',
      data: [850, 920, 1100, 780, 1600, 450],
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4
    }]
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'normal': return 'from-yellow-500 to-amber-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <PlayIcon className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'pending': return <ClockIcon className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Personnel */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <UserIcon className="w-8 h-8 mr-3" />
              Mon Planning Personnel
            </h1>
            <p className="text-purple-100">Gestion optimisée de ma journée de travail</p>
            
            {/* Statut en temps réel */}
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Battery50Icon className="w-5 h-5" />
                <span className="text-sm">Énergie: {myStats.energyLevel}%</span>
                <div className="w-24 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
                    style={{ width: `${myStats.energyLevel}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <SignalIcon className="w-5 h-5" />
                <span className="text-sm">Performance: {myStats.efficiency}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="w-5 h-5" />
                <span className="text-sm">En ligne</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold mb-1">
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-purple-100">
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            {taskStatus === 'running' && (
              <div className="mt-2 bg-white/20 backdrop-blur-lg rounded-lg px-3 py-1">
                <span className="text-sm">Temps écoulé: {formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>
        </div>

        {/* KPIs Personnels */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">{myStats.todayEarnings}€</div>
            <div className="text-xs text-purple-100">Aujourd'hui</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">{myStats.weekEarnings}€</div>
            <div className="text-xs text-purple-100">Cette semaine</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">{myStats.tasksCompleted}/{myStats.tasksTotal}</div>
            <div className="text-xs text-purple-100">Tâches</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">⭐ {myStats.avgSatisfaction}</div>
            <div className="text-xs text-purple-100">Satisfaction</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">{myStats.efficiency}%</div>
            <div className="text-xs text-purple-100">Efficacité</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">{myStats.kmDriven} km</div>
            <div className="text-xs text-purple-100">Parcourus</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">4h32</div>
            <div className="text-xs text-purple-100">Travaillé</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
            <div className="text-2xl font-bold">2h28</div>
            <div className="text-xs text-purple-100">Restant</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline de ma journée */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CalendarDaysIcon className="w-5 h-5 mr-2 text-purple-500" />
                Ma Timeline du Jour
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {myTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  className={`relative p-4 rounded-xl border-2 ${
                    task.status === 'in_progress' 
                      ? 'border-blue-500 bg-blue-50' 
                      : task.status === 'completed'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  } hover:shadow-lg transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Status Badge */}
                  <div className="absolute -top-2 -right-2">
                    {getStatusIcon(task.status)}
                  </div>

                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getPriorityColor(task.priority)}`}>
                          {task.time}
                        </span>
                        <span className="text-sm text-gray-500">{task.duration}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mt-2">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.client}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{task.payment}€</div>
                      {task.satisfaction && (
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${i < task.satisfaction ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{task.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TruckIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{task.distance}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{task.team.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <WrenchScrewdriverIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{task.tools.length} outils</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {task.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progression</span>
                        <span className="font-semibold">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Notes & Photos */}
                  {task.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                      <p className="text-xs text-yellow-800">{task.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => {
                          setActiveTask(task);
                          setTaskStatus('running');
                        }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                      >
                        <PlayIcon className="w-4 h-4 inline mr-1" />
                        Démarrer
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => setTaskStatus(taskStatus === 'running' ? 'paused' : 'running')}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                        >
                          {taskStatus === 'running' ? (
                            <><PauseIcon className="w-4 h-4 inline mr-1" />Pause</>
                          ) : (
                            <><PlayIcon className="w-4 h-4 inline mr-1" />Reprendre</>
                          )}
                        </button>
                        <button className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300">
                          <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                          Terminer
                        </button>
                      </>
                    )}
                    <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300">
                      <CameraIcon className="w-4 h-4 inline mr-1" />
                      {task.photos}
                    </button>
                    <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Stats & Actions */}
        <div className="space-y-6">
          {/* Performance du jour */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ma Performance</h3>
            <div className="h-48">
              <Doughnut
                data={{
                  labels: ['Complété', 'En cours', 'À faire'],
                  datasets: [{
                    data: [50, 25, 25],
                    backgroundColor: [
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(156, 163, 175, 0.8)'
                    ],
                    borderColor: [
                      'rgb(34, 197, 94)',
                      'rgb(59, 130, 246)',
                      'rgb(156, 163, 175)'
                    ],
                    borderWidth: 2
                  }]
                }}
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
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Revenus de la semaine */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus Semaine</h3>
            <div className="h-48">
              <Line
                data={weekPerformance}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return value + '€';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Actions rapides */}
          <motion.div 
            className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <PhoneIcon className="w-5 h-5 inline mr-2" />
                Appeler prochain client
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                Rapport journalier
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
                <ArrowPathIcon className="w-5 h-5 inline mr-2" />
                Synchroniser
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MonPlanningUltraPremium;