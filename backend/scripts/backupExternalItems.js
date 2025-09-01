// Script de sauvegarde complète des articles externes
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// Essayer d'importer depuis les deux emplacements possibles
let PartnerItem;
try {
  PartnerItem = require('../models/partnerItemModel');
} catch (err) {
  try {
    PartnerItem = require('../src/domains/catalog/models/partnerItemModel');
  } catch (err2) {
    console.error('❌ Impossible de charger le modèle PartnerItem');
    process.exit(1);
  }
}

async function backupExternalItems() {
  try {
    // Connexion à MongoDB
    console.log('🔄 Connexion à MongoDB...');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI non trouvée dans les variables d\'environnement');
    }
    console.log(`🔗 URI: ${mongoUri.substring(0, 50)}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Créer le dossier de sauvegarde
    const backupDir = path.join(__dirname, '../backup-articles-externes');
    const imagesDir = path.join(backupDir, 'images');
    
    try {
      await fs.mkdir(backupDir, { recursive: true });
      await fs.mkdir(imagesDir, { recursive: true });
      console.log('📁 Dossiers de sauvegarde créés');
    } catch (err) {
      console.log('📁 Dossiers de sauvegarde déjà existants');
    }

    // Récupérer tous les articles externes
    console.log('🔄 Récupération des articles externes...');
    const items = await PartnerItem.find({});
    console.log(`📦 ${items.length} articles externes trouvés`);

    if (items.length === 0) {
      console.log('ℹ️  Aucun article externe à sauvegarder');
      return;
    }

    // Préparer les données pour la sauvegarde
    const backupData = {
      metadata: {
        date: new Date().toISOString(),
        totalItems: items.length,
        version: '1.0'
      },
      items: []
    };

    console.log('🔄 Traitement des articles...');
    let imageCount = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log(`⚙️  Traitement ${i + 1}/${items.length}: ${item.name}`);

      // Préparer les données de l'article
      const articleData = {
        _id: item._id.toString(),
        reference: item.reference,
        name: item.name,
        prix: item.price,
        hauteur: item.height || null,
        diametre: item.diameter || null,
        quantite: item.quantity,
        stockType: item.stockType || 'permanent',
        note: item.note || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        hasImage: !!item.image,
        imageFile: null
      };

      // Traiter l'image si elle existe
      if (item.image) {
        try {
          // Déterminer l'extension de fichier
          let extension = 'png';
          if (item.image.includes('data:image/jpeg')) extension = 'jpg';
          else if (item.image.includes('data:image/png')) extension = 'png';
          else if (item.image.includes('data:image/webp')) extension = 'webp';

          // Nom du fichier image
          const imageName = `${item.reference.replace(/[^a-zA-Z0-9]/g, '_')}_${item._id}.${extension}`;
          const imagePath = path.join(imagesDir, imageName);

          // Extraire les données base64
          const base64Data = item.image.replace(/^data:image\/[a-z]+;base64,/, '');
          
          // Sauvegarder l'image
          await fs.writeFile(imagePath, base64Data, 'base64');
          
          articleData.imageFile = imageName;
          articleData.imageSize = Math.round(base64Data.length * 0.75); // Taille approximative en bytes
          imageCount++;
          
          console.log(`   🖼️  Image sauvegardée: ${imageName}`);
        } catch (imageErr) {
          console.error(`   ❌ Erreur image pour ${item.name}:`, imageErr.message);
          articleData.imageError = imageErr.message;
        }
      }

      backupData.items.push(articleData);
    }

    // Sauvegarder les données JSON
    const jsonPath = path.join(backupDir, 'articles-externes-backup.json');
    await fs.writeFile(jsonPath, JSON.stringify(backupData, null, 2), 'utf8');
    console.log('💾 Données JSON sauvegardées');

    // Créer un fichier CSV simple pour Excel
    const csvContent = [
      'Référence,Nom,Prix,Hauteur,Diamètre,Quantité,Type Stock,Image,Note',
      ...backupData.items.map(item => 
        `"${item.reference}","${item.name}",${item.prix},${item.hauteur || ''},${item.diametre || ''},${item.quantite},"${item.stockType}","${item.hasImage ? 'Oui' : 'Non'}","${item.note}"`
      )
    ].join('\\n');
    
    const csvPath = path.join(backupDir, 'articles-externes-backup.csv');
    await fs.writeFile(csvPath, csvContent, 'utf8');
    console.log('📊 Fichier CSV créé pour Excel');

    // Créer un fichier README
    const readmeContent = `# Sauvegarde Articles Externes

## Informations
- Date de sauvegarde: ${new Date().toLocaleString('fr-FR')}
- Nombre d'articles: ${items.length}
- Nombre d'images: ${imageCount}

## Structure
- **articles-externes-backup.json**: Toutes les données complètes
- **articles-externes-backup.csv**: Données en format Excel
- **images/**: Toutes les images extraites

## Données sauvegardées par article
- Référence
- Nom
- Prix (€)
- Hauteur (si disponible)
- Diamètre (si disponible)  
- Quantité
- Type de stock (permanent/limité)
- Image (fichier séparé)
- Note/Description

## Usage
Les images sont au format original (PNG/JPG) et peuvent être utilisées directement.
Le fichier JSON peut être réimporté dans l'application si nécessaire.
`;

    const readmePath = path.join(backupDir, 'README.md');
    await fs.writeFile(readmePath, readmeContent, 'utf8');

    // Résumé final
    console.log('\\n✅ SAUVEGARDE TERMINÉE');
    console.log('='.repeat(50));
    console.log(`📦 Articles sauvegardés: ${items.length}`);
    console.log(`🖼️  Images extraites: ${imageCount}`);
    console.log(`📁 Dossier: ${backupDir}`);
    console.log(`📄 Fichiers créés:`);
    console.log(`   - articles-externes-backup.json (données complètes)`);
    console.log(`   - articles-externes-backup.csv (pour Excel)`);
    console.log(`   - images/ (${imageCount} fichiers image)`);
    console.log(`   - README.md (documentation)`);
    
    // Statistiques détaillées
    const articlesWithImages = backupData.items.filter(item => item.hasImage);
    const articlesWithPrice = backupData.items.filter(item => item.prix > 0);
    const articlesWithDimensions = backupData.items.filter(item => item.hauteur || item.diametre);
    
    console.log('\\n📊 STATISTIQUES');
    console.log('='.repeat(30));
    console.log(`📷 Articles avec image: ${articlesWithImages.length}/${items.length}`);
    console.log(`💰 Articles avec prix: ${articlesWithPrice.length}/${items.length}`);
    console.log(`📏 Articles avec dimensions: ${articlesWithDimensions.length}/${items.length}`);
    
    if (articlesWithPrice.length > 0) {
      const totalValue = articlesWithPrice.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
      const avgPrice = articlesWithPrice.reduce((sum, item) => sum + item.prix, 0) / articlesWithPrice.length;
      console.log(`💎 Valeur totale du stock: €${totalValue.toFixed(2)}`);
      console.log(`📊 Prix moyen: €${avgPrice.toFixed(2)}`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\\n👋 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  backupExternalItems();
}

module.exports = backupExternalItems;