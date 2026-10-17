import assert from 'node:assert/strict';
import test from 'node:test';

process.env.EXPO_PUBLIC_API_URL = 'https://api.example.test';

const { loginUser } = await import('../src/api/login.ts');
const { verifyOtp } = await import('../src/api/otp.ts');
const { signupUser } = await import('../src/api/signup.ts');

const originalFetch = globalThis.fetch;

test('login API rejects an invalid role response', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      sessionId: 'session',
      mobile: '9876543210',
      role: 'admin',
      maskedMobile: '******3210',
    }),
  });

  try {
    await assert.rejects(
      loginUser({ mobile: '9876543210', password: 'secret', role: 'passenger' }),
      /invalid sign-in response/
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('OTP verification requires a token for a verified session', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ verified: true }),
  });

  try {
    await assert.rejects(
      verifyOtp({ sessionId: 'session', mobile: '9876543210', otp: '123456' }),
      /invalid verification response/
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('signup sends a licence number only for driver accounts', async () => {
  const requests = [];
  globalThis.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return {
      ok: true,
      json: async () => ({
        sessionId: 'session',
        mobile: '9876543210',
        role: requests.at(-1).role,
        maskedMobile: '******3210',
      }),
    };
  };

  try {
    await signupUser({
      name: 'A Driver',
      mobile: '9876543210',
      password: 'secret',
      role: 'driver',
      licenseNumber: 'DL123',
    });
    await signupUser({
      name: 'A Passenger',
      mobile: '9876543210',
      password: 'secret',
      role: 'passenger',
    });

    assert.equal(requests[0].licenseNumber, 'DL123');
    assert.equal('licenseNumber' in requests[1], false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
