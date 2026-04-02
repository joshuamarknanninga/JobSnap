import express from 'express';
import authRoutes from './authRoutes.js';
import workflowRoutes from './workflowRoutes.js';
import { createCrudHandlers } from '../controllers/crudControllerFactory.js';
import { createCrudRoutes } from './createCrudRoutes.js';
import { validateResourcePayload } from '../middleware/validationMiddleware.js';
import createStatusTransitionGuard from '../middleware/workflowMiddleware.js';
import Business from '../models/Business.js';
import Customer from '../models/Customer.js';
import Estimate from '../models/Estimate.js';
import Job from '../models/Job.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

const withValidation = (resource, extraUpdate = []) => ({
  validateCreate: validateResourcePayload(resource),
  validateUpdate: [validateResourcePayload(resource), ...extraUpdate]
});

const estimateTransitionGuard = createStatusTransitionGuard(Estimate, {
  draft: ['sent', 'rejected'],
  sent: ['accepted', 'rejected'],
  accepted: [],
  rejected: []
});

const jobTransitionGuard = createStatusTransitionGuard(Job, {
  scheduled: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: []
});

const invoiceTransitionGuard = createStatusTransitionGuard(Invoice, {
  draft: ['sent'],
  sent: ['paid', 'overdue'],
  overdue: ['paid'],
  paid: []
});

router.use('/auth', authRoutes);
router.use('/workflows', workflowRoutes);

router.use('/businesses', createCrudRoutes(createCrudHandlers(Business, 'owner'), withValidation('businesses')));
router.use('/customers', createCrudRoutes(createCrudHandlers(Customer, 'business'), withValidation('customers')));
router.use('/estimates', createCrudRoutes(createCrudHandlers(Estimate, 'business customer'), withValidation('estimates', [estimateTransitionGuard])));
router.use('/jobs', createCrudRoutes(createCrudHandlers(Job, 'business customer estimate assignedTo'), withValidation('jobs', [jobTransitionGuard])));
router.use('/invoices', createCrudRoutes(createCrudHandlers(Invoice, 'business customer job'), withValidation('invoices', [invoiceTransitionGuard])));

export default router;
