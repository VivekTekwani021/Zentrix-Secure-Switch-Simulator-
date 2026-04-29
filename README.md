# Zentrix Secure Switch Simulator 🛡️

A premium, high-security middleware simulation dashboard designed to demonstrate secure data transmission, cryptographic key management, and zero-trust network principles.

## 🚀 Purpose
Zentrix OS serves as a simulator for secure data encapsulation and transmission. It demonstrates how sensitive information can be safely moved across unsecured networks using AES-256-CBC encryption and real-time socket monitoring.

## ✨ Core Features
- **Live Data Transmission**: Real-time socket-based communication with end-to-end simulated security.
- **Universal Switch Simulation**: Encapsulate legacy JSON data into secure payloads.
- **Key Management**: Generate and manage AES-256 cryptographic keys.
- **Device Management**: Authorized endpoint registration and monitoring.
- **Audit Logging**: Comprehensive tracking of all encryption, decryption, and transmission events.
- **Premium UI**: Modern, dark-themed dashboard with framer-motion animations and glassmorphism.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS v3.4, Lucide React, Framer Motion, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, MongoDB (Mongoose), CryptoJS.
- **Security**: AES-256-CBC Encryption, JWT Authentication.

---

## 🌐 Deployment Instructions

### 1. Backend (Render)
1. **Root Directory**: `backend`
2. **Environment**: Node
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `PORT`: `5000`
   - `MONGO_URI`: *Your MongoDB Atlas URL*
   - `JWT_SECRET`: *A secure random string*

### 2. Frontend (Vercel / Netlify)
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: Your Render Backend URL + `/api` (e.g., `https://zentrix-api.onrender.com/api`)

---

## 💻 Local Setup

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### Steps
1. **Clone the repository**
2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create .env with MONGO_URI and JWT_SECRET
   npm start
   ```
3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔒 Security Architecture (Showcase)
When showcasing this project, emphasize the **Dual-Layer Security**:
1. **Infrastructure Layer**: Uses HTTPS/WSS (SSL) to protect the transport pipe.
2. **Application Layer**: Uses AES-256-CBC to encrypt data *before* broadcast. 
   - **Showcase Proof**: Open the Network tab in your browser. You will see that `receive_message` packets contain only the encrypted payload. Decrypted text is only fetched by authorized nodes via a specific request.

---

**Developed for the Zentrix Secure Framework Simulation.**
