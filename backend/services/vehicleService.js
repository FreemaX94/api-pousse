(async () => {
// backend/services/vehicleService.js
const createError = require('http-errors');
const mongoose = require('mongoose');
const Vehicle = require('../models/vehicleModel.js');

/**
 * Crée un nouveau véhicule.
 * @param {{ licensePlate: string, model: string, capacity: number }} payload
 * @returns {Promise<Object>}
 */
exports.createVehicle({ licensePlate, model, capacity }) {
  if (!licensePlate || !model || capacity == null) {
    throw createError(400, 'Les champs licensePlate, model et capacity sont requis')
  }
  // Normalisation
  const plate = licensePlate.trim().toUpperCase()
  // Vérifier doublon
  const exists = await Vehicle.findOne({ licensePlate: plate })
  if (exists) {
    throw createError(409, `Le véhicule immatriculé "${plate}" existe déjà`)
  }
  const veh = await Vehicle.create({ licensePlate: plate, model: model.trim(), capacity })
  return veh.toObject()
}

/**
 * Compte le nombre de véhicules selon un filtre.
 * @param {{ capacityMin?: number }} filter
 * @returns {Promise<number>}
 */
exports.countVehicles({ capacityMin } = {}) {
  const q = {}
  if (capacityMin != null) {
    if (typeof capacityMin !== 'number' || capacityMin < 0) {
      throw createError(400, 'capacityMin doit être un nombre positif')
    }
    q.capacity = { $gte: capacityMin }
  }
  return Vehicle.countDocuments(q)
}

/**
 * Liste les véhicules avec pagination et filtre de capacité minimale.
 * @param {{ capacityMin?: number, page?: number, limit?: number }} options
 * @returns {Promise<{ data: Object[], meta: { total: number, page: number, limit: number } }>}
 */
exports.listVehicles({ capacityMin, page = 1, limit = 50 } = {}) {
  const q = {}
  if (capacityMin != null) {
    if (typeof capacityMin !== 'number' || capacityMin < 0) {
      throw createError(400, 'capacityMin doit être un nombre positif')
    }
    q.capacity = { $gte: capacityMin }
  }

  const skip = (Math.max(page, 1) - 1) * limit
  const [ total, data ] = await Promise.all([
    countVehicles({ capacityMin }),
    Vehicle.find(q)
      .sort({ licensePlate: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ])

  return { data, meta: { total, page, limit } }
}

/**
 * Récupère un véhicule par son ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
exports.getVehicleById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de véhicule invalide')
  }
  const veh = await Vehicle.findById(id).lean()
  if (!veh) {
    throw createError(404, 'Véhicule non trouvé')
  }
  return veh
}

/**
 * Met à jour un véhicule existant.
 * @param {string} id
 * @param {{ licensePlate?: string, model?: string, capacity?: number }} updatePayload
 * @returns {Promise<Object>}
 */
exports.updateVehicle(id, updatePayload) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de véhicule invalide')
  }
  const payload = {}
  if (updatePayload.licensePlate) {
    const plate = updatePayload.licensePlate.trim().toUpperCase()
    // Vérifier doublon
    const conflict = await Vehicle.findOne({ licensePlate: plate, _id: { $ne: id } })
    if (conflict) {
      throw createError(409, `Le véhicule immatriculé "${plate}" existe déjà`)
    }
    payload.licensePlate = plate
  }
  if (updatePayload.model) {
    payload.model = updatePayload.model.trim()
  }
  if (updatePayload.capacity != null) {
    if (typeof updatePayload.capacity !== 'number' || updatePayload.capacity < 0) {
      throw createError(400, 'capacity doit être un nombre positif')
    }
    payload.capacity = updatePayload.capacity
  }

  const updated = await Vehicle.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).lean()
  if (!updated) {
    throw createError(404, 'Véhicule non trouvé')
  }
  return updated
}

/**
 * Supprime un véhicule.
 * @param {string} id
 * @returns {Promise<Object>}
 */
exports.deleteVehicle(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'ID de véhicule invalide')
  }
  const deleted = await Vehicle.findByIdAndDelete(id).lean()
  if (!deleted) {
    throw createError(404, 'Véhicule non trouvé')
  }
  return deleted
}
})();