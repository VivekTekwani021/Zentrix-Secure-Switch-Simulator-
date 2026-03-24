/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0c',
          panel: 'rgba(20, 22, 28, 0.6)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        accent: {
          cyan: '#00f5d4',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          green: '#10b981',
          red: '#ef4444'
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))'
      }
    },
  },
  plugins: [],
}
