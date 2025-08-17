const fs = require('fs');
const axios = require('axios');
const nieuwkoopApi = require('../services/nieuwkoopApi');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');
const logger = require('../utils/logger');

// 🔍 API Nieuwkoop - Infos produits
exports.getItems = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchItems();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchItem(req.params.productId);
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getItemImage = async (req, res) => {
  try {
    const buffer = await nieuwkoopApi.fetchItemImage(req.params.productId);
    if (!buffer) return res.status(404).send('Image not found');

    const filePath = `./test_${req.params.productId}.jpg`;
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Image sauvegardée localement : ${filePath}`);

    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (err) {
    console.error('❌ Erreur getItemImage:', err);
    res.status(500).send('Erreur image Nieuwkoop');
  }
};

exports.getItemDetails = async (req, res) => {
  try {
    const item = await nieuwkoopApi.fetchItem(req.params.productId);
    console.log('🔍 EXEMPLE STRUCTURE ITEM NIEUWKOOP:', JSON.stringify(item, null, 2));
    console.log('📦 Champs disponibles:', Object.keys(item || {}));
    console.log('🌱 Diamètre/PotSize - DiameterCulturePot:', item?.DiameterCulturePot, 'PotSize:', item?.PotSize);
    console.log('📏 Dimensions - Height:', item?.Height, 'Width:', item?.Width, 'Depth:', item?.Depth);
    console.log('🏷️ Description - ItemDescription_EN:', item?.ItemDescription_EN, 'ItemDescription_FR:', item?.ItemDescription_FR);
    res.json({ item });
  } catch (err) {
    console.error('❌ Erreur getItemDetails:', err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération du produit.' });
  }
};

exports.getItemPrice = async (req, res) => {
  try {
    const price = await nieuwkoopApi.fetchItemPrice(req.params.productId);
    res.json({ price });
  } catch (err) {
    console.error('❌ Erreur getItemPrice:', err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération du prix.' });
  }
};

exports.getPriceFromReference = async (req, res) => {
  try {
    const reference = req.params.ref;

    if (!reference) {
      return res.status(400).json({ error: 'Référence manquante.' });
    }

    const response = await axios.get(`https://api.nieuwkoop.nl/prices/${reference}`);
    const data = response.data;
    console.log('🔍 API Nieuwkoop Price Response:', data);

    if (!data || typeof data.PriceNett !== 'number') {
      return res.status(404).json({ error: 'Prix non trouvé pour cette référence.' });
    }

    return res.json({ price: data.PriceNett });
  } catch (error) {
    console.error('❌ Erreur dans getPriceFromReference :', error.message);
    return res.status(500).json({ error: 'Erreur serveur lors de la récupération du prix.' });
  }
};

exports.createNieuwkoopItem = async (req, res) => {
  try {
    console.log('📦 Données reçues par /save :', req.body);
    const { reference, name, height, diameter, price, category } = req.body;

    if (!price || isNaN(Number(price))) {
      return res.status(400).json({ message: 'Prix invalide ou manquant.' });
    }

    const imageUrl = `/api/nieuwkoop/items/${reference}/image`;

    const exists = await NieuwkoopItem.findOne({ reference });
    if (exists) {
      return res.status(400).json({ message: 'Ce produit est déjà dans le stock local.' });
    }

    const item = await NieuwkoopItem.create({
      reference,
      name,
      dimensions: {
        height: height || 0,
        diameter: diameter || 0
      },
      pricing: {
        price: Number(price)
      },
      images: [{
        url: imageUrl,
        isPrimary: true
      }],
      stock: {
        quantity: typeof req.body.quantity === 'number' ? req.body.quantity : 1
      },
      category: category || 'autre'
    });

    res.status(201).json(item);
  } catch (err) {
    console.error('❌ Erreur ajout Nieuwkoop item:', err.message);
    res.status(500).json({ error: 'Erreur serveur lors de l\'ajout.' });
  }
};

