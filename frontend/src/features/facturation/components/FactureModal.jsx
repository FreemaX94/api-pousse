import React, { useState } from 'react';
import { 
  XMarkIcon,
  UserPlusIcon,
  CalendarIcon,
  PlusIcon,
  DocumentArrowUpIcon,
  CurrencyEuroIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import FactureLinesEditor from './FactureLinesEditor';

const FactureModal = ({ 
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
    { id: 1, nom: 'Arolla', email: 'contact@arolla.fr' },
    { id: 2, nom: 'No Place Like Work Saint-Martin', email: 'contact@noplacelikework.com' },
    { id: 3, nom: 'CREDIT MUTUEL', email: 'pro@creditmutuel.fr' },
    { id: 4, nom: 'SOCIETE GENERALE', email: 'contact@societegenerale.fr' },
    { id: 5, nom: 'BNP PARIBAS', email: 'relation@bnpparibas.com' },
    { id: 6, nom: 'L\'OREAL', email: 'commande@loreal.fr' },
    { id: 7, nom: 'DANONE', email: 'service@danone.com' },
    { id: 8, nom: 'TOTAL ENERGIES', email: 'contact@totalenergies.fr' }
  ];

  const categories = [];

  const contrats = [
    'Contrat annuel - Entretien',
    'Contrat mensuel - Location',
    'Contrat ponctuel - Création',
    'Contrat abonnement - Pack'
  ];

  const rapportTypes = [
    'Devis',
    'Facture',
    'Facture d\'acompte',
    'Avoir'
  ];

  const financementTypes = [
    '',
    'Financement bancaire',
    'Crédit-bail',
    'Location avec option d\'achat',
    'Subvention publique'
  ];

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const toggleCategory = (category) => {
    const currentCategories = formData.categories || [];
    if (currentCategories.includes(category)) {
      onUpdateField('categories', currentCategories.filter(c => c !== category));
    } else {
      onUpdateField('categories', [...currentCategories, category]);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    onUpdateField('fichiers', [...formData.fichiers, ...files]);
  };

  const removeFile = (index) => {
    const newFiles = formData.fichiers.filter((_, i) => i !== index);
    onUpdateField('fichiers', newFiles);
  };

  const calculateTotals = () => {
    const totalHT = formData.lignes.reduce((sum, ligne) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneApresReduction = ligneHT * (1 - (ligne.reduction || 0) / 100);
      return sum + ligneApresReduction;
    }, 0);
    
    const totalTVA = formData.lignes.reduce((sum, ligne) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneApresReduction = ligneHT * (1 - (ligne.reduction || 0) / 100);
      const ligneTVA = ligneApresReduction * (ligne.tva / 100);
      return sum + ligneTVA;
    }, 0);
    
    const totalTTC = totalHT + totalTVA + (formData.fraisTraitement || 0);
    
    return { totalHT, totalTVA, totalTTC };
  };

  const totals = calculateTotals();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Ajouter une facture' : 'Modifier la facture'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-8rem)]">
          <div className="space-y-6">
            {/* 1. En-tête */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-4">1. En-tête</h3>
              <div className="grid grid-cols-2 gap-4">
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

                {/* Contrat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contrat
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      value={formData.contrat}
                      onChange={(e) => onUpdateField('contrat', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un contrat</option>
                      {contrats.map(contrat => (
                        <option key={contrat} value={contrat}>{contrat}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Ajouter un contrat
                    </button>
                  </div>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {categories.slice(0, 10).map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
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

                {/* Rapport personnalisé */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rapport personnalisé
                  </label>
                  <select
                    value={formData.rapportPersonnalise}
                    onChange={(e) => onUpdateField('rapportPersonnalise', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {rapportTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Dates & Référence */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-4">2. Dates & Référence</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Date de la facture <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateFacture}
                    onChange={(e) => onUpdateField('dateFacture', e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 text-sm ${
                      errors.dateFacture ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.dateFacture && (
                    <p className="mt-1 text-xs text-red-600">{errors.dateFacture}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    value={formData.dateEcheance}
                    onChange={(e) => onUpdateField('dateEcheance', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Référence <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => onUpdateField('reference', e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 text-sm ${
                      errors.reference ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="Ex: F2025123456"
                  />
                  {errors.reference && (
                    <p className="mt-1 text-xs text-red-600">{errors.reference}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Commentaire public */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                3. Commentaire public
              </label>
              <textarea
                value={formData.commentairePublic}
                onChange={(e) => onUpdateField('commentairePublic', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Commentaire visible sur la facture..."
              />
            </div>

            {/* 4. Lignes de facturation */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">4. Lignes de facturation</h3>
              <FactureLinesEditor
                lignes={formData.lignes}
                onAddLigne={onAddLigne}
                onRemoveLigne={onRemoveLigne}
                onUpdateLigne={onUpdateLigne}
                afficherReduction={formData.afficherReduction}
                onToggleReduction={(value) => onUpdateField('afficherReduction', value)}
                errors={errors.lignes}
              />
            </div>

            {/* 5. Totaux & frais */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-4">5. Totaux & frais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <CurrencyEuroIcon className="w-4 h-4 inline mr-1" />
                    Frais de traitement (TTC)
                  </label>
                  <input
                    type="number"
                    value={formData.fraisTraitement}
                    onChange={(e) => onUpdateField('fraisTraitement', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Financement externe
                  </label>
                  <select
                    value={formData.financementExterne}
                    onChange={(e) => onUpdateField('financementExterne', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Aucun</option>
                    {financementTypes.slice(1).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Totaux calculés */}
              <div className="mt-4 bg-white p-4 rounded border">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-gray-600">Total HT</div>
                    <div className="font-semibold text-lg">{formatCurrency(totals.totalHT)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Total TVA</div>
                    <div className="font-semibold text-lg">{formatCurrency(totals.totalTVA)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Total TTC</div>
                    <div className="font-bold text-xl text-blue-600">{formatCurrency(totals.totalTTC)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Commentaire privé & fichiers */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-4">6. Commentaire privé & fichiers</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commentaire privé
                  </label>
                  <textarea
                    value={formData.commentairePrive}
                    onChange={(e) => onUpdateField('commentairePrive', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Notes internes (non visibles sur la facture)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Liaison à une facture existante
                  </label>
                  <input
                    type="text"
                    value={formData.liaisonFacture}
                    onChange={(e) => onUpdateField('liaisonFacture', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Référence de facture liée..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fichiers joints
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <DocumentArrowUpIcon className="w-4 h-4" />
                      <span className="text-sm">Upload fichiers</span>
                    </label>
                    {formData.fichiers.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {formData.fichiers.length} fichier(s) sélectionné(s)
                      </span>
                    )}
                  </div>
                  {formData.fichiers.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.fichiers.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSave('brouillon')}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enregistrement...' : 'Brouillon'}
            </button>
            <button
              onClick={() => onSave('en-cours')}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enregistrement...' : 'Facture en cours'}
            </button>
            <button
              onClick={() => onSave('payee')}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enregistrement...' : 'Facture payée'}
            </button>
            <button
              onClick={() => onSave('impayee')}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enregistrement...' : 'Facture impayée'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactureModal;