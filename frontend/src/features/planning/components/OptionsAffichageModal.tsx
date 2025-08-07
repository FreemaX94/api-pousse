import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDisplayOptions } from '../hooks/useDisplayOptions';

interface OptionsAffichageModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'planning-general' | 'mon-planning'; // Nouveau prop pour le contexte
}

const OptionsAffichageModal: React.FC<OptionsAffichageModalProps> = ({ isOpen, onClose, context = 'planning-general' }) => {
  const {
    tempOptions,
    updateTempOption,
    saveOptions,
    cancelChanges,
    hasChanges
  } = useDisplayOptions();

  // Réinitialiser les options temporaires à l'ouverture du modal
  useEffect(() => {
    if (isOpen) {
      cancelChanges();
    }
  }, [isOpen, cancelChanges]);

  const handleSave = () => {
    const success = saveOptions();
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    cancelChanges();
    onClose();
  };

  const handleOptionChange = (key: keyof typeof tempOptions, value: boolean) => {
    updateTempOption(key, value);
    
    // Actions spéciales pour certaines options
    if (key === 'boutonImpression' && value) {
      // TODO: Déclencher la configuration d'impression
      console.log('Configuration d\'impression déclenchée');
    }
  };

  const optionsConfig = [
    {
      key: 'boutonImpression' as const,
      label: 'Bouton d\'impression',
      description: 'Afficher le bouton d\'impression dans la barre d\'outils'
    },
    {
      key: 'fenetreConfirmationDeplacement' as const,
      label: 'Fenêtre de confirmation de déplacement',
      description: 'Demander confirmation avant de déplacer une intervention'
    },
    {
      key: 'aidePremiereUtilisation' as const,
      label: 'Aide de première utilisation',
      description: 'Afficher les bulles d\'aide pour les nouveaux utilisateurs'
    },
    {
      key: 'interventionsSansDate' as const,
      label: 'Interventions sans date',
      description: 'Afficher le bandeau des interventions non planifiées'
    }
  ];

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
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Options d'affichage
                  </h3>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="px-6 py-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    {optionsConfig
                      .filter((option) => {
                        // Filtrer les options selon le contexte
                        if (context === 'mon-planning') {
                          // Pour Mon planning, n'afficher que les options spécifiques
                          return ['aidePremiereUtilisation', 'interventionsSansDate'].includes(option.key);
                        }
                        // Pour Planning général, afficher toutes les options
                        return true;
                      })
                      .map((option) => (
                      <div key={option.key} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center h-5">
                          <input
                            id={option.key}
                            type="checkbox"
                            checked={tempOptions[option.key]}
                            onChange={(e) => handleOptionChange(option.key, e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label htmlFor={option.key} className="text-sm font-medium text-gray-900 cursor-pointer">
                            {option.label}
                          </label>
                          <p className="mt-1 text-sm text-gray-500">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Indicateur de changements */}
                  {hasChanges() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                    >
                      <p className="text-sm text-blue-800">
                        Vous avez des modifications non sauvegardées. Cliquez sur "Enregistrer" pour les appliquer.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!hasChanges()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hasChanges()
                      ? 'bg-[#2170E3] text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Enregistrer
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OptionsAffichageModal;