// backend/models/partnerItemModel.js

const mongoose = require("mongoose");

const partnerItemSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true },
    image: { type: String }, // base64
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartnerItem", partnerItemSchema);
