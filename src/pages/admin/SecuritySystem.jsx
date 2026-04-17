import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Eye, Lock, Zap, 
  AlertTriangle, History, 
  Loader2, Radio
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const SecuritySystem = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();

    const subscription = supabase
      .channel('public:SecurityLog')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'SecurityLog' }, () => fetchLogs())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('SecurityLog')
      .select('*')
      .order('time', { ascending: false })
      .limit(10);
    
    if (!error) {
      setLogs(data);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Security Command</h2>
          <p className="text-gray-400 font-medium tracking-wide">Live surveillance & threat assessment network</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline className="flex-1 md:flex-none py-3 px-6 text-[10px] cursor-not-allowed opacity-50">INCIDENT REPORT</GoldButton>
           <GoldButton className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 border-none cursor-not-allowed opacity-50">
             <Zap className="w-4 h-4" /> EMERGENCY LOCK
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
                  {loading && <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" />}
               </div>
               <div className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                    {logs.length === 0 ? (
                      <div className="p-20 text-center">
                         <p className="text-gray-400 font-medium italic">Scanning for recent events...</p>
                      </div>
                    ) : logs.map((log) => (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={log.id} 
                        className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                         <span className="text-[10px] font-bold text-gray-400">
                           {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
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
                    { label: 'Bio-Metric Locks', status: 'Active', icon: <Lock /> },
                    { label: 'Infrared Scanners', status: 'Active', icon: <Eye /> },
                    { label: 'Radio Silents', status: 'Inactive', icon: <Radio /> },
                  ].map((proto, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                       <div className="flex items-center gap-4">
                          <div className="text-luxury-gold">{proto.icon}</div>
                          <span className="text-xs font-bold text-gray-700">{proto.label}</span>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase ${proto.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {proto.status}
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>

            <GlassCard className="gold-gradient text-white p-8">
               <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-white" />
                  <h3 className="font-bold text-lg">System Status</h3>
               </div>
               <p className="text-xs opacity-90 leading-relaxed mb-6 font-medium">
                  Shield protocol is currently <span className="underline">NOMINAL</span>. Perimeter integrity verified at 04:00 AM.
               </p>
               <GoldButton outline className="w-full border-white/50 text-white hover:bg-white hover:text-luxury-gold">SECURITY AUDIT</GoldButton>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

export default SecuritySystem;
