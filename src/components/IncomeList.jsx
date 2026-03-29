import { useState } from "react";
import { supabase } from "../services/supabase";
import {
  FaMoneyBillWave,
  FaTag,
  FaCalendarAlt,
  FaTrash,
  FaWallet,
  FaChartLine,
  FaStickyNote,
  FaSearch,
  FaEdit,
  FaDownload,
  FaSort,
  FaBell,
  FaLightbulb,
  FaCogs 

} from "react-icons/fa";

export default function IncomeList({ income, fetchIncome }) {
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const itemsPerPage = 5;

  // 🔍 FILTER
  const filtered = income.filter((item) =>
    `${item.source} ${item.note} ${item.amount}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 📊 SORT
  const sorted = [...filtered].sort((a, b) => {
    if (sortType === "amount") return b.amount - a.amount;
    if (sortType === "date")
      return new Date(b.date) - new Date(a.date);
    return 0;
  });

  // 📄 PAGINATION
  const start = (page - 1) * itemsPerPage;
  const paginated = sorted.slice(start, start + itemsPerPage);

  // 🧠 INSIGHT
  const topNote =
    filtered.length > 0
      ? filtered.reduce((a, b) => (a.amount > b.amount ? a : b)).note
      : "";

  // 🗑️ DELETE
  const deleteIncome = async (id) => {
    await supabase.from("incometracker").delete().eq("id", id);
    fetchIncome();
  };

  // ✏️ EDIT SAVE
  const saveEdit = async (id) => {
    await supabase
      .from("incometracker")
      .update({ amount: editAmount })
      .eq("id", id);

    setEditId(null);
    fetchIncome();
  };

  // 📥 EXPORT
  const exportCSV = () => {
    const csv = [
      ["Amount", "Source", "Note", "Date"],
      ...filtered.map((e) => [e.amount, e.source, e.note, e.date]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "income.csv";
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">


{/* 🔥 PREMIUM HEADER */}
<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">

  {/* LEFT */}
  <div className="flex items-center gap-4">

    {/* Icon */}
    <div className="relative group">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 text-white shadow-lg group-hover:scale-105 transition">
        <FaWallet size={22} />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-green-400 blur-xl opacity-20 group-hover:opacity-40 transition"></div>
    </div>

    {/* Title */}
    <div>
      <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
        Income Records
      </h3>

      <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        Real-time income tracking
      </p>
    </div>

  </div>

  {/* RIGHT */}
  <div className="flex flex-wrap items-center gap-4">

    {/*  DATE CARD */}
<div className="group bg-gradient-to-br from-blue-50/70 to-white/60 backdrop-blur-md border border-blue-100 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300">

  {/* Icon */}
  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition">
    <FaCalendarAlt />
  </div>

  {/* Text */}
  <div>
    <p className="text-sm font-medium text-gray-500">Today</p>
    <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition">
      {new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </p>
  </div>

</div>

    {/* 📊 TOTAL CARD */}
    <div className="group bg-gradient-to-br from-green-50 to-white border border-green-100 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition">

      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:scale-110 transition">
        <FaChartLine />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Total Entries</p>
        <p className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition">
          {filtered.length}
        </p>
      </div>
    </div>

    {/* 💡 INSIGHT */}
    <div className="group bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition">

      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 group-hover:scale-110 transition">
        💡
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Insight</p>
        <p className="text-sm font-semibold text-gray-700">
          {filtered.length > 0
            ? `₹${Math.max(...filtered.map(i => i.amount))} highest`
            : "No data"}
        </p>
      </div>
    </div>

  </div>

</div>



{/* 🔥 SEARCH + ACTION */}
<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-6">

  {/* 🔍 SEARCH */}
  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl w-full md:w-[480px] shadow-sm focus-within:border-indigo-300 transition">

    <FaSearch className="text-gray-400" />

    <input
      placeholder="Search income..."
      className="outline-none w-full bg-transparent text-sm"
      onChange={(e) => setSearch(e.target.value)}
    />

  </div>

  {/* 🎯 BUTTONS */}
  <div className="flex flex-wrap gap-3">

    {/* Sort Amount */}
    <button
      onClick={() => setSortType("amount")}
      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-100 text-indigo-600 font-medium hover:bg-indigo-200 hover:scale-105 transition"
    >
      <FaSort />
      Sort Amount
    </button>

    {/* Sort Date */}
    <button
      onClick={() => setSortType("date")}
      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-100 text-purple-600 font-medium hover:bg-purple-200 hover:scale-105 transition"
    >
      <FaSort />
      Sort Date
    </button>

    {/* Export */}
    <button
      onClick={exportCSV}
      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-100 text-green-600 font-medium hover:bg-green-200 hover:scale-105 transition"
    >
      <FaDownload />
      Export CSV
    </button>

  </div>

</div>

{/* 🧠 INSIGHT */}
{topNote && (
  <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-xl mb-4 shadow-sm">

    <FaLightbulb className="text-indigo-500 text-lg" />

    <div>
      <p className="text-xs text-gray-400">Smart Insight</p>
      <p className="text-sm font-semibold text-gray-700">
        Highest income note: <span className="text-indigo-600">{topNote}</span>
      </p>
    </div>

  </div>
)}

      {/* 🔥 TABLE */}
      <div className="overflow-x-auto">
<table className="w-full text-sm border-separate border-spacing-y-2">

  {/* 🔥 GREEN PREMIUM HEADER */}
  <thead>
    <tr className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 rounded-2xl shadow-sm">

      {/* Amount */}
      <th className="p-4 text-left first:rounded-l-2xl">
        <div className="flex items-center gap-3 text-gray-700 font-semibold text-[15px] group cursor-pointer transition">

          <div className="p-2 rounded-xl bg-green-200 text-green-700 group-hover:scale-110 transition duration-300">
            <FaMoneyBillWave />
          </div>

          <span className="group-hover:text-green-700 transition">
            Amount
          </span>

        </div>
      </th>

      {/* Source */}
      <th className="p-4 text-left">
        <div className="flex items-center gap-3 text-gray-700 font-semibold text-[15px] group cursor-pointer transition">

          <div className="p-2 rounded-xl bg-green-100 text-green-600 group-hover:scale-110 transition duration-300">
            <FaTag />
          </div>

          <span className="group-hover:text-green-700 transition">
            Source
          </span>

        </div>
      </th>

      {/* Note */}
      <th className="p-4 text-left hidden sm:table-cell">
        <div className="flex items-center gap-3 text-gray-700 font-semibold text-[15px] group cursor-pointer transition">

          <div className="p-2 rounded-xl bg-green-100 text-green-500 group-hover:scale-110 transition duration-300">
            <FaStickyNote />
          </div>

          <span className="group-hover:text-green-700 transition">
            Note
          </span>

        </div>
      </th>

      {/* Date */}
      <th className="p-4 text-left hidden md:table-cell">
        <div className="flex items-center gap-3 text-gray-700 font-semibold text-[15px] group cursor-pointer transition">

          <div className="p-2 rounded-xl bg-green-100 text-green-600 group-hover:scale-110 transition duration-300">
            <FaCalendarAlt />
          </div>

          <span className="group-hover:text-green-700 transition">
            Date
          </span>

        </div>
      </th>

      {/* Action */}
      <th className="p-4 text-center last:rounded-r-2xl">
        <div className="flex items-center justify-center gap-3 text-gray-700 font-semibold text-[15px] group cursor-pointer transition">

          <div className="p-2 rounded-xl bg-green-100 text-green-600 group-hover:scale-110 transition duration-300">
            <FaCogs />
          </div>

          <span className="group-hover:text-green-700 transition">
            Action
          </span>

        </div>
      </th>

    </tr>
  </thead>
          <tbody>
            {paginated.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">

                {/* Amount */}
                <td className="p-3 text-green-600 font-semibold">
                  {editId === item.id ? (
                    <input
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    `₹ ${item.amount}`
                  )}
                </td>

                {/* Source */}
                <td className="p-3">
                  <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs">
                    {item.source}
                  </span>
                </td>

                {/* Note */}
                <td className="p-3 text-gray-500">
                  {item.note || "—"}
                </td>

                {/* Date */}
                <td className="p-3 text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </td>

                {/* Action */}
                <td className="p-3 flex gap-2 justify-center">

                  {editId === item.id ? (
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="text-green-500"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditId(item.id);
                        setEditAmount(item.amount);
                      }}
                      className="text-blue-500"
                    >
                      <FaEdit />
                    </button>
                  )}

                  <button
                    onClick={() => deleteIncome(item.id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* 📄 PAGINATION */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="border px-3 py-1 rounded"
        >
          Prev
        </button>

        <span>{page}</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={start + itemsPerPage >= sorted.length}
          className="border px-3 py-1 rounded"
        >
          Next
        </button>
      </div>

    </div>
  );
}