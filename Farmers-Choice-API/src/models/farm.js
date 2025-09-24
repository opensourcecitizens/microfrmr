const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  crops: [{ type: String }],
  animals: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);