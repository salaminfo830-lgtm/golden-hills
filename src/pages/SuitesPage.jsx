import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bed, Users, ChevronRight, Star, Maximize2, Wind, ShieldCheck, Map, ArrowRight, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { Link, useNavigate } from 'react-router-dom';
import BrochureLayout from '../components/BrochureLayout';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';

const SuitesPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('Room')
        .select('*')
        .order('price', { ascending: true });
      
      if (!error && data) {
        const mappedRooms = data.map(room => ({
           ...room,
           desc: room.description || `Experience the height of luxury in our ${room.type}. Crafted with the finest materials and an eye for detail.`,
           features: room.features || ['Hill View', 'Rain Shower', 'Local Art']
        }));
        setRooms(mappedRooms);
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <BrochureLayout>
      {/* Hero Header */}
      <section className="relative h-[65vh] flex items-end justify-center overflow-hidden bg-luxury-black">
         <motion.div 
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.5 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070")' }}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-luxury-cream/10 via-transparent to-transparent" />
         <div className="container mx-auto px-12 pb-24 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
               <h4 className="text-luxury-gold font-serif italic text-2xl mb-4">Accommodations</h4>
               <h1 className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tighter leading-none">The Sanctuaries</h1>
            </motion.div>
         </div>
      </section>

      {/* Intro Context */}
      <section className="py-40 container mx-auto px-12">
         <div className="max-w-5xl">
            <motion.p {...fadeInUp} className="text-3xl md:text-5xl font-serif text-luxury-black leading-[1.1]">
               Every residence at Golden Hills is a <span className="italic text-luxury-gold">masterpiece of architectural soul</span>, blending the rugged beauty of Algeria with the delicate touch of high-craft luxury.
            </motion.p>
         </div>
      </section>

      {/* Grid of Suites */}
      <section className="pb-60 container mx-auto px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-48">
           {rooms.length > 0 ? rooms.map((suite, i) => (
             <motion.div 
               key={i}
               {...fadeInUp}
               transition={{ duration: 1, delay: i % 2 * 0.1 }}
               className="group flex flex-col"
             >
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group-hover:shadow-gold/20 transition-all duration-700">
                   <img src={suite.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt={suite.type} />
                   <div className="absolute top-10 right-10 flex flex-col gap-3">
                      <div className="px-8 py-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 flex flex-col items-center justify-center text-white">
                         <span className="text-sm font-bold tracking-widest">{formatPrice(suite.price)}</span>
                         <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">Per Night</span>
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="absolute bottom-12 left-12 right-12 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <GoldButton className="w-full py-6 shadow-gold" onClick={() => navigate(`/book/${suite.id}`)}>BOOK THIS SUITE</GoldButton>
                   </div>
                </div>
                
                <div className="space-y-10">
                   <div className="flex justify-between items-start">
                      <div>
                         <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">{suite.type} Selection</span>
                         <h3 className="text-5xl font-serif font-bold text-luxury-black group-hover:italic transition-all duration-700 leading-none">{suite.type}</h3>
                      </div>
                      <div className="flex gap-1">
                         {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-luxury-gold fill-current" />)}
                      </div>
                   </div>
                   
                   <p className="text-gray-500 text-xl leading-relaxed max-w-xl font-medium">
                      {suite.desc}
                   </p>

                   <div className="flex flex-wrap gap-10 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                         <Maximize2 className="w-5 h-5 text-luxury-gold opacity-50" />
                         <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{suite.size || '85m²'} Sanctuary</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <Wind className="w-5 h-5 text-luxury-gold opacity-50" />
                         <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Pure Air System</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <ShieldCheck className="w-5 h-5 text-luxury-gold opacity-50" />
                         <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Total Privacy</span>
                      </div>
                   </div>

                   <div className="pt-10 flex items-center justify-between">
                      <div className="flex gap-3">
                         {(suite.features || []).map(f => (
                           <span key={f} className="text-[10px] font-bold uppercase tracking-widest bg-luxury-cream/50 px-4 py-2 rounded-full text-luxury-gold border border-luxury-gold/10">{f}</span>
                         ))}
                      </div>
                      <Link 
                        to={`/room/${suite.id}`} 
                        className="flex items-center gap-3 text-luxury-black font-bold uppercase tracking-[0.4em] text-[10px] hover:text-luxury-gold transition-colors group/link"
                      >
                         DISCOVERY PROFILE <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                      </Link>
                   </div>
                </div>
             </motion.div>
           )) : (
              [1,2,3,4].map(i => (
                <div key={i} className="space-y-12 animate-pulse">
                   <div className="aspect-[4/5] bg-gray-100 rounded-[3rem]" />
                   <div className="h-10 bg-gray-100 w-3/4 rounded-xl" />
                   <div className="h-20 bg-gray-100 w-full rounded-xl" />
                </div>
              ))
           )}
        </div>
      </section>

      {/* Signature Guest Experience */}
      <section className="bg-luxury-black py-60 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-luxury-gold opacity-[0.03] rounded-full blur-[200px] translate-x-1/3 -translate-y-1/3" />
         <div className="container mx-auto px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-40 items-center">
               <motion.div {...fadeInUp} className="space-y-12">
                  <h4 className="text-luxury-gold font-serif italic text-3xl">The Golden Standard</h4>
                  <h2 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9]">Crafted for the <br/>Discerning Traveler</h2>
                  <p className="text-white/40 text-2xl leading-relaxed font-medium">
                     Our service model is invisible yet omnipresent. From the moment you land in Setif until your final departure, every detail is anticipated by your dedicated suite concierge.
                  </p>
                  <div className="grid grid-cols-2 gap-16 pt-12">
                     <div className="space-y-6">
                        <div className="w-16 h-px bg-luxury-gold" />
                        <h5 className="font-bold uppercase tracking-[0.4em] text-xs">24/7 Personal Butler</h5>
                        <p className="text-white/20 text-sm italic leading-relaxed">Always present, never intrusive. Masters of the subtle art.</p>
                     </div>
                     <div className="space-y-6">
                        <div className="w-16 h-px bg-luxury-gold" />
                        <h5 className="font-bold uppercase tracking-[0.4em] text-xs">Airport Enclave</h5>
                        <p className="text-white/20 text-sm italic leading-relaxed">Direct suite transfer via our private Numidian fleet.</p>
                     </div>
                  </div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1.5 }}
                 className="relative"
               >
                  <div className="aspect-[4/5] rounded-[4rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-[2s] shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Service" />
                  </div>
                  <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-white/5 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/10 hidden xl:flex flex-col justify-center">
                     <Sparkles className="w-10 h-10 text-luxury-gold mb-6" />
                     <p className="text-luxury-gold text-5xl font-serif font-bold italic mb-4">99%</p>
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 leading-relaxed">Guest Delight index 2025</p>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Map Integration (Decorative) */}
      <section className="py-60 bg-white">
         <div className="container mx-auto px-12 text-center">
            <motion.div {...fadeInUp}>
               <Map className="w-16 h-16 text-luxury-gold mx-auto mb-10" />
               <h2 className="text-5xl font-serif font-bold mb-20 leading-none">Located in the heart of Heritage</h2>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              className="h-[600px] w-full rounded-[4rem] bg-luxury-cream/20 overflow-hidden relative group cursor-crosshair shadow-2xl"
            >
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2074" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2s]" alt="Map" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-40 h-40 rounded-full border border-luxury-gold flex items-center justify-center bg-white/80 backdrop-blur-md shadow-2xl animate-pulse">
                      <Logo textVisible={false} className="w-12 h-12" />
                   </div>
                </div>
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-luxury-black text-white px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] shadow-2xl">
                   Discover Our Vicinity
                </div>
            </motion.div>
         </div>
      </section>
    </BrochureLayout>
  );
};

export default SuitesPage;
