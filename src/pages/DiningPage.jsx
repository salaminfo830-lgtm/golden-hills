import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Clock, MapPin, Star, ChevronRight, Loader2, ArrowRight, Wine, Coffee, Zap } from 'lucide-react';
import BrochureLayout from '../components/BrochureLayout';
import GoldButton from '../components/GoldButton';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const DiningPage = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fallbackVenues = [
    {
      name: 'The Saffron Theater',
      type: 'Fine Dining',
      description: 'A sensory journey through the heart of Algeria. Experience the theater of fine dining where each dish is a masterpiece of hill-grown spices and artisanal precision.',
      hours: '19:00 - 23:00',
      location: 'Level 42',
      image_url: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1974'
    },
    {
      name: 'Azure Terrace',
      type: 'Mediterranean',
      description: 'Open-air dining with panoramic views of the Setif highlands. Fresh, seasonal ingredients meet the cooling mountain breeze.',
      hours: '12:00 - 15:00, 19:00 - 22:00',
      location: 'Sky Deck',
      image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974'
    }
  ];

  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase
        .from('Service')
        .select('*')
        .eq('type', 'Dining')
        .order('name', { ascending: true });
      
      if (!error && data && data.length > 0) {
        setVenues(data);
      } else {
        setVenues(fallbackVenues);
      }
      setLoading(false);
    };
    fetchVenues();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  if (loading) {
    return (
      <div className="h-screen bg-luxury-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <BrochureLayout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-luxury-black text-white">
         <motion.div 
           initial={{ scale: 1.2, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.4 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070")' }}
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />
         <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
               <h4 className="text-luxury-gold text-2xl md:text-3xl mb-4">Epicurean Journeys</h4>
               <h1 className="text-4xl md:text-7xl font-medium text-white tracking-tight leading-none">The Gastronomy</h1>
            </motion.div>
         </div>
      </section>

      {/* Philosophy & Breakfast Section */}
      <section className="py-20 md:py-40 container mx-auto px-6 md:px-12">
         <div className="grid lg:grid-cols-2 gap-20 md:gap-32 items-center">
            <motion.div {...fadeInUp} className="space-y-10 md:space-y-12 text-center lg:text-left">
               <h2 className="text-3xl md:text-6xl font-medium text-luxury-black leading-[1.1]">The Morning <br/><span className="text-luxury-gold">Ritual.</span></h2>
               <div className="space-y-6">
                  <p className="text-lg md:text-2xl text-gray-500 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                     Start your journey with our complimentary breakfast buffet, a curated selection of artisanal pastries, fresh local honey, and international morning classics.
                  </p>
                  <div className="flex items-center gap-4 text-luxury-gold justify-center lg:justify-start">
                     <Clock className="w-6 h-6" />
                     <span className="text-xl font-bold tracking-widest uppercase">Daily 06:00 – 10:00</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-10 md:gap-16 pt-10 border-t border-luxury-gold/10">
                  <div className="space-y-4">
                     <p className="text-4xl md:text-5xl font-bold text-luxury-black">24/7</p>
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">In-Room Dining</p>
                  </div>
                  <div className="space-y-4">
                     <p className="text-4xl md:text-5xl font-bold text-luxury-black">3</p>
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Signature Venues</p>
                  </div>
               </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
               <div className="aspect-square rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1974" className="w-full h-full object-cover" alt="Chef" />
               </div>
               <motion.div 
                 initial={{ y: 30, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 1 }}
                 className="static lg:absolute -bottom-16 -right-16 bg-luxury-gold p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-white shadow-2xl max-w-sm mt-10 lg:mt-0 mx-auto"
               >
                  <Star className="w-8 md:w-10 h-8 md:h-10 mb-4 md:mb-6 mx-auto lg:mx-0" />
                  <p className="text-lg md:text-xl font-bold leading-relaxed text-center lg:text-left">"We don't just serve food; we serve memories forged in the fire of Algerian hospitality."</p>
               </motion.div>
            </motion.div>
         </div>
      </section>

      {/* Venues Flow */}
      <section className="pb-40 md:pb-60 space-y-40 md:space-y-60">
         {venues.map((venue, i) => (
           <div key={i} className="container mx-auto px-6 md:px-12">
              <div className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 md:gap-32 items-center`}>
                 <motion.div 
                   initial={{ opacity: 0, x: i % 2 !== 0 ? 50 : -50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.2 }}
                   className="flex-1 w-full"
                 >
                    <div className="aspect-[16/11] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group relative">
                       <img src={venue.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" alt={venue.name} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                 </motion.div>
                 
                 <motion.div {...fadeInUp} className="flex-1 space-y-8 md:space-y-12">
                    <div className="space-y-4 md:space-y-6">
                       <span className="text-luxury-gold font-bold uppercase tracking-[0.6em] text-[10px]">{venue.type} Sanctuary</span>
                       <h2 className="text-3xl md:text-5xl font-medium text-luxury-black leading-none">{venue.name}</h2>
                    </div>
                    <p className="text-lg md:text-2xl text-gray-500 leading-relaxed font-medium">
                       {venue.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 py-8 md:py-12 border-y border-gray-100">
                       <div className="flex items-center gap-6">
                          <div className="w-12 md:w-16 h-12 md:h-16 bg-luxury-cream/50 rounded-2xl flex items-center justify-center text-luxury-gold">
                             <Clock className="w-5 md:w-6 h-5 md:h-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-1">Daily Service</p>
                             <p className="text-xs md:text-sm font-bold text-luxury-black tracking-widest">{venue.hours}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="w-12 md:w-16 h-12 md:h-16 bg-luxury-cream/50 rounded-2xl flex items-center justify-center text-luxury-gold">
                             <MapPin className="w-5 md:w-6 h-5 md:h-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-1">The Enclave</p>
                             <p className="text-xs md:text-sm font-bold text-luxury-black tracking-widest">{venue.location}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 pt-6">
                       <GoldButton 
                         onClick={() => {
                           setSelectedVenue(venue);
                           setShowBookingModal(true);
                         }} 
                         className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-7 shadow-gold text-[10px]"
                       >
                         RESERVE A TABLE
                       </GoldButton>
                       <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 hover:text-luxury-black transition-colors group">
                          DISCOVERY MENU <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                    </div>
                 </motion.div>
              </div>
           </div>
         ))}
      </section>

      {/* Private Dining Accent */}
      <section className="bg-luxury-black py-20 md:py-40 text-white relative overflow-hidden text-center">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full pointer-events-none" 
         />
         <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div {...fadeInUp}>
               <UtensilsCrossed className="w-16 md:w-20 h-16 md:h-20 text-luxury-gold mx-auto mb-8 md:mb-12" />
               <h2 className="text-4xl md:text-7xl font-medium mb-8 md:mb-10 leading-none tracking-tight">Sanctuary Dining</h2>
               <p className="text-white/40 max-w-3xl mx-auto text-lg md:text-2xl leading-relaxed mb-12 md:mb-20 font-medium">
                   For the ultimate in privacy, our chefs can curate a bespoke menu served in your private suite terrace or our exclusive desert-edge pavilion.
               </p>
               <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-10 items-center">
                  {[
                    { icon: <Wine />, label: 'Sommelier Service' },
                    { icon: <Coffee />, label: 'Artisanal Brews' },
                    { icon: <Zap />, label: 'Live Preparation' }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="flex items-center gap-6 bg-white/5 px-8 md:px-10 py-5 md:py-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default w-full md:w-auto justify-center md:justify-start"
                    >
                       <div className="text-luxury-gold">{item.icon}</div>
                       <span className="text-[11px] font-bold uppercase tracking-[0.4em]">{item.label}</span>
                    </motion.div>
                  ))}
               </div>
               <div className="mt-16">
                  <GoldButton outline className="px-16 py-6 border-white/20 text-white hover:bg-white hover:text-luxury-black transition-all" onClick={() => navigate('/search')}>RESERVE PRIVATE DINING</GoldButton>
               </div>
            </motion.div>
         </div>
      </section>
    </BrochureLayout>
  );
};

export default DiningPage;
