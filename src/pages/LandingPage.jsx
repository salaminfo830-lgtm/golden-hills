import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, MapPin, Star,
  UtensilsCrossed, Waves, 
  ChevronRight, PlayCircle,
  Sparkles, Search, ArrowRight, MousePointer2,
  Globe, Shield, Award, Droplets,
  Wine, Landmark, Clock
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';

const LandingPage = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: '2'
  });

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('Room')
        .select('*')
        .order('price', { ascending: true });
      
      if (!error && data) {
        const uniqueTypes = [];
        const displayRooms = data.filter(room => {
          if (!uniqueTypes.includes(room.type)) {
            uniqueTypes.push(room.type);
            return true;
          }
          return false;
        });
        setRooms(displayRooms.slice(0, 3)); 
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const navItems = [
    { label: 'Suites', path: '/suites' },
    { label: 'Dining', path: '/dining' },
    { label: 'Spa', path: '/spa' },
    { label: 'About', path: '/about' },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="min-h-screen bg-luxury-cream/10 overflow-x-hidden selection:bg-luxury-gold selection:text-white font-sans">
      <Navbar transparent />

      {/* Hero Section - The Grand Arrival */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-luxury-black">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${settings?.hero_image_url || "/golden_hills_setif_hero_1776878839733.png"}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-transparent to-luxury-cream/10" />
        </motion.div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <div className="hidden sm:block h-px w-20 bg-luxury-gold/50" />
              <h4 className="text-luxury-gold font-bold text-xs md:text-sm tracking-[0.2em] md:tracking-[0.4em] uppercase text-center">Setif&apos;s Gilded Masterpiece</h4>
              <div className="hidden sm:block h-px w-20 bg-luxury-gold/50" />
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium text-white tracking-tight leading-[1.1] mb-10">
               <span className="gold-text-gradient capitalize">{settings?.hotel_name || "Hôtel Golden Hills"}</span> <br /> 
               <span className="text-luxury-gold/90 text-2xl md:text-4xl tracking-widest uppercase block mt-4">A Symphony of Luxury & Light</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-16 font-medium leading-relaxed italic">
               "Un refuge de tranquillité dans chaque détail"
            </p>
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
              <GoldButton className="px-10 py-4 shadow-sm hover:scale-105 transition-all w-full sm:w-auto" onClick={() => navigate('/search')}>START YOUR JOURNEY</GoldButton>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30">
           <span className="text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">Descend</span>
           <motion.div 
             animate={{ y: [0, 10, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-px h-16 bg-gradient-to-b from-luxury-gold to-transparent" 
           />
        </div>
      </section>

      {/* Booking Widget Overlay */}
      <div className="relative z-50 mt-10 max-w-[1400px] mx-auto px-8 hidden lg:block mb-20">
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1, duration: 1 }}
         >
           <GlassCard className="bg-white p-3 rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] flex items-center border-luxury-gold/5">
              <div className="flex-1 grid grid-cols-3 gap-4">
                 <div className="group px-10 py-7 rounded-2xl hover:bg-luxury-cream/40 transition-all cursor-pointer border-r border-gray-50 relative">
                    <div className="flex items-center gap-5">
                       <div className="text-luxury-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"><Calendar /></div>
                       <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase text-gray-600 tracking-widest mb-1">Check-In</span>
                          <input 
                            type="date" 
                            value={searchParams.checkIn}
                            onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                            className="font-bold text-luxury-black text-sm bg-transparent outline-none cursor-pointer w-full" 
                          />
                       </div>
                    </div>
                 </div>
                 <div className="group px-10 py-7 rounded-2xl hover:bg-luxury-cream/40 transition-all cursor-pointer border-r border-gray-50 relative">
                    <div className="flex items-center gap-5">
                       <div className="text-luxury-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"><Calendar /></div>
                       <div className="flex flex-col flex-1">
                          <span className="text-xs font-bold uppercase text-gray-600 tracking-widest mb-1">Check-Out</span>
                          <input 
                            type="date" 
                            value={searchParams.checkOut}
                            onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                            className="font-bold text-luxury-black text-sm bg-transparent outline-none cursor-pointer w-full" 
                          />
                       </div>
                    </div>
                 </div>
                 <div className="group px-10 py-7 rounded-2xl hover:bg-luxury-cream/40 transition-all cursor-pointer relative">
                    <div className="flex items-center gap-5">
                       <div className="text-luxury-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"><Users /></div>
                       <div className="flex flex-col flex-1">
                          <span className="text-xs font-bold uppercase text-gray-600 tracking-widest mb-1">Guests</span>
                          <input 
                            type="number" 
                            min="1"
                            value={searchParams.guests}
                            onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
                            className="font-bold text-luxury-black text-sm bg-transparent outline-none cursor-pointer w-full" 
                          />
                       </div>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => navigate(`/search?checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&guests=${searchParams.guests}`)}
                className="h-[70px] w-[180px] gold-gradient rounded-xl flex items-center justify-center text-white shadow-sm hover:brightness-110 transition-all ml-4"
              >
                 <span className="font-bold tracking-[0.3em] text-[10px] uppercase">Initialize Discovery</span>
              </button>
           </GlassCard>
         </motion.div>
      </div>

      {/* Section: The Heritage */}
      <section className="py-20 md:py-40 container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
           <motion.div {...fadeInUp}>
              <span className="text-luxury-gold font-bold text-xs uppercase tracking-widest mb-8 block">The Soul of Setif</span>
              <h2 className="text-4xl md:text-7xl font-bold text-luxury-black leading-[1.1] tracking-tight mb-8 md:mb-12">Rugged beauty, <br/><span className="text-luxury-gold">refined.</span></h2>
              <p className="text-xl text-gray-700 leading-relaxed font-medium mb-16 max-w-xl">
                 Located at Rue Champs d'azur, {settings?.hotel_name || "Hôtel Golden Hills"} is a sanctuary of 54 rooms and suites. We offer a perfect blend of traditional Algerian hospitality and modern luxury, just steps away from Sétif's most iconic landmarks.
              </p>
              <div className="space-y-10">
                 {[
                   { icon: <Shield />, title: 'Absolute Privacy', desc: 'Gated enclaves and private concierges for total discretion.' },
                   { icon: <Award />, title: 'Golden Service', desc: 'Our staff are masters of anticipation, trained in the art of the subtle.' }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-8 group">
                      <div className="w-16 h-16 rounded-3xl bg-luxury-cream/40 flex items-center justify-center text-luxury-gold shrink-0 group-hover:bg-luxury-gold group-hover:text-white transition-all shadow-sm group-hover:shadow-gold">
                         {item.icon}
                      </div>
                      <div>
                         <h4 className="text-xl font-bold text-luxury-black mb-2 tracking-tight">{item.title}</h4>
                         <p className="text-gray-600 text-sm font-medium">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="pt-10 md:pt-20">
                 <GoldButton outline className="px-8 md:px-12 py-3 md:py-5" onClick={() => navigate('/about')}>DISCOVER OUR STORY</GoldButton>
              </div>
           </motion.div>

           <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 1 }}
                className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10"
              >
                 <img src="/golden_hills_hammam_1776878932931.png" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" alt="Spa" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
              <div className="absolute -bottom-8 md:-bottom-16 -right-8 md:-right-16 w-40 md:w-80 h-40 md:h-80 bg-luxury-gold opacity-[0.05] rounded-full blur-[50px] md:blur-[100px]" />
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -top-12 -left-12 p-10 bg-white/80 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-luxury-gold/10 z-20 hidden xl:block"
              >
                 <p className="text-6xl font-bold text-luxury-gold mb-2 tracking-tighter">100%</p>
                 <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.4em]">Authenticity Rating</p>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Signature Experiences Grid */}
      <section className="bg-luxury-white-warm py-20 md:py-40">
         <div className="container mx-auto px-6 md:px-12">
            <motion.div {...fadeInUp} className="text-center mb-32">
               <h4 className="text-luxury-gold font-bold text-xs uppercase tracking-widest mb-6">World Class</h4>
               <h2 className="text-4xl md:text-6xl font-bold text-luxury-black tracking-tight">Signature Enclaves</h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
               {[
                 { icon: <Landmark />, title: 'The Gilded Hall', desc: 'A grand space for the city’s most prestigious events.' },
                 { icon: <Wine />, title: 'Numidian Cellar', desc: 'Rare vintages paired with artisanal Algerian cheeses.' },
                 { icon: <Clock />, title: '24/7 Butler', desc: 'Invisible service that anticipates every desire.' },
                 { icon: <Globe />, title: 'Global Concierge', desc: 'Exclusive access to the best of North Africa.' },
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1, duration: 0.8 }}
                   viewport={{ once: true }}
                   className="p-10 bg-white border border-gray-100 rounded-3xl hover:border-luxury-gold/30 hover:shadow-xl transition-all group"
                 >
                    <div className="w-14 h-14 rounded-2xl bg-luxury-cream flex items-center justify-center text-luxury-gold mb-8 group-hover:bg-luxury-gold group-hover:text-white transition-all">
                       {item.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Section: The Sanctuaries (Suites) */}
      <section className="bg-white py-20 md:py-40">
         <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-32">
               <motion.div {...fadeInUp} className="max-w-2xl">
                  <h4 className="text-luxury-gold font-bold text-xs uppercase tracking-widest mb-6">Accommodations</h4>
                  <h2 className="text-5xl md:text-6xl font-bold text-luxury-black leading-[1.1] tracking-tight">Sanctuaries of <br/><span>profound stillness</span></h2>
               </motion.div>
               <Link to="/suites" className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-luxury-gold transition-colors group">
                  EXPLORE ALL SUITES <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {rooms.length > 0 ? rooms.map((room, i) => (
                 <motion.div 
                   key={room.id}
                   whileHover={{ y: -20 }}
                   className="group cursor-pointer"
                   onClick={() => navigate(`/room/${room.id}`)}
                 >
                    <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group-hover:shadow-gold/20 transition-all duration-700">
                       <img src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt={room.type} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-12 flex flex-col justify-end text-white">
                          <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-3">{room.type}</span>
                          <h3 className="text-4xl font-bold transition-all leading-tight tracking-tight mb-2">{room.type.split(' ')[0]}</h3>
                          <p className="text-luxury-gold text-lg font-bold">{room.price} DZD / night</p>
                          <div className="mt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                             <span className="text-xs font-bold uppercase tracking-[0.3em]">Discovery Profile</span>
                             <ChevronRight className="w-4 h-4 text-luxury-gold" />
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )) : (
                 [1,2,3].map(i => (
                   <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-gray-100 animate-pulse" />
                 ))
               )}
            </div>
         </div>
      </section>

      {/* Section: Epicurean Enclaves (Dining/Spa) */}
      <section className="py-20 md:py-40 bg-luxury-black text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-luxury-gold opacity-[0.03] rounded-full blur-[100px] md:blur-[150px] translate-x-1/2 -translate-y-1/2" />
         <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-40 items-center">
               <motion.div {...fadeInUp} className="space-y-16">
                  <div className="space-y-6">
                     <h4 className="text-luxury-gold font-bold text-sm tracking-widest uppercase">The Gastronomy</h4>
                     <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">The Saffron <br/>Theater.</h2>
                     <p className="text-white/80 text-xl leading-relaxed max-w-xl font-medium">
                        A sensory journey through the heart of Algeria. Experience the theater of fine dining where each dish is a masterpiece of hill-grown spices and artisanal precision.
                     </p>
                  </div>
                  <div className="flex gap-8">
                     <GoldButton className="px-10 py-4 text-xs" onClick={() => navigate('/dining')}>VIEW VENUES</GoldButton>
                     <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors" onClick={() => navigate('/dining')}>
                        Discovery Menu <ArrowRight className="w-4 h-4 text-luxury-gold" />
                     </button>
                  </div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 1.5 }}
                 className="relative group"
               >
                  <div className="aspect-[16/11] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-1000">
                     <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1974" className="w-full h-full object-cover" alt="Dining" />
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 backdrop-blur-3xl rounded-2xl p-10 border border-white/20 flex flex-col justify-center text-center shadow-xl">
                     <UtensilsCrossed className="w-8 h-8 text-luxury-gold mx-auto mb-4" />
                     <p className="text-xs font-bold uppercase tracking-widest text-white">3 Signature Concepts</p>
                  </div>
               </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-40 items-center mt-60">
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 1.5 }}
                 className="relative order-2 lg:order-1 group"
               >
                  <div className="aspect-[16/11] rounded-[3rem] overflow-hidden shadow-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-1000">
                     <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Spa" />
                  </div>
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 backdrop-blur-3xl rounded-2xl p-10 border border-white/20 flex flex-col justify-center text-center shadow-xl">
                     <Waves className="w-8 h-8 text-luxury-gold mx-auto mb-4" />
                     <p className="text-xs font-bold uppercase tracking-widest text-white">Royal Hammam</p>
                  </div>
               </motion.div>
               <motion.div {...fadeInUp} className="space-y-16 order-1 lg:order-2">
                  <div className="space-y-6">
                     <h4 className="text-luxury-gold font-bold text-sm tracking-widest uppercase text-right">The Rituals</h4>
                     <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-right">Pure <br/>Atmosphere.</h2>
                     <p className="text-white/80 text-xl leading-relaxed max-w-xl ml-auto text-right font-medium">
                        Immerse yourself in the ancient wisdom of the hills. Our spa rituals are choreographies of silence, steam, and restoration.
                     </p>
                  </div>
                  <div className="flex gap-8 justify-end">
                     <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors" onClick={() => navigate('/spa')}>
                        Explore Rituals <ArrowRight className="w-4 h-4 text-luxury-gold" />
                     </button>
                     <GoldButton className="px-10 py-4 text-xs" onClick={() => navigate('/spa')}>BOOK WELLNESS</GoldButton>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Section: Guest Voices */}
      <section className="py-20 md:py-40 container mx-auto px-6 md:px-12">
         <motion.div {...fadeInUp} className="text-center mb-32">
            <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-8" />
            <h2 className="text-5xl md:text-6xl font-bold text-luxury-black tracking-tight">Voices of the Hills</h2>
         </motion.div>
         <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: 'Sarah B.', city: 'Algiers', text: 'An exceptional stay. The rooms are beautifully designed with authentic touches, and the location is perfect for exploring Sétif.' },
              { name: 'David M.', city: 'London', text: 'The best hotel in Sétif. The staff is professional, the rooms are spotless, and the breakfast buffet is simply amazing.' },
              { name: 'Karim L.', city: 'Dubai', text: 'Luxury and peace in the heart of the city. The spa treatments were a highlight of my trip. Highly recommended!' }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="bg-white p-12 space-y-8 border-gray-100 hover:border-luxury-gold/30 transition-all duration-700 h-full flex flex-col">
                   <div className="flex gap-1">
                      {[1,2,3,4].map(s => <Star key={s} className="w-4 h-4 text-luxury-gold fill-current" />)}
                   </div>
                   <p className="text-gray-800 text-lg leading-relaxed font-medium flex-1">"{review.text}"</p>
                   <div className="pt-8 border-t border-gray-50">
                      <p className="font-bold text-luxury-black">{review.name}</p>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{review.city} • Verified Stay</p>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-black pt-20 md:pt-40 pb-10 md:pb-20 text-white relative overflow-hidden">
         <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24 mb-20 md:mb-32">
               <div className="space-y-10">
                  <Logo inverse className="scale-110 origin-left" />
                  <p className="text-white/60 text-sm leading-relaxed font-medium">
                     "Elevating the hospitality standards of Setif through a perfect blend of heritage and modern luxury."
                  </p>
                  <div className="flex gap-5">
                     {[Globe, Shield, Award, Droplets].map((Icon, i) => (
                       <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-luxury-gold hover:text-white transition-all cursor-pointer border border-white/5">
                          <Icon className="w-4 h-4" />
                       </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-10">
                  <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-luxury-gold">Exploration</h4>
                  <nav className="flex flex-col gap-5">
                     {navItems.map(item => (
                       <Link key={item.label} to={item.path} className="text-sm font-bold text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                          {item.label} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                       </Link>
                     ))}
                  </nav>
               </div>

               <div className="space-y-10">
                  <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-luxury-gold">Contact Enclave</h4>
                   <div className="space-y-6 text-sm text-white/70 font-medium">
                      <p className="leading-relaxed">{settings?.address || "Rue Champs d'azur, Sétif 19000, Algeria"}</p>
                      <p>{settings?.contact_phone || "030 793 030 / 07 70 51 53 59"}</p>
                      <p className="text-luxury-gold">{settings?.contact_email || "hotelgoldenhillsreservation@gmail.com"}</p>
                   </div>
               </div>

               <div className="space-y-10">
                  <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-luxury-gold">The Gilded Letter</h4>
                  <div className="relative">
                     <input type="email" placeholder="Official Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold focus:border-luxury-gold outline-none" />
                     <button className="absolute right-2 top-2 bottom-2 px-4 bg-luxury-gold text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">Subscribe</button>
                  </div>
               </div>
            </div>
            <div className="pt-10 md:pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-white/20 uppercase tracking-[0.4em] text-center md:text-left">
               <p>© {new Date().getFullYear()} {settings?.hotel_name || "Golden Hills Hotel"}. Crafted with Absolute Excellence.</p>
               <div className="flex gap-6 md:gap-10">
                  <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
               </div>
            </div>
         </div>
      </footer>

      {/* Floating Portal FAB */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 z-[150] w-16 h-16 bg-luxury-gold text-white rounded-full flex items-center justify-center shadow-gold group"
        onClick={() => navigate('/login')}
      >
         <MousePointer2 className="w-7 h-7" />
         <div className="absolute right-20 bg-luxury-black text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Access Portal</div>
      </motion.button>
    </div>
  );
};

export default LandingPage;
