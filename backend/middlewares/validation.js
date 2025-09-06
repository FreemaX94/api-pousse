/**
 * Validation Renforcée avec Joi et Celebrate
 * Schémas de validation stricts pour tous les endpoints
 */

const Joi = require('joi');
const { celebrate, Segments } = require('celebrate');
const logger = require('../utils/logger');

/**
 * Configuration Joi personnalisée
 */
const joiOptions = {
  abortEarly: false, // Retourner toutes les erreurs
  stripUnknown: true, // Supprimer les champs non définis
  cache: true, // Cache des schémas pour performance
  convert: true, // Conversion automatique des types
  allowUnknown: false // Rejeter les champs inconnus
};

/**
 * Extensions personnalisées pour Joi
 */
const customJoi = Joi.extend({
  type: 'string',
  base: Joi.string(),
  messages: {
    'string.strongPassword': 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    'string.noSqlInjection': 'Caractères dangereux détectés',
    'string.xssProtection': 'Contenu potentiellement dangereux détecté'
  },
  rules: {
    // Validation mot de passe fort
    strongPassword: {
      method() {
        return this.$_addRule('strongPassword');
      },
      validate(value, helpers) {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(value)) {
          return helpers.error('string.strongPassword');
        }
        return value;
      }
    },

    // Protection injection SQL
    noSqlInjection: {
      method() {
        return this.$_addRule('noSqlInjection');
      },
      validate(value, helpers) {
        const sqlInjectionPatterns = [
          /(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+[\=\>\<=\!\~]+.+)|(let\s+.+[\=]\s*.+)|(begin\s*.*\s*end)|(\s*[\/\*]+\s*.*\s*[\/\*]+)|(\s*(\-\-)\s*.*\s+)|(\s*(contains|containsall|containskey)\s+.*)))(\s*[\;]\s*)*)+)/i,
          /union.*select/i,
          /\'\s*or\s*\'/i,
          /\'\s*;/i
        ];

        for (const pattern of sqlInjectionPatterns) {
          if (pattern.test(value)) {
            return helpers.error('string.noSqlInjection');
          }
        }
        return value;
      }
    },

    // Protection XSS
    xssProtection: {
      method() {
        return this.$_addRule('xssProtection');
      },
      validate(value, helpers) {
        const xssPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /<iframe/gi,
          /<object/gi,
          /<embed/gi
        ];

        for (const pattern of xssPatterns) {
          if (pattern.test(value)) {
            return helpers.error('string.xssProtection');
          }
        }
        return value;
      }
    }
  }
});

/**
 * Schémas de base réutilisables
 */
const baseSchemas = {
  // Identifiants
  id: customJoi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'ID MongoDB invalide'
  }),

  email: customJoi.string().email().max(254).required().messages({
    'string.email': 'Format email invalide',
    'string.max': 'Email trop long'
  }),

  password: customJoi.string().strongPassword().max(128).required(),

  username: customJoi.string()
    .alphanum()
    .min(3)
    .max(30)
    .noSqlInjection()
    .required()
    .messages({
      'string.alphanum': 'Le nom d\'utilisateur ne peut contenir que des lettres et chiffres',
      'string.min': 'Nom d\'utilisateur trop court (min 3 caractères)',
      'string.max': 'Nom d\'utilisateur trop long (max 30 caractères)'
    }),

  // Textes sécurisés
  safeText: customJoi.string().noSqlInjection().xssProtection().max(1000),
  safeShortText: customJoi.string().noSqlInjection().xssProtection().max(255),

  // Numérique
  positiveInteger: Joi.number().integer().min(0),
  price: Joi.number().precision(2).min(0).max(999999.99),

  // Dates
  isoDate: Joi.date().iso().required(),
  futureDateOptional: Joi.date().iso().min('now'),

  // Pagination
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),

  // Upload
  fileSize: Joi.number().integer().min(1).max(10 * 1024 * 1024), // 10MB max
  fileName: customJoi.string().pattern(/^[a-zA-Z0-9._-]+$/).max(255),

  // Coordonnées géographiques
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180)
};

/**
 * Schémas de validation pour l'authentification
 */
