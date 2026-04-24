import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Eye, Lock, Zap, 
  AlertTriangle, History, 
  Loader2, Radio, Plus, X, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const SecuritySystem = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    lockdown_active: false,
    biometric_locks: 'Active',
    infrared_scanners: 'Active',
    radio_silent: 'Inactive',
    system_health: 100,
    last_audit: new Date().toISOString()
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLog, setNewLog] = useState({ event: '', location: '', status: 'Info', time: new Date().toISOString() });
  const [activeLogTab, setActiveLogTab] = useState('Security'); // Security, Audit

  useEffect(() => {
    fetchLogs();
    fetchSystemStatus();

    const logSubscription = supabase
      .channel('public:SecurityLog')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'SecurityLog' }, () => fetchLogs())
      .subscribe();

    const statusSubscription = supabase
      .channel('public:SecuritySystemStatus')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'SecuritySystemStatus' }, (payload) => {
        if (payload.new && payload.new.id === 'current') {
          setSystemStatus(payload.new);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(logSubscription);
      supabase.removeChannel(statusSubscription);
    };
  }, [activeLogTab]);

  const fetchSystemStatus = async () => {
    const { data, error } = await supabase
      .from('SecuritySystemStatus')
      .select('*')
      .eq('id', 'current')
      .single();
    
    if (!error && data) {
      setSystemStatus(data);
    }
    setStatusLoading(false);
  };

  const fetchLogs = async () => {
    setLoading(true);
    if (activeLogTab === 'Security') {
      const { data } = await supabase.from('SecurityLog').select('*').order('time', { ascending: false }).limit(50);
      setLogs(data || []);
    } else {
      const { data } = await supabase.from('AuditLog').select('*').order('created_at', { ascending: false }).limit(50);
      // Map AuditLog to SecurityLog format for consistent UI
      setLogs(data?.map(item => ({
        id: item.id,
        event: item.action,
        location: `${item.entity_type} #${item.entity_id?.slice(0, 8)}`,
        status: 'Info',
        time: item.created_at,
        details: item.details
      })) || []);
    }
    setLoading(false);
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('SecurityLog').insert([{ ...newLog, time: new Date().toISOString() }]);
    if (!error) {
      setShowAddModal(false);
      setNewLog({ event: '', location: '', status: 'Info', time: new Date().toISOString() });
      fetchLogs();
    } else {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  const handleDeleteLog = async (id) => {
    await supabase.from('SecurityLog').delete().eq('id', id);
    fetchLogs();
  };

  // Emergency Lock function (mock behavior for log)
  const handleEmergencyLock = async () => {
    const nextState = !systemStatus.lockdown_active;
    const confirmMsg = nextState 
      ? "ACTIVATE EMERGENCY LOCKDOWN PROTOCOL?\n\nThis will secure all sectors immediately."
      : "DEACTIVATE LOCKDOWN PROTOCOL?\n\nThis will restore normal operational flow.";

    if(window.confirm(confirmMsg)) {
      setLoading(true);
      
      const { error: statusError } = await supabase
        .from('SecuritySystemStatus')
        .update({ lockdown_active: nextState })
        .eq('id', 'current');

      if (!statusError) {
        await supabase.from('SecurityLog').insert([{
          event: nextState ? 'EMERGENCY LOCKDOWN ACTIVATED' : 'LOCKDOWN PROTOCOL DEACTIVATED',
          location: 'All Sectors',
          status: nextState ? 'Critical' : 'Info',
          time: new Date().toISOString()
        }]);
        fetchLogs();
        fetchSystemStatus();
      }
      setLoading(false);
    }
  };

  const toggleProtocol = async (field, currentVal) => {
    const nextVal = currentVal === 'Active' ? 'Inactive' : 'Active';
    const { error } = await supabase
      .from('SecuritySystemStatus')
      .update({ [field]: nextVal })
      .eq('id', 'current');
    
    if (!error) {
      await supabase.from('SecurityLog').insert([{
        event: `PROTOCOL CHANGE: ${field.replace('_', ' ').toUpperCase()} set to ${nextVal}`,
        location: 'System Core',
        status: 'Info',
        time: new Date().toISOString()
      }]);
    }
  };

  const handleSecurityAudit = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('SecuritySystemStatus')
      .update({ 
        last_audit: new Date().toISOString(),
        system_health: 100
      })
      .eq('id', 'current');
    
    if (!error) {
      await supabase.from('SecurityLog').insert([{
        event: 'SECURITY AUDIT COMPLETED',
        location: 'All Sectors',
        status: 'Info',
        time: new Date().toISOString()
      }]);
      fetchLogs();
      fetchSystemStatus();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12 font-apple">
      {/* Elite Security Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Security</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Command Center</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#050B18] tracking-tighter">Intelligence Hub</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <button 
             onClick={() => setShowAddModal(true)} 
             className="btn-apple-secondary flex items-center justify-center gap-3 px-8 py-4 shadow-sm"
           >
             <Plus className="w-5 h-5" /> <span className="text-[11px] uppercase tracking-widest font-bold">Incident Report</span>
           </button>
           <button 
             onClick={handleEmergencyLock} 
             className={`px-10 py-4 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 rounded-[1.2rem] transition-all duration-500 shadow-xl ${
               systemStatus.lockdown_active 
                 ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-900/20' 
                 : 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20'
             }`}
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
             {systemStatus.lockdown_active ? 'Release Lockdown' : 'Emergency Lockdown'}
           </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-12">
            {/* Visual Monitoring Feeds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { id: 'CAM-01', loc: 'Grand Lobby', status: 'Live Recording', active: true },
                 { id: 'CAM-08', loc: 'Executive Vault', status: 'Live Recording', active: true },
               ].map((cam) => (
                 <div key={cam.id} className="apple-card p-0 overflow-hidden group border-none shadow-2xl shadow-gray-100">
                    <div className="aspect-video bg-[#050B18] relative overflow-hidden">
                       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
                       <div className="absolute top-5 left-5 flex items-center gap-3 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 z-10">
                          <div className={`w-2 h-2 rounded-full ${cam.active ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-gray-500'}`} />
                          <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{cam.status}</span>
                       </div>
                       <div className="absolute bottom-5 left-5 z-10 flex flex-col">
                          <span className="text-white font-bold tracking-tight">{cam.id}</span>
                          <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{cam.loc}</span>
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px] z-20">
                          <button className="p-5 bg-white/10 rounded-[1.5rem] border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all shadow-xl">
                            <Eye className="w-7 h-7" />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* System Ledger */}
            <div className="apple-card p-0 overflow-hidden border-none shadow-xl shadow-gray-100">
               <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <h3 className="text-xl font-bold text-[#050B18] flex items-center gap-3 tracking-tight">
                     <History className="w-6 h-6 text-[#C9A84C]" /> System Activity Ledger
                  </h3>
                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    <div className="flex bg-[#F5F5F7] p-1.5 rounded-2xl w-full sm:w-auto">
                      {['Security', 'Audit'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => { setActiveLogTab(tab); setLoading(true); }}
                          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${activeLogTab === tab ? 'bg-white text-[#050B18] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <button onClick={fetchLogs} className="p-3 bg-white border border-gray-100 hover:bg-[#F5F5F7] rounded-xl transition-all shadow-sm">
                      <Loader2 className={`w-5 h-5 text-[#C9A84C] ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
               </div>
               
               <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto custom-scrollbar bg-white">
                  <AnimatePresence mode="popLayout">
                    {logs.length === 0 ? (
                      <div className="p-24 text-center flex flex-col items-center">
                         <Shield className="w-16 h-16 text-gray-100 mb-6" />
                         <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-300">Synchronizing secure ledger...</p>
                      </div>
                    ) : logs.map((log) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        key={log.id} 
                        className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F5F5F7]/40 transition-all duration-300 group"
                      >
                         <div className="flex items-start sm:items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                              log.status === 'Critical' ? 'bg-red-50 text-red-500 border border-red-100' :
                              log.status === 'Warning' ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'bg-blue-50 text-blue-500 border border-blue-100'
                            }`}>
                               <Shield className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="font-bold text-base text-[#050B18] tracking-tight">{log.event}</p>
                               <div className="flex items-center gap-2 mt-1">
                                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{log.location || 'Central Intelligence'}</span>
                                 <span className="text-gray-300">•</span>
                                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(log.time).toLocaleDateString()}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center justify-end gap-6 sm:w-auto w-full">
                           <span className="text-[11px] font-bold text-[#050B18] font-mono opacity-60 bg-[#F5F5F7] px-3 py-1.5 rounded-lg">
                             {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                           </span>
                           <button onClick={() => handleDeleteLog(log.id)} className="p-2.5 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                             <Trash2 className="w-4 h-4"/>
                           </button>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>
         </div>

         {/* Protocols & Summary */}
         <div className="space-y-10">
            <div className="apple-card p-8 border-none shadow-xl shadow-gray-100">
               <h3 className="text-xl font-bold text-[#050B18] mb-8 tracking-tight">Active Protocols</h3>
                <div className="space-y-4">
                  {[
                    { field: 'biometric_locks', label: 'Bio-Metric Locks', status: systemStatus.biometric_locks, icon: <Lock className="w-5 h-5" /> },
                    { field: 'infrared_scanners', label: 'Infrared Network', status: systemStatus.infrared_scanners, icon: <Eye className="w-5 h-5" /> },
                    { field: 'radio_silent', label: 'Radio Silence', status: systemStatus.radio_silent, icon: <Radio className="w-5 h-5" /> },
                  ].map((proto, i) => (
                    <div 
                      key={i} 
                      onClick={() => toggleProtocol(proto.field, proto.status)}
                      className="flex items-center justify-between p-5 bg-[#F5F5F7] rounded-2xl cursor-pointer hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all duration-300 group"
                    >
                       <div className="flex items-center gap-5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${proto.status === 'Active' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'bg-gray-100 text-gray-400'}`}>{proto.icon}</div>
                          <span className="text-[11px] font-bold text-[#050B18] uppercase tracking-[0.2em]">{proto.label}</span>
                       </div>
                       <span className={`badge-apple py-1.5 px-3 ${proto.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-white text-gray-400 border-gray-200 shadow-sm'}`}>
                          {proto.status}
                       </span>
                    </div>
                  ))}
                </div>
            </div>

            <div className={`apple-card p-10 relative overflow-hidden transition-all duration-700 border-none shadow-2xl ${systemStatus.lockdown_active ? 'bg-red-600 text-white shadow-red-900/20' : 'bg-[#050B18] text-white shadow-[#050B18]/20'}`}>
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[60px] -translate-y-24 translate-x-24" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-[40px] translate-y-16 -translate-x-16" />
               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className={`p-3 rounded-2xl ${systemStatus.lockdown_active ? 'bg-white/20' : 'bg-white/10'}`}>
                     <AlertTriangle className={`w-6 h-6 ${systemStatus.lockdown_active ? 'animate-pulse text-white' : 'text-[#C9A84C]'}`} />
                  </div>
                  <h3 className="font-bold text-2xl tracking-tighter">System Integrity</h3>
               </div>
               <div className="space-y-6 relative z-10 mb-10">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mb-1">Network Status</p>
                     <p className={`font-bold text-lg tracking-tight ${systemStatus.lockdown_active ? 'text-white' : 'text-[#C9A84C]'}`}>
                        {systemStatus.lockdown_active ? 'EMERGENCY LOCKDOWN' : 'NOMINAL OPERATION'}
                     </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mb-1">Last Secure Audit</p>
                     <p className="font-bold text-lg text-white tracking-tight">{new Date(systemStatus.last_audit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Core Health</span>
                      <span className="text-sm font-bold text-[#C9A84C]">{systemStatus.system_health}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${systemStatus.system_health}%` }}
                        className="h-full bg-[#C9A84C]"
                      />
                    </div>
                  </div>
               </div>
               <button 
                 onClick={handleSecurityAudit}
                 className="w-full py-5 rounded-2xl border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-300 relative z-10"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Force Security Audit'}
               </button>
            </div>
         </div>
      </div>

      {/* Incident Reporting Side Drawer */}
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
             className="relative w-full max-w-lg h-full apple-card p-0 flex flex-col border-none shadow-2xl"
           >
              <div className="p-10 border-b border-gray-50 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-3xl font-bold text-[#050B18] tracking-tighter">Incident Protocol</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1.5">Official Security Ledger Entry</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-3.5 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                   <X className="w-6 h-6"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 <form id="incident-form" onSubmit={handleAddLog} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Event Description</label>
                      <input required value={newLog.event} onChange={e=>setNewLog({...newLog, event: e.target.value})} type="text" className="input-apple w-full py-4 text-base" placeholder="Describe the breach or incident..." />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Sector / Location</label>
                      <input required value={newLog.location} onChange={e=>setNewLog({...newLog, location: e.target.value})} type="text" className="input-apple w-full py-4 text-base" placeholder="e.g. Server Room B, Vault Entrance" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Severity Index</label>
                      <div className="relative">
                        <select value={newLog.status} onChange={e=>setNewLog({...newLog, status: e.target.value})} className="input-apple w-full appearance-none py-4 text-base font-medium">
                          <option value="Info">Information (Routine)</option>
                          <option value="Warning">Warning (Elevated Risk)</option>
                          <option value="Critical">Critical (Immediate Breach)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                           <div className={`w-3 h-3 rounded-full ${newLog.status === 'Critical' ? 'bg-red-500' : newLog.status === 'Warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                        </div>
                      </div>
                    </div>
                 </form>
              </div>

              <div className="p-10 bg-white border-t border-gray-50 shrink-0">
                 <button form="incident-form" type="submit" className="btn-apple-primary w-full py-5 text-base shadow-xl shadow-[#050B18]/10">
                   {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Commit to Security Ledger'}
                 </button>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default SecuritySystem;
