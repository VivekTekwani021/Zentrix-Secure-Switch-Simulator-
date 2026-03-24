import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, LayoutDashboard, RadioTower, Server, 
  KeyRound, ShieldAlert, LogOut, User, Activity 
} from 'lucide-react';
import { Login } from './views/Login';
import { DashboardStats } from './views/DashboardStats';
import { Simulation } from './views/Simulation';
import { DeviceList } from './views/DeviceList';
import { KeyList } from './views/KeyList';
import { AuditLogs } from './views/AuditLogs';

// Global Layout Wrapper
export default function App() {
  const [authToken, setAuthToken] = useState(() => {
    const token = localStorage.getItem('zen_token');
    if (!token || token === 'undefined' || token === 'null') {
      localStorage.removeItem('zen_token');
      return null;
    }
    return token;
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('zen_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authToken && location.pathname !== '/login') {
      navigate('/login');
    } else if (authToken && location.pathname === '/login') {
      navigate('/');
    }
  }, [authToken, location.pathname, navigate]);

  const handleLogin = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    localStorage.setItem('zen_token', token);
    localStorage.setItem('zen_user', JSON.stringify(userData));
    navigate('/');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('zen_token');
    localStorage.removeItem('zen_user');
    navigate('/login');
  };

  if (!authToken) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    );
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/simulation', label: 'Simulation', icon: RadioTower },
    { path: '/devices', label: 'Devices', icon: Server },
    { path: '/keys', label: 'Key Management', icon: KeyRound },
    { path: '/logs', label: 'Audit Logs', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-screen bg-dark-bg text-gray-200 font-sans overflow-hidden selection:bg-accent-cyan/30">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        className="w-[260px] border-r border-dark-border bg-dark-panel backdrop-blur-xl flex flex-col"
      >
        <div className="p-6 flex items-center gap-3">
          <Cpu className="w-8 h-8 text-accent-cyan [filter:drop-shadow(0_0_10px_rgba(0,245,212,0.6))]" />
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Zentrix OS
          </h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-accent-cyan/10 text-white border-l-2 border-accent-cyan' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-accent-cyan' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-dark-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-dark-border flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user?.name || 'System Admin'}</span>
                <span className="text-xs text-accent-cyan flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Secure Link
                </span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-accent-red transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />

        <header className="px-8 py-6 border-b border-dark-border/50 flex justify-between items-center z-10 bg-dark-bg/80 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-white capitalize">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
          </h1>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            Connection Secure
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 z-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Routes location={location}>
                <Route path="/" element={<DashboardStats />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/devices" element={<DeviceList />} />
                <Route path="/keys" element={<KeyList />} />
                <Route path="/logs" element={<AuditLogs />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
