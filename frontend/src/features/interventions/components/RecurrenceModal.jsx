import React from 'react';
import { X, Calendar, CheckCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import useRecurrenceForm from '../hooks/useRecurrenceForm';

const RecurrenceModal = ({ isOpen, onClose }) => {
  const {
    formData,
    errors,
    updateField,
    validateForm,
    calculerProchainesDates,
    modeleOptions,
    uniteOptions,
    joursAvantOptions
  } = useRecurrenceForm(isOpen);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Ajouter l'appel API pour sauvegarder
      console.log('Données à sauvegarder:', formData);
      alert('Récurrence créée avec succès !');
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Ajouter une récurrence</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="flex">
            {/* Formulaire principal */}
            <div className="flex-1 p-6 space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => updateField('titre', e.target.value)}
                  placeholder="Titre"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.titre ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">Exemple : nom d'un client ou contrat</p>
                {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
              </div>

              {/* Modèle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle *
                </label>
                <select
                  value={formData.modele}
                  onChange={(e) => updateField('modele', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.modele ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner un modèle</option>
                  {modeleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.modele && <p className="text-red-500 text-sm mt-1">{errors.modele}</p>}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => updateField('statut', 'planifie')}
                    className={`flex items-center px-4 py-2 rounded-md border transition-colors ${
                      formData.statut === 'planifie'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar size={16} className="mr-2" />
                    Planifié
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('statut', 'effectue')}
                    className={`flex items-center px-4 py-2 rounded-md border transition-colors ${
                      formData.statut === 'effectue'
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Effectué
                  </button>
                </div>
              </div>

              {/* Fréquence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fréquence
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-600">Répéter tout(te)s les</span>
                  <select
                    value={formData.frequence.nombre}
                    onChange={(e) => updateField('frequence.nombre', parseInt(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(30)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <select
                    value={formData.frequence.unite}
                    onChange={(e) => updateField('frequence.unite', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {uniteOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}(s)
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.excludeWeekends}
                    onChange={(e) => updateField('excludeWeekends', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Exclure les week-ends</span>
                </label>
              </div>

              {/* Type de fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de fin
                </label>
                <select
                  value={formData.typeFin}
                  onChange={(e) => updateField('typeFin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                >
                  <option value="aucune">Aucune fin</option>
                  <option value="occurrences">Par nombre d'occurrences</option>
                  <option value="date">Par date</option>
                </select>

                {formData.typeFin === 'occurrences' && (
                  <input
                    type="number"
                    value={formData.nombreOccurrences}
                    onChange={(e) => updateField('nombreOccurrences', parseInt(e.target.value))}
                    placeholder="Nombre d'occurrences"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nombreOccurrences ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
                {formData.typeFin === 'occurrences' && errors.nombreOccurrences && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombreOccurrences}</p>
                )}

                {formData.typeFin === 'date' && (
                  <input
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => updateField('dateFin', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dateFin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
                {formData.typeFin === 'date' && errors.dateFin && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateFin}</p>
                )}
              </div>

              {/* Prochaine création */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prochaine création *
                </label>
                <input
                  type="date"
                  value={formData.prochaineCreation}
                  onChange={(e) => updateField('prochaineCreation', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.prochaineCreation ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">Ne pas mettre la date du modèle, mais la date de prochaine exécution.</p>
                {errors.prochaineCreation && <p className="text-red-500 text-sm mt-1">{errors.prochaineCreation}</p>}
              </div>

              {/* Générer le document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Générer le document
                </label>
                <select
                  value={formData.genererDocument.joursAvant}
                  onChange={(e) => updateField('genererDocument.joursAvant', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                >
                  {joursAvantOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.genererDocument.generationImmediate}
                    onChange={(e) => updateField('genererDocument.generationImmediate', e.target.checked)}
                    className="mr-2 mt-1"
                  />
                  <div>
                    <span className="text-sm text-gray-700">Génération immédiate : créer les interventions suivantes dès à présent</span>
                    <p className="text-xs text-gray-500 mt-1">Si activé, toutes les occurrences futures seront créées immédiatement plutôt qu'à la date prévue.</p>
                  </div>
                </label>
              </div>

              {/* Autre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.recevoirMail}
                      onChange={(e) => updateField('recevoirMail', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Recevoir un mail lorsqu'un document est créé</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.envoyerMailClient}
                      onChange={(e) => updateField('envoyerMailClient', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Envoyer un mail au client lorsqu'un document est créé</span>
                  </label>
                </div>
              </div>

              {/* Commentaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire
                </label>
                <textarea
                  value={formData.commentaire}
                  onChange={(e) => updateField('commentaire', e.target.value)}
                  placeholder="Commentaire optionnel..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Aperçu */}
            <div className="w-80 bg-blue-50 p-6 border-l">
              <div className="flex items-center mb-4">
                <Info size={20} className="text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">Prévisualisation des dix prochaines créations</h3>
              </div>
              <div className="space-y-2">
                {calculerProchainesDates.map((date, index) => (
                  <div key={index} className="flex items-center text-sm text-blue-800">
                    <Calendar size={14} className="mr-2" />
                    <span>{format(date, 'EEEE dd MMMM yyyy', { locale: fr })}</span>
                  </div>
                ))}
                {calculerProchainesDates.length === 0 && (
                  <p className="text-sm text-blue-600 italic">Aucune date calculée. Veuillez remplir les champs requis.</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurrenceModal;