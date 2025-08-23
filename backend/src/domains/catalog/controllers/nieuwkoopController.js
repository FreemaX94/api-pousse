const fs = require('fs');
const axios = require('axios');
const nieuwkoopApi = require('../services/nieuwkoopApi');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');

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

    const imageUrl = `/api/catalog/nieuwkoop/items/${reference}/image`;

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
    const items = await NieuwkoopItem.find().sort({ createdAt: -1 });
    
    // Formater les données pour le frontend
    const formattedItems = items.map(item => {
      const formattedItem = {
        _id: item._id,
        reference: item.reference,
        name: item.name,
        description: item.description,
        // Extraire le prix de pricing.price pour le frontend
        price: item.pricing?.price || 0,
        // Extraire l'image primaire pour le frontend avec URL relative
        image: (() => {
          const imageUrl = item.images?.find(img => img.isPrimary)?.url || item.images?.[0]?.url || null;
          // Garder l'URL relative pour que le frontend gère l'URL de base
          return imageUrl;
        })(),
        // Conserver la structure stock
        stock: {
          quantity: item.stock?.quantity || 0,
          reservedQuantity: item.stock?.reservedQuantity || 0,
          minimumAlert: item.stock?.minimumAlert || 0
        },
        // Ajouter availableQuantity pour cohérence
        availableQuantity: Math.max(0, (item.stock?.quantity || 0) - (item.stock?.reservedQuantity || 0)),
        category: item.category,
        // Conserver d'autres champs utiles
        dimensions: item.dimensions,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
      
      return formattedItem;
    });
    
    // Debug: afficher la structure des données formatées
    if (formattedItems.length > 0) {
      console.log('🔍 Debug - Premier item formaté:', {
        id: formattedItems[0]._id,
        name: formattedItems[0].name,
        price: formattedItems[0].price,
        image: formattedItems[0].image,
        hasImage: !!formattedItems[0].image,
        stock: formattedItems[0].stock
      });
    }
    
    res.json(formattedItems);
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

    const updated = await NieuwkoopItem.findByIdAndUpdate(id, { 'stock.quantity': quantity }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Erreur mise à jour quantité:', err.message);
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
