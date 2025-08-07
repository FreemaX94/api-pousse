import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Composant pour un pot avec image réelle
function CSSPot({ item, isSelected }) {
  const diameter = Math.max(item?.diameter || 20, 20);
  const height = Math.max(item?.height || 15, 15);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className={`relative transition-all duration-500 ${isSelected ? 'scale-110' : 'scale-100'}`}
      style={{ 
        width: `${Math.min(diameter * 4, 200)}px`, 
        height: `${Math.min(height * 4, 250)}px`,
        margin: '20px auto'
      }}
    >
      {/* Image du pot si disponible */}
      {item?.image && !imageError ? (
        <div className="relative w-full h-full">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain rounded-lg shadow-xl"
            style={{
              transform: 'perspective(600px) rotateX(5deg) rotateY(-2deg)',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
            }}
            onError={() => setImageError(true)}
          />
          
          {/* Effet de brillance */}
          <div
            className="absolute inset-0 rounded-lg opacity-20"
            style={{
              background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
              transform: 'perspective(600px) rotateX(5deg) rotateY(-2deg)',
            }}
          />
        </div>
      ) : (
        /* Fallback pot CSS si pas d'image */
        <div
          className="relative mx-auto rounded-lg shadow-xl bg-gradient-to-b from-amber-600 to-amber-800"
          style={{
            width: '100%',
            height: '100%',
            clipPath: 'polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%)',
            transform: 'perspective(600px) rotateX(10deg)',
          }}
        >
          {/* Rebord du pot */}
          <div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-500 to-amber-700"
            style={{
              width: '105%',
              height: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      )}
      
      {/* Informations du pot */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center bg-white rounded-lg px-3 py-2 shadow-lg"
        >
          <p className="text-sm font-semibold text-gray-700">{item?.name}</p>
          <p className="text-xs text-gray-500">Ø{diameter}cm • H{height}cm</p>
          <p className="text-sm font-bold text-green-600">{item?.price?.toFixed(2)}€</p>
          {item?.reference && (
            <p className="text-xs text-gray-400">Ref: {item.reference}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Composant pour une plante avec image réelle
function CSSPlant({ item, potHeight = 150, isSelected }) {
  const height = Math.max(item?.height || 30, 20);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className={`absolute transition-all duration-500 ${isSelected ? 'scale-110' : 'scale-100'}`}
      style={{ 
        bottom: `${potHeight * 0.7}px`, // Position dans le pot
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${Math.min(height * 3, 180)}px`,
        height: `${Math.min(height * 3, 200)}px`,
        zIndex: 10
      }}
    >
      {/* Image de la plante si disponible */}
      {item?.image && !imageError ? (
        <div className="relative w-full h-full">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain"
            style={{
              transform: 'perspective(400px) rotateX(-5deg)',
              filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))',
            }}
            onError={() => setImageError(true)}
          />
          
          {/* Effet de mouvement léger */}
          <motion.div
            className="absolute inset-0"
            animate={{
              rotate: [0, 1, -1, 0],
              scale: [1, 1.01, 0.99, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 60%)',
              borderRadius: '50%'
            }}
          />
        </div>
      ) : (
        /* Fallback plante CSS si pas d'image */
        <div className="relative w-full h-full">
          {/* Tige centrale */}
          <div
            className="absolute left-1/2 bottom-0 transform -translate-x-1/2 bg-gradient-to-t from-green-700 to-green-500"
            style={{
              width: '6px',
              height: `${height * 1.5}px`,
              borderRadius: '3px'
            }}
          />
          
          {/* Feuilles génériques */}
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (i / 5) * 360;
            const leafHeight = height * 0.8;
            
            return (
              <motion.div
                key={i}
                className="absolute left-1/2 bottom-0 origin-bottom bg-gradient-to-t from-green-600 to-green-400"
                style={{
                  width: '20px',
                  height: `${leafHeight}px`,
                  borderRadius: '0 100px 0 100px',
                  transform: `translateX(-50%) rotate(${angle}deg) translateY(-${height * 0.4}px)`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                animate={{
                  rotate: [angle, angle + 3, angle - 3, angle],
                  scale: [1, 1.05, 0.95, 1]
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Informations de la plante */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center bg-white rounded-lg px-3 py-2 shadow-lg"
        >
          <p className="text-sm font-semibold text-green-700">{item?.name}</p>
          <p className="text-xs text-green-600">H{height}cm</p>
          <p className="text-sm font-bold text-green-600">{item?.price?.toFixed(2)}€</p>
          {item?.reference && (
            <p className="text-xs text-gray-400">Ref: {item.reference}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Fonction utilitaire pour déterminer le type de plante
function getPlantType(plant) {
  if (!plant) return 'fern';
  const name = (plant.name || '').toLowerCase();
  if (name.includes('palm') || name.includes('palmier')) return 'palm';
  if (name.includes('succulent') || name.includes('cactus')) return 'succulent';
  return 'fern';
}

export default function CompositionCSS() {
  const navigate = useNavigate();
  const [selectedPot, setSelectedPot] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRotating, setIsRotating] = useState(false);

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
          <p className="text-3xl font-bold text-green-600">{totalPrice.toFixed(2)}€</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualiseur 3D CSS */}
        <motion.div 
          className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 h-[600px] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div 
            className={`relative w-full h-full flex items-center justify-center transition-transform duration-1000 ${
              isRotating ? 'animate-pulse' : ''
            }`}
            style={{
              background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
              perspective: '800px'
            }}
          >
            {selectedPot ? (
              <motion.div
                className="relative"
                animate={isRotating ? {
                  rotateY: [0, 360]
                } : {}}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <CSSPot item={selectedPot} isSelected={true} />
                {selectedPlant && (
                  <CSSPlant 
                    item={selectedPlant} 
                    potHeight={Math.min(Math.max(selectedPot.height || 15, 15) * 4, 250)}
                    isSelected={true}
                  />
                )}
              </motion.div>
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-xl mb-2">🏺</p>
                <p>Sélectionnez un pot pour commencer</p>
              </div>
            )}
          </div>
          
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
                <p className="text-sm text-gray-600">Pots</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{filteredPlants.length}</p>
                <p className="text-sm text-gray-600">Plantes</p>
              </div>
            </div>
          </div>

          {/* Sélection du pot */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-h-64 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🏺 Pots ({filteredPots.length})</h2>
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
                  <div className="flex items-center gap-3">
                    {/* Image miniature du pot */}
                    {pot.image ? (
                      <img 
                        src={pot.image} 
                        alt={pot.name}
                        className="w-12 h-12 object-contain rounded border flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded flex items-center justify-center flex-shrink-0">
                        🏺
                      </div>
                    )}
                    <div
                      className="w-12 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded flex items-center justify-center flex-shrink-0"
                      style={{ display: 'none' }}
                    >
                      🏺
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-sm">{pot.name}</div>
                      <div className="text-xs text-gray-500">
                        Ø{pot.diameter}cm • H{pot.height}cm • Stock: {pot.quantity}
                      </div>
                      {pot.reference && (
                        <div className="text-xs text-gray-400">Ref: {pot.reference}</div>
                      )}
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-green-600 text-sm">{pot.price?.toFixed(2)}€</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sélection de la plante */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-h-64 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🌱 Plantes ({filteredPlants.length})</h2>
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
                  <div className="flex items-center gap-3">
                    {/* Image miniature de la plante */}
                    {plant.image ? (
                      <img 
                        src={plant.image} 
                        alt={plant.name}
                        className="w-12 h-12 object-contain rounded border flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-b from-green-600 to-green-400 rounded flex items-center justify-center flex-shrink-0">
                        🌱
                      </div>
                    )}
                    <div
                      className="w-12 h-12 bg-gradient-to-b from-green-600 to-green-400 rounded flex items-center justify-center flex-shrink-0"
                      style={{ display: 'none' }}
                    >
                      🌱
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-sm">{plant.name}</div>
                      <div className="text-xs text-gray-500">
                        H{plant.height}cm • Stock: {plant.quantity}
                      </div>
                      {plant.reference && (
                        <div className="text-xs text-gray-400">Ref: {plant.reference}</div>
                      )}
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-green-600 text-sm">{plant.price?.toFixed(2)}€</div>
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
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            >
              💾 Sauvegarder
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