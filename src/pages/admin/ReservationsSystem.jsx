import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, User as UserIcon, Star, Loader2, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    runIntegrityCheck(true);

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
      runIntegrityCheck(data || []);
    }
    setLoading(false);
  };

  const runIntegrityCheck = async (data) => {
    const now = new Date();
    const { data: settings } = await supabase.from('Settings').select('*').eq('id', 'global').single();
    const noShowThreshold = settings?.no_show_threshold_hours || 18; // 6 PM
    const bankDeadline = settings?.bank_transfer_deadline_hours || 24;

    for (const res of data) {
      // 1. No-Show Check (Pay at Hotel)
      if (res.status === 'Confirmed' && res.payment_method === 'Pay at Hotel') {
        const arrivalDate = new Date(res.start_date);
        arrivalDate.setHours(noShowThreshold, 0, 0, 0);
        
        if (now > arrivalDate) {
          await handleMarkNoShow(res.id, true); // true for auto-process
        }
      }

      // 2. Late Payment Check (Bank Transfer)
      if (res.payment_status === 'Unpaid' && res.payment_method === 'Bank Transfer') {
        const createdDate = new Date(res.created_at);
        const deadlineDate = new Date(createdDate.getTime() + bankDeadline * 60 * 60 * 1000);
        
        if (now > deadlineDate) {
          await supabase.from('Reservation').update({ 
            status: 'Cancelled',
            payment_status: 'Failed'
          }).eq('id', res.id);
          
          await supabase.from('AuditLog').insert([{
            action: 'Auto-Cancelled: Late Payment',
            entity_type: 'Reservation',
            entity_id: res.id,
            details: { reason: 'Bank transfer proof not received within deadline.' }
          }]);
        }
      }
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('Reservation').insert([{
      id: crypto.randomUUID(),
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
    const flow = ['Pending Approval', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled', 'No-Show'];
    const nextIdx = (flow.indexOf(currentStatus) + 1) % flow.length;
    const nextStatus = flow[nextIdx];
    
    const { error } = await supabase.from('Reservation').update({ status: nextStatus }).eq('id', id);
    if (!error) {
      await supabase.from('AuditLog').insert([{
        action: 'Reservation Status Changed',
        entity_type: 'Reservation',
        entity_id: id,
        details: { from: currentStatus, to: nextStatus }
      }]);
      fetchReservations();
    }
  };

  const handleMarkNoShow = async (id, auto = false) => {
    if (auto || window.confirm("Mark this guest as No-Show? This will release the room.")) {
      const { error } = await supabase.from('Reservation').update({ 
        status: 'No-Show',
        payment_status: 'Unpaid'
      }).eq('id', id);
      
      if (!error) {
        await supabase.from('AuditLog').insert([{
          action: auto ? 'Auto-Marked No-Show' : 'Marked No-Show',
          entity_type: 'Reservation',
          entity_id: id,
          details: { timestamp: new Date().toISOString(), trigger: auto ? 'System Integrity Check' : 'Manual' }
        }]);
        if (!auto) fetchReservations();
      }
    }
  };

  return (
    <div className="space-y-10 font-apple">
      {/* Apple-Style Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">Reservations</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Inventory Sync</span>
          </div>
          <h2 className="text-3xl font-bold text-[#050B18] tracking-tight">Booking Management</h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn-apple-primary flex items-center gap-2 px-8 py-3.5"
        >
          <Plus className="w-4 h-4" /> <span>New Reservation</span>
        </button>
      </div>

      {/* Calendar Strip */}
      <div className="apple-card p-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="flex items-center gap-4">
               <h3 className="text-xl font-bold text-[#050B18]">October 2026</h3>
               <div className="flex gap-2">
                  <button className="p-2 bg-[#F5F5F7] hover:bg-gray-200 rounded-lg transition-all"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-2 bg-[#F5F5F7] hover:bg-gray-200 rounded-lg transition-all"><ChevronRight className="w-4 h-4" /></button>
               </div>
            </div>
            <div className="flex gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Check-in</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stay</span>
               </div>
            </div>
         </div>
         
         <div className="grid grid-cols-7 gap-4 mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-300">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
         </div>
         <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 35 }).map((_, i) => {
               const day = i - 3;
               const isCurrent = day === 12;
               const todayBooking = reservations.find(res => {
                 const start = new Date(res.start_date).getDate();
                 const end = new Date(res.end_date).getDate();
                 return day >= start && day <= end;
               });

               return (
                  <div key={i} className={`aspect-square rounded-xl border p-2 transition-all relative group cursor-pointer ${
                    day < 1 || day > 31 ? 'opacity-0 pointer-events-none' : 
                    isCurrent ? 'bg-[#C9A84C]/5 border-[#C9A84C]/30' : 'bg-white border-gray-100 hover:border-[#C9A84C]/30'
                  }`}>
                     {day > 0 && day <= 31 && (
                       <>
                         <span className={`text-[11px] font-bold ${isCurrent ? 'text-[#C9A84C]' : 'text-gray-400'}`}>{day}</span>
                         {todayBooking && (
                           <div className={`mt-1.5 h-1 md:h-8 rounded-md ${new Date(todayBooking.start_date).getDate() === day ? 'bg-[#C9A84C]' : 'bg-blue-500'} p-1.5 hidden md:block text-[8px] font-bold text-white overflow-hidden`}>
                              {new Date(todayBooking.start_date).getDate() === day ? 'Arrival' : 'Stay'}
                           </div>
                         )}
                         {todayBooking && (
                           <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full md:hidden ${new Date(todayBooking.start_date).getDate() === day ? 'bg-[#C9A84C]' : 'bg-blue-500'}`} />
                         )}
                       </>
                     )}
                  </div>
               );
            })}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2">
            <div className="apple-card p-0 overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#050B18]">Active Bookings</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     <Loader2 className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                     <span>Live Feed</span>
                  </div>
               </div>
               
               <div className="p-6">
                  <table className="table-apple">
                    <thead>
                      <tr>
                        <th>Guest</th>
                        <th>Stay Details</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-20 text-gray-400 font-medium italic">No active reservations.</td>
                        </tr>
                      ) : reservations.map((req, i) => (
                        <tr key={i} className="group">
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-gray-400 group-hover:bg-white transition-all">
                                <UserIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-[#050B18]">{req.guest_name}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{req.source}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="text-xs font-bold text-gray-600">{req.room_type}</p>
                            <p className="text-[10px] text-[#C9A84C] font-bold">{new Date(req.start_date).toLocaleDateString()} — {req.nights} Nights</p>
                          </td>
                          <td>
                            <div className="flex flex-col gap-1.5">
                              <span className={`badge-apple w-fit ${
                                req.status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 
                                req.status === 'No-Show' ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-[#F5F5F7] border-transparent text-gray-500'
                              }`}>
                                {req.status}
                              </span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                {req.payment_status || 'Pending'} • {req.payment_method}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleProcessStatus(req.id, req.status)}
                                className="p-2 bg-[#F5F5F7] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] rounded-lg transition-all"
                                title="Process Status"
                              >
                                <Star className="w-4 h-4" />
                              </button>
                              {req.status === 'Confirmed' && (
                                <button 
                                  onClick={() => handleMarkNoShow(req.id)}
                                  className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                  title="Mark No-Show"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDelete(req.id)} 
                                className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="apple-card p-8">
               <h3 className="text-lg font-bold text-[#050B18] mb-8">Booking Sources</h3>
               <div className="space-y-8">
                  {[
                    { label: 'Direct Site', val: '100%', color: 'bg-[#C9A84C]' },
                    { label: 'Booking.com', val: '0%', color: 'bg-blue-600' },
                    { label: 'Expedia', val: '0%', color: 'bg-orange-500' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                          <span className="text-xs font-bold text-[#C9A84C]">{item.val}</span>
                       </div>
                       <div className="w-full h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: item.val }}
                             transition={{ duration: 1.5, ease: "easeOut" }}
                             className={`h-full ${item.color}`}
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="apple-card bg-[#050B18] text-white p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-[60px] -translate-y-16 translate-x-16" />
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C9A84C]">
                    <Star className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold">Occupancy Forecast</h3>
               </div>
               <p className="text-xs text-white/50 leading-relaxed mb-8">
                  Expected <span className="text-[#C9A84C] font-bold">100% capacity</span> for the upcoming festival season in the Setif region.
               </p>
               <button className="w-full py-3.5 rounded-xl border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C9A84C] hover:text-white hover:border-[#C9A84C] transition-all">
                 Analyze Trends
               </button>
            </div>
         </div>
      </div>

      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 bg-[#050B18]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="apple-card w-full max-w-md p-8 relative"
           >
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-[#050B18] transition-all">
                <X className="w-5 h-5"/>
              </button>
              <h3 className="text-2xl font-bold text-[#050B18] mb-8">New Reservation</h3>
              <form onSubmit={handleCreateBooking} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guest Full Name</label>
                  <input required value={newRes.guest_name} onChange={e=>setNewRes({...newRes, guest_name: e.target.value})} type="text" className="input-apple w-full" placeholder="e.g. John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Guests</label>
                    <input required type="number" value={newRes.guests_count} onChange={e=>setNewRes({...newRes, guests_count: Number(e.target.value)})} className="input-apple w-full" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Nights</label>
                    <input required type="number" value={newRes.nights} onChange={e=>setNewRes({...newRes, nights: Number(e.target.value)})} className="input-apple w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suite Selection</label>
                  <select value={newRes.room_type} onChange={e=>setNewRes({...newRes, room_type: e.target.value})} className="input-apple w-full appearance-none">
                    <option>Heritage Deluxe</option>
                    <option>Royal Gold Suite</option>
                    <option>Presidential Panorama</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Arrival</label>
                    <input required type="date" value={newRes.start_date} onChange={e=>setNewRes({...newRes, start_date: e.target.value})} className="input-apple w-full text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Departure</label>
                    <input required type="date" value={newRes.end_date} onChange={e=>setNewRes({...newRes, end_date: e.target.value})} className="input-apple w-full text-xs" />
                  </div>
                </div>
                <button type="submit" className="btn-apple-primary w-full mt-4">Confirm Reservation</button>
              </form>
           </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationsSystem;
