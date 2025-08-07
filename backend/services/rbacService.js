const Permission = require('../models/Permission');
const Role = require('../models/Role');
const logger = require('../utils/logger');

class RBACService {
  constructor() {
    this.permissionCache = new Map();
    this.roleCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    this.lastCacheUpdate = null;
  }

  async initializeRBAC() {
    try {
      logger.info('Initializing RBAC system...');
      
      await this.createDefaultPermissions();
      await this.createDefaultRoles();
      await this.refreshCache();
      
      logger.info('RBAC system initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize RBAC system', error);
      throw error;
    }
  }

  async createDefaultPermissions() {
    const defaultPermissions = [
      // Stock Management
      { name: 'stock:read', resource: 'stock', action: 'read', module: 'stock_management', 
        description: 'Consulter l\'inventaire et les stocks' },
      { resource: 'stock', action: 'create', module: 'stock_management', 
        description: 'Créer des entrées/sorties de stock' },
      { resource: 'stock', action: 'update', module: 'stock_management', 
        description: 'Modifier les données de stock' },
      { resource: 'stock', action: 'delete', module: 'stock_management', 
        description: 'Supprimer des entrées de stock' },
      { resource: 'stock', action: 'export', module: 'stock_management', 
        description: 'Exporter les données de stock' },

      // Financial Management
      { resource: 'invoice', action: 'read', module: 'financial_management', 
        description: 'Consulter les factures' },
      { resource: 'invoice', action: 'create', module: 'financial_management', 
        description: 'Créer des factures' },
      { resource: 'invoice', action: 'update', module: 'financial_management', 
        description: 'Modifier les factures' },
      { resource: 'invoice', action: 'delete', module: 'financial_management', 
        description: 'Supprimer les factures' },
      { resource: 'invoice', action: 'approve', module: 'financial_management', 
        description: 'Approuver les factures' },
      { resource: 'expense', action: 'read', module: 'financial_management', 
        description: 'Consulter les dépenses' },
      { resource: 'expense', action: 'create', module: 'financial_management', 
        description: 'Créer des dépenses' },
      { resource: 'expense', action: 'manage', module: 'financial_management', 
        description: 'Gérer les dépenses' },

      // Vehicle Management
      { resource: 'vehicle', action: 'read', module: 'vehicle_management', 
        description: 'Consulter la flotte de véhicules' },
      { resource: 'vehicle', action: 'create', module: 'vehicle_management', 
        description: 'Ajouter des véhicules' },
      { resource: 'vehicle', action: 'update', module: 'vehicle_management', 
        description: 'Modifier les informations véhicules' },
      { resource: 'vehicle', action: 'assign', module: 'vehicle_management', 
        description: 'Assigner des véhicules' },
      { resource: 'entretien', action: 'read', module: 'vehicle_management', 
        description: 'Consulter les entretiens' },
      { resource: 'entretien', action: 'manage', module: 'vehicle_management', 
        description: 'Gérer les entretiens' },

      // User Management
      { resource: 'user', action: 'read', module: 'user_management', 
        description: 'Consulter les utilisateurs' },
      { resource: 'user', action: 'create', module: 'user_management', 
        description: 'Créer des utilisateurs' },
      { resource: 'user', action: 'update', module: 'user_management', 
        description: 'Modifier les utilisateurs' },
      { resource: 'user', action: 'delete', module: 'user_management', 
        description: 'Supprimer les utilisateurs' },
      { resource: 'user', action: 'manage', module: 'user_management', 
        description: 'Gérer les rôles et permissions' },

      // Catalog Management
      { resource: 'catalogue', action: 'read', module: 'catalog_management', 
        description: 'Consulter le catalogue' },
      { resource: 'catalogue', action: 'create', module: 'catalog_management', 
        description: 'Ajouter des produits au catalogue' },
      { resource: 'catalogue', action: 'update', module: 'catalog_management', 
        description: 'Modifier le catalogue' },
      { resource: 'concepteur', action: 'read', module: 'catalog_management', 
        description: 'Consulter les concepteurs' },
      { resource: 'concepteur', action: 'manage', module: 'catalog_management', 
        description: 'Gérer les concepteurs' },

      // Event Management
      { resource: 'event', action: 'read', module: 'event_management', 
        description: 'Consulter les événements' },
      { resource: 'event', action: 'create', module: 'event_management', 
        description: 'Créer des événements' },
      { resource: 'event', action: 'update', module: 'event_management', 
        description: 'Modifier les événements' },
      { resource: 'evenement', action: 'read', module: 'event_management', 
        description: 'Consulter les événements internes' },
      { resource: 'evenement', action: 'manage', module: 'event_management', 
        description: 'Gérer les événements internes' },

      // Project Management
      { resource: 'projet', action: 'read', module: 'event_management', 
        description: 'Consulter les projets' },
      { resource: 'projet', action: 'create', module: 'event_management', 
        description: 'Créer des projets' },
      { resource: 'projet', action: 'update', module: 'event_management', 
        description: 'Modifier les projets' },
      { resource: 'livraison', action: 'read', module: 'event_management', 
        description: 'Consulter les livraisons' },
      { resource: 'livraison', action: 'manage', module: 'event_management', 
        description: 'Gérer les livraisons' },

      // External APIs
      { resource: 'nieuwkoop', action: 'read', module: 'catalog_management', 
        description: 'Consulter l\'API Nieuwkoop' },
      { resource: 'nieuwkoop', action: 'manage', module: 'catalog_management', 
        description: 'Gérer l\'intégration Nieuwkoop' },

      // Security Management
      { resource: 'security', action: 'audit', module: 'security_management', 
        description: 'Accéder aux audits de sécurité' },
      { resource: 'security', action: 'configure', module: 'security_management', 
        description: 'Configurer la sécurité' },

      // System Administration
      { resource: 'system', action: 'configure', module: 'system_administration', 
        description: 'Configurer le système' },
      { resource: 'system', action: 'audit', module: 'system_administration', 
        description: 'Auditer le système' },

      // Reporting
      { resource: 'report', action: 'read', module: 'reporting', 
        description: 'Consulter les rapports' },
      { resource: 'report', action: 'create', module: 'reporting', 
        description: 'Créer des rapports' },
      { resource: 'report', action: 'export', module: 'reporting', 
        description: 'Exporter les rapports' }
    ];

    return await Permission.createBulkPermissions(defaultPermissions);
  }