exports.getNieuwkoopItems = async (req, res) => {
  try {
    const { search } = req.query;
    
    // Construction de la requête de base - inclure les articles sans le champ isActive ou avec isActive = true
    let query = {
      $or: [
        { 'availability.isActive': true },
        { 'availability.isActive': { $exists: false } }
      ]
    };
    
    // Si un terme de recherche est fourni (au moins 2 caractères)
    if (search && search.length >= 2) {
      query = {
        ...query,
        $and: [
          {
            $or: [
              { 'availability.isActive': true },
              { 'availability.isActive': { $exists: false } }
            ]
          },
          {
            $or: [
              { reference: new RegExp(search, 'i') },
              { name: new RegExp(search, 'i') },
              { description: new RegExp(search, 'i') },
              { tags: new RegExp(search, 'i') }
            ]
          }
        ]
      };
    }
    
    const startTime = Date.now();
    const items = await NieuwkoopItem.find(query)
      .sort({ createdAt: -1 })
      .limit(100) // Limiter pour éviter les timeouts
      .lean(); // Optimisation MongoDB
    
    const duration = Date.now() - startTime;
    logger.nieuwkoop.search(req.user?.userId, search || 'all', items.length, duration);
    
    // Transformer les données pour le frontend avec la quantité disponible calculée
    const transformedItems = items.map(item => {
      // Gérer les différents formats d'images (anciens et nouveaux)
      let imageUrl = '';
      if (item.primaryImage?.url) {
        imageUrl = item.primaryImage.url;
      } else if (item.images && item.images.length > 0 && item.images[0]?.url) {
        imageUrl = item.images[0].url;
      } else if (item.reference) {
        // Image par défaut basée sur la référence
        imageUrl = `/api/nieuwkoop/items/${item.reference}/image`;
      }

      // Calculer la quantité disponible avec fallbacks
      // Gestion des anciens articles avec champs directs (quantity, reservedQuantity)
      const stockQuantity = item.stock?.quantity || item.quantity || 0;
      const reservedQuantity = item.stock?.reservedQuantity || item.reservedQuantity || 0;
      const availableQuantity = Math.max(0, stockQuantity - reservedQuantity);

      return {
        _id: item._id,
        reference: item.reference || '',
        name: item.name || 'Article sans nom',
        description: item.description || '',
        category: item.category || 'autre',
        // Image avec fallback
        image: imageUrl,
        // Quantité disponible calculée AU NIVEAU RACINE pour le frontend
        availableQuantity,
        // Infos stock complètes pour debug
        stock: {
          quantity: stockQuantity,
          reservedQuantity,
          availableQuantity
        },
        // Prix avec fallbacks multiples (priorité aux champs directs pour anciens articles)
        price: item.price || item.pricing?.price || item.PriceNett || 0,
        priceFormatted: item.priceFormatted || `${(item.price || item.pricing?.price || item.PriceNett || 0).toFixed(2)} EUR`,
        // Dimensions avec fallbacks multiples (priorité aux champs directs pour anciens articles)
        height: item.height || item.dimensions?.height || item.Height || 0,
        diameter: item.diameter || item.dimensions?.diameter || item.DiameterCulturePot || item.PotSize || 0,
        width: item.width || item.dimensions?.width || item.Width || 0,
        depth: item.depth || item.dimensions?.depth || item.Depth || 0,
        // Marquer si c'est une nouvelle plante (faux pour les articles existants)
        isNewPlant: false,
        // Dates
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    });
    
    console.log(`✅ Trouvé ${transformedItems.length} items Nieuwkoop`);
    if (transformedItems.length > 0) {
      console.log('📦 Premier item debug:', {
        reference: transformedItems[0].reference,
        name: transformedItems[0].name,
        price: transformedItems[0].price,
        height: transformedItems[0].height,
        diameter: transformedItems[0].diameter,
        availableQuantity: transformedItems[0].availableQuantity
      });
    }
    
    res.json(transformedItems);
  } catch (err) {
    console.error('❌ Erreur récupération des items Nieuwkoop:', err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération.' });
  }
};

exports.updateNieuwkoopQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantité invalide.' });
    }

    const item = await NieuwkoopItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    const oldQuantity = item.stock?.quantity || 0;
    const updated = await NieuwkoopItem.findByIdAndUpdate(id, { 'stock.quantity': quantity }, { new: true });
    
    logger.nieuwkoop.stockUpdate(req.user?.userId, item.reference, oldQuantity, quantity);
    
    // Retourner la structure simplifiée avec quantity au niveau racine
    res.json({
      _id: updated._id,
      reference: updated.reference,
      name: updated.name,
      quantity: updated.stock?.quantity || quantity,
      price: updated.price || updated.pricing?.price || 0,
      category: updated.category,
      image: updated.images?.[0]?.url || `/api/nieuwkoop/items/${updated.reference}/image`,
      height: updated.height || updated.dimensions?.height || 0,
      diameter: updated.diameter || updated.dimensions?.diameter || 0,
      note: updated.notes || '',
      reservedQuantity: updated.stock?.reservedQuantity || 0
    });
  } catch (err) {
    logger.error('Erreur mise à jour quantité Nieuwkoop', { 
      error: err.message,
      itemId: req.params.id,
      userId: req.user?.userId 
    });
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour.' });
  }
};

