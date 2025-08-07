import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  BookmarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useResourceFilters, type ResourceFilters } from '../hooks/useResourceFilters';

interface ResourceFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: ResourceFilters) => void;
}

interface SaveFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const SaveFilterModal: React.FC<SaveFilterModalProps> = ({ isOpen, onClose, onSave }) => {
  const [filterName, setFilterName] = useState('');

  const handleSave = () => {
    if (filterName.trim()) {
      onSave(filterName.trim());
      setFilterName('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Enregistrer le filtre</h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du filtre
                    </label>
                    <input
                      type="text"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="Ex: Interventions en cours"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!filterName.trim()}
                    className="px-4 py-2 bg-[#2170E3] text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ResourceFilterModal: React.FC<ResourceFilterModalProps> = ({ isOpen, onClose, onFiltersChange }) => {
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    saveFilter, 
    hasActiveFilters 
  } = useResourceFilters();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tempFilters, setTempFilters] = useState<ResourceFilters>(filters);

  // Synchroniser les filtres temporaires quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);

  // Options pour les selects
  const collaborateurOptions = [
    { value: 'tous', label: 'Tous' },
    { value: 'non-defini', label: 'Non défini' },
    { value: 'aymeric', label: 'Aymeric Tireau (Permis B)' },
    { value: 'david', label: 'David Celeste (Permis B)' },
    { value: 'elodie', label: 'Elodie Treveten (Permis B)' },
    { value: 'estelle', label: 'Estelle Delapierre (Permis B)' },
    { value: 'florence', label: 'Florence ROGER' },
    { value: 'lucie', label: 'Lucie Garcia (Permis B)' },
    { value: 'marine', label: 'Marine Sandoz (Permis B)' },
    { value: 'simon', label: 'Simon Henry (Terrain)' }
  ];

  const categorieOptions = [
    { value: 'toutes', label: 'Toutes' },
    { value: 'non-defini', label: 'Non défini' },
    { value: 'abonnement', label: 'Abonnement' },
    { value: 'creation', label: 'Création' },
    { value: 'entretien', label: 'Entretien' },
    { value: 'location', label: 'Location' },
    { value: 'packplant', label: 'PackPlant' },
    { value: 'plant-sitting', label: 'Plant sitting' },
    { value: 'rdv-reperage', label: 'RDV de repérage' }
  ];

  const actifOptions = [
    { value: 'tous', label: 'Tous' },
    { value: 'actif', label: 'Actif' },
    { value: 'supprime', label: 'Supprimé' }
  ];

  const updateTempFilter = (key: keyof ResourceFilters, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    // Appliquer les filtres temporaires
    Object.keys(tempFilters).forEach(key => {
      updateFilter(key as keyof ResourceFilters, tempFilters[key as keyof ResourceFilters]);
    });
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
      numero: '',
      titre: '',
      client: '',
      collaborateur: 'tous',
      categorie: 'toutes',
      actif: 'tous'
    };
    setTempFilters(defaultFilters);
    resetFilters();
    onFiltersChange(defaultFilters);
  };

  const handleSaveFilter = (name: string) => {
    saveFilter(name);
    console.log('Filtre sauvegardé:', name, tempFilters);
  };

  const handleClose = () => {
    setTempFilters(filters); // Annuler les modifications temporaires
    onClose();
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
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FunnelIcon className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="space-y-6">
                  {/* Champs de recherche */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Recherche</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* N° */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">N°</label>
                        <input
                          type="text"
                          placeholder="N°"
                          value={tempFilters.numero}
                          onChange={(e) => updateTempFilter('numero', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                          recherche avancée
                        </button>
                      </div>

                      {/* Titre */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                          type="text"
                          placeholder="Titre"
                          value={tempFilters.titre}
                          onChange={(e) => updateTempFilter('titre', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Client */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                        <input
                          type="text"
                          placeholder="Client"
                          value={tempFilters.client}
                          onChange={(e) => updateTempFilter('client', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sélecteurs */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Filtres</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Collaborateur */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
                        <div className="relative">
                          <select
                            value={tempFilters.collaborateur}
                            onChange={(e) => updateTempFilter('collaborateur', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                          >
                            {collaborateurOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Catégorie */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <div className="relative">
                          <select
                            value={tempFilters.categorie}
                            onChange={(e) => updateTempFilter('categorie', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                          >
                            {categorieOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Actif ? */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Actif ?</label>
                        <div className="relative">
                          <select
                            value={tempFilters.actif}
                            onChange={(e) => updateTempFilter('actif', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                          >
                            {actifOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {hasActiveFilters() && (
                    <button
                      onClick={handleReset}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Annuler ces filtres
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSaveModal(true)}
                    className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    <BookmarkIcon className="w-4 h-4" />
                    <span>Enregistrer ce filtre</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    className="flex items-center space-x-2 bg-[#2170E3] text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
                  >
                    <MagnifyingGlassIcon className="w-4 h-4" />
                    <span>Chercher</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <SaveFilterModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveFilter}
      />
    </AnimatePresence>
  );
};

export default ResourceFilterModal;