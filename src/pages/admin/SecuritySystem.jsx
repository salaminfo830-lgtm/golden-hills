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
  }, []);

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
    const { data, error } = await supabase
      .from('SecurityLog')
      .select('*')
      .order('time', { ascending: false })
      .limit(20);
    
    if (!error) {
      setLogs(data || []);
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
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Security Command</h2>
          <p className="text-gray-400 font-medium tracking-wide">Live surveillance & threat assessment network</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton onClick={() => setShowAddModal(true)} outline className="flex-1 md:flex-none py-3 px-6 text-[10px]"><Plus className="w-4 h-4 inline mr-1" /> INCIDENT REPORT</GoldButton>
           <GoldButton 
             onClick={handleEmergencyLock} 
             className={`flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2 border-none text-white transition-all duration-500 ${
               systemStatus.lockdown_active 
                 ? 'bg-green-600 hover:bg-green-700 shadow-[0_0_20px_rgba(22,163,74,0.4)]' 
                 : 'bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
             }`}
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
             {systemStatus.lockdown_active ? 'RELEASE LOCKDOWN' : 'EMERGENCY LOCKDOWN'}
           </GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { id: 'CAM-01', loc: 'Main Entrance', status: 'Live' },
                 { id: 'CAM-08', loc: 'Vault Corridor', status: 'Live' },
               ].map((cam) => (
                 <GlassCard key={cam.id} className="p-0 overflow-hidden group">
                    <div className="aspect-video bg-luxury-black relative">
                       <div className="absolute top-4 left-4 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{cam.status} • {cam.id}</span>
                       </div>
                       <div className="absolute bottom-4 left-4">
                          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{cam.loc}</p>
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <button className="p-4 bg-white/20 rounded-full backdrop-blur-md text-white border border-white/30"><Eye className="w-6 h-6" /></button>
                       </div>
                    </div>
                 </GlassCard>
               ))}
            </div>

            <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold font-serif text-lg flex items-center gap-2">
                     <History className="w-5 h-5 text-luxury-gold" /> System Activity
                  </h3>
                  <button onClick={fetchLogs}><Loader2 className={`w-4 h-4 text-luxury-gold ${loading ? 'animate-spin' : ''}`} /></button>
               </div>
               <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {logs.length === 0 ? (
                      <div className="p-20 text-center">
                         <p className="text-gray-400 font-medium italic">Scanning for recent events...</p>
                      </div>
                    ) : logs.map((log) => (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={log.id} 
                        className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${
                              log.status === 'Critical' ? 'bg-red-50 text-red-500' :
                              log.status === 'Warning' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                            }`}>
                               <Shield className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="font-bold text-sm text-gray-800">{log.event}</p>
                               <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{log.location || 'Central Station'}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                           <span className="text-[10px] font-bold text-gray-400">
                             {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                           <button onClick={() => handleDeleteLog(log.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </GlassCard>
         </div>

         <div className="space-y-8">
            <GlassCard className="bg-white border-gray-100 p-8">
               <h3 className="text-xl font-bold mb-8">Active Protocols</h3>
                <div className="space-y-6">
                  {[
                    { field: 'biometric_locks', label: 'Bio-Metric Locks', status: systemStatus.biometric_locks, icon: <Lock /> },
                    { field: 'infrared_scanners', label: 'Infrared Scanners', status: systemStatus.infrared_scanners, icon: <Eye /> },
                    { field: 'radio_silent', label: 'Radio Silents', status: systemStatus.radio_silent, icon: <Radio /> },
                  ].map((proto, i) => (
                    <div 
                      key={i} 
                      onClick={() => toggleProtocol(proto.field, proto.status)}
                      className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white hover:shadow-sm transition-all group"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`transition-colors ${proto.status === 'Active' ? 'text-luxury-gold' : 'text-gray-300'}`}>{proto.icon}</div>
                          <span className="text-xs font-bold text-gray-700">{proto.label}</span>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase transition-all ${proto.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {proto.status}
                       </div>
                    </div>
                  ))}
                </div>
            </GlassCard>

            <GlassCard className={`${systemStatus.lockdown_active ? 'bg-red-600' : 'gold-gradient'} text-white p-8 transition-colors duration-700`}>
               <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className={`text-white ${systemStatus.lockdown_active ? 'animate-pulse' : ''}`} />
                  <h3 className="font-bold text-lg">System Status</h3>
               </div>
               <p className="text-xs opacity-90 leading-relaxed mb-6 font-medium">
                  Shield protocol is currently <span className="underline font-bold">{systemStatus.lockdown_active ? 'LOCKDOWN' : 'NOMINAL'}</span>. 
                  Last audit performed {new Date(systemStatus.last_audit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today.
                  System health: {systemStatus.system_health}%.
               </p>
               <GoldButton 
                 onClick={handleSecurityAudit}
                 outline 
                 className="w-full border-white/50 text-white hover:bg-white hover:text-luxury-gold"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'SECURITY AUDIT'}
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
              <h3 className="text-xl font-bold font-serif mb-6">Log Security Incident</h3>
              <form onSubmit={handleAddLog} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Event Description</label>
                  <input required value={newLog.event} onChange={e=>setNewLog({...newLog, event: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Location</label>
                  <input required value={newLog.location} onChange={e=>setNewLog({...newLog, location: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Severity Index</label>
                  <select value={newLog.status} onChange={e=>setNewLog({...newLog, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none">
                    <option>Info</option>
                    <option>Warning</option>
                    <option>Critical</option>
                  </select>
                </div>
                <GoldButton type="submit" className="w-full mt-6 py-3">SUBMIT REPORT</GoldButton>
              </form>
           </GlassCard>
        </div>
      )}

    </div>
  );
};

export default SecuritySystem;
