import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Car, Plane, Train, ChevronRight, MessageSquare, Instagram, Globe } from 'lucide-react';
import BrochureLayout from '../components/BrochureLayout';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';
import { useSettings } from '../context/SettingsContext';

const ContactPage = () => {
  const { settings } = useSettings();

  const attractions = [
    { name: 'Setif Amusement Park', dist: '0.4 km', walk: '5 min' },
    { name: 'National Museum of Setif', dist: '0.6 km', walk: '7 min' },
    { name: 'Park Mall', dist: '0.7 km', walk: '10 min' },
    { name: 'Ain El Fouara Fountain', dist: '1.2 km', walk: '20 min' },
    { name: 'Byzantine Citadel', dist: '1.0 km', walk: '15 min' }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <BrochureLayout>
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-end justify-center overflow-hidden bg-luxury-black text-white">
         <motion.div 
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.4 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2074")' }}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
         <div className="container mx-auto px-6 md:px-12 pb-24 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
               <h4 className="text-luxury-gold text-2xl md:text-3xl mb-4 tracking-widest">Connect</h4>
               <h1 className="text-4xl md:text-7xl font-medium tracking-tight leading-none uppercase">The Enclave</h1>
            </motion.div>
         </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 md:py-40 container mx-auto px-6 md:px-12">
         <div className="grid lg:grid-cols-2 gap-20 md:gap-32">
            <motion.div {...fadeInUp} className="space-y-16">
               <div className="space-y-6">
                  <h2 className="text-3xl md:text-6xl font-medium text-luxury-black leading-tight">We are at your <br/><span className="text-luxury-gold">absolute service.</span></h2>
                  <p className="text-xl text-gray-500 font-medium leading-relaxed">
                     Whether you require a private airport escort or wish to curate a bespoke celebration, our concierge is standing by to anticipate your desires.
                  </p>
               </div>

               <div className="space-y-10">
                  <div className="flex gap-8 group">
                     <div className="w-16 h-16 rounded-2xl bg-luxury-cream flex items-center justify-center text-luxury-gold shrink-0 group-hover:bg-luxury-gold group-hover:text-white transition-all">
                        <MapPin className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold text-luxury-black mb-2">Location</h4>
                        <p className="text-gray-500 font-medium leading-relaxed">
                           {settings?.address || "Rue Champs d'azur, Sétif 19000, Algeria"}
                        </p>
                     </div>
                  </div>

                  <div className="flex gap-8 group">
                     <div className="w-16 h-16 rounded-2xl bg-luxury-cream flex items-center justify-center text-luxury-gold shrink-0 group-hover:bg-luxury-gold group-hover:text-white transition-all">
                        <Phone className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold text-luxury-black mb-2">Direct Line</h4>
                        <p className="text-gray-500 font-medium leading-relaxed">
                           {settings?.contact_phone || "030 793 030 / 07 70 51 53 59"}
                        </p>
                     </div>
                  </div>

                  <div className="flex gap-8 group">
                     <div className="w-16 h-16 rounded-2xl bg-luxury-cream flex items-center justify-center text-luxury-gold shrink-0 group-hover:bg-luxury-gold group-hover:text-white transition-all">
                        <Mail className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold text-luxury-black mb-2">Electronic Post</h4>
                        <p className="text-luxury-gold font-bold leading-relaxed">
                           {settings?.contact_email || "hotelgoldenhillsreservation@gmail.com"}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="flex gap-6 pt-6">
                  {[Instagram, Globe, MessageSquare].map((Icon, i) => (
                    <button key={i} className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-luxury-gold hover:text-luxury-gold transition-all">
                       <Icon className="w-5 h-5" />
                    </button>
                  ))}
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5 }}
              className="space-y-12"
            >
               <GlassCard className="p-10 md:p-16 border-luxury-gold/10 bg-luxury-white-warm shadow-2xl">
                  <div className="space-y-12">
                     <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.5em] text-luxury-gold mb-8">Access Protocols</h4>
                        <div className="grid grid-cols-2 gap-10">
                           <div className="space-y-3">
                              <div className="flex items-center gap-3 text-luxury-black opacity-40">
                                 <Clock className="w-4 h-4" />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">Arrival</span>
                              </div>
                              <p className="text-2xl font-bold text-luxury-black">{settings?.check_in_time || "14:00 – 02:00"}</p>
                           </div>
                           <div className="space-y-3">
                              <div className="flex items-center gap-3 text-luxury-black opacity-40">
                                 <Clock className="w-4 h-4" />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">Departure</span>
                              </div>
                              <p className="text-2xl font-bold text-luxury-black">{settings?.check_out_time || "12:00"}</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <h4 className="text-xs font-bold uppercase tracking-[0.5em] text-luxury-gold mb-4">Vicinity Discovery</h4>
                        <div className="space-y-6">
                           {attractions.map((attr, i) => (
                             <div key={i} className="flex justify-between items-center group cursor-default">
                                <div className="flex items-center gap-4">
                                   <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold opacity-30 group-hover:opacity-100 transition-opacity" />
                                   <span className="text-sm font-medium text-gray-600">{attr.name}</span>
                                </div>
                                <div className="text-right">
                                   <p className="text-xs font-bold text-luxury-black">{attr.dist}</p>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{attr.walk}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="pt-8 border-t border-luxury-gold/10 space-y-8">
                        <div className="flex items-center gap-6 group">
                           <div className="w-12 h-12 rounded-xl bg-luxury-black text-white flex items-center justify-center shrink-0">
                              <Plane className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                              <p className="text-xs font-bold text-luxury-black uppercase tracking-widest mb-1">Ain Arnat Airport (QSF)</p>
                              <p className="text-xs text-gray-400 font-medium">12 km • 21 min by car</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-luxury-gold" />
                        </div>
                        <div className="flex items-center gap-6 group">
                           <div className="w-12 h-12 rounded-xl bg-luxury-black text-white flex items-center justify-center shrink-0">
                              <Train className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                              <p className="text-xs font-bold text-luxury-black uppercase tracking-widest mb-1">Setif Railway Station</p>
                              <p className="text-xs text-gray-400 font-medium">1.2 km • 15 min walk</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-luxury-gold" />
                        </div>
                     </div>
                  </div>
               </GlassCard>
            </motion.div>
         </div>
      </section>

      {/* Map Section */}
      <section className="h-[600px] w-full bg-luxury-cream/20 relative overflow-hidden group">
         <div className="absolute inset-0 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2s]">
            <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Map Placeholder" />
         </div>
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full bg-white/80 backdrop-blur-3xl shadow-2xl flex items-center justify-center border border-luxury-gold/20 animate-pulse">
               <div className="w-6 h-6 bg-luxury-gold rounded-full shadow-gold" />
            </div>
         </div>
         <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <GoldButton className="px-16 py-6 shadow-2xl">OPEN IN GOOGLE MAPS</GoldButton>
         </div>
      </section>

      {/* Quick Contact Form Accent */}
      <section className="py-20 md:py-40 bg-luxury-white-warm">
         <div className="container mx-auto px-6 md:px-12 text-center">
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto space-y-16">
               <h2 className="text-4xl md:text-7xl font-medium text-luxury-black leading-none">Inquiry Protocol</h2>
               <div className="grid md:grid-cols-2 gap-8">
                  <input type="text" placeholder="Gilded Name" className="w-full bg-white border border-gray-100 rounded-2xl px-8 py-6 text-sm font-bold focus:border-luxury-gold outline-none shadow-sm" />
                  <input type="email" placeholder="Official Email" className="w-full bg-white border border-gray-100 rounded-2xl px-8 py-6 text-sm font-bold focus:border-luxury-gold outline-none shadow-sm" />
                  <textarea placeholder="Your Desire" rows="4" className="w-full bg-white border border-gray-100 rounded-2xl px-8 py-6 text-sm font-bold focus:border-luxury-gold outline-none shadow-sm md:col-span-2"></textarea>
               </div>
               <GoldButton className="px-20 py-8 text-xs shadow-gold">TRANSMIT REQUEST</GoldButton>
            </motion.div>
         </div>
      </section>
    </BrochureLayout>
  );
};

export default ContactPage;
