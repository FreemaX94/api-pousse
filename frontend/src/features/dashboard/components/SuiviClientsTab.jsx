import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  EyeIcon,
  PencilIcon,
  PlusIcon,
  FunnelIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

import AddClientModal from '../../../shared/components/AddClientModal';
import FiltersPanel from '../../../components/FiltersPanel';
import AdressesView from '../../../components/AdressesView';
import EquipementsView from '../../../components/EquipementsView';
import ContratsView from '../../../components/ContratsView';
import AffairesView from '../../../components/AffairesView';
import ContactsView from '../../../components/ContactsView';
import FichiersView from '../../../components/FichiersView';

const SuiviClientsTab = ({ initialActiveTab = 'Clients' }) => {
  console.log('🔍 SuiviClientsTab - Composant rendu, onglet initial:', initialActiveTab);
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState(initialActiveTab);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  // Sous-onglets pour Suivi clients
  const subTabs = ['Clients', 'Adresses', 'Équipements', 'Contrats', 'Affaires', 'Contacts', 'Fichiers'];

  // Mettre à jour l'onglet actif quand la prop change
  useEffect(() => {
    if (initialActiveTab && subTabs.includes(initialActiveTab)) {
      setActiveSubTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  // Données de démonstration pour les clients
  const clients = [
    {
      id: 1,
      numero: 'CLI001',
      libellePrincipal: 'ADAGIO OPERA',
      nomSociete: 'ADAGIO OPERA SAS',
      telephone: '01 42 61 47 91',
      email: 'contact@adagio-opera.fr',
      interventions: 15,
      indiceConfiance: 'Confiance',
      resteAPayer: 0.00,
      nomContact: 'Marie Dubois',
      adresses: 3
    },
    {
      id: 2,
      numero: 'CLI002',
      libellePrincipal: 'ADVANCY',
      nomSociete: 'ADVANCY CONSEIL',
      telephone: '01 44 82 20 00',
      email: 'info@advancy.com',
      interventions: 8,
      indiceConfiance: 'Confiance',
      resteAPayer: 1250.00,
      nomContact: 'Jean Martin',
      adresses: 2
    },
    {
      id: 3,
      numero: 'CLI003',
      libellePrincipal: 'AE75 SAS',
      nomSociete: 'AE75 SAS',
      telephone: '01 45 67 89 12',
      email: 'contact@ae75.fr',
      interventions: 3,
      indiceConfiance: 'Vigilance',
      resteAPayer: 890.50,
      nomContact: 'Sophie Leroy',
      adresses: 1
    },
    {
      id: 4,
      numero: 'CLI004',
      libellePrincipal: 'AQUILAE GESTION',
      nomSociete: 'AQUILAE GESTION PRIVÉE',
      telephone: '01 53 43 22 11',
      email: 'direction@aquilae.fr',
      interventions: 22,
      indiceConfiance: 'Confiance',
      resteAPayer: 0.00,
      nomContact: 'Pierre Moreau',
      adresses: 4
    },
    {
      id: 5,
      numero: 'CLI005',
      libellePrincipal: 'AAREAL BANK',
      nomSociete: 'AAREAL BANK AG',
      telephone: '01 44 50 33 90',
      email: '',
      interventions: 12,
      indiceConfiance: 'Confiance',
      resteAPayer: 2100.00,
      nomContact: 'Anna Schmidt',
      adresses: 2
    },
    {
      id: 6,
      numero: 'CLI006',
      libellePrincipal: 'BERENBERG BANK',
      nomSociete: 'BERENBERG BANK FRANCE',
      telephone: '01 58 18 71 00',
      email: 'paris@berenberg.fr',
      interventions: 6,
      indiceConfiance: 'Vigilance',
      resteAPayer: 450.00,
      nomContact: 'Thomas Weber',
      adresses: 1
    },
    {
      id: 7,
      numero: 'CLI007',
      libellePrincipal: 'BEWIZ',
      nomSociete: 'BEWIZ TECHNOLOGIES',
      telephone: '01 42 33 87 65',
      email: 'hello@bewiz.tech',
      interventions: 9,
      indiceConfiance: 'Confiance',
      resteAPayer: 0.00,
      nomContact: 'Emma Dubois',
      adresses: 2
    },
    {
      id: 8,
      numero: 'CLI008',
      libellePrincipal: 'CLAREO',
      nomSociete: 'CLAREO CONSULTING',
      telephone: '01 49 52 71 80',
      email: 'contact@clareo.fr',
      interventions: 18,
      indiceConfiance: 'Confiance',
      resteAPayer: 750.00,
      nomContact: 'Lucas Bernard',
      adresses: 3
    }
  ];

  const handleSelectAllClients = (checked) => {
    if (checked) {
      setSelectedClients(clients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId, checked) => {
    if (checked) {
      setSelectedClients([...selectedClients, clientId]);
    } else {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    }
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
    // Ici vous pourriez appliquer les filtres aux données
    // Par exemple: filtrer la liste des clients selon les critères
  };

  const handleSaveFilter = (filters) => {
    console.log('Sauvegarde du filtre:', filters);
    // Ici vous pourriez sauvegarder le filtre en base de données
    // ou dans le localStorage pour réutilisation
  };

  const getIndiceConfiance = (indice) => {
    const colors = {
      'Confiance': 'bg-green-100 text-green-800 border-green-200',
      'Vigilance': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[indice] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const renderSubTabs = () => (
    <div className="bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="flex space-x-6 px-6 overflow-x-auto">
        {subTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`py-4 px-3 border-b-3 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
              activeSubTab === tab
                ? 'border-[#2170E3] text-[#2170E3] bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-[#2170E3] hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  const renderClientsView = () => (
    <div className="p-6">
      {/* En-tête avec boutons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/app/add-client')}
            className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter un client
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
        
        <div className="text-sm text-gray-600">
          {selectedClients.length > 0 && `${selectedClients.length} client(s) sélectionné(s)`}
        </div>
      </div>

      {/* Panneau de filtres */}
      <FiltersPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        onSaveFilter={handleSaveFilter}
      />

      {/* Tableau des clients */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedClients.length === clients.length}
                    onChange={(e) => handleSelectAllClients(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  N°
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  Libellé principal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  Nom de la société
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  Interventions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  Indice de confiance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  Reste à payer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  Nom du contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                  Adresses
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={(e) => handleSelectClient(client.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.numero}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                      {client.libellePrincipal}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.nomSociete}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.telephone && (
                      <a 
                        href={`tel:${client.telephone.replace(/\s/g, '')}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {client.telephone}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.email && (
                      <div className="flex items-center space-x-2">
                        <a 
                          href={`mailto:${client.email}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {client.email}
                        </a>
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline">
                      {client.interventions}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getIndiceConfiance(client.indiceConfiance)}`}>
                      {client.indiceConfiance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(client.resteAPayer)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.nomContact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline">
                      {client.adresses}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        title="Voir le client"
                        aria-label={`Voir ${client.nomSociete}`}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                        title="Modifier le client"
                        aria-label={`Modifier ${client.nomSociete}`}
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

        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" aria-label="Page précédente">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    page === 1 
                      ? 'bg-[#2170E3] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {clients.length} résultats
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecondaryView = (title) => {
    // Données de démonstration selon le type de vue
    const getDemoData = () => {
      switch (title) {
        case 'Adresses':
          return [
            { id: 1, libelle: 'ADAGIO OPERA - Siège Paris', client: 'ADAGIO OPERA SAS', codePostal: '75009', telephone: '01 42 61 47 91' },
            { id: 2, libelle: 'ADVANCY - Bureau principal', client: 'ADVANCY CONSEIL', codePostal: '75008', telephone: '01 44 82 20 00' },
            { id: 3, libelle: 'AE75 SAS - Atelier', client: 'AE75 SAS', codePostal: '75011', telephone: '01 45 67 89 12' }
          ];
        case 'Équipements':
          return [
            { id: 1, libelle: 'Système arrosage automatique', client: 'ADAGIO OPERA SAS', dateInstallation: '15/03/2024', statut: 'Actif' },
            { id: 2, libelle: 'Jardinières connectées', client: 'ADVANCY CONSEIL', dateInstallation: '22/02/2024', statut: 'Maintenance' },
            { id: 3, libelle: 'Mur végétal intérieur', client: 'AE75 SAS', dateInstallation: '10/01/2024', statut: 'Actif' }
          ];
        case 'Contrats':
          return [
            { id: 1, titre: 'Contrat entretien annuel', client: 'ADAGIO OPERA SAS', debut: '01/01/2024', fin: '31/12/2024', statut: 'Actif' },
            { id: 2, titre: 'Maintenance trimestrielle', client: 'ADVANCY CONSEIL', debut: '15/02/2024', fin: '15/02/2025', statut: 'Actif' },
            { id: 3, titre: 'Installation complète', client: 'AE75 SAS', debut: '10/01/2024', fin: '10/07/2024', statut: 'Terminé' }
          ];
        case 'Affaires':
          return [
            { id: 1, client: 'ADAGIO OPERA SAS', titre: 'Aménagement terrasse executive', montant: 15000, dateCloture: '30/06/2024', statut: 'Gagnée' },
            { id: 2, client: 'ADVANCY CONSEIL', titre: 'Végétalisation bureaux', montant: 8500, dateCloture: '15/07/2024', statut: 'En cours' },
            { id: 3, client: 'AE75 SAS', titre: 'Mur végétal entrée', montant: 12000, dateCloture: '20/08/2024', statut: 'Proposée' }
          ];
        case 'Contacts':
          return [
            { id: 1, nom: 'Marie Dubois', societe: 'ADAGIO OPERA SAS', poste: 'Directrice générale', email: 'marie.dubois@adagio-opera.fr', telephone: '01 42 61 47 91' },
            { id: 2, nom: 'Jean Martin', societe: 'ADVANCY CONSEIL', poste: 'Responsable facilities', email: 'jean.martin@advancy.com', telephone: '01 44 82 20 00' },
            { id: 3, nom: 'Sophie Leroy', societe: 'AE75 SAS', poste: 'Chargée de projets', email: 'sophie.leroy@ae75.fr', telephone: '01 45 67 89 12' }
          ];
        case 'Fichiers':
          return [
            { id: 1, nom: 'Contrat_ADAGIO_2024.pdf', type: 'PDF', client: 'ADAGIO OPERA SAS', dateAjout: '15/01/2024' },
            { id: 2, nom: 'Plan_amenagement_ADVANCY.dwg', type: 'CAD', client: 'ADVANCY CONSEIL', dateAjout: '22/02/2024' },
            { id: 3, nom: 'Facture_AE75_mars.pdf', type: 'PDF', client: 'AE75 SAS', dateAjout: '01/03/2024' }
          ];
        default:
          return [];
      }
    };

    const getColumns = () => {
      switch (title) {
        case 'Adresses':
          return ['N°', 'Libellé', 'Client', 'Code postal', 'Téléphone', 'Actions'];
        case 'Équipements':
          return ['N°', 'Libellé équipement', 'Client', 'Date d\'installation', 'Statut', 'Actions'];
        case 'Contrats':
          return ['N°', 'Titre', 'Client', 'Début', 'Fin', 'Statut', 'Actions'];
        case 'Affaires':
          return ['N°', 'Client', 'Titre de l\'offre', 'Montant', 'Date de clôture', 'Statut', 'Actions'];
        case 'Contacts':
          return ['N°', 'Nom complet', 'Société', 'Poste', 'Email', 'Téléphone', 'Actions'];
        case 'Fichiers':
          return ['N°', 'Nom de fichier', 'Type', 'Client', 'Date d\'ajout', 'Actions'];
        default:
          return [];
      }
    };

    const renderCell = (item, column) => {
      switch (column) {
        case 'N°':
          return item.id;
        case 'Libellé':
        case 'Libellé équipement':
          return (
            <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left">
              {item.libelle}
            </button>
          );
        case 'Client':
        case 'Société':
          return (
            <button className="text-blue-600 hover:text-blue-800 hover:underline">
              {item.client || item.societe}
            </button>
          );
        case 'Montant':
          return formatPrice(item.montant);
        case 'Statut':
          const statusColors = {
            'Actif': 'bg-green-100 text-green-800 border-green-200',
            'Maintenance': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Terminé': 'bg-gray-100 text-gray-800 border-gray-200',
            'Gagnée': 'bg-green-100 text-green-800 border-green-200',
            'En cours': 'bg-blue-100 text-blue-800 border-blue-200',
            'Proposée': 'bg-yellow-100 text-yellow-800 border-yellow-200'
          };
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[item.statut] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
              {item.statut}
            </span>
          );
        case 'Email':
          return item.email ? (
            <div className="flex items-center space-x-2">
              <a 
                href={`mailto:${item.email}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {item.email}
              </a>
              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
            </div>
          ) : null;
        case 'Téléphone':
          return item.telephone ? (
            <a 
              href={`tel:${item.telephone.replace(/\s/g, '')}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {item.telephone}
            </a>
          ) : null;
        case 'Actions':
          return (
            <div className="flex items-center justify-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                title={`Voir ${title.slice(0, -1).toLowerCase()}`}
              >
                <EyeIcon className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                title={`Modifier ${title.slice(0, -1).toLowerCase()}`}
              >
                <PencilIcon className="w-4 h-4" />
              </motion.button>
            </div>
          );
        default:
          return item[column.toLowerCase().replace(' ', '')] || item[column] || '';
      }
    };

    const data = getDemoData();
    const columns = getColumns();

    return (
      <div className="p-6">
        {/* En-tête avec bouton d'ajout */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter {title.slice(0, -1).toLowerCase()}
          </motion.button>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    {columns.map((column) => (
                      <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination pour les vues secondaires */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" aria-label="Page précédente">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              <div className="flex space-x-1">
                <button className="px-3 py-1 text-sm rounded bg-[#2170E3] text-white">1</button>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {data.length} résultats
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeSubTab) {
      case 'Clients':
        return renderClientsView();
      case 'Adresses':
        return <AdressesView />;
      case 'Équipements':
        return <EquipementsView />;
      case 'Contrats':
        return <ContratsView />;
      case 'Affaires':
        return <AffairesView />;
      case 'Contacts':
        return <ContactsView />;
      case 'Fichiers':
        return <FichiersView />;
      default:
        return renderClientsView();
    }
  };

  return (
    <div className="w-full h-full">
      {/* Titre de la section */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <UsersIcon className="w-5 h-5 text-[#2170E3]" />
          <h2 className="text-lg font-semibold text-gray-900">Suivi clients</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {activeSubTab}
          </span>
        </div>
      </div>

      {/* Sous-onglets */}
      {renderSubTabs()}
      
      {/* Contenu principal */}
      <div className="bg-gray-50 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
        {renderMainContent()}
      </div>

      {/* Modal d'ajout de client */}
      <AnimatePresence>
        {showAddClientModal && (
          <AddClientModal 
            isOpen={showAddClientModal}
            onClose={() => setShowAddClientModal(false)}
            onSave={(clientData) => {
              console.log('Nouveau client:', clientData);
              setShowAddClientModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuiviClientsTab;