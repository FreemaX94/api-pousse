import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  XMarkIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { useResourceFilters, type ResourceFilters } from '../hooks/useResourceFilters';

interface ResourceFilterPanelProps {
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
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
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

const ResourceFilterPanel: React.FC<ResourceFilterPanelProps> = ({ onFiltersChange }) => {
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    saveFilter, 
    hasActiveFilters 
  } = useResourceFilters();
  
  const [showSaveModal, setShowSaveModal] = useState(false);

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

  const handleSearch = () => {
    onFiltersChange(filters);
  };

  const handleReset = () => {
    resetFilters();
    onFiltersChange({
      numero: '',
      titre: '',
      client: '',
      collaborateur: 'tous',
      categorie: 'toutes',
      actif: 'tous'
    });
  };

  const handleSaveFilter = (name: string) => {
    saveFilter(name);
    // TODO: Ici vous pourriez aussi sauvegarder dans le localStorage ou via API
    console.log('Filtre sauvegardé:', name, filters);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Champs de recherche */}
        <div className="flex-1 min-w-[200px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* N° */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N°</label>
              <input
                type="text"
                placeholder="N°"
                value={filters.numero}
                onChange={(e) => updateFilter('numero', e.target.value)}
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
                value={filters.titre}
                onChange={(e) => updateFilter('titre', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input
                type="text"
                placeholder="Client"
                value={filters.client}
                onChange={(e) => updateFilter('client', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Sélecteurs */}
        <div className="flex-1 min-w-[300px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Collaborateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
              <div className="relative">
                <select
                  value={filters.collaborateur}
                  onChange={(e) => updateFilter('collaborateur', e.target.value)}
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
                  value={filters.categorie}
                  onChange={(e) => updateFilter('categorie', e.target.value)}
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
                  value={filters.actif}
                  onChange={(e) => updateFilter('actif', e.target.value)}
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

        {/* Boutons d'action */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="flex items-center space-x-2 bg-[#2170E3] text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span>Chercher</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSaveModal(true)}
              className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              <BookmarkIcon className="w-4 h-4" />
              <span>Enregistrer ce filtre</span>
            </motion.button>
          </div>

          {hasActiveFilters() && (
            <button
              onClick={handleReset}
              className="text-sm text-blue-600 hover:text-blue-800 text-left"
            >
              Annuler ces filtres
            </button>
          )}
        </div>
      </div>

      <SaveFilterModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveFilter}
      />
    </div>
  );
};

export default ResourceFilterPanel;