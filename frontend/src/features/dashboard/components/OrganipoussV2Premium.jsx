// OrganipoussV2 Premium Components - Design révolutionnaire
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, SparklesIcon,
  ChartBarIcon, UsersIcon, CurrencyEuroIcon,
  StarIcon, BoltIcon, FireIcon
} from '@heroicons/react/24/outline';

// Composant Dashboard KPI animé en 3D
export const PremiumKPICard = ({ title, value, trend, icon: Icon, color, delay = 0 }) => {
  const isPositive = trend > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: delay * 0.5,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.02,
        y: -2
      }}
      className="relative group"
    >
      {/* Effet de lumière holographique */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 
                      rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500 
                      animate-pulse opacity-60" />
      
      {/* Carte principale avec glassmorphism */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 
                      border border-white/20 shadow-2xl overflow-hidden">
        
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Icône avec effet néon */}
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          
          {/* Badge de tendance animé */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3 }}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full
                       ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
          >
            {isPositive ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
            <span className="text-xs font-bold">{Math.abs(trend)}%</span>
          </motion.div>
        </div>

        {/* Valeur avec animation de compteur */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <h3 className="text-sm text-white/60 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
        </motion.div>

        {/* Graphique miniature animé */}
        <div className="mt-4 h-12 flex items-end space-x-1">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-white/20 to-white/5 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${20 + Math.random() * 80}%` }}
              transition={{ delay: delay + 0.1 * i, duration: 0.5 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Notification flottante premium
export const PremiumNotification = ({ notification, onClose }) => {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="relative"
    >
      {/* Effet de lueur */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 
                      rounded-2xl blur-xl opacity-40 animate-pulse" />
      
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 
                      border border-purple-500/30 shadow-2xl">
        <div className="flex items-start space-x-3">
          {/* Icône animée */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"
          >
            <BoltIcon className="w-5 h-5 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <h4 className="text-white font-semibold">{notification.title}</h4>
            <p className="text-white/60 text-sm mt-1">{notification.message}</p>
            <p className="text-white/40 text-xs mt-2">
              {new Date(notification.timestamp).toLocaleTimeString('fr-FR')}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Bouton d'action premium avec effets
export const PremiumActionButton = ({ children, onClick, variant = 'primary', icon: Icon }) => {
  const variants = {
    primary: 'from-purple-600 to-pink-600',
    success: 'from-green-600 to-teal-600',
    danger: 'from-red-600 to-orange-600',
    info: 'from-blue-600 to-cyan-600'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative group overflow-hidden rounded-xl"
    >
      {/* Effet de brillance qui passe */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ x: [-200, 200] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      />
      
      {/* Fond avec gradient */}
      <div className={`relative bg-gradient-to-r ${variants[variant]} px-6 py-3 
                       shadow-lg flex items-center space-x-2`}>
        {Icon && (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
        )}
        <span className="text-white font-semibold">{children}</span>
      </div>
    </motion.button>
  );
};

// Widget AI Assistant
export const AIAssistantWidget = ({ suggestions, isThinking }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative">
        {/* Effet de pulsation pour attirer l'attention */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 
                        rounded-2xl blur-2xl animate-pulse opacity-60" />
        
        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 
                        border border-blue-500/30 shadow-2xl max-w-sm">
          <div className="flex items-center space-x-2 mb-3">
            <motion.div
              animate={{ rotate: isThinking ? 360 : 0 }}
              transition={{ duration: 1, repeat: isThinking ? Infinity : 0, ease: "linear" }}
              className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"
            >
              <SparklesIcon className="w-5 h-5 text-white" />
            </motion.div>
            <h3 className="text-white font-semibold">Assistant IA</h3>
          </div>
          
          {isThinking ? (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ y: [-5, 0, -5] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <span className="text-white/60 text-sm">Analyse en cours...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2" />
                  <p className="text-white/80 text-sm">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Palette de commandes premium (Cmd+K)
export const CommandPalette = ({ isOpen, onClose, onCommand }) => {
  const DocumentTextIcon = ChartBarIcon; // Utilisation temporaire
  const commands = [
    { id: 'new-devis', label: 'Créer un nouveau devis', icon: DocumentTextIcon, shortcut: '⌘N' },
    { id: 'search-client', label: 'Rechercher un client', icon: UsersIcon, shortcut: '⌘F' },
    { id: 'quick-invoice', label: 'Facturation rapide', icon: CurrencyEuroIcon, shortcut: '⌘I' },
    { id: 'view-stats', label: 'Voir les statistiques', icon: ChartBarIcon, shortcut: '⌘S' },
    { id: 'ai-assist', label: 'Demander à l\'IA', icon: SparklesIcon, shortcut: '⌘A' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay avec blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
          />
          
          {/* Palette de commandes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl 
                            border border-purple-500/30 shadow-2xl overflow-hidden">
              {/* Barre de recherche */}
              <div className="p-4 border-b border-white/10">
                <input
                  type="text"
                  placeholder="Tapez une commande ou recherchez..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 
                           text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>
              
              {/* Liste des commandes */}
              <div className="p-2 max-h-96 overflow-y-auto">
                {commands.map((cmd, index) => (
                  <motion.button
                    key={cmd.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onCommand(cmd.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg
                             hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30">
                        <cmd.icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-white">{cmd.label}</span>
                    </div>
                    <span className="text-white/40 text-sm">{cmd.shortcut}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};