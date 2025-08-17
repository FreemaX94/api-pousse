import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  TagIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import UltraPremiumContainer from './UltraPremiumContainer';

const PlanningDemandesClientUltraPremium = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées de demandes clients
  const requests = [
    {
      id: 'REQ001',
      title: 'Élagage urgent suite tempête',
      client: 'Mairie de Lyon',
      priority: 'urgent',
      status: 'confirmed',
      startDate: new Date('2024-08-15'),
      endDate: new Date('2024-08-15'),
      startTime: '08:00',
      endTime: '12:00',
      team: ['Marc L.', 'Paul M.'],
      equipment: ['Camion nacelle', 'Tronçonneuse'],
      location: 'Parc de la Tête d\'Or',
      description: 'Intervention d\'urgence pour sécuriser les arbres endommagés',
      estimatedHours: 4,
      color: 'bg-red-500',
      category: 'elagage'
    },
    {
      id: 'REQ002',
      title: 'Entretien espaces verts',
      client: 'Résidence Harmonie',
      priority: 'normal',
      status: 'scheduled',
      startDate: new Date('2024-08-16'),
      endDate: new Date('2024-08-16'),
      startTime: '09:00',
      endTime: '12:00',
      team: ['Jean D.', 'Pierre M.'],
      equipment: ['Tondeuse', 'Taille-haie'],
      location: '23 Rue de la Paix',
      description: 'Entretien mensuel régulier des espaces communs',
      estimatedHours: 3,
      color: 'bg-blue-500',
      category: 'entretien'
    },
    {
      id: 'REQ003',
      title: 'Installation arrosage automatique',
      client: 'Villa Beausoleil',
      priority: 'high',
      status: 'in_progress',
      startDate: new Date('2024-08-14'),
      endDate: new Date('2024-08-16'),
      startTime: '14:00',
      endTime: '17:00',
      team: ['Paul M.', 'Luc B.'],
      equipment: ['Kit arrosage', 'Outillage'],
      location: '47 Avenue des Roses',
      description: 'Installation complète système arrosage avec programmateur',
      estimatedHours: 9,
      color: 'bg-green-500',
      category: 'installation'
    },
    {
      id: 'REQ004',
      title: 'Diagnostic phytosanitaire',
      client: 'Jardin Botanique',
      priority: 'normal',
      status: 'pending',
      startDate: new Date('2024-08-17'),
      endDate: new Date('2024-08-17'),
      startTime: '09:00',
      endTime: '11:00',
      team: ['Luc B.'],
      equipment: ['Kit diagnostic'],
      location: '8 Boulevard des Sciences',
      description: 'Analyse complète des maladies et parasites',
      estimatedHours: 2,
      color: 'bg-purple-500',
      category: 'diagnostic'
    },
    {
      id: 'REQ005',
      title: 'Création jardin zen',
      client: 'TechCorp Solutions',
      priority: 'high',
      status: 'confirmed',
      startDate: new Date('2024-08-19'),
      endDate: new Date('2024-08-21'),
      startTime: '08:00',
      endTime: '18:00',
      team: ['Marc L.', 'Paul M.', 'Jean D.'],
      equipment: ['Mini-pelle', 'Matériaux', 'Outillage'],
      location: '156 Avenue Innovation',
      description: 'Création complète jardin japonais avec bassins',
      estimatedHours: 24,
      color: 'bg-indigo-500',
      category: 'creation'
    }
  ];

  // Fonction pour obtenir les jours du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const getRequestsForDay = (date) => {
    return requests.filter(req => {
      const reqDate = new Date(req.startDate);
      return reqDate.toDateString() === date.toDateString();
    });
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'urgent': return <FireIcon className="w-4 h-4 text-red-500" />;
      case 'high': return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
      case 'normal': return <BoltIcon className="w-4 h-4 text-blue-500" />;
      case 'low': return <SparklesIcon className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDragStart = (e, request) => {
    setDraggedItem(request);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    if (draggedItem) {
      // Ici on mettrait à jour la date de la demande
      console.log(`Déplacer ${draggedItem.title} vers ${targetDate.toLocaleDateString()}`);
      setDraggedItem(null);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch = !searchTerm || 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: requests.length,
    confirmed: requests.filter(r => r.status === 'confirmed').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    pending: requests.filter(r => r.status === 'pending').length,
    urgent: requests.filter(r => r.priority === 'urgent').length,
    totalHours: requests.reduce((sum, r) => sum + r.estimatedHours, 0)
  };

  return (
    <UltraPremiumContainer
      title="Planning Demandes Client Quantum"
      icon={CalendarDaysIcon}
    >
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <motion.div 
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CalendarDaysIcon className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Confirmées</p>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">En cours</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm">En attente</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-gray-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Urgent</p>
                <p className="text-2xl font-bold">{stats.urgent}</p>
              </div>
              <FireIcon className="w-8 h-8 text-red-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total H</p>
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
              </div>
              <ClockIcon className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        {/* Contrôles du calendrier */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
                  {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aujourd'hui
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmées</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminées</option>
              </select>

              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <PlusIcon className="w-5 h-5" />
                <span>Nouvelle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendrier */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 bg-gray-50">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day, index) => (
              <div key={index} className="p-4 text-center font-semibold text-gray-700 border-b border-gray-200">
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayRequests = getRequestsForDay(day).filter(req => 
                filteredRequests.find(fr => fr.id === req.id)
              );
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <motion.div
                  key={index}
                  className={`min-h-[120px] p-2 border-b border-r border-gray-200 ${
                    !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                  } ${isToday ? 'bg-blue-50' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                  whileHover={{ backgroundColor: isCurrentMonth ? '#f8fafc' : '#f1f5f9' }}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    !isCurrentMonth ? 'text-gray-400' : 
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayRequests.slice(0, 3).map((request, reqIndex) => (
                      <motion.div
                        key={request.id}
                        className={`${request.color} text-white text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, request)}
                        onClick={() => setSelectedRequest(request)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: reqIndex * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(request.priority)}
                          <span className="truncate font-medium">{request.title}</span>
                        </div>
                        <div className="text-xs opacity-90 mt-1">
                          {request.startTime} - {request.client}
                        </div>
                      </motion.div>
                    ))}
                    
                    {dayRequests.length > 3 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{dayRequests.length - 3} autres
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Liste des demandes du jour sélectionné */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demandes d'aujourd'hui</h3>
            <div className="space-y-3">
              {getRequestsForDay(new Date()).map((request, index) => (
                <motion.div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getPriorityIcon(request.priority)}
                        <h4 className="font-semibold text-gray-900">{request.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{request.client}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{request.startTime} - {request.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="w-4 h-4" />
                          <span>{request.team.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <EyeIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <PencilIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ressources disponibles</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Équipes</h4>
                <div className="space-y-2">
                  {['Marc L.', 'Paul M.', 'Jean D.', 'Luc B.', 'Pierre M.'].map((member, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{member}</span>
                      </div>
                      <span className="text-xs text-gray-500">Disponible</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Équipements</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Camion nacelle #1', status: 'available' },
                    { name: 'Tracteur tondeuse #2', status: 'maintenance' },
                    { name: 'Broyeur #1', status: 'reserved' },
                    { name: 'Kit arrosage #3', status: 'available' }
                  ].map((equipment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          equipment.status === 'available' ? 'bg-green-500' :
                          equipment.status === 'maintenance' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-sm text-gray-700">{equipment.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        equipment.status === 'available' ? 'bg-green-100 text-green-800' :
                        equipment.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {equipment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal détails demande */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      {getPriorityIcon(selectedRequest.priority)}
                      <h2 className="text-2xl font-bold text-gray-900">{selectedRequest.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                    <p className="text-lg text-gray-600">{selectedRequest.client}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-600 hover:text-gray-900 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Informations temporelles</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">
                            {selectedRequest.startDate.toLocaleDateString('fr-FR')} - {selectedRequest.endDate.toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">
                            {selectedRequest.startTime} - {selectedRequest.endTime} ({selectedRequest.estimatedHours}h)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Localisation</h3>
                      <div className="flex items-start space-x-2">
                        <MapPinIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                        <span className="text-gray-700">{selectedRequest.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700">{selectedRequest.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Équipe assignée</h3>
                      <div className="space-y-2">
                        {selectedRequest.team.map((member, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <UserGroupIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{member}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Équipements nécessaires</h3>
                      <div className="space-y-2">
                        {selectedRequest.equipment.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <TruckIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4" />
                      <span>Contacter</span>
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span>Email</span>
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                      <DocumentTextIcon className="w-4 h-4" />
                      <span>Rapport</span>
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                      <PencilIcon className="w-4 h-4" />
                      <span>Modifier</span>
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                      <TrashIcon className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default PlanningDemandesClientUltraPremium;