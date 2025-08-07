import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  Cog6ToothIcon,
  ClipboardDocumentIcon,
  CalendarDaysIcon,
  RssIcon,
  PrinterIcon,
  UsersIcon,
  TagIcon,
  CreditCardIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface OptionsAffichageInterventionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DisplayOptions {
  // Colonne 1
  boutonImpression: boolean;
  ongletsEquipe: boolean;
  
  // Colonne 2
  ongletsStatut: boolean;
  ongletsCategorie: boolean;
  ongletsFacturation: boolean;
  
  // Colonne 3
  ongletsPlannification: boolean;
  ongletsPriorite: boolean;
  choixColonnes: boolean;
  boutonFluxRSS: boolean;
  boutonFluxiCalendar: boolean;
}

interface ColumnSettings {
  [key: string]: boolean;
}

const defaultOptions: DisplayOptions = {
  boutonImpression: false,
  ongletsEquipe: false,
  ongletsStatut: true,
  ongletsCategorie: false,
  ongletsFacturation: false,
  ongletsPlannification: true,
  ongletsPriorite: false,
  choixColonnes: false,
  boutonFluxRSS: false,
  boutonFluxiCalendar: false
};

const defaultColumns: ColumnSettings = {
  selection: true,
  envoiRapport: true,
  envoiConfirmation: true,
  envoiAvisPassage: true,
  calendrierPlanifie: true,
  pointPlanifie: true,
  actif: true,
  dateCreation: true,
  numero: true,
  titreClientAdresse: true,
  demandesClient: true,
  collaborateur: true,
  calendrierEffectue: true,
  effectue: true,
  action: true
};

