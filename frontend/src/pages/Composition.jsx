import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, Center, PresentationControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

// Composant pour un pot 3D
function Pot({ color = '#8B4513', size = 1, position = [0, 0, 0], item = null }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* Pot principal - forme conique inversée */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[size * 0.8, size * 0.6, size * 1.2, 32]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Rebord du pot */}
        <mesh position={[0, size * 0.6, 0]}>
          <torusGeometry args={[size * 0.8, size * 0.08, 8, 32]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Soucoupe */}
        <mesh position={[0, -size * 0.65, 0]}>
          <cylinderGeometry args={[size * 0.9, size * 0.85, size * 0.1, 32]} />
          <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
        </mesh>
      </mesh>
    </group>
  );
}

// Composant pour une plante 3D
function Plant({ type = 'fern', size = 1, position = [0, 0.8, 0], item = null }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      // Animation légère de la plante (effet de vent)
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  const plantConfigs = {
    fern: {
      color: '#228B22',
      leafCount: 12,
      leafSize: 0.8,
      height: 1.5
    },
    palm: {
      color: '#2E8B57',
      leafCount: 8,
      leafSize: 1.2,
      height: 2
    },
    succulent: {
      color: '#8FBC8F',
      leafCount: 16,
      leafSize: 0.4,
      height: 0.8
    }
  };

  const config = plantConfigs[type] || plantConfigs.fern;

  return (
    <group ref={groupRef} position={position}>
      {/* Tige centrale */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.1, config.height * size, 8]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      
      {/* Feuilles */}
      {Array.from({ length: config.leafCount }).map((_, i) => {
        const angle = (i / config.leafCount) * Math.PI * 2;
        const height = (i / config.leafCount) * config.height * size * 0.8;
        const leafSize = config.leafSize * size * (1 - i / config.leafCount * 0.3);
        
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * leafSize * 0.5,
              height,
              Math.sin(angle) * leafSize * 0.5
            ]}
            rotation={[0, angle, Math.PI / 6]}
          >
            <coneGeometry args={[leafSize * 0.3, leafSize, 4]} />
            <meshStandardMaterial 
              color={config.color} 
              side={THREE.DoubleSide}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Composant principal de la scène 3D
function Scene({ selectedPot, selectedPlant }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -5]} intensity={0.5} />
      
      <PresentationControls
        speed={1.5}
        global
        zoom={0.7}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <Center>
          {/* Pot */}
          {selectedPot && (
            <Pot 
              color={selectedPot.color || '#8B4513'} 
              size={Math.max(selectedPot.diameter / 20, 1)}
              position={[0, 0, 0]}
              item={selectedPot}
            />
          )}
          
          {/* Plante */}
          {selectedPlant && selectedPot && (
            <Plant 
              type={getPlantType(selectedPlant)}
              size={Math.max(selectedPlant.height / 30, 0.5)}
              position={[0, Math.max(selectedPot.diameter / 20, 1) * 0.6, 0]}
              item={selectedPlant}
            />
          )}
        </Center>
      </PresentationControls>
      
      <ContactShadows 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
        position={[0, -2, 0]} 
      />
      
      <Environment preset="studio" />
    </>
  );
}

