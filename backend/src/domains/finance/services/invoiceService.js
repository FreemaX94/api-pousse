const createError = require('http-errors');
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const CatalogueItem = require('../../catalog/models/CatalogueItem');
const User = require('../../auth/models/userModel');
const logger = require('../../../shared/utils/logger');

/**
 * @fileoverview Service pour la gestion des factures
 * @author Generated with Claude Code
 * @version 1.0.0
 */

/**
 * Crée une nouvelle facture
 * @param {Object} invoiceData - Données de la facture
 * @param {string} userId - ID de l'utilisateur créateur
 * @returns {Promise<Object>} - Facture créée
 */
const createInvoice = async (invoiceData, userId = null) => {
  try {
    // Validation des données requises
    if (!invoiceData.client || !invoiceData.employee || !invoiceData.pole || !invoiceData.items || !invoiceData.items.length) {
      throw createError(400, 'Données de facture incomplètes');
    }

    // Vérifier l'existence de l'employé
    const employee = await User.findById(invoiceData.employee);
    if (!employee) {
      throw createError(404, 'Employé non trouvé');
    }

    // Vérifier l'existence des produits du catalogue
    const catalogueItemIds = invoiceData.items.map(item => item.catalogueItem);
    const catalogueItems = await CatalogueItem.find({ _id: { $in: catalogueItemIds } });
    
    if (catalogueItems.length !== catalogueItemIds.length) {
      throw createError(400, 'Un ou plusieurs produits du catalogue n\'existent pas');
    }

    // Créer la facture
    const invoice = new Invoice(invoiceData);
    await invoice.save();

    logger.log(`Facture créée: ${invoice.invoiceNumber} pour ${invoiceData.client.name}`);

    // Retourner la facture populée
    return await Invoice.findById(invoice._id)
      .populate('employee', 'username fullname email')
      .populate('project', 'name description')
      .populate('items.catalogueItem', 'nom categorie prix');

  } catch (error) {
    logger.error(`Erreur lors de la création de la facture: ${error.message}`);
    throw error;
  }
};

/**
 * Récupère une facture par son ID
 * @param {string} id - ID de la facture
 * @returns {Promise<Object>} - Facture trouvée
 */
