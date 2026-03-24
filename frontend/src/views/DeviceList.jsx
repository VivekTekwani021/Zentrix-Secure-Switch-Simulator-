import { useState, useEffect } from 'react';
import { Server, Activity, Plus } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRegisterNode = async () => {
    try {
      const randomIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const randomName = `Switch-Node-${Math.floor(Math.random() * 1000)}`;
      
      await axios.post(`${API_URL}/devices/add`, {
        deviceName: randomName,
        ipAddress: randomIp,
        status: 'active'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('zen_token')}` }
      });
      
      // Refresh list
      const res = await axios.get(`${API_URL}/devices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('zen_token')}` }
      });
      setDevices(res.data);
    } catch (error) {
      console.error("Failed to register node", error);
    }
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get(`${API_URL}/devices`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('zen_token')}` }
        });
        setDevices(res.data);
      } catch (error) {
        console.error("Failed to fetch devices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  return (
    <div className="h-full flex flex-col">
       <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="text-accent-blue" /> Registered Endpoints
          </h2>
        </div>
        <button onClick={handleRegisterNode} className="btn-primary py-2 px-4 shadow-none hover:shadow-none bg-white/10 text-white hover:bg-white/20 border border-white/10">
          <Plus className="w-4 h-4" /> Register Node
        </button>
      </div>

      <div className="glass-panel flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-xs uppercase tracking-wider text-gray-400 border-b border-dark-border">
                <th className="px-6 py-4 font-medium">Device Identity</th>
                <th className="px-6 py-4 font-medium">IP Address / Node</th>
                <th className="px-6 py-4 font-medium">Network Status</th>
                <th className="px-6 py-4 font-medium">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {loading ? (
                <tr>
                   <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                     <Activity className="w-6 h-6 animate-pulse mx-auto mb-2" />
                     Scanning network...
                   </td>
                </tr>
              ) : devices.length === 0 ? (
                 <tr>
                   <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                     No endpoints registered in the simulation network.
                   </td>
                </tr>
              ) : (
                devices.map((device, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white group-hover:text-accent-blue transition-colors">{device.deviceName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-black/50 border border-dark-border text-gray-300 px-2 py-1 rounded font-mono text-xs">
                        {device.ipAddress}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-sm ${device.status === 'active' || device.status === 'online' ? 'text-accent-green' : 'text-gray-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${device.status === 'active' || device.status === 'online' ? 'bg-accent-green' : 'bg-gray-500'}`}></span>
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(device.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
