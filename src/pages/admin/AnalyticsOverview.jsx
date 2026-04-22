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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

    const channels = [
      supabase.channel('public:Room').on('postgres_changes', { event: '*', schema: 'public', table: 'Room' }, fetchAnalytics),
      supabase.channel('public:FinanceTransaction').on('postgres_changes', { event: '*', schema: 'public', table: 'FinanceTransaction' }, fetchAnalytics),
      supabase.channel('public:Reservation').on('postgres_changes', { event: '*', schema: 'public', table: 'Reservation' }, fetchAnalytics),
      supabase.channel('public:Staff').on('postgres_changes', { event: '*', schema: 'public', table: 'Staff' }, fetchAnalytics)
    ];

    channels.forEach(ch => ch.subscribe());

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
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
    <div className="space-y-12">
      {/* Dynamic Command Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-12 border-b border-gray-100">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-[8px] font-bold uppercase tracking-widest rounded-full border border-luxury-gold/20">Executive Suite</span>
              <span className="text-gray-300">•</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Status: Active</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-serif font-bold text-luxury-black tracking-tight">Intelligence Hub</h1>
           <p className="text-gray-400 font-medium mt-3 text-lg italic">"Precision metrics for the Golden Hills sanctuary operations."</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
              <Filter className="w-4 h-4 text-luxury-gold" /> Filter Logic
           </button>
           <button className="flex items-center gap-3 px-8 py-4 bg-luxury-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-black/90 transition-all shadow-xl">
              <Zap className="w-4 h-4 text-luxury-gold" /> Deploy Order
           </button>
        </div>
      </div>

      {/* Elite KPI Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: <DollarSign />, label: 'Capital Flow', value: formatPrice(stats.revenue), trend: '+14.2%', positive: true, sub: 'Daily Yield' },
          { icon: <Users />, label: 'Active Presence', value: stats.guests.toString(), trend: '+3.1%', positive: true, sub: 'In-House' },
          { icon: <Bed />, label: 'Property Load', value: `${stats.occupancy}%`, trend: '-0.8%', positive: false, sub: 'Occupancy' },
          { icon: <Activity />, label: 'Service Force', value: `${stats.efficiency}%`, trend: '+5.4%', positive: true, sub: 'Efficiency' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:border-luxury-gold/30 transition-all"
          >
            <div className="flex justify-between items-start mb-10 relative z-10">
               <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-all duration-500">
                  {stat.icon}
               </div>
               <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold transition-all ${stat.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
               </div>
            </div>
            <div className="space-y-1 relative z-10">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{stat.label}</p>
               <h3 className="text-3xl font-serif font-bold text-luxury-black">{stat.value}</h3>
               <p className="text-[9px] font-bold text-luxury-gold/50 uppercase tracking-widest">{stat.sub}</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl group-hover:bg-luxury-gold/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Visual Analytics */}
        <div className="xl:col-span-8 space-y-12">
          <GlassCard className="bg-white border-gray-100 p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                <div>
                   <h3 className="text-2xl font-serif font-bold text-luxury-black">Yield Performance</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-1">7-Day Revenue Matrix</p>
                </div>
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                   <button className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-white hover:shadow-sm text-gray-400 hover:text-luxury-black">Weekly</button>
                   <button className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all bg-luxury-black text-white shadow-lg">Monthly</button>
                </div>
             </div>
             
             <div className="h-80 flex items-end justify-between gap-4 px-2 relative z-10">
                {[55, 40, 75, 90, 65, 100, 85, 95, 70, 80, 60, 90].map((val, i) => (
                  <div key={i} className="flex-1 group relative flex flex-col items-center">
                     <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${val}%` }}
                       transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                       className={`w-full max-w-[14px] rounded-full transition-all duration-500 relative ${i === 5 ? 'gold-gradient shadow-gold' : 'bg-luxury-cream/50 group-hover:bg-luxury-gold/30'}`}
                     >
                        {i === 5 && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-luxury-black text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                             Peak Yield
                          </div>
                        )}
                     </motion.div>
                     <p className="mt-4 text-[8px] font-bold text-gray-300 uppercase tracking-tighter">Day {i + 1}</p>
                  </div>
                ))}
             </div>
             {/* Background Subtle Grid Lines */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-col justify-between p-10 pt-32 pb-24">
                {[1,2,3,4,5].map(i => <div key={i} className="w-full h-px bg-luxury-black" />)}
             </div>
          </GlassCard>

          {/* Precision Inventory Management */}
          <GlassCard className="bg-white border-gray-100 p-10 rounded-[3rem] shadow-sm">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                   <h3 className="text-2xl font-serif font-bold text-luxury-black">Live Inventory Grid</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-1">Real-time Suite Logistics</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Vacant</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-luxury-gold shadow-gold" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Occupied</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Maintenance</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {rooms.map((room) => {
                  const isOccupied = room.status === 'Occupied';
                  const isMaintenance = room.status === 'Maintenance';
                  const isCleaning = room.status === 'Cleaning' || (room.occupancy === 'Dirty' && room.status === 'Vacant');

                  return (
                    <motion.div 
                      key={room.id} 
                      whileHover={{ scale: 1.1, zIndex: 10, y: -5 }}
                      className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm relative group overflow-hidden ${
                        isOccupied ? 'bg-luxury-gold/5 border-luxury-gold/30' :
                        isMaintenance ? 'bg-red-50 border-red-100' :
                        isCleaning ? 'bg-orange-50 border-orange-100' :
                        'bg-white border-gray-100 hover:border-luxury-gold/40'
                      }`}
                    >
                      <span className={`text-[11px] font-bold ${isOccupied ? 'text-luxury-gold' : isMaintenance ? 'text-red-500' : isCleaning ? 'text-orange-500' : 'text-gray-400 group-hover:text-luxury-black'}`}>
                         {room.number}
                      </span>
                      <div className={`absolute bottom-1 w-1 h-1 rounded-full ${
                        isOccupied ? 'bg-luxury-gold' :
                        isMaintenance ? 'bg-red-500' :
                        isCleaning ? 'bg-orange-500' :
                        'bg-green-500'
                      }`} />
                    </motion.div>
                  );
                })}
             </div>
          </GlassCard>
        </div>

        {/* Sidebar Ops Intelligence */}
        <div className="xl:col-span-4 space-y-12">
           {/* Directives Section */}
           <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] pl-6">Active Directives</h4>
              <div className="space-y-4">
                 {[
                   { icon: <Briefcase />, title: 'Personnel Sync', desc: 'Q3 Staff audit required', time: '14:00' },
                   { icon: <Coffee />, title: 'VIP Reception', desc: 'Gold Suite arrival', time: '16:30' },
                   { icon: <Shield />, title: 'System Patch', desc: 'GHE-4 Security update', time: '00:00' },
                 ].map((item, i) => (
                   <GlassCard key={i} className="bg-white p-6 border-gray-100 group cursor-pointer hover:border-luxury-gold/30 transition-all">
                      <div className="flex gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-luxury-cream/50 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-all">
                            {item.icon}
                         </div>
                         <div>
                            <div className="flex justify-between items-center w-full mb-1">
                               <h5 className="font-bold text-sm">{item.title}</h5>
                               <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{item.time}</span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                         </div>
                      </div>
                   </GlassCard>
                 ))}
              </div>
           </div>

           {/* Arrival Stream */}
           <GlassCard className="bg-luxury-black text-white p-10 rounded-[3rem] border-0 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-luxury-gold/10 rounded-full blur-[80px] -translate-y-24 translate-x-24" />
              <h3 className="text-2xl font-serif font-bold mb-10 relative z-10">Elite Arrivals</h3>
              
              <div className="space-y-8 relative z-10">
                 {arrivals.length === 0 ? (
                    <div className="py-12 text-center">
                       <p className="text-white/20 text-xs font-bold uppercase tracking-widest italic">No Live Arrivals Recorded</p>
                    </div>
                 ) : arrivals.map((guest, i) => (
                   <div key={i} className="flex items-center justify-between pb-8 border-b border-white/5 last:border-0 last:pb-0 group">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-luxury-gold font-serif font-bold text-xl transition-all group-hover:bg-luxury-gold group-hover:text-white">
                            {guest.guest_name?.[0]}
                         </div>
                         <div>
                            <p className="text-sm font-bold tracking-wide">{guest.guest_name}</p>
                            <p className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em] mt-1">{guest.room_type} • Room {guest.room_id}</p>
                         </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-luxury-gold transition-all">
                         <ChevronUp className="w-4 h-4 rotate-90" />
                      </div>
                   </div>
                 ))}
              </div>

              <button className="w-full mt-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-luxury-gold hover:text-white hover:border-luxury-gold transition-all duration-500">
                 View Global Register
              </button>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
