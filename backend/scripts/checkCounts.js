// Script pour vérifier les comptes Excel vs MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');

async function checkCounts() {
  try {
    console.log('📊 Vérification des comptes...\n');
    
    // 1. Compter les lignes Excel
    const excelPath = path.join(__dirname, '../../Tarifs fleurs achats.xlsx');
    const workbook = XLSX.readFile(excelPath);
    const containingSheet = workbook.Sheets['Contenants'];
    const excelData = XLSX.utils.sheet_to_json(containingSheet, { header: 1, defval: '' });
    
    console.log('📂 EXCEL:');
    console.log(`   Total lignes dans l'onglet: ${excelData.length}`);
    console.log(`   Lignes avec en-têtes: ${excelData.length > 0 ? 1 : 0}`);
    console.log(`   Lignes de données: ${Math.max(0, excelData.length - 1)}`);
    
    // Afficher toutes les lignes pour debug
    console.log('\n📋 Contenu détaillé:');
    excelData.forEach((row, i) => {
      const article = row[0] ? row[0].toString().trim() : '';
      const qty = row[8] ? row[8].toString().trim() : '';
      console.log(`   ${i}: Article="${article}" | Qty="${qty}"`);
    });
    
    // Compter les lignes non vides avec article
    let validArticles = 0;
    for (let i = 1; i < excelData.length; i++) {
      const row = excelData[i];
      if (row && row[0] && row[0].toString().trim()) {
        validArticles++;
      }
    }
    console.log(`\n   Articles valides (non vides): ${validArticles}`);
    
    // 2. Compter MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n💾 MONGODB:');
    
    const collection = mongoose.connection.db.collection('nieuwkoopitems');
    const totalMongo = await collection.countDocuments({});
    console.log(`   Total articles: ${totalMongo}`);
    
    // Compter par type
    const nieuwkoopCount = await collection.countDocuments({ reference: { $not: /^EXT-/ } });
    const externalCount = await collection.countDocuments({ reference: /^EXT-/ });
    
    console.log(`   Articles Nieuwkoop: ${nieuwkoopCount}`);
    console.log(`   Articles Externes (vases): ${externalCount}`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

if (require.main === module) {
  checkCounts();
}

module.exports = checkCounts;