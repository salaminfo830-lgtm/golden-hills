import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Bell, Shield, Database, Palette, Save, 
  Loader2, CheckCircle2, Upload, Monitor,
  Mail, Smartphone, ShieldAlert, Key, Clock,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

import { useSettings } from '../../context/SettingsContext';

const SettingsSystem = () => {
  const { settings, loading, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('General Info');
  const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };
  
  const logoInputRef = useRef(null);
  const heroInputRef = useRef(null);

  const handleChange = async (field, value) => {
    setSaveStatus('saving');
    const { success, error } = await updateSettings({ [field]: value });
    
    if (success) {
       setTimeout(() => setSaveStatus('saved'), 500);
       // showToast('Settings updated', 'success'); // Optional, since there's already a status indicator
    } else {
       console.error('Settings update error:', error);
       showToast('CRITICAL ERROR: ' + (error?.message || 'Could not save settings'), 'error');
       setSaveStatus('error');
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSaveStatus('saving');
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${field}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('branding')
        .getPublicUrl(filePath);
      
      console.log('Successfully uploaded branding image. Public URL:', publicUrl);
      await handleChange(field, publicUrl);
      setSaveStatus('saved');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('UPLOAD FAILED: ' + error.message, 'error');
      setSaveStatus('error');
    } finally {
      setUploading(false);
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
    <div className="space-y-12 font-apple">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Configuration</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">System Core</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#050B18] tracking-tighter">Platform Settings</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
           {saveStatus === 'saving' && <span className="text-[11px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest"><Loader2 className="w-4 h-4 animate-spin"/> Syncing...</span>}
           {saveStatus === 'saved' && <span className="text-[11px] font-bold text-green-500 flex items-center gap-2 uppercase tracking-widest"><CheckCircle2 className="w-4 h-4"/> Changes Saved</span>}
           {saveStatus === 'error' && <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Error Saving</span>}
           <button className="btn-apple-secondary w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 opacity-50 cursor-not-allowed shadow-sm">
             <Save className="w-5 h-5" /> <span className="text-[11px] font-bold uppercase tracking-widest">Auto-Save Active</span>
           </button>
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
               activeTab === item.label ? 'bg-white shadow-sm text-[#050B18] border-[#050B18]/10' : 'text-gray-400 border-transparent hover:text-[#050B18] hover:bg-white/40'
             }`}>
                <div className="shrink-0 scale-75 md:scale-100">{item.icon}</div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {activeTab === 'General Info' && (
              <div className="apple-card bg-white border-none p-6 md:p-10 shadow-xl shadow-gray-100">
                <h3 className="text-2xl font-bold mb-10 pb-6 border-b border-gray-100 text-[#050B18] tracking-tight">General Information</h3>
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Hotel Entity Name</label>
                         <input type="text" value={settings.hotel_name} onChange={(e) => handleChange('hotel_name', e.target.value)} className="input-apple w-full" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">System Liaison Email</label>
                         <input type="email" value={settings.contact_email} onChange={(e) => handleChange('contact_email', e.target.value)} className="input-apple w-full" />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Property Headquarters Address</label>
                      <textarea rows="3" value={settings.address} onChange={(e) => handleChange('address', e.target.value)} className="input-apple w-full resize-none"></textarea>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Reporting Currency</label>
                         <select value={settings.currency} onChange={(e) => handleChange('currency', e.target.value)} className="input-apple w-full appearance-none">
                            <option value="DZD">DZD (Algerian Dinar)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                         </select>
                      </div>
                      <div className="space-y-3 md:col-span-2">
                         <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Global Property Timezone</label>
                         <select value={settings.timezone} onChange={(e) => handleChange('timezone', e.target.value)} className="input-apple w-full appearance-none">
                            <option>(GMT+01:00) Algiers, Casablanca, Tunis</option>
                            <option>(GMT+00:00) London, Lisbon</option>
                         </select>
                      </div>
                   </div>
                </div>
              </div>
           )}
           
           {activeTab === 'Look & Feel' && (
              <div className="apple-card bg-white border-none p-6 md:p-10 shadow-xl shadow-gray-100">
                 <h3 className="text-2xl font-bold mb-10 pb-6 border-b border-gray-100 text-[#050B18] tracking-tight">Branding & Virtual Style</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Official Brand Mark</label>
                          <div className="flex items-center gap-6">
                             <div className="w-24 h-24 bg-gradient-to-tr from-[#C9A84C] to-[#E5C973] rounded-3xl flex items-center justify-center text-white text-3xl font-serif font-bold shadow-xl overflow-hidden">
                                {settings.logo_url ? <img src={settings.logo_url} className="w-full h-full object-cover" /> : 'G'}
                             </div>
                             <div className="space-y-2">
                                <input 
                                  type="file" 
                                  hidden 
                                  ref={logoInputRef} 
                                  onChange={(e) => handleImageUpload(e, 'logo_url')}
                                  accept="image/*"
                                />
                                <button 
                                  className="btn-apple-secondary px-6 py-2.5 text-[10px] flex items-center gap-2 font-bold tracking-widest" 
                                  onClick={() => logoInputRef.current.click()}
                                  disabled={uploading}
                                >
                                   {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
                                   {uploading ? 'UPLOADING...' : 'UPLOAD LOGO'}
                                </button>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">SVG, PNG Recommended</p>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Primary Brand Color</label>
                          <div className="flex items-center gap-4">
                             <input type="color" value={settings.brand_color_primary} onChange={(e) => handleChange('brand_color_primary', e.target.value)} className="w-12 h-12 rounded-xl border-0 cursor-pointer p-0" />
                             <input type="text" value={settings.brand_color_primary} onChange={(e) => handleChange('brand_color_primary', e.target.value)} className="input-apple w-32 px-4 py-3" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Hero Section Image</label>
                           <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 relative group cursor-pointer shadow-sm" onClick={() => heroInputRef.current.click()}>
                             <input 
                               type="file" 
                               hidden 
                               ref={heroInputRef} 
                               onChange={(e) => handleImageUpload(e, 'hero_image_url')}
                               accept="image/*"
                             />
                             {settings.hero_image_url ? (
                               <img src={settings.hero_image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                             ) : (
                               <div className="w-full h-full bg-gradient-to-tr from-[#C9A84C] to-[#E5C973]" />
                             )}
                             <div className="absolute inset-0 bg-[#050B18]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                   {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Monitor className="w-4 h-4" />} 
                                   {uploading ? 'Uploading...' : 'Change Background'}
                                </span>
                             </div>
                           </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'Notifications' && (
              <div className="space-y-6">
                 <div className="apple-card bg-white border-none p-8 shadow-xl shadow-gray-100">
                    <div className="flex items-center gap-6 mb-8 border-b border-gray-50 pb-6">
                       <div className="p-3 bg-[#F5F5F7] rounded-2xl text-[#C9A84C]"><Mail className="w-6 h-6" /></div>
                       <div>
                          <h4 className="text-lg font-bold text-[#050B18] tracking-tight">Email Notification Triggers</h4>
                          <p className="text-xs text-gray-400 font-medium">Configure what events trigger an automated system email</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       {[
                         { field: 'email_notifications_reservations', label: 'New Guest Reservation', desc: 'Email admin on every new booking' },
                         { field: 'email_notifications_stock', label: 'Stock Critical Alert', desc: 'Notify inventory manager when items are low' },
                         { field: 'email_notifications_staff', label: 'Staff Shift Start/End', desc: 'Summary of daily personnel attendance' }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-5 rounded-2xl hover:bg-[#F5F5F7] transition-colors cursor-pointer group" onClick={() => handleChange(item.field, !settings[item.field])}>
                            <div>
                               <p className="font-bold text-sm text-[#050B18]">{item.label}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 transition-all shadow-inner ${settings[item.field] ? 'bg-[#C9A84C]' : 'bg-gray-200'}`}>
                               <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings[item.field] ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="apple-card bg-white border-none p-8 shadow-xl shadow-gray-100">
                    <div className="flex items-center gap-6 mb-8 border-b border-gray-50 pb-6">
                       <div className="p-3 bg-[#F5F5F7] rounded-2xl text-[#C9A84C]"><Smartphone className="w-6 h-6" /></div>
                       <div>
                          <h4 className="text-lg font-bold text-[#050B18] tracking-tight">SMS & Push Integration</h4>
                          <p className="text-xs text-gray-400 font-medium">Real-time alerts to staff mobile devices</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Primary Contact Phone</label>
                          <input type="text" value={settings.contact_phone} onChange={(e) => handleChange('contact_phone', e.target.value)} className="input-apple w-full" />
                       </div>
                       <button className="btn-apple-secondary w-full py-4 text-[10px] font-bold uppercase tracking-widest border-dashed border-2">CONFIGURE SMS GATEWAY</button>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'Privacy & Security' && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="apple-card bg-white border-none p-8 shadow-xl shadow-gray-100">
                       <ShieldAlert className="w-6 h-6 text-red-500 mb-4" />
                       <h4 className="font-bold text-luxury-black mb-1">Session Management</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Security Policy</p>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Inactivity Timeout (Min)</label>
                             <input type="number" value={settings.session_timeout} onChange={(e) => handleChange('session_timeout', Number(e.target.value))} className="input-apple w-full" />
                          </div>
                          <div className="flex items-center justify-between py-2">
                             <span className="text-xs font-bold text-gray-600">Enforce 2FA for Admins</span>
                             <div className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer ${settings.two_factor_enabled ? 'bg-luxury-gold' : 'bg-gray-200'}`} onClick={() => handleChange('two_factor_enabled', !settings.two_factor_enabled)}>
                                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${settings.two_factor_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="apple-card bg-white border-none p-8 shadow-xl shadow-gray-100">
                       <Key className="w-6 h-6 text-luxury-gold mb-4" />
                       <h4 className="font-bold text-luxury-black mb-1">Password Policies</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Credential Integrity</p>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Minimum Characters</label>
                             <input type="number" value={settings.password_min_length} onChange={(e) => handleChange('password_min_length', Number(e.target.value))} className="input-apple w-full" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Data Retention (Days)</label>
                             <input type="number" value={settings.data_retention_days} onChange={(e) => handleChange('data_retention_days', Number(e.target.value))} className="input-apple w-full" />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="apple-card bg-[#1a1a1a] text-white p-10 border-none relative overflow-hidden group shadow-2xl">
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
                 </div>
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
                   <div key={i} className="apple-card bg-white border-none p-8 flex items-center justify-between group hover:-translate-y-1 transition-all shadow-xl shadow-gray-100">
                      <div className="flex items-center gap-6">
                         <div className={`p-4 rounded-2xl ${box.color} group-hover:scale-110 transition-transform shadow-inner`}>{box.icon}</div>
                         <div>
                            <h4 className="font-bold text-[#050B18] tracking-tight text-lg">{box.name}</h4>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${box.status === 'Connected' || box.status === 'Active' ? 'text-green-500' : 'text-gray-400'}`}>{box.status}</p>
                         </div>
                      </div>
                      <button className="text-[10px] font-bold text-[#C9A84C] hover:text-[#050B18] uppercase tracking-widest transition-colors bg-[#C9A84C]/10 px-4 py-2 rounded-lg">Configure</button>
                   </div>
                 ))}
                 <div className="apple-card bg-[#F5F5F7] border-dashed border-2 border-gray-200 flex flex-col items-center justify-center p-12 text-center opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                    <PlusIcon className="w-8 h-8 text-gray-400 mb-4" />
                    <h5 className="font-bold text-gray-400 text-sm uppercase tracking-widest">Connect New Service</h5>
                 </div>
              </div>
           )}
        </div>
      </div>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-10 right-10 z-[300] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border bg-white ${
              toast.type === 'success' 
                ? 'border-green-100 text-green-600' 
                : 'border-red-100 text-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlusIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default SettingsSystem;

