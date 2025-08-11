import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TruckIcon,
  MapPinIcon,
  BoltIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  Battery100Icon,
  SignalIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  SparklesIcon,
  BeakerIcon,
  BellAlertIcon,
  PhotoIcon,
  QrCodeIcon,
  KeyIcon,
  MapIcon,
  PaperClipIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  WifiIcon,
  Square3Stack3DIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const VehiculesUltraPremium = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [liveTracking, setLiveTracking] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [realTimeData, setRealTimeData] = useState({});

  // Simulation de données temps réel
  useEffect(() => {
    if (liveTracking) {
      const interval = setInterval(() => {
        setRealTimeData({
          positions: Math.random(),
          fuel: Math.floor(Math.random() * 10) + 60,
          speed: Math.floor(Math.random() * 30) + 30
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [liveTracking]);

  // Flotte de véhicules
  const vehicles = [
    {
      id: 'VH-001',
      type: 'Camion nacelle',
      brand: 'Mercedes',
      model: 'Sprinter 316 CDI',
      plate: 'FG-123-ZX',
      year: 2021,
      status: 'active',
      location: {
        current: 'Parc Municipal',
        lat: 45.7751,
        lng: 4.8525,
        lastUpdate: new Date()
      },
      driver: {
        name: 'Marc Leblanc',
        phone: '06 12 34 56 78',
        license: 'B, C',
        experience: 8
      },
      mileage: {
        total: 45230,
        month: 1850,
        week: 420,
        today: 67
      },
      fuel: {
        level: 75,
        type: 'Diesel',
        consumption: 8.5,
        lastRefuel: new Date('2024-08-14'),
        cost: 156
      },
      maintenance: {
        lastService: new Date('2024-07-15'),
        nextService: new Date('2024-10-15'),
        serviceDue: 54770,
        alerts: ['Pneus à vérifier', 'Vidange proche'],
        history: 12
      },
      equipment: [
        'Nacelle 16m',
        'GPS tracker',
        'Dashcam',
        'Kit urgence',
        'Outillage complet'
      ],
      insurance: {
        company: 'AXA Pro',
        number: 'FLT2024001',
        expiry: new Date('2025-03-31'),
        coverage: 'Tous risques Pro'
      },
      performance: {
        efficiency: 92,
        safety: 98,
        punctuality: 95,
        fuelEconomy: 87
      },
      tracking: {
        speed: 42,
        engine: 'on',
        doors: 'locked',
        temperature: 22,
        battery: 13.2
      },
      documents: {
        registration: true,
        insurance: true,
        inspection: true,
        permit: true
      },
      costs: {
        purchase: 65000,
        monthly: 1850,
        fuel: 450,
        maintenance: 280,
        insurance: 320
      }
    },
    {
      id: 'VH-002',
      type: 'Utilitaire',
      brand: 'Renault',
      model: 'Master L2H2',
      plate: 'GH-456-YZ',
      year: 2022,
      status: 'active',
      location: {
        current: 'Villa Moderne',
        lat: 45.7640,
        lng: 4.8800,
        lastUpdate: new Date()
      },
      driver: {
        name: 'Paul Moreau',
        phone: '06 23 45 67 89',
        license: 'B',
        experience: 5
      },
      mileage: {
        total: 28450,
        month: 1420,
        week: 350,
        today: 45
      },
      fuel: {
        level: 60,
        type: 'Diesel',
        consumption: 7.2,
        lastRefuel: new Date('2024-08-13'),
        cost: 98
      },
      maintenance: {
        lastService: new Date('2024-06-20'),
        nextService: new Date('2024-09-20'),
        serviceDue: 33450,
        alerts: [],
        history: 8
      },
      equipment: [
        'Échelle 8m',
        'GPS tracker',
        'Kit outillage',
        'Bâche'
      ],
      insurance: {
        company: 'Allianz',
        number: 'FLT2024002',
        expiry: new Date('2025-03-31'),
        coverage: 'Tous risques'
      },
      performance: {
        efficiency: 88,
        safety: 95,
        punctuality: 90,
        fuelEconomy: 92
      },
      tracking: {
        speed: 0,
        engine: 'off',
        doors: 'locked',
        temperature: 24,
        battery: 12.8
      },
      documents: {
        registration: true,
        insurance: true,
        inspection: true,
        permit: true
      },
      costs: {
        purchase: 42000,
        monthly: 1250,
        fuel: 320,
        maintenance: 180,
        insurance: 250
      }
    },
    {
      id: 'VH-003',
      type: 'Mini-pelle',
      brand: 'Kubota',
      model: 'KX027-4',
      plate: 'SP-789-AB',
      year: 2020,
      status: 'maintenance',
      location: {
        current: 'Garage central',
        lat: 45.7500,
        lng: 4.8400,
        lastUpdate: new Date()
      },
      driver: {
        name: 'Jean Durand',
        phone: '06 34 56 78 90',
        license: 'CACES 1',
        experience: 10
      },
      mileage: {
        total: 1850,
        month: 120,
        week: 30,
        today: 0
      },
      fuel: {
        level: 45,
        type: 'Diesel',
        consumption: 4.5,
        lastRefuel: new Date('2024-08-10'),
        cost: 65
      },
      maintenance: {
        lastService: new Date('2024-08-01'),
        nextService: new Date('2024-11-01'),
        serviceDue: 2000,
        alerts: ['Révision hydraulique en cours'],
        history: 15
      },
      equipment: [
        'Godet 45cm',
        'Godet curage',
        'Balise',
        'Gyrophare'
      ],
      insurance: {
        company: 'Groupama',
        number: 'FLT2024003',
        expiry: new Date('2025-03-31'),
        coverage: 'Bris machine'
      },
      performance: {
        efficiency: 85,
        safety: 92,
        punctuality: 88,
        fuelEconomy: 78
      },
      tracking: {
        speed: 0,
        engine: 'off',
        doors: 'n/a',
        temperature: 20,
        battery: 12.5
      },
      documents: {
        registration: true,
        insurance: true,
        inspection: true,
        permit: true
      },
      costs: {
        purchase: 35000,
        monthly: 950,
        fuel: 180,
        maintenance: 350,
        insurance: 180
      }
    },
    {
      id: 'VH-004',
      type: 'Remorque',
      brand: 'Humbaur',
      model: 'HTK 3000',
      plate: 'RQ-012-CD',
      year: 2019,
      status: 'available',
      location: {
        current: 'Base',
        lat: 45.7600,
        lng: 4.8500,
        lastUpdate: new Date()
      },
      driver: {
        name: null,
        phone: null,
        license: 'BE',
        experience: null
      },
      mileage: {
        total: 12000,
        month: 450,
        week: 100,
        today: 0
      },
      fuel: {
        level: null,
        type: null,
        consumption: 0,
        lastRefuel: null,
        cost: 0
      },
      maintenance: {
        lastService: new Date('2024-05-15'),
        nextService: new Date('2025-05-15'),
        serviceDue: null,
        alerts: [],
        history: 5
      },
      equipment: [
        'Bâche',
        'Sangles',
        'Cales',
        'Filet'
      ],
      insurance: {
        company: 'AXA Pro',
        number: 'FLT2024004',
        expiry: new Date('2025-03-31'),
        coverage: 'Responsabilité'
      },
      performance: {
        efficiency: 95,
        safety: 100,
        punctuality: null,
        fuelEconomy: null
      },
      tracking: {
        speed: 0,
        engine: 'n/a',
        doors: 'n/a',
        temperature: null,
        battery: null
      },
      documents: {
        registration: true,
        insurance: true,
        inspection: true,
        permit: false
      },
      costs: {
        purchase: 8000,
        monthly: 150,
        fuel: 0,
        maintenance: 50,
        insurance: 100
      }
    }
  ];

  // Stats globales flotte
  const fleetStats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
    totalMileage: vehicles.reduce((acc, v) => acc + v.mileage.total, 0),
    avgFuelLevel: Math.round(vehicles.filter(v => v.fuel.level).reduce((acc, v) => acc + v.fuel.level, 0) / vehicles.filter(v => v.fuel.level).length),
    totalCosts: vehicles.reduce((acc, v) => acc + v.costs.monthly, 0),
    avgEfficiency: Math.round(vehicles.reduce((acc, v) => acc + v.performance.efficiency, 0) / vehicles.length),
    maintenanceAlerts: vehicles.reduce((acc, v) => acc + v.maintenance.alerts.length, 0)
  };

  // Graphique coûts mensuels
  const costChart = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
    datasets: [
      {
        label: 'Carburant',
        data: [1850, 1920, 1780, 2100, 2250, 2180, 2350, 2280],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      },
      {
        label: 'Maintenance',
        data: [850, 620, 1200, 450, 980, 750, 550, 860],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Assurance',
        data: [850, 850, 850, 850, 850, 850, 850, 850],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      }
    ]
  };

  // Distribution utilisation
  const usageDistribution = {
    labels: vehicles.map(v => v.type),
    datasets: [{
      data: vehicles.map(v => v.mileage.month),
      backgroundColor: [
        'rgba(147, 51, 234, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Radar performance flotte
  const performanceRadar = {
    labels: ['Efficacité', 'Sécurité', 'Ponctualité', 'Économie', 'Maintenance', 'Disponibilité'],
    datasets: [{
      label: 'Performance globale',
      data: [88, 95, 91, 85, 82, 93],
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(147, 51, 234)'
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'maintenance': return 'from-yellow-500 to-amber-500';
      case 'available': return 'from-blue-500 to-indigo-500';
      case 'reserved': return 'from-purple-500 to-pink-500';
      case 'inactive': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'available': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reserved': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getVehicleIcon = (type) => {
    switch(type) {
      case 'Camion nacelle': return '🚛';
      case 'Utilitaire': return '🚐';
      case 'Mini-pelle': return '🚜';
      case 'Remorque': return '🚚';
      default: return '🚗';
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Flotte */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-gray-700 via-slate-700 to-zinc-700 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation véhicule */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <TruckIcon className="w-32 h-32" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <TruckIcon className="w-8 h-8 mr-3" />
                Gestion Flotte Intelligente
              </h1>
              <p className="text-gray-100">Tracking GPS et maintenance prédictive</p>
              
              {/* Indicateurs système */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">GPS actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <WifiIcon className="w-5 h-5" />
                  <span className="text-sm">Connexion: 4G</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">IA: Maintenance prédictive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Autonomie: {fleetStats.avgFuelLevel}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Mode tracking</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{fleetStats.activeVehicles}/{fleetStats.totalVehicles}</div>
              <div className="text-gray-100">Véhicules actifs</div>
              <div className="mt-3 flex items-center justify-end space-x-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {(fleetStats.totalMileage / 1000).toFixed(0)}K km total
                </span>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300">
                  <PlusIcon className="w-5 h-5 inline mr-1" />
                  Nouveau véhicule
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Flotte */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Véhicules', value: fleetStats.totalVehicles, icon: '🚛', color: 'from-blue-500 to-indigo-500' },
          { label: 'Actifs', value: fleetStats.activeVehicles, icon: '✅', color: 'from-green-500 to-emerald-500', pulse: true },
          { label: 'Maintenance', value: fleetStats.maintenanceVehicles, icon: '🔧', color: 'from-yellow-500 to-amber-500' },
          { label: 'Kilométrage', value: `${(fleetStats.totalMileage / 1000).toFixed(0)}K`, icon: '🛣️', color: 'from-purple-500 to-pink-500' },
          { label: 'Carburant', value: `${fleetStats.avgFuelLevel}%`, icon: '⛽', color: 'from-cyan-500 to-blue-500' },
          { label: 'Coûts/mois', value: `${fleetStats.totalCosts}€`, icon: '💰', color: 'from-red-500 to-orange-500' },
          { label: 'Efficacité', value: `${fleetStats.avgEfficiency}%`, icon: '📊', color: 'from-indigo-500 to-purple-500' },
          { label: 'Alertes', value: fleetStats.maintenanceAlerts, icon: '⚠️', color: fleetStats.maintenanceAlerts > 0 ? 'from-red-500 to-rose-500' : 'from-gray-400 to-gray-500', pulse: fleetStats.maintenanceAlerts > 0 }
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
              <div className="text-xl font-bold text-gray-900 flex items-center">
                {kpi.icon} {kpi.value}
                {kpi.pulse && <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </div>
              <div className="text-xs text-gray-600">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contrôles */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Filtre statut */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none"
            >
              <option value="all">Tous statuts</option>
              <option value="active">Actifs</option>
              <option value="maintenance">Maintenance</option>
              <option value="available">Disponibles</option>
            </select>

            {/* Mode vue */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded ${viewMode === 'map' ? 'bg-white shadow' : ''}`}
              >
                Carte
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setLiveTracking(!liveTracking)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                liveTracking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <SignalIcon className={`w-5 h-5 inline mr-2 ${liveTracking ? 'animate-pulse' : ''}`} />
              Tracking {liveTracking ? 'ON' : 'OFF'}
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des véhicules */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-gray-600 to-slate-600 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Square3Stack3DIcon className="w-5 h-5 mr-2" />
                Flotte Véhicules
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {vehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedVehicle(vehicle)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header véhicule */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{getVehicleIcon(vehicle.type)}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-semibold text-gray-900">{vehicle.type}</h4>
                            <span className="text-xs font-mono text-gray-500">#{vehicle.id}</span>
                          </div>
                          <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model} - {vehicle.plate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(vehicle.status)}`}>
                          {vehicle.status === 'active' ? 'Actif' :
                           vehicle.status === 'maintenance' ? 'Maintenance' :
                           vehicle.status === 'available' ? 'Disponible' : vehicle.status}
                        </span>
                        {vehicle.tracking.engine === 'on' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Infos principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{vehicle.location.current}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{vehicle.driver.name || 'Non assigné'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BoltIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{vehicle.mileage.today} km auj.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">⛽</span>
                        <span className="text-sm font-bold text-gray-900">{vehicle.fuel.level || 'N/A'}%</span>
                      </div>
                    </div>

                    {/* Barres de progression */}
                    <div className="space-y-2 mb-4">
                      {vehicle.fuel.level && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Carburant</span>
                            <span className="font-semibold">{vehicle.fuel.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full bg-gradient-to-r ${
                                vehicle.fuel.level >= 60 ? 'from-green-500 to-emerald-500' :
                                vehicle.fuel.level >= 30 ? 'from-yellow-500 to-amber-500' :
                                'from-red-500 to-orange-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${vehicle.fuel.level}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Prochain entretien</span>
                          <span className="font-semibold">
                            {vehicle.maintenance.serviceDue ? 
                              `${vehicle.maintenance.serviceDue - vehicle.mileage.total} km` :
                              vehicle.maintenance.nextService.toLocaleDateString('fr-FR')
                            }
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min(100, ((vehicle.mileage.total - 40000) / (vehicle.maintenance.serviceDue - 40000 || 5000)) * 100)}%` 
                            }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stats performance */}
                    <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg mb-3">
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900">{vehicle.performance.efficiency}%</div>
                        <div className="text-xs text-gray-500">Efficacité</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900">{vehicle.performance.safety}%</div>
                        <div className="text-xs text-gray-500">Sécurité</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900">{vehicle.costs.monthly}€</div>
                        <div className="text-xs text-gray-500">Coût/mois</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900">{vehicle.mileage.month}km</div>
                        <div className="text-xs text-gray-500">Ce mois</div>
                      </div>
                    </div>

                    {/* Alertes maintenance */}
                    {vehicle.maintenance.alerts.length > 0 && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-yellow-700">{vehicle.maintenance.alerts.join(' • ')}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        {vehicle.tracking.speed > 0 && (
                          <span className="flex items-center text-xs text-green-600">
                            <SignalIcon className="w-3 h-3 mr-1 animate-pulse" />
                            {vehicle.tracking.speed} km/h
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          Màj: {vehicle.location.lastUpdate.toLocaleTimeString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <MapIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                          <ChartBarIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                          <DocumentTextIcon className="w-4 h-4" />
                        </button>
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
          {/* Graphique coûts */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coûts Mensuels</h3>
            <div className="h-48">
              <Bar
                data={costChart}
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
                    x: {
                      stacked: true
                    },
                    y: {
                      stacked: true,
                      ticks: {
                        callback: (value) => `${value}€`
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Distribution utilisation */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation Mensuelle</h3>
            <div className="h-48">
              <Doughnut
                data={usageDistribution}
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

          {/* Performance radar */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Flotte</h3>
            <div className="h-48">
              <Radar
                data={performanceRadar}
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

          {/* Centre de contrôle */}
          <motion.div 
            className="bg-gradient-to-br from-gray-600 to-slate-600 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Centre de Contrôle
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Maintenance prévue</span>
                  <WrenchScrewdriverIcon className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-xs mt-1 opacity-90">VH-002 dans 5 jours</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Alerte carburant</span>
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-300" />
                </div>
                <div className="text-xs mt-1 opacity-90">VH-003: 45% restant</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Documents à renouveler</span>
                  <DocumentTextIcon className="w-5 h-5" />
                </div>
                <div className="text-xs mt-1 opacity-90">Assurances: Mars 2025</div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              <BeakerIcon className="w-5 h-5 inline mr-2" />
              Diagnostic complet flotte
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VehiculesUltraPremium;