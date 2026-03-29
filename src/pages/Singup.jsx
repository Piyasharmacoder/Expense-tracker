import { useState } from "react";
import { supabase } from "../services/supabase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name } },
      });
      if (error) throw error;
      alert("Signup successful! Please check your email for verification.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="min-h-screen w-full flex items-center justify-center bg-[#F1F5F9] p-4 font-sans"
    >
      {/* 🚀 COMPACT CARD: Width 820px (Matching Login) */}
      <div className="w-full max-w-[820px] grid md:grid-cols-2 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden min-h-[520px] relative">
        
        {/* LEFT PANEL: With Premium Curve */}
        <div className="relative hidden md:flex flex-col justify-between p-8 text-white bg-gradient-to-br from-[#6366F1] to-[#4338CA] overflow-hidden">
          
          {/* 🔥 THE PREMIUM CURVE */}
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
              Start Your <br/> 
              <span className="text-indigo-200">Journey.</span>
            </h1>
            <p className="text-indigo-100/70 text-[11px] font-medium max-w-[180px] leading-relaxed">
              Create an account and manage your "Bahi Khata" like a pro.
            </p>
          </div>

          <div className="relative z-10 flex justify-center py-2">
            <img 
              src="https://ouch-cdn2.icons8.com/mS2p-y-G_6L1u-6V9aKzL0vC1-G4YI3_J9zZ6v-9w7s/rs:fit:456:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMjU0/LzYyZTIzMGY1LWYx/N2EtNGI0NS1hZjY0/LWM5ZDEzZGM5Zjg0/Ny5zdmc.png" 
              className="w-32 drop-shadow-2xl"
              alt="Signup"
            />
          </div>

          <p className="relative z-10 text-indigo-300/40 text-[9px] font-black uppercase tracking-widest">
            © 2026 FinTrack Inc
          </p>
        </div>

        {/* RIGHT PANEL: Tight Signup Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center bg-white relative z-10">
          <div className="max-w-[280px] mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 mb-0.5 tracking-tight">Create Account</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Join FinTrack today</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-3.5">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    required 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-xs" 
                    placeholder="Priyanka Sharma" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-xs" 
                    placeholder="name@email.com" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-xs" 
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
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-slate-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-1 text-xs"
              >
                {loading ? "Creating..." : "Get Started →"}
              </button>
            </form>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-50"></div></div>
              <span className="relative bg-white px-2 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Or use social</span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2 border border-slate-100 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all text-[11px] shadow-sm active:scale-95">
              <FcGoogle size={16} /> Google
            </button>

            <p className="mt-6 text-center text-slate-400 text-[10px] font-medium">
              Already a member? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}