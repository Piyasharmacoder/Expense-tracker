import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
} from "recharts";
import { FaChartLine, FaTrophy } from "react-icons/fa";

export default function IncomeChart({ income }) {
  // 📊 Convert data → Month-wise total
  const data = Object.values(
    income.reduce((acc, item) => {
      const month = new Date(item.date).toLocaleString("default", {
        month: "short",
      });

      if (!acc[month]) acc[month] = { month, amount: 0 };

      acc[month].amount += Number(item.amount);
      return acc;
    }, {})
  );

  // 🏆 Find highest month
  const highest = data.reduce(
    (max, item) => (item.amount > max.amount ? item : max),
    { amount: 0 }
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <FaChartLine />
          </div>
          <h3 className="text-base font-semibold text-gray-700">
            Monthly Income Trend
          </h3>
        </div>

        {/* 🏆 Highlight */}
        {highest.amount > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 px-4 py-2 rounded-xl text-sm">
            <FaTrophy className="text-yellow-500" />
            <span className="text-gray-700 font-medium">
              {highest.month}: ₹{highest.amount}
            </span>
          </div>
        )}

      </div>

      {/* 📈 GRAPH */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
            formatter={(value) => [`₹ ${value}`, "Income"]}
          />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, payload } = props;
              const isHighest = payload.month === highest.month;

              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHighest ? 8 : 5}
                  fill={isHighest ? "#facc15" : "#60a5fa"}
                  stroke={isHighest ? "#eab308" : "none"}
                />
              );
            }}
            activeDot={{ r: 8 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}