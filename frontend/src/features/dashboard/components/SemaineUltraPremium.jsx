import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellAlertIcon,
  FireIcon,
  SparklesIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  CpuChipIcon,
  BeakerIcon,
  TrophyIcon,
  StarIcon,
  HeartIcon,
  CloudIcon,
  SunIcon,
  BookmarkIcon,
  FolderIcon,
  DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const SemaineUltraPremium = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [viewMode, setViewMode] = useState('team');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [workloadAnalysis, setWorkloadAnalysis] = useState(true);

  // Équipes et membres
  const teams = {
    elagage: {
      name: 'Équipe Élagage',
      color: 'from-red-500 to-orange-500',
      members: ['Marc L.', 'Paul M.'],
      skills: ['Élagage', 'Abattage', 'Taille'],
      capacity: 16, // heures/jour
      utilization: 87
    },
    creation: {
      name: 'Équipe Création',
      color: 'from-purple-500 to-pink-500',
      members: ['Luc B.', 'Jean D.', 'Pierre M.'],
      skills: ['Aménagement', 'Plantation', 'Design'],
      capacity: 24,
      utilization: 92
    },
    maintenance: {
      name: 'Équipe Entretien',
      color: 'from-green-500 to-emerald-500',
      members: ['Sophie T.', 'Alex R.'],
      skills: ['Entretien', 'Tonte', 'Arrosage'],
      capacity: 16,
      utilization: 78
    },
    technique: {
      name: 'Équipe Technique',
      color: 'from-blue-500 to-indigo-500',
      members: ['Thomas K.', 'Marine F.'],
      skills: ['Installation', 'Réparation', 'Diagnostic'],
      capacity: 16,
      utilization: 85
    }
  };

  // Templates de semaine prédéfinis
  const weekTemplates = [
    {
      id: 1,
      name: 'Semaine Standard Été',
      description: 'Répartition classique période estivale',
      icon: '☀️',
      usage: 42,
      tasks: {
        monday: [
          { team: 'elagage', hours: 6, type: 'Élagage préventif' },
          { team: 'maintenance', hours: 8, type: 'Entretien jardins' }
        ],
        tuesday: [
          { team: 'creation', hours: 8, type: 'Aménagement paysager' },
          { team: 'technique', hours: 6, type: 'Installation arrosage' }
        ]
      }
    },
    {
      id: 2,
      name: 'Semaine Urgence',
      description: 'Optimisation pour interventions urgentes',
      icon: '🚨',
      usage: 18,
      tasks: {
        monday: [
          { team: 'elagage', hours: 8, type: 'Interventions d\'urgence' },
          { team: 'technique', hours: 8, type: 'Dépannage' }
        ]
      }
    },
    {
      id: 3,
      name: 'Semaine Création',
      description: 'Focus sur projets d\'aménagement',
      icon: '🌳',
      usage: 23,
      tasks: {
        monday: [
          { team: 'creation', hours: 8, type: 'Conception' },
          { team: 'creation', hours: 8, type: 'Plantation' }
        ]
      }
    }
  ];

  // Données de la semaine avec répartition par équipe
  const weekData = [
    {
      date: new Date(2024, 7, 12), // Lundi
      day: 'Lundi',
      teams: {
        elagage: [
          { id: 1, time: '08:00-12:00', task: 'Élagage Parc Municipal', client: 'Mairie Lyon', priority: 'high', amount: 850 },
          { id: 2, time: '14:00-17:00', task: 'Abattage Chêne Malade', client: 'Résidence Harmony', priority: 'high', amount: 450 }
        ],
        creation: [
          { id: 3, time: '09:00-17:00', task: 'Création Jardin Japonais', client: 'Villa Moderne', priority: 'normal', amount: 2400 }
        ],
        maintenance: [
          { id: 4, time: '08:00-12:00', task: 'Entretien Espaces Verts', client: 'Office HLM', priority: 'low', amount: 320 },
          { id: 5, time: '14:00-16:00', task: 'Tonte Pelouses', client: 'Copropriété Soleil', priority: 'low', amount: 180 }
        ],
        technique: [
          { id: 6, time: '10:00-15:00', task: 'Installation Système Arrosage', client: 'Jardin Botanique', priority: 'normal', amount: 680 }
        ]
      }
    },
    {
      date: new Date(2024, 7, 13), // Mardi
      day: 'Mardi',
      teams: {
        elagage: [
          { id: 7, time: '08:00-11:00', task: 'Taille Haies Périmétriques', client: 'Entreprise TechCorp', priority: 'normal', amount: 280 }
        ],
        creation: [
          { id: 8, time: '08:00-12:00', task: 'Plantation Massifs Saisonniers', client: 'Centre Commercial', priority: 'normal', amount: 1200 },
          { id: 9, time: '14:00-18:00', task: 'Pose Éclairage Jardin', client: 'Villa Prestige', priority: 'high', amount: 950 }
        ],
        maintenance: [
          { id: 10, time: '08:00-17:00', task: 'Maintenance Complète Parc', client: 'Château de Versant', priority: 'normal', amount: 750 }
        ],
        technique: [
          { id: 11, time: '09:00-16:00', task: 'Diagnostic Phytosanitaire', client: 'Pépinière Locale', priority: 'high', amount: 420 }
        ]
      }
    },
    {
      date: new Date(2024, 7, 14), // Mercredi
      day: 'Mercredi',
      teams: {
        elagage: [
          { id: 12, time: '08:00-16:00', task: 'Formation Sécurité EPI', client: 'Formation Interne', priority: 'high', amount: 0 }
        ],
        creation: [
          { id: 13, time: '09:00-17:00', task: 'Aménagement Terrasse', client: 'Restaurant Le Jardin', priority: 'normal', amount: 1800 }
        ],
        maintenance: [
          { id: 14, time: '08:00-12:00', task: 'Entretien Équipements', client: 'Maintenance Interne', priority: 'normal', amount: 0 },
          { id: 15, time: '14:00-17:00', task: 'Traitement Anti-Parasites', client: 'Résidence Les Tilleuls', priority: 'high', amount: 380 }
        ],
        technique: [
          { id: 16, time: '10:00-15:00', task: 'Réparation Système Irrigation', client: 'Golf Municipal', priority: 'high', amount: 650 }
        ]
      }
    }
  ];

  // Calcul de la charge de travail par équipe
  const calculateWorkload = useCallback((teamId, dayData) => {
    const teamTasks = dayData.teams[teamId] || [];
    const totalHours = teamTasks.reduce((sum, task) => {
      const [start, end] = task.time.split('-');
      const startTime = parseInt(start.replace(':', ''));
      const endTime = parseInt(end.replace(':', ''));
      const duration = (endTime - startTime) / 100;
      return sum + duration;
    }, 0);
    
    const capacity = teams[teamId]?.capacity || 8;
    const utilization = Math.round((totalHours / capacity) * 100);
    
    return {
      totalHours,
      capacity,
      utilization,
      status: utilization > 100 ? 'overloaded' : utilization > 80 ? 'high' : utilization > 50 ? 'normal' : 'low'
    };
  }, []);

  // Duplication de semaine intelligente
  const duplicateWeek = useCallback((sourceWeek, targetWeek, options = {}) => {
    const { adjustCapacity = true, skipWeekends = true, teamFilter = 'all' } = options;
    
    console.log(`Duplication semaine du ${sourceWeek.toLocaleDateString()} vers ${targetWeek.toLocaleDateString()}`);
    
    if (adjustCapacity) {
      console.log('Ajustement automatique des capacités');
    }
    
    return true;
  }, []);

  // Statistiques de la semaine
  const weekStats = {
    totalRevenue: weekData.reduce((sum, day) => 
      sum + Object.values(day.teams).flat().reduce((daySum, task) => daySum + task.amount, 0), 0
    ),
    totalTasks: weekData.reduce((sum, day) => 
      sum + Object.values(day.teams).flat().length, 0
    ),
    averageUtilization: Object.keys(teams).reduce((sum, teamId) => 
      sum + teams[teamId].utilization, 0
    ) / Object.keys(teams).length,
    criticalTasks: weekData.reduce((sum, day) => 
      sum + Object.values(day.teams).flat().filter(task => task.priority === 'high').length, 0
    )
  };

  // Données pour graphiques
  const teamUtilizationData = {
    labels: Object.values(teams).map(team => team.name),
    datasets: [{
      label: 'Utilisation (%)',
      data: Object.values(teams).map(team => team.utilization),
      backgroundColor: Object.values(teams).map(team => 
        `rgba(${team.color.includes('red') ? '239, 68, 68' : 
               team.color.includes('purple') ? '147, 51, 234' : 
               team.color.includes('green') ? '34, 197, 94' : '59, 130, 246'}, 0.8)`
      ),
      borderWidth: 2,
      borderRadius: 6
    }]
  };

  const dailyRevenueData = {
    labels: weekData.map(day => day.day),
    datasets: [{
      label: 'Revenus (€)',
      data: weekData.map(day => 
        Object.values(day.teams).flat().reduce((sum, task) => sum + task.amount, 0)
      ),
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const getWorkloadColor = (status) => {
    switch(status) {
      case 'overloaded': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-green-500 text-white';
      case 'low': return 'bg-gray-400 text-white';
      default: return 'bg-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <FireIcon className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'normal': return <BoltIcon className="w-4 h-4 text-yellow-500" />;
      case 'low': return <SparklesIcon className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Ultra Premium */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Effet de background animé */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{
                x: Math.random() * 1000,
                y: Math.random() * 200,
              }}
              animate={{
                x: Math.random() * 1000,
                y: Math.random() * 200,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <UserGroupIcon className="w-8 h-8 mr-3" />
                Planning Équipes Intelligence
              </h1>
              <p className="text-teal-100">Gestion collaborative avec IA prédictive</p>
              
              {/* Status IA */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5 text-green-300" />
                  <span className="text-sm">IA Workload: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5" />
                  <span className="text-sm">Optimisation: {Math.round(weekStats.averageUtilization)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Prédictions: ON</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {weekStats.totalRevenue.toLocaleString()}€
              </div>
              <div className="text-teal-100">Semaine prévue</div>
              <div className="flex items-center justify-end mt-2 space-x-2">
                <TrophyIcon className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-300 font-semibold">+15% vs N-1</span>
              </div>
            </div>
          </div>

          {/* KPIs Semaine */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">{weekStats.totalTasks}</div>
              <div className="text-xs text-teal-100">Tâches planifiées</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">{Object.keys(teams).length}</div>
              <div className="text-xs text-teal-100">Équipes actives</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">{Math.round(weekStats.averageUtilization)}%</div>
              <div className="text-xs text-teal-100">Utilisation moy.</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">{weekStats.criticalTasks}</div>
              <div className="text-xs text-teal-100">Tâches critiques</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">
                {Object.values(teams).reduce((sum, team) => sum + team.members.length, 0)}
              </div>
              <div className="text-xs text-teal-100">Techniciens</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">
                {Object.values(teams).reduce((sum, team) => sum + team.capacity, 0)}h
              </div>
              <div className="text-xs text-teal-100">Capacité totale</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">4.9⭐</div>
              <div className="text-xs text-teal-100">Satisfaction</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-xs text-teal-100">Taux succès</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Barre d'outils avancée */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Navigation semaine */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  const newWeek = new Date(currentWeek);
                  newWeek.setDate(newWeek.getDate() - 7);
                  setCurrentWeek(newWeek);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              
              <div className="font-semibold text-gray-900 min-w-48 text-center">
                Semaine du {currentWeek.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}
              </div>
              
              <button 
                onClick={() => {
                  const newWeek = new Date(currentWeek);
                  newWeek.setDate(newWeek.getDate() + 7);
                  setCurrentWeek(newWeek);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Filtre équipe */}
            <select 
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
            >
              <option value="all">Toutes les équipes</option>
              {Object.entries(teams).map(([key, team]) => (
                <option key={key} value={key}>{team.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            {/* Templates et duplication */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTemplateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              <BookmarkIcon className="w-5 h-5 inline mr-2" />
              Templates
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDuplicateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              <DocumentDuplicateIcon className="w-5 h-5 inline mr-2" />
              Dupliquer
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWorkloadAnalysis(!workloadAnalysis)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                workloadAnalysis 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 inline mr-2" />
              Analyse IA {workloadAnalysis ? 'ON' : 'OFF'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Planning principal */}
        <div className="xl:col-span-3">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header avec jours de la semaine */}
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              <div className="grid grid-cols-8 gap-px">
                <div className="p-4 font-semibold">Équipe</div>
                {weekData.slice(0, 7).map((day, index) => (
                  <div key={index} className="p-4 text-center">
                    <div className="font-semibold">{day.day}</div>
                    <div className="text-xs opacity-80">
                      {day.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grille équipes x jours */}
            <div className="p-4">
              {Object.entries(teams).map(([teamId, team]) => {
                if (selectedTeam !== 'all' && selectedTeam !== teamId) return null;
                
                return (
                  <motion.div 
                    key={teamId}
                    className="border-b border-gray-200 last:border-b-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="grid grid-cols-8 gap-px min-h-32">
                      {/* En-tête équipe */}
                      <div className="p-4 bg-gray-50 flex flex-col justify-center">
                        <div className={`text-sm font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${team.color} mb-2`}>
                          {team.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <UserGroupIcon className="w-3 h-3" />
                            <span>{team.members.length} membres</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <ClockIcon className="w-3 h-3" />
                            <span>{team.capacity}h/jour</span>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded mt-2 ${getWorkloadColor(
                            team.utilization > 100 ? 'overloaded' : 
                            team.utilization > 80 ? 'high' : 
                            team.utilization > 50 ? 'normal' : 'low'
                          )}`}>
                            {team.utilization}%
                          </div>
                        </div>
                      </div>

                      {/* Colonnes par jour */}
                      {weekData.slice(0, 7).map((day, dayIndex) => {
                        const dayTasks = day.teams[teamId] || [];
                        const workload = calculateWorkload(teamId, day);
                        
                        return (
                          <div 
                            key={dayIndex}
                            className={`p-2 min-h-32 border-l border-gray-100 hover:bg-gray-50 transition-colors ${
                              workloadAnalysis && workload.status === 'overloaded' ? 'bg-red-50 border-red-200' : ''
                            }`}
                            onDrop={(e) => {
                              e.preventDefault();
                              // Logique drop ici
                            }}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            {/* Indicateur de charge */}
                            {workloadAnalysis && (
                              <div className={`text-xs px-2 py-1 rounded mb-2 ${getWorkloadColor(workload.status)}`}>
                                {workload.totalHours}h/{workload.capacity}h
                              </div>
                            )}
                            
                            <div className="space-y-1">
                              {dayTasks.map((task) => (
                                <motion.div
                                  key={task.id}
                                  className={`p-2 rounded text-xs cursor-pointer bg-gradient-to-r ${team.color} text-white shadow-sm hover:shadow-md transition-all`}
                                  whileHover={{ scale: 1.02 }}
                                  whileDrag={{ scale: 1.05, zIndex: 1000 }}
                                  drag
                                  dragMomentum={false}
                                  onDragStart={() => setDraggedTask(task)}
                                  onDragEnd={() => setDraggedTask(null)}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium truncate">{task.time}</span>
                                    {getPriorityIcon(task.priority)}
                                  </div>
                                  <div className="font-semibold truncate">{task.task}</div>
                                  <div className="opacity-90 truncate">{task.client}</div>
                                  {task.amount > 0 && (
                                    <div className="font-bold mt-1">{task.amount}€</div>
                                  )}
                                </motion.div>
                              ))}
                              
                              {dayTasks.length === 0 && (
                                <div className="text-xs text-gray-400 italic p-2">
                                  Aucune tâche
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          {/* Utilisation équipes */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation Équipes</h3>
            <div className="h-48">
              <Bar
                data={teamUtilizationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 120,
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Revenus par jour */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus par Jour</h3>
            <div className="h-40">
              <Line
                data={dailyRevenueData}
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

          {/* IA Insights */}
          <motion.div 
            className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BeakerIcon className="w-5 h-5 mr-2" />
              IA Insights Équipes
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <LightBulbIcon className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">Optimisation</span>
                </div>
                <p className="text-xs opacity-90">Répartir 2h de l'équipe Création vers Maintenance</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <ExclamationTriangleIcon className="w-4 h-4 text-orange-300" />
                  <span className="text-sm font-semibold">Alerte</span>
                </div>
                <p className="text-xs opacity-90">Équipe Élagage surchargée mercredi</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <TrophyIcon className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">Performance</span>
                </div>
                <p className="text-xs opacity-90">Équipe Technique +12% efficacité</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal Templates */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTemplateModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h3 className="text-xl font-bold flex items-center">
                  <BookmarkIcon className="w-6 h-6 mr-2" />
                  Templates de Semaine
                </h3>
                <p className="opacity-90 text-sm mt-1">Modèles prédéfinis pour optimiser la planification</p>
              </div>
              
              <div className="p-6">
                <div className="grid gap-4">
                  {weekTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedTemplate === template.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">{template.usage} fois</div>
                          <div className="text-xs text-gray-500">utilisé</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-2">Répartition type:</div>
                        <div className="flex space-x-2">
                          {Object.entries(teams).slice(0, 3).map(([teamId, team]) => (
                            <div key={teamId} className={`px-2 py-1 rounded text-xs text-white bg-gradient-to-r ${team.color}`}>
                              {team.name.split(' ')[1]}
                            </div>
                          ))}
                          <div className="px-2 py-1 rounded text-xs bg-gray-300 text-gray-600">...</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex space-x-3 pt-6 border-t mt-6">
                  <button 
                    disabled={!selectedTemplate}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    <CheckCircleIcon className="w-5 h-5 inline mr-2" />
                    Appliquer Template
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    <PlusIcon className="w-5 h-5 inline mr-2" />
                    Créer Template
                  </button>
                  <button 
                    onClick={() => setShowTemplateModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Duplication */}
      <AnimatePresence>
        {showDuplicateModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDuplicateModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <h3 className="text-xl font-bold flex items-center">
                  <DocumentDuplicateIcon className="w-6 h-6 mr-2" />
                  Duplication de Semaine
                </h3>
                <p className="opacity-90 text-sm mt-1">Copie intelligente avec optimisations</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semaine source</label>
                  <input 
                    type="week" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    defaultValue="2024-W33"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semaine destination</label>
                  <input 
                    type="week" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options avancées</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Ajuster selon capacité équipes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Exclure weekends</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Optimiser trajets</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Vérifier conflits clients</span>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <RocketLaunchIcon className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-blue-800">IA Suggestions</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <p>• Réajustement automatique +15% efficacité</p>
                    <p>• Détection 2 créneaux d'optimisation</p>
                    <p>• Économie estimée: 3h de trajet</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    <DocumentDuplicateIcon className="w-5 h-5 inline mr-2" />
                    Dupliquer avec IA
                  </button>
                  <button 
                    onClick={() => setShowDuplicateModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                  >
                    Annuler
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