import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Calendar, Users, MapPin, Star, Coffee, 
  Wind, Ship, UtensilsCrossed, Waves, 
  Menu, X, ChevronRight, PlayCircle
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';

import Logo from '../components/Logo';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-luxury-white-warm overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-4 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/">
            <Logo inverse={!isScrolled && !isMenuOpen} />
          </Link>
          
          <div className="hidden lg:flex items-center gap-10 font-bold tracking-widest text-xs uppercase">
            <a href="#about" className={`${isScrolled ? 'text-luxury-black' : 'text-white'} hover:text-luxury-gold transition-colors`}>About</a>
            <a href="#suites" className={`${isScrolled ? 'text-luxury-black' : 'text-white'} hover:text-luxury-gold transition-colors`}>Suites</a>
            <a href="#services" className={`${isScrolled ? 'text-luxury-black' : 'text-white'} hover:text-luxury-gold transition-colors`}>Services</a>
            <a href="#contact" className={`${isScrolled ? 'text-luxury-black' : 'text-white'} hover:text-luxury-gold transition-colors`}>Contact</a>
            <GoldButton className="px-8 py-2 text-xs" onClick={() => navigate('/admin')}>MANAGEMENT</GoldButton>
          </div>

          <button className="lg:hidden p-2 rounded-lg glass" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                <Logo inverse />
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
          >
            <h4 className="text-luxury-gold font-serif italic text-sm md:text-xl mb-4 tracking-[0.4em] uppercase">Setif's Gilded Sanctuary</h4>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold mb-8 leading-[1.1] tracking-tight">
              A Symphony of <br className="hidden md:block" /> Luxury & Light
            </h1>
            <p className="text-sm md:text-xl text-white/70 max-w-xl md:max-w-2xl mx-auto mb-10 md:mb-14 font-medium leading-relaxed px-4 md:px-0">
              Experience the pinnacle of Algerian hospitality at Golden Hills Hotel, where every moment is a masterpiece of gold and light.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <GoldButton className="w-full sm:w-auto text-sm md:text-lg px-8 md:px-12 py-4 md:py-5 shadow-2xl">RESERVE YOUR MOMENT</GoldButton>
              <button className="flex items-center gap-3 text-sm md:text-lg font-bold tracking-widest uppercase hover:text-luxury-gold transition-colors group">
                <PlayCircle className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" /> THE EXPERIENCE
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Booking Widget */}
        <div className="hidden md:block absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6">
          <GlassCard className="flex flex-row gap-8 p-10 shadow-2xl border-white/40 ring-1 ring-white/10">
            <div className="flex-1 space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gold flex items-center gap-2">Check-in <div className="w-1 h-1 rounded-full bg-luxury-gold" /></label>
              <div className="flex items-center gap-4 border-b border-luxury-gold/20 pb-3">
                <Calendar className="text-luxury-gold w-5 h-5 opacity-60" />
                <span className="font-bold text-luxury-black">12 Oct 2026</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gold flex items-center gap-2">Check-out <div className="w-1 h-1 rounded-full bg-orange-400" /></label>
              <div className="flex items-center gap-4 border-b border-luxury-gold/20 pb-3">
                <Calendar className="text-luxury-gold w-5 h-5 opacity-60" />
                <span className="font-bold text-luxury-black">18 Oct 2026</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gold flex items-center gap-2">Guests <div className="w-1 h-1 rounded-full bg-blue-400" /></label>
              <div className="flex items-center gap-4 border-b border-luxury-gold/20 pb-3">
                <Users className="text-luxury-gold w-5 h-5 opacity-60" />
                <span className="font-bold text-luxury-black">2 Adults, 0 Children</span>
              </div>
            </div>
            <div className="flex items-center pt-5">
              <GoldButton className="px-12 py-4 shadow-gold">PROCEED</GoldButton>
            </div>
          </GlassCard>
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

          <div className="grid md:grid-cols-3 gap-10">
             {[
               { id: 0, name: 'Royal Gold Suite', price: '$450', img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070' },
               { id: 1, name: 'Heritage Deluxe', price: '$320', img: 'https://images.unsplash.com/photo-1590490360182-c33d59735288?auto=format&fit=crop&q=80&w=1974' },
               { id: 2, name: 'Presidential Panorama', price: '$850', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070' }
             ].map((suite, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ y: -10 }}
                 className="group cursor-pointer"
                 onClick={() => navigate(`/room/${suite.id}`)}
               >
                 <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
                   <img src={suite.img} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" alt={suite.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                      <p className="text-luxury-gold font-bold mb-1">Starting from {suite.price}</p>
                      <h3 className="text-2xl font-serif font-bold">{suite.name}</h3>
                   </div>
                 </div>
                 <div className="flex justify-between items-center px-2">
                   <div className="flex gap-4 text-gray-500 text-sm">
                     <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 2 Guests</span>
                     <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> AC</span>
                   </div>
                   <Link to={`/room/${suite.id}`} className="text-luxury-gold font-bold flex items-center gap-1 hover:gap-2 transition-all">
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
      <footer className="bg-luxury-black text-white pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="mb-8">
                <Logo inverse />
              </div>
              <p className="text-white/60 max-w-sm mb-8 leading-relaxed font-medium">
                The premier luxury destination in Setif, offering a perfect blend of modern comfort and traditional Algerian hospitality. Crafted for the discerning traveler.
              </p>
              <div className="flex gap-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-luxury-gold transition-colors cursor-pointer text-white">
                      {/* Social Icons Placeholder */}
                   </div>
                 ))}
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-luxury-gold text-lg">Quick Links</h5>
              <ul className="space-y-4 text-white/50">
                <li className="hover:text-white transition-colors cursor-pointer"><Link to="/about">About Us</Link></li>
                <li className="hover:text-white transition-colors cursor-pointer"><Link to="/suites">Our Rooms</Link></li>
                <li className="hover:text-white transition-colors cursor-pointer"><Link to="/spa">Spa & Wellness</Link></li>
                <li className="hover:text-white transition-colors cursor-pointer"><Link to="/dining">Dining</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-luxury-gold text-lg">Contact Us</h5>
              <ul className="space-y-4 text-white/50">
                <li className="flex items-center gap-3"><MapPin className="w-5 h-5 text-luxury-gold" /> Blvd des Orangers, Setif, Algeria</li>
                <li className="flex items-center gap-3">+213 36 00 00 00</li>
                <li className="flex items-center gap-3">contact@goldenhills.dz</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-sm">
            <p>© 2026 Golden Hills Hotel Setif. All rights reserved.</p>
            <div className="flex gap-10">
              <Link to="/privacy" className="hover:text-white cursor-pointer">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white cursor-pointer">Terms of Service</Link>
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
