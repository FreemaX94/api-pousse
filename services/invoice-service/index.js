const express = require('express');
const eventBus = require('../shared/event-bus');
const invoiceController = require('../../backend/controllers/invoiceController');
const expenseController = require('../../backend/controllers/expenseController');
const authMiddleware = require('../../backend/middlewares/authMiddleware');
const logger = require('../../backend/utils/logger');

class InvoiceService {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupEventHandlers();
    this.pendingPayments = new Map();
    this.reminderQueue = [];
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Routes des factures
    this.app.get('/invoices', authMiddleware(), invoiceController.getInvoices);
    this.app.post('/invoices', authMiddleware(), this.enhancedCreateInvoice.bind(this));
    this.app.put('/invoices/:id', authMiddleware(), this.enhancedUpdateInvoice.bind(this));
    this.app.delete('/invoices/:id', authMiddleware(), this.enhancedDeleteInvoice.bind(this));
    this.app.get('/invoices/:id/pdf', authMiddleware(), this.generateInvoicePdf.bind(this));
    
    // Routes de statut de paiement
    this.app.put('/invoices/:id/status', authMiddleware(), this.enhancedUpdatePaymentStatus.bind(this));
    this.app.post('/invoices/:id/payment', authMiddleware(), this.recordPayment.bind(this));
    this.app.get('/invoices/:id/payment-history', authMiddleware(), this.getPaymentHistory.bind(this));
    
    // Routes des dépenses
    this.app.get('/expenses', authMiddleware(), expenseController.getExpenses);
    this.app.post('/expenses', authMiddleware(), this.enhancedCreateExpense.bind(this));
    this.app.put('/expenses/:id', authMiddleware(), this.enhancedUpdateExpense.bind(this));
    this.app.delete('/expenses/:id', authMiddleware(), this.enhancedDeleteExpense.bind(this));
    
    // Routes de reporting financier
    this.app.get('/reports/revenue', authMiddleware(), this.getRevenueReport.bind(this));
    this.app.get('/reports/expenses', authMiddleware(), this.getExpenseReport.bind(this));
    this.app.get('/reports/profit-loss', authMiddleware(), this.getProfitLossReport.bind(this));
    this.app.get('/reports/cash-flow', authMiddleware(), this.getCashFlowReport.bind(this));
    this.app.get('/reports/aging', authMiddleware(), this.getAgingReport.bind(this));
    
    // Routes d'export comptable
    this.app.get('/export/accounting', authMiddleware('admin'), this.exportAccountingData.bind(this));
    this.app.get('/export/tax', authMiddleware('admin'), this.exportTaxData.bind(this));
    this.app.get('/export/csv', authMiddleware(), this.exportFinancialCsv.bind(this));
    
