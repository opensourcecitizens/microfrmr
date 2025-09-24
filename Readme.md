# Microfrmr

Microfrmr is a full-stack application consisting of a React Native (Expo) frontend and a Node.js/Express backend API (Farmers-Choice-API). The project is now configured to run both services using Docker and GitHub Codespaces for easy development and deployment.

## Project Structure

```
microfrmr/
├── .devcontainer/           # Codespaces configuration
│   └── devcontainer.json
├── Farmers-Choice-API/      # Backend API (Node.js/Express)
├── Screens/                 # Frontend screens (React Native)
├── components/              # Frontend components
├── assets/                  # Static assets
├── appData/                 # App data
├── App.js                   # Frontend entry point
├── docker-compose.yml       # Docker Compose configuration
├── package.json             # Frontend dependencies
└── README.md
```

## Getting Started

### With Docker Compose

1. Build and start both frontend and backend:
   ```
   docker-compose up --build
   ```

2. The API will be available at [http://localhost:3000](http://localhost:3000)  
   The frontend (Expo web) will be available at [http://localhost:19006](http://localhost:19006)

### With GitHub Codespaces

- Open the project in Codespaces.  
- The dev container will automatically set up both services using Docker Compose.

## Features

- **Frontend:** Built with React Native (Expo) for cross-platform support.
- **Backend:** Node.js/Express REST API for managing users, farms, items, reminders, analytics, and marketplace.
- **Dockerized:** Easy local development and deployment with Docker Compose.
- **Codespaces Ready:** Instant cloud development environment.

## License

This project is licensed under

## API Integration (Frontend ↔ Backend)

Summary of recent wiring:
- The frontend now uses `Farmers-Choice-FrontEnd/src/api.js` to call the backend API.
- The Details screen (`Screens/Screens/detailsScreen.js`) fetches `/api/items` and displays seeded items.
- The Dashboard screen (`Screens/Screens/dashboard.js`) fetches `/api/farms` and replaces static card data when available.
- The Add Item screen (`Screens/Screens/addItemScreen.js`) now POSTs new items to `/api/items`.
- Backend routes for items/farms/marketplace are available under `/api` (e.g. `/api/items`, `/api/farms`).

How to run locally (quick):

1. Ensure MongoDB container is running and seeded. If you used the seed scripts before, your data should be present.
2. Start backend (from `Farmers-Choice-API`):

```bash
cd Farmers-Choice-API
npm install
# using ts-node for dev
npx ts-node src/app.ts
```

3. Start frontend (from `Farmers-Choice-FrontEnd`):

```bash
cd Farmers-Choice-FrontEnd
npm install
npm start
```

4. If testing on a physical device or emulator, set `API_URL` to point to the machine running the backend (not `localhost` from the device):

```bash
API_URL=http://<host-ip>:3000 npm start
```

Notes and troubleshooting:
- Backend already enables CORS (`app.use(cors())`) so cross-origin requests from Expo/web should work.
- The frontend image mapping uses keys declared in `FrontEndappData/imageMap.js`. If your backend returns image file names or URLs, either update `imageMap` or change the frontend to render remote image URIs.
- If `npx ts-node` complains about unknown .ts extensions, ensure `ts-node` and `typescript` are installed and compatible with your Node version. Alternatively run `npm run build` then `node dist/app.js` after compiling TypeScript.

Walkthrough of what I changed and why:

1. Created a small API helper (`src/api.js`) to centralize fetch logic and provide consistent error handling. This avoids copy/paste across screens.
2. Wired `detailsScreen.js` to call `api.getItems()` on mount. I mapped the backend item fields to the UI shape the screen expects (id, farmName, images, description). This lets the details screen display real, seeded data.
3. Extended the API helper to include `getFarms()` and `createItem()` to support the dashboard and add-item flows.
4. Updated `dashboard.js` to call `api.getFarms()` and use the returned farms to render cards. It falls back to the sample `FrontEndappData/dashboardData.json` when no farms are available, so the UI keeps working offline.
5. Updated `addItemScreen.js` to POST a new item using `api.createItem()` so posts created in the app are saved to the backend.
6. Fixed a backend router file to ensure the `/api/items` routes point to the proper controller (prevents 500/require errors on the server).

Next recommended improvements:
- Add authentication and attach tokens to API calls (the backend includes `authRoutes.js` but frontend currently doesn't use auth).
- Implement file/image uploads (backend and frontend) so images are stored and returned as URLs rather than local keys.
- Add optimistic UI updates and better error handling/retries for unreliable networks.
- Add unit/integration tests for API helpers and controllers.

If you'd like, I can now:
- Wire another screen (marketplace or analytics) to the API.
- Add PUT/DELETE helpers and integrate edit/delete buttons on the dashboard cards.
- Fix `ts-node` startup by adding a small JS build step so you can run the backend easily in this environment.