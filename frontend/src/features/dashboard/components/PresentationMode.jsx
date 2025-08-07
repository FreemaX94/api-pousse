// Mode Présentation Ultra Premium avec Effets 3D 🎭
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  PlayIcon,
  PauseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ComputerDesktopIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  ArrowsPointingOutIcon,
  PresentationChartLineIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CubeTransparentIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Float, Stars } from '@react-three/drei';
import confetti from 'canvas-confetti';

// Composant 3D animé pour les transitions
const AnimatedCube = ({ color = '#9333EA' }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};

// Effet de particules 3D
const ParticleField = () => {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={particlesRef}>
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
    </group>
  );
};

// Slide individuel avec effets 3D
const PresentationSlide = ({ slide, isActive, transition }) => {
  return (
    <motion.div
      initial={transition.initial}
      animate={isActive ? transition.animate : transition.exit}
      exit={transition.exit}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="max-w-6xl w-full px-8">
        {/* Titre avec effet néon */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-white mb-8 text-center"
          style={{
            textShadow: '0 0 30px rgba(147, 51, 234, 0.8), 0 0 60px rgba(147, 51, 234, 0.4)'
          }}
        >
          {slide.title}
        </motion.h1>

        {/* Sous-titre animé */}
        {slide.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-gray-300 text-center mb-12"
          >
            {slide.subtitle}
          </motion.p>
        )}

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className={`${slide.layout === 'grid' ? 'grid grid-cols-2 gap-8' : ''}`}
        >
          {slide.content}
        </motion.div>

        {/* Animation 3D de fond */}
        {slide.show3D && (
          <div className="absolute inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <AnimatedCube color={slide.color || '#9333EA'} />
              <ParticleField />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Contrôles de présentation
const PresentationControls = ({ 
  currentSlide, 
  totalSlides, 
  onPrevious, 
  onNext, 
  onExit,
  isPlaying,
  onPlayPause 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-full px-6 py-3 
                      border border-purple-500/30 flex items-center space-x-4">
        {/* Bouton précédent */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          disabled={currentSlide === 0}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayPause}
          className="p-3 rounded-full bg-purple-600 hover:bg-purple-700"
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5 text-white" />
          ) : (
            <PlayIcon className="w-5 h-5 text-white" />
          )}
        </motion.button>

        {/* Indicateur de progression */}
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">
            {currentSlide + 1} / {totalSlides}
          </span>
          <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Bouton suivant */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronRightIcon className="w-5 h-5 text-white" />
        </motion.button>

        {/* Bouton quitter */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
          className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/30"
        >
          <XMarkIcon className="w-5 h-5 text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Effet de transition personnalisé
const transitions = {
  slide: {
    initial: { x: 1000, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -1000, opacity: 0 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  zoom: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 2, opacity: 0 }
  },
  rotate: {
    initial: { rotate: 180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: -180, opacity: 0 }
  },
  cube: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 }
  }
};

// Mode présentation principal
const PresentationMode = ({ slides: customSlides, onExit }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transition, setTransition] = useState('slide');
  
  // Slides par défaut si aucun n'est fourni
  const defaultSlides = [
    {
      id: 1,
      title: 'Bienvenue dans OrganipoussV2',
      subtitle: 'La révolution de la gestion d\'entreprise',
      content: (
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <RocketLaunchIcon className="w-32 h-32 text-purple-400 mx-auto" />
          </motion.div>
          <p className="text-xl text-gray-300 mt-8">
            Une expérience utilisateur révolutionnaire avec des performances exceptionnelles
          </p>
        </div>
      ),
      show3D: true,
      color: '#9333EA'
    },
    {
      id: 2,
      title: 'Tableau de Bord Intelligent',
      subtitle: 'Visualisez vos données en temps réel',
      layout: 'grid',
      content: (
        <>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">KPIs en temps réel</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Chiffre d'affaires instantané</li>
              <li>• Suivi des interventions</li>
              <li>• Satisfaction client</li>
              <li>• Performances équipe</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">IA Assistante</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Suggestions automatiques</li>
              <li>• Prédictions intelligentes</li>
              <li>• Optimisation des processus</li>
              <li>• Alertes proactives</li>
            </ul>
          </div>
        </>
      ),
      show3D: false
    },
    {
      id: 3,
      title: 'Gamification & Motivation',
      subtitle: 'Engagez vos équipes comme jamais',
      content: (
        <div className="grid grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white">Achievements</h3>
            <p className="text-gray-400 mt-2">Débloquez des récompenses</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white">Classements</h3>
            <p className="text-gray-400 mt-2">Compétition saine</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white">Objectifs</h3>
            <p className="text-gray-400 mt-2">Progression visible</p>
          </motion.div>
        </div>
      ),
      show3D: true,
      color: '#10B981'
    },
    {
      id: 4,
      title: 'Widgets Personnalisables',
      subtitle: 'Créez votre espace de travail idéal',
      content: (
        <div className="relative h-96">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 left-0 w-48 h-32 bg-purple-600/30 rounded-xl p-4"
          >
            <p className="text-white font-semibold">Widget Graphique</p>
          </motion.div>
          <motion.div
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-20 right-0 w-48 h-32 bg-blue-600/30 rounded-xl p-4"
          >
            <p className="text-white font-semibold">Widget Horloge</p>
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-40 
                       bg-gradient-to-br from-green-600/30 to-teal-600/30 rounded-xl p-4"
          >
            <p className="text-white font-semibold text-center">Widget Principal</p>
          </motion.div>
        </div>
      ),
      show3D: false
    },
    {
      id: 5,
      title: 'Merci !',
      subtitle: 'Prêt à transformer votre entreprise ?',
      content: (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              confetti({
                particleCount: 200,
                spread: 70,
                origin: { y: 0.6 }
              });
            }}
            className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 
                     text-white text-2xl font-bold rounded-2xl shadow-2xl"
          >
            Commencer maintenant
          </motion.button>
        </div>
      ),
      show3D: true,
      color: '#EC4899'
    }
  ];

  const slides = customSlides || defaultSlides;

  // Auto-play
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(currentSlide + 1);
        } else {
          setIsPlaying(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentSlide, slides.length]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') handleExit();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, isPlaying]);

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onExit();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 z-50"
    >
      {/* Effet de fond animé */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, delay: 10 }}
        />
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <PresentationSlide
          key={slides[currentSlide].id}
          slide={slides[currentSlide]}
          isActive={true}
          transition={transitions[transition]}
        />
      </AnimatePresence>

      {/* Contrôles */}
      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onExit={handleExit}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
      />

      {/* Indicateurs de slide */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'w-8 bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Options de transition */}
      <div className="fixed top-8 right-8 z-50">
        <select
          value={transition}
          onChange={(e) => setTransition(e.target.value)}
          className="bg-gray-900/80 text-white px-4 py-2 rounded-lg border border-purple-500/30"
        >
          <option value="slide">Slide</option>
          <option value="fade">Fade</option>
          <option value="zoom">Zoom</option>
          <option value="rotate">Rotate</option>
          <option value="cube">Cube 3D</option>
        </select>
      </div>
    </motion.div>
  );
};

export default PresentationMode;