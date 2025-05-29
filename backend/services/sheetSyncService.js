(async () => {
// backend/services/sheetSyncService.js
const createError = require('http-errors');
const axios = require('axios');
const { Sheet } = require('./sheetService.js');

const SHEET_SYNC_URL = process.env.SHEET_SYNC_URL

/**
 * Synchronise les données de feuille de calcul distantes
 * en important/upsertant chaque entrée via importSheet.
 *
 * @returns {Promise<{ total: number, imported: number }>}
 */
exports.syncSheet() {
  if (!SHEET_SYNC_URL) {
    throw createError(500, 'SHEET_SYNC_URL n’est pas configurée')
  }

  try {
    // 1. Récupérer les données au format JSON (tableau d’objets)
    const res = await axios.get(SHEET_SYNC_URL, {
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    })

    if (!Array.isArray(res.data)) {
      throw new Error('Format de données inattendu, attendu un tableau')
    }

    const sheetData = res.data

    // 2. Import/upsert via la fonction importSheet du sheetService
    const entries = await importSheet(sheetData)

    return {
      total: sheetData.length,
      imported: entries.length
    }
  } catch (err) {
    // Enrichit l’erreur et renvoie un 500
    throw createError(500, 'Erreur lors de la synchronisation des sheets', { cause: err })
  }
}
})();