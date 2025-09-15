import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
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

// Lazy loading des composants lourds pour optimisation bundle 🚀
import { createLazyComponent } from '../../../utils/lazy';
import { Suspense } from 'react';
import LoadingFallback from '../../../components/LoadingFallback';

// Composants Finance - Lazy loaded
const ContratsEcheancesDepassees = createLazyComponent(
  () => import('../../finance/components/ContratsEcheancesDepassees')
);
const ProduitsServicesEcheancesDepassees = createLazyComponent(
  () => import('../../finance/components/ProduitsServicesEcheancesDepassees')
);

// Composants Projets - Lazy loaded
const PointagesEcheancesDepassees = createLazyComponent(
  () => import('../../projects/components/PointagesEcheancesDepassees')
);

// Composants Client - Lazy loaded  
const SuiviClientsTab = createLazyComponent(() => import('./SuiviClientsTab'));
const SuiviClientsTabSimple = createLazyComponent(() => import('./SuiviClientsTabSimple'));
const DemandesClientTableauDeBord = createLazyComponent(
  () => import('../../../components/DemandesClientTableauDeBord'),
  { preload: true } // Précharger car souvent utilisé
);
const DemandesClientPlanning = createLazyComponent(
  () => import('../../../components/DemandesClientPlanning')
);
const DemandesClientStatistiques = createLazyComponent(
  () => import('../../../components/DemandesClientStatistiques')
);

// Composants Planning - Lazy loaded avec préchargement conditionnel
const PlanningGeneralSimple = createLazyComponent(
  () => import('../../planning/components/PlanningGeneralSimple'),
  { preload: true }
);
const MonPlanning = createLazyComponent(() => import('../../planning/components/MonPlanning'));
const PlanningSemaine = createLazyComponent(() => import('../../planning/components/PlanningSemaine'));
const PlanningMois = createLazyComponent(() => import('../../planning/components/PlanningMois'));

// Composants Interventions - Lazy loaded (composants lourds)
const InterventionsTableauDeBord = createLazyComponent(
  () => import('../../interventions/components/InterventionsTableauDeBord'),
  { preload: true }
);
const InterventionsJournee = createLazyComponent(
  () => import('../../interventions/components/InterventionsJournee')
);
const InterventionsCarteGeographique = createLazyComponent(
  () => import('../../interventions/components/InterventionsCarteGeographique'),
  { preload: false, delay: 300 } // Délai pour carte lourde
);
const InterventionsChantiers = createLazyComponent(
  () => import('../../interventions/components/InterventionsChantiers')
);
const InterventionsVehicules = createLazyComponent(
  () => import('../../interventions/components/InterventionsVehicules')
);
const MassMailDeliveryNotice = createLazyComponent(
  () => import('../../interventions/components/MassMailDeliveryNotice')
);
const RecurrenceModal = createLazyComponent(
  () => import('../../interventions/components/RecurrenceModal')
);
const WorkedTimeStats = createLazyComponent(
  () => import('../../interventions/components/WorkedTimeStats')
);
const InterventionStats = createLazyComponent(
  () => import('../../interventions/components/InterventionStats')
);
import ActionsCourantes from '../../interventions/components/ActionsCourantes';
import DevisListPage from '../../facturation/components/DevisListPage';
import FacturesListPage from '../../facturation/components/FacturesListPage';
import FacturesAcompteListPage from '../../facturation/components/FacturesAcompteListPage';

