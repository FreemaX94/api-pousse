/**
 * @swagger
 * components:
 *   schemas:
 *     Evenement:
 *       type: object
 *       required:
 *         - nom
 *         - dateDebut
 *         - dateFin
 *         - lieu
 *       properties:
 *         id:
 *           type: string
 *           description: ID de l'événement
 *         nom:
 *           type: string
 *           description: Nom de l'événement
 *         dateDebut:
 *           type: string
 *           format: date-time
 *           description: Date de début de l'événement
 *         dateFin:
 *           type: string
 *           format: date-time
 *           description: Date de fin de l'événement
 *         lieu:
 *           type: string
 *           description: Lieu de l'événement
 *         client:
 *           type: string
 *           description: Client ou contact
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   - name: Evenements
 *     description: API pour gérer les événements
 */

const express = require('express');
const router = express.Router();

// Validators
const {
  createEvenementValidator,
  updateEvenementValidator,
  getEvenementValidator,
  deleteEvenementValidator
} = require('../../projects/validators/evenementValidator');

// Controller
const {
  getAllEvenements,
  getEvenementById,
  createEvenement,
  updateEvenement,
  deleteEvenement
} = require('../controllers/evenementController');

/**
 * @swagger
 * /api/evenements:
 *   get:
 *     summary: Liste tous les événements
 *     tags:
 *       - Evenements
 *     responses:
 *       200:
 *         description: Liste d'événements récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evenement'
 */
router.get('/', getAllEvenements);

/**
 * @swagger
 * /api/evenements/{id}:
 *   get:
 *     summary: Récupère un événement par son ID
 *     tags:
 *       - Evenements
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'événement
 *     responses:
 *       200:
 *         description: Détails de l'événement récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evenement'
 *       404:
 *         description: Événement non trouvé
 */
router.get('/:id', getEvenementValidator, getEvenementById);

/**
 * @swagger
 * /api/evenements:
 *   post:
 *     summary: Crée un nouvel événement
 *     tags:
 *       - Evenements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evenement'
 *     responses:
 *       201:
 *         description: Événement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evenement'
 */
router.post('/', createEvenementValidator, createEvenement);

/**
 * @swagger
 * /api/evenements/{id}:
 *   put:
 *     summary: Met à jour un événement existant
 *     tags:
 *       - Evenements
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'événement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evenement'
 *     responses:
 *       200:
 *         description: Événement mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evenement'
 *       404:
 *         description: Événement non trouvé pour mise à jour
 */
router.put('/:id', updateEvenementValidator, updateEvenement);

/**
 * @swagger
 * /api/evenements/{id}:
 *   delete:
 *     summary: Supprime un événement par son ID
 *     tags:
 *       - Evenements
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'événement à supprimer
 *     responses:
 *       204:
 *         description: Événement supprimé avec succès (pas de contenu)
 *       404:
 *         description: Événement non trouvé pour suppression
 */
router.delete('/:id', deleteEvenementValidator, deleteEvenement);

module.exports = router;
