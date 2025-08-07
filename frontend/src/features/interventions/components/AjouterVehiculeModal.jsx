import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  CalendarDaysIcon,
  PrinterIcon,
  InformationCircleIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const AjouterVehiculeModal = ({ isOpen, onClose, vehicule = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    collaborateur: '',
    marque: '',
    couleur: '',
    immatriculation: '',
    compteurKm: '',
    dateReleveKm: '',
    compteurHeures: '',
    dateReleveHeures: '',
    derniereRevision: '',
    prochaineRevisionKm: '',
    prochaineRevisionHeures: '',
    prochaineRevisionDate: '',
    commentaire: ''
  });

  // Liste des collaborateurs (alphabétique)
  const collaborateurs = [
    { value: 'aymeric', label: 'Aymeric Tireau (Permis B)' },
    { value: 'david', label: 'David Celeste (Permis B)' },
    { value: 'elodie', label: 'Elodie Treveten (Permis B)' },
    { value: 'estelle', label: 'Estelle Delapierre (Permis B)' },
    { value: 'florence', label: 'Florence ROGER' },
    { value: 'lucie', label: 'Lucie Garcia (Permis B)' },
    { value: 'marine', label: 'Marine Sandoz (Permis B)' },
    { value: 'simon', label: 'Simon Henry (Terrain)' }
  ];

  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    if (isOpen) {
      if (vehicule) {
        // Mode édition
        setFormData({
          nom: vehicule.nom || '',
          collaborateur: vehicule.collaborateur || '',
          marque: vehicule.marque || '',
          couleur: vehicule.couleur || '',
          immatriculation: vehicule.immatriculation || '',
          compteurKm: vehicule.compteurKm || '',
          dateReleveKm: vehicule.dateReleveKm || '',
          compteurHeures: vehicule.compteurHeures || '',
          dateReleveHeures: vehicule.dateReleveHeures || '',
          derniereRevision: vehicule.derniereRevision || '',
          prochaineRevisionKm: vehicule.prochaineRevisionKm || '',
          prochaineRevisionHeures: vehicule.prochaineRevisionHeures || '',
          prochaineRevisionDate: vehicule.prochaineRevisionDate || '',
          commentaire: ''
        });
      } else {
        // Mode création
        setFormData({
          nom: '',
          collaborateur: '',
          marque: '',
          couleur: '',
          immatriculation: '',
          compteurKm: '',
          dateReleveKm: '',
          compteurHeures: '',
          dateReleveHeures: '',
          derniereRevision: '',
          prochaineRevisionKm: '',
          prochaineRevisionHeures: '',
          prochaineRevisionDate: '',
          commentaire: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, vehicule]);

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

    if (!formData.collaborateur) {
      newErrors.collaborateur = 'Le collaborateur est obligatoire';
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

      console.log(vehicule ? 'Véhicule modifié:' : 'Nouveau véhicule créé:', formData);

      // Fermer le modal après succès
      onClose();

      // TODO: Rafraîchir les données
      // TODO: Afficher un message de succès

    } catch (error) {
      console.error('Erreur lors de la sauvegarde du véhicule:', error);
      // TODO: Afficher un message d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    console.log('Impression du véhicule:', formData);
    // TODO: Implémenter la fonction d'impression
  };

  // Mini-modal Options d'affichage
  const OptionsModal = () => (
    <AnimatePresence>
      {showOptionsModal && (
        <div className="fixed inset-0 z-[10000] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowOptionsModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Options d'affichage</h3>
                  <button
                    onClick={() => setShowOptionsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Afficher les données techniques</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Afficher l'historique des révisions</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Masquer les champs vides</span>
                  </label>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowOptionsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setShowOptionsModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
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
                      {vehicule ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
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
                  <div className="space-y-8">
                    {/* Section Données */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Données
                      </h4>
                      <div className="space-y-4">
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

                        {/* Collaborateur */}
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Collaborateur <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.collaborateur}
                            onChange={(e) => handleInputChange('collaborateur', e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.collaborateur ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Choix</option>
                            {collaborateurs.map(collab => (
                              <option key={collab.value} value={collab.value}>
                                <InformationCircleIcon className="w-4 h-4 inline mr-1" />
                                {collab.label}
                              </option>
                            ))}
                          </select>
                          {errors.collaborateur && <p className="text-sm text-red-600">{errors.collaborateur}</p>}
                        </div>

                        {/* Marque, Couleur, Immatriculation */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Marque</label>
                            <input
                              type="text"
                              placeholder="Marque"
                              value={formData.marque}
                              onChange={(e) => handleInputChange('marque', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Couleur</label>
                            <input
                              type="text"
                              placeholder="Couleur"
                              value={formData.couleur}
                              onChange={(e) => handleInputChange('couleur', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Immatriculation</label>
                            <input
                              type="text"
                              placeholder="AB-123-CD"
                              value={formData.immatriculation}
                              onChange={(e) => handleInputChange('immatriculation', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Compteur (km) / Date du relevé (km) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Compteur (km)</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={formData.compteurKm}
                              onChange={(e) => handleInputChange('compteurKm', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Date du relevé (km)</label>
                            <div className="relative">
                              <input
                                type="date"
                                value={formData.dateReleveKm}
                                onChange={(e) => handleInputChange('dateReleveKm', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <CalendarDaysIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Compteur (heures) / Date du relevé (heures) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Compteur (heures)</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={formData.compteurHeures}
                              onChange={(e) => handleInputChange('compteurHeures', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Date du relevé (heures)</label>
                            <div className="relative">
                              <input
                                type="date"
                                value={formData.dateReleveHeures}
                                onChange={(e) => handleInputChange('dateReleveHeures', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <CalendarDaysIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section Précédente révision */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Précédente révision
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Date de la dernière révision</label>
                          <div className="relative">
                            <input
                              type="date"
                              value={formData.derniereRevision}
                              onChange={(e) => handleInputChange('derniereRevision', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <CalendarDaysIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section Prochaine révision */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Prochaine révision
                      </h4>
                      <div className="space-y-4">
                        {/* Compteurs de prochaine révision */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Compteur (km) de la prochaine révision</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={formData.prochaineRevisionKm}
                              onChange={(e) => handleInputChange('prochaineRevisionKm', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Compteur (heures) de la prochaine révision</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={formData.prochaineRevisionHeures}
                              onChange={(e) => handleInputChange('prochaineRevisionHeures', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Date de la prochaine révision */}
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Date de la prochaine révision</label>
                          <div className="relative">
                            <input
                              type="date"
                              value={formData.prochaineRevisionDate}
                              onChange={(e) => handleInputChange('prochaineRevisionDate', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <CalendarDaysIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Commentaire */}
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Commentaire</label>
                          <textarea
                            placeholder="Commentaire"
                            value={formData.commentaire}
                            onChange={(e) => handleInputChange('commentaire', e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      {/* Bouton Enregistrer (à gauche) */}
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

                      {/* Boutons à droite */}
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowOptionsModal(true)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <CogIcon className="w-4 h-4" />
                          <span>Options d'affichage</span>
                        </button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={handlePrint}
                          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <PrinterIcon className="w-4 h-4" />
                          <span>Print</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <OptionsModal />
    </>
  );
};

export default AjouterVehiculeModal;