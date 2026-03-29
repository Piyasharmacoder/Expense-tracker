import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Plus, Trash2, Save, Layers, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpenseForm({ fetchExpenses }) {
  const [rows, setRows] = useState([
    { id: crypto.randomUUID(), amount: "", category: "", note: "" }
  ]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([
    "Mortgage / Rent", "Food", "Utilities", "Bills", "Shopping", 
    "Transportation", "Insurance", "Health Care", "Clothing", 
    "Traveling", "Fees", "Borrow", "Lend"
  ]);

  const getCategoryTheme = (cat) => {
    const themes = {
      "Food": "bg-emerald-50 text-emerald-600 border-emerald-100",
      "Shopping": "bg-pink-50 text-pink-600 border-pink-100",
      "Bills": "bg-rose-50 text-rose-600 border-rose-100",
      "Mortgage / Rent": "bg-indigo-50 text-indigo-600 border-indigo-100",
      "default": "bg-slate-50 text-slate-600 border-slate-100"
    };
    return themes[cat] || themes.default;
  };

  useEffect(() => {
    const saved = localStorage.getItem("custom_categories");
    if (saved) setCategories(JSON.parse(saved));
  }, []);

  const addRow = () => setRows([...rows, { id: crypto.randomUUID(), amount: "", category: "", note: "" }]);
  const removeRow = (id) => rows.length > 1 && setRows(rows.filter(row => row.id !== id));
  const updateRow = (id, field, value) => setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));

  const handleAddNewCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName)) {
      const updated = [...categories, newCategoryName.trim()];
      setCategories(updated);
      localStorage.setItem("custom_categories", JSON.stringify(updated));
      setNewCategoryName("");
      setIsAddingNew(false);
    }
  };

  const saveAllExpenses = async () => {
    try {
      setLoading(true);
      const validRows = rows.filter(r => r.amount && r.category);
      if (validRows.length === 0) return alert("Please fill amount and category.");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("Please login first.");

      const { error } = await supabase.from("expenses").insert(
        validRows.map(row => ({
          user_id: user.id,
          amount: Number(row.amount),
          category: row.category,
          date: new Date().toISOString(),
          note: row.note || "",
        }))
      );
      
      if (error) throw error;
      setRows([{ id: crypto.randomUUID(), amount: "", category: "", note: "" }]);
      fetchExpenses?.();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/80 p-5 md:p-6 rounded-[2rem] shadow-sm">
      
      {/* Compact Header */}
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-md shadow-indigo-100">
            <Layers className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Add Entry</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Transaction Batching</p>
          </div>
        </div>
        
        <button 
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-bold text-[11px] uppercase tracking-wider transition-all active:scale-95"
        >
          <Plus size={14} /> Add Row
        </button>
      </div>

      {/* Optimized Row Area */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {rows.map((row) => (
            <motion.div 
              key={row.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-[120px_180px_1fr_45px] gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 items-end group"
            >
              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 ml-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 focus:border-indigo-300 rounded-xl outline-none transition-all font-bold text-slate-700 text-sm"
                    placeholder="0"
                    value={row.amount}
                    onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 ml-1">Category</label>
                <select
                  className={`w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none font-bold text-xs cursor-pointer ${getCategoryTheme(row.category)}`}
                  value={row.category}
                  onChange={(e) => updateRow(row.id, "category", e.target.value)}
                >
                  <option value="">Select Type</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {/* Note */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 ml-1">Note</label>
                <input
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-300 rounded-xl outline-none text-xs font-medium"
                  placeholder="What was this for?"
                  value={row.note}
                  onChange={(e) => updateRow(row.id, "note", e.target.value)}
                />
              </div>

              {/* Delete */}
              <button 
                onClick={() => removeRow(row.id)}
                className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all mb-0.5 flex justify-center"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col md:flex-row gap-4 items-center border-t border-slate-100 pt-5">
        <div className="flex-1 w-full">
           {isAddingNew ? (
             <div className="flex gap-2">
                <input 
                  autoFocus
                  className="flex-1 px-4 py-2 bg-white border border-indigo-100 rounded-xl outline-none font-bold text-xs"
                  placeholder="New Category..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button onClick={handleAddNewCategory} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase">Add</button>
                <button onClick={() => setIsAddingNew(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><X size={16}/></button>
             </div>
           ) : (
             <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2 group ml-1">
               <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md group-hover:bg-indigo-600 group-hover:text-white transition-all"><Plus size={12}/></div>
               <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-indigo-600 transition-colors">New Category</span>
             </button>
           )}
        </div>

        <button 
          onClick={saveAllExpenses}
          disabled={loading}
          className={`w-full md:w-auto px-8 py-3 bg-emerald-700 text-white rounded-xl font-black text-sm shadow-lg shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          <span>Save {rows.length} {rows.length > 1 ? 'Entries' : 'Entry'}</span>
        </button>
      </div>
    </div>
  );
}