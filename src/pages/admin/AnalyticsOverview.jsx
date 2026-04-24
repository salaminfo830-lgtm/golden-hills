import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, Bed, Clock, 
  ChevronUp, MoreVertical, Loader2,
  DollarSign, Activity, Bell, Map,
  CheckCircle2, AlertTriangle, Filter,
  ArrowUpRight, ArrowDownRight, Zap,
  Briefcase, Coffee, Shield
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';

const AnalyticsOverview = () => {
  const [stats, setStats] = useState({ revenue: 0, guests: 0, occupancy: 0, efficiency: 0 });
  const [rooms, setRooms] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [securityStatus, setSecurityStatus] = useState({ lockdown_active: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

    const channels = [
      supabase.channel('analytics-room').on('postgres_changes', { event: '*', schema: 'public', table: 'Room' }, fetchAnalytics),
      supabase.channel('analytics-finance').on('postgres_changes', { event: '*', schema: 'public', table: 'FinanceTransaction' }, fetchAnalytics),
      supabase.channel('analytics-reservation').on('postgres_changes', { event: '*', schema: 'public', table: 'Reservation' }, fetchAnalytics),
      supabase.channel('analytics-staff').on('postgres_changes', { event: '*', schema: 'public', table: 'Staff' }, fetchAnalytics),
      supabase.channel('analytics-security-status').on('postgres_changes', { event: '*', schema: 'public', table: 'SecuritySystemStatus' }, (payload) => {
        if (payload.new && payload.new.id === 'current') {
           setSecurityStatus(payload.new);
        }
      })
    ];

    channels.forEach(ch => ch.subscribe());

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Security Status
      const { data: secData } = await supabase.from('SecuritySystemStatus').select('*').eq('id', 'current').single();
      if (secData) setSecurityStatus(secData);

      // Rooms
      const { data: roomData } = await supabase.from('Room').select('*').order('number', { ascending: true });
      
      // Revenue
      const { data: financeData } = await supabase.from('FinanceTransaction').select('value, type');
      let totalRevenue = 0;
      if (financeData) {
        financeData.forEach(tx => {
          if (tx.type === 'Revenue') totalRevenue += tx.value;
        });
      }

      // Active Guests & Arrivals
      const { data: resData } = await supabase.from('Reservation').select('*').order('created_at', { ascending: false });
      let totalGuests = 0;
      let recentArrivals = [];
      if (resData) {
        resData.forEach(res => {
          if (['Checked-in', 'Confirmed'].includes(res.status)) {
            totalGuests += res.guests_count;
          }
        });
        recentArrivals = resData.filter(r => r.status === 'Checked-in').slice(0, 5);
      }

      // Staff
      const { data: staffData } = await supabase.from('Staff').select('*');
      let efficiency = 0;
      if (staffData && staffData.length > 0) {
        const onShift = staffData.filter(s => s.status === 'On Shift').length;
        efficiency = Math.round((onShift / staffData.length) * 100);
      }

      // Occupancy
      let occRate = 0;
      if (roomData && roomData.length > 0) {
        const occupied = roomData.filter(r => r.status === 'Occupied').length;
        occRate = Math.round((occupied / roomData.length) * 100);
        setRooms(roomData);
      }

      setArrivals(recentArrivals);
      setStats({
        revenue: totalRevenue,
        guests: totalGuests,
        occupancy: occRate,
        efficiency: efficiency
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Syncing Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 font-apple">
      {/* Executive Command Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-100">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Intelligence Hub</span>
              <span className="text-gray-300">•</span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${securityStatus.lockdown_active ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                {securityStatus.lockdown_active ? 'System Lockdown' : 'Operational Flow: Nominal'}
              </span>
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-[#050B18] tracking-tighter">Executive Dashboard</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
           <button className="btn-apple-secondary flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto shadow-sm">
              <Filter className="w-5 h-5" /> <span className="text-[11px] uppercase tracking-widest font-bold">Perspective</span>
           </button>
           <button className="btn-apple-primary flex items-center justify-center gap-3 px-10 py-4 w-full sm:w-auto shadow-xl shadow-[#050B18]/10">
              <Zap className="w-5 h-5" /> <span className="text-[11px] uppercase tracking-widest font-bold">Sync Assets</span>
           </button>
        </div>
      </div>

      {/* Primary Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <DollarSign className="w-5 h-5" />, label: 'Portfolio Revenue', value: `${stats.revenue.toLocaleString()} DZD`, trend: '+14.2%', positive: true },
          { icon: <Users className="w-5 h-5" />, label: 'Active Residency', value: stats.guests.toString(), trend: '+3.1%', positive: true },
          { icon: <Bed className="w-5 h-5" />, label: 'Asset Utilization', value: `${stats.occupancy}%`, trend: '-0.8%', positive: false },
          { icon: <Activity className="w-5 h-5" />, label: 'Operational Sync', value: `${stats.efficiency}%`, trend: '+5.4%', positive: true },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="apple-card apple-card-hover p-8"
          >
            <div className="flex justify-between items-start mb-8">
               <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-[#C9A84C]">
                  {stat.icon}
               </div>
               <span className={`badge-apple ${stat.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {stat.trend}
               </span>
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-2xl font-bold text-[#050B18] tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Deep Analysis & Inventory */}
        <div className="xl:col-span-8 space-y-10">
          <div className="apple-card p-10">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                   <h3 className="text-xl font-bold text-[#050B18] tracking-tight">Capital Velocity</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Rolling 14-day projection</p>
                </div>
                <div className="flex bg-[#F5F5F7] p-1 rounded-xl">
                   {['Week', 'Month', 'Year'].map(t => (
                     <button key={t} className={`px-5 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${t === 'Month' ? 'bg-white text-[#050B18] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                       {t}
                     </button>
                   ))}
                </div>
             </div>
             
             <div className="h-72 flex items-end justify-between gap-4 px-2">
                {[45, 60, 40, 85, 95, 70, 110, 90, 105, 80, 85, 100, 75, 90].map((val, i) => (
                   <div key={i} className="flex-1 group relative flex flex-col items-center">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#050B18] text-white text-[8px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                         {val}%
                      </div>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${val * 0.6}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className={`w-full max-w-[8px] rounded-full transition-all duration-300 ${i === 6 ? 'bg-[#C9A84C]' : 'bg-[#F5F5F7] group-hover:bg-[#C9A84C]/40'}`}
                      />
                      <p className="mt-4 text-[7px] font-bold text-gray-300 uppercase tracking-tighter">D{i + 1}</p>
                   </div>
                ))}
             </div>
          </div>

          <div className="apple-card p-10">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                   <h3 className="text-xl font-bold text-[#050B18] tracking-tight">Fleet Integrity</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live room network topology</p>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                   {[
                     { color: 'bg-green-500', label: 'Nominal' },
                     { color: 'bg-[#C9A84C]', label: 'Engaged' },
                     { color: 'bg-red-500', label: 'Maintenance' },
                     { color: 'bg-orange-500', label: 'Transit' }
                   ].map(l => (
                     <div key={l.label} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${l.color}`} />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{l.label}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                {rooms.map((room) => {
                  const isOccupied = room.status === 'Occupied';
                  const isMaintenance = room.status === 'Maintenance';
                  const isCleaning = room.status === 'Cleaning' || (room.occupancy === 'Dirty' && room.status === 'Vacant');

                  return (
                    <motion.div 
                      key={room.id} 
                      whileHover={{ y: -3, scale: 1.1 }}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border ${
                        isOccupied ? 'bg-[#C9A84C]/5 border-[#C9A84C]/20' :
                        isMaintenance ? 'bg-red-50 border-red-100' :
                        isCleaning ? 'bg-orange-50 border-orange-100' :
                        'bg-[#F5F5F7] border-transparent hover:bg-white hover:border-[#C9A84C]/30'
                      }`}
                    >
                      <span className={`text-[10px] font-bold ${isOccupied ? 'text-[#C9A84C]' : isMaintenance ? 'text-red-500' : isCleaning ? 'text-orange-500' : 'text-[#050B18]'}`}>
                         {room.number}
                      </span>
                    </motion.div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Tactical Intel & VIP Stream */}
        <div className="xl:col-span-4 space-y-10">
           <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] px-4">Tactical Log</h4>
              <div className="space-y-4">
                 {[
                   { icon: <Briefcase className="w-4 h-4" />, title: 'Personnel Audit', desc: 'Sync shift leads', time: '14:00' },
                   { icon: <CheckCircle2 className="w-4 h-4" />, title: 'Logistics Clear', desc: 'Supply chain verified', time: '15:45' },
                   { icon: <Shield className="w-4 h-4" />, title: 'Encryption Cycle', desc: 'Security protocols updated', time: '00:00' },
                 ].map((item, i) => (
                   <div key={i} className="apple-card p-5 flex gap-5 cursor-pointer hover:bg-gray-50 group">
                      <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-[#C9A84C] group-hover:bg-[#050B18] group-hover:text-white transition-all">
                         {item.icon}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <h5 className="font-bold text-sm text-[#050B18]">{item.title}</h5>
                            <span className="text-[8px] font-bold text-gray-300 uppercase">{item.time}</span>
                         </div>
                         <p className="text-[11px] text-gray-400 font-medium mt-1 uppercase tracking-tight">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="apple-card bg-[#050B18] text-white p-10 relative overflow-hidden border-none shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/10 rounded-full blur-[80px] -translate-y-24 translate-x-24" />
              <div className="flex items-center justify-between mb-10 relative z-10">
                 <h3 className="text-xl font-bold tracking-tight">VIP Ledger</h3>
                 <Users className="w-5 h-5 text-[#C9A84C]" />
              </div>
              
              <div className="space-y-8 relative z-10">
                 {arrivals.length === 0 ? (
                    <div className="py-12 text-center border border-white/5 rounded-3xl bg-white/5">
                       <Shield className="w-8 h-8 text-white/10 mx-auto mb-4" />
                       <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Sector Clear</p>
                    </div>
                 ) : arrivals.map((guest, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A84C] font-bold text-xl transition-all group-hover:bg-[#C9A84C] group-hover:text-white">
                            {guest.guest_name?.[0]}
                         </div>
                         <div>
                            <p className="text-sm font-bold tracking-tight">{guest.guest_name}</p>
                            <p className="text-[10px] text-[#C9A84C] uppercase font-bold tracking-widest mt-1">Suite {guest.room_id}</p>
                         </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-[#C9A84C] transition-all" />
                   </div>
                 ))}
              </div>

              <button className="w-full mt-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-[#050B18] transition-all relative z-10">
                 Access Full Registry
              </button>
           </div>
        </div>
        </div>
      </div>
  );
};

export default AnalyticsOverview;
