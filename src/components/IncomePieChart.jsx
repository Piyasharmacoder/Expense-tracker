import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaChartPie, FaLightbulb } from "react-icons/fa";

const COLORS = [
  "#93c5fd", // blue
  "#86efac", // green
  "#fde68a", // yellow
  "#fca5a5", // red
  "#df8921", // purple
  "#4d13bf98", // pink
  "#9e145b", // rose
];

export default function IncomePieChart({ income }) {
  // 📊 Convert data → Source wise
  const data = Object.values(
    income.reduce((acc, item) => {
      if (!acc[item.source]) {
        acc[item.source] = { name: item.source, value: 0 };
      }
      acc[item.source].value += Number(item.amount);
      return acc;
    }, {})
  );

  // 🧠 Find highest source
  const topSource = data.reduce(
    (max, item) => (item.value > max.value ? item : max),
    { value: 0 }
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">

        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <FaChartPie />
          </div>
          <h3 className="text-base font-semibold text-gray-700">
            Income Sources
          </h3>
        </div>

        {/* 🧠 Insight */}
        {topSource.value > 0 && (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl text-sm">
            <FaLightbulb className="text-indigo-500" />
            <span className="text-gray-700">
              Top: <b>{topSource.name}</b>
            </span>
          </div>
        )}

      </div>

      {/* 📊 PIE CHART */}
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            innerRadius={50} // donut effect 🔥
            paddingAngle={4}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
            formatter={(value) => [`₹ ${value}`, "Income"]}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
          />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}