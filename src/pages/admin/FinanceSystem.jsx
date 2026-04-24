import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, 
  CreditCard, PieChart, ArrowUpRight, 
  Loader2, Calendar, Plus, X, Trash2, Edit3, Eye
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
  const [selectedProof, setSelectedProof] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(null);

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

  const handleRejectPayment = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    const { error } = await supabase.from('PaymentRequest').update({ 
      status: 'Rejected',
      notes: rejectionReason
    }).eq('id', processingRequest.id);

    if (!error) {
      await supabase.from('Reservation').update({ 
        status: 'Cancelled',
        payment_status: 'Refunded' // Or just Failed
      }).eq('id', processingRequest.reservation_id);

      await supabase.from('AuditLog').insert([{
        action: 'Payment Rejected',
        entity_type: 'PaymentRequest',
        entity_id: processingRequest.id,
        details: { reason: rejectionReason }
      }]);

      setShowRejectionModal(false);
      setRejectionReason('');
      setProcessingRequest(null);
      fetchPaymentRequests();
    }
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
    <div className="space-y-12 font-apple">
      {/* Executive Financial Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Treasury</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Vault Operations</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#050B18] tracking-tighter">Financial Intelligence</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <div className="flex bg-[#F5F5F7] p-1.5 rounded-2xl shadow-inner">
              {['Ledger', 'Payments', 'Accounts'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                     activeTab === tab 
                      ? 'bg-white text-[#050B18] shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                   }`}
                 >
                   {tab}
                 </button>
              ))}
           </div>
           <button 
             onClick={() => setShowAddModal(true)} 
             className="btn-apple-primary px-10 py-4 flex items-center justify-center gap-3 shadow-xl shadow-[#050B18]/10"
           >
             <Plus className="w-5 h-5" /> <span>Commit Protocol</span>
           </button>
        </div>
      </div>

      {/* High-Fidelity Stats Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="apple-card p-10 group hover:scale-[1.02] transition-transform duration-500">
            <div className="flex justify-between items-start mb-8">
               <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-colors ${
                 totals >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
               }`}>
                  <DollarSign className="w-8 h-8" />
               </div>
               <span className={`badge-apple py-2 px-4 ${
                 totals >= 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
               }`}>
                  {totals >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1"/>} 
                  {totals >= 0 ? 'Growth' : 'Deficit'}
               </span>
            </div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.3em] mb-2">Net Treasury Capital</p>
            <h3 className="text-4xl font-bold text-[#050B18] tracking-tighter">
               {loading ? '---' : `${totals.toLocaleString()} DZD`}
            </h3>
         </div>

         <div className="apple-card p-10 group hover:scale-[1.02] transition-transform duration-500">
            <div className="flex justify-between items-start mb-8">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center">
                  <CreditCard className="w-8 h-8" />
               </div>
               <span className="badge-apple py-2 px-4 bg-blue-50 text-blue-600 border-blue-100">Verified</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.3em] mb-2">Flow Operations</p>
            <h3 className="text-4xl font-bold text-[#050B18] tracking-tighter">{data.length} Trans</h3>
         </div>

         <div className="apple-card bg-[#050B18] text-white p-10 border-none relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/10 rounded-full blur-[60px] translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-1000" />
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div className="w-16 h-16 bg-white/10 text-[#C9A84C] rounded-[2rem] flex items-center justify-center backdrop-blur-md">
                  <PieChart className="w-8 h-8" />
               </div>
               <span className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-[0.2em]">Pending Protocol</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-white/40 tracking-[0.3em] mb-2 relative z-10">Pending Verifications</p>
            <h3 className="text-4xl font-bold text-white relative z-10 tracking-tighter">
               {paymentRequests.filter(r => r.status === 'Pending').length} Queue
            </h3>
         </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'Ledger' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key="ledger"
            className="apple-card p-0 overflow-hidden border-none shadow-2xl shadow-gray-100"
          >
             <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-white">
                <div>
                   <h3 className="text-xl font-bold text-[#050B18] tracking-tight flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-[#C9A84C]" /> Transaction Ledger
                   </h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Official Historical Record</p>
                </div>
                {loading && <Loader2 className="w-5 h-5 text-[#C9A84C] animate-spin" />}
             </div>
             <div className="overflow-x-auto">
                <table className="table-apple">
                   <thead>
                      <tr>
                         <th className="pl-10">Operation Detail</th>
                         <th>Sector</th>
                         <th>Protocol Timestamp</th>
                         <th className="text-right">Capital Flow (DZD)</th>
                         <th className="w-20 pr-10"></th>
                      </tr>
                   </thead>
                   <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-32 text-center bg-white">
                             <div className="w-16 h-16 bg-[#F5F5F7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-6 h-6 text-gray-300" />
                             </div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Ledger empty. Awaiting transactions.</p>
                          </td>
                        </tr>
                      ) : data.map((item) => (
                        <tr key={item.id} className="group hover:bg-[#F5F5F7]/30 transition-all">
                           <td className="pl-10 py-6">
                              <div className="flex items-center gap-5">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${item.is_up ? 'bg-green-50 text-green-600 shadow-sm shadow-green-100' : 'bg-red-50 text-red-500 shadow-sm shadow-red-100'}`}>
                                    {item.is_up ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                 </div>
                                 <div>
                                    <p className="font-bold text-[#050B18] text-sm tracking-tight">{item.label}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {item.id.slice(0, 8)}</p>
                                 </div>
                              </div>
                           </td>
                           <td>
                              <span className="badge-apple bg-[#F5F5F7] text-gray-500 border-gray-100">{item.category}</span>
                           </td>
                           <td>
                              <div className="flex flex-col">
                                 <span className="text-xs text-[#050B18] font-bold tracking-tight">
                                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                 </span>
                                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                 </span>
                              </div>
                           </td>
                           <td className={`text-right font-bold text-base tracking-tighter ${item.is_up ? 'text-green-600' : 'text-red-500'}`}>
                              {item.is_up ? '+' : '-'}{item.value.toLocaleString()}
                           </td>
                           <td className="pr-10 text-right">
                              <button onClick={() => handleDeleteEntry(item.id)} className="p-3 bg-[#F5F5F7] text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {activeTab === 'Payments' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key="payments"
            className="apple-card p-0 overflow-hidden border-none shadow-2xl shadow-gray-100"
          >
             <div className="p-10 border-b border-gray-50 bg-white">
                <h3 className="text-xl font-bold text-[#050B18] tracking-tight">Bank Verification Queue</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manual Transfer Auditing</p>
             </div>
             <div className="divide-y divide-gray-50">
                {paymentRequests.length === 0 ? (
                  <div className="p-32 text-center bg-white">
                     <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                     <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">No pending transfers found.</p>
                  </div>
                ) : paymentRequests.map(req => (
                  <div key={req.id} className="p-10 flex flex-col lg:flex-row items-center justify-between hover:bg-[#F5F5F7]/30 transition-all duration-500 gap-8">
                     <div className="flex gap-8 items-center w-full lg:w-auto">
                        <div className="w-16 h-16 bg-[#F5F5F7] rounded-[2rem] flex items-center justify-center text-[#C9A84C] shadow-inner shrink-0">
                           <CreditCard className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-lg font-bold text-[#050B18] tracking-tight">{req.reservation?.guest_name || 'Premium Client'}</h4>
                           <div className="flex items-center gap-4 mt-1.5">
                              <span className="text-sm font-bold text-[#C9A84C] tracking-tight">{req.amount.toLocaleString()} DZD</span>
                              <span className="text-gray-200">•</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Protocol ID: {req.id.slice(0, 8)}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-end w-full lg:w-auto">
                        {req.proof_url && (
                          <button 
                            onClick={() => setSelectedProof(req.proof_url)}
                            className="btn-apple-secondary px-6 py-3 flex items-center gap-3 group"
                          >
                            <Eye className="w-4 h-4 transition-transform group-hover:scale-110" /> 
                            <span className="text-[10px] font-bold uppercase tracking-widest">Review Asset</span>
                          </button>
                        )}
                        <div className="flex gap-3">
                          {req.status === 'Pending' ? (
                             <>
                                <button 
                                  onClick={() => handleVerifyPayment(req.id, req.reservation_id, req.amount)} 
                                  className="btn-apple-primary px-8 py-3.5 shadow-lg shadow-green-100"
                                >
                                  Authorize
                                </button>
                                <button 
                                  onClick={() => {
                                    setProcessingRequest(req);
                                    setShowRejectionModal(true);
                                  }} 
                                  className="px-8 py-3.5 rounded-2xl border border-red-100 text-[10px] font-bold text-red-400 hover:bg-red-50 transition-all"
                                >
                                  Reject
                                </button>
                             </>
                          ) : (
                             <span className={`badge-apple py-2 px-5 ${req.status === 'Verified' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {req.status} Protocol
                             </span>
                          )}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}        {activeTab === 'Accounts' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            key="accounts"
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
             {bankAccounts.map(acc => (
                <div key={acc.id} className="apple-card p-10 space-y-8 group relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-100">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000" />
                   
                   <div className="flex justify-between items-start relative z-10">
                      <div>
                         <h4 className="font-bold text-2xl text-[#050B18] tracking-tight">{acc.bank_name}</h4>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{acc.account_holder}</p>
                      </div>
                      <span className={`badge-apple py-2 px-4 ${acc.is_active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400'}`}>
                        {acc.is_active ? 'Active Flow' : 'Disabled'}
                      </span>
                   </div>
                   
                   <div className="bg-[#F5F5F7] p-8 rounded-[2rem] border border-transparent group-hover:border-[#C9A84C]/20 transition-all duration-500 relative z-10">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">Official Network Ident (IBAN)</p>
                      <p className="text-base font-mono font-bold text-[#050B18] break-all tracking-tight leading-relaxed">{acc.iban}</p>
                   </div>
                   
                   <div className="flex gap-4 pt-6 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 relative z-10">
                      <button 
                        onClick={() => openAccountModal(acc)}
                        className="flex-1 py-3.5 bg-white shadow-sm border border-gray-100 hover:border-[#050B18] hover:bg-[#050B18] hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                      >
                         <Edit3 className="w-4 h-4" /> <span>Update Identity</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteAccount(acc.id)}
                        className="p-3.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                      >
                         <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             ))}
             <button 
               onClick={() => openAccountModal()}
               className="apple-card border-dashed border-2 border-gray-200 p-12 flex flex-col items-center justify-center text-gray-300 hover:border-[#C9A84C]/30 hover:bg-[#F5F5F7]/30 transition-all duration-500 group"
             >
                <div className="w-20 h-20 rounded-[2.5rem] bg-[#F5F5F7] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                  <Plus className="w-10 h-10 text-gray-300 group-hover:text-[#C9A84C]" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] group-hover:text-[#050B18] transition-all">Link Global Account</p>
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entry Protocol Side Panel */}
      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setShowAddModal(false)} 
             className="absolute inset-0 bg-[#050B18]/40 backdrop-blur-md" 
           />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-xl h-full apple-card p-0 flex flex-col border-none shadow-2xl"
           >
              <div className="p-10 border-b border-gray-50 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-3xl font-bold text-[#050B18] tracking-tighter">Financial Protocol</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1.5">Commit Capital Record</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-3.5 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                   <X className="w-6 h-6"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 <form id="ledger-form" onSubmit={handleAddEntry} className="space-y-10">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Protocol Description</label>
                      <input required value={newEntry.label} onChange={e=>setNewEntry({...newEntry, label: e.target.value})} type="text" className="input-apple w-full" placeholder="e.g. Asset Acquisition: High-Speed Elevators" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Capital Value (DZD)</label>
                        <input required type="number" value={newEntry.value} onChange={e=>setNewEntry({...newEntry, value: Number(e.target.value)})} className="input-apple w-full" placeholder="50000" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Flow Direction</label>
                        <select value={newEntry.type} onChange={e=>setNewEntry({...newEntry, type: e.target.value})} className="input-apple w-full appearance-none">
                          <option>Revenue</option>
                          <option>Expense</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Sector Categorization</label>
                      <select value={newEntry.category} onChange={e=>setNewEntry({...newEntry, category: e.target.value})} className="input-apple w-full appearance-none">
                        <option>Room Booking</option>
                        <option>F&B Services</option>
                        <option>Spa & Wellness</option>
                        <option>Maintenance</option>
                        <option>Marketing</option>
                        <option>Miscellaneous</option>
                      </select>
                    </div>
                 </form>
              </div>

              <div className="p-10 bg-white border-t border-gray-50 shrink-0">
                 <button form="ledger-form" type="submit" className="btn-apple-primary w-full py-5 text-base shadow-xl shadow-[#050B18]/10">Commit Operation</button>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Account Linkage Side Panel */}
      <AnimatePresence>
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setShowAccountModal(false)} 
             className="absolute inset-0 bg-[#050B18]/40 backdrop-blur-md" 
           />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-xl h-full apple-card p-0 flex flex-col border-none shadow-2xl"
           >
              <div className="p-10 border-b border-gray-50 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-3xl font-bold text-[#050B18] tracking-tighter">{editingAccount ? 'Update Identity' : 'Bank Linkage'}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1.5">Configure Network Channel</p>
                 </div>
                 <button onClick={() => setShowAccountModal(false)} className="p-3.5 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                   <X className="w-6 h-6"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 <form id="account-form" onSubmit={handleSaveAccount} className="space-y-10">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Institutional Name</label>
                      <input required value={accountForm.bank_name} onChange={e=>setAccountForm({...accountForm, bank_name: e.target.value})} type="text" placeholder="e.g. BNP Paribas El Djazaïr" className="input-apple w-full" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Authorized Holder</label>
                      <input required value={accountForm.account_holder} onChange={e=>setAccountForm({...accountForm, account_holder: e.target.value})} type="text" placeholder="e.g. GOLDEN HILLS HOTEL" className="input-apple w-full" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Network Ident (RIB / IBAN)</label>
                      <input required value={accountForm.iban} onChange={e=>setAccountForm({...accountForm, iban: e.target.value})} type="text" className="input-apple w-full font-mono tracking-wider" placeholder="DZ00 0000 0000..." />
                    </div>
                    <div className="flex items-center gap-6 p-8 bg-[#F5F5F7] rounded-[2rem]">
                       <div className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            id="is_active"
                            checked={accountForm.is_active} 
                            onChange={e=>setAccountForm({...accountForm, is_active: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                       </div>
                       <div>
                          <label htmlFor="is_active" className="text-[11px] font-bold text-[#050B18] uppercase tracking-[0.2em] cursor-pointer block">Flow Activation</label>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Status: {accountForm.is_active ? 'Active' : 'Offline'}</p>
                       </div>
                    </div>
                 </form>
              </div>

              <div className="p-10 bg-white border-t border-gray-50 shrink-0">
                 <button form="account-form" type="submit" disabled={loading} className="btn-apple-primary w-full py-5 text-base shadow-xl shadow-[#050B18]/10">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (editingAccount ? 'Authorize Update' : 'Establish Network Link')}
                 </button>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* High-Fidelity Asset Viewer */}
      <AnimatePresence>
      {selectedProof && (
        <div className="fixed inset-0 bg-[#050B18]/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-12">
          <button onClick={() => setSelectedProof(null)} className="absolute top-10 right-10 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all duration-300">
            <X className="w-8 h-8" />
          </button>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-6xl h-[85vh] flex items-center justify-center overflow-hidden rounded-[3rem] bg-white shadow-2xl"
          >
            {selectedProof.endsWith('.pdf') ? (
              <iframe src={selectedProof} className="w-full h-full border-none" title="Payment Proof" />
            ) : (
              <img src={selectedProof} alt="Verification Asset" className="max-w-full max-h-full object-contain" />
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Protocol Rejection Interface */}
      <AnimatePresence>
      {showRejectionModal && (
        <div className="fixed inset-0 bg-[#050B18]/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="apple-card w-full max-w-xl p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            
            <h3 className="text-3xl font-bold text-[#050B18] mb-4 tracking-tighter relative z-10">Protocol Breach</h3>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-10 relative z-10">Detail the specific audit failure for this transaction.</p>
            
            <textarea 
              rows="5" 
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Asset mismatch, illegible documentation, insufficient funds..."
              className="input-apple w-full h-40 resize-none mb-10 relative z-10"
            />
            
            <div className="flex gap-6 relative z-10">
              <button onClick={() => setShowRejectionModal(false)} className="flex-1 py-5 px-8 bg-[#F5F5F7] rounded-2xl text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-200 transition-all">Discard</button>
              <button 
                onClick={handleRejectPayment}
                className="flex-1 py-5 px-8 bg-red-600 rounded-2xl text-[11px] font-bold text-white uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100"
              >
                Execute Rejection
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default FinanceSystem;
