import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyEuroIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import { useDeleteExpense, useApproveExpense, useRejectExpense } from '../../hooks/useExpenses';
import toast from 'react-hot-toast';

const statusConfig = {
  draft: {
    label: 'Brouillon',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: ClockIcon
  },
  pending_approval: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: ClockIcon
  },
  approved: {
    label: 'Approuvé',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircleIcon
  },
  rejected: {
    label: 'Rejeté',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircleIcon
  },
  paid: {
    label: 'Payé',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircleIcon
  },
  reimbursed: {
    label: 'Remboursé',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: CheckCircleIcon
  }
};

const categoryConfig = {
  fuel: { label: 'Carburant', icon: '⛽', color: 'text-orange-600' },
  maintenance: { label: 'Maintenance', icon: '🔧', color: 'text-yellow-600' },
  supplies: { label: 'Fournitures', icon: '📦', color: 'text-blue-600' },
  equipment: { label: 'Équipement', icon: '🛠️', color: 'text-gray-600' },
  travel: { label: 'Voyage', icon: '✈️', color: 'text-purple-600' },
  meals: { label: 'Repas', icon: '🍽️', color: 'text-green-600' },
  office: { label: 'Bureau', icon: '🏢', color: 'text-indigo-600' },
  utilities: { label: 'Utilités', icon: '💡', color: 'text-yellow-500' },
  rent: { label: 'Loyer', icon: '🏠', color: 'text-red-600' },
  insurance: { label: 'Assurance', icon: '🛡️', color: 'text-blue-500' },
  marketing: { label: 'Marketing', icon: '📢', color: 'text-pink-600' },
  training: { label: 'Formation', icon: '📚', color: 'text-emerald-600' },
  software: { label: 'Logiciel', icon: '💻', color: 'text-cyan-600' },
  professional_services: { label: 'Services pro', icon: '🤝', color: 'text-violet-600' },
  taxes: { label: 'Taxes', icon: '📊', color: 'text-rose-600' },
  other: { label: 'Autre', icon: '📋', color: 'text-gray-500' }
};

const ExpenseCard = ({ expense, onEdit, onView }) => {
  const [showActions, setShowActions] = useState(false);
  const deleteExpense = useDeleteExpense();
  const approveExpense = useApproveExpense();
  const rejectExpense = useRejectExpense();

  const status = statusConfig[expense.status] || statusConfig.draft;
  const StatusIcon = status.icon;
  const category = categoryConfig[expense.category] || categoryConfig.other;

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette dépense ?`)) {
      try {
        await deleteExpense.mutateAsync(expense._id);
        toast.success('Dépense supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleApprove = async () => {
    try {
      await approveExpense.mutateAsync({ id: expense._id, notes: 'Approuvé via interface' });
      toast.success('Dépense approuvée');
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Raison du rejet :');
    if (reason) {
      try {
        await rejectExpense.mutateAsync({ id: expense._id, reason });
        toast.success('Dépense rejetée');
      } catch (error) {
        toast.error('Erreur lors du rejet');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatAmount = (amount, currency = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const hasReceipts = expense.receipts && expense.receipts.length > 0;
  const isHighAmount = expense.amountInBaseCurrency > 1000;
  const hasMissingDocuments = !hasReceipts && expense.amount > 50;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, shadow: '0 8px 25px rgba(0,0,0,0.15)' }}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header avec status et alertes */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${status.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </span>
            <span className="text-lg">{category.icon}</span>
            <span className="text-xs text-gray-500">{category.label}</span>
          </div>
          
          {/* Alertes */}
          <div className="flex space-x-1">
            {isHighAmount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-red-500 rounded-full"
                title="Montant élevé"
              />
            )}
            {hasMissingDocuments && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-orange-500 rounded-full"
                title="Documents manquants"
              />
            )}
            {expense.alerts && expense.alerts.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-yellow-500 rounded-full"
                title="Alertes"
              />
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-4">
        {/* Actions overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          className="absolute top-2 right-2 flex space-x-1 z-10"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onView(expense)}
            className="p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all shadow-sm"
            title="Voir les détails"
          >
            <EyeIcon className="w-4 h-4 text-gray-700" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(expense)}
            className="p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all shadow-sm"
            title="Modifier"
          >
            <PencilIcon className="w-4 h-4 text-blue-600" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all shadow-sm"
            title="Supprimer"
            disabled={deleteExpense.isLoading}
          >
            <TrashIcon className="w-4 h-4 text-red-600" />
          </motion.button>
        </motion.div>

        {/* Montant principal */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CurrencyEuroIcon className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                {formatAmount(expense.amount, expense.currency)}
              </span>
            </div>
            {expense.currency !== 'EUR' && (
              <span className="text-sm text-gray-500">
                ≈ {formatAmount(expense.amountInBaseCurrency, 'EUR')}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {expense.description}
          </h3>
          {expense.subcategory && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {expense.subcategory}
            </span>
          )}
        </div>

        {/* Informations clés */}
        <div className="space-y-2 mb-4">
          {/* Date */}
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatDate(expense.date)}</span>
          </div>

          {/* Fournisseur */}
          {expense.vendor?.name && (
            <div className="flex items-center text-sm text-gray-600">
              <TagIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{expense.vendor.name}</span>
            </div>
          )}

          {/* Créé par */}
          {expense.createdBy && (
            <div className="flex items-center text-sm text-gray-600">
              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">
                {expense.createdBy.username || expense.createdBy.email}
              </span>
            </div>
          )}

          {/* Méthode de paiement */}
          {expense.payment?.method && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-4 h-4 mr-2 text-gray-400">💳</span>
              <span className="capitalize">{expense.payment.method.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        {/* Footer avec documents et actions */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center space-x-3">
            {/* Indicateur de documents */}
            <div className="flex items-center space-x-1">
              <DocumentTextIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                {hasReceipts ? expense.receipts.length : 0} doc{expense.receipts?.length > 1 ? 's' : ''}
              </span>
              {!hasReceipts && expense.amount > 50 && (
                <ExclamationTriangleIcon className="w-3 h-3 text-orange-500" title="Reçu manquant" />
              )}
            </div>

            {/* Actions rapides pour les dépenses en attente */}
            {expense.status === 'pending_approval' && (
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApprove}
                  className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                  title="Approuver"
                  disabled={approveExpense.isLoading}
                >
                  <CheckCircleIcon className="w-3 h-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReject}
                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  title="Rejeter"
                  disabled={rejectExpense.isLoading}
                >
                  <XCircleIcon className="w-3 h-3" />
                </motion.button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* ID de la dépense */}
            <span className="text-xs text-gray-400 font-mono">
              {expense.expenseId || expense._id.slice(-6)}
            </span>

            {/* Indicateur déductible */}
            {expense.tax?.isDeductible && (
              <span className="text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded">
                Déductible
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseCard;