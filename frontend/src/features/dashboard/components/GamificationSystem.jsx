// Système de Gamification Ultra Premium pour OrganipoussV2 🏆
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrophyIcon,
  FireIcon,
  SparklesIcon,
  StarIcon,
  BoltIcon,
  RocketLaunchIcon,
  BeakerIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  GiftIcon,
  LightBulbIcon,
  HeartIcon,
  DocumentTextIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import confetti from 'canvas-confetti';

// Composant de badge d'achievement avec effets 3D
export const AchievementBadge = ({ achievement, unlocked, onUnlock }) => {
  const handleUnlock = () => {
    if (!unlocked && onUnlock) {
      // Lancer des confettis lors du déblocage
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9333EA', '#EC4899', '#3B82F6', '#10B981']
      });
      onUnlock(achievement);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotateY: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleUnlock}
      className={`relative cursor-pointer ${!unlocked && 'grayscale opacity-50'}`}
    >
      {/* Effet de brillance holographique */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Badge principal */}
      <div className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center
                      ${unlocked ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gray-700'}
                      shadow-2xl border-2 ${unlocked ? 'border-yellow-400' : 'border-gray-600'}`}>
        <achievement.icon className={`w-10 h-10 ${unlocked ? 'text-white' : 'text-gray-500'}`} />
        {unlocked && (
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <StarIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </motion.div>
        )}
      </div>
      
      {/* Nom et description */}
      <div className="text-center mt-2">
        <p className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-gray-400'}`}>
          {achievement.name}
        </p>
        <p className={`text-xs ${unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
          {achievement.description}
        </p>
      </div>
    </motion.div>
  );
};

// Barre de progression XP animée
export const XPProgressBar = ({ currentXP, requiredXP, level }) => {
  const progress = (currentXP / requiredXP) * 100;
  
  return (
    <div className="relative">
      {/* Titre et niveau */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <SparklesIcon className="w-5 h-5 text-purple-400" />
          </motion.div>
          <span className="text-white font-bold">Niveau {level}</span>
        </div>
        <span className="text-gray-400 text-sm">{currentXP} / {requiredXP} XP</span>
      </div>
      
      {/* Barre de progression */}
      <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
        {/* Effet de brillance animé */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-200, 200] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        
        {/* Progression */}
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Particules dans la barre */}
          <div className="h-full relative overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                animate={{
                  x: [0, 100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                style={{ top: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Message de niveau supérieur proche */}
      {progress > 80 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-yellow-400 text-sm mt-2 text-center"
        >
          🔥 Niveau supérieur proche !
        </motion.p>
      )}
    </div>
  );
};

// Système de streak (série de jours consécutifs)
export const StreakCounter = ({ currentStreak, bestStreak }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl 
                 rounded-2xl p-6 border border-orange-500/30"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="w-6 h-6 text-orange-500" />
            <h3 className="text-white font-bold text-lg">Série en cours</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <motion.span
              className="text-4xl font-bold text-orange-400"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              {currentStreak}
            </motion.span>
            <span className="text-gray-400">jours</span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-gray-400 text-sm mb-1">Record</p>
          <p className="text-2xl font-bold text-gray-300">{bestStreak}</p>
        </div>
      </div>
      
      {/* Flammes animées pour les grandes séries */}
      {currentStreak >= 7 && (
        <div className="mt-4 flex justify-center space-x-1">
          {[...Array(Math.min(currentStreak, 10))].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -5, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
            >
              🔥
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Tableau de classement avec animations
export const Leaderboard = ({ users, currentUserId }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
      <div className="flex items-center space-x-2 mb-4">
        <TrophyIcon className="w-6 h-6 text-yellow-400" />
        <h3 className="text-white font-bold text-lg">Classement</h3>
      </div>
      
      <div className="space-y-2">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-lg
                       ${user.id === currentUserId ? 'bg-purple-600/20 border border-purple-500/50' : 'bg-gray-800/50'}
                       hover:bg-gray-700/50 transition-colors`}
          >
            <div className="flex items-center space-x-3">
              {/* Position avec médaille pour le top 3 */}
              <div className="w-8 text-center">
                {index === 0 && <span className="text-2xl">🥇</span>}
                {index === 1 && <span className="text-2xl">🥈</span>}
                {index === 2 && <span className="text-2xl">🥉</span>}
                {index > 2 && <span className="text-gray-400 font-bold">{index + 1}</span>}
              </div>
              
              {/* Avatar et nom */}
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                               ${user.id === currentUserId 
                                 ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                                 : 'bg-gray-700'}`}>
                  <span className="text-white text-sm font-bold">{user.name[0]}</span>
                </div>
                <span className={`${user.id === currentUserId ? 'text-white font-bold' : 'text-gray-300'}`}>
                  {user.name}
                </span>
              </div>
            </div>
            
            {/* Score avec animation */}
            <motion.div
              className="flex items-center space-x-1"
              animate={{ scale: user.id === currentUserId ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold">{user.score.toLocaleString()}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Système de récompenses quotidiennes
export const DailyRewards = ({ claimedDays, onClaim }) => {
  const rewards = [
    { day: 1, xp: 50, icon: GiftIcon },
    { day: 2, xp: 75, icon: StarIcon },
    { day: 3, xp: 100, icon: BoltIcon },
    { day: 4, xp: 150, icon: RocketLaunchIcon },
    { day: 5, xp: 200, icon: TrophyIcon },
    { day: 6, xp: 300, icon: FireIcon },
    { day: 7, xp: 500, icon: SparklesIcon, special: true }
  ];
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
        <GiftIcon className="w-6 h-6 text-blue-400" />
        <span>Récompenses quotidiennes</span>
      </h3>
      
      <div className="grid grid-cols-7 gap-2">
        {rewards.map((reward) => {
          const claimed = claimedDays.includes(reward.day);
          const Icon = reward.icon;
          
          return (
            <motion.button
              key={reward.day}
              whileHover={{ scale: claimed ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !claimed && onClaim(reward)}
              disabled={claimed}
              className={`relative p-4 rounded-xl flex flex-col items-center justify-center
                         ${claimed 
                           ? 'bg-gray-800 opacity-50' 
                           : reward.special 
                             ? 'bg-gradient-to-br from-yellow-600 to-orange-600 cursor-pointer'
                             : 'bg-gradient-to-br from-blue-600 to-purple-600 cursor-pointer'}
                         ${!claimed && 'hover:shadow-xl'}`}
            >
              {reward.special && !claimed && (
                <motion.div
                  className="absolute inset-0 bg-yellow-400/30 rounded-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              <Icon className={`w-6 h-6 ${claimed ? 'text-gray-500' : 'text-white'} mb-1`} />
              <span className={`text-xs ${claimed ? 'text-gray-500' : 'text-white'} font-bold`}>
                Jour {reward.day}
              </span>
              <span className={`text-xs ${claimed ? 'text-gray-600' : 'text-yellow-300'}`}>
                +{reward.xp} XP
              </span>
              
              {claimed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <ShieldCheckIcon className="w-8 h-8 text-green-500" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Composant principal du système de gamification
const GamificationSystem = ({ userStats, onAction }) => {
  const [showAchievements, setShowAchievements] = useState(false);
  
  const achievements = [
    { id: 1, name: 'Premier pas', description: 'Créer votre premier devis', icon: DocumentTextIcon, unlocked: true },
    { id: 2, name: 'Productif', description: '10 interventions en une journée', icon: BoltIcon, unlocked: true },
    { id: 3, name: 'Expert', description: 'Atteindre le niveau 10', icon: TrophyIcon, unlocked: false },
    { id: 4, name: 'Innovateur', description: 'Utiliser toutes les fonctionnalités', icon: LightBulbIcon, unlocked: false },
    { id: 5, name: 'Social', description: 'Inviter 5 collègues', icon: HeartIcon, unlocked: false },
    { id: 6, name: 'Analyste', description: 'Générer 50 rapports', icon: ChartBarIcon, unlocked: true }
  ];
  
  const leaderboardUsers = [
    { id: 1, name: 'Alexandre M.', score: 15420 },
    { id: 2, name: 'Sophie L.', score: 14280 },
    { id: 3, name: 'Thomas B.', score: 13950 },
    { id: 'current', name: 'Vous', score: 12750 },
    { id: 5, name: 'Marie D.', score: 11200 }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Barre de progression XP */}
      <XPProgressBar
        currentXP={userStats?.xp || 750}
        requiredXP={1000}
        level={userStats?.level || 8}
      />
      
      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compteur de série */}
        <StreakCounter
          currentStreak={userStats?.streak || 12}
          bestStreak={userStats?.bestStreak || 28}
        />
        
        {/* Récompenses quotidiennes */}
        <div className="lg:col-span-2">
          <DailyRewards
            claimedDays={userStats?.claimedDays || [1, 2, 3]}
            onClaim={(reward) => {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
              });
              onAction('claim_reward', reward);
            }}
          />
        </div>
      </div>
      
      {/* Achievements */}
      <motion.div
        className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
      >
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className="text-white font-bold text-lg flex items-center space-x-2">
            <TrophyIcon className="w-6 h-6 text-yellow-400" />
            <span>Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})</span>
          </h3>
          <motion.div
            animate={{ rotate: showAchievements ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {achievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={achievement.unlocked}
                  onUnlock={(ach) => onAction('unlock_achievement', ach)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Classement */}
      <Leaderboard
        users={leaderboardUsers}
        currentUserId="current"
      />
    </motion.div>
  );
};

export default GamificationSystem;