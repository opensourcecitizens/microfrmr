// File: src/models/marketPlaceItem.js
// This file defines the Mongoose schema for the MarketplaceItem model.
// The MarketplaceItem model represents items available for sale in the marketplace.

import mongoose from 'mongoose';

const marketplaceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('MarketplaceItem', marketplaceItemSchema);