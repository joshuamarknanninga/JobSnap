import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createCrudRoutes = (handlers, options = {}) => {
  const router = express.Router();
  const { validateCreate, validateUpdate } = options;

  router.use(protect);

  const createChain = [asyncHandler(handlers.create)];
  if (validateCreate) {
    createChain.unshift(validateCreate);
  }

  const updateChain = [asyncHandler(handlers.update)];
  if (validateUpdate) {
    updateChain.unshift(validateUpdate);
  }

  router.route('/').get(asyncHandler(handlers.list)).post(...createChain);

  router.route('/:id').get(asyncHandler(handlers.getById)).put(...updateChain).delete(asyncHandler(handlers.remove));

  return router;
};
