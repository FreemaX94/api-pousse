// Script pour extraire les articles externes avec référence EXT*
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

async function extractEXTArticles() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const collection = mongoose.connection.db.collection('nieuwkoopitems');
    
    console.log('\n🔍 Recherche d\'articles avec référence EXT*...');
    
    // Chercher tous les articles avec référence commençant par EXT
    const extArticles = await collection.find({
      reference: { $regex: '^EXT', $options: 'i' }
    }).toArray();
    
    console.log(`🎯 Articles EXT* trouvés: ${extArticles.length}`);

    if (extArticles.length === 0) {
      console.log('⚠️  Aucun article trouvé avec référence EXT*');
      
      // Chercher des échantillons de références pour voir le format
      console.log('\n🔍 Échantillon de références existantes:');
      const sampleRefs = await collection.find({}, { reference: 1, name: 1 }).limit(20).toArray();
      sampleRefs.forEach(item => {
        console.log(`   📋 ${item.reference} - ${item.name}`);
      });
      
      return;
    }

    // Créer le dossier de sauvegarde
    const backupDir = path.join(__dirname, '../backup-articles-EXT');
    const imagesDir = path.join(backupDir, 'images');
    
    try {
      await fs.mkdir(backupDir, { recursive: true });
      await fs.mkdir(imagesDir, { recursive: true });
      console.log('📁 Dossiers de sauvegarde créés');
    } catch (err) {
      console.log('📁 Dossiers de sauvegarde déjà existants');
    }

    const articlesData = [];
    let totalImages = 0;

    console.log('\n📦 ARTICLES EXTERNES TROUVÉS:');
    console.log('='.repeat(60));

    for (let i = 0; i < extArticles.length; i++) {
      const article = extArticles[i];
      
      console.log(`\n📦 Article ${i + 1}/${extArticles.length}:`);
      console.log(`   🏷️  Référence: ${article.reference}`);
      console.log(`   📋 Nom: ${article.name || 'N/A'}`);
      console.log(`   💰 Prix: €${article.pricing?.price || 'N/A'}`);
      console.log(`   📐 Hauteur: ${article.dimensions?.height || 'N/A'}`);
      console.log(`   📐 Diamètre: ${article.dimensions?.diameter || 'N/A'}`);
      console.log(`   📦 Stock: ${article.stock?.quantity || 0}`);
      console.log(`   🏷️  Type stock: ${article.stock?.stockType || 'N/A'}`);

      // Analyser les images
      let images = [];
      let imageFiles = [];
      
      if (article.images && Array.isArray(article.images)) {
        console.log(`   🖼️  Images: ${article.images.length}`);
        
        for (let j = 0; j < article.images.length; j++) {
          const img = article.images[j];
          console.log(`      📸 Image ${j + 1}:`);
          console.log(`         URL: ${img.url || 'N/A'}`);
          console.log(`         Primary: ${img.isPrimary || false}`);
          
          // Si c'est une image base64
          if (img.url && img.url.startsWith('data:image')) {
            console.log(`         Type: BASE64 ✅`);
            
            try {
              // Déterminer l'extension
              let extension = 'png';
              if (img.url.includes('data:image/jpeg')) extension = 'jpg';
              else if (img.url.includes('data:image/png')) extension = 'png';
              else if (img.url.includes('data:image/webp')) extension = 'webp';

              // Nom du fichier
              const imageName = `${article.reference}_${j + 1}.${extension}`;
              const imagePath = path.join(imagesDir, imageName);

              // Extraire et sauvegarder
              const base64Data = img.url.replace(/^data:image\/[^;]+;base64,/, '');
              await fs.writeFile(imagePath, base64Data, 'base64');
              
              imageFiles.push(imageName);
              totalImages++;
              console.log(`         💾 Sauvegardée: ${imageName}`);
              
            } catch (imgErr) {
              console.error(`         ❌ Erreur sauvegarde: ${imgErr.message}`);
            }
            
          } else if (img.url) {
            console.log(`         Type: URL (${img.url.substring(0, 50)}...)`);
          } else {
            console.log(`         Type: Aucune URL`);
          }
        }
      } else {
        console.log(`   🖼️  Images: Aucune`);
      }

      // Chercher aussi dans d'autres champs potentiels
      const docStr = JSON.stringify(article);
      const base64Count = (docStr.match(/data:image/g) || []).length;
      if (base64Count > 0) {
        console.log(`   🔍 Images base64 détectées ailleurs: ${base64Count}`);
      }

      // Préparer les données pour la sauvegarde
      const articleData = {
        _id: article._id.toString(),
        reference: article.reference,
        nom: article.name,
        prix: article.pricing?.price || null,
        hauteur: article.dimensions?.height || null,
        diametre: article.dimensions?.diameter || null,
        quantite: article.stock?.quantity || 0,
        stockType: article.stock?.stockType || null,
        note: article.notes || article.note || '',
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        totalImages: article.images?.length || 0,
        imageFiles: imageFiles,
        hasBase64Images: imageFiles.length > 0
      };

      articlesData.push(articleData);
    }

    // Sauvegarder les données
    const backupData = {
      metadata: {
        date: new Date().toISOString(),
        totalArticlesEXT: extArticles.length,
        totalImagesExtracted: totalImages,
        source: 'nieuwkoopitems collection (référence EXT*)'
      },
      articles: articlesData
    };

    const jsonPath = path.join(backupDir, 'articles-EXT-backup.json');
    await fs.writeFile(jsonPath, JSON.stringify(backupData, null, 2), 'utf8');

    // Créer un CSV
    const csvContent = [
      'Référence,Nom,Prix,Hauteur,Diamètre,Quantité,Type Stock,Images Totales,Images Base64,Fichiers Images,Note',
      ...articlesData.map(item => 
        `"${item.reference}","${item.nom || ''}",${item.prix || ''},${item.hauteur || ''},${item.diametre || ''},${item.quantite},"${item.stockType || ''}",${item.totalImages},${item.imageFiles.length},"${item.imageFiles.join(';')}","${item.note}"`
      )
    ].join('\\n');
    
    const csvPath = path.join(backupDir, 'articles-EXT-backup.csv');
    await fs.writeFile(csvPath, csvContent, 'utf8');

    // Statistiques
    const articlesWithBase64 = articlesData.filter(item => item.hasBase64Images);
    const articlesWithoutBase64 = articlesData.filter(item => !item.hasBase64Images);
    const totalValue = articlesData.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

    // README
    const readmeContent = `# Articles Externes (EXT*) - Sauvegarde

## Informations
- Date de sauvegarde: ${new Date().toLocaleString('fr-FR')}
- Articles EXT trouvés: ${extArticles.length}
- Articles avec images base64: ${articlesWithBase64.length}
- Articles sans images base64: ${articlesWithoutBase64.length}
- Total images extraites: ${totalImages}
- Valeur totale du stock: €${totalValue.toFixed(2)}

## Articles sauvegardés
${articlesData.map((item, i) => 
  `${i + 1}. ${item.reference} - ${item.nom} - €${item.prix || 'N/A'} - ${item.imageFiles.length} image(s) base64`
).join('\\n')}

${articlesWithoutBase64.length > 0 ? `\\n## Articles sans images base64
${articlesWithoutBase64.map(item => `- ${item.reference} - ${item.nom} (${item.totalImages} images non-base64)`).join('\\n')}` : ''}

## Fichiers générés
- **articles-EXT-backup.json**: Données complètes
- **articles-EXT-backup.csv**: Format Excel
- **images/**: ${totalImages} images extraites
`;

    const readmePath = path.join(backupDir, 'README.md');
    await fs.writeFile(readmePath, readmeContent, 'utf8');

    console.log(`\n✅ SAUVEGARDE TERMINÉE!`);
    console.log('='.repeat(50));
    console.log(`📁 Dossier: ${backupDir}`);
    console.log(`📦 ${extArticles.length} articles EXT* analysés`);
    console.log(`🖼️  ${totalImages} images base64 extraites`);
    console.log(`📊 ${articlesWithBase64.length} articles avec images base64`);
    console.log(`📊 ${articlesWithoutBase64.length} articles sans images base64`);
    console.log(`💰 Valeur totale: €${totalValue.toFixed(2)}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnecté de MongoDB');
  }
}

if (require.main === module) {
  extractEXTArticles();
}

module.exports = extractEXTArticles;