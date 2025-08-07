const express = require('express');
const eventBus = require('../shared/event-bus');
const authController = require('../../backend/controllers/authController');
const userController = require('../../backend/controllers/userController');
const authMiddleware = require('../../backend/middlewares/authMiddleware');
const logger = require('../../backend/utils/logger');

class AuthService {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Routes d'authentification
    this.app.post('/login', this.enhancedLogin.bind(this));
    this.app.post('/register', this.enhancedRegister.bind(this));
    this.app.post('/refresh', authController.refreshToken);
    this.app.post('/logout', authMiddleware(), this.enhancedLogout.bind(this));
    
    // Routes utilisateurs
    this.app.get('/users', authMiddleware('admin'), authController.getAllUsers);
    this.app.get('/users/:id', authMiddleware(), userController.getUserById);
    this.app.put('/users/:id', authMiddleware(), userController.updateUser);
    this.app.delete('/users/:id', authMiddleware('admin'), this.enhancedDeleteUser.bind(this));
    
    // Routes de profil
    this.app.get('/profile', authMiddleware(), userController.getProfile);
    this.app.put('/profile', authMiddleware(), userController.updateProfile);
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        service: 'auth-service', 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        stats: eventBus.getStats()
      });
    });
  }

  setupEventHandlers() {
    // Écouter les événements d'autres services
    eventBus.on('user.profile.update.request', this.handleProfileUpdateRequest.bind(this));
    eventBus.on('security.suspicious.activity', this.handleSuspiciousActivity.bind(this));
  }

  /**
   * Login avec événements
   */
  async enhancedLogin(req, res, next) {
    try {
      // Exécuter le login standard
      await authController.login(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 200 && req.user) {
        await eventBus.emit('user.login.success', {
          userId: req.user.id,
          username: req.user.username,
          role: req.user.role,
          loginTime: new Date().toISOString(),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }, {
          service: 'auth-service',
          userId: req.user.id
        });

        logger.info(`🔐 Login réussi: ${req.user.username}`, {
          userId: req.user.id,
          ip: req.ip
        });
      }
    } catch (error) {
      // Émettre événement d'échec
      await eventBus.emit('user.login.failed', {
        email: req.body.email,
        reason: error.message,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      }, {
        service: 'auth-service'
      });

      logger.warn(`🔐 Tentative login échouée: ${req.body.email}`, {
        ip: req.ip,
        reason: error.message
      });

      next(error);
    }
  }

  /**
   * Register avec événements
   */
  async enhancedRegister(req, res, next) {
    try {
      // Exécuter le register standard
      await authController.register(req, res, next);
      
      // Si succès, émettre événement
      if (res.statusCode === 201) {
        await eventBus.emit('user.created', {
          userId: res.locals.newUserId,
          username: req.body.username,
          email: req.body.email,
          role: req.body.role || 'user',
          createdAt: new Date().toISOString(),
          createdBy: req.user?.id || 'system'
        }, {
          service: 'auth-service',
          userId: req.user?.id
        });

        logger.info(`👤 Utilisateur créé: ${req.body.username}`);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout avec événements
   */
  async enhancedLogout(req, res, next) {
    try {
      // Émettre événement de logout
      await eventBus.emit('user.logout', {
        userId: req.user.id,
        username: req.user.username,
        logoutTime: new Date().toISOString(),
        sessionDuration: req.user.sessionDuration || null
      }, {
        service: 'auth-service',
        userId: req.user.id
      });

      // Exécuter le logout standard
      await authController.logout(req, res, next);

      logger.info(`🔐 Logout: ${req.user.username}`, {
        userId: req.user.id
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Suppression utilisateur avec événements
   */
  async enhancedDeleteUser(req, res, next) {
    try {
      const userToDelete = await User.findById(req.params.id);
      
      if (!userToDelete) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Émettre événement avant suppression
      await eventBus.emit('user.delete.initiated', {
        userIdToDelete: userToDelete._id,
        usernameToDelete: userToDelete.username,
        deletedBy: req.user.id,
        deletedByUsername: req.user.username,
        timestamp: new Date().toISOString()
      }, {
        service: 'auth-service',
        userId: req.user.id
      });

      // Supprimer l'utilisateur
      await userToDelete.deleteOne();

      // Émettre événement de confirmation
      await eventBus.emit('user.deleted', {
        userIdDeleted: userToDelete._id,
        usernameDeleted: userToDelete.username,
        deletedBy: req.user.id,
        deletedAt: new Date().toISOString()
      }, {
        service: 'auth-service',
        userId: req.user.id
      });

      res.json({ message: 'Utilisateur supprimé avec succès' });

      logger.info(`👤 Utilisateur supprimé: ${userToDelete.username}`, {
        deletedBy: req.user.username
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gérer les demandes de mise à jour de profil
   */
  async handleProfileUpdateRequest(eventData) {
    try {
      logger.info('📝 Demande mise à jour profil reçue', eventData);
      
      // Ici on pourrait implémenter des validations spécifiques
      // ou des notifications
      
    } catch (error) {
      logger.error('❌ Erreur traitement mise à jour profil:', error);
    }
  }

  /**
   * Gérer les activités suspectes
   */
  async handleSuspiciousActivity(eventData) {
    try {
      logger.warn('🚨 Activité suspecte détectée', eventData);
      
      // Implémenter des mesures de sécurité
      // Bloquer temporairement, alerter admin, etc.
      
    } catch (error) {
      logger.error('❌ Erreur traitement activité suspecte:', error);
    }
  }

  /**
   * Démarrer le service
   */
  async start(port = 3002) {
    try {
      // Initialiser le bus d'événements
      await eventBus.initialize();
      
      // Démarrer le serveur
      this.server = this.app.listen(port, () => {
        logger.info(`🔐 Auth Service démarré sur le port ${port}`);
      });

      return this.server;
    } catch (error) {
      logger.error('❌ Erreur démarrage Auth Service:', error);
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
      logger.info('🔐 Auth Service arrêté');
    } catch (error) {
      logger.error('❌ Erreur arrêt Auth Service:', error);
    }
  }
}

module.exports = AuthService;