import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { 
  PlusIcon, 
  ViewColumnsIcon, 
  Squares2X2Icon,
  ListBulletIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Organipousse from '../../dashboard/components/Organipousse';

// Version simplifiée sans React Query pour commencer
const Entretien = () => {
  // État local
  const [activeTab, setActiveTab] = useState('entretiens'); // 'entretiens', 'organipousse'
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table'
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    statut: 'all',
    typeClient: 'all',
    typeContrat: 'all',
    priorite: 'all'
  });

  // Transformation de vos clients existants en entretiens modernes
  const clientsOriginaux = [
    { client: 'ADAGIO OPERA', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'ADVANCY', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'AE75 SAS', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'AQUILAE GESTION PRIVÉE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'ASSOCIATION DENTAIRE FRANCAISE - ADF', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'AVEROUS', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Aareal Bank', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Accornero', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Adagio Boulogne', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Adagio Buttes chaumont', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Adikteev', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Adonys Rambuteau', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Adonys Verrerie', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Adveris', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Aecom', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Allianz - My flex office', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Annette K / Javel', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Arolla', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Assouline Séverine', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'B-CE-EURO ARIANE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'BERENBERG BANK', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'BEWIZ', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'BM&A Partners', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Banque Palatine', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Banque Palatine Val de Fontenay', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Banque de France', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Bour Maud', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Bruno Nicolas', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'CLAREO', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Cabinet GILLIER', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Caravane', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Care Promotion', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Carole Neret', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'ComReal', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Copropriété Crussol', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Coupert', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Courtyard', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Cunanan Lara', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'DCS Easyware', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'DELRIEU Agnès', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'DELSOL Avocats', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'DIACONESSES CROIX ST SIMON', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Dadu', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'David Benichou', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Deborah Yacharel', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Delaval Anne', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Delbourg', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Delphine Eskenazi', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Domaine Clarence Dillon', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Doudeauville', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Eiffage Nanterre', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Eloise Fontaine', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Europa Group', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Exalt', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'FRENCH THEORY', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Fabien Marcantetti', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Flexim SAS', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Florie Garnier', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'François Levoir', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'GMBA & CO', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Gustave Collection Palais Garnier', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Gustave Collection Vendôme', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Gustave collection Opéra / rue de la paix', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'HAVEA', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'HERMES', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'HIG Capital', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'HONORE GAMING/SPORTYTOTE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'HOTEL DE L\'UNIVERSITE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'HTL', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'HUOT LOURADOUR Isabelle', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Haggarty / VILLA REANT', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Ami', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Artus', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Hôtel Doisy', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Florida', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Kyriad / ADIX', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Le swann', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Oratio', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel Orphée / Devillas', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Hôtel de Buci', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'INNOVEN', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'IRCEC', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Charonne', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Haussmann', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Saint Honoré', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Saintonge', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Seine', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabel Marant Victor Hugo', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Isabelle Draux Bobin', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'JOKO/WYRL', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'JPB Audioviuel', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Jean-Loup Wirotius', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Josyane Durand', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Juanita Sonigo', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Karim Sadli', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'L\'Arche à Paris', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'LBP AM', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'LOSAM', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'La Fabrique', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Le Prado', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Ledger-Bompard', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Legars', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Lelezec Céline', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Lightspeed', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Linesight', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Luca Faloni', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Lydia Solutions', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MATERA', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'MC2I', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MG Motor', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MITSUI', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MUE', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'MY OFFICE MATE', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'MYREPORT/ REPORT ONE', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Magellan', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Margot Dromer / Jamais Contente', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Marie Curdy', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Marjolaine Besnard', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Maxime Delauney - Nolita', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Mazmez', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Morning Laffitte', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Morning Sahar', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'NATHALIE JALABERT', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'NEGIAR - DUFETELLE', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'NHOOD Services France', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Nathalie Hazan', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Nathalie Peyron', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Nathalie SMADJA', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Navan - My flex office', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'New Flag', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Nickel / FINANCIERE DES PAIEMENTS ELECTRONIQUES', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Nicolas Cottereau', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'No Place Like Work', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Nolita', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Notaires 1768', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'OH BIBI', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'OTCFLOW', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'PECASSOU', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'PRETTY SIMPLE', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'PUBLICIS MEDIA', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'PUK - Valentino', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Pierre Sequier', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'RASMUSSEN', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Renaud Doppelt', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Roquette Frères', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Rubis énergie', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'SAS NATION / CITEO', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SCI Doisy', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SEPHORA', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'SHARP VISION', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'SIA PARTNERS Berri', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SIA PARTNERS Sentier', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SMART TRADE TECHNOLOGIES', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'SOC grande loge de France', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'SPORTS SOLUTIONS MAKERS', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Sauvage Aliénor', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Scannell Management France', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Schneider', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Scibids / DoubleVerify', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Shein', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Singular', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Siparex', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Sophie KRICK', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Spotify', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Stanislas Huin', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'Swile', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Systra', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'TEYSSEDOU Céline', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'THE BUREAU 4septembre', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'TORAY CFE', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Terrass hôtel', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Tevah Systemes', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'The Bureau NDV', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'The bureau - Albert 1er', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Tommasi', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'UMS - Autonomia', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Unique Héritage Média', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'UpsideCS', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'VFJ', typeClient: 'Professionnel', typeContrat: 'Abonnement' },
    { client: 'Veron - Vesper', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Vinci énergies', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'Véronique GROSMAN', typeClient: 'Particulier', typeContrat: 'Entretien' },
    { client: 'WE FIIT', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'WEWARD', typeClient: 'Professionnel', typeContrat: 'Entretien' },
    { client: 'WINAMAX', typeClient: 'Professionnel', typeContrat: 'Entretien' }
  ];

  // Génération de statuts variés pour rendre les données plus réalistes
  const statuts = ['planifie', 'en_cours', 'termine', 'annule'];
  const priorites = ['basse', 'normale', 'haute', 'urgente'];
  const techniensNoms = ['Jean Dupont', 'Marie Martin', 'Paul Durand', 'Sophie Bernard', 'Luc Moreau'];

  // Transformation des clients en entretiens complets
  const mockEntretiens = clientsOriginaux.map((originalClient, index) => {
    const statut = statuts[Math.floor(Math.random() * statuts.length)];
    const priorite = priorites[Math.floor(Math.random() * priorites.length)];
    const baseDate = Date.now() + (Math.random() - 0.5) * 30 * 24 * 60 * 60 * 1000; // ±15 jours
    const dureeEstimee = 60 + Math.floor(Math.random() * 180); // 1-4h
    const montantBase = originalClient.typeClient === 'Professionnel' ? 200 + Math.random() * 500 : 100 + Math.random() * 200;
    
    // Progression basée sur le statut
    let progression = 0;
    switch (statut) {
      case 'planifie': progression = 0; break;
      case 'en_cours': progression = 20 + Math.floor(Math.random() * 60); break;
      case 'termine': progression = 100; break;
      case 'annule': progression = Math.floor(Math.random() * 30); break;
    }

    // Nombre de techniciens aléatoire
    const nbTechniciens = 1 + Math.floor(Math.random() * 3);
    const techniciens = [];
    for (let i = 0; i < nbTechniciens; i++) {
      const technicien = techniensNoms[Math.floor(Math.random() * techniensNoms.length)];
      if (!techniciens.find(t => t.nom === technicien)) {
        techniciens.push({ nom: technicien });
      }
    }

    return {
      _id: `${index + 1}`,
      numeroEntretien: `ENT-2025${String(Math.floor(index / 100) + 1).padStart(2, '0')}-${String((index % 100) + 1).padStart(4, '0')}`,
      client: { 
        nom: originalClient.client, 
        typeClient: originalClient.typeClient 
      },
      typeContrat: originalClient.typeContrat,
      statut: statut,
      priorite: priorite,
      planification: {
        dateDebut: new Date(baseDate).toISOString(),
        dateFin: new Date(baseDate + dureeEstimee * 60 * 1000).toISOString()
      },
      dureeEstimee: dureeEstimee,
      progression: progression,
      montantTotal: Math.round(montantBase * 100) / 100,
      techniciens: techniciens,
      estEnRetard: statut !== 'termine' && statut !== 'annule' && baseDate < Date.now() - 24 * 60 * 60 * 1000
    };
  });

  const mockStats = {
    total: mockEntretiens.length,
    planifies: mockEntretiens.filter(e => e.statut === 'planifie').length,
    enCours: mockEntretiens.filter(e => e.statut === 'en_cours').length,
    enRetard: 0,
    chiffreAffaireMois: mockEntretiens.reduce((acc, e) => acc + (e.montantTotal || 0), 0)
  };

  // Fonctions de gestion
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersReset = () => {
    setFilters({
      search: '',
      statut: 'all',
      typeClient: 'all',
      typeContrat: 'all',
      priorite: 'all'
    });
  };

  const handleStartEntretien = (id) => {
    alert(`Démarrage de l'entretien ${id}`);
  };

  const handleCompleteEntretien = (id) => {
    const compteRendu = prompt('Compte-rendu de fin d\'intervention (optionnel):');
    alert(`Entretien ${id} terminé. Compte-rendu: ${compteRendu || 'Aucun'}`);
  };

  const handleDeleteEntretien = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir archiver cet entretien ?')) {
      alert(`Entretien ${id} archivé`);
    }
  };

  // Filtrer les entretiens
  const filteredEntretiens = useMemo(() => {
    return mockEntretiens.filter(entretien => {
      if (filters.search && !entretien.client.nom.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.statut !== 'all' && entretien.statut !== filters.statut) {
        return false;
      }
      if (filters.typeClient !== 'all' && entretien.client.typeClient !== filters.typeClient) {
        return false;
      }
      if (filters.typeContrat !== 'all' && entretien.typeContrat !== filters.typeContrat) {
        return false;
      }
      if (filters.priorite !== 'all' && entretien.priorite !== filters.priorite) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Calcul des métriques
  const metrics = [
    {
      title: 'Total entretiens',
      value: mockStats.total,
      icon: ListBulletIcon,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Planifiés',
      value: mockStats.planifies,
      icon: CalendarDaysIcon,
      color: 'indigo',
      change: '+5%'
    },
    {
      title: 'En cours',
      value: mockStats.enCours,
      icon: ArrowPathIcon,
      color: 'yellow',
      change: '+8%'
    },
    {
      title: 'En retard',
      value: mockStats.enRetard,
      icon: ExclamationTriangleIcon,
      color: 'red',
      change: '-3%'
    },
    {
      title: 'CA ce mois',
      value: `${mockStats.chiffreAffaireMois.toLocaleString()} €`,
      icon: ChartBarIcon,
      color: 'green',
      change: '+15%'
    }
  ];

  const renderMetricCard = (metric, index) => (
    <motion.div
      key={metric.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
          <p className={`text-sm mt-2 ${
            metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {metric.change} vs mois dernier
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
          <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  const getStatusColor = (statut) => {
    const colors = {
      planifie: 'bg-blue-100 text-blue-800 border-blue-200',
      en_cours: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      termine: 'bg-green-100 text-green-800 border-green-200',
      annule: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priorite) => {
    const colors = {
      basse: 'bg-gray-500',
      normale: 'bg-blue-500',
      haute: 'bg-orange-500',
      urgente: 'bg-red-500'
    };
    return colors[priorite] || 'bg-gray-500';
  };

  const renderEntretienCard = (entretien) => (
    <motion.div
      key={entretien._id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:border-blue-300"
    >
      {/* Header avec statut et priorité */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(entretien.statut)}`}>
            {entretien.statut.replace('_', ' ')}
          </span>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(entretien.priorite)}`} />
            <span className="text-xs text-gray-500 capitalize">{entretien.priorite}</span>
          </div>
        </div>
      </div>

      {/* Numéro d'entretien */}
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-600">
          {entretien.numeroEntretien}
        </span>
      </div>

      {/* Client */}
      <div className="flex items-center space-x-2 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 truncate">
            {entretien.client.nom}
          </h3>
          <span className="text-xs text-gray-500">
            {entretien.client.typeClient}
          </span>
        </div>
      </div>

      {/* Type de contrat */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
          {entretien.typeContrat}
        </span>
        
        {entretien.montantTotal && (
          <span className="text-sm font-semibold text-green-600">
            {entretien.montantTotal.toFixed(2)} €
          </span>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>
            {new Date(entretien.planification.dateDebut).toLocaleString('fr-FR')}
          </span>
        </div>
      </div>

      {/* Techniciens assignés */}
      {entretien.techniciens && entretien.techniciens.length > 0 && (
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex -space-x-1">
            {entretien.techniciens.slice(0, 3).map((tech, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white"
                title={tech.nom}
              >
                {tech.nom.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Progression</span>
          <span>{entretien.progression}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              entretien.progression === 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${entretien.progression}%` }}
          />
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
        {entretien.statut === 'planifie' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleStartEntretien(entretien._id);
            }}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Démarrer
          </motion.button>
        )}

        {entretien.statut === 'en_cours' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleCompleteEntretien(entretien._id);
            }}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Terminer
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            alert(`Modifier l'entretien ${entretien._id}`);
          }}
          className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Modifier
        </motion.button>
      </div>
    </motion.div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={filters.search}
            onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filters.statut}
          onChange={(e) => handleFiltersChange({ ...filters, statut: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="planifie">Planifié</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
        </select>

        <select
          value={filters.typeClient}
          onChange={(e) => handleFiltersChange({ ...filters, typeClient: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les clients</option>
          <option value="Professionnel">Professionnel</option>
          <option value="Particulier">Particulier</option>
        </select>

        <select
          value={filters.typeContrat}
          onChange={(e) => handleFiltersChange({ ...filters, typeContrat: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les contrats</option>
          <option value="Entretien">Entretien</option>
          <option value="Abonnement">Abonnement</option>
        </select>

        <button
          onClick={handleFiltersReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Entretiens</h1>
              <p className="text-sm text-gray-600">
                Gestion des interventions et contrats d'entretien - Version Moderne
              </p>
            </div>
            
            {activeTab === 'entretiens' && (
              <div className="flex items-center space-x-4">
                {/* Modes d'affichage */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('cards')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <ViewColumnsIcon className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Bouton nouveau */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Nouvel entretien
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('entretiens')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'entretiens'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Entretiens
            </button>
            <button
              onClick={() => setActiveTab('organipousse')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'organipousse'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Organipousse
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'entretiens' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Métriques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {metrics.map(renderMetricCard)}
          </div>

          {/* Filtres */}
          {renderFilters()}

          {/* Contenu principal */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ArrowPathIcon className="w-8 h-8 text-blue-500" />
              </motion.div>
              <span className="ml-3 text-gray-600">Chargement des entretiens...</span>
            </div>
          ) : filteredEntretiens.length === 0 ? (
            <div className="text-center py-12">
              <InformationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun entretien trouvé</h3>
              <p className="text-gray-600 mb-4">
                {Object.values(filters).some(v => v && v !== 'all') 
                  ? 'Aucun entretien ne correspond aux critères de recherche'
                  : 'Commencez par créer votre premier entretien'
                }
              </p>
            </div>
          ) : viewMode === 'cards' ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredEntretiens.map(renderEntretienCard)}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEntretiens.map((entretien, index) => (
                      <motion.tr
                        key={entretien._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{entretien.client.nom}</div>
                            <div className="text-sm text-gray-500">{entretien.numeroEntretien}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {entretien.typeContrat}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entretien.statut)}`}>
                            {entretien.statut.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(entretien.planification.dateDebut).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entretien.montantTotal?.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => alert(`Voir entretien ${entretien._id}`)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Voir
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Information sur les nouvelles fonctionnalités */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🚀 Nouvelle Interface Entretiens
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <ul className="space-y-1">
                <li>• Interface moderne avec animations fluides</li>
                <li>• Vue en cartes et tableau commutable</li>
                <li>• Système de filtrage avancé</li>
                <li>• Métriques en temps réel</li>
              </ul>
              <ul className="space-y-1">
                <li>• Actions contextuelles sur chaque entretien</li>
                <li>• Barres de progression visuelles</li>
                <li>• Notifications toast intégrées</li>
                <li>• Design responsive et accessible</li>
              </ul>
            </div>
            <p className="text-sm text-blue-600 mt-3">
              <strong>Note:</strong> Cette version utilise des données de démonstration. 
              Connectez votre backend pour utiliser les vraies données.
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-[calc(100vh-200px)]">
          <Organipousse />
        </div>
      )}
    </div>
  );
};

export default Entretien;