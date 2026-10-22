import { resendDemoOtp, verifyDemoOtp } from './demo-auth';
const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

export type OtpResponse =
  | { verified: false; token?: string; role?: 'passenger' | 'driver' }
  | { verified: true; token: string; role?: 'passenger' | 'driver' };

export type OtpChallengeResponse = {
  sessionId: string;
  deliveryChannel?: 'sms' | 'whatsapp' | 'demo';
  developmentOtp?: string;
};

type OtpRequest = {
  sessionId: string;
  mobile: string;
  otp: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export async function verifyOtp(
  request: OtpRequest
): Promise<OtpResponse> {
  if (!API_BASE_URL) {
    if (DEMO_MODE) return verifyDemoOtp(request.sessionId, request.mobile, request.otp);
    throw new Error('Authentication API is not configured. Local OTP verification is disabled.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('The OTP is incorrect, expired or already used.');
    throw new Error('OTP verification is temporarily unavailable. Please try again.');
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('verified' in payload)
  ) {
    throw new Error('The authentication service returned an invalid verification response.');
  }

  const verified = payload.verified;
  const token = 'token' in payload ? payload.token : undefined;
  if (
    typeof verified !== 'boolean' ||
    (token !== undefined && typeof token !== 'string') ||
    ('role' in payload && payload.role !== 'passenger' && payload.role !== 'driver')
  ) {
    throw new Error('The authentication service returned an invalid verification response.');
  }

  if (verified) {
    if (typeof token !== 'string' || !token) {
      throw new Error('The authentication service returned an invalid verification response.');
    }
    return {
      verified: true,
      token,
      ...('role' in payload && (payload.role === 'passenger' || payload.role === 'driver') ? { role: payload.role } : {}),
    };
  }
  return typeof token === 'string'
    ? { verified: false, token }
    : { verified: false };
}

export async function resendOtp(
  sessionId: string,
  mobile: string
): Promise<OtpChallengeResponse> {
  if (!API_BASE_URL) {
    if (DEMO_MODE) return resendDemoOtp(sessionId, mobile);
    throw new Error('Authentication API is not configured. OTP resend is unavailable.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, mobile }),
  });

  if (!response.ok) {
    throw new Error('Unable to resend the OTP.');
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('sessionId' in payload) ||
    typeof payload.sessionId !== 'string' ||
    !payload.sessionId ||
    ('deliveryChannel' in payload && payload.deliveryChannel !== 'sms' && payload.deliveryChannel !== 'whatsapp' && payload.deliveryChannel !== 'demo') ||
    ('developmentOtp' in payload && typeof payload.developmentOtp !== 'string')
  ) {
    throw new Error('The authentication service returned an invalid resend response.');
  }

  return {
    sessionId: payload.sessionId,
    ...('deliveryChannel' in payload && (payload.deliveryChannel === 'sms' || payload.deliveryChannel === 'whatsapp' || payload.deliveryChannel === 'demo') ? { deliveryChannel: payload.deliveryChannel } : {}),
    ...('developmentOtp' in payload && typeof payload.developmentOtp === 'string'
      ? { developmentOtp: payload.developmentOtp }
      : {}),
  };
}