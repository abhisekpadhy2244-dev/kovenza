import { Router } from 'express';
import { adminRouter } from './admin';
import { healthRouter } from './health';
import { publicRouter } from './public';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/public', publicRouter);
apiRouter.use('/admin', adminRouter);

// Added in Phase 2:
//   /creator  creator portal
//   /brand    brand portal