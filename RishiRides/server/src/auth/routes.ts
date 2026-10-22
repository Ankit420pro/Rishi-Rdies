import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { config } from '../config';
import { prisma } from '../db';
import { DEVELOPMENT_OTP, hashOtp, isOtpUsable, otpMatches, OTP_MAX_ATTEMPTS, OTP_TTL_MS } from './otp';
import { sendTwilioOtp, verifyTwilioOtp } from './otp-provider';

export const authRouter = Router();

const requestLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });
const phoneSchema = z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit Indian mobile number.');
const loginSchema = z.object({
  mobile: phoneSchema,
  role: z.enum(['passenger', 'driver']),
  name: z.string().trim().min(1).max(120).optional(),
});
const signupSchema = z.object({
  mobile: phoneSchema,
  role: z.enum(['passenger', 'driver']),
  name: z.string().trim().min(1).max(120),
  email: z.email().trim().toLowerCase().optional(),
  preferredLanguage: z.enum(['en', 'hi']),
  termsAccepted: z.literal(true),
  privacyAccepted: z.literal(true),
});
const verifySchema = z.object({ sessionId: z.uuid(), mobile: phoneSchema, otp: z.string().regex(/^[0-9]{4,6}$/) });
const resendSchema = z.object({ sessionId: z.uuid(), mobile: phoneSchema });

async function issueOtp(userId: string, mobile: string) {
  const code = config.developmentOtpEnabled ? DEVELOPMENT_OTP : undefined;
  const challenge = await prisma.$transaction(async (transaction) => {
    await transaction.otpChallenge.updateMany({ where: { userId, consumedAt: null }, data: { consumedAt: new Date() } });
    return transaction.otpChallenge.create({
      data: { userId, codeHash: hashOtp(code ?? randomBytes(32).toString('hex')), expiresAt: new Date(Date.now() + OTP_TTL_MS) },
      select: { id: true },
    });
  });

  if (config.developmentOtpEnabled) {
    return { developmentOtp: code };
  }

  if (config.OTP_PROVIDER === 'twilio-verify') {
    await sendTwilioOtp(mobile, {
      accountSid: config.TWILIO_ACCOUNT_SID!,
      authToken: config.TWILIO_AUTH_TOKEN!,
      serviceSid: config.TWILIO_VERIFY_SERVICE_SID!,
    });
    return {};
  }

  throw new Error('OTP delivery is not configured. No message was sent.');
}

