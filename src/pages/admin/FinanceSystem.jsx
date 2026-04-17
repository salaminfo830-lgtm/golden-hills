import React from 'react';
import { 
  BarChart3, PieChart, TrendingUp, TrendingDown, 
  DollarSign, FileText, Download, Filter,
  ArrowUpRight, ArrowDownRight, CreditCard
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';
import { motion } from 'framer-motion';

const FinanceSystem = () => {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold">Financial Treasury</h2>
          <p className="text-gray-400 font-medium">Monitoring revenue, expenses, and growth</p>
        </div>
        <div className="flex gap-4">
           <GoldButton outline className="flex items-center gap-2 px-6 border-gray-200 text-gray-800 hover:text-white">
             <Download className="w-4 h-4" /> EXPORT PDF
           </GoldButton>
           <GoldButton className="px-8">CREATE INVOICE</GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Weekly Revenue', value: '$84,200', trend: '+14%', up: true, icon: <TrendingUp className="text-green-500" /> },
           { label: 'Operating Costs', value: '$12,450', trend: '-5%', up: false, icon: <TrendingDown className="text-red-500" /> },
           { label: 'Net Profit Margin', value: '62.4%', trend: '+8%', up: true, icon: <TrendingUp className="text-green-500" /> },
         ].map((stat, i) => (
            <GlassCard key={i} className="bg-white border-gray-100 p-8 shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-gray-50">{stat.icon}</div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.trend}
                  </div>
               </div>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
            </GlassCard>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <GlassCard className="bg-white border-gray-100 p-8">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-bold">Revenue Flow</h3>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                     <button className="px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg bg-white shadow-sm transition-all">Daily</button>
                     <button className="px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg text-gray-400 hover:text-luxury-black transition-all">Monthly</button>
                  </div>
               </div>
               {/* Multi-line Mock Chart */}
               <div className="h-72 relative">
                  <div className="absolute inset-0 flex items-end justify-between gap-1">
                     {Array.from({ length: 30 }).map((_, i) => (
                        <motion.div 
                           key={i}
                           initial={{ height: 0 }}
                           animate={{ height: `${20 + Math.random() * 80}%` }}
                           transition={{ duration: 1.5, delay: i * 0.02 }}
                           className={`w-full rounded-t-sm ${i > 20 ? 'gold-gradient opacity-100' : 'bg-gray-100 opacity-40'}`}
                        />
                     ))}
                  </div>
               </div>
            </GlassCard>
         </div>

         <div className="space-y-8">
            <GlassCard className="bg-luxury-black text-white p-8">
               <h3 className="text-xl font-bold mb-8">Revenue by Source</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Room Bookings', val: 65, color: 'bg-luxury-gold' },
                    { label: 'Food & Beverage', val: 20, color: 'bg-luxury-gold-shimmer' },
                    { label: 'Spa & Wellness', val: 15, color: 'bg-white/20' },
                  ].map((item, i) => (
                    <div key={i}>
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                          <span>{item.label}</span>
                          <span className="text-luxury-gold">{item.val}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${item.val}%` }}
                             transition={{ duration: 1, delay: i * 0.2 }}
                             className={`h-full ${item.color}`}
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>

            <GlassCard className="bg-white border-gray-100 p-8">
               <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
               <div className="space-y-4">
                  {[
                    { desc: 'Room 302 - Extension', amt: '+$890.00', date: 'Just now' },
                    { desc: 'Supplier: Lavazza Coffee', amt: '-$1,200.00', date: '2h ago' },
                    { desc: 'Booking #99211', amt: '+$450.00', date: '5h ago' },
                  ].map((tx, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                       <div>
                          <p className="text-sm font-bold">{tx.desc}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">{tx.date}</p>
                       </div>
                       <p className={`text-sm font-bold ${tx.amt.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{tx.amt}</p>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-bold text-gray-400 hover:text-luxury-gold hover:border-luxury-gold transition-all uppercase tracking-widest">
                  View Full Ledger
               </button>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

export default FinanceSystem;
