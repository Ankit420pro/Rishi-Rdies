import assert from 'node:assert/strict';
import test from 'node:test';

process.env.EXPO_PUBLIC_DRIVER_API_URL = 'http://127.0.0.1:8000/';

const { driverApi } = await import('../src/api/driver-api.ts');
const originalFetch = globalThis.fetch;

test('driver API requests use the FastAPI base URL and bearer token', async () => {
  let requestUrl = '';
  let requestOptions;
  globalThis.fetch = async (url, options) => {
    requestUrl = String(url);
    requestOptions = options;
    return new Response(JSON.stringify({ availability: 'online' }), { status: 200 });
  };

  try {
    const response = await driverApi.getMyProfile('driver-token');
    assert.equal(requestUrl, 'http://127.0.0.1:8000/api/drivers/me');
    assert.equal(requestOptions.headers.Authorization, 'Bearer driver-token');
    assert.deepEqual(response, { availability: 'online' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('accept ride encodes the ride id and uses POST', async () => {
  let requestUrl = '';
  let requestOptions;
  globalThis.fetch = async (url, options) => {
    requestUrl = String(url);
    requestOptions = options;
    return new Response(JSON.stringify({ accepted: true }), { status: 200 });
  };

  try {
    await driverApi.acceptRide('driver-token', 'ride/id');
    assert.equal(requestUrl, 'http://127.0.0.1:8000/api/rides/ride%2Fid/accept');
    assert.equal(requestOptions.method, 'POST');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('driver API requires an access token and reports API errors', async () => {
  await assert.rejects(driverApi.getMyStats(''), /access token is required/);

  globalThis.fetch = async () => new Response(JSON.stringify({ detail: 'Not authorized' }), { status: 403 });
  try {
    await assert.rejects(driverApi.getMyStats('driver-token'), /Not authorized/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});