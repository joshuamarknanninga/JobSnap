import Estimate from '../models/Estimate.js';
import Job from '../models/Job.js';
import Invoice from '../models/Invoice.js';

const buildScope = (req, id) => {
  const scope = { _id: id };
  if (req.user.business) {
    scope.business = req.user.business;
  }
  return scope;
};

const createInvoiceNumber = () => `INV-${Date.now()}`;

export const createJobFromEstimate = async (req, res) => {
  const estimate = await Estimate.findOne(buildScope(req, req.params.estimateId));

  if (!estimate) {
    return res.status(404).json({ message: 'Estimate not found' });
  }

  if (estimate.status !== 'accepted') {
    return res.status(400).json({ message: 'Only accepted estimates can be converted to jobs.' });
  }

  const existingJob = await Job.findOne({ estimate: estimate._id });
  if (existingJob) {
    return res.status(400).json({ message: 'A job already exists for this estimate.' });
  }

  if (!req.body.scheduledDate || !req.body.address) {
    return res.status(400).json({ message: 'scheduledDate and address are required.' });
  }

  const job = await Job.create({
    business: estimate.business,
    customer: estimate.customer,
    estimate: estimate._id,
    scheduledDate: req.body.scheduledDate,
    address: req.body.address,
    services: req.body.services || estimate.lineItems?.map((item) => item.description) || [],
    notes: req.body.notes,
    total: estimate.total,
    status: 'scheduled'
  });

  return res.status(201).json(job);
};

export const createInvoiceFromJob = async (req, res) => {
  const job = await Job.findOne(buildScope(req, req.params.jobId));

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.status !== 'completed') {
    return res.status(400).json({ message: 'Only completed jobs can be converted to invoices.' });
  }

  const existingInvoice = await Invoice.findOne({ job: job._id });
  if (existingInvoice) {
    return res.status(400).json({ message: 'An invoice already exists for this job.' });
  }

  if (!req.body.dueDate) {
    return res.status(400).json({ message: 'dueDate is required.' });
  }

  const invoice = await Invoice.create({
    business: job.business,
    customer: job.customer,
    job: job._id,
    invoiceNumber: req.body.invoiceNumber || createInvoiceNumber(),
    dueDate: req.body.dueDate,
    amount: req.body.amount ?? job.total ?? 0,
    notes: req.body.notes,
    status: 'draft'
  });

  return res.status(201).json(invoice);
};
