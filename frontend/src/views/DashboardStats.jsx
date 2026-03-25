import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, KeyRound, Activity, Zap } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-panel p-6 flex items-center gap-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity ${colorClass.split(' ')[0].replace('text-', 'bg-')}`} />
    
    <div className={`p-4 rounded-xl bg-white/5 border border-white/10 ${colorClass}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-gray-400 font-medium">{title}</h3>
      <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
    </div>
  </motion.div>
);

export function DashboardStats() {
  const [stats, setStats] = useState({ devices: 0, keys: 0, transmissions: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('zen_token')}` };
        const [devRes, keysRes, logsRes] = await Promise.all([
          axios.get(`${API_URL}/devices`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/keys`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/logs`, { headers }).catch(() => ({ data: [] }))
        ]);

        const totalTransmissions = logsRes.data.filter(l => l.action === 'encrypt').length;

        setStats({
          devices: devRes.data.length || 0,
          keys: keysRes.data.length || 0,
          transmissions: totalTransmissions || 0
        });
      } catch (error) {
        toast.error("Failed to fetch dashboard statistics");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Devices" 
          value={stats.devices} 
          icon={Server} 
          colorClass="text-accent-blue glow-blue" 
          delay={0.1} 
        />
        <StatCard 
          title="Cryptographic Keys" 
          value={stats.keys} 
          icon={KeyRound} 
          colorClass="text-accent-purple glow-purple" 
          delay={0.2} 
        />
        <StatCard 
          title="Secured Transmissions" 
          value={stats.transmissions} 
          icon={Activity} 
          colorClass="text-accent-green glow-green" 
          delay={0.3} 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-8 flex-1"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="text-accent-cyan" /> Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/simulation" className="flex flex-col items-center justify-center p-8 border border-dark-border border-dashed rounded-xl hover:bg-accent-cyan/10 hover:border-accent-cyan text-gray-400 hover:text-accent-cyan transition-all duration-300 group">
            <Activity className="w-12 h-12 mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            <span className="font-semibold text-lg text-white">Run Universal Simulation</span>
            <span className="text-sm mt-2 text-center">Transmit and encrypt legacy data in real-time.</span>
          </Link>

          <Link to="/keys" className="flex flex-col items-center justify-center p-8 border border-dark-border border-dashed rounded-xl hover:bg-accent-purple/10 hover:border-accent-purple text-gray-400 hover:text-accent-purple transition-all duration-300 group">
            <KeyRound className="w-12 h-12 mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            <span className="font-semibold text-lg text-white">Generate Cryptographic Key</span>
            <span className="text-sm mt-2 text-center">Deploy AES-256 keys to secure pipeline.</span>
          </Link>

          <Link to="/devices" className="flex flex-col items-center justify-center p-8 border border-dark-border border-dashed rounded-xl hover:bg-accent-blue/10 hover:border-accent-blue text-gray-400 hover:text-accent-blue transition-all duration-300 group">
            <Server className="w-12 h-12 mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            <span className="font-semibold text-lg text-white">Register Endpoint Device</span>
            <span className="text-sm mt-2 text-center">Add hardware target for legacy switches.</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
