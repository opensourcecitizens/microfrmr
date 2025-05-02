// filepath: /workspaces/microfrmr/Farmers-Choice-API/src/models/Reminder.js
// This file defines the Mongoose schema for the Reminder model.
import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Reminder', reminderSchema);