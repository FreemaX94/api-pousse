// Script spécialisé pour extraire les articles externes de la collection nieuwkoopitems
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

async function extractNieuwkoopExternals() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const collection = mongoose.connection.db.collection('nieuwkoopitems');
    const totalDocs = await collection.countDocuments();
    console.log(`\n📦 Total articles nieuwkoopitems: ${totalDocs}`);

    console.log('\n🔍 Recherche d\'articles externes (avec images base64)...');
    
    // Créer le dossier de sauvegarde
    const backupDir = path.join(__dirname, '../backup-articles-externes-nieuwkoop');
    const imagesDir = path.join(backupDir, 'images');
    
    try {
      await fs.mkdir(backupDir, { recursive: true });
      await fs.mkdir(imagesDir, { recursive: true });
      console.log('📁 Dossiers de sauvegarde créés');
    } catch (err) {
      console.log('📁 Dossiers de sauvegarde déjà existants');
    }

    const cursor = collection.find({});
    const externalArticles = [];
    let processedCount = 0;
    let externalCount = 0;

    console.log('⚙️  Analyse en cours...');

    await cursor.forEach(async (doc) => {
      processedCount++;
      if (processedCount % 20 === 0) {
        console.log(`   📊 Traité: ${processedCount}/${totalDocs}`);
      }

      // Chercher les images base64 dans le document
      const docStr = JSON.stringify(doc);
      const base64Images = [];
      
      // Rechercher toutes les images base64 dans le document
      const base64Regex = /"(data:image\/[^"]+)"/g;
      let match;
      while ((match = base64Regex.exec(docStr)) !== null) {
        base64Images.push(match[1]);
      }

      if (base64Images.length > 0) {
        externalCount++;
        
        // Extraire les données importantes
        const articleData = {
          _id: doc._id.toString(),
          nom: doc.name,
          reference: doc.reference,
          prix: doc.pricing?.price || 0,
          hauteur: doc.dimensions?.height || null,
          diametre: doc.dimensions?.diameter || null,
          quantite: doc.stock?.quantity || 0,
          stockType: doc.stock?.stockType || 'permanent',
          note: doc.notes || doc.note || '',
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          images: base64Images,
          imageFiles: []
        };

        console.log(`\n🎯 ARTICLE EXTERNE TROUVÉ #${externalCount}:`);
        console.log(`   📋 Nom: ${articleData.nom}`);
        console.log(`   🏷️  Référence: ${articleData.reference || 'N/A'}`);
        console.log(`   💰 Prix: €${articleData.prix}`);
        console.log(`   📐 Hauteur: ${articleData.hauteur || 'N/A'}`);
        console.log(`   📐 Diamètre: ${articleData.diametre || 'N/A'}`);
        console.log(`   📦 Quantité: ${articleData.quantite}`);
        console.log(`   🖼️  Images base64: ${base64Images.length}`);

        externalArticles.push(articleData);
      }
    });

    console.log(`\n🎉 EXTRACTION TERMINÉE!`);
    console.log(`📊 Articles traités: ${processedCount}`);
    console.log(`🎯 Articles externes trouvés: ${externalCount}`);

    if (externalCount > 0) {
      console.log(`\n💾 Sauvegarde des articles externes...`);
      
      // Traiter les images et sauvegarder les articles
      for (let i = 0; i < externalArticles.length; i++) {
        const article = externalArticles[i];
        console.log(`⚙️  Sauvegarde ${i + 1}/${externalCount}: ${article.nom}`);
        
        // Sauvegarder les images
        for (let j = 0; j < article.images.length; j++) {
          const base64Image = article.images[j];
          
          try {
            // Déterminer l'extension
            let extension = 'png';
            if (base64Image.includes('data:image/jpeg')) extension = 'jpg';
            else if (base64Image.includes('data:image/png')) extension = 'png';
            else if (base64Image.includes('data:image/webp')) extension = 'webp';

            // Nom du fichier
            const safeRef = (article.reference || article._id).replace(/[^a-zA-Z0-9]/g, '_');
            const imageName = `${safeRef}_img${j + 1}.${extension}`;
            const imagePath = path.join(imagesDir, imageName);

            // Extraire et sauvegarder
            const base64Data = base64Image.replace(/^data:image\/[^;]+;base64,/, '');
            await fs.writeFile(imagePath, base64Data, 'base64');
            
            article.imageFiles.push(imageName);
            console.log(`     🖼️  Image ${j + 1} sauvegardée: ${imageName}`);
            
          } catch (imgErr) {
            console.error(`     ❌ Erreur image ${j + 1}:`, imgErr.message);
          }
        }
        
        // Supprimer les images base64 du JSON pour alléger
        delete article.images;
      }

      // Sauvegarder le fichier JSON
      const backupData = {
        metadata: {
          date: new Date().toISOString(),
          totalArticlesExamines: processedCount,
          articlesExternesTrouves: externalCount,
          source: 'nieuwkoopitems collection'
        },
        articles: externalArticles
      };

      const jsonPath = path.join(backupDir, 'articles-externes-nieuwkoop.json');
      await fs.writeFile(jsonPath, JSON.stringify(backupData, null, 2), 'utf8');

      // Créer un CSV
      const csvContent = [
        'Référence,Nom,Prix,Hauteur,Diamètre,Quantité,Type Stock,Images,Note',
        ...externalArticles.map(item => 
          `"${item.reference || ''}","${item.nom}",${item.prix},${item.hauteur || ''},${item.diametre || ''},${item.quantite},"${item.stockType}","${item.imageFiles.join(';')}","${item.note}"`
        )
      ].join('\\n');
      
      const csvPath = path.join(backupDir, 'articles-externes-nieuwkoop.csv');
      await fs.writeFile(csvPath, csvContent, 'utf8');

      // Créer un README
      const readmeContent = `# Articles Externes Nieuwkoop - Sauvegarde

## Informations
- Date de sauvegarde: ${new Date().toLocaleString('fr-FR')}
- Articles examinés: ${processedCount}
- Articles externes trouvés: ${externalCount}
- Images extraites: ${externalArticles.reduce((sum, item) => sum + item.imageFiles.length, 0)}

## Source
Collection MongoDB: \`nieuwkoopitems\`
Critère: Articles contenant des images en base64

## Fichiers générés
- **articles-externes-nieuwkoop.json**: Données complètes
- **articles-externes-nieuwkoop.csv**: Format Excel  
- **images/**: Images extraites (${externalArticles.reduce((sum, item) => sum + item.imageFiles.length, 0)} fichiers)
- **README.md**: Cette documentation

## Articles sauvegardés
${externalArticles.map((item, i) => 
  `${i + 1}. ${item.nom} (${item.reference || 'Sans référence'}) - €${item.prix} - ${item.imageFiles.length} image(s)`
).join('\\n')}

Les images sont sauvegardées au format original et peuvent être utilisées directement.
`;

      const readmePath = path.join(backupDir, 'README.md');
      await fs.writeFile(readmePath, readmeContent, 'utf8');

      console.log(`\n✅ SAUVEGARDE TERMINÉE!`);
      console.log('='.repeat(50));
      console.log(`📁 Dossier: ${backupDir}`);
      console.log(`📦 ${externalCount} articles externes sauvegardés`);
      console.log(`🖼️  ${externalArticles.reduce((sum, item) => sum + item.imageFiles.length, 0)} images extraites`);
      console.log(`💾 Fichiers JSON, CSV et images créés`);

    } else {
      console.log(`⚠️  Aucun article externe trouvé avec des images base64`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnecté de MongoDB');
  }
}

if (require.main === module) {
  extractNieuwkoopExternals();
}

module.exports = extractNieuwkoopExternals;