import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { corsMiddleware } from './config/cors';
import { apiLimiter } from './middleware/rateLimit';
import { originCheck } from './middleware/csrf';
import { errorHandler, notFoundHandler } from './middleware/error';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // The API sits behind the Next.js proxy and Render's load balancer.
  // Revisit the hop count when deploying (see docs/DEPLOYMENT.md).
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(corsMiddleware);
  if (!env.isTest) app.use(morgan(env.isProd ? 'combined' : 'dev'));

  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));
  app.use(cookieParser());
  app.use(hpp());

  app.use('/api', apiLimiter);
  app.use('/api', originCheck);
  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();