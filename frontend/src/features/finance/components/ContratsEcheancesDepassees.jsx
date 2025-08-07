import React from 'react';
import { motion } from 'framer-motion';
import { 
  EyeIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const ContratsEcheancesDepassees = () => {
  // Données de démonstration pour les contrats terminés non clôturés
  const contratsData = [
    {
      numero: '160',
      titre: 'CE Adonys',
      client: 'Adonys Verrerie',
      debut: '01/06/2023',
      fin: '01/06/2025',
      isOverdue: false
    },
    {
      numero: '91',
      titre: 'CE Gustave collection OPERA',
      client: 'Gustave collection Opéra / rue de la paix',
      debut: '22/08/2022',
      fin: '05/08/2024',
      isOverdue: true
    },
    {
      numero: '165',
      titre: 'CE SCI DOISY',
      client: 'SCI Doisy',
      debut: '22/06/2023',
      fin: '21/06/2024',
      isOverdue: true
    },
    {
      numero: '164',
      titre: 'CE Corinne Dromer',
      client: 'Hôtel Le Swann',
      debut: '22/06/2023',
      fin: '21/06/2024',
      isOverdue: true
    },
    {
      numero: '168',
      titre: 'CE Delsol',
      client: 'DELSOL Avocats',
      debut: '21/06/2023',
      fin: '20/06/2024',
      isOverdue: true
    },
    {
      numero: '43',
      titre: 'CE Lydia',
      client: 'Lydia Solutions',
      debut: '15/06/2022',
      fin: '14/06/2024',
      isOverdue: true
    },
    {
      numero: '166',
      titre: 'CE Hôpital Diaconesses',
      client: 'DIACONESSES CROIX ST SIMON',
      debut: '22/11/2023',
      fin: '31/05/2024',
      isOverdue: true
    },
    {
      numero: '38',
      titre: 'CE L\'arche à Paris',
      client: 'L\'Arche à Paris',
      debut: '02/05/2021',
      fin: '30/05/2024',
      isOverdue: true
    },
    {
      numero: '159',
      titre: 'CE Nickel',
      client: 'Nickel / FINANCIÈRE DES PAIEMENTS ELECT.',
      debut: '29/05/2023',
      fin: '28/05/2024',
      isOverdue: true
    },
    {
      numero: '115',
      titre: 'CE Nathalie Smadja',
      client: 'Nathalie SMADJA',
      debut: '02/11/2021',
      fin: '18/04/2024',
      isOverdue: true
    }
  ];

  const renderTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Contrats terminés non clôturés</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N°
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Début
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contratsData.map((contrat, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {contrat.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contrat.titre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-blue-600 hover:text-blue-800 hover:underline">
                    {contrat.client}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contrat.debut}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contrat.isOverdue ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-600">
                      {contrat.fin}
                    </span>
                  ) : (
                    <span>{contrat.fin}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900"
                      title="Voir le contrat"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier le contrat"
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


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tableau des contrats */}
      {renderTable()}
    </div>
  );
};

export default ContratsEcheancesDepassees;