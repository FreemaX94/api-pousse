import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  CogIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  BellIcon,
  ClockIcon,
  DocumentTextIcon,
  UsersIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  CurrencyEuroIcon,
  BuildingOfficeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const FacturesEcheancesDepassees = () => {
  const [activeTab, setActiveTab] = useState('Factures');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Données de démonstration pour les factures
  const factures = [
    {
      numero: 'F202502474',
      dateFacture: '28/02/2025',
      dateEcheance: '05/04/2025',
      client: 'Josyane Durand',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 90.00,
      totalTTC: 108.00,
      isOverdue: false
    },
    {
      numero: 'F202502439',
      dateFacture: '28/02/2025',
      dateEcheance: '30/03/2025',
      client: 'WEWARD',
      vendeur: 'Lucie Garcia',
      vendeurInfo: true,
      statut: 'En cours',
      totalHT: 1728.00,
      totalTTC: 2073.60,
      isOverdue: false
    },
    {
      numero: 'F202502222',
      dateFacture: '31/12/2024',
      dateEcheance: '31/01/2025',
      client: 'Courtyard',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 225.00,
      totalTTC: 270.00,
      isOverdue: true
    },
    {
      numero: 'F202402011',
      dateFacture: '25/11/2024',
      dateEcheance: '08/12/2024',
      client: 'Isabel Marant Diffusion',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 337.30,
      totalTTC: 404.76,
      isOverdue: true
    },
    {
      numero: 'F202402012',
      dateFacture: '25/11/2024',
      dateEcheance: '08/12/2024',
      client: 'Adagio Buttes Chaumont',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 573.54,
      totalTTC: 674.89,
      isOverdue: true
    },
    {
      numero: 'F202401954',
      dateFacture: '31/10/2024',
      dateEcheance: '30/11/2024',
      client: 'Mangabey',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 435.00,
      totalTTC: 522.00,
      isOverdue: true
    },
    {
      numero: 'F202401978',
      dateFacture: '31/10/2024',
      dateEcheance: '30/11/2024',
      client: 'Isabel Marant Haussmann',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 50.00,
      totalTTC: 60.00,
      isOverdue: true
    },
    {
      numero: 'F202401981',
      dateFacture: '31/10/2024',
      dateEcheance: '30/11/2024',
      client: 'Isabel Marant Victor Hugo',
      vendeur: 'Lucie Garcia',
      vendeurInfo: true,
      statut: 'En cours',
      totalHT: 50.00,
      totalTTC: 60.00,
      isOverdue: true
    },
    {
      numero: 'F202401943',
      dateFacture: '30/10/2024',
      dateEcheance: '30/11/2024',
      client: 'La Pizza de Nico',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 150.00,
      totalTTC: 180.00,
      isOverdue: true
    },
    {
      numero: 'F202401975',
      dateFacture: '31/10/2024',
      dateEcheance: '30/11/2024',
      client: 'Josyane Durand',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 90.00,
      totalTTC: 108.00,
      isOverdue: true
    }
  ];

  const menuItems = [
    { name: 'Rappels', icon: BellIcon, active: true, hasSubmenu: true, submenu: ['Échéances dépassées'] },
    { name: 'Suivi clients', icon: UsersIcon, hasSubmenu: true },
    { name: 'Demandes client', icon: DocumentTextIcon },
    { name: 'Planning', icon: CalendarDaysIcon },
    { name: 'Interventions', icon: WrenchScrewdriverIcon },
    { name: 'Facturation', icon: CurrencyEuroIcon },
    { name: 'Locations', icon: BuildingOfficeIcon },
    { name: 'Stocks', icon: ShoppingBagIcon },
    { name: 'Achat', icon: ShoppingBagIcon },
    { name: 'RH', icon: UserGroupIcon },
    { name: 'Pointages', icon: ClockIcon },
    { name: 'Messagerie', icon: ChatBubbleLeftIcon }
  ];

  const tabs = ['Devis', 'Factures', 'Interventions', 'Locations', 'Stocks'];

  const renderSidebar = () => (
    <div className={`bg-[#2170E3] text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col h-full`}>
      <div className="p-4 border-b border-blue-400">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-[#2170E3] font-bold text-sm">O</span>
              </div>
              <span className="font-semibold">Organilog</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded hover:bg-blue-600"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1">
            <motion.div
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                item.active ? 'bg-blue-600 bg-opacity-50' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-sm">{item.name}</span>
                  {item.hasSubmenu && <ChevronDownIcon className="w-4 h-4" />}
                </>
              )}
            </motion.div>
            {item.active && item.submenu && !sidebarCollapsed && (
              <div className="ml-8 pb-2">
                {item.submenu.map((subItem, subIndex) => (
                  <div key={subIndex} className="py-1 px-4 text-sm text-blue-100 hover:text-white cursor-pointer">
                    {subItem}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-400">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 flex items-center justify-center"
        >
          <PlusIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="bg-[#2170E3] text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-[#2170E3] font-bold text-sm">O</span>
          </div>
          <h1 className="text-xl font-bold">POUSSE</h1>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-blue-600 rounded-lg">
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-blue-600 rounded-lg">
          <CogIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="bg-white border-b border-gray-200">
      <div className="flex space-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'border-[#2170E3] text-[#2170E3]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-white">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Factures en cours</h2>
        </div>
        <p className="text-sm text-gray-500">avec date d'échéance dépassée</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de la facture
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'échéance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom du vendeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total HT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total TTC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {factures.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.dateFacture}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={item.isOverdue ? 'text-red-600 font-medium' : ''}>
                    {item.dateEcheance}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-blue-600 hover:text-blue-800 hover:underline">
                    {item.client}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-1">
                    <span>{item.vendeur}</span>
                    {item.vendeurInfo && (
                      <div className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          Détails du vendeur: {item.vendeur}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.isOverdue 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-[#F0AB00] text-white'
                  }`}>
                    {item.isOverdue ? 'En retard' : item.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.totalHT.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR',
                    minimumFractionDigits: 2
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.totalTTC.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR',
                    minimumFractionDigits: 2
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900"
                      title="Voir la facture"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier la facture"
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
    <div className="flex h-screen bg-gray-100">
      {renderSidebar()}
      
      <div className="flex-1 flex flex-col">
        {renderHeader()}
        
        <div className="bg-white p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Rappels : Échéances dépassées
          </h1>
        </div>
        
        {renderTabs()}
        
        <div className="flex-1 overflow-y-auto">
          {renderTable()}
        </div>
        
      </div>
    </div>
  );
};

export default FacturesEcheancesDepassees;