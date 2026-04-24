import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, AlertCircle, CheckCircle2, 
  Flame, Inbox, Timer, Loader2, X, Plus, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const KitchenSystem = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const [newOrder, setNewOrder] = useState({ table_id: '', items: '', priority: 'Normal' });
  const [newStock, setNewStock] = useState({ name: '', level: '', status: 'Regular', category: 'General' });

  useEffect(() => {
    fetchData();

    const ordersSub = supabase
      .channel('public:KitchenOrder')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'KitchenOrder' }, () => fetchData())
      .subscribe();

    const stockSub = supabase
      .channel('public:StockItem')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'StockItem' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSub);
      supabase.removeChannel(stockSub);
    };
  }, []);

  const fetchData = async () => {
    const { data: orders } = await supabase.from('KitchenOrder').select('*').in('status', ['Pending', 'Preparing']).order('created_at', { ascending: false });
    const { data: stock } = await supabase.from('StockItem').select('*').order('created_at', { ascending: false });
    
    if (orders) setActiveOrders(orders);
    else setActiveOrders([]);
    
    if (stock) setStockAlerts(stock);
    else setStockAlerts([]);
    
    setLoading(false);
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return 'text-red-500 bg-red-50 border-red-100';
    if (p === 'Normal') return 'text-blue-500 bg-blue-50 border-blue-100';
    return 'text-gray-400 bg-gray-50 border-gray-100';
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    const itemsArray = newOrder.items.split(',').map(s => s.trim()).filter(Boolean);
    const { error } = await supabase.from('KitchenOrder').insert([{
      table_id: newOrder.table_id,
      items: itemsArray,
      priority: newOrder.priority,
      status: 'Pending'
    }]);
    
    if (!error) {
      setShowOrderModal(false);
      setNewOrder({ table_id: '', items: '', priority: 'Normal' });
      fetchData();
    } else {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('StockItem').insert([newStock]);
    if (!error) {
      setShowStockModal(false);
      setNewStock({ name: '', level: '', status: 'Regular', category: 'General' });
      fetchData();
    } else {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  const handleMarkReady = async (id) => {
    await supabase.from('KitchenOrder').update({ status: 'Ready' }).eq('id', id);
    fetchData();
  };

  const handleDeleteStock = async (id) => {
    await supabase.from('StockItem').delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="space-y-12 font-apple">
      {/* Elite Culinary Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Culinary</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Operations Control</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#050B18] tracking-tighter">Kitchen Intelligence</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <button 
             onClick={() => setShowStockModal(true)} 
             className="btn-apple-secondary flex items-center justify-center gap-3 px-8 py-4 shadow-sm"
           >
             <Plus className="w-5 h-5" /> <span className="text-[11px] uppercase tracking-widest font-bold">Stock Asset</span>
           </button>
           <button 
             onClick={() => setShowOrderModal(true)} 
             className="btn-apple-primary flex items-center justify-center gap-3 px-10 py-4 shadow-xl shadow-[#050B18]/10"
           >
             <Inbox className="w-5 h-5" /> <span className="text-[11px] uppercase tracking-widest font-bold">Transmit Order</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Live Orders Column */}
         <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-bold text-[#050B18] flex items-center gap-3 tracking-tight">
                  <Inbox className="w-6 h-6 text-[#C9A84C]" /> Active Dispatch Queue
               </h3>
               {loading && <Loader2 className="w-5 h-5 text-[#C9A84C] animate-spin" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <AnimatePresence mode="popLayout">
                  {activeOrders.length === 0 ? (
                    <div className="col-span-full py-32 text-center apple-card border-none shadow-sm flex flex-col items-center bg-white/50 backdrop-blur-sm">
                       <Inbox className="w-16 h-16 text-gray-200 mb-6" />
                       <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Quiet Hours. No pending tickets.</p>
                    </div>
                  ) : activeOrders.map((order) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={order.id}
                    >
                       <div className="apple-card p-8 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#050B18]/5 border-none shadow-xl shadow-gray-100 transition-all duration-500 bg-white">
                          <div className="flex justify-between items-start mb-8">
                             <div>
                                <span className={`badge-apple py-1.5 px-3 ${
                                  order.priority === 'High' ? 'bg-red-50 text-red-500 border-red-100' :
                                  order.priority === 'Normal' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                }`}>
                                   {order.priority} Protocol
                                </span>
                                <h4 className="text-3xl font-bold text-[#050B18] mt-4 tracking-tighter">Table {order.table_id}</h4>
                             </div>
                             <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm ${order.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-[#F5F5F7] text-[#C9A84C]'}`}>
                                <Timer className="w-6 h-6" />
                             </div>
                          </div>

                          <div className="space-y-4 mb-10">
                             {Array.isArray(order.items) && order.items.map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center group/item p-4 bg-[#F5F5F7] rounded-2xl hover:bg-[#050B18] transition-all duration-300">
                                  <span className="font-bold text-sm text-[#050B18] group-hover/item:text-white transition-colors">{item}</span>
                                  <CheckCircle2 className="w-5 h-5 text-gray-300 group-hover/item:text-green-500 cursor-pointer transition-colors" />
                                </div>
                             ))}
                          </div>

                          <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                             <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                <Clock className="w-4 h-4" />
                                {new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                             <button 
                               onClick={() => handleMarkReady(order.id)} 
                               className="text-[11px] font-bold text-white bg-[#C9A84C] hover:bg-[#050B18] px-5 py-2.5 rounded-xl uppercase tracking-widest transition-all shadow-md shadow-[#C9A84C]/20"
                             >
                               Mark Ready
                             </button>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>

         {/* Stock & Alerts Column */}
         <div className="space-y-10">
            <div className="apple-card p-10 border-none shadow-xl shadow-gray-100">
               <h3 className="text-xl font-bold text-[#050B18] mb-10 flex items-center gap-3 tracking-tight">
                  <Flame className="w-6 h-6 text-orange-500" /> Pantry Inventory
               </h3>
               <div className="space-y-5">
                  {stockAlerts.slice(0,8).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-[#F5F5F7] rounded-2xl group relative border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                       <div className="flex items-center gap-5">
                          <div className={`w-3 h-3 rounded-full shadow-sm ${
                            item.status === 'Critical' ? 'bg-red-500 animate-pulse shadow-red-500/50' :
                            item.status === 'Low' ? 'bg-orange-500 shadow-orange-500/50' : 'bg-green-500 shadow-green-500/50'
                          }`} />
                          <div>
                             <p className="font-bold text-sm text-[#050B18] tracking-tight">{item.name}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">{item.category}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-5">
                         <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-[0.2em]">{item.level}</span>
                         <button onClick={() => handleDeleteStock(item.id)} className="p-2 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 className="w-4 h-4"/>
                         </button>
                       </div>
                    </div>
                  ))}
               </div>
               <button 
                 onClick={() => setShowStockModal(true)} 
                 className="w-full mt-10 py-4 rounded-2xl border-2 border-dashed border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:bg-[#F5F5F7] hover:text-[#050B18] hover:border-[#050B18] transition-all"
               >
                 Register Stock Asset
               </button>
            </div>

            <div className="apple-card bg-[#050B18] text-white p-10 border-none relative overflow-hidden shadow-2xl shadow-[#050B18]/20">
               <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/10 rounded-full blur-[60px] -translate-y-16 translate-x-16" />
               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="p-3 bg-white/10 rounded-2xl">
                     <AlertCircle className="w-6 h-6 text-[#C9A84C]" />
                  </div>
                  <h3 className="font-bold text-2xl tracking-tighter">Hygiene Safety</h3>
               </div>
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 relative z-10">
                  <p className="text-[11px] text-white/70 leading-loose font-medium uppercase tracking-widest">
                     Next tactical health audit: <br/>
                     <span className="text-white font-bold text-sm tracking-tight inline-block mt-2">Friday, Oct 23rd</span>
                  </p>
               </div>
               <button className="w-full py-4 rounded-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C9A84C] hover:border-[#C9A84C] transition-all relative z-10">
                  Verify Protocol Checklist
               </button>
            </div>
         </div>
      </div>

      {/* Order Dispatch Side Panel */}
      <AnimatePresence>
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setShowOrderModal(false)} 
             className="absolute inset-0 bg-[#050B18]/40 backdrop-blur-md" 
           />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-lg h-full apple-card p-0 flex flex-col border-none shadow-2xl"
           >
              <div className="p-10 border-b border-gray-50 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-3xl font-bold text-[#050B18] tracking-tighter">Ticket Dispatch</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1.5">Culinary Order Logistics</p>
                 </div>
                 <button onClick={() => setShowOrderModal(false)} className="p-3.5 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                   <X className="w-6 h-6"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 <form id="add-order-form" onSubmit={handleAddOrder} className="space-y-10">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Table / Room Location</label>
                      <input required placeholder="e.g. Table 12, Suite 402" value={newOrder.table_id} onChange={e=>setNewOrder({...newOrder, table_id: e.target.value})} type="text" className="input-apple w-full py-4 text-base" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Culinary Items (CSV)</label>
                      <textarea rows="4" required placeholder="e.g. 1x Truffle Risotto, 2x Champagne" value={newOrder.items} onChange={e=>setNewOrder({...newOrder, items: e.target.value})} className="input-apple w-full resize-none h-40 py-4 text-base"></textarea>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Kitchen Priority Protocol</label>
                      <div className="relative">
                        <select value={newOrder.priority} onChange={e=>setNewOrder({...newOrder, priority: e.target.value})} className="input-apple w-full appearance-none py-4 text-base font-medium">
                          <option value="Normal">Normal Sequence</option>
                          <option value="High">High Priority (Immediate)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                           <div className={`w-3 h-3 rounded-full ${newOrder.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        </div>
                      </div>
                    </div>
                 </form>
              </div>
              <div className="p-10 border-t border-gray-50 bg-white shrink-0">
                 <button form="add-order-form" type="submit" className="btn-apple-primary w-full py-5 text-base shadow-xl shadow-[#050B18]/10">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Transmit to Kitchen Operations'}
                 </button>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Stock Registration Side Panel */}
      <AnimatePresence>
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setShowStockModal(false)} 
             className="absolute inset-0 bg-[#050B18]/40 backdrop-blur-md" 
           />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-lg h-full apple-card p-0 flex flex-col border-none shadow-2xl"
           >
              <div className="p-10 border-b border-gray-50 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-3xl font-bold text-[#050B18] tracking-tighter">Asset Registry</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1.5">Pantry Operations</p>
                 </div>
                 <button onClick={() => setShowStockModal(false)} className="p-3.5 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                   <X className="w-6 h-6"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 <form id="add-stock-form" onSubmit={handleAddStock} className="space-y-10">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Asset Name / Ingredient</label>
                      <input required placeholder="e.g. Saffron Infusion" value={newStock.name} onChange={e=>setNewStock({...newStock, name: e.target.value})} type="text" className="input-apple w-full py-4 text-base" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Current Volume</label>
                        <input required placeholder="e.g. 20 Units" type="text" value={newStock.level} onChange={e=>setNewStock({...newStock, level: e.target.value})} className="input-apple w-full py-4 text-base" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Risk Level</label>
                        <select value={newStock.status} onChange={e=>setNewStock({...newStock, status: e.target.value})} className="input-apple w-full appearance-none py-4 text-base font-medium">
                          <option>Regular</option>
                          <option>Low</option>
                          <option>Critical</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Pantry Category</label>
                      <input required placeholder="e.g. Spices, Gourmet Meats" type="text" value={newStock.category} onChange={e=>setNewStock({...newStock, category: e.target.value})} className="input-apple w-full py-4 text-base" />
                    </div>
                 </form>
              </div>
              <div className="p-10 border-t border-gray-50 bg-white shrink-0">
                 <button form="add-stock-form" type="submit" className="btn-apple-primary w-full py-5 text-base shadow-xl shadow-[#050B18]/10">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Register Pantry Record'}
                 </button>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default KitchenSystem;
