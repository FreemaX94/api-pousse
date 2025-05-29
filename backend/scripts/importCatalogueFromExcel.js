
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const CatalogueItem = require('../models/CatalogueItem');

const MONGODB_URI = 'mongodb+srv://freemanlopez94140:t3lZozMgzmPTPRSI@freex94.5utv3iv.mongodb.net/api-pousse?retryWrites=true&w=majority&appName=freex94';

const CATEGORIES_VALIDES = [
  "PLANTES",
  "CONTENANTS",
  "ARTIFICIELS",
  "SÉCHÉS/STABILISÉS",
  "ÉLÉMENTS DE DÉCOR"
];


async function importCatalogueFromExcel(filePath) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    await CatalogueItem.deleteMany({});
    console.log('🧹 Ancien catalogue vidé');

    const absolutePath = path.resolve(filePath);
    const workbook = xlsx.readFile(absolutePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    let inserted = 0;
    let skipped = 0;

    // Transpose les lignes pour travailler par blocs verticaux
    const colCount = Math.max(...rows.map(r => r.length));
    for (let col = 0; col < colCount; col++) {
      let currentCategory = null;
      let headers = [];

      for (let row = 0; row < rows.length; row++) {
        const cell = (rows[row][col] || '').toString().trim().toUpperCase();

        if (CATEGORIES_VALIDES.includes(cell)) {
          currentCategory = cell;
          headers = []; // reset headers
          continue;
        }

        // Si la catégorie est définie et qu'on rencontre "NOM DU PRODUIT", stocke les headers
        if (currentCategory && cell === "NOM DU PRODUIT") {
          headers = [];
          for (let c = col; c < col + 6; c++) {
            headers.push((rows[row][c] || '').toString().trim());
          }
          continue;
        }

        // Si on a une catégorie + des headers, et une ligne avec un nom
        if (currentCategory && headers.length > 0 && rows[row][col]) {
          const data = {};
          for (let i = 0; i < headers.length; i++) {
            const value = rows[row][col + i];
            if (headers[i] && value != null) {
              data[headers[i]] = value;
            }
          }

          const nom = data["NOM DU PRODUIT"];
          if (!nom) continue;

          const exists = await CatalogueItem.findOne({ categorie: currentCategory, nom });
          if (exists) {
            console.log(`⚠️ Doublon ignoré : ${currentCategory} - ${nom}`);
            skipped++;
            continue;
          }

          const { ["NOM DU PRODUIT"]: _, ...infos } = data;
          await CatalogueItem.create({ categorie: currentCategory, nom, infos });
          console.log(`✅ Inséré : ${currentCategory} - ${nom}`);
          inserted++;
        }
      }
    }

    console.log(`\n🎉 Import terminé : ${inserted} insérés, ${skipped} ignorés`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur pendant l’import :', err);
    process.exit(1);
  }
}

if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('❌ Spécifie le fichier Excel en argument');
    process.exit(1);
  }
  importCatalogueFromExcel(filePath);
}

module.exports = { importCatalogueFromExcel };
