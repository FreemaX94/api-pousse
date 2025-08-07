import React, { useState } from 'react';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentArrowDownIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import FactureModal from './FactureModal';
import { useFactureModal } from '../hooks/useFactureModal';
import { toast } from 'react-hot-toast';

const FacturesListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-07-01',
    endDate: '2025-07-31'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showCommentairePriveColumn, setShowCommentairePriveColumn] = useState(true);
  
  const {
    isOpen,
    mode,
    formData,
    loading,
    errors,
    openAddModal,
    openEditModal,
    closeModal,
    updateFormData,
    addLigne,
    removeLigne,
    updateLigne,
    calculateTotals,
    saveFacture
  } = useFactureModal();

  // Mock data pour les factures
  const [facturesList] = useState([
    {
      id: 1,
      numero: 'F202519553',
      dateCreation: '2025-07-18T14:30:00',
      dateEcheance: '2025-08-18',
      statut: 'Brouillon',
      client: { nom: 'Sandra Azoura', id: 1 },
      auteur: 'Simon Henry',
      commentairePrive: 'Facture urgente à traiter',
      envoye: true,
      montantHT: 300.00,
      montantTTC: 360.00,
      resteAPayer: 360.00
    },
    {
      id: 2,
      numero: 'F202519551',
      dateCreation: '2025-07-17T09:15:00',
      dateEcheance: '2025-08-17',
      statut: 'Payée',
      client: { nom: 'Nolita', id: 2 },
      auteur: 'Marie Dubois',
      commentairePrive: 'Client régulier',
      envoye: true,
      montantHT: 552.00,
      montantTTC: 662.40,
      resteAPayer: 0.00
    },
    {
      id: 3,
      numero: 'F202519549',
      dateCreation: '2025-07-16T16:45:00',
      dateEcheance: '2025-08-16',
      statut: 'Impayée',
      client: { nom: 'CREDIT MUTUEL', id: 3 },
      auteur: 'Pierre Martin',
      commentairePrive: 'Relancer le paiement',
      envoye: false,
      montantHT: 1250.00,
      montantTTC: 1500.00,
      resteAPayer: 1500.00
    },
    {
      id: 4,
      numero: 'F202519547',
      dateCreation: '2025-07-15T11:20:00',
      dateEcheance: '2025-08-15',
      statut: 'En cours',
      client: { nom: 'BNP PARIBAS', id: 4 },
      auteur: 'Sophie Leroy',
      commentairePrive: '',
      envoye: true,
      montantHT: 180.00,
      montantTTC: 216.00,
      resteAPayer: 216.00
    },
    {
      id: 5,
      numero: 'F202519545',
      dateCreation: '2025-07-14T13:30:00',
      dateEcheance: '2025-08-14',
      statut: 'Payée',
      client: { nom: 'L\'OREAL', id: 5 },
      auteur: 'Jean Dupont',
      commentairePrive: 'Paiement anticipé',
      envoye: true,
      montantHT: 890.00,
      montantTTC: 1068.00,
      resteAPayer: 0.00
    },
    {
      id: 6,
      numero: 'F202519543',
      dateCreation: '2025-07-13T08:45:00',
      dateEcheance: '2025-08-13',
      statut: 'En cours',
      client: { nom: 'MICROSOFT', id: 6 },
      auteur: 'Simon Henry',
      commentairePrive: 'Validation en attente',
      envoye: false,
      montantHT: 450.00,
      montantTTC: 540.00,
      resteAPayer: 540.00
    },
    {
      id: 7,
      numero: 'F202519541',
      dateCreation: '2025-07-12T15:10:00',
      dateEcheance: '2025-08-12',
      statut: 'Payée',
      client: { nom: 'Station F', id: 7 },
      auteur: 'Marie Dubois',
      commentairePrive: 'Formation terminée',
      envoye: true,
      montantHT: 320.00,
      montantTTC: 384.00,
      resteAPayer: 0.00
    },
    {
      id: 8,
      numero: 'F202519539',
      dateCreation: '2025-07-11T10:25:00',
      dateEcheance: '2025-08-11',
      statut: 'En cours',
      client: { nom: 'AIRBNB', id: 8 },
      auteur: 'Pierre Martin',
      commentairePrive: 'Projet en cours',
      envoye: true,
      montantHT: 2500.00,
      montantTTC: 3000.00,
      resteAPayer: 3000.00
    },
    {
      id: 9,
      numero: 'F202519537',
      dateCreation: '2025-07-10T12:00:00',
      dateEcheance: '2025-08-10',
      statut: 'Payée',
      client: { nom: 'SPOTIFY', id: 9 },
      auteur: 'Sophie Leroy',
      commentairePrive: '',
      envoye: true,
      montantHT: 125.00,
      montantTTC: 150.00,
      resteAPayer: 0.00
    },
    {
      id: 10,
      numero: 'F202519535',
      dateCreation: '2025-07-09T17:30:00',
      dateEcheance: '2025-08-09',
      statut: 'Impayée',
      client: { nom: 'NETFLIX', id: 10 },
      auteur: 'Jean Dupont',
      commentairePrive: 'Contacter le client',
      envoye: false,
      montantHT: 280.00,
      montantTTC: 336.00,
      resteAPayer: 336.00
    }
  ]);

  const categories = [];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredFactures = facturesList.filter(facture => {
    // Filtre par recherche
    const matchSearch = searchTerm === '' || 
      facture.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.commentairePrive.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par date
    const factureDate = new Date(facture.dateCreation);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const matchDate = factureDate >= startDate && factureDate <= endDate;

    return matchSearch && matchDate;
  });

  const sortedFactures = getSortedData(filteredFactures);

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 text-left w-full hover:text-blue-600 transition-colors"
    >
      <span>{children}</span>
      {sortConfig.key === column && (
        sortConfig.direction === 'asc' ? 
          <ChevronUpIcon className="w-3 h-3" /> : 
          <ChevronDownIcon className="w-3 h-3" />
      )}
    </button>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDelaiEcheance = (dateEcheance) => {
    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffTime = echeance - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} jour(s) de retard`, color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Aujourd\'hui', color: 'text-orange-600' };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} jour(s)`, color: 'text-yellow-600' };
    } else {
      return { text: `${diffDays} jour(s)`, color: 'text-green-600' };
    }
  };

  const getStatutBadge = (statut) => {
    const statutConfig = {
      'Brouillon': { bg: 'bg-gray-100', text: 'text-gray-800' },
      'En cours': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Payée': { bg: 'bg-green-100', text: 'text-green-800' },
      'Impayée': { bg: 'bg-red-100', text: 'text-red-800' }
    };
    const config = statutConfig[statut] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {statut}
      </span>
    );
  };


  const handleInlineUpdate = async (factureId, field, value) => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      // En production : await fetch(`/api/invoices/${factureId}`, { method: 'PATCH', ... })
      
      toast.success('Modification enregistrée');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleRefresh = () => {
    // Rafraîchir la liste après ajout/modification
    console.log('Rafraîchissement de la liste');
  };

  return (
    <div className="p-6 space-y-4">
      {/* Barre d'actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={openAddModal}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Ajouter une facture</span>
            </button>

            {/* Sélecteur de plage de dates */}
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              />
              <span className="text-gray-500">–</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              />
            </div>

            {/* Champ Filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filtres</span>
            </button>

            {/* Lien contextuel */}
            <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
              Contrats acceptés, moi
            </button>

            {/* Bouton Options d'affichage */}
            <button
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <CogIcon className="w-4 h-4" />
              <span>Options d'affichage</span>
            </button>
          </div>

          {/* Search déplacé à droite */}
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une facture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>


      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="dateCreation">Date/heure de création</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="delaiEcheance">Délai d'échéance</SortButton>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="resteAPayer">Reste à payer</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="statut">Statut</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="client">Client</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  <label className="flex items-center justify-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCommentairePriveColumn}
                      onChange={(e) => setShowCommentairePriveColumn(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      title="Afficher commentaire privé"
                    />
                    <span>Commentaire privé</span>
                  </label>
                </th>
                {showCommentairePriveColumn && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commentaire privé
                  </th>
                )}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Envoyé ?
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="montantHT">HT (€)</SortButton>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedFactures.map((facture) => {
                const delaiEcheance = calculateDelaiEcheance(facture.dateEcheance);
                return (
                  <tr key={facture.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(facture.dateCreation)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={delaiEcheance.color + ' font-medium'}>
                        {delaiEcheance.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                      {formatCurrency(facture.resteAPayer)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {getStatutBadge(facture.statut)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 hover:underline">
                        {facture.client.nom}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {facture.auteur}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={!!facture.commentairePrive}
                        readOnly
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        title={facture.commentairePrive ? 'A un commentaire privé' : 'Pas de commentaire privé'}
                      />
                    </td>
                    {showCommentairePriveColumn && (
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {facture.commentairePrive || '-'}
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {facture.envoye ? (
                        <CheckIcon className="w-4 h-4 text-green-600 mx-auto" />
                      ) : (
                        <XMarkIcon className="w-4 h-4 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                      {formatCurrency(facture.montantHT)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="Voir"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                          title="Télécharger PDF"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(facture)}
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                          title="Modifier"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {sortedFactures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Aucune facture trouvée</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <FactureModal
        isOpen={isOpen}
        mode={mode}
        formData={formData}
        errors={errors}
        loading={loading}
        onClose={closeModal}
        onUpdateField={updateFormData}
        onAddLigne={addLigne}
        onRemoveLigne={removeLigne}
        onUpdateLigne={updateLigne}
        onSave={(statut) => saveFacture(statut, handleRefresh)}
      />
    </div>
  );
};

export default FacturesListPage;