import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PlusIcon,
  CalendarDaysIcon,
  DocumentArrowUpIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

const AjouterChantierModal = ({ isOpen, onClose, chantier = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nom: '',
    client: '',
    etape: '',
    rapportPersonnalise: 'generique',
    dateDebut: '',
    dateFin: '',
    termine: false,
    interventions: 0,
    commentairePublic: '',
    commentairePriv: ''
  });

  // Options pour les selects
  const clientOptions = [
    { value: 'bnp', label: 'BNP PARIBAS' },
    { value: 'sg', label: 'SOCIETE GENERALE' },
    { value: 'hermes', label: 'HERMES' },
    { value: 'sephora', label: 'SEPHORA' },
    { value: 'spotify', label: 'SPOTIFY' },
    { value: 'winamax', label: 'WINAMAX' },
    { value: 'nickel', label: 'NICKEL' }
  ];

  const etapeOptions = [
    { value: 'choix', label: 'Choix' },
    { value: 'facturation', label: 'Facturation' },
    { value: 'execution', label: 'Exécution' },
    { value: 'commande', label: 'Commande' },
    { value: 'planification', label: 'Planification' }
  ];

  const rapportOptions = [
    { value: 'generique', label: 'Modèle générique' },
    { value: 'fiche_chantier', label: 'FICHE CHANTIER' },
    { value: 'rapport_travaux', label: 'Rapport de travaux' },
    { value: 'suivi_chantier', label: 'Suivi de chantier' }
  ];

  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    if (isOpen) {
      if (chantier) {
        // Mode édition
        setFormData({
          nom: chantier.nom || '',
          client: chantier.client || '',
          etape: chantier.etape?.toLowerCase() || '',
          rapportPersonnalise: 'generique',
          dateDebut: chantier.dateDebut || '',
          dateFin: chantier.dateFin || '',
          termine: chantier.termine || false,
          interventions: chantier.nombreInterventions || 0,
          commentairePublic: '',
          commentairePriv: ''
        });
      } else {
        // Mode création
        setFormData({
          nom: '',
          client: '',
          etape: '',
          rapportPersonnalise: 'generique',
          dateDebut: '',
          dateFin: '',
          termine: false,
          interventions: 0,
          commentairePublic: '',
          commentairePriv: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, chantier]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    if (!formData.client) {
      newErrors.client = 'Le client est obligatoire';
    }

    if (!formData.etape) {
      newErrors.etape = 'L\'étape est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(chantier ? 'Chantier modifié:' : 'Nouveau chantier créé:', formData);

      // Fermer le modal après succès
      onClose();

      // TODO: Rafraîchir les données
      // TODO: Afficher un message de succès

    } catch (error) {
      console.error('Erreur lors de la sauvegarde du chantier:', error);
      // TODO: Afficher un message d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  const SearchableSelect = ({ label, value, options, onChange, onAdd, placeholder, error, required = false }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{placeholder || `Sélectionner ${label.toLowerCase()}...`}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );

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
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {chantier ? 'Modifier le chantier' : 'Ajouter un chantier'}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="px-6 py-6">
                <div className="space-y-6">
                  {/* Nom */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.nom ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.nom && <p className="text-sm text-red-600">{errors.nom}</p>}
                  </div>

                  {/* Client */}
                  <SearchableSelect
                    label="Client"
                    value={formData.client}
                    options={clientOptions}
                    onChange={(value) => handleInputChange('client', value)}
                    onAdd={() => console.log('Ajouter client')}
                    placeholder="Client"
                    error={errors.client}
                    required={true}
                  />

                  {/* Étape */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Étape <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.etape}
                      onChange={(e) => handleInputChange('etape', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.etape ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionner une étape...</option>
                      {etapeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.etape && <p className="text-sm text-red-600">{errors.etape}</p>}
                  </div>

                  {/* Rapport personnalisé */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Rapport personnalisé</label>
                    <select
                      value={formData.rapportPersonnalise}
                      onChange={(e) => handleInputChange('rapportPersonnalise', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {rapportOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Début / Fin */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Début</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.dateDebut}
                          onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <CalendarDaysIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Fin</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.dateFin}
                          onChange={(e) => handleInputChange('dateFin', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <CalendarDaysIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Terminé ? */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="termine"
                      checked={formData.termine}
                      onChange={(e) => handleInputChange('termine', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="termine" className="text-sm font-medium text-gray-700">
                      Terminé ?
                    </label>
                  </div>

                  {/* Liens vers devis et autres factures */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Liens vers devis et autres factures</label>
                    <button
                      type="button"
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span className="text-sm">Ajouter un lien</span>
                    </button>
                  </div>

                  {/* Interventions */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Interventions</label>
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                      <span className="text-sm text-gray-900">
                        Total: {formData.interventions}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Ajouter une intervention
                      </motion.button>
                    </div>
                  </div>

                  {/* Commentaire public */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Commentaire public</label>
                    <textarea
                      placeholder="Commentaire public"
                      value={formData.commentairePublic}
                      onChange={(e) => handleInputChange('commentairePublic', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Commentaire privé */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Commentaire privé</label>
                    <textarea
                      placeholder="Commentaire privé"
                      value={formData.commentairePriv}
                      onChange={(e) => handleInputChange('commentairePriv', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    {/* Section Fichiers */}
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <FolderIcon className="w-5 h-5" />
                        <span>Fichiers</span>
                      </button>
                    </div>

                    {/* Bouton Enregistrer */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Enregistrement...</span>
                        </>
                      ) : (
                        <span>Enregistrer</span>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AjouterChantierModal;