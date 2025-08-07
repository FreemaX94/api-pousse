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
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import DevisModal from './DevisModal';
import { useDevisModal } from '../hooks/useDevisModal';
import { toast } from 'react-hot-toast';

const DevisListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-07-01',
    endDate: '2025-07-31'
  });
  const [activeTag, setActiveTag] = useState('Tout');
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
    calculateTotal,
    saveDevis
  } = useDevisModal();

  // Mock data pour les devis
  const [devisList] = useState([
    {
      id: 1,
      numero: 'D202519553',
      dateCreation: '2025-07-18',
      categories: ['Abonnement'],
      statut: 'En cours',
      planifie: false,
      client: { nom: 'Sandra Azoura', id: 1 },
      auteur: 'Simon Henry',
      prive: false,
      envoye: true,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 300.00,
      montantTTC: 360.00
    },
    {
      id: 2,
      numero: 'D202519551',
      dateCreation: '2025-07-17',
      categories: ['Achat + Entretien'],
      statut: 'Accepté',
      planifie: true,
      datePlanification: '2025-08-01',
      client: { nom: 'Nolita', id: 2 },
      auteur: 'Marie Dubois',
      prive: false,
      envoye: true,
      demandeFacturation: 'Oui',
      etatFacturation: 'En attente',
      montantHT: 552.00,
      montantTTC: 662.40
    },
    {
      id: 3,
      numero: 'D202519549',
      dateCreation: '2025-07-16',
      categories: ['Contrat'],
      statut: 'Refusé',
      planifie: false,
      client: { nom: 'CREDIT MUTUEL', id: 3 },
      auteur: 'Pierre Martin',
      prive: true,
      envoye: false,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 1250.00,
      montantTTC: 1500.00
    },
    {
      id: 4,
      numero: 'D202519547',
      dateCreation: '2025-07-15',
      categories: ['Conseil'],
      statut: 'En attente',
      planifie: false,
      client: { nom: 'BNP PARIBAS', id: 4 },
      auteur: 'Sophie Leroy',
      prive: false,
      envoye: true,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 180.00,
      montantTTC: 216.00
    },
    {
      id: 5,
      numero: 'D202519545',
      dateCreation: '2025-07-14',
      categories: ['Location', 'Entretien'],
      statut: 'Accepté',
      planifie: true,
      datePlanification: '2025-07-20',
      client: { nom: 'L\'OREAL', id: 5 },
      auteur: 'Jean Dupont',
      prive: false,
      envoye: true,
      demandeFacturation: 'Oui',
      etatFacturation: 'Facturé',
      montantHT: 890.00,
      montantTTC: 1068.00
    },
    {
      id: 6,
      numero: 'D202519543',
      dateCreation: '2025-07-13',
      categories: ['Sapin de Noël'],
      statut: 'En cours',
      planifie: false,
      client: { nom: 'MICROSOFT', id: 6 },
      auteur: 'Simon Henry',
      prive: false,
      envoye: false,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 450.00,
      montantTTC: 540.00
    },
    {
      id: 7,
      numero: 'D202519541',
      dateCreation: '2025-07-12',
      categories: ['Atelier', 'Conseil'],
      statut: 'Accepté',
      planifie: true,
      datePlanification: '2025-07-25',
      client: { nom: 'Station F', id: 7 },
      auteur: 'Marie Dubois',
      prive: false,
      envoye: true,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 320.00,
      montantTTC: 384.00
    },
    {
      id: 8,
      numero: 'D202519539',
      dateCreation: '2025-07-11',
      categories: ['Logo végétal'],
      statut: 'En cours',
      planifie: false,
      client: { nom: 'AIRBNB', id: 8 },
      auteur: 'Pierre Martin',
      prive: true,
      envoye: true,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 2500.00,
      montantTTC: 3000.00
    },
    {
      id: 9,
      numero: 'D202519537',
      dateCreation: '2025-07-10',
      categories: ['PACK PLANTS'],
      statut: 'Accepté',
      planifie: false,
      client: { nom: 'SPOTIFY', id: 9 },
      auteur: 'Sophie Leroy',
      prive: false,
      envoye: true,
      demandeFacturation: 'Oui',
      etatFacturation: 'En attente',
      montantHT: 125.00,
      montantTTC: 150.00
    },
    {
      id: 10,
      numero: 'D202519535',
      dateCreation: '2025-07-09',
      categories: ['Plant-sitting'],
      statut: 'En cours',
      planifie: true,
      datePlanification: '2025-08-15',
      client: { nom: 'NETFLIX', id: 10 },
      auteur: 'Jean Dupont',
      prive: false,
      envoye: false,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 280.00,
      montantTTC: 336.00
    }
  ]);

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

  const filteredDevis = devisList.filter(devis => {
    // Filtre par recherche
    const matchSearch = searchTerm === '' || 
      devis.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtre par tag
    const matchTag = activeTag === 'Tout' || 
      (activeTag === 'Non attribué' && devis.categories.length === 0) ||
      devis.categories.includes(activeTag);

    // Filtre par date
    const devisDate = new Date(devis.dateCreation);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const matchDate = devisDate >= startDate && devisDate <= endDate;

    return matchSearch && matchTag && matchDate;
  });

  const sortedDevis = getSortedData(filteredDevis);

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
      'Accepté': { bg: 'bg-green-100', text: 'text-green-800' },
      'Refusé': { bg: 'bg-red-100', text: 'text-red-800' },
      'En attente': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Expiré': { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    const config = statutConfig[statut] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {statut}
      </span>
    );
  };

  const handleInlineUpdate = async (devisId, field, value) => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      // En production : await fetch(`/api/invoices/${devisId}`, { method: 'PATCH', ... })
      
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
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={openAddModal}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Ajouter un devis</span>
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

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un devis, client, catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          </div>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTag('Tout')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTag === 'Tout'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setActiveTag('Non attribué')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTag === 'Non attribué'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Non attribué
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveTag(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeTag === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="dateCreation">Date de création</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="statut">Statut</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action : Planifié ?
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="client">Client</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Privé
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Envoyé ?
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demande facturation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  État facturation
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="montantHT">Montant HT</SortButton>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDevis.map((devis) => (
                <tr key={devis.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {new Date(devis.dateCreation).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {devis.categories.map((cat, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {getStatutBadge(devis.statut)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <select
                      value={devis.planifie ? devis.datePlanification : ''}
                      onChange={(e) => handleInlineUpdate(devis.id, 'planification', e.target.value)}
                      className="text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Non planifié</option>
                      <option value="2025-08-01">01/08/2025</option>
                      <option value="2025-08-15">15/08/2025</option>
                      <option value="2025-09-01">01/09/2025</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 hover:underline">
                      {devis.client.nom}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {devis.auteur}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {devis.prive ? (
                      <span className="text-gray-400">🔒</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {devis.envoye ? (
                      <CheckIcon className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <XMarkIcon className="w-4 h-4 text-red-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <select
                      value={devis.demandeFacturation}
                      onChange={(e) => handleInlineUpdate(devis.id, 'demandeFacturation', e.target.value)}
                      className="text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Non">Non</option>
                      <option value="Oui">Oui</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <select
                      value={devis.etatFacturation}
                      onChange={(e) => handleInlineUpdate(devis.id, 'etatFacturation', e.target.value)}
                      className="text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      disabled={devis.demandeFacturation === 'Non'}
                    >
                      <option value="-">-</option>
                      <option value="En attente">En attente</option>
                      <option value="Facturé">Facturé</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                    {formatCurrency(devis.montantHT)}
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
                        onClick={() => openEditModal(devis)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="Modifier"
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
        
        {sortedDevis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Aucun devis trouvé</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <DevisModal
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
        onSave={() => saveDevis(handleRefresh)}
      />
    </div>
  );
};

export default DevisListPage;