import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { Wifi, Send, Lock, Unlock, ShieldCheck, Activity, Users, Server } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export function DataTransfer() {
  const [deviceIdentity, setDeviceIdentity] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [targetNodeId, setTargetNodeId] = useState(''); // '' means broadcast
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeNodes, setActiveNodes] = useState([]); // from socket
  
  const socketRef = useRef(null);
  const logsEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isRegistered || !deviceIdentity) return;

    const SERVER_URL = API_URL.replace('/api', '');
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('register_device', { deviceName: deviceIdentity, passcode });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setActiveNodes([]);
      toast.error('Disconnected from Zentrix Middleware');
    });

    socket.on('system_message', (data) => {
      if (data.error) toast.error(data.error);
      else toast.success(data.message);
    });

    socket.on('active_nodes', (nodes) => {
      setActiveNodes(nodes);
    });

    socket.on('receive_message', (payload) => {
      if (payload.sender !== deviceIdentity) {
        setLogs(prev => [...prev, { type: 'receive', ...payload }]);
        toast.success(`${payload.isPrivate ? 'Direct' : 'Broadcast'} packet from ${payload.sender}`);
        
        socket.emit('acknowledge', {
          fromDevice: deviceIdentity,
          toDevice: payload.sender
        });
      } else {
         setLogs(prev => [...prev, { type: 'send_success', ...payload }]);
      }
    });

    socket.on('receive_ack', (payload) => {
      if (payload.targetDevice === deviceIdentity) {
        toast.success(`Acknowledgment: ${payload.message}`);
        setLogs(prev => [...prev, { type: 'ack', ...payload }]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isRegistered, deviceIdentity, API_URL]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!deviceIdentity || !passcode) {
      toast.error('Identity and Security Passcode are required');
      return;
    }
    setIsRegistered(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    socketRef.current.emit('send_message', { text: message, targetNodeId });
    setMessage('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Wifi className="text-accent-cyan" />
            Live Data Transmission
          </h2>
          <p className="text-gray-400 mt-1">Real-time socket testing between registered logical nodes</p>
        </div>

        {isRegistered && (
          <div className="flex items-center gap-3 bg-dark-panel border border-dark-border px-4 py-2 rounded-xl">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-accent-green' : 'bg-red-500'} animate-pulse`} />
            <span className="text-sm font-medium text-gray-300">
              {isConnected ? `Online as ${deviceIdentity}` : 'Connecting...'}
            </span>
          </div>
        )}
      </div>

      {!isRegistered ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-panel border border-dark-border rounded-xl p-8 max-w-md mx-auto mt-12"
        >
          <div className="text-center mb-6">
            <Server className="w-12 h-12 text-accent-cyan mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white">Initialize Custom Node</h3>
            <p className="text-sm text-gray-400 mt-2">Enter any temporary identity to connect to the transmission net.</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Temporary Identifier</label>
              <input
                type="text"
                value={deviceIdentity}
                onChange={(e) => setDeviceIdentity(e.target.value)}
                placeholder="e.g. Node Alpha"
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Security Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Network Key"
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!deviceIdentity || !passcode}
              className="w-full bg-accent-cyan hover:bg-accent-cyan/80 disabled:opacity-50 text-dark-bg font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Initialize Node Socket
            </button>
          </form>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Chat/Transmission UI */}
          <div className="lg:col-span-3 bg-dark-panel border border-dark-border rounded-xl flex flex-col h-[600px] overflow-hidden">
            <div className="flex bg-dark-bg/50 border-b border-dark-border p-4 gap-4 items-center">
               <h3 className="font-semibold text-white mr-auto flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-accent-cyan" /> Secure Stream
               </h3>
               <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-gray-400">Targeting:</span>
                 <select
                   value={targetNodeId}
                   onChange={e => setTargetNodeId(e.target.value)}
                   className="bg-dark-panel border border-dark-border text-xs rounded px-2 py-1.5 focus:border-accent-cyan text-white"
                 >
                   <option value="">Broadcast (All Nodes)</option>
                   {activeNodes.filter(n => n.deviceName !== deviceIdentity).map(node => (
                     <option key={node.id} value={node.id}>
                        {node.deviceName}
                     </option>
                   ))}
                 </select>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                  <Wifi className="w-16 h-16 mb-4" />
                  <p>Awaiting data telemetry...</p>
                </div>
              ) : (
                logs.map((log, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col max-w-[85%] ${
                      log.type === 'send_success' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    {log.type === 'ack' ? (
                       <div className="bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs px-3 py-1 rounded-full mb-1 flex items-center gap-1">
                         <ShieldCheck className="w-3 h-3" /> System Ack: {log.message}
                       </div>
                    ) : (
                      <>
                        <span className="text-xs text-gray-500 mb-1 font-medium px-1 flex items-center gap-1">
                          {log.sender}
                          {log.isPrivate && <span className="bg-accent-purple/20 text-accent-purple px-1.5 rounded-sm text-[10px]">DIRECT</span>}
                          • {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        
                        <div className={`p-4 rounded-xl border ${
                          log.type === 'send_success' 
                            ? 'bg-accent-cyan/10 border-accent-cyan/30 text-white rounded-br-none' 
                            : 'bg-dark-bg border-dark-border text-gray-200 rounded-bl-none'
                        }`}>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5 uppercase font-semibold">
                                <Lock className="w-3 h-3 text-accent-purple" /> Encrypted Payload (AES-256)
                              </div>
                              <code className="text-xs bg-black/40 text-accent-purple p-2 rounded block break-all font-mono">
                                {log.encryptedData}
                              </code>
                            </div>

                            <div className="pt-2 border-t border-dark-border/50">
                              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5 uppercase font-semibold">
                                <Unlock className="w-3 h-3 text-accent-green" /> Decrypted Hash
                              </div>
                              <p className="text-sm font-medium">{log.decryptedMessage}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>

            <div className="p-4 border-t border-dark-border bg-dark-bg/50">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter secure message payload..."
                  className="flex-1 bg-dark-panel border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || !isConnected}
                  className="bg-accent-cyan hover:bg-accent-cyan/80 text-dark-bg font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  Transmit
                </button>
              </form>
            </div>
          </div>

          {/* Active Connects Sidebar */}
          <div className="bg-dark-panel border border-dark-border rounded-xl flex flex-col h-[600px] overflow-hidden">
             <div className="p-4 border-b border-dark-border bg-dark-bg/50 flex gap-2 items-center">
                 <Users className="w-5 h-5 text-accent-blue" />
                 <h3 className="font-semibold text-white">Live Terminals</h3>
                 <span className="ml-auto bg-black border border-dark-border text-gray-400 text-xs px-2 py-0.5 rounded-full">{activeNodes.length}</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {activeNodes.length === 0 ? (
                    <div className="text-center text-sm text-gray-500 py-4">No other nodes</div>
                 ) : (
                    activeNodes.map(node => (
                        <div key={node.id} className="flex items-center justify-between p-3 rounded-lg border border-dark-border/50 bg-dark-bg">
                            <span className="text-sm font-medium text-gray-200">
                                {node.deviceName} {node.id === socketRef.current?.id && <span className="text-xs text-accent-cyan ml-1">(You)</span>}
                            </span>
                            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
                        </div>
                    ))
                 )}
             </div>
          </div>

        </div>
      )}
    </div>
  );
}
