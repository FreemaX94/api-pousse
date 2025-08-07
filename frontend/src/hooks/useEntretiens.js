import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = '/api/entretiens';

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services API
const entretienService = {
  // Récupérer tous les entretiens avec filtres
  getAll: async (params = {}) => {
    const { data } = await api.get('/', { params });
    return data;
  },

  // Récupérer un entretien par ID
  getById: async (id) => {
    const { data } = await api.get(`/${id}`);
    return data;
  },

  // Créer un entretien
  create: async (entretienData) => {
    const { data } = await api.post('/', entretienData);
    return data;
  },

  // Mettre à jour un entretien
  update: async ({ id, ...entretienData }) => {
    const { data } = await api.put(`/${id}`, entretienData);
    return data;
  },

  // Archiver un entretien
  delete: async (id) => {
    const { data } = await api.delete(`/${id}`);
    return data;
  },

  // Actions spécifiques
  demarrer: async (id) => {
    const { data } = await api.patch(`/${id}/demarrer`);
    return data;
  },

  terminer: async ({ id, compteRendu }) => {
    const { data } = await api.patch(`/${id}/terminer`, { compteRendu });
    return data;
  },

  reporter: async ({ id, nouvelleDate, raison }) => {
    const { data } = await api.patch(`/${id}/reporter`, { nouvelleDate, raison });
    return data;
  },

  annuler: async ({ id, raison }) => {
    const { data } = await api.patch(`/${id}/annuler`, { raison });
    return data;
  },

  // Statistiques
  getStatistiques: async () => {
    const { data } = await api.get('/statistiques');
    return data;
  },

  // Entretiens par statut
  getPlanifies: async () => {
    const { data } = await api.get('/planifies');
    return data;
  },

  getEnCours: async () => {
    const { data } = await api.get('/en-cours');
    return data;
  },

  getEnRetard: async () => {
    const { data } = await api.get('/en-retard');
    return data;
  },

  // Commentaires
  ajouterCommentaire: async ({ id, message, type }) => {
    const { data } = await api.post(`/${id}/commentaires`, { message, type });
    return data;
  },

  // Problèmes
  ajouterProbleme: async ({ id, description, gravite }) => {
    const { data } = await api.post(`/${id}/problemes`, { description, gravite });
    return data;
  },

  resoudreProbleme: async ({ id, problemeId, solution }) => {
    const { data } = await api.patch(`/${id}/problemes/${problemeId}/resoudre`, { solution });
    return data;
  },

  // Rapport
  genererRapport: async (id) => {
    const { data } = await api.post(`/${id}/rapport`);
    return data;
  },
};

// Hooks personnalisés
export const useEntretiens = (params = {}) => {
  return useQuery({
    queryKey: ['entretiens', params],
    queryFn: () => entretienService.getAll(params),
    staleTime: 30000, // 30 secondes
    retry: 2,
  });
};

export const useEntretien = (id) => {
  return useQuery({
    queryKey: ['entretiens', id],
    queryFn: () => entretienService.getById(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
};

export const useEntretienStatistiques = () => {
  return useQuery({
    queryKey: ['entretiens', 'statistiques'],
    queryFn: entretienService.getStatistiques,
    staleTime: 300000, // 5 minutes
  });
};

export const useEntretiensPlanifies = () => {
  return useQuery({
    queryKey: ['entretiens', 'planifies'],
    queryFn: entretienService.getPlanifies,
    staleTime: 60000,
  });
};

export const useEntretiensEnCours = () => {
  return useQuery({
    queryKey: ['entretiens', 'en-cours'],
    queryFn: entretienService.getEnCours,
    staleTime: 30000,
  });
};

export const useEntretiensEnRetard = () => {
  return useQuery({
    queryKey: ['entretiens', 'en-retard'],
    queryFn: entretienService.getEnRetard,
    staleTime: 60000,
  });
};

// Mutations
export const useCreateEntretien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['entretiens'] });
      toast.success('Entretien créé avec succès');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

export const useUpdateEntretien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entretiens'] });
      queryClient.invalidateQueries({ queryKey: ['entretiens', variables.id] });
      toast.success('Entretien mis à jour avec succès');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    },
  });
};

export const useDeleteEntretien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entretiens'] });
      toast.success('Entretien archivé avec succès');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'archivage';
      toast.error(message);
    },
  });
};

export const useDemarrerEntretien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.demarrer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['entretiens'] });
      toast.success('Entretien démarré avec succès');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors du démarrage';
      toast.error(message);
    },
  });
};

export const useTerminerEntretien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.terminer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entretiens'] });
      toast.success('Entretien terminé avec succès');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors de la finalisation';
      toast.error(message);
    },
  });
};

export const useReporterEntretien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.reporter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entretiens'] });
      toast.success('Entretien reporté avec succès');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors du report';
      toast.error(message);
    },
  });
};

export const useAnnulerEntretien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.annuler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entretiens'] });
      toast.success('Entretien annulé avec succès');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'annulation';
      toast.error(message);
    },
  });
};

export const useAjouterCommentaire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.ajouterCommentaire,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entretiens', variables.id] });
      toast.success('Commentaire ajouté');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'ajout du commentaire';
      toast.error(message);
    },
  });
};

export const useAjouterProbleme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.ajouterProbleme,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entretiens', variables.id] });
      toast.success('Problème signalé');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors du signalement';
      toast.error(message);
    },
  });
};

export const useResoudreProbleme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.resoudreProbleme,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entretiens', variables.id] });
      toast.success('Problème résolu');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors de la résolution';
      toast.error(message);
    },
  });
};

export const useGenererRapport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entretienService.genererRapport,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entretiens', variables] });
      toast.success('Rapport généré avec succès');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Erreur lors de la génération du rapport';
      toast.error(message);
    },
  });
};