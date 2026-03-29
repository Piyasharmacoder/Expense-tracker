import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { 
  Pencil, Trash2, Search, Calendar, IndianRupee, 
  Tag, ClipboardList, ChevronLeft, ChevronRight, X,
  Home, Utensils, Zap, Receipt, ShoppingBag, Car, 
  ShieldCheck, HeartPulse, Shirt, Plane, GraduationCap, 
  ArrowDownLeft, ArrowUpRight
} from "lucide-react";

// 1. All Categories Array
const ALL_CATEGORIES = [
  "Mortgage / Rent", "Food", "Utilities", "Bills", "Shopping", 
  "Transportation", "Insurance", "Health Care", "Clothing", 
  "Traveling", "Fees", "Borrow", "Lend"
];

export default function ExpenseList({ expenses, fetchExpenses }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpense, setEditingExpense] = useState(null);
  const itemsPerPage = 10;

  // 2. Enhanced Pastel Glassmorphism Colors
  const getCategoryStyles = (category) => {
    const styles = {
      "Mortgage / Rent": "bg-indigo-100/80 text-indigo-600 border-indigo-200",
      "Food": "bg-emerald-100/80 text-emerald-600 border-emerald-200",
      "Utilities": "bg-amber-100/80 text-amber-600 border-amber-200",
      "Bills": "bg-rose-100/80 text-rose-600 border-rose-200",
      "Shopping": "bg-pink-100/80 text-pink-600 border-pink-200",
      "Transportation": "bg-blue-100/80 text-blue-600 border-blue-200",
      "Insurance": "bg-cyan-100/80 text-cyan-600 border-cyan-200",
      "Health Care": "bg-red-100/80 text-red-600 border-red-200",
      "Clothing": "bg-purple-100/80 text-purple-600 border-purple-200",
      "Traveling": "bg-sky-100/80 text-sky-600 border-sky-200",
      "Fees": "bg-violet-100/80 text-violet-600 border-violet-200",
      "Borrow": "bg-orange-100/80 text-orange-600 border-orange-200",
      "Lend": "bg-teal-100/80 text-teal-600 border-teal-200",
    };
    return styles[category] || "bg-slate-100 text-slate-600 border-slate-200";
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      await supabase.from("expenses").delete().eq("id", id);
      fetchExpenses();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { id, amount, category, date, note } = editingExpense;
    await supabase.from("expenses").update({ amount, category, date, note }).eq("id", id);
    setEditingExpense(null);
    fetchExpenses();
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || exp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const currentData = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full transition-all duration-500">
      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Search transactions..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-white shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-5 py-3 rounded-2xl bg-white border border-slate-100 text-sm font-medium outline-none shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer"
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">Show All Categories</option>
          {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Modern Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-emerald-700/70 text-[11px] uppercase tracking-[0.2em] font-black">
              <th className="px-6 py-4 text-left bg-emerald-50/50 rounded-l-2xl border-y border-l border-emerald-100/50">
                <span className="flex items-center gap-2"><IndianRupee size={14} className="text-emerald-500"/> Amount</span>
              </th>
              <th className="px-6 py-4 text-left bg-emerald-50/50 border-y border-emerald-100/50">
                <span className="flex items-center gap-2"><Tag size={14} className="text-emerald-500"/> Category</span>
              </th>
              <th className="px-6 py-4 text-left bg-emerald-50/50 border-y border-emerald-100/50">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-emerald-500"/> Date</span>
              </th>
              <th className="px-6 py-4 text-left bg-emerald-50/50 border-y border-emerald-100/50">
                <span className="flex items-center gap-2"><ClipboardList size={14} className="text-emerald-500"/> Notes</span>
              </th>
              <th className="px-6 py-4 text-center bg-emerald-50/50 rounded-r-2xl border-y border-r border-emerald-100/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((exp) => (
              <tr key={exp.id} className="group bg-white hover:shadow-2xl hover:shadow-indigo-100/40 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
                <td className="px-6 py-5 font-bold text-slate-800 rounded-l-2xl border-y border-l border-slate-50">₹{exp.amount}</td>
                <td className="px-6 py-5 border-y border-slate-50">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm transition-all ${getCategoryStyles(exp.category)}`}>
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-400 text-xs font-medium border-y border-slate-50">{new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td className="px-6 py-5 text-slate-500 text-sm border-y border-slate-50 max-w-[200px] truncate">{exp.note || "—"}</td>
                <td className="px-6 py-5 text-center rounded-r-2xl border-y border-r border-slate-50">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setEditingExpense(exp)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:rotate-12 transition-all shadow-sm">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteExpense(exp.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white hover:-rotate-12 transition-all shadow-sm">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between px-4 py-4 bg-slate-50/50 rounded-3xl border border-slate-100">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages || 1}</p>
        <div className="flex gap-3">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"><ChevronLeft size={18}/></button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"><ChevronRight size={18}/></button>
        </div>
      </div>

      {/* Glassmorphism Edit Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] p-10 w-full max-w-lg shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] border border-white animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Edit Entry</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modify your transaction details</p>
              </div>
              <button onClick={() => setEditingExpense(null)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase ml-3 tracking-widest">Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-5 top-4.5 text-indigo-500" size={20} />
                  <input type="number" value={editingExpense.amount} onChange={(e) => setEditingExpense({...editingExpense, amount: e.target.value})} className="w-full p-5 pl-12 rounded-[1.5rem] bg-slate-100/50 border-2 border-transparent focus:border-indigo-400 focus:bg-white outline-none font-black text-xl text-slate-800 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-3 tracking-widest">Category</label>
                  <select value={editingExpense.category} onChange={(e) => setEditingExpense({...editingExpense, category: e.target.value})} className="w-full p-5 rounded-[1.5rem] bg-slate-100/50 border-2 border-transparent focus:border-indigo-400 focus:bg-white outline-none font-bold text-sm transition-all appearance-none">
                    {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-3 tracking-widest">Date</label>
                  <input type="date" value={editingExpense.date} onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})} className="w-full p-5 rounded-[1.5rem] bg-slate-100/50 border-2 border-transparent focus:border-indigo-400 focus:bg-white outline-none font-bold text-sm transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase ml-3 tracking-widest">Notes</label>
                <textarea rows="3" value={editingExpense.note} onChange={(e) => setEditingExpense({...editingExpense, note: e.target.value})} className="w-full p-5 rounded-[1.5rem] bg-slate-100/50 border-2 border-transparent focus:border-indigo-400 focus:bg-white outline-none text-sm transition-all" placeholder="What was this for?" />
              </div>

              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}