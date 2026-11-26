import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';

function limiter(windowMs: number, limit: number, message: string) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => env.isTest,
    message: { error: { code: 'RATE_LIMITED', message } },
  });
}

const MINUTE = 60 * 1000;

// General protection for every API route.
export const apiLimiter = limiter(15 * MINUTE, 300, 'Too many requests. Please try again shortly.');

// Public forms (brand enquiry, creator application): strict per IP.
export const formLimiter = limiter(60 * MINUTE, 10, 'Too many submissions. Please try again later.');

// Login, password reset and similar: brute-force protection.
export const authLimiter = limiter(15 * MINUTE, 10, 'Too many attempts. Please try again in a few minutes.');