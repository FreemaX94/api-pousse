const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
      match: /^[a-zA-Z0-9_]+$/,
      index: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      index: true
    },
    fullname: { 
      type: String,
      trim: true,
      maxlength: 100
    },
    password: { 
      type: String, 
      required: true,
      minlength: 8,
      select: false
    },
    isActive: { type: Boolean, default: false },
    role: { 
      type: String, 
      enum: ['user', 'admin', 'manager'], 
      default: 'user',
      index: true
    },
    roles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    activationToken: String,
    activationExpires: Date,
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0, max: 50 },
    lockUntil: Date,
    emailVerified: { type: Boolean, default: false },
    twoFactorSecret: String,
    twoFactorEnabled: { type: Boolean, default: false },
    phoneNumber: {
      type: String,
      match: /^\+?[1-9]\d{1,14}$/
    },
    avatar: String,
    preferences: {
      language: { type: String, default: 'fr' },
      timezone: { type: String, default: 'Europe/Paris' },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      }
    },
    permissions: [{
      resource: String,
      actions: [String]
    }],
    metadata: {
      ipAddresses: [String],
      userAgent: String,
      source: { type: String, default: 'web' }
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.twoFactorSecret;
        delete ret.activationToken;
        return ret;
      }
    }
  }
);

// Indexes composés pour optimiser les requêtes
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ lastLogin: -1 });

// Pre-save middleware pour hash du password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12); // Salt plus fort
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Pre-save pour nettoyer les champs sensibles
userSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.emailVerified = false;
  }
  next();
});

// Virtual pour savoir si le compte est verrouillé
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Méthode pour gérer les tentatives de connexion
userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 50 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 heures
  }
  
  return this.updateOne(updates);
};

// Méthode pour réinitialiser les tentatives de connexion
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Méthode pour générer un token d'activation
userSchema.methods.generateActivationToken = function() {
  this.activationToken = crypto.randomBytes(32).toString('hex');
  this.activationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
  return this.activationToken;
};

// Méthode pour générer un token de reset password
userSchema.methods.generateResetPasswordToken = function() {
  this.resetPasswordToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 heure
  return this.resetPasswordToken;
};

// Méthode pour vérifier les permissions
userSchema.methods.hasPermission = function(resource, action) {
  if (this.role === 'admin') return true;
  
  const permission = this.permissions.find(p => p.resource === resource);
  return permission && permission.actions.includes(action);
};

// Méthode pour nettoyer les données sensibles
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.twoFactorSecret;
  delete obj.activationToken;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

// Méthode statique pour rechercher des utilisateurs
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  }).select('+password');
};

// Méthode statique pour obtenir les statistiques utilisateurs
userSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        active: { $sum: { $cond: ['$isActive', 1, 0] } }
      }
    }
  ]);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
