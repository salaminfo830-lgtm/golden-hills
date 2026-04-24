import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Utensils, Waves, Clock, MapPin, Trash2, Edit3, Loader2, X, Image as ImageIcon, ChevronRight, Sparkles, Star, Upload } from 'lucide-react';
import { useRef } from 'react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const ServicesSystem = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dining'); // Dining, Spa, Bookings
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
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

  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    fetchServices();
    fetchBookings();

    const subscription = supabase
      .channel('public:Service')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Service' }, () => {
        fetchServices();
      })
      .subscribe();

    const bookingsSub = supabase
      .channel('public:DiningReservation')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'DiningReservation' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
      supabase.removeChannel(bookingsSub);
    };
  }, []);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('DiningReservation')
      .select('*')
      .order('reservation_date', { ascending: false });
    if (data) setBookings(data);
  };

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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `services-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('rooms') // Reusing rooms bucket
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error detail:', uploadError);
        throw new Error(uploadError.message || 'Storage upload failed');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('rooms')
        .getPublicUrl(fileName);
      
      setNewService(prev => ({ ...prev, image_url: publicUrl }));
      showToast('Service image updated successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('UPLOAD FAILED: ' + error.message, 'error');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingService && editingService.id) {
        const { error } = await supabase
          .from('Service')
          .update(newService)
          .eq('id', editingService.id);
        
        if (error) throw error;
        
        showToast('Service updated', 'success');
        setShowAddModal(false);
        setEditingService(null);
        resetForm();
        fetchServices();
      } else {
        const { error } = await supabase.from('Service').insert([newService]);
        if (error) throw error;
        
        showToast('Service added to catalog', 'success');
        setShowAddModal(false);
        resetForm();
        fetchServices();
      }
    } catch (error) {
      console.error('Error saving service:', error);
      showToast('Error saving: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewService({
      name: '',
      type: activeTab === 'Bookings' ? 'Dining' : activeTab,
      description: '',
      image_url: '',
      hours: '',
      location: '',
      specialty: '',
      price: ''
    });
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      type: service.type,
      description: service.description || '',
      image_url: service.image_url || '',
      hours: service.hours || '',
      location: service.location || '',
      specialty: service.specialty || '',
      price: service.price || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteService = async (id) => {
    if(window.confirm("Are you sure you want to delete this service?")) {
       setLoading(true);
       await supabase.from('Service').delete().eq('id', id);
       fetchServices();
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    await supabase.from('DiningReservation').update({ status }).eq('id', id);
    fetchBookings();
  };

  const handleDeleteBooking = async (id) => {
    if(window.confirm("Delete this reservation?")) {
      await supabase.from('DiningReservation').delete().eq('id', id);
      fetchBookings();
    }
  };

  const filteredServices = services.filter(s => s.type === activeTab);

  return (
    <div className="space-y-12 font-apple relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Guest Experience</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Services Command</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#050B18] tracking-tighter">Dining & Wellness</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <button onClick={fetchServices} className="btn-apple-secondary flex items-center justify-center gap-3 px-8 py-4 shadow-sm">
             <span className="text-[11px] uppercase tracking-widest font-bold">Refresh Intel</span>
           </button>
           <button onClick={() => { setEditingService(null); resetForm(); setShowAddModal(true); }} className="btn-apple-primary flex items-center justify-center gap-3 px-10 py-4 shadow-xl shadow-[#050B18]/10">
             <Plus className="w-5 h-5" /> <span className="text-[11px] uppercase tracking-widest font-bold">Register Service</span>
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F5F5F7] p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto custom-scrollbar">
        {[
          { id: 'Dining', icon: <Utensils className="w-5 h-5" />, label: 'Dining Venues' },
          { id: 'Spa', icon: <Waves className="w-5 h-5" />, label: 'Spa & Wellness' },
          { id: 'Bookings', icon: <Clock className="w-5 h-5" />, label: 'External Bookings' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white text-[#050B18] shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
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
             {activeTab === 'Bookings' ? (
               bookings.length === 0 ? (
                 <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No external bookings recorded yet.</p>
                 </div>
               ) : bookings.map((booking) => (
                 <motion.div
                   layout
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   key={booking.id}
                 >
                   <div className="apple-card bg-white border-none p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 shadow-xl shadow-gray-100">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className={`badge-apple py-1.5 px-3 ${
                            booking.status === 'Confirmed' ? 'text-green-600 bg-green-50 border-green-100' :
                            booking.status === 'Cancelled' ? 'text-red-600 bg-red-50 border-red-100' :
                            'text-gray-400 bg-gray-50 border-gray-100'
                          }`}>
                            {booking.status}
                          </span>
                          <h4 className="text-2xl font-bold text-[#050B18] mt-4 tracking-tight">{booking.guest_name}</h4>
                          <p className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-[0.2em] mt-1">{booking.venue_name}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl text-[#C9A84C] flex items-center justify-center">
                           <Clock className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="space-y-3 mb-8 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Date:</span>
                          <span className="font-bold">{booking.reservation_date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time:</span>
                          <span className="font-bold">{booking.reservation_time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Party:</span>
                          <span className="font-bold">{booking.party_size} People</span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-6 border-t border-gray-50">
                        <button 
                          onClick={() => handleUpdateBookingStatus(booking.id, booking.status === 'Confirmed' ? 'Cancelled' : 'Confirmed')}
                          className="text-[10px] font-bold text-luxury-gold uppercase tracking-tighter hover:underline"
                        >
                          {booking.status === 'Confirmed' ? 'Cancel' : 'Confirm'}
                        </button>
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-[10px] font-bold text-red-400 uppercase tracking-tighter hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                   </div>

                 </motion.div>
               ))
             ) : (
               filteredServices.length === 0 ? (
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
                   <div className="apple-card group bg-white border-none p-0 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 shadow-xl shadow-gray-100">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img 
                          src={service.image_url || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                          alt={service.name} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/80 via-[#050B18]/20 to-transparent opacity-90" />
                        <div className="absolute bottom-6 left-6 text-white z-10">
                           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-2 block">{service.type}</span>
                           <h4 className="text-2xl font-bold tracking-tight">{service.name}</h4>
                        </div>
                        <div className="absolute top-5 right-5 flex gap-3 opacity-0 group-hover:opacity-100 transition-all z-10">
                           <button 
                             onClick={() => handleEditService(service)}
                             className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-2xl transition-all shadow-lg"
                           >
                              <Edit3 className="w-5 h-5" />
                           </button>
                           <button 
                             onClick={() => handleDeleteService(service.id)}
                             className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-red-500 hover:border-red-500 rounded-2xl transition-all shadow-lg"
                           >
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
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
                   </div>

                 </motion.div>
               ))
             )}
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
             className="relative w-full max-w-lg h-full apple-card p-0 flex flex-col border-none shadow-2xl"
           >
              <div className="p-10 border-b border-gray-50 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-3xl font-bold tracking-tighter text-[#050B18]">{editingService ? 'Refine Service' : 'Catalog New Service'}</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.3em] mt-1.5">Asset Registration</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-3.5 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                   <X className="w-6 h-6"/>
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
                          <input placeholder="e.g. 09:00 - 21:00" type="text" value={newService.hours} onChange={e=>setNewService({...newService, hours: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Location/Enclave</label>
                          <input placeholder="e.g. Wellness Level" type="text" value={newService.location} onChange={e=>setNewService({...newService, location: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Signature Specialty</label>
                        <input placeholder="e.g. Traditional Scrub" type="text" value={newService.specialty} onChange={e=>setNewService({...newService, specialty: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm" />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Cover Image</label>
                        <div className="flex gap-4">
                           <div className="flex-1 relative">
                             <input placeholder="https://images.unsplash.com/..." type="text" value={newService.image_url} onChange={e=>setNewService({...newService, image_url: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm pr-12" />
                             <button 
                               type="button"
                               onClick={() => fileInputRef.current?.click()}
                               className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-luxury-gold hover:bg-luxury-gold/10 rounded-xl transition-all"
                             >
                               <Upload className="w-4 h-4" />
                             </button>
                             <input 
                               type="file" 
                               ref={fileInputRef} 
                               hidden 
                               onChange={handleFileUpload} 
                               accept="image/*" 
                             />
                           </div>
                           <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden shadow-sm">
                              {newService.image_url ? <img src={newService.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-gray-300" />}
                           </div>
                        </div>
                      </div>
                    </div>
                 </form>
              </div>

               <div className="p-10 bg-white border-t border-gray-50 shrink-0">
                  <button 
                    form="add-service-form" 
                    type="submit" 
                    disabled={loading || uploading}
                    className="btn-apple-primary w-full py-5 text-base shadow-xl shadow-[#050B18]/10"
                  >
                     {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (uploading ? 'SYNCHRONIZING...' : (editingService ? 'COMMIT CHANGES' : 'DEPLOY TO CATALOG'))}
                  </button>
               </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

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
            {toast.type === 'success' ? <Star className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesSystem;
