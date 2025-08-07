const Entretien = require('../models/Entretien');
const { validationResult } = require('express-validator');

class EntretienController {
  // Récupérer tous les entretiens avec pagination et filtres
  async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        statut,
        typeClient,
        typeContrat,
        search,
        dateDebut,
        dateFin,
        priorite,
        archive = false
      } = req.query;

      // Construction du filtre
      const filter = {
        'metadata.archive': archive === 'true'
      };

      if (statut) filter.statut = statut;
      if (typeClient) filter['client.typeClient'] = typeClient;
      if (typeContrat) filter.typeContrat = typeContrat;
      if (priorite) filter.priorite = priorite;

      // Filtre par date
      if (dateDebut || dateFin) {
        filter['planification.dateDebut'] = {};
        if (dateDebut) filter['planification.dateDebut'].$gte = new Date(dateDebut);
        if (dateFin) filter['planification.dateDebut'].$lte = new Date(dateFin);
      }

      // Recherche textuelle
      if (search) {
        filter.$or = [
          { 'client.nom': { $regex: search, $options: 'i' } },
          { titre: { $regex: search, $options: 'i' } },
          { numeroEntretien: { $regex: search, $options: 'i' } }
        ];
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { 'planification.dateDebut': -1 },
        populate: [
          { path: 'contrat', select: 'numeroContrat statut' },
          { path: 'metadata.creePar', select: 'nom prenom' }
        ]
      };

      const entretiens = await Entretien.paginate(filter, options);

      res.status(200).json({
        success: true,
        data: entretiens.docs,
        pagination: {
          total: entretiens.totalDocs,
          pages: entretiens.totalPages,
          page: entretiens.page,
          limit: entretiens.limit,
          hasNext: entretiens.hasNextPage,
          hasPrev: entretiens.hasPrevPage
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des entretiens',
        error: error.message
      });
    }
  }

  // Récupérer un entretien par ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const entretien = await Entretien.findById(id)
        .populate('contrat')
        .populate('metadata.creePar', 'nom prenom email')
        .populate('metadata.modifiePar', 'nom prenom email');

      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        data: entretien
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'entretien',
        error: error.message
      });
    }
  }

  // Créer un nouvel entretien
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const entretienData = {
        ...req.body,
        metadata: {
          ...req.body.metadata,
          creePar: req.user._id
        }
      };

      const entretien = new Entretien(entretienData);
      
      // Calculer le montant estimé si les données sont présentes
      if (entretien.techniciens?.length > 0 || entretien.materiel?.length > 0) {
        entretien.calculerMontantEstime();
      }

      await entretien.save();

      await entretien.populate([
        { path: 'contrat', select: 'numeroContrat statut' },
        { path: 'metadata.creePar', select: 'nom prenom' }
      ]);

      res.status(201).json({
        success: true,
        message: 'Entretien créé avec succès',
        data: entretien
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Erreur de validation',
          errors: Object.values(error.errors).map(e => ({
            field: e.path,
            message: e.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'entretien',
        error: error.message
      });
    }
  }

  // Mettre à jour un entretien
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      
      const updateData = {
        ...req.body,
        'metadata.modifiePar': req.user._id
      };

      const entretien = await Entretien.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate([
        { path: 'contrat', select: 'numeroContrat statut' },
        { path: 'metadata.modifiePar', select: 'nom prenom' }
      ]);

      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      // Recalculer le montant estimé si nécessaire
      if (updateData.techniciens || updateData.materiel) {
        entretien.calculerMontantEstime();
        await entretien.save();
      }

      res.status(200).json({
        success: true,
        message: 'Entretien mis à jour avec succès',
        data: entretien
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Erreur de validation',
          errors: Object.values(error.errors).map(e => ({
            field: e.path,
            message: e.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'entretien',
        error: error.message
      });
    }
  }

  // Supprimer un entretien (archivage)
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const entretien = await Entretien.findByIdAndUpdate(
        id,
        {
          'metadata.archive': true,
          'metadata.dateArchivage': new Date(),
          'metadata.modifiePar': req.user._id
        },
        { new: true }
      );

      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Entretien archivé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'archivage de l\'entretien',
        error: error.message
      });
    }
  }

  // Actions spécifiques
  async demarrer(req, res) {
    try {
      const { id } = req.params;
      
      const entretien = await Entretien.findById(id);
      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      await entretien.demarrer(req.user._id);

      res.status(200).json({
        success: true,
        message: 'Entretien démarré avec succès',
        data: entretien
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async terminer(req, res) {
    try {
      const { id } = req.params;
      const { compteRendu } = req.body;
      
      const entretien = await Entretien.findById(id);
      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      await entretien.terminer(req.user._id, compteRendu);

      res.status(200).json({
        success: true,
        message: 'Entretien terminé avec succès',
        data: entretien
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async reporter(req, res) {
    try {
      const { id } = req.params;
      const { nouvelleDate, raison } = req.body;
      
      if (!nouvelleDate || !raison) {
        return res.status(400).json({
          success: false,
          message: 'La nouvelle date et la raison sont requises'
        });
      }

      const entretien = await Entretien.findById(id);
      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      await entretien.reporter(new Date(nouvelleDate), raison, req.user._id);

      res.status(200).json({
        success: true,
        message: 'Entretien reporté avec succès',
        data: entretien
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async annuler(req, res) {
    try {
      const { id } = req.params;
      const { raison } = req.body;
      
      if (!raison) {
        return res.status(400).json({
          success: false,
          message: 'La raison d\'annulation est requise'
        });
      }

      const entretien = await Entretien.findById(id);
      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      await entretien.annuler(raison, req.user._id);

      res.status(200).json({
        success: true,
        message: 'Entretien annulé avec succès',
        data: entretien
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Gestion des problèmes
  async ajouterProbleme(req, res) {
    try {
      const { id } = req.params;
      const problemeData = req.body;
      
      const entretien = await Entretien.findById(id);
      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      await entretien.ajouterProbleme(problemeData);

      res.status(200).json({
        success: true,
        message: 'Problème ajouté avec succès',
        data: entretien
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async resoudreProbleme(req, res) {
    try {
      const { id, problemeId } = req.params;
      const { solution } = req.body;
      
      const entretien = await Entretien.findById(id);
      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      await entretien.resoudreProbleme(problemeId, solution);

      res.status(200).json({
        success: true,
        message: 'Problème résolu avec succès',
        data: entretien
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Rapports et documents
  async genererRapport(req, res) {
    try {
      const { id } = req.params;
      
      const entretien = await Entretien.findById(id);
      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      await entretien.genererRapport();

      res.status(200).json({
        success: true,
        message: 'Rapport généré avec succès',
        data: entretien
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Statistiques et données agrégées
  async getStatistiques(req, res) {
    try {
      const stats = await Entretien.getStatistiques();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }

  async getPlanifies(req, res) {
    try {
      const entretiens = await Entretien.findPlanifies();
      
      res.status(200).json({
        success: true,
        data: entretiens
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des entretiens planifiés',
        error: error.message
      });
    }
  }

  async getEnCours(req, res) {
    try {
      const entretiens = await Entretien.findEnCours();
      
      res.status(200).json({
        success: true,
        data: entretiens
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des entretiens en cours',
        error: error.message
      });
    }
  }

  async getEnRetard(req, res) {
    try {
      const entretiens = await Entretien.findEnRetard();
      
      res.status(200).json({
        success: true,
        data: entretiens
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des entretiens en retard',
        error: error.message
      });
    }
  }

  async getParClient(req, res) {
    try {
      const { clientNom } = req.params;
      const entretiens = await Entretien.findParClient(clientNom);
      
      res.status(200).json({
        success: true,
        data: entretiens
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des entretiens du client',
        error: error.message
      });
    }
  }

  // Commentaires
  async ajouterCommentaire(req, res) {
    try {
      const { id } = req.params;
      const { message, type = 'interne' } = req.body;
      
      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Le message est requis'
        });
      }

      const entretien = await Entretien.findByIdAndUpdate(
        id,
        {
          $push: {
            commentaires: {
              auteur: req.user._id,
              message,
              type
            }
          }
        },
        { new: true }
      ).populate('commentaires.auteur', 'nom prenom');

      if (!entretien) {
        return res.status(404).json({
          success: false,
          message: 'Entretien non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Commentaire ajouté avec succès',
        data: entretien
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'ajout du commentaire',
        error: error.message
      });
    }
  }
}

module.exports = new EntretienController();