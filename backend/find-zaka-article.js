const mongoose = require('mongoose');
const NieuwkoopItem = require('./models/nieuwkoopItemModel');
const config = require('./config/config');

async function findZakaArticle() {
  try {
    // Connexion à MongoDB
    console.log('🔍 Connexion à MongoDB...');
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connecté à MongoDB');

    // Recherche de l'article "zaka" (recherche flexible)
    console.log('\n🔍 Recherche de l\'article "zaka"...');
    
    // Recherche par nom (insensible à la casse)
    const itemsByName = await NieuwkoopItem.find({
      name: { $regex: 'zaka', $options: 'i' }
    });

    // Recherche par référence (insensible à la casse) 
    const itemsByRef = await NieuwkoopItem.find({
      reference: { $regex: 'zaka', $options: 'i' }
    });

    // Recherche dans la description
    const itemsByDesc = await NieuwkoopItem.find({
      description: { $regex: 'zaka', $options: 'i' }
    });

    // Combiner tous les résultats sans doublons
    const allItems = [];
    const seenIds = new Set();

    [...itemsByName, ...itemsByRef, ...itemsByDesc].forEach(item => {
      if (!seenIds.has(item._id.toString())) {
        seenIds.add(item._id.toString());
        allItems.push(item);
      }
    });

    console.log(`\n📊 Résultats trouvés : ${allItems.length} article(s)`);

    if (allItems.length === 0) {
      console.log('❌ Aucun article contenant "zaka" trouvé');
      return;
    }

    // Afficher les détails de chaque article trouvé
    allItems.forEach((item, index) => {
      console.log(`\n--- Article ${index + 1} ---`);
      console.log(`ID: ${item._id}`);
      console.log(`Référence: ${item.reference}`);
      console.log(`Nom: ${item.name}`);
      console.log(`Description: ${item.description || 'N/A'}`);
      console.log(`Catégorie: ${item.category}`);
      console.log(`Prix: ${item.pricing?.price || 'N/A'} ${item.pricing?.currency || 'EUR'}`);
      console.log(`Stock: ${item.stock?.quantity || 0}`);
      console.log(`Statut: ${item.availability?.status || 'N/A'}`);
      console.log(`Actif: ${item.availability?.isActive ? 'Oui' : 'Non'}`);
      
      // Détails des images - C'est le plus important pour notre diagnostic !
      console.log(`\n🖼️  Images (${item.images?.length || 0}):`);
      if (item.images && item.images.length > 0) {
        item.images.forEach((image, imgIndex) => {
          console.log(`  Image ${imgIndex + 1}:`);
          console.log(`    URL: ${image.url}`);
          console.log(`    Alt: ${image.alt || 'N/A'}`);
          console.log(`    Primaire: ${image.isPrimary ? 'Oui' : 'Non'}`);
          console.log(`    Type: ${image.type || 'product'}`);
        });
      } else {
        console.log('  Aucune image trouvée');
      }

      // Métadonnées importantes
      console.log(`\nMétadonnées:`);
      console.log(`  Créé le: ${item.createdAt}`);
      console.log(`  Modifié le: ${item.updatedAt}`);
      console.log(`  Source: ${item.metadata?.source || 'N/A'}`);
      console.log(`  Dernière sync: ${item.lastSync}`);
    });

    // Analyse des URLs d'images
    console.log('\n🔍 ANALYSE DES URLs D\'IMAGES:');
    allItems.forEach(item => {
      if (item.images && item.images.length > 0) {
        console.log(`\nArticle: ${item.name} (${item.reference})`);
        item.images.forEach((image, index) => {
          const url = image.url;
          console.log(`  Image ${index + 1}: ${url}`);
          
          // Vérification du type d'URL
          if (url.includes('api-pousse-uploads.ams3.digitaloceanspaces.com')) {
            console.log(`    ✅ URL Spaces - OK`);
          } else if (url.startsWith('/api/catalog/nieuwkoop/movement-image/')) {
            console.log(`    ⚠️  URL locale - À vérifier`);
          } else if (url.startsWith('http')) {
            console.log(`    🌐 URL externe - ${url.split('/')[2]}`);
          } else {
            console.log(`    ❓ URL inconnue - ${url.substring(0, 50)}...`);
          }
        });
      }
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connexion fermée');
  }
}

// Exécution du script
findZakaArticle();