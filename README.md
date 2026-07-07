# nerampokku (நேரம்போக்கு)

An ephemeral, real-time public thought pool web application. Open it when you're bored, anonymously throw a short thought (max 200 characters) into the void, and watch it fade away. 

No signups, no database, no logs, and no persistence. Thoughts reside only in server RAM, are capped at a maximum of 100 messages total, and automatically expire for all active participants after 2 minutes.

Read our [Terms of Service](TERMS.md), [Privacy Policy](PRIVACY.md), and [License](LICENSE). Contributions are welcome; please see [Contributing Guidelines](CONTRIBUTING.md).

## Project Structure
- `/client` — React + Vite frontend styled with minimalist, atmospheric dark-mode CSS.
- `/server` — Express + Socket.IO Node.js server.

---

## Local Development Setup

### 1. Prerequisities
- Node.js (v18+) and npm installed.

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (copied from `.env.example`):
   ```bash
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ```
4. Start the development server (uses `nodemon`):
   ```bash
   npm run dev
   ```
   The API health endpoint is available at `http://localhost:5000/health`.

### 3. Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (copied from `.env.example`):
   ```bash
   VITE_WS_URL=http://localhost:5000
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
   Open the browser at `http://localhost:5173`.

---

## Production Deployment

### Frontend (Static Hosting - e.g. Vercel, Netlify, Render Static)
1. Build the production assets inside `/client`:
   ```bash
   cd client
   npm run build
   ```
2. This generates a production-ready `/client/dist` directory. Set your hosting provider to build using `npm run build` and publish the `dist` directory.
3. Configure the environment variable `VITE_WS_URL` to point to your live backend domain (e.g. `https://nerampokku-api.onrender.com`).

### Backend (Node.js Service - e.g. Render, Railway, Fly.io)
1. Set the root build command to build your backend if required, or simply start the node service by executing:
   ```bash
   cd server && npm install && npm start
   ```
2. Define the following environment variables in your server hosting settings:
   - `PORT`: Supplied automatically by Render/Railway (e.g. `8080` or `10000`).
   - `CORS_ORIGIN`: The URL of your live frontend application (e.g., `https://nerampokku.vercel.app` or `https://nerampokku.netlify.app`).

## Concept & Architectural Details
- **Anonymous Identity**: Generated client-side using adjective-noun combinations (e.g., `quiet_fox`, `cosmic_pulse`). Stored in `sessionStorage` to persist across pages refreshes during the session.
- **RAM-Only Messages**: Cleaned up via a server-side timer every second. When messages hit a lifetime of 120 seconds, they are swept, and deletion commands are broadcast to all socket connections.
- **Visual Lifeline**: Each card shows a thin active bar shrinking visually over 2 minutes, fading out of the UI cleanly 2 seconds before server removal.
