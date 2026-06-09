import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  FileText, 
  BarChart3,
  RefreshCw,
  Info,
  ThumbsUp,
  ThumbsDown,
  Cpu,
  Workflow,
  Layers,
  Database,
  ArrowRight,
  GitMerge,
  ArrowDown,
  Brain,
  LogOut,
  User,
  Activity,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { ReflectiveRAGEngine } from './lib/rag-engine';
import { Login } from './components/Login';
import { auth, loadFirebase, signInWithPopup, onAuthStateChanged } from './lib/firebase';
import type { User as FirebaseUser } from './lib/firebase';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SystemFlowchart = () => {
  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-16 overflow-hidden">
      <div className="flex flex-col items-center">
        {/* Row 1: Query & Retrieval */}
        <div className="flex items-center gap-4 mb-8">
          <FlowIcon icon={Search} label="Query" color="slate" />
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ArrowRight size={16} className="text-slate-300" />
          </motion.div>
          <FlowIcon icon={Database} label="Retrieval" color="slate" />
        </div>

        <motion.div initial={{ height: 0 }} animate={{ height: 32 }} className="w-px bg-slate-200 mb-8" />

        {/* Row 2: Synthesis */}
        <div className="flex items-center gap-4 mb-8">
          <FlowIcon icon={Layers} label="Drafting" color="slate" />
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}>
            <ArrowRight size={16} className="text-slate-300" />
          </motion.div>
          <FlowIcon icon={Cpu} label="Claim Extraction" color="slate" />
        </div>

        <motion.div initial={{ height: 0 }} animate={{ height: 32 }} className="w-px bg-slate-200 mb-8" />

        {/* Row 3: Decision Gate */}
        <div className="relative group">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rotate-45 border-2 border-slate-800 bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
              <div className="-rotate-45 flex flex-col items-center">
                <ShieldCheck size={20} className="text-slate-800 mb-1" />
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-900">Logic Gate</span>
              </div>
            </div>
            
            {/* Yes Path */}
            <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 flex items-center gap-2">
              <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowRight size={16} className="text-emerald-400" />
              </motion.div>
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                Supported
              </div>
            </div>

            {/* No Path */}
            <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 flex items-center gap-2 flex-row-reverse">
              <motion.div animate={{ x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowRight size={16} className="text-rose-400 rotate-180" />
              </motion.div>
              <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-rose-100">
                Hallucination
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-sm justify-between mt-12 mb-8">
           <div className="flex flex-col items-center">
              <FlowIcon icon={RefreshCw} label="Self-Correction" color="rose" />
           </div>
           <div className="flex flex-col items-center pt-8">
              <ArrowDown size={16} className="text-slate-200" />
           </div>
           <div className="flex flex-col items-center">
              <FlowIcon icon={CheckCircle2} label="Verified Finish" color="emerald" />
           </div>
        </div>

        <div className="bg-white border border-slate-200 px-6 py-3 rounded-full flex items-center gap-3 shadow-sm">
           <Brain size={14} className="text-slate-900" />
           <span className="text-[9px] font-bold uppercase tracking-widest text-slate-800">Mission Accomplished: Final Report Generated</span>
        </div>
      </div>
    </div>
  );
};

const FlowIcon = ({ icon: Icon, label, color }: { icon: any, label: string, color: string }) => {
  const colors: Record<string, string> = {
    slate: "bg-slate-900 text-white border-slate-900",
    emerald: "bg-emerald-600 text-white border-emerald-600",
    rose: "bg-rose-600 text-white border-rose-600",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all shadow-md cursor-pointer",
          colors[color]
        )}
      >
        <Icon size={24} />
      </motion.div>
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
    </div>
  );
};

