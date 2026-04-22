import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Utensils, Waves, Clock, MapPin, 
  Trash2, Edit3, Loader2, X, Image as ImageIcon,
  ChevronRight, Sparkles, Star
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const ServicesSystem = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dining');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newService, setNewService] = useState({
    name: '',
    type: 'Dining',
    description: '',
    image_url: '',
    hours: '',
    location: '',
    specialty: '',
    price: ''
  });

  useEffect(() => {
    fetchServices();

    const subscription = supabase
      .channel('public:Service')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Service' }, () => {
        fetchServices();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('Service')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('Service').insert([newService]);
    if (!error) {
      setShowAddModal(false);
      setNewService({
        name: '',
        type: activeTab,
        description: '',
        image_url: '',
        hours: '',
        location: '',
        specialty: '',
        price: ''
      });
      fetchServices();
    } else {
      alert("Error adding service: " + error.message);
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if(window.confirm("Are you sure you want to delete this service?")) {
       setLoading(true);
       await supabase.from('Service').delete().eq('id', id);
       fetchServices();
    }
  };

  const filteredServices = services.filter(s => s.type === activeTab);

  return (
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-luxury-black">Gastronomy & Wellness</h2>
          <p className="text-gray-400 font-medium tracking-wide">Manage property venues and guest rituals</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline onClick={fetchServices} className="flex-1 md:flex-none py-3 px-6 text-[10px]">REFRESH</GoldButton>
           <GoldButton onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2 shadow-gold">
             <Plus className="w-4 h-4" /> ADD SERVICE
           </GoldButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 bg-gray-100/50 p-1.5 rounded-2xl w-max">
        {[
          { id: 'Dining', icon: <Utensils className="w-4 h-4" />, label: 'Dining Venues' },
          { id: 'Spa', icon: <Waves className="w-4 h-4" />, label: 'Spa & Wellness' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === tab.id ? 'bg-white text-luxury-gold shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading && services.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-luxury-gold animate-spin mb-4" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Synchronizing Master Catalog...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence mode="popLayout">
             {filteredServices.length === 0 ? (
               <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">No {activeTab.toLowerCase()} services defined yet.</p>
               </div>
             ) : filteredServices.map((service) => (
               <motion.div
                 layout
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 key={service.id}
               >
                  <GlassCard className="group bg-white border-gray-100 p-0 overflow-hidden hover:border-luxury-gold/30 transition-all duration-500 shadow-sm">
                     <div className="relative aspect-[16/10] overflow-hidden">
                        <img 
                          src={service.image_url || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                          alt={service.name} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                           <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-luxury-gold mb-1 block">{service.type}</span>
                           <h4 className="text-xl font-serif font-bold">{service.name}</h4>
                        </div>
                        <button 
                          onClick={() => handleDeleteService(service.id)}
                          className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md text-white/60 hover:text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                     
                     <div className="p-8 space-y-6">
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                           {service.description || 'No description provided.'}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50">
                           <div className="flex items-center gap-3">
                              <Clock className="w-3.5 h-3.5 text-luxury-gold/50" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{service.hours || 'TBD'}</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <MapPin className="w-3.5 h-3.5 text-luxury-gold/50" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate">{service.location || 'N/A'}</span>
                           </div>
                        </div>

                        <div className="flex justify-between items-center">
                           <div>
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Signature Offering</p>
                              <p className="text-xs font-bold text-luxury-black italic">{service.specialty || 'None'}</p>
                           </div>
                           <ChevronRight className="w-5 h-5 text-luxury-gold opacity-30" />
                        </div>
                     </div>
                  </GlassCard>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      )}

      {/* Add Service Drawer */}
      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setShowAddModal(false)} 
             className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
           />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-lg h-full bg-[#fafafa] shadow-2xl flex flex-col border-l border-luxury-gold/20"
           >
              <div className="p-8 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-2xl font-bold font-serif text-luxury-black">Add New Service</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Product Catalog Management</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-luxury-black hover:bg-gray-100 transition-colors">
                   <X className="w-5 h-5"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                 <form id="add-service-form" onSubmit={handleAddService} className="space-y-8">
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div 
                           onClick={() => setNewService({...newService, type: 'Dining'})}
                           className={`p-6 rounded-3xl border-2 transition-all cursor-pointer text-center ${newService.type === 'Dining' ? 'border-luxury-gold bg-luxury-gold/5' : 'border-gray-100 bg-white opacity-50'}`}
                         >
                            <Utensils className={`w-6 h-6 mx-auto mb-2 ${newService.type === 'Dining' ? 'text-luxury-gold' : 'text-gray-400'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Dining</span>
                         </div>
                         <div 
                           onClick={() => setNewService({...newService, type: 'Spa'})}
                           className={`p-6 rounded-3xl border-2 transition-all cursor-pointer text-center ${newService.type === 'Spa' ? 'border-luxury-gold bg-luxury-gold/5' : 'border-gray-100 bg-white opacity-50'}`}
                         >
                            <Waves className={`w-6 h-6 mx-auto mb-2 ${newService.type === 'Spa' ? 'text-luxury-gold' : 'text-gray-400'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Wellness</span>
                         </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Service Name</label>
                        <input required placeholder="e.g. Atlas Stone Massage" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} type="text" className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Description</label>
                        <textarea rows="3" required placeholder="Describe the experience..." value={newService.description} onChange={e=>setNewService({...newService, description: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm resize-none"></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Operating Hours</label>
                          <input placeholder="e.g. 09:00 - 21:00" type="text" value={newService.hours} onChange={e=>setNewService({...newService, hours: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Location/Enclave</label>
                          <input placeholder="e.g. Wellness Level" type="text" value={newService.location} onChange={e=>setNewService({...newService, location: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Signature Specialty</label>
                        <input placeholder="e.g. Traditional Scrub" type="text" value={newService.specialty} onChange={e=>setNewService({...newService, specialty: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Image URL</label>
                        <div className="flex gap-4">
                           <input placeholder="https://images.unsplash.com/..." type="text" value={newService.image_url} onChange={e=>setNewService({...newService, image_url: e.target.value})} className="flex-1 bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                           <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0 border border-gray-200">
                              {newService.image_url ? <img src={newService.image_url} className="w-full h-full object-cover rounded-2xl" /> : <ImageIcon className="w-5 h-5 text-gray-300" />}
                           </div>
                        </div>
                      </div>
                    </div>
                 </form>
              </div>

              <div className="p-8 bg-white border-t border-gray-100 shrink-0">
                 <GoldButton form="add-service-form" type="submit" className="w-full py-4 shadow-lg text-sm flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SAVE TO COLLECTION'}
                 </GoldButton>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
};

export default ServicesSystem;
