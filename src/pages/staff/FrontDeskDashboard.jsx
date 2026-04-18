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
      .channel('frontdesk_updates')
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
    <div className="space-y-8 font-sans">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-luxury-black">Front Office Command</h2>
          <p className="text-gray-400 font-medium tracking-wide text-sm font-semibold uppercase tracking-[0.2em]">Guest Experience & Arrival Management</p>
        </div>
        <div className="flex gap-4">
           <GoldButton outline className="text-[10px] py-3 px-6">WALK-IN BOOKING</GoldButton>
           <GoldButton className="text-[10px] py-3 px-10 shadow-lg flex items-center gap-2">
              <Plus className="w-4 h-4" /> CREATE RESERVATION
           </GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {stats.map((stat, i) => (
            <GlassCard key={i} className="bg-white border-gray-100 p-8 shadow-sm group hover:border-luxury-gold/20 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                     {stat.icon}
                  </div>
                  <span className="text-xs font-bold text-luxury-gold flex items-center gap-1">
                     LIVE <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse" />
                  </span>
               </div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
               <h3 className="text-3xl font-bold text-luxury-black mt-1">{stat.value}</h3>
            </GlassCard>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Arrivals Feed */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h4 className="text-xl font-bold font-serif text-luxury-black">Guest Manifesto</h4>
               <div className="flex gap-2 bg-gray-100/50 p-1 rounded-xl">
                  {['Today', 'Upcoming', 'Recent'].map(f => (
                     <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-luxury-gold shadow-sm' : 'text-gray-400'}`}
                     >
                        {f}
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               {loading ? (
                  <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 flex flex-col items-center opacity-40">
                     <Loader2 className="w-8 h-8 animate-spin mb-4 text-luxury-gold" />
                     <p className="text-[10px] font-bold uppercase tracking-widest">Accessing Guest Ledger...</p>
                  </div>
               ) : reservations.length === 0 ? (
                  <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 text-center opacity-40">
                     <Users className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                     <p className="text-[10px] font-bold uppercase tracking-widest">No guest activity for this period</p>
                  </div>
               ) : reservations.map((guest) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={guest.id}
                  >
                     <GlassCard className="bg-white border-gray-100 p-6 flex items-center gap-6 hover:shadow-xl transition-all cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden relative">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guest.guest_name}`} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start mb-1">
                              <h5 className="font-bold text-luxury-black truncate group-hover:text-luxury-gold transition-colors">{guest.guest_name}</h5>
                              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                 guest.status === 'Checked In' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-luxury-gold/5 text-luxury-gold border border-luxury-gold/20'
                              }`}>
                                 {guest.status}
                              </span>
                           </div>
                           <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              <span className="flex items-center gap-1"><Key className="w-3 h-3" /> Room {guest.room?.number || '---'}</span>
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {guest.guests_count} Guests</span>
                              <span className="flex items-center gap-1 text-luxury-gold/70"><Clock className="w-3 h-3" /> Arriving 14:00</span>
                           </div>
                        </div>
                        <div className="shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           {guest.status !== 'Checked In' && (
                              <button 
                                 onClick={() => handleCheckIn(guest.id)}
                                 className="px-6 py-2 bg-luxury-gold text-white text-[10px] font-bold uppercase rounded-xl shadow-lg hover:scale-105 transition-all"
                              >
                                 CHECK-IN
                              </button>
                           )}
                           <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-luxury-gold transition-colors">
                              <ChevronRight className="w-5 h-5" />
                           </button>
                        </div>
                     </GlassCard>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-8">
            <GlassCard className="bg-luxury-black text-white p-8 overflow-hidden relative border-0">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-luxury-gold opacity-10 rounded-full translate-x-12 translate-y-12 blur-2xl" />
               <div className="relative z-10">
                  <h5 className="text-xl font-serif font-bold mb-4">Daily Operations</h5>
                  <div className="space-y-4">
                     {[
                       { label: 'Night Audit Report', time: '02:00 AM' },
                       { label: 'Room Assignments', time: '09:30 AM' },
                       { label: 'Concierge Briefing', time: '10:00 AM' },
                     ].map((op, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                           <span className="text-xs font-medium text-white/80">{op.label}</span>
                           <span className="text-[10px] font-bold text-luxury-gold">{op.time}</span>
                        </div>
                     ))}
                  </div>
                  <GoldButton className="w-full py-3 text-[10px] mt-8 bg-transparent border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all">
                     VIEW LOGBOOK
                  </GoldButton>
               </div>
            </GlassCard>

            <GlassCard className="bg-white border-gray-100 p-8">
               <div className="flex items-center gap-4 mb-6">
                  <BadgeCheck className="w-6 h-6 text-emerald-500" />
                  <h5 className="font-bold text-luxury-black">VIP Arrivals</h5>
               </div>
               <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 relative group cursor-pointer hover:border-luxury-gold/50 transition-all">
                     <p className="text-xs font-bold text-gray-800">Mohamed Benali</p>
                     <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest">Royal Gold Suite • Floor 7</p>
                     <div className="mt-3 flex gap-2">
                        <span className="px-2 py-0.5 bg-white rounded-lg text-[8px] font-bold text-gray-400 uppercase border border-gray-100 tracking-tighter italic font-elegant">Early Check-in</span>
                        <span className="px-2 py-0.5 bg-white rounded-lg text-[8px] font-bold text-gray-400 uppercase border border-gray-100 tracking-tighter italic font-elegant">Airport Pickup</span>
                     </div>
                  </div>
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

export default FrontDeskDashboard;
