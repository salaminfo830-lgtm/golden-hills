import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bed, Droplets, Hammer, CheckCircle2, 
  Clock, MapPin, User, LogOut,
  ChevronRight, Sparkles, AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const HousekeepingDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, done: 0 });

  useEffect(() => {
    fetchRooms();
    
    const subscription = supabase
      .channel('housekeeping_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Room' }, () => fetchRooms())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('Room')
      .select('*')
      .order('number', { ascending: true });
    
    if (data) {
      setRooms(data);
      setStats({
        total: data.length,
        pending: data.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length,
        done: data.filter(r => r.status === 'Vacant' || r.status === 'Occupied').length
      });
    }
    setLoading(false);
  };

  const updateRoomStatus = async (id, status) => {
    setLoading(true);
    const { error } = await supabase
      .from('Room')
      .update({ status })
      .eq('id', id);
    
    if (!error) {
      fetchRooms();
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-luxury-black">Housekeeping Control</h2>
          <p className="text-gray-400 font-medium tracking-wide text-sm font-semibold uppercase tracking-[0.2em]">Floor & Room Integrity Management</p>
        </div>
        <div className="flex gap-4 items-center bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex flex-col items-end border-r border-gray-100 pr-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Live Shift</span>
              <span className="text-sm font-bold text-luxury-gold">Active Now</span>
           </div>
           <Clock className="w-5 h-5 text-luxury-gold animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <GlassCard className="bg-white border-gray-100">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-luxury-gold/10 rounded-xl text-luxury-gold"><Bed className="w-6 h-6" /></div>
               <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Total Rooms</p>
                  <h3 className="text-2xl font-bold">{stats.total}</h3>
               </div>
            </div>
         </GlassCard>
         <GlassCard className="bg-white border-gray-100 border-l-4 border-l-orange-400">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-orange-50 rounded-xl text-orange-500"><Sparkles className="w-6 h-6" /></div>
               <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Awaiting Cleaning</p>
                  <h3 className="text-2xl font-bold">{rooms.filter(r => r.status === 'Cleaning').length}</h3>
               </div>
            </div>
         </GlassCard>
         <GlassCard className="bg-white border-gray-100 border-l-4 border-l-red-400">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-red-50 rounded-xl text-red-500"><Hammer className="w-6 h-6" /></div>
               <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Maintenance Req.</p>
                  <h3 className="text-2xl font-bold">{rooms.filter(r => r.status === 'Maintenance').length}</h3>
               </div>
            </div>
         </GlassCard>
      </div>

      <div className="space-y-6">
         <h4 className="text-lg font-bold font-serif text-luxury-black flex items-center gap-3">
            Priority Tasks <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-100 to-transparent" />
         </h4>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
               {rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').map((room) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={room.id}
                  >
                     <GlassCard className="bg-white border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full translate-x-12 -translate-y-12 blur-2xl opacity-10 ${room.status === 'Cleaning' ? 'bg-orange-400' : 'bg-red-400'}`} />
                        
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-12 h-12 gold-gradient rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                              {room.number}
                           </div>
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${room.status === 'Cleaning' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                              {room.status}
                           </span>
                        </div>

                        <div className="space-y-4 mb-8">
                           <h4 className="font-bold text-luxury-black">{room.type}</h4>
                           <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              Floor {room.number[0]} • South Wing
                           </div>
                           <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                              <User className="w-4 h-4 text-gray-400" />
                              Assigned: {room.housekeeper || 'Unassigned'}
                           </div>
                        </div>

                        <div className="flex gap-3">
                           {room.status === 'Cleaning' ? (
                              <GoldButton 
                                onClick={() => updateRoomStatus(room.id, 'Vacant')}
                                className="flex-1 py-3 text-[10px] flex items-center justify-center gap-2 group/btn shadow-lg"
                              >
                                 <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> MARK AS CLEAN
                              </GoldButton>
                           ) : (
                              <GoldButton 
                                outline
                                onClick={() => updateRoomStatus(room.id, 'Cleaning')}
                                className="flex-1 py-3 text-[10px] flex items-center justify-center gap-2"
                              >
                                 READY FOR CLEANING
                              </GoldButton>
                           )}
                           <button className="p-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 transition-all">
                              <AlertTriangle className="w-4 h-4" />
                           </button>
                        </div>
                     </GlassCard>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>

         {rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length === 0 && (
            <GlassCard className="bg-green-50/50 border-green-100 p-20 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
               </div>
               <h4 className="text-2xl font-serif font-bold text-green-900 mb-2">All Clear</h4>
               <p className="text-green-700/60 font-medium">All assigned rooms have been processed and confirmed clean.</p>
            </GlassCard>
         )}
      </div>

      <div className="pt-10 border-t border-gray-100 flex justify-between items-center text-gray-400">
         <p className="text-xs font-bold uppercase tracking-widest">Golden Hills • Excellence in Every Detail</p>
         <div className="flex gap-6">
            <button className="text-[10px] font-bold uppercase tracking-widest hover:text-luxury-black transition-colors">Request Supplies</button>
            <button className="text-[10px] font-bold uppercase tracking-widest hover:text-luxury-black transition-colors">View Schedule</button>
         </div>
      </div>
    </div>
  );
};

export default HousekeepingDashboard;
