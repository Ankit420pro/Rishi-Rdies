import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1h'),
  DEV_OTP_SIMULATOR: z.enum(['true', 'false']).default('false'),
  OTP_PROVIDER: z.enum(['unconfigured', 'twilio-verify']).default('unconfigured'),
  OTP_CHANNEL: z.enum(['sms', 'whatsapp']).default('whatsapp'),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_VERIFY_SERVICE_SID: z.string().optional(),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:8081'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid server configuration: ${z.treeifyError(parsed.error).errors.join('; ')}`);
}

if (parsed.data.NODE_ENV === 'production' && parsed.data.OTP_PROVIDER !== 'twilio-verify') {
  throw new Error('A production OTP provider must be configured.');
}
if (parsed.data.NODE_ENV !== 'development' && parsed.data.DEV_OTP_SIMULATOR === 'true') {
  throw new Error('The development OTP simulator is only allowed in development.');
}
if (parsed.data.OTP_PROVIDER === 'twilio-verify' && (!parsed.data.TWILIO_ACCOUNT_SID || !parsed.data.TWILIO_AUTH_TOKEN || !parsed.data.TWILIO_VERIFY_SERVICE_SID)) {
  throw new Error('Twilio Verify requires its account SID, auth token, and service SID.');
}
if (parsed.data.DEV_OTP_SIMULATOR === 'true' && parsed.data.OTP_PROVIDER === 'twilio-verify') {
  throw new Error('Choose either the development OTP simulator or Twilio Verify, not both.');
}

export const config = {
  ...parsed.data,
  developmentOtpEnabled: parsed.data.NODE_ENV === 'development' && parsed.data.DEV_OTP_SIMULATOR === 'true',
  otpDeliveryConfigured: parsed.data.OTP_PROVIDER === 'twilio-verify' || (parsed.data.NODE_ENV === 'development' && parsed.data.DEV_OTP_SIMULATOR === 'true'),
};