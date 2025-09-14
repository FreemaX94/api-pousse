const exportService = require('../services/exportService');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');

class ExportController {
  /**
   * Export d'un projet au format PDF
   */
  async exportProjectPDF(req, res) {
    try {
      const { projectId } = req.params;
      const options = req.body.options || {};

      const result = await exportService.exportProjectToPDF(projectId, options);

      // Headers pour téléchargement
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.size);

      // Stream du fichier
      const fileStream = fs.createReadStream(result.filepath);
      fileStream.pipe(res);

      // Nettoyer le fichier après envoi
      fileStream.on('end', () => {
        setTimeout(() => {
          try {
            fs.unlinkSync(result.filepath);
          } catch (error) {
            console.error('Error cleaning up PDF file:', error);
          }
        }, 1000);
      });

    } catch (error) {
      console.error('Error exporting project to PDF:', error);

      if (error.message === 'Projet non trouvé') {
        return res.status(404).json({ error: error.message });
      }

      res.status(500).json({
        error: 'Erreur lors de l\'export PDF',
        details: error.message
      });
    }
  }

  /**
   * Export du planning au format Excel
   */
  async exportPlanningExcel(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const filters = {
        status: req.query.status,
        type: req.query.type,
        category: req.query.category,
        priority: req.query.priority,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        projectManager: req.query.projectManager
      };

      // Supprimer les filtres vides
      Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
      });

      const options = req.body.options || {};

      const result = await exportService.exportPlanningToExcel(filters, options);

      // Headers pour téléchargement
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.size);

      // Stream du fichier
      const fileStream = fs.createReadStream(result.filepath);
      fileStream.pipe(res);

      // Nettoyer le fichier après envoi
      fileStream.on('end', () => {
        setTimeout(() => {
          try {
            fs.unlinkSync(result.filepath);
          } catch (error) {
            console.error('Error cleaning up Excel file:', error);
          }
        }, 1000);
      });

    } catch (error) {
      console.error('Error exporting planning to Excel:', error);
      res.status(500).json({
        error: 'Erreur lors de l\'export Excel',
        details: error.message
      });
    }
  }

  /**
   * Export du calendrier mensuel au format PDF
   */
  async exportCalendarPDF(req, res) {
    try {
      const { year, month } = req.params;
      const options = req.body.options || {};

      // Validation des paramètres
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);

      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
          error: 'Paramètres invalides. Année et mois requis (mois: 1-12)'
        });
      }

      const result = await exportService.exportCalendarToPDF(yearNum, monthNum, options);

      // Headers pour téléchargement
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.size);

      // Stream du fichier
      const fileStream = fs.createReadStream(result.filepath);
      fileStream.pipe(res);

      // Nettoyer le fichier après envoi
      fileStream.on('end', () => {
        setTimeout(() => {
          try {
            fs.unlinkSync(result.filepath);
          } catch (error) {
            console.error('Error cleaning up calendar PDF file:', error);
          }
        }, 1000);
      });

    } catch (error) {
      console.error('Error exporting calendar to PDF:', error);
      res.status(500).json({
        error: 'Erreur lors de l\'export du calendrier',
        details: error.message
      });
    }
  }

  /**
   * Prévisualisation d'un export (métadonnées sans génération complète)
   */
  async previewExport(req, res) {
    try {
      const { type } = req.params; // 'project', 'planning', 'calendar'
      const filters = req.query;

      let preview = {};

      switch (type) {
        case 'project':
          if (!req.query.projectId) {
            return res.status(400).json({ error: 'ID du projet requis' });
          }

          const Projet = require('../models/Projet');
          const project = await Projet.findById(req.query.projectId);

          if (!project) {
            return res.status(404).json({ error: 'Projet non trouvé' });
          }

          preview = {
            type: 'project',
            title: project.title,
            projectId: project.projectId,
            estimatedSize: '2-5 MB',
            pages: Math.ceil((
              1 + // Info générales
              (project.tasks.length / 10) + // Tâches (10 par page)
              (project.materials?.length ? Math.ceil(project.materials.length / 20) : 0) + // Matériaux
              (project.milestones?.length ? Math.ceil(project.milestones.length / 15) : 0) + // Jalons
              1 // Footer
            )),
            sections: [
              'Informations générales',
              'Timeline et jalons',
              'Équipe',
              'Tâches',
              'Budget',
              'Matériaux'
            ].filter(Boolean)
          };
          break;

        case 'planning':
          // Simuler un comptage rapide des projets
          const Projet2 = require('../models/Projet');
          const query = exportService.buildProjectQuery(filters);
          const projectCount = await Projet2.countDocuments(query);

          preview = {
            type: 'planning',
            title: 'Planning général',
            estimatedSize: `${Math.ceil(projectCount / 100)} MB`,
            projectCount,
            sheets: [
              'Vue d\'ensemble',
              'Projets détaillés',
              'Tâches',
              'Ressources',
              'Timeline',
              'Statistiques'
            ],
            filters: Object.keys(filters).filter(key => filters[key])
          };
          break;

        case 'calendar':
          const { year, month } = req.query;
          if (!year || !month) {
            return res.status(400).json({ error: 'Année et mois requis' });
          }

          preview = {
            type: 'calendar',
            title: `Calendrier ${month}/${year}`,
            estimatedSize: '1-3 MB',
            pages: 1,
            month: parseInt(month),
            year: parseInt(year),
            features: [
              'Grille calendrier',
              'Projets du mois',
              'Légende couleurs',
              'Statistiques mensuelles'
            ]
          };
          break;

        default:
          return res.status(400).json({ error: 'Type d\'export non supporté' });
      }

      preview.estimatedTime = '30-60 secondes';
      preview.formats = type === 'planning' ? ['Excel'] : ['PDF'];

      res.json(preview);

    } catch (error) {
      console.error('Error generating export preview:', error);
      res.status(500).json({
        error: 'Erreur lors de la prévisualisation',
        details: error.message
      });
    }
  }

  /**
   * Liste des exports récents (métadonnées)
   */
  async getRecentExports(req, res) {
    try {
      const { limit = 10 } = req.query;
      const exportsDir = exportService.exportsDir;

      if (!fs.existsSync(exportsDir)) {
        return res.json({ exports: [] });
      }

      const files = fs.readdirSync(exportsDir)
        .map(filename => {
          const filepath = path.join(exportsDir, filename);
          const stats = fs.statSync(filepath);

          return {
            filename,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            type: path.extname(filename).toLowerCase(),
            sizeFormatted: this.formatFileSize(stats.size)
          };
        })
        .sort((a, b) => b.created - a.created)
        .slice(0, parseInt(limit));

      res.json({ exports: files });

    } catch (error) {
      console.error('Error fetching recent exports:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des exports récents',
        details: error.message
      });
    }
  }

  /**
   * Téléchargement d'un export existant
   */
  async downloadExport(req, res) {
    try {
      const { filename } = req.params;

      // Sécurité: vérifier que le nom de fichier est valide
      if (!/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
        return res.status(400).json({ error: 'Nom de fichier invalide' });
      }

      const filepath = path.join(exportService.exportsDir, filename);

      if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: 'Fichier d\'export non trouvé' });
      }

      const stats = fs.statSync(filepath);
      const ext = path.extname(filename).toLowerCase();

      // Déterminer le type MIME
      let mimeType = 'application/octet-stream';
      if (ext === '.pdf') mimeType = 'application/pdf';
      else if (ext === '.xlsx') mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      // Headers pour téléchargement
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', stats.size);

      // Stream du fichier
      const fileStream = fs.createReadStream(filepath);
      fileStream.pipe(res);

    } catch (error) {
      console.error('Error downloading export:', error);
      res.status(500).json({
        error: 'Erreur lors du téléchargement',
        details: error.message
      });
    }
  }

  /**
   * Suppression d'un export
   */
  async deleteExport(req, res) {
    try {
      const { filename } = req.params;

      // Sécurité: vérifier que le nom de fichier est valide
      if (!/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
        return res.status(400).json({ error: 'Nom de fichier invalide' });
      }

      const filepath = path.join(exportService.exportsDir, filename);

      if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: 'Fichier d\'export non trouvé' });
      }

      fs.unlinkSync(filepath);

      res.json({
        message: 'Export supprimé avec succès',
        filename
      });

    } catch (error) {
      console.error('Error deleting export:', error);
      res.status(500).json({
        error: 'Erreur lors de la suppression',
        details: error.message
      });
    }
  }

  /**
   * Nettoyage des anciens exports
   */
  async cleanupExports(req, res) {
    try {
      const { maxAge = 24 } = req.query; // heures
      const maxAgeMs = parseInt(maxAge) * 60 * 60 * 1000;

      exportService.cleanupOldExports(maxAgeMs);

      res.json({
        message: `Nettoyage effectué - fichiers de plus de ${maxAge}h supprimés`,
        maxAge: `${maxAge}h`
      });

    } catch (error) {
      console.error('Error cleaning up exports:', error);
      res.status(500).json({
        error: 'Erreur lors du nettoyage',
        details: error.message
      });
    }
  }

  /**
   * Statistiques des exports
   */
  async getExportStats(req, res) {
    try {
      const exportsDir = exportService.exportsDir;

      if (!fs.existsSync(exportsDir)) {
        return res.json({
          totalFiles: 0,
          totalSize: 0,
          totalSizeFormatted: '0 B',
          byType: {},
          oldest: null,
          newest: null
        });
      }

      const files = fs.readdirSync(exportsDir);
      let totalSize = 0;
      const byType = {};
      let oldest = null;
      let newest = null;

      files.forEach(filename => {
        const filepath = path.join(exportsDir, filename);
        const stats = fs.statSync(filepath);
        const ext = path.extname(filename).toLowerCase();

        totalSize += stats.size;
        byType[ext] = (byType[ext] || 0) + 1;

        if (!oldest || stats.birthtime < oldest) oldest = stats.birthtime;
        if (!newest || stats.birthtime > newest) newest = stats.birthtime;
      });

      res.json({
        totalFiles: files.length,
        totalSize,
        totalSizeFormatted: this.formatFileSize(totalSize),
        byType,
        oldest,
        newest,
        avgSize: files.length > 0 ? Math.round(totalSize / files.length) : 0,
        avgSizeFormatted: files.length > 0 ? this.formatFileSize(Math.round(totalSize / files.length)) : '0 B'
      });

    } catch (error) {
      console.error('Error getting export stats:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des statistiques',
        details: error.message
      });
    }
  }

  // Méthode utilitaire pour formater la taille des fichiers
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = new ExportController();