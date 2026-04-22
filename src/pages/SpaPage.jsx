import { motion } from 'framer-motion';
import { Waves, Flower2, Wind, Sparkles, ChevronRight, Droplets, MapPin, Clock } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import BrochureLayout from '../components/BrochureLayout';
import GoldButton from '../components/GoldButton';

const SpaPage = () => {
  const rituals = [
    { 
      name: 'The Saffron Glow Ritual', 
      dur: '120m', 
      price: '$180', 
      desc: 'A sensory journey starting with a rare saffron-infused body polish, followed by a rhythmic massage that restores radiant vitality.',
      category: 'Signature'
    },
    { 
      name: 'Royal Heritage Hammam', 
      dur: '90m', 
      price: '$140', 
      desc: 'Deep cleansing in our heated marble chamber, using traditional black soap and the invigorating kessa scrub technique.',
      category: 'Tradition'
    },
    { 
      name: 'Desert Oasis Hydra-facial', 
      dur: '60m', 
      price: '$120', 
      desc: 'Harnessing the resilience of desert flora to provide intense hydration and a luminous, refreshed complexion.',
      category: 'Advanced'
    },
    { 
      name: 'Atlas Cedar Wood Therapy', 
      dur: '105m', 
      price: '$165', 
      desc: 'A deep-tissue release using warmed cedar wood tools to ground the spirit and soothe muscular tension.',
      category: 'Specialty'
    }
  ];

  return (
    <BrochureLayout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2070")' }}
        />
        <div className="absolute inset-0 bg-luxury-black/40 backdrop-blur-[1px]" />
        <div className="relative z-10 text-center text-white px-6">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 1.2 }}
           >
              <h4 className="text-luxury-gold font-serif italic text-2xl mb-4">The Royal Hammam</h4>
              <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter leading-none">Pure <br/>Serenity</h1>
           </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40"
        >
           <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Scroll to Descend</span>
           <div className="w-px h-12 bg-gradient-to-b from-luxury-gold to-transparent" />
        </motion.div>
      </section>

      {/* Philosophy of Wellness */}
      <section className="py-40 container mx-auto px-12">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-12">
              <h4 className="text-luxury-gold font-serif italic text-2xl">The Sanctuary Ethos</h4>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-luxury-black leading-tight">Ancient Rituals, <br/>Refined by Science.</h2>
              <p className="text-xl text-gray-500 leading-relaxed font-medium">
                 Our sanctuary is built upon the pillars of traditional Algerian wellness. Every experience is a choreography of hot and cold, stone and silk, scents and silence—designed to return you to your center.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                 <div className="flex items-start gap-4">
                    <Droplets className="w-6 h-6 text-luxury-gold" />
                    <div>
                       <h5 className="font-bold text-sm uppercase tracking-widest">Alpine Waters</h5>
                       <p className="text-gray-400 text-xs">Purified from the hills.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <Sparkles className="w-6 h-6 text-luxury-gold" />
                    <div>
                       <h5 className="font-bold text-sm uppercase tracking-widest">Saffron Oils</h5>
                       <p className="text-gray-400 text-xs">Bespoke local extracts.</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="relative">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Treatment" />
              </div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-white p-4 rounded-[3rem] shadow-xl border border-gray-100 flex items-center justify-center">
                 <div className="text-center">
                    <p className="text-4xl font-serif font-bold text-luxury-gold italic">0%</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Holistic Harmony</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Signature Rituals List */}
      <section className="pb-40 container mx-auto px-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24 border-b border-gray-100 pb-12">
           <div>
              <h3 className="text-4xl font-serif font-bold text-luxury-black mb-2">The Menu of Journeys</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Curated for Spiritual Restoration</p>
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-3 border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">Download PDF</button>
              <GoldButton className="px-8 py-3 text-[10px]">Inquire Now</GoldButton>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
           {rituals.map((ritual, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="group flex gap-10 pb-12 border-b border-gray-50 last:border-0"
             >
                <div className="text-luxury-gold font-serif text-3xl font-bold opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</div>
                <div className="flex-1 space-y-4">
                   <div className="flex justify-between items-start">
                      <div>
                         <span className="text-[8px] font-bold text-luxury-gold uppercase tracking-[0.4em] block mb-2">{ritual.category}</span>
                         <h4 className="text-2xl font-serif font-bold text-luxury-black group-hover:italic transition-all">{ritual.name}</h4>
                      </div>
                      <p className="text-xl font-serif font-bold text-luxury-gold">{ritual.price}</p>
                   </div>
                   <p className="text-gray-500 leading-relaxed max-w-lg">{ritual.desc}</p>
                   <div className="flex items-center gap-4 pt-2">
                      <Clock className="w-3 h-3 text-gray-300" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">{ritual.dur} Duration</span>
                      <ChevronRight className="w-4 h-4 text-luxury-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all ml-auto" />
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Facilities Highlight */}
      <section className="bg-white py-40">
         <div className="container mx-auto px-12 text-center mb-24">
            <h2 className="text-5xl font-serif font-bold mb-6 italic">Sanctuary Enclaves</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Explore our temple of wellness, where every chamber is optimized for tranquility.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 max-w-[1800px] mx-auto">
            {[
              { name: 'Marble Hammam', img: '/golden_hills_hammam_1776878932931.png', tag: 'Thermal' },
              { name: 'Infinity Pool', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=2070', tag: 'Hydro' },
              { name: 'Restoration Lounge', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2070', tag: 'Silence' },
            ].map((facility, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -20 }}
                className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
              >
                 <img src={facility.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={facility.name} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 <div className="absolute bottom-10 left-10 text-white">
                    <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-luxury-gold mb-2 block">{facility.tag}</span>
                    <h5 className="text-2xl font-serif font-bold">{facility.name}</h5>
                 </div>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Sticky Booking Accent */}
      <section className="bg-luxury-black py-32 relative overflow-hidden">
         <motion.div 
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-luxury-gold/5 blur-[100px] rounded-full"
         />
         <div className="container mx-auto px-12 relative z-10">
            <GlassCard className="bg-white/5 border-white/10 p-20 flex flex-col md:flex-row items-center justify-between rounded-[4rem] gap-12">
               <div className="text-center md:text-left space-y-4">
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-white italic">Preserve Your Silence</h3>
                  <p className="text-white/40 max-w-lg font-medium">We recommend booking your rituals at least 24 hours in advance to ensure preferred timing.</p>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex gap-8 items-center bg-white/5 px-8 py-4 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-luxury-gold" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest">Setif Enclave</span>
                     </div>
                     <div className="w-px h-6 bg-white/10" />
                     <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-luxury-gold" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest">Open Daily</span>
                     </div>
                  </div>
                  <GoldButton className="w-full py-6 text-xs shadow-gold">BOOK A TREATMENT</GoldButton>
               </div>
            </GlassCard>
         </div>
      </section>
    </BrochureLayout>
  );
};

export default SpaPage;
