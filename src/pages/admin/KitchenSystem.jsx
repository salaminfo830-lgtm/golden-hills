import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, AlertCircle, CheckCircle2, 
  Flame, Inbox, Timer, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const KitchenSystem = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const { data: orders } = await supabase.from('KitchenOrder').select('*').order('created_at', { ascending: false });
    const { data: stock } = await supabase.from('StockItem').select('*');
    
    if (orders) setActiveOrders(orders);
    if (stock) setStockAlerts(stock);
    setLoading(false);
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return 'text-red-500 bg-red-50 border-red-100';
    if (p === 'Normal') return 'text-blue-500 bg-blue-50 border-blue-100';
    return 'text-gray-400 bg-gray-50 border-gray-100';
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Kitchen Operations</h2>
          <p className="text-gray-400 font-medium tracking-wide">Live order flow & pantry synchronization</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline className="flex-1 md:flex-none py-3 px-6 text-[10px] cursor-not-allowed opacity-50">STATION VIEW</GoldButton>
           <GoldButton className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2 cursor-not-allowed opacity-50">
             <Flame className="w-4 h-4" /> BUMP ALL
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
                             <button className="text-[10px] font-bold text-luxury-gold uppercase tracking-tighter hover:underline">Mark Ready</button>
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
                  {stockAlerts.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
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
                       <span className="font-serif font-bold text-luxury-gold">{item.level}</span>
                    </div>
                  ))}
               </div>
               <GoldButton outline className="w-full mt-8 py-3 text-[10px] cursor-not-allowed opacity-50">ORDER SUPPLIES</GoldButton>
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
    </div>
  );
};

export default KitchenSystem;
