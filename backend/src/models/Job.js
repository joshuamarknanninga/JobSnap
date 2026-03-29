import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    estimate: { type: mongoose.Schema.Types.ObjectId, ref: 'Estimate' },
    scheduledDate: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
    services: [{ type: String, trim: true }],
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notes: { type: String, trim: true },
    status: { type: String, enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'scheduled' },
    total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
