const Comment = require('../models/Comment');
const Projet = require('../models/Projet');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class CommentController {
  constructor() {
    // Configuration multer pour les pièces jointes
    this.upload = multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(__dirname, '../../../../uploads/comments');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        }
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
        files: 5 // Max 5 fichiers par commentaire
      },
      fileFilter: (req, file, cb) => {
        // Types de fichiers autorisés
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
          return cb(null, true);
        }
        cb(new Error('Type de fichier non autorisé'));
      }
    });
  }

  /**
   * Récupérer les commentaires d'un projet
   */
  async getProjectComments(req, res) {
    try {
      const { projectId } = req.params;
      const {
        visibility = 'team',
        type,
        author,
        context,
        includeReplies = 'true',
        limit = 50,
        page = 1,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Vérifier l'accès au projet
      const project = await Projet.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      // Vérifier les permissions
      if (!this.canViewComments(req.user, project, visibility)) {
        return res.status(403).json({ error: 'Accès refusé aux commentaires' });
      }

      const options = {
        visibility: visibility.split(','),
        type,
        author,
        context,
        includeReplies: includeReplies === 'true',
        limit: parseInt(limit),
        page: parseInt(page),
        sortBy,
        sortOrder
      };

      const comments = await Comment.getProjectComments(projectId, options);
      const total = await Comment.countDocuments({
        project: projectId,
        status: { $ne: 'deleted' },
        visibility: { $in: options.visibility }
      });

      res.json({
        comments,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });

    } catch (error) {
      console.error('Error fetching project comments:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des commentaires',
        details: error.message
      });
    }
  }

  /**
   * Récupérer un commentaire spécifique avec son thread
   */
  async getComment(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.getCommentThread(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Commentaire non trouvé' });
      }

      // Vérifier les permissions
      const project = await Projet.findById(comment.project);
      if (!this.canViewComments(req.user, project, comment.visibility)) {
        return res.status(403).json({ error: 'Accès refusé à ce commentaire' });
      }

      // Marquer comme vu
      await comment.markAsViewed(req.user.id);

      res.json(comment);

    } catch (error) {
      console.error('Error fetching comment:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération du commentaire',
        details: error.message
      });
    }
  }

  /**
   * Créer un nouveau commentaire
   */
  async createComment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { projectId } = req.params;
      const project = await Projet.findById(projectId);

      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      // Vérifier les permissions de création
      if (!this.canCreateComment(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé pour créer un commentaire' });
      }

      const commentData = {
        ...req.body,
        project: projectId,
        author: req.user.id,
        metadata: {
          source: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'web',
          device: req.headers['user-agent'],
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        }
      };

      // Traitement des coordonnées GPS si fournies
      if (req.body.coordinates) {
        commentData.location = {
          type: 'Point',
          coordinates: [req.body.coordinates.longitude, req.body.coordinates.latitude],
          address: req.body.address,
          accuracy: req.body.accuracy
        };
      }

      const comment = new Comment(commentData);
      await comment.save();

      // Peupler les références pour la réponse
      await comment.populate('author', 'username email avatar');

      // Ajouter à l'historique du projet
      project.history.push({
        action: 'comment_added',
        description: `Commentaire ajouté: ${comment.type}`,
        performedBy: req.user.id,
        newValue: comment._id
      });
      await project.save();

      res.status(201).json({
        message: 'Commentaire créé avec succès',
        comment
      });

    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({
        error: 'Erreur lors de la création du commentaire',
        details: error.message
      });
    }
  }

  /**
   * Créer un commentaire avec pièces jointes
   */
  async createCommentWithAttachments(req, res) {
    const uploadHandler = this.upload.array('attachments', 5);

    uploadHandler(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: 'Erreur lors de l\'upload des fichiers',
          details: err.message
        });
      }

      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // Nettoyer les fichiers uploadés en cas d'erreur
          if (req.files) {
            req.files.forEach(file => {
              try {
                fs.unlinkSync(file.path);
              } catch (unlinkError) {
                console.error('Error cleaning up file:', unlinkError);
              }
            });
          }
          return res.status(400).json({ errors: errors.array() });
        }

        const { projectId } = req.params;
        const project = await Projet.findById(projectId);

        if (!project) {
          return res.status(404).json({ error: 'Projet non trouvé' });
        }

        if (!this.canCreateComment(req.user, project)) {
          return res.status(403).json({ error: 'Accès refusé pour créer un commentaire' });
        }

        // Traiter les pièces jointes
        const attachments = req.files ? req.files.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path
        })) : [];

        const commentData = JSON.parse(req.body.comment || '{}');
        commentData.project = projectId;
        commentData.author = req.user.id;
        commentData.attachments = attachments;

        const comment = new Comment(commentData);
        await comment.save();

        await comment.populate('author', 'username email avatar');

        res.status(201).json({
          message: 'Commentaire avec pièces jointes créé avec succès',
          comment
        });

      } catch (error) {
        console.error('Error creating comment with attachments:', error);

        // Nettoyer les fichiers en cas d'erreur
        if (req.files) {
          req.files.forEach(file => {
            try {
              fs.unlinkSync(file.path);
            } catch (unlinkError) {
              console.error('Error cleaning up file:', unlinkError);
            }
          });
        }

        res.status(500).json({
          error: 'Erreur lors de la création du commentaire',
          details: error.message
        });
      }
    });
  }

  /**
   * Répondre à un commentaire
   */
  async replyToComment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { commentId } = req.params;
      const parentComment = await Comment.findById(commentId);

      if (!parentComment) {
        return res.status(404).json({ error: 'Commentaire parent non trouvé' });
      }

      const project = await Projet.findById(parentComment.project);
      if (!this.canCreateComment(req.user, project)) {
        return res.status(403).json({ error: 'Accès refusé pour répondre' });
      }

      const replyData = {
        ...req.body,
        author: req.user.id
      };

      const reply = await parentComment.addReply(replyData);
      await reply.populate('author', 'username email avatar');

      res.status(201).json({
        message: 'Réponse ajoutée avec succès',
        reply
      });

    } catch (error) {
      console.error('Error replying to comment:', error);
      res.status(500).json({
        error: 'Erreur lors de la création de la réponse',
        details: error.message
      });
    }
  }

  /**
   * Modifier un commentaire
   */
  async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { content, reason = '' } = req.body;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Commentaire non trouvé' });
      }

      // Vérifier les permissions
      if (!this.canEditComment(req.user, comment)) {
        return res.status(403).json({ error: 'Accès refusé pour modifier ce commentaire' });
      }

      await comment.edit(content, req.user.id, reason);
      await comment.populate('author', 'username email avatar');

      res.json({
        message: 'Commentaire modifié avec succès',
        comment
      });

    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({
        error: 'Erreur lors de la modification du commentaire',
        details: error.message
      });
    }
  }

  /**
   * Supprimer un commentaire
   */
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const { permanent = false } = req.query;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Commentaire non trouvé' });
      }

      if (!this.canDeleteComment(req.user, comment)) {
        return res.status(403).json({ error: 'Accès refusé pour supprimer ce commentaire' });
      }

      if (permanent === 'true') {
        // Suppression définitive
        await Comment.deleteOne({ _id: commentId });
      } else {
        // Suppression logique
        comment.status = 'deleted';
        await comment.save();
      }

      // Nettoyer les pièces jointes si suppression définitive
      if (permanent === 'true' && comment.attachments.length > 0) {
        comment.attachments.forEach(attachment => {
          try {
            fs.unlinkSync(attachment.path);
          } catch (error) {
            console.error('Error deleting attachment:', error);
          }
        });
      }

      res.json({
        message: permanent === 'true' ? 'Commentaire supprimé définitivement' : 'Commentaire supprimé',
        permanent: permanent === 'true'
      });

    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({
        error: 'Erreur lors de la suppression du commentaire',
        details: error.message
      });
    }
  }

  /**
   * Ajouter ou modifier une réaction
   */
  async addReaction(req, res) {
    try {
      const { commentId } = req.params;
      const { reactionType } = req.body;

      if (!['like', 'love', 'laugh', 'surprised', 'sad', 'angry'].includes(reactionType)) {
        return res.status(400).json({ error: 'Type de réaction invalide' });
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Commentaire non trouvé' });
      }

      await comment.addReaction(req.user.id, reactionType);

      res.json({
        message: 'Réaction ajoutée',
        reactions: comment.reactions
      });

    } catch (error) {
      console.error('Error adding reaction:', error);
      res.status(500).json({
        error: 'Erreur lors de l\'ajout de la réaction',
        details: error.message
      });
    }
  }

  /**
   * Supprimer une réaction
   */
  async removeReaction(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Commentaire non trouvé' });
      }

      await comment.removeReaction(req.user.id);

      res.json({
        message: 'Réaction supprimée',
        reactions: comment.reactions
      });

    } catch (error) {
      console.error('Error removing reaction:', error);
      res.status(500).json({
        error: 'Erreur lors de la suppression de la réaction',
        details: error.message
      });
    }
  }

  /**
   * Marquer un commentaire comme résolu
   */
  async resolveComment(req, res) {
    try {
      const { commentId } = req.params;
      const { resolutionNote = '' } = req.body;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Commentaire non trouvé' });
      }

      await comment.resolve(req.user.id, resolutionNote);
      await comment.populate('resolution.resolvedBy', 'username');

      res.json({
        message: 'Commentaire marqué comme résolu',
        comment
      });

    } catch (error) {
      console.error('Error resolving comment:', error);
      res.status(500).json({
        error: 'Erreur lors de la résolution du commentaire',
        details: error.message
      });
    }
  }

  /**
   * Rechercher dans les commentaires
   */
  async searchComments(req, res) {
    try {
      const { projectId } = req.params;
      const { q: searchTerm, type, author, limit = 20 } = req.query;

      if (!searchTerm || searchTerm.trim().length < 2) {
        return res.status(400).json({ error: 'Terme de recherche trop court (min 2 caractères)' });
      }

      const project = await Projet.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Projet non trouvé' });
      }

      const options = {
        visibility: ['public', 'team'],
        type,
        author,
        limit: parseInt(limit)
      };

      const results = await Comment.searchComments(projectId, searchTerm, options);

      res.json({
        query: searchTerm,
        results,
        count: results.length
      });

    } catch (error) {
      console.error('Error searching comments:', error);
      res.status(500).json({
        error: 'Erreur lors de la recherche',
        details: error.message
      });
    }
  }

  /**
   * Récupérer les mentions d'un utilisateur
   */
  async getUserMentions(req, res) {
    try {
      const { unreadOnly = false, limit = 50, page = 1 } = req.query;

      const options = {
        unreadOnly: unreadOnly === 'true',
        limit: parseInt(limit),
        page: parseInt(page)
      };

      const mentions = await Comment.getUserMentions(req.user.id, options);

      res.json({
        mentions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });

    } catch (error) {
      console.error('Error fetching user mentions:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des mentions',
        details: error.message
      });
    }
  }

  /**
   * Récupérer les statistiques de commentaires
   */
  async getCommentStats(req, res) {
    try {
      const { projectId } = req.params;
      const { days = 30 } = req.query;

      const stats = await Comment.getCommentStats(projectId, parseInt(days));

      res.json({
        projectId,
        period: `${days} derniers jours`,
        stats: stats[0] || {
          total: 0,
          byType: {},
          byAuthor: {},
          totalReactions: 0,
          totalViews: 0,
          resolved: 0
        }
      });

    } catch (error) {
      console.error('Error fetching comment stats:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des statistiques',
        details: error.message
      });
    }
  }

  /**
   * Récupérer l'activité récente
   */
  async getRecentActivity(req, res) {
    try {
      const { projectId } = req.params;
      const { limit = 10 } = req.query;

      const activity = await Comment.getRecentActivity(projectId, parseInt(limit));

      res.json({
        projectId,
        activity,
        count: activity.length
      });

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération de l\'activité récente',
        details: error.message
      });
    }
  }

  /**
   * Télécharger une pièce jointe
   */
  async downloadAttachment(req, res) {
    try {
      const { commentId, attachmentId } = req.params;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Commentaire non trouvé' });
      }

      const attachment = comment.attachments.id(attachmentId);

      if (!attachment) {
        return res.status(404).json({ error: 'Pièce jointe non trouvée' });
      }

      // Vérifier les permissions
      const project = await Projet.findById(comment.project);
      if (!this.canViewComments(req.user, project, comment.visibility)) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      // Vérifier que le fichier existe
      if (!fs.existsSync(attachment.path)) {
        return res.status(404).json({ error: 'Fichier non trouvé sur le serveur' });
      }

      res.download(attachment.path, attachment.originalName);

    } catch (error) {
      console.error('Error downloading attachment:', error);
      res.status(500).json({
        error: 'Erreur lors du téléchargement',
        details: error.message
      });
    }
  }

  // Méthodes utilitaires pour les permissions
  canViewComments(user, project, visibility) {
    // Admin peut tout voir
    if (user.role === 'admin') return true;

    // Propriétaire du projet
    if (project.team?.projectManager?.toString() === user.id) return true;

    // Membre de l'équipe
    if (project.team?.members?.some(member => member.user.toString() === user.id)) {
      return ['public', 'team'].includes(visibility);
    }

    // Commentaires publics seulement pour les autres
    return visibility === 'public';
  }

  canCreateComment(user, project) {
    // Admin peut toujours créer
    if (user.role === 'admin') return true;

    // Chef de projet peut créer
    if (project.team?.projectManager?.toString() === user.id) return true;

    // Membres de l'équipe peuvent créer
    return project.team?.members?.some(member => member.user.toString() === user.id);
  }

  canEditComment(user, comment) {
    // Admin peut modifier
    if (user.role === 'admin') return true;

    // Auteur peut modifier dans les 24h
    if (comment.author.toString() === user.id) {
      const hoursSinceCreation = (new Date() - comment.createdAt) / (1000 * 60 * 60);
      return hoursSinceCreation < 24;
    }

    return false;
  }

  canDeleteComment(user, comment) {
    // Admin peut supprimer
    if (user.role === 'admin') return true;

    // Auteur peut supprimer
    if (comment.author.toString() === user.id) return true;

    // Chef de projet peut supprimer les commentaires de son projet
    // Cette vérification nécessiterait de charger le projet, ce qui est fait dans la méthode appelante

    return false;
  }
}

module.exports = new CommentController();