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

const InterventionsEcheancesDepassees = () => {
  const [activeTab, setActiveTab] = useState('Interventions');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Données de démonstration pour les interventions
  const interventions = [
    {
      numero: '13349',
      titre: 'ok roquette',
      priority: 'Normal',
      client: 'POUSSE.FR - AGENCE PARIS',
      adresse: '26 Rue Marceau, 94200, Ivry-sur-Seine',
      collaborateur: '—',
      collaborateurInfo: false,
      debut: '10/07/2025',
      fin: '10/07/2025',
      duree: 'non-défini',
      isOverdue: true
    },
    {
      numero: '13348',
      titre: 'Traitement puérons + photo miroir cassé',
      priority: 'Normal',
      client: 'GAUNEAU',
      adresse: '10 Rue Bir Hakeim, 94550, Chevilly-Larue',
      collaborateur: 'Aymeric Tireau',
      collaborateurInfo: true,
      debut: '11/07/2025 12:30',
      fin: '11/07/2025 13:30',
      duree: 'non-défini',
      isOverdue: true
    },
    {
      numero: '13347',
      titre: 'ok Cunanan',
      priority: 'Normal',
      client: 'POUSSE.FR - AGENCE PARIS',
      adresse: '26 Rue Marceau, 94200, Ivry-sur-Seine',
      collaborateur: '—',
      collaborateurInfo: false,
      debut: '09/07/2025',
      fin: '09/07/2025',
      duree: 'non-défini',
      isOverdue: true
    },
    {
      numero: '13346',
      titre: 'ok delbourg',
      priority: 'Normal',
      client: 'POUSSE.FR - AGENCE PARIS',
      adresse: '26 Rue Marceau, 94200, Ivry-sur-Seine',
      collaborateur: '—',
      collaborateurInfo: false,
      debut: '11/07/2025',
      fin: '11/07/2025',
      duree: 'non-défini',
      isOverdue: true
    },
    {
      numero: '13345',
      titre: 'ok Averous',
      priority: 'Normal',
      client: 'POUSSE.FR - AGENCE PARIS',
      adresse: '26 Rue Marceau, 94200, Ivry-sur-Seine',
      collaborateur: '—',
      collaborateurInfo: false,
      debut: '08/07/2025',
      fin: '08/07/2025',
      duree: 'non-défini',
      isOverdue: true
    },
    {
      numero: '13310',
      titre: 'CE – L\'ORÉAL',
      priority: 'Normal',
      client: 'L\'ORÉAL',
      adresse: '35 Rue De Clichy, 93400, Saint-Ouen-sur-Seine',
      collaborateur: 'Estelle Delapierre',
      collaborateurInfo: true,
      debut: '03/07/2025 11:30',
      fin: '03/07/2025 12:00',
      duree: 'non-défini',
      isOverdue: true
    },
    {
      numero: '13309',
      titre: 'Entretien jardins',
      priority: 'Urgent',
      client: 'MAIRIE DE PARIS',
      adresse: '4 Place de l\'Hôtel de Ville, 75004, Paris',
      collaborateur: 'Marie Dubois',
      collaborateurInfo: true,
      debut: '02/07/2025 14:00',
      fin: '02/07/2025 16:00',
      duree: 'non-défini',
      isOverdue: true
    },
    {
      numero: '13308',
      titre: 'Maintenance système arrosage',
      priority: 'Normal',
      client: 'BUREAU VERITAS',
      adresse: '67 Rue du Bac, 75007, Paris',
      collaborateur: 'Pierre Martin',
      collaborateurInfo: true,
      debut: '01/07/2025 09:00',
      fin: '01/07/2025 11:00',
      duree: 'non-défini',
      isOverdue: true
    },
    {
      numero: '13307',
      titre: 'Installation plantes d\'intérieur',
      priority: 'Normal',
      client: 'GOOGLE FRANCE',
      adresse: '8 Rue de Londres, 75009, Paris',
      collaborateur: 'Sophie Leroy',
      collaborateurInfo: true,
      debut: '30/06/2025 10:30',
      fin: '30/06/2025 12:30',
      duree: 'non-défini',
      isOverdue: true
    },
    {
      numero: '13306',
      titre: 'Diagnostic phytosanitaire',
      priority: 'Normal',
      client: 'CRÉDIT AGRICOLE',
      adresse: '12 Place des États-Unis, 75116, Paris',
      collaborateur: 'Jean Dupont',
      collaborateurInfo: true,
      debut: '29/06/2025 15:00',
      fin: '29/06/2025 17:00',
      duree: 'non-défini',
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
          <h2 className="text-lg font-semibold text-gray-900">Interventions non terminées</h2>
        </div>
        <p className="text-sm text-gray-500">ces 30 derniers jours</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N°
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre, Client, Adresse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Début
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durée
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interventions.map((item, index) => (
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
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">{item.titre}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.priority}
                      </span>
                    </div>
                    <div>
                      <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                        {item.client}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.adresse}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-1">
                    <span>{item.collaborateur}</span>
                    {item.collaborateurInfo && (
                      <div className="relative group">
                        <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          <div className="font-medium">{item.collaborateur}</div>
                          <div className="text-xs text-gray-300 mt-1">
                            Collaborateur assigné à cette intervention
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={item.isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
                    {item.debut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={item.isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
                    {item.fin}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                  {item.duree}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900"
                      title="Voir l'intervention"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier l'intervention"
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

export default InterventionsEcheancesDepassees;