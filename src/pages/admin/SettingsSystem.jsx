import { useState, useEffect } from 'react';
import { 
  Globe, Bell, Shield, Database, Palette, Save, 
  Loader2, CheckCircle2, Upload, Monitor,
  Mail, Smartphone, ShieldAlert, Key, Clock,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const SettingsSystem = () => {
  const [activeTab, setActiveTab] = useState('General Info');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error

  useEffect(() => {
    fetchSettings();

    const subscription = supabase
      .channel('public:Settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Settings' }, payload => {
        setSettings(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('Settings')
      .select('*')
      .eq('id', 'global')
      .single();
    
    if (data) {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleChange = async (field, value) => {
    const updatedSettings = { ...settings, [field]: value };
    setSettings(updatedSettings); // Optimistic update
    
    setSaveStatus('saving');
    const { error } = await supabase
      .from('Settings')
      .update({ [field]: value })
      .eq('id', 'global');
    
    if (!error) {
       setTimeout(() => setSaveStatus('saved'), 500);
    } else {
       setSaveStatus('error');
    }
  };

  if (loading || !settings) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-luxury-gold animate-spin mb-4" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accessing Property Core Settings</p>
      </div>
    );
  }

  const tabs = [
    { icon: <Globe />, label: 'General Info' },
    { icon: <Palette />, label: 'Look & Feel' },
    { icon: <Bell />, label: 'Notifications' },
    { icon: <Shield />, label: 'Privacy & Security' },
    { icon: <Database />, label: 'Integrations' },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-luxury-black">System Configuration</h2>
          <p className="text-gray-400 font-medium tracking-wide text-sm font-semibold">Global platform settings for Golden Hills Hotel</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto items-center">
           {saveStatus === 'saving' && <span className="text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest"><Loader2 className="w-4 h-4 animate-spin"/> Syncing...</span>}
           {saveStatus === 'saved' && <span className="text-sm font-bold text-green-500 flex items-center gap-2 uppercase tracking-widest"><CheckCircle2 className="w-4 h-4"/> Changes Saved</span>}
           {saveStatus === 'error' && <span className="text-sm font-bold text-red-500 uppercase tracking-widest">Error Saving</span>}
           <GoldButton className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 md:py-3 shadow-lg opacity-50 cursor-not-allowed">
             <Save className="w-4 h-4" /> AUTO-SAVE ACTIVE
           </GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar lg:col-span-1">
           {tabs.map((item, i) => (
             <button 
               key={i} 
               onClick={() => setActiveTab(item.label)}
               className={`flex-1 lg:flex-none flex items-center gap-4 px-6 py-4 rounded-2xl transition-all whitespace-nowrap border shrink-0 ${
               activeTab === item.label ? 'bg-white shadow-sm text-luxury-gold border-luxury-gold/20' : 'text-gray-400 border-transparent hover:text-luxury-black hover:bg-white/40'
             }`}>
                <div className="shrink-0 scale-75 md:scale-100">{item.icon}</div>
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em]">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {activeTab === 'General Info' && (
              <GlassCard className="bg-white border-gray-100 p-6 md:p-10 shadow-sm">
                <h3 className="text-xl font-bold font-serif mb-10 pb-6 border-b border-gray-100 text-luxury-black">General Information</h3>
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Hotel Entity Name</label>
                         <input type="text" value={settings.hotel_name} onChange={(e) => handleChange('hotel_name', e.target.value)} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all shadow-inner" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">System Liaison Email</label>
                         <input type="email" value={settings.contact_email} onChange={(e) => handleChange('contact_email', e.target.value)} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all shadow-inner" />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Property Headquarters Address</label>
                      <textarea rows="3" value={settings.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all shadow-inner resize-none"></textarea>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Reporting Currency</label>
                         <select value={settings.currency} onChange={(e) => handleChange('currency', e.target.value)} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all cursor-pointer">
                            <option value="DZD">DZD (Algerian Dinar)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                         </select>
                      </div>
                      <div className="space-y-3 md:col-span-2">
                         <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Global Property Timezone</label>
                         <select value={settings.timezone} onChange={(e) => handleChange('timezone', e.target.value)} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold focus:bg-white outline-none transition-all cursor-pointer">
                            <option>(GMT+01:00) Algiers, Casablanca, Tunis</option>
                            <option>(GMT+00:00) London, Lisbon</option>
                         </select>
                      </div>
                   </div>
                </div>
              </GlassCard>
           )}

           {activeTab === 'Look & Feel' && (
              <GlassCard className="bg-white border-gray-100 p-6 md:p-10 shadow-sm">
                 <h3 className="text-xl font-bold font-serif mb-10 pb-6 border-b border-gray-100 text-luxury-black">Branding & Virtual Style</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Official Brand Mark</label>
                          <div className="flex items-center gap-6">
                             <div className="w-24 h-24 gold-gradient rounded-3xl flex items-center justify-center text-white text-3xl font-serif font-bold shadow-xl overflow-hidden">
                                {settings.logo_url ? <img src={settings.logo_url} className="w-full h-full object-cover" /> : 'G'}
                             </div>
                             <div className="space-y-2">
                                <GoldButton outline className="px-6 py-2 text-[10px] flex items-center gap-2">
                                   <Upload className="w-3 h-3" /> UPLOAD LOGO
                                </GoldButton>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">SVG, PNG Recommended</p>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Primary Brand Color</label>
                          <div className="flex items-center gap-4">
                             <input type="color" value={settings.brand_color_primary} onChange={(e) => handleChange('brand_color_primary', e.target.value)} className="w-12 h-12 rounded-xl border-0 cursor-pointer p-0" />
                             <input type="text" value={settings.brand_color_primary} onChange={(e) => handleChange('brand_color_primary', e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold w-32" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Hero Section Image</label>
                          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 relative group cursor-pointer">
                             <img src={settings.hero_image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                   <Monitor className="w-4 h-4" /> Change Background
                                </span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </GlassCard>
           )}

           {activeTab === 'Notifications' && (
              <div className="space-y-6">
                 <GlassCard className="bg-white border-gray-100 p-8">
                    <div className="flex items-center gap-6 mb-8 border-b border-gray-50 pb-6">
                       <div className="p-3 bg-blue-50 rounded-2xl text-blue-500"><Mail className="w-6 h-6" /></div>
                       <div>
                          <h4 className="font-bold text-luxury-black">Email Notification Triggers</h4>
                          <p className="text-xs text-gray-400 font-medium">Configure what events trigger an automated system email</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       {[
                         { field: 'email_notifications_reservations', label: 'New Guest Reservation', desc: 'Email admin on every new booking' },
                         { field: 'email_notifications_stock', label: 'Stock Critical Alert', desc: 'Notify inventory manager when items are low' },
                         { field: 'email_notifications_staff', label: 'Staff Shift Start/End', desc: 'Summary of daily personnel attendance' }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group" onClick={() => handleChange(item.field, !settings[item.field])}>
                            <div>
                               <p className="font-bold text-sm text-gray-700">{item.label}</p>
                               <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 transition-all ${settings[item.field] ? 'bg-luxury-gold' : 'bg-gray-200'}`}>
                               <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings[item.field] ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </GlassCard>

                 <GlassCard className="bg-white border-gray-100 p-8">
                    <div className="flex items-center gap-6 mb-8 border-b border-gray-50 pb-6">
                       <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500"><Smartphone className="w-6 h-6" /></div>
                       <div>
                          <h4 className="font-bold text-luxury-black">SMS & Push Integration</h4>
                          <p className="text-xs text-gray-400 font-medium">Real-time alerts to staff mobile devices</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Primary Contact Phone</label>
                          <input type="text" value={settings.contact_phone} onChange={(e) => handleChange('contact_phone', e.target.value)} className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all" />
                       </div>
                       <GoldButton outline className="w-full py-4 text-[10px] border-dashed border-2">CONFIGURE SMS GATEWAY</GoldButton>
                    </div>
                 </GlassCard>
              </div>
           )}

           {activeTab === 'Privacy & Security' && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassCard className="bg-white border-gray-100 p-8">
                       <ShieldAlert className="w-6 h-6 text-red-500 mb-4" />
                       <h4 className="font-bold text-luxury-black mb-1">Session Management</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Security Policy</p>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Inactivity Timeout (Min)</label>
                             <input type="number" value={settings.session_timeout} onChange={(e) => handleChange('session_timeout', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" />
                          </div>
                          <div className="flex items-center justify-between py-2">
                             <span className="text-xs font-bold text-gray-600">Enforce 2FA for Admins</span>
                             <div className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer ${settings.two_factor_enabled ? 'bg-luxury-gold' : 'bg-gray-200'}`} onClick={() => handleChange('two_factor_enabled', !settings.two_factor_enabled)}>
                                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${settings.two_factor_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                             </div>
                          </div>
                       </div>
                    </GlassCard>
                    <GlassCard className="bg-white border-gray-100 p-8">
                       <Key className="w-6 h-6 text-luxury-gold mb-4" />
                       <h4 className="font-bold text-luxury-black mb-1">Password Policies</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Credential Integrity</p>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Minimum Characters</label>
                             <input type="number" value={settings.password_min_length} onChange={(e) => handleChange('password_min_length', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Data Retention (Days)</label>
                             <input type="number" value={settings.data_retention_days} onChange={(e) => handleChange('data_retention_days', Number(e.target.value))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" />
                          </div>
                       </div>
                    </GlassCard>
                 </div>

                 <GlassCard className="bg-[#1a1a1a] text-white p-10 border-0 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold opacity-10 rounded-full translate-x-32 -translate-y-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                       <div className="flex items-center gap-4 mb-6">
                          <CheckCircle2 className="w-8 h-8 text-luxury-gold" />
                          <h4 className="text-2xl font-serif font-bold">GDPR & Algerian Data Privacy</h4>
                       </div>
                       <p className="text-white/60 text-sm mb-8 max-w-2xl leading-relaxed">
                          Your platform settings are automatically synced with national data protection regulations. 
                          The Golden Hills encryption protocol (GHE-256) is active for all guest records.
                       </p>
                       <div className="flex gap-4">
                          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Download Audit Log</button>
                          <button className="px-6 py-3 bg-luxury-gold text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-luxury-gold/20">Verify Compliance</button>
                       </div>
                    </div>
                 </GlassCard>
              </div>
           )}

           {activeTab === 'Integrations' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { name: 'Stripe Payments', status: 'Connected', icon: <Save className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-500' },
                   { name: 'Cloudflare security', status: 'Active', icon: <Shield className="w-6 h-6" />, color: 'bg-orange-50 text-orange-500' },
                   { name: 'Booking.com Sync', status: 'Disconnected', icon: <LinkIcon className="w-6 h-6" />, color: 'bg-blue-50 text-blue-500' },
                   { name: 'SMS Gateway Pro', status: 'Pending', icon: <Smartphone className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-500' },
                 ].map((box, i) => (
                   <GlassCard key={i} className="bg-white border-gray-100 p-8 flex items-center justify-between group hover:border-luxury-gold/30 transition-all">
                      <div className="flex items-center gap-6">
                         <div className={`p-4 rounded-2xl ${box.color} group-hover:scale-110 transition-transform`}>{box.icon}</div>
                         <div>
                            <h4 className="font-bold text-luxury-black">{box.name}</h4>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${box.status === 'Connected' || box.status === 'Active' ? 'text-green-500' : 'text-gray-400'}`}>{box.status}</p>
                         </div>
                      </div>
                      <button className="text-[10px] font-bold text-gray-300 hover:text-luxury-black uppercase tracking-widest transition-colors">Configure</button>
                   </GlassCard>
                 ))}
                 <GlassCard className="bg-gray-50 border-gray-100 border-dashed border-2 flex flex-col items-center justify-center p-12 text-center opacity-60">
                    <PlusIcon className="w-8 h-8 text-gray-300 mb-4" />
                    <h5 className="font-bold text-gray-400 text-sm uppercase tracking-widest">Connect New Service</h5>
                 </GlassCard>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

const PlusIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default SettingsSystem;

