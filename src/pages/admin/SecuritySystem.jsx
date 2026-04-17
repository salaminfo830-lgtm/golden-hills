import React from 'react';
import { ShieldCheck, Activity, Eye, FileSearch, Lock, Unlock, AlertCircle, RefreshCw } from 'lucide-react';
import GlassCard from '../../components/GlassCard';

const SecuritySystem = () => {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold">Network & Asset Security</h2>
          <p className="text-gray-400 font-medium">Monitoring property access and system integrity</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors">
             <AlertCircle className="w-4 h-4" /> EMERGENCY LOCKDOWN
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Live Camera System Mock */}
         <GlassCard className="bg-white border-gray-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold flex items-center gap-3"><Eye className="text-luxury-gold" /> Critical Camera Feeds</h3>
               <span className="flex items-center gap-2 text-xs font-bold text-luxury-gold"><RefreshCw className="w-3 h-3 animate-spin" /> LIVE</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Main Entrance', color: 'bg-gray-100' },
                 { label: 'Reception Desk', color: 'bg-luxury-gold/5' },
                 { label: 'VIP Lounge', color: 'bg-gray-50' },
                 { label: 'Service Loading', color: 'bg-gray-100' },
               ].map((cam, i) => (
                 <div key={i} className="relative aspect-video rounded-xl overflow-hidden group border border-gray-100">
                    <div className={`w-full h-full ${cam.color} flex items-center justify-center`}>
                       <ShieldCheck className="w-8 h-8 opacity-5 text-luxury-black" />
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-500" />
                       <span className="text-[8px] font-bold text-white bg-black/40 px-2 py-0.5 rounded uppercase">{cam.label}</span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                       <button className="p-2 glass rounded-full text-white"><Eye className="w-4 h-4" /></button>
                    </div>
                 </div>
               ))}
            </div>
         </GlassCard>

         <div className="space-y-8">
            <GlassCard className="bg-luxury-black text-white p-8">
               <h3 className="text-xl font-bold mb-8">System Status</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Fire Suppression', status: 'Optimal', color: 'text-green-500' },
                    { label: 'Elevator Banks', status: 'Functional', color: 'text-green-500' },
                    { label: 'Access Control', status: 'Active', color: 'text-luxury-gold' },
                    { label: 'Server Room', status: 'Cooling Warning', color: 'text-orange-500' },
                  ].map((sys, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                       <span className="text-sm font-medium opacity-60 font-serif">{sys.label}</span>
                       <span className={`text-xs font-bold uppercase tracking-widest ${sys.color}`}>{sys.status}</span>
                    </div>
                  ))}
               </div>
            </GlassCard>

            <GlassCard className="bg-white border-gray-100 p-8">
               <h3 className="text-xl font-bold mb-6 italic font-serif tracking-tight">Access Control Logs</h3>
               <div className="space-y-4">
                  {[
                    { user: 'ID: 4492', action: 'Elevator-7 Access', floor: 'Level 4', time: '14:42:01' },
                    { user: 'ID: 1022', action: 'Supply Room 02', floor: 'Basement', time: '14:40:15' },
                    { user: 'ID: 5560', action: 'Management Office', floor: 'Level 10', time: '14:38:55' },
                  ].map((log, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                             <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{log.action}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">{log.user} • {log.floor}</p>
                          </div>
                       </div>
                       <p className="text-[10px] text-gray-300 font-bold">{log.time}</p>
                    </div>
                  ))}
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

export default SecuritySystem;
