import { motion } from 'framer-motion';
import { Star, MapPin, Award, History, Users, Globe, ShieldCheck, ChevronRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import BrochureLayout from '../components/BrochureLayout';
import GoldButton from '../components/GoldButton';
import { useSettings } from '../context/SettingsContext';

const AboutPage = () => {
  const { settings } = useSettings();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <BrochureLayout>
      {/* Hero Header */}
      <section className="relative h-[70vh] flex items-end justify-center overflow-hidden bg-luxury-black">
         <motion.div 
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.6 }}
           transition={{ duration: 2.5 }}
           className="absolute inset-0 bg-cover bg-center grayscale-[0.1]"
           style={{ backgroundImage: `url("${settings?.hero_image_url || "/golden_hills_setif_hero_1776878839733.png"}")` }}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
         <div className="container mx-auto px-6 md:px-12 pb-24 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
               <h4 className="text-luxury-gold font-serif italic text-2xl md:text-3xl mb-6 tracking-widest">Since 1998</h4>
               <h1 className="text-6xl md:text-[10rem] font-serif font-bold text-white tracking-tighter leading-none uppercase">The Legacy</h1>
            </motion.div>
         </div>
      </section>

      {/* The Core Narrative */}
      <section className="py-20 md:py-60 container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-20 md:gap-40 items-center">
           <motion.div {...fadeInUp} className="space-y-12 md:space-y-16">
              <div className="space-y-6">
                 <span className="text-luxury-gold font-bold uppercase tracking-[0.6em] text-[10px] block">Our Origin</span>
                 <h2 className="text-5xl md:text-8xl font-serif font-bold text-luxury-black leading-[0.9]">Sculpted in <br/><span className="italic text-luxury-gold">Stone & Gold.</span></h2>
              </div>
              <div className="space-y-8">
                <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium italic">
                  "At Golden Hills, we believe true luxury is a dialogue between the rugged spirit of the Algerian highlands and the delicate precision of handcrafted excellence."
                </p>
                <p className="text-lg text-gray-400 leading-relaxed font-medium">
                  Established in 1998, {settings?.hotel_name || "Golden Hills Hotel Setif"} was envisioned as a beacon of modern grandeur in the high plateau. For over a quarter-century, we have served as a sanctuary for world leaders, a stage for the region&apos;s most prestigious celebrations, and a silent guardian of Setif&apos;s architectural heritage.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-12 pt-10">
                 <div className="space-y-3 border-l-2 border-luxury-gold pl-8">
                    <p className="text-5xl md:text-6xl font-serif font-bold text-luxury-black">28</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Years of Mastery</p>
                 </div>
                 <div className="space-y-3 border-l-2 border-luxury-gold pl-8">
                    <p className="text-5xl md:text-6xl font-serif font-bold text-luxury-black">4☆</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Gilded Rating</p>
                 </div>
              </div>
           </motion.div>
           <div className="relative group">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5 }}
                className="aspect-[4/5] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl relative z-10 transform group-hover:scale-[1.02] transition-transform duration-1000"
              >
                 <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000" alt="History" />
                 <div className="absolute inset-0 bg-luxury-gold/5 group-hover:bg-transparent transition-colors" />
              </motion.div>
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-luxury-gold opacity-[0.05] rounded-full blur-[100px]" />
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -top-12 -right-12 p-12 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-luxury-gold/10 z-20 hidden xl:block"
              >
                 <p className="text-6xl font-serif font-bold text-luxury-gold mb-2 italic">100%</p>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Authentic Numidian Spirit</p>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Pillars of Excellence */}
      <section className="bg-luxury-white-warm py-20 md:py-60">
         <div className="container mx-auto px-6 md:px-12">
            <motion.div {...fadeInUp} className="text-center mb-32">
               <h4 className="text-luxury-gold font-bold text-[10px] uppercase tracking-[0.6em] mb-8">The Foundations</h4>
               <h2 className="text-4xl md:text-7xl font-serif font-bold text-luxury-black">Our Three Pillars</h2>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
               {[
                 { icon: <History />, title: 'Numidian Soul', desc: 'We preserve the deep architectural roots of the high plateau through meticulous artisanal craftsmanship and local heritage.' },
                 { icon: <Award />, title: 'Hilltop Precision', desc: 'A relentless pursuit of perfection in service, where anticipation is a science and hospitality is a high art form.' },
                 { icon: <Globe />, title: 'Global Vision', desc: 'Integrating world-class luxury innovation with the timeless traditions of the Maghreb to create a unique sanctuary.' }
               ].map((item, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.2, duration: 1 }}
                   viewport={{ once: true }}
                   className="text-center space-y-10 group"
                 >
                    <div className="w-28 h-28 bg-white rounded-[3rem] flex items-center justify-center mx-auto text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:shadow-gold group-hover:-rotate-3 border border-gray-50">
                       <div className="scale-150">{item.icon}</div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-2xl md:text-3xl font-serif font-bold text-luxury-black">{item.title}</h4>
                       <p className="text-gray-400 font-medium leading-relaxed max-w-xs mx-auto italic">{item.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 md:py-60 container mx-auto px-6 md:px-12 relative overflow-hidden">
         <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 hidden md:block" />
         <div className="max-w-6xl mx-auto space-y-32">
            <motion.div {...fadeInUp} className="text-center relative z-10">
               <h3 className="text-5xl md:text-8xl font-serif font-bold italic mb-6">The Golden Timeline</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.5em]">Chronicles of Grandeur</p>
            </motion.div>

            <div className="space-y-40 md:space-y-60 relative z-10">
               {[
                 { year: '1998', title: 'The First Stone', desc: 'Inauguration of the Golden Hills, bringing a new standard of luxury to the hills of Setif.' },
                 { year: '2008', title: 'The Saffron Theater', desc: 'Opening of our signature dining venues, redefining the culinary landscape of Algeria.' },
                 { year: '2018', title: 'The Hammam Sanctuary', desc: 'Launch of our world-class spa facilities, integrating ancient Numidian rituals with modern wellness.' },
                 { year: '2026', title: 'The Gilded Digital Frontier', desc: 'Introducing our advanced luxury platform, ensuring seamless service for the modern traveler.' }
               ].map((event, i) => (
                 <div key={i} className={`flex flex-col md:flex-row gap-12 md:gap-20 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse text-right' : ''}`}>
                    <div className="md:w-1/2 space-y-6">
                       <span className="text-8xl md:text-[12rem] font-serif font-bold text-luxury-gold/10 block leading-none">{event.year}</span>
                       <h4 className="text-3xl md:text-5xl font-serif font-bold text-luxury-black">{event.title}</h4>
                       <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium max-w-xl mx-auto md:mx-0">{event.desc}</p>
                    </div>
                    <div className="hidden md:flex w-24 h-24 rounded-full bg-white border border-luxury-gold items-center justify-center text-luxury-gold shadow-gold relative">
                       <div className="w-4 h-4 bg-luxury-gold rounded-full animate-ping absolute" />
                       <Star className="w-8 h-8 fill-current" />
                    </div>
                    <div className="md:w-1/2" />
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Team/Leadership Accent */}
      <section className="bg-luxury-black py-20 md:py-60 text-white text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-luxury-gold opacity-[0.03] rounded-full blur-[200px] translate-x-1/2 -translate-y-1/2" />
         <div className="container mx-auto px-6 md:px-12 relative z-10">
            <motion.div {...fadeInUp}>
              <Users className="w-16 h-16 text-luxury-gold mx-auto mb-10" />
              <h2 className="text-5xl md:text-8xl font-serif font-bold mb-10 italic leading-none">The Custodians</h2>
              <p className="text-white/40 max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed mb-24 font-medium italic">
                "Our staff are not merely employees; they are the guardians of your experience. Every gesture is choreographed to anticipate your silent desires."
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
               {[
                 { name: 'Fares Ahmed', role: 'General Manager', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1974' },
                 { name: 'Youssef Benali', role: 'Executive Chef', img: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=1974' },
                 { name: 'Lina Haddad', role: 'Guest Relations', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1974' }
               ].map((member, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2, duration: 1 }}
                    viewport={{ once: true }}
                    className="text-center group"
                 >
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-luxury-gold/30 p-3 mb-8 mx-auto relative group-hover:border-luxury-gold transition-all duration-700">
                       <img src={member.img} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-1000" alt={member.name} />
                       <div className="absolute inset-0 bg-luxury-gold/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h5 className="text-2xl font-serif font-bold tracking-tight">{member.name}</h5>
                    <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.5em] mt-3">{member.role}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 md:py-60 container mx-auto px-6 md:px-12 text-center">
         <motion.div {...fadeInUp} className="max-w-4xl mx-auto space-y-16">
            <h2 className="text-5xl md:text-8xl font-serif font-bold text-luxury-black italic leading-[0.9]">Become Part <br/> of the Legacy.</h2>
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium">
               Whether you are visiting for a night or staying for a season, your presence adds a new chapter to our story. We invite you to experience the hills as they were meant to be seen.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-8">
               <GoldButton className="px-16 py-6 text-xs shadow-gold w-full md:w-auto" onClick={() => window.location.href='/search'}>BOOK YOUR SANCTUARY</GoldButton>
               <button className="flex items-center justify-center gap-4 px-12 py-6 border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-gray-50 transition-all group w-full md:w-auto">
                  Contact Enclave <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
         </motion.div>
      </section>
    </BrochureLayout>
  );
};

export default AboutPage;