const getInvoiceById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, 'ID de facture invalide');
    }

    const invoice = await Invoice.findById(id)
      .populate('employee', 'username fullname email')
      .populate('project', 'name description status')
      .populate('items.catalogueItem', 'nom categorie prix infos')
      .populate('metadata.sentBy', 'username fullname');

    if (!invoice) {
      throw createError(404, 'Facture non trouvée');
    }

    return invoice;

  } catch (error) {
    logger.error(`Erreur lors de la récupération de la facture ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Met à jour une facture
 * @param {string} id - ID de la facture
 * @param {Object} updateData - Données de mise à jour
 * @param {string} userId - ID de l'utilisateur effectuant la mise à jour
 * @returns {Promise<Object>} - Facture mise à jour
 */
const updateInvoice = async (id, updateData, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, 'ID de facture invalide');
    }

    // Récupérer la facture existante
    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      throw createError(404, 'Facture non trouvée');
    }

    // Vérifier si la facture peut être modifiée
    if (existingInvoice.status === 'paid') {
      throw createError(400, 'Impossible de modifier une facture payée');
    }

    // Valider les nouvelles références si elles sont fournies
    if (updateData.employee) {
      const employee = await User.findById(updateData.employee);
      if (!employee) {
        throw createError(404, 'Employé non trouvé');
      }
    }

    if (updateData.items && updateData.items.length > 0) {
      const catalogueItemIds = updateData.items.map(item => item.catalogueItem);
      const catalogueItems = await CatalogueItem.find({ _id: { $in: catalogueItemIds } });
      
      if (catalogueItems.length !== catalogueItemIds.length) {
        throw createError(400, 'Un ou plusieurs produits du catalogue n\'existent pas');
      }
    }

    // Mettre à jour la facture
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('employee', 'username fullname email')
      .populate('project', 'name description')
      .populate('items.catalogueItem', 'nom categorie prix');

    logger.log(`Facture mise à jour: ${updatedInvoice.invoiceNumber}`);

    return updatedInvoice;

  } catch (error) {
    logger.error(`Erreur lors de la mise à jour de la facture ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Supprime une facture
 * @param {string} id - ID de la facture
 * @param {string} userId - ID de l'utilisateur effectuant la suppression
 * @returns {Promise<Object>} - Facture supprimée
 */
const deleteInvoice = async (id, userId = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, 'ID de facture invalide');
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      throw createError(404, 'Facture non trouvée');
    }

    // Vérifier si la facture peut être supprimée
    if (invoice.status === 'paid') {
      throw createError(400, 'Impossible de supprimer une facture payée');
    }

    // Supprimer la facture
    await Invoice.findByIdAndDelete(id);

    logger.log(`Facture supprimée: ${invoice.invoiceNumber}`);

    return invoice;

  } catch (error) {
    logger.error(`Erreur lors de la suppression de la facture ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Liste les factures avec filtres et pagination
 * @param {Object} filters - Filtres de recherche
 * @param {Object} pagination - Options de pagination
 * @returns {Promise<Object>} - Liste des factures avec métadonnées
 */
const listInvoices = async (filters = {}, pagination = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'dates.issueDate',
      sortOrder = 'desc'
    } = pagination;

    // Construire la requête de filtrage
    const query = {};
    
    if (filters.status) query.status = filters.status;
    if (filters.pole) query.pole = filters.pole;
    if (filters.employee) query.employee = filters.employee;
    if (filters.client) query['client.name'] = { $regex: filters.client, $options: 'i' };
    
    if (filters.dateFrom || filters.dateTo) {
      query['dates.issueDate'] = {};
      if (filters.dateFrom) query['dates.issueDate'].$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query['dates.issueDate'].$lte = new Date(filters.dateTo);
    }
    
    if (filters.dueDateFrom || filters.dueDateTo) {
      query['dates.dueDate'] = {};
      if (filters.dueDateFrom) query['dates.dueDate'].$gte = new Date(filters.dueDateFrom);
      if (filters.dueDateTo) query['dates.dueDate'].$lte = new Date(filters.dueDateTo);
    }
    
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      query['amounts.totalTTC'] = {};
      if (filters.minAmount !== undefined) query['amounts.totalTTC'].$gte = filters.minAmount;
      if (filters.maxAmount !== undefined) query['amounts.totalTTC'].$lte = filters.maxAmount;
    }
    
    if (filters.overdue) {
      query['dates.dueDate'] = { $lt: new Date() };
      query.status = { $in: ['sent', 'partial', 'overdue'] };
    }
    
    if (filters.search) {
      query.$or = [
        { 'client.name': { $regex: filters.search, $options: 'i' } },
        { invoiceNumber: { $regex: filters.search, $options: 'i' } },
        { 'notes.customer': { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Construire le tri
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    if (sortBy !== 'dates.issueDate') {
      sort['dates.issueDate'] = -1;
    }

    // Calculer la pagination
    const skip = (page - 1) * limit;

    // Exécuter les requêtes en parallèle
    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .populate('employee', 'username fullname email')
        .populate('project', 'name description')
        .populate('items.catalogueItem', 'nom categorie prix')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Invoice.countDocuments(query)
    ]);

    // Calculer les métadonnées de pagination
    const totalPages = Math.ceil(total / limit);

    return {
      data: invoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };

  } catch (error) {
    logger.error(`Erreur lors de la liste des factures: ${error.message}`);
    throw error;
  }
};

/**
 * Compte le nombre de factures selon les filtres
 * @param {Object} filters - Filtres de recherche
 * @returns {Promise<number>} - Nombre de factures
 */
const countInvoices = async (filters = {}) => {
  try {
    const query = {};
    
    if (filters.status) query.status = filters.status;
    if (filters.pole) query.pole = filters.pole;
    if (filters.employee) query.employee = filters.employee;
    if (filters.client) query['client.name'] = { $regex: filters.client, $options: 'i' };
    
    if (filters.dateFrom || filters.dateTo) {
      query['dates.issueDate'] = {};
      if (filters.dateFrom) query['dates.issueDate'].$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query['dates.issueDate'].$lte = new Date(filters.dateTo);
    }

    return await Invoice.countDocuments(query);

  } catch (error) {
    logger.error(`Erreur lors du comptage des factures: ${error.message}`);
    throw error;
  }
};

/**
 * Ajoute un paiement à une facture
 * @param {string} invoiceId - ID de la facture
 * @param {number} amount - Montant du paiement
 * @param {string} method - Méthode de paiement
 * @param {string} reference - Référence du paiement
 * @param {string} note - Note du paiement
 * @returns {Promise<Object>} - Facture mise à jour
 */
const addPayment = async (invoiceId, amount, method, reference = '', note = '') => {
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw createError(400, 'ID de facture invalide');
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw createError(404, 'Facture non trouvée');
    }

    // Vérifier si la facture peut recevoir des paiements
    if (invoice.status === 'cancelled') {
      throw createError(400, 'Impossible d\'ajouter un paiement à une facture annulée');
    }

    // Vérifier que le montant n'excède pas le montant restant
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remaining = invoice.amounts.totalTTC - totalPaid;

    if (amount > remaining) {
      throw createError(400, `Le montant du paiement (${amount}€) excède le montant restant (${remaining}€)`);
    }

    // Ajouter le paiement
    await invoice.addPayment(amount, method, reference, note);

    logger.log(`Paiement de ${amount}€ ajouté à la facture ${invoice.invoiceNumber}`);

    // Retourner la facture mise à jour
    return await Invoice.findById(invoiceId)
      .populate('employee', 'username fullname email')
      .populate('project', 'name description');

  } catch (error) {
    logger.error(`Erreur lors de l'ajout du paiement à la facture ${invoiceId}: ${error.message}`);
    throw error;
  }
};

