import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Global interceptor for expired/invalid tokens
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('zen_token')
        localStorage.removeItem('zen_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1f2e',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#1a1f2e' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1a1f2e' },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
