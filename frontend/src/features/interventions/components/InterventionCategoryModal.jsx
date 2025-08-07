import React from 'react';
import { 
  XMarkIcon,
  InformationCircleIcon,
  ClockIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';

const InterventionCategoryModal = ({ 
  isOpen, 
  mode = 'add',
  formData,
  errors,
  loading,
  onClose,
  onUpdateField,
  onSave
}) => {
  // Palette de couleurs prédéfinies
  const colorPalette = [
    { name: 'Bleu', value: '#3B82F6' },
    { name: 'Vert', value: '#10B981' },
    { name: 'Rouge', value: '#EF4444' },
    { name: 'Jaune', value: '#F59E0B' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Rose', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Turquoise', value: '#14B8A6' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Gris', value: '#6B7280' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const formatTimeInput = (value) => {
    // S'assurer que le format est HH:MM
    const match = value.match(/^(\d{0,2}):?(\d{0,2})$/);
    if (match) {
      let hours = match[1] || '00';
      let minutes = match[2] || '00';
      
      // Limiter les heures à 23
      hours = Math.min(parseInt(hours) || 0, 23).toString().padStart(2, '0');
      // Limiter les minutes à 59
      minutes = Math.min(parseInt(minutes) || 0, 59).toString().padStart(2, '0');
      
      return `${hours}:${minutes}`;
    }
    return '00:00';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Ajouter une catégorie d\'intervention' : 'Modifier la catégorie'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {/* Nom */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => onUpdateField('nom', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm transition-colors ${
                errors.nom ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              } focus:outline-none focus:ring-1 ${
                errors.nom ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Ex: Entretien régulier"
            />
            {errors.nom && (
              <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
            )}
          </div>

          {/* Couleur */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Couleur
            </label>
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => onUpdateField('couleur', color.value)}
                    className={`w-full h-10 rounded-md border-2 transition-all ${
                      formData.couleur === color.value
                        ? 'border-gray-900 scale-110 shadow-md'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-600">Aperçu :</span>
                <div 
                  className="w-20 h-8 rounded-md shadow-sm border border-gray-200"
                  style={{ backgroundColor: formData.couleur }}
                />
                <span className="text-sm text-gray-500">{formData.couleur}</span>
              </div>
            </div>
          </div>

          {/* Taux horaire */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center space-x-1">
                <CurrencyEuroIcon className="w-4 h-4" />
                <span>Taux horaire</span>
                <div className="group relative">
                  <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    Ce taux sera utilisé pour calculer automatiquement le budget des interventions de cette catégorie.
                  </div>
                </div>
              </div>
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.tauxHoraire}
                onChange={(e) => onUpdateField('tauxHoraire', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className={`w-full border rounded-md px-3 py-2 pr-12 text-sm transition-colors ${
                  errors.tauxHoraire ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-1 ${
                  errors.tauxHoraire ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                €/h
              </span>
            </div>
            {errors.tauxHoraire && (
              <p className="mt-1 text-xs text-red-600">{errors.tauxHoraire}</p>
            )}
          </div>

          {/* Durée standard */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>Durée standard</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.dureeStandard}
              onChange={(e) => onUpdateField('dureeStandard', formatTimeInput(e.target.value))}
              placeholder="HH:MM"
              className={`w-full border rounded-md px-3 py-2 text-sm transition-colors ${
                errors.dureeStandard ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              } focus:outline-none focus:ring-1 ${
                errors.dureeStandard ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.dureeStandard && (
              <p className="mt-1 text-xs text-red-600">{errors.dureeStandard}</p>
            )}
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commentaire
            </label>
            <textarea
              value={formData.commentaire}
              onChange={(e) => onUpdateField('commentaire', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Notes ou instructions supplémentaires..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterventionCategoryModal;