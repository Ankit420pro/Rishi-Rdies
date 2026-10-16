# RishiRides

RishiRides is a mobile-first Expo app for local rides in Rishikesh. The current repository contains the React Native client; it does not contain the production API, database, payment gateway, map provider, messaging provider, or admin panel.

## Requirements

- Node.js compatible with Expo SDK 57
- Android Studio/emulator or an Android device with Expo Go/development build
- An authentication API if you want to test phone sign-in

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

## Configuration

`EXPO_PUBLIC_API_URL` is the base URL used by the existing login and OTP clients. The API must implement:

- `POST /auth/login` with `{ mobile, password, role }`, returning `{ sessionId, mobile, role, maskedMobile }`.
- `POST /auth/verify-otp` with `{ sessionId, mobile, otp }`, returning `{ verified: true, token }` on success.
- `POST /auth/resend-otp` with `{ sessionId, mobile }`.

This value is public client configuration, not a place for provider secrets. OTP provider credentials, database URLs, payment credentials, and messaging credentials belong only on a trusted server. No API URL or production credentials are included in this repository.

## Checks

```bash
npx tsc --noEmit
npm test
```

## Feature status

| Area | Status |
| --- | --- |
| Landing, passenger/driver sign-in and sign-up screens | UI implemented |
| OTP authentication | Requires a configured API implementing the contract above |
| Native session persistence | Verified session token is stored using Expo SecureStore |
| Dashboard role routing | Client routes require a SecureStore session with the matching role; API authorization is still required |
| Passenger pickup entry, foreground location request, destination suggestions and group-size vehicle choice | Client UI and local validation implemented |
| Fare quotes, ride creation, driver matching, job dispatch and lifecycle | Not implemented; no API exists in this repository |
| Driver onboarding, private document storage and approval | Not implemented |
| Maps, push notifications, WhatsApp, payments and admin tools | Not implemented |

Do not use the current app to accept real ride requests or payments. Client-side route checks are not a replacement for server-side authentication, authorization, ownership checks, or persisted ride state.
