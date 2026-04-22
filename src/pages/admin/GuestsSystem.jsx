import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, 
  Phone, Calendar, Star, MoreVertical,
  Download, Plus, UserCircle, Loader2,
  Trash2, Edit, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const GuestsSystem = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [newGuest, setNewGuest] = useState({ full_name: '', email: '', phone: '', avatar_url: '' });

  useEffect(() => {
    fetchGuests();
    
    const subscription = supabase
      .channel('public:Guest')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Guest' }, () => {
        fetchGuests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Guest')
      .select('*, reservations:Reservation(id, status, created_at), reviews:Review(rating)')
      .order('created_at', { ascending: false });
    
    if (!error) {
      setGuests(data || []);
    }
    setLoading(false);
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (editingGuest && editingGuest.id) {
      const { error } = await supabase
        .from('Guest')
        .update(newGuest)
        .eq('id', editingGuest.id);
      
      if (!error) {
        setShowAddModal(false);
        setEditingGuest(null);
        setNewGuest({ full_name: '', email: '', phone: '', avatar_url: '' });
        fetchGuests();
      } else {
        alert("Error updating guest: " + error.message);
        setLoading(false);
      }
    } else {
      const { error } = await supabase.from('Guest').insert([newGuest]);
      if (!error) {
        setShowAddModal(false);
        setNewGuest({ full_name: '', email: '', phone: '', avatar_url: '' });
        fetchGuests();
      } else {
        alert("Error adding guest: " + error.message);
        setLoading(false);
      }
    }
  };

  const handleEditGuest = (guest) => {
    setEditingGuest(guest);
    setNewGuest({
      full_name: guest.full_name,
      email: guest.email,
      phone: guest.phone || '',
      avatar_url: guest.avatar_url || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteGuest = async (id) => {
    if(window.confirm("Delete this guest record?")) {
      await supabase.from('Guest').delete().eq('id', id);
      fetchGuests();
    }
  };

  const filteredGuests = guests.filter(guest => 
    guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGuestStatus = (reservations) => {
    if (!reservations || reservations.length === 0) return { label: 'New', color: 'bg-blue-50 text-blue-600' };
    const hasActive = reservations.some(r => r.status === 'Confirmed' || r.status === 'Checked-in');
    if (hasActive) return { label: 'Active', color: 'bg-green-50 text-green-600' };
    return { label: 'Past', color: 'bg-gray-50 text-gray-600' };
  };

  const getAvgRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-luxury-black">Guest Registry</h2>
          <p className="text-gray-400 font-medium tracking-wide text-sm font-semibold uppercase tracking-[0.2em]">CRM & Loyalty Management</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export Data
          </button>
          <GoldButton onClick={() => { setEditingGuest(null); setNewGuest({ full_name: '', email: '', phone: '', avatar_url: '' }); setShowAddModal(true); }} className="px-6 py-3 text-[10px] flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> ADD GUEST
          </GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats */}
        <GlassCard className="bg-white border-gray-100 flex items-center gap-5">
           <div className="p-4 bg-luxury-gold/10 rounded-2xl text-luxury-gold"><Users className="w-6 h-6" /></div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Guests</p>
              <h3 className="text-2xl font-bold">{guests.length}</h3>
           </div>
        </GlassCard>
        <GlassCard className="bg-white border-gray-100 flex items-center gap-5">
           <div className="p-4 bg-green-50 rounded-2xl text-green-500"><UserCircle className="w-6 h-6" /></div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Today</p>
              <h3 className="text-2xl font-bold">{guests.filter(g => g.reservations?.some(r => r.status === 'Checked-in')).length}</h3>
           </div>
        </GlassCard>
        <GlassCard className="bg-white border-gray-100 flex items-center gap-5">
           <div className="p-4 bg-purple-50 rounded-2xl text-purple-500"><Star className="w-6 h-6" /></div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loyal Members</p>
              <h3 className="text-2xl font-bold">{guests.filter(g => (g.reservations?.length || 0) > 3).length}</h3>
           </div>
        </GlassCard>
        <GlassCard className="bg-white border-gray-100 flex items-center gap-5">
           <div className="p-4 bg-blue-50 rounded-2xl text-blue-500"><Mail className="w-6 h-6" /></div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Subscriptions</p>
              <h3 className="text-2xl font-bold">{guests.filter(g => new Date(g.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</h3>
           </div>
        </GlassCard>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main List */}
        <div className="flex-1 space-y-6">
           <div className="flex gap-4">
              <div className="flex-1 relative">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search by name, email or phone..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-white border border-gray-100 rounded-2xl px-14 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm"
                 />
              </div>
              <button className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                 <Filter className="w-5 h-5 text-gray-400" />
              </button>
           </div>

           <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                          <th className="px-8 py-5">Guest Information</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5">History</th>
                          <th className="px-8 py-5">Rating</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {loading && guests.length === 0 ? (
                         [1,2,3,4].map(i => (
                           <tr key={i} className="animate-pulse">
                              <td colSpan="5" className="px-8 py-10 h-24 bg-gray-50/20" />
                           </tr>
                         ))
                       ) : filteredGuests.map((guest) => (
                         <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedGuest(guest)}>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl gold-gradient p-[2px] shrink-0 group-hover:scale-105 transition-transform">
                                     <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                                        {guest.avatar_url ? <img src={guest.avatar_url} className="w-full h-full object-cover" /> : <UserCircle className="w-6 h-6 text-gray-300" />}
                                     </div>
                                  </div>
                                  <div>
                                     <p className="font-bold text-luxury-black text-sm">{guest.full_name}</p>
                                     <p className="text-[10px] text-gray-400 font-medium">{guest.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${getGuestStatus(guest.reservations).color}`}>
                                  {getGuestStatus(guest.reservations).label}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex flex-col">
                                  <span className="text-xs font-bold text-gray-700">{guest.reservations?.length || 0} Bookings</span>
                                  <span className="text-[10px] text-gray-400 font-medium italic">Joined {new Date(guest.created_at).toLocaleDateString()}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-1.5">
                                  <Star className={`w-3.5 h-3.5 ${getAvgRating(guest.reviews) > 0 ? 'text-luxury-gold fill-current' : 'text-gray-200'}`} />
                                  <span className="text-sm font-bold text-gray-700">{getAvgRating(guest.reviews)}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); handleEditGuest(guest); }} className="p-2.5 hover:bg-luxury-gold/10 hover:text-luxury-gold rounded-xl transition-all border border-transparent hover:border-gray-100">
                                     <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteGuest(guest.id); }} className="p-2.5 hover:bg-white hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-gray-100">
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </GlassCard>
        </div>

        {/* Guest Details Sidebar */}
        <AnimatePresence>
          {selectedGuest && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:w-96"
            >
               <GlassCard className="bg-white border-gray-100 p-0 h-full overflow-hidden sticky top-32">
                  <div className="h-32 gold-gradient relative">
                     <button onClick={() => setSelectedGuest(null)} className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-all">
                        <X className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="px-8 pb-8 -mt-16 text-center border-b border-gray-50">
                     <div className="w-32 h-32 rounded-[2rem] gold-gradient p-1 mx-auto mb-6 shadow-2xl">
                        <div className="w-full h-full bg-white rounded-[30px] flex items-center justify-center overflow-hidden">
                           {selectedGuest.avatar_url ? <img src={selectedGuest.avatar_url} className="w-full h-full object-cover" /> : <UserCircle className="w-16 h-16 text-gray-200" />}
                        </div>
                     </div>
                     <h3 className="text-2xl font-serif font-bold text-luxury-black mb-1">{selectedGuest.full_name}</h3>
                     <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em] mb-6">Verified Member</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Spent</p>
                           <p className="font-bold text-sm">-- USD</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visits</p>
                           <p className="font-bold text-sm">{selectedGuest.reservations?.length || 0}</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 space-y-8">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Information</h4>
                        <div className="space-y-4">
                           <div className="flex items-center gap-4 group">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-luxury-gold transition-colors"><Mail className="w-4 h-4" /></div>
                              <span className="text-sm font-bold text-gray-700 truncate">{selectedGuest.email}</span>
                           </div>
                           <div className="flex items-center gap-4 group">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-luxury-gold transition-colors"><Phone className="w-4 h-4" /></div>
                              <span className="text-sm font-bold text-gray-700">{selectedGuest.phone || 'No phone provided'}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h4>
                        </div>
                        <div className="space-y-3">
                           {selectedGuest.reservations?.slice(0, 3).map((res, i) => (
                             <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-green-500" />
                                   <span className="text-[10px] font-bold text-gray-700 uppercase">Reservation #{res.id.slice(0, 4)}</span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-gray-300" />
                             </div>
                           ))}
                           {!selectedGuest.reservations?.length && <p className="text-[10px] text-gray-400 italic">No recent reservations</p>}
                        </div>
                     </div>
                  </div>
               </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Guest Modal */}
      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <GlassCard className="bg-white w-full max-w-md p-8 relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                <X className="w-5 h-5"/>
              </button>
              <h3 className="text-2xl font-bold font-serif mb-6">{editingGuest ? 'Edit Guest Record' : 'Register New Guest'}</h3>
              <form onSubmit={handleAddGuest} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input required value={newGuest.full_name} onChange={e=>setNewGuest({...newGuest, full_name: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-luxury-gold transition-colors font-bold text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                  <input required value={newGuest.email} onChange={e=>setNewGuest({...newGuest, email: e.target.value})} type="email" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-luxury-gold transition-colors font-bold text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                  <input value={newGuest.phone} onChange={e=>setNewGuest({...newGuest, phone: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-luxury-gold transition-colors font-bold text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Avatar URL</label>
                  <input value={newGuest.avatar_url} onChange={e=>setNewGuest({...newGuest, avatar_url: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-luxury-gold transition-colors font-bold text-sm" />
                </div>
                <GoldButton type="submit" className="w-full py-4 shadow-lg text-[10px]">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (editingGuest ? 'SAVE CHANGES' : 'CREATE GUEST RECORD')}
                </GoldButton>
              </form>
           </GlassCard>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default GuestsSystem;
