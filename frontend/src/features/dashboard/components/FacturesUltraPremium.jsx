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
  DocumentArrowDownIcon,
  CogIcon,
  ReceiptPercentIcon,
  ClockIcon,
  CurrencyEuroIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const FacturesUltraPremium = () => {
  const { getClasses } = useThemeUltraPremium();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-07-01',
    endDate: '2025-07-31'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showCommentairePriveColumn, setShowCommentairePriveColumn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);

  // Mock data pour les factures enrichies
  const [facturesList] = useState([
    {
      id: 1,
      numero: 'F202519553',
      dateCreation: '2025-07-18T14:30:00',
      dateEcheance: '2025-08-18',
      statut: 'Brouillon',
      client: { nom: 'Sandra Azoura', id: 1, logo: '🏢' },
      auteur: 'Simon Henry',
      commentairePrive: 'Facture urgente à traiter',
      envoye: true,
      montantHT: 300.00,
      montantTTC: 360.00,
      resteAPayer: 360.00,
      progression: 25,
      priorite: 'Normal',
      tags: ['Urgent', 'Revision']
    },
    {
      id: 2,
      numero: 'F202519551',
      dateCreation: '2025-07-17T09:15:00',
      dateEcheance: '2025-08-17',
      statut: 'Payée',
      client: { nom: 'Nolita', id: 2, logo: '🌟' },
      auteur: 'Marie Dubois',
      commentairePrive: 'Client régulier - Paiement rapide',
      envoye: true,
      montantHT: 552.00,
      montantTTC: 662.40,
      resteAPayer: 0.00,
      progression: 100,
      priorite: 'Haut',
      tags: ['Premium', 'Récurrent']
    },
    {
      id: 3,
      numero: 'F202519549',
      dateCreation: '2025-07-16T16:45:00',
      dateEcheance: '2025-08-16',
      statut: 'Impayée',
      client: { nom: 'CREDIT MUTUEL', id: 3, logo: '🏦' },
      auteur: 'Pierre Martin',
      commentairePrive: 'Relancer le paiement - 3ème rappel',
      envoye: false,
      montantHT: 1250.00,
      montantTTC: 1500.00,
      resteAPayer: 1500.00,
      progression: 75,
      priorite: 'Urgent',
      tags: ['Rappel', 'Retard']
    },
    {
      id: 4,
      numero: 'F202519547',
      dateCreation: '2025-07-15T11:20:00',
      dateEcheance: '2025-08-15',
      statut: 'En cours',
      client: { nom: 'BNP PARIBAS', id: 4, logo: '💼' },
      auteur: 'Sophie Leroy',
      commentairePrive: 'Validation comptabilité en cours',
      envoye: true,
      montantHT: 180.00,
      montantTTC: 216.00,
      resteAPayer: 216.00,
      progression: 60,
      priorite: 'Normal',
      tags: ['Validation', 'Comptabilité']
    },
    {
      id: 5,
      numero: 'F202519545',
      dateCreation: '2025-07-14T13:30:00',
      dateEcheance: '2025-08-14',
      statut: 'Payée',
      client: { nom: "L'OREAL", id: 5, logo: '💄' },
      auteur: 'Jean Dupont',
      commentairePrive: 'Paiement anticipé - Excellent client',
      envoye: true,
      montantHT: 890.00,
      montantTTC: 1068.00,
      resteAPayer: 0.00,
      progression: 100,
      priorite: 'Haut',
      tags: ['Premium', 'Paiement anticipé']
    }
  ]);

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

  const filteredFactures = facturesList.filter(facture => {
    const matchSearch = searchTerm === '' || 
      facture.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.commentairePrive.toLowerCase().includes(searchTerm.toLowerCase());

    const factureDate = new Date(facture.dateCreation);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const matchDate = factureDate >= startDate && factureDate <= endDate;

    return matchSearch && matchDate;
  });

  const sortedFactures = getSortedData(filteredFactures);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDelaiEcheance = (dateEcheance) => {
    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffTime = echeance - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} jour(s) de retard`, color: 'text-red-500', urgency: 'high' };
    } else if (diffDays === 0) {
      return { text: 'Aujourd\'hui', color: 'text-orange-500', urgency: 'medium' };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} jour(s)`, color: 'text-yellow-500', urgency: 'medium' };
    } else {
      return { text: `${diffDays} jour(s)`, color: 'text-green-500', urgency: 'low' };
    }
  };

  const getStatutBadge = (statut) => {
    const statutConfig = {
      'Brouillon': { bg: 'from-gray-400 to-gray-600', text: 'text-white', glow: 'shadow-gray-500/50' },
      'En cours': { bg: 'from-blue-400 to-blue-600', text: 'text-white', glow: 'shadow-blue-500/50' },
      'Payée': { bg: 'from-green-400 to-green-600', text: 'text-white', glow: 'shadow-green-500/50' },
      'Impayée': { bg: 'from-red-400 to-red-600', text: 'text-white', glow: 'shadow-red-500/50' }
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
      'Urgent': '🚨',
      'Haut': '🔥',
      'Normal': '📋',
      'Faible': '📝'
    };
    return icons[priorite] || '📋';
  };

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

  const FactureCard = ({ facture, index }) => {
    const delai = calculateDelaiEcheance(facture.dateEcheance);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className={getClasses('card', 'p-6 cursor-pointer group relative overflow-hidden')}
        onClick={() => {setSelectedFacture(facture); setShowModal(true);}}
      >
        {/* Indicateur de priorité */}
        <div className={`absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] ${
          facture.priorite === 'Urgent' ? 'border-b-red-500' :
          facture.priorite === 'Haut' ? 'border-b-orange-500' : 'border-b-transparent'
        }`} />

        {/* Header avec client et délai */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={getClasses('glass', 'w-12 h-12 flex items-center justify-center rounded-xl text-2xl')}>
              {facture.client.logo}
            </div>
            <div>
              <h3 className={getClasses('text', 'font-bold text-lg')}>
                {facture.client.nom}
              </h3>
              <p className={getClasses('textMuted', 'text-sm')}>
                Facture #{facture.numero}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`${delai.color} font-bold text-sm mb-1`}>
              {delai.text}
            </div>
            {delai.urgency === 'high' && <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mx-auto" />}
            {delai.urgency === 'medium' && <ClockIcon className="w-5 h-5 text-yellow-500 mx-auto" />}
            {delai.urgency === 'low' && <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />}
          </div>
        </div>

        {/* Statut et priorité */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {getPriorityIcon(facture.priorite)}
            {getStatutBadge(facture.statut)}
          </div>
          <div className="flex items-center gap-2">
            {facture.envoye ? (
              <CheckIcon className="w-4 h-4 text-green-500" />
            ) : (
              <XMarkIcon className="w-4 h-4 text-red-500" />
            )}
            <span className={getClasses('textMuted', 'text-xs')}>
              {facture.envoye ? 'Envoyé' : 'Non envoyé'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {facture.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {facture.tags.map((tag, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.05 }}
                className={getClasses('glass', 'px-2 py-1 rounded-full text-xs font-medium')}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Progression */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={getClasses('text', 'text-sm font-medium')}>Progression</span>
            <span className={getClasses('accent', 'text-sm font-bold')}>{facture.progression}%</span>
          </div>
          <ProgressBar value={facture.progression} />
        </div>

        {/* Montants */}
        <div className={getClasses('glass', 'p-4 rounded-xl')}>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className={getClasses('textMuted', 'text-xs')}>Montant HT</p>
              <p className={getClasses('text', 'font-bold text-lg')}>
                {formatCurrency(facture.montantHT)}
              </p>
            </div>
            <div>
              <p className={getClasses('textMuted', 'text-xs')}>Montant TTC</p>
              <p className={getClasses('accent', 'font-bold text-lg')}>
                {formatCurrency(facture.montantTTC)}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <p className={getClasses('textMuted', 'text-xs')}>Reste à payer</p>
            <p className={`font-bold text-xl ${
              facture.resteAPayer === 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatCurrency(facture.resteAPayer)}
            </p>
          </div>
        </div>

        {/* Commentaire privé si visible */}
        {showCommentairePriveColumn && facture.commentairePrive && (
          <div className={getClasses('glass', 'p-3 mt-4 rounded-lg')}>
            <p className={getClasses('textMuted', 'text-xs mb-1')}>Note privée:</p>
            <p className={getClasses('text', 'text-sm truncate')}>{facture.commentairePrive}</p>
          </div>
        )}

        {/* Footer avec actions */}
        <div className="flex justify-between items-center mt-4">
          <div className={getClasses('textMuted', 'text-xs')}>
            Par {facture.auteur}<br/>
            {formatDateTime(facture.dateCreation)}
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
              title="Voir"
            >
              <EyeIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
              title="Télécharger PDF"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
              title="Modifier"
            >
              <PencilIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <UltraPremiumContainer
      title="Factures Ultra Premium"
      icon={ReceiptPercentIcon}
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
              <span>Nouvelle Facture</span>
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={getClasses('glass', 'flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:shadow-lg')}
            >
              <CogIcon className="w-4 h-4" />
              <span>Options d'affichage</span>
            </motion.button>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className={getClasses('accent', 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5')} />
              <input
                type="text"
                placeholder="Rechercher une facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={getClasses('input', 'pl-10 w-full')}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle commentaire privé */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={getClasses('glass', 'p-4 rounded-xl mb-8')}
      >
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={showCommentairePriveColumn}
            onChange={(e) => setShowCommentairePriveColumn(e.target.checked)}
            className="rounded"
          />
          <span className={getClasses('text', 'font-medium')}>Afficher les commentaires privés</span>
        </label>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Factures', value: sortedFactures.length, icon: '📊', color: 'from-blue-400 to-blue-600' },
          { label: 'Payées', value: sortedFactures.filter(f => f.statut === 'Payée').length, icon: '✅', color: 'from-green-400 to-green-600' },
          { label: 'Impayées', value: sortedFactures.filter(f => f.statut === 'Impayée').length, icon: '⚠️', color: 'from-red-400 to-red-600' },
          { 
            label: 'CA Total', 
            value: formatCurrency(sortedFactures.filter(f => f.statut === 'Payée').reduce((acc, f) => acc + f.montantTTC, 0)), 
            icon: '💰', 
            color: 'from-purple-400 to-purple-600' 
          }
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

      {/* Grille des factures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedFactures.map((facture, index) => (
          <FactureCard key={facture.id} facture={facture} index={index} />
        ))}
      </div>

      {/* Message si aucune facture */}
      {sortedFactures.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={getClasses('card', 'p-12 text-center')}
        >
          <div className="text-6xl mb-4">🧾</div>
          <h3 className={getClasses('text', 'text-xl font-bold mb-2')}>Aucune facture trouvée</h3>
          <p className={getClasses('textMuted')}>Essayez de modifier vos critères de recherche</p>
        </motion.div>
      )}

      {/* Modal de détails */}
      <AnimatePresence>
        {showModal && selectedFacture && (
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
                      Facture #{selectedFacture.numero}
                    </h2>
                    <p className={getClasses('textMuted')}>
                      Client: {selectedFacture.client.nom}
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
                        <p className={getClasses('text', 'font-medium')}>{formatDateTime(selectedFacture.dateCreation)}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Échéance:</span>
                        <p className={getClasses('text', 'font-medium')}>{new Date(selectedFacture.dateEcheance).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Auteur:</span>
                        <p className={getClasses('text', 'font-medium')}>{selectedFacture.auteur}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Statut:</span>
                        <div className="mt-1">{getStatutBadge(selectedFacture.statut)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Finances</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Montant HT:</span>
                        <p className={getClasses('text', 'font-bold text-2xl')}>{formatCurrency(selectedFacture.montantHT)}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Montant TTC:</span>
                        <p className={getClasses('accent', 'font-bold text-3xl')}>{formatCurrency(selectedFacture.montantTTC)}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Reste à payer:</span>
                        <p className={`font-bold text-3xl ${
                          selectedFacture.resteAPayer === 0 ? 'text-green-500' : 'text-red-500'
                        }`}>{formatCurrency(selectedFacture.resteAPayer)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedFacture.commentairePrive && (
                  <div className="mt-8">
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Commentaire privé</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl')}>
                      <p className={getClasses('text')}>{selectedFacture.commentairePrive}</p>
                    </div>
                  </div>
                )}

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
                    <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                    Télécharger PDF
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

export default FacturesUltraPremium;