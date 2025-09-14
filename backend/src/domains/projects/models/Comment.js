const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Schema pour les réactions aux commentaires
const ReactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['like', 'love', 'laugh', 'surprised', 'sad', 'angry'],
    required: true
  },
  date: { type: Date, default: Date.now }
});

// Schema pour les pièces jointes
const AttachmentSchema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: String,
  size: Number,
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

// Schema principal pour les commentaires
const CommentSchema = new Schema({
  // Référence au projet
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Projet',
    required: true,
    index: true
  },

  // Référence optionnelle (commentaire sur une tâche, jalon, etc.)
  context: {
    type: {
      type: String,
      enum: ['project', 'task', 'milestone', 'material', 'expense', 'document', 'photo']
    },
    entityId: Schema.Types.ObjectId,
    entityName: String // Nom de l'entité pour affichage rapide
  },

  // Auteur du commentaire
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Contenu du commentaire
  content: {
    type: String,
    required: true,
    maxlength: 5000,
    trim: true
  },

  // Type de commentaire
  type: {
    type: String,
    enum: ['comment', 'note', 'issue', 'suggestion', 'approval', 'update', 'question'],
    default: 'comment',
    index: true
  },

  // Priorité/Importance
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Visibilité
  visibility: {
    type: String,
    enum: ['public', 'team', 'private', 'client'],
    default: 'team',
    index: true
  },

  // Commentaire parent (pour les réponses)
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },

  // Réponses (commentaires enfants)
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],

  // Mentions d'utilisateurs
  mentions: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    username: String, // Cache pour performance
    notified: { type: Boolean, default: false }
  }],

  // Pièces jointes
  attachments: [AttachmentSchema],

  // Réactions
  reactions: [ReactionSchema],

  // Statut du commentaire
  status: {
    type: String,
    enum: ['active', 'edited', 'deleted', 'hidden', 'resolved'],
    default: 'active',
    index: true
  },

  // Édition
  editHistory: [{
    editedAt: { type: Date, default: Date.now },
    previousContent: String,
    editReason: String,
    editedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],

  // Résolution (pour les questions/problèmes)
  resolution: {
    isResolved: { type: Boolean, default: false },
    resolvedAt: Date,
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolutionNote: String
  },

  // Tags et catégories
  tags: [String],
  category: {
    type: String,
    enum: ['general', 'technical', 'client', 'budget', 'timeline', 'quality', 'safety', 'material', 'team']
  },

  // Géolocalisation (pour commentaires sur site)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number], // [longitude, latitude]
    address: String,
    accuracy: Number // Précision en mètres
  },

  // Métadonnées
  metadata: {
    source: { type: String, default: 'web' }, // 'web', 'mobile', 'api'
    device: String,
    ipAddress: String,
    userAgent: String,
    version: { type: String, default: '1.0' }
  },

  // Suivi des vues
  views: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    viewedAt: { type: Date, default: Date.now },
    readTime: Number // temps de lecture estimé en secondes
  }],

  // Programmation (pour les notes de suivi)
  scheduled: {
    isScheduled: { type: Boolean, default: false },
    reminderDate: Date,
    recurrence: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly']
      },
      interval: { type: Number, default: 1 },
      endDate: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index géospatial pour les commentaires localisés
CommentSchema.index({ location: '2dsphere' });

// Indexes composites pour optimiser les requêtes
CommentSchema.index({ project: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ type: 1, visibility: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ status: 1, visibility: 1 });

// Index de recherche textuelle
CommentSchema.index({
  content: 'text',
  tags: 'text',
  'context.entityName': 'text'
});

// Virtuals
CommentSchema.virtual('isReply').get(function() {
  return this.parentComment !== null;
});

CommentSchema.virtual('repliesCount').get(function() {
  return this.replies.length;
});

CommentSchema.virtual('reactionsCount').get(function() {
  return this.reactions.length;
});

CommentSchema.virtual('viewsCount').get(function() {
  return this.views.length;
});

