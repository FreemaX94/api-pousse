import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ViewColumnsIcon,
  PlusIcon,
  ClockIcon,
  UserGroupIcon,
  FireIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';
import UltraPremiumContainer from './UltraPremiumContainer';

const DemandesClientKanbanUltraPremium = () => {
  const [columns, setColumns] = useState({
    'todo': {
      title: 'À Faire',
      color: 'from-gray-500 to-gray-600',
      limit: 5,
      requests: [
        { id: 'REQ001', title: 'Diagnostic phytosanitaire', client: 'Jardin Botanique', priority: 'normal', estimate: '2h', value: '350€' },
        { id: 'REQ002', title: 'Nouvelle plantation', client: 'Villa Moderne', priority: 'low', estimate: '4h', value: '800€' }
      ]
    },
    'in_progress': {
      title: 'En Cours',
      color: 'from-blue-500 to-blue-600',
      limit: 3,
      requests: [
        { id: 'REQ003', title: 'Installation arrosage', client: 'Villa Beausoleil', priority: 'high', estimate: '6h', value: '1200€' },
        { id: 'REQ004', title: 'Élagage urgent', client: 'Mairie Lyon', priority: 'urgent', estimate: '4h', value: '2500€' }
      ]
    },
    'review': {
      title: 'Validation',
      color: 'from-orange-500 to-orange-600',
      limit: 2,
      requests: [
        { id: 'REQ005', title: 'Création jardin zen', client: 'TechCorp', priority: 'high', estimate: '24h', value: '8500€' }
      ]
    },
    'done': {
      title: 'Terminé',
      color: 'from-green-500 to-green-600',
      limit: null,
      requests: [
        { id: 'REQ006', title: 'Entretien mensuel', client: 'Résidence Harmonie', priority: 'normal', estimate: '3h', value: '450€' },
        { id: 'REQ007', title: 'Taille haies', client: 'Parc Municipal', priority: 'low', estimate: '2h', value: '200€' }
      ]
    }
  });

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'urgent': return <FireIcon className="w-4 h-4 text-red-500" />;
      case 'high': return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
      case 'normal': return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'low': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const stats = {
    total: Object.values(columns).reduce((sum, col) => sum + col.requests.length, 0),
    inProgress: columns.in_progress.requests.length,
    completed: columns.done.requests.length,
    totalValue: Object.values(columns).reduce((sum, col) => 
      sum + col.requests.reduce((colSum, req) => colSum + parseInt(req.value.replace('€', '')), 0), 0
    )
  };

  return (
    <UltraPremiumContainer
      title="Kanban Demandes Client Quantum"
      icon={ViewColumnsIcon}
    >
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Demandes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ViewColumnsIcon className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">En Cours</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-200" />
            </div>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Terminées</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Valeur Total</p>
                <p className="text-2xl font-bold">{(stats.totalValue/1000).toFixed(0)}K€</p>
              </div>
              <CurrencyEuroIcon className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <motion.div
              key={columnId}
              className="bg-white rounded-xl shadow-lg p-4 min-h-[600px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 border-gradient-to-r ${column.color}`}>
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {column.requests.length}
                    {column.limit && `/${column.limit}`}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <PlusIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {column.requests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    drag
                    dragSnapToOrigin
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{request.title}</h4>
                      {getPriorityIcon(request.priority)}
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{request.client}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{request.estimate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CurrencyEuroIcon className="w-3 h-3" />
                        <span className="font-semibold text-green-600">{request.value}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200 flex space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">M</div>
                      <div className="w-6 h-6 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">P</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Zone de drop */}
              <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <PlusIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Déposer ici ou ajouter</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <PlusIcon className="w-5 h-5" />
              <span>Nouvelle Demande</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Archiver Terminées
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Rapport Hebdo
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Configurer Limites
            </button>
          </div>
        </div>
      </div>
    </UltraPremiumContainer>
  );
};

export default DemandesClientKanbanUltraPremium;