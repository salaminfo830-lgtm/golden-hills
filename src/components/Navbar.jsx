import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User } from 'lucide-react';
import Logo from './Logo';
import GoldButton from './GoldButton';

const Navbar = ({ transparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Determine if we should use the transparent style
  // On landing page, it starts transparent if not scrolled.
  // On other pages, we might want it always solid or glass.
  const isTransparentActive = transparent && !isScrolled;

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-8 lg:px-12 py-6 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-2xl border-b border-luxury-gold/10 py-4 shadow-sm' 
          : transparent ? 'bg-transparent py-10' : 'bg-white/90 backdrop-blur-xl py-6 border-b border-luxury-gold/5'
      }`}>
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <Link to="/" className="group flex items-center gap-4">
             <Logo 
               textVisible={false} 
               inverse={isTransparentActive} 
               className={`transition-transform duration-700 ${isScrolled ? 'scale-90' : 'scale-110'}`} 
             />
             <div className="overflow-hidden">
                <span className={`block font-serif font-bold text-2xl tracking-tighter transition-all duration-700 ${
                  isTransparentActive ? 'text-white' : 'text-luxury-black'
                } group-hover:tracking-[0.1em]`}>
                   GOLDEN HILLS
                </span>
                <span className={`block text-[8px] font-bold uppercase tracking-[0.4em] transition-all duration-700 ${
                  isTransparentActive ? 'text-white/60 translate-y-2 opacity-0' : 'text-gray-400 opacity-100 translate-y-0'
                } ${isScrolled ? 'opacity-100 translate-y-0' : ''}`}>
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
                className={`text-[13px] font-bold uppercase tracking-[0.2em] transition-all relative group ${
                  location.pathname === item.path 
                    ? 'text-luxury-gold' 
                    : isTransparentActive ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-luxury-black'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-2 left-0 h-px bg-luxury-gold transition-all duration-500 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
            <div className={`h-6 w-px mx-4 ${isTransparentActive ? 'bg-white/20' : 'bg-gray-100'}`} />
            <div className="flex gap-4">
               <Link 
                 to="/login" 
                 className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors py-3 px-4 flex items-center gap-2 ${
                   isTransparentActive ? 'text-white/40 hover:text-luxury-gold' : 'text-gray-400 hover:text-luxury-gold'
                 }`}
               >
                 <User className="w-3 h-3" />
                 Portal
               </Link>
               <GoldButton 
                 className="px-8 py-3 text-[11px] shadow-gold" 
                 onClick={() => navigate('/search')}
               >
                 BOOK SANCTUARY
               </GoldButton>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden p-3 rounded-2xl border transition-all ${
              isTransparentActive 
                ? 'bg-white/10 backdrop-blur-md border-white/10 text-white' 
                : 'bg-white/50 backdrop-blur-md border-gray-100 text-luxury-black'
            }`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
             <Menu className="w-5 h-5" />
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
                <div className="flex justify-between items-center text-white/40">
                   <div className="flex gap-4 items-center">
                      <Globe className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Global • EN</span>
                   </div>
                   <GoldButton className="px-10 py-5 text-xs" onClick={() => { setIsMobileMenuOpen(false); navigate('/search'); }}>RESERVE NOW</GoldButton>
                </div>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Golden Hills Hotel & Spa • Setif, Algeria</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
