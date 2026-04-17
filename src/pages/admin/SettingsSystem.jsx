import React from 'react';
import { Settings, Globe, Bell, Shield, Database, Palette, HelpCircle, Save } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const SettingsSystem = () => {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-luxury-black">System Configuration</h2>
          <p className="text-gray-400 font-medium tracking-wide text-sm font-semibold">Global platform settings for Golden Hills Hotel</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 md:py-3 shadow-lg">
             <Save className="w-4 h-4" /> APPLY GLOBAL CHANGES
           </GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav for Settings */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide lg:col-span-1">
           {[
             { icon: <Globe />, label: 'General Info' },
             { icon: <Palette />, label: 'Look & Feel' },
             { icon: <Bell />, label: 'Notifications' },
             { icon: <Shield />, label: 'Privacy & Security' },
             { icon: <Database />, label: 'Integrations' },
           ].map((item, i) => (
             <button key={i} className={`flex-1 lg:flex-none flex items-center gap-4 px-6 py-4 rounded-2xl transition-all whitespace-nowrap border shrink-0 ${
               i === 0 ? 'bg-white shadow-sm text-luxury-gold border-luxury-gold/20' : 'text-gray-400 border-transparent hover:text-luxury-black hover:bg-white/40'
             }`}>
                <div className="shrink-0 scale-75 md:scale-100">{item.icon}</div>
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em]">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8">
           <GlassCard className="bg-white border-gray-100 p-6 md:p-10 shadow-sm">
              <h3 className="text-xl font-bold font-serif mb-10 pb-6 border-b border-gray-100 text-luxury-black">General Information</h3>
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Hotel Entity Name</label>
                       <input type="text" defaultValue="Golden Hills Hotel Setif" className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all shadow-inner" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">System Liaison Email</label>
                       <input type="email" defaultValue="contact@goldenhills.dz" className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all shadow-inner" />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Property Headquarters Address</label>
                    <textarea rows="3" className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all shadow-inner resize-none">Blvd des Orangers, Setif, Algeria</textarea>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Reporting Currency</label>
                       <select className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all cursor-pointer">
                          <option>DZD (Algerian Dinar)</option>
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                       </select>
                    </div>
                    <div className="space-y-3 md:col-span-2">
                       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Global Property Timezone</label>
                       <select className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all cursor-pointer">
                          <option>(GMT+01:00) Algiers, Casablanca, Tunis</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-10 flex flex-col md:flex-row justify-end items-center gap-6">
                    <button className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors">Reset all fields to default</button>
                    <GoldButton className="w-full md:w-auto px-12 py-4">UPDATE PLATFORM</GoldButton>
                 </div>
              </div>
           </GlassCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="bg-white border-gray-100 group">
                 <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em] text-gray-400">Branding & Identity</h4>
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 gold-gradient rounded-3xl flex items-center justify-center text-white text-3xl font-serif font-bold shadow-gold group-hover:scale-110 transition-transform">G</div>
                    <div>
                       <p className="text-xs font-bold text-luxury-black uppercase tracking-widest">Main Logo Mark</p>
                       <p className="text-[10px] text-gray-400 mb-4 uppercase font-bold">Standard SVG/PNG</p>
                       <GoldButton outline className="px-6 py-2 text-[10px]">UPLOAD NEW</GoldButton>
                    </div>
                 </div>
              </GlassCard>
              <GlassCard className="bg-luxury-black text-white p-8 flex flex-col justify-center items-center text-center group border-transparent">
                 <div className="p-4 bg-white/5 rounded-2xl mb-4 group-hover:bg-luxury-gold transition-colors duration-500">
                    <Shield className="w-8 h-8 text-luxury-gold group-hover:text-white" />
                 </div>
                 <h4 className="font-bold text-sm tracking-[0.2em] uppercase mb-1">Backup Protection</h4>
                 <p className="text-[10px] text-white/40 font-bold uppercase mb-6 tracking-widest">Property state backed up 2h ago</p>
                 <button className="text-[10px] font-bold text-luxury-gold uppercase underline decoration-2 underline-offset-4 hover:text-white transition-colors">INITIATE CLOUD BACKUP</button>
              </GlassCard>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSystem;
