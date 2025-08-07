import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { usePlanningFilters } from '../context/PlanningFiltersContext';

interface LegendeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegendeModal: React.FC<LegendeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('collaborators');
  const [activeColorCodeTab, setActiveColorCodeTab] = useState('collaborators');
  const {
    filters,
    updateCollaborators,
    updateActivityTypes,
    updateDisplayElements,
    updateColorCodes,
    collaborators,
    activityTypes,
    displayElements,
    colorCodes,
    actionsCourantes,
    termineStatuses,
    categoriesInterventions
  } = usePlanningFilters();

  const tabs = [
    { id: 'collaborators', label: 'Collaborateurs' },
    { id: 'activityTypes', label: 'Types d\'activité' },
    { id: 'displayElements', label: 'Éléments à afficher' },
    { id: 'colorCodes', label: 'Code couleur' }
  ];

  const colorCodeTabs = [
    { id: 'collaborators', label: 'Collaborateurs' },
    { id: 'actionsCourantes', label: 'Actions courantes' },
    { id: 'termine', label: 'Terminé ?' },
    { id: 'categoriesInterventions', label: 'Catégories d\'interventions' },
    { id: 'etatFacturation', label: 'État de la facturation' },
    { id: 'typesActivite', label: 'Types d\'activité' }
  ];

  const bureauCollaborators = collaborators.filter(c => c.group === 'bureau');
  const terrainCollaborators = collaborators.filter(c => c.group === 'terrain');

  const handleCollaboratorChange = (collaboratorId: string, checked: boolean) => {
    const newSelected = checked
      ? [...filters.collaborators.selected, collaboratorId]
      : filters.collaborators.selected.filter(id => id !== collaboratorId);
    
    updateCollaborators(newSelected, filters.collaborators.none);
  };

  const handleNoneCollaboratorChange = (checked: boolean) => {
    updateCollaborators([], checked);
  };

  const handleSelectAllCollaborators = () => {
    updateCollaborators(collaborators.map(c => c.id), false);
  };

  const handleDeselectAllCollaborators = () => {
    updateCollaborators([], false);
  };

  const handleActivityTypeChange = (activityTypeId: string, checked: boolean) => {
    const newSelected = checked
      ? [...filters.activityTypes, activityTypeId]
      : filters.activityTypes.filter(id => id !== activityTypeId);
    
    updateActivityTypes(newSelected);
  };

  const handleSelectAllActivityTypes = () => {
    updateActivityTypes(activityTypes.map(a => a.id));
  };

  const handleDeselectAllActivityTypes = () => {
    updateActivityTypes([]);
  };

  const handleDisplayElementChange = (elementId: string, checked: boolean) => {
    const newSelected = checked
      ? [...filters.displayElements, elementId]
      : filters.displayElements.filter(id => id !== elementId);
    
    updateDisplayElements(newSelected);
  };

  const handleSelectAllDisplayElements = () => {
    updateDisplayElements(displayElements.map(e => e.id));
  };

  const handleDeselectAllDisplayElements = () => {
    updateDisplayElements([]);
  };


  const renderCollaboratorsTab = () => (
    <div className="space-y-6">
      {/* Aucun collaborateur */}
      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={filters.collaborators.none}
            onChange={(e) => handleNoneCollaboratorChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Aucun collaborateur</span>
        </label>
      </div>

      {/* Bureau */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Bureau</h4>
        <div className="space-y-2">
          {bureauCollaborators.map(collaborator => (
            <label key={collaborator.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={filters.collaborators.selected.includes(collaborator.id) && !filters.collaborators.none}
                onChange={(e) => handleCollaboratorChange(collaborator.id, e.target.checked)}
                disabled={filters.collaborators.none}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: collaborator.color }}
                />
                <span className="text-sm text-gray-700">{collaborator.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Terrain */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Terrain</h4>
        <div className="space-y-2">
          {terrainCollaborators.map(collaborator => (
            <label key={collaborator.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={filters.collaborators.selected.includes(collaborator.id) && !filters.collaborators.none}
                onChange={(e) => handleCollaboratorChange(collaborator.id, e.target.checked)}
                disabled={filters.collaborators.none}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: collaborator.color }}
                />
                <span className="text-sm text-gray-700">{collaborator.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleSelectAllCollaborators}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout sélectionner
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={handleDeselectAllCollaborators}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout désélectionner
        </button>
      </div>
    </div>
  );

  const renderActivityTypesTab = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun type d'activité trouvé</p>
      </div>
    </div>
  );

  const renderDisplayElementsTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        {displayElements.map(element => (
          <label key={element.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={filters.displayElements.includes(element.id)}
              onChange={(e) => handleDisplayElementChange(element.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{element.name}</span>
          </label>
        ))}
      </div>

      <div className="flex space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleSelectAllDisplayElements}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout sélectionner
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={handleDeselectAllDisplayElements}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout désélectionner
        </button>
      </div>
    </div>
  );

  const renderColorCodesTab = () => (
    <div className="space-y-4">
      {/* Sous-onglets pour Code couleur */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6 overflow-x-auto" aria-label="Color Code Tabs">
          {colorCodeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveColorCodeTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors ${
                activeColorCodeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des sous-onglets */}
      <div className="space-y-4">
        {renderColorCodeSubTab()}
      </div>
    </div>
  );

  const renderColorCodeSubTab = () => {
    switch (activeColorCodeTab) {
      case 'collaborators':
        return renderColorCodeCollaborators();
      case 'actionsCourantes':
        return renderActionsCourantes();
      case 'termine':
        return renderTermineStatuses();
      case 'categoriesInterventions':
        return renderCategoriesInterventions();
      case 'etatFacturation':
        return renderEmptyState('Aucun état de facturation trouvé');
      case 'typesActivite':
        return renderEmptyState('Aucun type d\'activité trouvé');
      default:
        return null;
    }
  };

  const renderColorCodeCollaborators = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        {collaborators.map(collaborator => (
          <label key={collaborator.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={filters.colorCodes.collaborators.includes(collaborator.id)}
              onChange={(e) => {
                const newSelected = e.target.checked
                  ? [...filters.colorCodes.collaborators, collaborator.id]
                  : filters.colorCodes.collaborators.filter(id => id !== collaborator.id);
                updateColorCodes('collaborators', newSelected);
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: collaborator.color }}
              />
              <span className="text-sm text-gray-700">{collaborator.name}</span>
            </div>
          </label>
        ))}
      </div>
      <div className="flex space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => updateColorCodes('collaborators', collaborators.map(c => c.id))}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout sélectionner
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => updateColorCodes('collaborators', [])}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout désélectionner
        </button>
      </div>
    </div>
  );

  const renderActionsCourantes = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {actionsCourantes.map(action => (
          <label key={action.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.colorCodes.actionsCourantes.includes(action.id)}
              onChange={(e) => {
                const newSelected = e.target.checked
                  ? [...filters.colorCodes.actionsCourantes, action.id]
                  : filters.colorCodes.actionsCourantes.filter(id => id !== action.id);
                updateColorCodes('actionsCourantes', newSelected);
              }}
              className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: action.color }}
              />
              <span className="text-xs text-gray-700">{action.name}</span>
            </div>
          </label>
        ))}
      </div>
      <div className="flex space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => updateColorCodes('actionsCourantes', actionsCourantes.map(a => a.id))}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout sélectionner
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => updateColorCodes('actionsCourantes', [])}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout désélectionner
        </button>
      </div>
    </div>
  );

  const renderTermineStatuses = () => (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {termineStatuses.map(status => (
          <label key={status.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.colorCodes.termine.includes(status.id)}
              onChange={(e) => {
                const newSelected = e.target.checked
                  ? [...filters.colorCodes.termine, status.id]
                  : filters.colorCodes.termine.filter(id => id !== status.id);
                updateColorCodes('termine', newSelected);
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div
              className="px-3 py-1 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: status.color }}
            >
              {status.name}
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const renderCategoriesInterventions = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {categoriesInterventions.map(categorie => (
          <label key={categorie.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.colorCodes.categoriesInterventions.includes(categorie.id)}
              onChange={(e) => {
                const newSelected = e.target.checked
                  ? [...filters.colorCodes.categoriesInterventions, categorie.id]
                  : filters.colorCodes.categoriesInterventions.filter(id => id !== categorie.id);
                updateColorCodes('categoriesInterventions', newSelected);
              }}
              className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div
              className="px-2 py-1 rounded text-white text-xs font-medium"
              style={{ backgroundColor: categorie.color }}
            >
              {categorie.name}
            </div>
          </label>
        ))}
      </div>
      <div className="flex space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => updateColorCodes('categoriesInterventions', categoriesInterventions.map(c => c.id))}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout sélectionner
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => updateColorCodes('categoriesInterventions', [])}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tout désélectionner
        </button>
      </div>
    </div>
  );

  const renderEmptyState = (message: string) => (
    <div className="text-center py-8">
      <p className="text-gray-500">{message}</p>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'collaborators':
        return renderCollaboratorsTab();
      case 'activityTypes':
        return renderActivityTypesTab();
      case 'displayElements':
        return renderDisplayElementsTab();
      case 'colorCodes':
        return renderColorCodesTab();
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[9998]"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Légende et couleurs
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Bandeau mémo */}
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Mémo :</strong> Chaque modification sera enregistrée. Pensez à vérifier dans ce menu si vous avez décoché des utilisateurs précédemment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Onglets */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Contenu des onglets */}
              <div className="px-6 py-6 max-h-96 overflow-y-auto">
                {renderTabContent()}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegendeModal;