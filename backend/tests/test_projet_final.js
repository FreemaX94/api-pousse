/**
 * Test final de création de projet après corrections
 * Test avec plusieurs articles du 8 au 12 août 2025
 */

const axios = require('axios');
const FormData = require('form-data');

// Configuration
const API_BASE_URL = 'http://localhost:3001/api';
let axiosInstance;

// Fonction principale de test
async function testProjetFinal() {
  console.log('=====================================');
  console.log('🧪 TEST FINAL - CRÉATION DE PROJET');
  console.log('=====================================\n');
  
  try {
    // 1. CONNEXION
    console.log('🔐 Étape 1: Connexion...');
    axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const loginResponse = await axiosInstance.post('/auth/login', {
      username: 'Freex94',
      password: 'Lolmdr94148!'
    });
    
    console.log('✅ Connecté:', loginResponse.data.user.fullname);
    console.log('');
    
    // 2. RÉCUPÉRER LE STOCK
    console.log('📦 Étape 2: Récupération du stock...');
    const stockResponse = await axiosInstance.get('/nieuwkoop/stock');
    const stockItems = stockResponse.data;
    console.log(`✅ ${stockItems.length} articles trouvés dans le stock`);
    
    // Prendre les 3 premiers articles disponibles
    const availableItems = stockItems
      .filter(item => (item.stock?.quantity || 0) > (item.stock?.reservedQuantity || 0))
      .slice(0, 3);
    
    console.log(`📌 ${availableItems.length} articles disponibles sélectionnés:`);
    availableItems.forEach(item => {
      const available = (item.stock?.quantity || 0) - (item.stock?.reservedQuantity || 0);
      console.log(`   - ${item.reference}: ${item.name} (${available} disponibles)`);
    });
    console.log('');
    
    // 3. TEST CRÉATION SIMPLE (JSON)
    console.log('📝 Étape 3: Test création simple avec JSON...');
    
    const simpleProject = {
      client: 'Festival Été 2025',
      description: 'Installation florale pour le festival - Test après correction',
      address: '123 Avenue du Festival, 75001 Paris',
      dateDebut: '2025-08-08',
      dateFin: '2025-08-12',
      statut: 'En cours'
    };
    
    try {
      const response = await axiosInstance.post('/projets', simpleProject);
      console.log('✅ Projet créé avec succès !');
      console.log('   ID:', response.data._id || response.data.projectId);
      console.log('   Titre:', response.data.title);
      console.log('   Client:', response.data.client?.name || response.data.client);
      console.log('   Statut:', response.data.status || response.data.statut);
      console.log('');
      
      // 4. TEST AVEC ARTICLES
      if (availableItems.length > 0) {
        console.log('🌿 Étape 4: Test création avec articles...');
        
        const projectWithItems = {
          client: 'Mariage Dupont',
          description: 'Décoration florale pour mariage - Avec articles',
          address: '456 Rue de la Paix, 75002 Paris',
          dateDebut: '2025-08-10',
          dateFin: '2025-08-10',
          statut: 'En cours',
          plants: JSON.stringify(availableItems.slice(0, 2).map(item => ({
            ItemCode: item.reference,
            Name: item.name,
            quantity: 2,
            Price: item.price || 10,
            Category: 'plante'
          })))
        };
        
        const response2 = await axiosInstance.post('/projets', projectWithItems);
        console.log('✅ Projet avec articles créé !');
        console.log('   ID:', response2.data._id || response2.data.projectId);
        console.log('   Articles:', response2.data.materials?.length || 0);
      }
      
      // 5. TEST AVEC FORMDATA (MULTIPART)
      console.log('\n📎 Étape 5: Test avec FormData (multipart)...');
      
      const formData = new FormData();
      formData.append('client', 'Entreprise ABC');
      formData.append('description', 'Aménagement espaces verts - Test FormData');
      formData.append('dateDebut', '2025-08-15');
      formData.append('dateFin', '2025-08-20');
      formData.append('statut', 'En cours');
      
      if (availableItems.length > 0) {
        formData.append('plants', JSON.stringify([{
          ItemCode: availableItems[0].reference,
          Name: availableItems[0].name,
          quantity: 3,
          Price: availableItems[0].price || 15
        }]));
      }
      
      const response3 = await axiosInstance.post('/projets', formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      console.log('✅ Projet FormData créé !');
      console.log('   ID:', response3.data._id || response3.data.projectId);
      
      // 6. VÉRIFICATION DES PROJETS CRÉÉS
      console.log('\n📊 Étape 6: Vérification des projets créés...');
      const allProjects = await axiosInstance.get('/projets');
      const recentProjects = allProjects.data
        .filter(p => p.client?.name?.includes('Festival') || 
                     p.client?.name?.includes('Mariage') || 
                     p.client?.name?.includes('Entreprise'))
        .slice(-3);
      
      console.log(`✅ ${recentProjects.length} projets de test trouvés`);
      
      console.log('\n=====================================');
      console.log('✅ TOUS LES TESTS RÉUSSIS !');
      console.log('=====================================');
      console.log('\n📅 Vous pouvez maintenant:');
      console.log('1. Aller dans l\'onglet Stock de la page Nieuwkoop');
      console.log('2. Utiliser le sélecteur de date pour le 10 août 2025');
      console.log('3. Voir les articles réservés pour les projets créés !');
      
    } catch (error) {
      console.error('\n❌ Erreur création projet:');
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Message:', error.response.data?.message || error.response.data);
        if (error.response.data?.error) {
          console.error('   Détails:', error.response.data.error);
        }
      } else {
        console.error('   Erreur:', error.message);
      }
      
      console.log('\n⚠️  VÉRIFICATIONS:');
      console.log('1. Avez-vous redémarré le serveur backend ?');
      console.log('2. Le serveur tourne-t-il sur le port 3001 ?');
      console.log('3. Regardez les logs du serveur pour plus de détails');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.response?.data || error.message);
  }
}

// Lancer le test
console.log('🚀 Démarrage du test...\n');
testProjetFinal().catch(console.error);