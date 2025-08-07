// backend/controllers/userController.js

const userService = require('../services/userService');
const { celebrate, Joi, Segments } = require('celebrate');
const logger = require('../utils/logger');

// Schémas de validation
const registerSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
    email: Joi.string().email().required(),
    fullname: Joi.string().min(2).max(50).required(),
    role: Joi.string().valid('user', 'admin').default('user')
  })
};

const loginSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
};

const updateUserSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  [Segments.BODY]: Joi.object({
    username: Joi.string().alphanum().min(3).max(20),
    email: Joi.string().email(),
    fullname: Joi.string().min(2).max(50),
    role: Joi.string().valid('user', 'admin'),
    isActive: Joi.boolean()
  }).min(1)
};

const getUserSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
  })
};

const deleteUserSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
  })
};

const getAllUsersSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100),
    role: Joi.string().valid('user', 'admin'),
    isActive: Joi.boolean()
  })
};

// Middleware d'autorisation
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
};

const requireSelfOrAdmin = (req, res, next) => {
  const userId = req.params.id;
  if (req.user.userId !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }
  next();
};

/**
 * POST /api/users/register
 * Crée un nouvel utilisateur (réservé aux administrateurs)
 */
exports.register = [requireAdmin, celebrate(registerSchema), async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    logger.info(`Nouvel utilisateur créé par admin ${req.user.username}: ${user.username}`);
    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    logger.error(`Erreur lors de la création d'utilisateur: ${err.message}`);
    return next(err);
  }
}];

/**
 * POST /api/users/login
 * Authentifie un utilisateur (déprécié - utiliser authController)
 */
exports.login = [celebrate(loginSchema), async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);
    logger.info(`Connexion réussie pour: ${req.body.username}`);
    return res.json({
      message: 'Connexion réussie',
      ...result
    });
  } catch (err) {
    logger.error(`Erreur de connexion pour ${req.body.username}: ${err.message}`);
    return next(err);
  }
}];

/**
 * GET /api/users
 * Récupère la liste des utilisateurs avec pagination (réservé aux administrateurs)
 */
exports.getAllUsers = [requireAdmin, celebrate(getAllUsersSchema), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, isActive } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      role,
      isActive: isActive !== undefined ? isActive === 'true' : undefined
    };
    
    const result = await userService.getAllUsers(options);
    
    return res.json({
      users: result.users,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalUsers: result.totalUsers,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });
  } catch (err) {
    logger.error(`Erreur lors de la récupération des utilisateurs: ${err.message}`);
    return next(err);
  }
}];

/**
 * GET /api/users/:id
 * Récupère un utilisateur par son ID (propriétaire ou admin)
 */
exports.getUserById = [requireSelfOrAdmin, celebrate(getUserSchema), async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    // Filtrer les informations sensibles si ce n'est pas l'utilisateur lui-même ou un admin
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };
    
    // Seuls les admins peuvent voir le rôle
    if (req.user.role === 'admin') {
      userData.role = user.role;
    }
    
    return res.json(userData);
  } catch (err) {
    logger.error(`Erreur lors de la récupération de l'utilisateur ${req.params.id}: ${err.message}`);
    return next(err);
  }
}];

/**
 * PUT /api/users/:id
 * Met à jour un utilisateur (propriétaire ou admin)
 */
exports.updateUser = [requireSelfOrAdmin, celebrate(updateUserSchema), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    
    // Seuls les admins peuvent modifier le rôle et le statut actif
    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.isActive;
    }
    
    // Empêcher les utilisateurs de se désactiver eux-mêmes
    if (req.user.userId === userId && updateData.isActive === false) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous désactiver vous-même' });
    }
    
    const user = await userService.updateUser(userId, updateData);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    logger.info(`Utilisateur ${userId} mis à jour par ${req.user.username}`);
    
    return res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    logger.error(`Erreur lors de la mise à jour de l'utilisateur ${req.params.id}: ${err.message}`);
    return next(err);
  }
}];

/**
 * DELETE /api/users/:id
 * Supprime un utilisateur (réservé aux administrateurs)
 */
exports.deleteUser = [requireAdmin, celebrate(deleteUserSchema), async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Empêcher la suppression de son propre compte
    if (req.user.userId === userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }
    
    const result = await userService.deleteUser(userId);
    
    if (!result) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    logger.info(`Utilisateur ${userId} supprimé par l'admin ${req.user.username}`);
    
    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    logger.error(`Erreur lors de la suppression de l'utilisateur ${req.params.id}: ${err.message}`);
    return next(err);
  }
}];

// Exporter les middlewares d'autorisation
exports.requireAdmin = requireAdmin;
exports.requireSelfOrAdmin = requireSelfOrAdmin;
