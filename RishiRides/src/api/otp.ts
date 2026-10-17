export type OtpResponse =
  | { verified: false; token?: string }
  | { verified: true; token: string };

export type OtpChallengeResponse = {
  sessionId: string;
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
    throw new Error('Verification is unavailable because the authentication service is not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('The OTP is incorrect or has expired.');
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
    (token !== undefined && typeof token !== 'string')
  ) {
    throw new Error('The authentication service returned an invalid verification response.');
  }

  if (verified) {
    if (typeof token !== 'string' || !token) {
      throw new Error('The authentication service returned an invalid verification response.');
    }
    return { verified: true, token };
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
    throw new Error('OTP delivery is unavailable because the authentication service is not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, mobile }),
  });

  if (!response.ok) {
    throw new Error('Unable to resend the OTP.');
  }

  return response.json() as Promise<OtpChallengeResponse>;
}