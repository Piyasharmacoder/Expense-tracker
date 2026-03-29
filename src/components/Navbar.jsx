import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { motion } from "framer-motion";
import {
  FaChartPie,
  FaWallet,
  FaBook,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navLinks = [
    { to: "/", icon: <FaChartPie />, label: "Dashboard" },
    { to: "/income", icon: <FaWallet />, label: "Income" },
    { to: "/udhar", icon: <FaBook />, label: "Bahi Khata" },
    { to: "/about", icon: <FaInfoCircle />, label: "About" },
  ];

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
      isActive
        ? "text-indigo-600 bg-indigo-50/50"
        : "text-gray-500 hover:bg-gray-50 hover:text-indigo-500"
    }`;

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex h-screen w-72 bg-white/80 backdrop-blur-md border-r border-gray-100 p-6 flex-col justify-between sticky top-0">
        <div>
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
               <span className="text-white text-xl">💸</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              FinTrack
            </h1>
          </div>

          <nav className="space-y-2">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className={`text-xl ${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform`}>
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full group text-gray-500 hover:text-red-500 p-4 rounded-2xl hover:bg-red-50 transition-all duration-300"
        >
          <FaSignOutAlt className="group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">Logout</span>
        </button>
      </aside>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl flex items-center justify-around px-4 z-50">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-all ${
                isActive ? "text-indigo-600 -translate-y-1" : "text-gray-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl">{link.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                  {isActive ? link.label : ""}
                </span>
                {isActive && (
                   <motion.div layoutId="mobileTab" className="w-1 h-1 bg-indigo-600 rounded-full mt-1" />
                )}
              </>
            )}
          </NavLink>
        ))}
        <button onClick={handleLogout} className="text-gray-400 text-xl">
          <FaSignOutAlt />
        </button>
      </nav>
    </>
  );




  
}