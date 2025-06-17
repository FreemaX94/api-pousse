const xlsx = require('xlsx');

/**
 * Lit un fichier Excel de stock et renvoie un tableau d'objets via sheet_to_json.
 * @param {string} filePath - chemin vers le fichier .xlsx
 * @returns {Array<Object>}
 */
function importStockExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet, { raw: false });
}

module.exports = { importStockExcel };
