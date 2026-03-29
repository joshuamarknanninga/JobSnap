import express from 'express';
import authRoutes from './authRoutes.js';
import { createCrudHandlers } from '../controllers/crudControllerFactory.js';
import { createCrudRoutes } from './createCrudRoutes.js';
import Business from '../models/Business.js';
import Customer from '../models/Customer.js';
import Estimate from '../models/Estimate.js';
import Job from '../models/Job.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/businesses', createCrudRoutes(createCrudHandlers(Business, 'owner')));
router.use('/customers', createCrudRoutes(createCrudHandlers(Customer, 'business')));
router.use('/estimates', createCrudRoutes(createCrudHandlers(Estimate, 'business customer')));
router.use('/jobs', createCrudRoutes(createCrudHandlers(Job, 'business customer estimate assignedTo')));
router.use('/invoices', createCrudRoutes(createCrudHandlers(Invoice, 'business customer job')));

export default router;
