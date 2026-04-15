import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, User, Lock, ArrowRight, ShieldCheck, ArrowLeft, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // We can add a fake access key check to make it feel "exclusive" or just bypass it.
    // For realism in this simulator, we just require any access key.
    if (!accessKey) {
        toast.error("An Access Key is required for new Nodes");
        return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, { username, password, role: 'Admin' });
      toast.success('Clearance Granted. Registration Complete.');
      setTimeout(() => {
          navigate('/login');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
      />

      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors z-20"
      >
         <ArrowLeft className="w-4 h-4" /> Return Home
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-md p-10 relative z-10 border border-dark-border/50 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-dark-bg border border-dark-border rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center justify-center mb-6">
             <User className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Request Access</h1>
          <p className="text-gray-400 text-sm">Provision a new Administrator Node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Choose a unique handle" 
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Network Access Key</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                placeholder="Required for enrollment" 
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                <Cpu className="w-5 h-5" />
              </motion.div>
            ) : (
              <>
                Create Network Node
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-dark-border/50 text-center">
            <p className="text-sm text-gray-400">
               Already provisioned?{' '}
               <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline font-medium">
                  Login Here
               </button>
            </p>
        </div>

      </motion.div>
    </div>
  );
}
