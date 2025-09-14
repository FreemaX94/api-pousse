const ProjectTemplate = require('../models/ProjectTemplate');
const Projet = require('../models/Projet');
const { validationResult } = require('express-validator');

class TemplateController {
  /**
   * Récupérer tous les templates actifs
   */
  async getAllTemplates(req, res) {
    try {
      const {
        category,
        type,
        difficulty,
        search,
        limit = 50,
        page = 1,
        sortBy = 'usage.timesUsed',
        sortOrder = 'desc'
      } = req.query;

      const filters = { isActive: true };

      // Filtres
      if (category) filters.category = category;
      if (type) filters.type = type;
      if (difficulty) filters['metadata.difficulty'] = difficulty;

      let query;
      if (search) {
        // Recherche textuelle
        query = ProjectTemplate.searchTemplates(search, filters);
      } else {
        query = ProjectTemplate.find(filters);
      }

      // Tri
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      query = query.sort(sortOptions);

      // Pagination
      const skip = (page - 1) * parseInt(limit);
      query = query.skip(skip).limit(parseInt(limit));

      const templates = await query;
      const total = await ProjectTemplate.countDocuments(filters);

      res.json({
        templates,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des templates',
        details: error.message
      });
    }
  }

  /**
   * Récupérer un template par ID
   */
  async getTemplateById(req, res) {
    try {
      const { id } = req.params;

      const template = await ProjectTemplate.findOne({
        _id: id,
        isActive: true
      }).populate('createdBy', 'username email');

      if (!template) {
        return res.status(404).json({ error: 'Template non trouvé' });
      }

      res.json(template);
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération du template',
        details: error.message
      });
    }
  }

  /**
   * Récupérer les templates populaires
   */
  async getPopularTemplates(req, res) {
    try {
      const { limit = 10 } = req.query;

      const templates = await ProjectTemplate.getPopularTemplates(parseInt(limit));

      res.json(templates);
    } catch (error) {
      console.error('Error fetching popular templates:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des templates populaires',
        details: error.message
      });
    }
  }

  /**
   * Récupérer les templates par catégorie
   */
  async getTemplatesByCategory(req, res) {
    try {
      const { category } = req.params;

      const templates = await ProjectTemplate.getTemplatesByCategory(category);

      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des templates par catégorie',
        details: error.message
      });
    }
  }

  /**
   * Créer un nouveau template
   */
  async createTemplate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const templateData = {
        ...req.body,
        createdBy: req.user.id, // Assumé depuis le middleware d'auth
        isPublic: req.body.isPublic || false
      };

      const template = new ProjectTemplate(templateData);
      await template.save();

      res.status(201).json({
        message: 'Template créé avec succès',
        template
      });
    } catch (error) {
      console.error('Error creating template:', error);

      if (error.code === 11000) {
        return res.status(400).json({
          error: 'Un template avec ce nom existe déjà'
        });
      }

      res.status(500).json({
        error: 'Erreur lors de la création du template',
        details: error.message
      });
    }
  }

  /**
   * Mettre à jour un template
   */
  async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const template = await ProjectTemplate.findOneAndUpdate(
        {
          _id: id,
          $or: [
            { createdBy: req.user.id },
            { isPublic: true } // Permettre modification des templates publics par admin
          ]
        },
        {
          ...req.body,
          version: { $inc: 1 } // Incrémenter la version
        },
        { new: true, runValidators: true }
      );

      if (!template) {
        return res.status(404).json({
          error: 'Template non trouvé ou accès refusé'
        });
      }

      res.json({
        message: 'Template mis à jour avec succès',
        template
      });
    } catch (error) {
      console.error('Error updating template:', error);
      res.status(500).json({
        error: 'Erreur lors de la mise à jour du template',
        details: error.message
      });
    }
  }

  /**
   * Supprimer (désactiver) un template
   */
  async deleteTemplate(req, res) {
    try {
      const { id } = req.params;

      const template = await ProjectTemplate.findOneAndUpdate(
        {
          _id: id,
          createdBy: req.user.id
        },
        { isActive: false },
        { new: true }
      );

      if (!template) {
        return res.status(404).json({
          error: 'Template non trouvé ou accès refusé'
        });
      }

      res.json({
        message: 'Template désactivé avec succès',
        template
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      res.status(500).json({
        error: 'Erreur lors de la suppression du template',
        details: error.message
      });
    }
  }

  /**
   * Créer un projet à partir d'un template
   */
  async createProjectFromTemplate(req, res) {
    try {
      const { id } = req.params;
      const { projectData } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const template = await ProjectTemplate.findOne({
        _id: id,
        isActive: true
      });

      if (!template) {
        return res.status(404).json({ error: 'Template non trouvé' });
      }

      // Créer les données du projet à partir du template
      const projectFromTemplate = template.createProject(projectData);

      // Créer le projet
      const project = new Projet(projectFromTemplate);
      await project.save();

      // Mettre à jour les statistiques d'utilisation du template
      await template.updateUsageStats();

      res.status(201).json({
        message: 'Projet créé avec succès à partir du template',
        project,
        templateUsed: {
          id: template._id,
          name: template.name
        }
      });
    } catch (error) {
      console.error('Error creating project from template:', error);
      res.status(500).json({
        error: 'Erreur lors de la création du projet depuis le template',
        details: error.message
      });
    }
  }

  /**
   * Dupliquer un template
   */
  async duplicateTemplate(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const originalTemplate = await ProjectTemplate.findOne({
        _id: id,
        isActive: true
      });

      if (!originalTemplate) {
        return res.status(404).json({ error: 'Template non trouvé' });
      }

      // Créer une copie
      const duplicatedData = originalTemplate.toObject();
      delete duplicatedData._id;
      delete duplicatedData.createdAt;
      delete duplicatedData.updatedAt;

      duplicatedData.name = name || `${originalTemplate.name} - Copie`;
      duplicatedData.description = description || originalTemplate.description;
      duplicatedData.createdBy = req.user.id;
      duplicatedData.isPublic = false;
      duplicatedData.version = 1;
      duplicatedData.usage = {
        timesUsed: 0,
        lastUsed: null
      };

      const duplicatedTemplate = new ProjectTemplate(duplicatedData);
      await duplicatedTemplate.save();

      res.status(201).json({
        message: 'Template dupliqué avec succès',
        template: duplicatedTemplate,
        original: originalTemplate._id
      });
    } catch (error) {
      console.error('Error duplicating template:', error);

      if (error.code === 11000) {
        return res.status(400).json({
          error: 'Un template avec ce nom existe déjà'
        });
      }

      res.status(500).json({
        error: 'Erreur lors de la duplication du template',
        details: error.message
      });
    }
  }

  /**
   * Obtenir les statistiques des templates
   */
  async getTemplateStats(req, res) {
    try {
      const stats = await ProjectTemplate.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalTemplates: { $sum: 1 },
            totalUsages: { $sum: '$usage.timesUsed' },
            avgUsage: { $avg: '$usage.timesUsed' },
            categoryBreakdown: {
              $push: {
                category: '$category',
                type: '$type',
                usage: '$usage.timesUsed'
              }
            }
          }
        }
      ]);

      const categoryStats = await ProjectTemplate.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalUsage: { $sum: '$usage.timesUsed' },
            avgBudget: { $avg: '$usage.avgBudget' },
            avgDuration: { $avg: '$usage.avgDuration' }
          }
        }
      ]);

      res.json({
        overview: stats[0] || {
          totalTemplates: 0,
          totalUsages: 0,
          avgUsage: 0
        },
        byCategory: categoryStats
      });
    } catch (error) {
      console.error('Error fetching template stats:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des statistiques',
        details: error.message
      });
    }
  }
}

module.exports = new TemplateController();