/**
 * Marque une facture comme envoyée
 * @param {string} invoiceId - ID de la facture
 * @param {string} sentBy - ID de l'utilisateur qui envoie
 * @returns {Promise<Object>} - Facture mise à jour
 */
const markAsSent = async (invoiceId, sentBy) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw createError(400, 'ID de facture invalide');
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw createError(404, 'Facture non trouvée');
    }

    // Vérifier si la facture peut être envoyée
    if (invoice.status !== 'draft') {
      throw createError(400, 'Seules les factures en brouillon peuvent être envoyées');
    }

    // Marquer comme envoyée
    await invoice.markAsSent(sentBy);

    logger.log(`Facture ${invoice.invoiceNumber} marquée comme envoyée`);

    // Retourner la facture mise à jour
    return await Invoice.findById(invoiceId)
      .populate('employee', 'username fullname email')
      .populate('metadata.sentBy', 'username fullname');

  } catch (error) {
    logger.error(`Erreur lors du marquage d'envoi de la facture ${invoiceId}: ${error.message}`);
    throw error;
  }
};

/**
 * Envoie un rappel pour une facture
 * @param {string} invoiceId - ID de la facture
 * @returns {Promise<Object>} - Facture mise à jour
 */
const sendReminder = async (invoiceId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw createError(400, 'ID de facture invalide');
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw createError(404, 'Facture non trouvée');
    }

    // Vérifier si un rappel peut être envoyé
    if (invoice.status === 'paid' || invoice.status === 'cancelled') {
      throw createError(400, 'Impossible d\'envoyer un rappel pour une facture payée ou annulée');
    }

    // Envoyer le rappel
    await invoice.sendReminder();

    logger.log(`Rappel envoyé pour la facture ${invoice.invoiceNumber}`);

    return invoice;

  } catch (error) {
    logger.error(`Erreur lors de l'envoi de rappel pour la facture ${invoiceId}: ${error.message}`);
    throw error;
  }
};

/**
 * Récupère les factures en retard
 * @returns {Promise<Array>} - Liste des factures en retard
 */
const getOverdueInvoices = async () => {
  try {
    const overdueInvoices = await Invoice.findOverdue()
      .populate('employee', 'username fullname email')
      .populate('project', 'name description')
      .sort({ 'dates.dueDate': 1 });

    return overdueInvoices;

  } catch (error) {
    logger.error(`Erreur lors de la récupération des factures en retard: ${error.message}`);
    throw error;
  }
};

/**
 * Récupère les factures par employé
 * @param {string} employeeId - ID de l'employé
 * @param {string} status - Statut des factures (optionnel)
 * @returns {Promise<Array>} - Liste des factures
 */
