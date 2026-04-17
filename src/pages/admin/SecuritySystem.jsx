import React from 'react';
import { ShieldCheck, Activity, Eye, FileSearch, Lock, Unlock, AlertCircle, RefreshCw } from 'lucide-react';
import GlassCard from '../../components/GlassCard';

const SecuritySystem = () => {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Security & surveillance</h2>
          <p className="text-gray-400 font-medium tracking-wide text-sm font-semibold">Monitoring property access and system integrity</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-red-50 text-red-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-100 transition-colors shadow-sm">
             <AlertCircle className="w-4 h-4" /> EMERGENCY LOCKDOWN
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Live Camera System Mock */}
         <GlassCard className="bg-white border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
               <h3 className="text-xl font-bold font-serif flex items-center gap-3"><Eye className="text-luxury-gold w-5 h-5" /> Critical Feeds</h3>
               <div className="flex items-center gap-3 w-full md:w-auto bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">LIVE STREAM ACTIVE</span>
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { label: 'Main Entrance', color: 'bg-gray-100' },
                 { label: 'Reception Desk', color: 'bg-luxury-gold/5' },
                 { label: 'VIP Lounge', color: 'bg-gray-50' },
                 { label: 'Service Loading', color: 'bg-gray-100' },
               ].map((cam, i) => (
                 <div key={i} className="relative aspect-video rounded-2xl overflow-hidden group border border-gray-100 shadow-sm">
                    <div className={`w-full h-full ${cam.color} flex items-center justify-center transition-transform duration-700 group-hover:scale-110`}>
                       <ShieldCheck className="w-10 h-10 opacity-5 text-luxury-black" />
                    </div>
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                       <span className="text-[9px] font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg uppercase tracking-tight">{cam.label}</span>
                    </div>
                    <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                       <button className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                          <Eye className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </GlassCard>

         <div className="space-y-8">
            <GlassCard className="bg-luxury-black text-white p-8">
               <h3 className="text-xl font-bold mb-10 font-serif">System Infrastructure</h3>
               <div className="space-y-8">
                  {[
                    { label: 'Fire Suppression', status: 'Optimal', color: 'text-green-500', bar: 100 },
                    { label: 'Elevator Banks', status: 'Functional', color: 'text-green-500', bar: 95 },
                    { label: 'Access Control', status: 'Active', color: 'text-luxury-gold', bar: 100 },
                    { label: 'Server Room', status: 'Cooling Warning', color: 'text-orange-400', bar: 78 },
                  ].map((sys, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">{sys.label}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${sys.color}`}>{sys.status}</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${sys.bar}%` }}
                             className={`h-full ${sys.status.includes('Warning') ? 'bg-orange-400' : 'bg-luxury-gold'}`}
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>

            <GlassCard className="bg-white border-gray-100 p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold italic font-serif tracking-tight">Access Control Logs</h3>
                  <span className="text-[10px] uppercase font-bold text-luxury-gold border-b border-luxury-gold cursor-pointer">Export Logs</span>
               </div>
               <div className="space-y-6">
                  {[
                    { user: 'ID: 4492', action: 'Elevator-7 Access', floor: 'Level 4', time: '14:42:01' },
                    { user: 'ID: 1022', action: 'Supply Room 02', floor: 'Basement', time: '14:40:15' },
                    { user: 'ID: 5560', action: 'Management Office', floor: 'Level 10', time: '14:38:55' },
                  ].map((log, i) => (
                    <div key={i} className="flex justify-between items-center group cursor-default">
                       <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all">
                             <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-luxury-black">{log.action}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{log.user} • {log.floor}</p>
                          </div>
                       </div>
                       <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">{log.time}</p>
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
