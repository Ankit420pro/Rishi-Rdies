export type TwilioVerifyCredentials = {
  accountSid: string;
  authToken: string;
  serviceSid: string;
};

type Fetcher = typeof fetch;

function authorizationHeader(credentials: TwilioVerifyCredentials): string {
  return `Basic ${Buffer.from(`${credentials.accountSid}:${credentials.authToken}`).toString('base64')}`;
}

function endpoint(credentials: TwilioVerifyCredentials, operation: 'Verifications' | 'VerificationChecks'): string {
  return `https://verify.twilio.com/v2/Services/${encodeURIComponent(credentials.serviceSid)}/${operation}`;
}

export async function sendTwilioOtp(
  mobile: string,
  credentials: TwilioVerifyCredentials,
  fetcher: Fetcher = fetch,
  channel: 'sms' | 'whatsapp' = 'sms',
): Promise<void> {
  const response = await fetcher(endpoint(credentials, 'Verifications'), {
    method: 'POST',
    headers: {
      Authorization: authorizationHeader(credentials),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: `+91${mobile}`, Channel: channel }),
  });

  if (!response.ok) {
    throw new Error('The configured verification provider could not send a code.');
  }
}

export async function verifyTwilioOtp(
  mobile: string,
  code: string,
  credentials: TwilioVerifyCredentials,
  fetcher: Fetcher = fetch,
): Promise<boolean> {
  const response = await fetcher(endpoint(credentials, 'VerificationChecks'), {
    method: 'POST',
    headers: {
      Authorization: authorizationHeader(credentials),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: `+91${mobile}`, Code: code }),
  });

  if (response.status === 400 || response.status === 404) {
    return false;
  }
  if (!response.ok) throw new Error('The configured verification provider could not verify the code.');

  const result: unknown = await response.json();
  return typeof result === 'object' && result !== null && 'status' in result && result.status === 'approved';
}