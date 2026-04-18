import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Bed, Clock, 
  ChevronUp, MoreVertical, Loader2
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
      recentArrivals = resData.filter(r => r.status === 'Checked-in').slice(0, 3);
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
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <TrendingUp />, label: 'Total Revenue', value: loading ? '...' : `$${stats.revenue.toLocaleString()}`, trend: '+12.5%', color: 'text-green-500' },
          { icon: <Users />, label: 'Active Guests', value: loading ? '...' : stats.guests.toString(), trend: '+5.2%', color: 'text-blue-500' },
          { icon: <Bed />, label: 'Occupancy Rate', value: loading ? '...' : `${stats.occupancy}%`, trend: '+3.1%', color: 'text-luxury-gold' },
          { icon: <Clock />, label: 'Staff Efficiency', value: loading ? '...' : `${stats.efficiency}%`, trend: '+1.4%', color: 'text-orange-500' },
        ].map((stat, i) => (
          <GlassCard key={i} className="flex items-center gap-6 bg-white border-gray-100 shadow-sm" variant="light">
            <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
              <div className="w-5 h-5">{stat.icon}</div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                 {loading ? <Loader2 className="w-4 h-4 animate-spin text-gray-300 mt-2"/> : <h3 className="text-2xl font-bold">{stat.value}</h3>}
                 {!loading && <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                   {stat.trend}
                 </span>}
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
             {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-luxury-gold"/></div>
             ) : (
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
                  {rooms.map((room) => {
                    let statusColor = 'bg-green-50 text-green-600 border-green-100'; // Vacant
                    if (room.status === 'Occupied') statusColor = 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20 hover:bg-luxury-gold/20';
                    else if (room.status === 'Maintenance') statusColor = 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100';
                    else if (room.status === 'Cleaning') statusColor = 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100';
                    
                    if (room.occupancy === 'Dirty' && room.status === 'Vacant') {
                        statusColor = 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100';
                    }

                    return (
                      <motion.div 
                        key={room.id} 
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        className={`aspect-square rounded-lg md:rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm ${statusColor}`}
                        title={`${room.number} - ${room.status}`}
                      >
                        <span className="text-[10px] md:text-xs font-bold">{room.number}</span>
                      </motion.div>
                    );
                  })}
                </div>
             )}
          </GlassCard>
        </div>

        <div className="space-y-8">
           <GlassCard className="bg-white border-gray-100 p-8">
              <h3 className="text-xl font-bold mb-8 font-serif">Recent Arrivals</h3>
              <div className="space-y-6">
                 {arrivals.length === 0 ? (
                    <p className="text-gray-400 text-sm font-medium italic text-center py-6">No recent arrivals.</p>
                 ) : arrivals.map((guest, i) => (
                   <div key={i} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-xs">
                            {guest.guest_name.split(' ').map(n => n[0]).join('')}
                         </div>
                         <div>
                            <p className="text-sm font-bold">{guest.guest_name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{guest.room_type} • Checked In</p>
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
