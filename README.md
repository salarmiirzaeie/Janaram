# Janaram (جانارام)

A Persian-language mental-wellness app for Android and iOS: daily mood tracking with charts, guided meditations and breathing exercises, sleep sounds with a timer, an AI chat companion, psychological tests, and paid sessions with psychologists.

Built with **React Native 0.79, Expo 53, TypeScript** and a Next.js backend, [janaram-next](https://github.com/salarmiirzaeie/janaram-next).

## Features

- **Phone-number login with OTP**, including automatic SMS code reading on Android (`react-native-otp-verify`).
- **Mood tracking**: nine moods with an optional note per day, a 30-day history kept on the device, and weekly and monthly charts (bar, line, pie).
- **Meditation and breathing library**: explore, search, and a full-screen audio player that keeps playing in the background (`expo-av`).
- **Sleep mode**: a dark, low-stimulation theme together with a dedicated sleep-sounds tab.
- **AI chat companion** with conversation history (the AI provider is called from the backend, not from the app).
- **Subscriptions** through Cafe Bazaar in-app billing (`@cafebazaar/react-native-poolakey`).
- **Push notifications** (`expo-notifications`) with per-category settings.
- **Persian UX**: right-to-left layout, Jalali calendar (`date-fns-jalali`, `moment-jalaali`), Persian digits.
- **Over-the-air updates** via `expo-updates`, served by the backend.

## Architecture

```
app/                     Expo Router screens (file-based routing)
  (tabs)/                home, explore, sleep, reports, setting
  login.tsx, verifyOTP.tsx, chat-bot.tsx, player.tsx, subscription.tsx, ...
components/              feature components and the Gluestack UI primitives (components/ui)
redux/                   Redux Toolkit store, slices (auth, mood, settings, sleep, initialize)
                         and the RTK Query base API with automatic logout on 401
services/                RTK Query endpoints (auth, AI chat, plans and upgrades)
hooks/, context/         auth hook, toast hook, audio player context
utils/                   mood chart data builders, Persian digit helpers
```

State management in short:

- **Redux Toolkit** holds auth, mood history, settings and onboarding state. Everything except the API cache is persisted with `redux-persist` and AsyncStorage.
- **RTK Query** talks to the backend. The base query attaches the Bearer token and, when the server answers `401`, logs the user out and resets the API cache.
- **NativeWind (Tailwind)** and **Gluestack UI** provide styling and components. **Reanimated** drives animations.

## Getting started

```bash
npm install
cp .env.example .env     # see the file for what is needed
npx expo start           # then press a (Android) or i (iOS), or scan the QR code
```

The app needs a development build rather than Expo Go because it uses native modules (Poolakey, OTP auto-read):

```bash
npx expo run:android     # or: eas build --profile development --platform android
```

The API base URL is set in [`redux/api-slice.ts`](redux/api-slice.ts). To run against a local backend, start [janaram-next](https://github.com/salarmiirzaeie/janaram-next) and point `BASE_URL` at it.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | start the Expo dev server |
| `npm run android` / `npm run ios` | run on a device or emulator |
| `npm test` | unit tests (Jest and jest-expo) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `expo lint` |

## Tests

`npm test` covers the Redux slices (auth, mood history rules, settings), the mood chart builders and Persian utilities, and the API client (Bearer header, automatic logout on `401`, session kept on `500`). CI runs them on every push and pull request.

## Build and release

Builds use [EAS](https://docs.expo.dev/build/introduction/) (`eas.json` defines `development`, `preview` and `production` profiles with matching update channels). Set `EXPO_PUBLIC_BAZAR_RSA_KEY` as an EAS environment variable for production builds.
