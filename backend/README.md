# Laptop Price Predictor — Backend

This folder contains the backend API and utilities for the Laptop Price Predictor project.

## Overview

- Backend runtime: Node.js + Express
- Database: MongoDB (via Mongoose)
- Purpose: provide REST API endpoints for laptops, user auth, price prediction and recommendations. Prediction and recommendation logic is implemented via Python utilities in `src/util`.

## Repository layout (important files)

- `app.js` — Express application entry point
- `package.json` — scripts and dependencies
- `seedLaptops.js` — script to seed the laptops collection
- `Postman_Collection.json` — Postman collection for testing the API
- `Sample_Test_Data.json` — example test payloads
- `src/config/database.js` — DB connection setup
- `src/routes/` — route definitions
  - `authRoutes.js`, `laptopRoutes.js`, `predictRoutes.js`, `recommendationRoutes.js`, `userRoutes.js`
- `src/controllers/` — controllers handling request logic
  - `authController.js`, `laptopController.js`, `predictController.js`, `recommendationController.js`, `userController.js`
- `src/models/` — Mongoose models
  - `Laptop.js`, `PredictionHistory.js`, `User.js`, `UserPreference.js`
- `src/middlewares/` — middleware (auth, validation)
- `src/util/` — Python utilities used for ML logic
  - `predict.py`, `recommendationEngine.py`

## Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB instance (local or cloud)
- Python 3.8+ (for utilities in `src/util`) and an appropriate virtual environment

## Environment variables

Create a `.env` file in the `backend/` folder (example names):

- `MONGO_URI` — MongoDB connection string
- `PORT` — port the server listens on (default often `5000`)
- `JWT_SECRET` — secret for signing JWTs

Adjust any other variables used by `src/config/database.js` as needed.

## Install dependencies

```bash
cd backend
npm install
```

## Available scripts

From `package.json`:

- `npm start` — starts the server via `nodemon app.js` (development)
- `npm run seed:laptops` — run `node seedLaptops.js` to seed sample laptop data

There is also a `test` script placeholder.

## Seeding the database

Run the seed script to populate the laptops collection with sample data:

```bash
npm run seed:laptops
```

Ensure `MONGO_URI` in `.env` points to the target database before running the seed.

## Running the server

```bash
npm start
```

The app will connect to MongoDB using `src/config/database.js` and start listening for requests.

## API summary

The backend exposes endpoints grouped in route files under `src/routes`.

- `src/routes/authRoutes.js` — authentication endpoints (register, login, logout)
- `src/routes/userRoutes.js` — user profile and preference endpoints
- `src/routes/laptopRoutes.js` — laptop CRUD and listing/search endpoints
- `src/routes/predictRoutes.js` — prediction endpoints (POST user/spec data -> predicted price)
- `src/routes/recommendationRoutes.js` — recommendation endpoints (user-based or spec-based recommendations)

For exact route paths and request/response shapes, inspect the route files and controllers, and use `Postman_Collection.json` for ready-to-run requests.

## Controllers & Models

- Controllers handle request validation and business logic and are located in `src/controllers`.
- Models are Mongoose schemas in `src/models`. Key models include `Laptop`, `User`, `UserPreference`, and `PredictionHistory`.

## Prediction & Recommendation utilities

Prediction and recommendation logic is implemented in Python scripts under `src/util`:
- `predict.py` — prediction logic (called from Node via `python-shell` or other IPC)
- `recommendationEngine.py` — recommendation logic

If you need to run or modify these scripts, activate a Python virtualenv and install any requirements used by the notebook/workflow in the `ml/` folder.

## Postman & Sample Data

- `Postman_Collection.json` — import into Postman to test API endpoints quickly
- `Sample_Test_Data.json` — sample request payloads and data for testing

## Backend Flow

This section explains the typical request lifecycles and key internal flows.

- Request lifecycle: Client -> Route -> Middleware -> Controller -> Models/Utils -> DB -> Response.
  - Routes in `src/routes` receive HTTP requests and map them to controller actions.
  - Middlewares (`src/middlewares`) perform validation, authentication (`authMiddleware`) and preprocessing.
  - Controllers (`src/controllers`) implement business logic, call Mongoose models in `src/models`, invoke utilities in `src/util`, and construct responses.

- Auth flow:
  - `authRoutes` -> `authController`: register hashes passwords with `bcryptjs`, saves `User`, login verifies credentials and issues JWT (`JWT_SECRET`). `authMiddleware` validates JWT and attaches `req.user`.

- Prediction flow:
  - `predictRoutes` -> `predictController`: validates input, then calls the Python predictor (`src/util/predict.py`) via `python-shell` (or a child process). The controller parses the Python output, persists a `PredictionHistory` record, and returns the predicted price.

- Recommendation flow:
  - `recommendationRoutes` -> `recommendationController`: uses `UserPreference` and `Laptop` data, may call `src/util/recommendationEngine.py` to compute scores, and returns ranked laptop recommendations.

- Laptop CRUD & search:
  - `laptopRoutes` -> `laptopController`: create/read/update/delete and list endpoints use the `Laptop` model and support filters/search parameters.

- Seeding flow:
  - `seedLaptops.js` connects via `src/config/database.js` and inserts sample records (from `Sample_Test_Data.json`) into the `Laptop` collection.

- Error handling & logging:
  - Controllers should forward errors to Express error-handling middleware (see `app.js`). `morgan` logs requests; controllers return appropriate HTTP status codes and JSON error messages.

- Data persistence:
  - Predictions are stored in `PredictionHistory`; preferences in `UserPreference`; users in `User`; laptop catalog in `Laptop`.

## Development notes

- Logging: `morgan` is included as a dependency for request logging
- Validation: `express-validator` is used for request validation in `src/middlewares/validationMiddleware.js`
- Auth: JWT-based auth implemented in `src/middlewares/authMiddleware.js` and `src/controllers/authController.js`

## Troubleshooting

- If the server can't connect to MongoDB, verify `MONGO_URI` and network access.
- If Python utilities fail, ensure the correct Python interpreter and required packages are installed.

## Next steps / Suggestions

- Add a `requirements.txt` or `pyproject.toml` for the Python utilities in `src/util` if not already tracked.
- Add detailed API documentation (OpenAPI / Swagger) for clearer endpoint contracts.

## License & Contribution

This repository does not include a specific license file. Add a `LICENSE` and contribution guidelines if you plan to open-source or invite contributions.

---
Generated README for quick developer onboarding and reference.
