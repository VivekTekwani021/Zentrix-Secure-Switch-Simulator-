import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, User, Lock, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        // Register first
        await axios.post(`${API_URL}/auth/register`, { username, password, role: 'Admin' });
        toast.success('Registration successful. Authenticating...');
        // Automatically login to retrieve the token
        const loginRes = await axios.post(`${API_URL}/auth/login`, { username, password });
        await new Promise(r => setTimeout(r, 600));
        onLogin(loginRes.data.token, loginRes.data.user);
        toast.success(`Welcome, ${loginRes.data.user.username}`);
      } else {
        const res = await axios.post(`${API_URL}/auth/login`, { username, password });
        await new Promise(r => setTimeout(r, 600));
        onLogin(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.username}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[100px]"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1.5 }}
          >
            <Cpu className="w-16 h-16 text-accent-cyan glow-cyan mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Zentrix OS</h1>
          <p className="text-gray-400">Secure Switch Simulator Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="System Username" 
              className="input-field pl-12"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="password" 
              placeholder="Passcode" 
              className="input-field pl-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-accent-blue hover:text-white transition-colors"
            >
              {isRegistering ? 'Already have access? Login' : 'Request clearance (Register)'}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full mt-4"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                <Cpu className="w-5 h-5" />
              </motion.div>
            ) : (
              <>
                {isRegistering ? 'Authorize Entry' : 'Authenticate'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-dark-border text-center flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-accent-green" />
          End-to-End Encryption Enabled
        </div>
      </motion.div>
    </div>
  );
}
