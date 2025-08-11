import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  TruckIcon,
  CurrencyEuroIcon,
  MapPinIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CogIcon,
  PrinterIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentCheckIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon
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

const StatistiquesPlanningPremium = () => {
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-08-07' });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTechnicien, setSelectedTechnicien] = useState('all');

  // Données statistiques
  const statsGenerales = {
    totalDemandes: 487,
    demandesTraitees: 412,
    demandesEnCours: 53,
    demandesEnAttente: 22,
    tauxCompletion: 84.6,
    tempsInterventionMoyen: 3.2,
    satisfactionMoyenne: 4.6,
    chiffreAffairesTotal: 145780
  };

  const performanceTechniciens = [
    { nom: 'Marc Leblanc', interventions: 156, tauxReussite: 96, satisfaction: 4.8, ca: 48500, specialite: 'Élagage' },
    { nom: 'Paul Moreau', interventions: 142, tauxReussite: 94, satisfaction: 4.7, ca: 42300, specialite: 'Plantation' },
    { nom: 'Luc Bernard', interventions: 114, tauxReussite: 92, satisfaction: 4.5, ca: 34980, specialite: 'Entretien' },
    { nom: 'Jean Durand', interventions: 98, tauxReussite: 95, satisfaction: 4.6, ca: 28700, specialite: 'Taille' },
    { nom: 'Pierre Martin', interventions: 87, tauxReussite: 91, satisfaction: 4.4, ca: 24800, specialite: 'Diagnostic' }
  ];

  const typeInterventions = [
    { type: 'Taille haies', nombre: 142, pourcentage: 29.2, dureeeMoyenne: 2.5, prixMoyen: 180 },
    { type: 'Élagage', nombre: 98, pourcentage: 20.1, dureeeMoyenne: 4.5, prixMoyen: 450 },
    { type: 'Plantation', nombre: 87, pourcentage: 17.9, dureeeMoyenne: 3.0, prixMoyen: 320 },
    { type: 'Entretien pelouse', nombre: 76, pourcentage: 15.6, dureeeMoyenne: 1.5, prixMoyen: 95 },
    { type: 'Diagnostic', nombre: 54, pourcentage: 11.1, dureeeMoyenne: 1.0, prixMoyen: 85 },
    { type: 'Arrosage automatique', nombre: 30, pourcentage: 6.1, dureeeMoyenne: 5.0, prixMoyen: 680 }
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
      className="p-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Statistiques Planning & Demandes
            </h1>
            <p className="text-gray-600 mt-2">Analyse complète des interventions et performances</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
              <option value="custom">Personnalisé</option>
            </select>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <PrinterIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filtres */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2">
                <CalendarDaysIcon className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium">01/01/2025 - 07/08/2025</span>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
                <FunnelIcon className="w-5 h-5 mr-2 text-gray-600" />
                <span>Filtres avancés</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une intervention..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <CogIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs principaux */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-green-600 font-semibold">+12%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{statsGenerales.totalDemandes}</div>
          <div className="text-xs text-gray-600">Total demandes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600 font-semibold">+8%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{statsGenerales.demandesTraitees}</div>
          <div className="text-xs text-gray-600">Traitées</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <ClockIcon className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-orange-600 font-semibold">-5%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{statsGenerales.demandesEnCours}</div>
          <div className="text-xs text-gray-600">En cours</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
            <span className="text-xs text-red-600 font-semibold">+2</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{statsGenerales.demandesEnAttente}</div>
          <div className="text-xs text-gray-600">En attente</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <ArrowTrendingUpIcon className="w-8 h-8 text-indigo-500" />
            <span className="text-xs text-green-600 font-semibold">+3.2%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{statsGenerales.tauxCompletion}%</div>
          <div className="text-xs text-gray-600">Taux réussite</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <ClockIcon className="w-8 h-8 text-orange-500" />
            <span className="text-xs text-green-600 font-semibold">-0.5h</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{statsGenerales.tempsInterventionMoyen}h</div>
          <div className="text-xs text-gray-600">Temps moyen</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-green-600 font-semibold">+0.2</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{statsGenerales.satisfactionMoyenne}/5</div>
          <div className="text-xs text-gray-600">Satisfaction</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <CurrencyEuroIcon className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-600 font-semibold">+15%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{(statsGenerales.chiffreAffairesTotal/1000).toFixed(0)}k€</div>
          <div className="text-xs text-gray-600">CA total</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Evolution temporelle */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-gray-100"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-purple-500" />
              Évolution des demandes
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Line
                data={{
                  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
                  datasets: [
                    {
                      label: 'Demandes reçues',
                      data: [45, 52, 48, 61, 58, 72, 68, 54],
                      borderColor: 'rgb(147, 51, 234)',
                      backgroundColor: 'rgba(147, 51, 234, 0.1)',
                      tension: 0.4,
                      fill: true
                    },
                    {
                      label: 'Demandes traitées',
                      data: [42, 48, 45, 58, 55, 67, 62, 48],
                      borderColor: 'rgb(34, 197, 94)',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 15
                      }
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Répartition par type */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-gray-100"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChartPieIcon className="w-5 h-5 mr-2 text-indigo-500" />
              Répartition par type d'intervention
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Doughnut
                data={{
                  labels: typeInterventions.map(t => t.type),
                  datasets: [{
                    data: typeInterventions.map(t => t.nombre),
                    backgroundColor: [
                      'rgba(147, 51, 234, 0.8)',
                      'rgba(99, 102, 241, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(251, 191, 36, 0.8)',
                      'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                      'rgb(147, 51, 234)',
                      'rgb(99, 102, 241)',
                      'rgb(59, 130, 246)',
                      'rgb(34, 197, 94)',
                      'rgb(251, 191, 36)',
                      'rgb(239, 68, 68)'
                    ],
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                          size: 11
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
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

      {/* Performance techniciens */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <UserGroupIcon className="w-5 h-5 mr-2 text-purple-500" />
            Performance des techniciens
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Technicien
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Spécialité
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Interventions
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Taux réussite
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  CA généré
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {performanceTechniciens.map((technicien, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {technicien.nom.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">{technicien.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {technicien.specialite}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-gray-900">{technicien.interventions}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <span className={`text-sm font-medium ${
                        technicien.tauxReussite >= 95 ? 'text-green-600' : 
                        technicien.tauxReussite >= 90 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {technicien.tauxReussite}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="text-sm font-medium">{technicien.satisfaction}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-green-600">
                      {technicien.ca.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                        style={{ width: `${(technicien.interventions / 156) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Graphique radar des compétences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-gray-100"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <WrenchScrewdriverIcon className="w-5 h-5 mr-2 text-indigo-500" />
              Analyse des compétences équipe
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Radar
                data={{
                  labels: ['Taille', 'Élagage', 'Plantation', 'Entretien', 'Diagnostic', 'Installation'],
                  datasets: [
                    {
                      label: 'Capacité équipe',
                      data: [95, 88, 92, 90, 85, 78],
                      backgroundColor: 'rgba(147, 51, 234, 0.2)',
                      borderColor: 'rgb(147, 51, 234)',
                      pointBackgroundColor: 'rgb(147, 51, 234)',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: 'rgb(147, 51, 234)'
                    },
                    {
                      label: 'Demande client',
                      data: [85, 75, 88, 95, 70, 60],
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      borderColor: 'rgb(59, 130, 246)',
                      pointBackgroundColor: 'rgb(59, 130, 246)',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: 'rgb(59, 130, 246)'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
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
                    r: {
                      angleLines: {
                        display: true
                      },
                      suggestedMin: 0,
                      suggestedMax: 100
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Zones géographiques */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-gray-100"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-green-500" />
              Répartition géographique
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { zone: 'Lyon Centre', interventions: 142, distance: 245, temps: 186 },
                { zone: 'Villeurbanne', interventions: 98, distance: 312, temps: 228 },
                { zone: 'Caluire', interventions: 76, distance: 189, temps: 142 },
                { zone: 'Écully', interventions: 65, distance: 267, temps: 195 },
                { zone: 'Sainte-Foy', interventions: 54, distance: 198, temps: 156 },
                { zone: 'Tassin', interventions: 52, distance: 234, temps: 178 }
              ].map((zone, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{zone.zone}</span>
                        <span className="text-xs text-gray-500">{zone.interventions} interventions</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${(zone.interventions / 142) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">{zone.distance} km parcourus</span>
                        <span className="text-xs text-gray-500">{zone.temps}h de trajet</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatistiquesPlanningPremium;