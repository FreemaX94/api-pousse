import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  QrCodeIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  ShieldExclamationIcon,
  CameraIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  CubeIcon,
  ArchiveBoxIcon,
  IdentificationIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PrinterIcon,
  PhotoIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  SignalIcon,
  WifiIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  TruckIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';
import QRCode from 'qrcode';

const EquipementsUltraPremium = () => {
  const { theme, getClasses } = useThemeUltraPremium();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [expandedItems, setExpandedItems] = useState({});
  const [qrCodes, setQrCodes] = useState({});
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([]);
  const [showMaintenanceCalendar, setShowMaintenanceCalendar] = useState(false);
  const [showWarrantyAlerts, setShowWarrantyAlerts] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showTechnicalDocs, setShowTechnicalDocs] = useState(false);
  const [selectedEquipmentForMaintenance, setSelectedEquipmentForMaintenance] = useState(null);
  const [showTimelineHistory, setShowTimelineHistory] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [maintenanceCalendarEvents, setMaintenanceCalendarEvents] = useState([]);
  const [warrantyAlerts, setWarrantyAlerts] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [technicalDocuments, setTechnicalDocuments] = useState([]);
  const [documentVersions, setDocumentVersions] = useState({});

  // Données simulées d'équipements enrichies
  const [equipments, setEquipments] = useState([
    {
      id: 'EQP001',
      name: 'Tondeuse John Deere X350',
      category: 'jardinage',
      type: 'tondeuse',
      brand: 'John Deere',
      model: 'X350',
      serialNumber: 'JD350-2024-001',
      purchaseDate: new Date('2024-01-15'),
      purchasePrice: 4500,
      currentValue: 4200,
      status: 'operational',
      location: 'Hangar A',
      assignedTo: 'Jean Martin',
      barcode: '3701234567890',
      qrCode: null,
      warranty: {
        active: true,
        endDate: new Date('2026-01-15'),
        provider: 'John Deere France',
        type: 'Complète',
        contact: '0800 123 456'
      },
      maintenance: {
        lastService: new Date('2024-07-15'),
        nextService: new Date('2025-01-15'),
        schedule: 'Semestriel',
        totalInterventions: 3,
        totalCost: 450
      },
      specifications: {
        engine: 'Kawasaki 603cc',
        power: '13.1 kW',
        cuttingWidth: '107 cm',
        fuelCapacity: '13.2 L',
        weight: '195 kg'
      },
      documents: [
        { 
          id: 1, 
          name: 'Manuel utilisateur', 
          type: 'pdf', 
          size: '5.2 MB', 
          url: '#', 
          version: '2.1', 
          lastModified: new Date('2024-01-15'),
          category: 'Manuel',
          status: 'current',
          uploadedBy: 'System',
          description: 'Manuel d\'utilisation complet avec procédures de sécurité'
        },
        { 
          id: 2, 
          name: 'Facture d\'achat', 
          type: 'pdf', 
          size: '1.1 MB', 
          url: '#', 
          version: '1.0',
          lastModified: new Date('2024-01-15'),
          category: 'Facture',
          status: 'archived',
          uploadedBy: 'Comptabilité',
          description: 'Facture originale d\'achat avec garanties'
        },
        { 
          id: 3, 
          name: 'Certificat de garantie', 
          type: 'pdf', 
          size: '856 KB', 
          url: '#', 
          version: '1.0',
          lastModified: new Date('2024-01-15'),
          category: 'Garantie',
          status: 'current',
          uploadedBy: 'Fournisseur',
          description: 'Certificat de garantie constructeur valide 2 ans'
        },
        {
          id: 4,
          name: 'Schéma technique v2.1',
          type: 'pdf',
          size: '2.8 MB',
          url: '#',
          version: '2.1',
          lastModified: new Date('2024-06-15'),
          category: 'Technique',
          status: 'current',
          uploadedBy: 'Bureau d\'études',
          description: 'Schémas techniques mis à jour avec modifications'
        }
      ],
      technicalDocumentation: {
        categories: ['Manuel', 'Technique', 'Maintenance', 'Garantie', 'Facture'],
        totalSize: '12.1 MB',
        totalDocuments: 12,
        lastUpdate: new Date('2024-07-15'),
        versioning: true
      },
      photos: [
        { id: 1, url: '#', caption: 'Vue avant', date: new Date('2024-01-15'), photographer: 'Tech Team', tags: ['installation', 'avant'] },
        { id: 2, url: '#', caption: 'Vue latérale', date: new Date('2024-01-15'), photographer: 'Tech Team', tags: ['installation', 'profil'] },
        { id: 3, url: '#', caption: 'Maintenance juillet', date: new Date('2024-07-15'), photographer: 'Pierre Durand', tags: ['maintenance', 'revision'] },
        { id: 4, url: '#', caption: 'État actuel', date: new Date('2024-08-10'), photographer: 'Auto Upload', tags: ['suivi', 'etat'] }
      ],
      photoGallery: {
        categories: ['Installation', 'Maintenance', 'Réparations', 'État général'],
        totalPhotos: 24,
        lastUpdate: new Date('2024-08-10'),
        storageUsed: '45.2 MB'
      },
      history: [
        {
          id: 1,
          date: new Date('2024-07-15'),
          type: 'maintenance',
          description: 'Révision complète',
          technician: 'Pierre Durand',
          cost: 180,
          parts: ['Filtre à air', 'Bougie'],
          status: 'completed'
        },
        {
          id: 2,
          date: new Date('2024-05-10'),
          type: 'repair',
          description: 'Changement courroie',
          technician: 'Paul Martin',
          cost: 120,
          parts: ['Courroie de coupe'],
          status: 'completed'
        },
        {
          id: 3,
          date: new Date('2024-03-20'),
          type: 'maintenance',
          description: 'Vidange moteur',
          technician: 'Pierre Durand',
          cost: 150,
          parts: ['Huile moteur 10W30'],
          status: 'completed'
        }
      ],
      alerts: [
        {
          id: 1,
          type: 'maintenance',
          severity: 'warning',
          message: 'Prochaine révision dans 30 jours',
          date: new Date('2024-12-15'),
          action: 'Planifier maintenance préventive',
          priority: 'medium',
          estimatedCost: 280,
          technician: 'Pierre Durand'
        },
        {
          id: 2,
          type: 'warranty',
          severity: 'info',
          message: 'Garantie expire dans 18 mois',
          date: new Date('2026-01-15'),
          action: 'Évaluer extension de garantie',
          priority: 'low',
          contact: 'John Deere France'
        }
      ],
      maintenanceCalendar: {
        nextScheduled: [
          {
            id: 1,
            date: new Date('2024-09-15'),
            type: 'Révision semestrielle',
            technician: 'Pierre Durand',
            duration: 4,
            priority: 'high',
            status: 'planned',
            estimatedCost: 280,
            tasks: ['Vidange moteur', 'Changement filtres', 'Contrôle courroies']
          },
          {
            id: 2,
            date: new Date('2024-10-01'),
            type: 'Contrôle sécurité',
            technician: 'Paul Martin',
            duration: 2,
            priority: 'medium',
            status: 'planned',
            estimatedCost: 120,
            tasks: ['Vérification freins', 'Test systèmes']
          }
        ],
        preventivePlan: {
          frequency: 'Semestrielle',
          nextDue: new Date('2024-09-15'),
          averageDuration: 3.5,
          estimatedCost: 280,
          compliance: 98,
          efficiency: 95
        }
      },
      performance: {
        availability: 95,
        reliability: 92,
        efficiency: 88,
        mtbf: 180, // Mean Time Between Failures (days)
        mttr: 2 // Mean Time To Repair (hours)
      },
      tags: ['professionnel', 'haute-capacité', 'garantie-active']
    },
    {
      id: 'EQ002',
      name: 'Tronçonneuse Stihl MS 500i',
      category: 'outil',
      type: 'Tronçonneuse',
      brand: 'Stihl',
      model: 'MS 500i',
      serialNumber: 'STI-2024-078',
      purchaseDate: new Date('2024-01-20'),
      warrantyEnd: new Date('2026-01-20'),
      status: 'in_use',
      condition: 'good',
      location: 'Équipe A - Marc Leblanc',
      assignedTo: 'Marc Leblanc',
      lastMaintenance: new Date('2024-08-01'),
      nextMaintenance: new Date('2024-09-01'),
      maintenanceInterval: 30,
      specifications: {
        puissance: '5.0 kW',
        poids: '6.2 kg',
        longueurGuide: '50 cm',
        carburant: 'Essence 2T',
        reservoir: '0.8 L'
      },
      documents: {
        certificat: true,
        assurance: false,
        controle: true,
        manuel: true
      },
      interventions: 78,
      hoursWorked: 245,
      fuelConsumption: 85,
      maintenanceCost: 350,
      dailyRate: 45,
      notes: 'Tronçonneuse professionnelle avec injection électronique',
      qrCode: 'QR-EQ002-STI078',
      photos: 5,
      tags: ['elagage', 'portable', 'professionnel']
    },
    {
      id: 'EQ003',
      name: 'Tracteur tondeuse Kubota GR2120',
      category: 'vehicule',
      type: 'Tracteur tondeuse',
      brand: 'Kubota',
      model: 'GR2120',
      serialNumber: 'KUB-2022-456',
      purchaseDate: new Date('2022-05-10'),
      warrantyEnd: new Date('2024-05-10'),
      status: 'maintenance',
      condition: 'fair',
      location: 'Atelier maintenance',
      assignedTo: null,
      lastMaintenance: new Date('2024-08-11'),
      nextMaintenance: new Date('2024-08-25'),
      maintenanceInterval: 100,
      specifications: {
        puissance: '21 HP',
        largeurCoupe: '122 cm',
        transmission: 'Hydrostatique',
        carburant: 'Essence',
        reservoir: '22.7 L'
      },
      documents: {
        certificat: true,
        assurance: true,
        controle: false,
        manuel: true
      },
      interventions: 156,
      hoursWorked: 892,
      fuelConsumption: 1250,
      maintenanceCost: 1850,
      dailyRate: 120,
      notes: 'En maintenance préventive, remplacement des lames et vidange',
      qrCode: 'QR-EQ003-KUB456',
      photos: 6,
      tags: ['tonte', 'grandes-surfaces', 'maintenance']
    },
    {
      id: 'EQ004',
      name: 'Système d\'arrosage connecté Rain Bird',
      category: 'systeme',
      type: 'Arrosage automatique',
      brand: 'Rain Bird',
      model: 'ESP-TM2',
      serialNumber: 'RB-2024-123',
      purchaseDate: new Date('2024-06-01'),
      warrantyEnd: new Date('2029-06-01'),
      status: 'available',
      condition: 'excellent',
      location: 'Stock équipements',
      assignedTo: null,
      lastMaintenance: new Date('2024-08-05'),
      nextMaintenance: new Date('2024-11-05'),
      maintenanceInterval: 90,
      specifications: {
        zones: '12 zones',
        connectivite: 'WiFi + 4G',
        alimentation: '24V AC',
        capteurs: 'Pluie, Humidité, Température',
        application: 'Rain Bird App'
      },
      documents: {
        certificat: true,
        assurance: true,
        controle: true,
        manuel: true
      },
      interventions: 12,
      hoursWorked: 0,
      fuelConsumption: 0,
      maintenanceCost: 180,
      dailyRate: 80,
      notes: 'Système intelligent avec capteurs météo intégrés',
      qrCode: 'QR-EQ004-RB123',
      photos: 4,
      tags: ['arrosage', 'connecte', 'intelligent']
    },
    {
      id: 'EQ005',
      name: 'Broyeur de branches Eliet Major 4S',
      category: 'machine',
      type: 'Broyeur',
      brand: 'Eliet',
      model: 'Major 4S',
      serialNumber: 'ELI-2023-789',
      purchaseDate: new Date('2023-08-22'),
      warrantyEnd: new Date('2025-08-22'),
      status: 'reserved',
      condition: 'good',
      location: 'Réservé pour projet Château de Fontaines',
      assignedTo: 'Projet CF-2024-017',
      lastMaintenance: new Date('2024-07-30'),
      nextMaintenance: new Date('2024-09-30'),
      maintenanceInterval: 60,
      specifications: {
        puissance: '13 HP',
        diametreMax: '10 cm',
        poids: '165 kg',
        largeurCoupe: '92 cm',
        systemeCoupe: 'Couteaux rotatifs'
      },
      documents: {
        certificat: true,
        assurance: true,
        controle: true,
        manuel: true
      },
      interventions: 34,
      hoursWorked: 167,
      fuelConsumption: 420,
      maintenanceCost: 890,
      dailyRate: 180,
      notes: 'Broyeur professionnel pour déchets verts, très efficace',
      qrCode: 'QR-EQ005-ELI789',
      photos: 7,
      tags: ['broyage', 'dechets-verts', 'reserve']
    },
    {
      id: 'EQ006',
      name: 'Capteur IoT Sol & Climat',
      category: 'capteur',
      type: 'Capteur environnemental',
      brand: 'GreenIoT',
      model: 'SoilSense Pro',
      serialNumber: 'IOT-2024-456',
      purchaseDate: new Date('2024-04-15'),
      warrantyEnd: new Date('2027-04-15'),
      status: 'out_of_order',
      condition: 'damaged',
      location: 'Atelier réparation',
      assignedTo: null,
      lastMaintenance: new Date('2024-08-09'),
      nextMaintenance: new Date('2024-08-20'),
      maintenanceInterval: 180,
      specifications: {
        mesures: 'pH, Humidité, Température, NPK',
        connectivite: 'LoRaWAN',
        autonomie: '2 ans',
        precision: '±0.1 pH, ±2%',
        profondeur: '30 cm'
      },
      documents: {
        certificat: true,
        assurance: true,
        controle: false,
        manuel: true
      },
      interventions: 8,
      hoursWorked: 0,
      fuelConsumption: 0,
      maintenanceCost: 250,
      dailyRate: 25,
      notes: 'Capteur endommagé suite à inondation, en cours de réparation',
      qrCode: 'QR-EQ006-IOT456',
      photos: 3,
      tags: ['iot', 'capteur', 'reparation']
    }
  ]);

  // Filtrage et tri
  const filteredEquipment = equipments.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'interventions': return b.interventions - a.interventions;
      case 'cost': return b.maintenanceCost - a.maintenanceCost;
      case 'nextMaintenance': return new Date(a.nextMaintenance) - new Date(b.nextMaintenance);
      default: return 0;
    }
  });

  // Statistiques
  const stats = {
    total: equipment.length,
    available: equipment.filter(e => e.status === 'available').length,
    inUse: equipment.filter(e => e.status === 'in_use').length,
    maintenance: equipment.filter(e => e.status === 'maintenance' || e.status === 'out_of_order').length,
    totalCost: equipment.reduce((sum, e) => sum + e.maintenanceCost, 0),
    totalHours: equipment.reduce((sum, e) => sum + e.hoursWorked, 0)
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'from-green-500 to-green-600';
      case 'in_use': return 'from-blue-500 to-blue-600';
      case 'reserved': return 'from-purple-500 to-purple-600';
      case 'maintenance': return 'from-orange-500 to-orange-600';
      case 'out_of_order': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'available': return CheckCircleIcon;
      case 'in_use': return BoltIcon;
      case 'reserved': return ClockIcon;
      case 'maintenance': return WrenchScrewdriverIcon;
      case 'out_of_order': return XCircleIcon;
      default: return CogIcon;
    }
  };

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      case 'damaged': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'vehicule': return TruckIcon;
      case 'outil': return WrenchScrewdriverIcon;
      case 'machine': return CogIcon;
      case 'systeme': return CpuChipIcon;
      case 'capteur': return SignalIcon;
      default: return CogIcon;
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Nom', 'Catégorie', 'Marque', 'Modèle', 'Statut', 'État', 'Localisation', 'Heures', 'Interventions', 'Coût maintenance'].join(','),
      ...sortedEquipment.map(eq => [
        eq.name,
        eq.category,
        eq.brand,
        eq.model,
        eq.status,
        eq.condition,
        eq.location,
        eq.hoursWorked,
        eq.interventions,
        eq.maintenanceCost
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventaire-equipements.csv';
    a.click();
  };

  return (
    <UltraPremiumContainer
      title="Inventaire Équipements Quantum"
      icon={WrenchScrewdriverIcon}
    >
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <motion.div 
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CogIcon className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Disponibles</p>
                <p className="text-2xl font-bold">{stats.available}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">En service</p>
                <p className="text-2xl font-bold">{stats.inUse}</p>
              </div>
              <BoltIcon className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Maintenance</p>
                <p className="text-2xl font-bold">{stats.maintenance}</p>
              </div>
              <WrenchScrewdriverIcon className="w-8 h-8 text-orange-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Coût Total</p>
                <p className="text-2xl font-bold">{(stats.totalCost/1000).toFixed(0)}K€</p>
              </div>
              <CurrencyEuroIcon className="w-8 h-8 text-indigo-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Heures Total</p>
                <p className="text-2xl font-bold">{(stats.totalHours/1000).toFixed(1)}K</p>
              </div>
              <ClockIcon className="w-8 h-8 text-teal-200" />
            </div>
          </motion.div>
        </div>

        {/* Barre d'outils */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher équipements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Toutes catégories</option>
                <option value="vehicule">Véhicules</option>
                <option value="outil">Outils</option>
                <option value="machine">Machines</option>
                <option value="systeme">Systèmes</option>
                <option value="capteur">Capteurs</option>
              </select>

              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tous statuts</option>
                <option value="available">Disponible</option>
                <option value="in_use">En service</option>
                <option value="reserved">Réservé</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_order">Hors service</option>
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="name">Nom</option>
                <option value="interventions">Interventions</option>
                <option value="cost">Coût maintenance</option>
                <option value="nextMaintenance">Prochaine maintenance</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  Grille
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  Liste
                </button>
              </div>

              <button 
                onClick={() => setShowMaintenanceCalendar(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
              >
                <CalendarDaysIcon className="w-5 h-5" />
                <span>Calendrier</span>
              </button>

              <button 
                onClick={() => setShowWarrantyAlerts(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <BellAlertIcon className="w-5 h-5" />
                <span>Alertes</span>
              </button>

              <button 
                onClick={() => setShowPhotoGallery(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <PhotoIcon className="w-5 h-5" />
                <span>Photos</span>
              </button>

              <button 
                onClick={() => setShowTechnicalDocs(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span>Documents</span>
              </button>

              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Ajouter</span>
              </button>

              <button 
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vue en grille */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEquipment.map((item, index) => {
              const CategoryIcon = getCategoryIcon(item.category);
              const StatusIcon = getStatusIcon(item.status);
              return (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedEquipment(item)}
                >
                  {/* Header avec gradient de statut */}
                  <div className={`h-2 bg-gradient-to-r ${getStatusColor(item.status)}`} />
                  
                  {/* En-tête */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CategoryIcon className="w-5 h-5 text-gray-600" />
                          <span className="text-xs text-gray-500 uppercase tracking-wide">{item.category}</span>
                          <StatusIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.brand} {item.model}</p>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${getConditionColor(item.condition)}`}>
                          {item.condition}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Série:</span>
                        <span className="font-medium text-gray-900">{item.serialNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Localisation:</span>
                        <span className="font-medium text-gray-900 text-right">{item.location}</span>
                      </div>
                      {item.assignedTo && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Assigné à:</span>
                          <span className="font-medium text-blue-600 text-right">{item.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Métriques */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{item.interventions}</div>
                        <div className="text-xs text-gray-500">Interventions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{item.hoursWorked}h</div>
                        <div className="text-xs text-gray-500">Heures</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Maintenance:</span>
                      <span className="font-medium text-orange-600">
                        {item.nextMaintenance.toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Coût maint.:</span>
                      <span className="font-bold text-gray-900">{item.maintenanceCost}€</span>
                    </div>

                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <QrCodeIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <PhotoIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <EyeIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <PencilIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Vue liste */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interventions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedEquipment.map((item, index) => {
                    const CategoryIcon = getCategoryIcon(item.category);
                    const StatusIcon = getStatusIcon(item.status);
                    return (
                      <motion.tr
                        key={item.id}
                        className="hover:bg-gray-50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CategoryIcon className="w-5 h-5 text-gray-600 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.serialNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 capitalize">{item.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className="w-4 h-4 mr-2" />
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${getStatusColor(item.status)} text-white`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.interventions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.nextMaintenance.toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-gray-500">{item.maintenanceCost}€</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-gray-600 hover:text-blue-600">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-blue-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-orange-600">
                            <WrenchScrewdriverIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal détails équipement */}
      <AnimatePresence>
        {selectedEquipment && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEquipment.name}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${getStatusColor(selectedEquipment.status)} text-white`}>
                        {selectedEquipment.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${getConditionColor(selectedEquipment.condition)}`}>
                        {selectedEquipment.condition}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedEquipment(null)}
                    className="text-gray-600 hover:text-gray-900 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Informations générales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Informations Générales</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Marque & Modèle</label>
                        <p className="text-gray-900">{selectedEquipment.brand} {selectedEquipment.model}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Numéro de série</label>
                        <p className="text-gray-900 font-mono">{selectedEquipment.serialNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Date d'achat</label>
                        <p className="text-gray-900">{selectedEquipment.purchaseDate.toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Fin de garantie</label>
                        <p className="text-gray-900">{selectedEquipment.warrantyEnd.toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">Localisation</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <MapPinIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div>
                          <p className="text-gray-900">{selectedEquipment.location}</p>
                          {selectedEquipment.assignedTo && (
                            <p className="text-sm text-blue-600 mt-1">Assigné à: {selectedEquipment.assignedTo}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spécifications techniques */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Spécifications</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {Object.entries(selectedEquipment.specifications).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </label>
                          <p className="text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedEquipment.documents).map(([doc, available]) => (
                          <div key={doc} className="flex items-center space-x-2">
                            {available ? (
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircleIcon className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-700 capitalize">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Métriques et maintenance */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Métriques d'utilisation</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedEquipment.interventions}</div>
                        <div className="text-sm text-blue-700">Interventions</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedEquipment.hoursWorked}h</div>
                        <div className="text-sm text-green-700">Heures de service</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedEquipment.maintenanceCost}€</div>
                        <div className="text-sm text-orange-700">Coût maintenance</div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">Maintenance</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Dernière maintenance</label>
                        <p className="text-gray-900">{selectedEquipment.lastMaintenance.toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Prochaine maintenance</label>
                        <p className="text-orange-600 font-semibold">{selectedEquipment.nextMaintenance.toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Intervalle</label>
                        <p className="text-gray-900">{selectedEquipment.maintenanceInterval} jours</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Notes</label>
                      <p className="text-gray-900 text-sm mt-1">{selectedEquipment.notes}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedEquipment.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <QrCodeIcon className="w-4 h-4" />
                      <span>QR Code</span>
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                      <DocumentTextIcon className="w-4 h-4" />
                      <span>Documents</span>
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                      <PhotoIcon className="w-4 h-4" />
                      <span>Photos</span>
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                      <WrenchScrewdriverIcon className="w-4 h-4" />
                      <span>Maintenance</span>
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                      <PencilIcon className="w-4 h-4" />
                      <span>Modifier</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Calendrier de Maintenance */}
      <AnimatePresence>
        {showMaintenanceCalendar && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <CalendarDaysIcon className="w-8 h-8 text-orange-500 mr-3" />
                      Calendrier de Maintenance Préventive
                    </h2>
                    <p className="text-gray-600 mt-2">Planification et suivi des maintenances préventives</p>
                  </div>
                  <button 
                    onClick={() => setShowMaintenanceCalendar(false)}
                    className="text-gray-600 hover:text-gray-900 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Maintenances Programmées</h3>
                    <div className="space-y-4">
                      {equipments
                        .filter(eq => eq.maintenanceCalendar?.nextScheduled)
                        .map((equipment, idx) => (
                          equipment.maintenanceCalendar.nextScheduled.map((maintenance, mIdx) => (
                            <motion.div
                              key={`${equipment.id}-${maintenance.id}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (idx * equipment.maintenanceCalendar.nextScheduled.length + mIdx) * 0.1 }}
                              className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border-l-4 border-orange-500"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <CalendarIcon className="w-5 h-5 text-orange-600" />
                                    <span className="font-semibold text-gray-900">
                                      {maintenance.date.toLocaleDateString('fr-FR')}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      maintenance.priority === 'high' ? 'bg-red-100 text-red-700' :
                                      maintenance.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-green-100 text-green-700'
                                    }`}>
                                      {maintenance.priority}
                                    </span>
                                  </div>
                                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{equipment.name}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{maintenance.type}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                      <UserIcon className="w-4 h-4 mr-1" />
                                      {maintenance.technician}
                                    </span>
                                    <span className="flex items-center">
                                      <ClockIcon className="w-4 h-4 mr-1" />
                                      {maintenance.duration}h
                                    </span>
                                    <span className="flex items-center">
                                      <CurrencyEuroIcon className="w-4 h-4 mr-1" />
                                      {maintenance.estimatedCost}€
                                    </span>
                                  </div>
                                  <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-1">Tâches prévues:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {maintenance.tasks.map((task, taskIdx) => (
                                        <span key={taskIdx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                          {task}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    <PencilIcon className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                    <CheckCircleIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ChartBarIcon className="w-5 h-5 text-blue-500 mr-2" />
                        Statistiques
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Maintenances ce mois</span>
                          <span className="font-bold text-blue-600">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coût estimé</span>
                          <span className="font-bold text-green-600">2,450€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taux de conformité</span>
                          <span className="font-bold text-purple-600">98%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Efficacité moyenne</span>
                          <span className="font-bold text-orange-600">95%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <SparklesIcon className="w-5 h-5 text-green-500 mr-2" />
                        Actions Rapides
                      </h3>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Nouvelle maintenance
                        </button>
                        <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                          Rapport mensuel
                        </button>
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          Plan préventif
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Alertes de Garantie */}
      <AnimatePresence>
        {showWarrantyAlerts && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <BellAlertIcon className="w-8 h-8 text-yellow-500 mr-3" />
                      Système d'Alertes & Notifications
                    </h2>
                    <p className="text-gray-600 mt-2">Suivi des garanties et alertes de maintenance</p>
                  </div>
                  <button 
                    onClick={() => setShowWarrantyAlerts(false)}
                    className="text-gray-600 hover:text-gray-900 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Alertes Actives</h3>
                    <div className="space-y-4">
                      {equipments.map((equipment, idx) => 
                        equipment.alerts.map((alert, alertIdx) => (
                          <motion.div
                            key={`${equipment.id}-${alert.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (idx * equipment.alerts.length + alertIdx) * 0.1 }}
                            className={`rounded-xl p-4 border-l-4 ${
                              alert.severity === 'warning' ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-500' :
                              alert.severity === 'info' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500' :
                              'bg-gradient-to-r from-red-50 to-pink-50 border-red-500'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {alert.type === 'maintenance' ? 
                                    <WrenchScrewdriverIcon className="w-5 h-5 text-orange-600" /> :
                                    <ShieldExclamationIcon className="w-5 h-5 text-blue-600" />
                                  }
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    alert.severity === 'warning' ? 'bg-orange-100 text-orange-700' :
                                    alert.severity === 'info' ? 'bg-blue-100 text-blue-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {alert.severity}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    alert.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {alert.priority}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">{equipment.name}</h4>
                                <p className="text-sm text-gray-800 mb-2">{alert.message}</p>
                                <p className="text-xs text-gray-600 mb-2">{alert.action}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <CalendarIcon className="w-4 h-4 mr-1" />
                                    {alert.date.toLocaleDateString('fr-FR')}
                                  </span>
                                  {alert.estimatedCost && (
                                    <span className="flex items-center">
                                      <CurrencyEuroIcon className="w-4 h-4 mr-1" />
                                      {alert.estimatedCost}€
                                    </span>
                                  )}
                                  {alert.technician && (
                                    <span className="flex items-center">
                                      <UserIcon className="w-4 h-4 mr-1" />
                                      {alert.technician}
                                    </span>
                                  )}
                                  {alert.contact && (
                                    <span className="flex items-center">
                                      <PhoneIcon className="w-4 h-4 mr-1" />
                                      {alert.contact}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                  <CheckCircleIcon className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                  <PaperAirplaneIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ShieldExclamationIcon className="w-5 h-5 text-purple-500 mr-2" />
                        Garanties en cours
                      </h3>
                      {equipments
                        .filter(eq => eq.warranty?.active)
                        .map((equipment, idx) => (
                          <motion.div
                            key={equipment.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-lg p-3 mb-3 border border-purple-200"
                          >
                            <h4 className="font-semibold text-gray-900 text-sm">{equipment.name}</h4>
                            <div className="mt-1 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Expire le:</span>
                                <span className="font-medium">{equipment.warranty.endDate.toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium">{equipment.warranty.type}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Fournisseur:</span>
                                <span className="font-medium">{equipment.warranty.provider}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <SparklesIcon className="w-5 h-5 text-green-500 mr-2" />
                        Actions & Notifications
                      </h3>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Configurer alertes
                        </button>
                        <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                          Rapport garanties
                        </button>
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          Extensions disponibles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Galerie Photos */}
      <AnimatePresence>
        {showPhotoGallery && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <PhotoIcon className="w-8 h-8 text-purple-500 mr-3" />
                      Galerie Photos des Équipements
                    </h2>
                    <p className="text-gray-600 mt-2">Gestion complète des photos avec upload et organisation</p>
                  </div>
                  <button 
                    onClick={() => setShowPhotoGallery(false)}
                    className="text-gray-600 hover:text-gray-900 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Photos récentes</h3>
                      <div className="flex space-x-2">
                        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option>Toutes catégories</option>
                          <option>Installation</option>
                          <option>Maintenance</option>
                          <option>Réparations</option>
                          <option>État général</option>
                        </select>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                          <ArrowUpTrayIcon className="w-4 h-4" />
                          <span>Upload</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {equipments.map((equipment) => 
                        equipment.photos.map((photo, photoIdx) => (
                          <motion.div
                            key={`${equipment.id}-${photo.id}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: photoIdx * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative group cursor-pointer"
                          >
                            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden shadow-lg">
                              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                                <CameraIcon className="w-12 h-12 text-white opacity-60" />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                  <EyeIcon className="w-8 h-8 mx-auto mb-2" />
                                  <p className="text-sm font-medium">Voir</p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="font-medium text-gray-900 text-sm truncate">{photo.caption}</p>
                              <p className="text-xs text-gray-500">{equipment.name}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-400">{photo.date.toLocaleDateString('fr-FR')}</span>
                                <div className="flex space-x-1">
                                  {photo.tags.map((tag, tagIdx) => (
                                    <span key={tagIdx} className="px-1 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ChartBarIcon className="w-5 h-5 text-purple-500 mr-2" />
                        Statistiques
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total photos</span>
                          <span className="font-bold text-purple-600">142</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ce mois</span>
                          <span className="font-bold text-green-600">28</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stockage utilisé</span>
                          <span className="font-bold text-orange-600">125 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Catégories</span>
                          <span className="font-bold text-blue-600">4</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TagIcon className="w-5 h-5 text-blue-500 mr-2" />
                        Tags populaires
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {['installation', 'maintenance', 'avant', 'après', 'défaut', 'réparation', 'inspection'].map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <SparklesIcon className="w-5 h-5 text-green-500 mr-2" />
                        Actions
                      </h3>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Nouveau dossier
                        </button>
                        <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                          Exporter sélection
                        </button>
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          Rapport photos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Documentation Technique */}
      <AnimatePresence>
        {showTechnicalDocs && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <DocumentTextIcon className="w-8 h-8 text-indigo-500 mr-3" />
                      Documentation Technique avec Versioning
                    </h2>
                    <p className="text-gray-600 mt-2">Gestion complète des documents avec suivi des versions</p>
                  </div>
                  <button 
                    onClick={() => setShowTechnicalDocs(false)}
                    className="text-gray-600 hover:text-gray-900 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Documents</h3>
                      <div className="flex space-x-2">
                        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>Toutes catégories</option>
                          <option>Manuel</option>
                          <option>Technique</option>
                          <option>Maintenance</option>
                          <option>Garantie</option>
                          <option>Facture</option>
                        </select>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                          <ArrowUpTrayIcon className="w-4 h-4" />
                          <span>Upload</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {equipments.map((equipment) => 
                        equipment.documents.map((doc, docIdx) => (
                          <motion.div
                            key={`${equipment.id}-${doc.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: docIdx * 0.05 }}
                            className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                  <DocumentTextIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      doc.status === 'current' ? 'bg-green-100 text-green-700' :
                                      doc.status === 'archived' ? 'bg-gray-100 text-gray-700' :
                                      'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      v{doc.version}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      doc.status === 'current' ? 'bg-blue-100 text-blue-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {doc.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{equipment.name} - {doc.category}</p>
                                  <p className="text-xs text-gray-500 mb-2">{doc.description}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span className="flex items-center">
                                      <ArchiveBoxIcon className="w-3 h-3 mr-1" />
                                      {doc.size}
                                    </span>
                                    <span className="flex items-center">
                                      <CalendarIcon className="w-3 h-3 mr-1" />
                                      {doc.lastModified.toLocaleDateString('fr-FR')}
                                    </span>
                                    <span className="flex items-center">
                                      <UserIcon className="w-3 h-3 mr-1" />
                                      {doc.uploadedBy}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                  <EyeIcon className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                  <ArrowDownTrayIcon className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                  <ArrowPathIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ChartBarIcon className="w-5 h-5 text-indigo-500 mr-2" />
                        Statistiques
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total documents</span>
                          <span className="font-bold text-indigo-600">47</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Versions actives</span>
                          <span className="font-bold text-green-600">34</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Archivés</span>
                          <span className="font-bold text-gray-600">13</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Espace utilisé</span>
                          <span className="font-bold text-orange-600">456 MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ArrowPathIcon className="w-5 h-5 text-green-500 mr-2" />
                        Versioning
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Suivi automatique</span>
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sauvegarde cloud</span>
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Historique complet</span>
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <SparklesIcon className="w-5 h-5 text-purple-500 mr-2" />
                        Actions
                      </h3>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Nouvelle version
                        </button>
                        <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                          Archive ancienne
                        </button>
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          Rapport versioning
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default EquipementsUltraPremium;