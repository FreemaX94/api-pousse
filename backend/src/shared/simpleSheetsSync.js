const axios = require('axios');
const Livraison = require('../domains/inventory/models/livraisonModel');
const logger = require('./utils/logger');

class SimpleSheetsSync {
  constructor() {
    // Utiliser l'export CSV public de Google Sheets
    this.baseUrl = 'https://docs.google.com/spreadsheets/d/1qVl2__hq4Fs4KIfQQbccvK7mWizFL0hPvJUHa7UW8zQ';
    this.juneUrl = `${this.baseUrl}/gviz/tq?tqx=out:csv&sheet=JUIN`;
    this.julyUrl = `${this.baseUrl}/gviz/tq?tqx=out:csv&sheet=JUILLET`;
    this.lastSyncTime = new Date();
    this.lastDataHash = null;
  }

  // Initialiser le service
  async initialize() {
    logger.info('✅ Service de synchronisation CSV Google Sheets initialisé');
    return true;
  }

  // Récupérer les données CSV depuis Google Sheets
  async fetchSheetCSV(url, sheetName) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const csvData = response.data;
      const lines = csvData.split('\n').filter(line => line.trim());
      
      // Convertir CSV en tableau 2D
      const data = lines.map(line => {
        // Parser CSV simple (attention aux virgules dans les données)
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"' && (i === 0 || line[i-1] === ',')) {
            inQuotes = true;
          } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
            inQuotes = false;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        
        return values;
      });
      
      // Supprimer la ligne d'en-tête
      return data.slice(1);
    } catch (error) {
      logger.error(`❌ Erreur récupération CSV ${sheetName}:`, error.message);
      throw error;
    }
  }

  // Récupérer toutes les données
  async fetchAllData() {
    try {
      const [juneData, julyData] = await Promise.all([
        this.fetchSheetCSV(this.juneUrl, 'JUIN'),
        this.fetchSheetCSV(this.julyUrl, 'JUILLET')
      ]);
      
      logger.info(`📊 Données CSV récupérées: ${juneData.length} lignes (Juin), ${julyData.length} lignes (Juillet)`);
      
      return { juin: juneData, juillet: julyData };
    } catch (error) {
      logger.error('❌ Erreur récupération données CSV:', error.message);
      throw error;
    }
  }

  // Vérifier s'il y a des modifications
  async checkForChanges() {
    try {
      const data = await this.fetchAllData();
      const currentHash = this.generateDataHash(data);
      
      if (this.lastDataHash && this.lastDataHash === currentHash) {
        return false;
      }
      
      if (this.lastDataHash) {
        logger.info('📄 Modifications détectées dans Google Sheets');
        return true;
      }
      
      this.lastDataHash = currentHash;
      return false;
    } catch (error) {
      logger.error('❌ Erreur vérification modifications:', error.message);
      return false;
    }
  }

  // Générer un hash des données pour détecter les changements
  generateDataHash(data) {
    const content = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // Traiter les données CSV en livraisons
  processData(data) {
    const allDeliveries = [];
    
    // Traiter Juin
    if (data.juin) {
      const juneDeliveries = this.processMonthData(data.juin, 'juin');
      allDeliveries.push(...juneDeliveries);
    }
    
    // Traiter Juillet
    if (data.juillet) {
      const julyDeliveries = this.processMonthData(data.juillet, 'juillet');
      allDeliveries.push(...julyDeliveries);
    }
    
    logger.info(`📦 ${allDeliveries.length} livraisons traitées depuis CSV`);
    return allDeliveries;
  }

  // Traiter les données d'un mois
  processMonthData(rows, monthName) {
    const deliveries = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      // Ignorer les lignes vides
      if (!row || row.length === 0 || row.every(cell => !cell || cell.trim() === '')) {
        continue;
      }
      
      try {
        let delivery = {};
        
        if (monthName === 'juillet') {
          delivery = {
            date: this.parseDate(row[0]) || this.getMonthDate(monthName, i + 1),
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
            date: this.parseDate(row[0]) || this.getMonthDate(monthName, i + 1),
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
        
        // Ignorer les lignes sans données importantes
        if (!delivery.client && !delivery.entreprise && !delivery.adresse && !delivery.infos && delivery.prix === 0) {
          continue;
        }
        
        delivery.source = 'google-sheets-csv';
        delivery.syncedAt = new Date();
        
        deliveries.push(delivery);
      } catch (error) {
        logger.warn(`⚠️ Erreur traitement ligne ${i + 1} (${monthName}):`, error.message);
      }
    }
    
    return deliveries;
  }

  // Synchroniser avec la base de données
  async syncToDatabase(deliveries) {
    try {
      // Supprimer les anciennes données CSV
      const deleteResult = await Livraison.deleteMany({ source: 'google-sheets-csv' });
      logger.info(`🗑️ ${deleteResult.deletedCount} anciennes livraisons CSV supprimées`);

      // Insérer les nouvelles données
      if (deliveries.length > 0) {
        const insertResult = await Livraison.insertMany(deliveries);
        logger.info(`✅ ${insertResult.length} nouvelles livraisons CSV synchronisées`);
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
      logger.info('🔄 Début de la synchronisation CSV Google Sheets...');

      // Récupérer les données
      const data = await this.fetchAllData();

      // Traiter les données
      const deliveries = this.processData(data);

      // Synchroniser avec la base de données
      const result = await this.syncToDatabase(deliveries);

      // Mettre à jour le hash des données
      this.lastDataHash = this.generateDataHash(data);
      this.lastSyncTime = new Date();

      logger.info('✅ Synchronisation CSV terminée avec succès');
      return { 
        success: true, 
        message: `${result.length} livraisons synchronisées depuis CSV`,
        count: result.length 
      };

    } catch (error) {
      logger.error('❌ Erreur lors de la synchronisation CSV:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Démarrer la synchronisation périodique
  startPeriodicSync(intervalMinutes = 15) {
    logger.info(`⏰ Synchronisation CSV périodique activée (toutes les ${intervalMinutes} minutes)`);
    
    setInterval(async () => {
      try {
        const hasChanges = await this.checkForChanges();
        if (hasChanges) {
          await this.performSync();
        }
      } catch (error) {
        logger.error('❌ Erreur synchronisation périodique:', error.message);
      }
    }, intervalMinutes * 60 * 1000);
  }

  // Utilitaires
  parseDate(dateValue) {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    
    // Essayer différents formats de date
    const formats = [
      dateValue,
      dateValue.replace(/\//g, '-'),
      dateValue.replace(/\./g, '-')
    ];
    
    for (const format of formats) {
      const parsed = new Date(format);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    
    return null;
  }

  getMonthDate(monthName, day) {
    const year = 2025;
    const monthMap = {
      'janvier': 0, 'fevrier': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
      'juillet': 6, 'aout': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'decembre': 11
    };
    
    const month = monthMap[monthName] || 0;
    return new Date(year, month, Math.min(day, 28));
  }

  parseBool(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      return lower === 'true' || lower === 'oui' || lower === 'yes' || lower === '1' || lower === 'x' || lower === 'vrai';
    }
    if (typeof value === 'number') return value === 1;
    return false;
  }
}

module.exports = SimpleSheetsSync;