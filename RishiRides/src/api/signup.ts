import type { LoginResponse, UserRole } from './login';

type SignupRequest = {
  name: string;
  mobile: string;
  password: string;
  role: UserRole;
  licenseNumber?: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export async function signupUser(
  request: SignupRequest
): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    throw new Error('Sign-up is unavailable because the authentication service is not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
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
    (payload.role !== 'passenger' && payload.role !== 'driver') ||
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
  };
}
