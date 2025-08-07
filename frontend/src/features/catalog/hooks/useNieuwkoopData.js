import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../../api/clientApi';

// Custom hook pour la gestion des données Nieuwkoop
export const useNieuwkoopData = () => {
  const [addedItems, setAddedItems] = useState([]);
  const [totalNieuwkoopItems, setTotalNieuwkoopItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data function
  const fetchNieuwkoopData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/nieuwkoop/stock');
      
      // L'API retourne directement un tableau d'items
      if (Array.isArray(response.data)) {
        setAddedItems(response.data);
        setTotalNieuwkoopItems(response.data.length);
      } else {
        throw new Error('Format de réponse inattendu');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données Nieuwkoop:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove item from stock
  const removeFromStock = useCallback(async (code) => {
    try {
      setAddedItems(prev => prev.filter(item => item.code !== code));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(error.message);
    }
  }, []);

  // Update item quantity
  const updateItemQuantity = useCallback((code, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromStock(code);
      return;
    }
    
    setAddedItems(prev =>
      prev.map(item =>
        item.code === code ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromStock]);

  // Calculated values with memoization
  const totalPrice = useMemo(() => 
    addedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [addedItems]
  );

  const totalQty = useMemo(() => 
    addedItems.reduce((acc, item) => acc + item.quantity, 0),
    [addedItems]
  );

  const categories = useMemo(() => 
    [...new Set(addedItems.map(item => item.category))],
    [addedItems]
  );

  // Filter and sort function
  const getFilteredAndSortedItems = useCallback((searchTerm, activeCategory, sortBy) => {
    // Filter items
    const filteredItems = addedItems.filter(prod =>
      (!activeCategory || prod.category === activeCategory) &&
      prod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort items
    const sortedItems = [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case 'quantité':
          return b.quantity - a.quantity;
        case 'hauteur':
          return b.height - a.height;
        case 'diamètre':
          return b.diameter - a.diameter;
        case 'prix':
        default:
          return b.price - a.price;
      }
    });

    return sortedItems;
  }, [addedItems]);

  // Load data on mount
  useEffect(() => {
    fetchNieuwkoopData();
  }, [fetchNieuwkoopData]);

  return {
    // Data
    addedItems,
    totalNieuwkoopItems,
    totalPrice,
    totalQty,
    categories,
    
    // State
    loading,
    error,
    
    // Functions
    fetchNieuwkoopData,
    removeFromStock,
    updateItemQuantity,
    getFilteredAndSortedItems,
  };
};