import { useState, useEffect } from 'react';

// Configuration complète des thèmes UltraPremium
export const ULTRA_PREMIUM_THEMES = {
  dark: {
    name: 'Dark Mode',
    primary: 'from-purple-600 via-blue-600 to-indigo-600',
    secondary: 'from-gray-800 via-gray-900 to-black',
    background: 'bg-gray-900',
    card: 'bg-gray-800/90 backdrop-blur-xl',
    glass: 'bg-white/10 backdrop-blur-xl',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-white/20',
    shadow: 'shadow-2xl shadow-purple-500/20',
    hover: 'hover:bg-white/20',
    accent: 'text-purple-400',
    glow: 'shadow-purple-500/50',
    neon: true
  },
  light: {
    name: 'Light Mode',
    primary: 'from-blue-400 via-purple-400 to-pink-400',
    secondary: 'from-white via-gray-50 to-gray-100',
    background: 'bg-gray-50',
    card: 'bg-white/90 backdrop-blur-xl',
    glass: 'bg-white/70 backdrop-blur-xl',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    shadow: 'shadow-xl shadow-blue-500/10',
    hover: 'hover:bg-gray-100',
    accent: 'text-blue-600',
    glow: 'shadow-blue-500/30',
    neon: false
  },
  neon: {
    name: 'Neon Cyberpunk',
    primary: 'from-pink-500 via-purple-500 to-cyan-500',
    secondary: 'from-black via-purple-900 to-black',
    background: 'bg-black',
    card: 'bg-black/90 backdrop-blur-xl border-2 border-purple-500/50',
    glass: 'bg-purple-900/20 backdrop-blur-xl',
    text: 'text-cyan-300',
    textSecondary: 'text-purple-300',
    border: 'border-purple-500/50',
    shadow: 'shadow-2xl shadow-purple-500/50',
    hover: 'hover:bg-purple-900/30',
    accent: 'text-pink-400',
    glow: 'shadow-cyan-500/70 animate-pulse',
    neon: true,
    special: 'neon-glow'
  },
  ocean: {
    name: 'Ocean Deep',
    primary: 'from-cyan-400 via-blue-500 to-indigo-600',
    secondary: 'from-blue-900 via-cyan-800 to-blue-900',
    background: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-950',
    card: 'bg-cyan-800/50 backdrop-blur-xl',
    glass: 'bg-cyan-500/10 backdrop-blur-xl',
    text: 'text-cyan-100',
    textSecondary: 'text-cyan-300',
    border: 'border-cyan-400/30',
    shadow: 'shadow-2xl shadow-cyan-500/30',
    hover: 'hover:bg-cyan-700/50',
    accent: 'text-cyan-400',
    glow: 'shadow-cyan-400/50',
    special: 'ocean-waves'
  },
  galaxy: {
    name: 'Galaxy',
    primary: 'from-purple-600 via-pink-600 to-blue-600',
    secondary: 'from-indigo-900 via-purple-900 to-pink-900',
    background: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-black',
    card: 'bg-purple-900/60 backdrop-blur-xl',
    glass: 'bg-white/5 backdrop-blur-xl',
    text: 'text-purple-100',
    textSecondary: 'text-pink-300',
    border: 'border-purple-500/30',
    shadow: 'shadow-2xl shadow-purple-600/40',
    hover: 'hover:bg-purple-800/50',
    accent: 'text-pink-400',
    glow: 'shadow-pink-500/60',
    special: 'galaxy-stars',
    neon: true
  },
  sunset: {
    name: 'Sunset',
    primary: 'from-orange-400 via-pink-500 to-purple-600',
    secondary: 'from-orange-100 via-pink-100 to-purple-100',
    background: 'bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50',
    card: 'bg-white/80 backdrop-blur-xl',
    glass: 'bg-white/60 backdrop-blur-xl',
    text: 'text-gray-800',
    textSecondary: 'text-orange-600',
    border: 'border-orange-300/50',
    shadow: 'shadow-xl shadow-orange-500/20',
    hover: 'hover:bg-orange-100',
    accent: 'text-orange-500',
    glow: 'shadow-orange-400/40'
  },
  emerald: {
    name: 'Emerald Forest',
    primary: 'from-emerald-400 via-green-500 to-teal-600',
    secondary: 'from-emerald-900 via-green-800 to-teal-900',
    background: 'bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950',
    card: 'bg-emerald-800/70 backdrop-blur-xl',
    glass: 'bg-emerald-500/10 backdrop-blur-xl',
    text: 'text-emerald-100',
    textSecondary: 'text-green-300',
    border: 'border-emerald-400/30',
    shadow: 'shadow-2xl shadow-emerald-500/30',
    hover: 'hover:bg-emerald-700/50',
    accent: 'text-emerald-400',
    glow: 'shadow-emerald-400/50'
  },
  volcano: {
    name: 'Volcano',
    primary: 'from-red-500 via-orange-500 to-yellow-500',
    secondary: 'from-red-900 via-orange-800 to-yellow-900',
    background: 'bg-gradient-to-br from-red-950 via-orange-950 to-black',
    card: 'bg-red-900/70 backdrop-blur-xl',
    glass: 'bg-orange-500/10 backdrop-blur-xl',
    text: 'text-orange-100',
    textSecondary: 'text-yellow-300',
    border: 'border-orange-500/40',
    shadow: 'shadow-2xl shadow-orange-600/40',
    hover: 'hover:bg-red-800/50',
    accent: 'text-yellow-400',
    glow: 'shadow-orange-500/60 animate-pulse',
    special: 'lava-bubbles'
  },
  arctic: {
    name: 'Arctic',
    primary: 'from-cyan-300 via-blue-400 to-indigo-500',
    secondary: 'from-gray-100 via-blue-50 to-cyan-50',
    background: 'bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50',
    card: 'bg-white/90 backdrop-blur-xl',
    glass: 'bg-white/70 backdrop-blur-xl',
    text: 'text-gray-800',
    textSecondary: 'text-blue-600',
    border: 'border-blue-200/50',
    shadow: 'shadow-xl shadow-blue-400/20',
    hover: 'hover:bg-blue-50',
    accent: 'text-cyan-600',
    glow: 'shadow-cyan-400/30',
    special: 'snow-particles'
  },
  matrix: {
    name: 'Matrix',
    primary: 'from-green-400 via-green-500 to-green-600',
    secondary: 'from-black via-green-950 to-black',
    background: 'bg-black',
    card: 'bg-green-950/80 backdrop-blur-xl border border-green-500/50',
    glass: 'bg-green-900/20 backdrop-blur-xl',
    text: 'text-green-400',
    textSecondary: 'text-green-300',
    border: 'border-green-500/50',
    shadow: 'shadow-2xl shadow-green-500/50',
    hover: 'hover:bg-green-900/30',
    accent: 'text-green-300',
    glow: 'shadow-green-400/70 animate-pulse',
    special: 'matrix-rain',
    neon: true
  },
  quantum: {
    name: 'Quantum',
    primary: 'from-violet-500 via-purple-600 to-indigo-700',
    secondary: 'from-violet-950 via-purple-950 to-indigo-950',
    background: 'bg-gradient-to-br from-violet-950 via-purple-950 to-black',
    card: 'bg-violet-900/60 backdrop-blur-xl',
    glass: 'bg-violet-500/10 backdrop-blur-xl',
    text: 'text-violet-100',
    textSecondary: 'text-purple-300',
    border: 'border-violet-500/30',
    shadow: 'shadow-2xl shadow-violet-600/40',
    hover: 'hover:bg-violet-800/50',
    accent: 'text-violet-400',
    glow: 'shadow-violet-500/60',
    special: 'quantum-particles',
    neon: true
  },
  aurora: {
    name: 'Aurora Borealis',
    primary: 'from-green-400 via-blue-500 to-purple-600',
    secondary: 'from-blue-900 via-green-800 to-purple-900',
    background: 'bg-gradient-to-br from-blue-950 via-green-950 to-purple-950',
    card: 'bg-blue-900/50 backdrop-blur-xl',
    glass: 'bg-green-500/10 backdrop-blur-xl',
    text: 'text-green-100',
    textSecondary: 'text-blue-300',
    border: 'border-green-400/30',
    shadow: 'shadow-2xl shadow-green-500/30',
    hover: 'hover:bg-blue-800/50',
    accent: 'text-green-400',
    glow: 'shadow-blue-400/50',
    special: 'aurora-waves',
    neon: true
  },
  solar: {
    name: 'Solar Flare',
    primary: 'from-yellow-400 via-orange-500 to-red-600',
    secondary: 'from-yellow-100 via-orange-100 to-red-100',
    background: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50',
    card: 'bg-white/85 backdrop-blur-xl',
    glass: 'bg-yellow-100/60 backdrop-blur-xl',
    text: 'text-gray-800',
    textSecondary: 'text-orange-600',
    border: 'border-orange-300/50',
    shadow: 'shadow-xl shadow-orange-400/25',
    hover: 'hover:bg-yellow-100',
    accent: 'text-red-500',
    glow: 'shadow-yellow-400/40',
    special: 'solar-flares'
  },
  midnight: {
    name: 'Midnight',
    primary: 'from-blue-600 via-indigo-700 to-purple-800',
    secondary: 'from-gray-900 via-blue-950 to-black',
    background: 'bg-gradient-to-br from-gray-950 via-blue-950 to-black',
    card: 'bg-blue-950/80 backdrop-blur-xl',
    glass: 'bg-blue-900/20 backdrop-blur-xl',
    text: 'text-blue-100',
    textSecondary: 'text-indigo-300',
    border: 'border-blue-600/30',
    shadow: 'shadow-2xl shadow-blue-700/40',
    hover: 'hover:bg-blue-900/50',
    accent: 'text-indigo-400',
    glow: 'shadow-indigo-500/50',
    special: 'starfield'
  }
};

