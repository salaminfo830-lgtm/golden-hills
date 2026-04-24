import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Waves, Sparkles, Droplets, Wind, Star, ChevronRight, Loader2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import BrochureLayout from '../components/BrochureLayout';
import GoldButton from '../components/GoldButton';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const SpaPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackServices = [
    {
      name: 'Numidian Spa & Rituals',
      type: 'Spa',
      description: 'Ancient healing rituals utilizing local botanical oils and heated Atlas stones. A sanctuary designed for total restoration of the spirit.',
      hours: '09:00 - 21:00',
      location: 'Wellness Level',
      specialty: 'Atlas Stone Massage',
      image_url: 'https://images.unsplash.com/photo-1544161515-436cefb6579a?auto=format&fit=crop&q=80&w=2070'
    },
    {
      name: 'The Royal Hammam',
      type: 'Spa',
      description: 'A traditional steam experience redefined with gold-leaf accents and personalized aromatherapy. Pure atmosphere for profound stillness.',
      hours: '09:00 - 21:00',
      location: 'Wellness Level',
      specialty: 'Gold-Dust Scrub',
      image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2070'
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('Service')
        .select('*')
        .eq('type', 'Spa')
        .order('name', { ascending: true });
      
      if (!error && data && data.length > 0) {
        setServices(data);
      } else {
        setServices(fallbackServices);
      }
      setLoading(false);
    };
    fetchServices();
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
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden bg-luxury-black text-white">
         <motion.div 
           initial={{ scale: 1.2, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.5 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2070")' }}
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />
         <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
               <h4 className="text-luxury-gold text-3xl mb-4">The Rituals</h4>
               <h1 className="text-4xl md:text-7xl font-medium tracking-tight leading-none">Pure Atmosphere</h1>
            </motion.div>
         </div>
         {/* Wave Overlay (Subtle) */}
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-luxury-cream to-transparent" />
      </section>

      {/* Philosophy & Special Offer Section */}
      <section className="py-20 md:py-40 container mx-auto px-12 bg-luxury-cream/30">
         <div className="grid lg:grid-cols-2 gap-32 items-center">
            <motion.div {...fadeInUp} className="space-y-12">
               <h2 className="text-4xl md:text-6xl font-medium text-luxury-black leading-[1.1]">Silence, <br/><span className="text-luxury-gold">Restored.</span></h2>
               <p className="text-2xl text-gray-500 leading-relaxed font-medium max-w-xl">
                  Immerse yourself in the ancient wisdom of the hills. Our spa rituals are choreographies of silence, steam, and restoration, designed to reconnect the body with the soul.
               </p>
               <GlassCard className="bg-luxury-gold/10 border-luxury-gold/20 p-8 md:p-10">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-8 h-8" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold text-luxury-black mb-2 tracking-tight">The Gilded Gesture</h4>
                        <p className="text-gray-600 font-medium italic">Guests staying 3 or more nights receive 1 complimentary hour of spa treatment.</p>
                     </div>
                  </div>
               </GlassCard>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="relative"
            >
               <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Wellness" />
               </div>
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -top-12 -left-12 bg-white p-12 rounded-[3rem] shadow-2xl border border-luxury-gold/10 hidden xl:flex flex-col items-center text-center"
               >
                  <Sparkles className="w-10 h-10 text-luxury-gold mb-4" />
                  <p className="text-3xl font-bold text-luxury-black leading-none">Numidian <br/>Legacy</p>
               </motion.div>
            </motion.div>
         </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-40">
         <div className="container mx-auto px-12">
            <motion.div {...fadeInUp} className="text-center mb-32">
               <h4 className="text-luxury-gold font-bold text-[10px] uppercase tracking-[0.6em] mb-6">Discovery</h4>
               <h2 className="text-4xl md:text-6xl font-medium text-luxury-black leading-none">The Treatment Menu</h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-24">
               {services.map((service, i) => (
                 <motion.div 
                   key={i}
                   {...fadeInUp}
                   transition={{ delay: i * 0.2 }}
                   className="group cursor-pointer"
                 >
                    <div className="relative aspect-[16/10] rounded-[3.5rem] overflow-hidden mb-12 shadow-xl group-hover:shadow-gold/20 transition-all duration-700">
                       <img src={service.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" alt={service.name} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                    
                    <div className="space-y-8">
                       <div className="flex justify-between items-start">
                          <div>
                             <span className="text-luxury-gold font-bold uppercase tracking-[0.5em] text-[10px] mb-3 block">{service.location}</span>
                             <h3 className="text-3xl md:text-4xl font-medium text-luxury-black group-hover: transition-all duration-700 leading-none">{service.name}</h3>
                          </div>
                          <div className="w-16 h-16 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-all">
                             <Heart className="w-6 h-6" />
                          </div>
                       </div>
                       
                       <p className="text-2xl text-gray-500 leading-relaxed font-medium">
                          {service.description}
                       </p>
                       
                       <div className="flex items-center gap-10 pt-6">
                          <GoldButton onClick={() => navigate('/search')} className="px-16 py-7 shadow-gold text-[10px]">BOOK TREATMENT</GoldButton>
                          <button onClick={() => navigate('/search')} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 hover:text-luxury-black transition-colors group">
                             VIEW DETAILS <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Wellness Membership CTA */}
      <section className="bg-luxury-black py-20 md:py-40 text-white relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-10 grayscale" />
         <div className="container mx-auto px-12 relative z-10 text-center">
            <motion.div {...fadeInUp}>
               <ShieldCheck className="w-20 h-20 text-luxury-gold mx-auto mb-12" />
               <h2 className="text-4xl md:text-7xl font-medium mb-10 leading-none tracking-tight">The Gilded Circle</h2>
               <p className="text-white/40 max-w-3xl mx-auto text-2xl leading-relaxed mb-20 font-medium">
                  Join our exclusive wellness membership for priority booking, private hammam sessions, and bespoke botanical blends crafted specifically for your skin profile.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-10">
                  <GoldButton onClick={() => navigate('/search')} className="px-20 py-8 text-xs shadow-gold">BECOME A MEMBER</GoldButton>
                  <GoldButton onClick={() => navigate('/search')} outline className="border-white/20 text-white hover:bg-white hover:text-luxury-black px-20 py-8 text-xs">EXPLORE BENEFITS</GoldButton>
               </div>
            </motion.div>
         </div>
      </section>
    </BrochureLayout>
  );
};

export default SpaPage;
