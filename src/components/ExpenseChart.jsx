import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine
} from "recharts";
import { CalendarDays, TrendingUp, AlertCircle } from "lucide-react";

export default function ExpenseChart({ expenses }) {
  const [view, setView] = useState("monthly"); // weekly, monthly, yearly

  // 🛠️ DATA LOGIC: Grouping expenses by Date
  const chartData = useMemo(() => {
    const groups = {};

    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      let label = "";

      if (view === "monthly") {
        label = date.toLocaleString("default", { month: "short" });
      } else if (view === "weekly") {
        label = `Week ${Math.ceil(date.getDate() / 7)}`;
      } else {
        label = date.getFullYear().toString();
      }

      groups[label] = (groups[label] || 0) + Number(exp.amount);
    });

    // Convert to Array and Sort
    return Object.keys(groups).map((key) => ({
      name: key,
      amount: groups[key],
    }));
  }, [expenses, view]);

  // 🏆 Analytics: Finding the Peak
  const peakData = useMemo(() => {
    if (chartData.length === 0) return { name: "N/A", amount: 0 };
    return chartData.reduce((max, p) => (p.amount > max.amount ? p : max), chartData[0]);
  }, [chartData]);

  return (
    <div className="w-full space-y-6">
      {/* --- TOP CONTROLS & ANALYTICS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {["weekly", "monthly", "yearly"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                view === v ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Highlight Card */}
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl">
          <AlertCircle className="text-rose-500" size={18} />
          <div>
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter leading-none">Peak Spending</p>
            <p className="text-sm font-black text-rose-700">{peakData.name}: ₹{peakData.amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* --- THE GRAPH --- */}
      <div className="h-[350px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid vertical={false} strokeDasharray="8 8" stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }} />

            {/* Peak Highlighter Line */}
            <ReferenceLine y={peakData.amount} stroke="#fb7185" strokeDasharray="3 3" label={{ position: 'right', value: 'Peak', fill: '#fb7185', fontSize: 10, fontWeight: 900 }} />

            <Area
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorAmt)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ✨ Premium Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-50 min-w-[120px]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timeline</p>
        <p className="text-sm font-bold text-slate-900 mb-2">{payload[0].payload.name}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <p className="text-lg font-black text-indigo-600">₹{payload[0].value.toLocaleString()}</p>
        </div>
      </div>
    );
  }
  return null;
};