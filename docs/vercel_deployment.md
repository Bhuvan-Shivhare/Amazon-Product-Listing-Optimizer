# Vercel & PlanetScale Deployment Guide

Follow these steps to deploy your **Amazon Listing Optimizer AI** to a production environment.

## 1. Database Setup (PlanetScale)
1. Create an account at [PlanetScale](https://planetscale.com/).
2. Create a new database named `amazon_optimizer`.
3. Click "Connect" and generate a password.
4. Copy the **General connection string** or the `DATABASE_URL`.
   - Result: `mysql://user:pass@host/amazon_optimizer?ssl={"rejectUnauthorized":true}`

## 2. Environment Variables
Add these secrets in the **Vercel Dashboard** (Settings > Environment Variables):

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Your PlanetScale URL |
| `GROQ_API_KEY` | Your Groq API Key |
| `NODE_ENV` | `production` |

> [!CAUTION]
> Never commit your `.env` file to GitHub. Vercel will inject these variables at runtime.

## 3. Deployment Steps

### Option A: Vercel Dashboard (Easiest)
1. Push all changes to your GitHub repository.
2. Go to [Vercel](https://vercel.com/new).
3. Import your repository.
4. Set the **Framework Preset** to `Vite`.
5. Set the **Root Directory** to `./`.
6. Add the environment variables listed above.
7. Click **Deploy**.

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel      # For staging
vercel --prod # For production
```

## 4. Production Checklist
- [ ] **SSL Enabled**: PlanetScale connections are using `?ssl={"rejectUnauthorized":true}`.
- [ ] **Function Timeout**: `api/optimize.js` is set to 60s in `vercel.json`.
- [ ] **Relative Paths**: Frontend is calling `/api/*` (not localhost).
- [ ] **Dependencies**: Root `package.json` contains `mysql2`, `groq-sdk`, and `cheerio`.

## 5. Troubleshooting
- **504 Timeout**: If optimization times out, ensure `maxDuration` in `vercel.json` is set correctly.
- **DB Connection Error**: Ensure your `DATABASE_URL` includes the SSL parameters.
- **Frontend 404**: Vercel needs to build the frontend first. Check that `npm run build` executes without errors.
