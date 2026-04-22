import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, User, Star, Loader2, X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const ReservationsSystem = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRes, setNewRes] = useState({
    guest_name: '',
    guests_count: 1,
    nights: 1,
    room_type: 'Heritage Deluxe',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    source: 'Direct Site'
  });

  useEffect(() => {
    fetchReservations();

    const subscription = supabase
      .channel('public:Reservation')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Reservation' }, payload => {
        console.log('Real-time reservation update:', payload);
        fetchReservations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from('Reservation')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) {
      setReservations(data || []);
    }
    setLoading(false);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('Reservation').insert([{
      ...newRes,
      start_date: new Date(newRes.start_date).toISOString(),
      end_date: new Date(newRes.end_date).toISOString()
    }]);
    
    if (!error) {
      setShowAddModal(false);
      setNewRes({
        guest_name: '', guests_count: 1, nights: 1, room_type: 'Heritage Deluxe',
        start_date: new Date().toISOString().split('T')[0], end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], source: 'Direct Site'
      });
      fetchReservations();
    } else {
      console.error("Error creating booking:", error.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this booking?")) {
      await supabase.from('Reservation').delete().eq('id', id);
      fetchReservations();
    }
  };

  const handleProcessStatus = async (id, currentStatus) => {
    const flow = ['Pending Approval', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'];
    const nextIdx = (flow.indexOf(currentStatus) + 1) % flow.length;
    await supabase.from('Reservation').update({ status: flow[nextIdx] }).eq('id', id);
    fetchReservations();
  };

  return (
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Reservation Hub</h2>
          <p className="text-gray-400 font-medium">Global booking synchronization</p>
        </div>
        <GoldButton onClick={() => setShowAddModal(true)} className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 md:py-3">
          <Plus className="w-4 h-4" /> NEW BOOKING
        </GoldButton>
      </div>

      {/* Calendar Strip Mockup */}
      <GlassCard className="bg-white border-gray-100 p-6 md:p-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="flex items-center gap-6 w-full md:w-auto">
               <h3 className="text-xl font-bold font-serif">October 2026</h3>
               <div className="flex gap-2">
                  <button className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"><ChevronRight className="w-4 h-4" /></button>
               </div>
            </div>
            <div className="flex flex-wrap gap-4">
               <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400"><div className="w-2.5 h-2.5 rounded-full bg-luxury-gold shadow-sm" /> Check-in</span>
               <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm" /> Stay</span>
               <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400"><div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm" /> Check-out</span>
            </div>
         </div>
         
         <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
         </div>
         <div className="grid grid-cols-7 gap-1.5 md:gap-4">
            {Array.from({ length: 35 }).map((_, i) => {
               const day = i - 3;
               const isCurrent = day === 12;
               // Filter reservations for this day
               const todayBooking = reservations.find(res => {
                 const start = new Date(res.start_date).getDate();
                 const end = new Date(res.end_date).getDate();
                 return day >= start && day <= end;
               });

               return (
                  <div key={i} className={`aspect-square md:h-28 rounded-xl md:rounded-2xl border p-1 md:p-2 transition-all relative group cursor-pointer ${
                    day < 1 || day > 31 ? 'opacity-0' : 
                    isCurrent ? 'bg-luxury-gold/5 border-luxury-gold/30' : 'bg-white border-gray-100 hover:border-luxury-gold/30'
                  }`}>
                     {day > 0 && day <= 31 && (
                       <>
                         <span className={`text-[10px] md:text-sm font-bold ${isCurrent ? 'text-luxury-gold' : 'text-gray-400'}`}>{day}</span>
                         {todayBooking && (
                           <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className={`mt-1 md:mt-2 h-1.5 md:h-10 rounded-full md:rounded-lg ${new Date(todayBooking.start_date).getDate() === day ? 'bg-luxury-gold' : 'bg-blue-400'} p-2 hidden md:block text-[8px] font-bold text-white overflow-hidden leading-tight`}
                           >
                              {new Date(todayBooking.start_date).getDate() === day ? `IN: ${todayBooking.guest_name.split(' ')[1] || todayBooking.guest_name}` : todayBooking.room_id ? `ROOM ${todayBooking.room_id}` : 'STAY'}
                           </motion.div>
                         )}
                         {todayBooking && (
                           <div className={`absolute bottom-1 md:hidden left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${new Date(todayBooking.start_date).getDate() === day ? 'bg-luxury-gold' : 'bg-blue-400'}`} />
                         )}
                       </>
                     )}
                  </div>
               );
            })}
         </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden min-h-[400px]">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold font-serif text-lg">Active Requests</h3>
                  <div onClick={fetchReservations} className="flex gap-2 text-[10px] uppercase font-bold text-gray-400 cursor-pointer hover:text-luxury-gold transition-all">
                     Syncing Real-time <Loader2 className={`w-4 h-4 translate-y-[1px] ${loading ? 'animate-spin' : ''}`} />
                  </div>
               </div>
               <div className="divide-y divide-gray-50">
                  {reservations.length === 0 ? (
                    <div className="p-20 text-center">
                       <p className="text-gray-400 text-sm font-medium italic">No active reservations in the system.</p>
                    </div>
                  ) : reservations.map((req, i) => (
                    <div key={i} className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors group">
                       <div className="flex gap-4 md:gap-6 items-center w-full md:w-auto">
                          <div className="w-12 h-12 bg-gray-50 group-hover:bg-white rounded-2xl flex items-center justify-center text-gray-400 transition-colors">
                             <User className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                             <h4 className="font-bold text-gray-800">{req.guest_name}</h4>
                             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{req.guests_count} Guests • {req.nights} Nights</p>
                          </div>
                          <div className="hidden md:block pl-6 border-l border-gray-100 uppercase tracking-[0.2em] text-[10px] font-bold text-gray-300">
                             <p>{req.room_type}</p>
                             <p className="text-luxury-gold">{new Date(req.start_date).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between w-full md:w-auto gap-3 sm:pl-[72px] md:pl-0">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                            req.status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-white border-gray-100 text-gray-400'
                          }`}>
                             {req.status}
                          </span>
                          <GoldButton onClick={() => handleProcessStatus(req.id, req.status)} outline className="px-6 py-2 text-[10px]">PROCESS</GoldButton>
                          <button onClick={() => handleDelete(req.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>
         </div>

         <div className="space-y-8">
            <GlassCard className="bg-white border-gray-100 p-8 shadow-sm">
               <h3 className="text-xl font-bold mb-8">Booking Sources</h3>
               <div className="space-y-8">
                  {[
                    { label: 'Direct Site', val: '100%', color: 'bg-luxury-gold' },
                    { label: 'Booking.com', val: '0%', color: 'bg-blue-600' },
                    { label: 'Expedia', val: '0%', color: 'bg-orange-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                          <span>{item.label}</span>
                          <span className="text-luxury-gold">{item.val}</span>
                       </div>
                       <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: item.val }}
                             transition={{ duration: 1 }}
                             className={`h-full ${item.color}`}
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>

            <GlassCard className="gold-gradient text-white p-8">
               <div className="flex items-center gap-3 mb-6 font-bold">
                  <Star className="text-white" />
                  <h3>Occupancy Forecast</h3>
               </div>
               <p className="text-xs opacity-80 leading-relaxed mb-6">
                  Based on historical data for Setif region, we expect <span className="font-bold underline">100% occupancy</span> during next week&apos;s festival season.
               </p>
               <GoldButton 
                 onClick={() => console.log("Analyze Trends clicked")}
                 outline 
                 className="w-full border-white/40 text-white hover:bg-white hover:text-luxury-gold"
               >
                 ANALYZE TRENDS
               </GoldButton>
            </GlassCard>
         </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <GlassCard className="bg-white w-full max-w-md p-6 relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <X className="w-5 h-5"/>
              </button>
              <h3 className="text-xl font-bold font-serif mb-6">New Reservation</h3>
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Guest Name</label>
                  <input required value={newRes.guest_name} onChange={e=>setNewRes({...newRes, guest_name: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Guests</label>
                    <input required type="number" value={newRes.guests_count} onChange={e=>setNewRes({...newRes, guests_count: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Nights</label>
                    <input required type="number" value={newRes.nights} onChange={e=>setNewRes({...newRes, nights: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Room Type</label>
                  <select value={newRes.room_type} onChange={e=>setNewRes({...newRes, room_type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none">
                    <option>Heritage Deluxe</option>
                    <option>Royal Gold Suite</option>
                    <option>Presidential Panorama</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Check-in</label>
                    <input required type="date" value={newRes.start_date} onChange={e=>setNewRes({...newRes, start_date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Check-out</label>
                    <input required type="date" value={newRes.end_date} onChange={e=>setNewRes({...newRes, end_date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none text-xs" />
                  </div>
                </div>
                <GoldButton type="submit" className="w-full mt-6 py-3">CONFIRM BOOKING</GoldButton>
              </form>
           </GlassCard>
        </div>
      )}

    </div>
  );
};

export default ReservationsSystem;
