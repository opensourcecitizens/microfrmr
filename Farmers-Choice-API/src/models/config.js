import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Config', configSchema);
