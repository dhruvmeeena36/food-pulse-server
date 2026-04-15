# Food Pulse Backend - Deployment Guide

## Deployment to Render

### Prerequisites
- GitHub account with the `food-pulse-server` repository
- Render account (https://render.com)
- MongoDB Atlas connection string
- Firebase Project ID

### Step 1: Push Backend to Separate GitHub Repository

```bash
# Create a new directory for the backend repo
mkdir food-pulse-server
cd food-pulse-server

# Initialize git and add files
git init
git add .
git commit -m "Initial commit: Food Pulse backend"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/food-pulse-server.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to [https://render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing repository"**
4. Connect your GitHub account and select `food-pulse-server`
5. Configure the service:
   - **Name**: `food-pulse-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier (for now)

6. Add **Environment Variables** (Settings tab):
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel frontend URL (after you deploy)

7. Click **"Create Web Service"**
8. Wait for deployment to complete
9. Copy your Render backend URL (e.g., `https://food-pulse-server.onrender.com`)

### Step 3: Update Frontend Environment Variables

In your Vercel frontend, set:
```
VITE_API_BASE_URL=https://food-pulse-server.onrender.com
```

Or update in `src/utils/api.js` with the Render URL.

## Testing Locally

```bash
npm install
npm run dev  # for development with nodemon
npm start    # for production
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `PORT` | Server port | `5000` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `fridge-tracker-94e52` |
| `JWT_SECRET` | Secret key for JWT signing | `super_secret_key_here` |
| `NODE_ENV` | Environment | `production` or `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourfrontend.vercel.app` |

## API Endpoints

- `GET /foods` - All foods
- `GET /foods/my-foods` - User's foods (authenticated)
- `POST /foods` - Create food (authenticated)
- `GET /foods/expired-foods` - Expired foods
- `GET /foods/expiring-soon` - Expiring soon foods
- `GET /foods/:id` - Single food details
- `PUT /foods/:id` - Update food
- `DELETE /foods/:id` - Delete food

## Troubleshooting

**Cold starts on Render**
- Free tier instances spin down after 15 min of inactivity
- First request may take 10-30 seconds
- Consider upgrading to paid plan for production

**CORS errors**
- Make sure `FRONTEND_URL` is set correctly in environment variables
- Frontend should make requests to `https://food-pulse-server.onrender.com`

**Database connection issues**
- Verify MongoDB Atlas IP whitelist includes Render IPs
- In MongoDB Atlas: Network Access → Add Render.com IP (0.0.0.0/0 for simplicity)
