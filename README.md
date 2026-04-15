# Food Pulse Backend Server

Node.js/Express backend for the Food Pulse app with MongoDB integration and Firebase authentication.

## Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (for connection URI)
- Firebase project ID

## Installation

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-pulse?retryWrites=true&w=majority
   PORT=5000
   FIREBASE_PROJECT_ID=your-firebase-project-id
   NODE_ENV=development
   ```

## Running Locally

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## Production Build

```bash
npm start
```

## API Endpoints

### Foods

- `GET /foods` - Get all foods (public)
- `GET /foods/expired-foods` - Get expired items (public)
- `GET /foods/expiring-soon` - Get items expiring within 7 days (public)
- `GET /foods/my-foods?email={email}` - Get user's foods (auth required)
- `GET /foods/:id` - Get single food (auth required)
- `GET /foods?category={category}` - Filter by category (auth required)
- `GET /foods?search={query}` - Search foods (auth required)
- `POST /foods` - Create food (auth required)
- `PUT /foods/:id` - Update food (auth required)
- `DELETE /foods/:id` - Delete food (auth required)

### Notes

- `GET /notes` - Get all notes (public)
- `GET /notes/:foodId` - Get notes for a food (public)
- `POST /notes` - Create note (auth required)

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {firebase_access_token}
```

## Deployment to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `FIREBASE_PROJECT_ID`
4. Deploy!

## Database

MongoDB collections:
- **foods** - Food items (indexes: email, expiryDate, category, text search)
- **notes** - User notes on foods (indexes: foodId)

## Environment Variables

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB Atlas connection string |
| PORT | Server port (default: 5000) |
| FIREBASE_PROJECT_ID | Firebase project ID for authentication |
| NODE_ENV | Environment (development/production) |
