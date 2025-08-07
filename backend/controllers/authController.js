const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const crypto = require('crypto');
const { sendResetPasswordEmail } = require('../services/mailService');
const logger = require('../utils/logger');
const { celebrate, Joi, Segments } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { promisify } = require('util');
const { 
  bruteForceProtection, 
  recordFailedAttempt, 
  recordSuccessfulAttempt,
  progressiveRateLimit 
} = require('../middlewares/bruteForceProtection');
const {
  generateTokenPair,
  verifyRefreshToken,
  refreshTokens,
  revokeToken,
  revokeAllUserTokens,
  getTokenStats
} = require('../services/jwtService');

// Rate limiting pour les tentatives de connexion (sécurisé)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max contre brute force
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  // Ajouter un délai progressif
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// Rate limiting pour l'enregistrement (plus restrictif)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 2, // 2 créations de compte par IP (réduit de 3 à 2)
  message: { error: 'Trop de créations de compte. Réessayez dans 1 heure.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Validation des schémas
const registerSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
      .messages({
        'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
      }),
    email: Joi.string().email().required(),
    fullname: Joi.string().min(2).max(50).required()
  })
};

const loginSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
};

const activateSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().required()
  })
};

const refreshSchema = {
  [Segments.BODY]: Joi.object({
    refreshToken: Joi.string().required()
  })
};

const forgotPasswordSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required()
  })
};

const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
      .messages({
        'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
      })
  })
};

// Fonction pour ajouter un délai constant (protection contre les timing attacks)
const constantTimeDelay = () => promisify(setTimeout)(Math.random() * 100 + 50);

// 🔐 Génération de tokens - DEPRECATED - Utiliser jwtService
// const generateToken = (payload, expiresIn) =>
//   jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

exports.register = [registerLimiter, celebrate(registerSchema), async (req, res, next) => {
  try {
    const { username, password, email, fullname } = req.body;
    
    // Vérifier si l'utilisateur ou l'email existe déjà
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      await constantTimeDelay();
      return res.status(409).json({ error: 'Un compte avec ces informations existe déjà' });
    }

    const user = await User.create({
      username,
      email,
      fullname,
      password,
      isActive: false
    });

    logger.info(`Nouvel utilisateur créé: ${username}`);
    res.status(201).json({ message: 'Inscription réussie', user: { id: user._id } });
  } catch (err) {
    logger.error('❌ Erreur register:', err.message);
    next(err);
  }
}];

exports.activate = [celebrate(activateSchema), async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOneAndUpdate(
      { username },
      { isActive: true },
      { new: true }
    );
    
    if (!user) {
      await constantTimeDelay();
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    logger.info(`Compte activé pour l'utilisateur: ${username}`);
    res.status(200).json({ message: 'Compte activé', user: { id: user._id } });
  } catch (err) {
    logger.error('❌ Erreur activate:', err.message);
    next(err);
  }
}];

exports.login = [bruteForceProtection, progressiveRateLimit, celebrate(loginSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Toujours ajouter un délai pour éviter les timing attacks
    await constantTimeDelay();
    
    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const attemptCount = recordFailedAttempt(req, 'login');
      logger.auth.loginFailed(username, req.ip, `Invalid credentials (attempt #${attemptCount})`);
      return res.status(401).json({ 
        error: 'Identifiants invalides',
        attempts: attemptCount
      });
    }

    if (!user.isActive) {
      const attemptCount = recordFailedAttempt(req, 'inactive_account');
      logger.auth.loginFailed(username, req.ip, 'Account not activated');
      return res.status(403).json({ 
        error: 'Compte non activé',
        attempts: attemptCount
      });
    }

    // Générer une paire de tokens sécurisée avec rotation
    const tokenPair = generateTokenPair({ 
      userId: user._id, 
      username: user.username,
      email: user.email,
      role: user.role 
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes (réduit de 8h)
    };

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Enregistrer la connexion réussie (nettoie l'historique des échecs)
    recordSuccessfulAttempt(req);
    
    res.cookie('accessToken', tokenPair.accessToken, cookieOptions);
    logger.auth.login(user._id, user.email, req.ip, req.get('User-Agent'));
    
    res.status(200).json({ 
      message: 'Connexion réussie',
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      tokenId: tokenPair.tokenId,
      expiresIn: tokenPair.expiresIn,
      accessExpiresAt: tokenPair.accessExpiresAt,
      refreshExpiresAt: tokenPair.refreshExpiresAt,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role
      }
    });
  } catch (err) {
    logger.error('❌ Erreur login:', err.message);
    next(err);
  }
}];

exports.refresh = [celebrate(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Vérifier le refresh token avec le service sécurisé
    const decoded = verifyRefreshToken(refreshToken);
    
    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        error: 'Utilisateur non trouvé ou inactif',
        code: 'USER_INACTIVE'
      });
    }

    // Générer une nouvelle paire de tokens (rotation automatique)
    const newTokens = await refreshTokens(refreshToken, { 
      userId: user._id, 
      username: user.username,
      email: user.email,
      role: user.role 
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    };

    res.cookie('accessToken', newTokens.accessToken, cookieOptions);
    
    logger.info(`🔄 Tokens rafraîchis pour user ${user._id}`);
    
    res.status(200).json({ 
      message: 'Tokens rafraîchis avec succès',
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      tokenId: newTokens.tokenId,
      expiresIn: newTokens.expiresIn,
      accessExpiresAt: newTokens.accessExpiresAt,
      refreshExpiresAt: newTokens.refreshExpiresAt
    });
  } catch (err) {
    if (err.message.includes('Token') || err.message.includes('token')) {
      return res.status(401).json({ 
        error: err.message,
        code: 'REFRESH_FAILED'
      });
    }
    logger.error('❌ Erreur refresh:', err.message);
    next(err);
  }
}];

