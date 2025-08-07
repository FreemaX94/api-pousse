const express = require('express');
const router = express.Router();
const rbacService = require('../services/rbacService');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { 
  requirePermission, 
  requireMinimumRole, 
  getUserPermissions,
  auditPermissionUsage
} = require('../middlewares/rbacMiddleware');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         resource:
 *           type: string
 *         action:
 *           type: string
 *         description:
 *           type: string
 *         module:
 *           type: string
 *     Role:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         displayName:
 *           type: string
 *         description:
 *           type: string
 *         level:
 *           type: number
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 */

/**
 * @swagger
 * /api/rbac/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *         description: Filter by module
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get('/permissions', 
  authenticateToken,
  requirePermission('user', 'read'),
  auditPermissionUsage('user', 'read'),
  async (req, res) => {
    try {
      const { module } = req.query;
      
      const filter = { isActive: true };
      if (module) {
        filter.module = module;
      }

      const permissions = await Permission.find(filter)
        .sort({ module: 1, resource: 1, action: 1 });

      const groupedByModule = permissions.reduce((acc, perm) => {
        if (!acc[perm.module]) {
          acc[perm.module] = [];
        }
        acc[perm.module].push({
          id: perm._id,
          name: perm.getFullName(),
          resource: perm.resource,
          action: perm.action,
          description: perm.description
        });
        return acc;
      }, {});

      res.json({
        permissions: groupedByModule,
        total: permissions.length,
        modules: Object.keys(groupedByModule)
      });
    } catch (error) {
      logger.error('Failed to get permissions', error);
      res.status(500).json({
        error: 'Failed to retrieve permissions',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/rbac/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get('/roles',
  authenticateToken,
  requirePermission('user', 'read'),
  auditPermissionUsage('user', 'read'),
  async (req, res) => {
    try {
      const roles = await Role.find({ isActive: true })
        .populate('permissions')
        .sort({ level: -1 });

      const rolesData = roles.map(role => ({
        id: role._id,
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        level: role.level,
        isSystem: role.isSystem,
        color: role.color,
        permissionCount: role.permissions.length,
        permissions: role.permissions.map(perm => ({
          id: perm._id,
          name: perm.getFullName(),
          description: perm.description
        }))
      }));

      res.json({
        roles: rolesData,
        total: roles.length
      });
    } catch (error) {
      logger.error('Failed to get roles', error);
      res.status(500).json({
        error: 'Failed to retrieve roles',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/rbac/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               displayName:
 *                 type: string
 *               description:
 *                 type: string
 *               level:
 *                 type: number
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Role created successfully
 */
