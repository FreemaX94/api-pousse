const mongoose = require('mongoose');
const CatalogueItem = require('../../models/CatalogueItem');
const User = require('../../models/userModel');
const { Counter } = require('../../models/Counter');

describe('CatalogueItem Model Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test_catalogue');
  });

  beforeEach(async () => {
    await CatalogueItem.deleteMany({});
    await Counter.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('CatalogueItem Creation and Validation', () => {
    test('should create a valid catalogue item', async () => {
      const itemData = {
        categorie: 'Plantes',
        nom: 'Rose rouge',
        description: 'Une belle rose rouge',
        price: {
          buyPrice: 5.50,
          sellPrice: 12.00
        },
        stock: {
          quantity: 100,
          minQuantity: 10
        }
      };

      const item = new CatalogueItem(itemData);
      const savedItem = await item.save();

      expect(savedItem.itemId).toMatch(/^CAT-\d{6}$/);
      expect(savedItem.categorie).toBe(itemData.categorie);
      expect(savedItem.nom).toBe(itemData.nom);
      expect(savedItem.status).toBe('active');
      expect(savedItem.seo.slug).toBe('rose-rouge');
    });

    test('should generate unique item IDs', async () => {
      const itemData = {
        categorie: 'Plantes',
        nom: 'Test Item'
      };

      const item1 = new CatalogueItem(itemData);
      const item2 = new CatalogueItem({ ...itemData, nom: 'Test Item 2' });

      const saved1 = await item1.save();
      const saved2 = await item2.save();

      expect(saved1.itemId).toMatch(/^CAT-000001$/);
      expect(saved2.itemId).toMatch(/^CAT-000002$/);
      expect(saved1.itemId).not.toBe(saved2.itemId);
    });

    test('should validate required fields', async () => {
      const invalidItem = new CatalogueItem({});
      await expect(invalidItem.save()).rejects.toThrow();
    });

    test('should validate categorie enum', async () => {
      const invalidItem = new CatalogueItem({
        categorie: 'InvalidCategory',
        nom: 'Test Item'
      });
      await expect(invalidItem.save()).rejects.toThrow();
    });

    test('should validate price values', async () => {
      const invalidItem = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item',
        price: {
          buyPrice: -5,
          sellPrice: -10
        }
      });
      await expect(invalidItem.save()).rejects.toThrow();
    });

    test('should generate slug automatically', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Rose Rouge Magnifique!'
      });
      await item.save();
      expect(item.seo.slug).toBe('rose-rouge-magnifique');
    });

    test('should not regenerate slug if already exists', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Rose Rouge',
        seo: { slug: 'custom-slug' }
      });
      await item.save();
      expect(item.seo.slug).toBe('custom-slug');
    });
  });

  describe('Virtual Properties', () => {
    test('should calculate available stock correctly', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item',
        stock: {
          quantity: 100,
          reserved: 20
        }
      });

      expect(item.stock.available).toBe(80);
    });

    test('should calculate stock status correctly', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item',
        stock: {
          quantity: 5,
          reserved: 0,
          minQuantity: 10
        }
      });

      expect(item.stock.status).toBe('low_stock');

      item.stock.quantity = 0;
      expect(item.stock.status).toBe('out_of_stock');

      item.stock.quantity = 50;
      expect(item.stock.status).toBe('in_stock');
    });

    test('should calculate profit margin correctly', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item',
        price: {
          buyPrice: 10,
          sellPrice: 15
        }
      });

      expect(item.profit.margin).toBe(50); // (15-10)/10 * 100 = 50%
    });
  });

  describe('Instance Methods', () => {
    test('should update stock correctly', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item',
        stock: { quantity: 100 }
      });
      await item.save();

      // Test set operation
      await item.updateStock(50, 'set');
      expect(item.stock.quantity).toBe(50);

      // Test add operation
      await item.updateStock(25, 'add');
      expect(item.stock.quantity).toBe(75);

      // Test subtract operation
      await item.updateStock(30, 'subtract');
      expect(item.stock.quantity).toBe(45);

      // Test subtract with negative result (should be 0)
      await item.updateStock(100, 'subtract');
      expect(item.stock.quantity).toBe(0);
    });

    test('should handle stock reservations correctly', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item',
        stock: { quantity: 100, reserved: 0 }
      });
      await item.save();

      // Test reservation
      await item.reserve(20);
      expect(item.stock.reserved).toBe(20);
      expect(item.stock.available).toBe(80);

      // Test insufficient stock reservation
      await expect(item.reserve(90)).rejects.toThrow('Quantité insuffisante en stock');

      // Test release reservation
      await item.releaseReservation(10);
      expect(item.stock.reserved).toBe(10);
      expect(item.stock.available).toBe(90);
    });

    test('should add reviews and calculate ratings', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123'
      });
      await user.save();

      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item'
      });
      await item.save();

      // Add first review
      await item.addReview(5, 'Excellent product!', user._id);
      expect(item.ratings.count).toBe(1);
      expect(item.ratings.average).toBe(5);

      // Add second review
      await item.addReview(3, 'Good but could be better', user._id);
      expect(item.ratings.count).toBe(2);
      expect(item.ratings.average).toBe(4); // (5+3)/2 = 4
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test items
      await CatalogueItem.create([
        {
          categorie: 'Plantes',
          nom: 'Rose Rouge',
          status: 'active',
          stock: { quantity: 50, minQuantity: 10 }
        },
        {
          categorie: 'Plantes',
          nom: 'Rose Blanche',
          status: 'inactive',
          stock: { quantity: 30, minQuantity: 5 }
        },
        {
          categorie: 'Contenants',
          nom: 'Pot en terre',
          status: 'active',
          stock: { quantity: 5, minQuantity: 10 } // Low stock
        },
        {
          categorie: 'Contenants',
          nom: 'Vase en verre',
          status: 'active',
          stock: { quantity: 0, minQuantity: 5 } // Out of stock
        }
      ]);
    });

    test('should find items by category', async () => {
      const plantItems = await CatalogueItem.findByCategory('Plantes');
      expect(plantItems).toHaveLength(1); // Only active items
      expect(plantItems[0].nom).toBe('Rose Rouge');
    });

    test('should search items by text', async () => {
      const results = await CatalogueItem.searchItems('Rose');
      expect(results).toHaveLength(1); // Only active items with "Rose"
      expect(results[0].nom).toBe('Rose Rouge');
    });

    test('should find low stock items', async () => {
      const lowStockItems = await CatalogueItem.getLowStockItems();
      expect(lowStockItems).toHaveLength(2); // Pot en terre and Vase en verre
      
      const names = lowStockItems.map(item => item.nom).sort();
      expect(names).toEqual(['Pot en terre', 'Vase en verre']);
    });

    test('should get item statistics', async () => {
      // Add prices for calculation
      await CatalogueItem.updateMany(
        {},
        { $set: { 'price.sellPrice': 10 } }
      );

      const stats = await CatalogueItem.getItemStats();
      expect(stats).toHaveLength(2); // 2 categories

      const plantStats = stats.find(s => s._id === 'Plantes');
      const containerStats = stats.find(s => s._id === 'Contenants');

      expect(plantStats.count).toBe(2);
      expect(containerStats.count).toBe(2);
      expect(containerStats.lowStock).toBe(2); // Both containers are low/out of stock
    });
  });

  describe('Data Integrity and Security', () => {
    test('should prevent deleteMany without filter', async () => {
      await expect(CatalogueItem.deleteMany({})).rejects.toThrow('❌ Suppression globale interdite');
    });

    test('should prevent deleteOne without filter', async () => {
      await expect(CatalogueItem.deleteOne({})).rejects.toThrow('❌ Suppression sans filtre interdite');
    });

    test('should allow filtered deletions', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item'
      });
      await item.save();

      await expect(CatalogueItem.deleteOne({ _id: item._id })).resolves.not.toThrow();
    });

    test('should validate stock quantities are non-negative', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item',
        stock: {
          quantity: -10,
          minQuantity: -5
        }
      });

      await expect(item.save()).rejects.toThrow();
    });

    test('should trim and process text fields correctly', async () => {
      const item = new CatalogueItem({
        categorie: 'Plantes',
        nom: '  Rose Rouge  ',
        description: '  Une belle rose  ',
        tags: ['  ROUGE  ', '  FLEUR  ']
      });
      await item.save();

      expect(item.nom).toBe('Rose Rouge');
      expect(item.description).toBe('Une belle rose');
      expect(item.tags).toEqual(['rouge', 'fleur']);
    });
  });

  describe('Indexes and Performance', () => {
    test('should create proper indexes', async () => {
      const indexes = await CatalogueItem.collection.getIndexes();
      
      // Check that important indexes exist
      expect(indexes).toHaveProperty('categorie_1_nom_1');
      expect(indexes).toHaveProperty('status_1_categorie_1');
      expect(indexes).toHaveProperty('itemId_1');
    });

    test('should enforce unique itemId', async () => {
      const item1 = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item 1',
        itemId: 'CAT-999999'
      });
      await item1.save();

      const item2 = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item 2',
        itemId: 'CAT-999999'
      });

      await expect(item2.save()).rejects.toThrow();
    });

    test('should enforce unique slug', async () => {
      const item1 = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item 1',
        seo: { slug: 'unique-slug' }
      });
      await item1.save();

      const item2 = new CatalogueItem({
        categorie: 'Plantes',
        nom: 'Test Item 2',
        seo: { slug: 'unique-slug' }
      });

      await expect(item2.save()).rejects.toThrow();
    });
  });

  describe('Complex Queries and Aggregations', () => {
    test('should handle complex availability queries', async () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      await CatalogueItem.create([
        {
          categorie: 'Plantes',
          nom: 'Seasonal Item',
          availability: {
            isAvailable: true,
            seasonalStart: pastDate,
            seasonalEnd: futureDate
          }
        },
        {
          categorie: 'Plantes',
          nom: 'Out of Season',
          availability: {
            isAvailable: false,
            seasonalStart: futureDate,
            seasonalEnd: new Date(futureDate.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      ]);

      const availableItems = await CatalogueItem.find({
        'availability.isAvailable': true,
        'availability.seasonalStart': { $lte: now },
        'availability.seasonalEnd': { $gte: now }
      });

      expect(availableItems).toHaveLength(1);
      expect(availableItems[0].nom).toBe('Seasonal Item');
    });
  });
});