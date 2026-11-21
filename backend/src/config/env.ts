import "dotenv/config";
import { z } from "zod";

// Treat empty strings (e.g. "RESEND_API_KEY=") as "not set".
const raw = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== ""),
);

const schema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(4000),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    FRONTEND_URL: z.string().url(),
    CORS_ORIGINS: z.string().default(""),

    SESSION_SECRET: z
      .string()
      .min(32, "SESSION_SECRET must be at least 32 characters"),
    IP_HASH_SALT: z
      .string()
      .min(16, "IP_HASH_SALT must be at least 16 characters"),
    COOKIE_DOMAIN: z.string().optional(),

    EMAIL_PROVIDER: z.enum(["console", "resend"]).default("console"),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().default("KOVÉNZA <no-reply@example.com>"),
    ADMIN_NOTIFY_EMAILS: z.string().default(""),
    BUSINESS_EMAIL: z.string().email().optional(),
    WHATSAPP_NUMBER: z
      .string()
      .regex(
        /^\d{8,15}$/,
        "WHATSAPP_NUMBER must be digits only, international format",
      )
      .optional(),

    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    TURNSTILE_SECRET_KEY: z.string().optional(),

    INITIAL_ADMIN_NAME: z.string().optional(),
    INITIAL_ADMIN_EMAIL: z.string().email().optional(),
    INITIAL_ADMIN_PASSWORD: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.EMAIL_PROVIDER === "resend" && !value.RESEND_API_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["RESEND_API_KEY"],
        message: "RESEND_API_KEY is required when EMAIL_PROVIDER=resend",
      });
    }
    if (value.NODE_ENV === "production") {
      const required = [
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "TURNSTILE_SECRET_KEY",
      ] as const;
      for (const key of required) {
        if (!value[key]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key],
            message: `${key} is required in production`,
          });
        }
      }
    }
  });

const parsed = schema.safeParse(raw);

if (!parsed.success) {
  const problems = parsed.error.issues
    .map((issue) => ` - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  // eslint-disable-next-line no-console
  console.error(`\nInvalid environment configuration:\n${problems}\n`);
  process.exit(1);
}

const data = parsed.data;

const splitList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const env = {
  ...data,
  isProd: data.NODE_ENV === "production",
  isTest: data.NODE_ENV === "test",
  corsOrigins: Array.from(
    new Set([data.FRONTEND_URL, ...splitList(data.CORS_ORIGINS)]),
  ),
  adminNotifyEmails: splitList(data.ADMIN_NOTIFY_EMAILS),
};

export type Env = typeof env;
