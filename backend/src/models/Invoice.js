import mongoose from 'mongoose';

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

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
