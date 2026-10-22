# RishiRides

RishiRides is a mobile-first Expo app and API starter for local rides in Rishikesh. Account signup and phone verification are implemented; driver document storage/review, maps, payments and ride dispatch are not live features yet.

## Requirements

- Node.js compatible with Expo SDK 57
- Android Studio/emulator or an Android device with Expo Go/development build
- PostgreSQL for the API
- Twilio Verify credentials for real SMS OTP delivery

## Install and run

```bash
npm install
cp .env.example .env
npx expo start
```

Press `a` to open an Android emulator, or scan the QR code with a compatible Expo Go installation. For a physical device, set `EXPO_PUBLIC_API_URL` in `.env` to an API URL reachable from that device. Android emulators can commonly reach a host machine at `http://10.0.2.2:4000`.

The Expo web target is optional:

```bash
npm run web
```

Web sign-in is intentionally blocked after OTP verification because the app does not persist credentials insecurely in browser storage.

To run the API, configure `server/.env`, then run:

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:deploy
npm run dev
```

Passenger and driver profiles are separate role accounts. The same mobile number may have one account for each role; login and signup always use the selected role. Existing databases must apply the `20261022130000_role_scoped_phone` migration with `npm run prisma:deploy` before this behavior is available.

## Configuration

`EXPO_PUBLIC_API_URL` is the base URL used by the login, signup and OTP clients. The included API implements:

- `POST /auth/login` for existing accounts with `{ mobile, role }`.
- `POST /auth/signup` with `{ name, mobile, role, preferredLanguage, termsAccepted, privacyAccepted, email? }`. Email is optional and stored when provided.
- `POST /auth/verify-otp` with `{ sessionId, mobile, otp }`, returning `{ verified: true, token }` on success.
- `POST /auth/resend-otp` with `{ sessionId, mobile }`.

For local development only, `DEV_OTP_SIMULATOR=true` returns a development code. For real delivery, set `DEV_OTP_SIMULATOR=false`, `OTP_PROVIDER=twilio-verify`, and the Twilio account/auth/service values in `server/.env`. Provider credentials must never be added to the Expo client's `.env` or source control. Production refuses to start without Twilio Verify configuration.

This value is public client configuration, not a place for provider secrets. OTP provider credentials, database URLs, payment credentials, and messaging credentials belong only on a trusted server. No API URL or production credentials are included in this repository.

## Checks

```bash
npx tsc --noEmit
npm test
```

## Feature status

| Area | Status |
| --- | --- |
| Landing and role-specific signup navigation | Implemented |
| Passenger account signup | Name, mobile, preferred language and required policy consent are stored server-side |
| OTP authentication | Development simulator or Twilio Verify; no production OTP is generated or exposed by the client |
| Native session persistence | Verified session token is stored using Expo SecureStore |
| Driver onboarding | Four-stage requirements and status gate shown; application intake, private uploads and admin approval are not configured, so drivers remain unable to go online |
| Dashboard role routing | Client routes require a SecureStore session with the matching role; API authorization is still required |
| Passenger pickup entry, foreground location request, destination suggestions and group-size vehicle choice | Client UI and local validation implemented |
| Fare quotes, ride creation, driver matching, job dispatch and lifecycle | Not implemented; no API exists in this repository |
| Passenger profile, saved places, emergency contacts, payments, ratings and completed-ride OTP | Not implemented |
| Driver private document storage, state/category rules and admin approval | Not implemented; do not collect identity or bank documents in this build |
| Maps, push notifications, WhatsApp, payments and admin tools | Not implemented |

Do not use the current app to accept real ride requests or payments. Client-side route checks are not a replacement for server-side authentication, authorization, ownership checks, or persisted ride state.
