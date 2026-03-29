import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

import IncomeForm from "../components/IncomeForm";
import IncomeList from "../components/IncomeList";
import IncomeChart from "../components/IncomeChart";
import IncomePieChart from "../components/IncomePieChart";
import Navbar from "../components/Navbar";

import {
  FaWallet,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

export default function Income() {
  const [income, setIncome] = useState([]);

  // 🔥 Fetch function
  const fetchIncome = async () => {
    const { data, error } = await supabase
      .from("incometracker")
      .select("*");

    if (error) {
      console.log(error);
    } else {
      setIncome(data || []);
    }
  };

  // ✅ FIXED useEffect (NO ERROR NOW)
  useEffect(() => {
    let mounted = true;

    const loadIncome = async () => {
      const { data, error } = await supabase
        .from("incometracker")
        .select("*");

      if (!mounted) return;

      if (error) {
        console.log(error);
      } else {
        setIncome(data || []);
      }
    };

    loadIncome();

    return () => {
      mounted = false;
    };
  }, []);

  // 💰 Totals
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTotal = income
    .filter(
      (i) =>
        new Date(i.date).getMonth() === currentMonth &&
        new Date(i.date).getFullYear() === currentYear
    )
    .reduce((a, b) => a + Number(b.amount), 0);

  const yearlyTotal = income
    .filter((i) => new Date(i.date).getFullYear() === currentYear)
    .reduce((a, b) => a + Number(b.amount), 0);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">

      {/* ✅ NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* 🔥 HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl shadow-sm">
            <FaWallet />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Income Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Track your earnings & growth
            </p>
          </div>
        </div>

        {/* 💰 CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* Monthly */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md hover:scale-[1.02] transition">

            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FaCalendarAlt className="text-green-500" />
                This Month
              </p>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">
                ₹ {monthlyTotal}
              </h2>
            </div>

            <div className="text-4xl text-green-300">💰</div>
          </div>

          {/* Yearly */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md hover:scale-[1.02] transition">

            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                This Year
              </p>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">
                ₹ {yearlyTotal}
              </h2>
            </div>

            <div className="text-4xl text-blue-300">📈</div>
          </div>

        </div>

        {/* 📊 CHARTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <IncomeChart income={income} />
          <IncomePieChart income={income} />
        </div>

        {/* ➕ FORM */}
        <div className="mb-8">
          <IncomeForm fetchIncome={fetchIncome} />
        </div>

        {/* 📋 TABLE */}
        <IncomeList income={income} fetchIncome={fetchIncome} />

      </div>
    </div>
  );
}