const authSchemas = {
  login: celebrate({
    [Segments.BODY]: Joi.object({
      username: baseSchemas.username,
      password: customJoi.string().min(1).max(128).required(),
      rememberMe: Joi.boolean().default(false)
    })
  }, joiOptions),

  register: celebrate({
    [Segments.BODY]: Joi.object({
      username: baseSchemas.username,
      email: baseSchemas.email,
      password: baseSchemas.password,
      fullname: baseSchemas.safeShortText.required(),
      acceptTerms: Joi.boolean().valid(true).required().messages({
        'any.only': 'Vous devez accepter les conditions'
      })
    })
  }, joiOptions),

  resetPassword: celebrate({
    [Segments.BODY]: Joi.object({
      email: baseSchemas.email
    })
  }, joiOptions),

  confirmResetPassword: celebrate({
    [Segments.BODY]: Joi.object({
      token: customJoi.string().length(64).required(),
      password: baseSchemas.password
    })
  }, joiOptions),

  changePassword: celebrate({
    [Segments.BODY]: Joi.object({
      currentPassword: customJoi.string().min(1).max(128).required(),
      newPassword: baseSchemas.password
    })
  }, joiOptions)
};

/**
 * Schémas pour la gestion des utilisateurs
 */
const userSchemas = {
  getUser: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: baseSchemas.id
    })
  }, joiOptions),

  updateUser: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: baseSchemas.id
    }),
    [Segments.BODY]: Joi.object({
      username: baseSchemas.username.optional(),
      email: baseSchemas.email.optional(),
      fullname: baseSchemas.safeShortText.optional(),
      role: Joi.string().valid('user', 'manager', 'admin').optional(),
      isActive: Joi.boolean().optional(),
      preferences: Joi.object({
        language: Joi.string().valid('fr', 'en').default('fr'),
        timezone: customJoi.string().max(50).default('Europe/Paris'),
        notifications: Joi.object({
          email: Joi.boolean().default(true),
          push: Joi.boolean().default(false)
        }).default({})
      }).default({})
    }).min(1) // Au moins un champ requis
  }, joiOptions),

  listUsers: celebrate({
    [Segments.QUERY]: Joi.object({
      page: baseSchemas.page,
      limit: baseSchemas.limit,
      role: Joi.string().valid('user', 'manager', 'admin'),
      isActive: Joi.boolean(),
      search: baseSchemas.safeShortText.optional()
    })
  }, joiOptions)
};

/**
 * Schémas pour le stock et inventaire
 */
const stockSchemas = {
  createStock: celebrate({
    [Segments.BODY]: Joi.object({
      nom: baseSchemas.safeShortText.required(),
      description: baseSchemas.safeText.optional(),
      categorie: Joi.string().valid('Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés').required(),
      quantite: baseSchemas.positiveInteger.required(),
      prixUnitaire: baseSchemas.price.required(),
      seuillMinimum: baseSchemas.positiveInteger.default(0),
      fournisseur: baseSchemas.safeShortText.optional(),
      emplacement: baseSchemas.safeShortText.optional(),
      codeBarres: customJoi.string().alphanum().max(50).optional(),
      datePeremption: Joi.date().iso().optional(),
      photoUrl: Joi.string().uri().optional()
    })
  }, joiOptions),

  updateStock: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: baseSchemas.id
    }),
    [Segments.BODY]: Joi.object({
      nom: baseSchemas.safeShortText.optional(),
      description: baseSchemas.safeText.optional(),
      categorie: Joi.string().valid('Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés').optional(),
      quantite: baseSchemas.positiveInteger.optional(),
      prixUnitaire: baseSchemas.price.optional(),
      seuillMinimum: baseSchemas.positiveInteger.optional(),
      fournisseur: baseSchemas.safeShortText.optional(),
      emplacement: baseSchemas.safeShortText.optional(),
      codeBarres: customJoi.string().alphanum().max(50).optional(),
      datePeremption: Joi.date().iso().optional(),
      photoUrl: Joi.string().uri().optional()
    }).min(1)
  }, joiOptions),

  stockMovement: celebrate({
    [Segments.BODY]: Joi.object({
      stockId: baseSchemas.id,
      type: Joi.string().valid('entree', 'sortie').required(),
      quantite: baseSchemas.positiveInteger.required(),
      motif: baseSchemas.safeShortText.required(),
      commentaire: baseSchemas.safeText.optional(),
      destination: baseSchemas.safeShortText.optional(),
      responsable: baseSchemas.safeShortText.optional()
    })
  }, joiOptions),

  getStocks: celebrate({
    [Segments.QUERY]: Joi.object({
      page: baseSchemas.page,
      limit: baseSchemas.limit,
      categorie: Joi.string().valid('Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés'),
      search: baseSchemas.safeShortText.optional(),
      seuillAtteint: Joi.boolean(),
      fournisseur: baseSchemas.safeShortText.optional(),
      sortBy: Joi.string().valid('nom', 'quantite', 'prixUnitaire', 'createdAt').default('nom'),
      sortOrder: Joi.string().valid('asc', 'desc').default('asc')
    })
  }, joiOptions)
};

