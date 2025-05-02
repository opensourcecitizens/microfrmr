// File: src/models/analytics.js
// This file defines the Mongoose schema for the Analytics model.
// The Analytics model is used to store various analytics data related to farms.

import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  data: { type: Object, required: true }, // Flexible structure for analytics data
}, { timestamps: true });

export default mongoose.model('Analytics', analyticsSchema);