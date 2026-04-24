import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, 
  Phone, Calendar, Star, MoreVertical,
  Download, Plus, UserCircle, Loader2,
  Trash2, Edit, ChevronRight, X, Globe
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
  const [newGuest, setNewGuest] = useState({ 
    full_name: '', 
    email: '', 
    phone: '', 
    avatar_url: '',
    nationality: '',
    id_number: '',
    dob: '',
    address: '',
    notes: ''
  });

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
        setNewGuest({ 
          full_name: '', email: '', phone: '', avatar_url: '',
          nationality: '', id_number: '', dob: '', address: '', notes: ''
        });
        fetchGuests();
      } else {
        alert("Error updating guest: " + error.message);
        setLoading(false);
      }
    } else {
      const { error } = await supabase.from('Guest').insert([{ id: crypto.randomUUID(), ...newGuest }]);
      if (!error) {
        setShowAddModal(false);
        setNewGuest({ 
          full_name: '', email: '', phone: '', avatar_url: '',
          nationality: '', id_number: '', dob: '', address: '', notes: ''
        });
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
      avatar_url: guest.avatar_url || '',
      nationality: guest.nationality || '',
      id_number: guest.id_number || '',
      dob: guest.dob ? new Date(guest.dob).toISOString().split('T')[0] : '',
      address: guest.address || '',
      notes: guest.notes || ''
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
    <div className="space-y-12 font-apple">
      {/* Elite CRM Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">CRM</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Guest Intelligence</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#050B18] tracking-tighter">Elite Registry</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <button className="btn-apple-secondary flex items-center justify-center gap-3 px-8 py-4 shadow-sm">
            <Download className="w-5 h-5" /> <span className="text-[11px] uppercase tracking-widest font-bold">Export Intelligence</span>
          </button>
          <button 
            onClick={() => { setEditingGuest(null); setNewGuest({ full_name: '', email: '', phone: '', avatar_url: '', nationality: '', id_number: '', dob: '', address: '', notes: '' }); setShowAddModal(true); }} 
            className="btn-apple-primary flex items-center justify-center gap-3 px-10 py-4 shadow-xl shadow-[#050B18]/10"
          >
            <Plus className="w-5 h-5" /> <span className="text-[11px] uppercase tracking-widest font-bold">Initialize Identity</span>
          </button>
        </div>
      </div>

      {/* High-Fidelity Stats Stream */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { icon: <Users className="w-6 h-6" />, label: 'Master Registry', value: guests.length, color: 'bg-white', accent: 'text-gray-400', sub: 'Total Records' },
           { icon: <UserCircle className="w-6 h-6" />, label: 'Active Presence', value: guests.filter(g => g.reservations?.some(r => r.status === 'Checked-in')).length, color: 'bg-white', accent: 'text-green-500', sub: 'In-House Today' },
           { icon: <Star className="w-6 h-6" />, label: 'Elite Tier', value: guests.filter(g => (g.reservations?.length || 0) > 3).length, color: 'bg-[#050B18]', accent: 'text-[#C9A84C]', sub: 'Loyal Patrons', dark: true },
           { icon: <Mail className="w-6 h-6" />, label: 'Network Growth', value: guests.filter(g => new Date(g.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, color: 'bg-white', accent: 'text-blue-500', sub: 'Last 7 Days' },
         ].map((stat, i) => (
            <div key={i} className={`apple-card p-8 group hover:scale-[1.02] transition-transform duration-500 border-none shadow-xl shadow-gray-100 ${stat.dark ? 'bg-[#050B18] text-white' : 'bg-white'}`}>
               <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${stat.dark ? 'bg-white/10 text-[#C9A84C]' : 'bg-[#F5F5F7] ' + stat.accent}`}>
                     {stat.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.dark ? 'text-[#C9A84C]/60' : 'text-gray-300'}`}>0{i+1}</span>
               </div>
               <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${stat.dark ? 'text-white/40' : 'text-gray-400'}`}>{stat.label}</p>
                  <div className="flex items-end gap-3">
                     <h3 className="text-3xl font-bold tracking-tighter">{stat.value}</h3>
                     <p className={`text-[9px] font-bold uppercase tracking-widest pb-1.5 ${stat.dark ? 'text-white/20' : 'text-gray-300'}`}>{stat.sub}</p>
                  </div>
               </div>
            </div>
         ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Intelligence List */}
        <div className="flex-1 space-y-8">
           <div className="flex gap-6">
              <div className="flex-1 relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#C9A84C] transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search registry by name, email or identification..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="input-apple w-full pl-16 py-5 shadow-sm focus:shadow-xl transition-all"
                 />
              </div>
              <button className="p-5 bg-white border border-gray-100 rounded-[1.5rem] hover:bg-[#F5F5F7] transition-all shadow-sm">
                 <Filter className="w-6 h-6 text-gray-400" />
              </button>
           </div>

           <div className="apple-card p-0 overflow-hidden border-none shadow-2xl shadow-gray-100">
              <table className="table-apple">
                <thead>
                  <tr>
                    <th className="pl-10">Guest Identity</th>
                    <th>Origin</th>
                    <th>Passport / ID</th>
                    <th>Presence</th>
                    <th className="text-right pr-10">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && guests.length === 0 ? (
                    [1,2,3,4].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="5" className="h-28 bg-[#F5F5F7]/30" />
                      </tr>
                    ))
                  ) : filteredGuests.map((guest) => (
                    <tr key={guest.id} className="cursor-pointer group hover:bg-[#F5F5F7]/30 transition-all duration-300" onClick={() => setSelectedGuest(guest)}>
                      <td className="pl-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-inner">
                            {guest.avatar_url ? <img src={guest.avatar_url} className="w-full h-full object-cover" /> : <UserCircle className="w-8 h-8 text-gray-300 m-auto" />}
                          </div>
                          <div>
                            <p className="font-bold text-base text-[#050B18] tracking-tight">{guest.full_name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{guest.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3 bg-[#F5F5F7] w-fit px-4 py-2 rounded-xl border border-gray-100">
                          <Globe className="w-4 h-4 text-[#C9A84C]" />
                          <span className="text-xs font-bold text-gray-600">{guest.nationality || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs font-bold text-[#050B18] font-mono tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">{guest.id_number || 'NO-ID'}</span>
                      </td>
                      <td>
                        <span className={`badge-apple py-2 px-4 ${getGuestStatus(guest.reservations).color}`}>
                          {getGuestStatus(guest.reservations).label}
                        </span>
                      </td>
                      <td className="text-right pr-10">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={(e) => { e.stopPropagation(); handleEditGuest(guest); }} className="p-3 bg-white border border-gray-100 hover:border-[#050B18] hover:bg-[#050B18] hover:text-white rounded-xl transition-all shadow-sm">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteGuest(guest.id); }} className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Guest Profile Sidebar */}
        <AnimatePresence>
          {selectedGuest && (
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:w-[26rem]"
            >
               <div className="apple-card p-0 overflow-hidden sticky top-32 border-none shadow-2xl shadow-gray-200">
                  <div className="h-40 bg-[#050B18] relative overflow-hidden">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#C9A84C]/20 via-transparent to-transparent" />
                     <button onClick={() => setSelectedGuest(null)} className="absolute top-8 right-8 p-3 bg-white/10 text-white hover:bg-white/20 rounded-[1.2rem] backdrop-blur-md transition-all z-10">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
                  <div className="px-10 pb-10 -mt-20 relative z-10 text-center border-b border-gray-50 bg-white/80 backdrop-blur-xl">
                     <div className="w-40 h-40 rounded-[3rem] bg-white p-1.5 mx-auto mb-8 shadow-2xl relative">
                        <div className="w-full h-full bg-[#F5F5F7] rounded-[2.5rem] flex items-center justify-center overflow-hidden shadow-inner">
                           {selectedGuest.avatar_url ? <img src={selectedGuest.avatar_url} className="w-full h-full object-cover" /> : <UserCircle className="w-20 h-20 text-gray-200" />}
                        </div>
                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#C9A84C] rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                           <Star className="w-5 h-5 fill-current" />
                        </div>
                     </div>
                     <h3 className="text-3xl font-bold text-[#050B18] tracking-tighter mb-1.5">{selectedGuest.full_name}</h3>
                     <div className="flex items-center justify-center gap-2 mb-10">
                        <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em]">Elite Patron</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">ID: {selectedGuest.id.slice(0, 8)}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Loyalty Assets</p>
                           <p className="font-bold text-lg text-[#050B18] tracking-tight">GOLD TIER</p>
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Engagements</p>
                           <p className="font-bold text-lg text-[#050B18] tracking-tight">{selectedGuest.reservations?.length || 0} Visits</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-10 space-y-10 bg-white">
                     <div className="space-y-6">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" /> Secure Contact
                        </h4>
                        <div className="space-y-5">
                           <div className="flex items-center gap-5 group">
                              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-gray-400 group-hover:bg-[#050B18] group-hover:text-white transition-all duration-300"><Mail className="w-5 h-5" /></div>
                              <span className="text-sm font-bold text-[#050B18] truncate tracking-tight">{selectedGuest.email}</span>
                           </div>
                           <div className="flex items-center gap-5 group">
                              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-gray-400 group-hover:bg-[#050B18] group-hover:text-white transition-all duration-300"><Phone className="w-5 h-5" /></div>
                              <span className="text-sm font-bold text-[#050B18] tracking-tight">{selectedGuest.phone || '---'}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" /> Operational History
                        </h4>
                        <div className="space-y-4">
                           {selectedGuest.reservations?.length > 0 ? selectedGuest.reservations?.slice(0, 3).map((res, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-2xl group hover:bg-[#050B18] transition-all duration-500 cursor-pointer">
                                <div className="flex flex-col">
                                   <span className="text-[11px] font-bold text-gray-700 uppercase tracking-widest group-hover:text-white transition-all">Protocol #{res.id.slice(0, 4)}</span>
                                   <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 group-hover:text-white/40">{new Date(res.created_at).toLocaleDateString()}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#C9A84C] group-hover:translate-x-1 transition-all" />
                             </div>
                           )) : (
                             <div className="p-6 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No previous protocols</p>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Identity Provisioning Side Panel */}
      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setShowAddModal(false)} 
             className="absolute inset-0 bg-[#050B18]/40 backdrop-blur-md" 
           />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-2xl h-full apple-card p-0 flex flex-col border-none shadow-2xl"
           >
              <div className="p-10 border-b border-gray-50 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-3xl font-bold text-[#050B18] tracking-tighter">{editingGuest ? 'Identity Update' : 'Registry Entry'}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1.5">Official Guest Record Provisioning</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-3.5 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                   <X className="w-6 h-6"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 <form id="guest-form" onSubmit={handleAddGuest} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Legal Full Name</label>
                         <input required value={newGuest.full_name} onChange={e=>setNewGuest({...newGuest, full_name: e.target.value})} type="text" className="input-apple w-full" placeholder="e.g. Jean Dupont" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Identity</label>
                         <input required value={newGuest.email} onChange={e=>setNewGuest({...newGuest, email: e.target.value})} type="email" className="input-apple w-full" placeholder="email@address.com" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Contact Phone</label>
                         <input value={newGuest.phone} onChange={e=>setNewGuest({...newGuest, phone: e.target.value})} type="text" className="input-apple w-full" placeholder="+1..." />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nationality</label>
                         <input value={newGuest.nationality} onChange={e=>setNewGuest({...newGuest, nationality: e.target.value})} type="text" className="input-apple w-full" placeholder="Country" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Identification #</label>
                         <input value={newGuest.id_number} onChange={e=>setNewGuest({...newGuest, id_number: e.target.value})} type="text" className="input-apple w-full" placeholder="Passport / ID" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Date of Birth</label>
                         <input value={newGuest.dob} onChange={e=>setNewGuest({...newGuest, dob: e.target.value})} type="date" className="input-apple w-full text-xs" />
                       </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Residential Address</label>
                      <textarea value={newGuest.address} onChange={e=>setNewGuest({...newGuest, address: e.target.value})} className="input-apple w-full resize-none h-24 p-5" placeholder="Official Residence Details" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">CRM Internal Intelligence</label>
                      <textarea value={newGuest.notes} onChange={e=>setNewGuest({...newGuest, notes: e.target.value})} className="input-apple w-full resize-none h-32 p-5" placeholder="Preferences, allergies, VIP protocols..." />
                    </div>
                 </form>
              </div>

              <div className="p-10 bg-white border-t border-gray-50 shrink-0">
                 <button form="guest-form" type="submit" className="btn-apple-primary w-full py-5 text-base shadow-xl shadow-[#050B18]/10">
                   {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (editingGuest ? 'Commit Intelligence Update' : 'Finalize Identity Record')}
                 </button>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default GuestsSystem;
