const mongoose = require('mongoose');
const { Schema } = mongoose;
const { getNextSequenceValue } = require('../../../shared/models/Counter');

const MaintenanceRecordSchema = new Schema({
  type: {
    type: String,
    enum: ['maintenance', 'repair', 'inspection', 'cleaning', 'fuel'],
    required: true
  },
  description: { type: String, required: true, trim: true },
  cost: { type: Number, min: 0 },
  date: { type: Date, default: Date.now },
  nextDueDate: Date,
  mileage: { type: Number, min: 0 },
  provider: { type: String, trim: true },
  documents: [{
    name: String,
    path: String,
    type: String
  }],
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

const InsuranceSchema = new Schema({
  provider: { type: String, required: true, trim: true },
  policyNumber: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  coverage: {
    liability: { type: Boolean, default: true },
    collision: { type: Boolean, default: false },
    comprehensive: { type: Boolean, default: false },
    personalInjury: { type: Boolean, default: false }
  },
  premium: { type: Number, min: 0 },
  documents: [{
    name: String,
    path: String,
    uploadDate: { type: Date, default: Date.now }
  }]
});

const VehicleSchema = new Schema({
  vehicleId: { 
    type: String, 
    unique: true, 
    index: true 
  },
  licensePlate: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    uppercase: true,
    match: /^[A-Z0-9-]+$/,
    index: true
  },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { 
    type: Number, 
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  vin: { 
    type: String, 
    unique: true, 
    sparse: true,
    trim: true,
    uppercase: true,
    match: /^[A-Z0-9]{17}$/
  },
  type: {
    type: String,
    enum: ['truck', 'van', 'car', 'trailer', 'motorcycle', 'equipment'],
    default: 'van',
    index: true
  },
  capacity: {
    weight: { type: Number, min: 0 }, // en kg
    volume: { type: Number, min: 0 }, // en m³
    passengers: { type: Number, min: 1, default: 2 }
  },
  specifications: {
    fuelType: {
      type: String,
      enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'lpg'],
      default: 'diesel'
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic'],
      default: 'manual'
    },
    engineSize: Number, // en litres
    horsePower: Number,
    co2Emissions: Number // g/km
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'out_of_service', 'retired'],
    default: 'available',
    index: true
  },
  currentLocation: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    lastUpdated: { type: Date, default: Date.now }
  },
  assignedTo: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  },
  mileage: {
    current: { type: Number, default: 0, min: 0 },
    lastServiceMileage: { type: Number, default: 0, min: 0 },
    nextServiceDue: Number
  },
  documents: {
    registration: {
      number: String,
      expiryDate: Date,
      documents: [{ name: String, path: String }]
    },
    inspection: {
      lastDate: Date,
      nextDueDate: Date,
      passed: Boolean,
      documents: [{ name: String, path: String }]
    },
    drivingLicense: {
      required: {
        type: String,
        enum: ['B', 'C', 'C1', 'CE', 'D'],
        default: 'B'
      }
    }
  },
  insurance: InsuranceSchema,
  maintenance: {
    records: [MaintenanceRecordSchema],
    schedule: {
      nextServiceDate: Date,
      nextServiceMileage: Number,
      lastServiceDate: Date
    },
    costs: {
      totalThisYear: { type: Number, default: 0 },
      totalLifetime: { type: Number, default: 0 }
    }
  },
  usage: {
    totalDistance: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    averageFuelConsumption: Number, // L/100km
    trips: [{
      startDate: Date,
      endDate: Date,
      startLocation: String,
      endLocation: String,
      distance: Number,
      purpose: String,
      driver: { type: Schema.Types.ObjectId, ref: 'User' }
    }]
  },
  costs: {
    purchase: {
      price: Number,
      date: Date,
      supplier: String
    },
    operational: {
      fuelCostPerKm: Number,
      maintenanceCostPerKm: Number,
      insuranceCostPerMonth: Number
    }
  },
  images: [{
    url: String,
    description: String,
    uploadDate: { type: Date, default: Date.now },
    isPrimary: { type: Boolean, default: false }
  }],
  notes: {
    internal: String,
    maintenance: String,
    accidents: String
  },
  alerts: [{
    type: {
      type: String,
      enum: ['maintenance_due', 'inspection_due', 'insurance_expiry', 'registration_expiry', 'high_mileage']
    },
    message: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    date: { type: Date, default: Date.now },
    acknowledged: { type: Boolean, default: false },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    acknowledgedDate: Date
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Générer un ID unique logique avant la sauvegarde
VehicleSchema.pre('save', async function(next) {
  if (this.isNew && !this.vehicleId) {
    try {
      const sequenceValue = await getNextSequenceValue('vehicle');
      const paddedSequence = sequenceValue.toString().padStart(3, '0');
      this.vehicleId = `VEH-${paddedSequence}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Virtual pour l'âge du véhicule
VehicleSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.year;
});

// Virtual pour savoir si une maintenance est due
VehicleSchema.virtual('isMaintenanceDue').get(function() {
  const nextServiceDate = this.maintenance?.schedule?.nextServiceDate;
  const nextServiceMileage = this.maintenance?.schedule?.nextServiceMileage;
  const currentMileage = this.mileage?.current || 0;
  
  return (nextServiceDate && nextServiceDate <= new Date()) ||
         (nextServiceMileage && currentMileage >= nextServiceMileage);
});

// Virtual pour le coût total de possession
VehicleSchema.virtual('totalCostOfOwnership').get(function() {
  const purchasePrice = this.costs?.purchase?.price || 0;
  const maintenanceCost = this.maintenance?.costs?.totalLifetime || 0;
  return purchasePrice + maintenanceCost;
});

// Indexes pour optimiser les requêtes
VehicleSchema.index({ status: 1, assignedTo: 1 });
VehicleSchema.index({ type: 1, status: 1 });
VehicleSchema.index({ 'maintenance.schedule.nextServiceDate': 1 });
VehicleSchema.index({ 'documents.inspection.nextDueDate': 1 });
VehicleSchema.index({ 'insurance.endDate': 1 });

// Méthodes d'instance
VehicleSchema.methods.addMaintenanceRecord = function(recordData) {
  this.maintenance.records.push(recordData);
  
  // Mettre à jour les coûts
  if (recordData.cost) {
    this.maintenance.costs.totalLifetime += recordData.cost;
    
    const currentYear = new Date().getFullYear();
    const recordYear = new Date(recordData.date).getFullYear();
    if (recordYear === currentYear) {
      this.maintenance.costs.totalThisYear += recordData.cost;
    }
  }
  
  return this.save();
};

VehicleSchema.methods.updateMileage = function(newMileage) {
  if (newMileage < this.mileage.current) {
    throw new Error('Le nouveau kilométrage ne peut pas être inférieur à l\'actuel');
  }
  
  this.mileage.current = newMileage;
  
  // Vérifier si une maintenance est due
  if (this.mileage.nextServiceDue && newMileage >= this.mileage.nextServiceDue) {
    this.addAlert('maintenance_due', `Maintenance due à ${newMileage} km`, 'high');
  }
  
  return this.save();
};

VehicleSchema.methods.assignTo = function(userId) {
  this.assignedTo = userId;
  this.status = 'in_use';
  return this.save();
};

VehicleSchema.methods.unassign = function() {
  this.assignedTo = undefined;
  this.status = 'available';
  return this.save();
};

VehicleSchema.methods.addAlert = function(type, message, severity = 'medium') {
  this.alerts.push({ type, message, severity });
  return this.save();
};

VehicleSchema.methods.acknowledgeAlert = function(alertId, userId) {
  const alert = this.alerts.id(alertId);
  if (alert) {
    alert.acknowledged = true;
    alert.acknowledgedBy = userId;
    alert.acknowledgedDate = new Date();
    return this.save();
  }
  throw new Error('Alerte non trouvée');
};

// Méthodes statiques
VehicleSchema.statics.getAvailableVehicles = function(type = null) {
  const query = { status: 'available' };
  if (type) query.type = type;
  return this.find(query).populate('assignedTo', 'username email');
};

VehicleSchema.statics.getVehiclesByStatus = function(status = null) {
  const query = status ? { status } : {};
  return this.find(query).populate('assignedTo', 'username email');
};

VehicleSchema.statics.searchVehicles = function(searchTerm, options = {}) {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
  
  const searchRegex = new RegExp(searchTerm, 'i');
  const query = {
    $or: [
      { licensePlate: searchRegex },
      { brand: searchRegex },
      { model: searchRegex },
      { vin: searchRegex }
    ]
  };
  
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  return this.find(query)
    .populate('assignedTo', 'username email')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
};

VehicleSchema.statics.getMaintenanceDue = function() {
  const today = new Date();
  return this.find({
    $or: [
      { 'maintenance.schedule.nextServiceDate': { $lte: today } },
      { $expr: { $gte: ['$mileage.current', '$mileage.nextServiceDue'] } }
    ]
  });
};

VehicleSchema.statics.getExpiringDocuments = function(daysAhead = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  return this.find({
    $or: [
      { 'documents.registration.expiryDate': { $lte: futureDate } },
      { 'documents.inspection.nextDueDate': { $lte: futureDate } },
      { 'insurance.endDate': { $lte: futureDate } }
    ]
  });
};

VehicleSchema.statics.getFleetStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgAge: { $avg: { $subtract: [new Date().getFullYear(), '$year'] } },
        totalMileage: { $sum: '$mileage.current' }
      }
    }
  ]);
};

module.exports = mongoose.model('Vehicle', VehicleSchema);
