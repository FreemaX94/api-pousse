// Script pour synchroniser les quantités du fichier Excel vers MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');

async function syncQuantitiesFromExcel() {
  try {
    console.log('🔄 Synchronisation des quantités Excel → MongoDB');
    console.log('='.repeat(60));

    // 1. Lire le fichier Excel
    console.log('\n📂 Lecture du fichier Excel...');
    const excelPath = path.join(__dirname, '../../Tarifs fleurs achats.xlsx');
    const workbook = XLSX.readFile(excelPath);
    const containingSheet = workbook.Sheets['Contenants'];
    const excelData = XLSX.utils.sheet_to_json(containingSheet, { header: 1, defval: '' });
    
    console.log(`✅ ${excelData.length} lignes lues`);
    
    // 2. Extraire les articles avec quantités
    const excelArticles = [];
    for (let i = 1; i < excelData.length; i++) {
      const row = excelData[i];
      if (row && row[0] && row[0].toString().trim()) {
        const articleText = row[0].toString().trim();
        const quantite = parseInt(row[8]) || 0;
        
        // Parser les dimensions depuis la description
        const parsedData = parseArticleDescription(articleText);
        
        excelArticles.push({
          ligne: i + 1,
          article: articleText,
          quantiteExcel: quantite,
          nom: parsedData.nom,
          hauteur: parsedData.hauteur,
          diametre: parsedData.diametre
        });
      }
    }
    
    console.log(`📋 ${excelArticles.length} articles extraits`);
    
    // 3. Connexion MongoDB
    console.log('\n🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    const collection = mongoose.connection.db.collection('nieuwkoopitems');
    
    // 4. Récupérer tous les vases externes (EXT-)
    const mongoVases = await collection.find({ 
      reference: { $regex: '^EXT-', $options: 'i' } 
    }).toArray();
    
    console.log(`💾 ${mongoVases.length} vases externes trouvés dans MongoDB`);
    
    // 5. Fonction de matching améliorée
    function findBestMatch(excelArticle, mongoVases) {
      const matches = [];
      
      for (const mongoVase of mongoVases) {
        let score = 0;
        
        // Matching du nom
        const excelNom = excelArticle.nom.toLowerCase().trim();
        const mongoNom = (mongoVase.name || '').toLowerCase().trim();
        
        if (excelNom && mongoNom) {
          if (excelNom === mongoNom) {
            score += 100;
          } else if (mongoNom.includes(excelNom) || excelNom.includes(mongoNom)) {
            score += 80;
          } else {
            // Mots communs
            const excelWords = excelNom.split(/\s+/).filter(w => w.length > 2);
            const mongoWords = mongoNom.split(/\s+/).filter(w => w.length > 2);
            const commonWords = excelWords.filter(word => 
              mongoWords.some(mw => mw.includes(word) || word.includes(mw))
            );
            if (commonWords.length > 0) {
              score += Math.min(60, commonWords.length * 15);
            }
          }
        }
        
        // Matching des dimensions
        if (excelArticle.hauteur && mongoVase.dimensions?.height) {
          const heightDiff = Math.abs(excelArticle.hauteur - mongoVase.dimensions.height);
          if (heightDiff === 0) score += 30;
          else if (heightDiff <= 2) score += 20;
          else if (heightDiff <= 5) score += 10;
        }
        
        if (excelArticle.diametre && mongoVase.dimensions?.diameter) {
          const diameterDiff = Math.abs(excelArticle.diametre - mongoVase.dimensions.diameter);
          if (diameterDiff === 0) score += 30;
          else if (diameterDiff <= 2) score += 20;
          else if (diameterDiff <= 5) score += 10;
        }
        
        if (score >= 70) {
          matches.push({ mongoVase, score });
        }
      }
      
      if (matches.length > 0) {
        matches.sort((a, b) => b.score - a.score);
        return { match: matches[0].mongoVase, score: matches[0].score };
      }
      
      return null;
    }
    
    // 6. Analyser et synchroniser
    console.log('\n🔍 ANALYSE ET SYNCHRONISATION:');
    console.log('='.repeat(50));
    
    const syncResults = [];
    const noMatches = [];
    let updatedCount = 0;
    
    for (const excelArticle of excelArticles) {
      console.log(`\n📋 ${excelArticle.ligne}. ${excelArticle.article}`);
      console.log(`   📊 Quantité Excel: ${excelArticle.quantiteExcel}`);
      
      const matchResult = findBestMatch(excelArticle, mongoVases);
      
      if (matchResult) {
        const mongoVase = matchResult.match;
        const currentQty = mongoVase.stock?.quantity || mongoVase.quantity || 0;
        
        console.log(`   ✅ Match trouvé (score: ${matchResult.score}): ${mongoVase.name}`);
        console.log(`   📦 Quantité MongoDB actuelle: ${currentQty}`);
        console.log(`   🔄 Mise à jour: ${currentQty} → ${excelArticle.quantiteExcel}`);
        
        // Mettre à jour la quantité
        const updateResult = await collection.updateOne(
          { _id: mongoVase._id },
          { 
            $set: { 
              'stock.quantity': excelArticle.quantiteExcel,
              quantity: excelArticle.quantiteExcel  // Pour compatibilité
            } 
          }
        );
        
        if (updateResult.modifiedCount > 0) {
          console.log(`   ✅ Quantité mise à jour avec succès`);
          updatedCount++;
          
          syncResults.push({
            excel: excelArticle,
            mongo: mongoVase,
            oldQuantity: currentQty,
            newQuantity: excelArticle.quantiteExcel,
            updated: true
          });
        } else {
          console.log(`   ⚠️  Aucune modification (quantité identique?)`);
          syncResults.push({
            excel: excelArticle,
            mongo: mongoVase,
            oldQuantity: currentQty,
            newQuantity: excelArticle.quantiteExcel,
            updated: false
          });
        }
        
      } else {
        console.log(`   ❌ Aucune correspondance trouvée`);
        noMatches.push(excelArticle);
      }
    }
    
    // 7. Résumé final
    console.log(`\n📊 RÉSULTATS DE LA SYNCHRONISATION:`);
    console.log('='.repeat(50));
    console.log(`✅ Articles synchronisés: ${updatedCount}/${excelArticles.length}`);
    console.log(`🔄 Correspondances trouvées: ${syncResults.length}`);
    console.log(`❌ Sans correspondance: ${noMatches.length}`);
    
    if (noMatches.length > 0) {
      console.log(`\n❌ ARTICLES SANS CORRESPONDANCE (${noMatches.length}):`);
      noMatches.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.article} (Qty: ${item.quantiteExcel})`);
      });
    }
    
    // 8. Sauvegarder le rapport
    const report = {
      timestamp: new Date().toISOString(),
      totalExcel: excelArticles.length,
      totalMongo: mongoVases.length,
      synchronized: updatedCount,
      matches: syncResults.length,
      noMatches: noMatches.length,
      details: {
        syncResults: syncResults,
        noMatches: noMatches
      }
    };
    
    const fs = require('fs').promises;
    const reportPath = path.join(__dirname, '../rapport-sync-quantites.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Rapport détaillé sauvegardé: ${reportPath}`);
    
    console.log(`\n🎉 SYNCHRONISATION TERMINÉE!`);
    console.log(`📈 ${updatedCount} quantités ont été mises à jour dans MongoDB`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n👋 Déconnecté de MongoDB');
    }
  }
}

