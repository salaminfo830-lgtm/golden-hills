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
    if (stock) setStockAlerts(stock);
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
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Kitchen Operations</h2>
          <p className="text-gray-400 font-medium tracking-wide">Live order flow & pantry synchronization</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline onClick={() => setShowStockModal(true)} className="flex-1 md:flex-none py-3 px-6 text-[10px]"><Plus className="w-4 h-4 inline mr-1" /> STOCK</GoldButton>
           <GoldButton onClick={() => setShowOrderModal(true)} className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2">
             <Inbox className="w-4 h-4" /> NEW ORDER
           </GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Orders Column */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="font-bold font-serif text-lg flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-luxury-gold" /> Active Queue
               </h3>
               {loading && <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <AnimatePresence mode="popLayout">
                  {activeOrders.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                       <p className="text-gray-400 font-medium">Kitchen is clear. No pending orders.</p>
                    </div>
                  ) : activeOrders.map((order) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={order.id}
                    >
                       <GlassCard className="bg-white border-gray-100 p-8 hover:border-luxury-gold/30 transition-all">
                          <div className="flex justify-between items-start mb-6">
                             <div>
                                <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${getPriorityColor(order.priority)}`}>
                                   {order.priority} Priority
                                </span>
                                <h4 className="text-2xl font-serif font-bold mt-3">Table {order.table_id}</h4>
                             </div>
                             <div className="p-3 bg-gray-50 rounded-2xl text-luxury-gold">
                                <Timer className="w-5 h-5" />
                             </div>
                          </div>

                          <div className="space-y-3 mb-8">
                             {Array.isArray(order.items) && order.items.map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center text-sm">
                                  <span className="font-medium text-gray-700">{item}</span>
                                  <CheckCircle2 className="w-4 h-4 text-gray-100 hover:text-green-500 cursor-pointer transition-colors" />
                                </div>
                             ))}
                          </div>

                          <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" /> {new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                             <button onClick={() => handleMarkReady(order.id)} className="text-[10px] font-bold text-luxury-gold uppercase tracking-tighter hover:underline">Mark Ready</button>
                          </div>
                       </GlassCard>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>

         {/* Stock & Alerts Column */}
         <div className="space-y-8">
            <GlassCard className="bg-white border-gray-100 p-8 shadow-sm">
               <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" /> Stock Monitor
               </h3>
               <div className="space-y-6">
                  {stockAlerts.slice(0,6).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group relative">
                       <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'Critical' ? 'bg-red-500 animate-pulse' :
                            item.status === 'Low' ? 'bg-orange-500' : 'bg-green-500'
                          }`} />
                          <div>
                             <p className="font-bold text-sm text-gray-800">{item.name}</p>
                             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{item.category}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                         <span className="font-serif font-bold text-luxury-gold">{item.level}</span>
                         <button onClick={() => handleDeleteStock(item.id)} className="hidden group-hover:block text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    </div>
                  ))}
               </div>
               <GoldButton outline onClick={() => setShowStockModal(true)} className="w-full mt-8 py-3 text-[10px]">ADD STOCK ITEM</GoldButton>
            </GlassCard>

            <GlassCard className="gold-gradient text-white p-8">
               <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="text-white" />
                  <h3 className="font-bold">Hygiene Protocol</h3>
               </div>
               <p className="text-xs opacity-80 leading-relaxed mb-6">
                  Next standard health inspection scheduled for <span className="font-bold underline">Friday, Oct 23rd</span>. Please ensure logs are up-to-date.
               </p>
               <button className="text-[10px] font-bold uppercase underline">View Checklist</button>
            </GlassCard>
         </div>
      </div>

      <AnimatePresence>
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setShowOrderModal(false)} 
             className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
           />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-lg h-full bg-[#fafafa] shadow-2xl flex flex-col border-l border-luxury-gold/20"
           >
              <div className="p-8 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-2xl font-bold font-serif text-luxury-black">Add Kitchen Order</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Order Dispatch</p>
                 </div>
                 <button onClick={() => setShowOrderModal(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-luxury-black hover:bg-gray-100 transition-colors">
                   <X className="w-5 h-5"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                 <form id="add-order-form" onSubmit={handleAddOrder} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Table / Room ID</label>
                      <input required placeholder="e.g. Table 4" value={newOrder.table_id} onChange={e=>setNewOrder({...newOrder, table_id: e.target.value})} type="text" className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Items (comma separated)</label>
                      <textarea rows="4" required placeholder="e.g. 2x Wagyu Steak, 1x Cesar Salad" value={newOrder.items} onChange={e=>setNewOrder({...newOrder, items: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm resize-none"></textarea>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Priority Level</label>
                      <select value={newOrder.priority} onChange={e=>setNewOrder({...newOrder, priority: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm cursor-pointer appearance-none">
                        <option>Normal</option>
                        <option>High</option>
                      </select>
                    </div>
                 </form>
              </div>
              <div className="p-8 bg-white border-t border-gray-100 shrink-0">
                 <GoldButton form="add-order-form" type="submit" className="w-full py-4 shadow-lg text-sm flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'DISPATCH TO KITCHEN'}
                 </GoldButton>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setShowStockModal(false)} 
             className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
           />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-lg h-full bg-[#fafafa] shadow-2xl flex flex-col border-l border-luxury-gold/20"
           >
              <div className="p-8 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-2xl font-bold font-serif text-luxury-black">Add Stock Item</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Pantry Management</p>
                 </div>
                 <button onClick={() => setShowStockModal(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-luxury-black hover:bg-gray-100 transition-colors">
                   <X className="w-5 h-5"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                 <form id="add-stock-form" onSubmit={handleAddStock} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Item Name / Ingredient</label>
                      <input required placeholder="e.g. Fresh Saffron" value={newStock.name} onChange={e=>setNewStock({...newStock, name: e.target.value})} type="text" className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Current Level</label>
                        <input required placeholder="e.g. 50kg" type="text" value={newStock.level} onChange={e=>setNewStock({...newStock, level: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Alert Status</label>
                        <select value={newStock.status} onChange={e=>setNewStock({...newStock, status: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm cursor-pointer appearance-none">
                          <option>Regular</option>
                          <option>Low</option>
                          <option>Critical</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Category</label>
                      <input required placeholder="e.g. Spices, Meat, Beverages" type="text" value={newStock.category} onChange={e=>setNewStock({...newStock, category: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                    </div>
                 </form>
              </div>
              <div className="p-8 bg-white border-t border-gray-100 shrink-0">
                 <GoldButton form="add-stock-form" type="submit" className="w-full py-4 shadow-lg text-sm flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SAVE PANTRY RECORD'}
                 </GoldButton>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
};

export default KitchenSystem;
