import { z } from 'zod';
import { email } from './common';

export const loginSchema = z.object({
  email,
  password: z
    .string({ required_error: 'Password is required', invalid_type_error: 'Password is required' })
    .min(1, 'Password is required')
    .max(200, 'Password is too long'),
});

// Same rules as the initial admin setup script.
export const strongPassword = z
  .string({ required_error: 'New password is required', invalid_type_error: 'New password is required' })
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[a-z]/, 'Password needs a lowercase letter')
  .regex(/[A-Z]/, 'Password needs an uppercase letter')
  .regex(/[0-9]/, 'Password needs a number')
  .regex(/[^A-Za-z0-9]/, 'Password needs a symbol');

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Current password is required', invalid_type_error: 'Current password is required' })
      .min(1, 'Current password is required')
      .max(200),
    newPassword: strongPassword,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Choose a new password that is different from the current one',
    path: ['newPassword'],
  });