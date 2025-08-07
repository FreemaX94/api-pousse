import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import InterventionTag from './InterventionTag';
import { usePlanningFilters } from '../context/PlanningFiltersContext';

interface Intervention {
  id: string;
  title: string;
  client?: string;
  address?: string;
  type: string;
  collaborator?: string;
  hasComment?: boolean;
}

interface InterventionsSansDateProps {
  isOpen: boolean;
  onClose: () => void;
}

const InterventionsSansDate: React.FC<InterventionsSansDateProps> = ({
  isOpen,
  onClose
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    collaborators: [] as string[],
    activityTypes: [] as string[],
    colorCodes: [] as string[]
  });

  const { collaborators, activityTypes, colorCodes } = usePlanningFilters();

  // Données d'exemple pour les interventions sans date
  const interventionsSansDate: Intervention[] = [
    {
      id: 'unscheduled-1',
      title: 'Morning Auber',
      client: 'AUBER GROUPE',
      address: '6 Rue Auber, 75009, Paris',
      type: 'entretien',
      collaborator: 'aymeric',
      hasComment: true
    },
    {
      id: 'unscheduled-2',
      title: 'Installation urgente',
      client: 'MICROSOFT FRANCE',
      address: '37 Quai de Grenelle, 75015 Paris',
      type: 'installation',
      collaborator: 'marine'
    },
    {
      id: 'unscheduled-3',
      title: 'Diagnostic plantes',
      client: 'ORANGE',
      address: '78 Rue Olivier de Serres, 75015 Paris',
      type: 'diagnostic',
      collaborator: 'david',
      hasComment: true
    },
    {
      id: 'unscheduled-4',
      title: 'Maintenance système arrosage',
      client: 'BNP PARIBAS',
      address: '16 Boulevard des Italiens, 75009 Paris',
      type: 'maintenance',
      collaborator: 'simon'
    },
    {
      id: 'unscheduled-5',
      title: 'Formation nouvelle équipe',
      client: 'TOTAL ENERGIES',
      address: '2 Place Jean Millier, 92400 Courbevoie',
      type: 'formation',
      collaborator: 'elodie'
    }
  ];

  // Palette de couleurs pour les types d'interventions
  const eventColors = {
    maintenance: '#10B981',
    installation: '#3B82F6',
    diagnostic: '#F59E0B',
    reparation: '#EF4444',
    entretien: '#8B5CF6',
    livraison: '#06B6D4',
    formation: '#84CC16',
    autre: '#6B7280'
  };

  const getFilteredInterventions = () => {
    return interventionsSansDate.filter(intervention => {
      // Filtrer par collaborateur
      if (localFilters.collaborators.length > 0 && 
          intervention.collaborator && 
          !localFilters.collaborators.includes(intervention.collaborator)) {
        return false;
      }

      // Filtrer par type d'activité
      if (localFilters.activityTypes.length > 0 && 
          !localFilters.activityTypes.includes(intervention.type)) {
        return false;
      }

      // Filtrer par code couleur (même logique que type d'activité)
      if (localFilters.colorCodes.length > 0 && 
          !localFilters.colorCodes.includes(intervention.type)) {
        return false;
      }

      return true;
    });
  };

  const handleCollaboratorFilter = (collaboratorId: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      collaborators: checked 
        ? [...prev.collaborators, collaboratorId]
        : prev.collaborators.filter(id => id !== collaboratorId)
    }));
  };

  const handleActivityTypeFilter = (typeId: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      activityTypes: checked 
        ? [...prev.activityTypes, typeId]
        : prev.activityTypes.filter(id => id !== typeId)
    }));
  };

  const handleColorCodeFilter = (colorId: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      colorCodes: checked 
        ? [...prev.colorCodes, colorId]
        : prev.colorCodes.filter(id => id !== colorId)
    }));
  };

  const handleAssignDate = (interventionId: string) => {
    console.log('Assign date to intervention:', interventionId);
    // TODO: Implémenter l'ouverture du date-picker
  };

  const handleEdit = (interventionId: string) => {
    console.log('Edit intervention:', interventionId);
    // TODO: Implémenter l'ouverture du formulaire d'édition
  };

  const handleDelete = (interventionId: string) => {
    console.log('Delete intervention:', interventionId);
    // TODO: Implémenter la suppression
  };

  const clearAllFilters = () => {
    setLocalFilters({
      collaborators: [],
      activityTypes: [],
      colorCodes: []
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="px-6 py-4">
          {/* Header avec titre et filtres */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">À planifier</h3>
              <span className="text-sm text-gray-500">
                {getFilteredInterventions().length} intervention(s)
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Dropdown Filtres */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  <FunnelIcon className="w-4 h-4" />
                  <span>Filtres</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showFilters && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowFilters(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Filtres</h4>
                            <button
                              onClick={clearAllFilters}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Effacer tout
                            </button>
                          </div>

                          {/* Collaborateurs */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Collaborateurs</h5>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {collaborators.map(collaborator => (
                                <label key={collaborator.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={localFilters.collaborators.includes(collaborator.id)}
                                    onChange={(e) => handleCollaboratorFilter(collaborator.id, e.target.checked)}
                                    className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: collaborator.color }}
                                    />
                                    <span className="text-xs text-gray-600">{collaborator.name}</span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Types d'activité */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Types d'activité</h5>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {activityTypes.map(type => (
                                <label key={type.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={localFilters.activityTypes.includes(type.id)}
                                    onChange={(e) => handleActivityTypeFilter(type.id, e.target.checked)}
                                    className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: type.color }}
                                    />
                                    <span className="text-xs text-gray-600">{type.name}</span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Codes couleur */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Codes couleur</h5>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {colorCodes.map(code => (
                                <label key={code.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={localFilters.colorCodes.includes(code.id)}
                                    onChange={(e) => handleColorCodeFilter(code.id, e.target.checked)}
                                    className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: code.color }}
                                    />
                                    <span className="text-xs text-gray-600">{code.name}</span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Bouton fermer */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Liste des interventions */}
          <div className="flex flex-wrap gap-2">
            {getFilteredInterventions().map(intervention => (
              <InterventionTag
                key={intervention.id}
                intervention={intervention}
                color={eventColors[intervention.type as keyof typeof eventColors]}
                onAssignDate={handleAssignDate}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            
            {getFilteredInterventions().length === 0 && (
              <div className="w-full text-center py-8 text-gray-500">
                <p>Aucune intervention sans date trouvée avec les filtres actuels.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterventionsSansDate;