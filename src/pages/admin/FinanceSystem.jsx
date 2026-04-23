import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, 
  CreditCard, PieChart, ArrowUpRight, 
  Loader2, Calendar, Plus, X, Trash2, Edit3
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
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState('Ledger'); // Ledger, Payments, Accounts
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountForm, setAccountForm] = useState({
    bank_name: '', account_holder: '', iban: '', is_active: true
  });

  useEffect(() => {
    fetchFinanceData();
    fetchPaymentRequests();
    fetchBankAccounts();

    const transactionsSub = supabase
      .channel('public:FinanceTransaction')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'FinanceTransaction' }, () => fetchFinanceData())
      .subscribe();

    const paymentsSub = supabase
      .channel('public:PaymentRequest')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'PaymentRequest' }, () => fetchPaymentRequests())
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsSub);
      supabase.removeChannel(paymentsSub);
    };
  }, []);

  const fetchPaymentRequests = async () => {
    const { data } = await supabase
      .from('PaymentRequest')
      .select('*, reservation:Reservation(*)')
      .order('created_at', { ascending: false });
    if (data) setPaymentRequests(data);
  };

  const fetchBankAccounts = async () => {
    const { data } = await supabase.from('BankAccount').select('*');
    if (data) setBankAccounts(data);
  };

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

  const handleVerifyPayment = async (requestId, reservationId, amount) => {
    const { error } = await supabase.from('PaymentRequest').update({ 
      status: 'Verified', 
      verified_at: new Date().toISOString() 
    }).eq('id', requestId);

    if (!error) {
      await supabase.from('Reservation').update({ 
        payment_status: 'Paid',
        status: 'Confirmed'
      }).eq('id', reservationId);

      await supabase.from('FinanceTransaction').insert([{
        label: `Bank Transfer Payment - Res #${reservationId.slice(0, 5)}`,
        value: amount,
        type: 'Revenue',
        category: 'Room Booking',
        is_up: true
      }]);

      fetchPaymentRequests();
      fetchFinanceData();
    }
  };

  const handleRejectPayment = async (id) => {
    await supabase.from('PaymentRequest').update({ status: 'Rejected' }).eq('id', id);
    fetchPaymentRequests();
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (editingAccount) {
      const { error } = await supabase
        .from('BankAccount')
        .update(accountForm)
        .eq('id', editingAccount.id);
      if (!error) {
        setShowAccountModal(false);
        setEditingAccount(null);
        fetchBankAccounts();
      } else {
        alert("Error updating account: " + error.message);
      }
    } else {
      const { error } = await supabase
        .from('BankAccount')
        .insert([accountForm]);
      if (!error) {
        setShowAccountModal(false);
        fetchBankAccounts();
      } else {
        alert("Error adding account: " + error.message);
      }
    }
    setLoading(false);
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm("Are you sure you want to delete this bank account?")) {
      setLoading(true);
      const { error } = await supabase
        .from('BankAccount')
        .delete()
        .eq('id', id);
      if (!error) {
        fetchBankAccounts();
      } else {
        alert("Error deleting account: " + error.message);
      }
      setLoading(false);
    }
  };

  const openAccountModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setAccountForm({
        bank_name: account.bank_name,
        account_holder: account.account_holder,
        iban: account.iban,
        is_active: account.is_active
      });
    } else {
      setEditingAccount(null);
      setAccountForm({
        bank_name: '',
        account_holder: '',
        iban: '',
        is_active: true
      });
    }
    setShowAccountModal(true);
  };

  return (
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Financial Ledger</h2>
          <p className="text-gray-400 font-medium tracking-wide">Real-time revenue & expense orchestration</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mr-4">
              {['Ledger', 'Payments', 'Accounts'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-luxury-gold shadow-sm' : 'text-gray-400'}`}
                 >
                   {tab}
                 </button>
              ))}
           </div>
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
            <p className="text-[10px] uppercase font-bold text-white/80 tracking-[0.2em] mb-1">Pending Transfers</p>
            <h3 className="text-3xl font-bold font-serif">{paymentRequests.filter(r => r.status === 'Pending').length} Req</h3>
         </GlassCard>
      </div>

      {activeTab === 'Ledger' && (
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
      )}

      {activeTab === 'Payments' && (
        <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden">
           <div className="p-8 border-b border-gray-50">
              <h3 className="font-bold font-serif text-lg">Bank Transfer Verification</h3>
           </div>
           <div className="divide-y divide-gray-50">
              {paymentRequests.length === 0 ? (
                <div className="p-20 text-center text-gray-400">No pending verification requests.</div>
              ) : paymentRequests.map(req => (
                <div key={req.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                   <div className="flex gap-6 items-center">
                      <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold">
                         <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-bold">{req.reservation?.guest_name || 'Guest'}</h4>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount: {req.amount.toLocaleString()} DZD</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      {req.status === 'Pending' ? (
                         <>
                            <GoldButton onClick={() => handleVerifyPayment(req.id, req.reservation_id, req.amount)} className="px-6 py-2 text-[10px]">VERIFY</GoldButton>
                            <button onClick={() => handleRejectPayment(req.id)} className="px-6 py-2 border border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">REJECT</button>
                         </>
                      ) : (
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${req.status === 'Verified' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {req.status}
                         </span>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </GlassCard>
      )}

      {activeTab === 'Accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {bankAccounts.map(acc => (
              <GlassCard key={acc.id} className="bg-white border-gray-100 p-8 space-y-6 group relative">
                 <div className="flex justify-between items-start">
                    <div>
                       <h4 className="font-bold text-lg">{acc.bank_name}</h4>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{acc.account_holder}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={`w-3 h-3 rounded-full ${acc.is_active ? 'bg-green-500' : 'bg-gray-300'}`} title={acc.is_active ? 'Active' : 'Inactive'} />
                    </div>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">IBAN / RIB</p>
                    <p className="text-sm font-mono font-bold text-luxury-gold break-all">{acc.iban}</p>
                 </div>
                 <div className="flex gap-4 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openAccountModal(acc)}
                      className="flex-1 py-2 px-4 bg-gray-100 hover:bg-luxury-gold hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                    >
                       <Edit3 className="w-3 h-3" /> EDIT
                    </button>
                    <button 
                      onClick={() => handleDeleteAccount(acc.id)}
                      className="flex-1 py-2 px-4 bg-gray-100 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                    >
                       <Trash2 className="w-3 h-3" /> DELETE
                    </button>
                 </div>
              </GlassCard>
           ))}
           <GlassCard 
             onClick={() => openAccountModal()}
             className="bg-gray-50 border-dashed border-2 border-gray-200 p-8 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-luxury-gold/30 transition-all group"
           >
              <Plus className="w-8 h-8 mb-2 opacity-20 group-hover:opacity-100 group-hover:text-luxury-gold transition-all" />
              <p className="text-[10px] font-bold uppercase tracking-widest group-hover:text-luxury-gold transition-all">Add Business Account</p>
           </GlassCard>
        </div>
      )}

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

      {showAccountModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <GlassCard className="bg-white w-full max-w-md p-6 relative">
              <button onClick={() => setShowAccountModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <X className="w-5 h-5"/>
              </button>
              <h3 className="text-xl font-bold font-serif mb-6">{editingAccount ? 'Edit' : 'Add'} Bank Account</h3>
              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Bank Name</label>
                  <input required value={accountForm.bank_name} onChange={e=>setAccountForm({...accountForm, bank_name: e.target.value})} type="text" placeholder="e.g. BNP Paribas, BEA..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Account Holder</label>
                  <input required value={accountForm.account_holder} onChange={e=>setAccountForm({...accountForm, account_holder: e.target.value})} type="text" placeholder="e.g. GOLDEN HILLS SARL" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">IBAN / RIB</label>
                  <input required value={accountForm.iban} onChange={e=>setAccountForm({...accountForm, iban: e.target.value})} type="text" placeholder="Official account number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                   <input 
                     type="checkbox" 
                     id="is_active"
                     checked={accountForm.is_active} 
                     onChange={e=>setAccountForm({...accountForm, is_active: e.target.checked})}
                     className="w-4 h-4 accent-luxury-gold"
                   />
                   <label htmlFor="is_active" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Account</label>
                </div>
                <GoldButton type="submit" disabled={loading} className="w-full mt-6 py-3">
                   {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (editingAccount ? 'UPDATE ACCOUNT' : 'CREATE ACCOUNT')}
                </GoldButton>
              </form>
           </GlassCard>
        </div>
      )}

    </div>
  );
};

export default FinanceSystem;
