import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../../shared/api/domains/inventory/clientApi';

export default function PlantSearchBar({ onPlantsChange, selectedPlants = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allPlants, setAllPlants] = useState([]);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Récupérer toutes les plantes au montage du composant
  useEffect(() => {
    const fetchAllPlants = async () => {
      try {
        // Essayer d'abord l'API Nieuwkoop
        let response;
        try {
          response = await api.get('/nieuwkoop/items');
          if (response.data.status === 'success') {
            setAllPlants(response.data.data || []);
            return;
          }
        } catch (apiError) {
          console.warn('API Nieuwkoop indisponible, utilisation du stock local:', apiError.message);
        }
        
        // Fallback sur le stock local
        try {
          response = await api.get('/nieuwkoop/stock');
          if (Array.isArray(response.data) && response.data.length > 0) {
            // Mapper les données du stock local vers le format attendu
            const mappedData = response.data.map(item => {
              // Essayer plusieurs sources pour le prix
              let price = 0;
              if (item.pricing?.price) {
                price = item.pricing.price;
              } else if (item.price) {
                price = item.price;
              } else if (item.pricing?.PriceNett) {
                price = item.pricing.PriceNett;
              } else if (item.PriceNett) {
                price = item.PriceNett;
              }
              
              return {
                ItemCode: item.reference,
                Name: item.name,
                Category: item.category,
                Price: price,
                Height: item.dimensions?.height || 0,
                Diameter: item.dimensions?.diameter || 0,
                StockQuantity: item.stock?.quantity || 0
              };
            });
            
            console.log('📦 Stock local trouvé:', mappedData);
            console.log('📦 Exemple d\'item du stock:', mappedData[0]);
            
            // Vérifier si les données ont des prix valides
            const hasValidPrices = mappedData.some(item => item.Price > 0);
            console.log('📦 Prix valides trouvés:', hasValidPrices);
            
            if (hasValidPrices) {
              console.log('📦 Utilisation des données du stock local avec prix valides');
              setAllPlants(mappedData);
              return;
            } else {
              console.warn('Stock local trouvé mais sans prix valides, tentative de récupération des prix depuis l\'API');
              // Essayer de récupérer les prix depuis l'API Nieuwkoop
              try {
                const enrichedData = await Promise.all(
                  mappedData.slice(0, 10).map(async (item) => { // Limiter à 10 items pour éviter trop de requêtes
                    try {
                      const priceResponse = await api.get(`/nieuwkoop/prices/${item.ItemCode}`);
                      const price = priceResponse.data.price || 0;
                      return { ...item, Price: price };
                    } catch (priceError) {
                      console.warn(`Impossible de récupérer le prix pour ${item.ItemCode}`);
                      return item; // Garder le prix à 0 si échec
                    }
                  })
                );
                
                const hasEnrichedPrices = enrichedData.some(item => item.Price > 0);
                if (hasEnrichedPrices) {
                  console.log('📦 Prix récupérés depuis l\'API pour le stock local:', enrichedData);
                  setAllPlants(enrichedData);
                  return;
                } else {
                  console.warn('Impossible de récupérer les prix depuis l\'API, utilisation de données de démonstration');
                }
              } catch (enrichError) {
                console.warn('Erreur lors de l\'enrichissement des prix:', enrichError);
              }
            }
          }
        } catch (stockError) {
          console.warn('Stock local non accessible, utilisation de données de démonstration', stockError);
        }
        
        // Fallback final : données de démonstration
        const demoPlants = [
          {
            ItemCode: 'DEMO001',
            Name: 'Ficus Benjamina',
            Category: 'plante',
            Price: 25.99,
            Height: 150,
            Diameter: 20,
            StockQuantity: 15
          },
          {
            ItemCode: 'DEMO002',
            Name: 'Monstera Deliciosa',
            Category: 'plante',
            Price: 45.50,
            Height: 80,
            Diameter: 25,
            StockQuantity: 8
          },
          {
            ItemCode: 'DEMO003',
            Name: 'Sansevieria Trifasciata',
            Category: 'plante',
            Price: 18.99,
            Height: 60,
            Diameter: 15,
            StockQuantity: 22
          },
          {
            ItemCode: 'DEMO004',
            Name: 'Pothos Aureus',
            Category: 'plante',
            Price: 12.99,
            Height: 30,
            Diameter: 12,
            StockQuantity: 30
          },
          {
            ItemCode: 'DEMO005',
            Name: 'Pachira Aquatica',
            Category: 'plante',
            Price: 35.00,
            Height: 120,
            Diameter: 18,
            StockQuantity: 5
          }
        ];
        console.log('🌱 Données de démonstration chargées:', demoPlants);
        setAllPlants(demoPlants);
      } catch (error) {
        console.error('Erreur lors de la récupération des plantes:', error);
        setError('Impossible de récupérer les plantes. Vérifiez que le serveur backend est démarré.');
        setAllPlants([]); // Tableau vide en cas d'erreur
      }
    };

    fetchAllPlants();
  }, []);

  // Filtrer les plantes en fonction du terme de recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const filteredPlants = allPlants
      .filter(plant => 
        plant.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.ItemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.Category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10); // Limiter à 10 résultats

    console.log('🔍 Résultats de recherche pour "' + searchTerm + '":', filteredPlants);
    setSearchResults(filteredPlants);
    setShowDropdown(true);
  }, [searchTerm, allPlants]);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePlantSelect = (plant) => {
    // Vérifier si la plante n'est pas déjà sélectionnée
    if (!selectedPlants.find(p => p.ItemCode === plant.ItemCode)) {
      const newPlant = {
        ...plant,
        quantity: 1 // Quantité par défaut
      };
      console.log('🌱 Plante sélectionnée:', plant);
      console.log('🌱 Nouvelle plante à ajouter:', newPlant);
      onPlantsChange([...selectedPlants, newPlant]);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemovePlant = (plantCode) => {
    onPlantsChange(selectedPlants.filter(p => p.ItemCode !== plantCode));
  };

  const handleQuantityChange = (plantCode, newQuantity) => {
    const updatedPlants = selectedPlants.map(plant => 
      plant.ItemCode === plantCode 
        ? { ...plant, quantity: Math.max(1, parseInt(newQuantity) || 1) }
        : plant
    );
    onPlantsChange(updatedPlants);
  };

  const formatPrice = (price) => {
    console.log('💰 formatPrice appelée avec:', price, 'type:', typeof price);
    if (price === undefined || price === null || isNaN(price)) {
      return 'Prix non disponible';
    }
    const numPrice = parseFloat(price);
    return `${numPrice.toFixed(2)}€`;
  };

  const getPlantImage = (plant) => {
    return `/api/nieuwkoop/items/${plant.ItemCode}/image`;
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Message d'erreur */}
      {error && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.1))',
          border: '2px solid rgba(239,68,68,0.2)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#dc2626',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {/* Barre de recherche */}
      <div style={{ position: 'relative' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1e293b'
        }}>
          🌱 Rechercher des plantes
        </label>
        
        <div style={{ position: 'relative' }}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Rechercher par nom, référence ou catégorie..."
            style={{
              width: '100%',
              padding: '1rem 1.5rem 1rem 3rem',
              border: '2px solid rgba(148,163,184,0.3)',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '500',
              background: 'rgba(255,255,255,0.9)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
          />
          
          {/* Icône de recherche */}
          <div style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b',
            fontSize: '1.2rem'
          }}>
            🔍
          </div>
          
          {isLoading && (
            <div style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#10b981'
            }}>
              ⏳
            </div>
          )}
        </div>

        {/* Dropdown des résultats */}
        {showDropdown && searchResults.length > 0 && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.5rem',
              background: 'white',
              border: '2px solid rgba(148,163,184,0.2)',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 10
            }}
          >
            {searchResults.map((plant, index) => (
              <div
                key={plant.ItemCode}
                onClick={() => handlePlantSelect(plant)}
                style={{
                  padding: '1rem',
                  borderBottom: index < searchResults.length - 1 ? '1px solid rgba(148,163,184,0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <img
                  src={getPlantImage(plant)}
                  alt={plant.Name}
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid rgba(148,163,184,0.2)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#1e293b',
                    fontSize: '0.9rem',
                    marginBottom: '0.25rem'
                  }}>
                    {plant.Name}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    marginBottom: '0.25rem'
                  }}>
                    Réf: {plant.ItemCode} • {plant.Category}
                  </div>
                  {plant.Height && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#64748b',
                      marginBottom: '0.25rem'
                    }}>
                      Hauteur: {plant.Height}cm
                    </div>
                  )}
                  {plant.StockQuantity && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: plant.StockQuantity > 10 ? '#10b981' : plant.StockQuantity > 5 ? '#f59e0b' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      Stock: {plant.StockQuantity} disponible{plant.StockQuantity > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.25rem'
                }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#10b981'
                  }}>
                    {formatPrice(plant.Price)}
                  </div>
                  {plant.StockQuantity && (
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#64748b',
                      background: 'rgba(148,163,184,0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontWeight: '600'
                    }}>
                      {plant.StockQuantity} en stock
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liste des plantes sélectionnées */}
      {selectedPlants.length > 0 && (
        <div style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(34,197,94,0.05))',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '2px solid rgba(16,185,129,0.1)'
        }}>
          <div style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#059669',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🌿 Plantes sélectionnées ({selectedPlants.length})
          </div>
          
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {selectedPlants.map((plant) => (
              <div
                key={plant.ItemCode}
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid rgba(148,163,184,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <img
                  src={getPlantImage(plant)}
                  alt={plant.Name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid rgba(148,163,184,0.2)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#1e293b',
                    fontSize: '1rem',
                    marginBottom: '0.25rem'
                  }}>
                    {plant.Name}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    marginBottom: '0.25rem'
                  }}>
                    Réf: {plant.ItemCode} • {plant.Category}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#10b981',
                    fontWeight: '600'
                  }}>
                    {console.log('💰 Prix de la plante sélectionnée:', plant.Price, 'pour', plant.Name) || formatPrice(plant.Price)}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <label style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#64748b'
                  }}>
                    Qté:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={plant.quantity}
                    onChange={(e) => handleQuantityChange(plant.ItemCode, e.target.value)}
                    style={{
                      width: '60px',
                      padding: '0.5rem',
                      border: '1px solid rgba(148,163,184,0.3)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <button
                  onClick={() => handleRemovePlant(plant.ItemCode)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  title="Supprimer cette plante"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          
          {/* Résumé total */}
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(16,185,129,0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#059669'
            }}>
              Total: {selectedPlants.reduce((sum, plant) => sum + (plant.quantity || 1), 0)} plantes
            </div>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#059669'
            }}>
              {formatPrice(selectedPlants.reduce((sum, plant) => 
                sum + ((plant.Price || 0) * (plant.quantity || 1)), 0
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}