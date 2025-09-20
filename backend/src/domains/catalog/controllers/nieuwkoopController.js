const fs = require('fs');
const axios = require('axios');
const nieuwkoopApi = require('../services/nieuwkoopApi');
const NieuwkoopItem = require('../models/nieuwkoopItemModel');
const Movement = require('../../inventory/models/movementModel');

// 🚀 Fonction utilitaire premium pour calculer les exitCount
async function calculateExitCounts(references) {
  try {
    console.log('🔄 [EXITCOUNT] Calcul des compteurs de sortie pour', references.length, 'références');
    
    // Agrégation MongoDB optimisée pour performance
    const exitCounts = await Movement.aggregate([
      {
        $match: {
          type: 'sortie',
          reference: { $in: references }
        }
      },
      {
        $group: {
          _id: '$reference',
          totalExits: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);
    
    // Créer un map pour accès O(1)
    const exitCountMap = {};
    exitCounts.forEach(item => {
      exitCountMap[item._id] = {
        exitCount: item.totalExits,
        totalExitQuantity: item.totalQuantity
      };
    });
    
    console.log('✅ [EXITCOUNT] Compteurs calculés:', Object.keys(exitCountMap).length, 'articles avec sorties');
    return exitCountMap;
    
  } catch (error) {
    console.error('❌ [EXITCOUNT] Erreur calcul:', error.message);
    return {};
  }
}

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

exports.getMovementImage = async (req, res) => {
  try {
    const filename = req.params.filename;
    const fs = require('fs');
    const path = require('path');
    
    const publicPath = path.join(__dirname, '../../../public', filename);
    const assetsPath = path.join(__dirname, '../../../assets', filename);
    
    console.log('🎯 API MOVEMENT IMAGE:', filename);
    
    if (fs.existsSync(publicPath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.sendFile(publicPath);
    } else if (fs.existsSync(assetsPath)) {
      res.setHeader('Content-Type', 'image/jpeg'); 
      res.sendFile(assetsPath);
    } else {
      res.status(404).json({ error: 'Movement image not found', filename });
    }
  } catch (err) {
    console.error('❌ Erreur getMovementImage:', err);
    res.status(500).json({ error: 'Erreur serveur movement image' });
  }
};

exports.getNieuwkoopItems = async (req, res) => {
  try {
    const { search } = req.query;
    console.log('🔍 [NIEUWKOOP-SEARCH] ============ DÉBUT RECHERCHE ============');
    console.log('🔍 [NIEUWKOOP-SEARCH] req.query complet:', req.query);
    console.log('🔍 [NIEUWKOOP-SEARCH] Paramètre search:', search);
    console.log('🔍 [NIEUWKOOP-SEARCH] Type de search:', typeof search);
    console.log('🔍 [NIEUWKOOP-SEARCH] Longueur search:', search ? search.length : 'undefined');

    let items;

    // 🎯 FORCER LA RECHERCHE: si search existe, filtrer AUTOMATIQUEMENT
    if (search) {
      const trimmedSearch = search.trim();
      console.log('🔍 [NIEUWKOOP-SEARCH] ✅ FORCER RECHERCHE avec terme:', trimmedSearch);

      // Recherche prioritaire: commencer par "stre" d'abord
      const startWithRegex = new RegExp(`^${trimmedSearch}`, 'i');
      const containsRegex = new RegExp(trimmedSearch, 'i');

      console.log('🔍 [NIEUWKOOP-SEARCH] Regex start:', startWithRegex);
      console.log('🔍 [NIEUWKOOP-SEARCH] Regex contains:', containsRegex);

      // Recherche en deux étapes: d'abord ceux qui commencent par le terme
      const itemsStartWith = await NieuwkoopItem.find({
        $or: [
          { name: startWithRegex },
          { reference: startWithRegex }
        ]
      }).limit(5).sort({ name: 1 });

      // Puis ceux qui contiennent le terme (mais ne commencent pas par)
      const itemsContain = await NieuwkoopItem.find({
        $and: [
          {
            $or: [
              { name: containsRegex },
              { reference: containsRegex }
            ]
          },
          {
            $nor: [
              { name: startWithRegex },
              { reference: startWithRegex }
            ]
          }
        ]
      }).limit(5).sort({ name: 1 });

      // Combiner les résultats: priorité aux items qui commencent par le terme
      items = [...itemsStartWith, ...itemsContain];

      console.log('🔍 [NIEUWKOOP-SEARCH] ✅ Items trouvés (commencent par):', itemsStartWith.length);
      console.log('🔍 [NIEUWKOOP-SEARCH] ✅ Items trouvés (contiennent):', itemsContain.length);
      console.log('🔍 [NIEUWKOOP-SEARCH] ✅ Total items filtrés:', items.length);

      // Debug: afficher les résultats
      if (items.length > 0) {
        console.log('🔍 [NIEUWKOOP-SEARCH] Résultats prioritaires:');
        items.slice(0, 10).forEach((item, i) => {
          console.log(`🔍 [NIEUWKOOP-SEARCH] ${i + 1}. ${item.name} (${item.reference})`);
        });
      } else {
        console.log('🔍 [NIEUWKOOP-SEARCH] ⚠️ AUCUN RÉSULTAT TROUVÉ pour:', trimmedSearch);
      }
    } else {
      console.log('🔍 [NIEUWKOOP-SEARCH] ❌ RECHERCHE DÉSACTIVÉE - Récupération de tous les items');
      items = await NieuwkoopItem.find().sort({ createdAt: -1 });
      console.log('🔍 [NIEUWKOOP-SEARCH] Tous les items:', items.length);
    }

    console.log('🔍 [NIEUWKOOP-SEARCH] ============ FIN RECHERCHE ============');
    
    // 🚀 Calculer les exitCount pour tous les articles
    const references = items.map(item => item.reference);
    const exitCountData = await calculateExitCounts(references);
    
    // Formater les données pour le frontend
    const formattedItems = items.map(item => {
      const formattedItem = {
        _id: item._id,
        reference: item.reference,
        name: item.name,
        description: item.description,
        // Extraire le prix de pricing.price pour le frontend
        price: item.pricing?.price || 0,
        // Extraire l'image primaire pour le frontend - CONSERVER URL SPACES ORIGINALE
        image: (() => {
          const imageUrl = item.images?.find(img => img.isPrimary)?.url || item.images?.[0]?.url || null;
          // Retourner l'URL originale (Spaces) sans transformation
          return imageUrl;
        })(),
        // Conserver la structure stock
        stock: {
          quantity: item.stock?.quantity || 0,
          reservedQuantity: item.stock?.reservedQuantity || 0,
          minimumAlert: item.stock?.minimumAlert || 0,
          toOrder: item.stock?.toOrder || 0
        },
        // Ajouter availableQuantity pour cohérence
        availableQuantity: Math.max(0, (item.stock?.quantity || 0) - (item.stock?.reservedQuantity || 0)),
        category: item.category,
        // 🎯 INJECTION des compteurs de sortie réels
        exitCount: exitCountData[item.reference]?.exitCount || 0,
        totalExitQuantity: exitCountData[item.reference]?.totalExitQuantity || 0,
        // Conserver d'autres champs utiles
        dimensions: item.dimensions,
        // Ajouter les champs plats pour compatibilité frontend
        height: item.dimensions?.height || 0,
        diameter: item.dimensions?.diameter || 0,
        width: item.dimensions?.width || 0,
        length: item.dimensions?.length || 0,
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
        stock: formattedItems[0].stock,
        exitCount: formattedItems[0].exitCount,
        totalExitQuantity: formattedItems[0].totalExitQuantity
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

// PUT /:id/update-field - Mise à jour d'un champ spécifique
exports.updateItemField = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    console.log(`🔄 [UPDATE FIELD] Article ${id}, champ: ${field}, valeur: ${value}`);

    // Validation des champs autorisés
    const allowedFields = ['name', 'price', 'height', 'diameter', 'width', 'length'];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        error: 'Champ non autorisé',
        message: `Seuls ces champs peuvent être mis à jour: ${allowedFields.join(', ')}`
      });
    }

    // Validation des valeurs
    if (field === 'price' || field === 'height' || field === 'diameter' || field === 'width' || field === 'length') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        return res.status(400).json({
          error: 'Valeur invalide',
          message: `${field} doit être un nombre positif`
        });
      }
    }

    // Trouver l'article
    const NieuwkoopItem = require('../models/nieuwkoopItemModel');
    const item = await NieuwkoopItem.findById(id);
    if (!item) {
      return res.status(404).json({ 
        error: 'Article non trouvé',
        message: 'L\'article demandé n\'existe pas'
      });
    }

    // Mettre à jour selon le champ
    let updateQuery = {};
    
    if (field === 'name') {
      updateQuery.name = value;
    } else if (field === 'price') {
      updateQuery['pricing.price'] = parseFloat(value);
    } else if (field === 'height') {
      // Mettre à jour à la fois dimensions.height et height (pour compatibilité)
      updateQuery['dimensions.height'] = parseFloat(value);
      updateQuery.height = parseFloat(value);
    } else if (field === 'diameter') {
      // Mettre à jour à la fois dimensions.diameter et diameter (pour compatibilité)
      updateQuery['dimensions.diameter'] = parseFloat(value);
      updateQuery.diameter = parseFloat(value);
    } else if (field === 'width') {
      // Mettre à jour à la fois dimensions.width et width (pour compatibilité)
      updateQuery['dimensions.width'] = parseFloat(value);
      updateQuery.width = parseFloat(value);
    } else if (field === 'length') {
      // Mettre à jour à la fois dimensions.length et length (pour compatibilité)
      updateQuery['dimensions.length'] = parseFloat(value);
      updateQuery.length = parseFloat(value);
    }

    // Effectuer la mise à jour
    const updatedItem = await NieuwkoopItem.findByIdAndUpdate(
      id, 
      { $set: updateQuery },
      { new: true, runValidators: true }
    );

    console.log(`✅ [UPDATE FIELD] Article ${id} mis à jour avec succès`);

    res.json({
      success: true,
      message: `${field} mis à jour avec succès`,
      item: updatedItem
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour champ:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour l\'article'
    });
  }
};

// ✅ Contrôleur pour mettre à jour la quantité à commander
exports.updateNieuwkoopToOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { toOrder } = req.body;

    // Validation de la quantité à commander
    if (typeof toOrder !== 'number' || toOrder < 0) {
      return res.status(400).json({ message: 'La quantité à commander doit être un nombre positif ou zéro.' });
    }

    const updated = await NieuwkoopItem.findByIdAndUpdate(
      id,
      { 'stock.toOrder': toOrder },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    console.log(`✅ Quantité à commander mise à jour: ${updated.name} -> ${toOrder}`);
    res.json(updated);
  } catch (err) {
    console.error('❌ Erreur updateNieuwkoopToOrder:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ✅ Contrôleur pour traiter la réception de stock commandé
exports.processStockDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryDate, quantityReceived } = req.body;

    // Validation des données
    if (!deliveryDate || !quantityReceived || quantityReceived <= 0) {
      return res.status(400).json({
        message: 'Date de livraison et quantité reçue sont requises (quantité > 0).'
      });
    }

    // Trouver l'article
    const item = await NieuwkoopItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Article introuvable.' });
    }

    // Récupérer la quantité commandée
    const toOrderQuantity = item.stock?.toOrder || 0;
    if (toOrderQuantity <= 0) {
      return res.status(400).json({
        message: 'Aucune quantité en commande pour cet article.'
      });
    }

    // Calculer le nouveau stock
    const currentStock = item.stock?.quantity || 0;
    const newStock = currentStock + quantityReceived;

    // Mettre à jour l'article : ajouter au stock et remettre toOrder à 0
    const updated = await NieuwkoopItem.findByIdAndUpdate(
      id,
      {
        'stock.quantity': newStock,
        'stock.toOrder': 0,
        'stock.lastRestocked': new Date()
      },
      { new: true }
    );

    console.log(`✅ Réception de stock: ${updated.name} - Stock: ${currentStock} → ${newStock} (+${quantityReceived})`);

    res.json({
      message: 'Réception de stock traitée avec succès',
      item: updated,
      delivery: {
        date: deliveryDate,
        quantityReceived,
        previousStock: currentStock,
        newStock
      }
    });

  } catch (err) {
    console.error('❌ Erreur processStockDelivery:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};
