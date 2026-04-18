import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Search, 
  Mail, Phone, MoreVertical, 
  Clock, Loader2, X, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const HRSystem = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStaff, setNewStaff] = useState({
    name: '', role: '', department: 'Housekeeping', phone: '', email: ''
  });

  useEffect(() => {
    fetchStaff();

    const subscription = supabase
      .channel('public:Staff')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Staff' }, () => fetchStaff())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from('Staff')
      .select('*')
      .order('name', { ascending: true });
    
    if (!error) {
      setStaff(data || []);
    }
    setLoading(false);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('Staff').insert([{
      ...newStaff,
      status: 'Off Shift'
    }]);

    if (!error) {
      setShowAddModal(false);
      setNewStaff({ name: '', role: '', department: 'Housekeeping', phone: '', email: '' });
      fetchStaff();
    } else {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if(window.confirm("Are you sure you want to dismiss this personnel?")) {
      await supabase.from('Staff').delete().eq('id', id);
      fetchStaff();
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const statuses = ['On Shift', 'Off Shift', 'Vacation'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    await supabase.from('Staff').update({ status: statuses[nextIdx] }).eq('id', id);
    fetchStaff();
  };

   const ALL_MODULES = [
      { id: 'rooms', label: 'Rooms & Housekeeping' },
      { id: 'reservations', label: 'Reservations' },
      { id: 'kitchen', label: 'Kitchen Operations' },
      { id: 'finance', label: 'Financial Ledger' },
      { id: 'security', label: 'Security Command' }
   ];

   const [permissionsModal, setPermissionsModal] = useState({ show: false, staffId: null, permissions: [] });

   const openPermissions = (person) => {
      setPermissionsModal({ 
         show: true, 
         staffId: person.id, 
         permissions: Array.isArray(person.permissions) ? person.permissions : [] 
      });
   };

   const togglePermission = (moduleId) => {
      setPermissionsModal(prev => {
         const hasPerm = prev.permissions.includes(moduleId);
         const newPerms = hasPerm 
            ? prev.permissions.filter(p => p !== moduleId)
            : [...prev.permissions, moduleId];
         return { ...prev, permissions: newPerms };
      });
   };

   const savePermissions = async () => {
      setLoading(true);
      await supabase.from('Staff').update({ permissions: permissionsModal.permissions }).eq('id', permissionsModal.staffId);
      setPermissionsModal({ show: false, staffId: null, permissions: [] });
      fetchStaff();
   };

   const filteredStaff = filter === 'All' 
    ? staff 
    : staff.filter(s => s.department === filter);

  return (
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Human Resources</h2>
          <p className="text-gray-400 font-medium tracking-wide">Live personnel management & shift monitoring</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline className="flex-1 md:flex-none py-3 px-6 text-[10px] cursor-not-allowed opacity-50">VIEW SCHEDULES</GoldButton>
           <GoldButton onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2">
             <UserPlus className="w-4 h-4" /> RECRUIT NEW
           </GoldButton>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="flex gap-2 bg-gray-100/50 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {['All', 'Administration', 'Housekeeping', 'Kitchen', 'Security', 'Finance'].map((dept) => (
              <button 
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === dept ? 'bg-white text-luxury-gold shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {dept}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         <AnimatePresence mode="popLayout">
           {loading && staff.length === 0 ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-gray-50 shadow-sm">
                <Loader2 className="w-8 h-8 text-luxury-gold animate-spin mb-4" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accessing Personnel Files</p>
             </div>
           ) : filteredStaff.length === 0 ? (
             <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">No personnel found in {filter} department.</p>
             </div>
           ) : filteredStaff.map((person) => (
             <motion.div
               layout
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               key={person.id}
             >
                <GlassCard className="bg-white border-gray-100 p-8 hover:border-luxury-gold/30 transition-all group overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-luxury-gold/10 transition-colors" />
                   
                   <div className="flex gap-6 items-center mb-10 relative z-10">
                      <div className="w-16 h-16 rounded-[1.5rem] gold-gradient p-[2px] shrink-0">
                         <div className="w-full h-full bg-white rounded-[1.3rem] overflow-hidden">
                            <img src={person.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt={person.name} />
                         </div>
                      </div>
                      <div>
                         <h3 className="text-xl font-serif font-bold text-gray-800 tracking-tight group-hover:text-luxury-gold transition-colors">{person.name}</h3>
                         <span className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em]">{person.role}</span>
                      </div>
                   </div>

                   <div className="space-y-4 mb-6 relative z-10">
                      <div className="flex items-center gap-4 text-xs">
                         <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><Mail className="w-4 h-4" /></div>
                         <span className="font-medium text-gray-600">{person.email || 'internal@golden-hills.com'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                         <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><Phone className="w-4 h-4" /></div>
                         <span className="font-medium text-gray-600">{person.phone || '+213 XXX XXX XXX'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                         <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                         <span className="font-medium text-gray-600 flex items-center justify-between w-full">
                           {person.department} Department
                           {Array.isArray(person.permissions) && person.permissions.length > 0 && (
                             <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold">
                               {person.permissions.length} Module{person.permissions.length > 1 ? 's' : ''} Access
                             </span>
                           )}
                         </span>
                      </div>
                   </div>

                   <div className="flex justify-between items-center pt-6 border-t border-gray-50 relative z-10">
                      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => handleStatusChange(person.id, person.status)}>
                         <div className={`w-2 h-2 rounded-full ${person.status === 'On Shift' ? 'bg-green-500 animate-pulse' : person.status === 'Off Shift' ? 'bg-gray-400' : 'bg-orange-400'}`} />
                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{person.status}</span>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => openPermissions(person)} className="px-3 py-1 text-[10px] font-bold bg-luxury-gold/5 text-luxury-gold border border-luxury-gold/20 hover:bg-luxury-gold hover:text-white rounded-xl transition-all uppercase tracking-widest">
                            Access
                         </button>
                         <button onClick={() => handleDeleteStaff(person.id)} className="p-2.5 bg-gray-50 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </GlassCard>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>

      <AnimatePresence>
      {permissionsModal.show && (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
               <GlassCard className="bg-white w-full max-w-md p-8 relative shadow-2xl">
                  <button onClick={() => setPermissionsModal({show:false, staffId:null, permissions:[]})} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                    <X className="w-5 h-5"/>
                  </button>
                  <h3 className="text-xl font-bold font-serif text-luxury-black">System Preferences</h3>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-6">Access Control Manager</p>
                  
                  <div className="space-y-3 mb-8">
                     {ALL_MODULES.map(module => {
                        const hasAccess = permissionsModal.permissions.includes(module.id);
                        return (
                           <div 
                              key={module.id} 
                              onClick={() => togglePermission(module.id)}
                              className={`flex justify-between items-center p-4 rounded-xl cursor-pointer border transition-all ${
                                hasAccess ? 'border-luxury-gold bg-luxury-gold/5' : 'border-gray-100 hover:border-gray-300'
                              }`}
                           >
                              <span className={`font-bold text-sm ${hasAccess ? 'text-luxury-gold' : 'text-gray-500'}`}>{module.label}</span>
                              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${hasAccess ? 'bg-luxury-gold' : 'bg-gray-200'}`}>
                                 <div className={`w-4 h-4 bg-white rounded-full transition-transform ${hasAccess ? 'translate-x-4' : 'translate-x-0'}`} />
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  <GoldButton onClick={savePermissions} className="w-full py-3 shadow-lg text-xs">
                     {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'SAVE PERMISSIONS'}
                  </GoldButton>
               </GlassCard>
            </motion.div>
         </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
           <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-lg h-full bg-[#fafafa] shadow-2xl flex flex-col border-l border-luxury-gold/20">
              <div className="p-8 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-2xl font-bold font-serif text-luxury-black">Recruit Personnel</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">HR Management</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-luxury-black hover:bg-gray-100 transition-colors">
                   <X className="w-5 h-5"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                 <form id="add-staff-form" onSubmit={handleAddStaff} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Full Name</label>
                      <input required value={newStaff.name} onChange={e=>setNewStaff({...newStaff, name: e.target.value})} type="text" className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Role</label>
                        <input required placeholder="e.g. Concierge" type="text" value={newStaff.role} onChange={e=>setNewStaff({...newStaff, role: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Department</label>
                        <select value={newStaff.department} onChange={e=>setNewStaff({...newStaff, department: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm cursor-pointer appearance-none">
                          <option>Housekeeping</option>
                          <option>Administration</option>
                          <option>Kitchen</option>
                          <option>Security</option>
                          <option>Finance</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Phone (DZD / Local)</label>
                      <input required type="text" placeholder="+213 XX XX XX XX" value={newStaff.phone} onChange={e=>setNewStaff({...newStaff, phone: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Email</label>
                      <input required type="email" value={newStaff.email} onChange={e=>setNewStaff({...newStaff, email: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                    </div>
                 </form>
              </div>
              <div className="p-8 bg-white border-t border-gray-100 shrink-0">
                 <GoldButton form="add-staff-form" type="submit" className="w-full py-4 shadow-lg text-sm flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ONBOARD PERSONNEL'}
                 </GoldButton>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
};

export default HRSystem;
