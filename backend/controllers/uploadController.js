const multer = require('multer');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const Livraison = require('../models/livraisonModel');
const logger = require('../utils/logger');

// Configuration Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/excel');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const filename = `liva-${timestamp}-${file.originalname}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Utilisez Excel (.xlsx, .xls) ou CSV'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Upload et traitement du fichier Excel
const uploadExcelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier fourni' 
      });
    }

    const filePath = req.file.path;
    const filename = req.file.filename;
    
    logger.info(`📄 Fichier Excel reçu: ${filename}`);

    // Lire le fichier Excel avec ExcelJS
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const sheetNames = workbook.worksheets.map(ws => ws.name);
    logger.info(`📊 Feuilles trouvées: ${sheetNames.join(', ')}`);

    // Rechercher les feuilles JUIN et JUILLET
    const juneSheet = workbook.worksheets.find(ws => 
      ws.name.toLowerCase().includes('juin') || ws.name.toLowerCase().includes('june')
    );
    const julySheet = workbook.worksheets.find(ws => 
      ws.name.toLowerCase().includes('juillet') || ws.name.toLowerCase().includes('july')
    );

    if (!juneSheet && !julySheet) {
      return res.status(400).json({
        success: false,
        message: 'Aucune feuille JUIN ou JUILLET trouvée dans le fichier'
      });
    }

    const data = {};
    
    // Traiter la feuille Juin
    if (juneSheet) {
      data.juin = [];
      juneSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) { // Ignorer l'en-tête
          data.juin.push(row.values.slice(1)); // ExcelJS indexe à partir de 1
        }
      });
      logger.info(`📋 Juin: ${data.juin.length} lignes extraites`);
    }

    // Traiter la feuille Juillet
    if (julySheet) {
      data.juillet = [];
      julySheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) { // Ignorer l'en-tête
          data.juillet.push(row.values.slice(1)); // ExcelJS indexe à partir de 1
        }
      });
      logger.info(`📋 Juillet: ${data.juillet.length} lignes extraites`);
    }

    // Stocker les données pour synchronisation ultérieure
    req.app.locals.excelData = data;
    req.app.locals.excelFilename = filename;

    // Nettoyer le fichier temporaire
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Fichier Excel traité avec succès',
      filename: filename,
      sheetsFound: { 
        juneSheet: juneSheet ? juneSheet.name : null, 
        julySheet: julySheet ? julySheet.name : null 
      },
      data: {
        juin: data.juin?.length || 0,
        juillet: data.juillet?.length || 0
      }
    });

  } catch (error) {
    logger.error('❌ Erreur traitement fichier Excel:', error);
    
    // Nettoyer le fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors du traitement du fichier',
      error: error.message
    });
  }
};

// Synchroniser les données Excel avec la base
const syncExcelData = async (req, res) => {
  try {
    const excelData = req.app.locals.excelData;
    
    if (!excelData) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée Excel à synchroniser. Uploadez d\'abord un fichier.'
      });
    }

    logger.info('🔄 Début de la synchronisation Excel...');

    // Traiter les données
    const deliveries = processExcelData(excelData);
    
    if (deliveries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune livraison valide trouvée dans le fichier'
      });
    }

    // Supprimer les anciennes données synchronisées depuis Excel
    const deleteResult = await Livraison.deleteMany({ source: 'excel-upload' });
    logger.info(`🗑️ ${deleteResult.deletedCount} anciennes livraisons Excel supprimées`);

    // Insérer les nouvelles données
    const insertResult = await Livraison.insertMany(deliveries);
    logger.info(`✅ ${insertResult.length} nouvelles livraisons Excel synchronisées`);

    // Nettoyer les données temporaires
    delete req.app.locals.excelData;
    delete req.app.locals.excelFilename;

    res.json({
      success: true,
      message: `${insertResult.length} livraisons synchronisées depuis Excel`,
      count: insertResult.length,
      deleted: deleteResult.deletedCount
    });

  } catch (error) {
    logger.error('❌ Erreur synchronisation Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la synchronisation',
      error: error.message
    });
  }
};

// Traiter les données Excel en livraisons
function processExcelData(data) {
  const allDeliveries = [];
  
  // Traiter Juin
  if (data.juin) {
    const juneDeliveries = processMonthData(data.juin, 'juin');
    allDeliveries.push(...juneDeliveries);
  }
  
  // Traiter Juillet
  if (data.juillet) {
    const julyDeliveries = processMonthData(data.juillet, 'juillet');
    allDeliveries.push(...julyDeliveries);
  }
  
  logger.info(`📦 ${allDeliveries.length} livraisons traitées depuis Excel`);
  return allDeliveries;
}

// Traiter les données d'un mois
function processMonthData(rows, monthName) {
  const deliveries = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Ignorer les lignes vides
    if (!row || row.length === 0 || row.every(cell => !cell || cell.toString().trim() === '')) {
      continue;
    }
    
    try {
      let delivery = {};
      
      if (monthName === 'juillet') {
        delivery = {
          date: parseDate(row[0]) || getMonthDate(monthName, i + 1),
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
          fait: parseBool(row[14])
        };
      } else if (monthName === 'juin') {
        delivery = {
          date: parseDate(row[0]) || getMonthDate(monthName, i + 1),
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
          fait: parseBool(row[15])
        };
      }
      
      // Ignorer les lignes sans données importantes
      if (!delivery.client && !delivery.entreprise && !delivery.adresse && !delivery.infos && delivery.prix === 0) {
        continue;
      }
      
      delivery.source = 'excel-upload';
      delivery.syncedAt = new Date();
      
      deliveries.push(delivery);
    } catch (error) {
      logger.warn(`⚠️ Erreur traitement ligne ${i + 1} (${monthName}):`, error.message);
    }
  }
  
  return deliveries;
}

// Utilitaires
function parseDate(dateValue) {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  
  // Si c'est un nombre Excel (nombre de jours depuis 1900)
  if (typeof dateValue === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
  }
  
  // Essayer de parser comme string
  if (typeof dateValue === 'string') {
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
  }
  
  return null;
}

function getMonthDate(monthName, day) {
  const year = 2025;
  const monthMap = {
    'janvier': 0, 'fevrier': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
    'juillet': 6, 'aout': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'decembre': 11
  };
  
  const month = monthMap[monthName] || 0;
  return new Date(year, month, Math.min(day, 28));
}

function parseBool(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'oui' || lower === 'yes' || lower === '1' || lower === 'x' || lower === 'vrai';
  }
  if (typeof value === 'number') return value === 1;
  return false;
}

module.exports = {
  uploadMiddleware: upload.single('file'),
  uploadExcelFile,
  syncExcelData
};