// Script pour comparer les quantités de vases entre le fichier Excel et MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');

async function compareVasesQuantities() {
  try {
    console.log('📊 Analyse comparative des quantités de vases');
    console.log('='.repeat(60));

    // 1. Lire le fichier Excel
    console.log('\n📂 Lecture du fichier Excel...');
    const excelPath = path.join(__dirname, '../../Tarifs fleurs achats.xlsx');
    
    let workbook;
    try {
      workbook = XLSX.readFile(excelPath);
    } catch (err) {
      console.error('❌ Erreur lecture Excel:', err.message);
      return;
    }
    
    console.log('✅ Fichier Excel ouvert');
    console.log('📋 Onglets disponibles:', workbook.SheetNames.join(', '));
    
    // 2. Chercher l'onglet "contenant" (insensible à la casse)
    let containingSheet = null;
    let sheetName = '';
    
    for (const name of workbook.SheetNames) {
      if (name.toLowerCase().includes('contenant')) {
        containingSheet = workbook.Sheets[name];
        sheetName = name;
        break;
      }
    }
    
    if (!containingSheet) {
      console.log('⚠️  Onglet "contenant" non trouvé. Onglets disponibles:');
      workbook.SheetNames.forEach(name => {
        console.log(`   - ${name}`);
      });
      return;
    }
    
    console.log(`\n✅ Onglet trouvé: "${sheetName}"`);
    
    // 3. Convertir en JSON
    const excelData = XLSX.utils.sheet_to_json(containingSheet, { 
      header: 1,  // Utiliser les indices numériques
      defval: ''  // Valeur par défaut pour les cellules vides
    });
    
    console.log(`📄 ${excelData.length} lignes trouvées dans l'onglet`);
    
    // 4. Analyser les en-têtes
    if (excelData.length === 0) {
      console.log('❌ Onglet vide');
      return;
    }
    
    const headers = excelData[0];
    console.log('\n📋 En-têtes détectées:', headers);
    
    // 5. Identifier les colonnes importantes (seulement article et quantité actuelle)
    const columnIndexes = {
      article: -1,
      quantiteActuelle: -1
    };
    
    headers.forEach((header, index) => {
      const headerLower = (header || '').toString().toLowerCase();
      
      if (headerLower.includes('article')) {
        columnIndexes.article = index;
      }
      if (headerLower.includes('quantité actuelle') || headerLower.includes('quantite actuelle')) {
        columnIndexes.quantiteActuelle = index;
      }
    });
    
    console.log('\n🔍 Colonnes identifiées:');
    Object.entries(columnIndexes).forEach(([key, index]) => {
      console.log(`   ${key}: ${index >= 0 ? `Colonne ${index} (${headers[index]})` : 'Non trouvée'}`);
    });
    
    // 6. Extraire les données des pots avec parsing des dimensions
    const excelVases = [];
    
    for (let i = 1; i < excelData.length; i++) {
      const row = excelData[i];
      
      if (!row || row.length === 0) continue;
      
      const articleText = columnIndexes.article >= 0 ? (row[columnIndexes.article] || '').toString().trim() : '';
      const quantite = columnIndexes.quantiteActuelle >= 0 ? parseInt(row[columnIndexes.quantiteActuelle]) || 0 : 0;
      
      if (!articleText) continue;
      
      // Parser les dimensions depuis la description de l'article
      const parsedData = parseArticleDescription(articleText);
      
      const vase = {
        ligne: i + 1,
        article: articleText,
        quantiteActuelle: quantite,
        nom: parsedData.nom,
        hauteur: parsedData.hauteur,
        diametre: parsedData.diametre
      };
      
      excelVases.push(vase);
    }
    
    // Fonction pour parser les dimensions depuis la description d'article
    function parseArticleDescription(description) {
      let nom = description;
      let hauteur = null;
      let diametre = null;
      
      // Patterns pour détecter hauteur et diamètre
      // Ex: "Pot terre cuite H25 D30", "Vase H15xD12", "Cache-pot 20x15"
      const heightPatterns = [
        /H\s*(\d+)/i,           // H25, H 25
        /hauteur\s*(\d+)/i,     // hauteur 25
        /h\s*:\s*(\d+)/i        // h: 25
      ];
      
      const diameterPatterns = [
        /D\s*(\d+)/i,           // D30, D 30
        /diametre\s*(\d+)/i,    // diametre 30
        /diam\s*(\d+)/i,        // diam 30
        /d\s*:\s*(\d+)/i,       // d: 30
        /(\d+)x(\d+)/i          // 25x30 (prendre le second nombre comme diamètre)
      ];
      
      // Chercher la hauteur
      for (const pattern of heightPatterns) {
        const match = description.match(pattern);
        if (match) {
          hauteur = parseInt(match[1]);
          break;
        }
      }
      
      // Chercher le diamètre
      for (const pattern of diameterPatterns) {
        const match = description.match(pattern);
        if (match) {
          if (pattern.toString().includes('x') && match[2]) {
            diametre = parseInt(match[2]); // Pour pattern 25x30
          } else {
            diametre = parseInt(match[1]);
          }
          break;
        }
      }
      
      // Nettoyer le nom en retirant les dimensions
      nom = description
        .replace(/H\s*\d+/gi, '')
        .replace(/D\s*\d+/gi, '')
        .replace(/hauteur\s*\d+/gi, '')
        .replace(/diametre\s*\d+/gi, '')
        .replace(/diam\s*\d+/gi, '')
        .replace(/\d+x\d+/gi, '')
        .replace(/h\s*:\s*\d+/gi, '')
        .replace(/d\s*:\s*\d+/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      return { nom, hauteur, diametre };
    }
    
    console.log(`\n📦 ${excelVases.length} pots/vases extraits du fichier Excel`);
    
    // 7. Connexion MongoDB et récupération des données
    console.log('\n🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    const collection = mongoose.connection.db.collection('nieuwkoopitems');
    
    // Récupérer tous les articles (Nieuwkoop + EXT)
    const mongoVases = await collection.find({}).toArray();
    console.log(`📦 ${mongoVases.length} articles trouvés dans MongoDB`);
    
    // 8. Normaliser les données MongoDB
    const normalizedMongoVases = mongoVases.map(item => ({
      _id: item._id,
      reference: item.reference,
      nom: item.name || '',
      hauteur: item.dimensions?.height || item.height || null,
      diametre: item.dimensions?.diameter || item.diameter || null,
      quantite: item.stock?.quantity || item.quantity || 0,
      source: item.reference?.startsWith('EXT-') ? 'Externe' : 'Nieuwkoop'
    }));
    
    // 9. Comparaison et matching
    console.log('\n🔍 COMPARAISON DES QUANTITÉS');
    console.log('='.repeat(50));
    
    const matches = [];
    const excelOnly = [];
    const mongoOnly = [];
    const differences = [];
    
    // Fonction de matching améliorée basée sur le nom et les dimensions parsées
    function findMatch(excelVase, mongoVases) {
      const matches = [];
      
      for (const mongoVase of mongoVases) {
        let score = 0;
        
        // 1. Matching du nom (plus flexible)
        const excelNom = excelVase.nom.toLowerCase().trim();
        const mongoNom = mongoVase.nom.toLowerCase().trim();
        
        // Score basé sur la similarité des noms
        if (excelNom && mongoNom) {
          if (excelNom === mongoNom) {
            score += 100; // Match exact
          } else if (mongoNom.includes(excelNom) || excelNom.includes(mongoNom)) {
            score += 80; // Inclusion
          } else {
            // Chercher des mots communs
            const excelWords = excelNom.split(/\s+/);
            const mongoWords = mongoNom.split(/\s+/);
            const commonWords = excelWords.filter(word => 
              word.length > 2 && mongoWords.some(mw => mw.includes(word) || word.includes(mw))
            );
            if (commonWords.length > 0) {
              score += Math.min(60, commonWords.length * 20);
            }
          }
        }
        
        // 2. Matching des dimensions avec tolérance
        if (excelVase.hauteur && mongoVase.hauteur) {
          const heightDiff = Math.abs(excelVase.hauteur - mongoVase.hauteur);
          if (heightDiff === 0) score += 30;
          else if (heightDiff <= 2) score += 20;
          else if (heightDiff <= 5) score += 10;
        }
        
        if (excelVase.diametre && mongoVase.diametre) {
          const diameterDiff = Math.abs(excelVase.diametre - mongoVase.diametre);
          if (diameterDiff === 0) score += 30;
          else if (diameterDiff <= 2) score += 20;
          else if (diameterDiff <= 5) score += 10;
        }
        
        // Seuil minimum pour considérer un match
        if (score >= 80) {
          matches.push({ mongoVase, score });
        }
      }
      
      // Retourner le match avec le meilleur score
      if (matches.length > 0) {
        matches.sort((a, b) => b.score - a.score);
        return matches[0].mongoVase;
      }
      
      return null;
    }
    
    // Analyser chaque vase du fichier Excel
    excelVases.forEach(excelVase => {
      const mongoMatch = findMatch(excelVase, normalizedMongoVases);
      
      if (mongoMatch) {
        const match = {
          excel: excelVase,
          mongo: mongoMatch,
          quantiteDiff: excelVase.quantiteActuelle - mongoMatch.quantite
        };
        
        if (match.quantiteDiff !== 0) {
          differences.push(match);
        }
        
        matches.push(match);
      } else {
        excelOnly.push(excelVase);
      }
    });
    
    // Trouver les articles MongoDB sans équivalent Excel
    normalizedMongoVases.forEach(mongoVase => {
      const excelMatch = findMatch(mongoVase, excelVases);
      if (!excelMatch) {
        mongoOnly.push(mongoVase);
      }
    });
    
    // 10. Affichage des résultats
    console.log(`\n📊 RÉSULTATS DE LA COMPARAISON:`);
    console.log(`✅ Correspondances trouvées: ${matches.length}`);
    console.log(`⚠️  Différences de quantité: ${differences.length}`);
    console.log(`📂 Uniquement dans Excel: ${excelOnly.length}`);
    console.log(`💾 Uniquement dans MongoDB: ${mongoOnly.length}`);
    
    if (differences.length > 0) {
      console.log(`\n🔄 DIFFÉRENCES DE QUANTITÉS (${differences.length}):`);
      console.log('='.repeat(80));
      
      differences.forEach((diff, i) => {
        console.log(`\n${i + 1}. ${diff.excel.nom || diff.excel.article}`);
        console.log(`   📋 Article Excel: ${diff.excel.article}`);
        console.log(`   📐 Dimensions parsées: H${diff.excel.hauteur || '?'} × D${diff.excel.diametre || '?'}`);
        console.log(`   📂 Excel: ${diff.excel.quantiteActuelle}`);
        console.log(`   💾 MongoDB: ${diff.mongo.quantite} (${diff.mongo.reference})`);
        console.log(`   🔄 Différence: ${diff.quantiteDiff > 0 ? '+' : ''}${diff.quantiteDiff}`);
        console.log(`   🏷️  Source: ${diff.mongo.source}`);
      });
    }
    
    if (excelOnly.length > 0 && excelOnly.length <= 20) {
      console.log(`\n📂 ARTICLES UNIQUEMENT DANS EXCEL (${excelOnly.length}):`);
      excelOnly.forEach((item, i) => {
        console.log(`${i + 1}. ${item.article}`);
        console.log(`   📐 Dimensions: H${item.hauteur || '?'} × D${item.diametre || '?'}`);
        console.log(`   📊 Quantité: ${item.quantiteActuelle}`);
      });
    }
    
    // 11. Générer un rapport
    const report = {
      timestamp: new Date().toISOString(),
      totalExcel: excelVases.length,
      totalMongo: normalizedMongoVases.length,
      matches: matches.length,
      differences: differences.length,
      excelOnly: excelOnly.length,
      mongoOnly: mongoOnly.length,
      details: {
        differences: differences,
        excelOnly: excelOnly.slice(0, 50), // Limiter pour éviter un fichier trop volumineux
        mongoOnly: mongoOnly.slice(0, 50)
      }
    };
    
    // Sauvegarder le rapport
    const fs = require('fs').promises;
    const reportPath = path.join(__dirname, '../rapport-comparaison-vases.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Rapport sauvegardé: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n👋 Déconnecté de MongoDB');
    }
  }
}

if (require.main === module) {
  compareVasesQuantities();
}

module.exports = compareVasesQuantities;