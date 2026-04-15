# Zentrix Middleware - Deployment Guide

This guide covers deploying the Zentrix Secure Switch Simulator on free or production-grade platforms like **Render** (for the Node.js backend) and **Vercel** / **Netlify** (for the React Frontend).

---

## 1. Deploying the Backend (Render)

Render is perfect for Node.js + Express + Socket.io apps. 

### Steps:
1. **Prepare your Repository**: Make sure your code is pushed to a GitHub repository.
2. **Access Render**: Go to [Render's Dashboard](https://dashboard.render.com).
3. **Create Web Service**: Click `New` -> `Web Service`.
4. **Connect Git**: Connect your GitHub account and select your Zentrix repository.
5. **Configure Service**:
   - **Name**: `zentrix-backend`
   - **Root Directory**: `backend` (Important: points to your backend folder)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (if `server.js` is the entry point, or `"start": "node server.js"` inside your `package.json`)
6. **Environment Variables**:
   Under the Advanced / Environment Variables section, add:
   - `PORT`: `5000` (Render will assign a port dynamically but setting this explicitly can be safe)
   - `MONGO_URI`: *<Your MongoDB Atlas URL>*
   - `JWT_SECRET`: *<Your Secret Key>*
7. **Deploy**: Click **Create Web Service**. Wait 2-3 minutes for the build to pass.
8. **Get your Server URL**: Note the Render domain given to you (e.g., `https://zentrix-backend.onrender.com`).

---

## 2. Deploying the Frontend (Vercel)

Vercel is optimized for React/Vite builds.

### Steps:
1. **Access Vercel**: Go to [Vercel](https://vercel.com) and log in.
2. **Import Project**: Choose "Add New..." -> "Project" -> Import your Zentrix GitHub repo.
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**: Add your backend URL to allow the frontend to safely communicate via CORS and Websockets.
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render URL with `/api` appended if used for normal fetch (e.g. `https://zentrix-backend.onrender.com/api`).
   *(Note: For Socket.io, the DataTransfer component automatically trims `/api` to connect purely to the root URL)*
5. **Deploy**: Click **Deploy**. Vercel will build and assign you a live, SSL-secured domain.

---

## 3. Running & Testing Over the Internet

Once both are deployed, you can verify real-time, internet-wide communication easily.

1. Share your **Frontend Vercel URL** with a friend or open it on two entirely different devices (e.g., Laptop A on WiFi, Laptop B on a Cellular Hotspot).
2. Open the **"Live Data Transmission"** tab.
3. On Laptop A, register as **"Device A"**.
4. On Laptop B, register as **"Device B"**.
5. Use Device A to send a Secure Payload.
6. The transaction will flow over the Internet to Render (backend encrypts/decrypts the data), and it will magically appear on Laptop B containing the encrypted and decrypted packet strings.
7. Device B will rapidly relay an **Acknowledgement** back to Device A!