const Organipousse = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Devis');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Rappels');
  const [activeSuiviClientsTab, setActiveSuiviClientsTab] = useState('Clients');
  const [activeDemandesClientTab, setActiveDemandesClientTab] = useState('Tableau de bord');
  const [activePlanningTab, setActivePlanningTab] = useState('Planning général');
  const [activeInterventionsTab, setActiveInterventionsTab] = useState('Tableau de bord');
  const [activeFacturationTab, setActiveFacturationTab] = useState('Devis');
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);

  // Gérer l'état passé lors de la navigation
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveMenuItem('Suivi clients');
      setActiveSuiviClientsTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // États pour les toggles des assistants (Envoi des documents)
  const [rapportToggle1, setRapportToggle1] = useState(false);
  const [rapportToggle2, setRapportToggle2] = useState(false);
  const [rapportDropdown, setRapportDropdown] = useState('le lendemain');
  
  const [avisToggle1, setAvisToggle1] = useState(false);
  const [avisToggle2, setAvisToggle2] = useState(false);
  const [avisDropdown, setAvisDropdown] = useState('la veille');

  // Données de démonstration pour les devis
  const devis = [
    {
      numero: 'D202519553',
      dateDevis: '18/06/2025',
      dateEcheance: '17/07/2025',
      client: 'Sandra Azoura',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 300.00,
      totalTTC: 360.00
    },
    {
      numero: 'D202519551',
      dateDevis: '17/06/2025',
      dateEcheance: '16/07/2025',
      client: 'Nolita',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 552.00,
      totalTTC: 662.40
    },
    {
      numero: 'D202519550',
      dateDevis: '16/06/2025',
      dateEcheance: '15/07/2025',
      client: 'Entreprise ABC',
      vendeur: 'Jean Martin',
      statut: 'En cours',
      totalHT: 1200.00,
      totalTTC: 1440.00
    },
    {
      numero: 'D202519549',
      dateDevis: '15/06/2025',
      dateEcheance: '14/07/2025',
      client: 'Bureau XYZ',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 850.00,
      totalTTC: 1020.00
    },
    {
      numero: 'D202519548',
      dateDevis: '14/06/2025',
      dateEcheance: '13/07/2025',
      client: 'Marie Dubois',
      vendeur: 'Sophie Leroy',
      statut: 'En cours',
      totalHT: 420.00,
      totalTTC: 504.00
    },
    {
      numero: 'D202519547',
      dateDevis: '13/06/2025',
      dateEcheance: '12/07/2025',
      client: 'Office Plus',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 680.00,
      totalTTC: 816.00
    },
    {
      numero: 'D202519546',
      dateDevis: '12/06/2025',
      dateEcheance: '11/07/2025',
      client: 'Tech Solutions',
      vendeur: 'Pierre Moreau',
      statut: 'En cours',
      totalHT: 950.00,
      totalTTC: 1140.00
    },
    {
      numero: 'D202519545',
      dateDevis: '11/06/2025',
      dateEcheance: '10/07/2025',
      client: 'Green Corp',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 1500.00,
      totalTTC: 1800.00
    },
    {
      numero: 'D202519544',
      dateDevis: '10/06/2025',
      dateEcheance: '09/07/2025',
      client: 'Eco Business',
      vendeur: 'Anne Petit',
      statut: 'En cours',
      totalHT: 320.00,
      totalTTC: 384.00
    },
    {
      numero: 'D202519543',
      dateDevis: '09/06/2025',
      dateEcheance: '08/07/2025',
      client: 'Start-up Innov',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 750.00,
      totalTTC: 900.00
    }
  ];

  const menuItems = [
    { name: 'Rappels', icon: BellIcon, hasSubmenu: true, submenu: ['Échéances dépassées'] },
    { name: 'Suivi clients', icon: UsersIcon, hasSubmenu: true, submenu: ['Clients', 'Adresses', 'Équipements', 'Contrats', 'Affaires', 'Contacts', 'Fichiers'] },
    { name: 'Demandes client', icon: DocumentTextIcon, hasSubmenu: true, submenu: ['Tableau de bord', 'Planning', 'Statistiques'] },
    { name: 'Planning', icon: CalendarDaysIcon, hasSubmenu: true, submenu: ['Planning général', 'Mon planning', 'Semaine', 'Mois'] },
    { name: 'Interventions', icon: WrenchScrewdriverIcon, hasSubmenu: true, submenu: ['Tableau de bord', 'Journée', 'Carte géographique', 'Chantiers', 'Véhicules', 'Envoi en masse', 'Récurrence', 'Temps travaillé', 'Statistiques', 'Actions courantes'] },
    { name: 'Facturation', icon: CurrencyEuroIcon, hasSubmenu: true, submenu: ['Devis', 'Factures', 'Factures d\'acompte'] },
    { name: 'Locations', icon: BuildingOfficeIcon },
    { name: 'Stocks', icon: ShoppingBagIcon },
    { name: 'Achat', icon: ShoppingBagIcon },
    { name: 'RH', icon: UserGroupIcon },
    { name: 'Pointages', icon: ClockIcon },
    { name: 'Messagerie', icon: ChatBubbleLeftIcon }
  ];

  const tabs = ['Devis', 'Factures', 'Interventions', 'Envoi des documents', 'Demandes client', 'Affaires', 'Contrats', 'Produits ou services', 'Pointages'];

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
      totalTTC: 108.00
    },
    {
      numero: 'F202502439',
      dateFacture: '28/02/2025',
      dateEcheance: '30/03/2025',
      client: 'WEWARD',
      vendeur: 'Lucie Garcia',
      statut: 'En cours',
      totalHT: 1728.00,
      totalTTC: 2073.60
    },
    {
      numero: 'F202502222',
      dateFacture: '31/12/2024',
      dateEcheance: '31/01/2025',
      client: 'Courtyard',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 225.00,
      totalTTC: 270.00
    },
    {
      numero: 'F202402011',
      dateFacture: '25/11/2024',
      dateEcheance: '08/12/2024',
      client: 'Isabel Marant Diffusion',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 337.30,
      totalTTC: 404.76
    },
    {
      numero: 'F202402012',
      dateFacture: '25/11/2024',
      dateEcheance: '08/12/2024',
      client: 'Adagio Buttes Chaumont',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 573.54,
      totalTTC: 674.89
    }
  ];

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
    }
  ];

  // Données de démonstration pour les demandes client
  const demandesClient = [
    {
      numero: '54',
      statut: 'Nouveau',
      priorite: 'Haut',
      titre: 'Attestation URSAFF et RC',
      client: 'IRCEC',
      collaborateur: '—',
      dateDebut: '02/04/2024'
    },
    {
      numero: '55',
      statut: 'Nouveau',
      priorite: 'Normal',
      titre: 'Modification code accès adresse',
      client: 'Join Paris',
      collaborateur: '—',
      dateDebut: '04/04/2024'
    },
    {
      numero: '56',
      statut: 'Nouveau',
      priorite: 'Urgent',
      titre: 'Coordonnées C. Lion',
      client: 'IRCEC',
      collaborateur: '—',
      dateDebut: '05/04/2024'
    },
    {
      numero: '57',
      statut: 'Nouveau',
      priorite: 'Urgent',
      titre: 'Demande de plantes artificielles',
      client: 'Adveris',
      collaborateur: '—',
      dateDebut: '15/04/2024'
    },
    {
      numero: '58',
      statut: 'Nouveau',
      priorite: 'Urgent',
      titre: 'Absence demain',
      client: 'SHARP VISION',
      collaborateur: '—',
      dateDebut: '25/04/2024'
    },
    {
      numero: '59',
      statut: 'Nouveau',
      priorite: 'Normal',
      titre: 'Intervention entretien',
      client: 'Marjolaine Besnard',
      collaborateur: '—',
      dateDebut: '30/05/2024'
    },
    {
      numero: '60',
      statut: 'Nouveau',
      priorite: 'Normal',
      titre: 'Remplacement Plante',
      client: 'Marjolaine Besnard',
      collaborateur: '—',
      dateDebut: '17/07/2024'
    },
    {
      numero: '61',
      statut: 'Nouveau',
      priorite: 'Normal',
      titre: 'Plants livrés et agencement',
      client: 'Singular',
      collaborateur: '—',
      dateDebut: '24/07/2024'
    },
    {
      numero: '62',
      statut: 'Nouveau',
      priorite: 'Urgent',
      titre: 'Annulation intervention',
      client: 'HONORE GAMING/SPORTYTOTE',
      collaborateur: '—',
      dateDebut: '01/08/2024'
    },
    {
      numero: '63',
      statut: 'Nouveau',
      priorite: 'Urgent',
      titre: 'Déplacement d\'un bac',
      client: 'Morning Bourse',
      collaborateur: '—',
      dateDebut: '27/08/2024'
    }
  ];

  // Données de démonstration pour les affaires
  const affaires = [
    {
      numero: '82',
      client: 'Jérémy AZOULAY',
      titreOffre: 'Jérémy AZOULAY',
      categorie: '—',
      montant: 21589.80,
      dateCloture: '14/09/2023'
    },
    {
      numero: '828',
      client: 'Station F',
      titreOffre: 'station f + flatmates',
      categorie: '—',
      montant: 0.00,
      dateCloture: '04/09/2023'
    },
    {
      numero: '80',
      client: 'ABOUGIT NORENA',
      titreOffre: 'ABOUGIT NORENA - CR ext. terrasse',
      categorie: 'parties communes',
      montant: 25070.90,
      dateCloture: '01/09/2023'
    },
    {
      numero: '756',
      client: 'UBIQ',
      titreOffre: 'APPEL D\'OFFRE BUILDING 7 FLOORS ET…',
      categorie: 'Rooftop',
      montant: 0.00,
      dateCloture: '12/06/2023'
    },
    {
      numero: '781',
      client: 'CAMPINGS',
      titreOffre: 'Ateliers Terrariums entre 10 et 20 pax',
      categorie: 'Animation',
      montant: 1300.00,
      dateCloture: '30/05/2023'
    },
    {
      numero: '819',
      client: 'MAIRIE DE NEUILLY',
      titreOffre: 'Location Bambou',
      categorie: 'Location',
      montant: 0.00,
      dateCloture: '26/05/2023'
    },
    {
      numero: '329',
      client: 'Preference Events',
      titreOffre: 'Preférence events - C. Mussard',
      categorie: 'Événementiel',
      montant: 26822.92,
      dateCloture: '25/05/2023'
    },
    {
      numero: '839',
      client: 'LIVE COLONIES',
      titreOffre: 'Achat plantes artificielles',
      categorie: 'Achat',
      montant: 0.00,
      dateCloture: '18/05/2023'
    },
    {
      numero: '745',
      client: 'SOLLERS CONSULTING',
      titreOffre: 'SOLLERS CONSULTING',
      categorie: 'Conseil',
      montant: 4137.00,
      dateCloture: '17/05/2023'
    },
    {
      numero: '848',
      client: 'WITCHCRAFT STUDIO',
      titreOffre: 'achat plantes bureau',
      categorie: 'Achat',
      montant: 316.00,
      dateCloture: '15/05/2023'
    }
  ];

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
                activeMenuItem === item.name ? 'bg-blue-600 bg-opacity-50' : ''
              }`}
              onClick={() => {
                console.log('🔍 Clic sur menu principal:', item.name);
                if (item.hasSubmenu) {
                  setActiveMenuItem(activeMenuItem === item.name ? '' : item.name);
                } else {
                  setActiveMenuItem(item.name);
                }
              }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-sm">{item.name}</span>
                  {item.hasSubmenu && <ChevronDownIcon className="w-4 h-4" />}
                </>
              )}
            </motion.div>
            {activeMenuItem === item.name && item.submenu && !sidebarCollapsed && (
              <div className="ml-8 pb-2">
                {item.submenu.map((subItem, subIndex) => (
                  <div 
                    key={subIndex} 
                    className="py-1 px-4 text-sm text-blue-100 hover:text-white cursor-pointer"
                    onClick={() => {
                      console.log('🔍 Clic sur sous-menu:', item.name, '>', subItem);
                      if (item.name === 'Suivi clients') {
                        setActiveSuiviClientsTab(subItem);
                        setActiveTab('Suivi clients'); // Changer le contenu principal
                      } else if (item.name === 'Demandes client') {
                        setActiveDemandesClientTab(subItem);
                        setActiveTab('Demandes client'); // Changer le contenu principal
                      } else if (item.name === 'Planning') {
                        setActivePlanningTab(subItem);
                        setActiveTab('Planning'); // Changer le contenu principal
                      } else if (item.name === 'Interventions') {
                        setActiveInterventionsTab(subItem);
                        setActiveTab('Interventions'); // Changer le contenu principal
                      } else if (item.name === 'Facturation') {
                        setActiveFacturationTab(subItem);
                        setActiveTab('Facturation'); // Changer le contenu principal
                      }
                    }}
                  >
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
            onClick={() => {
              console.log('🔍 Clic sur onglet:', tab);
              setActiveTab(tab);
            }}
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

  const renderDevisTable = () => (
    <div className="bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Devis en attente de réponse</h2>
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
                Date du devis
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
            {devis.map((item, index) => (
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
                  {item.dateDevis}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.dateEcheance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.vendeur}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0AB00] text-white">
                    {item.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
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

  const renderFacturesTable = () => (
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
                  {item.dateEcheance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-blue-600 hover:text-blue-800 hover:underline">
                    {item.client}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.vendeur}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0AB00] text-white">
                    {item.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
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

  // Fonctions utilitaires pour l'onglet "Affaires"
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(montant);
  };

  const renderAffairesTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Offres dont la date de clôture est dépassée</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N°
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre de l'offre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie de l'offre
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de conclusion attendue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {affaires.map((item, index) => (
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
                  <button className="text-blue-600 hover:text-blue-800 hover:underline">
                    {item.client}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={item.titreOffre}>
                    {item.titreOffre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.categorie}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMontant(item.montant)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {item.dateCloture}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900"
                      title="Voir l'offre"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier l'offre"
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

  const renderAffairesPagination = () => (
    <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page précédente">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Première page">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        
        <div className="flex space-x-1">
          {[1, 2, 3, '...', 15, 16].map((page, index) => (
            <button
              key={index}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                page === 1 ? 'bg-[#2170E3] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Dernière page">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-sm text-gray-700">
        156 résultats
      </div>
    </div>
  );

  const renderAffairesAssistant = () => (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">😊</span>
        </div>
        <div>
          <span className="font-medium text-gray-900">Super assistant</span>
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F0AB00] text-white">
            Fonctionnalité du labo
          </span>
        </div>
      </div>
    </div>
  );

  // Fonctions utilitaires pour l'onglet "Demandes client"
  const getStatutBadgeColor = (statut) => {
    switch (statut) {
      case 'Nouveau':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Terminé':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioriteBadgeColor = (priorite) => {
    switch (priorite) {
      case 'Normal':
        return 'bg-gray-100 text-gray-800';
      case 'Haut':
        return 'bg-blue-100 text-blue-800';
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDemandesClientTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Tickets non clôturés</h2>
        <p className="text-sm text-gray-500">délai maximum de traitement d'un ticket dépassé</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N°
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priorité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de début
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {demandesClient.map((item, index) => (
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutBadgeColor(item.statut)}`}>
                    {item.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioriteBadgeColor(item.priorite)}`}>
                    {item.priorite}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.titre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-blue-600 hover:text-blue-800 hover:underline">
                    {item.client}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.collaborateur}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.dateDebut}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900"
                      title="Voir le ticket"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier le ticket"
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

  const renderDemandesClientPagination = () => (
    <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page précédente">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Première page">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((page, index) => (
            <button
              key={index}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                page === 1 ? 'bg-[#2170E3] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Dernière page">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-sm text-gray-700">
        38 résultats
      </div>
    </div>
  );

  const renderDemandesClientAssistant = () => (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">😊</span>
        </div>
        <div>
          <span className="font-medium text-gray-900">Super assistant</span>
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F0AB00] text-white">
            Fonctionnalité du labo
          </span>
        </div>
      </div>
    </div>
  );

  // Fonctions utilitaires pour l'onglet "Envoi des documents"
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
        aria-label={`${isOn ? 'Désactiver' : 'Activer'} ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderEnvoiDocumentsTable = (data, title, subtitle = null) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre, Client, Adresse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Début</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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

  const renderSuperAssistant = (title, dropdownValue, setDropdownValue, toggle1, setToggle1, toggle2, setToggle2, toggle1Label, toggle2Label) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">😊</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-4">
            <span className="font-medium text-gray-900">Super assistant</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F0AB00] text-white">
              Fonctionnalité du labo
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              <div className="relative">
                <select
                  value={dropdownValue}
                  onChange={(e) => setDropdownValue(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="le lendemain">le lendemain</option>
                  <option value="le jour même">le jour même</option>
                  <option value="2 jours après">2 jours après</option>
                  <option value="la veille">la veille</option>
                  <option value="2 jours avant">2 jours avant</option>
                </select>
              </div>
            </div>
            
            {renderToggle(toggle1, setToggle1, toggle1Label)}
            {renderToggle(toggle2, setToggle2, toggle2Label)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnvoiDocumentsPagination = (resultCount) => (
    <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page précédente">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Première page">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        
        <div className="flex space-x-1">
          {[1, 2, 3, '...', 20, 21].map((page, index) => (
            <button
              key={index}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                page === 1 ? 'bg-[#2170E3] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Dernière page">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-sm text-gray-700">
        {resultCount} résultats
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

  const renderMainContent = () => {
    console.log('🔍 renderMainContent - onglet actif:', activeTab);
    switch (activeTab) {
      case 'Devis':
        return renderDevisTable();
      case 'Factures':
        return renderFacturesTable();
      case 'Interventions':
        console.log('🔍 Organipousse - Rendu de Interventions, sous-onglet:', activeInterventionsTab);
        if (activeInterventionsTab === 'Tableau de bord') {
          return <InterventionsTableauDeBord />;
        }
        if (activeInterventionsTab === 'Journée') {
          return <InterventionsJournee />;
        }
        if (activeInterventionsTab === 'Carte géographique') {
          return <InterventionsCarteGeographique />;
        }
        if (activeInterventionsTab === 'Chantiers') {
          return <InterventionsChantiers />;
        }
        if (activeInterventionsTab === 'Véhicules') {
          return <InterventionsVehicules />;
        }
        if (activeInterventionsTab === 'Envoi en masse') {
          return <MassMailDeliveryNotice />;
        }
        if (activeInterventionsTab === 'Récurrence') {
          return (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Récurrence</h2>
                  <p className="text-gray-600 mt-1">Gérez vos interventions récurrentes</p>
                </div>
                <button
                  onClick={() => setIsRecurrenceModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Ajouter une récurrence</span>
                </button>
              </div>
              
              {/* Contenu de la page récurrence */}
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClockIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune récurrence configurée</h3>
                  <p className="text-gray-500 mb-4">Créez votre première récurrence pour automatiser vos interventions répétitives.</p>
                  <button
                    onClick={() => setIsRecurrenceModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md inline-flex items-center space-x-2 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Créer une récurrence</span>
                  </button>
                </div>
              </div>
            </div>
          );
        }
        if (activeInterventionsTab === 'Temps travaillé') {
          return <WorkedTimeStats />;
        }
        if (activeInterventionsTab === 'Statistiques') {
          return <InterventionStats />;
        }
        if (activeInterventionsTab === 'Actions courantes') {
          return <ActionsCourantes />;
        }
        // Pour les autres sous-onglets d'interventions, on peut ajouter d'autres composants
        return (
          <div className="p-6">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium">{activeInterventionsTab}</h3>
              <p className="mt-2">Cette fonctionnalité sera bientôt disponible.</p>
            </div>
          </div>
        );
      case 'Envoi des documents':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Section 1: Rapport non envoyé */}
            {renderEnvoiDocumentsTable(rapportsNonEnvoyes, "Interventions : rapport non envoyé")}
            {renderEnvoiDocumentsPagination(5)}
            
            {/* Super assistant - Rapport d'intervention */}
            {renderSuperAssistant(
              "Envoyer le rapport à la date terminée de l'intervention",
              rapportDropdown,
              setRapportDropdown,
              rapportToggle1,
              setRapportToggle1,
              rapportToggle2,
              setRapportToggle2,
              "Envoyer le rapport d'intervention au client",
              "Envoyer le rapport d'intervention à l'adresse"
            )}
            
            {/* Section 2: Avis de passage non envoyé */}
            {renderEnvoiDocumentsTable(avisNonEnvoyes, "Interventions : avis de passage non envoyé")}
            {renderEnvoiDocumentsPagination(658)}
            
            {/* Super assistant - Avis de passage */}
            {renderSuperAssistant(
              "Envoyer l'avis de passage à la date planifiée de l'intervention",
              avisDropdown,
              setAvisDropdown,
              avisToggle1,
              setAvisToggle1,
              avisToggle2,
              setAvisToggle2,
              "Envoyer l'avis de passage au client",
              "Envoyer l'avis de passage à l'adresse"
            )}
            
            {/* Footer */}
            {renderFooter()}
          </div>
        );
      case 'Demandes client':
        if (activeDemandesClientTab === 'Planning') {
          return <DemandesClientPlanning />;
        }
        if (activeDemandesClientTab === 'Statistiques') {
          return <DemandesClientStatistiques />;
        }
        return <DemandesClientTableauDeBord />;
      case 'Affaires':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Tableau des affaires */}
            {renderAffairesTable()}
            
            {/* Pagination */}
            {renderAffairesPagination()}
            
            {/* Super assistant */}
            {renderAffairesAssistant()}
          </div>
        );
      case 'Facturation':
        if (activeFacturationTab === 'Devis') {
          return <DevisListPage />;
        }
        if (activeFacturationTab === 'Factures') {
          return <FacturesListPage />;
        }
        if (activeFacturationTab === 'Factures d\'acompte') {
          return <FacturesAcompteListPage />;
        }
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Facturation</h2>
            <p className="text-gray-600">Sous-onglet {activeFacturationTab} en cours de développement.</p>
          </div>
        );
      case 'Contrats':
        return <ContratsEcheancesDepassees />;
      case 'Produits ou services':
        return <ProduitsServicesEcheancesDepassees />;
      case 'Pointages':
        return <PointagesEcheancesDepassees />;
      case 'Suivi clients':
        console.log('🔍 Organipousse - Rendu de Suivi clients, sous-onglet:', activeSuiviClientsTab);
        return <SuiviClientsTab initialActiveTab={activeSuiviClientsTab} />;
      case 'Planning':
        console.log('🔍 Organipousse - Rendu de Planning, sous-onglet:', activePlanningTab);
        if (activePlanningTab === 'Planning général') {
          return <PlanningGeneralSimple />;
        }
        if (activePlanningTab === 'Mon planning') {
          return <MonPlanning />;
        }
        if (activePlanningTab === 'Semaine') {
          return <PlanningSemaine />;
        }
        if (activePlanningTab === 'Mois') {
          return <PlanningMois />;
        }
        // Pour les autres sous-onglets du planning, on peut ajouter d'autres composants
        return (
          <div className="p-6">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium">{activePlanningTab}</h3>
              <p className="mt-2">Cette fonctionnalité sera bientôt disponible.</p>
            </div>
          </div>
        );
      default:
        return renderDevisTable();
    }
  };

  const renderPagination = () => (
    <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        
        <div className="flex space-x-1">
          {[1, 2, 3, '...', 30, 31].map((page, index) => (
            <button
              key={index}
              className={`px-3 py-1 text-sm rounded ${
                page === 1
                  ? 'bg-[#2170E3] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-sm text-gray-700">
        310 résultats
      </div>
    </div>
  );

  const renderAssistant = () => (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">😊</span>
        </div>
        <div>
          <span className="font-medium text-gray-900">Super assistant</span>
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F0AB00] text-white">
            Fonctionnalité du labo
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {renderSidebar()}
      
      <div className="flex-1 flex flex-col">
        {renderHeader()}
        
        {activeMenuItem === 'Rappels' && (
          <div className="bg-white p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              Rappels : Échéances dépassées
            </h1>
          </div>
        )}
        
        {activeMenuItem === 'Demandes client' && (
          <div className="bg-white p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              Demandes client : {activeDemandesClientTab}
            </h1>
          </div>
        )}
        
        {activeMenuItem === 'Planning' && (
          <div className="bg-white p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              Planning : {activePlanningTab}
            </h1>
          </div>
        )}

        {activeMenuItem === 'Interventions' && (
          <div className="bg-white p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              Interventions : {activeInterventionsTab}
            </h1>
          </div>
        )}
        
        {activeMenuItem === 'Rappels' && renderTabs()}
        
        <div className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </div>
        
        {!['Produits ou services', 'Contrats', 'Factures', 'Interventions', 'Envoi des documents', 'Demandes client', 'Affaires', 'Pointages', 'Suivi clients', 'Planning'].includes(activeTab) && renderPagination()}
        {!['Produits ou services', 'Contrats', 'Factures', 'Interventions', 'Envoi des documents', 'Demandes client', 'Affaires', 'Pointages', 'Suivi clients', 'Planning'].includes(activeTab) && renderAssistant()}
      </div>

      {/* Modal de récurrence */}
      <RecurrenceModal 
        isOpen={isRecurrenceModalOpen} 
        onClose={() => setIsRecurrenceModalOpen(false)} 
      />
    </div>
  );
};

export default Organipousse;