router.post('/roles',
  authenticateToken,
  requirePermission('user', 'manage'),
  auditPermissionUsage('user', 'manage'),
  async (req, res) => {
    try {
      const { name, displayName, description, level, permissions, color } = req.body;

      if (!name || !displayName || !description || !level) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['name', 'displayName', 'description', 'level']
        });
      }

      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(409).json({
          error: 'Role already exists',
          name
        });
      }

      let validPermissions = [];
      if (permissions && permissions.length > 0) {
        validPermissions = await Permission.find({
          _id: { $in: permissions },
          isActive: true
        });
      }

      const role = await rbacService.createCustomRole({
        name,
        displayName,
        description,
        level: Math.min(level, 89), // Prevent creating roles higher than admin
        permissions: validPermissions.map(p => p._id),
        color: color || '#6B7280'
      }, req.user.id);

      logger.info('Role created', {
        roleId: role._id,
        roleName: role.name,
        createdBy: req.user.id,
        permissionCount: validPermissions.length
      });

      res.status(201).json({
        message: 'Role created successfully',
        role: {
          id: role._id,
          name: role.name,
          displayName: role.displayName,
          description: role.description,
          level: role.level,
          permissionCount: validPermissions.length
        }
      });
    } catch (error) {
      logger.error('Failed to create role', error);
      res.status(500).json({
        error: 'Failed to create role',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/rbac/roles/{roleId}/permissions:
 *   put:
 *     summary: Update role permissions
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Permissions updated successfully
 */
router.put('/roles/:roleId/permissions',
  authenticateToken,
  requirePermission('user', 'manage'),
  auditPermissionUsage('user', 'manage'),
  async (req, res) => {
    try {
      const { roleId } = req.params;
      const { permissions } = req.body;

      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({
          error: 'Role not found'
        });
      }

      if (role.isSystem) {
        return res.status(403).json({
          error: 'Cannot modify system roles'
        });
      }

      const validPermissions = await Permission.find({
        _id: { $in: permissions },
        isActive: true
      });

      role.permissions = validPermissions.map(p => p._id);
      await role.save();

      await rbacService.refreshCache();

      logger.info('Role permissions updated', {
        roleId: role._id,
        roleName: role.name,
        updatedBy: req.user.id,
        newPermissionCount: validPermissions.length
      });

      res.json({
        message: 'Role permissions updated successfully',
        role: {
          id: role._id,
          name: role.name,
          permissionCount: validPermissions.length
        }
      });
    } catch (error) {
      logger.error('Failed to update role permissions', error);
      res.status(500).json({
        error: 'Failed to update role permissions',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/rbac/users/{userId}/roles:
 *   get:
 *     summary: Get user roles and permissions
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User roles and permissions
 */
router.get('/users/:userId/roles',
  authenticateToken,
  requirePermission('user', 'read'),
  auditPermissionUsage('user', 'read'),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const User = require('../models/User');
      const user = await User.findById(userId).populate({
        path: 'roles',
        populate: {
          path: 'permissions',
          model: 'Permission'
        }
      });

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      const permissions = await rbacService.getUserPermissions(userId);
      const permissionsByModule = await rbacService.getUserPermissionsByModule(userId);

      res.json({
        user: {
          id: user._id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom
        },
        roles: user.roles.map(role => ({
          id: role._id,
          name: role.name,
          displayName: role.displayName,
          level: role.level,
          color: role.color
        })),
        permissions: {
          total: permissions.length,
          byModule: permissionsByModule,
          list: permissions.map(perm => ({
            id: perm._id,
            name: perm.getFullName(),
            description: perm.description,
            module: perm.module
          }))
        }
      });
    } catch (error) {
      logger.error('Failed to get user roles', error);
      res.status(500).json({
        error: 'Failed to retrieve user roles',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/rbac/users/{userId}/roles:
 *   put:
 *     summary: Update user roles
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User roles updated successfully
 */
router.put('/users/:userId/roles',
  authenticateToken,
  requirePermission('user', 'manage'),
  auditPermissionUsage('user', 'manage'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { roles } = req.body;

      const User = require('../models/User');
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      const validRoles = await Role.find({
        _id: { $in: roles },
        isActive: true
      });

      const currentUserRoles = await User.findById(req.user.id).populate('roles');
      const maxUserLevel = Math.max(...currentUserRoles.roles.map(r => r.level));

      const hasValidLevel = validRoles.every(role => role.level < maxUserLevel);
      if (!hasValidLevel) {
        return res.status(403).json({
          error: 'Cannot assign roles with higher or equal level',
          message: 'Vous ne pouvez assigner que des rôles de niveau inférieur au vôtre'
        });
      }

      user.roles = validRoles.map(r => r._id);
      await user.save();

      logger.info('User roles updated', {
        targetUserId: userId,
        updatedBy: req.user.id,
        newRoles: validRoles.map(r => r.name),
        roleCount: validRoles.length
      });

      res.json({
        message: 'User roles updated successfully',
        user: {
          id: user._id,
          email: user.email,
          roleCount: validRoles.length
        },
        roles: validRoles.map(role => ({
          id: role._id,
          name: role.name,
          displayName: role.displayName
        }))
      });
    } catch (error) {
      logger.error('Failed to update user roles', error);
      res.status(500).json({
        error: 'Failed to update user roles',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/rbac/my-permissions:
 *   get:
 *     summary: Get current user permissions
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user permissions
 */
router.get('/my-permissions',
  authenticateToken,
  getUserPermissions,
  async (req, res) => {
    try {
      res.json({
        permissions: {
          total: req.userPermissions.length,
          byModule: req.userPermissionsByModule,
          list: req.userPermissions.map(perm => ({
            name: perm.getFullName(),
            description: perm.description,
            module: perm.module
          }))
        }
      });
    } catch (error) {
      logger.error('Failed to get user permissions', error);
      res.status(500).json({
        error: 'Failed to retrieve permissions',
        message: error.message
      });
    }
  }
);

/**
 * @swagger
 * /api/rbac/initialize:
 *   post:
 *     summary: Initialize RBAC system
 *     tags: [RBAC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: RBAC system initialized
 */
router.post('/initialize',
  authenticateToken,
  requireMinimumRole(90),
  auditPermissionUsage('system', 'configure'),
  async (req, res) => {
    try {
      await rbacService.initializeRBAC();

      logger.info('RBAC system initialized', {
        initializedBy: req.user.id,
        timestamp: new Date().toISOString()
      });

      res.json({
        message: 'RBAC system initialized successfully'
      });
    } catch (error) {
      logger.error('Failed to initialize RBAC', error);
      res.status(500).json({
        error: 'Failed to initialize RBAC system',
        message: error.message
      });
    }
  }
);

module.exports = router;