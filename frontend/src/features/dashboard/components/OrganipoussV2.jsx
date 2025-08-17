import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useOrganipoussV2 } from '../hooks/useOrganipoussV2';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  PremiumKPICard, 
  PremiumNotification, 
  PremiumActionButton,
  AIAssistantWidget,
  CommandPalette
} from './OrganipoussV2Premium';
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
  ArrowUpIcon,
  SparklesIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  BeakerIcon,
  CubeTransparentIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  TrophyIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

// Lazy loading des composants lourds pour optimisation bundle 🚀
import { createLazyComponent } from '../../../utils/lazy';
import { Suspense } from 'react';
import LoadingFallback from '../../../components/LoadingFallback';

// Composants Finance - Lazy loaded
const ContratsEcheancesDepassees = createLazyComponent(
  () => import('../../finance/components/ContratsEcheancesDepassees'),
  { preload: false }
);
const ProduitsServicesEcheancesDepassees = createLazyComponent(
  () => import('../../finance/components/ProduitsServicesEcheancesDepassees'),
  { preload: false }
);

// Composants Projets - Lazy loaded
const PointagesEcheancesDepassees = createLazyComponent(
  () => import('../../projects/components/PointagesEcheancesDepassees'),
  { preload: false }
);

// Composants Client - Lazy loaded  
const SuiviClientsTab = createLazyComponent(() => import('./SuiviClientsTab'));
const SuiviClientsTabSimple = createLazyComponent(() => import('./SuiviClientsTabSimple'));
const DemandesClientTableauDeBord = createLazyComponent(
  () => import('../../../components/DemandesClientTableauDeBord'),
  { preload: true }
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
  { preload: false, delay: 300 }
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

// Dashboard Premium - Import direct pour performance
import DashboardPremium from './DashboardPremium';
import DevisPremium from './DevisPremium';
import FacturesPremium from './FacturesPremium';
import InterventionsPremium from './InterventionsPremium';
import EnvoiDocumentsPremium from './EnvoiDocumentsPremium';
import DemandesClientPremium from './DemandesClientPremium';
import AffairesPremium from './AffairesPremium';
import ContratsPremium from './ContratsPremium';
import ProduitsServicesPremium from './ProduitsServicesPremium';
import PointagesPremium from './PointagesPremium';
import RappelsUltraPremium from './RappelsUltraPremium';
import ClientsPremium from './ClientsPremium';
import AdressesPremium from './AdressesPremium';
import EquipementsPremium from './EquipementsPremium';
import ContactsPremium from './ContactsPremium';
import FichiersPremium from './FichiersPremium';

// Demandes Client Premium
import TableauDeBordDemandesClientPremium from './TableauDeBordDemandesClientPremium';
import PlanningDemandesClientPremium from './PlanningDemandesClientPremium';
import StatistiquesDemandesClientPremium from './StatistiquesDemandesClientPremium';

// Planning Premium
import PlanningGeneralPremium from './PlanningGeneralPremium';
import MonPlanningPremium from './MonPlanningPremium';
import SemainePremium from './SemainePremium';
import MoisPremium from './MoisPremium';

// Interventions Premium
import TableauDeBordInterventionsPremium from './TableauDeBordInterventionsPremium';
import JourneePremium from './JourneePremium';
import CarteGeographiquePremium from './CarteGeographiquePremium';
import ChantiersPremium from './ChantiersPremium';
import VehiculesPremium from './VehiculesPremium';
import EnvoiMassePremium from './EnvoiMassePremium';
import RecurrencePremium from './RecurrencePremium';
import TempsTravaillePremium from './TempsTravaillePremium';
import StatistiquesInterventionsPremium from './StatistiquesInterventionsPremium';
import ActionsCourantesPremium from './ActionsCourantesPremium';

// Facturation Premium
import DevisFacturationPremium from './DevisFacturationPremium';
import FacturesFacturationPremium from './FacturesFacturationPremium';
import FacturesAcomptePremium from './FacturesAcomptePremium';
import AvoirsFacturationPremium from './AvoirsFacturationPremium';
import StatistiquesFacturationPremium from './StatistiquesFacturationPremium';

// Composants Premium Ultra - Lazy loading uniquement pour les moins utilisés
const GamificationSystem = createLazyComponent(
  () => import('./GamificationSystem'),
  { preload: false }
);
const WidgetSystem = createLazyComponent(
  () => import('./WidgetSystem'),
  { preload: false }
);
const PresentationMode = createLazyComponent(
  () => import('./PresentationMode'),
  { preload: false }
);

const OrganipoussV2 = () => {
  const location = useLocation();
  const { theme: currentTheme, currentThemeConfig, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [activeSuiviClientsTab, setActiveSuiviClientsTab] = useState('Clients');
  const [activeDemandesClientTab, setActiveDemandesClientTab] = useState('Tableau de bord');
  const [activePlanningTab, setActivePlanningTab] = useState('Planning général');
  const [activeInterventionsTab, setActiveInterventionsTab] = useState('Tableau de bord');
  const [activeFacturationTab, setActiveFacturationTab] = useState('Devis');
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showPresentationMode, setShowPresentationMode] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showWidgets, setShowWidgets] = useState(false);
  
  // Utilisation des hooks premium
  const {
    animations,
    notifications,
    shortcuts,
    metrics,
    ai,
    presentation,
    dynamicTheme
  } = useOrganipoussV2();
  
  // Effets automatiques premium
  useEffect(() => {
    // Déclencher l'IA sur changement d'onglet
    if (activeTab) {
      ai.getSuggestions(activeTab.toLowerCase());
    }
  }, [activeTab]);
  
  useEffect(() => {
    // Notifications désactivées pour performance
    // Décommenter pour réactiver les notifications de démo
    /*
    const timer = setTimeout(() => {
      notifications.addNotification({
        title: '🚀 Bienvenue dans OrganipoussV2',
        message: 'Découvrez les nouvelles fonctionnalités premium !',
        type: 'success'
      });
    }, 2000);
    
    const timer2 = setTimeout(() => {
      notifications.addNotification({
        title: '💡 Astuce du jour',
        message: 'Utilisez Cmd+K pour ouvrir la palette de commandes',
        type: 'info'
      });
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
    */
  }, []);

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
      numero: 'D202502361',
      dateDevis: '03/02/2025',
      dateEcheance: '27/01/2025',
      client: 'Cibest Chongqing CE',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 384.00,
      totalTTC: 460.80
    },
    {
      numero: 'D202502359',
      dateDevis: '03/02/2025',
      dateEcheance: '27/01/2025',
      client: 'Cibest Chongqing',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 2388.00,
      totalTTC: 2865.60
    },
    {
      numero: 'D202502358',
      dateDevis: '31/01/2025',
      dateEcheance: '02/01/2025',
      client: 'Courtyard',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 234.00,
      totalTTC: 280.80
    },
    {
      numero: 'D202502337',
      dateDevis: '21/01/2025',
      dateEcheance: '07/12/2024',
      client: 'BETC',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 468.00,
      totalTTC: 561.60
    },
    {
      numero: 'D202502301',
      dateDevis: '14/01/2025',
      dateEcheance: '07/12/2024',
      client: 'IRCEC',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 234.00,
      totalTTC: 280.80
    },
    {
      numero: 'D202502300',
      dateDevis: '14/01/2025',
      dateEcheance: '07/12/2024',
      client: 'IRCEC',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 408.00,
      totalTTC: 489.60
    },
    {
      numero: 'D202502299',
      dateDevis: '14/01/2025',
      dateEcheance: '05/04/2025',
      client: 'IRCEC',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 12345.00,
      totalTTC: 14814.00
    },
    {
      numero: 'D202502298',
      dateDevis: '13/01/2025',
      dateEcheance: '07/12/2024',
      client: 'HAVAS MEDIA GROUP',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 384.00,
      totalTTC: 460.80
    },
    {
      numero: 'D202502297',
      dateDevis: '13/01/2025',
      dateEcheance: '07/12/2024',
      client: 'HAVAS MEDIA GROUP',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 564.00,
      totalTTC: 676.80
    },
    {
      numero: 'D202502294',
      dateDevis: '13/01/2025',
      dateEcheance: '07/12/2024',
      client: 'IRCEC',
      vendeur: '—',
      statut: 'En cours',
      totalHT: 546.00,
      totalTTC: 655.20
    }
  ];

  const menuItems = [
    { name: 'Dashboard', icon: SparklesIcon, hasSubmenu: false, gradient: 'from-purple-600 to-pink-600' },
    { name: 'Rappels', icon: BellIcon, hasSubmenu: true, submenu: ['Échéances dépassées'], gradient: 'from-yellow-400 to-orange-500' },
    { name: 'Suivi clients', icon: UsersIcon, hasSubmenu: true, submenu: ['Clients', 'Adresses', 'Équipements', 'Contrats', 'Affaires', 'Contacts', 'Fichiers'], gradient: 'from-blue-400 to-indigo-500' },
    { name: 'Demandes client', icon: DocumentTextIcon, hasSubmenu: true, submenu: ['Tableau de bord', 'Planning', 'Statistiques'], gradient: 'from-purple-400 to-pink-500' },
    { name: 'Planning', icon: CalendarDaysIcon, hasSubmenu: true, submenu: ['Planning général', 'Mon planning', 'Semaine', 'Mois'], gradient: 'from-green-400 to-teal-500' },
    { name: 'Interventions', icon: WrenchScrewdriverIcon, hasSubmenu: true, submenu: ['Tableau de bord', 'Journée', 'Carte géographique', 'Chantiers', 'Véhicules', 'Envoi en masse', 'Récurrence', 'Temps travaillé', 'Statistiques', 'Actions courantes'], gradient: 'from-red-400 to-pink-500' },
    { name: 'Facturation', icon: CurrencyEuroIcon, hasSubmenu: true, submenu: ['Devis', 'Factures', 'Factures d\'acompte', 'Avoirs', 'Statistiques'], gradient: 'from-emerald-400 to-green-500' },
    { name: 'Locations', icon: BuildingOfficeIcon, gradient: 'from-indigo-400 to-purple-500' },
    { name: 'Stocks', icon: ShoppingBagIcon, gradient: 'from-amber-400 to-orange-500' },
    { name: 'Achat', icon: ShoppingBagIcon, gradient: 'from-cyan-400 to-blue-500' },
    { name: 'RH', icon: UserGroupIcon, gradient: 'from-rose-400 to-pink-500' },
    { name: 'Pointages', icon: ClockIcon, gradient: 'from-violet-400 to-purple-500' },
    { name: 'Messagerie', icon: ChatBubbleLeftIcon, gradient: 'from-teal-400 to-cyan-500' }
  ];

  const tabs = ['Devis', 'Factures', 'Interventions', 'Envoi des documents', 'Demandes client', 'Affaires', 'Contrats', 'Produits ou services', 'Pointages'];

  // Factures data
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

  // Rapports non envoyés
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

  // Avis non envoyés
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

  // Demandes client
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

  // Affaires
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
      titreOffre: 'Préférence events - C. Mussard',
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

  // Fonctions utilitaires
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(montant);
  };

  const getStatutBadgeColor = (statut) => {
    switch (statut) {
      case 'Nouveau':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'En cours':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'Terminé':
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const getPrioriteBadgeColor = (priorite) => {
    switch (priorite) {
      case 'Normal':
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      case 'Haut':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'Urgent':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  // Fonction pour les toggles
  const renderToggle = (isOn, setIsOn, label) => (
    <div className="flex items-center justify-between py-2">
      <span className={`text-sm ${themeColors?.textSecondary || 'text-gray-300'}`}>{label}</span>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isOn ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-600/50'
        }`}
        role="switch"
        aria-checked={isOn}
        aria-label={`${isOn ? 'Désactiver' : 'Activer'} ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  // Fonction pour le Super Assistant  
  const renderSuperAssistant = (title, dropdownValue, setDropdownValue, toggle1, setToggle1, toggle2, setToggle2, toggle1Label, toggle2Label) => (
    <div className={`${themeColors?.glass || 'bg-gray-800/50'} rounded-2xl border border-white/10 p-6 backdrop-blur-xl`}>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white font-bold text-lg">😊</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-4">
            <span className={`font-medium ${themeColors?.text || 'text-gray-100'}`}>Super assistant</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
              Fonctionnalité du labo
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${themeColors?.text || 'text-gray-100'}`}>{title}</h3>
              <div className="relative">
                <select
                  value={dropdownValue}
                  onChange={(e) => setDropdownValue(e.target.value)}
                  className={`${themeColors?.glass || 'bg-gray-700/50'} border border-white/20 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${themeColors?.text || 'text-gray-100'}`}
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

  // Fonction pour la pagination
  const renderPagination = (currentPage = 1, totalPages = 10, resultCount = 0) => (
    <div className={`${themeColors?.glass || 'bg-gray-800/50'} px-6 py-4 border-t border-white/10 flex items-center justify-between backdrop-blur-xl`}>
      <div className="flex items-center space-x-2">
        <button className="p-2 text-white/40 hover:text-white/60 transition-colors" aria-label="Page précédente">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-white/40 hover:text-white/60 transition-colors" aria-label="Première page">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        
        <div className="flex space-x-1">
          {[1, 2, 3, '...', totalPages - 1, totalPages].map((page, index) => (
            <button
              key={index}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                page === currentPage
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : page === '...'
                  ? 'text-white/40 cursor-default'
                  : 'text-white/70 hover:bg-white/10'
              }`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button className="p-2 text-white/40 hover:text-white/60 transition-colors" aria-label="Page suivante">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
        <button className="p-2 text-white/40 hover:text-white/60 transition-colors" aria-label="Dernière page">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      {resultCount > 0 && (
        <div className={`text-sm ${themeColors?.textSecondary || 'text-gray-300'}`}>
          {resultCount} résultats
        </div>
      )}
    </div>
  );

  // Fonction pour le footer
  const renderFooter = () => (
    <footer className={`${themeColors?.glass || 'bg-gray-800/50'} border-t border-white/10 py-4 px-6 backdrop-blur-xl`}>
      <div className="flex items-center justify-between">
        <div className={`text-sm ${themeColors?.textSecondary || 'text-gray-300'}`}>
          © 2025 Organilog V2 · 
          <button className="text-purple-400 hover:text-purple-300 mx-1 transition-colors">CGU</button>
          ·
          <button className="text-purple-400 hover:text-purple-300 mx-1 transition-colors">Mentions légales</button>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 text-sm transition-colors"
        >
          <ArrowUpIcon className="w-4 h-4" />
          <span>Retour en haut</span>
        </button>
      </div>
    </footer>
  );

  const getThemeColors = (theme) => {
    switch(theme) {
      case 'dark':
        return {
          // Backgrounds
          bg: 'bg-gray-900',
          bgSecondary: 'bg-gray-800',
          bgTertiary: 'bg-gray-700',
          bgHover: 'hover:bg-gray-700',
          // Text
          text: 'text-gray-100',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-500',
          // Borders
          border: 'border-gray-700',
          borderLight: 'border-gray-600/50',
          // Glass effects
          glass: 'bg-gray-800/50 backdrop-blur-xl',
          glassLight: 'bg-gray-700/30 backdrop-blur-lg',
          // Gradients
          gradient: 'from-gray-800 to-gray-900',
          gradientAccent: 'from-gray-700 via-gray-600 to-gray-700',
          // Cards
          cardGradient: 'from-gray-800/90 via-gray-800/80 to-gray-900/90',
          cardHover: 'hover:from-gray-700/90 hover:to-gray-800/90',
          // Shadows
          shadow: 'shadow-gray-900/50',
          shadowLg: 'shadow-2xl shadow-gray-900/60',
          // Accents
          primary: 'blue-500',
          secondary: 'purple-500',
          success: 'green-500',
          warning: 'yellow-500',
          danger: 'red-500'
        };
      case 'cosmic':
        return {
          // Backgrounds
          bg: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900',
          bgSecondary: 'bg-indigo-800/30',
          bgTertiary: 'bg-purple-800/30',
          bgHover: 'hover:bg-purple-800/40',
          // Text
          text: 'text-purple-100',
          textSecondary: 'text-purple-200',
          textMuted: 'text-purple-300/70',
          // Borders
          border: 'border-purple-600/30',
          borderLight: 'border-purple-500/20',
          // Glass effects
          glass: 'bg-purple-900/20 backdrop-blur-2xl',
          glassLight: 'bg-indigo-800/15 backdrop-blur-xl',
          // Gradients
          gradient: 'from-purple-600 to-indigo-600',
          gradientAccent: 'from-pink-600 via-purple-600 to-indigo-600',
          // Cards
          cardGradient: 'from-purple-800/30 via-indigo-800/25 to-blue-800/30',
          cardHover: 'hover:from-purple-700/40 hover:to-indigo-700/40',
          // Shadows
          shadow: 'shadow-purple-900/50',
          shadowLg: 'shadow-2xl shadow-purple-900/60',
          // Accents
          primary: 'purple-400',
          secondary: 'pink-400',
          success: 'emerald-400',
          warning: 'amber-400',
          danger: 'rose-400'
        };
      case 'midnight':
        return {
          // Backgrounds
          bg: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950',
          bgSecondary: 'bg-slate-900/50',
          bgTertiary: 'bg-blue-900/30',
          bgHover: 'hover:bg-slate-800/50',
          // Text
          text: 'text-slate-100',
          textSecondary: 'text-slate-300',
          textMuted: 'text-slate-400',
          // Borders
          border: 'border-slate-700/50',
          borderLight: 'border-slate-600/30',
          // Glass effects
          glass: 'bg-slate-900/40 backdrop-blur-2xl',
          glassLight: 'bg-slate-800/20 backdrop-blur-xl',
          // Gradients
          gradient: 'from-blue-600 to-cyan-600',
          gradientAccent: 'from-cyan-500 via-blue-500 to-indigo-500',
          // Cards
          cardGradient: 'from-slate-800/50 via-blue-900/40 to-slate-900/50',
          cardHover: 'hover:from-slate-700/60 hover:to-blue-800/50',
          // Shadows
          shadow: 'shadow-slate-950/70',
          shadowLg: 'shadow-2xl shadow-slate-950/80',
          // Accents
          primary: 'cyan-400',
          secondary: 'blue-400',
          success: 'teal-400',
          warning: 'yellow-400',
          danger: 'red-400'
        };
      case 'forest':
        return {
          // Backgrounds
          bg: 'bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950',
          bgSecondary: 'bg-emerald-900/40',
          bgTertiary: 'bg-green-900/30',
          bgHover: 'hover:bg-emerald-800/40',
          // Text
          text: 'text-emerald-100',
          textSecondary: 'text-emerald-200',
          textMuted: 'text-emerald-300/70',
          // Borders
          border: 'border-emerald-700/40',
          borderLight: 'border-emerald-600/25',
          // Glass effects
          glass: 'bg-emerald-900/25 backdrop-blur-2xl',
          glassLight: 'bg-green-800/15 backdrop-blur-xl',
          // Gradients
          gradient: 'from-emerald-600 to-teal-600',
          gradientAccent: 'from-green-500 via-emerald-500 to-teal-500',
          // Cards
          cardGradient: 'from-emerald-900/35 via-green-900/30 to-teal-900/35',
          cardHover: 'hover:from-emerald-800/45 hover:to-teal-800/45',
          // Shadows
          shadow: 'shadow-emerald-950/60',
          shadowLg: 'shadow-2xl shadow-emerald-950/70',
          // Accents
          primary: 'emerald-400',
          secondary: 'teal-400',
          success: 'green-400',
          warning: 'amber-400',
          danger: 'rose-400'
        };
      case 'sunset':
        return {
          // Backgrounds
          bg: 'bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50',
          bgSecondary: 'bg-white/90',
          bgTertiary: 'bg-orange-50/50',
          bgHover: 'hover:bg-orange-100/50',
          // Text
          text: 'text-gray-900',
          textSecondary: 'text-gray-700',
          textMuted: 'text-gray-500',
          // Borders
          border: 'border-orange-200/50',
          borderLight: 'border-pink-200/30',
          // Glass effects
          glass: 'bg-white/60 backdrop-blur-xl',
          glassLight: 'bg-white/40 backdrop-blur-lg',
          // Gradients
          gradient: 'from-orange-500 to-pink-500',
          gradientAccent: 'from-yellow-400 via-orange-400 to-pink-400',
          // Cards
          cardGradient: 'from-white/80 via-orange-50/70 to-pink-50/80',
          cardHover: 'hover:from-white/90 hover:to-orange-100/80',
          // Shadows
          shadow: 'shadow-orange-200/50',
          shadowLg: 'shadow-2xl shadow-orange-300/60',
          // Accents
          primary: 'orange-500',
          secondary: 'pink-500',
          success: 'green-500',
          warning: 'yellow-500',
          danger: 'red-500'
        };
      case 'ocean':
        return {
          // Backgrounds
          bg: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
          bgSecondary: 'bg-white/85',
          bgTertiary: 'bg-blue-50/40',
          bgHover: 'hover:bg-cyan-100/40',
          // Text
          text: 'text-gray-900',
          textSecondary: 'text-gray-700',
          textMuted: 'text-gray-500',
          // Borders
          border: 'border-blue-200/50',
          borderLight: 'border-cyan-200/30',
          // Glass effects
          glass: 'bg-white/65 backdrop-blur-xl',
          glassLight: 'bg-white/45 backdrop-blur-lg',
          // Gradients
          gradient: 'from-blue-500 to-cyan-500',
          gradientAccent: 'from-teal-400 via-cyan-400 to-blue-400',
          // Cards
          cardGradient: 'from-white/75 via-cyan-50/60 to-blue-50/75',
          cardHover: 'hover:from-white/85 hover:to-cyan-100/75',
          // Shadows
          shadow: 'shadow-blue-200/50',
          shadowLg: 'shadow-2xl shadow-blue-300/60',
          // Accents
          primary: 'blue-500',
          secondary: 'cyan-500',
          success: 'teal-500',
          warning: 'amber-500',
          danger: 'rose-500'
        };
      default: // light theme
        return {
          // Backgrounds
          bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
          bgSecondary: 'bg-white',
          bgTertiary: 'bg-gray-50',
          bgHover: 'hover:bg-gray-100',
          // Text
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-400',
          // Borders
          border: 'border-gray-200',
          borderLight: 'border-gray-100',
          // Glass effects
          glass: 'bg-white/70 backdrop-blur-xl',
          glassLight: 'bg-white/50 backdrop-blur-lg',
          // Gradients
          gradient: 'from-blue-500 to-purple-600',
          gradientAccent: 'from-indigo-400 via-purple-400 to-pink-400',
          // Cards
          cardGradient: 'from-white/90 via-gray-50/80 to-white/90',
          cardHover: 'hover:from-white hover:to-gray-50',
          // Shadows
          shadow: 'shadow-gray-200/50',
          shadowLg: 'shadow-2xl shadow-gray-300/60',
          // Accents
          primary: 'blue-600',
          secondary: 'purple-600',
          success: 'green-600',
          warning: 'yellow-600',
          danger: 'red-600'
        };
    }
  };

  const themeColors = getThemeColors(currentTheme);

  const renderSidebar = () => (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className={`${themeColors.glass} ${themeColors.border} border-r transition-all duration-500 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } flex flex-col h-full relative overflow-hidden`}
    >
      {/* Effet de particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${
                currentTheme === 'cosmic' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(59, 130, 246, 0.1)'
              } 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Header avec logo futuriste */}
      <div className="p-4 border-b border-white/10 relative z-10">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-3"
            >
              <motion.div 
                className="relative w-12 h-12"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-lg opacity-60" />
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className={`font-bold text-lg ${themeColors.text}`}>Organilog</h2>
                <p className={`text-xs ${themeColors.textSecondary} flex items-center gap-1`}>
                  <RocketLaunchIcon className="w-3 h-3" />
                  Version 2.0
                </p>
              </div>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-2 rounded-lg ${themeColors.glass} hover:bg-white/20 transition-all`}
          >
            <Bars3Icon className={`w-5 h-5 ${themeColors.text}`} />
          </motion.button>
        </div>
      </div>

      {/* Navigation avec effets glassmorphism */}
      <nav className="flex-1 py-4 overflow-y-auto relative z-10">
        <AnimatePresence>
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="mb-2 px-3"
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                className={`relative overflow-hidden rounded-xl cursor-pointer ${
                  activeMenuItem === item.name 
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                    : `${themeColors.glass} hover:bg-white/10`
                } transition-all duration-300`}
                onClick={() => {
                  // Clic sur menu principal
                  if (item.hasSubmenu) {
                    setActiveMenuItem(activeMenuItem === item.name ? '' : item.name);
                    // Ne pas définir de tab par défaut pour Rappels car il a ses propres onglets
                    // if (item.name === 'Rappels' && activeMenuItem !== item.name) {
                    //   setActiveTab('Interventions'); // Tab par défaut pour Rappels
                    // }
                  } else {
                    setActiveMenuItem(item.name);
                    setActiveTab(item.name);
                  }
                }}
              >
                {/* Effet de brillance au survol */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <div className="relative flex items-center p-3">
                  <div className={`p-2 rounded-lg ${
                    activeMenuItem === item.name 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br ' + item.gradient + ' bg-opacity-10'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      activeMenuItem === item.name ? 'text-white' : themeColors.text
                    }`} />
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <span className={`ml-3 flex-1 font-medium ${
                        activeMenuItem === item.name ? 'text-white' : themeColors.text
                      }`}>
                        {item.name}
                      </span>
                      {item.hasSubmenu && (
                        <motion.div
                          animate={{ rotate: activeMenuItem === item.name ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDownIcon className={`w-4 h-4 ${
                            activeMenuItem === item.name ? 'text-white' : themeColors.textSecondary
                          }`} />
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>

              {/* Sous-menu avec animation */}
              <AnimatePresence>
                {activeMenuItem === item.name && item.submenu && !sidebarCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 ml-4 overflow-hidden"
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <motion.div
                        key={subIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: subIndex * 0.05 }}
                        whileHover={{ x: 5 }}
                        className={`py-2 px-4 rounded-lg cursor-pointer ${themeColors.text} hover:bg-white/10 transition-all`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Clic sur sous-menu
                          if (item.name === 'Suivi clients') {
                            setActiveSuiviClientsTab(subItem);
                            setActiveTab('Suivi clients');
                          } else if (item.name === 'Demandes client') {
                            setActiveDemandesClientTab(subItem);
                            setActiveTab('Demandes client');
                          } else if (item.name === 'Planning') {
                            setActivePlanningTab(subItem);
                            setActiveTab('Planning');
                          } else if (item.name === 'Interventions') {
                            setActiveInterventionsTab(subItem);
                            setActiveTab('Interventions');
                          } else if (item.name === 'Facturation') {
                            setActiveFacturationTab(subItem);
                            setActiveTab('Facturation');
                          }
                        }}
                      >
                        <span className="text-sm">{subItem}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      {/* Footer avec bouton d'action flottant */}
      <div className="p-4 border-t border-white/10 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-3 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all"
        >
          <PlusIcon className="w-6 h-6 text-white" />
          {!sidebarCollapsed && <span className="ml-2 text-white font-medium">Nouvelle action</span>}
        </motion.button>
      </div>
    </motion.div>
  );

  const renderHeader = () => (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`${themeColors.glass} ${themeColors.border} border-b px-6 py-4`}
    >
      <div className="flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-40" />
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-3">
              <CubeTransparentIcon className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <div>
            <h1 className={`text-2xl font-bold ${themeColors.text} flex items-center gap-2`}>
              POUSSE V2
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                BETA
              </span>
            </h1>
            <p className={`text-sm ${themeColors.textSecondary} flex items-center gap-2`}>
              <BeakerIcon className="w-4 h-4" />
              Interface expérimentale nouvelle génération
            </p>
          </div>
        </div>

        {/* Barre de recherche futuriste */}
        <motion.div 
          className="flex-1 max-w-xl mx-8"
          animate={{ scale: searchFocused ? 1.02 : 1 }}
        >
          <div className={`relative ${searchFocused ? 'ring-2 ring-purple-500' : ''} rounded-2xl overflow-hidden`}>
            <div className={`${themeColors.glass} ${themeColors.border} border rounded-2xl`}>
              <div className="flex items-center px-4 py-3">
                <MagnifyingGlassIcon className={`w-5 h-5 ${themeColors.textSecondary} mr-3`} />
                <input
                  type="text"
                  placeholder="Recherche intelligente..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`flex-1 bg-transparent outline-none ${themeColors.text} placeholder-gray-400`}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="ml-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-lg cursor-pointer"
                >
                  <CommandLineIcon className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute top-full left-0 right-0 mt-2 ${themeColors.glass} ${themeColors.border} border rounded-xl p-4 shadow-2xl z-50`}
              >
                <p className={`text-sm ${themeColors.textSecondary}`}>
                  Suggestions intelligentes apparaîtront ici...
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Actions et thème */}
        <div className="flex items-center space-x-3">
          {/* Sélecteur de thème */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-white/10 rounded-xl p-1"
          >
            {[
              { icon: SunIcon, value: 'light', label: 'Clair' },
              { icon: MoonIcon, value: 'dark', label: 'Sombre' },
              { icon: SparklesIcon, value: 'cosmic', label: 'Cosmique' }
            ].map(({ icon: Icon, value, label }) => (
              <motion.button
                key={value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(value)}
                className={`p-2 rounded-lg transition-all ${
                  currentTheme === value 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : `${themeColors.text} hover:bg-white/20`
                }`}
                title={label}
              >
                <Icon className="w-5 h-5" />
              </motion.button>
            ))}
          </motion.div>

          {/* Boutons Premium Ultra */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPresentationMode(true)}
              className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              title="Mode Présentation"
            >
              <ComputerDesktopIcon className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowGamification(true)}
              className="p-2 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
              title="Gamification"
            >
              <TrophyIcon className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowWidgets(true)}
              className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              title="Widgets"
            >
              <Squares2X2Icon className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Boutons d'action */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-xl ${themeColors.glass} hover:bg-white/20 transition-all`}
            onClick={() => {
              notifications.addNotification({
                title: '🔔 Nouvelle notification',
                message: 'Vous avez 3 nouvelles tâches à traiter',
                type: 'info'
              });
            }}
          >
            <BellIcon className={`w-5 h-5 ${themeColors.text}`} />
            {notifications.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.unreadCount}
              </span>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-xl ${themeColors.glass} hover:bg-white/20 transition-all`}
          >
            <QuestionMarkCircleIcon className={`w-5 h-5 ${themeColors.text}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-xl ${themeColors.glass} hover:bg-white/20 transition-all`}
          >
            <CogIcon className={`w-5 h-5 ${themeColors.text}`} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );

  const renderTabs = () => (
    <div className={`${themeColors.glass} ${themeColors.border} border-b`}>
      <div className="flex space-x-2 px-6 py-3 overflow-x-auto">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Clic sur onglet
              setActiveTab(tab);
            }}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : `${themeColors.text} hover:bg-white/10`
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderModernTable = (data, columns, title) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${themeColors.glass} rounded-2xl overflow-hidden shadow-2xl`}
    >
      {title && (
        <div className="p-6 border-b border-white/10">
          <h2 className={`text-xl font-bold ${themeColors.text}`}>{title}</h2>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${themeColors.bgSecondary} border-b border-white/10`}>
              {columns.map((col, index) => (
                <th key={index} className={`px-6 py-4 text-left text-sm font-semibold ${themeColors.text}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
                className={`border-b border-white/5 transition-all cursor-pointer`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 ${themeColors.text}`}>
                    {col.render ? col.render(row) : row[col.field]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderDevisTable = () => {
    const columns = [
      { label: 'Numéro', field: 'numero' },
      { label: 'Date', field: 'dateDevis' },
      { label: 'Client', field: 'client', render: (row) => (
        <span className="font-medium text-purple-600 hover:text-purple-700 cursor-pointer">
          {row.client}
        </span>
      )},
      { label: 'Statut', field: 'statut', render: (row) => (
        <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full">
          {row.statut}
        </span>
      )},
      { label: 'Total TTC', field: 'totalTTC', render: (row) => (
        <span className="font-bold">
          {row.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </span>
      )},
      { label: 'Actions', field: 'actions', render: () => (
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-all"
          >
            <EyeIcon className="w-4 h-4 text-purple-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-pink-500/20 rounded-lg hover:bg-pink-500/30 transition-all"
          >
            <PencilIcon className="w-4 h-4 text-pink-600" />
          </motion.button>
        </div>
      )}
    ];

    return renderModernTable(devis, columns, 'Devis en attente');
  };

  const renderMainContent = () => {
    // renderMainContent - onglet actif
    // Cas spécial pour Rappels qui utilise activeMenuItem et activeTab
    if (activeMenuItem === 'Rappels') {
      // Utilisation du nouveau module RappelsUltraPremium qui gère tous les onglets
      return <RappelsUltraPremium />;
    }
    
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardPremium />;
      case 'Devis':
        return <DevisPremium />;
      case 'Factures':
        return <FacturesPremium />;
      case 'Affaires':
        return <AffairesPremium />;
      case 'Demandes client':
        // Rendu de Demandes client avec composants Premium
        switch (activeDemandesClientTab) {
          case 'Tableau de bord':
            return <TableauDeBordDemandesClientPremium />;
          case 'Planning':
            return <PlanningDemandesClientPremium />;
          case 'Statistiques':
            return <StatistiquesDemandesClientPremium />;
          default:
            return renderModernTable(demandesClient, [
              { label: 'N°', field: 'numero' },
              { label: 'Statut', field: 'statut', render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutBadgeColor(row.statut)}`}>
                  {row.statut}
                </span>
              )},
              { label: 'Priorité', field: 'priorite', render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioriteBadgeColor(row.priorite)}`}>
                  {row.priorite}
                </span>
              )},
              { label: 'Titre', field: 'titre' },
              { label: 'Client', field: 'client' },
              { label: 'Date de début', field: 'dateDebut' }
            ], 'Tickets non clôturés');
        }
      case 'Envoi des documents':
        return (
          <div className="space-y-6">
            {renderModernTable(rapportsNonEnvoyes, [
              { label: 'N°', field: 'numero' },
              { label: 'Titre', field: 'titre' },
              { label: 'Client', field: 'client' },
              { label: 'Début', field: 'debut' },
              { label: 'Durée', field: 'duree' }
            ], 'Rapports non envoyés')}
            
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
            
            {renderModernTable(avisNonEnvoyes, [
              { label: 'N°', field: 'numero' },
              { label: 'Titre', field: 'titre' },
              { label: 'Client', field: 'client' },
              { label: 'Début', field: 'debut' },
              { label: 'Durée', field: 'duree' }
            ], 'Avis de passage non envoyés')}
            
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
      case 'Suivi clients':
        // Rendu de Suivi clients avec composants Premium
        switch (activeSuiviClientsTab) {
          case 'Clients':
            return <ClientsPremium />;
          case 'Adresses':
            return <AdressesPremium />;
          case 'Équipements':
            return <EquipementsPremium />;
          case 'Contrats':
            return <ContratsPremium />;
          case 'Affaires':
            return <AffairesPremium />;
          case 'Contacts':
            return <ContactsPremium />;
          case 'Fichiers':
            return <FichiersPremium />;
          default:
            return (
              <div className={`${themeColors.glass} rounded-2xl p-8 text-center`}>
                <h3 className={`text-xl font-bold ${themeColors.text} mb-2`}>{activeSuiviClientsTab}</h3>
                <p className={themeColors.textSecondary}>Module en cours de développement</p>
              </div>
            );
        }
      case 'Planning':
        // Rendu de Planning avec composants Premium
        switch (activePlanningTab) {
          case 'Planning général':
            return <PlanningGeneralPremium />;
          case 'Mon planning':
            return <MonPlanningPremium />;
          case 'Semaine':
            return <SemainePremium />;
          case 'Mois':
            return <MoisPremium />;
          default:
            return (
              <div className={`${themeColors.glass} rounded-2xl p-8 text-center`}>
                <h3 className={`text-xl font-bold ${themeColors.text} mb-2`}>{activePlanningTab}</h3>
                <p className={themeColors.textSecondary}>Module en cours de développement</p>
              </div>
            );
        }
      case 'Contrats':
        return <ContratsEcheancesDepassees />;
      case 'Produits ou services':
        return <ProduitsServicesEcheancesDepassees />;
      case 'Pointages':
        return <PointagesEcheancesDepassees />;
      case 'Facturation':
        // Rendu de Facturation avec composants Premium
        switch (activeFacturationTab) {
          case 'Devis':
            return <DevisFacturationPremium />;
          case 'Factures':
            return <FacturesFacturationPremium />;
          case "Factures d'acompte":
            return <FacturesAcomptePremium />;
          case 'Avoirs':
            return <AvoirsFacturationPremium />;
          case 'Statistiques':
            return <StatistiquesFacturationPremium />;
          default:
            return renderDevisTable();
        }
      case 'Interventions':
        // Rendu de Interventions avec composants Premium
        switch (activeInterventionsTab) {
          case 'Tableau de bord':
            return <TableauDeBordInterventionsPremium />;
          case 'Journée':
            return <JourneePremium />;
          case 'Carte géographique':
            return <CarteGeographiquePremium />;
          case 'Chantiers':
            return <ChantiersPremium />;
          case 'Véhicules':
            return <VehiculesPremium />;
          case 'Envoi en masse':
            return <EnvoiMassePremium />;
          case 'Récurrence':
            return <RecurrencePremium />;
          case 'Temps travaillé':
            return <TempsTravaillePremium />;
          case 'Statistiques':
            return <StatistiquesInterventionsPremium />;
          case 'Actions courantes':
            return <ActionsCourantesPremium />;
          default:
            return (
              <div className={`${themeColors.glass} rounded-2xl p-8 text-center`}>
                <RocketLaunchIcon className={`w-16 h-16 mx-auto mb-4 ${themeColors.textSecondary}`} />
                <h3 className={`text-xl font-bold ${themeColors.text} mb-2`}>{activeInterventionsTab}</h3>
                <p className={themeColors.textSecondary}>Module en cours de développement</p>
              </div>
            );
        }
      default:
        return renderDevisTable();
    }
  };

  return (
    <div className={`flex h-screen ${themeColors.bg} transition-all duration-500`}>
      {/* Effet de fond animé */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {renderSidebar()}
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {renderHeader()}
        
        {/* Headers conditionnels pour chaque section */}
        {activeMenuItem === 'Rappels' && (
          <div className={`${themeColors.glass} p-4 border-b border-white/10`}>
            <h1 className={`text-xl font-semibold ${themeColors.text}`}>
              Rappels : Échéances dépassées
            </h1>
          </div>
        )}
        
        {activeMenuItem === 'Demandes client' && (
          <div className={`${themeColors.glass} p-4 border-b border-white/10`}>
            <h1 className={`text-xl font-semibold ${themeColors.text}`}>
              Demandes client : {activeDemandesClientTab}
            </h1>
          </div>
        )}
        
        {activeMenuItem === 'Planning' && (
          <div className={`${themeColors.glass} p-4 border-b border-white/10`}>
            <h1 className={`text-xl font-semibold ${themeColors.text}`}>
              Planning : {activePlanningTab}
            </h1>
          </div>
        )}

        {activeMenuItem === 'Interventions' && (
          <div className={`${themeColors.glass} p-4 border-b border-white/10`}>
            <h1 className={`text-xl font-semibold ${themeColors.text}`}>
              Interventions : {activeInterventionsTab}
            </h1>
          </div>
        )}
        
        {activeMenuItem === 'Facturation' && (
          <div className={`${themeColors.glass} p-4 border-b border-white/10`}>
            <h1 className={`text-xl font-semibold ${themeColors.text}`}>
              Facturation : {activeFacturationTab}
            </h1>
          </div>
        )}
        
        {/* Désactivé pour Rappels car RappelsUltraPremium a ses propres onglets */}
        {/* activeMenuItem === 'Rappels' && renderTabs() */}
        
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingFallback message="Chargement du module..." />}>
              {renderMainContent()}
            </Suspense>
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de récurrence */}
      <RecurrenceModal 
        isOpen={isRecurrenceModalOpen} 
        onClose={() => setIsRecurrenceModalOpen(false)} 
      />
      
      {/* Composants Premium */}
      {/* Palette de commandes (Cmd+K) */}
      <CommandPalette
        isOpen={shortcuts.isCommandPaletteOpen}
        onClose={() => shortcuts.setCommandPaletteOpen(false)}
        onCommand={(cmd) => {
          // Commande exécutée
          // Gérer les commandes ici
          if (cmd === 'new-devis') setActiveTab('Devis');
          if (cmd === 'search-client') setActiveTab('Suivi clients');
          if (cmd === 'quick-invoice') setActiveTab('Factures');
          if (cmd === 'view-stats') setActiveTab('Dashboard');
        }}
      />
      
      {/* Assistant IA */}
      {activeMenuItem === 'Dashboard' && (
        <AIAssistantWidget
          suggestions={ai.suggestions}
          isThinking={ai.isThinking}
        />
      )}
      
      {/* Notifications flottantes */}
      <div className="fixed top-20 right-6 z-40 space-y-2">
        <AnimatePresence>
          {notifications.notifications.slice(0, 3).map((notif) => (
            <PremiumNotification
              key={notif.id}
              notification={notif}
              onClose={() => notifications.markAsRead(notif.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Indicateur de scroll */}
      {animations.scrollProgress > 0 && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 z-50"
          style={{ width: `${animations.scrollProgress}%` }}
        />
      )}
      
      {/* Effet de curseur personnalisé - Désactivé pour performance */}
      {/* 
      <motion.div
        className="fixed w-6 h-6 border-2 border-purple-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: animations.mousePosition.x - 12,
          y: animations.mousePosition.y - 12
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
      */}
      
      {/* Mode Présentation Premium */}
      <AnimatePresence>
        {showPresentationMode && (
          <Suspense fallback={<LoadingFallback />}>
            <PresentationMode
              onExit={() => setShowPresentationMode(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>
      
      {/* Système de Gamification */}
      <AnimatePresence>
        {showGamification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center"
            onClick={() => setShowGamification(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 
                         max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Suspense fallback={<LoadingFallback />}>
                <GamificationSystem
                  userStats={{
                    level: 8,
                    xp: 750,
                    streak: 12,
                    bestStreak: 28,
                    claimedDays: [1, 2, 3]
                  }}
                  onAction={(action, data) => {
                    // Gamification action
                    // Ajouter XP et notifications
                    if (action === 'claim_reward') {
                      notifications.addNotification({
                        title: '🎁 Récompense réclamée !',
                        message: `Vous avez gagné ${data.xp} XP !`,
                        type: 'success'
                      });
                    }
                  }}
                />
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Système de Widgets */}
      <AnimatePresence>
        {showWidgets && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center"
            onClick={() => setShowWidgets(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 
                         max-w-7xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Suspense fallback={<LoadingFallback />}>
                <WidgetSystem />
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganipoussV2;