// Classes de base réutilisables
export const ULTRA_PREMIUM_CLASSES = {
  container: 'min-h-screen p-6 transition-all duration-500',
  card: 'rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02]',
  glassmorphism: 'backdrop-blur-xl rounded-2xl shadow-2xl',
  button: 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105',
  input: 'w-full px-4 py-3 rounded-xl backdrop-blur-xl transition-all duration-300',
  badge: 'px-3 py-1 rounded-full text-sm font-semibold',
  gradient: 'bg-gradient-to-r',
  animation: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    spin: 'animate-spin'
  },
  effects: {
    neonGlow: 'neon-glow',
    galaxyStars: 'galaxy-stars',
    oceanWaves: 'ocean-waves',
    lavaBubbles: 'lava-bubbles',
    snowParticles: 'snow-particles',
    matrixRain: 'matrix-rain',
    quantumParticles: 'quantum-particles',
    auroraWaves: 'aurora-waves',
    solarFlares: 'solar-flares',
    starfield: 'starfield'
  }
};

// Hook personnalisé pour la gestion du thème UltraPremium
const useThemeUltraPremium = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isAnimating, setIsAnimating] = useState(false);

  // Charger le thème depuis le localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('ultraPremiumTheme');
    if (savedTheme && ULTRA_PREMIUM_THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Sauvegarder le thème dans le localStorage
  useEffect(() => {
    localStorage.setItem('ultraPremiumTheme', currentTheme);
  }, [currentTheme]);

  // Fonction pour changer de thème avec animation
  const changeTheme = (newTheme) => {
    if (ULTRA_PREMIUM_THEMES[newTheme]) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTheme(newTheme);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Fonction pour obtenir les classes complètes d'un élément
  const getClasses = (element, additionalClasses = '') => {
    const theme = ULTRA_PREMIUM_THEMES[currentTheme];
    const baseClasses = ULTRA_PREMIUM_CLASSES[element] || '';
    
    switch (element) {
      case 'container':
        return `${baseClasses} ${theme.background} ${theme.text} ${additionalClasses}`;
      case 'card':
        return `${baseClasses} ${theme.card} ${theme.border} ${theme.shadow} ${additionalClasses}`;
      case 'glass':
        return `${ULTRA_PREMIUM_CLASSES.glassmorphism} ${theme.glass} ${theme.border} ${additionalClasses}`;
      case 'button':
        return `${baseClasses} ${ULTRA_PREMIUM_CLASSES.gradient} ${theme.primary} ${theme.hover} text-white ${additionalClasses}`;
      case 'input':
        return `${baseClasses} ${theme.glass} ${theme.border} ${theme.text} ${additionalClasses}`;
      case 'badge':
        return `${baseClasses} ${theme.glass} ${theme.border} ${theme.accent} ${additionalClasses}`;
      default:
        return additionalClasses;
    }
  };

  // Fonction pour obtenir l'effet spécial du thème
  const getSpecialEffect = () => {
    const theme = ULTRA_PREMIUM_THEMES[currentTheme];
    if (theme.special && ULTRA_PREMIUM_CLASSES.effects[theme.special]) {
      return ULTRA_PREMIUM_CLASSES.effects[theme.special];
    }
    return '';
  };

  return {
    theme: ULTRA_PREMIUM_THEMES[currentTheme],
    currentTheme,
    themes: ULTRA_PREMIUM_THEMES,
    changeTheme,
    isAnimating,
    getClasses,
    getSpecialEffect,
    classes: ULTRA_PREMIUM_CLASSES
  };
};

export default useThemeUltraPremium;