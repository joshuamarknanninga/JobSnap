import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createCrudRoutes = (handlers) => {
  const router = express.Router();

  router.use(protect);

  router.route('/').get(asyncHandler(handlers.list)).post(asyncHandler(handlers.create));

  router
    .route('/:id')
    .get(asyncHandler(handlers.getById))
    .put(asyncHandler(handlers.update))
    .delete(asyncHandler(handlers.remove));

  return router;
};
