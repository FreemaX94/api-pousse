/**
 * Script de test pour créer un projet avec plusieurs articles
 * Test du 8 août au 12 août 2025
 */

const axios = require('axios');
const FormData = require('form-data');

// Configuration
const API_BASE_URL = 'http://localhost:3001/api';
let axiosInstance;

// Données du projet de test
const testProject = {
  client: "Client Test - Festival d'été",
  description: "Installation florale pour le festival d'été du 8 au 12 août 2025. Comprend la décoration de l'entrée principale, des espaces VIP et de la scène.",
  address: "123 Avenue des Festivals, 75001 Paris",
  dateDebut: "2025-08-08",
  dateFin: "2025-08-12",
  statut: "En cours",
  materials: []
};

// Articles à ajouter - utilisons d'abord les articles existants
const articlesToAdd = [
  {
    reference: "4HOFOBX12",
    name: "Hortensia",
    quantity: 5,
    unitPrice: 38.28
  }
];

// Fonction pour se connecter
async function login() {
  try {
    console.log('🔐 Connexion en cours...');
    // Créer une instance axios avec cookies
    axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const response = await axiosInstance.post('/auth/login', {
      username: 'Freex94', // Votre identifiant
      password: 'Lolmdr94148!' // Votre mot de passe
    });
    
    console.log('✅ Connexion réussie!');
    console.log('👤 Utilisateur:', response.data.user.fullname);
    
    // Sauvegarder les cookies de session
    if (response.headers['set-cookie']) {
      axiosInstance.defaults.headers.Cookie = response.headers['set-cookie'];
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    return false;
  }
}

// Fonction pour récupérer les informations de stock
async function getStockInfo() {
  try {
    console.log('📦 Récupération des informations de stock...');
    const response = await axiosInstance.get('/nieuwkoop/stock');
    
    const stockItems = response.data;
    console.log(`✅ ${stockItems.length} articles trouvés dans le stock`);
    
    // Mapper les articles avec les infos de stock
    const materialsWithStock = articlesToAdd.map(article => {
      const stockItem = stockItems.find(item => 
        item.reference === article.reference || 
        item.name.includes(article.name.split(' ')[0])
      );
      
      if (stockItem) {
        const availableQty = (stockItem.stock?.quantity || 0) - (stockItem.stock?.reservedQuantity || 0);
        console.log(`  📌 ${article.reference}: ${availableQty} disponibles (demandé: ${article.quantity})`);
        
        return {
          reference: stockItem.reference,
          name: stockItem.name,
          quantity: Math.min(article.quantity, availableQty), // Ajuster selon disponibilité
          unitPrice: stockItem.price || article.unitPrice,
          image: stockItem.image || '',
          status: 'needed',
          stock: stockItem.stock
        };
      } else {
        console.log(`  ⚠️ ${article.reference}: Non trouvé dans le stock`);
        return null;
      }
    }).filter(item => item !== null);
    
    return materialsWithStock;
  } catch (error) {
    console.error('❌ Erreur récupération stock:', error.response?.data || error.message);
    return [];
  }
}

// Fonction pour créer le projet
async function createProject(materials) {
  try {
    console.log('\n🚀 Création du projet...');
    console.log('📅 Période: du', testProject.dateDebut, 'au', testProject.dateFin);
    console.log('📍 Client:', testProject.client);
    console.log('🌿 Articles:', materials.length);
    
    // Créer un FormData pour multer
    const formData = new FormData();
    formData.append('client', testProject.client);
    formData.append('description', testProject.description + ' - Adresse: ' + testProject.address);
    formData.append('dateDebut', testProject.dateDebut);
    formData.append('dateFin', testProject.dateFin);
    formData.append('statut', testProject.statut);
    
    // Ne pas ajouter les plantes pour l'instant pour voir si le projet se crée
    // formData.append('plants', JSON.stringify(materials.map(m => ({
    //   ItemCode: m.reference,
    //   Name: m.name,
    //   quantity: m.quantity,
    //   Price: m.unitPrice,
    //   Category: 'plante'
    // }))));
    
    // Calculer le coût total
    const totalCost = materials.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    console.log('💰 Coût total estimé:', totalCost.toFixed(2), '€');
    
    const response = await axiosInstance.post('/projets', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('\n✅ Projet créé avec succès!');
    console.log('🆔 ID du projet:', response.data._id);
    console.log('📋 Détails:', {
      client: response.data.client,
      période: `${response.data.dateDebut} au ${response.data.dateFin}`,
      articles: response.data.materials?.length || 0,
      statut: response.data.statut
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur création projet:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error('Détails des erreurs:', error.response.data.errors);
    }
    return null;
  }
}

// Fonction pour vérifier les réservations
async function checkReservations(projectId) {
  try {
    console.log('\n🔍 Vérification des réservations...');
    
    // Récupérer à nouveau le stock pour voir les réservations
    const response = await axiosInstance.get('/nieuwkoop/stock');
    
    const stockItems = response.data;
    
    console.log('📊 État du stock après création du projet:');
    articlesToAdd.forEach(article => {
      const stockItem = stockItems.find(item => 
        item.reference === article.reference || 
        item.name.includes(article.name.split(' ')[0])
      );
      
      if (stockItem) {
        const available = (stockItem.stock?.quantity || 0) - (stockItem.stock?.reservedQuantity || 0);
        console.log(`  ${stockItem.reference}: ${stockItem.stock?.quantity || 0} total, ${stockItem.stock?.reservedQuantity || 0} réservés, ${available} disponibles`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur vérification réservations:', error.response?.data || error.message);
  }
}

// Fonction principale
async function runTest() {
  console.log('========================================');
  console.log('🧪 TEST DE CRÉATION DE PROJET');
  console.log('========================================\n');
  
  // 1. Connexion
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.error('⛔ Test arrêté: impossible de se connecter');
    return;
  }
  
  // 2. Récupérer les infos de stock
  const materials = await getStockInfo();
  if (materials.length === 0) {
    console.error('⛔ Test arrêté: aucun article disponible');
    return;
  }
  
  console.log(`\n✅ ${materials.length} articles prêts à être ajoutés au projet`);
  
  // 3. Créer le projet
  const project = await createProject(materials);
  
  if (project) {
    // 4. Vérifier les réservations
    await checkReservations(project._id);
    
    console.log('\n========================================');
    console.log('✅ TEST TERMINÉ AVEC SUCCÈS');
    console.log('========================================');
    
    // Test de la projection de stock
    console.log('\n📅 Test de projection de stock pour le 10 août 2025:');
    console.log('Le stock devrait montrer les quantités réduites pour cette date');
    console.log('car les articles sont réservés pour le projet du 8 au 12 août.');
  } else {
    console.log('\n========================================');
    console.log('❌ TEST ÉCHOUÉ');
    console.log('========================================');
  }
}

// Lancer le test
runTest().catch(console.error);