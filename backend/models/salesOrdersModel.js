// backend/models/salesOrdersModel.js
const mongoose = require('mongoose')
const { Schema } = mongoose

// Sous-schéma pour les items de commande
const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false })

const SalesOrderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: arr => Array.isArray(arr) && arr.length > 0,
      message: 'La commande doit contenir au moins un item'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
    default: 'pending',
    index: true
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true })

// Calcul automatique du montant total avant sauvegarde
SalesOrderSchema.pre('save', async function(next) {
  if (this.isModified('items') || this.isNew) {
    // Somme des (quantité * prix du produit) pour chaque item
    const Produit = mongoose.model('Produit')
    let total = 0
    for (const itm of this.items) {
      const prod = await Produit.findById(itm.product).lean()
      if (!prod) {
        return next(new Error(`Produit introuvable pour item ${itm.product}`))
      }
      total += prod.price * itm.quantity
    }
    this.totalAmount = total
  }
  next()
})

// Index pour trier rapidement par date de création
SalesOrderSchema.index({ createdAt: -1 })

module.exports = mongoose.model('SalesOrder', SalesOrderSchema)
