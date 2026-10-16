import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1h'),
  DEV_OTP_SIMULATOR: z.enum(['true', 'false']).default('false'),
  OTP_PROVIDER: z.string().default('unconfigured'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:8081'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid server configuration: ${z.treeifyError(parsed.error).errors.join('; ')}`);
}

if (parsed.data.NODE_ENV === 'production' && parsed.data.OTP_PROVIDER === 'unconfigured') {
  throw new Error('OTP_PROVIDER must be configured in production.');
}
if (parsed.data.NODE_ENV !== 'development' && parsed.data.DEV_OTP_SIMULATOR === 'true') {
  throw new Error('The development OTP simulator is only allowed in development.');
}

export const config = {
  ...parsed.data,
  developmentOtpEnabled: parsed.data.NODE_ENV === 'development' && parsed.data.DEV_OTP_SIMULATOR === 'true',
};