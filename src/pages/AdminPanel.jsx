import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import { 
  TrendingUp, Users, Bed, CreditCard, 
  Clock, Package, AlertCircle, ChevronUp,
  MapPin, Calendar, CheckCircle2, MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  return (
    <DashboardLayout userType="Admin">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <TrendingUp />, label: 'Total Revenue', value: '$124,500', trend: '+12.5%', color: 'text-green-500' },
          { icon: <Users />, label: 'Active Guests', value: '342', trend: '+5.2%', color: 'text-blue-500' },
          { icon: <Bed />, label: 'Occupancy Rate', value: '88%', trend: '+3.1%', color: 'text-luxury-gold' },
          { icon: <Clock />, label: 'Pending Check-ins', value: '18', trend: '-2.4%', color: 'text-orange-500' },
        ].map((stat, i) => (
          <GlassCard key={i} className="flex items-center gap-6 border-gray-200 shadow-sm bg-white" variant="light">
            <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart System - Finance Integration */}
        <div className="xl:col-span-2 space-y-8">
          <GlassCard className="bg-white border-gray-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold">Revenue Analytics</h3>
                <p className="text-gray-400 text-sm">Monthly performance overview</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Monthly</button>
                <button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-luxury-black text-white">Yearly</button>
              </div>
            </div>
            
            {/* Mock Chart Visualization */}
            <div className="h-64 flex items-end justify-between gap-4 px-4">
               {[40, 65, 45, 90, 65, 80, 55, 100, 85, 75, 40, 60].map((val, i) => (
                 <div key={i} className="flex-1 group relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className={`w-full rounded-t-lg transition-all ${i === 7 ? 'gold-gradient shadow-lg shadow-luxury-gold/30' : 'bg-gray-100 group-hover:bg-gray-200'}`}
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-luxury-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${val}k
                    </div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </GlassCard>

          {/* Integrated System: Housekeeping & Room Status */}
          <GlassCard className="bg-white border-gray-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Room Management System</h3>
                <span className="text-luxury-gold text-sm font-bold flex items-center gap-1 cursor-pointer">Live Map <ChevronUp className="w-4 h-4" /></span>
             </div>
             <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {Array.from({ length: 24 }).map((_, i) => {
                  const states = ['vacant', 'occupied', 'dirty', 'maintenance'];
                  const status = states[Math.floor(Math.random() * 4)];
                  const colors = {
                    vacant: 'bg-green-100 text-green-600 border-green-200',
                    occupied: 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20',
                    dirty: 'bg-orange-100 text-orange-600 border-orange-200',
                    maintenance: 'bg-red-100 text-red-600 border-red-200'
                  };

                  return (
                    <div key={i} className={`aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform ${colors[status]}`}>
                      <span className="text-sm font-bold">{301 + i}</span>
                      <div className="w-1 h-1 rounded-full bg-current mt-1" />
                    </div>
                  );
                })}
             </div>
             <div className="mt-6 flex flex-wrap gap-6 border-t pt-6 border-gray-100">
                <div className="flex items-center gap-2 text-xs font-medium"><div className="w-3 h-3 rounded bg-green-500" /> Vacant</div>
                <div className="flex items-center gap-2 text-xs font-medium"><div className="w-3 h-3 rounded bg-luxury-gold" /> Occupied</div>
                <div className="flex items-center gap-2 text-xs font-medium"><div className="w-3 h-3 rounded bg-orange-500" /> Dirty</div>
                <div className="flex items-center gap-2 text-xs font-medium"><div className="w-3 h-3 rounded bg-red-500" /> Maintenance</div>
             </div>
          </GlassCard>
        </div>

        {/* Sidebar Systems: Guests & Recent Activities */}
        <div className="space-y-8">
           {/* Integrated System: Reservation Hub */}
           <GlassCard className="bg-white border-gray-200">
              <h3 className="text-xl font-bold mb-6">Recent Reservations</h3>
              <div className="space-y-6">
                 {[
                   { name: 'Sarah Benali', room: 'Suite 405', status: 'Confirmed', time: '2 mins ago' },
                   { name: 'John Miller', room: 'Deluxe 202', status: 'Pending', time: '1 hour ago' },
                   { name: 'Moussa Brahimi', room: 'Royal 001', status: 'Arrived', time: '3 hours ago' },
                   { name: 'Emma Wilson', room: 'Deluxe 210', status: 'Confirmed', time: '5 hours ago' },
                 ].map((res, i) => (
                   <div key={i} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${res.name}`} alt={res.name} />
                         </div>
                         <div>
                            <p className="font-bold text-sm">{res.name}</p>
                            <p className="text-xs text-gray-400">{res.room}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                           res.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 
                           res.status === 'Arrived' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                         }`}>
                           {res.status}
                         </span>
                         <p className="text-[10px] text-gray-300 mt-1 uppercase font-bold">{res.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold hover:border-luxury-gold hover:text-luxury-gold transition-colors">
                 VIEW ALL RESERVATIONS
              </button>
           </GlassCard>

           {/* Integrated System: Maintenance/Alerts */}
           <GlassCard className="bg-luxury-gold/5 border-luxury-gold/20">
              <div className="flex items-center gap-3 mb-6">
                 <AlertCircle className="text-luxury-gold" />
                 <h3 className="text-xl font-bold">Maintenance Alerts</h3>
              </div>
              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-white border border-luxury-gold/10 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 gold-gradient" />
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">Kitchen System</p>
                          <p className="font-bold text-sm">Industrial Oven Failure</p>
                       </div>
                       <span className="text-[10px] bg-red-50 text-red-500 font-bold px-2 py-1 rounded">URGENT</span>
                    </div>
                 </div>
                 <div className="p-4 rounded-xl bg-white border border-luxury-gold/10 shadow-sm">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Room 204</p>
                    <p className="font-bold text-sm">AC Unit leaking water</p>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
