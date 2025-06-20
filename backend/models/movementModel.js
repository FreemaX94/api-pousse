// backend/models/movementModel.js

const mongoose = require("mongoose");

const movementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["entrée", "sortie"],
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    returnPlannedAt: {
      type: Date, // optionnel
    },
    projet: {
      type: String,
      required: true,
    },
    commentaire: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    validated: {
      type: Boolean,
      default: false,
    },
    returned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt
  }
);

module.exports = mongoose.model("Movement", movementSchema);
