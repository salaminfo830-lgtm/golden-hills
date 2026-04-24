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
  const [notification, setNotification] = useState(null);

  const [newStaff, setNewStaff] = useState({
    name: '', role: 'Staff', department: 'Housekeeping', phone: '', email: '',
    avatar_url: '', dob: '', address: '', id_number: '', joined_date: new Date().toISOString().split('T')[0], salary: ''
  });

  useEffect(() => {
    fetchStaff();

    const subscription = supabase
      .channel('public:Staff')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Staff' }, (payload) => {
        setNotification({
          type: 'new_request',
          message: `New access request from ${payload.new.name} (${payload.new.department})`,
          data: payload.new
        });
        fetchStaff();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Staff' }, () => fetchStaff())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'Staff' }, () => fetchStaff())
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
       await supabase.rpc('confirm_user_email', { target_user_id: id });
       await supabase.from('Profile').update({ role: 'staff' }).eq('id', id);
       fetchStaff();
    }
  };

  const handleReject = async (id) => {
    if(window.confirm("Are you sure you want to REJECT this application?")) {
      setLoading(true);
      const { error } = await supabase
        .from('Staff')
        .update({ status: 'Rejected' })
        .eq('id', id);
      
      if (!error) {
         fetchStaff();
      } else {
        alert("Error: " + error.message);
        setLoading(false);
      }
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
    <div className="space-y-12 font-apple">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-12 left-1/2 z-[100] w-full max-w-md bg-[#050B18] text-white p-6 rounded-3xl shadow-2xl border border-[#C9A84C]/30 flex items-center gap-6"
          >
            <div className="w-12 h-12 bg-[#C9A84C] rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-1">Security Protocol</p>
              <p className="text-sm font-bold leading-tight">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-white/40" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Human Resources</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Personnel Command</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#050B18] tracking-tighter">Staff Intelligence</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <button 
             onClick={() => setFilter('Approvals')}
             className="btn-apple-secondary flex items-center justify-center gap-3 px-8 py-4 shadow-sm"
           >
              <Shield className="w-5 h-5" /> 
              <span className="text-[11px] uppercase tracking-widest font-bold">Review Requests</span>
              {staff.filter(s => s.status === 'Pending Approval').length > 0 && (
                <span className="ml-2 px-2 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse shadow-lg shadow-red-500/20">
                  {staff.filter(s => s.status === 'Pending Approval').length}
                </span>
              )}
           </button>
           <button 
             onClick={() => setShowAddModal(true)} 
             className="btn-apple-primary flex items-center justify-center gap-3 px-10 py-4 shadow-xl shadow-[#050B18]/10"
           >
             <UserPlus className="w-5 h-5" /> <span className="text-[11px] uppercase tracking-widest font-bold">Onboard Personnel</span>
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="flex gap-1 bg-[#F5F5F7] p-1.5 rounded-2xl w-full overflow-x-auto custom-scrollbar">
            {['All', 'Approvals', 'Administration', 'Front Desk', 'Housekeeping', 'Kitchen', 'Security', 'Finance'].map((dept) => (
              <button 
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${
                  filter === dept ? 'bg-white text-[#050B18] shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
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
             <div className="col-span-full py-24 flex flex-col items-center justify-center apple-card border-none bg-transparent">
                <Loader2 className="w-10 h-10 text-[#C9A84C] animate-spin mb-4" />
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">Accessing Biometric Vault</p>
             </div>
           ) : filteredStaff.length === 0 ? (
             <div className="col-span-full py-32 text-center apple-card border-dashed border-gray-200">
                <Briefcase className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">Sector Empty. No active personnel records.</p>
             </div>
           ) : filteredStaff.map((person) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={person.id}
              >
                 <div className="apple-card p-8 hover:border-[#C9A84C]/40 transition-all group relative overflow-hidden">
                    {person.status === 'Pending Approval' && <div className="absolute top-0 left-0 w-full h-1 bg-[#C9A84C] animate-pulse" />}
                    
                    <div className="flex gap-6 items-center mb-10">
                       <div className="relative">
                          <div className="w-20 h-20 rounded-[2rem] bg-[#F5F5F7] p-1 group-hover:scale-105 transition-transform duration-500">
                             <div className="w-full h-full bg-white rounded-[1.8rem] overflow-hidden">
                                <img src={person.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt={person.name} className="w-full h-full object-cover" />
                             </div>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-4 border-white flex items-center justify-center ${person.status === 'On Shift' ? 'bg-green-500' : 'bg-gray-300'}`}>
                             <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-[#050B18] tracking-tight">{person.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest">{person.role}</span>
                             <div className="w-1 h-1 rounded-full bg-gray-200" />
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{person.department}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 text-xs">
                           <div className="w-10 h-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#C9A84C]/10 group-hover:text-[#C9A84C] transition-colors"><Mail className="w-4 h-4" /></div>
                           <span className="font-bold text-[#050B18]/60 truncate uppercase tracking-tighter">{person.email || 'internal@goldenhills.dz'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-[#F5F5F7]/50 rounded-2xl border border-gray-50">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Capital Sync</span>
                              <span className="text-sm font-bold text-[#050B18]">{person.salary ? `${person.salary.toLocaleString()} DZD` : 'Pending'}</span>
                           </div>
                           <div className="p-4 bg-[#F5F5F7]/50 rounded-2xl border border-gray-50">
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Deployment</span>
                              <span className="text-[10px] font-bold text-gray-600 uppercase">{person.joined_date ? new Date(person.joined_date).toLocaleDateString() : 'New'}</span>
                           </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Flow State</span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${person.status === 'On Shift' ? 'text-green-500' : 'text-gray-400'}`}>{person.status}</span>
                       </div>
                       <div className="flex gap-2">
                          {person.status === 'Pending Approval' ? (
                               <>
                                  <button onClick={() => confirmApproval(person.id)} className="p-3 bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white rounded-xl transition-all border border-[#C9A84C]/20">
                                     <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleReject(person.id)} className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100">
                                     <X className="w-4 h-4" />
                                  </button>
                               </>
                            ) : (
                               <>
                                  <button onClick={() => setEditingStaff(person)} className="p-3 bg-[#F5F5F7] text-gray-400 hover:text-[#050B18] rounded-xl transition-all">
                                     <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => openPermissions(person)} className="p-3 bg-[#F5F5F7] text-gray-400 hover:text-[#C9A84C] rounded-xl transition-all">
                                     <Shield className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteStaff(person.id)} className="p-3 bg-[#F5F5F7] text-gray-400 hover:text-red-500 rounded-xl transition-all">
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </>
                            )}
                        </div>
                     </div>
                 </div>
              </motion.div>
           ))}
         </AnimatePresence>
      </div>

      <AnimatePresence>
      {editingStaff && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingStaff(null)} className="absolute inset-0 bg-[#050B18]/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl overflow-hidden apple-card border-none">
               <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/5 rounded-full translate-x-24 -translate-y-24 blur-3xl" />
               <button onClick={() => setEditingStaff(null)} className="absolute top-8 right-8 p-3 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all"><X className="w-6 h-6"/></button>
               
               <div className="mb-10">
                  <h3 className="text-2xl font-bold text-[#050B18]">Refine Record</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Intelligence Override</p>
               </div>
               
               <form onSubmit={handleUpdateStaff} className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Personnel Name</label>
                     <input required value={editingStaff.name} onChange={e=>setEditingStaff({...editingStaff, name: e.target.value})} className="input-apple w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Tactical Role</label>
                        <input required value={editingStaff.role} onChange={e=>setEditingStaff({...editingStaff, role: e.target.value})} className="input-apple w-full" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Sector</label>
                        <select value={editingStaff.department} onChange={e=>setEditingStaff({...editingStaff, department: e.target.value})} className="input-apple w-full appearance-none">
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
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Portfolio (DZD)</label>
                        <input type="number" value={editingStaff.salary || ''} onChange={e=>setEditingStaff({...editingStaff, salary: Number(e.target.value)})} className="input-apple w-full" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Activation Date</label>
                        <input type="date" value={editingStaff.joined_date ? new Date(editingStaff.joined_date).toISOString().split('T')[0] : ''} onChange={e=>setEditingStaff({...editingStaff, joined_date: e.target.value})} className="input-apple w-full" />
                     </div>
                  </div>
                  
                  <button type="submit" className="btn-apple-primary w-full py-4 shadow-xl mt-4">
                     Commit Changes
                  </button>
               </form>
            </motion.div>
         </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-start justify-end p-4">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-[#050B18]/40 backdrop-blur-md" />
           <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-lg h-full apple-card p-0 flex flex-col border-none shadow-2xl">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center shrink-0 bg-white">
                 <div>
                    <h3 className="text-2xl font-bold text-[#050B18]">Recruitment Protocol</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mt-1">Asset Integration</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-3 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                   <X className="w-5 h-5"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                 <form id="add-staff-form" onSubmit={handleAddStaff} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Identity</label>
                      <input required value={newStaff.name} onChange={e=>setNewStaff({...newStaff, name: e.target.value})} type="text" className="input-apple w-full" placeholder="Executive Name" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Deployment Role</label>
                        <input required placeholder="e.g. Portfolio Manager" type="text" value={newStaff.role} onChange={e=>setNewStaff({...newStaff, role: e.target.value})} className="input-apple w-full" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Sector</label>
                        <select value={newStaff.department} onChange={e=>setNewStaff({...newStaff, department: e.target.value})} className="input-apple w-full appearance-none">
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
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Secure Channel (Email)</label>
                      <input required type="email" value={newStaff.email} onChange={e=>setNewStaff({...newStaff, email: e.target.value})} className="input-apple w-full uppercase tracking-tighter font-bold" placeholder="user@goldenhills.dz" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Salary Allocation (DZD)</label>
                        <input type="number" value={newStaff.salary} onChange={e=>setNewStaff({...newStaff, salary: Number(e.target.value)})} className="input-apple w-full" placeholder="250000" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Sync Date</label>
                        <input type="date" value={newStaff.joined_date} onChange={e=>setNewStaff({...newStaff, joined_date: e.target.value})} className="input-apple w-full" />
                      </div>
                    </div>
                 </form>
              </div>
              <div className="p-10 border-t border-gray-50 bg-white shrink-0">
                 <button form="add-staff-form" type="submit" className="btn-apple-primary w-full py-4.5 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-5 h-5" /> Activate Asset</>}
                 </button>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {permissionsModal.show && (
         <div className="fixed inset-0 bg-[#050B18]/40 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md">
               <div className="apple-card p-10 relative bg-white border-none shadow-2xl">
                  <button onClick={() => setPermissionsModal({show:false, staffId:null, permissions:[]})} className="absolute top-8 right-8 p-3 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                    <X className="w-6 h-6"/>
                  </button>
                  <div className="mb-10">
                     <h3 className="text-2xl font-bold text-[#050B18]">Access Control</h3>
                     <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mt-1">System Authorization</p>
                  </div>
                  
                  <div className="space-y-3 mb-10">
                     {ALL_MODULES.map(module => {
                        const hasAccess = permissionsModal.permissions.includes(module.id);
                        return (
                           <div 
                              key={module.id} 
                              onClick={() => togglePermission(module.id)}
                              className={`flex justify-between items-center p-5 rounded-2xl cursor-pointer border-2 transition-all ${
                                hasAccess ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-transparent bg-[#F5F5F7] hover:bg-gray-100'
                              }`}
                           >
                              <span className={`font-bold text-xs uppercase tracking-tight ${hasAccess ? 'text-[#C9A84C]' : 'text-gray-400'}`}>{module.label}</span>
                              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${hasAccess ? 'bg-[#C9A84C]' : 'bg-gray-200'}`}>
                                 <div className={`w-4 h-4 bg-white rounded-full transition-transform ${hasAccess ? 'translate-x-4' : 'translate-x-0'}`} />
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  <button onClick={savePermissions} className="btn-apple-primary w-full py-4 flex items-center justify-center gap-2">
                     {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Authorize Access Levels</span>}
                  </button>
               </div>
            </motion.div>
         </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default HRSystem;
