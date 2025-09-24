// filepath: /workspaces/microfrmr/Farmers-Choice-API/src/models/Reminder.js
// This file defines the Mongoose schema for the Reminder model.

const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);