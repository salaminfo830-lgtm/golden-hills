import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Bed, Clock, 
  ChevronUp, AlertCircle, MoreVertical
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';

const AnalyticsOverview = () => {
  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <TrendingUp />, label: 'Total Revenue', value: '$124,500', trend: '+12.5%', color: 'text-green-500' },
          { icon: <Users />, label: 'Active Guests', value: '342', trend: '+5.2%', color: 'text-blue-500' },
          { icon: <Bed />, label: 'Occupancy Rate', value: '88%', trend: '+3.1%', color: 'text-luxury-gold' },
          { icon: <Clock />, label: 'Staff Efficiency', value: '94%', trend: '+1.4%', color: 'text-orange-500' },
        ].map((stat, i) => (
          <GlassCard key={i} className="flex items-center gap-6 bg-white border-gray-100 shadow-sm" variant="light">
            <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
              <div className="w-5 h-5">{stat.icon}</div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <GlassCard className="bg-white border-gray-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h3 className="text-xl font-bold font-serif">Revenue Analytics</h3>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Real-time performance</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-2 text-[10px] font-bold rounded-xl border border-gray-100 text-gray-400">Week</button>
                <button className="flex-1 md:flex-none px-6 py-2 text-[10px] font-bold rounded-xl bg-luxury-black text-white">Month</button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
               {[40, 65, 45, 90, 65, 80, 55, 100, 85, 75, 40, 60].map((val, i) => (
                 <div key={i} className="flex-1 group relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className={`w-full rounded-t-lg md:rounded-t-xl transition-all ${i === 7 ? 'gold-gradient shadow-lg shadow-luxury-gold/30' : 'bg-gray-100 group-hover:bg-luxury-gold/10'}`}
                    />
                 </div>
               ))}
            </div>
          </GlassCard>

          {/* Room Grid */}
          <GlassCard className="bg-white border-gray-100 p-6 md:p-8">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold font-serif">Room Grid</h3>
                <span className="text-luxury-gold text-[10px] font-bold flex items-center gap-2 cursor-pointer hover:underline uppercase tracking-widest transition-all">
                  Floor Map <ChevronUp className="w-4 h-4 translate-y-[1px]" />
                </span>
             </div>
             <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
                {Array.from({ length: 30 }).map((_, i) => {
                  const states = ['vacant', 'occupied', 'dirty', 'maintenance'];
                  const status = states[Math.floor(Math.random() * 4)];
                  const colors = {
                    vacant: 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100',
                    occupied: 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20 hover:bg-luxury-gold/20',
                    dirty: 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100',
                    maintenance: 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                  };
                  return (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      className={`aspect-square rounded-lg md:rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm ${colors[status]}`}
                    >
                      <span className="text-[10px] md:text-xs font-bold">{101 + i}</span>
                    </motion.div>
                  );
                })}
             </div>
          </GlassCard>
        </div>

        <div className="space-y-8">
           <GlassCard className="bg-white border-gray-100 p-8">
              <h3 className="text-xl font-bold mb-8 font-serif">Recent Arrivals</h3>
              <div className="space-y-6">
                 {['Sarah Benali', 'John Miller', 'Moussa Brahimi'].map((guest, i) => (
                   <div key={i} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-xs">
                            {guest.split(' ').map(n => n[0]).join('')}
                         </div>
                         <div>
                            <p className="text-sm font-bold">{guest}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Suite 104 • Checked In</p>
                         </div>
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-300" />
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 rounded-xl border border-dashed border-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:border-luxury-gold hover:text-luxury-gold transition-all">
                 View All Arrivals
              </button>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
