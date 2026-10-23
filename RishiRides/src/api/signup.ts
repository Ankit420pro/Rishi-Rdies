import { startDemoSignup } from './demo-auth';

import type { LoginResponse } from './login';

type SignupRequest = {
  name: string;
  email?: string;
  mobile: string;
  role: 'passenger';
  preferredLanguage: 'en' | 'hi';
  termsAccepted: true;
  privacyAccepted: true;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

export async function signupUser(
  request: SignupRequest
): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    if (DEMO_MODE) {
      return startDemoSignup({
        mobile: request.mobile,
        role: request.role,
        name: request.name.trim(),
        ...(request.email?.trim() ? { email: request.email.trim().toLowerCase() } : {}),
        preferredLanguage: request.preferredLanguage,
      });
    }
    throw new Error('Authentication API is not configured. Start the RishiRide server, or explicitly enable local demo mode.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...request,
      name: request.name.trim(),
      ...(request.email?.trim() ? { email: request.email.trim().toLowerCase() } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error('Unable to create an account with the supplied details.');
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('sessionId' in payload) ||
    typeof payload.sessionId !== 'string' ||
    !payload.sessionId ||
    !('mobile' in payload) ||
    typeof payload.mobile !== 'string' ||
    !('role' in payload) ||
    payload.role !== 'passenger' ||
    !('maskedMobile' in payload) ||
    typeof payload.maskedMobile !== 'string'
  ) {
    throw new Error('The authentication service returned an invalid sign-up response.');
  }

  return {
    sessionId: payload.sessionId,
    mobile: payload.mobile,
    role: payload.role,
    maskedMobile: payload.maskedMobile,
    ...('deliveryChannel' in payload && (payload.deliveryChannel === 'sms' || payload.deliveryChannel === 'whatsapp' || payload.deliveryChannel === 'demo') ? { deliveryChannel: payload.deliveryChannel } : {}),
    ...('developmentOtp' in payload && typeof payload.developmentOtp === 'string' ? { developmentOtp: payload.developmentOtp } : {}),
  };
}