const OptionsAffichageInterventionsModal: React.FC<OptionsAffichageInterventionsModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [options, setOptions] = useState<DisplayOptions>(defaultOptions);
  const [columns, setColumns] = useState<ColumnSettings>(defaultColumns);
  const [showColumnsDetails, setShowColumnsDetails] = useState(false);
  const [showRSSLink, setShowRSSLink] = useState(false);
  const [showCalendarLink, setShowCalendarLink] = useState(false);

  // Charger les préférences depuis localStorage
  useEffect(() => {
    if (isOpen) {
      const savedOptions = localStorage.getItem('interventions-display-options');
      const savedColumns = localStorage.getItem('interventions-column-settings');
      
      if (savedOptions) {
        setOptions({ ...defaultOptions, ...JSON.parse(savedOptions) });
      }
      if (savedColumns) {
        setColumns({ ...defaultColumns, ...JSON.parse(savedColumns) });
      }
    }
  }, [isOpen]);

  const handleOptionChange = (option: keyof DisplayOptions) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleColumnChange = (column: string) => {
    setColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleSave = () => {
    // Sauvegarder en localStorage
    localStorage.setItem('interventions-display-options', JSON.stringify(options));
    localStorage.setItem('interventions-column-settings', JSON.stringify(columns));
    
    console.log('Options sauvegardées:', options);
    console.log('Colonnes sauvegardées:', columns);
    
    // Ici vous pourriez émettre un événement ou appeler une fonction callback
    // pour mettre à jour l'interface selon les nouvelles options
    
    onClose();
  };

  const handleReset = () => {
    setOptions(defaultOptions);
    setColumns(defaultColumns);
  };

  const generateRSSLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/interventions/rss?token=user-token`;
  };

  const generateCalendarLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/interventions/calendar.ics?token=user-token`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'rss') {
      setShowRSSLink(true);
      setTimeout(() => setShowRSSLink(false), 2000);
    } else {
      setShowCalendarLink(true);
      setTimeout(() => setShowCalendarLink(false), 2000);
    }
  };

  const columnLabels = {
    selection: 'Sélection',
    envoiRapport: 'Envoi rapport',
    envoiConfirmation: 'Envoi confirmation',
    envoiAvisPassage: 'Envoi avis de passage',
    calendrierPlanifie: '📅 (planifié)',
    pointPlanifie: '● (planifié)',
    actif: 'Actif ?',
    dateCreation: 'Date/heure de création',
    numero: 'N°',
    titreClientAdresse: 'Titre / Client / Adresse',
    demandesClient: 'Demandes client',
    collaborateur: 'Collaborateur',
    calendrierEffectue: '📅 (effectué)',
    effectue: 'Effectué ?',
    action: 'Action'
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
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Options d'affichage</h3>
                    <span className="text-sm text-gray-500">- Interventions • Tableau de bord</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleReset}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Colonne 1 */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Interface
                    </h4>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.boutonImpression}
                          onChange={() => handleOptionChange('boutonImpression')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <PrinterIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Bouton d'impression</span>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.ongletsEquipe}
                          onChange={() => handleOptionChange('ongletsEquipe')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <UsersIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Onglets équipe</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Colonne 2 */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Filtres et onglets
                    </h4>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.ongletsStatut}
                          onChange={() => handleOptionChange('ongletsStatut')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <TagIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Onglets statut</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-6">
                            Tout, À affecter, À planifier, À faire, Effectué
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.ongletsCategorie}
                          onChange={() => handleOptionChange('ongletsCategorie')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <TagIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Onglets catégorie</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-6">
                            Abonnement, Création, Entretien, Location, PackPlant...
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.ongletsFacturation}
                          onChange={() => handleOptionChange('ongletsFacturation')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <CreditCardIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Onglets "État de la facturation"</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-6">
                            Aucune facture, En cours, Payée, Impayée
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Colonne 3 */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Affichage et exports
                    </h4>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.ongletsPlannification}
                          onChange={() => handleOptionChange('ongletsPlannification')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Onglets (Tout, Planifié, Effectué)</span>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.ongletsPriorite}
                          onChange={() => handleOptionChange('ongletsPriorite')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <TagIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Onglets priorité</span>
                        </div>
                      </label>

                      {/* Choix des colonnes */}
                      <div className="border border-gray-200 rounded-lg p-3">
                        <label className="flex items-center space-x-3 cursor-pointer mb-2">
                          <input
                            type="checkbox"
                            checked={options.choixColonnes}
                            onChange={() => handleOptionChange('choixColonnes')}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            <EyeIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Choix des colonnes</span>
                          </div>
                          <button
                            onClick={() => setShowColumnsDetails(!showColumnsDetails)}
                            className="ml-auto"
                          >
                            {showColumnsDetails ? (
                              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </label>

                        {showColumnsDetails && (
                          <div className="pl-7 space-y-2 max-h-32 overflow-y-auto">
                            {Object.entries(columnLabels).map(([key, label]) => (
                              <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={columns[key]}
                                  onChange={() => handleColumnChange(key)}
                                  className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  disabled={!options.choixColonnes}
                                />
                                <span className="text-xs text-gray-600">{label}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.boutonFluxRSS}
                          onChange={() => handleOptionChange('boutonFluxRSS')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <RssIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Bouton du flux RSS</span>
                        </div>
                      </label>
                      {options.boutonFluxRSS && (
                        <div className="ml-7 p-2 bg-gray-50 rounded text-xs">
                          <button
                            onClick={() => copyToClipboard(generateRSSLink(), 'rss')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {showRSSLink ? '✓ Copié!' : 'Copier le lien RSS'}
                          </button>
                        </div>
                      )}

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.boutonFluxiCalendar}
                          onChange={() => handleOptionChange('boutonFluxiCalendar')}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Bouton du flux iCalendar</span>
                        </div>
                      </label>
                      {options.boutonFluxiCalendar && (
                        <div className="ml-7 p-2 bg-gray-50 rounded text-xs">
                          <button
                            onClick={() => copyToClipboard(generateCalendarLink(), 'calendar')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {showCalendarLink ? '✓ Copié!' : 'Copier le lien iCalendar'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#2170E3] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
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

export default OptionsAffichageInterventionsModal;