import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "../services/supabase";
import { 
  TrendingUp, TrendingDown, Wallet, PiggyBank, 
  Search, BrainCircuit, Plus, Edit3, Check, X, ArrowUpRight
} from "lucide-react";

// Components (Make sure these are also styled well)
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import ExpensePieChart from "../components/ExpensePieChart";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(() => Number(localStorage.getItem("user_income")) || 50000);
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
    const filtered = expenses.filter(exp => 
      exp.category?.toLowerCase().includes(search.toLowerCase())
    );
    const totalExpense = filtered.reduce((acc, item) => acc + Number(item.amount), 0);
    const balance = income - totalExpense;
    const savingsPercent = income > 0 ? Math.max(0, ((balance / income) * 100).toFixed(1)) : 0;
    
    const categoryMap = filtered.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";

    return { filtered, totalExpense, balance, savingsPercent, topCategory };
  }, [expenses, search, income]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F1F5F9] font-sans text-slate-900">
      
      {/* 🧭 NAVIGATION */}
      <Navbar />

      <main className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-[1600px] mx-auto overflow-hidden">
        
        {/* --- SECTION 1: TOP HEADER & INCOME --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Wealth Dashboard</h1>
            <p className="text-slate-500 font-medium">Analytics & Insights for your financial growth.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Income Card Mini */}
            <div className="w-full sm:w-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-2 flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                <Edit3 size={18} />
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
                    <button onClick={handleSaveIncome} className="text-emerald-500 hover:bg-emerald-50 p-1 rounded-lg transition"><Check size={18}/></button>
                    <button onClick={() => setIsEditingIncome(false)} className="text-rose-500 hover:bg-rose-50 p-1 rounded-lg transition"><X size={18}/></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingIncome(true)}>
                    <h2 className="text-xl font-black text-slate-800">₹{income.toLocaleString()}</h2>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 text-xs">Edit</span>
                  </div>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                placeholder="Search category..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm transition-all font-medium"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 2: THE BENTO STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Income" value={income} icon={<TrendingUp />} color="emerald" trend="+12% vs last month" />
          <StatCard title="Expenses" value={stats.totalExpense} icon={<TrendingDown />} color="rose" trend={`${((stats.totalExpense/income)*100).toFixed(0)}% of budget`} />
          <StatCard title="Net Balance" value={stats.balance} icon={<Wallet />} color="indigo" highlight={stats.balance < 0} />
          <StatCard title="Savings" value={`${stats.savingsPercent}%`} icon={<PiggyBank />} color="violet" trend="Health: Great" />
        </div>

        {/* --- SECTION 3: CHARTS & AI INSIGHTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Main Visualizer */}
<div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group min-h-[450px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800">Cash Flow Analytics</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 px-3 py-1 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Income
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 px-3 py-1 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div> Expense
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
               <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-6">Top Spending Split</h4>
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
       <h3 className="font-black text-slate-800 text-2xl tracking-tight">Log New Transaction</h3>
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
        <h3 className="font-black text-slate-800 text-2xl tracking-tight">Recent History</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing your latest activities</p>
      </div>
      <button className="px-5 py-2 rounded-xl bg-slate-50 text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100 uppercase tracking-widest">
        View All
      </button>
    </div>

    {/* Table Container with custom scroll if needed */}
    <div className="overflow-x-auto min-h-[400px]">
      <ExpenseList expenses={stats.filtered} fetchExpenses={fetchExpenses} />
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
    violet: "bg-violet-50 text-violet-600 border-violet-100"
  };

  const formattedValue = typeof value === 'number' ? `₹${value.toLocaleString()}` : value;

  return (
    <div className="bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-2xl transition-all group-hover:scale-110 duration-500 ${colors[color] || colors.indigo} border`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
            <ArrowUpRight size={12} /> {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.15em] mb-1">{title}</p>
        <h2 className={`text-3xl font-black tracking-tight ${highlight ? 'text-rose-500' : 'text-slate-900'}`}>{formattedValue}</h2>
      </div>
      
      {/* Abstract Background Shape */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${colors[color]}`}></div>
    </div>
  );
}