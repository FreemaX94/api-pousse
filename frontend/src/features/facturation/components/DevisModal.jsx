import React, { useState } from 'react';
import { 
  XMarkIcon,
  UserPlusIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import DevisLinesEditor from './DevisLinesEditor';

const DevisModal = ({ 
  isOpen, 
  mode = 'add',
  formData,
  errors,
  loading,
  onClose,
  onUpdateField,
  onAddLigne,
  onRemoveLigne,
  onUpdateLigne,
  onSave
}) => {
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  // Mock data
  const clients = [
    { id: 1, nom: 'Singular', email: 'contact@singular.fr' },
    { id: 2, nom: 'TORAY CE', email: 'info@toray.com' },
    { id: 3, nom: 'CREDIT MUTUEL', email: 'pro@creditmutuel.fr' },
    { id: 4, nom: 'SOCIETE GENERALE', email: 'contact@societegenerale.fr' },
    { id: 5, nom: 'BNP PARIBAS', email: 'relation@bnpparibas.com' },
    { id: 6, nom: 'L\'OREAL', email: 'commande@loreal.fr' },
    { id: 7, nom: 'DANONE', email: 'service@danone.com' },
    { id: 8, nom: 'TOTAL ENERGIES', email: 'contact@totalenergies.fr' }
  ];

  const categories = [
    'Abonnement',
    'Achat + Entretien',
    'Achat ponctuel',
    'Ajout végétal',
    'Atelier',
    'Élagage',
    'Bouquet',
    'Conception',
    'Conseil',
    'Contrat',
    'Création',
    'Entretien',
    'Location',
    'Logo végétal',
    'PACK PLANTS',
    'Plant-sitting',
    'Rachat plantes abo',
    'Sapin de Noël',
    'TS – Travaux supplémentaires',
    'upsell'
  ];

  const collaborateurs = [
    'Simon Henry',
    'Elodie Treveten',
    'Marie Dubois',
    'Pierre Martin',
    'Sophie Leroy',
    'Jean Dupont'
  ];

  const statuts = [
    { value: 'En cours', color: 'blue' },
    { value: 'Accepté', color: 'green' },
    { value: 'Refusé', color: 'red' },
    { value: 'En attente', color: 'yellow' },
    { value: 'Expiré', color: 'gray' }
  ];

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const toggleCategory = (category) => {
    const currentCategories = formData.categories || [];
    if (currentCategories.includes(category)) {
      onUpdateField('categories', currentCategories.filter(c => c !== category));
    } else {
      onUpdateField('categories', [...currentCategories, category]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Ajouter un devis' : 'Modifier le devis'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {!formData.client ? (
                  <div>
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);
                        setShowClientSearch(true);
                      }}
                      onFocus={() => setShowClientSearch(true)}
                      placeholder="Rechercher un client..."
                      className={`w-full border rounded-md px-3 py-2 text-sm ${
                        errors.client ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                    {showClientSearch && clientSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredClients.map(client => (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() => {
                              onUpdateField('client', client);
                              setShowClientSearch(false);
                              setClientSearch('');
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100"
                          >
                            <div className="font-medium text-sm">{client.nom}</div>
                            <div className="text-xs text-gray-500">{client.email}</div>
                          </button>
                        ))}
                        <button
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-2 text-blue-600"
                        >
                          <UserPlusIcon className="w-4 h-4" />
                          <span className="text-sm">Créer un nouveau client</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2">
                    <div>
                      <div className="font-medium text-sm">{formData.client.nom}</div>
                      <div className="text-xs text-gray-500">{formData.client.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUpdateField('client', null)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Changer
                    </button>
                  </div>
                )}
              </div>
              {errors.client && (
                <p className="mt-1 text-xs text-red-600">{errors.client}</p>
              )}
            </div>

            {/* Catégories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.categories?.includes(category)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {errors.categories && (
                <p className="mt-1 text-xs text-red-600">{errors.categories}</p>
              )}
            </div>

            {/* Date de création et Statut */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Date de création <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateCreation}
                  onChange={(e) => onUpdateField('dateCreation', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm ${
                    errors.dateCreation ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.dateCreation && (
                  <p className="mt-1 text-xs text-red-600">{errors.dateCreation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => onUpdateField('statut', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {statuts.map(statut => (
                    <option key={statut.value} value={statut.value}>
                      {statut.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Planification */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Planification (optionnel)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Date de planification
                  </label>
                  <input
                    type="date"
                    value={formData.datePlanification}
                    onChange={(e) => onUpdateField('datePlanification', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <UserIcon className="w-4 h-4 inline mr-1" />
                    Assigner à
                  </label>
                  <select
                    value={formData.assigneA}
                    onChange={(e) => onUpdateField('assigneA', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Non assigné</option>
                    {collaborateurs.map(collab => (
                      <option key={collab} value={collab}>{collab}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lignes du devis */}
            <div className="border-t pt-4">
              <DevisLinesEditor
                lignes={formData.lignes}
                onAddLigne={onAddLigne}
                onRemoveLigne={onRemoveLigne}
                onUpdateLigne={onUpdateLigne}
                errors={errors.lignes}
              />
            </div>

            {/* Commentaire privé */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentaire privé
              </label>
              <textarea
                value={formData.commentairePrive}
                onChange={(e) => onUpdateField('commentairePrive', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Notes internes (non visibles sur le devis)..."
              />
            </div>
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

export default DevisModal;