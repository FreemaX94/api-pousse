#!/usr/bin/env node

const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Script d'optimisation de la base de données MongoDB
 * Crée les indexes manquants et optimise les performances
 */

class DatabaseOptimizer {
  constructor() {
    this.db = null;
    this.optimizations = [];
    this.errors = [];
  }

  async connect() {
    try {
      const mongoUri = process.env.MONGO_URI || process.env.DATABASE_URL;
      if (!mongoUri) {
        throw new Error('MONGO_URI non défini dans les variables d\'environnement');
      }

      await mongoose.connect(mongoUri);
      this.db = mongoose.connection.db;
      logger.info('✅ Connexion MongoDB établie pour optimisation');
    } catch (error) {
      logger.error('❌ Erreur connexion MongoDB:', error);
      throw error;
    }
  }

  async createIndexes() {
    logger.info('🔍 Création des indexes manquants...');

    const indexOperations = [
      // Users - Optimisation authentification et recherche
      {
        collection: 'users',
        indexes: [
          { keys: { email: 1 }, options: { unique: true, background: true } },
          { keys: { username: 1 }, options: { unique: true, background: true } },
          { keys: { email: 1, isActive: 1 }, options: { background: true } },
          { keys: { role: 1, isActive: 1 }, options: { background: true } },
          { keys: { lastLogin: -1 }, options: { background: true } },
          { keys: { 'permissions.resource': 1 }, options: { background: true } },
          { keys: { resetPasswordToken: 1 }, options: { sparse: true, background: true } },
          { keys: { activationToken: 1 }, options: { sparse: true, background: true } }
        ]
      },

      // StockEntries - Optimisation gestion stock
      {
        collection: 'stockentries',
        indexes: [
          { keys: { createdAt: -1, userId: 1 }, options: { background: true } },
          { keys: { product: 1, type: 1 }, options: { background: true } },
          { keys: { categorie: 1, createdAt: -1 }, options: { background: true } },
          { keys: { type: 1, date: -1 }, options: { background: true } },
          { keys: { stockId: 1 }, options: { unique: true, background: true } },
          { keys: { userId: 1, createdAt: -1 }, options: { background: true } }
        ]
      },

      // CatalogueItems - Optimisation catalogue et recherche
      {
        collection: 'catalogueitems',
        indexes: [
          { keys: { nieuwkoopId: 1 }, options: { sparse: true, background: true } },
          { keys: { itemId: 1 }, options: { unique: true, background: true } },
          { keys: { categorie: 1, status: 1 }, options: { background: true } },
          { keys: { status: 1, 'availability.isAvailable': 1 }, options: { background: true } },
          { keys: { 'stock.quantity': 1, 'stock.minQuantity': 1 }, options: { background: true } },
          { keys: { 'price.sellPrice': 1 }, options: { background: true } },
          { keys: { 'supplier.name': 1 }, options: { background: true } },
          { keys: { tags: 1 }, options: { background: true } },
          { keys: { 'seo.slug': 1 }, options: { unique: true, sparse: true, background: true } },
          { keys: { 'metadata.source': 1, 'metadata.lastSyncDate': -1 }, options: { background: true } }
        ]
      },

      // Invoices - Optimisation facturation
      {
        collection: 'invoices',
        indexes: [
          { keys: { invoiceNumber: 1 }, options: { unique: true, background: true } },
          { keys: { status: 1, dueDate: 1 }, options: { background: true } },
          { keys: { clientId: 1, createdAt: -1 }, options: { background: true } },
          { keys: { createdAt: -1 }, options: { background: true } },
          { keys: { status: 1, createdAt: -1 }, options: { background: true } },
          { keys: { total: 1, status: 1 }, options: { background: true } },
          { keys: { paymentDate: -1 }, options: { sparse: true, background: true } }
        ]
      },

      // Expenses - Optimisation dépenses
      {
        collection: 'expenses',
        indexes: [
          { keys: { category: 1, date: -1 }, options: { background: true } },
          { keys: { date: -1 }, options: { background: true } },
          { keys: { amount: 1, date: -1 }, options: { background: true } },
          { keys: { supplier: 1, date: -1 }, options: { background: true } },
          { keys: { userId: 1, createdAt: -1 }, options: { background: true } }
        ]
      },

      // Vehicles - Optimisation flotte
      {
        collection: 'vehicles',
        indexes: [
          { keys: { licensePlate: 1 }, options: { unique: true, background: true } },
          { keys: { status: 1, type: 1 }, options: { background: true } },
          { keys: { 'maintenance.nextDate': 1 }, options: { background: true } },
          { keys: { 'insurance.expiryDate': 1 }, options: { background: true } },
          { keys: { assignedTo: 1 }, options: { sparse: true, background: true } }
        ]
      },

      // Projets - Optimisation projets
      {
        collection: 'projets',
        indexes: [
          { keys: { status: 1, createdAt: -1 }, options: { background: true } },
          { keys: { concepteurId: 1, status: 1 }, options: { background: true } },
          { keys: { clientId: 1, createdAt: -1 }, options: { background: true } },
          { keys: { 'dates.startDate': 1, 'dates.endDate': 1 }, options: { background: true } },
          { keys: { priority: 1, status: 1 }, options: { background: true } }
        ]
      },

      // Evenements - Optimisation calendrier
      {
        collection: 'evenements',
        indexes: [
          { keys: { startDate: 1, endDate: 1 }, options: { background: true } },
          { keys: { type: 1, startDate: 1 }, options: { background: true } },
          { keys: { userId: 1, startDate: 1 }, options: { background: true } },
          { keys: { status: 1, startDate: 1 }, options: { background: true } }
        ]
      },

      // Movements - Optimisation mouvements stock
      {
        collection: 'movements',
        indexes: [
          { keys: { type: 1, createdAt: -1 }, options: { background: true } },
          { keys: { fromLocation: 1, toLocation: 1 }, options: { background: true } },
          { keys: { status: 1, createdAt: -1 }, options: { background: true } },
          { keys: { userId: 1, createdAt: -1 }, options: { background: true } }
        ]
      }
    ];

    for (const operation of indexOperations) {
      await this.createCollectionIndexes(operation.collection, operation.indexes);
    }
  }