// Fonction pour parser les dimensions depuis la description d'article
function parseArticleDescription(description) {
  let nom = description;
  let hauteur = null;
  let diametre = null;
  
  // Patterns pour détecter hauteur et diamètre
  const heightPatterns = [
    /H\s*(\d+(?:,\d+)?)/i,      // H25, H 25, H25,5
    /hauteur\s*(\d+(?:,\d+)?)/i
  ];
  
  const diameterPatterns = [
    /Ø\s*(\d+(?:,\d+)?)/i,      // Ø30, Ø 30, Ø30,5
    /D\s*(\d+(?:,\d+)?)/i,      // D30
    /diametre\s*(\d+(?:,\d+)?)/i
  ];
  
  // Chercher la hauteur
  for (const pattern of heightPatterns) {
    const match = description.match(pattern);
    if (match) {
      hauteur = parseFloat(match[1].replace(',', '.'));
      break;
    }
  }
  
  // Chercher le diamètre
  for (const pattern of diameterPatterns) {
    const match = description.match(pattern);
    if (match) {
      diametre = parseFloat(match[1].replace(',', '.'));
      break;
    }
  }
  
  // Nettoyer le nom
  nom = description
    .replace(/H\s*\d+(?:,\d+)?(?:cm)?/gi, '')
    .replace(/Ø\s*\d+(?:,\d+)?(?:cm)?/gi, '')
    .replace(/D\s*\d+(?:,\d+)?(?:cm)?/gi, '')
    .replace(/hauteur\s*\d+(?:,\d+)?(?:cm)?/gi, '')
    .replace(/diametre\s*\d+(?:,\d+)?(?:cm)?/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return { nom, hauteur, diametre };
}

if (require.main === module) {
  syncQuantitiesFromExcel();
}

module.exports = syncQuantitiesFromExcel;