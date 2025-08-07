const rbacService = require('../services/rbacService');
const logger = require('../utils/logger');

const requirePermission = (resource, action, options = {}) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        logger.warn('RBAC: No authenticated user found', { 
          path: req.path, 
          method: req.method,
          ip: req.ip 
        });
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userId = req.user.id;
      const hasPermission = await rbacService.hasPermission(userId, resource, action);

      if (!hasPermission) {
        logger.warn('RBAC: Permission denied', {
          userId,
          resource,
          action,
          path: req.path,
          method: req.method,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });

        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'PERMISSION_DENIED',
          required: `${resource}:${action}`,
          message: `Cette action nécessite la permission '${resource}:${action}'`
        });
      }

      logger.debug('RBAC: Permission granted', {
        userId,
        resource,
        action,
        path: req.path
      });

      req.permissions = req.permissions || {};
      req.permissions[`${resource}:${action}`] = true;

      next();
    } catch (error) {
      logger.error('RBAC middleware error', {
        error: error.message,
        stack: error.stack,
        userId: req.user?.id,
        resource,
        action,
        path: req.path
      });

      return res.status(500).json({
        error: 'Permission check failed',
        code: 'RBAC_ERROR'
      });
    }
  };
};

const requireAnyPermission = (permissionPairs) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userId = req.user.id;
      let hasAnyPermission = false;
      const checkedPermissions = [];

      for (const [resource, action] of permissionPairs) {
        const hasPermission = await rbacService.hasPermission(userId, resource, action);
        checkedPermissions.push(`${resource}:${action}`);
        
        if (hasPermission) {
          hasAnyPermission = true;
          req.permissions = req.permissions || {};
          req.permissions[`${resource}:${action}`] = true;
          break;
        }
      }

      if (!hasAnyPermission) {
        logger.warn('RBAC: No sufficient permissions found', {
          userId,
          checkedPermissions,
          path: req.path,
          method: req.method,
          ip: req.ip
        });

        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'PERMISSION_DENIED',
          required: checkedPermissions,
          message: `Cette action nécessite l'une de ces permissions: ${checkedPermissions.join(', ')}`
        });
      }

      next();
    } catch (error) {
      logger.error('RBAC any permission middleware error', {
        error: error.message,
        userId: req.user?.id,
        permissionPairs,
        path: req.path
      });

      return res.status(500).json({
        error: 'Permission check failed',
        code: 'RBAC_ERROR'
      });
    }
  };
};

const requireRole = (roleName) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const User = require('../models/User');
      const user = await User.findById(req.user.id).populate('roles');

      if (!user || !user.roles || user.roles.length === 0) {
        return res.status(403).json({
          error: 'No roles assigned',
          code: 'NO_ROLES'
        });
      }

      const hasRole = user.roles.some(role => role.name === roleName && role.isActive);

      if (!hasRole) {
        logger.warn('RBAC: Role requirement not met', {
          userId: req.user.id,
          requiredRole: roleName,
          userRoles: user.roles.map(r => r.name),
          path: req.path,
          ip: req.ip
        });

        return res.status(403).json({
          error: 'Insufficient role',
          code: 'ROLE_REQUIRED',
          required: roleName,
          message: `Cette action nécessite le rôle '${roleName}'`
        });
      }

      req.userRoles = user.roles;
      next();
    } catch (error) {
      logger.error('RBAC role middleware error', {
        error: error.message,
        userId: req.user?.id,
        roleName,
        path: req.path
      });

      return res.status(500).json({
        error: 'Role check failed',
        code: 'RBAC_ERROR'
      });
    }
  };
};

const requireMinimumRole = (minimumLevel) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const User = require('../models/User');
      const user = await User.findById(req.user.id).populate('roles');

      if (!user || !user.roles || user.roles.length === 0) {
        return res.status(403).json({
          error: 'No roles assigned',
          code: 'NO_ROLES'
        });
      }

      const maxUserLevel = Math.max(...user.roles.map(role => role.level));

      if (maxUserLevel < minimumLevel) {
        logger.warn('RBAC: Minimum role level not met', {
          userId: req.user.id,
          requiredLevel: minimumLevel,
          userMaxLevel: maxUserLevel,
          userRoles: user.roles.map(r => r.name),
          path: req.path,
          ip: req.ip
        });

        return res.status(403).json({
          error: 'Insufficient role level',
          code: 'ROLE_LEVEL_REQUIRED',
          required: minimumLevel,
          current: maxUserLevel,
          message: `Cette action nécessite un niveau de rôle minimum de ${minimumLevel}`
        });
      }

      req.userRoles = user.roles;
      req.userMaxLevel = maxUserLevel;
      next();
    } catch (error) {
      logger.error('RBAC minimum role middleware error', {
        error: error.message,
        userId: req.user?.id,
        minimumLevel,
        path: req.path
      });

      return res.status(500).json({
        error: 'Role level check failed',
        code: 'RBAC_ERROR'
      });
    }
  };
};

const checkResourceOwnership = (resourceIdParam = 'id', resourceModel = null) => {
  return async (req, res, next) => {
    try {
      if (!resourceModel) {
        return next();
      }

      const userId = req.user.id;
      const resourceId = req.params[resourceIdParam];

      if (!resourceId) {
        return res.status(400).json({
          error: 'Resource ID required',
          code: 'RESOURCE_ID_REQUIRED'
        });
      }

      const Model = require(`../models/${resourceModel}`);
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          error: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        });
      }

      const isOwner = resource.createdBy?.toString() === userId ||
                     resource.userId?.toString() === userId ||
                     resource.assignedTo?.toString() === userId;

      if (!isOwner) {
        const hasAdminPermission = await rbacService.hasPermission(userId, 'system', 'manage');
        
        if (!hasAdminPermission) {
          logger.warn('RBAC: Resource ownership check failed', {
            userId,
            resourceId,
            resourceModel,
            path: req.path,
            ip: req.ip
          });

          return res.status(403).json({
            error: 'Resource access denied',
            code: 'RESOURCE_ACCESS_DENIED',
            message: 'Vous ne pouvez accéder qu\'à vos propres ressources'
          });
        }
      }

      req.resource = resource;
      req.isResourceOwner = isOwner;
      next();
    } catch (error) {
      logger.error('RBAC ownership middleware error', {
        error: error.message,
        userId: req.user?.id,
        resourceIdParam,
        resourceModel,
        path: req.path
      });

      return res.status(500).json({
        error: 'Ownership check failed',
        code: 'RBAC_ERROR'
      });
    }
  };
};

const getUserPermissions = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      req.userPermissions = [];
      return next();
    }

    const permissions = await rbacService.getUserPermissions(req.user.id);
    req.userPermissions = permissions;
    req.userPermissionsByModule = await rbacService.getUserPermissionsByModule(req.user.id);
    
    next();
  } catch (error) {
    logger.error('Get user permissions middleware error', {
      error: error.message,
      userId: req.user?.id,
      path: req.path
    });
    
    req.userPermissions = [];
    req.userPermissionsByModule = {};
    next();
  }
};

const auditPermissionUsage = (resource, action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (req.user?.id && res.statusCode < 400) {
        logger.info('Permission used successfully', {
          userId: req.user.id,
          resource,
          action,
          path: req.path,
          method: req.method,
          statusCode: res.statusCode,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        });
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  requirePermission,
  requireAnyPermission,
  requireRole,
  requireMinimumRole,
  checkResourceOwnership,
  getUserPermissions,
  auditPermissionUsage
};