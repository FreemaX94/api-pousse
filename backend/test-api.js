const axios = require('axios');

async function testAPI() {
  try {
    const response = await axios.get('http://localhost:3001/api/nieuwkoop/stock', {
      params: { search: 'Argento' }
    });
    
    console.log('✅ Articles trouvés:', response.data.length);
    
    if (response.data.length > 0) {
      const firstItem = response.data[0];
      console.log('\n📦 Premier article:');
      console.log('  Reference:', firstItem.reference);
      console.log('  Name:', firstItem.name);
      console.log('  availableQuantity (racine):', firstItem.availableQuantity);
      console.log('  actualAvailableQuantity:', firstItem.actualAvailableQuantity);
      console.log('  stock.availableQuantity:', firstItem.stock?.availableQuantity);
      console.log('  stock.quantity:', firstItem.stock?.quantity);
      console.log('  stock.reservedQuantity:', firstItem.stock?.reservedQuantity);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAPI();