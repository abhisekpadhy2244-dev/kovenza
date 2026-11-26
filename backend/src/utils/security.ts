import crypto from 'node:crypto';
import { env } from '../config/env';

/** Cryptographically random hex token. */
export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/** SHA-256 hex digest. Used to store session and reset tokens as hashes only. */
export function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/** Salted hash of an IP address, so raw IPs are never stored. */
export function hashIp(ip?: string | null): string | null {
  if (!ip) return null;
  return crypto.createHmac('sha256', env.IP_HASH_SALT).update(ip).digest('hex');
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}