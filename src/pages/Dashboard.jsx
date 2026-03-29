import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "../services/supabase";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Search,
  BrainCircuit,
  Plus,
  Edit3,
  Check,
  X,
  ArrowUpRight,
  Settings,
} from "lucide-react";

// Components (Make sure these are also styled well)
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import ExpensePieChart from "../components/ExpensePieChart";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(
    () => Number(localStorage.getItem("user_income")) || 50000,
  );
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(income);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // Loading state added

  // ✅ FIX: useCallback ensures the function is memoized and doesn't change on every render
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIX: Now this effect only runs ONCE when the component mounts
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSaveIncome = () => {
    setIncome(tempIncome);
    localStorage.setItem("user_income", tempIncome);
    setIsEditingIncome(false);
  };

  // 🧠 AI & Analytics Engine
  const stats = useMemo(() => {
    const filtered = expenses.filter((exp) =>
      exp.category?.toLowerCase().includes(search.toLowerCase()),
    );
    const totalExpense = filtered.reduce(
      (acc, item) => acc + Number(item.amount),
      0,
    );
    const balance = income - totalExpense;
    const savingsPercent =
      income > 0 ? Math.max(0, ((balance / income) * 100).toFixed(1)) : 0;

    const categoryMap = filtered.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});
    const topCategory =
      Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "General";

    return { filtered, totalExpense, balance, savingsPercent, topCategory };
  }, [expenses, search, income]);


  const [user, setUser] = useState(null);

useEffect(() => {
  const getUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser({
        // Yahan 'name' wahi hai jo aapne Signup form mein 'options.data' mein bheja tha
        name: user.user_metadata.name, 
        email: user.email
      });
    }
  };
  getUserData();
}, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F1F5F9] font-sans text-slate-900">
      {/* 🧭 NAVIGATION */}
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-[1600px] mx-auto overflow-hidden">
       {/* --- SECTION 1: TOP HEADER & USER PROFILE (Full Width Row) --- */}
<div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
  
  {/* Left: Wealth Dashboard Info */}
  <div className="relative group max-w-fit px-5 py-4 rounded-2xl transition-all duration-500 hover:bg-white/40 hover:backdrop-blur-md border border-transparent hover:border-white/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-gradient-to-b from-emerald-400 to-cyan-500 rounded-full opacity-40 group-hover:h-12 group-hover:opacity-100 transition-all duration-500" />
    
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
          Real-time Insights
        </span>
      </div>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600">
          Wealth Dashboard
        </h1>
        <div className="p-1 rounded-md bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:rotate-12 transition-all duration-500 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        </div>
      </div>

      <p className="text-[13px] text-slate-500 font-medium leading-tight">
        Analytics & Insights for your <span className="relative inline-block text-emerald-600 font-bold group-hover:text-emerald-600 transition-colors">financial growth<span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-emerald-500 group-hover:w-full transition-all duration-500 delay-100"></span></span>
      </p>
    </div>
  </div>

  {/* Right: User Profile Section */}
  <div className="w-full md:w-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-2 flex items-center gap-3 group hover:border-indigo-500/30 transition-all duration-300">
    <div className="relative">
      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner uppercase">
        {user?.name ? user.name.charAt(0) : "U"}
      </div>
      <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>
    </div>
    <div className="pr-4 min-w-[120px]">
      <div className="flex items-center gap-1">
        <p className="text-sm font-black text-slate-800 leading-tight truncate max-w-[120px]">
          {user?.name || "Guest User"}
        </p>
        <div className="bg-indigo-50 rounded-full p-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
      </div>
      <p className="text-[10px] font-semibold text-slate-400 truncate max-w-[140px]">
        {user?.email || "loading..."}
      </p>
    </div>
    <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors">
      <Settings size={16} />
    </button>
  </div>
</div>

