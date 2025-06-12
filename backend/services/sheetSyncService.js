const createError = require('http-errors');
const axios = require('axios');
const { importSheet } = require('./sheetService.js');

const SHEET_SYNC_URL = process.env.SHEET_SYNC_URL;

async function syncSheet() {
  if (!SHEET_SYNC_URL) {
    throw createError(500, 'SHEET_SYNC_URL n’est pas configurée');
  }

  try {
    const res = await axios.get(SHEET_SYNC_URL, {
      timeout: 10000,
      headers: { Accept: 'application/json' },
    });

    if (!Array.isArray(res.data)) {
      throw new Error('Format de données inattendu, attendu un tableau');
    }

    const sheetData = res.data;
    const entries = await importSheet(sheetData);

    return {
      total: sheetData.length,
      imported: entries.length,
    };
  } catch (err) {
    throw createError(500, 'Erreur lors de la synchronisation des sheets', {
      cause: err,
    });
  }
}

module.exports = { syncSheet };