const getInvoicesByEmployee = async (employeeId, status = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw createError(400, 'ID d\'employé invalide');
    }

    const invoices = await Invoice.findByEmployee(employeeId, status)
      .populate('employee', 'username fullname email')
      .populate('project', 'name description')
      .populate('items.catalogueItem', 'nom categorie prix');

    return invoices;

  } catch (error) {
    logger.error(`Erreur lors de la récupération des factures par employé ${employeeId}: ${error.message}`);
    throw error;
  }
};

/**
 * Calcule le chiffre d'affaires
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 * @param {string} pole - Pôle (optionnel)
 * @returns {Promise<Array>} - Statistiques de chiffre d'affaires
 */
const getRevenue = async (startDate, endDate, pole = null) => {
  try {
    const revenue = await Invoice.getRevenue(startDate, endDate, pole);
    return revenue;

  } catch (error) {
    logger.error(`Erreur lors du calcul du chiffre d'affaires: ${error.message}`);
    throw error;
  }
};

/**
 * Récupère les statistiques d'un client
 * @param {string} clientName - Nom du client
 * @returns {Promise<Array>} - Statistiques du client
 */
const getClientStats = async (clientName) => {
  try {
    const stats = await Invoice.getClientStats(clientName);
    return stats;

  } catch (error) {
    logger.error(`Erreur lors de la récupération des statistiques du client ${clientName}: ${error.message}`);
    throw error;
  }
};

/**
 * Récupère les statistiques globales des factures
 * @param {Object} filters - Filtres de recherche
 * @returns {Promise<Object>} - Statistiques globales
 */
const getInvoiceStats = async (filters = {}) => {
  try {
    const { dateFrom, dateTo, pole, employee, period = 'month' } = filters;

    // Construire la requête de base
    const baseQuery = {};
    
    if (dateFrom || dateTo) {
      baseQuery['dates.issueDate'] = {};
      if (dateFrom) baseQuery['dates.issueDate'].$gte = new Date(dateFrom);
      if (dateTo) baseQuery['dates.issueDate'].$lte = new Date(dateTo);
    }
    
    if (pole) baseQuery.pole = pole;
    if (employee) baseQuery.employee = employee;

    // Statistiques par statut
    const statusStats = await Invoice.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amounts.totalTTC' },
          avgAmount: { $avg: '$amounts.totalTTC' }
        }
      }
    ]);

    // Statistiques par pôle
    const poleStats = await Invoice.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$pole',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amounts.totalTTC' },
          avgAmount: { $avg: '$amounts.totalTTC' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Statistiques par période
    const periodGrouping = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$dates.issueDate' } },
      week: { $dateToString: { format: '%Y-W%U', date: '$dates.issueDate' } },
      month: { $dateToString: { format: '%Y-%m', date: '$dates.issueDate' } },
      quarter: { $dateToString: { format: '%Y-Q%q', date: '$dates.issueDate' } },
      year: { $dateToString: { format: '%Y', date: '$dates.issueDate' } }
    };

    const periodStats = await Invoice.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: periodGrouping[period],
          count: { $sum: 1 },
          totalAmount: { $sum: '$amounts.totalTTC' },
          avgAmount: { $avg: '$amounts.totalTTC' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Statistiques globales
    const globalStats = await Invoice.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: '$amounts.totalTTC' },
          avgAmount: { $avg: '$amounts.totalTTC' },
          paidInvoices: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
          paidAmount: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amounts.totalTTC', 0] } },
          overdueInvoices: { $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] } },
          overdueAmount: { $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, '$amounts.totalTTC', 0] } }
        }
      }
    ]);

    // Top clients
    const topClients = await Invoice.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$client.name',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amounts.totalTTC' },
          avgAmount: { $avg: '$amounts.totalTTC' }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    return {
      period: period,
      global: globalStats[0] || {
        totalInvoices: 0,
        totalAmount: 0,
        avgAmount: 0,
        paidInvoices: 0,
        paidAmount: 0,
        overdueInvoices: 0,
        overdueAmount: 0
      },
      byStatus: statusStats,
      byPole: poleStats,
      byPeriod: periodStats,
      topClients: topClients
    };

  } catch (error) {
    logger.error(`Erreur lors du calcul des statistiques des factures: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  listInvoices,
  countInvoices,
  addPayment,
  markAsSent,
  sendReminder,
  getOverdueInvoices,
  getInvoicesByEmployee,
  getRevenue,
  getClientStats,
  getInvoiceStats
};