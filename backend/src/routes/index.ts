import { Router } from 'express';
import { healthRouter } from './health';
import { publicRouter } from './public';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/public', publicRouter);

// Added in later parts:
//   /admin    authenticated admin API (Part 7)
//   /creator  creator portal (Phase 2)
//   /brand    brand portal (Phase 2)