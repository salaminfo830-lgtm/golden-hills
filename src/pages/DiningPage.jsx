import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Clock, MapPin, ChevronRight, Star, Wine, Coffee, Zap, Loader2, ArrowRight } from 'lucide-react';
import BrochureLayout from '../components/BrochureLayout';
import GoldButton from '../components/GoldButton';
import { supabase } from '../lib/supabase';

const DiningPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackVenues = [
    {
      name: 'Atlas Sky Lounge',
      type: 'Dining',
      description: 'Panoramic views of Sétif with signature cocktails and a sophisticated atmosphere. Perched on the 12th floor, it offers the city’s most dramatic sunsets.',
      hours: '18:00 - 01:00',
      location: 'Rooftop Sanctuary',
      specialty: 'Saffron Martini',
      image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'
    },
    {
      name: 'The Heritage Kitchen',
      type: 'Dining',
      description: 'A contemporary dialogue with traditional Algerian flavors. Our chefs utilize hill-grown spices and artisanal techniques to create modern masterpieces.',
      hours: '07:00 - 23:00',
      location: 'Grand Lobby Level',
      specialty: 'Slow-cooked Hillside Couscous',
      image_url: 'https://images.unsplash.com/photo-1550966842-2849a2249821?auto=format&fit=crop&q=80&w=2070'
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
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden bg-luxury-black">
         <motion.div 
           initial={{ scale: 1.2, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.6 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2070")' }}
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />
         <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
               <h4 className="text-luxury-gold font-serif italic text-3xl mb-4">Epicurean Journeys</h4>
               <h1 className="text-7xl md:text-9xl font-serif font-bold text-white tracking-tighter leading-none">The Gastronomy</h1>
            </motion.div>
         </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-60 container mx-auto px-12">
         <div className="grid lg:grid-cols-2 gap-32 items-center">
            <motion.div {...fadeInUp} className="space-y-12">
               <h2 className="text-6xl md:text-8xl font-serif font-bold text-luxury-black leading-[0.9]">From the Earth, <br/><span className="italic text-luxury-gold">To the Soul.</span></h2>
               <p className="text-2xl text-gray-500 leading-relaxed font-medium max-w-xl">
                  At Golden Hills, we believe that luxury is found in the purity of ingredients. Our executive chef works directly with local farmers to harvest the finest saffron and spices, ensuring every dish tells a story of the Algerian terroir.
               </p>
               <div className="flex gap-20 pt-8">
                  <div className="space-y-2">
                     <p className="text-5xl font-serif font-bold text-luxury-black">0</p>
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Kilometer Sourcing</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-5xl font-serif font-bold text-luxury-black">12</p>
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Heritage Awards</p>
                  </div>
               </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
               <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1974" className="w-full h-full object-cover" alt="Chef" />
               </div>
               <motion.div 
                 initial={{ y: 30, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 1 }}
                 className="absolute -bottom-16 -right-16 bg-luxury-gold p-12 rounded-[3rem] text-white shadow-2xl max-w-sm"
               >
                  <Star className="w-10 h-10 mb-6" />
                  <p className="text-xl font-serif font-bold italic leading-relaxed">"We don't just serve food; we serve memories forged in the fire of Algerian hospitality."</p>
               </motion.div>
            </motion.div>
         </div>
      </section>

      {/* Venues Flow */}
      <section className="pb-60 space-y-60">
         {venues.map((venue, i) => (
           <div key={i} className="container mx-auto px-12">
              <div className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-32 items-center`}>
                 <motion.div 
                   initial={{ opacity: 0, x: i % 2 !== 0 ? 50 : -50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.2 }}
                   className="flex-1 w-full"
                 >
                    <div className="aspect-[16/11] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group relative">
                       <img src={venue.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" alt={venue.name} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                 </motion.div>
                 
                 <motion.div {...fadeInUp} className="flex-1 space-y-12">
                    <div className="space-y-6">
                       <span className="text-luxury-gold font-bold uppercase tracking-[0.6em] text-[10px]">{venue.type} Sanctuary</span>
                       <h2 className="text-6xl md:text-7xl font-serif font-bold text-luxury-black leading-none">{venue.name}</h2>
                    </div>
                    <p className="text-2xl text-gray-500 leading-relaxed font-medium">
                       {venue.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-12 py-12 border-y border-gray-100">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-luxury-cream/50 rounded-2xl flex items-center justify-center text-luxury-gold">
                             <Clock className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-1">Daily Service</p>
                             <p className="text-sm font-bold text-luxury-black tracking-widest">{venue.hours}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-luxury-cream/50 rounded-2xl flex items-center justify-center text-luxury-gold">
                             <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-1">The Enclave</p>
                             <p className="text-sm font-bold text-luxury-black tracking-widest">{venue.location}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-10 pt-6">
                       <GoldButton className="px-16 py-7 shadow-gold text-[10px]">RESERVE A TABLE</GoldButton>
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
      <section className="bg-luxury-black py-60 text-white relative overflow-hidden text-center">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full pointer-events-none"
         />
         <div className="container mx-auto px-12 relative z-10">
            <motion.div {...fadeInUp}>
               <UtensilsCrossed className="w-20 h-20 text-luxury-gold mx-auto mb-12" />
               <h2 className="text-6xl md:text-9xl font-serif font-bold mb-10 italic leading-none tracking-tighter">Sanctuary Dining</h2>
               <p className="text-white/40 max-w-3xl mx-auto text-2xl leading-relaxed mb-20 font-medium">
                  For the ultimate in privacy, our chefs can curate a bespoke menu served in your private suite terrace or our exclusive desert-edge pavilion.
               </p>
            </motion.div>
            
            <div className="flex flex-col md:flex-row justify-center gap-10 items-center">
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
                   className="flex items-center gap-6 bg-white/5 px-10 py-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default"
                 >
                    <div className="text-luxury-gold">{item.icon}</div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em]">{item.label}</span>
                 </motion.div>
               ))}
            </div>
            <div className="mt-32">
               <GoldButton outline className="border-white/20 text-white hover:bg-white hover:text-luxury-black px-20 py-8 text-xs">INQUIRE FOR PRIVATE EVENTS</GoldButton>
            </div>
         </div>
      </section>
    </BrochureLayout>
  );
};

export default DiningPage;