exports.forgotPassword = [celebrate(forgotPasswordSchema), async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Toujours ajouter un délai pour éviter l'énumération d'emails
    await constantTimeDelay();
    
    const user = await User.findOne({ email });
    if (user && user.isActive) {
      const token = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
      user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
      await user.save();
      
      try {
        await sendResetPasswordEmail(user.email, token);
        logger.info(`Email de réinitialisation envoyé à: ${email}`);
      } catch (e) {
        logger.error('❌ Envoi mail échoué:', e.message);
        // Supprimer le token si l'envoi échoue
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
      }
    }
    
    // Réponse constante pour éviter l'énumération d'emails
    res.status(200).json({ message: 'Si le compte existe, un e-mail a été envoyé.' });
  } catch (err) {
    logger.error('❌ Erreur forgotPassword:', err.message);
    next(err);
  }
}];

exports.resetPassword = [celebrate(resetPasswordSchema), async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    // Hacher le token pour la comparaison
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      await constantTimeDelay();
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    logger.info(`Mot de passe réinitialisé pour l'utilisateur: ${user.username}`);
    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    logger.error('❌ Erreur resetPassword:', err.message);
    next(err);
  }
}];

exports.me = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    });
  } catch (err) {
    logger.error('❌ Erreur me:', err.message);
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Révoquer le token actuel si disponible
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken;
    
    if (token) {
      revokeToken(token);
    }
    
    // Révoquer le refresh token si fourni
    const { refreshToken } = req.body;
    if (refreshToken) {
      try {
        revokeToken(refreshToken);
      } catch (e) {
        // Ignorer les erreurs de révocation du refresh token
        logger.warn('⚠️ Impossible de révoquer le refresh token:', e.message);
      }
    }
    
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'strict'
    });
    
    if (req.user) {
      logger.info(`🚪 Déconnexion de l'utilisateur: ${req.user.username} (tokenId: ${req.user.tokenId})`);
    }
    
    res.status(200).json({ 
      message: 'Déconnexion réussie',
      tokensRevoked: true
    });
  } catch (err) {
    logger.error('❌ Erreur logout:', err.message);
    next(err);
  }
};

// Récupérer tous les utilisateurs (admin seulement)
exports.getAllUsers = async (req, res, next) => {
  try {
    const QueryOptimizer = require('../utils/queryOptimizer');
    
    // Requête optimisée avec projection et lean()
    const users = await QueryOptimizer.optimizeUserQuery(
      User.find(),
      {
        includePassword: false,
        includeSensitive: false,
        lean: true,
        limit: 100
      }
    ).sort({ createdAt: -1 });
    
    logger.info(`👥 Admin ${req.user.username} a récupéré la liste des utilisateurs`);
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    logger.error('❗ Erreur getAllUsers:', error);
    next(error);
  }
};

// 🔐 Révoquer tous les tokens d'un utilisateur (déconnexion forcée)
exports.revokeAllTokens = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const revokedCount = revokeAllUserTokens(userId);
    
    logger.info(`🚫 Révocation de tous les tokens pour user ${userId}`);
    
    res.status(200).json({
      message: 'Tous les tokens ont été révoqués',
      revokedCount,
      userId
    });
  } catch (err) {
    logger.error('❌ Erreur revokeAllTokens:', err.message);
    next(err);
  }
};

// 📊 Obtenir les statistiques des tokens (admin seulement)
exports.getTokenStats = async (req, res, next) => {
  try {
    const stats = getTokenStats();
    
    res.status(200).json({
      message: 'Statistiques des tokens',
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    logger.error('❌ Erreur getTokenStats:', err.message);
    next(err);
  }
};

// 🔄 Auto-refresh endpoint (pour le frontend)
exports.autoRefresh = async (req, res, next) => {
  try {
    // Vérifier si l'utilisateur est connecté
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        code: 'NOT_AUTHENTICATED'
      });
    }
    
    // Si le token est encore valide et n'expire pas bientôt, pas besoin de refresh
    if (!req.headers['x-token-refresh-suggested']) {
      return res.status(200).json({
        message: 'Token encore valide',
        shouldRefresh: false
      });
    }
    
    // Générer de nouveaux tokens
    const newTokens = generateTokenPair({
      userId: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    });
    
    // Révoquer l'ancien token
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;
    const oldToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken;
    
    if (oldToken) {
      revokeToken(oldToken);
    }
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'strict',
      maxAge: 15 * 60 * 1000
    };
    
    res.cookie('accessToken', newTokens.accessToken, cookieOptions);
    
    res.status(200).json({
      message: 'Tokens auto-rafraîchis',
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      tokenId: newTokens.tokenId,
      expiresIn: newTokens.expiresIn,
      accessExpiresAt: newTokens.accessExpiresAt,
      refreshExpiresAt: newTokens.refreshExpiresAt
    });
    
  } catch (err) {
    logger.error('❌ Erreur autoRefresh:', err.message);
    next(err);
  }
};

// Exporter les middlewares de rate limiting
exports.loginLimiter = loginLimiter;
exports.registerLimiter = registerLimiter;
