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
  InformationCircleIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

const EnvoiDocumentsEcheancesDepassees = () => {
  const [activeTab, setActiveTab] = useState('Envoi des documents');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // États pour les toggles des assistants
  const [rapportToggle1, setRapportToggle1] = useState(false);
  const [rapportToggle2, setRapportToggle2] = useState(false);
  const [rapportDropdown, setRapportDropdown] = useState('le lendemain');
  
  const [avisToggle1, setAvisToggle1] = useState(false);
  const [avisToggle2, setAvisToggle2] = useState(false);
  const [avisDropdown, setAvisDropdown] = useState('la veille');

  // Données de démonstration pour les rapports non envoyés
  const rapportsNonEnvoyes = [
    {
      numero: '13045',
      titre: 'CE Singular',
      priority: 'Normal',
      client: 'Singular',
      adresse: '38 Rue Des Jeûneurs, 75002, Paris',
      collaborateur: 'Simon Henry',
      collaborateurInfo: true,
      debut: '15/07/2025 11:00',
      fin: '15/07/2025 12:00',
      duree: '01:00'
    },
    {
      numero: '12754',
      titre: 'CE TORAY',
      priority: 'Normal',
      client: 'TORAY CE',
      adresse: '18 Avenue de la Porte d\'Italie, 75013, Paris',
      collaborateur: 'Elodie Treveten',
      collaborateurInfo: true,
      debut: '11/07/2025 13:00',
      fin: '11/07/2025 14:00',
      duree: '01:00'
    },
    {
      numero: '12753',
      titre: 'Maintenance bureaux',
      priority: 'Normal',
      client: 'CREDIT MUTUEL',
      adresse: '88 Rue de Rivoli, 75001, Paris',
      collaborateur: 'Marie Dubois',
      collaborateurInfo: true,
      debut: '10/07/2025 09:00',
      fin: '10/07/2025 11:00',
      duree: '02:00'
    },
    {
      numero: '12752',
      titre: 'Installation plantes',
      priority: 'Normal',
      client: 'SOCIETE GENERALE',
      adresse: '29 Boulevard Haussmann, 75009, Paris',
      collaborateur: 'Pierre Martin',
      collaborateurInfo: true,
      debut: '09/07/2025 14:00',
      fin: '09/07/2025 15:30',
      duree: '01:30'
    },
    {
      numero: '12751',
      titre: 'Entretien jardins',
      priority: 'Normal',
      client: 'BNP PARIBAS',
      adresse: '16 Boulevard des Italiens, 75009, Paris',
      collaborateur: 'Sophie Leroy',
      collaborateurInfo: true,
      debut: '08/07/2025 08:00',
      fin: '08/07/2025 10:00',
      duree: '02:00'
    }
  ];

  // Données de démonstration pour les avis de passage non envoyés
  const avisNonEnvoyes = [
    {
      numero: '13044',
      titre: 'CE L\'OREAL',
      priority: 'Normal',
      client: 'L\'OREAL',
      adresse: '41 Rue Martre, 92110, Clichy',
      collaborateur: 'Jean Dupont',
      collaborateurInfo: true,
      debut: '16/07/2025 10:00',
      fin: '16/07/2025 11:00',
      duree: '01:00'
    },
    {
      numero: '13043',
      titre: 'Diagnostic plantes',
      priority: 'Normal',
      client: 'DANONE',
      adresse: '17 Boulevard Haussmann, 75009, Paris',
      collaborateur: 'Lucas Bernard',
      collaborateurInfo: true,
      debut: '15/07/2025 14:00',
      fin: '15/07/2025 15:00',
      duree: '01:00'
    },
    {
      numero: '13042',
      titre: 'Arrosage automatique',
      priority: 'Normal',
      client: 'TOTAL ENERGIES',
      adresse: '2 Place Jean Millier, 92400, Courbevoie',
      collaborateur: 'Emma Moreau',
      collaborateurInfo: true,
      debut: '14/07/2025 16:00',
      fin: '14/07/2025 17:30',
      duree: '01:30'
    },
    {
      numero: '13041',
      titre: 'Remplacement bacs',
      priority: 'Normal',
      client: 'MICROSOFT',
      adresse: '37 Quai du Président Roosevelt, 92130, Issy-les-Moulineaux',
      collaborateur: 'Thomas Petit',
      collaborateurInfo: true,
      debut: '13/07/2025 11:00',
      fin: '13/07/2025 12:00',
      duree: '01:00'
    },
    {
      numero: '13040',
      titre: 'Taille haies',
      priority: 'Normal',
      client: 'ORANGE',
      adresse: '78 Rue Olivier de Serres, 75015, Paris',
      collaborateur: 'Camille Roux',
      collaborateurInfo: true,
      debut: '12/07/2025 09:00',
      fin: '12/07/2025 10:30',
      duree: '01:30'
    },
    {
      numero: '13039',
      titre: 'Fertilisation sols',
      priority: 'Normal',
      client: 'AIRBUS',
      adresse: '2 Rond-Point Emile Dewoitine, 31700, Blagnac',
      collaborateur: 'Alexandre Girard',
      collaborateurInfo: true,
      debut: '11/07/2025 15:00',
      fin: '11/07/2025 16:00',
      duree: '01:00'
    },
    {
      numero: '13038',
      titre: 'Nettoyage espaces verts',
      priority: 'Normal',
      client: 'RENAULT',
      adresse: '13 Quai Alphonse le Gallo, 92100, Boulogne-Billancourt',
      collaborateur: 'Léa Fontaine',
      collaborateurInfo: true,
      debut: '10/07/2025 13:00',
      fin: '10/07/2025 14:30',
      duree: '01:30'
    },
    {
      numero: '13037',
      titre: 'Contrôle phytosanitaire',
      priority: 'Normal',
      client: 'VEOLIA',
      adresse: '36 Avenue Kléber, 75116, Paris',
      collaborateur: 'Hugo Lambert',
      collaborateurInfo: true,
      debut: '09/07/2025 10:00',
      fin: '09/07/2025 11:00',
      duree: '01:00'
    },
    {
      numero: '13036',
      titre: 'Plantation saisonnière',
      priority: 'Normal',
      client: 'CARREFOUR',
      adresse: '93 Avenue de Paris, 91300, Massy',
      collaborateur: 'Chloé Mercier',
      collaborateurInfo: true,
      debut: '08/07/2025 14:00',
      fin: '08/07/2025 15:00',
      duree: '01:00'
    },
    {
      numero: '13035',
      titre: 'Maintenance système irrigation',
      priority: 'Normal',
      client: 'ENGIE',
      adresse: '1 Place Samuel de Champlain, 92400, Courbevoie',
      collaborateur: 'Nathan Dubois',
      collaborateurInfo: true,
      debut: '07/07/2025 16:00',
      fin: '07/07/2025 17:00',
      duree: '01:00'
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

  const tabs = ['Devis', 'Factures', 'Interventions', 'Locations', 'Stocks', 'Envoi des documents'];

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

  const renderToggle = (isOn, setIsOn, label) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isOn ? 'bg-[#2170E3]' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={isOn}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderTable = (data, title, subtitle = null) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
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
            {data.map((item, index) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.debut}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.fin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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


  const renderFooter = () => (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          © 2025 Organilog · 
          <button className="text-blue-600 hover:text-blue-800 mx-1">CGU</button>
          ·
          <button className="text-blue-600 hover:text-blue-800 mx-1">Mentions légales</button>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <ArrowUpIcon className="w-4 h-4" />
          <span>Retour en haut</span>
        </button>
      </div>
    </footer>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Section 1: Rapport non envoyé */}
            {renderTable(rapportsNonEnvoyes, "Interventions : rapport non envoyé")}
            
            {/* Section 2: Avis de passage non envoyé */}
            {renderTable(avisNonEnvoyes, "Interventions : avis de passage non envoyé")}
          </div>
        </div>
        
        {renderFooter()}
      </div>
    </div>
  );
};

export default EnvoiDocumentsEcheancesDepassees;