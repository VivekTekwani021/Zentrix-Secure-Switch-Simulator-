import { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Filter, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/logs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('zen_token')}` }
        });
        setLogs(res.data);
      } catch (error) {
        toast.error("Failed to fetch system audit logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'encrypt': return 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10';
      case 'decrypt': return 'text-accent-purple border-accent-purple/30 bg-accent-purple/10';
      case 'login': return 'text-accent-blue border-accent-blue/30 bg-accent-blue/10';
      default: return 'text-gray-300 border-gray-600 bg-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
       <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-accent-red" /> System Audit Logs
          </h2>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-black/40 border-dark-border hover:bg-white/5">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="btn-outline flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-black/40 border-dark-border hover:bg-white/5">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#0f1115] z-10 shadow-md">
              <tr className="text-xs uppercase tracking-wider text-gray-400 border-b border-dark-border">
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Result</th>
                <th className="px-6 py-4 font-medium">Operator</th>
                <th className="px-6 py-4 font-medium">Trace Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {loading ? (
                <tr>
                   <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                     <Activity className="w-6 h-6 animate-pulse mx-auto mb-2" />
                     Extracting syslogs...
                   </td>
                </tr>
              ) : logs.length === 0 ? (
                 <tr>
                   <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                     No system operations logged yet.
                   </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors text-sm">
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold capitalize border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`flex items-center gap-1.5 font-medium ${log.status === 'success' ? 'text-accent-green' : 'text-accent-red'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-accent-green' : 'bg-accent-red'}`}></span>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {log.user ? 'Admin User' : 'System Auto'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs w-1/3 truncate max-w-[200px]" title={log.details || log.errorMessage || '-'}>
                      {log.details || log.errorMessage || '-'}
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