{/* --- SECTION 2: SEARCH & BUDGET (Second Row) --- */}
<div className="flex flex-col md:flex-row items-center gap-4 mb-10">
  {/* Search Bar */}
  <div className="relative w-full md:flex-1 group">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
    <input
      placeholder="Search transactions or categories..."
      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm transition-all font-medium text-sm"
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {/* Monthly Budget Card */}
  <div className="w-full md:w-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-2 flex items-center gap-4">
    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
      <Edit3 size={16} />
    </div>
    <div className="pr-4">
      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none mb-1">Monthly Budget</p>
      {isEditingIncome ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-24 bg-slate-50 border-none focus:ring-0 font-bold p-0 text-lg"
            value={tempIncome}
            onChange={(e) => setTempIncome(Number(e.target.value))}
            autoFocus
          />
          <button onClick={handleSaveIncome} className="text-emerald-500 hover:bg-emerald-50 p-1 rounded-lg transition"><Check size={18} /></button>
          <button onClick={() => setIsEditingIncome(false)} className="text-rose-500 hover:bg-rose-50 p-1 rounded-lg transition"><X size={18} /></button>
        </div>
      ) : (
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingIncome(true)}>
          <h2 className="text-xl font-black text-slate-800">₹{income.toLocaleString()}</h2>
          <span className="px-2 py-0.5 bg-indigo-50 rounded-lg text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
        </div>
      )}
    </div>
  </div>
</div>

        {/* --- SECTION 2: THE BENTO STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Income"
            value={income}
            icon={<TrendingUp />}
            color="emerald"
            trend="+12% vs last month"
          />
          <StatCard
            title="Expenses"
            value={stats.totalExpense}
            icon={<TrendingDown />}
            color="rose"
            trend={`${((stats.totalExpense / income) * 100).toFixed(0)}% of budget`}
          />
          <StatCard
            title="Net Balance"
            value={stats.balance}
            icon={<Wallet />}
            color="indigo"
            highlight={stats.balance < 0}
          />
          <StatCard
            title="Savings"
            value={`${stats.savingsPercent}%`}
            icon={<PiggyBank />}
            color="violet"
            trend="Health: Great"
          />
        </div>

        {/* --- SECTION 3: CHARTS & AI INSIGHTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Main Visualizer */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group min-h-[450px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800">
                Cash Flow Analytics
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 px-3 py-1 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>{" "}
                  Income
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 px-3 py-1 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>{" "}
                  Expense
                </div>
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ExpenseChart expenses={stats.filtered} />
            </div>
          </div>

          {/* AI Intelligence Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pie Chart Box  */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-6">
                Top Spending Split
              </h4>
              <ExpensePieChart expenses={stats.filtered} />
            </div>
          </div>
        </div>

        {/* --- SECTION 4: TRANSACTIONS & HISTORY (Stacked Layout) --- */}
        <div className="flex flex-col gap-10">
          {/* 📝 Full Width Transaction Form */}
          <div className="w-full bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                <Plus size={20} strokeWidth={3} />
              </div>
              <h3 className="font-black text-slate-800 text-2xl tracking-tight">
                Log New Transaction
              </h3>
            </div>

            {/* Form ko full width aur better spacing dene ke liye container */}
            <div className="max-w-full">
              <ExpenseForm fetchExpenses={fetchExpenses} />
            </div>

            {/* Subtle Background Detail */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-bl-[5rem] -z-0"></div>
          </div>

          {/* 📜 Full Width History Table */}
          <div className="w-full bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="font-black text-slate-800 text-2xl tracking-tight">
                  Recent History
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Showing your latest activities
                </p>
              </div>
              <button className="px-5 py-2 rounded-xl bg-slate-50 text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100 uppercase tracking-widest">
                View All
              </button>
            </div>

            {/* Table Container with custom scroll if needed */}
            <div className="overflow-x-auto min-h-[400px]">
              <ExpenseList
                expenses={stats.filtered}
                fetchExpenses={fetchExpenses}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 💎 REUSABLE UI COMPONENTS
function StatCard({ title, value, icon, color, trend, highlight }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
  };

  const formattedValue =
    typeof value === "number" ? `₹${value.toLocaleString()}` : value;

  return (
    <div className="bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div
          className={`p-4 rounded-2xl transition-all group-hover:scale-110 duration-500 ${colors[color] || colors.indigo} border`}
        >
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
            <ArrowUpRight size={12} /> {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.15em] mb-1">
          {title}
        </p>
        <h2
          className={`text-3xl font-black tracking-tight ${highlight ? "text-rose-500" : "text-slate-900"}`}
        >
          {formattedValue}
        </h2>
      </div>

      {/* Abstract Background Shape */}
      <div
        className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${colors[color]}`}
      ></div>
    </div>
  );
}
