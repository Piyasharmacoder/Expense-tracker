import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

import IncomeForm from "../components/IncomeForm";
import IncomeList from "../components/IncomeList";
import IncomeChart from "../components/IncomeChart";
import IncomePieChart from "../components/IncomePieChart";
import Navbar from "../components/Navbar";

import { FaWallet, FaCalendarAlt, FaChartLine } from "react-icons/fa";

export default function Income() {
  const [income, setIncome] = useState([]);

  // 🔥 Fetch function
  const fetchIncome = async () => {
    const { data, error } = await supabase.from("incometracker").select("*");

    if (error) {
      console.log(error);
    } else {
      setIncome(data || []);
    }
  };

  // ✅ FIXED useEffect (NO ERROR NOW)
  useEffect(() => {
    let mounted = true;

    const loadIncome = async () => {
      const { data, error } = await supabase.from("incometracker").select("*");

      if (!mounted) return;

      if (error) {
        console.log(error);
      } else {
        setIncome(data || []);
      }
    };

    loadIncome();

    return () => {
      mounted = false;
    };
  }, []);

  // 💰 Totals
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTotal = income
    .filter(
      (i) =>
        new Date(i.date).getMonth() === currentMonth &&
        new Date(i.date).getFullYear() === currentYear,
    )
    .reduce((a, b) => a + Number(b.amount), 0);

  const yearlyTotal = income
    .filter((i) => new Date(i.date).getFullYear() === currentYear)
    .reduce((a, b) => a + Number(b.amount), 0);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* ✅ NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <div className="flex-1 p-6">
        <div className="relative group max-w-fit flex items-center gap-6 mb-10 p-4 pr-10 rounded-[2.5rem] transition-all duration-500 hover:bg-white/60 hover:backdrop-blur-xl border border-transparent hover:border-white/50 hover:shadow-[0_20px_50px_rgba(16,185,129,0.05)]">
          {/* Left: Icon with Multi-layer Glow */}
          <div className="relative">
            {/* Inner Glow Background */}
            <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

            <div className="relative p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-200/50 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
              <FaWallet size={24} className="filter drop-shadow-md" />
            </div>

            {/* Floating Micro-Badge (Live Indicator) */}
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-white rounded-full flex items-center justify-center shadow-sm">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="space-y-0.5">
            {/* Premium Label */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70">
                Revenue Center
              </span>
              <div className="h-[1px] w-8 bg-emerald-100/50" />
            </div>

            {/* Main Title with Gradient Effect */}
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
              Income{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                Dashboard
              </span>
            </h1>

            {/* Subtext with Insight Icon */}
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-[13px] text-slate-400 font-medium">
                Track your earnings &{" "}
                <span className="text-emerald-600 font-bold border-b border-emerald-100 group-hover:border-emerald-500 transition-all">
                  growth
                </span>
              </p>

              {/* Subtle Growth Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-500 animate-bounce"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </div>
          </div>

          {/* Invisible Vertical Accent - only shows on hover */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
            <div className="h-12 w-[1.5px] bg-gradient-to-b from-transparent via-emerald-100 to-transparent" />
          </div>
        </div>

<div className="grid md:grid-cols-2 gap-6 mb-8">
  
  {/* Monthly Card - Sea Green Theme */}
  <div className="group relative bg-[#ECFDF5] border border-emerald-100 rounded-[22px] p-5 flex items-center justify-between hover:bg-emerald-100/80 hover:border-emerald-200 transition-all duration-300 cursor-default shadow-sm hover:shadow-emerald-200/20">
    
    {/* Content Row */}
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-white/80 rounded-lg text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
          <FaCalendarAlt size={12} />
        </div>
        <p className="text-[11px] font-black text-emerald-700/70 uppercase tracking-[0.15em]">
          This Month
        </p>
      </div>
      
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
        ₹{monthlyTotal.toLocaleString()}
      </h2>
    </div>

    {/* Modern Icon Badge */}
    <div className="h-12 w-12 rounded-2xl bg-white/60 border border-white flex items-center justify-center text-emerald-500/40 group-hover:text-emerald-600 group-hover:bg-white group-hover:shadow-md transition-all duration-300 group-hover:rotate-6">
      <FaWallet size={20} />
    </div>
  </div>

  {/* Yearly Card - Indigo Theme */}
  <div className="group relative bg-[#EEF2FF] border border-indigo-100 rounded-[22px] p-5 flex items-center justify-between hover:bg-indigo-100/80 hover:border-indigo-200 transition-all duration-300 cursor-default shadow-sm hover:shadow-indigo-200/20">
    
    {/* Content Row */}
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-white/80 rounded-lg text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <FaChartLine size={12} />
        </div>
        <p className="text-[11px] font-black text-indigo-700/70 uppercase tracking-[0.15em]">
          This Year
        </p>
      </div>
      
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
        ₹{yearlyTotal.toLocaleString()}
      </h2>
    </div>

    {/* Modern Icon Badge */}
    <div className="h-12 w-12 rounded-2xl bg-white/60 border border-white flex items-center justify-center text-indigo-500/40 group-hover:text-indigo-600 group-hover:bg-white group-hover:shadow-md transition-all duration-300 group-hover:rotate-6">
      <FaChartLine size={20} />
    </div>
  </div>

</div>
        {/* 📊 CHARTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <IncomeChart income={income} />
          <IncomePieChart income={income} />
        </div>

        {/* ➕ FORM */}
        <div className="mb-8">
          <IncomeForm fetchIncome={fetchIncome} />
        </div>

        {/* 📋 TABLE */}
        <IncomeList income={income} fetchIncome={fetchIncome} />
      </div>
    </div>
  );
}
