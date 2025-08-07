import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Composant pour un pot ultra-réaliste
function RealisticPot({ item, isSelected }) {
  const diameter = Math.max(item?.diameter || 20, 20);
  const height = Math.max(item?.height || 15, 15);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className={`relative transition-all duration-700 ${isSelected ? 'scale-110' : 'scale-100'}`}
      style={{ 
        width: `${Math.min(diameter * 5, 220)}px`, 
        height: `${Math.min(height * 5, 280)}px`,
        margin: '30px auto',
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
      }}
    >
      {/* Surface de table réaliste */}
      <div
        className="absolute -bottom-5 left-1/2 transform -translate-x-1/2"
        style={{
          width: `${Math.min(diameter * 6, 280)}px`,
          height: '10px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translateX(-50%) perspective(300px) rotateX(85deg)',
        }}
      />

      {/* Image du pot avec rendu 3D avancé */}
      {item?.image && !imageError ? (
        <div className="relative w-full h-full">
          {/* Conteneur principal avec perspective */}
          <div
            className="relative w-full h-full"
            style={{
              transform: 'perspective(800px) rotateX(8deg) rotateY(-3deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Image principale du pot */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain"
              style={{
                filter: 'contrast(1.1) brightness(1.05) saturate(1.1)',
                borderRadius: '8px'
              }}
              onError={() => setImageError(true)}
            />
            
            {/* Reflet réaliste sur le pot */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(135deg, 
                    transparent 20%, 
                    rgba(255,255,255,0.15) 25%, 
                    rgba(255,255,255,0.3) 35%, 
                    rgba(255,255,255,0.15) 45%, 
                    transparent 60%
                  )
                `,
                borderRadius: '8px',
                mixBlendMode: 'overlay'
              }}
            />

            {/* Ombre interne pour la profondeur */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 20%, 
                    transparent 40%, 
                    rgba(0,0,0,0.08) 70%, 
                    rgba(0,0,0,0.15) 100%
                  )
                `,
                borderRadius: '8px',
                mixBlendMode: 'multiply'
              }}
            />
          </div>

          {/* Reflet au sol */}
          <div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            style={{
              width: '100%',
              height: '30%',
              background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 100%)`,
              transform: 'translateX(-50%) perspective(300px) rotateX(85deg) scaleY(0.3)',
              borderRadius: '8px',
              filter: 'blur(3px)',
              opacity: 0.6
            }}
          >
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-contain opacity-30"
              style={{
                transform: 'scaleY(-1)',
                filter: 'blur(2px) brightness(0.5)'
              }}
            />
          </div>
        </div>
      ) : (
        /* Pot 3D CSS ultra-réaliste en fallback */
        <div className="relative w-full h-full">
          <div
            className="relative mx-auto"
            style={{
              width: '85%',
              height: '90%',
              background: `
                linear-gradient(145deg, 
                  #cd853f 0%, 
                  #d2691e 20%, 
                  #8b4513 50%, 
                  #a0522d 80%, 
                  #cd853f 100%
                )
              `,
              clipPath: 'polygon(25% 0%, 75% 0%, 85% 100%, 15% 100%)',
              transform: 'perspective(600px) rotateX(10deg)',
              borderRadius: '0 0 12px 12px',
              boxShadow: `
                inset -5px -5px 10px rgba(0,0,0,0.3),
                inset 5px 5px 10px rgba(255,255,255,0.1),
                0 20px 40px rgba(0,0,0,0.4)
              `
            }}
          >
            {/* Texture du pot */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.03) 2px,
                    rgba(0,0,0,0.03) 4px
                  )
                `,
                borderRadius: 'inherit'
              }}
            />

            {/* Rebord du pot 3D */}
            <div
              className="absolute -top-3 left-1/2 transform -translate-x-1/2"
              style={{
                width: '110%',
                height: '16px',
                background: `
                  linear-gradient(145deg, 
                    #d2691e 0%, 
                    #cd853f 50%, 
                    #8b4513 100%
                  )
                `,
                borderRadius: '50%',
                boxShadow: `
                  0 -2px 5px rgba(0,0,0,0.2),
                  inset 0 2px 5px rgba(255,255,255,0.1),
                  inset 0 -2px 5px rgba(0,0,0,0.2)
                `
              }}
            />

            {/* Soucoupe réaliste */}
            <div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
              style={{
                width: '120%',
                height: '12px',
                background: `
                  linear-gradient(145deg, 
                    #a0522d 0%, 
                    #cd853f 50%, 
                    #8b4513 100%
                  )
                `,
                borderRadius: '50%',
                boxShadow: `
                  0 4px 12px rgba(0,0,0,0.3),
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -1px 3px rgba(0,0,0,0.2)
                `
              }}
            />
          </div>
        </div>
      )}
      
      {/* Informations du pot avec design moderne */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            minWidth: '180px'
          }}
        >
          <p className="text-sm font-bold text-gray-800 mb-1">{item?.name}</p>
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Ø{diameter}cm</span>
            <span>H{height}cm</span>
          </div>
          <p className="text-lg font-bold text-green-600">{item?.price?.toFixed(2)}€</p>
          {item?.reference && (
            <p className="text-xs text-gray-400 mt-1">Ref: {item.reference}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Composant pour une plante ultra-réaliste
function RealisticPlant({ item, potHeight = 200, isSelected }) {
  const height = Math.max(item?.height || 30, 20);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className={`absolute transition-all duration-700 ${isSelected ? 'scale-105' : 'scale-100'}`}
      style={{ 
        bottom: `${potHeight * 0.6}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${Math.min(height * 4, 200)}px`,
        height: `${Math.min(height * 4, 240)}px`,
        zIndex: 10,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
      }}
    >
      {/* Image de la plante avec rendu 3D avancé */}
      {item?.image && !imageError ? (
        <div className="relative w-full h-full">
          {/* Conteneur principal avec perspective */}
          <div
            className="relative w-full h-full"
            style={{
              transform: 'perspective(600px) rotateX(-3deg) rotateY(1deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Image principale de la plante */}
            <motion.img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain"
              style={{
                filter: 'contrast(1.1) brightness(1.05) saturate(1.2)',
                borderRadius: '8px'
              }}
              onError={() => setImageError(true)}
              animate={{
                rotateY: [0, 1, -1, 0],
                rotateX: [0, 0.5, -0.5, 0],
                scale: [1, 1.002, 0.998, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Reflet naturel sur les feuilles */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse at 25% 25%, 
                    rgba(255,255,255,0.2) 0%, 
                    rgba(255,255,255,0.1) 30%, 
                    transparent 60%
                  ),
                  radial-gradient(ellipse at 75% 40%, 
                    rgba(255,255,255,0.15) 0%, 
                    transparent 40%
                  )
                `,
                borderRadius: '8px',
                mixBlendMode: 'overlay'
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Ombres subtiles pour la profondeur */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse at 70% 80%, 
                    transparent 30%, 
                    rgba(0,0,0,0.05) 60%, 
                    rgba(0,0,0,0.1) 100%
                  )
                `,
                borderRadius: '8px',
                mixBlendMode: 'multiply'
              }}
            />
          </div>

          {/* Reflet au sol de la plante */}
          <div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            style={{
              width: '80%',
              height: '20%',
              background: `linear-gradient(to bottom, rgba(0,100,0,0.1) 0%, transparent 100%)`,
              transform: 'translateX(-50%) perspective(300px) rotateX(85deg) scaleY(0.2)',
              borderRadius: '8px',
              filter: 'blur(4px)',
              opacity: 0.4
            }}
          >
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-contain opacity-20"
              style={{
                transform: 'scaleY(-1)',
                filter: 'blur(3px) brightness(0.3) hue-rotate(10deg)'
              }}
            />
          </div>
        </div>
      ) : (
        /* Plante 3D CSS ultra-réaliste en fallback */
        <div className="relative w-full h-full">
          {/* Pot de la plante (terre visible) */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: '60%',
              height: '25%',
              background: `
                linear-gradient(145deg, 
                  #8b4513 0%, 
                  #a0522d 50%, 
                  #654321 100%
                )
              `,
              borderRadius: '50%',
              boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.3)'
            }}
          />

          {/* Tige principale réaliste */}
          <div
            className="absolute left-1/2 bottom-1/4 transform -translate-x-1/2"
            style={{
              width: '8px',
              height: `${height * 2}px`,
              background: `
                linear-gradient(to right, 
                  #2d5016 0%, 
                  #4a7c30 30%, 
                  #2d5016 70%, 
                  #1a3009 100%
                )
              `,
              borderRadius: '4px',
              boxShadow: `
                inset -2px 0 4px rgba(0,0,0,0.3),
                inset 2px 0 4px rgba(255,255,255,0.1)
              `
            }}
          />
          
          {/* Feuilles ultra-réalistes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * 360 + (Math.random() - 0.5) * 30;
            const leafHeight = height * (0.8 + Math.random() * 0.6);
            const leafWidth = 25 + Math.random() * 15;
            const yPos = height * (0.3 + (i / 8) * 0.7);
            
            return (
              <motion.div
                key={i}
                className="absolute left-1/2 origin-bottom"
                style={{
                  width: `${leafWidth}px`,
                  height: `${leafHeight}px`,
                  bottom: `${yPos}px`,
                  background: `
                    linear-gradient(45deg, 
                      #1e4d2b 0%, 
                      #2d5016 20%, 
                      #4a7c30 40%, 
                      #68a047 60%, 
                      #4a7c30 80%, 
                      #2d5016 100%
                    )
                  `,
                  borderRadius: '60px 10px 60px 10px',
                  transform: `
                    translateX(-50%) 
                    rotate(${angle}deg) 
                    perspective(200px) 
                    rotateX(${10 + Math.random() * 20}deg)
                    rotateY(${(Math.random() - 0.5) * 30}deg)
                  `,
                  boxShadow: `
                    inset -3px -3px 6px rgba(0,0,0,0.3),
                    inset 3px 3px 6px rgba(255,255,255,0.1),
                    0 3px 8px rgba(0,0,0,0.2)
                  `,
                  transformStyle: 'preserve-3d'
                }}
                animate={{
                  rotateZ: [angle, angle + 4, angle - 4, angle],
                  rotateY: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30 + 5, (Math.random() - 0.5) * 30 - 5, (Math.random() - 0.5) * 30],
                  scale: [1, 1.03, 0.97, 1]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              >
                {/* Nervures des feuilles */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(to top, 
                        transparent 0%, 
                        rgba(255,255,255,0.1) 50%, 
                        transparent 100%
                      ),
                      repeating-linear-gradient(45deg,
                        transparent,
                        transparent 8px,
                        rgba(0,0,0,0.05) 8px,
                        rgba(0,0,0,0.05) 9px
                      )
                    `,
                    borderRadius: 'inherit'
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* Informations de la plante avec design moderne */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-center"
          style={{
            background: 'rgba(34, 197, 94, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px',
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)',
            color: 'white',
            minWidth: '160px'
          }}
        >
          <p className="text-sm font-bold mb-1">{item?.name}</p>
          <p className="text-xs opacity-90 mb-2">Hauteur: {height}cm</p>
          <p className="text-lg font-bold">{item?.price?.toFixed(2)}€</p>
          {item?.reference && (
            <p className="text-xs opacity-75 mt-1">Ref: {item.reference}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function CompositionRealistic() {
  const navigate = useNavigate();
  const [selectedPot, setSelectedPot] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRotating, setIsRotating] = useState(true);

  // Charger le stock depuis l'API Nieuwkoop
  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/nieuwkoop/stock");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const cleaned = data.map(item => ({
            ...item,
            price: item.pricing?.price || (typeof item.price === 'number' ? item.price : Number(item.price) || 0),
            quantity: item.stock?.quantity || item.quantity || 0,
            reservedQuantity: item.stock?.reservedQuantity || item.reservedQuantity || 0,
            image: item.images?.[0]?.url || item.image || '',
            height: item.dimensions?.height || item.height || 0,
            diameter: item.dimensions?.diameter || item.diameter || item.DiameterCulturePot || item.Diameter || item.Opening || (item.PotSize ? parseInt(item.PotSize) : 0) || 0,
            note: item.notes || item.note || '',
            itemType: determineItemType(item)
          }));
          setStockItems(cleaned);
          
          // Sélectionner le premier pot et la première plante par défaut
          const defaultPot = cleaned.find(item => item.itemType === 'pot' && item.quantity > 0);
          const defaultPlant = cleaned.find(item => item.itemType === 'plant' && item.quantity > 0);
          
          if (defaultPot) setSelectedPot(defaultPot);
          if (defaultPlant) setSelectedPlant(defaultPlant);
        } else {
          console.error("Data is not an array:", data);
          setStockItems([]);
        }
      } catch (err) {
        console.error("Erreur chargement stock:", err);
        setError("Erreur lors du chargement du stock");
        setStockItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  // Fonction pour déterminer le type d'item (pot ou plante)
  const determineItemType = (item) => {
    const name = (item.name || '').toLowerCase();
    const reference = (item.reference || '').toLowerCase();
    
    const potKeywords = ['pot', 'vase', 'jardinière', 'bac', 'conteneur', 'récipient'];
    const plantKeywords = ['plante', 'fleur', 'fougère', 'palmier', 'succulente', 'cactus', 'orchidée'];
    
    const isPot = potKeywords.some(keyword => 
      name.includes(keyword) || reference.includes(keyword)
    );
    
    const isPlant = plantKeywords.some(keyword => 
      name.includes(keyword) || reference.includes(keyword)
    );
    
    if (isPot) return 'pot';
    if (isPlant) return 'plant';
    
    if (item.category === 'contenant') return 'pot';
    if (item.category === 'plante') return 'plant';
    
    return (item.diameter && item.diameter < 20) ? 'plant' : 'pot';
  };

  // Filtrer les items par type
  const pots = stockItems.filter(item => item.itemType === 'pot' && item.quantity > 0);
  const plants = stockItems.filter(item => item.itemType === 'plant' && item.quantity > 0);

  // Appliquer les filtres de recherche
  const filteredPots = pots.filter(pot => 
    pot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pot.reference || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPlants = plants.filter(plant => 
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plant.reference || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPrice = (selectedPot?.price || 0) + (selectedPlant?.price || 0);

  const handleSaveComposition = () => {
    if (!selectedPot || !selectedPlant) {
      alert('Veuillez sélectionner un pot et une plante avant de sauvegarder.');
      return;
    }

    const composition = {
      pot: selectedPot,
      plant: selectedPlant,
      totalPrice,
      createdAt: new Date().toISOString()
    };
    
    const compositions = JSON.parse(localStorage.getItem('compositions') || '[]');
    compositions.push(composition);
    localStorage.setItem('compositions', JSON.stringify(compositions));
    
    alert('Composition sauvegardée avec succès !');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Chargement du stock...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/home')}
            className="p-3 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg"
          >
            ← Retour
          </button>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Compositeur Ultra-Réaliste 🌿
          </h1>
        </div>
        
        <div className="text-right bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30">
          <p className="text-sm text-white/80">Prix total</p>
          <p className="text-4xl font-bold text-white drop-shadow-lg">{totalPrice.toFixed(2)}€</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualiseur 3D Ultra-Réaliste */}
        <motion.div 
          className="lg:col-span-2 rounded-3xl shadow-2xl p-8 h-[700px] overflow-hidden relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
              linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)
            `,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {/* Éclairage ambiant */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at 20% 20%, rgba(255,255,0,0.1) 0%, transparent 40%),
                radial-gradient(ellipse at 80% 80%, rgba(255,150,0,0.05) 0%, transparent 50%)
              `
            }}
          />

          <div 
            className="relative w-full h-full flex items-end justify-center"
            style={{
              perspective: '1000px',
              background: `
                radial-gradient(ellipse at center bottom, rgba(34, 197, 94, 0.1) 0%, transparent 60%)
              `
            }}
          >
            {selectedPot ? (
              <motion.div
                className="relative"
                animate={isRotating ? {
                  rotateY: [0, 360]
                } : {}}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ 
                  transformStyle: 'preserve-3d',
                  marginBottom: '50px'
                }}
              >
                <RealisticPot item={selectedPot} isSelected={true} />
                {selectedPlant && (
                  <RealisticPlant 
                    item={selectedPlant} 
                    potHeight={Math.min(Math.max(selectedPot.height || 15, 15) * 5, 280)}
                    isSelected={true}
                  />
                )}
              </motion.div>
            ) : (
              <div className="text-center text-white/70">
                <p className="text-3xl mb-4">🏺</p>
                <p className="text-xl">Sélectionnez un pot pour commencer</p>
              </div>
            )}
          </div>
          
          {/* Contrôles */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all font-semibold"
            >
              {isRotating ? '⏸️ Pause' : '▶️ Rotation'}
            </button>
          </div>
        </motion.div>

        {/* Panneau de sélection amélioré */}
        <motion.div 
          className="space-y-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Barre de recherche stylée */}
          <div 
            className="rounded-xl shadow-lg p-4"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <input
              type="text"
              placeholder="🔍 Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            />
          </div>

          {/* Statistiques stylées */}
          <div 
            className="rounded-xl shadow-lg p-4"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div className="grid grid-cols-2 gap-4 text-center text-white">
              <div>
                <p className="text-3xl font-bold drop-shadow-lg">{filteredPots.length}</p>
                <p className="text-sm opacity-80">Pots</p>
              </div>
              <div>
                <p className="text-3xl font-bold drop-shadow-lg">{filteredPlants.length}</p>
                <p className="text-sm opacity-80">Plantes</p>
              </div>
            </div>
          </div>

          {/* Sélection des pots */}
          <div 
            className="rounded-xl shadow-lg p-6 max-h-64 overflow-y-auto"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">🏺 Pots ({filteredPots.length})</h2>
            <div className="space-y-2">
              {filteredPots.map((pot) => (
                <motion.div
                  key={pot._id}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedPot?._id === pot._id 
                      ? 'bg-white/30 border-2 border-white/50 shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedPot(pot)}
                >
                  <div className="flex items-center gap-3">
                    {pot.image ? (
                      <img 
                        src={pot.image} 
                        alt={pot.name}
                        className="w-12 h-12 object-contain rounded border border-white/20 flex-shrink-0 bg-white/10"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded flex items-center justify-center flex-shrink-0">
                        🏺
                      </div>
                    )}
                    
                    <div className="flex-1 text-white">
                      <div className="font-medium text-sm">{pot.name}</div>
                      <div className="text-xs opacity-70">
                        Ø{pot.diameter}cm • H{pot.height}cm • Stock: {pot.quantity}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0 text-white">
                      <div className="font-bold text-sm">{pot.price?.toFixed(2)}€</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sélection des plantes */}
          <div 
            className="rounded-xl shadow-lg p-6 max-h-64 overflow-y-auto"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">🌱 Plantes ({filteredPlants.length})</h2>
            <div className="space-y-2">
              {filteredPlants.map((plant) => (
                <motion.div
                  key={plant._id}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedPlant?._id === plant._id 
                      ? 'bg-green-500/30 border-2 border-green-400/50 shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedPlant(plant)}
                >
                  <div className="flex items-center gap-3">
                    {plant.image ? (
                      <img 
                        src={plant.image} 
                        alt={plant.name}
                        className="w-12 h-12 object-contain rounded border border-white/20 flex-shrink-0 bg-white/10"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-b from-green-600 to-green-400 rounded flex items-center justify-center flex-shrink-0">
                        🌱
                      </div>
                    )}
                    
                    <div className="flex-1 text-white">
                      <div className="font-medium text-sm">{plant.name}</div>
                      <div className="text-xs opacity-70">
                        H{plant.height}cm • Stock: {plant.quantity}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0 text-white">
                      <div className="font-bold text-sm">{plant.price?.toFixed(2)}€</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSaveComposition}
              className="w-full py-4 bg-green-500/80 backdrop-blur-lg text-white rounded-xl hover:bg-green-500 transition-all font-bold text-lg shadow-lg border border-green-400/30"
            >
              💾 Sauvegarder la composition
            </button>
            <button
              onClick={() => {
                setSelectedPlant(null);
                setSelectedPot(null);
                setSearchTerm('');
              }}
              className="w-full py-3 bg-white/20 backdrop-blur-lg text-white rounded-xl hover:bg-white/30 transition-all font-semibold border border-white/30"
            >
              🔄 Réinitialiser
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}