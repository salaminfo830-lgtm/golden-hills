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

  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (editingService && editingService.id) {
      const { error } = await supabase
        .from('Service')
        .update(newService)
        .eq('id', editingService.id);
      
      if (!error) {
        setShowAddModal(false);
        setEditingService(null);
        resetForm();
        fetchServices();
      } else {
        alert("Error updating service: " + error.message);
        setLoading(false);
      }
    } else {
      const { error } = await supabase.from('Service').insert([newService]);
      if (!error) {
        setShowAddModal(false);
        resetForm();
        fetchServices();
      } else {
        alert("Error adding service: " + error.message);
        setLoading(false);
      }
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
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-luxury-black">Dining & Wellness</h2>
          <p className="text-gray-400 font-medium tracking-wide">Manage property venues and guest rituals</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline onClick={fetchServices} className="flex-1 md:flex-none py-3 px-6 text-[10px]">REFRESH</GoldButton>
           <GoldButton onClick={() => { setEditingService(null); resetForm(); setShowAddModal(true); }} className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2 shadow-gold">
             <Plus className="w-4 h-4" /> ADD SERVICE
           </GoldButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 bg-gray-100/50 p-1.5 rounded-2xl w-max">
        {[
          { id: 'Dining', icon: <Utensils className="w-4 h-4" />, label: 'Dining Venues' },
          { id: 'Spa', icon: <Waves className="w-4 h-4" />, label: 'Spa & Wellness' },
          { id: 'Bookings', icon: <Clock className="w-4 h-4" />, label: 'External Bookings' }
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
                   <GlassCard className="bg-white border-gray-100 p-8 hover:border-luxury-gold/30 transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
                            booking.status === 'Confirmed' ? 'text-green-500 bg-green-50 border-green-100' :
                            booking.status === 'Cancelled' ? 'text-red-500 bg-red-50 border-red-100' :
                            'text-gray-400 bg-gray-50 border-gray-100'
                          }`}>
                            {booking.status}
                          </span>
                          <h4 className="text-xl font-serif font-bold mt-3">{booking.guest_name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{booking.venue_name}</p>
                        </div>
                        <div className="p-3 bg-luxury-cream/30 rounded-2xl text-luxury-gold">
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
                   </GlassCard>
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
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button 
                             onClick={() => handleEditService(service)}
                             className="p-2 bg-black/20 backdrop-blur-md text-white/60 hover:text-luxury-gold rounded-xl transition-all"
                           >
                              <Edit3 className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => handleDeleteService(service.id)}
                             className="p-2 bg-black/20 backdrop-blur-md text-white/60 hover:text-red-400 rounded-xl transition-all"
                           >
                              <Trash2 className="w-4 h-4" />
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
                   </GlassCard>
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
             className="relative w-full max-w-lg h-full bg-[#fafafa] shadow-2xl flex flex-col border-l border-luxury-gold/20"
           >
              <div className="p-8 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-2xl font-bold font-serif text-luxury-black">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
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
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Image URL</label>
                        <div className="flex gap-4">
                           <input placeholder="https://images.unsplash.com/..." type="text" value={newService.image_url} onChange={e=>setNewService({...newService, image_url: e.target.value})} className="flex-1 bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm" />
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
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingService ? 'SAVE CHANGES' : 'SAVE TO COLLECTION')}
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
