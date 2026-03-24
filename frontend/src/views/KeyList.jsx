import { useState, useEffect } from 'react';
import { KeyRound, Lock, Plus, Activity, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export function KeyList() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/keys`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('zen_token')}` }
      });
      setKeys(res.data);
    } catch (error) {
      console.error("Failed to fetch keys", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    try {
      await axios.post(`${API_URL}/keys/generate`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('zen_token')}` }
      });
      fetchKeys();
    } catch (error) {
      console.error("Failed to generate key", error);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  return (
    <div className="h-full flex flex-col">
       <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <KeyRound className="text-accent-purple" /> Cryptographic Keys
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage symmetric and asymmetric keys for device encapsulation.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchKeys} className="p-2 border border-dark-border rounded text-gray-400 hover:text-white hover:bg-white/5 transition-all">
             <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleGenerateKey} className="btn-primary py-2 px-4 shadow-[0_0_15px_rgba(139,92,246,0.2)] bg-accent-purple/90 text-white hover:bg-accent-purple border border-accent-purple/50">
            <Plus className="w-4 h-4" /> Generate Key
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
               <Activity className="w-8 h-8 animate-pulse mb-4 text-accent-purple" />
               Retrieving secure keys...
             </div>
        ) : keys.length === 0 ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 glass-panel border-dashed">
               <Lock className="w-8 h-8 mb-4 opacity-50" />
               <p>No cryptographic keys generated yet.</p>
               <button className="text-accent-purple mt-2 text-sm hover:underline">Click here to generate your first AES-256 key.</button>
             </div>
        ) : (
          keys.map((k, idx) => (
            <div key={idx} className="glass-panel p-6 relative group overflow-hidden hover:border-accent-purple/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/5 rounded-bl-full pointer-events-none group-hover:bg-accent-purple/10 transition-colors" />
              <KeyRound className="absolute top-4 right-4 w-6 h-6 text-accent-purple/40 group-hover:text-accent-purple transition-colors" />
              
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-widest text-accent-purple font-bold">Key Signature</span>
                <p className="font-mono text-gray-300 mt-1 break-all bg-black/40 p-2 rounded border border-dark-border text-xs">
                  {k.keyValue.length > 20 ? `...${k.keyValue.substring(k.keyValue.length - 16)}` : k.keyValue}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div>
                  <span className="text-gray-500 text-xs uppercase block">Algorithm</span>
                  <span className="text-white font-medium">{k.algorithm || 'AES-256'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase block">Target Device</span>
                  <span className="text-white font-medium">{k.deviceAssigned ? k.deviceAssigned.deviceName : 'Unassigned'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 text-xs uppercase block">Generated On</span>
                  <span className="text-gray-400">{new Date(k.createdAt).toLocaleDateString()} at {new Date(k.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
