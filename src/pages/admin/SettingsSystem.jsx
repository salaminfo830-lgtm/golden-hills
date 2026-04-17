import React from 'react';
import { Settings, Globe, Bell, Shield, Database, Palette, HelpCircle, Save } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const SettingsSystem = () => {
  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-serif font-bold">System Configurations</h2>
        <p className="text-gray-400 font-medium">Global platform settings for Golden Hills Hotel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav for Settings */}
        <div className="space-y-2 lg:col-span-1">
           {[
             { icon: <Globe />, label: 'General Info' },
             { icon: <Palette />, label: 'Look & Feel' },
             { icon: <Bell />, label: 'Notifications' },
             { icon: <Shield />, label: 'Privacy & Security' },
             { icon: <Database />, label: 'Integrations' },
             { icon: <HelpCircle />, label: 'Support & Docs' },
           ].map((item, i) => (
             <button key={i} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${i === 0 ? 'bg-white shadow-sm text-luxury-gold' : 'text-gray-400 hover:text-luxury-black hover:bg-white/40'}`}>
                <div className="shrink-0">{item.icon}</div>
                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8">
           <GlassCard className="bg-white border-gray-100 p-10">
              <h3 className="text-xl font-bold mb-10 pb-6 border-b border-gray-50 uppercase tracking-widest text-gray-800">General Information</h3>
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Hotel Name</label>
                       <input type="text" defaultValue="Golden Hills Hotel Setif" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-luxury-gold outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Official Email</label>
                       <input type="email" defaultValue="contact@goldenhills.dz" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-luxury-gold outline-none transition-colors" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Hotel Address</label>
                    <textarea rows="3" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-luxury-gold outline-none transition-colors">Blvd des Orangers, Setif, Algeria</textarea>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Primary Currency</label>
                       <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-luxury-gold outline-none transition-colors">
                          <option>DZD ($)</option>
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                       </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Timezone</label>
                       <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-luxury-gold outline-none transition-colors">
                          <option>(GMT+01:00) Algiers, Casablanca, Tunis</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-10 flex justify-end gap-4">
                    <button className="px-8 py-3 text-sm font-bold text-gray-400 hover:text-luxury-black transition-colors">Reset to Default</button>
                    <GoldButton className="flex items-center gap-2 px-10">
                       <Save className="w-4 h-4" /> SAVE CHANGES
                    </GoldButton>
                 </div>
              </div>
           </GlassCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="bg-white border-gray-100">
                 <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Branding Assets</h4>
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center text-white text-2xl font-serif font-bold">G</div>
                    <div>
                       <p className="text-xs font-bold text-gray-800 uppercase">Main Logo Icon</p>
                       <p className="text-[10px] text-gray-400 mb-3 uppercase font-bold">Vector SVG Supported</p>
                       <GoldButton outline className="px-4 py-1.5 text-[10px]">REPLACE</GoldButton>
                    </div>
                 </div>
              </GlassCard>
              <GlassCard className="bg-luxury-gold/5 border-luxury-gold/20 flex flex-col justify-center items-center text-center">
                 <Shield className="w-8 h-8 text-luxury-gold mb-3" />
                 <h4 className="font-bold text-sm tracking-widest uppercase mb-1">Backup Protection</h4>
                 <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">Last backup: 2h ago</p>
                 <button className="text-[10px] font-bold text-luxury-gold uppercase underline">Run Backup Now</button>
              </GlassCard>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSystem;
