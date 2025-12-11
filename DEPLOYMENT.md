
# Deployment Guide

This guide explains how to deploy the Bus Booking System to production.

## Prerequisites
*   GitHub Account
*   Render.com Account (for Backend & DB)
*   Vercel Account (for Frontend)

---

## Part 1: Backend Deployment (Render.com)

1.  **Create Database (PostgreSQL)**
    *   Log in to Render Dashboard.
    *   Click **New +** -> **PostgreSQL**.
    *   Name: `bus-booking-db`.
    *   Region: `Singapore (Asia Southeast)` (or nearest).
    *   Click **Create Database**.
    *   **Copy the "Internal Database URL"** (for backend on Render) and **"External Database URL"** (for local testing).

2.  **Deploy Web Service**
    *   Push your code to GitHub.
    *   In Render, click **New +** -> **Web Service**.
    *   Connect your GitHub repo.
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Environment Variables**:
        *   `DATABASE_URL`: (Paste the Internal Database URL from step 1)
        *   `JWT_SECRET`: (Generate a random string)
        *   `NODE_ENV`: `production`
    *   Click **Create Web Service**.

3.  **Verification**
    *   Wait for the deployment to finish.
    *   Copy the URL (e.g., `https://bus-booking-api.onrender.com`).
    *   Visit `https://<YOUR-URL>/` -> Should see "Bus Booking API is running".

---

## Part 2: Frontend Deployment (Vercel)

1.  **Import Project**
    *   Log in to Vercel.
    *   Click **Add New ...** -> **Project**.
    *   Select your GitHub repo.

2.  **Configure Build**
    *   **Root Directory**: Edit and select `frontend`.
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`

3.  **Environment Variables**
    *   We need to point the frontend to the backend URL.
    *   *Note: In the current code (src/api.ts), the URL might be hardcoded to localhost. For production, we should use an ENV variable.*
    *   Add Variable: `VITE_API_URL` = `https://bus-booking-api.onrender.com` (Your backend URL).
    *   *Ensure your code reads this*: `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`

4.  **Deploy**
    *   Click **Deploy**.
    *   Visit the resulting URL.

---

## Part 3: Final Checks

1.  **CORS**: Ensure the Backend allows requests from the Vercel Frontend domain.
    *   In `backend/src/app.js`, update `cors()` config if strict security is needed, or leave default `cors()` (allows all) for this assessment.
2.  **Database Init**:
    *   The first time the backend runs, ensure the tables are created.
    *   You might need to run the `init.js` script or connect via a DB tool (DBeaver) using the External URL and run the `schema.sql`.
