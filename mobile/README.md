# Movio Mobile

Expo Go shell for the Movio Vite web app.

## Run with Expo Go

Terminal 1, from project root:

```bash
npm run web:lan
```

Copy the `Network` URL printed by Vite, for example:

```text
http://192.168.1.20:5173/
```

Create `mobile/.env` with the copied LAN URL. This step is required on a real phone because `localhost` points to the phone, not your computer:

```bash
EXPO_PUBLIC_MOVIO_WEB_URL=http://192.168.1.20:5173
```

Terminal 2, from project root:

```bash
npm run mobile
```

Scan the QR code with Expo Go. Make sure the phone and computer are on the same Wi-Fi.
