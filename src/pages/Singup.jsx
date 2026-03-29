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
    // 🔥 New Page Transition Wrapper (Slide from Left)
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 font-sans"
    >
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden min-h-[650px] relative">
        
        {/* LEFT PANEL: Curvy Branding (Matching Login) */}
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
              <span className="text-2xl font-bold tracking-tight text-white">FinTrack.</span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
              Start Your <br/> <span className="text-indigo-200">Journey.</span>
            </h1>
            <p className="text-indigo-100 text-lg opacity-80 max-w-xs leading-relaxed">
              Create an account and start managing your "Bahi Khata" like a pro today.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex justify-center"
          >
            <img 
              src="https://ouch-cdn2.icons8.com/mS2p-y-G_6L1u-6V9aKzL0vC1-G4YI3_J9zZ6v-9w7s/rs:fit:456:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMjU0/LzYyZTIzMGY1LWYx/N2EtNGI0NS1hZjY0/LWM5ZDEzZGM5Zjg0/Ny5zdmc.png" 
              className="w-full max-w-[280px] drop-shadow-3xl"
              alt="Signup Illustration"
            />
          </motion.div>

          <p className="relative z-10 text-indigo-200/50 text-xs tracking-widest font-bold uppercase">
            © 2026 FinTrack Inc
          </p>
        </div>

        {/* RIGHT PANEL: Signup Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
              <p className="text-slate-500 font-medium text-sm">Join thousands of users managing wealth.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-slate-900" 
                    placeholder="Priyanka Sharma" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-slate-900" 
                    placeholder="name@example.com" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
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
                {loading ? "Creating Account..." : "Get Started →"}
              </button>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Or signup with</span>
            </div>

            <button className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <FcGoogle size={22} /> Google
            </button>

            <p className="mt-10 text-center text-slate-500 text-sm font-medium">
              Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}