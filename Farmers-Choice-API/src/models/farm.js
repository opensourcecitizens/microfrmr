import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crops: [{ type: String }],
  animals: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Farm', farmSchema);