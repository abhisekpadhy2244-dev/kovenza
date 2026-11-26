import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';

// No 0/O/1/I so codes are easy to read out over the phone.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** e.g. ENQ-2026-7H3K9P */
export function generateCode(prefix: string): string {
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }
  return `${prefix}-${new Date().getFullYear()}-${suffix}`;
}

/** Creates a record with a fresh code, retrying if the (very unlikely) code already exists. */
export async function withUniqueCode<T>(prefix: string, create: (code: string) => Promise<T>): Promise<T> {
  const attempts = 5;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await create(generateCode(prefix));
    } catch (error) {
      const duplicate = error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
      if (!duplicate || attempt === attempts) throw error;
    }
  }
  throw new Error('Could not generate a unique code');
}