// This file deffines user data structure.
// It uses mongoose to define the schema for the user model.
// The user model is used to interact with the users collection in the database.
// The user model is used to create, read, update and delete users in the database.

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'farmer', 'buyer'], default: 'farmer' },
}, { timestamps: true });

export default mongoose.model('User', userSchema); 