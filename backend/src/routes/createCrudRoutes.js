import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const toMiddlewareArray = (middleware) => {
  if (!middleware) {
    return [];
  }

  return Array.isArray(middleware) ? middleware : [middleware];
};

export const createCrudRoutes = (handlers, options = {}) => {
  const router = express.Router();
  const { validateCreate, validateUpdate } = options;

  router.use(protect);

  const createChain = [...toMiddlewareArray(validateCreate), asyncHandler(handlers.create)];
  const updateChain = [...toMiddlewareArray(validateUpdate), asyncHandler(handlers.update)];

  router.route('/').get(asyncHandler(handlers.list)).post(...createChain);

  router.route('/:id').get(asyncHandler(handlers.getById)).put(...updateChain).delete(asyncHandler(handlers.remove));

  return router;
};
