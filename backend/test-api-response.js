const axios = require('axios');
const mongoose = require('mongoose');
const config = require('./config/config');

async function testApiResponse() {
  try {
    // Se connecter à MongoDB pour accéder au modèle
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connecté à MongoDB');

    // Test direct de l'API /catalog/nieuwkoop/stock
    console.log('\n🔍 Test de l\'API /catalog/nieuwkoop/stock...');
    
    // On va faire un appel local à l'API
    const response = await axios.get('http://localhost:3001/api/catalog/nieuwkoop/stock', {
      headers: {
        'Authorization': 'Bearer your-test-token', // Il faudra peut-être ajuster selon l'auth
      }
    }).catch(error => {
      console.log('❌ Erreur lors de l\'appel API (probablement serveur éteint):', error.message);
      return null;
    });

    if (!response) {
      console.log('⚠️  Le serveur API n\'est pas accessible. Vérifions directement les données en base...');
      
      // Récupérer directement les données depuis MongoDB
      const NieuwkoopItem = require('./models/nieuwkoopItemModel');
      
      const zakaItem = await NieuwkoopItem.findOne({ name: /zaka/i });
      if (zakaItem) {
        console.log('\n📦 Article "zaka" trouvé en base:');
        console.log('- ID:', zakaItem._id);
        console.log('- Référence:', zakaItem.reference);
        console.log('- Nom:', zakaItem.name);
        console.log('- Images:', JSON.stringify(zakaItem.images, null, 2));
        console.log('- primaryImage (virtual):', zakaItem.primaryImage);
        
        // Simuler la transformation côté API
        let imageUrl = '';
        if (zakaItem.primaryImage?.url) {
          imageUrl = zakaItem.primaryImage.url;
        } else if (zakaItem.images && zakaItem.images.length > 0 && zakaItem.images[0]?.url) {
          imageUrl = zakaItem.images[0].url;
        } else if (zakaItem.reference) {
          imageUrl = `/api/nieuwkoop/items/${zakaItem.reference}/image`;
        }
        
        console.log('\n🖼️ URL d\'image calculée:', imageUrl);
        
        // Simuler la structure retournée par l'API
        const apiResponse = {
          _id: zakaItem._id,
          reference: zakaItem.reference,
          name: zakaItem.name,
          image: imageUrl, // <= C'est ce qui devrait arriver au frontend
          category: zakaItem.category,
          quantity: zakaItem.stock?.quantity || 0,
          price: zakaItem.pricing?.price || 0,
        };
        
        console.log('\n📤 Structure simulée retournée par l\'API:');
        console.log(JSON.stringify(apiResponse, null, 2));
        
      } else {
        console.log('❌ Article "zaka" non trouvé en base');
      }
      
    } else {
      console.log('✅ API accessible, réponse reçue');
      console.log('📊 Nombre d\'articles:', response.data.length);
      
      // Chercher l'article zaka dans la réponse
      const zakaItem = response.data.find(item => 
        item.name?.toLowerCase().includes('zaka') || 
        item.reference?.toLowerCase().includes('zaka')
      );
      
      if (zakaItem) {
        console.log('\n📦 Article "zaka" trouvé dans la réponse API:');
        console.log(JSON.stringify(zakaItem, null, 2));
      } else {
        console.log('\n❌ Article "zaka" non trouvé dans la réponse API');
        console.log('📋 Articles disponibles:');
        response.data.slice(0, 5).forEach(item => {
          console.log(`- ${item.name} (${item.reference}) - image: ${item.image}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion fermée');
  }
}

testApiResponse();