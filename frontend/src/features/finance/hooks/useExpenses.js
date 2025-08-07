import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/domains/inventory/clientApi';

// Hook pour récupérer la liste des dépenses
export const useExpenses = (filters = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    from = null,
    to = null,
    category = '',
    status = '',
    search = '',
    sortBy = 'date',
    sortOrder = 'desc'
  } = filters;

  return useQuery({
    queryKey: ['expenses', { page, limit, from, to, category, status, search, sortBy, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (category) params.append('category', category);
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      
      const response = await api.get(`/expenses?${params}`);
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook pour récupérer une dépense par ID
export const useExpense = (id) => {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      const response = await api.get(`/expenses/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Hook pour récupérer les statistiques des dépenses
export const useExpenseStats = (period = 'year') => {
  return useQuery({
    queryKey: ['expense-stats', period],
    queryFn: async () => {
      const response = await api.get(`/expenses/stats?period=${period}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook pour récupérer les dépenses par catégorie
export const useExpensesByCategory = (year = new Date().getFullYear()) => {
  return useQuery({
    queryKey: ['expenses-by-category', year],
    queryFn: async () => {
      const response = await api.get(`/expenses/by-category?year=${year}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

// Hook pour récupérer les dépenses récurrentes dues
export const useRecurringExpensesDue = () => {
  return useQuery({
    queryKey: ['recurring-expenses-due'],
    queryFn: async () => {
      const response = await api.get('/expenses/recurring/due');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Hook pour récupérer les dépenses en attente d'approbation
export const usePendingExpenses = () => {
  return useQuery({
    queryKey: ['pending-expenses'],
    queryFn: async () => {
      const response = await api.get('/expenses/pending-approval');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Mutation pour créer une dépense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expenseData) => {
      const response = await api.post('/expenses', expenseData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
      queryClient.invalidateQueries({ queryKey: ['expenses-by-category'] });
    },
  });
};

// Mutation pour mettre à jour une dépense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/expenses/${id}`, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', data._id] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
      queryClient.invalidateQueries({ queryKey: ['expenses-by-category'] });
    },
  });
};

// Mutation pour supprimer une dépense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/expenses/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
      queryClient.invalidateQueries({ queryKey: ['expenses-by-category'] });
    },
  });
};

// Mutation pour approuver une dépense
export const useApproveExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, notes = '' }) => {
      const response = await api.patch(`/expenses/${id}/approve`, { notes });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', data._id] });
      queryClient.invalidateQueries({ queryKey: ['pending-expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
    },
  });
};

// Mutation pour rejeter une dépense
export const useRejectExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await api.patch(`/expenses/${id}/reject`, { reason });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', data._id] });
      queryClient.invalidateQueries({ queryKey: ['pending-expenses'] });
    },
  });
};

// Mutation pour uploader un reçu
export const useUploadReceipt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, file, description = '' }) => {
      const formData = new FormData();
      formData.append('receipt', file);
      formData.append('description', description);
      
      const response = await api.post(`/expenses/${id}/receipts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', variables.id] });
    },
  });
};

// Mutation pour dupliquer une dépense
export const useDuplicateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/expenses/${id}/duplicate`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
    },
  });
};

// Hook pour les factures (invoices) - pour maintenir la compatibilité
export const useInvoices = (filters = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    from = null,
    to = null,
    search = '',
    sortBy = 'date',
    sortOrder = 'desc'
  } = filters;

  return useQuery({
    queryKey: ['invoices', { page, limit, from, to, search, sortBy, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (search) params.append('search', search);
      
      const response = await api.get(`/invoices?${params}`);
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Mutation pour créer une facture
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoiceData) => {
      const response = await api.post('/invoices', invoiceData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};