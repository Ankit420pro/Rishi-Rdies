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

test('signup sends language and consent without collecting passenger driving documents', async () => {
  let requestBody;
  globalThis.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({
        sessionId: 'session',
        mobile: '9876543210',
        role: 'passenger',
        maskedMobile: '******3210',
      }),
    };
  };

  try {
    await signupUser({
      name: 'A Driver',
      email: 'Rider@example.com',
      mobile: '9876543210',
      role: 'passenger',
      preferredLanguage: 'hi',
      termsAccepted: true,
      privacyAccepted: true,
    });

    assert.equal(requestBody.name, 'A Driver');
    assert.equal(requestBody.email, 'rider@example.com');
    assert.equal(requestBody.role, 'passenger');
    assert.equal(requestBody.preferredLanguage, 'hi');
    assert.equal(requestBody.termsAccepted, true);
    assert.equal(requestBody.privacyAccepted, true);
    assert.equal('licenseNumber' in requestBody, false);
    assert.equal('password' in requestBody, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
