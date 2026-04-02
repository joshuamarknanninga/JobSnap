import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect } from '../middleware/authMiddleware.js';
import { createInvoiceFromJob, createJobFromEstimate } from '../controllers/workflowController.js';

const router = express.Router();

router.use(protect);

router.post('/estimates/:estimateId/create-job', asyncHandler(createJobFromEstimate));
router.post('/jobs/:jobId/create-invoice', asyncHandler(createInvoiceFromJob));

export default router;
