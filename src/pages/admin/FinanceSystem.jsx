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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Financial Treasury</h2>
          <p className="text-gray-400 font-medium tracking-wide text-sm font-semibold">Monitoring revenue, expenses, and growth</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 border-gray-100 text-gray-800 hover:text-white group transition-all">
             <Download className="w-4 h-4 group-hover:scale-110 transition-transform" /> EXPORT PDF
           </GoldButton>
           <GoldButton className="flex-1 md:flex-none px-8 py-3">INVOICE</GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
         {[
           { label: 'Weekly Revenue', value: '$84,200', trend: '+14%', up: true, icon: <TrendingUp className="text-green-500" /> },
           { label: 'Operating Costs', value: '$12,450', trend: '-5%', up: false, icon: <TrendingDown className="text-red-500" /> },
           { label: 'Net Profit Margin', value: '62.4%', trend: '+8%', up: true, icon: <TrendingUp className="text-green-500" /> },
         ].map((stat, i) => (
            <GlassCard key={i} className="bg-white border-gray-100 p-6 md:p-8 shadow-sm group">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3.5 rounded-2xl bg-gray-50 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                    <div className="w-5 h-5">{stat.icon}</div>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </div>
               </div>
               <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</h3>
            </GlassCard>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <GlassCard className="bg-white border-gray-100 p-6 md:p-8">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                  <h3 className="text-xl font-bold font-serif">Revenue Flow</h3>
                  <div className="flex gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-full md:w-auto">
                     <button className="flex-1 md:flex-none px-6 py-2 text-[10px] font-bold uppercase rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-all">Daily</button>
                     <button className="flex-1 md:flex-none px-6 py-2 text-[10px] font-bold uppercase rounded-xl text-gray-400 hover:text-luxury-black transition-all">Monthly</button>
                  </div>
               </div>
               {/* Multi-line Mock Chart */}
               <div className="h-64 md:h-72 relative">
                  <div className="absolute inset-0 flex items-end justify-between gap-1">
                     {Array.from({ length: 30 }).map((_, i) => (
                        <motion.div 
                           key={i}
                           initial={{ height: 0 }}
                           animate={{ height: `${20 + Math.random() * 80}%` }}
                           transition={{ duration: 1.5, delay: i * 0.02 }}
                           className={`w-full rounded-t-sm ${i > 22 ? 'gold-gradient' : 'bg-gray-100 group-hover:bg-luxury-gold/10'}`}
                        />
                     ))}
                  </div>
               </div>
            </GlassCard>
         </div>

         <div className="space-y-8">
            <GlassCard className="bg-luxury-black text-white p-8">
               <h3 className="text-xl font-bold mb-10 font-serif">Operational Matrix</h3>
               <div className="space-y-8">
                  {[
                    { label: 'Room Bookings', val: 65, color: 'gold-gradient' },
                    { label: 'Food & Beverage', val: 20, color: 'bg-white/40' },
                    { label: 'Spa & Wellness', val: 15, color: 'bg-white/10' },
                  ].map((item, i) => (
                    <div key={i}>
                       <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                          <span className="text-white/60">{item.label}</span>
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
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-luxury-gold/5 flex items-center justify-center text-luxury-gold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Monthly Report</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Ready for download</p>
                  </div>
               </div>
               <GoldButton outline className="w-full py-4 text-[10px] tracking-widest">GET FINANCIAL AUDIT</GoldButton>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

export default FinanceSystem;
