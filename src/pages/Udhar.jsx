import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import Navbar from "../components/Navbar";
import { 
  FaUser, FaSearch, FaFilter, FaTrash, FaCheckCircle, 
  FaClock, FaCalendarDay, FaEdit, FaTimes, FaSave , FaChevronDown
} from "react-icons/fa";

export default function Udhar() {
  const [data, setData] = useState([]);
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("given");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("Pending Amount");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const inputStyle = "w-full p-3 bg-[#F8FAFC] border-[1.5px] border-[#F1F5F9] rounded-2xl outline-none font-semibold text-[#1E293B] focus:bg-white focus:border-indigo-300 transition-all placeholder:text-[#94A3B8]";

  useEffect(() => {
    fetchUdhar();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUdhar = async () => {
    const { data: udharData, error } = await supabase.from("transactions_udhar").select("*").order("created_at", { ascending: false });
    if (!error) setData(udharData || []);
  };

  const addUdhar = async () => {
    if (!person || !amount) return alert("Please fill Name and Amount");
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("transactions_udhar").insert([{
      user_id: userData.user.id, person_name: person, amount: parseFloat(amount), type, note, date, status
    }]);
    if (!error) { setPerson(""); setAmount(""); setNote(""); fetchUdhar(); }
  };



// ✅ QUICK STATUS UPDATE (Table ke andar se)
  const quickUpdateStatus = async (id, newStatus) => {
    await supabase.from("transactions_udhar").update({ status: newStatus }).eq("id", id);
    fetchUdhar();
  };

  const deleteEntry = async (id) => {
    if(window.confirm("Are you sure?")) {
      await supabase.from("transactions_udhar").delete().eq("id", id);
      fetchUdhar();
    }
  };

  // --- EDIT LOGIC ---
  const openEditModal = (item) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("transactions_udhar")
      .update({
        person_name: editingItem.person_name,
        amount: parseFloat(editingItem.amount),
        type: editingItem.type,
        date: editingItem.date,
        status: editingItem.status,
        note: editingItem.note
      })
      .eq("id", editingItem.id);

    if (!error) {
      setIsEditModalOpen(false);
      fetchUdhar();
    } else {
      alert(error.message);
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.person_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesStatus && (!filterDate || item.date === filterDate);
  });

  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="flex-1 p-4 md:p-8 lg:p-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
  
  {/* Left Side: Title & Tagline */}
  <div className="relative pl-6 group">
    {/* Dynamic Vertical Accent Line */}
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-indigo-500 to-emerald-400 rounded-full group-hover:h-14 transition-all duration-500" />
    
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-600 uppercase tracking-widest border border-emerald-100/50">
          Digital Ledger
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
        <span className="filter drop-shadow-sm">📒</span> 
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900">
          Bahi Khata
        </span>
      </h1>
      <p className="text-sm md:text-base text-slate-500 font-medium flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-slate-200"></span>
        Professional Transaction Management
      </p>
    </div>
  </div>

  {/* Right Side: Smart Glass Clock & Date */}
  <div className="w-full md:w-auto relative group">
    {/* Subtle Background Glow */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-[28px] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
    
    <div className="relative flex items-center gap-6 px-8 py-5 bg-white/70 backdrop-blur-xl border border-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      
      {/* Time Section */}
      <div className="flex flex-col items-center md:items-start">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Current Time</span>
        <div className="flex items-center gap-2.5 text-indigo-600 font-black text-xl tracking-tight">
          <div className="p-1.5 bg-indigo-50 rounded-lg">
            <FaClock className="text-sm" />
          </div>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Elegant Vertical Divider */}
      <div className="h-10 w-[1.5px] bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

      {/* Date Section */}
      <div className="flex flex-col items-center md:items-start">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Today</span>
        <div className="flex items-center gap-2.5 text-emerald-600 font-bold text-lg tracking-tight">
          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">
            <FaCalendarDay className="text-sm" />
          </div>
          {currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </div>
      </div>
    </div>
  </div>
</div>


{/* 📊 COMPACT SUMMARY CARDS */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
  
  {/* Lena Hai Card (Compact) */}
  <div className="group relative overflow-hidden bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100/50">
        Lena Hai
      </span>
      <div className="text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7 10 10M17 7v10H7"/></svg>
      </div>
    </div>
    
    <div className="flex flex-col">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
        ₹{data.filter(i => i.type === 'given' && i.status !== 'Paid Full Amount').reduce((a,b) => a + Number(b.amount), 0).toLocaleString()}
      </h2>
      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Pending Receivables</p>
    </div>

    {/* Background Detail */}
    <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-emerald-50 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
  </div>

  {/* Dena Hai Card (Compact) */}
  <div className="group relative overflow-hidden bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-100/50">
        Dena Hai
      </span>
      <div className="text-rose-500 opacity-40 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 7 7 17M7 7v10h10"/></svg>
      </div>
    </div>

    <div className="flex flex-col">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
        ₹{data.filter(i => i.type === 'taken' && i.status !== 'Paid Full Amount').reduce((a,b) => a + Number(b.amount), 0).toLocaleString()}
      </h2>
      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Pending Payables</p>
    </div>

    {/* Background Detail */}
    <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-rose-50 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
  </div>

</div>
        {/* ADD FORM */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 mb-10">
          <h3 className="text-lg font-black mb-6 text-gray-800 flex items-center gap-2"><FaUser className="text-indigo-500" /> New Transaction</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <input placeholder="Person Name" className={inputStyle} value={person} onChange={(e) => setPerson(e.target.value)} />
            <input type="number" placeholder="Amount ₹" className={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <select className={inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="given">I Gave (Udhar Diya)</option>
              <option value="taken">I Took (Udhar Liya)</option>
            </select>
            <input type="date" className={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} />
            <select className={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending Amount">Pending Amount</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid Full Amount">Paid Full Amount</option>
            </select>
            <input placeholder="Short Note..." className={inputStyle} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <button onClick={addUdhar} className="w-full mt-8 bg-indigo-600 text-white font-black py-4 rounded-[20px] hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
            + Add to Ledger
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search name..." className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[20px] outline-none shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2 bg-white p-2 rounded-[20px] border border-gray-100 shadow-sm overflow-x-auto whitespace-nowrap">
            <select className="bg-transparent border-none py-2 px-4 outline-none font-bold text-gray-600 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending Amount">Pending</option>
              <option value="Partially Paid">Partial</option>
              <option value="Paid Full Amount">Paid</option>
            </select>
            <input type="date" className="bg-transparent border-none py-2 px-4 outline-none font-bold text-gray-600 text-sm" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
        </div>

        {/* RESPONSIVE TABLE */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
             <thead className="bg-gradient-to-r from-[#A8E6CF] to-[#DCFCE7] text-[#065F46] text-[12px] font-black tracking-widest uppercase shadow-sm text-bold">
  <tr>

    <th className="p-6">
      <div className="flex items-center gap-2">
        <FaUser className="text-green-600 text-xs" />
        Details
      </div>
    </th>

    <th className="p-6">
      <div className="flex items-center gap-2">
        <FaEdit className="text-green-600 text-xs" />
        Note
      </div>
    </th>

    <th className="p-6">
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-xs font-black">₹</span>
        Amount
      </div>
    </th>

    <th className="p-6 text-center">
      <div className="flex items-center justify-center gap-2">
        <FaCheckCircle className="text-green-600 text-xs" />
        Status
      </div>
    </th>

    <th className="p-6 text-right">
      <div className="flex items-center justify-end gap-2">
        <FaFilter className="text-green-600 text-xs" />
        Actions
      </div>
    </th>

  </tr>
            </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-indigo-50/20 transition-all">
                    <td className="p-6">
                      <div className="font-black text-gray-800">{item.person_name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{item.date}</div>
                    </td>
                    <td className="p-6 text-sm text-gray-500 italic max-w-[150px] truncate">{item.note || "—"}</td>
                    <td className="p-6">
                      <div className={`font-black ${item.type === 'given' ? 'text-green-600' : 'text-red-600'}`}>₹{item.amount}</div>
                      <div className="text-[10px] font-black text-gray-300 uppercase">{item.type}</div>
                    </td>
                    <td className="p-6 text-center">
                      {/* 🔥 QUICK STATUS SELECTOR */}
                      <div className="relative inline-block">
                        <select 
                          value={item.status} 
                          onChange={(e) => quickUpdateStatus(item.id, e.target.value)}
                          className={`appearance-none px-4 py-2 pr-10 rounded-xl text-[10px] font-black uppercase cursor-pointer outline-none border-none
                            ${item.status === 'Paid Full Amount' ? 'bg-green-100 text-green-700' : 
                              item.status === 'Partially Paid' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}
                          `}
                        >
                          <option value="Pending Amount">Pending Amount</option>
                          <option value="Partially Paid">Partially Paid</option>
                          <option value="Paid Full Amount">Paid Full Amount</option>
                        </select>
                        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]" />
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2 ">
                        <button onClick={() => openEditModal(item)} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="Edit Entry"><FaEdit size={16}/></button>
                        <button onClick={() => deleteEntry(item.id)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-lg" title="Delete Entry"><FaTrash size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      
        {/* PAGINATION */}
        <div className="flex justify-end items-center gap-4 mt-6">
          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            Next
          </button>
        </div>

      </div>



      {/* --- EDIT MODAL (POP-UP) --- */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-indigo-600 text-white">
              <h2 className="text-xl font-black flex items-center gap-2"><FaEdit /> Edit Entry</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="hover:rotate-90 transition-transform"><FaTimes size={24} /></button>
            </div>
            
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Person Name</label>
                <input className={inputStyle} value={editingItem.person_name} onChange={(e) => setEditingItem({...editingItem, person_name: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Amount (₹)</label>
                <input type="number" className={inputStyle} value={editingItem.amount} onChange={(e) => setEditingItem({...editingItem, amount: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Transaction Type</label>
                <select className={inputStyle} value={editingItem.type} onChange={(e) => setEditingItem({...editingItem, type: e.target.value})}>
                  <option value="given">I Gave (Udhar Diya)</option>
                  <option value="taken">I Took (Udhar Liya)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Date</label>
                <input type="date" className={inputStyle} value={editingItem.date} onChange={(e) => setEditingItem({...editingItem, date: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Status</label>
                <select className={inputStyle} value={editingItem.status} onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}>
                  <option value="Pending Amount">Pending Amount</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Paid Full Amount">Paid Full Amount</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Note</label>
                <textarea className={`${inputStyle} h-24 resize-none`} value={editingItem.note} onChange={(e) => setEditingItem({...editingItem, note: e.target.value})} />
              </div>
            </div>

            <div className="p-8 bg-gray-50 flex gap-4">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 font-black text-gray-500 hover:bg-gray-100 rounded-[20px] transition-all">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-[20px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 flex items-center justify-center gap-2"><FaSave /> Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

    </div>
  );
}