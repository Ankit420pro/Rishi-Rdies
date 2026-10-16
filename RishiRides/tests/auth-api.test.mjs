import assert from 'node:assert/strict';
import test from 'node:test';

process.env.EXPO_PUBLIC_API_URL = 'https://api.example.test';

const { loginUser } = await import('../src/api/login.ts');
const { verifyOtp } = await import('../src/api/otp.ts');

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
