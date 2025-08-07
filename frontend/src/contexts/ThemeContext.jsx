import React, { createContext, useContext, useState, useEffect } from 'react';

// Types de thèmes disponibles
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  BEIGE: 'beige',
  DAWN: 'dawn',
  NEON: 'neon',
  OCEAN: 'ocean',
  TROPICAL: 'tropical',
  LAVENDER: 'lavender',
  GALAXY: 'galaxy',
  AUTUMN: 'autumn',
  GLACIER: 'glacier',
  SAKURA: 'sakura',
  MIDNIGHT: 'midnight',
  LAVA: 'lava'
};

// Configuration des thèmes
const themeConfig = {
  [THEMES.LIGHT]: {
    name: 'Clair',
    icon: '☀️',
    description: 'Mode lumineux et énergisant'
  },
  [THEMES.DARK]: {
    name: 'Sombre',
    icon: '🌙',
    description: 'Mode nuit, reposant pour les yeux'
  },
  [THEMES.BEIGE]: {
    name: 'Beige',
    icon: '🏜️',
    description: 'Mode naturel et chaleureux'
  },
  [THEMES.DAWN]: {
    name: 'Rosé',
    icon: '🌸',
    description: 'Teintes douces et chaleureuses aux reflets roses'
  },
  [THEMES.NEON]: {
    name: 'Néon',
    icon: '🔮',
    description: 'Ambiance cyberpunk avec néons électriques'
  },
  [THEMES.OCEAN]: {
    name: 'Océan',
    icon: '🌊',
    description: 'Profondeurs marines aux reflets turquoise'
  },
  [THEMES.TROPICAL]: {
    name: 'Tropical',
    icon: '🌺',
    description: 'Jungle luxuriante et fruits exotiques'
  },
  [THEMES.LAVENDER]: {
    name: 'Lavande',
    icon: '💜',
    description: 'Douceur provençale aux tons violets'
  },
  [THEMES.GALAXY]: {
    name: 'Galaxie',
    icon: '🌌',
    description: 'Cosmos infini aux étoiles scintillantes'
  },
  [THEMES.AUTUMN]: {
    name: 'Automne',
    icon: '🍂',
    description: 'Couleurs chaudes de la saison dorée'
  },
  [THEMES.GLACIER]: {
    name: 'Glacier',
    icon: '❄️',
    description: 'Fraîcheur cristalline des glaces éternelles'
  },
  [THEMES.SAKURA]: {
    name: 'Sakura',
    icon: '🌸',
    description: 'Délicatesse des cerisiers japonais en fleurs'
  },
  [THEMES.MIDNIGHT]: {
    name: 'Minuit',
    icon: '🌙',
    description: 'Élégance nocturne aux reflets dorés'
  },
  [THEMES.LAVA]: {
    name: 'Lave',
    icon: '🔥',
    description: 'Fusion incandescente du volcan en éruption'
  }
};

// Création du contexte
const ThemeContext = createContext({
  theme: THEMES.DARK,
  setTheme: () => {},
  themeConfig: {},
  isDark: true,
  isBeige: false,
  isLight: false
});

// Hook personnalisé pour utiliser le thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
};

// Provider du thème
export const ThemeProvider = ({ children }) => {
  // Récupérer le thème depuis localStorage ou utiliser le thème sombre par défaut
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('nieuwkoop-theme');
      return savedTheme && Object.values(THEMES).includes(savedTheme) 
        ? savedTheme 
        : THEMES.DARK;
    }
    return THEMES.DARK;
  });

  // Fonction pour changer de thème
  const setTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setThemeState(newTheme);
      localStorage.setItem('nieuwkoop-theme', newTheme);
      
      // Appliquer immédiatement le thème au body
      document.body.setAttribute('data-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  // Appliquer le thème au montage du composant
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Ajouter une classe pour les transitions fluides
    document.body.classList.add('theme-transition');
    
    return () => {
      document.body.classList.remove('theme-transition');
    };
  }, [theme]);

  // Calculer les propriétés dérivées
  const isDark = theme === THEMES.DARK;
  const isBeige = theme === THEMES.BEIGE;
  const isLight = theme === THEMES.LIGHT;
  const isDawn = theme === THEMES.DAWN;
  const isNeon = theme === THEMES.NEON;
  const isOcean = theme === THEMES.OCEAN;
  const isTropical = theme === THEMES.TROPICAL;
  const isLavender = theme === THEMES.LAVENDER;
  const isGalaxy = theme === THEMES.GALAXY;
  const isAutumn = theme === THEMES.AUTUMN;
  const isGlacier = theme === THEMES.GLACIER;
  const isSakura = theme === THEMES.SAKURA;
  const isMidnight = theme === THEMES.MIDNIGHT;
  const isLava = theme === THEMES.LAVA;

  const value = {
    theme,
    setTheme,
    themeConfig,
    isDark,
    isBeige,
    isLight,
    isDawn,
    isNeon,
    isOcean,
    isTropical,
    isLavender,
    isGalaxy,
    isAutumn,
    isGlacier,
    isSakura,
    isMidnight,
    isLava,
    currentThemeConfig: themeConfig[theme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;