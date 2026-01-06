# Laptop Price Predictor

A full-stack web application that predicts laptop prices using machine learning and provides personalized laptop recommendations.

## Project Overview

This project consists of three main components:

1. **Backend** (Node.js + Express) — REST API for laptops, user authentication, price predictions, and recommendations
2. **Frontend** (React + Vite) — User interface for browsing laptops, predicting prices, and viewing recommendations
3. **ML** (Python + Jupyter) — Machine learning models for price prediction and recommendation engine

## Features

- 🔐 **User Authentication** — Register, login, and manage user preferences
- 💻 **Laptop Catalog** — Browse and search laptops with filters
- 🎯 **Price Prediction** — Predict laptop prices based on specifications
- 🤖 **Recommendations** — Get personalized laptop recommendations
- 🛒 **Shopping Features** — Add laptops to cart and wishlist
- 📊 **Prediction History** — Track previous price predictions

## Quick Start

### Prerequisites

- Node.js (v16+)
- npm
- Python 3.8+
- MongoDB (local or cloud instance)

### Backend Setup

```bash
cd backend
npm install

# Create .env file with:
# MONGO_URI=your_mongodb_connection_string
# PORT=5000
# JWT_SECRET=your_secret_key

npm start
```

The backend will run on `http://localhost:5000/api`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file with:
# VITE_API_BASE_URL=http://localhost:5000/api

npm run dev
```

The frontend will run on `http://localhost:5173`

### ML Setup (Optional)

```bash
cd ml

# Activate virtual environment
source env/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Run Jupyter to train/explore models
jupyter lab
```

## Project Structure

```
├── backend/              # Node.js REST API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Auth & validation
│   │   ├── util/         # Python ML utilities
│   │   └── config/       # Database config
│   ├── app.js           # Express app entry
│   └── package.json
│
├── frontend/             # React + Vite app
│   ├── src/
│   │   ├── pages/        # Views (Home, Predict, etc.)
│   │   ├── components/   # Reusable UI components
│   │   ├── services/     # API client
│   │   ├── context/      # State management
│   │   └── utils/        # Helpers
│   ├── index.html
│   └── package.json
│
└── ml/                   # ML model development
    ├── model building.ipynb  # Training notebook
    ├── laptop_price.csv      # Dataset
    └── env/                  # Python venv
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout

### Laptops
- `GET /api/laptops` — Get all laptops (with filters)
- `GET /api/laptops/:id` — Get laptop details
- `POST /api/laptops` — Create new laptop
- `PUT /api/laptops/:id` — Update laptop
- `DELETE /api/laptops/:id` — Delete laptop

### Predictions
- `POST /api/predict` — Predict price for given specs

### Recommendations
- `GET /api/recommendations` — Get personalized recommendations

### Users
- `GET /api/users/profile` — Get user profile
- `PUT /api/users/profile` — Update user profile
- `GET /api/users/preferences` — Get user preferences

## Testing the API

Use the included Postman collection to test API endpoints:

```bash
# In backend folder, import Postman_Collection.json into Postman
```

Or seed sample data:

```bash
cd backend
npm run seed:laptops
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, MongoDB, Mongoose |
| Frontend | React, Vite, Tailwind CSS |
| ML | Python, scikit-learn, Pandas, Jupyter |
| Authentication | JWT (JSON Web Tokens) |

## Development

Each folder has detailed setup instructions:

- See [backend/README.md](backend/README.md) for API details
- See [frontend/README.md](frontend/README.md) for UI details
- See [ml/README.md](ml/README.md) for ML model info

## Next Steps

- [ ] Set up environment variables in backend and frontend
- [ ] Start MongoDB instance
- [ ] Run `npm install` in both backend and frontend folders
- [ ] Start backend: `npm start` (in backend)
- [ ] Start frontend: `npm run dev` (in frontend)
- [ ] Open browser and navigate to `http://localhost:5173`

## 🌐 Deployment

The project is deployed and accessible online:

**Live URL:** [https://laptop-price-predictor-rouge.vercel.app](https://laptop-price-predictor-rouge.vercel.app)

**Deployed on:** Vercel  
**Status:** ✅ Live  
**Last Updated:** [Add date if you want]

### Quick Access
- 🔗 **Direct Link:** [laptop-price-predictor-rouge.vercel.app](https://laptop-price-predictor-rouge.vercel.app)

## License

This project is for educational purposes.
