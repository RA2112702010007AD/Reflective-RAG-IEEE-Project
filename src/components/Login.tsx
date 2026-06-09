import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  LogIn, 
  ChevronRight, 
  Database, 
  Lock, 
  Globe, 
  Terminal,
  Activity,
  Layers,
  Search,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LoginProps {
  onLogin: (method: 'google' | 'guest') => void;
  isAuthenticating?: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isAuthenticating }) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Search,
      title: "Reflective Retrieval",
      desc: "Cross-indexed semantic search with recursive verification."
    },
    {
      icon: ShieldCheck,
      title: "Fact Authentication",
      desc: "Adversarial claim decomposition and corpus validation."
    },
    {
      icon: Layers,
      title: "Synthesis Engine",
      desc: "Academic-grade research synthesis with zero hallucination."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Ambient Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-6xl px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Branding & Features Section */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center lg:justify-start gap-4 mb-8"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-white text-2xl font-black tracking-tight leading-none uppercase">Reflective RAG</h2>
              <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Research Intelligence Core</p>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-serif text-white font-medium mb-6 leading-[1.1] tracking-tight"
          >
            The Future of <br />
            <span className="text-slate-400 italic">Self-Correcting</span> Knowledge.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-xl mb-12 leading-relaxed"
          >
            Access a high-fidelity research portal powered by automated grounding and adversarial reflection. 
            Join the academic network for persistsent insights.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + (idx * 0.1) }}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={cn(
                  "p-5 rounded-2xl border border-white/5 transition-all cursor-default group",
                  hoveredFeature === idx ? "bg-white/5 border-white/10" : "bg-transparent"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors",
                  hoveredFeature === idx ? "bg-white text-slate-950" : "bg-white/5 text-white/40"
                )}>
                  <feature.icon size={20} />
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{feature.title}</h4>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            {/* Gloss Effect */}
            <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
            
            <div className="text-center mb-10">
              <h3 className="text-white text-2xl font-serif font-medium mb-2">Gate Activation</h3>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">Authentication Required for Entry</p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onLogin('google')}
                disabled={isAuthenticating}
                className="w-full py-4 bg-white text-slate-950 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all cursor-pointer group disabled:opacity-50"
              >
                <LogIn size={18} className="group-hover:rotate-12 transition-transform" />
                {isAuthenticating ? "Synchronizing..." : "Sign in with Google"}
              </motion.button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[8px] uppercase font-bold tracking-[0.4em] text-slate-600 bg-slate-950/0 px-4">
                  or continue anonymized
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onLogin('guest')}
                className="w-full py-4 bg-white/5 border border-white/5 text-white/50 rounded-2xl flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                Enter as Researcher <ChevronRight size={14} />
              </motion.button>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-6">
              <div className="flex items-center justify-between text-[8px] uppercase font-bold tracking-[0.1em] text-slate-500">
                <div className="flex items-center gap-2">
                  <Activity size={10} className="text-blue-500" />
                  <span>Node: Global-v1</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal size={10} className="text-purple-500" />
                  <span>LLM: Gemini-Flash</span>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-start gap-4">
                <Lock size={16} className="text-slate-600 shrink-0 mt-1" />
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                  Encryption-at-rest enabled. All guest sessions are cleared on browser exit unless synchronized with Google ID.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center items-center gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Globe size={12} /> Distributed</span>
            <span className="w-1 h-1 bg-slate-800 rounded-full" />
            <span className="flex items-center gap-1.5"><Database size={12} /> Grounded</span>
            <span className="w-1 h-1 bg-slate-800 rounded-full" />
            <span className="flex items-center gap-1.5"><Sparkles size={12} /> Augmented</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-[20%] left-[20%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
    </div>
  );
};
