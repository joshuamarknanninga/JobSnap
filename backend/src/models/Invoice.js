import mongoose from 'mongoose';
import Job from './Job.js';

const invoiceSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

invoiceSchema.pre('validate', async function autoSetAmountFromJob() {
  if (!this.job || this.amount > 0) {
    return;
  }

  const job = await Job.findById(this.job).select('total');
  if (job && Number.isFinite(job.total)) {
    this.amount = job.total;
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
