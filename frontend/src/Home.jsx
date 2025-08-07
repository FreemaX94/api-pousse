// frontend/src/pages/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  PlusSquare,
  Wrench,
  Archive,
  Truck,
  BarChart2,
  Settings2,
  DollarSign,
  Leaf, // ✅ Nouvelle icône pour Nieuwkoop
} from 'lucide-react'

// Composant icône de cactus personnalisé
const CactusIcon = ({ size = 48, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M12 2v16M8 6c-1.5 0-3 1.5-3 3s1.5 3 3 3M16 10c1.5 0 3-1.5 3-3s-1.5-3-3-3M12 18c-2 0-3 1-3 2h6c0-1-1-2-3-2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      animate={{
        strokeDasharray: [0, 100],
        strokeDashoffset: [0, -100]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.circle
      cx="9"
      cy="8"
      r="1"
      fill={color}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: 0.5
      }}
    />
    <motion.circle
      cx="15"
      cy="6"
      r="1"
      fill={color}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: 1
      }}
    />
  </svg>
)
import { useTheme } from './contexts/ThemeContext'


const sections = [
  { 
    label: 'Événements', 
    icon: Calendar, 
    path: '/app/evenements',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#667eea',
    description: 'Gérez vos événements et planifications'
  },
  { 
    label: 'Création', 
    icon: PlusSquare, 
    path: '/app/creation',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    color: '#f093fb',
    description: 'Créez de nouveaux projets et tâches'
  },
  { 
    label: 'Entretien', 
    icon: Wrench, 
    path: '/app/entretien',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    color: '#4facfe',
    description: 'Maintenance et entretien des équipements'
  },
  { 
    label: 'Dépôt', 
    icon: Archive, 
    path: '/app/depot',
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    color: '#43e97b',
    description: 'Gestion des stocks et inventaires'
  },
  { 
    label: 'Livraisons', 
    icon: Truck, 
    path: '/app/livraisons',
    gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    color: '#fa709a',
    description: 'Suivi des livraisons et expéditions'
  },
  { 
    label: 'Véhicules', 
    icon: Truck, 
    path: '/app/vehicules',
    gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    color: '#a8edea',
    description: 'Gestion de la flotte de véhicules'
  },
  { 
    label: 'Nieuwkoop', 
    icon: Leaf, 
    path: '/app/nieuwkoop',
    gradient: 'linear-gradient(135deg, #d299c2, #fef9d7)',
    color: '#d299c2',
    description: 'Interface fournisseur Nieuwkoop'
  },
  { 
    label: 'Composition 3D', 
    icon: CactusIcon, 
    path: '/app/composition',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#667eea',
    description: 'Visualiseur 3D plantes et pots'
  },
  { 
    label: 'Statistiques', 
    icon: BarChart2, 
    path: '/app/statistiques',
    gradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
    color: '#89f7fe',
    description: 'Analyses et rapports détaillés'
  },
  { 
    label: 'Paramètres', 
    icon: Settings2, 
    path: '/app/parametres',
    gradient: 'linear-gradient(135deg, #fdbb2d, #22c1c3)',
    color: '#fdbb2d',
    description: 'Configuration de l\'application'
  },
  { 
    label: 'Comptabilité', 
    icon: DollarSign, 
    path: '/app/comptabilite',
    gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
    color: '#ff9a9e',
    description: 'Gestion financière et facturation'
  },
]

