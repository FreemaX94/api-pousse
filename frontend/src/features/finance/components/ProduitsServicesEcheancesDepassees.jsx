import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EyeIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const ProduitsServicesEcheancesDepassees = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Données de démonstration pour les produits avec stock inférieur au seuil
  const produitsStockFaible = [
    {
      code: '7089',
      libelle: 'Reed High Pot Terracotta (set de 3)',
      categorie: '—',
      prixUnitaireTTC: 385.56,
      quantite: -1,
      quantiteMinimum: 0
    },
    {
      code: '7088',
      libelle: 'Mayk Pot Gold Hauteur : 22 Profondeur : 21.5 Diamètre : 20',
      categorie: '—',
      prixUnitaireTTC: 21.60,
      quantite: -1,
      quantiteMinimum: 0
    },
    {
      code: '7085',
      libelle: 'Remi pot green D15 Hauteur 15',
      categorie: '—',
      prixUnitaireTTC: 12.55,
      quantite: -1,
      quantiteMinimum: 0
    },
    {
      code: '7081',
      libelle: 'Cordyline australis \'Red Star\' - H 110 L 75 Pot 32/27',
      categorie: '—',
      prixUnitaireTTC: 110.88,
      quantite: -2,
      quantiteMinimum: 0
    },
    {
      code: '7077',
      libelle: 'Carré potager H 50 cm / Largeur 90 cm',
      categorie: '—',
      prixUnitaireTTC: 219.05,
      quantite: -2,
      quantiteMinimum: 0
    },
    {
      code: '7074',
      libelle: 'Bonsai Shape ficus Hauteur 40 Pot 24',
      categorie: '—',
      prixUnitaireTTC: 97.13,
      quantite: -2,
      quantiteMinimum: 0
    },
    {
      code: '7072',
      libelle: 'Pot pho marron H 45 / D 35',
      categorie: '—',
      prixUnitaireTTC: 264.00,
      quantite: -2,
      quantiteMinimum: 0
    },
    {
      code: '7071',
      libelle: 'ERICA darleyensis blanche',
      categorie: '—',
      prixUnitaireTTC: 10.62,
      quantite: -6,
      quantiteMinimum: 0
    },
    {
      code: '7069',
      libelle: 'Euphorbia ingens (160–190) Ramifié H 170 L 75 Pot 40/34',
      categorie: '—',
      prixUnitaireTTC: 337.92,
      quantite: -1,
      quantiteMinimum: 0
    },
    {
      code: '7068',
      libelle: 'Euphorbia ingens marmorata Ramifié H 120 L 60 Pot 30/28',
      categorie: '—',
      prixUnitaireTTC: 253.44,
      quantite: -1,
      quantiteMinimum: 0
    }
  ];

  const totalResults = 42;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const formatPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(prix);
  };

  const renderTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Produits dont le stock est inférieur au stock limite
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libellé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie du produit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix unitaire TTC
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantité
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantité minimum (seuil d'alerte)
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {produitsStockFaible.map((produit, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {produit.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="line-clamp-2" title={produit.libelle}>
                    {produit.libelle}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {produit.categorie}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatPrix(produit.prixUnitaireTTC)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`font-medium ${
                    produit.quantite < produit.quantiteMinimum 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {produit.quantite}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {produit.quantiteMinimum}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900"
                      title="Voir le produit"
                      aria-label="Voir le produit"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier le produit"
                      aria-label="Modifier le produit"
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
    </div>
  );

  const renderPagination = () => (
    <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button 
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          aria-label="Page précédente"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                page === currentPage 
                  ? 'bg-[#2170E3] text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button 
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          aria-label="Page suivante"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-sm text-gray-500">
        {totalResults} résultats
      </div>
    </div>
  );



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tableau des produits */}
      {renderTable()}
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ProduitsServicesEcheancesDepassees;