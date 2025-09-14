const Notification = require('../models/Notification');
const Projet = require('../models/Projet');
const webpush = require('web-push');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

class NotificationService {
  constructor() {
    this.emailTransporter = null;
    this.webPushConfig = {
      vapidKeys: {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY
      },
      contact: process.env.NOTIFICATION_CONTACT || 'mailto:admin@apipousse.com'
    };

    this.initializeServices();
    this.startScheduler();
  }

  initializeServices() {
    // Configuration Web Push
    if (this.webPushConfig.vapidKeys.publicKey && this.webPushConfig.vapidKeys.privateKey) {
      webpush.setVapidDetails(
        this.webPushConfig.contact,
        this.webPushConfig.vapidKeys.publicKey,
        this.webPushConfig.vapidKeys.privateKey
      );
    }

    // Configuration Email
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
  }

  startScheduler() {
    // Vérifier les notifications en attente toutes les minutes
    cron.schedule('* * * * *', async () => {
      await this.processPendingNotifications();
    });

    // Générer les notifications d'échéance tous les jours à 8h
    cron.schedule('0 8 * * *', async () => {
      await this.generateDeadlineNotifications();
    });

    // Nettoyer les anciennes notifications tous les dimanche à 2h
    cron.schedule('0 2 * * 0', async () => {
      await this.cleanupOldNotifications();
    });

    // Vérifier les rappels de maintenance tous les lundi à 9h
    cron.schedule('0 9 * * 1', async () => {
      await this.generateMaintenanceReminders();
    });

    console.log('📅 Planificateur de notifications démarré');
  }

  /**
   * Traiter les notifications en attente
   */
  async processPendingNotifications() {
    try {
      const pendingNotifications = await Notification.getPendingNotifications(50);

      for (const notification of pendingNotifications) {
        await this.sendNotification(notification);
      }

      if (pendingNotifications.length > 0) {
        console.log(`📨 ${pendingNotifications.length} notifications traitées`);
      }
    } catch (error) {
      console.error('Erreur lors du traitement des notifications:', error);
    }
  }

  /**
   * Envoyer une notification via tous les canaux configurés
   */
  async sendNotification(notification) {
    try {
      const user = notification.recipient;
      if (!user) return;

      const results = [];

      // Push notification
      if (notification.channels.push && user.pushSubscription) {
        try {
          await this.sendPushNotification(notification, user.pushSubscription);
          results.push({ channel: 'push', status: 'success' });
        } catch (error) {
          results.push({ channel: 'push', status: 'failed', error: error.message });
        }
      }

      // Email
      if (notification.channels.email && user.email) {
        try {
          await this.sendEmailNotification(notification, user.email);
          results.push({ channel: 'email', status: 'success' });
        } catch (error) {
          results.push({ channel: 'email', status: 'failed', error: error.message });
        }
      }

      // SMS (si configuré)
      if (notification.channels.sms && user.phone) {
        try {
          await this.sendSMSNotification(notification, user.phone);
          results.push({ channel: 'sms', status: 'success' });
        } catch (error) {
          results.push({ channel: 'sms', status: 'failed', error: error.message });
        }
      }

      // Mettre à jour le statut de la notification
      for (const result of results) {
        await notification.addDeliveryAttempt(
          result.channel,
          result.status,
          result.error
        );
      }

      // Si au moins un canal a réussi, marquer comme envoyée
      if (results.some(r => r.status === 'success')) {
        notification.status = 'sent';
        notification.sentAt = new Date();
        await notification.save();
      }

      return results;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
      throw error;
    }
  }

  /**
   * Envoyer une push notification
   */
  async sendPushNotification(notification, subscription) {
    if (!webpush) {
      throw new Error('Web Push non configuré');
    }

    const payload = JSON.stringify({
      title: notification.title,
      message: notification.message,
      icon: '/icons/notification-icon.png',
      badge: '/icons/badge-icon.png',
      data: {
        notificationId: notification._id,
        type: notification.type,
        actions: notification.actions,
        url: notification.actions[0]?.url || '/dashboard'
      },
      actions: notification.actions.slice(0, 2).map(action => ({
        action: action.action,
        title: action.label,
        icon: this.getActionIcon(action.action)
      }))
    });

    const options = {
      TTL: 24 * 60 * 60, // 24 heures
      urgency: this.getPushUrgency(notification.priority),
      topic: notification.type
    };

    return webpush.sendNotification(subscription, payload, options);
  }

