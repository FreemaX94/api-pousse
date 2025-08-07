const axios = require('axios');
const Livraison = require('../models/livraisonModel');
const logger = require('../utils/logger');

class GoogleSheetsSync {
  constructor() {
    this.apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    this.fileId = process.env.GOOGLE_SHEETS_FILE_ID || '1qVl2__hq4Fs4KIfQQbccvK7mWizFL0hPvJUHa7UW8zQ';
    this.juneRange = process.env.GOOGLE_SHEETS_JUNE_RANGE || 'JUIN!A2:O';
    this.julyRange = process.env.GOOGLE_SHEETS_JULY_RANGE || 'JUILLET!A2:O';
    this.lastSyncTime = new Date();
    this.lastData = null;
  }

  // Initialiser le service (vérifier la clé API)
  async initialize() {
    try {
      if (!this.apiKey) {
        logger.warn('⚠️ GOOGLE_SHEETS_API_KEY non configurée, utilisation du mode public');
        return true;
      }

      // Test simple de l'API
      const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.fileId}?key=${this.apiKey}`;
      const response = await axios.get(testUrl);
      
      logger.info('✅ Google Sheets API initialisée avec succès');
      logger.info(`📄 Fichier: ${response.data.properties.title}`);
      return true;
    } catch (error) {
      logger.error('❌ Erreur initialisation Google Sheets:', error.message);
      return false;
    }
  }

  // Vérifier si le fichier a été modifié en comparant les données
  async checkFileModification() {
    try {
      const currentData = await this.fetchSheetsData();
      const currentDataString = JSON.stringify(currentData);
      
      if (this.lastData && this.lastData === currentDataString) {
        return false;
      }

      if (this.lastData) {
        logger.info('📄 Modifications détectées dans Google Sheets');
        this.lastSyncTime = new Date();
        return true;
      }

      this.lastData = currentDataString;
      return false;
    } catch (error) {
      logger.error('❌ Erreur vérification modification fichier:', error.message);
      return false;
    }
  }

  // Récupérer les données depuis Google Sheets
  async fetchSheetsData() {
    try {
      const promises = [
        this.fetchSheetRange('JUIN', this.juneRange),
        this.fetchSheetRange('JUILLET', this.julyRange)
      ];

      const [juneData, julyData] = await Promise.all(promises);
      
      logger.info(`📊 Données récupérées: ${juneData.length} lignes (Juin), ${julyData.length} lignes (Juillet)`);
      
      return { juin: juneData, juillet: julyData };
    } catch (error) {
      logger.error('❌ Erreur récupération données Sheets:', error.message);
      throw error;
    }
  }

  // Récupérer une plage spécifique d'une feuille
  async fetchSheetRange(sheetName, range) {
    try {
      let url;
      if (this.apiKey) {
        url = `https://sheets.googleapis.com/v4/spreadsheets/${this.fileId}/values/${range}?key=${this.apiKey}`;
      } else {
        // Mode public (peut ne pas fonctionner si le fichier n'est pas public)
        url = `https://sheets.googleapis.com/v4/spreadsheets/${this.fileId}/values/${range}`;
      }

