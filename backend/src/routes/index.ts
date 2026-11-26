import { Router } from 'express';
import { healthRouter } from './health';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);

// Added in later parts:
//   /public   public content and form submissions
//   /admin    authenticated admin API
//   /creator  creator portal (Phase 2)
//   /brand    brand portal (Phase 2)