  /**
   * Envoyer une notification par email
   */
  async sendEmailNotification(notification, email) {
    if (!this.emailTransporter) {
      throw new Error('Email non configuré');
    }

    const template = this.generateEmailTemplate(notification);

    const mailOptions = {
      from: `"API Pousse" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: `[API Pousse] ${notification.title}`,
      html: template.html,
      text: template.text
    };

    return this.emailTransporter.sendMail(mailOptions);
  }

  /**
   * Envoyer une notification SMS (Twilio ou autre service)
   */
  async sendSMSNotification(notification, phone) {
    // Implémentation SMS avec Twilio ou autre service
    // Pour l'exemple, on simule l'envoi
    console.log(`📱 SMS à ${phone}: ${notification.title} - ${notification.message}`);

    // Si vous utilisez Twilio:
    /*
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

    return client.messages.create({
      body: `${notification.title}\n\n${notification.message}`,
      from: process.env.TWILIO_PHONE,
      to: phone
    });
    */

    return Promise.resolve({ status: 'simulated' });
  }

  /**
   * Générer les notifications d'échéance automatiques
   */
  async generateDeadlineNotifications() {
    try {
      const today = new Date();
      const in3Days = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
      const in7Days = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));

      // Projets se terminant dans 1, 3 ou 7 jours
      const upcomingProjects = await Projet.find({
        'dates.end': {
          $gte: today,
          $lte: in7Days
        },
        status: { $in: ['active', 'planned'] }
      }).populate('team.projectManager');

      for (const project of upcomingProjects) {
        const daysUntilEnd = Math.ceil((project.dates.end - today) / (1000 * 60 * 60 * 24));

        // Vérifier si une notification n'existe pas déjà
        const existingNotification = await Notification.findOne({
          'context.projectId': project._id,
          type: 'project_deadline',
          status: { $in: ['pending', 'sent'] },
          createdAt: {
            $gte: new Date(today.getTime() - (24 * 60 * 60 * 1000)) // Dernières 24h
          }
        });

        if (!existingNotification && project.team?.projectManager) {
          const notification = Notification.createProjectDeadlineNotification(project, daysUntilEnd);
          await notification.save();
          console.log(`📅 Notification d'échéance créée pour le projet ${project.title}`);
        }
      }

      // Tâches en retard
      const projectsWithTasks = await Projet.find({
        status: { $in: ['active', 'planned'] },
        'tasks.dueDate': { $lt: today },
        'tasks.status': { $ne: 'completed' }
      }).populate('team.projectManager');

      for (const project of projectsWithTasks) {
        const overdueTasks = project.tasks.filter(task =>
          task.dueDate < today && task.status !== 'completed'
        );

        for (const task of overdueTasks) {
          const existingNotification = await Notification.findOne({
            'context.taskId': task._id,
            type: 'task_overdue',
            status: { $in: ['pending', 'sent'] },
            createdAt: {
              $gte: new Date(today.getTime() - (24 * 60 * 60 * 1000))
            }
          });

          if (!existingNotification) {
            const notification = Notification.createTaskOverdueNotification(project, task);
            await notification.save();
            console.log(`⏰ Notification de retard créée pour la tâche ${task.title}`);
          }
        }
      }

      // Jalons à venir
      const projectsWithMilestones = await Projet.find({
        status: { $in: ['active', 'planned'] },
        'milestones.dueDate': {
          $gte: today,
          $lte: in3Days
        }
      }).populate('team.projectManager');

