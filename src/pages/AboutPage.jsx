import { motion } from 'framer-motion';
import { Star, MapPin, Award, History, Users, Globe, ShieldCheck, ChevronRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import BrochureLayout from '../components/BrochureLayout';
import GoldButton from '../components/GoldButton';
import { useSettings } from '../context/SettingsContext';

const AboutPage = () => {
  const { settings } = useSettings();
  return (
    <BrochureLayout>
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-end justify-center overflow-hidden bg-luxury-black">
         <motion.div 
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.5 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 bg-cover bg-center grayscale-[0.2]"
           style={{ backgroundImage: `url("${settings?.hero_image_url || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070"}")` }}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-luxury-cream/10 via-transparent to-transparent" />
         <div className="container mx-auto px-12 pb-20 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
               <h4 className="text-luxury-gold font-serif italic text-2xl mb-4 text-center">Since 1998</h4>
               <h1 className="text-6xl md:text-9xl font-serif font-bold text-white tracking-tighter leading-none">The Heritage</h1>
            </motion.div>
         </div>
      </section>

      {/* The Core Narrative */}
      <section className="py-40 container mx-auto px-12">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
           <div className="space-y-12">
              <div className="space-y-4">
                 <span className="text-luxury-gold font-bold uppercase tracking-[0.5em] text-[10px]">The Golden Story</span>
                 <h2 className="text-5xl md:text-7xl font-serif font-bold text-luxury-black leading-tight">A Legacy of <br/><span className="italic text-luxury-gold">Gilded Hospitality.</span></h2>
              </div>
              <p className="text-xl text-gray-500 leading-relaxed font-medium">
                {settings?.hotel_name || "Golden Hills Hotel Setif"} was born from a singular ambition: to anchor world-class luxury in the heart of Algeria&apos;s ancient landscape. For over a quarter-century, we have been more than a hotel—we have been a sanctuary for diplomats, a stage for celebrations, and a silent witness to the history of Setif.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-10">
                 <div className="space-y-2 border-l-2 border-luxury-gold pl-8">
                    <p className="text-5xl font-serif font-bold text-luxury-black">25+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Years of Service</p>
                 </div>
                 <div className="space-y-2 border-l-2 border-luxury-gold pl-8">
                    <p className="text-5xl font-serif font-bold text-luxury-black">5☆</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Elite Standards</p>
                 </div>
              </div>
           </div>
           <div className="relative group">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 transform group-hover:rotate-1 transition-transform duration-1000">
                 <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="History" />
                 <div className="absolute inset-0 bg-luxury-gold/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-luxury-gold opacity-[0.05] rounded-full blur-[100px]" />
           </div>
        </div>
      </section>

      {/* Pillars of Excellence */}
      <section className="bg-white py-40">
         <div className="container mx-auto px-12">
            <div className="text-center mb-24">
               <h3 className="text-4xl font-serif font-bold mb-6">Our Three Pillars</h3>
               <div className="h-px w-24 bg-luxury-gold mx-auto" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-16">
               {[
                 { icon: <History />, title: 'Deep Roots', desc: 'Preserving the architectural soul of the region through meticulous craftsmanship.' },
                 { icon: <Award />, title: 'Elite Craft', desc: 'A relentless pursuit of perfection in service, from concierge to culinary.' },
                 { icon: <Globe />, title: 'Global Vision', desc: 'Bringing world-class innovation to the heart of the Algerian high plateau.' }
               ].map((item, i) => (
                 <div key={i} className="text-center space-y-8 group">
                    <div className="w-24 h-24 bg-luxury-cream/30 rounded-[2.5rem] flex items-center justify-center mx-auto text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-gold group-hover:rotate-6">
                       <div className="scale-125">{item.icon}</div>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-2xl font-serif font-bold text-luxury-black">{item.title}</h4>
                       <p className="text-gray-400 font-medium leading-relaxed max-w-xs mx-auto italic">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Timeline Section */}
      <section className="py-40 container mx-auto px-12">
         <div className="max-w-4xl mx-auto space-y-24">
            <div className="text-center">
               <h3 className="text-5xl font-serif font-bold italic mb-4">The Golden Timeline</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Chronicles of Excellence</p>
            </div>

            <div className="space-y-32">
               {[
                 { year: '1998', title: 'The Foundation', desc: 'The first stone is laid on the hills of Setif, marking the birth of a new era.' },
                 { year: '2005', title: 'The Royal Expansion', desc: 'Opening of the Signature Suites wing and the Grand Saffron dining hall.' },
                 { year: '2019', title: 'Heritage Distinction', desc: 'Awarded the National Seal of Hospitality for preserving Algerian culture.' },
                 { year: '2026', title: 'The Digital Renaissance', desc: 'Launching our advanced integrated platform for the modern traveler.' }
               ].map((event, i) => (
                 <div key={i} className={`flex flex-col md:flex-row gap-12 items-start ${i % 2 !== 0 ? 'md:flex-row-reverse text-right' : ''}`}>
                    <div className="md:w-1/2">
                       <span className="text-7xl font-serif font-bold text-luxury-gold/20 block mb-6">{event.year}</span>
                       <h4 className="text-3xl font-serif font-bold text-luxury-black mb-4">{event.title}</h4>
                       <p className="text-lg text-gray-500 leading-relaxed font-medium">{event.desc}</p>
                    </div>
                    <div className="hidden md:block w-px h-64 bg-gradient-to-b from-luxury-gold/50 to-transparent self-stretch mx-auto" />
                    <div className="md:w-1/2" />
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Team/Leadership Accent */}
      <section className="bg-luxury-black py-40 text-white text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
         <div className="container mx-auto px-12 relative z-10">
            <Users className="w-16 h-16 text-luxury-gold mx-auto mb-10" />
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-10 italic">The Gilded Collective</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-xl leading-relaxed mb-16 font-medium">
               Our staff are not merely employees; they are the guardians of your experience. Each member is trained in the art of anticipation and the science of service.
            </p>
            <div className="flex flex-wrap justify-center gap-12 pt-10">
               <div className="text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-luxury-gold/30 p-2 mb-4 mx-auto">
                     <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1974" className="w-full h-full object-cover rounded-full" alt="Manager" />
                  </div>
                  <h5 className="font-bold text-sm">Fares Ahmed</h5>
                  <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest mt-1">General Manager</p>
               </div>
               <div className="text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-luxury-gold/30 p-2 mb-4 mx-auto">
                     <img src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=1974" className="w-full h-full object-cover rounded-full" alt="Chef" />
                  </div>
                  <h5 className="font-bold text-sm">Youssef Benali</h5>
                  <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest mt-1">Executive Chef</p>
               </div>
               <div className="text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-luxury-gold/30 p-2 mb-4 mx-auto">
                     <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1974" className="w-full h-full object-cover rounded-full" alt="Concierge" />
                  </div>
                  <h5 className="font-bold text-sm">Lina Haddad</h5>
                  <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest mt-1">Front Desk Manager</p>
               </div>
            </div>
         </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 container mx-auto px-12 text-center">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl font-serif font-bold text-luxury-black italic">Become Part of the Legacy</h2>
            <p className="text-xl text-gray-500 leading-relaxed font-medium">
               Whether you are visiting for a night or staying for a season, your presence adds a new chapter to our story. We invite you to experience the hills as they were meant to be seen.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
               <GoldButton className="px-16 py-6 text-xs shadow-gold">BOOK YOUR SANCTUARY</GoldButton>
               <button className="flex items-center justify-center gap-4 px-12 py-6 border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all">
                  Contact Enclave <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </section>
    </BrochureLayout>
  );
};

export default AboutPage;
