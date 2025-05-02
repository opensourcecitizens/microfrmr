// File: src/models/item.js
// This file defines the Mongoose schema for the Item model.
// The Item model represents the items available for sale in the marketplace.
// It includes fields for the item name, category, price, quantity, and a reference to the farm that sells the item.

import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);