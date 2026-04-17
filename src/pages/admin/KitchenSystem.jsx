import React from 'react';
import { Utensils, Clock, Flame, CheckCircle2, AlertTriangle, User, MoreVertical } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import { motion } from 'framer-motion';

const KitchenSystem = () => {
  const activeOrders = [
    { table: 'T-104', items: ['Z'Labia Setif', 'Traditional Couscous', 'Mint Tea'], status: 'Preparing', time: '12m', priority: 'High' },
    { table: 'Room 304', items: ['Continental Breakfast', 'Extra Espresso'], status: 'Cooking', time: '5m', priority: 'Normal' },
    { table: 'Bar-4', items: ['Mocktail Royal', 'Mixed Nuts'], status: 'Pending', time: '2m', priority: 'Low' },
    { table: 'T-202', items: ['Grilled Sea Bass', 'Saffron Rice'], status: 'Preparing', time: '18m', priority: 'High' },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Kitchen & Dining Board</h2>
          <p className="text-gray-400 font-medium">Real-time F&B operation tracking</p>
        </div>
        <div className="flex gap-4">
           <div className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-bold text-gray-700">Kitchen Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {activeOrders.map((order, i) => (
           <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
           >
              <GlassCard className={`relative overflow-hidden h-full border-l-8 ${order.priority === 'High' ? 'border-red-500' : 'border-luxury-gold'}`}>
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="text-2xl font-bold font-serif">{order.table}</h3>
                       <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{order.priority} Priority</p>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2 ${
                         order.status === 'Preparing' ? 'bg-orange-50 text-orange-500' : 
                         order.status === 'Cooking' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'
                       }`}>
                         {order.status}
                       </span>
                       <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="w-3 h-3" /> {order.time}
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-3 mb-8">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                         <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                         {item}
                      </div>
                    ))}
                 </div>

                 <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-[10px] font-bold uppercase tracking-widest text-gray-500">HOLD</button>
                    <button className="flex-1 py-2 rounded-xl gold-gradient text-white text-[10px] font-bold uppercase tracking-widest">READY</button>
                 </div>
              </GlassCard>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
             <GlassCard className="bg-white border-gray-100 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold">Restaurant Occupancy</h3>
                   <span className="text-xs font-bold text-luxury-gold cursor-pointer hover:underline">Manage Tables</span>
                </div>
                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-12 gap-4">
                   {Array.from({ length: 36 }).map((_, i) => {
                      const isOccupied = Math.random() > 0.4;
                      return (
                         <div key={i} className={`aspect-square rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                           isOccupied ? 'bg-luxury-gold/10 border-luxury-gold' : 'bg-gray-50 border-gray-100 opacity-40'
                         }`}>
                           <span className="text-[10px] font-bold">{30 + i}</span>
                           <Utensils className={`w-3 h-3 mt-1 ${isOccupied ? 'text-luxury-gold' : 'text-gray-300'}`} />
                         </div>
                      );
                   })}
                </div>
             </GlassCard>
         </div>

         <div className="space-y-8">
            <GlassCard className="bg-white border-gray-100 p-8">
               <h3 className="text-xl font-bold mb-6 italic font-serif">Kitchen Stock Alerts</h3>
               <div className="space-y-4">
                  {[
                    { item: 'Saffron Threads', level: 'Low (15g)', color: 'text-red-500' },
                    { item: 'Mint Leaves', level: 'Regular (2kg)', color: 'text-green-500' },
                    { item: 'Olive Oil (Premium)', level: 'Critical (5L)', color: 'text-red-500' },
                  ].map((stock, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                       <span className="text-sm font-bold text-gray-700">{stock.item}</span>
                       <span className={`text-[10px] font-bold uppercase tracking-tighter ${stock.color}`}>{stock.level}</span>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-3 border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-luxury-gold hover:border-luxury-gold transition-colors">
                  ORDER REPLENISHMENT
               </button>
            </GlassCard>

            <GlassCard className="bg-luxury-black text-white p-8">
               <div className="flex items-center gap-3 mb-6">
                  <Flame className="text-orange-500" />
                  <h3 className="font-bold">Staff On Duty (F&B)</h3>
               </div>
               <div className="space-y-4">
                  {['Chef Ahmed', 'Chef Leila', 'Sous Karim'].map((name, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shrink-0 italic text-[8px] flex items-center justify-center bg-white/5">IMG</div>
                       <span className="text-sm font-medium">{name}</span>
                       <span className="ml-auto text-[10px] font-bold text-luxury-gold uppercase px-2 py-1 glass rounded">Station {i+1}</span>
                    </div>
                  ))}
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

export default KitchenSystem;