export default function Composition() {
  const navigate = useNavigate();
  const [selectedPot, setSelectedPot] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

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
            // Déterminer le type basé sur les caractéristiques
            itemType: determineItemType(item)
          }));
          setStockItems(cleaned);
          
          // Sélectionner le premier pot et la première plante par défaut
          const defaultPot = cleaned.find(item => item.itemType === 'pot');
          const defaultPlant = cleaned.find(item => item.itemType === 'plant');
          
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
    
    // Mots-clés pour les pots
    const potKeywords = ['pot', 'vase', 'jardinière', 'bac', 'conteneur', 'récipient'];
    // Mots-clés pour les plantes
    const plantKeywords = ['plante', 'fleur', 'fougère', 'palmier', 'succulente', 'cactus', 'orchidée'];
    
    const isPot = potKeywords.some(keyword => 
      name.includes(keyword) || reference.includes(keyword)
    );
    
    const isPlant = plantKeywords.some(keyword => 
      name.includes(keyword) || reference.includes(keyword)
    );
    
    if (isPot) return 'pot';
    if (isPlant) return 'plant';
    
    // Si on ne peut pas déterminer, utiliser la catégorie si elle existe
    if (item.category === 'contenant') return 'pot';
    if (item.category === 'plante') return 'plant';
    
    // Par défaut, considérer comme plante si diamètre < 20, sinon pot
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

  // Fonction pour déterminer le type de plante pour la 3D
  const getPlantType = (plant) => {
    const name = (plant.name || '').toLowerCase();
    if (name.includes('palm') || name.includes('palmier')) return 'palm';
    if (name.includes('succulent') || name.includes('cactus')) return 'succulent';
    return 'fern'; // par défaut
  };

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
    
    // Sauvegarder dans le localStorage pour l'instant
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
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
            className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            ← Retour
          </button>
          <h1 className="text-4xl font-bold text-gray-800">
            Compositeur 3D 🌿
          </h1>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Prix total</p>
          <p className="text-3xl font-bold text-green-600">{totalPrice}€</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Canvas 3D */}
        <motion.div 
          className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-4 h-[600px]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            </div>
          }>
            <Canvas
              camera={{ position: [0, 2, 5], fov: 50 }}
              shadows
            >
              <Scene selectedPot={selectedPot} selectedPlant={selectedPlant} />
              <OrbitControls 
                enablePan={false}
                enableZoom={true}
                minDistance={3}
                maxDistance={10}
                autoRotate={isRotating}
                autoRotateSpeed={2}
              />
            </Canvas>
          </Suspense>
          
          {/* Contrôles */}
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {isRotating ? '⏸️ Pause' : '▶️ Rotation'}
            </button>
          </div>
        </motion.div>

        {/* Panneau de sélection */}
        <motion.div 
          className="space-y-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Barre de recherche */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Statistiques */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{filteredPots.length}</p>
                <p className="text-sm text-gray-600">Pots disponibles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{filteredPlants.length}</p>
                <p className="text-sm text-gray-600">Plantes disponibles</p>
              </div>
            </div>
          </div>

          {/* Sélection du pot */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-h-64 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🏺 Choisir un pot ({filteredPots.length})</h2>
            <div className="space-y-2">
              {filteredPots.map((pot) => (
                <motion.div
                  key={pot._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedPot?._id === pot._id 
                      ? 'bg-green-100 border-2 border-green-500' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedPot(pot)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{pot.name}</div>
                      <div className="text-xs text-gray-500">
                        Ø{pot.diameter}cm • H{pot.height}cm • Stock: {pot.quantity}
                      </div>
                      {pot.reference && (
                        <div className="text-xs text-gray-400">Ref: {pot.reference}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-sm">{pot.price?.toFixed(2) || '0.00'}€</div>
                      {pot.image && (
                        <img 
                          src={pot.image} 
                          alt={pot.name}
                          className="w-8 h-8 object-cover rounded mt-1"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredPots.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucun pot trouvé</p>
              )}
            </div>
          </div>

          {/* Sélection de la plante */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-h-64 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🌱 Choisir une plante ({filteredPlants.length})</h2>
            <div className="space-y-2">
              {filteredPlants.map((plant) => (
                <motion.div
                  key={plant._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedPlant?._id === plant._id 
                      ? 'bg-green-100 border-2 border-green-500' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedPlant(plant)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{plant.name}</div>
                      <div className="text-xs text-gray-500">
                        H{plant.height}cm • Stock: {plant.quantity}
                      </div>
                      {plant.reference && (
                        <div className="text-xs text-gray-400">Ref: {plant.reference}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-sm">{plant.price?.toFixed(2) || '0.00'}€</div>
                      {plant.image && (
                        <img 
                          src={plant.image} 
                          alt={plant.name}
                          className="w-8 h-8 object-cover rounded mt-1"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredPlants.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucune plante trouvée</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSaveComposition}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            >
              💾 Sauvegarder la composition
            </button>
            <button
              onClick={() => {
                setSelectedPlant(null);
                setSelectedPot(null);
                setSearchTerm('');
              }}
              className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
            >
              🔄 Réinitialiser
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}