CommentSchema.virtual('isEdited').get(function() {
  return this.editHistory.length > 0;
});

CommentSchema.virtual('lastEditedAt').get(function() {
  if (this.editHistory.length === 0) return null;
  return this.editHistory[this.editHistory.length - 1].editedAt;
});

// Méthodes d'instance
CommentSchema.methods.addReply = function(replyData) {
  if (this.parentComment) {
    throw new Error('Impossible de répondre à une réponse (max 2 niveaux)');
  }

  replyData.parentComment = this._id;
  replyData.project = this.project;
  replyData.visibility = this.visibility; // Hériter de la visibilité du parent

  const Comment = this.constructor;
  const reply = new Comment(replyData);

  this.replies.push(reply._id);
  this.save();

  return reply.save();
};

CommentSchema.methods.addReaction = function(userId, reactionType) {
  // Supprimer la réaction existante de cet utilisateur
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());

  // Ajouter la nouvelle réaction
  this.reactions.push({
    user: userId,
    type: reactionType
  });

  return this.save();
};

CommentSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  return this.save();
};

CommentSchema.methods.edit = function(newContent, editedBy, reason = '') {
  // Sauvegarder l'ancienne version dans l'historique
  this.editHistory.push({
    editedAt: new Date(),
    previousContent: this.content,
    editReason: reason,
    editedBy
  });

  this.content = newContent;
  this.status = 'edited';

  return this.save();
};

CommentSchema.methods.resolve = function(userId, resolutionNote = '') {
  if (this.type !== 'question' && this.type !== 'issue') {
    throw new Error('Seules les questions et problèmes peuvent être résolus');
  }

  this.resolution.isResolved = true;
  this.resolution.resolvedAt = new Date();
  this.resolution.resolvedBy = userId;
  this.resolution.resolutionNote = resolutionNote;
  this.status = 'resolved';

  return this.save();
};

CommentSchema.methods.markAsViewed = function(userId, readTime = null) {
  // Éviter les doublons récents (moins de 5 minutes)
  const recentView = this.views.find(v =>
    v.user.toString() === userId.toString() &&
    (new Date() - v.viewedAt) < 5 * 60 * 1000
  );

  if (!recentView) {
    this.views.push({
      user: userId,
      viewedAt: new Date(),
      readTime
    });
    return this.save();
  }

  return Promise.resolve(this);
};

CommentSchema.methods.extractMentions = function() {
  // Extraire les mentions @username du contenu
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;

  while ((match = mentionRegex.exec(this.content)) !== null) {
    mentions.push(match[1]);
  }

  return [...new Set(mentions)]; // Supprimer les doublons
};

// Méthodes statiques
CommentSchema.statics.getProjectComments = function(projectId, options = {}) {
  const {
    visibility = ['public', 'team'],
    type,
    author,
    context,
    includeReplies = true,
    limit = 50,
    page = 1,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const query = {
    project: projectId,
    status: { $ne: 'deleted' },
    visibility: { $in: Array.isArray(visibility) ? visibility : [visibility] }
  };

  if (type) query.type = type;
  if (author) query.author = author;
  if (context) query['context.type'] = context;
  if (!includeReplies) query.parentComment = null;

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(query)
    .populate('author', 'username email avatar')
    .populate('mentions.user', 'username')
    .populate('reactions.user', 'username')
    .populate('parentComment', 'content author')
    .populate('replies', 'content author createdAt')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

CommentSchema.statics.getCommentThread = function(commentId) {
  return this.findById(commentId)
    .populate('author', 'username email avatar')
    .populate('mentions.user', 'username')
    .populate('reactions.user', 'username')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'username email avatar'
      }
    });
};

CommentSchema.statics.searchComments = function(projectId, searchTerm, options = {}) {
  const {
    visibility = ['public', 'team'],
    type,
    author,
    limit = 20
  } = options;

  const query = {
    project: projectId,
    status: { $ne: 'deleted' },
    visibility: { $in: Array.isArray(visibility) ? visibility : [visibility] },
    $text: { $search: searchTerm }
  };

  if (type) query.type = type;
  if (author) query.author = author;

  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('author', 'username email avatar')
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
};

