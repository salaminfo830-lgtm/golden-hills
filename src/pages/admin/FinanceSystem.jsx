import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, 
  CreditCard, PieChart, ArrowUpRight, 
  Loader2, Calendar, Plus, X, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const FinanceSystem = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    label: '', value: 0, type: 'Revenue', category: 'Room Booking'
  });

  useEffect(() => {
    fetchFinanceData();

    const subscription = supabase
      .channel('public:FinanceTransaction')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'FinanceTransaction' }, () => fetchFinanceData())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchFinanceData = async () => {
    const { data: transactions, error } = await supabase
      .from('FinanceTransaction')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error) {
      setData(transactions || []);
    }
    setLoading(false);
  };

  const totals = data.reduce((acc, curr) => {
    if (curr.type === 'Revenue') return acc + curr.value;
    return acc - curr.value;
  }, 0);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('FinanceTransaction').insert([{
      ...newEntry,
      is_up: newEntry.type === 'Revenue'
    }]);

    if (!error) {
      setShowAddModal(false);
      setNewEntry({ label: '', value: 0, type: 'Revenue', category: 'Room Booking' });
      fetchFinanceData();
    } else {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if(window.confirm("Delete this transaction?")) {
      await supabase.from('FinanceTransaction').delete().eq('id', id);
      fetchFinanceData();
    }
  };

  return (
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Financial Ledger</h2>
          <p className="text-gray-400 font-medium tracking-wide">Real-time revenue & expense orchestration</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline className="flex-1 md:flex-none py-3 px-6 text-[10px] cursor-not-allowed opacity-50">FINANCIAL REPORT</GoldButton>
           <GoldButton onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2">
             <Plus className="w-4 h-4" /> ADD ENTRY
           </GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <GlassCard className="bg-white border-gray-100 p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
               <div className={`p-3 rounded-2xl ${totals >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  <DollarSign className="w-6 h-6" />
               </div>
               <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${totals >= 0 ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                  {totals >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3"/>} 
               </span>
            </div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-1">Net Cashflow</p>
            <h3 className="text-3xl font-bold font-serif">{loading ? '...' : `${totals.toLocaleString()} DZD`}</h3>
         </GlassCard>

         <GlassCard className="bg-white border-gray-100 p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <CreditCard className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">Synced</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-1">Total Entries</p>
            <h3 className="text-3xl font-bold font-serif">{data.length}</h3>
         </GlassCard>

         <GlassCard className="gold-gradient text-white p-8">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-white/20 rounded-2xl">
                  <PieChart className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Growth Plan</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-white/80 tracking-[0.2em] mb-1">Investment Reserve</p>
            <h3 className="text-3xl font-bold font-serif">2.4M DZD</h3>
         </GlassCard>
      </div>

      <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold font-serif text-lg flex items-center gap-2">
               <Calendar className="w-5 h-5 text-luxury-gold" /> Recent Ledger Entries
            </h3>
            {loading && <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" />}
         </div>
         <div className="divide-y divide-gray-50 overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
               <thead className="bg-gray-50/50">
                  <tr>
                     <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Transaction</th>
                     <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                     <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                     <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Value</th>
                     <th className="w-16"></th>
                  </tr>
               </thead>
               <tbody>
                  <AnimatePresence mode="popLayout">
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-20 text-center text-gray-400 font-medium italic">
                           Waiting for financial transmissions...
                        </td>
                      </tr>
                    ) : data.map((item) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={item.id} 
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className={`p-2 rounded-xl ${item.is_up ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                  {item.is_up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                               </div>
                               <span className="font-bold text-gray-800">{item.label}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                         </td>
                         <td className="px-8 py-6 text-xs text-gray-500 font-medium tracking-wide">
                            {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </td>
                         <td className={`px-8 py-6 text-right font-serif font-bold ${item.is_up ? 'text-green-600' : 'text-red-500'}`}>
                            {item.is_up ? '+' : '-'}{item.value.toLocaleString()} DZD
                         </td>
                         <td className="px-4 py-6 text-center">
                            <button onClick={() => handleDeleteEntry(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </GlassCard>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <GlassCard className="bg-white w-full max-w-md p-6 relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <X className="w-5 h-5"/>
              </button>
              <h3 className="text-xl font-bold font-serif mb-6">New Ledger Entry</h3>
              <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Description / Label</label>
                  <input required value={newEntry.label} onChange={e=>setNewEntry({...newEntry, label: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Amount (DZD)</label>
                    <input required type="number" value={newEntry.value} onChange={e=>setNewEntry({...newEntry, value: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Type</label>
                    <select value={newEntry.type} onChange={e=>setNewEntry({...newEntry, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none">
                      <option>Revenue</option>
                      <option>Expense</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Category</label>
                  <select value={newEntry.category} onChange={e=>setNewEntry({...newEntry, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none">
                    <option>Room Booking</option>
                    <option>F&B</option>
                    <option>Spa</option>
                    <option>Maintenance</option>
                    <option>Marketing</option>
                    <option>Miscellaneous</option>
                  </select>
                </div>
                <GoldButton type="submit" className="w-full mt-6 py-3">RECORD TRANSACTION</GoldButton>
              </form>
           </GlassCard>
        </div>
      )}

    </div>
  );
};

export default FinanceSystem;
