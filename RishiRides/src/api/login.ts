import { startDemoLogin } from './demo-auth';

export type UserRole = 'passenger' | 'driver';

export type LoginResponse = {
  sessionId: string;
  mobile: string;
  role: UserRole;
  maskedMobile: string;
  deliveryChannel?: 'sms' | 'whatsapp' | 'demo';
  developmentOtp?: string;
};

type LoginRequest = {
  mobile: string;
  role: UserRole;
  name?: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

export async function loginUser(
  request: LoginRequest
): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    if (DEMO_MODE) return startDemoLogin(request.mobile, request.role);
    throw new Error('Authentication API is not configured. Start the RishiRide server, or explicitly enable local demo mode.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...request, name: request.name?.trim() || undefined }),
  });

  if (!response.ok) {
    throw new Error('Unable to login with the supplied details.');
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
    (payload.role !== 'passenger' && payload.role !== 'driver') ||
    !('maskedMobile' in payload) ||
    typeof payload.maskedMobile !== 'string'
  ) {
    throw new Error('The authentication service returned an invalid sign-in response.');
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