/**
 * Schémas pour le catalogue Nieuwkoop
 */
const catalogSchemas = {
  nieuwkoopSearch: celebrate({
    [Segments.QUERY]: Joi.object({
      q: baseSchemas.safeShortText.optional(),
      category: baseSchemas.safeShortText.optional(),
      page: baseSchemas.page,
      limit: Joi.number().integer().min(1).max(50).default(20), // Limite plus basse pour API externe
      inStock: Joi.boolean(),
      minPrice: baseSchemas.price,
      maxPrice: baseSchemas.price,
      sortBy: Joi.string().valid('name', 'price', 'availability').default('name')
    })
  }, joiOptions),

  catalogImport: celebrate({
    [Segments.BODY]: Joi.object({
      source: Joi.string().valid('nieuwkoop', 'manual').required(),
      items: Joi.array().items(
        Joi.object({
          externalId: customJoi.string().max(100),
          nom: baseSchemas.safeShortText.required(),
          description: baseSchemas.safeText,
          prix: baseSchemas.price.required(),
          disponible: Joi.boolean().default(true),
          image: Joi.string().uri().optional()
        })
      ).max(1000).required() // Maximum 1000 items par import
    })
  }, joiOptions)
};

/**
 * Schémas pour les uploads
 */
const uploadSchemas = {
  validateUpload: celebrate({
    [Segments.QUERY]: Joi.object({
      type: Joi.string().valid('image', 'document', 'avatar').required(),
      maxSize: baseSchemas.fileSize.optional()
    })
  }, joiOptions),

  uploadResponse: celebrate({
    [Segments.BODY]: Joi.object({
      filename: baseSchemas.fileName.required(),
      originalName: customJoi.string().max(255).required(),
      size: baseSchemas.fileSize.required(),
      mimetype: customJoi.string().max(100).required(),
      url: Joi.string().uri().required()
    })
  }, joiOptions)
};

/**
 * Middleware de gestion d'erreurs de validation personnalisé
 */
const validationErrorHandler = (err, req, res, next) => {
  if (err.joi || err.name === 'ValidationError') {
    const errors = {};
    
    // Traiter les erreurs Joi
    if (err.joi) {
      err.joi.details.forEach(detail => {
        const key = detail.path.join('.');
        errors[key] = detail.message;
      });
    }

    // Log de l'erreur de validation
    logger.warn('Erreur de validation:', {
      path: req.path,
      method: req.method,
      errors,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    });

    return res.status(400).json({
      error: 'Erreur de validation',
      details: errors,
      message: 'Les données fournies ne respectent pas le format attendu'
    });
  }

  next(err);
};

/**
 * Middleware de sanitisation des données
 */
const sanitizeData = (req, res, next) => {
  // Fonction récursive pour nettoyer les objets
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Trim et échapper les caractères dangereux
        sanitized[key] = value.trim()
          .replace(/[<>]/g, '') // Supprimer < et >
          .replace(/javascript:/gi, '') // Supprimer javascript:
          .replace(/on\w+=/gi, ''); // Supprimer les handlers on*=
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  };

  // Sanitiser body, query et params
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Validation conditionnelle selon le rôle
 */
const validateByRole = (schemas) => {
  return (req, res, next) => {
    const userRole = req.user?.role || 'user';
    const schema = schemas[userRole] || schemas.default || schemas.user;
    
    if (!schema) {
      return res.status(403).json({ error: 'Action non autorisée pour ce rôle' });
    }

    schema(req, res, next);
  };
};

module.exports = {
  // Schémas de validation
  authSchemas,
  userSchemas,
  stockSchemas,
  catalogSchemas,
  uploadSchemas,
  baseSchemas,

  // Middlewares
  validationErrorHandler,
  sanitizeData,
  validateByRole,

  // Utilities
  customJoi,
  joiOptions,

  // Export direct de celebrate pour usage custom
  celebrate,
  Segments,
  Joi
};