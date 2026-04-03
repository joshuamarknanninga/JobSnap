import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
