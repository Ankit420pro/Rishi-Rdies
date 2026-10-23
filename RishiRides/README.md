# RishiRides

RishiRides is a mobile-first Expo app and API starter for local rides in Rishikesh. Passenger signup and phone verification are implemented. Driver access is not available in this app; driver details will be integrated from the branch app through an API when that endpoint is provided.

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

## Local demo mode

When `EXPO_PUBLIC_API_URL` is unset, the app uses a local passenger demo service and does not need PostgreSQL or the API server. Sign up as a passenger, then enter the displayed local demo OTP `1234`. Demo accounts, sessions, and ride requests are stored on the current browser/device only. Demo trips and fares are illustrative only; no real dispatch, tracking, payment, or message occurs. Clear the app/browser storage to remove demo accounts.

When `EXPO_PUBLIC_API_URL` is set, authentication uses the configured API instead of local demo mode. The ride dispatch API is not implemented yet, so booking remains unavailable as a real trip.

Web sign-in is intentionally blocked after OTP verification because the app does not persist credentials insecurely in browser storage.

To run the API, configure `server/.env`, then run:

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:deploy
npm run dev
```

Passenger signup/login is the only account flow currently exposed by the app and API. The database retains its driver role for future integration, but public auth endpoints reject driver login and signup. Driver details are expected from the branch app API once its contract is available.

## Configuration

`EXPO_PUBLIC_API_URL` is the base URL used by the login, signup and OTP clients. The included API implements:

- `POST /auth/login` for passenger accounts with `{ mobile, role: "passenger" }`.
- `POST /auth/signup` with `{ name, mobile, role: "passenger", preferredLanguage, termsAccepted, privacyAccepted, email? }`. Email is optional and stored when provided.
- `POST /auth/verify-otp` with `{ sessionId, mobile, otp }`, returning `{ verified: true, token }` on success.
- `POST /auth/resend-otp` with `{ sessionId, mobile }`.

For API development only, `DEV_OTP_SIMULATOR=true` returns a development code. For real delivery, set `DEV_OTP_SIMULATOR=false`, `OTP_PROVIDER=twilio-verify`, and the Twilio account/auth/service values in `server/.env`. Set `OTP_CHANNEL=whatsapp` to request WhatsApp delivery, or leave it as `sms`. WhatsApp requires an enabled Twilio Verify WhatsApp channel/sender and any required approved templates/business setup; this repository has no provider credentials, and no WhatsApp message is sent by local demo mode. Provider credentials must never be added to the Expo client's `.env` or source control. Production refuses to start without Twilio Verify configuration.

This value is public client configuration, not a place for provider secrets. OTP provider credentials, database URLs, payment credentials, and messaging credentials belong only on a trusted server. No API URL or production credentials are included in this repository.

## Checks

```bash
npx tsc --noEmit
npm test
```

## Feature status

| Area | Status |
| --- | --- |
| Landing and passenger signup navigation | Implemented |
| Passenger account signup | Name, mobile, preferred language and required policy consent are stored server-side |
| OTP authentication | Development simulator or Twilio Verify; no production OTP is generated or exposed by the client |
| Native session persistence | Verified session token is stored using Expo SecureStore |
| Driver login, signup, onboarding and dashboard | Removed; driver details will come from the branch app API when available |
| Passenger dashboard routing | Client routes require a SecureStore passenger session; API authorization is still required |
| Passenger pickup entry, foreground location request, destination suggestions and group-size vehicle choice | Client UI and local validation implemented |
| Fare quotes, ride creation, driver matching, job dispatch and lifecycle | Not implemented; no API exists in this repository |
| Passenger profile, saved places, emergency contacts, payments, ratings and completed-ride OTP | Not implemented |
| Driver private document storage, state/category rules and admin approval | Not implemented; do not collect identity or bank documents in this build |
| Maps, push notifications, WhatsApp, payments and admin tools | Not implemented |

Do not use the current app to accept real ride requests or payments. Client-side route checks are not a replacement for server-side authentication, authorization, ownership checks, or persisted ride state.
