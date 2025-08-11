import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  CurrencyEuroIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  ArrowsPointingOutIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const DemandesClientKanbanPremium = () => {
  const [columns, setColumns] = useState({
    nouvelles: {
      id: 'nouvelles',
      title: 'Nouvelles Demandes',
      color: 'from-purple-500 to-pink-500',
      icon: <SparklesIcon className="w-5 h-5" />,
      items: [
        {
          id: '1',
          title: 'Élagage urgent - Tempête',
          client: 'Jean Dupont',
          priority: 'haute',
          amount: 450,
          date: '07/08 - 14h',
          tags: ['urgent', 'sécurité'],
          assignee: 'Marc L.',
          progress: 0,
          comments: 3,
          attachments: 2
        },
        {
          id: '2',
          title: 'Installation arrosage automatique',
          client: 'Sophie Martin',
          priority: 'normale',
          amount: 1200,
          date: '09/08 - 9h',
          tags: ['installation', 'devis'],
          assignee: null,
          progress: 0,
          comments: 1,
          attachments: 4
        }
      ]
    },
    en_evaluation: {
      id: 'en_evaluation',
      title: 'En Évaluation',
      color: 'from-yellow-500 to-orange-500',
      icon: <ClockIcon className="w-5 h-5" />,
      items: [
        {
          id: '3',
          title: 'Création jardin japonais',
          client: 'Pierre Leroy',
          priority: 'normale',
          amount: 3500,
          date: '10/08 - 10h',
          tags: ['design', 'création'],
          assignee: 'Paul M.',
          progress: 25,
          comments: 8,
          attachments: 12
        }
      ]
    },
    planifiees: {
      id: 'planifiees',
      title: 'Planifiées',
      color: 'from-blue-500 to-indigo-500',
      icon: <CalendarIcon className="w-5 h-5" />,
      items: [
        {
          id: '4',
          title: 'Entretien mensuel jardin',
          client: 'Marie Rousseau',
          priority: 'basse',
          amount: 180,
          date: '12/08 - 8h30',
          tags: ['récurrent', 'contrat'],
          assignee: 'Luc B.',
          progress: 0,
          comments: 0,
          attachments: 1
        },
        {
          id: '5',
          title: 'Taille haies périphériques',
          client: 'Entreprise ABC',
          priority: 'normale',
          amount: 650,
          date: '15/08 - 14h',
          tags: ['entreprise', 'taille'],
          assignee: 'Marc L.',
          progress: 0,
          comments: 2,
          attachments: 3
        }
      ]
    },
    en_cours: {
      id: 'en_cours',
      title: 'En Cours',
      color: 'from-indigo-500 to-purple-500',
      icon: <BoltIcon className="w-5 h-5" />,
      items: [
        {
          id: '6',
          title: 'Plantation arbres fruitiers',
          client: 'Anne Dubois',
          priority: 'normale',
          amount: 890,
          date: 'Aujourd\'hui',
          tags: ['plantation', 'arbres'],
          assignee: 'Paul M.',
          progress: 65,
          comments: 4,
          attachments: 6
        }
      ]
    },
    terminees: {
      id: 'terminees',
      title: 'Terminées',
      color: 'from-green-500 to-emerald-500',
      icon: <CheckCircleIcon className="w-5 h-5" />,
      items: [
        {
          id: '7',
          title: 'Diagnostic phytosanitaire',
          client: 'Claude Bernard',
          priority: 'haute',
          amount: 250,
          date: 'Hier - 16h',
          tags: ['diagnostic', 'maladie'],
          assignee: 'Expert',
          progress: 100,
          comments: 6,
          attachments: 8,
          satisfaction: 5
        }
      ]
    }
  });

  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'haute': return 'bg-red-500';
      case 'normale': return 'bg-yellow-500';
      case 'basse': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDragStart = (e, item, sourceColumn) => {
    setDraggedItem({ item, sourceColumn });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (draggedItem && draggedItem.sourceColumn !== targetColumn) {
      const sourceItems = [...columns[draggedItem.sourceColumn].items];
      const targetItems = [...columns[targetColumn].items];
      
      const itemIndex = sourceItems.findIndex(item => item.id === draggedItem.item.id);
      sourceItems.splice(itemIndex, 1);
      targetItems.push(draggedItem.item);
      
      setColumns({
        ...columns,
        [draggedItem.sourceColumn]: {
          ...columns[draggedItem.sourceColumn],
          items: sourceItems
        },
        [targetColumn]: {
          ...columns[targetColumn],
          items: targetItems
        }
      });
    }
    setDraggedItem(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tableau Kanban Interactif
              </h1>
              <p className="text-gray-600 mt-1">Glissez-déposez pour organiser vos demandes</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg">
                <FireIcon className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium">3 Urgentes</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <UserGroupIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">4 Techniciens</span>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                <PlusIcon className="w-5 h-5 inline mr-2" />
                Nouvelle Carte
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Object.entries(columns).map(([columnId, column], columnIndex) => (
          <motion.div
            key={columnId}
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: columnIndex * 0.1 }}
          >
            {/* Column Header */}
            <div className={`bg-gradient-to-r ${column.color} text-white rounded-t-xl p-4 shadow-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {column.icon}
                  <h3 className="font-bold">{column.title}</h3>
                </div>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                  {column.items.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div
              className="bg-white/80 backdrop-blur rounded-b-xl p-4 min-h-[500px] shadow-xl border border-gray-100"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <AnimatePresence>
                {column.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, columnId)}
                    className="bg-white rounded-xl p-4 mb-3 shadow-lg border border-gray-100 cursor-move hover:shadow-2xl transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileDrag={{ scale: 1.05, rotate: 2 }}
                  >
                    {/* Priority Indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-2 h-8 ${getPriorityColor(item.priority)} rounded-full`}></div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <EyeIcon className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <PencilIcon className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {item.client.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-600">{item.client}</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">{item.amount}€</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    {item.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progression</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {item.comments > 0 && (
                          <div className="flex items-center space-x-1">
                            <ChatBubbleLeftRightIcon className="w-3 h-3" />
                            <span>{item.comments}</span>
                          </div>
                        )}
                        {item.attachments > 0 && (
                          <div className="flex items-center space-x-1">
                            <DocumentTextIcon className="w-3 h-3" />
                            <span>{item.attachments}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Satisfaction Stars */}
                    {item.satisfaction && (
                      <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${i < item.satisfaction ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Card Button */}
              <motion.button
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-purple-400 hover:text-purple-600 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PlusIcon className="w-5 h-5 mx-auto" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Footer */}
      <motion.div 
        className="mt-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-xs text-gray-600">Total Cartes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">6,820€</div>
            <div className="text-xs text-gray-600">Valeur Totale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">3.2h</div>
            <div className="text-xs text-gray-600">Temps Moyen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">85%</div>
            <div className="text-xs text-gray-600">Taux Réussite</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-xs text-gray-600">Urgentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">4.8/5</div>
            <div className="text-xs text-gray-600">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">24</div>
            <div className="text-xs text-gray-600">Cette Semaine</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DemandesClientKanbanPremium;