  async createDefaultRoles() {
    return await Role.createSystemRoles();
  }

  async refreshCache() {
    try {
      const [permissions, roles] = await Promise.all([
        Permission.find({ isActive: true }),
        Role.find({ isActive: true }).populate('permissions')
      ]);

      this.permissionCache.clear();
      this.roleCache.clear();

      permissions.forEach(perm => {
        this.permissionCache.set(perm.getFullName(), perm);
      });

      roles.forEach(role => {
        this.roleCache.set(role.name, role);
      });

      this.lastCacheUpdate = Date.now();
      logger.info('RBAC cache refreshed', { 
        permissions: permissions.length, 
        roles: roles.length 
      });
    } catch (error) {
      logger.error('Failed to refresh RBAC cache', error);
      throw error;
    }
  }

  async checkCacheExpiry() {
    if (!this.lastCacheUpdate || 
        (Date.now() - this.lastCacheUpdate) > this.cacheExpiry) {
      await this.refreshCache();
    }
  }

  async hasPermission(userId, resource, action) {
    try {
      await this.checkCacheExpiry();

      const User = require('../models/userModel');
      const user = await User.findById(userId).populate('roles');
      
      if (!user || !user.roles || user.roles.length === 0) {
        return false;
      }

      for (const role of user.roles) {
        const cachedRole = this.roleCache.get(role.name);
        if (cachedRole && await cachedRole.hasPermission(resource, action)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      logger.error('Permission check failed', { userId, resource, action, error });
      return false;
    }
  }

  async getUserPermissions(userId) {
    try {
      await this.checkCacheExpiry();

      const User = require('../models/userModel');
      const user = await User.findById(userId).populate({
        path: 'roles',
        populate: {
          path: 'permissions',
          model: 'Permission'
        }
      });

      if (!user || !user.roles) {
        return [];
      }

      const allPermissions = [];
      for (const role of user.roles) {
        const rolePermissions = await role.getAllPermissions();
        allPermissions.push(...rolePermissions);
      }

      const uniquePermissions = allPermissions.filter((perm, index, self) => 
        index === self.findIndex(p => p._id.toString() === perm._id.toString())
      );

      return uniquePermissions;
    } catch (error) {
      logger.error('Failed to get user permissions', { userId, error });
      return [];
    }
  }

  async getUserPermissionsByModule(userId) {
    const permissions = await this.getUserPermissions(userId);
    const grouped = {};

    permissions.forEach(perm => {
      if (!grouped[perm.module]) {
        grouped[perm.module] = [];
      }
      grouped[perm.module].push({
        resource: perm.resource,
        action: perm.action,
        description: perm.description
      });
    });

    return grouped;
  }

  async assignRoleToUser(userId, roleName) {
    try {
      const User = require('../models/userModel');
      const role = await Role.findOne({ name: roleName, isActive: true });
      
      if (!role) {
        throw new Error(`Role '${roleName}' not found`);
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.roles.includes(role._id)) {
        user.roles.push(role._id);
        await user.save();
        
        logger.info('Role assigned to user', { 
          userId, 
          roleName, 
          assignedBy: 'system' 
        });
      }

      return true;
    } catch (error) {
      logger.error('Failed to assign role to user', { userId, roleName, error });
      throw error;
    }
  }

  async removeRoleFromUser(userId, roleName) {
    try {
      const User = require('../models/userModel');
      const role = await Role.findOne({ name: roleName });
      
      if (!role) {
        throw new Error(`Role '${roleName}' not found`);
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.roles = user.roles.filter(
        roleId => roleId.toString() !== role._id.toString()
      );
      await user.save();

      logger.info('Role removed from user', { 
        userId, 
        roleName, 
        removedBy: 'system' 
      });

      return true;
    } catch (error) {
      logger.error('Failed to remove role from user', { userId, roleName, error });
      throw error;
    }
  }

  async createCustomRole(roleData, createdBy) {
    try {
      const role = new Role({
        ...roleData,
        isSystem: false,
        createdBy
      });

      await role.save();
      await this.refreshCache();

      logger.info('Custom role created', { 
        roleName: role.name, 
        createdBy 
      });

      return role;
    } catch (error) {
      logger.error('Failed to create custom role', { roleData, error });
      throw error;
    }
  }

  async getPermissionAuditLog(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // This would require an audit log model - for now return mock data
      return {
        userId,
        period: `${days} days`,
        totalActions: 0,
        permissionChanges: [],
        accessAttempts: []
      };
    } catch (error) {
      logger.error('Failed to get permission audit log', { userId, error });
      return null;
    }
  }

  async validateRoleHierarchy(userRole, targetRole) {
    const user = this.roleCache.get(userRole);
    const target = this.roleCache.get(targetRole);

    if (!user || !target) {
      return false;
    }

    return user.canManageRole(target);
  }

  getAvailablePermissions() {
    return Array.from(this.permissionCache.values());
  }

  getAvailableRoles() {
    return Array.from(this.roleCache.values());
  }
}

module.exports = new RBACService();