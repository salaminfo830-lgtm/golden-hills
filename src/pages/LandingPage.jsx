import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, MapPin, Star, Coffee, 
  Wind, Ship, UtensilsCrossed, Waves, 
  Menu, X, ChevronRight, PlayCircle
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';

import Logo from '../components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('Room')
        .select('*')
        .order('price', { ascending: true });
      
      if (!error && data) {
        // Filter to show one room of each type for the landing page
        const uniqueTypes = [];
        const displayRooms = data.filter(room => {
          if (!uniqueTypes.includes(room.type)) {
            uniqueTypes.push(room.type);
            return true;
          }
          return false;
        });
        setRooms(displayRooms);
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(price);
  };

  return (
    <div className="min-h-screen bg-luxury-white-warm overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'bg-white/90 backdrop-blur-xl py-3 shadow-2xl border-b border-luxury-gold/10' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <Logo inverse={!isScrolled} className={`transition-all duration-500 transform ${isScrolled ? 'scale-90' : 'scale-110'}`} />
          </Link>
          
          <div className="hidden lg:flex items-center gap-10 font-bold tracking-widest text-[10px] uppercase">
            <a href="#about" className={`${isScrolled ? 'text-luxury-black' : 'text-white'} hover:text-luxury-gold transition-colors`}>About</a>
            <a href="#suites" className={`${isScrolled ? 'text-luxury-black' : 'text-white'} hover:text-luxury-gold transition-colors`}>Suites</a>
            <a href="#services" className={`${isScrolled ? 'text-luxury-black' : 'text-white'} hover:text-luxury-gold transition-colors`}>Services</a>
            <a href="#contact" className={`${isScrolled ? 'text-luxury-black' : 'text-white'} hover:text-luxury-gold transition-colors`}>Contact</a>
            <GoldButton className="px-8 py-2 text-[10px]" onClick={() => navigate('/admin')}>MANAGEMENT</GoldButton>
          </div>

          <button className="lg:hidden p-2 rounded-xl glass" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className={isScrolled ? 'text-black' : 'text-white'} /> : <Menu className={isScrolled ? 'text-black' : 'text-white'} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-80 bg-luxury-black border-l border-white/10 z-50 p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <img src="/logo.jpg" alt="Golden Hills" className="w-16 h-16 brightness-0 invert" />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 glass rounded-full"><X className="text-white" /></button>
              </div>
              <div className="space-y-8 flex flex-col text-2xl font-serif">
                <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Our Story</a>
                <a href="#suites" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Luxury Suites</a>
                <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Experience</a>
                <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Get in Touch</a>
                <GoldButton className="mt-8" onClick={() => navigate('/admin')}>Admin Login</GoldButton>
              </div>
              <div className="mt-auto border-t border-white/10 pt-8 opacity-40 text-sm text-white text-center">
                © 2026 Golden Hills Hotel
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070")' }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center max-w-4xl mx-auto pt-32 md:pt-40"
          >
            <h4 className="text-luxury-gold font-elegant italic text-sm md:text-lg mb-4 tracking-[0.4em] uppercase">Setif&apos;s Gilded Sanctuary</h4>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-elegant font-bold mb-6 md:mb-8 leading-tight tracking-tight">
              A Symphony of <br className="hidden md:block" /> Luxury & Light
            </h1>
            <p className="text-sm md:text-lg text-white/70 max-w-xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed px-4 md:px-0">
              Experience the pinnacle of Algerian hospitality at Golden Hills Hotel, where every moment is a masterpiece of gold and light.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <GoldButton className="w-full sm:w-auto text-xs md:text-sm px-10 md:px-14 py-4 md:py-5 shadow-2xl">RESERVE YOUR MOMENT</GoldButton>
              <button className="flex items-center gap-4 text-xs md:text-sm font-bold tracking-widest uppercase hover:text-luxury-gold transition-colors group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-6 h-6" />
                </div>
                THE EXPERIENCE
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Booking Widget */}
        <div className="hidden lg:block absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 z-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="bg-white/95 backdrop-blur-3xl p-8 rounded-[3rem] flex flex-row items-center gap-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-luxury-gold/10"
          >
            <div className="flex-1 space-y-2 border-r border-gray-100 pr-8">
              <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gold flex items-center gap-2 mb-1">Check-in <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" /></label>
              <div className="flex items-center gap-4">
                <Calendar className="text-luxury-gold w-6 h-6 opacity-80" />
                <div className="flex flex-col">
                   <span className="font-bold text-luxury-black text-lg">12 Oct</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase">Wednesday</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2 border-r border-gray-100 pr-8">
              <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gold flex items-center gap-2 mb-1">Check-out <div className="w-1.5 h-1.5 rounded-full bg-orange-400" /></label>
              <div className="flex items-center gap-4">
                <Calendar className="text-luxury-gold w-6 h-6 opacity-80" />
                <div className="flex flex-col">
                   <span className="font-bold text-luxury-black text-lg">18 Oct</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase">Tuesday</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gold flex items-center gap-2 mb-1">Guests <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /></label>
              <div className="flex items-center gap-4">
                <Users className="text-luxury-gold w-6 h-6 opacity-80" />
                <div className="flex flex-col">
                   <span className="font-bold text-luxury-black text-lg">2 Adults</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase">Superior Suite</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <GoldButton 
                className="px-14 py-5 shadow-2xl hover:scale-105 transition-transform"
                onClick={() => navigate('/search?checkIn=12+Oct&checkOut=18+Oct&guests=2')}
              >
                CHECK AVAILABILITY
              </GoldButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="pt-24 md:pt-48 pb-20 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
          >
            <h4 className="text-luxury-gold font-serif italic text-lg mb-3 tracking-wide">Centuries of Excellence</h4>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight text-luxury-black">A Gilded Landmark <br className="hidden md:block" /> Since 1998</h2>
            <p className="text-gray-500 leading-relaxed text-base md:text-lg mb-10 font-medium">
              Golden Hills Hotel is more than just a destination; it is a testament to the enduring beauty of Algerian heritage blended with modern sophistication. Situated in the cultural heart of Setif, we offer a sanctuary of peace, prestige, and unparalleled service.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full glass-gold flex items-center justify-center flex-shrink-0">
                  <Star className="text-luxury-gold" />
                </div>
                <div>
                  <h5 className="font-bold mb-1">5-Star Quality</h5>
                  <p className="text-sm text-gray-500">Unmatched service</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full glass-gold flex items-center justify-center flex-shrink-0">
                  <Waves className="text-luxury-gold" />
                </div>
                <div>
                  <h5 className="font-bold mb-1">Heated Infinity Pool</h5>
                  <p className="text-sm text-gray-500">Relax with a view</p>
                </div>
              </div>
            </div>
            <GoldButton outline>READ MORE</GoldButton>
          </motion.div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" className="object-cover w-full h-full" alt="Hotel Interior" />
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 glass-gold rounded-full -z-0 blur-3xl opacity-50" />
            <GlassCard className="absolute -bottom-10 -left-10 p-4 max-w-[200px] z-20 hidden md:block">
              <p className="text-3xl font-serif font-bold text-luxury-gold">150+</p>
              <p className="text-sm font-medium text-gray-600">Luxury Rooms & Suites</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Suites Section */}
      <section id="suites" className="py-20 bg-luxury-white-cream/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h4 className="text-luxury-gold font-serif italic text-lg mb-2">Accommodations</h4>
            <h2 className="text-5xl font-serif font-bold mb-8">Exquisite Living Spaces</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our suites are designed to provide a sanctuary of calm, with gold-leaf accents and the finest Algerian marble.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] rounded-[2rem] bg-gray-100 animate-pulse" />
              ))
            ) : rooms.map((room, i) => (
               <motion.div 
                 key={room.id}
                 whileHover={{ y: -10 }}
                 className="group cursor-pointer"
                 onClick={() => navigate(`/room/${room.id}`)}
               >
                 <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-xl border border-white/10 group-hover:shadow-2xl transition-all duration-700">
                   <img src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[1.5s]" alt={room.type} />
                   <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end text-white">
                      <p className="text-luxury-gold font-bold text-xs mb-1 uppercase tracking-widest">Starting from {formatPrice(room.price)}</p>
                      <h3 className="text-3xl font-elegant font-bold">{room.type}</h3>
                   </div>
                 </div>
                 <div className="flex justify-between items-center px-2">
                   <div className="flex gap-4 text-gray-500 text-sm">
                     <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 2 Guests</span>
                     <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> AC</span>
                   </div>
                   <Link to={`/room/${room.id}`} className="text-luxury-gold font-bold flex items-center gap-1 hover:gap-2 transition-all">
                     View Details <ChevronRight className="w-4 h-4" />
                   </Link>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="text-left">
              <h4 className="text-luxury-gold font-serif italic text-lg mb-2">Experience</h4>
              <h2 className="text-5xl font-serif font-bold">World-Class Services</h2>
            </div>
            <p className="text-gray-600 max-w-md">
              From the aroma of fresh coffee to the serenity of our spa, we curate every moment of your stay.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
             {[
               { icon: <UtensilsCrossed />, title: 'Grand Dining', desc: 'Fine Algerian & French cuisine' },
               { icon: <Waves />, title: 'Royal Spa', desc: 'Ancient hammam rituals' },
               { icon: <Coffee />, title: 'Gold Lounge', desc: 'Premium coffee & pastries' },
               { icon: <Ship />, title: 'Excursions', desc: 'Desert & Mountain tours' }
             ].map((service, i) => (
               <GlassCard key={i} className="hover:border-luxury-gold transition-colors duration-500" variant="gold">
                 <div className="w-12 h-12 glass-gold rounded-xl flex items-center justify-center mb-6 text-luxury-gold">
                   {service.icon}
                 </div>
                 <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                 <p className="text-gray-500">{service.desc}</p>
               </GlassCard>
             ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-24 font-sans">
            <div className="col-span-2">
              <div className="mb-12">
                <Logo inverse />
              </div>
              <p className="text-white/40 max-w-sm mb-12 leading-relaxed font-normal text-sm">
                The premier luxury destination in Setif, offering a perfect blend of modern comfort and traditional Algerian hospitality. Crafted for the discerning traveler.
              </p>
              <div className="flex gap-6">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full glass border border-white/5 flex items-center justify-center hover:bg-luxury-gold/20 hover:border-luxury-gold transition-all cursor-pointer text-white/40 hover:text-white">
                      {/* Social Icons Placeholder */}
                   </div>
                 ))}
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-8 text-luxury-gold text-xs uppercase tracking-widest">Quick Links</h5>
              <ul className="space-y-4 text-white/40 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer"><Link to="/about">About Us</Link></li>
                <li className="hover:text-white transition-colors cursor-pointer"><Link to="/suites">Our Rooms</Link></li>
                <li className="hover:text-white transition-colors cursor-pointer"><Link to="/spa">Spa & Wellness</Link></li>
                <li className="hover:text-white transition-colors cursor-pointer"><Link to="/dining">Dining</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-8 text-luxury-gold text-xs uppercase tracking-widest">Contact Us</h5>
              <ul className="space-y-6 text-white/40 text-sm">
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-luxury-gold shrink-0 mt-1" />
                  <span>Blvd des Orangers, Setif, Algeria</span>
                </li>
                <li className="flex items-center gap-4">+213 36 00 00 00</li>
                <li className="flex items-center gap-4">contact@goldenhills.dz</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-[10px] uppercase font-bold tracking-widest">
            <p>© 2026 Golden Hills Hotel Setif. Crafted with Excellence.</p>
            <div className="flex gap-12">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] pointer-events-none">
        <motion.div
           initial={{ y: 100 }}
           animate={{ y: 0 }}
           className="pointer-events-auto"
        >
           <GoldButton className="w-full py-4 text-sm shadow-[0_20px_50px_rgba(212,175,55,0.3)]" onClick={() => window.location.href='#contact'}>
             BOOK YOUR STAY
           </GoldButton>
        </motion.div>
      </div>

    </div>
  );
};

export default LandingPage;