  async createCollectionIndexes(collectionName, indexes) {
    try {
      const collection = this.db.collection(collectionName);
      
      // Vérifier si la collection existe
      const collections = await this.db.listCollections({ name: collectionName }).toArray();
      if (collections.length === 0) {
        logger.warn(`⚠️ Collection ${collectionName} n'existe pas, création des indexes différée`);
        return;
      }

      logger.info(`📊 Optimisation collection: ${collectionName}`);

      for (const index of indexes) {
        try {
          const indexName = Object.keys(index.keys).join('_') + '_idx';
          
          // Vérifier si l'index existe déjà
          const existingIndexes = await collection.indexes();
          const indexExists = existingIndexes.some(existing => 
            JSON.stringify(existing.key) === JSON.stringify(index.keys)
          );

          if (indexExists) {
            logger.info(`  ✅ Index ${indexName} existe déjà`);
            continue;
          }

          // Créer l'index
          await collection.createIndex(index.keys, {
            ...index.options,
            name: indexName
          });

          this.optimizations.push({
            collection: collectionName,
            index: index.keys,
            status: 'created'
          });

          logger.info(`  ✅ Index créé: ${indexName}`);

        } catch (error) {
          this.errors.push({
            collection: collectionName,
            index: index.keys,
            error: error.message
          });

          if (error.code === 11000) {
            logger.warn(`  ⚠️ Index unique en conflit: ${JSON.stringify(index.keys)}`);
          } else {
            logger.error(`  ❌ Erreur création index: ${error.message}`);
          }
        }
      }

    } catch (error) {
      logger.error(`❌ Erreur collection ${collectionName}:`, error);
      this.errors.push({
        collection: collectionName,
        error: error.message
      });
    }
  }

  async analyzeCollectionStats() {
    logger.info('📈 Analyse des statistiques de collection...');

    const collections = ['users', 'stockentries', 'catalogueitems', 'invoices', 'expenses'];
    
    for (const collectionName of collections) {
      try {
        const collection = this.db.collection(collectionName);
        const stats = await collection.stats();
        
        logger.info(`📊 ${collectionName}:`, {
          documents: stats.count,
          avgObjSize: Math.round(stats.avgObjSize),
          dataSize: Math.round(stats.size / 1024) + ' KB',
          indexSize: Math.round(stats.totalIndexSize / 1024) + ' KB',
          indexes: stats.nindexes
        });

      } catch (error) {
        if (error.code !== 26) { // Collection doesn't exist
          logger.error(`❌ Erreur stats ${collectionName}:`, error.message);
        }
      }
    }
  }

  async optimizeQueries() {
    logger.info('🚀 Optimisation des requêtes fréquentes...');

    // Créer des vues optimisées pour les requêtes complexes
    await this.createViews();

    // Analyser les requêtes lentes
    await this.analyzeSlowQueries();
  }