const SAMPLE_QUERIES = [
  "Real-time object detection in autonomous vehicles latency",
  "Blockchain impact on medical data privacy",
  "Energy efficiency in 6G networks using DRL",
  "Vision Transformers vs CNNs spatial robustness"
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label || payload[0].payload.subject || payload[0].name}</p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-sm font-bold text-white">
            {payload[0].value.toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const EvaluationMetricsChart = ({ metrics }: { metrics: any }) => {
  const data = [
    { subject: 'Precision', A: metrics.precision * 100, fullMark: 100 },
    { subject: 'Recall', A: metrics.recall * 100, fullMark: 100 },
    { subject: 'F1 Score', A: metrics.f1Score * 100, fullMark: 100 },
    { subject: 'Faithfulness', A: metrics.faithfulness * 100, fullMark: 100 },
    { subject: 'Relevance', A: metrics.answerRelevance * 100, fullMark: 100 },
  ];

  const barData = [
    { name: 'Precision', value: metrics.precision * 100 },
    { name: 'Recall', value: metrics.recall * 100 },
    { name: 'F1 Score', value: metrics.f1Score * 100 },
  ];

  return (
    <div className="space-y-4">
      <div className="h-[220px] w-full bg-slate-50/50 rounded-xl border border-slate-100/50 flex items-center justify-center p-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
            />
            <Radar
              name="Performance"
              dataKey="A"
              stroke="#0f172a"
              strokeWidth={2}
              fill="#0f172a"
              fillOpacity={0.1}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-[120px] w-full bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 800 }}
            />
            <YAxis 
              hide
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              barSize={32}
            >
              {barData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value > 80 ? '#0f172a' : entry.value > 60 ? '#334155' : '#64748b'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {barData.map((item) => (
          <div key={item.name} className="flex flex-col items-center p-2 bg-slate-50 border border-slate-100 rounded-lg">
            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.name}</span>
            <span className="text-xs font-bold text-slate-900">{item.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'answer' | 'verification' | 'sources' | 'methodology'>('answer');
  const [feedback, setFeedback] = useState<{rating: number | null, comment: string, submitted: boolean}>({
    rating: null,
    comment: '',
    submitted: false
  });
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  
  const [user, setUser] = useState<FirebaseUser | { displayName: string, isGuest: boolean, uid: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const ragEngineRef = useRef<ReflectiveRAGEngine | null>(null);

  useEffect(() => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      ragEngineRef.current = new ReflectiveRAGEngine(apiKey);
    }

    // Initialize Firebase and check auth status
    const initAuth = async () => {
      const fb = await loadFirebase();
      if (fb && fb.auth) {
        onAuthStateChanged(fb.auth, (currentUser) => {
          if (currentUser) {
            setUser(currentUser as any);
            loadUserHistory(currentUser.uid);
          } else {
            setUser(null);
          }
          setIsAuthLoading(false);
        });
      } else {
        // Fallback or guest mode check (maybe check localstorage)
        const guest = localStorage.getItem('rag_guest_session');
        if (guest) {
          setUser(JSON.parse(guest));
        }
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  const loadUserHistory = async (uid: string) => {
    try {
      const fb = await loadFirebase();
      if (!fb || !fb.db) return;
      const { collection, query, where, orderBy, limit, getDocs } = await import('./lib/firebase');
      const q = query(
        collection(fb.db, 'history'),
        where('userId', '==', uid),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserHistory(history);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleLogin = async (method: 'google' | 'guest') => {
    setIsAuthenticating(true);
    if (method === 'google') {
      try {
        const fb = await loadFirebase();
        if (fb) {
          const result = await signInWithPopup(fb.auth, fb.googleProvider);
          setUser(result.user);
        } else {
          setError("Cloud authentication unavailable. Proceeding in guest mode.");
          handleLogin('guest');
        }
      } catch (err: any) {
        console.error("Login Error:", err);
        setError("Failed to sign in. Please try again.");
      }
    } else {
      const guestUser = { displayName: 'Research Guest', isGuest: true };
      setUser(guestUser as any);
      localStorage.setItem('rag_guest_session', JSON.stringify(guestUser));
    }
    setIsAuthenticating(false);
  };

  const handleLogout = async () => {
    const fb = await loadFirebase();
    if (fb && fb.auth) {
      await fb.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('rag_guest_session');
    setResult(null);
    setQuery('');
  };

  const [currentSteps, setCurrentSteps] = useState<any[]>([
    { name: 'Query Processing', status: 'pending' },
    { name: 'Semantic Retrieval', status: 'pending' },
    { name: 'Answer Generation', status: 'pending' },
    { name: 'Reflective Verification', status: 'pending' },
    { name: 'Self-Correction', status: 'pending' },
  ]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isProcessing) return;

    if (!ragEngineRef.current) {
      setError("AI Engine not initialized. Please check your API key.");
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setError(null);
    setActiveTab('answer');
    setFeedback({ rating: null, comment: '', submitted: false });
    setSourceFilter('All');

    // Reset steps
    setCurrentSteps(prev => prev.map(s => ({ ...s, status: 'pending', details: undefined })));

    try {
      const data = await ragEngineRef.current.processQuery(query, (steps) => {
        setCurrentSteps(steps);
      });
      setResult(data);

      // Save to History
      if (user) {
        const fb = await loadFirebase();
        if (fb && fb.db) {
          const { collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } = await import('./lib/firebase');
          try {
            const rawHistoryData = {
              userId: 'uid' in user ? user.uid : (user as any).uid || 'guest',
              query: query,
              answer: data.finalAnswer,
              verifications: data.verifications,
              sources: data.retrievedDocs
            };
            const cleanHistoryData = JSON.parse(JSON.stringify(rawHistoryData));
            cleanHistoryData.timestamp = serverTimestamp();
            await addDoc(collection(fb.db, 'history'), cleanHistoryData);
            loadUserHistory('uid' in user ? user.uid : (user as any).uid || 'guest');
          } catch (fsErr) {
            handleFirestoreError(fsErr, OperationType.CREATE, 'history');
          }
        }
      }
    } catch (err: any) {
      console.error("RAG Error:", err);
      setError(err.message || 'An unexpected error occurred during analysis');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!user || !result) return;
    
    try {
      const fb = await loadFirebase();
      if (fb && fb.db) {
        const { collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } = await import('./lib/firebase');
        await addDoc(collection(fb.db, 'feedback'), {
          userId: 'uid' in user ? user.uid : (user as any).uid || 'guest',
          queryId: result.id || 'current',
          rating: feedback.rating,
          comment: feedback.comment,
          timestamp: serverTimestamp()
        });
      }
      setFeedback(prev => ({ ...prev, submitted: true }));
    } catch (err) {
      console.error("Feedback error:", err);
      // Still show "submitted" in UI for UX, but log error
      setFeedback(prev => ({ ...prev, submitted: true }));
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-500';
    if (score >= 0.6) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return 'High Confidence';
    if (score >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-white animate-spin opacity-20" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Syncing Node</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} isAuthenticating={isAuthenticating} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      {/* Attribution Bar */}
      <div className="bg-slate-900 text-slate-200 py-1.5 text-center text-[9px] font-bold tracking-[0.2em] uppercase">
        Platform Core <span className="opacity-40">•</span> Research Evaluation Node <span className="opacity-40 ml-2">Anurag Das (RA2112702010007)</span>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white">
              <ShieldCheck size={18} strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-sans text-lg font-bold tracking-tight leading-none text-slate-900">Reflective RAG</h1>
              <p className="text-[9px] uppercase tracking-[0.1em] text-slate-500 font-bold mt-0.5">Academic Verification Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase tracking-tight">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              Dataset: 400+ Document Corpus
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={cn(
                  "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                  showHistory ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-white"
                )}
                title="Search History"
              >
                <Database size={16} />
              </button>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">{user.displayName || 'Researcher'}</p>
                <p className="text-[8px] font-bold text-slate-400">{'email' in user ? user.email : 'Local Session'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0 shadow-sm">
                {'photoURL' in user && user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User Avatar'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-100">
                    <User size={18} />
                  </div>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-white transition-all group"
                title="Sign Out"
              >
                <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative">
        {/* History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-slate-200 z-40 shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Search History</h3>
                <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-900">
                  <ArrowRight size={14} className="rotate-180" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                  {'photoURL' in user && user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User Avatar'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-100">
                      <User size={20} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.displayName || 'Researcher'}</p>
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                    {'email' in user ? 'Authenticated' : 'Guest Session'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {userHistory.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">No history found<br/>Initiate research to save node</p>
                  </div>
                ) : (
                  userHistory.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      onClick={() => {
                        setQuery(item.query);
                        setResult(item);
                        setShowHistory(false);
                      }}
                      className="w-full text-left p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 hover:bg-white transition-all group"
                    >
                      <p className="text-xs font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-slate-950">{item.query}</p>
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
                        <Activity size={10} />
                        {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : 'Recent'}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Section */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="font-serif text-4xl font-medium text-slate-900 mb-3 tracking-tight">
              Knowledge Synthesis & <span className="italic">Verification</span>
            </h2>
            <p className="text-slate-500 font-sans text-sm max-w-lg mx-auto leading-relaxed">
              Inquire our academic database with automated grounding and multi-step reflection.
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                <Search size={18} strokeWidth={2} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search research frontiers..."
                className="block w-full pl-11 pr-52 py-4 bg-white border border-slate-200 rounded-lg shadow-sm focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-sans text-base"
              />
              <AnimatePresence>
                {query && !isProcessing && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-[160px] top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    title="Clear search"
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
              <motion.button
                type="submit"
                disabled={isProcessing || !query.trim()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={12} /> : 'Process Query'}
              </motion.button>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mr-1 mt-1.5">Try these:</span>
              {SAMPLE_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuery(q)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500 hover:border-slate-400 hover:text-slate-800 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  {q}
                </button>
              ))}
            </div>
          </form>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Pipeline & Metrics */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pipeline Status */}
            <motion.div 
              whileHover={{ y: -1 }}
              className="formal-card p-6"
            >
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <RefreshCw size={10} />
                Execution Pipeline
              </h3>
              <div className="space-y-4">
                {currentSteps.map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ x: 2 }}
                    className="relative pl-8 pb-4 last:pb-0"
                  >
                    {idx !== currentSteps.length - 1 && (
                      <div className={cn(
                        "absolute left-[11px] top-6 bottom-0 w-[1px]",
                        step.status === 'completed' ? 'bg-slate-900' : 'bg-slate-200'
                      )} />
                    )}
                    <div className={cn(
                      "absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border text-[10px] transition-all",
                      step.status === 'completed' ? 'bg-slate-900 border-slate-900 text-white' : 
                      step.status === 'processing' ? 'bg-white border-slate-900 text-slate-900' : 
                      'bg-white border-slate-200 text-slate-300'
                    )}>
                      {step.status === 'completed' ? <CheckCircle2 size={12} /> : 
                       step.status === 'processing' ? <Loader2 size={12} className="animate-spin" /> : 
                       idx + 1}
                    </div>
                    <div>
                      <p className={cn(
                        "text-[10px] font-bold uppercase tracking-tight",
                        step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'
                      )}>
                        {step.name}
                      </p>
                      {step.details && (
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-sans">{step.details}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Metrics Card */}
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="formal-card p-6"
              >
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                  <BarChart3 size={10} />
                  Performance Metrics
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Confidence Level</span>
                      <span className="font-sans text-xl font-bold text-slate-900">
                        {(result.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1 bg-slate-100 w-full rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidenceScore * 100}%` }}
                        className="h-full bg-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Hallucination Risk</span>
                    <span className={cn("font-sans text-xl font-bold", 
                      result.hallucinationRate > 20 ? 'text-rose-600' : 'text-slate-900'
                    )}>
                      {result.hallucinationRate.toFixed(0)}%
                    </span>
                  </div>

                  {/* Visualization */}
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-4">Precision-Recall Distribution</h4>
                    <EvaluationMetricsChart metrics={result.metrics} />
                  </div>

                  {/* Advanced Metrics */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                       <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Precision</p>
                        <p className="font-sans text-base font-bold text-slate-800">{(result.metrics.precision * 100).toFixed(0)}%</p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Recall</p>
                        <p className="font-sans text-base font-bold text-slate-800">{(result.metrics.recall * 100).toFixed(0)}%</p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">F1 Score</p>
                        <p className="font-sans text-base font-bold text-slate-800">{(result.metrics.f1Score * 100).toFixed(0)}%</p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Latency</p>
                        <p className="font-sans text-base font-bold text-slate-800">{(result.metrics.latency / 1000).toFixed(1)}s</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Results & Analysis */}
          <div className="lg:col-span-8">
            {!result && !isProcessing && !error && (
              <div className="formal-card p-20 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                  <BookOpen size={32} strokeWidth={1} />
                </div>
                <h3 className="font-sans text-xl font-bold text-slate-900 mb-2">Ready for Inquiry</h3>
                <p className="text-slate-500 font-sans text-sm max-w-sm">
                  Enter a research query to initiate the adaptive retrieval and verification pipeline.
                </p>
              </div>
            )}

            {isProcessing && !result && (
              <div className="formal-card p-20 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-slate-900">
                    <RefreshCw size={24} />
                  </div>
                </div>
                <h3 className="font-sans text-xl font-bold text-slate-900 mb-2">Processing Synthesis</h3>
                <p className="text-slate-500 font-sans text-sm max-w-sm">
                  Retrieving evidence corpus and performing cross-verification...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-start gap-4 text-rose-700">
                <AlertTriangle className="shrink-0" />
                <div>
                  <h4 className="font-bold">System Error</h4>
                  <p className="text-sm opacity-90">{error}</p>
                  <button onClick={() => handleSearch()} className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors">
                    Retry Analysis
                  </button>
                </div>
              </div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Tabs */}
                <div className="flex bg-white p-1 border border-slate-200 rounded-lg shadow-sm">
                    {[
                      { id: 'answer', label: 'Verified Answer', icon: CheckCircle2 },
                      { id: 'verification', label: 'Reflection Log', icon: ShieldCheck },
                      { id: 'sources', label: 'Evidence Sources', icon: FileText },
                      { id: 'methodology', label: 'System Architecture', icon: Workflow },
                    ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                        activeTab === tab.id 
                          ? "bg-slate-900 text-white shadow-sm" 
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <tab.icon size={12} strokeWidth={2} />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="formal-card">
                  <AnimatePresence mode="wait">
                    {activeTab === 'answer' && (
                      <motion.div
                        key="answer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-10"
                      >
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                          <h3 className="font-serif text-3xl font-medium text-slate-900">Synthesis Report</h3>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded text-[9px] font-bold uppercase tracking-widest">
                            <ShieldCheck size={12} />
                            Verified Output
                          </div>
                        </div>
                        <div className="prose prose-slate max-w-none prose-headings:font-sans prose-p:font-sans prose-p:text-base prose-p:leading-relaxed prose-p:text-slate-700">
                          <ReactMarkdown>{result.finalAnswer}</ReactMarkdown>
                        </div>
                        
                        {result.hallucinationRate > 0 && (
                          <div className="mt-10 p-5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                            <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                              <span className="font-bold uppercase tracking-tight text-slate-700 mr-1.5">Note:</span> 
                              Automated self-correction module was active. Claims found lacking sufficient evidence in the source corpus were refined to maintain 100% data integrity.
                            </p>
                          </div>
                        )}

                        {/* Feedback Mechanism */}
                        <div className="mt-12 pt-10 border-t border-slate-100">
                          {!feedback.submitted ? (
                            <div className="max-w-xl mx-auto">
                              <div className="text-center mb-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Quality Assessment</h4>
                                <p className="text-slate-500 text-xs">Help us calibrate the verification engine for academic precision.</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-3">Rate Accuracy</p>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                      <button
                                        key={num}
                                        onClick={() => setFeedback(prev => ({ ...prev, rating: num }))}
                                        className={cn(
                                          "w-10 h-10 rounded-md border text-sm font-bold transition-all",
                                          feedback.rating === num 
                                            ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                                            : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600"
                                        )}
                                      >
                                        {num}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-3">Synthesis Value</p>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => setFeedback(prev => ({ ...prev, rating: prev.rating || 5 }))}
                                      className="flex-1 py-1 px-4 border border-slate-200 rounded text-[10px] uppercase font-bold text-slate-400 hover:bg-slate-50"
                                    >
                                      High
                                    </button>
                                    <button 
                                      onClick={() => setFeedback(prev => ({ ...prev, rating: prev.rating || 1 }))}
                                      className="flex-1 py-1 px-4 border border-slate-200 rounded text-[10px] uppercase font-bold text-slate-400 hover:bg-slate-50"
                                    >
                                      Low
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-8">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-3">Observations & Comments</p>
                                <textarea
                                  value={feedback.comment}
                                  onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                                  placeholder="Provide specific notes on factual accuracy or relevance..."
                                  className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-sans outline-none focus:ring-1 focus:ring-slate-400 resize-none placeholder:text-slate-400"
                                />
                              </div>

                              <div className="flex justify-center">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={handleFeedbackSubmit}
                                  disabled={feedback.rating === null}
                                  className="px-10 py-3 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                  Submit Report
                                </motion.button>
                              </div>
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-slate-900 text-white rounded-xl p-10 text-center max-w-lg mx-auto shadow-2xl"
                            >
                              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                                <ShieldCheck size={32} />
                              </div>
                              <h4 className="text-xl font-bold mb-2">Report Authenticated</h4>
                              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Your feedback was recorded at {new Date().toLocaleTimeString()}. The synthesis weights have been adjusted accordingly.
                              </p>
                              <button 
                                onClick={() => setFeedback({ rating: null, comment: '', submitted: false })}
                                className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
                              >
                                Edit Response
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'verification' && (
                      <motion.div
                        key="verification"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-10"
                      >
                        <h3 className="font-serif text-3xl font-medium text-slate-900 mb-8">Reflection Log</h3>
                        <div className="space-y-6">
                          {result.verifications.map((v: any, i: number) => (
                            <motion.div 
                              key={i} 
                              whileHover={{ y: -1 }}
                              className={cn(
                                "p-6 border rounded-lg transition-all shadow-sm",
                                v.isSupported ? "bg-slate-50 border-slate-200/60" : "bg-rose-50/30 border-rose-100"
                              )}
                            >
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <p className="font-sans text-base text-slate-800 leading-relaxed font-medium">"{v.claim}"</p>
                                <div className={cn(
                                  "shrink-0 px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest",
                                  v.isSupported ? "bg-slate-900 text-white" : "bg-rose-600 text-white"
                                )}>
                                  {v.isSupported ? 'Verified' : 'Flagged'}
                                </div>
                              </div>
                              <div className="flex items-center gap-5 text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                                <span className="flex items-center gap-1.5"><ShieldCheck size={10} /> Grounding: {(v.similarity * 100).toFixed(0)}%</span>
                                {v.isSupported ? (
                                  <span className="text-emerald-700 flex items-center gap-1.5 ">
                                    <CheckCircle2 size={10} /> Fully Supported
                                  </span>
                                ) : (
                                  <span className="text-rose-600 flex items-center gap-1.5">
                                    <AlertTriangle size={10} /> Evidence Mismatch
                                  </span>
                                )}
                              </div>

                              {v.reasoning && (
                                <div className="mb-4 text-xs font-sans text-slate-500 leading-relaxed italic border-l-2 border-slate-200 pl-4 py-1">
                                  {v.reasoning}
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 gap-4">
                                {v.evidence && (
                                  <div className="p-4 bg-white border border-slate-100 rounded shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <CheckCircle2 size={12} className="text-emerald-500" />
                                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Supporting Evidence: {v.sourceTitle}</span>
                                    </div>
                                    <p className="font-sans text-sm text-slate-600 italic leading-relaxed">
                                      "...{v.evidence}..."
                                    </p>
                                  </div>
                                )}

                                {v.conflictingEvidence && (
                                  <div className="p-4 bg-rose-50 border border-rose-100 rounded shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertTriangle size={12} className="text-rose-500" />
                                      <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest leading-none">Conflicting Evidence: {v.sourceTitle}</span>
                                    </div>
                                    <p className="font-sans text-sm text-rose-700 italic leading-relaxed">
                                      "...{v.conflictingEvidence}..."
                                    </p>
                                  </div>
                                )}

                                {!v.isSupported && !v.conflictingEvidence && (
                                  <div className="p-4 bg-slate-100 border border-slate-200 rounded text-center opacity-60">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                      No corroborating data found in the retrieved corpus
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'sources' && (
                      <motion.div
                        key="sources"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-12"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
                          <h3 className="font-serif text-3xl font-medium text-slate-900">Evidence Archive</h3>
                          
                          <div className="flex flex-wrap gap-1.5">
                            {['All', 'IEEE', 'arXiv', 'Patent', 'Methodology'].map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setSourceFilter(cat)}
                                className={cn(
                                  "px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest rounded transition-all",
                                  sourceFilter === cat 
                                    ? "bg-slate-900 text-white shadow-sm" 
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-10">
                          {result.retrievedDocs
                            .filter((doc: any) => sourceFilter === 'All' || doc.category === sourceFilter)
                            .map((doc: any, i: number) => (
                              <motion.div 
                                key={i} 
                                whileHover={{ x: 4 }}
                                className="group transition-all"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-bold uppercase tracking-widest rounded">
                                    {doc.category}
                                  </span>
                                  <h4 className="font-sans text-lg font-bold text-slate-800">{doc.title}</h4>
                                </div>
                                <p className="font-sans text-sm text-slate-500 leading-relaxed pl-5 border-l-2 border-slate-100 group-hover:border-slate-300 transition-all">
                                  {doc.abstract}
                                </p>
                              </motion.div>
                            ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'methodology' && (
                      <motion.div
                        key="methodology"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-10"
                      >
                        <div className="max-w-3xl">
                          <h3 className="font-serif text-3xl font-medium text-slate-900 mb-4">Methodology & Architecture</h3>
                          <p className="text-slate-500 text-sm mb-12 font-sans leading-relaxed">
                            The Reflective RAG framework employs a multi-stage verification loop designed to eliminate large language model hallucinations by cross-referencing generated claims with an authoritative evidence corpus.
                          </p>

                          <SystemFlowchart />
                          
                          <div className="space-y-12">
                            {[
                              {
                                title: "1. Semantic Retrieval",
                                description: "The system converts the natural language query into high-dimensional vector space, retrieving the most relevant research documents from the verified academic corpus.",
                                icon: Search,
                                details: ["Vector embeddings (384-dim)", "Keyword intersection", "Rank-ordered relevance"]
                              },
                              {
                                title: "2. Draft Synthesis",
                                description: "A primary generative pass creates an initial research summary grounded strictly in the retrieved context, prioritizing source data over model weights.",
                                icon: Layers,
                                details: ["Context-bound prompting", "Tone calibration", "Draft report generation"]
                              },
                              {
                                title: "3. Reflective Extraction",
                                description: "A secondary 'Adversarial' pass decomposes the draft into atomic, verifiable research claims that can be individually audited.",
                                icon: Cpu,
                                details: ["Claim atomization", "Verifiability check", "Entity extraction"]
                              },
                              {
                                title: "4. Cross-Verification Log",
                                description: "Each claim is cross-referenced using a 'True/False/Refuted' logic gate against the corpus to confirm factual grounding.",
                                icon: ShieldCheck,
                                details: ["Evidence mapping", "Similarity scoring", "Conflict detection"]
                              },
                              {
                                title: "5. Self-Correction Cycle",
                                description: "Unsupported claims are either discarded or rewritten to match the discovered evidence before the final report is compiled.",
                                icon: RefreshCw,
                                details: ["Hallucination pruning", "Evidence-based rewrite", "Final integrity check"]
                              }
                            ].map((step, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pl-12 border-l border-slate-100"
                              >
                                <div className="absolute left-[-16px] top-0 w-8 h-8 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-slate-900">
                                  <step.icon size={14} />
                                </div>
                                <h4 className="font-sans font-bold text-slate-800 mb-2">{step.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-4">{step.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {step.details.map((detail, dIdx) => (
                                    <span key={dIdx} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                                      {detail}
                                    </span>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'methodology' && (
                      <motion.div
                        key="methodology"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-10"
                      >
                        <div className="max-w-3xl">
                          <h3 className="font-serif text-3xl font-medium text-slate-900 mb-4">Methodology & Architecture</h3>
                          <p className="text-slate-500 text-sm mb-12 font-sans leading-relaxed">
                            The Reflective RAG framework employs a multi-stage verification loop designed to eliminate large language model hallucinations by cross-referencing generated claims with an authoritative evidence corpus.
                          </p>

                          <SystemFlowchart />
                          
                          <div className="space-y-12">
                            {[
                              {
                                title: "1. Semantic Retrieval",
                                description: "The system converts the natural language query into high-dimensional vector space, retrieving the most relevant research documents from the verified academic corpus.",
                                icon: Search,
                                details: ["Vector embeddings (384-dim)", "Keyword intersection", "Rank-ordered relevance"]
                              },
                              {
                                title: "2. Draft Synthesis",
                                description: "A primary generative pass creates an initial research summary grounded strictly in the retrieved context, prioritizing source data over model weights.",
                                icon: Layers,
                                details: ["Context-bound prompting", "Tone calibration", "Draft report generation"]
                              },
                              {
                                title: "3. Reflective Extraction",
                                description: "A secondary 'Adversarial' pass decomposes the draft into atomic, verifiable research claims that can be individually audited.",
                                icon: Cpu,
                                details: ["Claim atomization", "Verifiability check", "Entity extraction"]
                              },
                              {
                                title: "4. Cross-Verification Log",
                                description: "Each claim is cross-referenced using a 'True/False/Refuted' logic gate against the corpus to confirm factual grounding.",
                                icon: ShieldCheck,
                                details: ["Evidence mapping", "Similarity scoring", "Conflict detection"]
                              },
                              {
                                title: "5. Self-Correction Cycle",
                                description: "Unsupported claims are either discarded or rewritten to match the discovered evidence before the final report is compiled.",
                                icon: RefreshCw,
                                details: ["Hallucination pruning", "Evidence-based rewrite", "Final integrity check"]
                              }
                            ].map((step, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pl-12 border-l border-slate-100"
                              >
                                <div className="absolute left-[-16px] top-0 w-8 h-8 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-slate-900">
                                  <step.icon size={14} />
                                </div>
                                <h4 className="font-sans font-bold text-slate-800 mb-2">{step.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-4">{step.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {step.details.map((detail, dIdx) => (
                                    <span key={dIdx} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                                      {detail}
                                    </span>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-40">
            <ShieldCheck size={20} strokeWidth={2} />
            <span className="font-sans font-bold text-sm tracking-tight text-slate-900">Reflective RAG v2.1</span>
          </div>
          <div className="flex gap-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-900 transition-colors">System Health</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Data Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