      const response = await axios.get(url);
      return response.data.values || [];
    } catch (error) {
      logger.error(`❌ Erreur récupération feuille ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Traiter les données récupérées depuis Google Sheets
  async processGoogleSheetsData(data) {
    try {
      let allDeliveries = [];

      // Traiter les données de Juin
      if (data.juin && data.juin.length > 0) {
        const juneDeliveries = this.processMonthData(data.juin, 'juin');
        allDeliveries = allDeliveries.concat(juneDeliveries);
      }

      // Traiter les données de Juillet
      if (data.juillet && data.juillet.length > 0) {
        const julyDeliveries = this.processMonthData(data.juillet, 'juillet');
        allDeliveries = allDeliveries.concat(julyDeliveries);
      }

      logger.info(`📊 ${allDeliveries.length} livraisons extraites des données Google Sheets`);
      return allDeliveries;
    } catch (error) {
      logger.error('❌ Erreur traitement données Google Sheets:', error.message);
      throw error;
    }
  }

  // Traiter les données d'un mois
  processMonthData(jsonData, monthName) {
    const deliveries = [];
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      
      if (row.length === 0 || row.every(cell => cell === '' || cell === null || cell === undefined)) {
        continue;
      }

      if (row.length === 1 && typeof row[0] === 'number') {
        continue;
      }

      let delivery = {};
      
      if (monthName === 'juillet') {
        delivery = {
          date: this.parseDate(row[0]) || this.getMonthDate(monthName, i),
          mois: monthName,
          codeActivite: String(row[1] || ''), // Correction: décalage d'une colonne
          horaire: String(row[2] || ''),
          demandeur: String(row[3] || ''),
          nbColis: parseInt(row[4]) || 0,
          referenceDevis: String(row[5] || ''),
          client: String(row[6] || ''),
          entreprise: String(row[7] || ''),
          adresse: String(row[8] || ''),
          accesLivraison: String(row[9] || ''),
          infos: String(row[10] || ''),
          telephone: String(row[11] || ''),
          clientPrevenu: String(row[12] || ''),
          prix: parseFloat(row[13]) || 0,
          fait: this.parseBool(row[14])
        };
      } else if (monthName === 'juin') {
        delivery = {
          date: this.parseDate(row[0]) || this.getMonthDate(monthName, i),
          mois: monthName,
          codeActivite: String(row[1] || ''), // Correction: décalage d'une colonne
          horaire: String(row[2] || ''),
          demandeur: String(row[3] || ''),
          nbColis: parseInt(row[4]) || 0,
          referenceDevis: String(row[5] || ''),
          client: String(row[6] || ''),
          entreprise: String(row[7] || ''),
          adresse: String(row[8] || ''),
          accesLivraison: String(row[10] || ''), // Correction d'index
          infos: String(row[11] || ''),
          telephone: String(row[12] || ''),
          clientPrevenu: String(row[13] || ''),
          prix: parseFloat(row[14]) || 0,
          fait: this.parseBool(row[15])
        };
      }

      if (!delivery.client && !delivery.entreprise && !delivery.adresse && !delivery.infos && delivery.prix === 0) {
        continue;
      }

      delivery.source = 'google-sheets-sync';
      delivery.syncedAt = new Date();
      
      deliveries.push(delivery);
    }
    
    return deliveries;
  }

  // Synchroniser avec la base de données
  async syncToDatabase(deliveries) {
    try {
      // Supprimer les anciennes données synchronisées
      const deleteResult = await Livraison.deleteMany({ source: 'google-sheets-sync' });
      logger.info(`🗑️ ${deleteResult.deletedCount} anciennes livraisons supprimées`);

      // Insérer les nouvelles données
      if (deliveries.length > 0) {
        const insertResult = await Livraison.insertMany(deliveries);
        logger.info(`✅ ${insertResult.length} nouvelles livraisons synchronisées`);
        
        return insertResult;
      }

      return [];
    } catch (error) {
      logger.error('❌ Erreur synchronisation base de données:', error.message);
      throw error;
    }
  }

  // Effectuer une synchronisation complète
  async performSync() {
    try {
      logger.info('🔄 Début de la synchronisation Google Sheets...');

      // Récupérer les données depuis Google Sheets
      const sheetsData = await this.fetchSheetsData();

      // Traiter les données
      const deliveries = await this.processGoogleSheetsData(sheetsData);

      // Synchroniser avec la base de données
      const result = await this.syncToDatabase(deliveries);

      // Mettre à jour les données de référence
      this.lastData = JSON.stringify(sheetsData);
      this.lastSyncTime = new Date();

      logger.info('✅ Synchronisation terminée avec succès');
      return { 
        success: true, 
        message: `${result.length} livraisons synchronisées`,
        count: result.length 
      };

    } catch (error) {
      logger.error('❌ Erreur lors de la synchronisation:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Configurer une synchronisation périodique
  startPeriodicSync(intervalMinutes = 15) {
    logger.info(`⏰ Synchronisation périodique activée (toutes les ${intervalMinutes} minutes)`);
    
    setInterval(async () => {
      await this.performSync();
    }, intervalMinutes * 60 * 1000);
  }

  // Utilitaires (réutilisés du script existant)
  parseDate(dateValue) {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    
    if (typeof dateValue === 'number') {
      const excelEpoch = new Date(1899, 11, 30);
      return new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
    }
    
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      return isNaN(parsed) ? null : parsed;
    }
    
    return null;
  }

  getMonthDate(monthName, index) {
    const year = 2025;
    const monthMap = {
      'janvier': 0, 'fevrier': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
      'juillet': 6, 'aout': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'decembre': 11
    };
    
    const month = monthMap[monthName] || 0;
    const day = Math.min(index, 28);
    
    return new Date(year, month, day);
  }

  parseBool(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      return lower === 'true' || lower === 'oui' || lower === 'yes' || lower === '1' || lower === 'x';
    }
    if (typeof value === 'number') return value === 1;
    return false;
  }
}

module.exports = GoogleSheetsSync;