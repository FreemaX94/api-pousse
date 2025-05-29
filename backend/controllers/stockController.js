const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const StockEntry = require('../models/StockEntry');
const CatalogueItem = require('../models/CatalogueItem');

// Récupération des stocks par catégorie
const getStockByCategory = async (req, res, next) => {
  try {
    const categorie = req.query.categorie;
    const entries = await StockEntry.find({ categorie }).populate('product');
    res.status(200).json(entries);
  } catch (err) {
    next(err);
  }
};

// Export en CSV ou PDF
const exportStocks = async (req, res, next) => {
  try {
    const format = req.query.format || 'csv';
    const entries = await StockEntry.find().populate('product');

    if (format === 'csv') {
      const fields = ['categorie', 'product.nom', 'product.categorie', 'product.infos.Quantité totale', 'product.infos.DIMENSIONS'];
      const parser = new Parser({ fields });
      const csv = parser.parse(entries);
      res.header('Content-Type', 'text/csv');
      res.attachment('stocks.csv');
      return res.send(csv);
    }

    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=stocks.pdf');
      doc.pipe(res);

      doc.fontSize(20).text('Liste des Stocks', { align: 'center' });
      doc.moveDown();

      entries.forEach(entry => {
        doc.fontSize(12).text(`Nom: ${entry.product?.nom || '-'}`);
        doc.text(`Catégorie: ${entry.categorie}`);
        doc.text(`Quantité: ${entry.product?.infos?.['Quantité totale'] || '-'}`);
        doc.text(`Dimensions: ${entry.product?.infos?.['DIMENSIONS'] || '-'}`);
        doc.moveDown();
      });

      doc.end();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getStockByCategory, exportStocks };
