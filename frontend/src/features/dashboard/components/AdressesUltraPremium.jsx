import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  StarIcon,
  HeartIcon,
  BuildingOfficeIcon,
  HomeIcon,
  TruckIcon,
  CreditCardIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  TagIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  FolderIcon,
  ArchiveBoxIcon,
  ShieldCheckIcon,
  LinkIcon,
  MapIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  CalculatorIcon,
  RocketLaunchIcon,
  WifiIcon,
  SignalIcon,
  UserPlusIcon,
  DocumentCheckIcon,
  CheckBadgeIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';

const AdressesUltraPremium = () => {
  const { theme, getClasses } = useThemeUltraPremium();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showZonesModal, setShowZonesModal] = useState(false);
  const [showMultiAddressModal, setShowMultiAddressModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [geocodingResults, setGeocodingResults] = useState(null);
  const [itineraryData, setItineraryData] = useState(null);
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [multiAddresses, setMultiAddresses] = useState({});

  // Données simulées d'adresses enrichies
  const [addresses, setAddresses] = useState([
    {
      id: 'ADR001',
      clientId: 'CLT001',
      name: 'Mairie de Lyon',
      type: 'professionnel',
      category: 'institution',
      address: '1 Place de la Comédie, 69001 Lyon',
      coordinates: { lat: 45.7640, lng: 4.8357 },
      phone: '04 72 10 30 30',
      email: 'contact@mairie-lyon.fr',
      website: 'https://www.lyon.fr',
      contact: {
        name: 'M. Pierre Dubois',
        title: 'Responsable des espaces verts',
        directPhone: '04 72 10 31 45',
        email: 'p.dubois@mairie-lyon.fr'
      },
      details: {
        siren: '21690123400019',
        category: 'Collectivité',
        employees: 'Plus de 1000',
        budget: 'Public'
      },
      tags: ['vip', 'institution', 'contrat-annuel'],
      favorite: true,
      lastContact: new Date('2024-08-10'),
      notes: 'Client prioritaire, contrat d\'entretien annuel des parcs municipaux',
      status: 'active',
      revenue: 150000,
      interventions: 24,
      validated: true,
      validationDate: new Date('2024-01-15'),
      zoneId: 'ZONE_A',
      accessibilite: {
        camion: true,
        remorque: true,
        horairesAcces: '7h-18h',
        codeAcces: '1234A',
        restrictions: []
      },
      isMainAddress: true,
      addressType: 'siege'
    },
    {
      id: 'ADR002',
      clientId: 'CLT002',
      name: 'Villa Beausoleil',
      type: 'livraison',
      category: 'particulier',
      address: '47 Avenue des Roses, 69006 Lyon',
      coordinates: { lat: 45.7700, lng: 4.8500 },
      phone: '06 12 34 56 78',
      email: 'villa.beausoleil@gmail.com',
      contact: {
        name: 'Mme Sophie Martin',
        title: 'Propriétaire',
        directPhone: '06 12 34 56 78',
        email: 'sophie.martin@email.com'
      },
      details: {
        surface: '2500m²',
        style: 'Jardin à la française',
        piscine: true,
        accessDifficult: false
      },
      tags: ['premium', 'jardin-francais', 'piscine'],
      favorite: false,
      lastContact: new Date('2024-08-08'),
      notes: 'Jardin historique nécessitant un entretien spécialisé',
      status: 'active',
      revenue: 28500,
      interventions: 12,
      validated: true,
      validationDate: new Date('2024-03-20'),
      zoneId: 'ZONE_B',
      accessibilite: {
        camion: false,
        remorque: false,
        horairesAcces: '9h-17h',
        codeAcces: '',
        restrictions: ['Stationnement difficile', 'Accès par portail étroit']
      },
      isMainAddress: true,
      addressType: 'domicile'
    },
    {
      id: 'ADR002B',
      clientId: 'CLT002',
      name: 'Villa Beausoleil - Résidence secondaire',
      type: 'livraison',
      category: 'particulier',
      address: '15 Chemin des Collines, 69450 Saint-Cyr-au-Mont-d\'Or',
      coordinates: { lat: 45.8150, lng: 4.8200 },
      phone: '06 12 34 56 78',
      email: 'villa.beausoleil@gmail.com',
      contact: {
        name: 'Mme Sophie Martin',
        title: 'Propriétaire',
        directPhone: '06 12 34 56 78',
        email: 'sophie.martin@email.com'
      },
      details: {
        surface: '1800m²',
        style: 'Jardin moderne',
        piscine: false,
        accessDifficult: false
      },
      tags: ['premium', 'residence-secondaire'],
      favorite: false,
      lastContact: new Date('2024-08-08'),
      notes: 'Résidence secondaire, entretien mensuel en saison',
      status: 'active',
      revenue: 15000,
      interventions: 6,
      validated: true,
      validationDate: new Date('2024-04-10'),
      zoneId: 'ZONE_C',
      accessibilite: {
        camion: true,
        remorque: true,
        horairesAcces: 'Libre',
        codeAcces: '',
        restrictions: []
      },
      isMainAddress: false,
      addressType: 'residence-secondaire'
    },
    {
      id: 'ADR003',
      clientId: 'CLT003',
      name: 'TechCorp Solutions',
      type: 'facturation',
      category: 'entreprise',
      address: '156 Avenue de l\'Innovation, 69007 Lyon',
      coordinates: { lat: 45.7485, lng: 4.8467 },
      phone: '04 78 12 34 56',
      email: 'contact@techcorp.com',
      website: 'https://techcorp.com',
      contact: {
        name: 'M. Alexandre Durand',
        title: 'Facility Manager',
        directPhone: '04 78 12 35 89',
        email: 'a.durand@techcorp.com'
      },
      details: {
        siren: '12345678901234',
        employees: '500-1000',
        secteur: 'Technologies',
        chiffreAffaires: '50M€+'
      },
      tags: ['tech', 'moderne', 'eco-responsable'],
      favorite: true,
      lastContact: new Date('2024-08-09'),
      notes: 'Espaces verts high-tech avec capteurs IoT et arrosage intelligent',
      status: 'active',
      revenue: 75000,
      interventions: 18,
      validated: false,
      validationDate: null,
      zoneId: 'ZONE_A',
      accessibilite: {
        camion: true,
        remorque: true,
        horairesAcces: '8h-19h',
        codeAcces: 'TECH2024',
        restrictions: ['Badge obligatoire']
      },
      isMainAddress: true,
      addressType: 'siege'
    }
  ]);

  // Zones de livraison prédéfinies
  const predefinedZones = [
    {
      id: 'ZONE_A',
      name: 'Centre-ville',
      color: '#3B82F6',
      polygon: [[45.750, 4.820], [45.750, 4.850], [45.770, 4.850], [45.770, 4.820]],
      tarifKm: 2.5,
      tempsEstime: '15-30 min',
      restrictions: ['Livraison avant 10h', 'Pas de weekend']
    },
    {
      id: 'ZONE_B',
      name: 'Périphérie Est',
      color: '#10B981',
      polygon: [[45.760, 4.850], [45.760, 4.880], [45.780, 4.880], [45.780, 4.850]],
      tarifKm: 3.0,
      tempsEstime: '30-45 min',
      restrictions: []
    },
    {
      id: 'ZONE_C',
      name: 'Zone Nord',
      color: '#F59E0B',
      polygon: [[45.780, 4.800], [45.780, 4.850], [45.820, 4.850], [45.820, 4.800]],
      tarifKm: 3.5,
      tempsEstime: '45-60 min',
      restrictions: ['Supplément weekend']
    },
    {
      id: 'ZONE_D',
      name: 'Zone Sud',
      color: '#EF4444',
      polygon: [[45.720, 4.820], [45.720, 4.870], [45.750, 4.870], [45.750, 4.820]],
      tarifKm: 3.0,
      tempsEstime: '30-45 min',
      restrictions: []
    }
  ];

  // Validation d'adresse postale
  const validateAddress = async (address) => {
    // Simulation de validation avec l'API de La Poste ou Google Maps
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = [
          {
            address: address.address,
            normalized: address.address.toUpperCase(),
            score: 0.95,
            isValid: true,
            components: {
              numero: '1',
              voie: 'Place de la Comédie',
              codePostal: '69001',
              ville: 'Lyon',
              pays: 'France'
            },
            corrections: []
          },
          {
            address: '1 Place de la Comédie, 69001 Lyon, France',
            normalized: '1 PLACE DE LA COMEDIE, 69001 LYON, FRANCE',
            score: 1.0,
            isValid: true,
            components: {
              numero: '1',
              voie: 'Place de la Comédie',
              codePostal: '69001',
              ville: 'Lyon',
              pays: 'France'
            },
            corrections: ['Ajout du pays']
          }
        ];
        resolve(suggestions);
      }, 1000);
    });
  };

  // Géocodage automatique
  const geocodeAddress = async (address) => {
    // Simulation d'appel à l'API Nominatim d'OpenStreetMap
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          lat: 45.7640 + (Math.random() - 0.5) * 0.01,
          lng: 4.8357 + (Math.random() - 0.5) * 0.01,
          display_name: address,
          confidence: 0.98,
          bbox: {
            north: 45.7650,
            south: 45.7630,
            east: 4.8367,
            west: 4.8347
          },
          osm_id: '123456789',
          place_rank: 30
        };
        resolve(result);
      }, 800);
    });
  };

  // Calcul d'itinéraire
  const calculateItinerary = async (origin, destination) => {
    // Simulation d'appel à l'API de routage (OSRM, GraphHopper, etc.)
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {
          distance: Math.random() * 20 + 5, // km
          duration: Math.random() * 45 + 15, // minutes
          routes: [
            {
              name: 'Route principale',
              distance: Math.random() * 20 + 5,
              duration: Math.random() * 45 + 15,
              steps: [
                { instruction: 'Départ de votre position', distance: 0 },
                { instruction: 'Prendre l\'Avenue de la République', distance: 2.3 },
                { instruction: 'Tourner à droite sur le Boulevard des Belges', distance: 4.5 },
                { instruction: 'Continuer sur la Rue de la Part-Dieu', distance: 3.2 },
                { instruction: 'Arrivée à destination', distance: 0 }
              ],
              polyline: 'encoded_polyline_string',
              traffic: 'moderate',
              toll: false
            },
            {
              name: 'Route alternative',
              distance: Math.random() * 20 + 7,
              duration: Math.random() * 45 + 20,
              steps: [
                { instruction: 'Départ de votre position', distance: 0 },
                { instruction: 'Prendre l\'autoroute A6', distance: 5.5 },
                { instruction: 'Sortie 39 vers Lyon Centre', distance: 8.2 },
                { instruction: 'Arrivée à destination', distance: 0 }
              ],
              polyline: 'encoded_polyline_string_alt',
              traffic: 'light',
              toll: true
            }
          ],
          fuelCost: ((Math.random() * 20 + 5) * 0.15 * 1.5).toFixed(2), // Estimation carburant
          co2Emission: ((Math.random() * 20 + 5) * 0.12).toFixed(2) // kg CO2
        };
        resolve(result);
      }, 1500);
    });
  };

  // Gestion des zones de livraison
  const assignZone = (coordinates) => {
    // Déterminer la zone basée sur les coordonnées
    for (const zone of predefinedZones) {
      // Simplification: vérification basique des coordonnées
      if (coordinates.lat >= zone.polygon[0][0] && coordinates.lat <= zone.polygon[2][0] &&
          coordinates.lng >= zone.polygon[0][1] && coordinates.lng <= zone.polygon[1][1]) {
        return zone.id;
      }
    }
    return 'ZONE_A'; // Zone par défaut
  };

  // Handler pour valider une adresse
  const handleValidateAddress = async (address) => {
    const results = await validateAddress(address);
    setValidationResults(results);
    setShowValidationModal(true);
  };

  // Handler pour géocoder une adresse
  const handleGeocode = async (address) => {
    const result = await geocodeAddress(address.address);
    const updatedAddress = {
      ...address,
      coordinates: { lat: result.lat, lng: result.lng },
      validated: true,
      validationDate: new Date()
    };
    
    setAddresses(prev => prev.map(a => a.id === address.id ? updatedAddress : a));
    setGeocodingResults(result);
    toast.success('Adresse géocodée avec succès');
  };

  // Handler pour calculer un itinéraire
  const handleCalculateItinerary = async (destination) => {
    // Position actuelle simulée (siège de l'entreprise)
    const origin = { lat: 45.7640, lng: 4.8357 };
    const result = await calculateItinerary(origin, destination.coordinates);
    setItineraryData({ destination, ...result });
    setShowItineraryModal(true);
  };

  // Handler pour gérer les multi-adresses
  const handleAddMultiAddress = (clientId, newAddress) => {
    const addressId = `ADR_${Date.now()}`;
    const addressWithId = {
      ...newAddress,
      id: addressId,
      clientId,
      isMainAddress: false,
      validated: false,
      zoneId: assignZone(newAddress.coordinates || { lat: 45.7640, lng: 4.8357 })
    };
    
    setAddresses(prev => [...prev, addressWithId]);
    setMultiAddresses(prev => ({
      ...prev,
      [clientId]: [...(prev[clientId] || []), addressId]
    }));
    
    toast.success('Adresse ajoutée avec succès');
  };

  // Filtrage et tri
  const filteredAddresses = addresses.filter(address => {
    const matchesSearch = !searchTerm || 
      address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || address.category === selectedCategory;
    const matchesTag = selectedTag === 'all' || address.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  const sortedAddresses = [...filteredAddresses].sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'revenue': return b.revenue - a.revenue;
      case 'lastContact': return new Date(b.lastContact) - new Date(a.lastContact);
      case 'interventions': return b.interventions - a.interventions;
      case 'zone': return (a.zoneId || '').localeCompare(b.zoneId || '');
      case 'validation': return (b.validated ? 1 : 0) - (a.validated ? 1 : 0);
      default: return 0;
    }
  });

  // Statistiques enrichies
  const stats = {
    total: addresses.length,
    favorites: addresses.filter(a => a.favorite).length,
    active: addresses.filter(a => a.status === 'active').length,
    revenue: addresses.reduce((sum, a) => sum + a.revenue, 0),
    interventions: addresses.reduce((sum, a) => sum + a.interventions, 0),
    validated: addresses.filter(a => a.validated).length,
    multiAddress: Object.keys(multiAddresses).length,
    zones: predefinedZones.length
  };

  // Grouper les adresses par client
  const addressesByClient = addresses.reduce((acc, addr) => {
    if (!acc[addr.clientId]) {
      acc[addr.clientId] = [];
    }
    acc[addr.clientId].push(addr);
    return acc;
  }, {});

  const getTypeIcon = (type) => {
    switch(type) {
      case 'professionnel': return BuildingOfficeIcon;
      case 'livraison': return TruckIcon;
      case 'facturation': return CreditCardIcon;
      default: return HomeIcon;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'institution': return 'from-blue-500 to-blue-600';
      case 'entreprise': return 'from-green-500 to-green-600';
      case 'particulier': return 'from-purple-500 to-purple-600';
      case 'syndic': return 'from-orange-500 to-orange-600';
      case 'commercial': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Nom', 'Type', 'Catégorie', 'Adresse', 'Téléphone', 'Email', 'Contact', 'CA', 'Interventions', 'Validée', 'Zone'].join(','),
      ...sortedAddresses.map(addr => [
        addr.name,
        addr.type,
        addr.category,
        addr.address,
        addr.phone,
        addr.email,
        addr.contact.name,
        addr.revenue,
        addr.interventions,
        addr.validated ? 'Oui' : 'Non',
        addr.zoneId || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carnet-adresses.csv';
    a.click();
  };

  return (
    <UltraPremiumContainer
      title="Carnet d'Adresses Quantum"
      icon={MapPinIcon}
    >
      <div className="space-y-6">
        {/* En-tête avec statistiques enrichies */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <motion.div 
            className={`${getClasses().card} bg-gradient-to-br from-blue-500 to-blue-600 text-white`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
              <UserGroupIcon className="w-6 h-6 text-blue-200" />
            </div>
          </motion.div>

          <motion.div 
            className={`${getClasses().card} bg-gradient-to-br from-yellow-500 to-yellow-600 text-white`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs">Favoris</p>
                <p className="text-xl font-bold">{stats.favorites}</p>
              </div>
              <StarIcon className="w-6 h-6 text-yellow-200" />
            </div>
          </motion.div>

          <motion.div 
            className={`${getClasses().card} bg-gradient-to-br from-green-500 to-green-600 text-white`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Validées</p>
                <p className="text-xl font-bold">{stats.validated}</p>
              </div>
              <CheckBadgeIcon className="w-6 h-6 text-green-200" />
            </div>
          </motion.div>

          <motion.div 
            className={`${getClasses().card} bg-gradient-to-br from-purple-500 to-purple-600 text-white`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs">CA Total</p>
                <p className="text-xl font-bold">{(stats.revenue/1000).toFixed(0)}K€</p>
              </div>
              <CreditCardIcon className="w-6 h-6 text-purple-200" />
            </div>
          </motion.div>

          <motion.div 
            className={`${getClasses().card} bg-gradient-to-br from-indigo-500 to-indigo-600 text-white`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs">Interventions</p>
                <p className="text-xl font-bold">{stats.interventions}</p>
              </div>
              <BoltIcon className="w-6 h-6 text-indigo-200" />
            </div>
          </motion.div>

          <motion.div 
            className={`${getClasses().card} bg-gradient-to-br from-pink-500 to-pink-600 text-white`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-xs">Multi-adresses</p>
                <p className="text-xl font-bold">{stats.multiAddress}</p>
              </div>
              <LinkIcon className="w-6 h-6 text-pink-200" />
            </div>
          </motion.div>

          <motion.div 
            className={`${getClasses().card} bg-gradient-to-br from-cyan-500 to-cyan-600 text-white`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-xs">Zones</p>
                <p className="text-xl font-bold">{stats.zones}</p>
              </div>
              <MapIcon className="w-6 h-6 text-cyan-200" />
            </div>
          </motion.div>

          <motion.div 
            className={`${getClasses().card} bg-gradient-to-br from-orange-500 to-orange-600 text-white`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs">Actifs</p>
                <p className="text-xl font-bold">{stats.active}</p>
              </div>
              <CheckCircleIcon className="w-6 h-6 text-orange-200" />
            </div>
          </motion.div>
        </div>

        {/* Barre d'outils enrichie */}
        <div className={`${getClasses().card} ${getClasses().cardHover}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Recherche */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, adresse, contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={getClasses().input}
                />
              </div>

              {/* Filtres */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={getClasses().select}
              >
                <option value="all">Toutes catégories</option>
                <option value="institution">Institutions</option>
                <option value="entreprise">Entreprises</option>
                <option value="particulier">Particuliers</option>
                <option value="syndic">Syndics</option>
                <option value="commercial">Commercial</option>
              </select>

              <select 
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className={getClasses().select}
              >
                <option value="all">Tous tags</option>
                <option value="vip">VIP</option>
                <option value="premium">Premium</option>
                <option value="contrat-annuel">Contrat annuel</option>
                <option value="historique">Historique</option>
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={getClasses().select}
              >
                <option value="name">Nom</option>
                <option value="revenue">Chiffre d'affaires</option>
                <option value="lastContact">Dernier contact</option>
                <option value="interventions">Interventions</option>
                <option value="zone">Zone de livraison</option>
                <option value="validation">Statut validation</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  Grille
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  Liste
                </button>
              </div>

              <button 
                onClick={() => setShowMapView(!showMapView)}
                className={`p-2 rounded-lg transition-colors ${showMapView ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                title="Vue carte"
              >
                <GlobeAltIcon className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setShowZonesModal(true)}
                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                title="Gérer les zones"
              >
                <MapIcon className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setShowMultiAddressModal(true)}
                className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                title="Multi-adresses"
              >
                <LinkIcon className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setShowAddModal(true)}
                className={`${getClasses().button} ${getClasses().buttonPrimary} flex items-center space-x-2`}
              >
                <PlusIcon className="w-5 h-5" />
                <span>Ajouter</span>
              </button>

              <button 
                onClick={exportToCSV}
                className={`${getClasses().button} bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2`}
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vue en grille enrichie */}
        {viewMode === 'grid' && !showMapView && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAddresses.map((address) => {
              const TypeIcon = getTypeIcon(address.type);
              const zone = predefinedZones.find(z => z.id === address.zoneId);
              const relatedAddresses = addressesByClient[address.clientId]?.filter(a => a.id !== address.id) || [];
              
              return (
                <motion.div
                  key={address.id}
                  className={`${getClasses().card} ${getClasses().cardHover} overflow-hidden cursor-pointer`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedAddress(address)}
                >
                  {/* Header avec gradient et zone */}
                  <div className="relative">
                    <div className={`h-2 bg-gradient-to-r ${getCategoryColor(address.category)}`} />
                    {zone && (
                      <div 
                        className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: zone.color }}
                      >
                        {zone.name}
                      </div>
                    )}
                  </div>
                  
                  {/* En-tête de la carte */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <TypeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{address.type}</span>
                          <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getCategoryColor(address.category)} text-white`}>
                            {address.category}
                          </span>
                          {address.validated && (
                            <CheckBadgeIcon className="w-4 h-4 text-green-500" title="Adresse validée" />
                          )}
                          {!address.isMainAddress && (
                            <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                              Secondaire
                            </span>
                          )}
                        </div>
                        <h3 className={getClasses().text}>{address.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {address.address}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        {address.favorite && (
                          <StarIcon className="w-5 h-5 text-yellow-500 fill-current" />
                        )}
                        <div className={`w-3 h-3 rounded-full ${address.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`} />
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${getClasses().text}`}>{address.contact.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{address.contact.title}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <PhoneIcon className="w-4 h-4" />
                          <span>{address.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <EnvelopeIcon className="w-4 h-4" />
                          <span className="truncate">{address.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Métriques et informations supplémentaires */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-2xl font-bold ${getClasses().text}`}>
                          {address.revenue > 0 ? `${(address.revenue/1000).toFixed(0)}K€` : 'Prospect'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">CA annuel</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getClasses().text}`}>{address.interventions}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Interventions</div>
                      </div>
                    </div>

                    {/* Accessibilité */}
                    {address.accessibilite && (
                      <div className="flex items-center space-x-2 text-xs">
                        {address.accessibilite.camion && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            <TruckIcon className="w-3 h-3 inline mr-1" />
                            Camion
                          </span>
                        )}
                        {address.accessibilite.restrictions.length > 0 && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                            <ExclamationTriangleIcon className="w-3 h-3 inline mr-1" />
                            Restrictions
                          </span>
                        )}
                      </div>
                    )}

                    {/* Multi-adresses */}
                    {relatedAddresses.length > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          <LinkIcon className="w-4 h-4 inline mr-1" />
                          {relatedAddresses.length} autre(s) adresse(s)
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>Dernier contact: {address.lastContact.toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {address.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {address.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {address.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            +{address.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                    <button 
                      className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleValidateAddress(address);
                      }}
                      title="Valider l'adresse"
                    >
                      <CheckBadgeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button 
                      className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGeocode(address);
                      }}
                      title="Géocoder"
                    >
                      <MapPinIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button 
                      className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCalculateItinerary(address);
                      }}
                      title="Calculer itinéraire"
                    >
                      <TruckIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <EyeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <PencilIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Vue liste enrichie */}
        {viewMode === 'list' && !showMapView && (
          <div className={`${getClasses().card} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Adresse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Zone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Validation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedAddresses.map((address) => {
                    const TypeIcon = getTypeIcon(address.type);
                    const zone = predefinedZones.find(z => z.id === address.zoneId);
                    return (
                      <motion.tr
                        key={address.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {address.favorite && (
                              <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-2" />
                            )}
                            <div>
                              <div className={`text-sm font-medium ${getClasses().text}`}>{address.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{address.contact.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <TypeIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">{address.type}</span>
                          </div>
                          <div className={`mt-1 px-2 py-1 text-xs rounded-full inline-block bg-gradient-to-r ${getCategoryColor(address.category)} text-white`}>
                            {address.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {address.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {zone && (
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: zone.color }}
                            >
                              {zone.name}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {address.revenue > 0 ? `${(address.revenue/1000).toFixed(0)}K€` : 'Prospect'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {address.validated ? (
                            <CheckBadgeIcon className="w-5 h-5 text-green-500" title="Validée" />
                          ) : (
                            <ExclamationCircleIcon className="w-5 h-5 text-orange-500" title="Non validée" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => handleValidateAddress(address)}
                          >
                            <CheckBadgeIcon className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => handleCalculateItinerary(address)}
                          >
                            <TruckIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                            <PencilIcon className="w-4 h-4" />
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

        {/* Vue Carte améliorée */}
        {showMapView && (
          <motion.div 
            className={`${getClasses().card} h-96`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${getClasses().text}`}>Géolocalisation des Adresses avec Zones</h3>
              <button 
                onClick={() => setShowMapView(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg h-full flex items-center justify-center">
              <div className="text-center">
                <GlobeAltIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className={`text-lg mb-2 ${getClasses().text}`}>Carte Interactive avec Zones</p>
                <p className="text-gray-500 dark:text-gray-400">Affichage de {sortedAddresses.length} adresses</p>
                
                {/* Légende des zones */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {predefinedZones.map(zone => {
                    const addressCount = sortedAddresses.filter(a => a.zoneId === zone.id).length;
                    return (
                      <div key={zone.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div 
                          className="w-4 h-4 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: zone.color }}
                        />
                        <div className="text-sm font-medium">{zone.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{addressCount} adresses</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{zone.tarifKm}€/km</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal validation d'adresse */}
      <AnimatePresence>
        {showValidationModal && validationResults && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`${getClasses().card} max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${getClasses().text}`}>Validation d'Adresse</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Résultats de la validation postale</p>
                  </div>
                  <button 
                    onClick={() => setShowValidationModal(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {validationResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {result.isValid ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            ) : (
                              <ExclamationCircleIcon className="w-5 h-5 text-orange-500" />
                            )}
                            <span className={`font-medium ${getClasses().text}`}>
                              Score de confiance: {(result.score * 100).toFixed(0)}%
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Adresse normalisée:</strong> {result.normalized}</p>
                            <p className="mt-2"><strong>Composants:</strong></p>
                            <ul className="ml-4 mt-1 space-y-1">
                              <li>Numéro: {result.components.numero}</li>
                              <li>Voie: {result.components.voie}</li>
                              <li>Code postal: {result.components.codePostal}</li>
                              <li>Ville: {result.components.ville}</li>
                              <li>Pays: {result.components.pays}</li>
                            </ul>
                            
                            {result.corrections.length > 0 && (
                              <div className="mt-2">
                                <p><strong>Corrections suggérées:</strong></p>
                                <ul className="ml-4 mt-1 space-y-1">
                                  {result.corrections.map((correction, i) => (
                                    <li key={i} className="text-orange-600 dark:text-orange-400">• {correction}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          className={`${getClasses().button} ${getClasses().buttonPrimary} ml-4`}
                          onClick={() => {
                            // Appliquer la validation
                            toast.success('Adresse validée et mise à jour');
                            setShowValidationModal(false);
                          }}
                        >
                          Appliquer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal calcul d'itinéraire */}
      <AnimatePresence>
        {showItineraryModal && itineraryData && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`${getClasses().card} max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${getClasses().text}`}>Calcul d'Itinéraire</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Destination: {itineraryData.destination.name}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowItineraryModal(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itineraryData.routes.map((route, index) => (
                    <div key={index} className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-semibold ${getClasses().text}`}>{route.name}</h3>
                        {route.toll && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            Péage
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Distance</div>
                          <div className="text-lg font-semibold">{route.distance.toFixed(1)} km</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Durée</div>
                          <div className="text-lg font-semibold">{Math.round(route.duration)} min</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Étapes:</div>
                        {route.steps.map((step, i) => (
                          <div key={i} className="flex items-start space-x-2 text-sm">
                            <span className="text-gray-400">{i + 1}.</span>
                            <span className={getClasses().text}>{step.instruction}</span>
                            {step.distance > 0 && (
                              <span className="text-gray-500 dark:text-gray-400 ml-auto">
                                {step.distance} km
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>
                          Trafic: 
                          <span className={`ml-1 font-medium ${
                            route.traffic === 'light' ? 'text-green-600' :
                            route.traffic === 'moderate' ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {route.traffic === 'light' ? 'Fluide' :
                             route.traffic === 'moderate' ? 'Modéré' :
                             'Dense'}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Coût carburant estimé</div>
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {itineraryData.fuelCost}€
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Émissions CO2</div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {itineraryData.co2Emission} kg
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    className={`${getClasses().button} bg-gray-200 hover:bg-gray-300 text-gray-800`}
                    onClick={() => setShowItineraryModal(false)}
                  >
                    Fermer
                  </button>
                  <button className={`${getClasses().button} ${getClasses().buttonPrimary}`}>
                    Lancer navigation
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal gestion des zones de livraison */}
      <AnimatePresence>
        {showZonesModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`${getClasses().card} max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${getClasses().text}`}>Gestion des Zones de Livraison</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Configurez les zones et leurs tarifs
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowZonesModal(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {predefinedZones.map(zone => {
                    const addressCount = addresses.filter(a => a.zoneId === zone.id).length;
                    return (
                      <div key={zone.id} className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: zone.color }}
                            />
                            <h3 className={`font-semibold ${getClasses().text}`}>{zone.name}</h3>
                          </div>
                          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Adresses:</span>
                            <span className={getClasses().text}>{addressCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Tarif/km:</span>
                            <span className={getClasses().text}>{zone.tarifKm}€</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Temps estimé:</span>
                            <span className={getClasses().text}>{zone.tempsEstime}</span>
                          </div>
                        </div>
                        
                        {zone.restrictions.length > 0 && (
                          <div className="mt-3 pt-3 border-t dark:border-gray-700">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Restrictions:</div>
                            <div className="flex flex-wrap gap-1">
                              {zone.restrictions.map((restriction, i) => (
                                <span key={i} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs rounded">
                                  {restriction}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between items-center">
                  <button className={`${getClasses().button} bg-green-600 hover:bg-green-700 text-white`}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nouvelle zone
                  </button>
                  <button 
                    className={`${getClasses().button} ${getClasses().buttonPrimary}`}
                    onClick={() => setShowZonesModal(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal multi-adresses */}
      <AnimatePresence>
        {showMultiAddressModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`${getClasses().card} max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${getClasses().text}`}>Gestion Multi-Adresses</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Gérez les multiples adresses par client
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowMultiAddressModal(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {Object.entries(addressesByClient).map(([clientId, clientAddresses]) => {
                    if (clientAddresses.length <= 1) return null;
                    
                    return (
                      <div key={clientId} className="border rounded-lg p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`font-semibold ${getClasses().text}`}>
                            {clientAddresses[0].name.split(' - ')[0]}
                          </h3>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full">
                            {clientAddresses.length} adresses
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {clientAddresses.map(addr => (
                            <div key={addr.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  {addr.isMainAddress && (
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded">
                                      Principale
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {addr.addressType}
                                  </span>
                                </div>
                                <p className={`text-sm ${getClasses().text}`}>{addr.address}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                                  <span>Zone: {addr.zoneId}</span>
                                  {addr.validated && (
                                    <span className="flex items-center text-green-600 dark:text-green-400">
                                      <CheckBadgeIcon className="w-3 h-3 mr-1" />
                                      Validée
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                  <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                {!addr.isMainAddress && (
                                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                    <TrashIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          + Ajouter une adresse
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    className={`${getClasses().button} ${getClasses().buttonPrimary}`}
                    onClick={() => setShowMultiAddressModal(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default AdressesUltraPremium;