// Composant interne avec le contenu de la page
const HomeContent = () => {
  const navigate = useNavigate()

  return (
    <motion.div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '120%',
        height: '120%',
        background: 'radial-gradient(circle at 20% 80%, rgba(255,248,220,0.3) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-5%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle at 80% 20%, rgba(222,184,135,0.2) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      {/* Header Section */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 2rem 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Titre principal avec animations stylées */}
        <motion.h1
          initial={{ opacity: 0, y: -50, scale: 0.8, rotateX: -90 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            rotateX: 0,
            textShadow: [
              '0 0 30px rgba(217, 119, 6, 0.3)',
              '0 0 50px rgba(217, 119, 6, 0.6)',
              '0 0 30px rgba(217, 119, 6, 0.3)'
            ]
          }}
          transition={{ 
            duration: 1.2, 
            delay: 0.8,
            ease: "easeOut"
          }}
          whileHover={{
            scale: 1.05,
            y: -5,
            transition: { 
              type: "spring",
              stiffness: 400,
              damping: 10
            }
          }}
          style={{
            fontSize: '5rem',
            fontWeight: '400',
            color: '#ffffff',
            marginTop: '2rem',
            letterSpacing: '0.1em',
            fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
            textShadow: `
              2px 2px 0px var(--color-secondary),
              4px 4px 0px var(--color-primary),
              6px 6px 0px var(--color-accent),
              8px 8px 15px rgba(0,0,0,0.4),
              0 0 40px rgba(217, 119, 6, 0.6)
            `,
            cursor: 'pointer',
            transformStyle: 'preserve-3d'
          }}
        >
          <motion.span
            animate={{
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ display: 'inline-block', marginRight: '1rem' }}
          >
            <CactusIcon 
              size={60} 
              color="var(--color-primary)"
            />
          </motion.span>
          
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {['P', 'o', 'u', 's', 's', 'e'].map((letter, index) => (
              <motion.span
                key={index}
                animate={{
                  textShadow: [
                    `2px 2px 0px var(--color-secondary), 4px 4px 0px var(--color-primary), 6px 6px 0px var(--color-accent), 8px 8px 15px rgba(0,0,0,0.4)`,
                    `3px 3px 0px var(--color-secondary), 6px 6px 0px var(--color-primary), 9px 9px 0px var(--color-accent), 12px 12px 20px rgba(0,0,0,0.5)`,
                    `2px 2px 0px var(--color-secondary), 4px 4px 0px var(--color-primary), 6px 6px 0px var(--color-accent), 8px 8px 15px rgba(0,0,0,0.4)`
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1
                }}
                whileHover={{
                  scale: 1.3,
                  y: -10,
                  textShadow: `4px 4px 0px var(--color-secondary), 8px 8px 0px var(--color-primary), 12px 12px 0px var(--color-accent), 16px 16px 25px rgba(0,0,0,0.6)`,
                  transition: { 
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                    duration: 0.3
                  }
                }}
                style={{
                  color: '#ffffff',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </motion.h1>
        
        {/* Trait décoratif 3D sous le titre */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: ['0%', '80%', '60%'],
            opacity: [0, 1, 1]
          }}
          transition={{
            duration: 2,
            delay: 1.5,
            ease: "easeOut"
          }}
          style={{
            height: '12px',
            margin: '0.2rem auto 0',
            position: 'relative',
            maxWidth: '400px'
          }}
        >
          {/* Trait principal avec effet 3D */}
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, 
                transparent 0%, 
                var(--color-primary) 20%, 
                var(--color-accent) 50%, 
                var(--color-secondary) 80%, 
                transparent 100%
              )`,
              borderRadius: '50px',
              clipPath: 'ellipse(100% 100% at 50% 50%)',
              transform: 'scaleX(1) scaleY(0.8)',
              boxShadow: `
                0 3px 0px var(--color-secondary),
                0 6px 0px var(--color-primary),
                0 9px 20px rgba(0,0,0,0.4),
                inset 0 2px 0px rgba(255,255,255,0.4)
              `,
              position: 'relative'
            }}
            animate={{
              boxShadow: [
                `0 3px 0px var(--color-secondary), 0 6px 0px var(--color-primary), 0 9px 20px rgba(0,0,0,0.4), inset 0 2px 0px rgba(255,255,255,0.4)`,
                `0 4px 0px var(--color-secondary), 0 8px 0px var(--color-primary), 0 12px 25px rgba(0,0,0,0.5), inset 0 3px 0px rgba(255,255,255,0.5)`,
                `0 3px 0px var(--color-secondary), 0 6px 0px var(--color-primary), 0 9px 20px rgba(0,0,0,0.4), inset 0 2px 0px rgba(255,255,255,0.4)`
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Particules scintillantes sur le trait */}
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '20%',
              width: '4px',
              height: '4px',
              background: 'var(--color-accent)',
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--color-accent)'
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '60%',
              width: '3px',
              height: '3px',
              background: 'var(--color-primary)',
              borderRadius: '50%',
              boxShadow: '0 0 6px var(--color-primary)'
            }}
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 1.2
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '80%',
              width: '3px',
              height: '3px',
              background: 'var(--color-secondary)',
              borderRadius: '50%',
              boxShadow: '0 0 6px var(--color-secondary)'
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 2
            }}
          />
        </motion.div>
        
        {/* Effets décoratifs autour du titre */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            border: '2px solid var(--color-primary)',
            borderRadius: '50%',
            opacity: 0.1,
            pointerEvents: 'none'
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            border: '1px solid var(--color-accent)',
            borderRadius: '50%',
            opacity: 0.15,
            pointerEvents: 'none'
          }}
          animate={{
            rotate: [360, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
      </section>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {sections.map(({ label, icon: Icon, path, gradient, color, description }, index) => (
            <motion.button
              key={label}
              onClick={() => navigate(path)}
              initial={{ 
                opacity: 0, 
                y: 50, 
                scale: 0.9
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1
              }}
              transition={{ 
                duration: 0.6, 
                delay: 1.2 + (index * 0.1),
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -12, 
                scale: 1.03,
                rotateY: 5,
                rotateX: 5,
                transition: { 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              whileTap={{ 
                scale: 0.95,
                rotateY: 0,
                rotateX: 0,
                transition: { duration: 0.1 }
              }}
              style={{
                background: 'var(--glass-bg)',
                borderRadius: '24px',
                padding: '2.5rem',
                border: '2px solid var(--glass-border)',
                boxShadow: 'var(--shadow-xl)',
                backdropFilter: 'var(--glass-backdrop)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1.5rem',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 25px 50px ${color}30, 0 0 0 1px ${color}20`;
                e.currentTarget.style.borderColor = `${color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            >
              {/* Background decorative element with animation */}
              <motion.div 
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-30%',
                  width: '100%',
                  height: '100%',
                  background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Particles effect */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '20%',
                  left: '20%',
                  width: '8px',
                  height: '8px',
                  background: `${color}60`,
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  top: '60%',
                  right: '25%',
                  width: '6px',
                  height: '6px',
                  background: `${color}40`,
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
                animate={{
                  y: [0, 15, 0],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              />

              {/* Icon with gradient background and animations */}
              <motion.div 
                style={{
                  background: gradient,
                  borderRadius: '20px',
                  padding: '1.2rem',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: `0 8px 25px ${color}40`
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
                animate={{
                  boxShadow: [
                    `0 8px 25px ${color}40`,
                    `0 12px 35px ${color}50`,
                    `0 8px 25px ${color}40`
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Icon 
                    size={32} 
                    style={{ 
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }} 
                  />
                </motion.div>
              </motion.div>

              {/* Content with animations */}
              <motion.div 
                style={{
                  position: 'relative',
                  zIndex: 1,
                  flex: 1
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + (index * 0.1) }}
              >
                <motion.h3 
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: '#1e293b',
                    margin: '0 0 0.5rem 0',
                    lineHeight: '1.2'
                  }}
                  whileHover={{
                    color: color,
                    transition: { duration: 0.3 }
                  }}
                >
                  {label}
                </motion.h3>
                <motion.p 
                  style={{
                    fontSize: '1rem',
                    color: '#64748b',
                    fontWeight: '500',
                    margin: 0,
                    lineHeight: '1.5'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 + (index * 0.1) }}
                >
                  {description}
                </motion.p>
              </motion.div>

              {/* Arrow indicator with animations */}
              <motion.div 
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  right: '1.5rem',
                  background: gradient,
                  borderRadius: '12px',
                  padding: '0.75rem',
                  opacity: 0.8
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: 360,
                  opacity: 1,
                  transition: { duration: 0.3 }
                }}
                animate={{
                  x: [0, 3, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <motion.svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  animate={{
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <path d="m9 18 6-6-6-6"/>
                </motion.svg>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </main>

      {/* Footer decorative element */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '30%',
        background: 'radial-gradient(ellipse at center, rgba(222,184,135,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
    </motion.div>
  )
}

// Composant principal
export default function Home() {
  return <HomeContent />
}
