import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, Key, LogIn, LogOut,
  Search, Plus, Bell, Clock, MapPin, 
  ChevronRight, BadgeCheck, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const FrontDeskDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Today');

  useEffect(() => {
    fetchReservations();
    
    const subscription = supabase
      .channel('public:Reservation')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Reservation' }, () => fetchReservations())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from('Reservation')
      .select('*, room:Room(*)')
      .order('start_date', { ascending: true });
    
    if (data) {
      setReservations(data);
    }
    setLoading(false);
  };

  const handleCheckIn = async (id) => {
    const { error } = await supabase
      .from('Reservation')
      .update({ status: 'Checked In' })
      .eq('id', id);
    
    if (!error) {
       fetchReservations();
    }
  };

  const stats = [
    { label: 'Expected Arrivals', value: reservations.filter(r => r.status === 'Confirmed').length, icon: <LogIn className="text-luxury-gold" /> },
    { label: 'Stay-overs', value: reservations.filter(r => r.status === 'Checked In').length, icon: <Key className="text-blue-500" /> },
    { label: 'Departures', value: reservations.filter(r => r.status === 'Departing').length, icon: <LogOut className="text-orange-500" /> },
  ];

  return (
    <div className="space-y-10 font-apple">
      {/* Apple-Style Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">Front Desk</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Live Operations</span>
          </div>
          <h2 className="text-3xl font-bold text-[#050B18] tracking-tight">Reception Manifesto</h2>
        </div>
        <div className="flex gap-3">
           <button onClick={() => navigate('/search')} className="btn-apple-secondary px-6 py-3">WALK-IN</button>
           <button onClick={() => navigate('/admin/reservations')} className="btn-apple-primary flex items-center gap-2 px-8 py-3">
              <Plus className="w-4 h-4" /> <span>Create Booking</span>
           </button>
        </div>
      </div>

      {/* Stats Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.map((stat, i) => (
            <div key={i} className="apple-card apple-card-hover p-6">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center">
                     {stat.icon}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> LIVE
                  </div>
               </div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-2xl font-bold text-[#050B18]">{stat.value}</h3>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Live Guest Feed */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold text-[#050B18]">Guest Manifesto</h3>
               <div className="flex bg-[#F5F5F7] p-1 rounded-xl">
                  {['Today', 'Upcoming', 'Recent'].map(f => (
                     <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-[#050B18] shadow-sm' : 'text-gray-400'}`}
                     >
                        {f}
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               {loading ? (
                  <div className="apple-card p-20 flex flex-col items-center justify-center">
                     <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#C9A84C]" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Syncing Guest Ledger...</p>
                  </div>
               ) : reservations.length === 0 ? (
                  <div className="apple-card p-20 flex flex-col items-center justify-center">
                     <Users className="w-12 h-12 mx-auto mb-4 text-gray-100" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No activity recorded</p>
                  </div>
               ) : reservations.map((guest) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={guest.id}
                    className="apple-card apple-card-hover p-6 flex items-center gap-6 cursor-pointer group"
                  >
                     <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] overflow-hidden flex-shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guest.guest_name}`} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1.5">
                           <h5 className="font-bold text-[#050B18] group-hover:text-[#C9A84C] transition-colors">{guest.guest_name}</h5>
                           <span className={`badge-apple ${
                              guest.status === 'Checked In' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-[#C9A84C]/5 text-[#C9A84C] border-[#C9A84C]/20'
                           }`}>
                              {guest.status}
                           </span>
                        </div>
                        <div className="flex items-center gap-5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                           <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Suite {guest.room?.number || '---'}</span>
                           <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {guest.guests_count} Pax</span>
                           <span className="flex items-center gap-1.5 text-[#C9A84C]/70"><Clock className="w-3.5 h-3.5" /> 14:00 Arrival</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        {guest.status !== 'Checked In' && (
                           <button 
                              onClick={(e) => { e.stopPropagation(); handleCheckIn(guest.id); }}
                              className="btn-apple-primary px-5 py-2 text-[10px]"
                           >
                              Check-In
                           </button>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#C9A84C] transition-all" />
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Sidebar Operations */}
         <div className="space-y-8">
            <div className="apple-card bg-[#050B18] text-white p-8 relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-[60px] translate-x-12 translate-y-12" />
               <h4 className="text-lg font-bold mb-6 relative z-10">Daily Operations</h4>
               <div className="space-y-4 relative z-10">
                  {[
                    { label: 'Night Audit Report', time: '02:00 AM' },
                    { label: 'Room Assignments', time: '09:30 AM' },
                    { label: 'Concierge Briefing', time: '10:00 AM' },
                  ].map((op, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                        <span className="text-xs font-medium text-white/70">{op.label}</span>
                        <span className="text-[10px] font-bold text-[#C9A84C]">{op.time}</span>
                     </div>
                  ))}
               </div>
               <button onClick={() => navigate('/admin/reservations')} className="w-full mt-8 py-3.5 rounded-xl border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C9A84C] hover:text-white transition-all">
                  View Logbook
               </button>
            </div>

            <div className="apple-card p-8">
               <div className="flex items-center gap-3 mb-6">
                  <BadgeCheck className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-bold text-[#050B18]">VIP Protocol</h4>
               </div>
               <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-[#F5F5F7] border border-transparent hover:border-[#C9A84C]/30 transition-all cursor-pointer group">
                     <p className="text-sm font-bold text-[#050B18]">Mohamed Benali</p>
                     <p className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest mt-1">Royal Gold Suite • Floor 7</p>
                     <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white rounded-md text-[8px] font-bold text-gray-400 uppercase border border-gray-100">Early Check-in</span>
                        <span className="px-2 py-1 bg-white rounded-md text-[8px] font-bold text-gray-400 uppercase border border-gray-100">Airport Pickup</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FrontDeskDashboard;
