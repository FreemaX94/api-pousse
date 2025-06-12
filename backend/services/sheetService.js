const createError = require('http-errors');
const SheetEntry = require('../models/SheetEntry.js');
const XLSX = require('xlsx');
const { Parser } = require('json2csv');

async function importSheet(sheetData) {
  if (!Array.isArray(sheetData)) {
    throw createError(400, 'sheetData must be an array');
  }
  const entries = await SheetEntry.insertMany(sheetData, { ordered: false });
  return entries.map(e => e.toObject());
}

async function exportSheet(format = 'csv') {
  const data = await SheetEntry.find().lean();
  if (format === 'xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SheetEntries');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
  if (format === 'csv') {
    const parser = new Parser();
    return parser.parse(data);
  }
  throw createError(400, 'Unsupported format');
}

module.exports = { importSheet, exportSheet };