      for (const project of projectsWithMilestones) {
        const upcomingMilestones = project.milestones.filter(milestone =>
          milestone.dueDate >= today && milestone.dueDate <= in3Days && milestone.status !== 'completed'
        );

        for (const milestone of upcomingMilestones) {
          const daysUntil = Math.ceil((milestone.dueDate - today) / (1000 * 60 * 60 * 24));

          const existingNotification = await Notification.findOne({
            'context.milestoneId': milestone._id,
            type: 'milestone_approaching',
            status: { $in: ['pending', 'sent'] },
            createdAt: {
              $gte: new Date(today.getTime() - (24 * 60 * 60 * 1000))
            }
          });

          if (!existingNotification && project.team?.projectManager) {
            const notification = Notification.createMilestoneNotification(project, milestone, daysUntil);
            await notification.save();
            console.log(`🎯 Notification de jalon créée pour ${milestone.title}`);
          }
        }
      }

    } catch (error) {
      console.error('Erreur lors de la génération des notifications d\'échéance:', error);
    }
  }

  /**
   * Générer les rappels de maintenance
   */
  async generateMaintenanceReminders() {
    try {
      const today = new Date();
      const in7Days = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));

      // Projets récurrents nécessitant une maintenance
      const maintenanceProjects = await Projet.find({
        'recurring.isRecurring': true,
        'recurring.nextDueDate': {
          $gte: today,
          $lte: in7Days
        },
        status: { $ne: 'archived' }
      }).populate('team.projectManager');

      for (const project of maintenanceProjects) {
        if (project.team?.projectManager) {
          const notification = Notification.createMaintenanceReminder(project, project.recurring.nextDueDate);
          await notification.save();
          console.log(`🔧 Rappel de maintenance créé pour ${project.title}`);
        }
      }

    } catch (error) {
      console.error('Erreur lors de la génération des rappels de maintenance:', error);
    }
  }

  /**
   * Créer une notification personnalisée
   */
  async createCustomNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();

      // Envoyer immédiatement si programmée pour maintenant
      if (!notification.scheduledFor || notification.scheduledFor <= new Date()) {
        await this.sendNotification(notification);
      }

      return notification;
    } catch (error) {
      console.error('Erreur lors de la création de notification personnalisée:', error);
      throw error;
    }
  }

  /**
   * Créer une notification de commentaire
   */
  async createCommentNotification(project, comment, mentions = []) {
    try {
      const notifications = [];

      // Notifier le chef de projet si ce n'est pas lui qui a commenté
      if (project.team?.projectManager &&
          project.team.projectManager.toString() !== comment.author.toString()) {
        notifications.push(new Notification({
          recipient: project.team.projectManager,
          type: 'new_comment',
          priority: 'medium',
          title: `Nouveau commentaire sur ${project.title}`,
          message: `${comment.author.username} a ajouté un commentaire: "${comment.content.substring(0, 100)}${comment.content.length > 100 ? '...' : ''}"`,
          context: {
            projectId: project._id,
            commentId: comment._id,
            entityType: 'comment',
            entityId: comment._id
          },
          actions: [
            {
              label: 'Voir le commentaire',
              action: 'view',
              url: `/projects/${project._id}/comments/${comment._id}`
            }
          ]
        }));
      }

      // Notifier les personnes mentionnées
      for (const userId of mentions) {
        if (userId !== comment.author.toString()) {
          notifications.push(new Notification({
            recipient: userId,
            type: 'new_comment',
            priority: 'high',
            title: `Vous êtes mentionné dans un commentaire`,
            message: `${comment.author.username} vous a mentionné dans le projet "${project.title}": "${comment.content.substring(0, 100)}${comment.content.length > 100 ? '...' : ''}"`,
            context: {
              projectId: project._id,
              commentId: comment._id,
              entityType: 'comment',
              entityId: comment._id
            },
            actions: [
              {
                label: 'Voir le commentaire',
                action: 'view',
                url: `/projects/${project._id}/comments/${comment._id}`
              }
            ]
          }));
        }
      }

      // Sauvegarder toutes les notifications
      for (const notification of notifications) {
        await notification.save();
        await this.sendNotification(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Erreur lors de la création des notifications de commentaire:', error);
      throw error;
    }
  }

  /**
   * Nettoyer les anciennes notifications
   */
  async cleanupOldNotifications(days = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        status: { $in: ['read', 'dismissed', 'failed'] }
      });

      console.log(`🧹 ${result.deletedCount} anciennes notifications supprimées`);
      return result.deletedCount;
    } catch (error) {
      console.error('Erreur lors du nettoyage des notifications:', error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques de notifications
   */
  async getNotificationStats(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const stats = await Notification.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            sent: {
              $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] }
            },
            failed: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            },
            byType: {
              $push: {
                k: '$type',
                v: 1
              }
            },
            byPriority: {
              $push: {
                k: '$priority',
                v: 1
              }
            }
          }
        },
        {
          $project: {
            total: 1,
            sent: 1,
            failed: 1,
            deliveryRate: {
              $cond: [
                { $gt: ['$total', 0] },
                { $multiply: [{ $divide: ['$sent', '$total'] }, 100] },
                0
              ]
            },
            byType: {
              $arrayToObject: '$byType'
            },
            byPriority: {
              $arrayToObject: '$byPriority'
            }
          }
        }
      ]);

      return stats[0] || {
        total: 0,
        sent: 0,
        failed: 0,
        deliveryRate: 0,
        byType: {},
        byPriority: {}
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Méthodes utilitaires
  getPushUrgency(priority) {
    const urgencyMap = {
      'low': 'very-low',
      'medium': 'normal',
      'high': 'high',
      'urgent': 'high'
    };
    return urgencyMap[priority] || 'normal';
  }

  getActionIcon(action) {
    const iconMap = {
      'view': '👁️',
      'edit': '✏️',
      'approve': '✅',
      'decline': '❌',
      'complete': '✓',
      'dismiss': '🚫',
      'reschedule': '📅'
    };
    return iconMap[action] || '🔔';
  }

  generateEmailTemplate(notification) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${notification.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .priority { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .priority.high { background: #fef2f2; color: #dc2626; }
          .priority.urgent { background: #fef2f2; color: #dc2626; }
          .priority.medium { background: #fffbeb; color: #d97706; }
          .priority.low { background: #f0fdf4; color: #16a34a; }
          .actions { margin: 20px 0; }
          .btn { display: inline-block; padding: 10px 20px; margin: 5px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
          .footer { background: #f9fafb; padding: 15px 20px; font-size: 12px; color: #6b7280; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 API Pousse</h1>
            <h2>${notification.title}</h2>
          </div>
          <div class="content">
            <div style="margin-bottom: 15px;">
              <span class="priority ${notification.priority}">${this.getPriorityLabel(notification.priority)}</span>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #374151;">
              ${notification.message}
            </p>
            ${notification.actions.length > 0 ? `
              <div class="actions">
                <h3>Actions disponibles:</h3>
                ${notification.actions.map(action =>
                  action.url ? `<a href="${action.url}" class="btn">${action.label}</a>` : ''
                ).join('')}
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Cette notification a été générée automatiquement par API Pousse.<br>
            Si vous ne souhaitez plus recevoir ces notifications, vous pouvez modifier vos préférences dans votre profil.</p>
            <p>© ${new Date().getFullYear()} API Pousse - Système de gestion de projets paysagers</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
${notification.title}

${notification.message}

${notification.actions.length > 0 ?
  'Actions disponibles:\n' + notification.actions.map(action => `- ${action.label}: ${action.url || 'Action disponible dans l\'application'}`).join('\n') + '\n\n'
  : ''
}

---
Cette notification a été générée automatiquement par API Pousse.
© ${new Date().getFullYear()} API Pousse - Système de gestion de projets paysagers
    `;

    return { html, text };
  }

  getPriorityLabel(priority) {
    const labels = {
      'low': 'Faible',
      'medium': 'Moyenne',
      'high': 'Haute',
      'urgent': 'Urgente'
    };
    return labels[priority] || priority;
  }
}

module.exports = new NotificationService();