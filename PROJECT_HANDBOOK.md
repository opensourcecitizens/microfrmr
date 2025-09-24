Project Handbook — microfrmr

This handbook documents the debugging, fixes, and test wiring performed to make the Farmers-Choice API + Expo frontend work together. Keep this in the repo for future contributors and for quick recovery if you hit the same issues again.

Quick reference — commands you can run now

Run backend tests:

```bash
cd /workspaces/microfrmr/Farmers-Choice-API
npm install
npm test
```

Start backend in dev:

```bash
cd /workspaces/microfrmr/Farmers-Choice-API
npm run dev   # uses ts-node/register
# or build and run
npm run build
node dist/app.js
```

Start Expo frontend:

```bash
cd /workspaces/microfrmr/Farmers-Choice-FrontEnd
npm install
expo start
```

Run the upload sanity test (one-off):
- The repo includes `test/upload.test.js` which posts a small file and fetches it back.

High-level summary of what was changed and why

1) Unify backend module system to CommonJS
- Problem: Mixed ESM and CommonJS caused parse errors and Jest failures.
- Fix: Converted remaining ESM model files to CommonJS (`require`/`module.exports`) and removed `"type": "module"` from the backend `package.json`.
- Why: The project used CommonJS widely; keeping one module system avoids runtime/jest parse errors.

2) Fix route/controller wiring
- Problem: Routes referenced undefined controller symbols or mismatched function names.
- Fix: Standardized route imports (e.g., `const controller = require('...')`) and ensured exported controller names match usage. Implemented missing controller functions (e.g., `updateReminder`).

3) Installed required dependencies
- Problem: `multer` was required but not installed.
- Fix: Added `multer` to `package.json` and ran `npm install`.

4) Prevent server auto-listen when required by tests
- Problem: Tests import `app`; if `app.js` calls `app.listen()` unconditionally that conflicts with supertest.
- Fix: Start the server only when `require.main === module`.

5) Add static serving for uploads
- Problem: Uploaded files returned URLs but were not served.
- Fix: `app.use('/uploads', express.static(...))` and ensure `uploads/` directory exists on startup.

6) Tests: robust integration tests + upload test
- Problem: Mongoose buffered operations without a DB and mongodb-memory-server failed in this environment.
- Fix: Implemented two approaches during iteration:
  - Added a `test/setupMongo.js` helper for `mongodb-memory-server` (useful when environment supports binary downloads).
  - Final, stable approach: Mocked Mongoose models in tests with in-memory implementations for the subset of methods used by controllers. This keeps tests fast and reliable in CI/container constraints.

7) Frontend: CreateAccount token persistence
- Problem: Create account flow didn't persist JWT token.
- Fix: Persist token to AsyncStorage after registering and navigate into the main app flow.

Failure symptoms and exact diagnostics

1) "Cannot use import statement outside a module"
- Symptom: Node/Jest fails parsing files with `import`.
- Fix: Convert file to CommonJS or switch entire project to ESM. We converted offending model files to CommonJS.

2) "Route.get() requires a callback function but got [object Undefined]" / "XController not defined"
- Symptom: Server fails on route loading.
- Fix: Ensure routes `require` the controller module and call existing exported names.

3) "TextEncoder is not defined"
- Symptom: Jest complains when using APIs that expect TextEncoder/TextDecoder.
- Fix: Polyfill in `test/jest.setup.js` with node `util`:
  ```js
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  ```

4) Mongoose buffering timeouts in tests
- Symptom: `Operation 'items.find()' buffering timed out after 10000ms`.
- Diagnostics: No Mongo connection while controllers call Mongoose methods.
- Fix options:
  - Option A: `mongodb-memory-server` — spins a real in-memory mongod; requires binary download or system binary.
  - Option B (used): Mock models in tests with in-memory stores implementing `create`, `find`, `findOne`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`.

5) `require('multer')` fails
- Fix: `npm install multer`.

6) React components cause `Unexpected token '<'` in Node
- Cause: Node cannot parse JSX; don't `require` frontend components in Node scripts. Use Expo to run frontend.

7) Upload returns URL but file is 404
- Fix: Add express static middleware and ensure the directory exists.

Exact edits performed (file-level snapshot)

Backend
- `package.json` — removed `type: module`; added `multer` and `mongodb-memory-server` (for environments that support it); changed jest config to `setupFilesAfterEnv`.
- `src/models/*.js` — converted `reminder.js`, `config.js`, `analytics.js` to CommonJS.
- `src/routes/*.js` — fixed controller imports and usage in `remindersRoutes.js`, `analyticsRoutes.js`, `marketplaceRoutes.js`, `itemsRoutes.js`.
- `src/controllers/reminderController.js` — added `updateReminder` and exported it.
- `src/controllers/itemController.js` — validation and sanitization; removed temporary DB-guard after test wiring.
- `src/app.js` — `if (require.main === module) app.listen(PORT)` to avoid auto-start on test import; added static serving for `/uploads` and ensured uploads directory creation.
- `src/routes/uploadsRoutes.js` — multer-based upload route (already in repo, kept and ensured multer installed).

Tests
- `test/jest.setup.js` — TextEncoder/TextDecoder polyfill; earlier memory-server setup removed due to environment constraints.
- `test/setupMongo.js` — helper for `mongodb-memory-server` (kept if environment supports external binary downloads).
- `test/api.test.js` — expanded tests for GET /api/items, auth register/login, and item CRUD; uses in-memory model mocks.
- `test/upload.test.js` — tests posting a temporary file to `/api/uploads` and fetching the returned URL.

Frontend
- `FrontEnd/src/api.js` — centralized API helper with auth and CRUD.
- `FrontEnd/Screens/Screens/createAccount.js` — store token from `api.register` in AsyncStorage and navigate into the app.

Troubleshooting recipes (copy/paste)

- Convert ESM -> CommonJS (one file):
  - `import x from 'y'` => `const x = require('y');`
  - `export default z` => `module.exports = z;`

- Guard `app.listen()` so tests can `require`:
  ```js
  if (require.main === module) {
    app.listen(PORT, () => console.log('Server running'));
  }
  module.exports = app;
  ```

- Fix upload serving:
  ```js
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  app.use('/uploads', express.static(uploadsDir));
  ```

- If `mongodb-memory-server` fails to start in your CI or container:
  - Ensure binary downloads are allowed or pre-install mongod.
  - Alternatively, run a containerized Mongo as a service in CI for real integration tests.
  - If the environment makes that impractical, use model mocks as we did in tests here.

Production and security notes (next steps before shipping)

- Move JWT secret out of code into env/secret manager.
- Replace local uploads with S3/GCS and use signed URLs for downloads.
- Add rate-limiting and account lockout for auth.
- Add centralized logging and monitoring (Sentry, Datadog, etc.).
- Harden input validation via `express-validator` or Joi.

Final notes

- Tests in this repo now run quickly and deterministically (no external mongod needed) thanks to quick in-memory mocks and a small suite that covers the most important flows.
- `test/setupMongo.js` is available if you later want to run true in-memory MongoDB integration tests on a runner that supports the binary.
- I kept the code changes minimal and isolated so you can revert/upgrade easily.

NEXT STEPS
- Convert the tests to use `mongodb-memory-server` (if you can run them in an environment that supports binary download), or
- Add production-ready S3 upload handling and adjust frontend helper to use pre-signed URLs, or
- Expand tests to cover more controllers and auth-protected endpoints.
