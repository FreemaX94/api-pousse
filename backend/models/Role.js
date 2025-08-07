const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  inheritFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: null
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#6B7280'
  },
  metadata: {
    maxUsers: {
      type: Number,
      default: null
    },
    departmentRestrictions: [{
      type: String
    }],
    ipRestrictions: [{
      type: String
    }],
    timeRestrictions: {
      allowedHours: {
        start: { type: String, default: '00:00' },
        end: { type: String, default: '23:59' }
      },
      allowedDays: [{
        type: Number,
        min: 0,
        max: 6
      }]
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

roleSchema.index({ level: 1 });
roleSchema.index({ isActive: 1, isSystem: 1 });

roleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

roleSchema.methods.getAllPermissions = async function() {
  await this.populate('permissions inheritFrom');
  
  let permissions = [...this.permissions];
  
  if (this.inheritFrom) {
    const inheritedPermissions = await this.inheritFrom.getAllPermissions();
    permissions = [...permissions, ...inheritedPermissions];
  }
  
  const uniquePermissions = permissions.filter((perm, index, self) => 
    index === self.findIndex(p => p._id.toString() === perm._id.toString())
  );
  
  return uniquePermissions;
};

roleSchema.methods.hasPermission = async function(resource, action) {
  const permissions = await this.getAllPermissions();
  return permissions.some(perm => 
    perm.resource === resource && perm.action === action && perm.isActive
  );
};

roleSchema.methods.addPermission = async function(permissionId) {
  if (!this.permissions.includes(permissionId)) {
    this.permissions.push(permissionId);
    await this.save();
  }
};

roleSchema.methods.removePermission = async function(permissionId) {
  this.permissions = this.permissions.filter(
    id => id.toString() !== permissionId.toString()
  );
  await this.save();
};

roleSchema.methods.canManageRole = function(targetRole) {
  if (this.isSystem && this.name === 'super_admin') return true;
  
  return this.level > targetRole.level;
};

roleSchema.methods.getPermissionsByModule = async function() {
  const permissions = await this.getAllPermissions();
  const grouped = {};
  
  permissions.forEach(perm => {
    if (!grouped[perm.module]) {
      grouped[perm.module] = [];
    }
    grouped[perm.module].push(perm);
  });
  
  return grouped;
};

roleSchema.statics.getHierarchy = async function() {
  const roles = await this.find({ isActive: true })
    .populate('inheritFrom permissions')
    .sort({ level: -1 });
  
  return roles;
};

roleSchema.statics.createSystemRoles = async function() {
  const Permission = mongoose.model('Permission');
  const systemRoles = [
    {
      name: 'super_admin',
      displayName: 'Super Administrateur',
      description: 'Accès total au système',
      level: 100,
      isSystem: true,
      color: '#DC2626',
      permissions: await Permission.find({ isActive: true }).select('_id')
    },
    {
      name: 'admin',
      displayName: 'Administrateur',
      description: 'Gestion complète sauf administration système',
      level: 90,
      isSystem: true,
      color: '#EA580C',
      permissions: await Permission.find({ 
        module: { $ne: 'system_administration' },
        isActive: true 
      }).select('_id')
    },
    {
      name: 'manager',
      displayName: 'Manager',
      description: 'Gestion opérationnelle et supervision',
      level: 70,
      isSystem: true,
      color: '#D97706',
      permissions: await Permission.find({
        module: { $in: ['stock_management', 'financial_management', 'vehicle_management', 'reporting'] },
        action: { $ne: 'delete' },
        isActive: true
      }).select('_id')
    },
    {
      name: 'employee',
      displayName: 'Employé',
      description: 'Accès opérationnel standard',
      level: 50,
      isSystem: true,
      color: '#059669',
      permissions: await Permission.find({
        module: { $in: ['stock_management', 'catalog_management', 'event_management'] },
        action: { $in: ['read', 'create', 'update', 'view'] },
        isActive: true
      }).select('_id')
    },
    {
      name: 'client',
      displayName: 'Client',
      description: 'Accès limité aux données personnelles',
      level: 10,
      isSystem: true,
      color: '#3B82F6',
      permissions: await Permission.find({
        resource: { $in: ['invoice', 'event', 'projet'] },
        action: { $in: ['read', 'view'] },
        isActive: true
      }).select('_id')
    }
  ];

  const results = [];
  for (const roleData of systemRoles) {
    try {
      const existing = await this.findOne({ name: roleData.name });
      if (!existing) {
        const role = new this(roleData);
        await role.save();
        results.push(role);
      } else {
        results.push(existing);
      }
    } catch (error) {
      console.warn(`Failed to create role ${roleData.name}:`, error.message);
    }
  }
  
  return results;
};

module.exports = mongoose.model('Role', roleSchema);