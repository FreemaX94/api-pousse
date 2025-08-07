import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/domains/inventory/clientApi';

// Hook pour récupérer la liste des véhicules
export const useVehicles = (filters = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    search = '', 
    status = '', 
    type = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = filters;

  return useQuery({
    queryKey: ['vehicles', { page, limit, search, status, type, sortBy, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (type) params.append('type', type);
      
      const response = await api.get(`/vehicles?${params}`);
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook pour récupérer un véhicule par ID
export const useVehicle = (id) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await api.get(`/vehicles/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Hook pour récupérer les statistiques des véhicules
export const useVehicleStats = () => {
  return useQuery({
    queryKey: ['vehicle-stats'],
    queryFn: async () => {
      const response = await api.get('/vehicles/stats');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook pour récupérer les documents expirés
export const useExpiringDocuments = (days = 30) => {
  return useQuery({
    queryKey: ['expiring-documents', days],
    queryFn: async () => {
      const response = await api.get(`/vehicles/expiring-documents?days=${days}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Mutation pour créer un véhicule
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicleData) => {
      const response = await api.post('/vehicles', vehicleData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-stats'] });
    },
  });
};

// Mutation pour mettre à jour un véhicule
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/vehicles/${id}`, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', data._id] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-stats'] });
    },
  });
};

// Mutation pour supprimer un véhicule
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/vehicles/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-stats'] });
    },
  });
};

// Mutation pour uploader un document
export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, documentType, file, description = '' }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('description', description);
      
      const response = await api.post(`/vehicles/${id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] });
    },
  });
};

// Mutation pour assigner un véhicule
export const useAssignVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vehicleId, userId }) => {
      const response = await api.patch(`/vehicles/${vehicleId}/assign`, { userId });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', data._id] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-stats'] });
    },
  });
};

// Mutation pour désassigner un véhicule
export const useUnassignVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicleId) => {
      const response = await api.patch(`/vehicles/${vehicleId}/unassign`);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', data._id] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-stats'] });
    },
  });
};

// Mutation pour mettre à jour le kilométrage
export const useUpdateMileage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vehicleId, mileage }) => {
      const response = await api.patch(`/vehicles/${vehicleId}/mileage`, { mileage });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', data._id] });
    },
  });
};