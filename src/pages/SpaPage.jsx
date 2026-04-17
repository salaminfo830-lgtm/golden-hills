import { motion } from 'framer-motion';
import { Waves, Flower2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import GoldButton from '../components/GoldButton';

const SpaPage = () => {
  return (
    <div className="min-h-screen bg-luxury-white-warm text-luxury-black font-sans">
      <nav className="p-6 flex justify-between items-center glass sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Logo textVisible={false} className="w-8 h-8" />
          <span className="font-serif font-bold text-xl tracking-tighter">GOLDEN HILLS</span>
        </Link>
        <GoldButton className="px-8 py-2 text-[10px]">BOOK A TREATMENT</GoldButton>
      </nav>

      <section className="relative h-[70vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2070")' }}
        >
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 text-center text-white px-6">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.2 }}
           >
              <h4 className="text-luxury-gold font-serif italic text-2xl mb-4">The Royal Hammam</h4>
              <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter">Pure Serenity</h1>
           </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-16">
              <section className="space-y-8">
                 <h2 className="text-4xl font-serif font-bold italic">Ancient Rituals, Modern Luxury</h2>
                 <p className="text-lg text-gray-600 leading-relaxed font-medium">
                    Our multi-award-winning wellness sanctuary draws inspiration from ancient Algerian hammam rituals. Each treatment is tailored to your body&apos;s specific needs, using organic oils sourced from the surrounding hills and premium saffron extracts.
                 </p>
                 <div className="grid md:grid-cols-2 gap-8 pt-6">
                    <img src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80&w=2070" className="rounded-3xl shadow-lg" alt="Spa Treatment" />
                    <img src="https://images.unsplash.com/photo-1519415510236-8a59ef54b360?auto=format&fit=crop&q=80&w=2070" className="rounded-3xl shadow-lg" alt="Hammam" />
                 </div>
              </section>

              <section className="space-y-10">
                 <h3 className="text-2xl font-serif font-bold lowercase tracking-tight">Our Signature Journeys</h3>
                 <div className="space-y-6">
                    {[
                      { name: 'Saffron Glow Ritual', dur: '120m', price: '$180', desc: 'A full-body exfoliation and massage using our signature hill-grown saffron oil.' },
                      { name: 'Traditional Hills Hammam', dur: '90m', price: '$140', desc: 'A deep-cleansing experience in our heated marble chamber.' },
                      { name: 'Desert Oasis Hydra-facial', dur: '60m', price: '$120', desc: 'Intense hydration for radiant, refreshed skin.' },
                    ].map((treat, i) => (
                      <div key={i} className="flex justify-between items-start border-b border-gray-100 pb-8 last:border-0">
                         <div className="max-w-xl">
                            <h4 className="text-xl font-bold mb-2">{treat.name}</h4>
                            <p className="text-sm text-gray-400 font-medium mb-1">{treat.desc}</p>
                            <span className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest">{treat.dur} Duration</span>
                         </div>
                         <p className="text-xl font-serif font-bold text-luxury-gold">{treat.price}</p>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           <div className="space-y-10">
              <GlassCard className="bg-white border-gray-100 p-10 sticky top-32">
                 <Flower2 className="w-10 h-10 text-luxury-gold mb-6" />
                 <h3 className="text-2xl font-serif font-bold mb-4">Wellness Hours</h3>
                 <div className="space-y-4 border-b border-gray-50 pb-8 mb-8">
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-gray-400 font-medium font-serif">Monday - Friday</span>
                       <span>08:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-gray-400 font-medium font-serif">Saturday - Sunday</span>
                       <span>09:00 - 20:00</span>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase tracking-widest">Reserve your peace</p>
                    <GoldButton className="w-full">CHECK AVAILABILITY</GoldButton>
                 </div>
              </GlassCard>

              <GlassCard className="gold-gradient text-white border-0 p-8 flex flex-col items-center text-center">
                 <Waves className="w-8 h-8 mb-4" />
                 <h4 className="font-bold mb-2">Heated Infinity Pool</h4>
                 <p className="text-xs text-white/70 leading-relaxed mb-6">Open 24/7 for house guests only.</p>
                 <button className="text-[10px] font-bold underline">ACCESS POLICY</button>
              </GlassCard>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SpaPage;