CommentSchema.statics.getCommentStats = function(projectId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
        createdAt: { $gte: startDate },
        status: { $ne: 'deleted' }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byType: {
          $push: { k: '$type', v: 1 }
        },
        byAuthor: {
          $push: { k: '$author', v: 1 }
        },
        totalReactions: { $sum: { $size: '$reactions' } },
        totalViews: { $sum: { $size: '$views' } },
        resolved: {
          $sum: { $cond: ['$resolution.isResolved', 1, 0] }
        }
      }
    }
  ]);
};

CommentSchema.statics.getUserMentions = function(userId, options = {}) {
  const {
    unreadOnly = false,
    limit = 50,
    page = 1
  } = options;

  const query = {
    'mentions.user': userId,
    status: { $ne: 'deleted' }
  };

  if (unreadOnly) {
    query['mentions.notified'] = false;
  }

  return this.find(query)
    .populate('author', 'username email avatar')
    .populate('project', 'title projectId')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

CommentSchema.statics.getRecentActivity = function(projectId, limit = 10) {
  return this.find({
    project: projectId,
    status: { $ne: 'deleted' },
    visibility: { $in: ['public', 'team'] }
  })
  .populate('author', 'username avatar')
  .sort({ createdAt: -1 })
  .limit(limit)
  .select('content author createdAt type context');
};

// Middleware pré-sauvegarde
CommentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('content')) {
    // Extraire et traiter les mentions
    const mentionedUsernames = this.extractMentions();

    if (mentionedUsernames.length > 0) {
      try {
        const User = mongoose.model('User');
        const mentionedUsers = await User.find({
          username: { $in: mentionedUsernames }
        }).select('_id username');

        this.mentions = mentionedUsers.map(user => ({
          user: user._id,
          username: user.username,
          notified: false
        }));
      } catch (error) {
        console.error('Erreur lors de la résolution des mentions:', error);
      }
    }

    // Auto-tagging basé sur le contenu
    const autoTags = this.generateAutoTags();
    this.tags = [...new Set([...this.tags, ...autoTags])];
  }

  next();
});

// Middleware post-sauvegarde
CommentSchema.post('save', async function(doc) {
  // Envoyer les notifications pour les mentions
  if (doc.mentions.length > 0) {
    try {
      const notificationService = require('../services/notificationService');
      const project = await mongoose.model('Projet').findById(doc.project);

      if (project) {
        const mentionedUserIds = doc.mentions.map(m => m.user);
        await notificationService.createCommentNotification(project, doc, mentionedUserIds);

        // Marquer les mentions comme notifiées
        doc.mentions.forEach(mention => {
          mention.notified = true;
        });
        await doc.save();
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des notifications de mention:', error);
    }
  }
});

// Méthodes utilitaires
CommentSchema.methods.generateAutoTags = function() {
  const content = this.content.toLowerCase();
  const autoTags = [];

  // Mots-clés pour auto-tagging
  const tagKeywords = {
    'urgent': ['urgent', 'emergency', 'asap', 'immediately'],
    'problem': ['problem', 'issue', 'bug', 'error', 'broken'],
    'budget': ['budget', 'cost', 'price', 'expensive', 'money'],
    'delay': ['delay', 'late', 'behind', 'postpone'],
    'quality': ['quality', 'defect', 'standard', 'specification'],
    'client': ['client', 'customer', 'visitor'],
    'weather': ['weather', 'rain', 'sun', 'wind', 'temperature'],
    'material': ['material', 'supply', 'delivery', 'stock'],
    'team': ['team', 'staff', 'colleague', 'help']
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      autoTags.push(tag);
    }
  }

  return autoTags;
};

CommentSchema.methods.getReadingTime = function() {
  // Estimation: 200 mots par minute
  const words = this.content.split(' ').length;
  return Math.max(1, Math.ceil(words / 200));
};

module.exports = model('Comment', CommentSchema);