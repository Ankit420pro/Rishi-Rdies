import assert from 'node:assert/strict';
import test from 'node:test';
import { sendTwilioOtp, verifyTwilioOtp, type TwilioVerifyCredentials } from '../src/auth/otp-provider';

const credentials: TwilioVerifyCredentials = {
  accountSid: 'AC123',
  authToken: 'test-token',
  serviceSid: 'VA456',
};

test('Twilio Verify sends SMS to the Indian E.164 number', async () => {
  let requestedUrl = '';
  let requestedBody = '';
  await sendTwilioOtp('9876543210', credentials, async (input, init) => {
    requestedUrl = String(input);
    requestedBody = String(init?.body);
    return new Response('{}', { status: 201 });
  });

  assert.equal(requestedUrl, 'https://verify.twilio.com/v2/Services/VA456/Verifications');
  assert.equal(new URLSearchParams(requestedBody).get('To'), '+919876543210');
  assert.equal(new URLSearchParams(requestedBody).get('Channel'), 'sms');
});

test('Twilio Verify can use WhatsApp when configured', async () => {
  let requestedBody = '';
  await sendTwilioOtp('9876543210', credentials, async (_input, init) => {
    requestedBody = String(init?.body);
    return new Response('{}', { status: 201 });
  }, 'whatsapp');

  assert.equal(new URLSearchParams(requestedBody).get('To'), '+919876543210');
  assert.equal(new URLSearchParams(requestedBody).get('Channel'), 'whatsapp');
});

test('Twilio Verify accepts only an approved verification response', async () => {
  const approved = await verifyTwilioOtp('9876543210', '123456', credentials, async (_input, init) => {
    assert.equal(new URLSearchParams(String(init?.body)).get('Code'), '123456');
    return new Response(JSON.stringify({ status: 'approved' }), { status: 200 });
  });
  const pending = await verifyTwilioOtp('9876543210', '123456', credentials, async () =>
    new Response(JSON.stringify({ status: 'pending' }), { status: 200 })
  );

  assert.equal(approved, true);
  assert.equal(pending, false);
});

test('Twilio delivery errors do not claim an OTP was sent', async () => {
  await assert.rejects(
    sendTwilioOtp('9876543210', credentials, async () => new Response('{}', { status: 401 })),
    /could not send/
  );
});