import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapIcon,
  MapPinIcon,
  GlobeAltIcon,
  TruckIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  RocketLaunchIcon,
  SignalIcon,
  Battery100Icon,
  CpuChipIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ShoppingBagIcon,
  AcademicCapIcon,
  HeartIcon,
  StarIcon,
  SunIcon,
  CloudIcon,
  BeakerIcon,
  WifiIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const CarteGeographiqueUltraPremium = () => {
  const [mapView, setMapView] = useState('interventions');
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [liveTracking, setLiveTracking] = useState(true);
  const [filterType, setFilterType] = useState('all');

  // Simulation de mise à jour des positions
  useEffect(() => {
    if (liveTracking) {
      const interval = setInterval(() => {
        // Simulation de déplacement des véhicules
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [liveTracking]);

  // Zones d'intervention
  const zones = [
    {
      id: 'zone-a',
      name: 'Zone A - Centre',
      coordinates: { lat: 45.764, lng: 4.835 },
      radius: 3,
      interventions: 12,
      teams: 3,
      revenue: 8500,
      density: 'high',
      color: 'rgba(239, 68, 68, 0.3)'
    },
    {
      id: 'zone-b',
      name: 'Zone B - Nord',
      coordinates: { lat: 45.785, lng: 4.850 },
      radius: 4,
      interventions: 8,
      teams: 2,
      revenue: 5200,
      density: 'medium',
      color: 'rgba(59, 130, 246, 0.3)'
    },
    {
      id: 'zone-c',
      name: 'Zone C - Sud',
      coordinates: { lat: 45.745, lng: 4.825 },
      radius: 5,
      interventions: 6,
      teams: 2,
      revenue: 3800,
      density: 'low',
      color: 'rgba(34, 197, 94, 0.3)'
    },
    {
      id: 'zone-d',
      name: 'Zone D - Est',
      coordinates: { lat: 45.760, lng: 4.880 },
      radius: 3.5,
      interventions: 10,
      teams: 2,
      revenue: 6200,
      density: 'medium',
      color: 'rgba(251, 191, 36, 0.3)'
    }
  ];

  // Points d'intervention sur la carte
  const interventionPoints = [
    {
      id: 1,
      type: 'urgent',
      title: 'Élagage urgent',
      client: 'Mairie de Lyon',
      address: 'Parc de la Tête d\'Or',
      coordinates: { lat: 45.7751, lng: 4.8525 },
      status: 'in_progress',
      team: 'Équipe A',
      eta: '30 min',
      priority: 'critical',
      icon: '🌳'
    },
    {
      id: 2,
      type: 'scheduled',
      title: 'Installation arrosage',
      client: 'Villa Moderne',
      address: '45 Rue des Jardins',
      coordinates: { lat: 45.7640, lng: 4.8800 },
      status: 'scheduled',
      team: 'Équipe B',
      eta: '14:00',
      priority: 'normal',
      icon: '💧'
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Entretien mensuel',
      client: 'Résidence Harmony',
      address: '23 Rue de la Paix',
      coordinates: { lat: 45.7600, lng: 4.8350 },
      status: 'completed',
      team: 'Équipe C',
      eta: 'Terminé',
      priority: 'low',
      icon: '🧹'
    },
    {
      id: 4,
      type: 'diagnostic',
      title: 'Diagnostic phytosanitaire',
      client: 'Jardin Botanique',
      address: '8 Boulevard des Sciences',
      coordinates: { lat: 45.7290, lng: 4.8270 },
      status: 'scheduled',
      team: 'Spécialiste',
      eta: '09:00',
      priority: 'normal',
      icon: '🔬'
    },
    {
      id: 5,
      type: 'creation',
      title: 'Création jardin',
      client: 'Entreprise TechCorp',
      address: '156 Avenue Innovation',
      coordinates: { lat: 45.7485, lng: 4.8467 },
      status: 'in_progress',
      team: 'Équipe complète',
      eta: 'En cours',
      priority: 'high',
      icon: '🎨'
    }
  ];

  // Véhicules en déplacement
  const vehicles = [
    {
      id: 'V001',
      type: 'truck',
      driver: 'Marc Leblanc',
      position: { lat: 45.770, lng: 4.845 },
      destination: { lat: 45.7751, lng: 4.8525 },
      speed: 42,
      status: 'en_route',
      battery: 85,
      nextStop: 'Parc de la Tête d\'Or',
      cargo: ['Tronçonneuse', 'Nacelle']
    },
    {
      id: 'V002',
      type: 'van',
      driver: 'Paul Moreau',
      position: { lat: 45.755, lng: 4.860 },
      destination: { lat: 45.7640, lng: 4.8800 },
      speed: 0,
      status: 'parked',
      battery: 100,
      nextStop: 'Villa Moderne',
      cargo: ['Kit arrosage']
    },
    {
      id: 'V003',
      type: 'truck',
      driver: 'Jean Durand',
      position: { lat: 45.765, lng: 4.830 },
      destination: null,
      speed: 0,
      status: 'idle',
      battery: 62,
      nextStop: 'Base',
      cargo: []
    }
  ];

  // Stats globales carte
  const mapStats = {
    totalInterventions: interventionPoints.length,
    activeTeams: vehicles.filter(v => v.status === 'en_route').length,
    completedToday: 8,
    scheduledToday: 12,
    avgResponseTime: 28,
    coverage: 92,
    efficiency: 87,
    totalDistance: 156
  };

  // Graphique densité par zone
  const densityChart = {
    labels: zones.map(z => z.name.split(' - ')[1]),
    datasets: [{
      label: 'Interventions',
      data: zones.map(z => z.interventions),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Distribution par type
  const typeDistribution = {
    labels: ['Urgent', 'Planifié', 'Maintenance', 'Diagnostic', 'Création'],
    datasets: [{
      data: [2, 3, 4, 2, 1],
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'in_progress': return 'bg-blue-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'from-red-500 to-orange-500';
      case 'high': return 'from-orange-500 to-yellow-500';
      case 'normal': return 'from-blue-500 to-indigo-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Géolocalisation */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation satellite */}
        <div className="absolute top-4 right-4 opacity-20">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <WifiIcon className="w-16 h-16" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <GlobeAltIcon className="w-8 h-8 mr-3 animate-spin-slow" />
                Carte Géographique Intelligente
              </h1>
              <p className="text-blue-100">Supervision géolocalisée et optimisation des trajets</p>
              
              {/* Indicateurs GPS */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">GPS actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SignalIcon className="w-5 h-5" />
                  <span className="text-sm">Signal: Excellent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery100Icon className="w-5 h-5" />
                  <span className="text-sm">Couverture: {mapStats.coverage}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Navigation IA</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{mapStats.activeTeams}</div>
              <div className="text-blue-100">Équipes sur le terrain</div>
              <div className="mt-3 flex items-center justify-end space-x-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {mapStats.totalDistance} km parcourus
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Géographiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Interventions', value: mapStats.totalInterventions, icon: '📍', color: 'from-blue-500 to-indigo-500' },
          { label: 'Équipes actives', value: mapStats.activeTeams, icon: '🚗', color: 'from-green-500 to-emerald-500', pulse: true },
          { label: 'Terminées', value: mapStats.completedToday, icon: '✅', color: 'from-purple-500 to-pink-500' },
          { label: 'Planifiées', value: mapStats.scheduledToday, icon: '📅', color: 'from-yellow-500 to-amber-500' },
          { label: 'Temps réponse', value: `${mapStats.avgResponseTime}min`, icon: '⏱️', color: 'from-cyan-500 to-blue-500' },
          { label: 'Couverture', value: `${mapStats.coverage}%`, icon: '🗺️', color: 'from-indigo-500 to-purple-500' },
          { label: 'Efficacité', value: `${mapStats.efficiency}%`, icon: '📊', color: 'from-green-400 to-emerald-400' },
          { label: 'Distance', value: `${mapStats.totalDistance}km`, icon: '🛣️', color: 'from-gray-500 to-gray-600' }
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
                {kpi.pulse && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              </div>
              <div className="text-xs text-gray-600">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contrôles carte */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Mode d'affichage */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMapView('interventions')}
                className={`px-3 py-1 rounded ${mapView === 'interventions' ? 'bg-white shadow' : ''}`}
              >
                Interventions
              </button>
              <button
                onClick={() => setMapView('vehicles')}
                className={`px-3 py-1 rounded ${mapView === 'vehicles' ? 'bg-white shadow' : ''}`}
              >
                Véhicules
              </button>
              <button
                onClick={() => setMapView('zones')}
                className={`px-3 py-1 rounded ${mapView === 'zones' ? 'bg-white shadow' : ''}`}
              >
                Zones
              </button>
            </div>

            {/* Filtres */}
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Tous types</option>
              <option value="urgent">Urgent</option>
              <option value="scheduled">Planifié</option>
              <option value="maintenance">Maintenance</option>
            </select>

            {/* Options d'affichage */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-2 rounded-lg font-medium ${
                  showHeatmap ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                🔥 Heatmap
              </button>
              <button 
                onClick={() => setShowTraffic(!showTraffic)}
                className={`px-3 py-2 rounded-lg font-medium ${
                  showTraffic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                🚦 Trafic
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
              <ArrowsPointingOutIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte principale (simulée) */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden h-[600px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Simulation de carte */}
            <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100">
              {/* Overlay de grille */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: 'linear-gradient(0deg, #ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }} />
              </div>

              {/* Zones */}
              {showHeatmap && zones.map((zone) => (
                <motion.div
                  key={zone.id}
                  className="absolute rounded-full"
                  style={{
                    left: `${(zone.coordinates.lng - 4.82) * 1000}%`,
                    top: `${(45.78 - zone.coordinates.lat) * 1000}%`,
                    width: `${zone.radius * 20}px`,
                    height: `${zone.radius * 20}px`,
                    backgroundColor: zone.color
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedZone(zone)}
                />
              ))}

              {/* Points d'intervention */}
              {interventionPoints.map((point, index) => (
                <motion.div
                  key={point.id}
                  className="absolute"
                  style={{
                    left: `${(point.coordinates.lng - 4.82) * 1000}%`,
                    top: `${(45.78 - point.coordinates.lat) * 1000}%`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative group">
                    <div className={`w-10 h-10 rounded-full ${getStatusColor(point.status)} flex items-center justify-center text-white text-xl shadow-lg cursor-pointer`}>
                      {point.icon}
                    </div>
                    {point.status === 'in_progress' && (
                      <div className="absolute inset-0 w-10 h-10 rounded-full bg-blue-500 opacity-50 animate-ping" />
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl whitespace-nowrap">
                        <div className="font-semibold">{point.title}</div>
                        <div className="text-xs opacity-90">{point.client}</div>
                        <div className="text-xs opacity-75 mt-1">{point.address}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs">{point.team}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${getPriorityColor(point.priority)} text-white`}>
                            {point.eta}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Véhicules */}
              {mapView === 'vehicles' && vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  className="absolute"
                  style={{
                    left: `${(vehicle.position.lng - 4.82) * 1000}%`,
                    top: `${(45.78 - vehicle.position.lat) * 1000}%`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative group">
                    <div className={`w-8 h-8 rounded-full ${
                      vehicle.status === 'en_route' ? 'bg-green-500' :
                      vehicle.status === 'parked' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    } flex items-center justify-center text-white shadow-lg`}>
                      <TruckIcon className="w-5 h-5" />
                    </div>
                    {vehicle.status === 'en_route' && (
                      <div className="absolute inset-0 w-8 h-8 rounded-full bg-green-500 opacity-50 animate-ping" />
                    )}
                    
                    {/* Info véhicule */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl whitespace-nowrap">
                        <div className="font-semibold">{vehicle.id}</div>
                        <div className="text-xs opacity-90">{vehicle.driver}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {vehicle.status === 'en_route' ? `${vehicle.speed} km/h` : 'Arrêt'}
                        </div>
                        <div className="text-xs mt-1">🔋 {vehicle.battery}%</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Légende */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-lg rounded-lg p-3 shadow-lg">
                <div className="text-xs font-semibold text-gray-700 mb-2">Légende</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-xs text-gray-600">En cours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-xs text-gray-600">Planifié</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-xs text-gray-600">Terminé</span>
                  </div>
                </div>
              </div>

              {/* Contrôles zoom */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg">
                <button className="p-2 hover:bg-gray-100 rounded-t-lg">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
                <div className="border-t border-gray-200" />
                <button className="p-2 hover:bg-gray-100">
                  <ArrowsPointingOutIcon className="w-5 h-5" />
                </button>
                <div className="border-t border-gray-200" />
                <button className="p-2 hover:bg-gray-100 rounded-b-lg">
                  <ArrowsPointingInIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Informations */}
        <div className="space-y-6">
          {/* Liste des interventions */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 max-h-80 overflow-y-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interventions du jour</h3>
            <div className="space-y-3">
              {interventionPoints.map((point) => (
                <div key={point.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{point.icon}</div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{point.title}</div>
                      <div className="text-xs text-gray-600">{point.client}</div>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(point.status)}`} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Graphique densité */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Densité par Zone</h3>
            <div className="h-48">
              <Bar
                data={densityChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
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

          {/* Centre de navigation */}
          <motion.div 
            className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <RocketLaunchIcon className="w-5 h-5 mr-2" />
              Navigation IA
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Optimisation trajets</span>
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-300" />
                </div>
                <div className="text-xs mt-1 opacity-90">15% de distance économisée</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Prochaine urgence</span>
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-xs mt-1 opacity-90">Parc Municipal - 10 min</div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              <MapIcon className="w-5 h-5 inline mr-2" />
              Optimiser tous les trajets
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarteGeographiqueUltraPremium;