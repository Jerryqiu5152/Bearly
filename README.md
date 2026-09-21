# Bearly 🐻

A mental health companion app: journaling, sending motivational cards, checking
in with a family/friend circle, a virtual companion animal you raise through
wellness tasks, quick access to crisis resources, and connecting with
therapists/doctors.

## Structure

- `mobile/` — React Native (Expo) app, iOS + Android from one codebase.
- `backend/` — Node/Express API with PostgreSQL (via Prisma).

## Getting started

### Backend
```
cd backend
cp .env.example .env      # fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run dev
```

### Mobile app
```
cd mobile
npm install
# point the app at your local backend:
echo "EXPO_PUBLIC_API_URL=http://localhost:3000" > .env
npx expo start
```
Scan the QR code with Expo Go, or press `i`/`a` for a simulator.

## Pushing to GitHub

```
cd bearly
git init
git add .
git commit -m "Initial Bearly scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/bearly.git
git push -u origin main
```
(`.gitignore` already excludes `node_modules`, `.env`, and build artifacts.)

## Path to the App Store

This scaffold gets you a working app you can run in Expo Go and test on real
devices, but there are real steps left before it can ship:

1. **Apple Developer Program** ($99/yr) — required to submit to the App Store.
2. **EAS Build** (`npx eas build --platform ios`) — Expo's cloud build service
   produces the signed `.ipa`. `npx eas submit` uploads it to App Store Connect.
3. **App Store review for health apps.** Apple scrutinizes mental-health apps
   more closely. Be ready to show:
   - Accurate, unmodified crisis hotline numbers (don't let this content be
     user-editable).
   - Clear disclaimers that the app is not a replacement for professional care
     or emergency services.
   - If you connect users with real clinicians, verifiable proof they're
     licensed (the `Therapist.verifiedAt` field models this — populate it only
     after real verification, not user self-report).
4. **Privacy considerations.** Journal entries, mood check-ins, and therapist
   requests are sensitive health data.
   - Add a real Privacy Policy (required by Apple) and an in-app consent flow.
   - If you facilitate access to actual healthcare providers in the US, look
     into whether **HIPAA** applies to you and whether you need a **Business
     Associate Agreement** with any telehealth/video vendor you use — this is
     a legal question worth a lawyer's input, not something to guess at.
   - Encrypt data at rest (most managed Postgres providers support this) and
     always serve the API over HTTPS.
5. **Push notifications** for received cards/check-ins: wire up Expo
   Notifications (or FCM/APNs directly).
6. **Real video/telehealth.** Don't build video calling from scratch for
   clinical sessions — integrate a HIPAA-eligible provider (e.g. a telehealth
   API vendor) rather than rolling your own.
7. **Crisis flows are the highest-stakes part of this app.** Before launch,
   have someone with clinical/crisis-response background review the Crisis
   screen's content and the "struggling" check-in flow.

## Design notes

The palette in `mobile/src/theme/theme.js` intentionally avoids high-saturation
colors and reserves red (`colors.danger`) for the crisis/emergency actions only,
so it reads as urgent without making the rest of the app feel alarming.
