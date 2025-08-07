const XLSX = require('xlsx');
const mongoose = require('mongoose');
const path = require('path');
const Livraison = require('../models/livraisonModel');
require('dotenv').config();

async function importLivaExcel() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apiPousse');
    console.log('✅ Connecté à MongoDB');

    // Chemin vers le fichier Excel
    const filePath = path.join(__dirname, '../../Liva 2025 (5).xlsx');
    
    // Lire le fichier Excel
    console.log('📖 Lecture du fichier Excel:', filePath);
    const workbook = XLSX.readFile(filePath);
    
    // Lister les feuilles disponibles
    console.log('📋 Feuilles disponibles:', workbook.SheetNames);
    
    // Importer uniquement les mois de JUIN et JUILLET
    const targetSheets = ['JUIN', 'JUILLET'];
    let allDeliveries = [];
    
    for (const sheetName of targetSheets) {
      console.log(`\n🔍 Import de la feuille: "${sheetName}"`);
      
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir en JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, // Utiliser la première ligne comme en-têtes
        defval: '' // Valeur par défaut pour les cellules vides
      });
      
      if (jsonData.length === 0) {
        console.log(`  ❌ Aucune donnée dans la feuille "${sheetName}"`);
        continue;
      }
      
      console.log(`  📊 ${jsonData.length} lignes trouvées`);
      
      // Traiter les données selon la structure de chaque mois
      const monthDeliveries = processMonthData(jsonData, sheetName.toLowerCase());
      allDeliveries = allDeliveries.concat(monthDeliveries);
      
      console.log(`  ✅ ${monthDeliveries.length} livraisons extraites`);
    }
    
    console.log(`\n📦 Total: ${allDeliveries.length} livraisons préparées pour l'import`);
    
    // Supprimer les anciennes données
    const deleteResult = await Livraison.deleteMany({ source: 'liva-excel' });
    console.log(`🗑️ ${deleteResult.deletedCount} anciennes livraisons supprimées`);
    
    // Insérer les nouvelles données
    if (allDeliveries.length > 0) {
      const insertResult = await Livraison.insertMany(allDeliveries);
      console.log(`✅ ${insertResult.length} livraisons importées avec succès`);
      
      // Afficher les statistiques
      const stats = await Livraison.getStats();
      console.log('\n📊 Statistiques par mois:');
      stats.forEach(stat => {
        console.log(`  ${stat._id}: ${stat.total} livraisons, ${stat.termine} terminées, ${stat.chiffreAffaires.toFixed(2)}€`);
      });
      
      // Afficher un échantillon des données importées
      console.log('\n📋 Échantillon des livraisons importées:');
      const sample = await Livraison.find({ source: 'liva-excel' }).limit(5);
      sample.forEach((livraison, index) => {
        console.log(`${index + 1}. ${livraison.dateFormatted} - ${livraison.client} - ${livraison.entreprise} - ${livraison.prixFormatted}`);
      });
    }
    
    
    console.log('\n🎉 Import terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

// Fonction pour traiter les données d'un mois spécifique
function processMonthData(jsonData, monthName) {
  const deliveries = [];
  
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    // Ignorer les lignes vides
    if (row.length === 0 || row.every(cell => cell === '' || cell === null || cell === undefined)) {
      continue;
    }
    
    // Ignorer les lignes qui ne contiennent que des dates/numéros Excel
    if (row.length === 1 && typeof row[0] === 'number') {
      continue;
    }
    
    let delivery = {};
    
    // Traitement spécifique selon le mois
    if (monthName === 'juillet') {
      // Structure pour JUILLET: ' ', 'Horaire de livraison', 'Qui fait la demande', 'NB Colis', 'Référence devis', 'Nom du client', 'Entreprise', 'Adresse', etc.
      delivery = {
        date: parseDate(row[0]) || getMonthDate(monthName, i),
        mois: monthName,
        codeActivite: String(row[0] || ''),
        horaire: String(row[1] || ''),
        demandeur: String(row[2] || ''),
        nbColis: parseInt(row[3]) || 0,
        referenceDevis: String(row[4] || ''),
        client: String(row[5] || ''),
        entreprise: String(row[6] || ''),
        adresse: String(row[7] || ''),
        accesLivraison: String(row[8] || ''),
        infos: String(row[9] || ''),
        telephone: String(row[10] || ''),
        clientPrevenu: String(row[11] || ''),
        prix: parseFloat(row[12]) || 0,
        fait: parseBool(row[13])
      };
    } else if (monthName === 'juin') {
      // Structure pour JUIN: '', 'Horaire de livraison', 'Qui fait la demande', 'NB Colis', '', 'Nom du client', 'Entreprise', 'Adresse', etc.
      delivery = {
        date: parseDate(row[0]) || getMonthDate(monthName, i),
        mois: monthName,
        codeActivite: String(row[0] || ''),
        horaire: String(row[1] || ''),
        demandeur: String(row[2] || ''),
        nbColis: parseInt(row[3]) || 0,
        referenceDevis: String(row[4] || ''),
        client: String(row[5] || ''),
        entreprise: String(row[6] || ''),
        adresse: String(row[7] || ''),
        accesLivraison: String(row[9] || ''),
        infos: String(row[10] || ''),
        telephone: String(row[11] || ''),
        clientPrevenu: String(row[12] || ''),
        prix: parseFloat(row[13]) || 0,
        fait: parseBool(row[14])
      };
    }
    
    // Ignorer les lignes sans données utiles
    if (!delivery.client && !delivery.entreprise && !delivery.adresse && !delivery.infos && delivery.prix === 0) {
      continue;
    }
    
    delivery.source = 'liva-excel';
    delivery.importedAt = new Date();
    
    deliveries.push(delivery);
  }
  
  return deliveries;
}

// Fonction pour obtenir une date approximative basée sur le mois et l'index
function getMonthDate(monthName, index) {
  const year = 2025;
  const monthMap = {
    'janvier': 0, 'fevrier': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
    'juillet': 6, 'aout': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'decembre': 11
  };
  
  const month = monthMap[monthName] || 0;
  const day = Math.min(index, 28); // Éviter les jours invalides
  
  return new Date(year, month, day);
}

// Fonction utilitaire pour parser les dates
function parseDate(dateValue) {
  if (!dateValue) return null;
  
  // Si c'est déjà une date
  if (dateValue instanceof Date) return dateValue;
  
  // Si c'est un nombre (format Excel)
  if (typeof dateValue === 'number') {
    // Excel stocke les dates comme nombre de jours depuis le 1er janvier 1900
    const excelEpoch = new Date(1899, 11, 30); // 30 décembre 1899
    return new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
  }
  
  // Si c'est une chaîne
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
}

// Fonction utilitaire pour parser les booléens
function parseBool(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'true' || lower === 'oui' || lower === 'yes' || lower === '1' || lower === 'x';
  }
  if (typeof value === 'number') return value === 1;
  return false;
}

// Exécuter le script
if (require.main === module) {
  importLivaExcel();
}

module.exports = { importLivaExcel };