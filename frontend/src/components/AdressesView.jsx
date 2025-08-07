import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AddressFiltersPanel from './AddressFiltersPanel';
import { 
  EyeIcon,
  PencilIcon,
  PlusIcon,
  FunnelIcon,
  ListBulletIcon,
  MapIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const AdressesView = () => {
  const navigate = useNavigate();
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState('liste');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});

  // Données d'exemple pour les adresses
  const adresses = [
    {
      id: 7052,
      client: 'DEODIS',
      codePostal: '92800',
      ville: 'Puteaux',
      rue: '77 Esplanade Du Général De Gaulle',
      interventions: 1,
      equipements: 0
    },
    {
      id: 7051,
      client: 'PAPOT-BATES',
      codePostal: '75016',
      ville: 'Paris',
      rue: '14 Rue De La Source',
      interventions: 4,
      equipements: 0
    },
    {
      id: 7050,
      client: 'NO PLACE LIKE WORK REPUBLIQUE',
      codePostal: '75011',
      ville: 'Paris',
      rue: '30 bis rue de la Fontaine au Roi',
      interventions: 2,
      equipements: 0
    },
    {
      id: 7049,
      client: 'NO PLACE LIKE WORK BASTILLE',
      codePostal: '75011',
      ville: 'Paris',
      rue: '8 Rue Popincourt',
      interventions: 2,
      equipements: 0
    },
    {
      id: 7048,
      client: 'NO PLACE LIKE WORK BASTILLE',
      codePostal: '75011',
      ville: 'Paris',
      rue: '30bis rue de la Fontaine au Roi',
      interventions: 0,
      equipements: 0
    },
    {
      id: 7047,
      client: 'INITIALE',
      codePostal: '33000',
      ville: 'Bordeaux',
      rue: '121 rue de la Croix-de-Seguey',
      interventions: 0,
      equipements: 0
    },
    {
      id: 7046,
      client: 'Valérie de Bourayne',
      codePostal: '75016',
      ville: 'Paris',
      rue: '37 Avenue De La Grande Armée',
      interventions: 0,
      equipements: 0
    },
    {
      id: 7045,
      client: 'Flora sans',
      codePostal: '75014',
      ville: 'Paris',
      rue: '14 Denfert Rochereau',
      interventions: 0,
      equipements: 0
    },
    {
      id: 7044,
      client: 'Longchamp Belles Feuilles',
      codePostal: '75016',
      ville: 'Paris',
      rue: '51 Rue Des Belles Feuilles',
      interventions: 0,
      equipements: 0
    },
    {
      id: 7043,
      client: 'LES NOUVEAUX BUREAUX',
      codePostal: '75017',
      ville: 'Paris',
      rue: '90 avenue de Wagram',
      interventions: 6,
      equipements: 0
    }
  ];

  const totalResults = 7015;
  const resultsPerPage = 10;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const handleSelectAllAddresses = (checked) => {
    if (checked) {
      setSelectedAddresses(adresses.map(adresse => adresse.id));
    } else {
      setSelectedAddresses([]);
    }
  };

  const handleSelectAddress = (addressId, checked) => {
    if (checked) {
      setSelectedAddresses([...selectedAddresses, addressId]);
    } else {
      setSelectedAddresses(selectedAddresses.filter(id => id !== addressId));
    }
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués aux adresses:', filters);
    // Ici vous pourriez appliquer les filtres aux données
    // Par exemple: filtrer la liste des adresses selon les critères
  };

  const handleSaveFilter = (filters) => {
    console.log('Sauvegarde du filtre d\'adresses:', filters);
    // Ici vous pourriez sauvegarder le filtre en base de données
    // ou dans le localStorage pour réutilisation
  };

  const renderViewTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-8">
        <button
          onClick={() => setActiveViewTab('liste')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeViewTab === 'liste'
              ? 'border-[#2170E3] text-[#2170E3]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ListBulletIcon className="w-4 h-4" />
            <span>Liste</span>
          </div>
        </button>
        <button
          onClick={() => setActiveViewTab('carte')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeViewTab === 'carte'
              ? 'border-[#2170E3] text-[#2170E3]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <MapIcon className="w-4 h-4" />
            <span>Carte</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderPagination = () => (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
      <div className="text-sm text-gray-500">
        {totalResults.toLocaleString('fr-FR')} résultats
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-1">
          {/* Première page */}
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-[#2170E3] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            1
          </button>
          
          {/* Pages intermédiaires */}
          {currentPage > 3 && <span className="text-gray-400">…</span>}
          
          {[2, 3].map(page => (
            currentPage <= 3 || Math.abs(currentPage - page) <= 1 ? (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-[#2170E3] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ) : null
          ))}
          
          {/* Séparateur et dernières pages */}
          {currentPage < totalPages - 2 && <span className="text-gray-400">…</span>}
          
          {[totalPages - 1, totalPages].map(page => (
            page > 3 ? (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-[#2170E3] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ) : null
          ))}
        </div>
        
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderCarteView = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center text-gray-500">
        <MapIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Vue carte</h3>
        <p>La vue carte sera implémentée prochainement</p>
      </div>
    </div>
  );

  const renderListeView = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedAddresses.length === adresses.length}
                  onChange={(e) => handleSelectAllAddresses(e.target.checked)}
                  className="w-4 h-4 text-[#2170E3] border-gray-300 rounded focus:ring-[#2170E3]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                N°
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Code postal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Ville
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Rue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Interventions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Équipements
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adresses.map((adresse, index) => (
              <motion.tr
                key={adresse.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="w-12 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedAddresses.includes(adresse.id)}
                    onChange={(e) => handleSelectAddress(adresse.id, e.target.checked)}
                    className="w-4 h-4 text-[#2170E3] border-gray-300 rounded focus:ring-[#2170E3]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {adresse.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-sm font-medium text-[#2170E3] hover:text-blue-700 transition-colors">
                    {adresse.client}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {adresse.codePostal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {adresse.ville}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {adresse.rue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {adresse.interventions > 0 ? (
                    <button className="text-[#2170E3] hover:text-blue-700 font-medium transition-colors">
                      {adresse.interventions}
                    </button>
                  ) : (
                    <span>{adresse.interventions}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {adresse.equipements > 0 ? (
                    <button className="text-[#2170E3] hover:text-blue-700 font-medium transition-colors">
                      {adresse.equipements}
                    </button>
                  ) : (
                    <span>{adresse.equipements}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1 text-gray-400 hover:text-[#2170E3] transition-colors"
                      title="Voir"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1 text-gray-400 hover:text-[#2170E3] transition-colors"
                      title="Modifier"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête avec boutons d'action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/app/add-address')}
            className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter une adresse
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filtres
          </motion.button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Options d'affichage
        </motion.button>
      </div>

      {/* Affichage du nombre de sélectionnés */}
      {selectedAddresses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <p className="text-sm text-blue-700 font-medium">
            {selectedAddresses.length} adresse(s) sélectionnée(s)
          </p>
        </div>
      )}

      {/* Onglets Vue Liste/Carte */}
      {renderViewTabs()}

      {/* Panneau de filtres */}
      <AddressFiltersPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        onSaveFilter={handleSaveFilter}
      />

      {/* Contenu selon la vue active */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeViewTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeViewTab === 'liste' ? renderListeView() : renderCarteView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdressesView;