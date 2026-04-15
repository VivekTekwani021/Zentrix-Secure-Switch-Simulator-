import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, ShieldCheck, Zap, Server, Lock, Activity, ChevronRight, Network } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 overflow-x-hidden selection:bg-accent-cyan/30">
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-cyan blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-purple blur-[150px] rounded-full"
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6 border-b border-dark-border/30 backdrop-blur-md bg-dark-bg/50">
        <div className="flex items-center gap-3">
          <Cpu className="w-8 h-8 text-accent-cyan [filter:drop-shadow(0_0_10px_rgba(0,245,212,0.6))]" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Zentrix OS
          </span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-gray-300 hover:text-white font-medium px-4 py-2 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan px-5 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(0,245,212,0.2)] hover:shadow-[0_0_25px_rgba(0,245,212,0.4)]"
          >
            Get Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-sm font-medium mb-8">
             <Activity className="w-4 h-4" /> Live Node Telemetry v2.0 Released
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8">
            The World's Most Advanced <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan via-blue-400 to-accent-purple">
              Secure Switch Simulator
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Deploy hardened virtual nodes, monitor real-time WebSockets, and transmit strictly AES-filtered payloads across a true Zero-Trust architecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
             <button 
                onClick={() => navigate('/register')}
                className="group flex items-center gap-2 bg-accent-cyan hover:bg-accent-cyan/90 text-dark-bg text-lg font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(0,245,212,0.3)]"
             >
                Initialize Terminal
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
             <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-dark-panel border border-dark-border hover:border-gray-500 text-white text-lg font-medium px-8 py-4 rounded-xl transition-all"
             >
                <Lock className="w-5 h-5" /> Existing Port Clearance
             </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Industrial Grade Simulation</h2>
            <p className="text-gray-400">Everything you need to test secure topological layouts without the physical hardware limits.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Server, title: 'Virtual Node Registry', desc: 'Auto-provision hardware MAC and Local IP addresses mimicking physical routers and endpoints globally.', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
              { icon: ShieldCheck, title: 'Military AES-256', desc: 'Every byte fired through Zentrix goes through a runtime 256-bit CBC encryption wall on the edge middleware.', color: 'text-accent-green', glow: 'shadow-green-500/20' },
              { icon: Network, title: 'Real-Time Telemetry', desc: 'Target exact connected physical nodes using WebSocket-driven direct targeting or raw subnet broadcasting.', color: 'text-accent-cyan', glow: 'shadow-[rgba(0,245,212,0.2)]' }
            ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`glass-panel p-8 rounded-2xl border border-dark-border hover:border-gray-600 transition-colors cursor-default hover:shadow-xl ${feat.glow}`}
                >
                   <div className={`w-14 h-14 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center mb-6`}>
                      <feat.icon className={`w-7 h-7 ${feat.color}`} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                   <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
                </motion.div>
            ))}
         </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="relative z-10 border-t border-dark-border/50 py-10 mt-10">
         <div className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-accent-cyan" /> Securely engineered by DeepMind Zentrix Division
         </div>
      </footer>
    </div>
  );
}
