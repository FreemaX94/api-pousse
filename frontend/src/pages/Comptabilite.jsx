import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useExpenses, useInvoices } from '../hooks/useExpenses';
import ExpenseCard from '../components/accounting/ExpenseCard';
import AccountingStats from '../components/accounting/AccountingStats';
import toast from 'react-hot-toast';

export default function Comptabilite() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    status: '',
    from: '',
    to: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' ou 'invoices'

  const { data: expensesData, isLoading: expensesLoading, error: expensesError } = useExpenses(filters);
  const { data: invoicesData, isLoading: invoicesLoading, error: invoicesError } = useInvoices(filters);

  const expenses = expensesData?.data || [];
  const invoices = invoicesData?.data || [];
  const pagination = expensesData?.pagination || {};

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      category: '',
      status: '',
      from: '',
      to: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedExpense(null);
    setShowForm(true);
  };

  const currentData = activeTab === 'expenses' ? expenses : invoices;
  const isLoading = activeTab === 'expenses' ? expensesLoading : invoicesLoading;
  const error = activeTab === 'expenses' ? expensesError : invoicesError;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CurrencyEuroIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-500">
            {error.message || 'Impossible de charger les données comptables'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Comptabilité
            </h1>
            <p className="text-gray-600">
              Gérez vos factures, dépenses et suivez votre performance financière
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {/* Toggle Filters */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              Filtres
            </motion.button>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 bg-white">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Add Buttons */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Facture
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Dépense
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Dashboard */}
        <AccountingStats />

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DocumentTextIcon className="w-4 h-4 inline mr-2" />
            Dépenses ({expenses.length})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('invoices')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'invoices'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CurrencyEuroIcon className="w-4 h-4 inline mr-2" />
            Factures ({invoices.length})
          </motion.button>
        </motion.div>

        {/* Filters - Version simplifiée */}
        {!showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              {/* Recherche */}
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Période */}
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={filters.from || ''}
                  onChange={(e) => handleFilterChange({ from: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="date"
                  value={filters.to || ''}
                  onChange={(e) => handleFilterChange({ to: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Clear filters */}
              {(filters.search || filters.from || filters.to || filters.category || filters.status) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
                >
                  Effacer
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Data Grid/List */}
        {!isLoading && currentData.length > 0 && (
          <motion.div
            layout
            className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'expenses' ? (
                expenses.map((expense) => (
                  <ExpenseCard
                    key={expense._id}
                    expense={expense}
                    onEdit={handleEdit}
                    onView={handleView}
                  />
                ))
              ) : (
                invoices.map((invoice) => (
                  <motion.div
                    key={invoice._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {invoice.employee}
                      </h3>
                      <span className="text-xl font-bold text-green-600">
                        {invoice.amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Pôle: {invoice.pole}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(invoice.date).toLocaleDateString('fr-FR')}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && currentData.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            {activeTab === 'expenses' ? (
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            ) : (
              <CurrencyEuroIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search || filters.from || filters.to
                ? `Aucune ${activeTab === 'expenses' ? 'dépense' : 'facture'} trouvée`
                : `Aucune ${activeTab === 'expenses' ? 'dépense' : 'facture'} enregistrée`
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.search || filters.from || filters.to
                ? 'Essayez de modifier vos filtres de recherche'
                : `Commencez par ajouter votre première ${activeTab === 'expenses' ? 'dépense' : 'facture'}`
              }
            </p>
            {(!filters.search && !filters.from && !filters.to) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className={`inline-flex items-center px-6 py-3 ${
                  activeTab === 'expenses' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                } text-white rounded-lg font-medium transition-colors`}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Ajouter une {activeTab === 'expenses' ? 'dépense' : 'facture'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && currentData.length > 0 && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                const isCurrentPage = page === pagination.currentPage;
                
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal pour les formulaires */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowForm(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {selectedExpense ? 'Modifier la dépense' : 'Ajouter une dépense/facture'}
                </h2>
                <p className="text-gray-500 mb-4">
                  Formulaire modernisé à implémenter avec les nouvelles technologies
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      toast.success('Élément sauvegardé (simulation)');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
