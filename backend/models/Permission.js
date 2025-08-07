const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  resource: {
    type: String,
    required: true,
    enum: [
      'stock', 'invoice', 'expense', 'vehicle', 'user', 'catalogue', 
      'concepteur', 'event', 'movement', 'partner', 'evenement',
      'comptoir', 'projet', 'nieuwkoop', 'livraison', 'entretien',
      'security', 'system', 'report'
    ]
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create', 'read', 'update', 'delete', 'export', 'import',
      'approve', 'reject', 'assign', 'unassign', 'manage', 'view',
      'execute', 'configure', 'audit', 'report', 'download'
    ]
  },
  description: {
    type: String,
    required: true
  },
  module: {
    type: String,
    required: true,
    enum: [
      'stock_management', 'financial_management', 'vehicle_management',
      'user_management', 'catalog_management', 'event_management',
      'security_management', 'system_administration', 'reporting'
    ]
  },
  isActive: {
    type: Boolean,
    default: true
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

permissionSchema.index({ resource: 1, action: 1 }, { unique: true });
permissionSchema.index({ module: 1 });

permissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

permissionSchema.methods.getFullName = function() {
  return `${this.resource}:${this.action}`;
};

permissionSchema.statics.getPermissionsByModule = function(module) {
  return this.find({ module, isActive: true }).sort({ resource: 1, action: 1 });
};

permissionSchema.statics.createBulkPermissions = async function(permissions) {
  const results = [];
  for (const permData of permissions) {
    try {
      const existing = await this.findOne({ 
        resource: permData.resource, 
        action: permData.action 
      });
      
      if (!existing) {
        const permission = new this(permData);
        await permission.save();
        results.push(permission);
      } else {
        results.push(existing);
      }
    } catch (error) {
      console.warn(`Failed to create permission ${permData.resource}:${permData.action}:`, error.message);
    }
  }
  return results;
};

module.exports = mongoose.model('Permission', permissionSchema);