import express from 'express';
import authRoutes from './authRoutes.js';
import { createCrudHandlers } from '../controllers/crudControllerFactory.js';
import { createCrudRoutes } from './createCrudRoutes.js';
import { validateResourcePayload } from '../middleware/validationMiddleware.js';
import Business from '../models/Business.js';
import Customer from '../models/Customer.js';
import Estimate from '../models/Estimate.js';
import Job from '../models/Job.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/businesses', createCrudRoutes(createCrudHandlers(Business, 'owner'), {
  validateCreate: validateResourcePayload('businesses'),
  validateUpdate: validateResourcePayload('businesses')
}));
router.use('/customers', createCrudRoutes(createCrudHandlers(Customer, 'business'), {
  validateCreate: validateResourcePayload('customers'),
  validateUpdate: validateResourcePayload('customers')
}));
router.use('/estimates', createCrudRoutes(createCrudHandlers(Estimate, 'business customer'), {
  validateCreate: validateResourcePayload('estimates'),
  validateUpdate: validateResourcePayload('estimates')
}));
router.use('/jobs', createCrudRoutes(createCrudHandlers(Job, 'business customer estimate assignedTo'), {
  validateCreate: validateResourcePayload('jobs'),
  validateUpdate: validateResourcePayload('jobs')
}));
router.use('/invoices', createCrudRoutes(createCrudHandlers(Invoice, 'business customer job'), {
  validateCreate: validateResourcePayload('invoices'),
  validateUpdate: validateResourcePayload('invoices')
}));

export default router;
