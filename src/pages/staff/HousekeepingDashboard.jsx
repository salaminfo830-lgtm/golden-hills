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
      .channel('public:Room')
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
    } else {
      console.error("Error updating room status:", error.message);
    }
  };

  const handleRequestSupplies = async () => {
    const { error } = await supabase.from('Notification').insert([{
      title: 'Supplies Requested',
      message: 'Housekeeping requested additional cleaning supplies.',
      type: 'Alert',
      is_read: false
    }]);
    if (!error) {
       // Ideally show a toast
       console.log("Supplies requested");
    }
  };

  return (
    <div className="space-y-10 font-apple">
      {/* Apple-Style Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">Housekeeping</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Inventory Status</span>
          </div>
          <h2 className="text-3xl font-bold text-[#050B18] tracking-tight">Environmental Integrity</h2>
        </div>
        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-50">
           <div className="text-right border-r border-gray-100 pr-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shift Status</p>
              <p className="text-xs font-bold text-[#C9A84C]">Active Duty</p>
           </div>
           <Clock className="w-5 h-5 text-[#C9A84C] animate-pulse" />
        </div>
      </div>

      {/* Stats Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { icon: <Bed className="w-5 h-5" />, label: 'Inventory', value: stats.total, color: 'bg-[#F5F5F7]', text: 'text-gray-400' },
           { icon: <Sparkles className="w-5 h-5" />, label: 'Pending Clean', value: rooms.filter(r => r.status === 'Cleaning').length, color: 'bg-orange-50', text: 'text-orange-500' },
           { icon: <Hammer className="w-5 h-5" />, label: 'Maintenance', value: rooms.filter(r => r.status === 'Maintenance').length, color: 'bg-red-50', text: 'text-red-500' },
         ].map((stat, i) => (
            <div key={i} className="apple-card p-6 flex items-center gap-4">
               <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center ${stat.text}`}>
                  {stat.icon}
               </div>
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-[#050B18]">{stat.value}</h3>
               </div>
            </div>
         ))}
      </div>

      <div className="space-y-8">
         <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-[#050B18]">Priority Tasks</h3>
            <div className="h-px flex-1 bg-gray-100" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
               {rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').map((room) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={room.id}
                  >
                     <div className="apple-card apple-card-hover p-6 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-8">
                           <div className="w-12 h-12 bg-[#050B18] text-white rounded-2xl flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-all">
                              {room.number}
                           </div>
                           <span className={`badge-apple ${
                             room.status === 'Cleaning' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-red-50 text-red-600 border-red-100'
                           }`}>
                              {room.status}
                           </span>
                        </div>

                        <div className="space-y-4 mb-8">
                           <h4 className="text-lg font-bold text-[#050B18]">{room.type}</h4>
                           <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                 <MapPin className="w-3.5 h-3.5" /> <span>Floor {room.number[0]} • North Wing</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                 <User className="w-3.5 h-3.5" /> <span>Assigned: {room.housekeeper || 'Unassigned'}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-3">
                           {room.status === 'Cleaning' ? (
                              <button 
                                onClick={() => updateRoomStatus(room.id, 'Vacant')}
                                className="btn-apple-primary flex-1 flex items-center justify-center gap-2 text-[10px]"
                              >
                                 <CheckCircle2 className="w-4 h-4" /> <span>COMPLETE</span>
                              </button>
                           ) : (
                              <button 
                                onClick={() => updateRoomStatus(room.id, 'Cleaning')}
                                className="btn-apple-secondary flex-1 flex items-center justify-center gap-2 text-[10px]"
                              >
                                 READY CLEAN
                              </button>
                           )}
                           <button className="p-3 bg-[#F5F5F7] text-gray-400 hover:text-red-500 rounded-xl transition-all">
                              <AlertTriangle className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>

         {rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length === 0 && (
            <div className="apple-card p-20 flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
               </div>
               <h4 className="text-xl font-bold text-[#050B18] mb-2">Protocol Complete</h4>
               <p className="text-sm text-gray-400 max-w-xs">All assigned inventory has been processed and confirmed to standards.</p>
            </div>
         )}
      </div>

      <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
         <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Golden Hills • Environmental Standards</p>
          <div className="flex gap-8">
            <button 
              onClick={handleRequestSupplies}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A84C] transition-all"
            >
              Order Supplies
            </button>
            <button 
              onClick={() => console.log("Schedule clicked")}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A84C] transition-all"
            >
              Master Schedule
            </button>
          </div>
      </div>
    </div>
  );
};

export default HousekeepingDashboard;
