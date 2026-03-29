import { useState } from "react";
import { supabase } from "../services/supabase";
import {
  FaMoneyBillWave,
  FaTag,
  FaStickyNote,
  FaPlus,
} from "react-icons/fa";

export default function IncomeForm({ fetchIncome }) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");

  const addIncome = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      alert("Please login first");
      return;
    }

    await supabase.from("incometracker").insert([
      {
        user_id: data.user.id,
        amount,
        source,
        date: new Date().toISOString(),
        note,
      },
    ]);

    setAmount("");
    setSource("");
    setNote("");

    fetchIncome();
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">

      {/* 🔥 TITLE */}
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        ➕ Add Income
      </h3>

      {/* 🔥 FORM */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* Amount */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-2 rounded-xl w-full focus-within:border-green-300 transition">
          <FaMoneyBillWave className="text-green-500" />
          <input
            placeholder="Salary ₹"
            className="bg-transparent outline-none w-full text-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Source */}
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl w-full focus-within:border-indigo-300 transition">
          <FaTag className="text-indigo-500" />
          <input
            placeholder="Source"
            className="bg-transparent outline-none w-full text-sm"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>

        {/* Note */}
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 px-3 py-2 rounded-xl w-full focus-within:border-yellow-300 transition">
          <FaStickyNote className="text-yellow-500" />
          <input
            placeholder="Note"
            className="bg-transparent outline-none w-full text-sm"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={addIncome}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 hover:scale-105 transition"
        >
          <FaPlus />
          Add
        </button>

      </div>

    </div>
  );
}