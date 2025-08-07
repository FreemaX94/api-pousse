import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  InformationCircleIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { format, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const MassMailDeliveryNotice = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Client');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeSubNav, setActiveSubNav] = useState('Avis de passage');

  // Données de démonstration
  const mockInterventions = [
    {
      id: '1',
      numero: 'INT-2025-001',
      titre: 'Entretien jardins',
      client: 'BNP PARIBAS',
      clientEmail: 'contact@bnpparibas.fr',
      adresse: '16 Boulevard des Italiens, 75009 Paris',
      adresseEmail: 'site.italiens@bnpparibas.fr',
      contact: 'Jean Dupont',
      contactEmail: 'jean.dupont@bnpparibas.fr',
      termine: true,
      date: '2025-07-25'
    },
    {
      id: '2',
      numero: 'INT-2025-002',
      titre: 'Installation plantes',
      client: 'HERMES',
      clientEmail: 'admin@hermes.com',
      adresse: '24 Rue du Faubourg Saint-Honoré, 75008 Paris',
      adresseEmail: 'faubourg@hermes.com',
      contact: 'Marie Martin',
      contactEmail: 'marie.martin@hermes.com',
      termine: false,
      date: '2025-07-25'
    },
    {
      id: '3',
      numero: 'INT-2025-003',
      titre: 'Maintenance espaces verts',
      client: 'SEPHORA',
      clientEmail: 'contact@sephora.fr',
      adresse: '70 Avenue des Champs-Élysées, 75008 Paris',
      adresseEmail: 'champs.elysees@sephora.fr',
      contact: 'Pierre Durand',
      contactEmail: 'pierre.durand@sephora.fr',
      termine: true,
      date: '2025-07-25'
    },
    {
      id: '4',
      numero: 'INT-2025-004',
      titre: 'Rénovation terrasse',
      client: 'SPOTIFY',
      clientEmail: 'office@spotify.com',
      adresse: '84 Rue de Grenelle, 75007 Paris',
      adresseEmail: 'grenelle@spotify.com',
      contact: 'Sophie Bernard',
      contactEmail: 'sophie.bernard@spotify.com',
      termine: false,
      date: '2025-07-25'
    },
    {
      id: '5',
      numero: 'INT-2025-005',
      titre: 'Aménagement paysager',
      client: 'WINAMAX',
      clientEmail: 'bureau@winamax.fr',
      adresse: '16 Rue Auber, 75009 Paris',
      adresseEmail: 'auber@winamax.fr',
      contact: 'Luc Moreau',
      contactEmail: 'luc.moreau@winamax.fr',
      termine: true,
      date: '2025-07-25'
    }
  ];

  // Fonction pour formater la date
  const formatDateTitle = (date) => {
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr }).toUpperCase();
  };

  // Gérer le changement de date
  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Obtenir l'email selon l'onglet actif
  const getEmailForTab = (intervention) => {
    switch (activeTab) {
      case 'Client':
        return intervention.clientEmail;
      case 'Adresse':
        return intervention.adresseEmail;
      case 'Contact':
        return intervention.contactEmail;
      default:
        return intervention.clientEmail;
    }
  };

  // Filtrer les données selon la date sélectionnée
  const filteredInterventions = mockInterventions.filter(
    intervention => intervention.date === format(selectedDate, 'yyyy-MM-dd')
  );

  // Gérer le tri
  const sortedInterventions = useMemo(() => {
    let sortableItems = [...filteredInterventions];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Cas spécial pour l'email selon l'onglet
        if (sortConfig.key === 'email') {
          aValue = getEmailForTab(a);
          bValue = getEmailForTab(b);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredInterventions, sortConfig, activeTab]);

  // Gérer le tri des colonnes
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Gérer la sélection des lignes
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(sortedInterventions.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  // Composant Header de colonne avec tri
  const SortableHeader = ({ children, sortKey, className = "" }) => (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${className}`}
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <ChevronUpIcon 
            className={`w-3 h-3 ${sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
          />
          <ChevronDownIcon 
            className={`w-3 h-3 -mt-1 ${sortConfig.key === sortKey && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} 
          />
        </div>
      </div>
    </th>
  );

  // Composant Tooltip
  const Tooltip = ({ children, content }) => (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-900 rounded-lg shadow-lg -left-20">
        {content}
        <div className="absolute -top-1 left-24 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Layout avec navigation latérale */}
      <div className="flex">
        {/* Navigation verticale gauche */}
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Envoi en masse</h3>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSubNav('Rapports d\'intervention')}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSubNav === 'Rapports d\'intervention'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Rapports d'intervention
              </button>
              <button
                onClick={() => setActiveSubNav('Avis de passage')}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSubNav === 'Avis de passage'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Avis de passage
              </button>
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          {/* En-tête avec navigation de date */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePreviousDay}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToday}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Aujourd'hui
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNextDay}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              <h1 className="text-xl font-semibold text-gray-900">
                {formatDateTitle(selectedDate)}
              </h1>

              <div className="w-32"></div> {/* Spacer pour centrer le titre */}
            </div>
          </div>

          {/* Onglets de vue */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['Client', 'Adresse', 'Contact'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Indication du nombre de résultats */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                <strong>{sortedInterventions.length}</strong> résultat{sortedInterventions.length > 1 ? 's' : ''}
              </span>
              {selectedRows.length > 0 && (
                <span className="text-sm text-blue-600">
                  {selectedRows.length} sélectionné{selectedRows.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Tableau de résultats */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === sortedInterventions.length && sortedInterventions.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <SortableHeader sortKey="numero">N°</SortableHeader>
                  <SortableHeader sortKey="email">Email</SortableHeader>
                  <SortableHeader sortKey="titre">Titre, Client, Adresse</SortableHeader>
                  <SortableHeader sortKey="termine">Terminé ?</SortableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedInterventions.map((intervention) => (
                  <motion.tr
                    key={intervention.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(intervention.id)}
                        onChange={(e) => handleSelectRow(intervention.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {intervention.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getEmailForTab(intervention)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {intervention.numero} - {intervention.titre}
                          </span>
                          <Tooltip content={`Détails de l'intervention: ${intervention.titre}`}>
                            <InformationCircleIcon className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                          </Tooltip>
                        </div>
                        <div className="text-sm text-gray-600">{intervention.client}</div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{intervention.adresse}</span>
                          <Tooltip content={`Adresse complète: ${intervention.adresse}`}>
                            <InformationCircleIcon className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                          </Tooltip>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {intervention.termine ? (
                          <CheckIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Voir"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Éditer"
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

          {/* Message si aucun résultat */}
          {sortedInterventions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p className="text-lg font-medium">Aucune intervention</p>
                <p className="mt-1">Aucune intervention trouvée pour le {format(selectedDate, 'dd/MM/yyyy', { locale: fr })}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MassMailDeliveryNotice;