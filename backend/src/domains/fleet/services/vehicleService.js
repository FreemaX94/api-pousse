const createError = require('http-errors');
const mongoose = require('mongoose');
const Vehicle = require('../models/vehicleModel.js');

exports.createVehicle = async ({ licensePlate, model, capacity }) => {
  if (!licensePlate || !model || capacity == null) {
    throw createError(400, 'Les champs licensePlate, model et capacity sont requis');
  }
  const plate = licensePlate.trim().toUpperCase();
  const exists = await Vehicle.findOne({ licensePlate: plate });
  if (exists) {
    throw createError(409, `Le véhicule immatriculé "${plate}" existe déjà`);
  }
  const veh = await Vehicle.create({
    licensePlate: plate,
    model: model.trim(),
    capacity
  });
  return veh.toObject();
};

exports.countVehicles = async (options = {}) => {
  const { capacityMin, status, type, search } = options;
  const query = {};
  
  if (capacityMin != null) {
    query['capacity.weight'] = { $gte: capacityMin };
  }
  
  if (status) {
    query.status = status;
  }
  
  if (type) {
    query.type = type;
  }
  
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { licensePlate: searchRegex },
      { brand: searchRegex },
      { model: searchRegex },
      { vin: searchRegex }
    ];
  }
  
  return Vehicle.countDocuments(query);
};

exports.listVehicles = async (options = {}) => {
  const { 
    capacityMin, 
    status, 
    type, 
    search, 
    page = 1, 
    limit = 50,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const query = {};
  
  // Filtres
  if (capacityMin != null) {
    query['capacity.weight'] = { $gte: capacityMin };
  }
  
  if (status) {
    query.status = status;
  }
  
  if (type) {
    query.type = type;
  }
  
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { licensePlate: searchRegex },
      { brand: searchRegex },
      { model: searchRegex },
      { vin: searchRegex }
    ];
  }

  const skip = (Math.max(page, 1) - 1) * limit;
  
  // Tri
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [total, data] = await Promise.all([
    Vehicle.countDocuments(query),
    Vehicle.find(query)
      .populate('assignedTo', 'username email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.max(page, 1);

  return { 
    data, 
    meta: { 
      totalItems: total,
      currentPage,
      totalPages,
      limit,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    } 
  };
};

exports.getVehicleById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de véhicule invalide');
  }
  const veh = await Vehicle.findById(id).lean();
  if (!veh) {
    throw createError(404, 'Véhicule non trouvé');
  }
  return veh;
};

exports.updateVehicle = async (id, updatePayload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de véhicule invalide');
  }
  const payload = {};
  if (updatePayload.licensePlate) {
    const plate = updatePayload.licensePlate.trim().toUpperCase();
    const conflict = await Vehicle.findOne({ licensePlate: plate, _id: { $ne: id } });
    if (conflict) {
      throw createError(409, `Le véhicule immatriculé "${plate}" existe déjà`);
    }
    payload.licensePlate = plate;
  }
  if (updatePayload.model) {
    payload.model = updatePayload.model.trim();
  }
  if (updatePayload.capacity != null) {
    if (typeof updatePayload.capacity !== 'number' || updatePayload.capacity < 0) {
      throw createError(400, 'capacity doit être un nombre positif');
    }
    payload.capacity = updatePayload.capacity;
  }

  const updated = await Vehicle.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) {
    throw createError(404, 'Véhicule non trouvé');
  }
  return updated;
};

exports.deleteVehicle = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de véhicule invalide');
  }
  const deleted = await Vehicle.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw createError(404, 'Véhicule non trouvé');
  }
  return deleted;
};

exports.getVehicleStats = async () => {
  const stats = await Vehicle.aggregate([
    {
      $group: {
        _id: null,
        totalVehicles: { $sum: 1 },
        available: {
          $sum: {
            $cond: [{ $eq: ['$status', 'available'] }, 1, 0]
          }
        },
        inMaintenance: {
          $sum: {
            $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0]
          }
        },
        averageAge: {
          $avg: {
            $subtract: [new Date().getFullYear(), '$year']
          }
        },
        totalMileage: {
          $sum: '$mileage.current'
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalVehicles: 0,
    available: 0,
    inMaintenance: 0,
    averageAge: 0,
    totalMileage: 0
  };
};

exports.getExpiringDocuments = async (days = 30) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return Vehicle.find({
    $or: [
      { 'documents.registration.expiryDate': { $lte: futureDate } },
      { 'documents.inspection.nextDueDate': { $lte: futureDate } },
      { 'insurance.endDate': { $lte: futureDate } }
    ]
  }).lean();
};

exports.uploadDocument = async (id, documentData) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw createError(404, 'Véhicule non trouvé');
  }
  
  // Logique d'upload de document à implémenter
  return vehicle;
};
