// File: backend/models/comptoirfleuriste.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ComptoirFleuristeItemSchema = new Schema({
  photo: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  diameter: {
    type: String,
    trim: true,
    default: null
  },
  height: {
    type: String,
    trim: true,
    default: null
  },
  source: {
    type: String,
    enum: ['comptoirfleuriste'],
    default: 'comptoirfleuriste'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ComptoirFleuristeItem', ComptoirFleuristeItemSchema);
