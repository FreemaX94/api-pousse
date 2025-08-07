// Hooks personnalisés pour OrganipoussV2 - Architecture Premium
import { useState, useEffect, useCallback, useMemo } from 'react';

// Hook pour gérer les animations avancées
export const useAdvancedAnimations = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { mousePosition, scrollProgress };
};

// Hook pour gérer les notifications en temps réel
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, addNotification, markAsRead, clearAll };
};

// Hook pour gérer les raccourcis clavier
export const useKeyboardShortcuts = () => {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + K pour ouvrir la palette de commandes
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      
      // Cmd/Ctrl + / pour ouvrir l'aide
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        // Ouvrir le panneau d'aide
      }

      // Échap pour fermer les modales
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return { isCommandPaletteOpen, setCommandPaletteOpen };
};

// Hook pour gérer les KPIs et métriques
export const useBusinessMetrics = () => {
  const [metrics, setMetrics] = useState({
    revenue: { current: 0, previous: 0, trend: 0 },
    clients: { current: 0, previous: 0, trend: 0 },
    interventions: { current: 0, previous: 0, trend: 0 },
    satisfaction: { current: 0, previous: 0, trend: 0 }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement des métriques
    setTimeout(() => {
      setMetrics({
        revenue: { 
          current: 125000, 
          previous: 98000, 
          trend: ((125000 - 98000) / 98000 * 100).toFixed(1) 
        },
        clients: { 
          current: 342, 
          previous: 298, 
          trend: ((342 - 298) / 298 * 100).toFixed(1) 
        },
        interventions: { 
          current: 1247, 
          previous: 1180, 
          trend: ((1247 - 1180) / 1180 * 100).toFixed(1) 
        },
        satisfaction: { 
          current: 4.8, 
          previous: 4.6, 
          trend: ((4.8 - 4.6) / 4.6 * 100).toFixed(1) 
        }
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return { metrics, isLoading };
};

// Hook pour l'IA d'assistance
export const useAIAssistant = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const getSuggestions = useCallback(async (context) => {
    setIsThinking(true);
    
    // Simulation de l'IA qui analyse le contexte
    setTimeout(() => {
      const contextSuggestions = {
        'devis': [
          'Un devis est en attente depuis plus de 15 jours',
          'Taux de conversion des devis : 68% ce mois',
          'Suggestion : Relancer le client Crystal Tech'
        ],
        'factures': [
          '5 factures arrivent à échéance cette semaine',
          'Montant total à encaisser : 12,450€',
          'Alerte : 2 factures en retard de paiement'
        ],
        'interventions': [
          '3 interventions planifiées pour demain',
          'Optimisation : Regrouper les interventions du 15e arrondissement',
          'Rappel : Maintenance préventive chez BNP Paribas'
        ],
        default: [
          'Bienvenue ! Voici vos priorités du jour',
          '12 nouvelles notifications à traiter',
          'Performance : +27% de productivité ce mois'
        ]
      };

      setSuggestions(contextSuggestions[context] || contextSuggestions.default);
      setIsThinking(false);
    }, 800);
  }, []);

  return { suggestions, isThinking, getSuggestions };
};

// Hook pour gérer le mode présentation
export const usePresentationMode = () => {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const togglePresentationMode = useCallback(() => {
    setIsPresentationMode(prev => !prev);
    if (!isPresentationMode) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isPresentationMode]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => prev + 1);
  }, []);

  const previousSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  }, []);

  return {
    isPresentationMode,
    currentSlide,
    togglePresentationMode,
    nextSlide,
    previousSlide
  };
};

// Hook pour gérer les thèmes dynamiques
export const useDynamicTheme = () => {
  const [theme, setTheme] = useState('cosmic');
  const [autoTheme, setAutoTheme] = useState(true);

  useEffect(() => {
    if (autoTheme) {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) {
        setTheme('morning'); // Thème matinal énergisant
      } else if (hour >= 12 && hour < 17) {
        setTheme('afternoon'); // Thème après-midi productif
      } else if (hour >= 17 && hour < 21) {
        setTheme('evening'); // Thème soirée apaisant
      } else {
        setTheme('night'); // Thème nuit reposant
      }
    }
  }, [autoTheme]);

  return { theme, setTheme, autoTheme, setAutoTheme };
};

// Hook principal qui combine tout
export const useOrganipoussV2 = () => {
  const animations = useAdvancedAnimations();
  const notifications = useNotifications();
  const shortcuts = useKeyboardShortcuts();
  const metrics = useBusinessMetrics();
  const ai = useAIAssistant();
  const presentation = usePresentationMode();
  const dynamicTheme = useDynamicTheme();

  return {
    animations,
    notifications,
    shortcuts,
    metrics,
    ai,
    presentation,
    dynamicTheme
  };
};