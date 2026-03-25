import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioTower, Send, Download, Cpu, Key, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export function Simulation() {
  const [inputData, setInputData] = useState('{\n  "command": "ACTIVATE_NODE_X",\n  "timestamp": 1700000000\n}');
  const [encryptedPayload, setEncryptedPayload] = useState(null);
  const [decryptedPayload, setDecryptedPayload] = useState(null);
  const [transmitting, setTransmitting] = useState(false);
  const [receiving, setReceiving] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const [keys, setKeys] = useState([]);
  const [selectedKeyId, setSelectedKeyId] = useState('');

  const headers = { Authorization: `Bearer ${localStorage.getItem('zen_token')}` };

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await axios.get(`${API_URL}/keys`, { headers });
        const activeKeys = res.data.filter(k => k.isActive);
        setKeys(activeKeys);
        if (activeKeys.length > 0) {
          setSelectedKeyId(activeKeys[0].keyId);
        }
      } catch (err) {
        console.error("Failed to fetch keys", err);
      }
    };
    fetchKeys();
  }, []);

  const handleTransmit = async () => {
    if (!inputData || !selectedKeyId) {
      if (!selectedKeyId) setMessage({ text: 'Please generate an active encryption key in Key Management first.', isError: true });
      return;
    }
    setTransmitting(true);
    setEncryptedPayload(null);
    setDecryptedPayload(null);
    setMessage({ text: '' });

    try {
      const res = await axios.post(`${API_URL}/simulate/transmit`, { data: inputData, keyId: selectedKeyId }, { headers });
      
      // Artificial delay for visual effect
      await new Promise(r => setTimeout(r, 800));
      
      setEncryptedPayload(res.data.encryptedPayload);
      setMessage({ text: 'Data securely encapsulated and transmitted.', isError: false });
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Transmission failed.', isError: true });
    } finally {
      setTransmitting(false);
    }
  };

  const handleReceive = async () => {
    if (!encryptedPayload) return;
    setReceiving(true);
    
    try {
      const res = await axios.post(`${API_URL}/simulate/receive`, { encryptedData: encryptedPayload }, { headers });
      
      await new Promise(r => setTimeout(r, 800));
      
      setDecryptedPayload(
        typeof res.data.decryptedPayload === 'object' 
          ? JSON.stringify(res.data.decryptedPayload, null, 2) 
          : res.data.decryptedPayload
      );
      setMessage({ text: 'Payload intercepted and successfully decrypted.', isError: false });
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Decryption failed.', isError: true });
    } finally {
      setReceiving(false);
    }
  };

  return (
    <div className="h-full flex flex-col pt-2">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RadioTower className="text-accent-cyan" /> Universal Switch Simulation
          </h2>
          <p className="text-gray-400 text-sm mt-1">Simulate end-to-end data transmission across the secure switch framework.</p>
        </div>
        
        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${message.isError ? 'bg-accent-red/10 text-accent-red border border-accent-red/20' : 'bg-accent-green/10 text-accent-green border border-accent-green/20'}`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px_1fr] gap-6 flex-1">
        
        {/* Transmitter Panel */}
        <div className="glass-panel flex flex-col overflow-hidden relative border-l-4 border-l-accent-cyan">
          <div className="p-4 bg-black/20 border-b border-dark-border flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-accent-cyan" /> Legacy Transmitter
            </h3>
            <span className="text-[10px] uppercase tracking-wider bg-accent-cyan/10 text-accent-cyan px-2 py-1 rounded">Source Node</span>
          </div>
          
          <div className="p-4 flex-1 flex flex-col gap-4">
            <p className="text-sm text-gray-400">Enter raw JSON or text to be encapsulated by the switch.</p>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs text-accent-cyan font-semibold uppercase tracking-wider flex items-center gap-2"><Key className="w-3 h-3"/> Encryption Key</label>
              <select 
                value={selectedKeyId}
                onChange={(e) => setSelectedKeyId(e.target.value)}
                className="w-full bg-black/60 border border-dark-border hover:border-accent-cyan/50 rounded-lg p-3 text-sm text-amber-500 font-mono focus:outline-none focus:border-accent-cyan transition-colors cursor-pointer appearance-none"
                style={{ WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300b0ff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
              >
                {keys.length === 0 ? (
                  <option value="">No Active Keys Found (Generate one in Key Management)</option>
                ) : (
                  keys.map(k => (
                    <option key={k.keyId} value={k.keyId}>
                      {k.keyId} ({k.algorithm})
                    </option>
                  ))
                )}
              </select>
            </div>

            <textarea 
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="flex-1 w-full bg-black/60 border border-dark-border rounded-lg p-4 font-mono text-sm text-gray-300 focus:outline-none focus:border-accent-cyan resize-none"
            />
            
            <button 
              onClick={handleTransmit}
              disabled={transmitting || !inputData}
              className="btn-primary w-full"
            >
              {transmitting ? <><Cpu className="w-5 h-5 animate-spin" /> Encapsulating...</> : <><Send className="w-5 h-5" /> Push to Switch</>}
            </button>
          </div>
        </div>

        {/* The Universal Switch Core */}
        <div className="flex flex-col items-center justify-center gap-4 relative">
          
          {/* Animated Flow Lines */}
          <div className="absolute top-[30%] left-0 right-0 h-0.5 pointer-events-none -translate-y-1/2 flex items-center justify-center">
             <div className="w-full relative h-[2px]">
               {transmitting && <motion.div className="h-full w-full bg-gradient-to-r from-transparent via-accent-cyan to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1 }} />}
             </div>
          </div>

          <motion.div 
            animate={transmitting || receiving ? { scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(139,92,246,0.3)", "0 0 40px rgba(139,92,246,0.6)", "0 0 20px rgba(139,92,246,0.3)"] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-full glass-panel p-6 flex flex-col items-center justify-center z-10 border-accent-purple/50 bg-accent-purple/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <Lock className="w-10 h-10 text-accent-purple mb-2 glow-purple relative z-10" />
            <h4 className="text-white font-bold tracking-widest text-sm relative z-10">ZENTRIX CORE</h4>
            
            <div className="mt-6 w-full relative z-10">
              <p className="text-[10px] text-accent-purple mb-1 font-mono">ENCRYPTED PAYLOAD</p>
              <div className="bg-black/60 border border-accent-purple/30 rounded p-3 h-24 overflow-hidden relative">
                {encryptedPayload ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono text-accent-purple tracking-widest break-all">
                     {encryptedPayload}
                   </motion.div>
                ) : (
                  <div className="text-xs text-gray-600 font-mono h-full flex items-center justify-center text-center">AWAITING TRANSMISSION</div>
                )}
                
                {(transmitting || receiving) && (
                  <div className="absolute inset-0 bg-accent-purple/10 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-full h-0.5 bg-accent-purple/50 overflow-hidden relative shadow-[0_0_10px_rgba(139,92,246,0.8)]"><motion.div className="h-full w-1/3 bg-white" animate={{ x: ['-100%', '300%'] }} transition={{ repeat: Infinity, duration: 0.8 }} /></div>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleReceive}
              disabled={receiving || !encryptedPayload}
              className={`w-full mt-4 py-2 rounded font-semibold flex items-center justify-center gap-2 text-sm transition-all relative z-10
               ${encryptedPayload && !receiving ? 'bg-accent-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:bg-[#7e4df2]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
              `}
            >
              {receiving ? <><Cpu className="w-4 h-4 animate-spin" /> Decrypting...</> : <><Key className="w-4 h-4" /> Intercept & Decrypt</>}
            </button>
          </motion.div>

        </div>

        {/* Receiver Panel */}
        <div className="glass-panel flex flex-col overflow-hidden relative border-l-4 border-l-accent-green">
           <div className="p-4 bg-black/20 border-b border-dark-border flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-accent-green" /> Modern Receiver
            </h3>
            <span className="text-[10px] uppercase tracking-wider bg-accent-green/10 text-accent-green px-2 py-1 rounded">Secure Zone</span>
          </div>
          
          <div className="p-4 flex-1 flex flex-col gap-4 relative">
             <p className="text-sm text-gray-400">Decrypted payload ready for modern infrastructure processing.</p>
             <div className="flex-1 w-full bg-black/60 border border-dark-border rounded-lg p-4 font-mono text-sm overflow-auto relative group">
                {decryptedPayload ? (
                  <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-accent-green glow-green">
                    {decryptedPayload}
                  </motion.pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-600 italic">No payload received</div>
                )}
                
                {decryptedPayload && (
                  <div className="absolute top-2 right-2 bg-accent-green/20 text-accent-green px-2 py-0.5 rounded text-[10px] uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShieldCheck className="w-3 h-3" /> Validated
                  </div>
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
