import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserGroupIcon, 
  StarIcon, 
  TrophyIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  ClockIcon,
  TagIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ChartPieIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  ChatBubbleLeftRightIcon,
  CalculatorIcon,
  GlobeAltIcon,
  PaperClipIcon,
  LinkIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CloudArrowUpIcon,
  FolderOpenIcon,
  DocumentArrowDownIcon,
  ScaleIcon,
  CpuChipIcon,
  BeakerIcon,
  BoltIcon,
  FireIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  ServerIcon,
  WifiIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import { Doughnut, Line, Bar, Radar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import confetti from 'canvas-confetti';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';
import { toast } from 'react-hot-toast';
import api from '../../../api/clientApi';
import { format, parseISO, differenceInDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ClientsUltraPremium = () => {
  const { theme, getClasses, currentTheme } = useThemeUltraPremium();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
  const [showInteractionsModal, setShowInteractionsModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [selectedClientInteractions, setSelectedClientInteractions] = useState([]);
  const [selectedClientDocuments, setSelectedClientDocuments] = useState([]);
  const [clientScores, setClientScores] = useState({});
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 48.8566, lng: 2.3522 }); // Paris par défaut
  const fileInputRef = useRef(null);
  const [crmConnections, setCrmConnections] = useState({
    salesforce: false,
    hubspot: false,
    pipedrive: false,
    zoho: false
  });

  // Chargement initial
  useEffect(() => {
    loadClients();
    calculateScores();
    checkForDuplicates();
  }, []);

  // Chargement des clients
  const loadClients = async () => {
    setLoading(true);
    try {
      // Simulation API - à remplacer par vraie API
      const mockClients = generateMockClients();
      setClients(mockClients);
    } catch (error) {
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  // Génération de clients mock avec plus de données
  const generateMockClients = () => {
    return [
      {
        id: 1,
        name: 'Entreprise Luxor',
        type: 'Entreprise',
        segment: 'premium',
        value: 125000,
        score: 95,
        contracts: 5,
        lastOrder: '2024-03-15',
        status: 'actif',
        email: 'contact@luxor.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la République, Paris',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        loyalty: 98,
        trend: 'up',
        tags: ['VIP', 'Fidèle', 'Grand compte'],
        revenue: [45000, 52000, 48000, 61000, 58000, 65000],
        orderFrequency: 12,
        avgOrderValue: 10416,
        paymentDelay: 15,
        satisfaction: 4.8,
        referrals: 3,
        siret: '12345678901234',
        naf: '4776Z',
        tva: 'FR12345678901',
        interactions: [],
        documents: [],
        scoreDetails: {
          recence: 95,
          frequence: 90,
          montant: 98,
          engagement: 92,
          satisfaction: 96
        }
      },
      {
        id: 2,
        name: 'Jean Dupont',
        type: 'Particulier',
        segment: 'standard',
        value: 8500,
        score: 72,
        contracts: 1,
        lastOrder: '2024-03-20',
        status: 'actif',
        email: 'jean.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        address: '45 Avenue des Fleurs, Lyon',
        coordinates: { lat: 45.7640, lng: 4.8357 },
        loyalty: 65,
        trend: 'stable',
        tags: ['Régulier'],
        revenue: [1500, 1800, 1200, 1500, 1600, 1900],
        orderFrequency: 6,
        avgOrderValue: 1416,
        paymentDelay: 30,
        satisfaction: 4.2,
        referrals: 1,
        interactions: [],
        documents: [],
        scoreDetails: {
          recence: 70,
          frequence: 65,
          montant: 75,
          engagement: 78,
          satisfaction: 72
        }
      },
      {
        id: 3,
        name: 'Green Garden SARL',
        type: 'Entreprise',
        segment: 'premium',
        value: 87000,
        score: 88,
        contracts: 3,
        lastOrder: '2024-03-18',
        status: 'actif',
        email: 'info@greengarden.fr',
        phone: '+33 4 56 78 90 12',
        address: '78 Boulevard Nature, Marseille',
        coordinates: { lat: 43.2965, lng: 5.3698 },
        loyalty: 85,
        trend: 'up',
        tags: ['Écologique', 'Contrat annuel'],
        revenue: [28000, 31000, 29000, 35000, 32000, 38000],
        orderFrequency: 10,
        avgOrderValue: 8700,
        paymentDelay: 20,
        satisfaction: 4.6,
        referrals: 2,
        siret: '98765432109876',
        naf: '8130Z',
        tva: 'FR98765432109',
        interactions: [],
        documents: [],
        scoreDetails: {
          recence: 88,
          frequence: 85,
          montant: 90,
          engagement: 87,
          satisfaction: 88
        }
      },
      {
        id: 4,
        name: 'Marie Martin',
        type: 'Particulier',
        segment: 'occasionnel',
        value: 2300,
        score: 45,
        contracts: 0,
        lastOrder: '2024-02-10',
        status: 'inactif',
        email: 'marie.martin@email.com',
        phone: '+33 6 98 76 54 32',
        address: '12 Rue des Lilas, Bordeaux',
        coordinates: { lat: 44.8378, lng: -0.5792 },
        loyalty: 30,
        trend: 'down',
        tags: ['À relancer'],
        revenue: [800, 600, 0, 900, 0, 0],
        orderFrequency: 3,
        avgOrderValue: 766,
        paymentDelay: 45,
        satisfaction: 3.8,
        referrals: 0,
        interactions: [],
        documents: [],
        scoreDetails: {
          recence: 40,
          frequence: 35,
          montant: 45,
          engagement: 50,
          satisfaction: 55
        }
      },
      {
        id: 5,
        name: 'Tech Solutions SAS',
        type: 'Entreprise',
        segment: 'premium',
        value: 156000,
        score: 99,
        contracts: 8,
        lastOrder: '2024-03-22',
        status: 'vip',
        email: 'ceo@techsolutions.com',
        phone: '+33 1 87 65 43 21',
        address: '200 Avenue Innovation, Paris',
        coordinates: { lat: 48.8584, lng: 2.2945 },
        loyalty: 100,
        trend: 'up',
        tags: ['VIP', 'Stratégique', 'Innovation'],
        revenue: [48000, 51000, 52000, 58000, 61000, 68000],
        orderFrequency: 18,
        avgOrderValue: 8666,
        paymentDelay: 10,
        satisfaction: 4.9,
        referrals: 5,
        siret: '11111111111111',
        naf: '6202A',
        tva: 'FR11111111111',
        interactions: [],
        documents: [],
        scoreDetails: {
          recence: 100,
          frequence: 98,
          montant: 99,
          engagement: 100,
          satisfaction: 98
        }
      },
      // Doublons potentiels pour test
      {
        id: 6,
        name: 'Jean Dupond', // Similaire à Jean Dupont
        type: 'Particulier',
        email: 'j.dupond@email.com',
        phone: '+33 6 12 34 56 79',
        address: '45 Avenue des Fleurs, Lyon',
        coordinates: { lat: 45.7640, lng: 4.8357 },
        score: 68,
        segment: 'standard',
        value: 7500,
        status: 'actif'
      },
      {
        id: 7,
        name: 'Green Gardens', // Similaire à Green Garden SARL
        type: 'Entreprise',
        email: 'contact@greengardens.fr',
        phone: '+33 4 56 78 90 13',
        address: '80 Boulevard Nature, Marseille',
        coordinates: { lat: 43.2970, lng: 5.3700 },
        score: 82,
        segment: 'premium',
        value: 75000,
        status: 'actif'
      }
    ];
  };

  // Calcul automatique des scores
  const calculateScores = () => {
    const scores = {};
    clients.forEach(client => {
      const daysSinceLastOrder = differenceInDays(new Date(), parseISO(client.lastOrder || new Date()));
      const recenceScore = Math.max(0, 100 - daysSinceLastOrder * 2);
      const frequenceScore = Math.min(100, client.orderFrequency * 5);
      const montantScore = Math.min(100, (client.value / 2000));
      const satisfactionScore = client.satisfaction * 20;
      
      const totalScore = Math.round(
        (recenceScore * 0.3) +
        (frequenceScore * 0.2) +
        (montantScore * 0.3) +
        (satisfactionScore * 0.2)
      );
      
      scores[client.id] = {
        total: totalScore,
        recence: recenceScore,
        frequence: frequenceScore,
        montant: montantScore,
        satisfaction: satisfactionScore,
        category: totalScore >= 80 ? 'VIP' : totalScore >= 60 ? 'Important' : totalScore >= 40 ? 'Standard' : 'À risque'
      };
    });
    setClientScores(scores);
  };

  // Détection des doublons
  const checkForDuplicates = () => {
    const potentialDuplicates = [];
    
    clients.forEach((client1, index1) => {
      clients.forEach((client2, index2) => {
        if (index1 < index2) {
          // Vérifier similarité des noms (distance de Levenshtein simplifiée)
          const nameSimilarity = calculateSimilarity(client1.name, client2.name);
          const emailSimilarity = client1.email && client2.email ? 
            calculateSimilarity(client1.email.split('@')[0], client2.email.split('@')[0]) : 0;
          const phoneSimilarity = client1.phone && client2.phone ?
            calculateSimilarity(client1.phone.replace(/\D/g, ''), client2.phone.replace(/\D/g, '')) : 0;
          const addressSimilarity = client1.address && client2.address ?
            calculateSimilarity(client1.address, client2.address) : 0;
          
          const totalSimilarity = Math.max(nameSimilarity, emailSimilarity, phoneSimilarity, addressSimilarity);
          
          if (totalSimilarity > 0.7) {
            potentialDuplicates.push({
              client1,
              client2,
              similarity: Math.round(totalSimilarity * 100),
              reasons: []
            });
            
            if (nameSimilarity > 0.7) potentialDuplicates[potentialDuplicates.length - 1].reasons.push('Nom similaire');
            if (emailSimilarity > 0.7) potentialDuplicates[potentialDuplicates.length - 1].reasons.push('Email similaire');
            if (phoneSimilarity > 0.7) potentialDuplicates[potentialDuplicates.length - 1].reasons.push('Téléphone similaire');
            if (addressSimilarity > 0.7) potentialDuplicates[potentialDuplicates.length - 1].reasons.push('Adresse similaire');
          }
        }
      });
    });
    
    setDuplicates(potentialDuplicates);
    if (potentialDuplicates.length > 0) {
      toast.warning(`${potentialDuplicates.length} doublons potentiels détectés`);
    }
  };

  // Calcul de similarité (Levenshtein simplifié)
  const calculateSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();
    
    if (str1 === str2) return 1;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1, str2) => {
    const costs = [];
    for (let i = 0; i <= str2.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= str1.length; j++) {
        if (i === 0) costs[j] = j;
        else if (j > 0) {
          let newValue = costs[j - 1];
          if (str1.charAt(j - 1) !== str2.charAt(i - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[str1.length] = lastValue;
    }
    return costs[str1.length];
  };

  // Fusion de doublons
  const mergeDuplicates = (client1, client2, keepFirst = true) => {
    const primaryClient = keepFirst ? client1 : client2;
    const secondaryClient = keepFirst ? client2 : client1;
    
    const mergedClient = {
      ...primaryClient,
      value: primaryClient.value + secondaryClient.value,
      contracts: primaryClient.contracts + secondaryClient.contracts,
      revenue: primaryClient.revenue.map((v, i) => v + (secondaryClient.revenue?.[i] || 0)),
      orderFrequency: primaryClient.orderFrequency + secondaryClient.orderFrequency,
      interactions: [...(primaryClient.interactions || []), ...(secondaryClient.interactions || [])],
      documents: [...(primaryClient.documents || []), ...(secondaryClient.documents || [])],
      tags: [...new Set([...(primaryClient.tags || []), ...(secondaryClient.tags || [])])],
      notes: `${primaryClient.notes || ''}\n\nFusionné avec: ${secondaryClient.name} (${secondaryClient.email})`
    };
    
    // Mettre à jour la liste des clients
    setClients(prev => {
      const newClients = prev.filter(c => c.id !== secondaryClient.id);
      return newClients.map(c => c.id === primaryClient.id ? mergedClient : c);
    });
    
    // Recalculer les scores
    calculateScores();
    
    toast.success(`Clients fusionnés: ${primaryClient.name} et ${secondaryClient.name}`);
    setShowDuplicatesModal(false);
  };

  // Export CSV
  const exportToCSV = () => {
    const csvData = clients.map(client => ({
      Nom: client.name,
      Type: client.type,
      Segment: client.segment,
      Email: client.email,
      Téléphone: client.phone,
      Adresse: client.address,
      'CA Total': client.value,
      Score: clientScores[client.id]?.total || client.score,
      'Dernière commande': client.lastOrder,
      Statut: client.status,
      Satisfaction: client.satisfaction,
      Tags: client.tags?.join(', ')
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clients_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    
    toast.success('Export CSV réussi');
  };

  // Export Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(clients.map(client => ({
      Nom: client.name,
      Type: client.type,
      Segment: client.segment,
      Email: client.email,
      Téléphone: client.phone,
      Adresse: client.address,
      'CA Total': client.value,
      Score: clientScores[client.id]?.total || client.score,
      'Score Catégorie': clientScores[client.id]?.category,
      'Dernière commande': client.lastOrder,
      Statut: client.status,
      Satisfaction: client.satisfaction,
      'Délai paiement': client.paymentDelay,
      'Fréquence commande': client.orderFrequency,
      'Panier moyen': client.avgOrderValue,
      Tags: client.tags?.join(', ')
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clients');
    XLSX.writeFile(wb, `clients_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    toast.success('Export Excel réussi');
  };

  // Import CSV/Excel
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const importedClients = results.data.map((row, index) => ({
            id: Date.now() + index,
            name: row.Nom || row.name || '',
            type: row.Type || row.type || 'Particulier',
            segment: row.Segment || row.segment || 'standard',
            email: row.Email || row.email || '',
            phone: row.Téléphone || row.phone || '',
            address: row.Adresse || row.address || '',
            value: parseFloat(row['CA Total'] || row.value || 0),
            score: parseInt(row.Score || row.score || 50),
            status: row.Statut || row.status || 'actif',
            satisfaction: parseFloat(row.Satisfaction || row.satisfaction || 4),
            tags: (row.Tags || row.tags || '').split(',').map(t => t.trim()).filter(Boolean)
          }));
          
          setClients(prev => [...prev, ...importedClients]);
          calculateScores();
          checkForDuplicates();
          toast.success(`${importedClients.length} clients importés`);
        },
        error: () => {
          toast.error('Erreur lors de l\'import du fichier CSV');
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const importedClients = jsonData.map((row, index) => ({
          id: Date.now() + index,
          name: row.Nom || row.name || '',
          type: row.Type || row.type || 'Particulier',
          segment: row.Segment || row.segment || 'standard',
          email: row.Email || row.email || '',
          phone: row.Téléphone || row.phone || '',
          address: row.Adresse || row.address || '',
          value: parseFloat(row['CA Total'] || row.value || 0),
          score: parseInt(row.Score || row.score || 50),
          status: row.Statut || row.status || 'actif',
          satisfaction: parseFloat(row.Satisfaction || row.satisfaction || 4),
          tags: (row.Tags || row.tags || '').split(',').map(t => t.trim()).filter(Boolean)
        }));
        
        setClients(prev => [...prev, ...importedClients]);
        calculateScores();
        checkForDuplicates();
        toast.success(`${importedClients.length} clients importés`);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error('Format de fichier non supporté. Utilisez CSV ou Excel.');
    }
    
    // Reset input
    event.target.value = '';
  };

  // Ajouter une interaction
  const addInteraction = (clientId, interaction) => {
    const newInteraction = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: interaction.type,
      subject: interaction.subject,
      description: interaction.description,
      user: 'Current User',
      ...interaction
    };
    
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, interactions: [...(client.interactions || []), newInteraction] }
        : client
    ));
    
    toast.success('Interaction ajoutée');
  };

  // Géolocalisation
  const geocodeAddress = async (address) => {
    try {
      // Simulation - à remplacer par vraie API de géocodage
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    } catch (error) {
      console.error('Erreur géocodage:', error);
    }
    return null;
  };

  // Connexion CRM externe
  const connectCRM = async (crmName) => {
    setLoading(true);
    try {
      // Simulation connexion CRM
      setTimeout(() => {
        setCrmConnections(prev => ({ ...prev, [crmName]: !prev[crmName] }));
        toast.success(`${crmName} ${crmConnections[crmName] ? 'déconnecté' : 'connecté'}`);
        setLoading(false);
        
        if (!crmConnections[crmName]) {
          // Simuler import de données depuis CRM
          toast.info('Synchronisation des données en cours...');
          setTimeout(() => {
            toast.success('Synchronisation terminée');
          }, 2000);
        }
      }, 1500);
    } catch (error) {
      toast.error('Erreur de connexion au CRM');
      setLoading(false);
    }
  };

  // Upload de document
  const uploadDocument = (clientId, file) => {
    const newDocument = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file)
    };
    
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, documents: [...(client.documents || []), newDocument] }
        : client
    ));
    
    toast.success('Document uploadé');
  };

  // KPIs globaux
  const kpis = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'actif' || c.status === 'vip').length,
    totalRevenue: clients.reduce((sum, c) => sum + (c.value || 0), 0),
    avgSatisfaction: (clients.reduce((sum, c) => sum + (c.satisfaction || 0), 0) / clients.length).toFixed(1),
    vipClients: clients.filter(c => c.segment === 'premium').length,
    retentionRate: 89,
    duplicatesFound: duplicates.length,
    avgScore: Math.round(Object.values(clientScores).reduce((sum, s) => sum + (s.total || 0), 0) / Object.keys(clientScores).length) || 0
  };

  // Filtrage des clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = filterSegment === 'all' || client.segment === filterSegment;
    return matchesSearch && matchesSegment;
  });

  const getSegmentGradient = (segment) => {
    switch(segment) {
      case 'premium': return 'from-yellow-500 to-amber-600';
      case 'standard': return 'from-blue-500 to-indigo-600';
      case 'occasionnel': return 'from-gray-500 to-slate-600';
      case 'vip': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusGradient = (status) => {
    switch(status) {
      case 'actif': return 'from-green-500 to-emerald-600';
      case 'inactif': return 'from-red-500 to-pink-600';
      case 'vip': return 'from-purple-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const ClientCard = ({ client }) => {
    const score = clientScores[client.id] || {};
    
    return (
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedClient(client)}
        className={getClasses('card', 'cursor-pointer relative overflow-hidden')}
      >
        {/* Badge VIP */}
        {client.status === 'vip' && (
          <div className="absolute -top-2 -right-2 z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${theme.primary} rounded-full blur-xl`} />
              <div className={`relative bg-gradient-to-br ${theme.primary} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                <TrophyIcon className="w-3 h-3" />
                VIP
              </div>
            </motion.div>
          </div>
        )}

        {/* Score automatique */}
        {score.total && (
          <div className="absolute top-2 left-2">
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
              score.category === 'VIP' ? 'bg-purple-100 text-purple-800' :
              score.category === 'Important' ? 'bg-blue-100 text-blue-800' :
              score.category === 'Standard' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              Score: {score.total}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4 mt-8">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getSegmentGradient(client.segment)} flex items-center justify-center text-white font-bold shadow-lg`}>
              {client.type === 'Entreprise' ? 
                <BuildingOfficeIcon className="w-7 h-7" /> : 
                client.name?.split(' ').map(n => n[0]).join('').substring(0, 2)
              }
            </div>
            <div>
              <h3 className={`text-lg font-bold ${theme.text}`}>{client.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm ${theme.textSecondary}`}>{client.type}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${getStatusGradient(client.status)} text-white`}>
                  {client.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {client.tags?.map((tag, idx) => (
            <span key={idx} className={getClasses('badge')}>
              {tag}
            </span>
          ))}
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className={getClasses('glass', 'text-center p-2 rounded-lg')}>
            <CurrencyEuroIcon className={`w-5 h-5 mx-auto mb-1 ${theme.accent}`} />
            <div className={`text-lg font-bold ${theme.text}`}>
              {((client.value || 0) / 1000).toFixed(0)}k€
            </div>
            <div className={`text-xs ${theme.textSecondary}`}>CA Total</div>
          </div>
          <div className={getClasses('glass', 'text-center p-2 rounded-lg')}>
            <DocumentTextIcon className={`w-5 h-5 mx-auto mb-1 ${theme.accent}`} />
            <div className={`text-lg font-bold ${theme.text}`}>
              {client.contracts || 0}
            </div>
            <div className={`text-xs ${theme.textSecondary}`}>Contrats</div>
          </div>
          <div className={getClasses('glass', 'text-center p-2 rounded-lg')}>
            <HeartIcon className={`w-5 h-5 mx-auto mb-1 ${theme.accent}`} />
            <div className={`text-lg font-bold ${theme.text}`}>
              {client.loyalty || 0}%
            </div>
            <div className={`text-xs ${theme.textSecondary}`}>Fidélité</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClient(client);
              setShowInteractionsModal(true);
            }}
            className={getClasses('button', 'flex-1 py-2 text-sm flex items-center justify-center gap-1')}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            Interactions
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClient(client);
              setShowDocumentsModal(true);
            }}
            className={getClasses('glass', 'px-3 py-2 rounded-xl')}
          >
            <PaperClipIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClient(client);
              setShowMapModal(true);
            }}
            className={getClasses('glass', 'px-3 py-2 rounded-xl')}
          >
            <MapPinIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <UltraPremiumContainer
      title="Gestion Clients Intelligence Avancée"
      icon={UserGroupIcon}
    >
      {/* KPIs avec nouvelles métriques */}
      <div className="grid grid-cols-8 gap-4 mb-6">
        {[
          { label: 'Total Clients', value: kpis.totalClients, icon: UserGroupIcon, gradient: 'from-blue-500 to-indigo-600', trend: '+5' },
          { label: 'Clients Actifs', value: kpis.activeClients, icon: CheckBadgeIcon, gradient: 'from-green-500 to-emerald-600', trend: '+3' },
          { label: 'CA Total', value: `${(kpis.totalRevenue / 1000).toFixed(0)}k€`, icon: CurrencyEuroIcon, gradient: 'from-yellow-500 to-amber-600', trend: '+12%' },
          { label: 'Satisfaction', value: kpis.avgSatisfaction, icon: StarIcon, gradient: 'from-purple-500 to-pink-600', trend: '+0.2' },
          { label: 'Clients VIP', value: kpis.vipClients, icon: TrophyIcon, gradient: 'from-orange-500 to-red-600', trend: '+1' },
          { label: 'Score Moyen', value: kpis.avgScore, icon: CalculatorIcon, gradient: 'from-indigo-500 to-purple-600', trend: '+5' },
          { label: 'Doublons', value: kpis.duplicatesFound, icon: DocumentDuplicateIcon, gradient: 'from-red-500 to-pink-600', trend: duplicates.length > 0 ? '!' : '0' },
          { label: 'Rétention', value: `${kpis.retentionRate}%`, icon: HeartIcon, gradient: 'from-pink-500 to-rose-600', trend: '+2%' }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5 }}
            className={getClasses('card', 'relative overflow-hidden')}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-10`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-6 h-6 ${theme.accent}`} />
                <span className={`text-xs font-medium ${
                  kpi.trend === '!' ? 'text-red-400' : 'text-green-400'
                }`}>{kpi.trend}</span>
              </div>
              <div className={`text-2xl font-bold ${theme.text}`}>{kpi.value}</div>
              <div className={`text-xs ${theme.textSecondary} mt-1`}>{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre d'outils enrichie */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textSecondary}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un client..."
            className={getClasses('input', 'pl-10')}
          />
        </div>
        
        <div className="flex gap-2">
          {/* Import/Export */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={getClasses('button', 'px-4 py-3 flex items-center gap-2')}
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Export
            </motion.button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button 
                onClick={exportToCSV}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              >
                Export CSV
              </button>
              <button 
                onClick={exportToExcel}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
              >
                Export Excel
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className={getClasses('glass', 'px-4 py-3 rounded-xl flex items-center gap-2')}
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            Import
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileImport}
            className="hidden"
          />

          {/* Détection doublons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDuplicatesModal(true)}
            className={`${getClasses('glass', 'px-4 py-3 rounded-xl flex items-center gap-2')} ${
              duplicates.length > 0 ? 'ring-2 ring-red-500' : ''
            }`}
          >
            <DocumentDuplicateIcon className="w-5 h-5" />
            {duplicates.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2">
                {duplicates.length}
              </span>
            )}
          </motion.button>

          {/* CRM */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCRMModal(true)}
            className={getClasses('glass', 'px-4 py-3 rounded-xl flex items-center gap-2')}
          >
            <LinkIcon className="w-5 h-5" />
            CRM
          </motion.button>

          {/* Scoring */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              calculateScores();
              toast.success('Scores recalculés');
            }}
            className={getClasses('glass', 'px-4 py-3 rounded-xl flex items-center gap-2')}
          >
            <CalculatorIcon className="w-5 h-5" />
            Scorer
          </motion.button>
        </div>
      </div>

      {/* Grille de clients */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {/* Modal Doublons */}
      <AnimatePresence>
        {showDuplicatesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setShowDuplicatesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'w-full max-w-4xl max-h-[80vh] overflow-y-auto')}
            >
              <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>
                Doublons Potentiels Détectés ({duplicates.length})
              </h2>
              
              {duplicates.length === 0 ? (
                <p className={theme.textSecondary}>Aucun doublon détecté</p>
              ) : (
                <div className="space-y-4">
                  {duplicates.map((duplicate, idx) => (
                    <div key={idx} className={getClasses('glass', 'p-4 rounded-xl')}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                            duplicate.similarity > 90 ? 'bg-red-100 text-red-800' :
                            duplicate.similarity > 80 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {duplicate.similarity}% similaire
                          </div>
                          <div className="flex gap-2">
                            {duplicate.reasons.map((reason, i) => (
                              <span key={i} className={getClasses('badge')}>
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className={getClasses('glass', 'p-3 rounded-lg')}>
                          <h4 className={`font-semibold ${theme.text} mb-2`}>{duplicate.client1.name}</h4>
                          <p className={`text-sm ${theme.textSecondary}`}>{duplicate.client1.email}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>{duplicate.client1.phone}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>{duplicate.client1.address}</p>
                          <p className={`text-sm font-semibold ${theme.text} mt-2`}>
                            CA: €{duplicate.client1.value?.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className={getClasses('glass', 'p-3 rounded-lg')}>
                          <h4 className={`font-semibold ${theme.text} mb-2`}>{duplicate.client2.name}</h4>
                          <p className={`text-sm ${theme.textSecondary}`}>{duplicate.client2.email}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>{duplicate.client2.phone}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>{duplicate.client2.address}</p>
                          <p className={`text-sm font-semibold ${theme.text} mt-2`}>
                            CA: €{duplicate.client2.value?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => mergeDuplicates(duplicate.client1, duplicate.client2, true)}
                          className={getClasses('button', 'flex-1')}
                        >
                          Garder le premier
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => mergeDuplicates(duplicate.client1, duplicate.client2, false)}
                          className={getClasses('button', 'flex-1')}
                        >
                          Garder le second
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setDuplicates(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className={getClasses('glass', 'px-4 py-2 rounded-xl')}
                        >
                          Ignorer
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDuplicatesModal(false)}
                  className={getClasses('button', 'px-6 py-3')}
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal CRM */}
      <AnimatePresence>
        {showCRMModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setShowCRMModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'w-full max-w-2xl')}
            >
              <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>
                Connexions CRM Externes
              </h2>
              
              <div className="space-y-4">
                {[
                  { name: 'salesforce', label: 'Salesforce', icon: CloudArrowUpIcon, color: 'from-blue-500 to-blue-600' },
                  { name: 'hubspot', label: 'HubSpot', icon: ServerIcon, color: 'from-orange-500 to-orange-600' },
                  { name: 'pipedrive', label: 'Pipedrive', icon: SignalIcon, color: 'from-green-500 to-green-600' },
                  { name: 'zoho', label: 'Zoho CRM', icon: WifiIcon, color: 'from-red-500 to-red-600' }
                ].map((crm) => (
                  <div key={crm.name} className={getClasses('glass', 'p-4 rounded-xl')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${crm.color} text-white`}>
                          <crm.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${theme.text}`}>{crm.label}</h3>
                          <p className={`text-sm ${theme.textSecondary}`}>
                            {crmConnections[crm.name] ? 'Connecté' : 'Non connecté'}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => connectCRM(crm.name)}
                        disabled={loading}
                        className={crmConnections[crm.name] ?
                          getClasses('glass', 'px-4 py-2 rounded-xl') :
                          getClasses('button', 'px-4 py-2')
                        }
                      >
                        {loading ? (
                          <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        ) : (
                          crmConnections[crm.name] ? 'Déconnecter' : 'Connecter'
                        )}
                      </motion.button>
                    </div>
                    
                    {crmConnections[crm.name] && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className={theme.textSecondary}>Dernière synchro:</span>
                          <span className={theme.text}>Il y a 5 minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className={theme.textSecondary}>Clients synchronisés:</span>
                          <span className={theme.text}>127</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCRMModal(false)}
                  className={getClasses('button', 'px-6 py-3')}
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default ClientsUltraPremium;