import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    serviceArea: [{ type: String, trim: true }],
    hourlyRate: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Business = mongoose.model('Business', businessSchema);
export default Business;
