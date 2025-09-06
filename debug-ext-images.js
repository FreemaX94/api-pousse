const axios = require('axios');

async function debugExtImages() {
  try {
    console.log('🔍 Récupération des articles Nieuwkoop...');
    
    // Simulation d'authentification locale (remplace par ton token si nécessaire)
    const response = await axios.get('http://localhost:3001/api/catalog/nieuwkoop/items', {
      headers: {
        // Ajouter les headers d'auth si nécessaire
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    const items = response.data;
    console.log(`📦 ${items.length} articles trouvés`);
    
    // Filtrer les articles EXT
    const extItems = items.filter(item => item.reference && item.reference.startsWith('EXT-'));
    console.log(`🎯 ${extItems.length} articles EXT trouvés`);
    
    // Analyser les 3 premiers articles EXT
    for (let i = 0; i < Math.min(3, extItems.length); i++) {
      const item = extItems[i];
      console.log(`\n📋 Article EXT ${i + 1}:`);
      console.log(`  - Référence: ${item.reference}`);
      console.log(`  - Nom: ${item.name}`);
      console.log(`  - Image: ${item.image}`);
      console.log(`  - Images array:`, item.images);
      
      // Tester l'image si elle existe
      if (item.image) {
        try {
          let testUrl = item.image;
          
          // Appliquer la transformation du frontend
          if (item.image.includes('movement_')) {
            testUrl = item.image.replace('/movements/', '/');
          }
          
          console.log(`  - URL transformée: ${testUrl}`);
          console.log(`  - URL complète: http://localhost:3001${testUrl}`);
          
          const imageTest = await axios.head(`http://localhost:3001${testUrl}`);
          console.log(`  - ✅ Image accessible (${imageTest.status})`);
        } catch (err) {
          console.log(`  - ❌ Image non accessible: ${err.response?.status || err.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

debugExtImages();