authRouter.post('/login', requestLimit, async (request, response, next) => {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Enter a valid mobile number and account type.' } });
  if (!config.otpDeliveryConfigured) return response.status(503).json({ error: { code: 'OTP_DELIVERY_UNAVAILABLE', message: 'Phone verification is not configured. No OTP was sent.' } });

  try {
    const role = parsed.data.role === 'driver' ? 'DRIVER' : 'PASSENGER';
    const user = await prisma.user.findUnique({
      where: { phone_role: { phone: parsed.data.mobile, role } },
      select: { id: true, phone: true, role: true },
    });
    if (!user) return response.status(404).json({ error: { code: 'ACCOUNT_NOT_FOUND', message: 'No account was found for this number. Create an account first.' } });

    const { developmentOtp } = await issueOtp(user.id, user.phone);
    return response.status(202).json({
      sessionId: (await prisma.otpChallenge.findFirstOrThrow({ where: { userId: user.id, consumedAt: null }, orderBy: { createdAt: 'desc' }, select: { id: true } })).id,
      mobile: user.phone,
      role: parsed.data.role,
      maskedMobile: `******${user.phone.slice(-4)}`,
      ...(developmentOtp ? { developmentOtp } : {}),
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/signup', requestLimit, async (request, response, next) => {
  const parsed = signupSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Enter your name, mobile, language, and accept both required policies.' } });
  if (!config.otpDeliveryConfigured) return response.status(503).json({ error: { code: 'OTP_DELIVERY_UNAVAILABLE', message: 'Phone verification is not configured. No OTP was sent.' } });

  try {
    const role = parsed.data.role === 'driver' ? 'DRIVER' : 'PASSENGER';
    const existing = await prisma.user.findUnique({
      where: { phone_role: { phone: parsed.data.mobile, role } },
      select: { role: true },
    });
    if (existing) return response.status(409).json({ error: { code: 'ACCOUNT_EXISTS', message: `A ${parsed.data.role} account already exists for this number. Sign in instead.` } });

    const acceptedAt = new Date();
    const user = await prisma.user.create({
      data: {
        phone: parsed.data.mobile,
        name: parsed.data.name,
        email: parsed.data.email,
        role,
        preferredLanguage: parsed.data.preferredLanguage,
        termsAcceptedAt: acceptedAt,
        privacyAcceptedAt: acceptedAt,
      },
      select: { id: true, phone: true },
    });

    const { developmentOtp } = await issueOtp(user.id, user.phone);
    const challenge = await prisma.otpChallenge.findFirstOrThrow({
      where: { userId: user.id, consumedAt: null },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    return response.status(202).json({
      sessionId: challenge.id,
      mobile: user.phone,
      role: parsed.data.role,
      maskedMobile: `******${user.phone.slice(-4)}`,
      ...(developmentOtp ? { developmentOtp } : {}),
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/resend-otp', requestLimit, async (request, response, next) => {
  const parsed = resendSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'The verification session is invalid.' } });
  if (!config.otpDeliveryConfigured) return response.status(503).json({ error: { code: 'OTP_DELIVERY_UNAVAILABLE', message: 'Phone verification is not configured. No OTP was sent.' } });

  try {
    const user = await prisma.user.findFirst({ where: { phone: parsed.data.mobile, challenges: { some: { id: parsed.data.sessionId } } }, select: { id: true } });
    if (!user) return response.status(404).json({ error: { code: 'SESSION_NOT_FOUND', message: 'The verification session was not found.' } });
    const result = await issueOtp(user.id, parsed.data.mobile);
    const challenge = await prisma.otpChallenge.findFirstOrThrow({ where: { userId: user.id, consumedAt: null }, orderBy: { createdAt: 'desc' }, select: { id: true } });
    return response.json({ sessionId: challenge.id, ...(result.developmentOtp ? { developmentOtp: result.developmentOtp } : {}) });
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/verify-otp', requestLimit, async (request, response, next) => {
  const parsed = verifySchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Enter the verification code for this session.' } });
  const requiredLength = config.developmentOtpEnabled ? 4 : 6;
  if (parsed.data.otp.length !== requiredLength) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `Enter the ${requiredLength}-digit verification code.` } });

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const challenge = await transaction.otpChallenge.findFirst({
        where: { id: parsed.data.sessionId, user: { phone: parsed.data.mobile } },
        include: { user: true },
      });
      if (!challenge || !isOtpUsable(challenge)) return { kind: 'invalid' as const };

      const matches = config.developmentOtpEnabled
        ? parsed.data.otp === DEVELOPMENT_OTP && otpMatches(DEVELOPMENT_OTP, challenge.codeHash)
        : config.OTP_PROVIDER === 'twilio-verify'
          ? await verifyTwilioOtp(parsed.data.mobile, parsed.data.otp, {
              accountSid: config.TWILIO_ACCOUNT_SID!,
              authToken: config.TWILIO_AUTH_TOKEN!,
              serviceSid: config.TWILIO_VERIFY_SERVICE_SID!,
            })
          : false;
      if (!matches) {
        await transaction.otpChallenge.updateMany({
          where: { id: challenge.id, attempts: challenge.attempts, consumedAt: null, expiresAt: { gt: new Date() } },
          data: { attempts: { increment: 1 } },
        });
        return { kind: 'invalid' as const };
      }

      const consumed = await transaction.otpChallenge.updateMany({
        where: { id: challenge.id, attempts: { lt: OTP_MAX_ATTEMPTS }, consumedAt: null, expiresAt: { gt: new Date() } },
        data: { consumedAt: new Date() },
      });
      if (consumed.count !== 1) return { kind: 'invalid' as const };

      const user = await transaction.user.update({
        where: { id: challenge.userId },
        data: { status: challenge.user.role === 'DRIVER' ? 'PENDING_VERIFICATION' : 'ACTIVE' },
        select: { id: true, role: true, status: true },
      });
      return { kind: 'verified' as const, user };
    }, { isolationLevel: 'Serializable' });

    if (result.kind !== 'verified') return response.status(401).json({ error: { code: 'OTP_INVALID', message: 'The code is incorrect, expired, or already used.' } });
    const token = jwt.sign({ role: result.user.role }, config.JWT_SECRET, { subject: result.user.id, expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
    return response.json({ verified: true, token });
  } catch (error) {
    return next(error);
  }
});