exports.updateNieuwkoopNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const updated = await NieuwkoopItem.findByIdAndUpdate(id, { notes: note }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Erreur mise à jour note:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.updateNieuwkoopCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    const allowed = ['plante', 'contenant', 'noel', 'artificiel', 'seche', 'entretien', 'autre'];
    if (!allowed.includes(category)) {
      return res.status(400).json({ message: 'Catégorie invalide.' });
    }

    const updated = await NieuwkoopItem.findByIdAndUpdate(id, { category }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Erreur updateNieuwkoopCategory:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.refreshNieuwkoopDimensions = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer l'article existant
    const item = await NieuwkoopItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }
    
    console.log(`🔄 Rafraîchissement des dimensions pour ${item.reference}`);
    
    // Récupérer les détails depuis l'API Nieuwkoop
    const apiUrl = `https://www.nieuwkoop-europe.com/api/json/getItemDetails.php`;
    const response = await axios.get(apiUrl, {
      params: {
        key: process.env.NIEUWKOOP_API_KEY || 'Z_GKBQCOumTjsZlQQQKBQgSO',
        item_code: item.reference,
        lang: 'EN'
      }
    });
    
    if (response.data && response.data.item) {
      const apiData = response.data.item;
      
      // Extraire les dimensions avec tous les champs possibles
      const diameter = 
        apiData.DiameterCulturePot || 
        apiData.Diameter || 
        apiData.Opening || 
        (apiData.PotSize ? parseInt(apiData.PotSize) : 0) || 
        item.dimensions?.diameter || 
        0;
      
      const height = apiData.Height || item.dimensions?.height || 0;
      
      // Mettre à jour les dimensions
      item.dimensions = {
        ...item.dimensions,
        height: height,
        diameter: diameter
      };
      
      await item.save();
      
      console.log(`✅ Dimensions mises à jour: hauteur=${height}cm, diamètre=${diameter}cm`);
      
      // Retourner l'article mis à jour avec le format attendu par le frontend
      res.json({
        _id: item._id,
        reference: item.reference,
        name: item.name,
        height: height,
        diameter: diameter,
        dimensions: item.dimensions,
        message: `Dimensions mises à jour: H=${height}cm, Ø=${diameter}cm`
      });
    } else {
      return res.status(404).json({ 
        message: 'Impossible de récupérer les données depuis l\'API Nieuwkoop' 
      });
    }
  } catch (err) {
    console.error('❌ Erreur rafraîchissement dimensions:', err.message);
    res.status(500).json({ error: 'Erreur lors du rafraîchissement des dimensions.' });
  }
};

exports.deleteNieuwkoopItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Tentative de suppression de l\'article avec ID:', id);
    
    const deleted = await NieuwkoopItem.findByIdAndDelete(id);
    console.log('📦 Article trouvé et supprimé:', deleted ? 'OUI' : 'NON');
    
    if (!deleted) {
      console.log('❌ Article non trouvé avec ID:', id);
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    console.log('✅ Article supprimé avec succès:', deleted.name);
    res.json({ message: 'Article supprimé avec succès.', deleted: deleted.name });
  } catch (err) {
    console.error('❌ Erreur suppression article:', err.message);
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
};

exports.deleteAllNieuwkoopItems = async (req, res) => {
  try {
    await NieuwkoopItem.deleteMany();
    res.json({ message: 'Tous les articles ont été supprimés.' });
  } catch (err) {
    console.error('❌ Erreur suppression globale:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression globale.' });
  }
};

exports.getCatalog = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchCatalog();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getCatalogById = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchCatalogById(req.params.catalogId);
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getStocks = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchStock();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getStockById = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchStockById(req.params.productId);
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};

exports.getHealth = async (req, res, next) => {
  try {
    const data = await nieuwkoopApi.fetchHealth();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
};
