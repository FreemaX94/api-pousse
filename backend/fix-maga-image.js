#!/usr/bin/env node

/**
 * Script pour corriger l'URL de l'image de l'article "maga"
 * L'image existe sur Spaces mais l'article utilise encore l'URL de fallback
 */

const mongoose = require('mongoose');

// Configuration MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-pousse';

async function connectDB() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  }
}

// Schéma NieuwkoopItem simplifié
const nieuwkoopItemSchema = new mongoose.Schema({
  reference: String,
  name: String,
  images: [{
    url: String,
    isPrimary: Boolean,
    alt: String
  }],
  image: String // Propriété virtuelle pour compatibilité
}, {
  timestamps: true,
  collection: 'nieuwkoopitems'
});

const NieuwkoopItem = mongoose.model('NieuwkoopItem', nieuwkoopItemSchema);

async function fixMagaImage() {
  try {
    console.log('🔍 Recherche de l\'article "maga"...');
    
    const magaArticle = await NieuwkoopItem.findOne({ name: 'maga' });
    
    if (!magaArticle) {
      console.log('❌ Article "maga" non trouvé');
      return;
    }
    
    console.log('📦 Article trouvé:', {
      reference: magaArticle.reference,
      name: magaArticle.name,
      currentImageUrl: magaArticle.images?.[0]?.url || 'Aucune'
    });
    
    // URL Spaces correcte
    const correctSpacesUrl = 'https://api-pousse-uploads.ams3.cdn.digitaloceanspaces.com/movements/movement_IMG_1949_site_1757437781871.PNG';
    
    console.log('🔄 Correction de l\'URL vers Spaces...');
    
    // Mettre à jour l'URL de l'image
    if (magaArticle.images && magaArticle.images.length > 0) {
      magaArticle.images[0].url = correctSpacesUrl;
    } else {
      magaArticle.images = [{
        url: correctSpacesUrl,
        isPrimary: true,
        alt: 'maga'
      }];
    }
    
    await magaArticle.save();
    
    console.log('✅ Article "maga" mis à jour avec l\'URL Spaces correcte');
    console.log('🖼️ Nouvelle URL:', correctSpacesUrl);
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  }
}

async function main() {
  await connectDB();
  await fixMagaImage();
  await mongoose.connection.close();
  console.log('✅ Correction terminée');
}

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}