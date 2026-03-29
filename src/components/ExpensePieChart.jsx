import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, AlertCircle } from "lucide-react";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#F97316", "#0EA5E9"];

export default function ExpensePieChart({ expenses }) {
  const [timeFrame, setTimeFrame] = useState("month"); // 'week', 'month', 'year'

  // 🧠 Smart Filter & Analysis Logic
  const { data, total, topCategory } = useMemo(() => {
    const now = new Date();
    
    // Filter data based on timeFrame
    const filteredExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      if (timeFrame === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return expDate >= weekAgo;
      } else if (timeFrame === "month") {
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      } else {
        return expDate.getFullYear() === now.getFullYear();
      }
    });

    const groups = filteredExpenses.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = { name: item.category, value: 0 };
      acc[item.category].value += Number(item.amount);
      return acc;
    }, {});
    
    const dataArray = Object.values(groups).sort((a, b) => b.value - a.value);
    const totalVal = dataArray.reduce((sum, item) => sum + item.value, 0);
    const topCat = dataArray[0] || null;

    return { data: dataArray, total: totalVal, topCategory: topCat };
  }, [expenses, timeFrame]);

  return (
    <div className="w-full space-y-6">
      {/* 🗓 Time Frame Tabs */}
      <div className="flex bg-slate-100/50 p-1 rounded-2xl w-fit mx-auto md:mx-0">
        {["week", "month", "year"].map((t) => (
          <button
            key={t}
            onClick={() => setTimeFrame(t)}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              timeFrame === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {/* 🎨 PIE CHART */}
        <div className="relative h-[240px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={5}
                stroke="#ffffff"
                strokeWidth={2}
                label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
                className="outline-none"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
            <h4 className="text-xl font-black text-slate-800">₹{total.toLocaleString()}</h4>
          </div>
        </div>

        {/* 📋 ANALYTICS & INSIGHTS CARD */}
        {topCategory && (
          <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-3xl flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Top Leakage</p>
              <h5 className="text-sm font-black text-slate-800">
                {topCategory.name} <span className="text-slate-400 font-bold ml-1">({((topCategory.value / total) * 100).toFixed(0)}%)</span>
              </h5>
              <p className="text-[11px] text-slate-500 font-medium">You spent ₹{topCategory.value.toLocaleString()} here this {timeFrame}.</p>
            </div>
          </div>
        )}

  {/* 📋 SLEEK LEGEND LIST */}
        <div className="grid grid-cols-1 gap-2.5 px-1 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          {data.map((item, index) => {
            const percent = ((item.value / total) * 100).toFixed(0);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <p className="text-xs font-black text-slate-800 leading-none mb-1">{item.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {percent}% of spending
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block">
                    ₹{item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-50">
        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{payload[0].name}</p>
        <p className="text-sm font-black text-indigo-600">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};



