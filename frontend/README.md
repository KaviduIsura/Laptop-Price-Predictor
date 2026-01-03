# Laptop Price Predictor — Frontend

This folder contains the frontend application for the Laptop Price Predictor project.

## Overview

- Framework: React (Vite)
- Styling: Tailwind CSS
- Purpose: provide UI for browsing laptops, running price predictions, viewing recommendations, and user account management.

## Quick start

Prerequisites:

- Node.js (v16+ recommended)
- npm

Install and run locally:

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Environment

Create a `.env` file in the `frontend/` folder if you need to configure runtime environment variables (API base URL, etc.). Typical variables:

- `VITE_API_BASE_URL` — base URL for the backend API

Note: Vite exposes only `VITE_`-prefixed env variables to the client.

## Project structure (important files)

- `index.html` — HTML entry
- `package.json` — scripts and dependencies
- `src/main.jsx` — app bootstrap
- `src/App.jsx` — top-level routing and layout
- `src/pages/` — views: `Home`, `ProductList`, `ProductDetail`, `Predict`, `Recommendations`, `Cart`, `Dashboard`, `Auth` pages
- `src/components/` — reusable UI components (layout, product cards, filters, recommendation widget)
- `src/context/` — `AuthContext.jsx`, `CartContext.jsx` for app-wide state and auth
- `src/services/` — `api.js`, `auth.js` for HTTP calls to backend
- `src/utils/notifications.js` — toast/notification helper
- `src/assets/` — static assets

## Key features and flows

- Authentication: login/register flows via `src/services/auth.js` and `AuthContext` to store tokens and user state.
- Product listing & filters: `ProductList` uses `src/components/filters` to fetch filtered laptops from backend APIs.
- Prediction: `Predict` page sends spec data to the `predict` API endpoint and displays predicted price.
- Recommendations: `Recommendations` page/widget consumes the `recommendation` API to show personalized suggestions.
- Cart & Wishlist: client-side cart handled by `CartContext`; can be synced with backend if implemented.

## Scripts (common)

- `npm run dev` — start dev server (Vite)
- `npm run build` — build production bundle
- `npm run preview` — locally preview production build

Check `package.json` for any additional scripts.

## API integration

The frontend uses `src/services/api.js` as the centralized HTTP client. Set `VITE_API_BASE_URL` to point to the backend (for example `http://localhost:5000/api`).

Example (dev):

```bash
export VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```


## Development notes

- Tailwind CSS is configured via `tailwind.config.js` and PostCSS.
- Linting/config may be set in repository root — follow existing patterns.
- Use `src/context` for global state; prefer small, focused components located under `src/components`.

## Testing & Postman

- There is a `Postman_Collection.json` in the backend to test APIs; import it and use the same endpoints from the frontend services.

## Suggestions / Next steps

- Add tests (Jest + React Testing Library) for critical components and pages.
- Add Storybook for component-driven development.
- Add CI pipeline to run linting, tests and build.

---
Generated README for quick onboarding and developer reference.

## Deployed URL
https://laptop-price-predictor-2dhhvnys9.vercel.app