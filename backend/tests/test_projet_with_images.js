/**
 * Test de création de projet avec prix et images
 */

const axios = require('axios');

async function testProjetWithImages() {
  console.log('=====================================');
  console.log('🧪 TEST PROJET AVEC PRIX ET IMAGES');
  console.log('=====================================\n');
  
  try {
    // Configuration API
    const api = axios.create({
      baseURL: 'http://localhost:3001/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // 1. CONNEXION
    console.log('🔐 Connexion...');
    await api.post('/auth/login', {
      username: 'Freex94',
      password: 'Lolmdr94148!'
    });
    console.log('✅ Connecté\n');
    
    // 2. RÉCUPÉRER LE STOCK POUR AVOIR LES VRAIES DONNÉES
    console.log('📦 Récupération du stock Nieuwkoop...');
    const stockResponse = await api.get('/nieuwkoop/stock');
    const stockItems = stockResponse.data;
    console.log(`✅ ${stockItems.length} articles trouvés\n`);
    
    // Prendre 3 articles avec des infos complètes
    const itemsWithData = stockItems
      .filter(item => item.price && item.imageUrl)
      .slice(0, 3);
    
    if (itemsWithData.length === 0) {
      console.log('⚠️  Aucun article avec prix et image trouvé');
      console.log('   Utilisation de données de test...\n');
      
      // Données de test si pas d'articles complets
      itemsWithData.push({
        reference: 'TEST001',
        name: 'Plante test avec image',
        price: 25.50,
        imageUrl: 'https://example.com/image1.jpg',
        height: 30,
        diameter: 15,
        potSize: '12cm',
        category: 'plante',
        description: 'Belle plante pour test'
      });
    }
    
    console.log('📝 Articles sélectionnés pour le test:');
    itemsWithData.forEach(item => {
      console.log(`   - ${item.reference}: ${item.name}`);
      console.log(`     Prix: ${item.price}€`);
      console.log(`     Image: ${item.imageUrl ? '✓' : '✗'}`);
    });
    console.log('');
    
    // 3. CRÉER UN PROJET AVEC CES ARTICLES
    console.log('🌿 Création du projet avec articles complets...');
    
    // Préparer les données des plantes avec toutes les infos
    const plantsData = itemsWithData.map(item => ({
      ItemCode: item.reference,
      Name: item.name,
      quantity: 2,
      Price: item.price,
      imageUrl: item.imageUrl,
      Category: item.category || 'plante',
      Height: item.height || 0,
      Diameter: item.diameter || 0,
      PotSize: item.potSize || '',
      description: item.description || ''
    }));
    
    const projectData = {
      client: 'Client Premium 2025',
      description: 'Projet test avec prix et images - Vérification affichage complet',
      address: '789 Boulevard des Fleurs, 75003 Paris',
      dateDebut: '2025-08-10',
      dateFin: '2025-08-12',
      statut: 'En cours',
      plants: JSON.stringify(plantsData)
    };
    
    console.log('📤 Envoi des données...');
    const response = await api.post('/projets', projectData);
    
    console.log('✅ Projet créé avec succès !');
    console.log('   ID:', response.data._id);
    console.log('   ProjectID:', response.data.projectId);
    console.log('   Titre:', response.data.title);
    console.log('   Client:', response.data.client?.name);
    console.log('');
    
    // 4. VÉRIFIER LES MATÉRIAUX SAUVEGARDÉS
    console.log('🔍 Vérification des matériaux sauvegardés:');
    if (response.data.materials && response.data.materials.length > 0) {
      console.log(`✅ ${response.data.materials.length} articles enregistrés:`);
      response.data.materials.forEach((mat, index) => {
        console.log(`\n   Article ${index + 1}:`);
        console.log(`   - Nom: ${mat.name}`);
        console.log(`   - Prix unitaire: ${mat.unitPrice}€`);
        console.log(`   - Quantité: ${mat.quantity}`);
        console.log(`   - Prix total: ${mat.totalPrice}€`);
        console.log(`   - Image: ${mat.image ? '✓ ' + mat.image : '✗ Pas d\'image'}`);
        console.log(`   - Code: ${mat.itemCode || 'N/A'}`);
        console.log(`   - Catégorie: ${mat.category}`);
        if (mat.specifications) {
          console.log(`   - Hauteur: ${mat.specifications.height}cm`);
          console.log(`   - Diamètre: ${mat.specifications.diameter}cm`);
        }
      });
    } else {
      console.log('❌ Aucun matériau sauvegardé !');
    }
    
    // 5. RÉCUPÉRER LE PROJET POUR VÉRIFIER
    console.log('\n📊 Récupération du projet créé...');
    const getResponse = await api.get(`/projets/${response.data._id}`);
    const savedProject = getResponse.data;
    
    console.log('✅ Projet récupéré:');
    console.log('   Materials count:', savedProject.materials?.length || 0);
    
    if (savedProject.materials && savedProject.materials.length > 0) {
      const firstMat = savedProject.materials[0];
      console.log('\n   Premier article:');
      console.log('   - Nom:', firstMat.name);
      console.log('   - Prix:', firstMat.unitPrice);
      console.log('   - Image:', firstMat.image || 'Pas d\'image');
    }
    
    console.log('\n=====================================');
    console.log('✅ TEST TERMINÉ AVEC SUCCÈS !');
    console.log('=====================================');
    console.log('\n📌 Actions suivantes:');
    console.log('1. Vérifiez dans l\'interface que le projet s\'affiche');
    console.log('2. Les prix doivent être visibles sur les cartes');
    console.log('3. Les images doivent s\'afficher si présentes');
    console.log('4. Sinon, vérifiez le composant frontend qui affiche les projets');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.message || error.response.data);
      if (error.response.data?.error) {
        console.error('   Détails:', JSON.stringify(error.response.data.error, null, 2));
      }
    } else {
      console.error('   Erreur:', error.message);
    }
  }
}

// Lancer le test
console.log('🚀 Démarrage du test avec prix et images...\n');
testProjetWithImages().catch(console.error);