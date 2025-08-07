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
  CogIcon
} from '@heroicons/react/24/outline';
import FactureAcompteModal from './FactureAcompteModal';
import { useFactureAcompteModal } from '../hooks/useFactureAcompteModal';
import { toast } from 'react-hot-toast';

const FacturesAcompteListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-07-01',
    endDate: '2025-07-31'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
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
    saveFactureAcompte
  } = useFactureAcompteModal();

  // Mock data pour les factures d'acompte
  const [facturesAcompteList] = useState([
    {
      id: 1,
      numero: 'FA202519553',
      dateCreation: '2025-07-18T14:30:00',
      client: { nom: 'Sandra Azoura', id: 1 },
      auteur: 'Simon Henry',
      commentairePrive: 'Acompte de 30% sur projet',
      envoye: true,
      montantHT: 300.00,
      statut: 'En cours'
    },
    {
      id: 2,
      numero: 'FA202519551',
      dateCreation: '2025-07-17T09:15:00',
      client: { nom: 'Nolita', id: 2 },
      auteur: 'Marie Dubois',
      commentairePrive: 'Premier acompte client',
      envoye: true,
      montantHT: 552.00,
      statut: 'Payé'
    },
    {
      id: 3,
      numero: 'FA202519549',
      dateCreation: '2025-07-16T16:45:00',
      client: { nom: 'CREDIT MUTUEL', id: 3 },
      auteur: 'Pierre Martin',
      commentairePrive: 'Acompte contrat annuel',
      envoye: false,
      montantHT: 1250.00,
      statut: 'Impayé'
    },
    {
      id: 4,
      numero: 'FA202519547',
      dateCreation: '2025-07-15T11:20:00',
      client: { nom: 'BNP PARIBAS', id: 4 },
      auteur: 'Sophie Leroy',
      commentairePrive: '',
      envoye: true,
      montantHT: 180.00,
      statut: 'En cours'
    },
    {
      id: 5,
      numero: 'FA202519545',
      dateCreation: '2025-07-14T13:30:00',
      client: { nom: 'L\'OREAL', id: 5 },
      auteur: 'Jean Dupont',
      commentairePrive: 'Acompte projet végétalisation',
      envoye: true,
      montantHT: 890.00,
      statut: 'Payé'
    },
    {
      id: 6,
      numero: 'FA202519543',
      dateCreation: '2025-07-13T08:45:00',
      client: { nom: 'MICROSOFT', id: 6 },
      auteur: 'Simon Henry',
      commentairePrive: 'Acompte 50% avant livraison',
      envoye: false,
      montantHT: 450.00,
      statut: 'En cours'
    },
    {
      id: 7,
      numero: 'FA202519541',
      dateCreation: '2025-07-12T15:10:00',
      client: { nom: 'Station F', id: 7 },
      auteur: 'Marie Dubois',
      commentairePrive: 'Acompte formation équipe',
      envoye: true,
      montantHT: 320.00,
      statut: 'Payé'
    },
    {
      id: 8,
      numero: 'FA202519539',
      dateCreation: '2025-07-11T10:25:00',
      client: { nom: 'AIRBNB', id: 8 },
      auteur: 'Pierre Martin',
      commentairePrive: 'Premier versement logo végétal',
      envoye: true,
      montantHT: 2500.00,
      statut: 'En cours'
    },
    {
      id: 9,
      numero: 'FA202519537',
      dateCreation: '2025-07-10T12:00:00',
      client: { nom: 'SPOTIFY', id: 9 },
      auteur: 'Sophie Leroy',
      commentairePrive: '',
      envoye: true,
      montantHT: 125.00,
      statut: 'Payé'
    },
    {
      id: 10,
      numero: 'FA202519535',
      dateCreation: '2025-07-09T17:30:00',
      client: { nom: 'NETFLIX', id: 10 },
      auteur: 'Jean Dupont',
      commentairePrive: 'Acompte plant-sitting mensuel',
      envoye: false,
      montantHT: 280.00,
      statut: 'Impayé'
    }
  ]);

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

  const filteredFacturesAcompte = facturesAcompteList.filter(facture => {
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

  const sortedFacturesAcompte = getSortedData(filteredFacturesAcompte);

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

  const getStatutBadge = (statut) => {
    const statutConfig = {
      'En cours': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Payé': { bg: 'bg-green-100', text: 'text-green-800' },
      'Impayé': { bg: 'bg-red-100', text: 'text-red-800' },
      'Brouillon': { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    const config = statutConfig[statut] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {statut}
      </span>
    );
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
              <span>Ajouter une facture d'acompte</span>
            </button>

            {/* Date range picker */}
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

            {/* Filters */}
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

            {/* Options d'affichage */}
            <button
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <CogIcon className="w-4 h-4" />
              <span>Options d'affichage</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une facture d'acompte..."
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
                  <SortButton column="client">Client</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commentaire privé
                </th>
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
              {sortedFacturesAcompte.map((factureAcompte) => (
                <tr key={factureAcompte.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 hover:underline font-medium">
                        {factureAcompte.client.nom}
                      </button>
                      {getStatutBadge(factureAcompte.statut)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {factureAcompte.auteur}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {factureAcompte.commentairePrive || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {factureAcompte.envoye ? (
                      <CheckIcon className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <XMarkIcon className="w-4 h-4 text-red-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                    {formatCurrency(factureAcompte.montantHT)}
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
                        onClick={() => openEditModal(factureAcompte)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="Éditer"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedFacturesAcompte.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Aucune facture d'acompte trouvée</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <FactureAcompteModal
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
        onSave={(statut) => saveFactureAcompte(statut, handleRefresh)}
      />
    </div>
  );
};

export default FacturesAcompteListPage;