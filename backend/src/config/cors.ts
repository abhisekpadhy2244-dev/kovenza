import cors from 'cors';
import { env } from './env';

// Requests with no Origin header (server-to-server, the Next.js proxy, curl) are allowed.
// Browsers from other sites are only allowed if listed in FRONTEND_URL / CORS_ORIGINS.
export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  maxAge: 600,
});