import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronRight, Phone, Mail, MapPin, 
  Instagram, Facebook, Twitter, ShieldCheck,
  Menu, X, Globe, MessageCircle
} from 'lucide-react';
import Logo from './Logo';
import GoldButton from './GoldButton';

const BrochureLayout = ({ children, title, subtitle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Suites', path: '/suites' },
    { label: 'Dining', path: '/dining' },
    { label: 'Spa', path: '/spa' },
    { label: 'About', path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-luxury-cream/10 text-luxury-black font-sans selection:bg-luxury-gold selection:text-white">
      {/* Luxury Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-8 lg:px-12 py-6 ${
        isScrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-luxury-gold/10 py-4 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <Link to="/" className="group flex items-center gap-4">
             <Logo textVisible={false} className={`transition-transform duration-700 ${isScrolled ? 'scale-90' : 'scale-110'}`} />
             <div className="overflow-hidden">
                <span className={`block font-serif font-bold text-2xl tracking-tighter transition-all duration-700 ${isScrolled ? 'text-luxury-black' : 'text-luxury-black'} group-hover:tracking-[0.1em]`}>
                   GOLDEN HILLS
                </span>
                <span className={`block text-[8px] font-bold uppercase tracking-[0.4em] transition-all duration-700 ${isScrolled ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
                   Setif • Algeria
                </span>
             </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.path}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative group ${
                  location.pathname === item.path ? 'text-luxury-gold' : 'text-gray-400 hover:text-luxury-black'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-2 left-0 h-px bg-luxury-gold transition-all duration-500 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
            <div className="h-6 w-px bg-gray-100 mx-4" />
            <div className="flex gap-4">
               <Link to="/login" className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-luxury-gold transition-colors py-3 px-4">Portal</Link>
               <GoldButton className="px-8 py-3 text-[10px] shadow-gold" onClick={() => window.location.href='/search'}>BOOK SANCTUARY</GoldButton>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-gray-100"
            onClick={() => setIsMobileMenuOpen(true)}
          >
             <Menu className="w-5 h-5 text-luxury-black" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-luxury-black p-10 flex flex-col justify-between"
          >
             <div className="flex justify-between items-center">
                <Logo inverse />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-4 bg-white/10 rounded-full text-white"
                >
                   <X className="w-6 h-6" />
                </button>
             </div>

             <nav className="space-y-10">
                {navItems.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={item.label}
                  >
                     <Link 
                       to={item.path} 
                       onClick={() => setIsMobileMenuOpen(false)}
                       className="text-6xl font-serif font-bold text-white/40 hover:text-luxury-gold hover:italic transition-all inline-block"
                     >
                        {item.label}
                     </Link>
                  </motion.div>
                ))}
             </nav>

             <div className="space-y-8 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center">
                   <div className="flex gap-6">
                      <Instagram className="w-6 h-6 text-white/40" />
                      <Facebook className="w-6 h-6 text-white/40" />
                      <Twitter className="w-6 h-6 text-white/40" />
                   </div>
                   <GoldButton className="px-10 py-5 text-xs" onClick={() => window.location.href='/search'}>BOOK NOW</GoldButton>
                </div>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Golden Hills Hotel & Spa • Setif, Algeria</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Immersive Footer */}
      <footer className="bg-luxury-black pt-32 pb-16 text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-px bg-white/5" />
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
         
         <div className="container mx-auto px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
               <div className="space-y-8">
                  <Logo inverse className="scale-125 origin-left" />
                  <p className="text-white/40 text-sm leading-relaxed max-w-xs italic">
                     "Elevating the hospitality standards of Setif through a perfect blend of heritage and modern luxury."
                  </p>
                  <div className="flex gap-5">
                     {[Instagram, Facebook, Twitter].map((Icon, i) => (
                       <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-luxury-gold hover:text-white transition-all cursor-pointer border border-white/5">
                          <Icon className="w-4 h-4" />
                       </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold">Exploration</h4>
                  <nav className="flex flex-col gap-4">
                     {navItems.map(item => (
                       <Link key={item.label} to={item.path} className="text-sm font-bold text-white/40 hover:text-white transition-colors flex items-center gap-2 group">
                          {item.label} <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                       </Link>
                     ))}
                  </nav>
               </div>

               <div className="space-y-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold">Sanctuary Info</h4>
                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-luxury-gold shrink-0" />
                        <p className="text-sm text-white/40 leading-relaxed">Cité des 1000 Logements, <br/>Setif 19000, Algeria</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-luxury-gold shrink-0" />
                        <p className="text-sm text-white/40">+213 36 00 00 00</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-luxury-gold shrink-0" />
                        <p className="text-sm text-white/40">reserve@goldenhills.dz</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold">Gilded Newsletter</h4>
                  <p className="text-sm text-white/40">Join our inner circle for exclusive offers and seasonal events.</p>
                  <div className="relative group">
                     <input type="email" placeholder="Your official email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold focus:border-luxury-gold outline-none transition-all" />
                     <button className="absolute right-2 top-2 bottom-2 px-4 bg-luxury-gold text-white rounded-xl text-[8px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-gold">Subscribe</button>
                  </div>
                  <div className="flex items-center gap-2 text-white/20">
                     <ShieldCheck className="w-4 h-4" />
                     <span className="text-[8px] font-bold uppercase tracking-widest">Privacy Protection Guaranteed</span>
                  </div>
               </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">© 2026 Golden Hills Hotel & Spa. All Rights Reserved.</p>
               <div className="flex gap-10">
                  {['Privacy', 'Terms', 'Security', 'FAQ'].map(item => (
                    <Link key={item} to={`/${item.toLowerCase()}`} className="text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-luxury-gold transition-colors">{item}</Link>
                  ))}
               </div>
               <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <Globe className="w-3 h-3 text-luxury-gold" />
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Global English</span>
               </div>
            </div>
         </div>
      </footer>

      {/* Floating Concierge FAB */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-luxury-gold text-white rounded-full flex items-center justify-center shadow-gold transition-all group overflow-hidden"
      >
         <MessageCircle className="w-7 h-7 relative z-10" />
         <div className="absolute inset-0 bg-luxury-black opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    </div>
  );
};

export default BrochureLayout;
