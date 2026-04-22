import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Clock, MapPin, ChevronRight, Star, Wine, Coffee, Zap, Loader2 } from 'lucide-react';
import BrochureLayout from '../components/BrochureLayout';
import GoldButton from '../components/GoldButton';
import { supabase } from '../lib/supabase';

const DiningPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase
        .from('Service')
        .select('*')
        .eq('type', 'Dining')
        .order('name', { ascending: true });
      
      if (!error && data) {
        setVenues(data);
      }
      setLoading(false);
    };
    fetchVenues();
  }, []);

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
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
         <motion.div 
           initial={{ scale: 1.2 }}
           animate={{ scale: 1 }}
           transition={{ duration: 1.5 }}
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2070")' }}
         />
         <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
         <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
               <h4 className="text-luxury-gold font-serif italic text-2xl mb-4">Epicurean Journeys</h4>
               <h1 className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tighter">The Gastronomy</h1>
            </motion.div>
         </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 container mx-auto px-12">
         <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
               <h2 className="text-5xl font-serif font-bold text-luxury-black leading-tight">From the Earth, <br/><span className="italic text-luxury-gold">To the Soul.</span></h2>
               <p className="text-xl text-gray-500 leading-relaxed font-medium">
                  At Golden Hills, we believe that luxury is found in the purity of ingredients. Our executive chef works directly with local farmers to harvest the finest saffron and spices, ensuring every dish tells a story of the Algerian terroir.
               </p>
               <div className="flex gap-12 pt-6">
                  <div className="text-center">
                     <p className="text-4xl font-serif font-bold text-luxury-black mb-2">0</p>
                     <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">Kilometer Sourcing</p>
                  </div>
                  <div className="text-center">
                     <p className="text-4xl font-serif font-bold text-luxury-black mb-2">12</p>
                     <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">Heritage Awards</p>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1974" className="w-full h-full object-cover" alt="Chef" />
               </div>
               <div className="absolute -bottom-10 -right-10 bg-luxury-gold p-10 rounded-[3rem] text-white shadow-xl max-w-xs">
                  <Star className="w-8 h-8 mb-4" />
                  <p className="font-bold italic">"We don't just serve food; we serve memories forged in the fire of Algerian hospitality."</p>
               </div>
            </div>
         </div>
      </section>

      {/* Venues Flow */}
      <section className="pb-40 space-y-40">
         {venues.map((venue, i) => (
           <div key={i} className="container mx-auto px-12">
              <div className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-24 items-center`}>
                 <motion.div 
                   initial={{ opacity: 0, x: i % 2 !== 0 ? 50 : -50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1 }}
                   className="flex-1 w-full"
                 >
                    <div className="aspect-[16/11] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group relative">
                       <img src={venue.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt={venue.name} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                 </motion.div>
                 
                 <div className="flex-1 space-y-10">
                    <div className="space-y-4">
                       <span className="text-luxury-gold font-bold uppercase tracking-[0.5em] text-[10px]">{venue.type}</span>
                       <h2 className="text-5xl md:text-6xl font-serif font-bold text-luxury-black">{venue.name}</h2>
                    </div>
                    <p className="text-xl text-gray-500 leading-relaxed font-medium">
                       {venue.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-10 py-10 border-y border-gray-100">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-luxury-cream/30 rounded-2xl flex items-center justify-center text-luxury-gold">
                             <Clock className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service</p>
                             <p className="text-sm font-bold text-luxury-black">{venue.hours}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-luxury-cream/30 rounded-2xl flex items-center justify-center text-luxury-gold">
                             <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enclave</p>
                             <p className="text-sm font-bold text-luxury-black">{venue.location}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <GoldButton className="px-12 py-5 shadow-gold">RESERVE TABLE</GoldButton>
                       <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-luxury-black transition-colors">
                          Discovery Menu <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </section>

      {/* Private Dining Accent */}
      <section className="bg-luxury-black py-40 text-white relative overflow-hidden text-center">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full pointer-events-none"
         />
         <div className="container mx-auto px-12 relative z-10">
            <UtensilsCrossed className="w-16 h-16 text-luxury-gold mx-auto mb-10" />
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 italic">Sanctuary Dining</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-xl leading-relaxed mb-16 font-medium">
               For the ultimate in privacy, our chefs can curate a bespoke menu served in your private suite terrace or our exclusive desert-edge pavilion.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
               <div className="flex items-center gap-4 bg-white/5 px-8 py-5 rounded-3xl border border-white/10">
                  <Wine className="w-5 h-5 text-luxury-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Sommelier Service</span>
               </div>
               <div className="flex items-center gap-4 bg-white/5 px-8 py-5 rounded-3xl border border-white/10">
                  <Coffee className="w-5 h-5 text-luxury-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Artisanal Brews</span>
               </div>
               <div className="flex items-center gap-4 bg-white/5 px-8 py-5 rounded-3xl border border-white/10">
                  <Zap className="w-5 h-5 text-luxury-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Live Preparation</span>
               </div>
            </div>
            <div className="mt-20">
               <GoldButton outline className="border-white/20 text-white hover:bg-white hover:text-luxury-black px-16 py-6">INQUIRE FOR PRIVATE EVENTS</GoldButton>
            </div>
         </div>
      </section>
    </BrochureLayout>
  );
};

export default DiningPage;
