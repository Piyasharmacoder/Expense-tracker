import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setInitializing(false);
      if (session) navigate("/");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e, type) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const { error } = type === 'google' 
        ? await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
        : await supabase.auth.signInWithPassword(formData);
      if (error) throw error;
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] p-4 font-sans"
    >
      {/* 🚀 COMPACT CARD WITH PREMIUM CURVE */}
      <div className="w-full max-w-[820px] grid md:grid-cols-2 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden min-h-[500px] relative">
        
        {/* LEFT PANEL: With Organic Curve */}
        <div className="relative hidden md:flex flex-col justify-between p-8 text-white bg-gradient-to-br from-[#5356FF] to-[#3730A3] overflow-hidden">
          
          {/* 🔥 THE PREMIUM CURVE (WAVE) */}
          <div className="absolute top-0 right-0 h-full w-[80px] translate-x-1/2 pointer-events-none z-20">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full fill-white">
              <path d="M0 0 C 60 25, 60 75, 0 100 L 100 100 L 100 0 Z" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/20">
                <span className="text-white w-5 h-5 flex items-center justify-center font-black text-sm">₹</span>
              </div>
              <span className="text-base font-black tracking-tight uppercase">FinTrack.</span>
            </div>
            
            <h1 className="text-3xl font-black leading-tight tracking-tight mb-2">
              Smart Way <br/> 
              <span className="text-indigo-200">to Save.</span>
            </h1>
            <p className="text-indigo-100/70 text-[11px] font-medium max-w-[180px] leading-relaxed">
              Track your daily expenses and reach your financial goals with ease.
            </p>
          </div>

          <div className="relative z-10 flex justify-center py-2">
            <img 
              src="https://ouch-cdn2.icons8.com/P0-XqQv80GvO8fT3Z6uWv5oZ9fV3yv7-6_9-7_r_X_Y/rs:fit:456:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzg2/LzQ1ZjFmN2IyLTU1/YTctNDYyNC1hYmYy/LWZjZDY5YjZlMjBk/Yy5zdmc.png" 
              className="w-36 drop-shadow-2xl"
              alt="Finances"
            />
          </div>

          <p className="relative z-10 text-indigo-300/40 text-[9px] font-black uppercase tracking-widest">
            © 2026 FinTrack Inc
          </p>
        </div>

        {/* RIGHT PANEL: Sleek Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center bg-white relative z-10">
          <div className="max-w-[270px] mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 mb-0.5 tracking-tight">Welcome Back</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enter your details</p>
            </div>

            <button 
              onClick={() => handleAuth(null, 'google')} 
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-100 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all mb-5 shadow-sm active:scale-95 text-xs"
            >
              <FcGoogle size={18} /> Continue with Google
            </button>

            <div className="relative mb-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-50"></div></div>
              <span className="relative bg-white px-3 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Secure Auth</span>
            </div>

            <form onSubmit={(e) => handleAuth(e, 'email')} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-xs" 
                    placeholder="john@example.com" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <Link to="#" className="text-[9px] font-bold text-indigo-600">Forgot?</Link>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-xs" 
                    placeholder="••••••••" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <HiOutlineEyeOff size={16}/> : <HiOutlineEye size={16}/>}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-slate-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-1 text-xs"
              >
                {loading ? "Verifying..." : "Sign In →"}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-400 text-[10px] font-medium">
              Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create One</Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}