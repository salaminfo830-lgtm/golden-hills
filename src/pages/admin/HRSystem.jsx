import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Search, 
  Mail, Phone, MoreVertical, 
  Clock, Loader2, X, Trash2,
  CheckCircle2, Shield, UserCog,
  Briefcase, Edit2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const HRSystem = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [newStaff, setNewStaff] = useState({
    name: '', role: 'Staff', department: 'Housekeeping', phone: '', email: '',
    avatar_url: '', dob: '', address: '', id_number: '', joined_date: new Date().toISOString().split('T')[0], salary: ''
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
      setNewStaff({ 
        name: '', role: 'Staff', department: 'Housekeeping', phone: '', email: '',
        avatar_url: '', dob: '', address: '', id_number: '', joined_date: new Date().toISOString().split('T')[0], salary: ''
      });
      fetchStaff();
    } else {
      console.error("Error adding staff:", error.message);
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, isEditing = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `staff/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('staff')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message === 'Bucket not found') {
           await supabase.storage.createBucket('staff', { public: true });
           const { error: retryError } = await supabase.storage.from('staff').upload(filePath, file);
           if (retryError) throw retryError;
        } else {
           throw uploadError;
        }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('staff')
        .getPublicUrl(filePath);

      if (isEditing) {
        setEditingStaff(prev => ({ ...prev, avatar_url: publicUrl }));
      } else {
        setNewStaff(prev => ({ ...prev, avatar_url: publicUrl }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('Staff')
      .update({
        name: editingStaff.name,
        role: editingStaff.role,
        department: editingStaff.department,
        phone: editingStaff.phone,
        email: editingStaff.email,
        avatar_url: editingStaff.avatar_url,
        dob: editingStaff.dob,
        address: editingStaff.address,
        id_number: editingStaff.id_number,
        joined_date: editingStaff.joined_date,
        salary: editingStaff.salary
      })
      .eq('id', editingStaff.id);

    if (!error) {
      setEditingStaff(null);
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

  const confirmApproval = async (id) => {
    setLoading(true);
    const { error } = await supabase
      .from('Staff')
      .update({ status: 'Off Shift' })
      .eq('id', id);
    
    if (!error) {
       // Also confirm the email in auth.users via RPC
       await supabase.rpc('confirm_user_email', { target_user_id: id });
       await supabase.from('Profile').update({ role: 'staff' }).eq('id', id);
       fetchStaff();
    }
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
    ? staff.filter(s => s.status !== 'Pending Approval')
    : filter === 'Approvals'
    ? staff.filter(s => s.status === 'Pending Approval')
    : staff.filter(s => s.department === filter && s.status !== 'Pending Approval');

  return (
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-luxury-black">Personnel Command</h2>
          <p className="text-gray-400 font-medium tracking-wide text-sm font-semibold uppercase tracking-[0.2em]">Employee Directory & Access Control</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2" onClick={() => setFilter('Approvals')}>
              <Shield className="w-4 h-4" /> REVIEW REQUESTS {staff.filter(s => s.status === 'Pending Approval').length > 0 && `(${staff.filter(s => s.status === 'Pending Approval').length})`}
           </GoldButton>
           <GoldButton onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none py-3 px-10 text-[10px] flex items-center justify-center gap-2 shadow-lg">
             <UserPlus className="w-4 h-4" /> ADD PERSONNEL
           </GoldButton>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="flex gap-2 bg-gray-100/50 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar border border-gray-100">
            {['All', 'Approvals', 'Administration', 'Front Desk', 'Housekeeping', 'Kitchen', 'Security', 'Finance'].map((dept) => (
              <button 
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                  filter === dept ? 'bg-white text-luxury-gold shadow-sm ring-1 ring-luxury-gold/10' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {dept} {dept === 'Approvals' && staff.filter(s => s.status === 'Pending Approval').length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[8px] animate-pulse">
                    {staff.filter(s => s.status === 'Pending Approval').length}
                  </span>
                )}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         <AnimatePresence mode="popLayout">
           {loading && staff.length === 0 ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-gray-50 shadow-sm">
                <Loader2 className="w-10 h-10 text-luxury-gold animate-spin mb-4" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accessing Biometric Records</p>
             </div>
           ) : filteredStaff.length === 0 ? (
             <GlassCard className="col-span-full py-24 text-center bg-white border-dashed border-2 border-gray-100">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No personnel entries found in {filter} sector.</p>
             </GlassCard>
           ) : filteredStaff.map((person) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={person.id}
              >
                 <GlassCard className="bg-white border-gray-100 p-8 hover:border-luxury-gold/40 transition-all group relative overflow-hidden">
                    {person.status === 'Pending Approval' && <div className="absolute top-0 left-0 w-full h-1 bg-luxury-gold animate-pulse" />}
                    
                    <div className="flex gap-6 items-center mb-10">
                       <div className="relative">
                          <div className="w-20 h-20 rounded-[1.8rem] gold-gradient p-[2px] transition-transform group-hover:scale-105 duration-500">
                             <div className="w-full h-full bg-white rounded-[1.6rem] overflow-hidden">
                                <img src={person.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt={person.name} />
                             </div>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-4 border-white flex items-center justify-center ${person.status === 'On Shift' ? 'bg-green-500' : 'bg-gray-300'}`}>
                             <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                       </div>
                       <div>
                          <h3 className="text-xl font-serif font-bold text-luxury-black tracking-tight">{person.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] font-bold text-luxury-gold uppercase tracking-[0.2em]">{person.role}</span>
                             <div className="w-1 h-1 rounded-full bg-gray-200" />
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{person.department}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 text-xs">
                           <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-luxury-gold/10 group-hover:text-luxury-gold transition-colors"><Mail className="w-4 h-4" /></div>
                           <span className="font-bold text-gray-600 truncate">{person.email || 'internal@goldenhills.dz'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-gray-50 rounded-[1.5rem] flex flex-col gap-1 border border-gray-100/50">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Monthly Salary</span>
                              <span className="text-sm font-bold text-luxury-black">{person.salary ? `${person.salary} DZD` : 'TBD'}</span>
                           </div>
                           <div className="p-4 bg-gray-50 rounded-[1.5rem] flex flex-col gap-1 border border-gray-100/50">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Joined</span>
                              <span className="text-xs font-bold text-gray-600">{person.joined_date ? new Date(person.joined_date).toLocaleDateString() : 'New'}</span>
                           </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                       <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Status</span>
                             <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${person.status === 'On Shift' ? 'text-green-500' : 'text-gray-400'}`}>{person.status}</span>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          {person.status === 'Pending Approval' ? (
                            <GoldButton onClick={() => confirmApproval(person.id)} className="px-6 py-2.5 text-[10px] shadow-lg flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5" /> APPROVE
                            </GoldButton>
                          ) : (
                             <>
                                <button onClick={() => setEditingStaff(person)} className="p-2.5 bg-gray-50 hover:bg-luxury-gold/10 text-gray-400 hover:text-luxury-gold rounded-xl transition-all border border-transparent hover:border-luxury-gold/20">
                                   <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => openPermissions(person)} className="p-2.5 bg-gray-50 hover:bg-luxury-gold/10 text-gray-400 hover:text-luxury-gold rounded-xl transition-all border border-transparent hover:border-luxury-gold/20">
                                   <Shield className="w-4 h-4" />
                                </button>
                             </>
                          )}
                          <button onClick={() => handleDeleteStaff(person.id)} className="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100">
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
      {editingStaff && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingStaff(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full translate-x-16 -translate-y-16 blur-2xl" />
               <button onClick={() => setEditingStaff(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all"><X className="w-6 h-6"/></button>
               
               <h3 className="text-2xl font-serif font-bold text-luxury-black mb-1">Edit Personnel Info</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">Administrative Control Panel</p>
               
               <form onSubmit={handleUpdateStaff} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                     <input required value={editingStaff.name} onChange={e=>setEditingStaff({...editingStaff, name: e.target.value})} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Role</label>
                        <input required value={editingStaff.role} onChange={e=>setEditingStaff({...editingStaff, role: e.target.value})} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Department</label>
                        <select value={editingStaff.department} onChange={e=>setEditingStaff({...editingStaff, department: e.target.value})} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all cursor-pointer">
                           <option>Administration</option>
                           <option>Front Desk</option>
                           <option>Housekeeping</option>
                           <option>Kitchen</option>
                           <option>Security</option>
                           <option>Finance</option>
                        </select>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Salary (USD)</label>
                        <input type="number" value={editingStaff.salary || ''} onChange={e=>setEditingStaff({...editingStaff, salary: Number(e.target.value)})} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Joined Date</label>
                        <input type="date" value={editingStaff.joined_date ? new Date(editingStaff.joined_date).toISOString().split('T')[0] : ''} onChange={e=>setEditingStaff({...editingStaff, joined_date: e.target.value})} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Address</label>
                     <textarea value={editingStaff.address || ''} onChange={e=>setEditingStaff({...editingStaff, address: e.target.value})} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all resize-none" rows="2" />
                  </div>
                  
                  <GoldButton type="submit" className="w-full py-4 shadow-xl mt-4">SAVE CHANGES</GoldButton>
               </form>
            </motion.div>
         </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-start justify-end">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
           <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-lg h-full bg-[#fafafa] shadow-2xl flex flex-col border-l border-luxury-gold/20">
              <div className="p-8 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-2xl font-bold font-serif text-luxury-black">Personnel Recruitment</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Strategic HR Integration</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-luxury-black hover:bg-gray-100 transition-colors">
                   <X className="w-5 h-5"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                 <form id="add-staff-form" onSubmit={handleAddStaff} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Employee Name</label>
                      <input required value={newStaff.name} onChange={e=>setNewStaff({...newStaff, name: e.target.value})} type="text" className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-5 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm" placeholder="Full Name" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Target Role</label>
                        <input required placeholder="e.g. Lead Concierge" type="text" value={newStaff.role} onChange={e=>setNewStaff({...newStaff, role: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-5 text-sm font-bold focus:border-luxury-gold outline-none shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Department</label>
                        <select value={newStaff.department} onChange={e=>setNewStaff({...newStaff, department: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-5 text-sm font-bold focus:border-luxury-gold outline-none shadow-sm cursor-pointer appearance-none">
                          <option>Administration</option>
                          <option>Front Desk</option>
                          <option>Housekeeping</option>
                          <option>Kitchen</option>
                          <option>Security</option>
                          <option>Finance</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Interface</label>
                      <input required type="email" value={newStaff.email} onChange={e=>setNewStaff({...newStaff, email: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-5 text-sm font-bold focus:border-luxury-gold outline-none shadow-sm" placeholder="user@goldenhills.dz" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Salary (USD)</label>
                        <input type="number" value={newStaff.salary} onChange={e=>setNewStaff({...newStaff, salary: Number(e.target.value)})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-5 text-sm font-bold focus:border-luxury-gold outline-none shadow-sm" placeholder="2500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Joined Date</label>
                        <input type="date" value={newStaff.joined_date} onChange={e=>setNewStaff({...newStaff, joined_date: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-5 text-sm font-bold focus:border-luxury-gold outline-none shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Address</label>
                       <textarea value={newStaff.address} onChange={e=>setNewStaff({...newStaff, address: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-5 text-sm font-bold focus:border-luxury-gold outline-none shadow-sm resize-none" rows="2" placeholder="Street, City..." />
                    </div>
                 </form>
              </div>
              <div className="p-10 bg-white border-t border-gray-100 shrink-0">
                 <GoldButton form="add-staff-form" type="submit" className="w-full py-5 shadow-[0_20px_50px_rgba(212,175,55,0.2)] text-xs font-bold flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-5 h-5" /> ONBOARD PERSONNEL</>}
                 </GoldButton>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {permissionsModal.show && (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
               <GlassCard className="bg-white w-full max-w-md p-10 relative shadow-2xl rounded-[3rem]">
                  <button onClick={() => setPermissionsModal({show:false, staffId:null, permissions:[]})} className="absolute top-8 right-8 text-gray-400 hover:text-black hover:bg-gray-50 p-2 rounded-full transition-all">
                    <X className="w-6 h-6"/>
                  </button>
                  <h3 className="text-2xl font-bold font-serif text-luxury-black mb-1">Access Control</h3>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-10">System Level Permissions</p>
                  
                  <div className="space-y-3 mb-10">
                     {ALL_MODULES.map(module => {
                        const hasAccess = permissionsModal.permissions.includes(module.id);
                        return (
                           <div 
                              key={module.id} 
                              onClick={() => togglePermission(module.id)}
                              className={`flex justify-between items-center p-5 rounded-[1.5rem] cursor-pointer border transition-all ${
                                hasAccess ? 'border-luxury-gold bg-luxury-gold/5 shadow-sm shadow-luxury-gold/10' : 'border-gray-50 hover:bg-gray-50'
                              }`}
                           >
                              <span className={`font-bold text-sm ${hasAccess ? 'text-luxury-gold' : 'text-gray-400'}`}>{module.label}</span>
                              <div className={`w-12 h-7 rounded-full p-1.5 transition-colors ${hasAccess ? 'bg-luxury-gold' : 'bg-gray-100'}`}>
                                 <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md ${hasAccess ? 'translate-x-5' : 'translate-x-0'}`} />
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  <GoldButton onClick={savePermissions} className="w-full py-4 shadow-xl text-xs font-bold">
                     {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'CONFIRM ACCESS RIGHTS'}
                  </GoldButton>
               </GlassCard>
            </motion.div>
         </div>
      )}
      </AnimatePresence>

    </div>
  );
};

export default HRSystem;
