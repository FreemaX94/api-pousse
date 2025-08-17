import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const DevisUltraPremium = () => {
  const { getClasses } = useThemeUltraPremium();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-07-01',
    endDate: '2025-07-31'
  });
  const [activeTag, setActiveTag] = useState('Tout');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [selectedDevis, setSelectedDevis] = useState(null);

  // Mock data pour les devis avec des données enrichies
  const [devisList] = useState([
    {
      id: 1,
      numero: 'D202519553',
      dateCreation: '2025-07-18',
      categories: ['Abonnement', 'Premium'],
      statut: 'En cours',
      planifie: false,
      client: { nom: 'Sandra Azoura', id: 1, logo: '🏢' },
      auteur: 'Simon Henry',
      prive: false,
      envoye: true,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 300.00,
      montantTTC: 360.00,
      progression: 65,
      priorite: 'Normal'
    },
    {
      id: 2,
      numero: 'D202519551',
      dateCreation: '2025-07-17',
      categories: ['Achat + Entretien', 'Urgence'],
      statut: 'Accepté',
      planifie: true,
      datePlanification: '2025-08-01',
      client: { nom: 'Nolita', id: 2, logo: '🌟' },
      auteur: 'Marie Dubois',
      prive: false,
      envoye: true,
      demandeFacturation: 'Oui',
      etatFacturation: 'En attente',
      montantHT: 552.00,
      montantTTC: 662.40,
      progression: 90,
      priorite: 'Haut'
    },
    {
      id: 3,
      numero: 'D202519549',
      dateCreation: '2025-07-16',
      categories: ['Contrat', 'Enterprise'],
      statut: 'Refusé',
      planifie: false,
      client: { nom: 'CREDIT MUTUEL', id: 3, logo: '🏦' },
      auteur: 'Pierre Martin',
      prive: true,
      envoye: false,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 1250.00,
      montantTTC: 1500.00,
      progression: 25,
      priorite: 'Faible'
    },
    {
      id: 4,
      numero: 'D202519547',
      dateCreation: '2025-07-15',
      categories: ['Conseil', 'Expertise'],
      statut: 'En attente',
      planifie: false,
      client: { nom: 'BNP PARIBAS', id: 4, logo: '💼' },
      auteur: 'Sophie Leroy',
      prive: false,
      envoye: true,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 180.00,
      montantTTC: 216.00,
      progression: 45,
      priorite: 'Normal'
    },
    {
      id: 5,
      numero: 'D202519545',
      dateCreation: '2025-07-14',
      categories: ['Location', 'Entretien', 'Premium'],
      statut: 'Accepté',
      planifie: true,
      datePlanification: '2025-07-20',
      client: { nom: "L'OREAL", id: 5, logo: '💄' },
      auteur: 'Jean Dupont',
      prive: false,
      envoye: true,
      demandeFacturation: 'Oui',
      etatFacturation: 'Facturé',
      montantHT: 890.00,
      montantTTC: 1068.00,
      progression: 100,
      priorite: 'Haut'
    },
    {
      id: 6,
      numero: 'D202519543',
      dateCreation: '2025-07-13',
      categories: ['Sapin de Noël', 'Saisonnier'],
      statut: 'En cours',
      planifie: false,
      client: { nom: 'MICROSOFT', id: 6, logo: '💻' },
      auteur: 'Simon Henry',
      prive: false,
      envoye: false,
      demandeFacturation: 'Non',
      etatFacturation: '-',
      montantHT: 450.00,
      montantTTC: 540.00,
      progression: 30,
      priorite: 'Normal'
    }
  ]);

  const categories = [
    'Abonnement', 'Achat + Entretien', 'Achat ponctuel', 'Ajout végétal',
    'Atelier', 'Élagage', 'Bouquet', 'Conception', 'Conseil', 'Contrat',
    'Création', 'Entretien', 'Location', 'Logo végétal', 'PACK PLANTS',
    'Plant-sitting', 'Rachat plantes abo', 'Sapin de Noël', 'Premium', 'Enterprise'
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredDevis = devisList.filter(devis => {
    const matchSearch = searchTerm === '' || 
      devis.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchTag = activeTag === 'Tout' || 
      (activeTag === 'Non attribué' && devis.categories.length === 0) ||
      devis.categories.includes(activeTag);

    const devisDate = new Date(devis.dateCreation);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const matchDate = devisDate >= startDate && devisDate <= endDate;

    return matchSearch && matchTag && matchDate;
  });

  const sortedDevis = getSortedData(filteredDevis);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatutBadge = (statut) => {
    const statutConfig = {
      'En cours': { bg: 'from-blue-400 to-blue-600', text: 'text-white', glow: 'shadow-blue-500/50' },
      'Accepté': { bg: 'from-green-400 to-green-600', text: 'text-white', glow: 'shadow-green-500/50' },
      'Refusé': { bg: 'from-red-400 to-red-600', text: 'text-white', glow: 'shadow-red-500/50' },
      'En attente': { bg: 'from-yellow-400 to-yellow-600', text: 'text-white', glow: 'shadow-yellow-500/50' },
      'Expiré': { bg: 'from-gray-400 to-gray-600', text: 'text-white', glow: 'shadow-gray-500/50' }
    };
    const config = statutConfig[statut] || { bg: 'from-gray-400 to-gray-600', text: 'text-white', glow: 'shadow-gray-500/50' };
    
    return (
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${config.bg} ${config.text} shadow-lg ${config.glow}`}
      >
        {statut}
      </motion.span>
    );
  };

  const getPriorityIcon = (priorite) => {
    const icons = {
      'Haut': '🔥',
      'Normal': '📋',
      'Faible': '📝'
    };
    return icons[priorite] || '📋';
  };

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className={getClasses('button', 'flex items-center space-x-1 text-left w-full transition-all hover:scale-105')}
    >
      <span>{children}</span>
      {sortConfig.key === column && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={getClasses('accent')}
        >
          {sortConfig.direction === 'asc' ? 
            <ChevronUpIcon className="w-3 h-3" /> : 
            <ChevronDownIcon className="w-3 h-3" />
          }
        </motion.div>
      )}
    </button>
  );

  const ProgressBar = ({ value, className = '' }) => (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-2 rounded-full bg-gradient-to-r ${getClasses('primary')}`}
      />
    </div>
  );

  const DevisCard = ({ devis, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={getClasses('card', 'p-6 cursor-pointer group')}
      onClick={() => {setSelectedDevis(devis); setShowModal(true);}}
    >
      {/* Header avec client et statut */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={getClasses('glass', 'w-12 h-12 flex items-center justify-center rounded-xl text-2xl')}>
            {devis.client.logo}
          </div>
          <div>
            <h3 className={getClasses('text', 'font-bold text-lg')}>
              {devis.client.nom}
            </h3>
            <p className={getClasses('textMuted', 'text-sm')}>
              Devis #{devis.numero}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getPriorityIcon(devis.priorite)}
          {getStatutBadge(devis.statut)}
        </div>
      </div>

      {/* Catégories */}
      <div className="flex flex-wrap gap-2 mb-4">
        {devis.categories.slice(0, 3).map((cat, idx) => (
          <motion.span
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={getClasses('glass', 'px-3 py-1 rounded-full text-xs font-medium')}
          >
            {cat}
          </motion.span>
        ))}
        {devis.categories.length > 3 && (
          <span className={getClasses('textMuted', 'text-xs')}>
            +{devis.categories.length - 3} autres
          </span>
        )}
      </div>

      {/* Progression */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={getClasses('text', 'text-sm font-medium')}>Progression</span>
          <span className={getClasses('accent', 'text-sm font-bold')}>{devis.progression}%</span>
        </div>
        <ProgressBar value={devis.progression} />
      </div>

      {/* Montants */}
      <div className={getClasses('glass', 'p-4 rounded-xl')}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={getClasses('textMuted', 'text-xs')}>Montant HT</p>
            <p className={getClasses('text', 'font-bold text-lg')}>
              {formatCurrency(devis.montantHT)}
            </p>
          </div>
          <div>
            <p className={getClasses('textMuted', 'text-xs')}>Montant TTC</p>
            <p className={getClasses('accent', 'font-bold text-lg')}>
              {formatCurrency(devis.montantTTC)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer avec actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          {devis.envoye ? (
            <CheckIcon className="w-4 h-4 text-green-500" />
          ) : (
            <XMarkIcon className="w-4 h-4 text-red-500" />
          )}
          <span className={getClasses('textMuted', 'text-xs')}>
            {devis.envoye ? 'Envoyé' : 'Non envoyé'}
          </span>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
          >
            <EyeIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
          >
            <PencilIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <UltraPremiumContainer
      title="Devis Ultra Premium"
      icon={DocumentTextIcon}
    >
      {/* Barre d'outils */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={getClasses('glass', 'p-6 rounded-xl mb-8')}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex flex-wrap gap-4 items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={getClasses('button', 'flex items-center gap-2 px-6 py-3')}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nouveau Devis</span>
              <SparklesIcon className="w-4 h-4" />
            </motion.button>

            <div className="flex items-center gap-2">
              <CalendarIcon className={getClasses('accent', 'w-5 h-5')} />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className={getClasses('input', 'text-sm')}
              />
              <span className={getClasses('textMuted')}>–</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className={getClasses('input', 'text-sm')}
              />
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className={getClasses('accent', 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5')} />
              <input
                type="text"
                placeholder="Rechercher devis, client, catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={getClasses('input', 'pl-10 w-full')}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={getClasses('glass', 'flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:shadow-lg')}
          >
            <FunnelIcon className="w-5 h-5" />
            <span>Filtres</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Tags de catégories */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={getClasses('glass', 'p-4 rounded-xl mb-8')}
      >
        <div className="flex flex-wrap gap-3">
          {['Tout', 'Non attribué', ...categories.slice(0, 8)].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTag(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeTag === category
                  ? getClasses('buttonPrimary')
                  : getClasses('glass', 'hover:shadow-lg')
                }
              `}
            >
              {category === 'Tout' && <TagIcon className="w-4 h-4 mr-2 inline" />}
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Devis', value: sortedDevis.length, icon: '📊', color: 'from-blue-400 to-blue-600' },
          { label: 'En Cours', value: sortedDevis.filter(d => d.statut === 'En cours').length, icon: '⏳', color: 'from-yellow-400 to-yellow-600' },
          { label: 'Acceptés', value: sortedDevis.filter(d => d.statut === 'Accepté').length, icon: '✅', color: 'from-green-400 to-green-600' },
          { label: 'Montant Total', value: formatCurrency(sortedDevis.reduce((acc, d) => acc + d.montantTTC, 0)), icon: '💰', color: 'from-purple-400 to-purple-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={getClasses('card', 'p-6 text-center')}
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <h3 className={getClasses('text', 'font-bold text-2xl')}>{stat.value}</h3>
            <p className={getClasses('textMuted', 'text-sm')}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Grille des devis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedDevis.map((devis, index) => (
          <DevisCard key={devis.id} devis={devis} index={index} />
        ))}
      </div>

      {/* Message si aucun devis */}
      {sortedDevis.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={getClasses('card', 'p-12 text-center')}
        >
          <div className="text-6xl mb-4">📄</div>
          <h3 className={getClasses('text', 'text-xl font-bold mb-2')}>Aucun devis trouvé</h3>
          <p className={getClasses('textMuted')}>Essayez de modifier vos critères de recherche</p>
        </motion.div>
      )}

      {/* Modal de détails */}
      <AnimatePresence>
        {showModal && selectedDevis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-4xl w-full max-h-[90vh] overflow-y-auto')}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={getClasses('text', 'text-3xl font-bold mb-2')}>
                      Devis #{selectedDevis.numero}
                    </h2>
                    <p className={getClasses('textMuted')}>
                      Client: {selectedDevis.client.nom}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className={getClasses('glass', 'p-3 rounded-xl hover:bg-red-500/20')}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Détails</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Date de création:</span>
                        <p className={getClasses('text', 'font-medium')}>{new Date(selectedDevis.dateCreation).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Auteur:</span>
                        <p className={getClasses('text', 'font-medium')}>{selectedDevis.auteur}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Statut:</span>
                        <div className="mt-1">{getStatutBadge(selectedDevis.statut)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Finances</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Montant HT:</span>
                        <p className={getClasses('text', 'font-bold text-2xl')}>{formatCurrency(selectedDevis.montantHT)}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Montant TTC:</span>
                        <p className={getClasses('accent', 'font-bold text-3xl')}>{formatCurrency(selectedDevis.montantTTC)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Catégories</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedDevis.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className={getClasses('glass', 'px-4 py-2 rounded-full font-medium')}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={getClasses('buttonPrimary', 'flex-1')}
                  >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Modifier
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={getClasses('button', 'flex-1')}
                  >
                    <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                    Envoyer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default DevisUltraPremium;