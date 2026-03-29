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
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    // 🔥 New Page Transition Wrapper
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 font-sans"
    >
      {/* Poora White Card Code */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden min-h-[650px] relative">
        
        {/* LEFT PANEL: Curvy Branding */}
        <div className="relative hidden md:flex flex-col justify-between p-12 text-white bg-gradient-to-br from-[#6366F1] to-[#4338CA] overflow-hidden">
          
          {/* Custom Organic Wave Shape */}
          <div className="absolute top-0 right-0 h-full w-[120px] translate-x-1/2 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full fill-white">
              <path d="M0 0 C 50 25, 50 75, 0 100 L 100 100 L 100 0 Z" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-16">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <span className="text-white w-6 h-6 flex items-center justify-center font-bold text-xl">₹</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">FinTrack.</span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
              Smart Way <br/> <span className="text-indigo-200">to Save.</span>
            </h1>
            <p className="text-indigo-100 text-lg opacity-80 max-w-xs leading-relaxed">
              Track your daily expenses and reach your financial goals with ease.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex justify-center"
          >
            <img 
              src="https://ouch-cdn2.icons8.com/P0-XqQv80GvO8fT3Z6uWv5oZ9fV3yv7-6_9-7_r_X_Y/rs:fit:456:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzg2/LzQ1ZjFmN2IyLTU1/YTctNDYyNC1hYmYy/LWZjZDY5YjZlMjBk/Yy5zdmc.png" 
              className="w-full max-w-[300px] drop-shadow-3xl"
              alt="Finances"
            />
          </motion.div>

          <p className="relative z-10 text-indigo-200/50 text-xs tracking-widest font-bold uppercase">
            © 2026 FinTrack Inc
          </p>
        </div>

        {/* RIGHT PANEL: Minimalist Login */}
        <div className="p-10 md:p-20 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please enter your account details.</p>
            </div>

            <button 
              onClick={() => handleAuth(null, 'google')} 
              className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all mb-8 shadow-sm active:scale-95"
            >
              <FcGoogle size={24} /> Continue with Google
            </button>

            <div className="relative mb-10 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Authentication</span>
            </div>

            <form onSubmit={(e) => handleAuth(e, 'email')} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-slate-900" 
                    placeholder="john@example.com" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <Link to="#" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">Forgot?</Link>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-slate-900" 
                    placeholder="••••••••" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                    {showPassword ? <HiOutlineEyeOff size={20}/> : <HiOutlineEye size={20}/>}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : "Sign In →"}
              </button>
            </form>

            <p className="mt-10 text-center text-slate-500 text-sm font-medium">
              Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline underline-offset-4">Create One</Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}