import mongoose from 'mongoose';

const estimateSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    title: { type: String, required: true, trim: true },
    lineItems: [
      {
        description: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        rate: { type: Number, required: true, min: 0 }
      }
    ],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected'], default: 'draft' },
    validUntil: Date
  },
  { timestamps: true }
);

estimateSchema.pre('validate', function autoCalculateTotals(next) {
  if (!this.lineItems || this.lineItems.length === 0) {
    return next();
  }

  const subtotal = this.lineItems.reduce((sum, item) => {
    const qty = Number(item.qty || 0);
    const rate = Number(item.rate || 0);
    return sum + (qty * rate);
  }, 0);

  this.subtotal = subtotal;
  this.tax = Number(this.tax || 0);
  this.total = subtotal + this.tax;

  next();
});

const Estimate = mongoose.model('Estimate', estimateSchema);
export default Estimate;
