const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const crypto = require('crypto');
const { sendResetPasswordEmail } = require('../../../shared/mailService');
const logger = require('../../../shared/utils/logger');
const { celebrate, Joi, Segments } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { promisify } = require('util');

// Rate limiting pour les tentatives de connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting pour l'enregistrement
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 créations de compte par IP
  message: { error: 'Trop de créations de compte. Réessayez dans 1 heure.' },
  standardHeaders: true,
  legacyHeaders: false,
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

// 🔐 Génère un token JWT signé
const generateToken = (payload, expiresIn) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

exports.register = [celebrate(registerSchema), async (req, res, next) => {
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
};

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

exports.login = async (req, res, next) => {
  try {
    console.log('🚀 LOGIN CALLED - Method:', req.method, 'Body:', req.body);
    const { username, password } = req.body;
    
    // Toujours ajouter un délai pour éviter les timing attacks
    await constantTimeDelay();
    
    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn(`Tentative de connexion échouée pour: ${username}`);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    if (!user.isActive) {
      logger.warn(`Tentative de connexion sur compte inactif: ${username}`);
      return res.status(403).json({ error: 'Compte non activé' });
    }

    const accessToken = generateToken({ userId: user._id, username: user.username }, '15m');
    const refreshToken = generateToken({ userId: user._id }, '7d');

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    };

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    res.cookie('accessToken', accessToken, cookieOptions);
    logger.info(`Connexion réussie pour: ${username}`);
    res.status(200).json({ 
      message: 'Connexion réussie',
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname
      }
    });
  } catch (err) {
    logger.error('❌ Erreur login:', err.message);
    next(err);
  }
};

exports.refresh = [celebrate(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Utilisateur non trouvé ou inactif' });
    }

    const accessToken = generateToken({ userId: decoded.userId, username: user.username }, '15m');

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    };

    res.cookie('accessToken', accessToken, cookieOptions);
    res.status(200).json({ message: 'Token rafraîchi' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
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
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.COOKIE_SAMESITE || 'strict'
    });
    
    if (req.user) {
      logger.info(`Déconnexion de l'utilisateur: ${req.user.username}`);
    }
    
    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (err) {
    logger.error('❌ Erreur logout:', err.message);
    next(err);
  }
};

// Exporter les middlewares de rate limiting
exports.loginLimiter = loginLimiter;
exports.registerLimiter = registerLimiter;