  async createViews() {
    try {
      // Vue pour le stock disponible
      await this.db.createCollection('stockAvailableView', {
        viewOn: 'catalogueitems',
        pipeline: [
          {
            $match: { 
              status: 'active',
              'availability.isAvailable': true 
            }
          },
          {
            $addFields: {
              availableStock: {
                $subtract: ['$stock.quantity', '$stock.reserved']
              },
              stockStatus: {
                $cond: {
                  if: { $eq: [{ $subtract: ['$stock.quantity', '$stock.reserved'] }, 0] },
                  then: 'out_of_stock',
                  else: {
                    $cond: {
                      if: { $lte: [{ $subtract: ['$stock.quantity', '$stock.reserved'] }, '$stock.minQuantity'] },
                      then: 'low_stock',
                      else: 'in_stock'
                    }
                  }
                }
              }
            }
          },
          {
            $project: {
              itemId: 1,
              nom: 1,
              categorie: 1,
              availableStock: 1,
              stockStatus: 1,
              'price.sellPrice': 1,
              'supplier.name': 1
            }
          }
        ]
      });

      logger.info('✅ Vue stockAvailableView créée');

    } catch (error) {
      if (error.code !== 48) { // View already exists
        logger.error('❌ Erreur création vues:', error.message);
      }
    }
  }

  async analyzeSlowQueries() {
    try {
      // Activer le profiling pour analyser les requêtes lentes
      await this.db.admin().command({ profile: 2, slowms: 100 });
      
      logger.info('✅ Profiling activé pour requêtes > 100ms');

      // Analyser les requêtes récentes
      const profilerCollection = this.db.collection('system.profile');
      const slowQueries = await profilerCollection
        .find({})
        .sort({ ts: -1 })
        .limit(10)
        .toArray();

      if (slowQueries.length > 0) {
        logger.info('🐌 Requêtes lentes détectées:');
        slowQueries.forEach((query, index) => {
          logger.info(`  ${index + 1}. ${query.command?.find || 'N/A'} - ${query.millis}ms`);
        });
      }

    } catch (error) {
      logger.warn('⚠️ Profiling non disponible:', error.message);
    }
  }

  async validateIndexes() {
    logger.info('🔍 Validation des indexes créés...');

    const collections = await this.db.listCollections().toArray();
    
    for (const collection of collections) {
      try {
        const coll = this.db.collection(collection.name);
        const indexes = await coll.indexes();
        
        logger.info(`📋 ${collection.name}: ${indexes.length} indexes`);
        
        // Vérifier l'efficacité des indexes
        for (const index of indexes) {
          if (index.name !== '_id_') {
            const stats = await coll.aggregate([
              { $indexStats: {} },
              { $match: { name: index.name } }
            ]).toArray();

            if (stats[0]?.accesses?.ops === 0) {
              logger.warn(`  ⚠️ Index inutilisé: ${index.name}`);
            }
          }
        }

      } catch (error) {
        logger.error(`❌ Erreur validation ${collection.name}:`, error.message);
      }
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      optimizations: this.optimizations,
      errors: this.errors,
      summary: {
        indexesCreated: this.optimizations.length,
        errorsCount: this.errors.length,
        collections: [...new Set(this.optimizations.map(o => o.collection))]
      }
    };

    logger.info('📋 Rapport d\'optimisation:');
    logger.info(`  ✅ Indexes créés: ${report.summary.indexesCreated}`);
    logger.info(`  ❌ Erreurs: ${report.summary.errorsCount}`);
    logger.info(`  📊 Collections optimisées: ${report.summary.collections.join(', ')}`);

    // Sauvegarder le rapport
    const fs = require('fs');
    const reportPath = `./database-optimization-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    logger.info(`📄 Rapport sauvegardé: ${reportPath}`);

    return report;
  }

  async run() {
    try {
      logger.info('🚀 Début de l\'optimisation de la base de données...');

      await this.connect();
      await this.createIndexes();
      await this.analyzeCollectionStats();
      await this.optimizeQueries();
      await this.validateIndexes();
      
      const report = await this.generateReport();

      if (this.errors.length === 0) {
        logger.info('🎉 Optimisation terminée avec succès !');
      } else {
        logger.warn(`⚠️ Optimisation terminée avec ${this.errors.length} erreurs`);
      }

      return report;

    } catch (error) {
      logger.error('💥 Erreur fatale lors de l\'optimisation:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      logger.info('🔌 Connexion MongoDB fermée');
    }
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  const optimizer = new DatabaseOptimizer();
  
  optimizer.run()
    .then(report => {
      process.exit(report.errors.length === 0 ? 0 : 1);
    })
    .catch(error => {
      logger.error('💥 Erreur script optimisation:', error);
      process.exit(1);
    });
}

module.exports = DatabaseOptimizer;