    // Routes de relances
    this.app.get('/reminders/overdue', authMiddleware(), this.getOverdueInvoices.bind(this));
    this.app.post('/reminders/send', authMiddleware('admin'), this.sendPaymentReminders.bind(this));
    this.app.get('/reminders/history', authMiddleware(), this.getReminderHistory.bind(this));
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        service: 'invoice-service', 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        stats: eventBus.getStats(),
        pendingPayments: this.pendingPayments.size,
        reminderQueue: this.reminderQueue.length
      });
    });
  }

  setupEventHandlers() {
    // Écouter les événements d'autres services
    eventBus.on('stock.entry.created', this.handleStockEntryCreated.bind(this));
    eventBus.on('user.deleted', this.handleUserDeleted.bind(this));
    eventBus.on('project.completed', this.handleProjectCompleted.bind(this));
  }

  /**
   * Création de facture avec événements
   */
  async enhancedCreateInvoice(req, res, next) {
    try {
      const startTime = Date.now();
      
      // Calculer les totaux
      const subtotal = req.body.items.reduce((sum, item) => 
        sum + (item.quantity * item.unitPrice), 0);
      const taxAmount = subtotal * (req.body.taxRate || 0.20);
      const total = subtotal + taxAmount;
      
      // Exécuter la création standard
      await invoiceController.createInvoice(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 201) {
        const processingTime = Date.now() - startTime;
        
        await eventBus.emit('invoice.created', {
          invoiceId: res.locals.newInvoiceId,
          invoiceNumber: req.body.invoiceNumber,
          clientId: req.body.clientId,
          clientName: req.body.clientName,
          items: req.body.items,
          subtotal: subtotal,
          taxAmount: taxAmount,
          total: total,
          dueDate: req.body.dueDate,
          status: req.body.status || 'pending',
          userId: req.user.id,
          username: req.user.username,
          processingTime: processingTime,
          timestamp: new Date().toISOString()
        }, {
          service: 'invoice-service',
          userId: req.user.id
        });

        // Décrémenter le stock pour chaque article
        for (const item of req.body.items) {
          await eventBus.emit('invoice.item.used', {
            catalogueItemId: item.catalogueItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            invoiceId: res.locals.newInvoiceId,
            timestamp: new Date().toISOString()
          }, {
            service: 'invoice-service',
            userId: req.user.id
          });
        }

        // Programmer un rappel automatique si date d'échéance
        if (req.body.dueDate) {
          this.schedulePaymentReminder(res.locals.newInvoiceId, req.body.dueDate);
        }

        logger.info(`💰 Facture créée: ${req.body.invoiceNumber}`, {
          invoiceId: res.locals.newInvoiceId,
          total: total,
          userId: req.user.id,
          processingTime
        });
      }
    } catch (error) {
      await eventBus.emit('invoice.creation.failed', {
        reason: error.message,
        data: req.body,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'invoice-service',
        userId: req.user.id
      });
      
      next(error);
    }
  }

  /**
   * Mise à jour de facture avec événements
   */
  async enhancedUpdateInvoice(req, res, next) {
    try {
      const invoiceId = req.params.id;
      const oldInvoice = await Invoice.findById(invoiceId);
      
      if (!oldInvoice) {
        return res.status(404).json({ error: 'Facture non trouvée' });
      }

      // Calculer les nouveaux totaux
      const newSubtotal = req.body.items.reduce((sum, item) => 
        sum + (item.quantity * item.unitPrice), 0);
      const newTaxAmount = newSubtotal * (req.body.taxRate || 0.20);
      const newTotal = newSubtotal + newTaxAmount;

      // Exécuter la mise à jour standard
      await invoiceController.updateInvoice(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 200) {
        await eventBus.emit('invoice.updated', {
          invoiceId: invoiceId,
          oldData: {
            total: oldInvoice.total,
            status: oldInvoice.status,
            dueDate: oldInvoice.dueDate
          },
          newData: {
            total: newTotal,
            status: req.body.status,
            dueDate: req.body.dueDate
          },
          userId: req.user.id,
          username: req.user.username,
          timestamp: new Date().toISOString()
        }, {
          service: 'invoice-service',
          userId: req.user.id
        });

        logger.info(`💰 Facture mise à jour: ${invoiceId}`, {
          userId: req.user.id
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Suppression de facture avec événements
   */
  async enhancedDeleteInvoice(req, res, next) {
    try {
      const invoiceId = req.params.id;
      const invoice = await Invoice.findById(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ error: 'Facture non trouvée' });
      }

      // Vérifier si la facture peut être supprimée
      if (invoice.status === 'paid') {
        return res.status(400).json({ error: 'Impossible de supprimer une facture payée' });
      }

      // Émettre événement avant suppression
      await eventBus.emit('invoice.delete.initiated', {
        invoiceId: invoiceId,
        invoiceData: {
          invoiceNumber: invoice.invoiceNumber,
          total: invoice.total,
          status: invoice.status,
          clientName: invoice.clientName
        },
        deletedBy: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'invoice-service',
        userId: req.user.id
      });

      // Exécuter la suppression standard
      await invoiceController.deleteInvoice(req, res, next);
      
      // Si succès, émettre événement de confirmation
      if (res.statusCode === 200) {
        await eventBus.emit('invoice.deleted', {
          invoiceId: invoiceId,
          deletedBy: req.user.id,
          deletedAt: new Date().toISOString()
        }, {
          service: 'invoice-service',
          userId: req.user.id
        });

        // Supprimer de la queue de rappels
        this.reminderQueue = this.reminderQueue.filter(r => r.invoiceId !== invoiceId);

        logger.info(`💰 Facture supprimée: ${invoiceId}`, {
          deletedBy: req.user.username
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mise à jour du statut de paiement
   */
  async enhancedUpdatePaymentStatus(req, res, next) {
    try {
      const invoiceId = req.params.id;
      const { status, paymentDate, paymentMethod, paymentReference } = req.body;
      
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ error: 'Facture non trouvée' });
      }

      const oldStatus = invoice.status;
      
      // Mettre à jour le statut
      await Invoice.findByIdAndUpdate(invoiceId, {
        status,
        paymentDate: status === 'paid' ? (paymentDate || new Date()) : null,
        paymentMethod,
        paymentReference
      });

      // Émettre événement de changement de statut
      await eventBus.emit('invoice.status.changed', {
        invoiceId: invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        oldStatus: oldStatus,
        newStatus: status,
        amount: invoice.total,
        paymentDate: paymentDate,
        paymentMethod: paymentMethod,
        paymentReference: paymentReference,
        userId: req.user.id,
        username: req.user.username,
        timestamp: new Date().toISOString()
      }, {
        service: 'invoice-service',
        userId: req.user.id
      });

      // Si payée, émettre événement spécifique
      if (status === 'paid' && oldStatus !== 'paid') {
        await eventBus.emit('invoice.paid', {
          invoiceId: invoiceId,
          amount: invoice.total,
          paymentDate: paymentDate || new Date(),
          paymentMethod: paymentMethod,
          clientId: invoice.clientId,
          timestamp: new Date().toISOString()
        }, {
          service: 'invoice-service',
          userId: req.user.id
        });

        // Supprimer des rappels
        this.reminderQueue = this.reminderQueue.filter(r => r.invoiceId !== invoiceId);
      }

      res.json({ success: true, message: 'Statut mis à jour' });

      logger.info(`💰 Statut facture mis à jour: ${oldStatus} → ${status}`, {
        invoiceId,
        amount: invoice.total,
        userId: req.user.id
      });

    } catch (error) {
      logger.error('❌ Erreur mise à jour statut:', error);
      res.status(500).json({ error: 'Erreur mise à jour statut' });
    }
  }

  /**
   * Enregistrer un paiement
   */
  async recordPayment(req, res) {
    try {
      const invoiceId = req.params.id;
      const { amount, method, reference, date } = req.body;
      
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ error: 'Facture non trouvée' });
      }

      // Créer l'enregistrement de paiement
      const payment = {
        amount: amount,
        method: method,
        reference: reference,
        date: date || new Date(),
        recordedBy: req.user.id,
        recordedAt: new Date()
      };

      // Ajouter le paiement à la facture
      await Invoice.findByIdAndUpdate(invoiceId, {
        $push: { payments: payment },
        $set: { 
          status: amount >= invoice.total ? 'paid' : 'partial',
          lastPaymentDate: payment.date
        }
      });

      await eventBus.emit('payment.recorded', {
        invoiceId: invoiceId,
        payment: payment,
        totalPaid: amount,
        remainingAmount: Math.max(0, invoice.total - amount),
        recordedBy: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'invoice-service',
        userId: req.user.id
      });

      res.json({ success: true, payment });

      logger.info(`💰 Paiement enregistré: ${amount}€`, {
        invoiceId,
        method,
        recordedBy: req.user.username
      });

    } catch (error) {
      logger.error('❌ Erreur enregistrement paiement:', error);
      res.status(500).json({ error: 'Erreur enregistrement paiement' });
    }
  }

  /**
   * Création de dépense avec événements
   */
  async enhancedCreateExpense(req, res, next) {
    try {
      const startTime = Date.now();
      
      // Exécuter la création standard
      await expenseController.createExpense(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 201) {
        const processingTime = Date.now() - startTime;
        
        await eventBus.emit('expense.created', {
          expenseId: res.locals.newExpenseId,
          category: req.body.category,
          amount: req.body.amount,
          description: req.body.description,
          supplier: req.body.supplier,
          date: req.body.date,
          userId: req.user.id,
          username: req.user.username,
          processingTime: processingTime,
          timestamp: new Date().toISOString()
        }, {
          service: 'invoice-service',
          userId: req.user.id
        });

        logger.info(`💸 Dépense créée: ${req.body.amount}€`, {
          expenseId: res.locals.newExpenseId,
          category: req.body.category,
          userId: req.user.id,
          processingTime
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rapport de revenus
   */
  async getRevenueReport(req, res) {
    try {
      const { startDate, endDate, groupBy } = req.query;
      
      const matchStage = {
        status: 'paid',
        paymentDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      let groupStage = {};
      switch (groupBy) {
        case 'day':
          groupStage = {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } },
            revenue: { $sum: "$total" },
            count: { $sum: 1 }
          };
          break;
        case 'month':
          groupStage = {
            _id: { $dateToString: { format: "%Y-%m", date: "$paymentDate" } },
            revenue: { $sum: "$total" },
            count: { $sum: 1 }
          };
          break;
        default:
          groupStage = {
            _id: null,
            revenue: { $sum: "$total" },
            count: { $sum: 1 }
          };
      }

      const report = await Invoice.aggregate([
        { $match: matchStage },
        { $group: groupStage },
        { $sort: { _id: 1 } }
      ]);

      await eventBus.emit('report.generated', {
        reportType: 'revenue',
        period: { startDate, endDate },
        groupBy: groupBy,
        resultCount: report.length,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'invoice-service',
        userId: req.user.id
      });

      res.json({ success: true, report });
    } catch (error) {
      logger.error('❌ Erreur rapport revenus:', error);
      res.status(500).json({ error: 'Erreur génération rapport' });
    }
  }

  /**
   * Rapport profit/perte
   */
  async getProfitLossReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      // Revenus
      const revenue = await Invoice.aggregate([
        {
          $match: {
            status: 'paid',
            paymentDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
          }
        },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]);

      // Dépenses
      const expenses = await Expense.aggregate([
        {
          $match: {
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      const totalRevenue = revenue[0]?.total || 0;
      const totalExpenses = expenses[0]?.total || 0;
      const profit = totalRevenue - totalExpenses;

      const report = {
        period: { startDate, endDate },
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit: profit,
        profitMargin: totalRevenue > 0 ? (profit / totalRevenue * 100) : 0
      };

      await eventBus.emit('report.generated', {
        reportType: 'profit-loss',
        period: { startDate, endDate },
        profit: profit,
        profitMargin: report.profitMargin,
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'invoice-service',
        userId: req.user.id
      });

      res.json({ success: true, report });
    } catch (error) {
      logger.error('❌ Erreur rapport profit/perte:', error);
      res.status(500).json({ error: 'Erreur génération rapport' });
    }
  }

  /**
   * Factures en retard
   */
  async getOverdueInvoices(req, res) {
    try {
      const today = new Date();
      
      const overdueInvoices = await Invoice.find({
        status: { $in: ['pending', 'overdue'] },
        dueDate: { $lt: today }
      }).populate('clientId').sort({ dueDate: 1 });

      // Marquer comme en retard si pas déjà fait
      const updates = overdueInvoices
        .filter(inv => inv.status === 'pending')
        .map(inv => 
          Invoice.findByIdAndUpdate(inv._id, { status: 'overdue' })
        );
      
      await Promise.all(updates);

      await eventBus.emit('overdue.invoices.checked', {
        overdueCount: overdueInvoices.length,
        totalOverdueAmount: overdueInvoices.reduce((sum, inv) => sum + inv.total, 0),
        userId: req.user.id,
        timestamp: new Date().toISOString()
      }, {
        service: 'invoice-service',
        userId: req.user.id
      });

      res.json({ success: true, overdueInvoices });
    } catch (error) {
      logger.error('❌ Erreur factures en retard:', error);
      res.status(500).json({ error: 'Erreur récupération factures en retard' });
    }
  }

  /**
   * Envoyer rappels de paiement
   */
  async sendPaymentReminders(req, res) {
    try {
      const { invoiceIds, reminderType, customMessage } = req.body;
      
      const invoices = await Invoice.find({
        _id: { $in: invoiceIds },
        status: { $in: ['pending', 'overdue'] }
      }).populate('clientId');

      const reminderResults = [];

      for (const invoice of invoices) {
        try {
          // Envoyer le rappel (email, SMS, etc.)
          const reminderSent = await this.sendReminderEmail(invoice, reminderType, customMessage);
          
          if (reminderSent) {
            // Enregistrer le rappel
            await Invoice.findByIdAndUpdate(invoice._id, {
              $push: {
                reminders: {
                  type: reminderType,
                  sentAt: new Date(),
                  sentBy: req.user.id,
                  message: customMessage
                }
              }
            });

            reminderResults.push({
              invoiceId: invoice._id,
              status: 'sent',
              sentAt: new Date()
            });

            await eventBus.emit('payment.reminder.sent', {
              invoiceId: invoice._id,
              invoiceNumber: invoice.invoiceNumber,
              clientEmail: invoice.clientId?.email,
              reminderType: reminderType,
              sentBy: req.user.id,
              timestamp: new Date().toISOString()
            }, {
              service: 'invoice-service',
              userId: req.user.id
            });
          }
        } catch (error) {
          reminderResults.push({
            invoiceId: invoice._id,
            status: 'failed',
            error: error.message
          });
        }
      }

      res.json({ success: true, results: reminderResults });

      logger.info(`📧 Rappels envoyés: ${reminderResults.filter(r => r.status === 'sent').length}/${reminderResults.length}`, {
        sentBy: req.user.username
      });

    } catch (error) {
      logger.error('❌ Erreur envoi rappels:', error);
      res.status(500).json({ error: 'Erreur envoi rappels' });
    }
  }

  /**
   * Envoyer un email de rappel
   */
  async sendReminderEmail(invoice, reminderType, customMessage) {
    // Implémenter l'envoi d'email
    // Retourner true si succès, false sinon
    return true;
  }

  /**
   * Programmer un rappel automatique
   */
  schedulePaymentReminder(invoiceId, dueDate) {
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() + 7); // 7 jours après échéance

    this.reminderQueue.push({
      invoiceId,
      scheduledFor: reminderDate,
      type: 'auto'
    });
  }

  /**
   * Traiter les rappels automatiques
   */
  async processAutomaticReminders() {
    const now = new Date();
    const dueReminders = this.reminderQueue.filter(r => r.scheduledFor <= now);

    for (const reminder of dueReminders) {
      try {
        const invoice = await Invoice.findById(reminder.invoiceId);
        if (invoice && invoice.status === 'overdue') {
          await this.sendReminderEmail(invoice, 'automatic', null);
          
          await eventBus.emit('payment.reminder.auto.sent', {
            invoiceId: reminder.invoiceId,
            scheduledFor: reminder.scheduledFor,
            timestamp: new Date().toISOString()
          }, {
            service: 'invoice-service'
          });
        }
      } catch (error) {
        logger.error('❌ Erreur rappel automatique:', error);
      }
    }

    // Supprimer les rappels traités
    this.reminderQueue = this.reminderQueue.filter(r => r.scheduledFor > now);
  }

  /**
   * Gérer la création d'entrée de stock
   */
  async handleStockEntryCreated(eventData) {
    try {
      logger.info('📦 Mise à jour coûts pour nouvelle entrée stock', eventData);
      
      // Mettre à jour les coûts moyens pour le reporting
      // Implémenter la logique de calcul des coûts
      
    } catch (error) {
      logger.error('❌ Erreur mise à jour coûts:', error);
    }
  }

  /**
   * Gérer la suppression d'utilisateur
   */
  async handleUserDeleted(eventData) {
    try {
      logger.info('👤 Nettoyage factures pour utilisateur supprimé', eventData);
      
      // Anonymiser les factures créées par cet utilisateur
      await Invoice.updateMany(
        { createdBy: eventData.userIdDeleted },
        { $set: { createdBy: null, createdByNote: `Utilisateur supprimé: ${eventData.usernameDeleted}` } }
      );

      await Expense.updateMany(
        { createdBy: eventData.userIdDeleted },
        { $set: { createdBy: null, createdByNote: `Utilisateur supprimé: ${eventData.usernameDeleted}` } }
      );
      
    } catch (error) {
      logger.error('❌ Erreur nettoyage factures utilisateur:', error);
    }
  }

  /**
   * Gérer la completion d'un projet
   */
  async handleProjectCompleted(eventData) {
    try {
      logger.info('🚀 Génération facture automatique pour projet terminé', eventData);
      
      // Implémenter la génération automatique de facture
      // basée sur les éléments du projet
      
    } catch (error) {
      logger.error('❌ Erreur génération facture projet:', error);
    }
  }

  /**
   * Démarrer le service
   */
  async start(port = 3005) {
    try {
      // Initialiser le bus d'événements
      await eventBus.initialize();
      
      // Démarrer le traitement des rappels automatiques
      setInterval(() => this.processAutomaticReminders(), 60000); // Chaque minute
      
      // Démarrer le serveur
      this.server = this.app.listen(port, () => {
        logger.info(`💰 Invoice Service démarré sur le port ${port}`);
      });

      return this.server;
    } catch (error) {
      logger.error('❌ Erreur démarrage Invoice Service:', error);
      throw error;
    }
  }

  /**
   * Arrêter le service
   */
  async stop() {
    try {
      if (this.server) {
        this.server.close();
      }
      await eventBus.close();
      logger.info('💰 Invoice Service arrêté');
    } catch (error) {
      logger.error('❌ Erreur arrêt Invoice Service:', error);
    }
  }
}

module.exports = InvoiceService;