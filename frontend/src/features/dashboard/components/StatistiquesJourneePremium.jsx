import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  TruckIcon,
  CurrencyEuroIcon,
  MapPinIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  BanknotesIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseIcon,
  PlayIcon,
  Battery50Icon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, PolarArea } from 'react-chartjs-2';
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

const StatistiquesJourneePremium = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState('today');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Statistiques temps réel
  const statsTempsReel = {
    heureActuelle: currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    interventionsCompletees: 3,
    interventionsTotal: 7,
    tempsTravaille: 5.5,
    tempsPauses: 0.75,
    tempsTrajet: 1.25,
    kmParcourus: 42.3,
    caRealise: 725,
    caPrevu: 1420,
    efficacite: 87,
    energie: 72
  };

  // Performance journalière
  const performanceJournee = {
    productivite: 92,
    qualite: 95,
    ponctualite: 88,
    satisfaction: 96,
    rentabilite: 89
  };

  // Historique hebdomadaire
  const historiqueHebdo = [
    { jour: 'Lun', interventions: 6, ca: 1250, heures: 8.5, km: 67 },
    { jour: 'Mar', interventions: 7, ca: 1480, heures: 9.0, km: 82 },
    { jour: 'Mer', interventions: 5, ca: 980, heures: 7.5, km: 54 },
    { jour: 'Jeu', interventions: 8, ca: 1620, heures: 9.5, km: 91 },
    { jour: 'Ven', interventions: 7, ca: 1420, heures: 8.5, km: 76 },
    { jour: 'Sam', interventions: 4, ca: 680, heures: 5.0, km: 45 }
  ];

  // Détail interventions journée
  const interventionsDetail = [
    { 
      heure: '08:00', 
      duree: 2, 
      type: 'Taille haies',
      client: 'Jean Dupont',
      status: 'completed',
      ca: 180,
      efficacite: 95,
      satisfaction: 5
    },
    { 
      heure: '10:30', 
      duree: 1.5, 
      type: 'Diagnostic',
      client: 'Marie Rousseau',
      status: 'completed',
      ca: 95,
      efficacite: 100,
      satisfaction: 5
    },
    { 
      heure: '14:00', 
      duree: 4, 
      type: 'Élagage',
      client: 'Château de Versant',
      status: 'in_progress',
      ca: 450,
      efficacite: 65,
      progression: 65
    },
    { 
      heure: '18:00', 
      duree: 1.5, 
      type: 'Plantation',
      client: 'Sophie Martin',
      status: 'scheduled',
      ca: 320,
      efficacite: 0
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-slate-50 to-orange-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header avec temps réel */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Statistiques Ma Journée
            </h1>
            <p className="text-gray-600 mt-2">Suivi en temps réel et analyse de performance</p>
            <div className="flex items-center mt-3 space-x-6">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">{statsTempsReel.heureActuelle}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Battery50Icon className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Énergie: {statsTempsReel.energie}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <BoltIcon className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Efficacité: {statsTempsReel.efficacite}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="today">Aujourd'hui</option>
              <option value="yesterday">Hier</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* KPIs temps réel */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold">{statsTempsReel.interventionsCompletees}</span>
          </div>
          <div className="text-xs text-gray-600">Complétées</div>
          <div className="text-xs text-green-600 font-semibold mt-1">
            {((statsTempsReel.interventionsCompletees / statsTempsReel.interventionsTotal) * 100).toFixed(0)}% du jour
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <ClockIcon className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">{statsTempsReel.tempsTravaille}h</span>
          </div>
          <div className="text-xs text-gray-600">Temps travaillé</div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(statsTempsReel.tempsTravaille / 8) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <TruckIcon className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold">{statsTempsReel.kmParcourus}</span>
          </div>
          <div className="text-xs text-gray-600">Km parcourus</div>
          <div className="text-xs text-purple-600 font-semibold mt-1">
            {statsTempsReel.tempsTrajet}h de trajet
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <PauseIcon className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold">{(statsTempsReel.tempsPauses * 60).toFixed(0)}min</span>
          </div>
          <div className="text-xs text-gray-600">Temps pause</div>
          <div className="text-xs text-orange-600 font-semibold mt-1">
            {((statsTempsReel.tempsPauses / statsTempsReel.tempsTravaille) * 100).toFixed(0)}% du temps
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <CurrencyEuroIcon className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold">{statsTempsReel.caRealise}€</span>
          </div>
          <div className="text-xs text-gray-600">CA réalisé</div>
          <div className="text-xs text-green-600 font-semibold mt-1">
            Objectif: {statsTempsReel.caPrevu}€
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <FireIcon className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold">{statsTempsReel.efficacite}%</span>
          </div>
          <div className="text-xs text-gray-600">Efficacité</div>
          <div className="text-xs text-yellow-600 font-semibold mt-1">
            Top performance!
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Timeline de la journée */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-orange-500" />
              Timeline détaillée
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Bar
                data={{
                  labels: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
                  datasets: [
                    {
                      label: 'Interventions',
                      data: [100, 100, 50, 50, 0, 0, 100, 100, 100, 100, 50, 50],
                      backgroundColor: 'rgba(251, 146, 60, 0.8)',
                      borderColor: 'rgb(251, 146, 60)',
                      borderWidth: 1
                    },
                    {
                      label: 'Trajets',
                      data: [0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 50, 0],
                      backgroundColor: 'rgba(147, 51, 234, 0.8)',
                      borderColor: 'rgb(147, 51, 234)',
                      borderWidth: 1
                    },
                    {
                      label: 'Pauses',
                      data: [0, 0, 0, 0, 50, 50, 0, 0, 0, 0, 0, 0],
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      borderColor: 'rgb(59, 130, 246)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      stacked: true,
                      max: 100,
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 15
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.parsed.y}%`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Indicateurs de performance */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-gray-100"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-yellow-500" />
              Performance du jour
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <PolarArea
                data={{
                  labels: ['Productivité', 'Qualité', 'Ponctualité', 'Satisfaction', 'Rentabilité'],
                  datasets: [{
                    data: [
                      performanceJournee.productivite,
                      performanceJournee.qualite,
                      performanceJournee.ponctualite,
                      performanceJournee.satisfaction,
                      performanceJournee.rentabilite
                    ],
                    backgroundColor: [
                      'rgba(251, 146, 60, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(251, 191, 36, 0.8)',
                      'rgba(147, 51, 234, 0.8)'
                    ],
                    borderColor: [
                      'rgb(251, 146, 60)',
                      'rgb(34, 197, 94)',
                      'rgb(59, 130, 246)',
                      'rgb(251, 191, 36)',
                      'rgb(147, 51, 234)'
                    ],
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.parsed.r}%`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tableau détaillé des interventions */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <WrenchScrewdriverIcon className="w-5 h-5 mr-2 text-indigo-500" />
            Détail des interventions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Type intervention
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Efficacité
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  CA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {interventionsDetail.map((intervention, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{intervention.heure}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{intervention.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{intervention.client}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">{intervention.duree}h</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {intervention.status === 'completed' && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Terminé
                      </span>
                    )}
                    {intervention.status === 'in_progress' && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        En cours ({intervention.progression}%)
                      </span>
                    )}
                    {intervention.status === 'scheduled' && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Planifié
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            intervention.efficacite >= 90 ? 'bg-green-500' :
                            intervention.efficacite >= 70 ? 'bg-yellow-500' :
                            intervention.efficacite > 0 ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                          style={{ width: `${intervention.efficacite}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium">{intervention.efficacite}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {intervention.satisfaction ? (
                      <div className="flex items-center justify-center">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i}
                            className={`text-sm ${i < intervention.satisfaction ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-green-600">{intervention.ca} €</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Comparaison hebdomadaire */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-purple-500" />
            Historique hebdomadaire
          </h3>
        </div>
        <div className="p-6">
          <div className="h-80">
            <Line
              data={{
                labels: historiqueHebdo.map(h => h.jour),
                datasets: [
                  {
                    label: 'Interventions',
                    data: historiqueHebdo.map(h => h.interventions),
                    borderColor: 'rgb(251, 146, 60)',
                    backgroundColor: 'rgba(251, 146, 60, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4
                  },
                  {
                    label: 'CA (€)',
                    data: historiqueHebdo.map(h => h.ca),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.4
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      usePointStyle: true,
                      padding: 15
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
                      text: 'Interventions'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'CA (€)'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatistiquesJourneePremium;