# Railway Deployment Guide

Follow these steps to deploy your **Amazon Listing Optimizer AI** to Railway with maximum stability.

## 1. Database Setup (Railway MySQL)
1. Go to your [Railway Dashboard](https://railway.app/).
2. Click **+ New** > **Database** > **Add MySQL**.
3. Once the database is created, click on the **MySQL** service.
4. Go to the **Variables** tab to see your credentials. Railway automatically provides:
   - `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQL_URL`.

## 2. Backend Deployment
1. Click **+ New** > **GitHub Repo** > Select `Amazon-Product-Listing-Optimizer`.
2. Go to the **Settings** of the new service and set:
   - **Root Directory**: `backend`
   - **Custom Start Command**: `npm install && npm start`
3. Go to the **Variables** tab and add:
   - `GROQ_API_KEY`: (Your Key)
   - `PORT`: `5001` (or whatever you prefer)
   - `CORS_ORIGIN`: `*` (or your frontend Railway URL)
4. Go to **Networking** and click **Generate Domain**.

## 3. Frontend Deployment
1. Click **+ New** > **GitHub Repo** > Select `Amazon-Product-Listing-Optimizer` (again).
2. Go to the **Settings** and set:
   - **Root Directory**: `frontend`
3. Go to the **Variables** tab and add:
   - `VITE_API_URL`: (Paste your **Backend** Railway Domain from step 2, ending in `/api`)
     - Example: `https://backend-production-123.up.railway.app/api`
4. Go to **Networking** and click **Generate Domain**.

## 4. Final Production Checklist
- [x] **Backend Domain**: Ensure the frontend `VITE_API_URL` includes the `/api` suffix.
- [x] **MySQL Connection**: The backend `db.js` is already configured to read Railway's internal variables.
- [x] **Secrets**: Ensure `GROQ_API_KEY` is added to the backend service.

## 5. Troubleshooting
- **Frontend can't talk to Backend**: Check the `VITE_API_URL` variable. Vite needs this at *build time*, so redeploy the frontend after adding it.
- **MySQL Error**: Ensure you run the `init.sql` (or migration script) in the Railway MySQL shell.
