API integration notes

How this app calls the backend
- The frontend uses `src/api.js` as a small helper. It expects the backend to be reachable at `process.env.API_URL` or `process.env.EXPO_PUBLIC_API_URL` at runtime.
- By default it falls back to `http://localhost:3000` which matches the backend default in `Farmers-Choice-API/src/app.ts`.

Running the backend locally (development)
1. Ensure the MongoDB container is running and seeded with data.
2. From the `Farmers-Choice-API` folder install deps and run dev mode:

```bash
cd Farmers-Choice-API
npm install
# Start the API (uses ts-node)
npx ts-node src/app.ts
```

If you get errors about unknown .ts extensions, install `ts-node` and `typescript` locally and retry.

Running the frontend (Expo)
1. From the `Farmers-Choice-FrontEnd` folder:

```bash
cd Farmers-Choice-FrontEnd
npm install
# start expo
npm start
```

2. To point the mobile app to the API running on your host, set the environment variable when starting Expo:

On macOS/Linux (bash):

```bash
API_URL=http://<host-ip>:3000 npm start
```

On Windows (PowerShell):

```powershell
$env:API_URL = 'http://<host-ip>:3000'
npm start
```

Notes about testing the details screen
- Open the app and navigate to the Details screen. It will call `/api/items` on mount and replace the static sample data with seeded items from MongoDB.
- If images don't render, the app uses keys from `FrontEndappData/imageMap.js`. You can extend `imageMap` to include image paths that correspond to the `images` field returned by your backend.

Troubleshooting
- CORS: backend already enables CORS in `src/app.ts` with `app.use(cors())`.
- If the frontend cannot reach the backend from a device, ensure the Docker container port 3000 is published and use the machine IP (not localhost) on the device.
