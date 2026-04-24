import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User } from 'lucide-react';
import Logo from './Logo';
import GoldButton from './GoldButton';
import { useSettings } from '../context/SettingsContext';

const Navbar = ({ transparent = false }) => {
  const { settings } = useSettings();
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
    { label: 'Contact', path: '/contact' },
  ];

  // Determine if we should use the transparent style
  const isTransparentActive = transparent && !isScrolled;

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-6 md:px-12 py-4 md:py-6 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-2xl border-b border-luxury-gold/5 py-3 md:py-4 shadow-sm' 
          : transparent ? 'bg-transparent py-6 md:py-8' : 'bg-white/95 backdrop-blur-xl py-4 md:py-6'
      }`}>
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          {/* Minimal Home Link */}
          <div className="flex-1 lg:flex-none">
             <Link to="/" className={`text-[12px] font-semibold uppercase tracking-[0.4em] transition-all ${
               isTransparentActive ? 'text-white/80 hover:text-white' : 'text-luxury-black hover:text-luxury-gold'
             }`}>
                Home
             </Link>
          </div>

          {/* Desktop Nav - Centered or Elegant Spacing */}
          <div className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.path}
                className={`text-[11px] font-semibold uppercase tracking-[0.3em] transition-all relative group ${
                  location.pathname === item.path 
                    ? 'text-luxury-gold' 
                    : isTransparentActive ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-luxury-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
               <Link 
                 to="/login" 
                 className={`text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors py-2 px-3 flex items-center gap-2 ${
                   isTransparentActive ? 'text-white/50 hover:text-luxury-gold' : 'text-gray-400 hover:text-luxury-gold'
                 }`}
               >
                 <User className="w-3 h-3" />
                 Portal
               </Link>
               <GoldButton 
                 className="px-6 py-2 shadow-sm" 
                 onClick={() => navigate('/search')}
               >
                 RESERVE
               </GoldButton>
            </div>

            {/* Mobile Toggle */}
            <button 
              className={`lg:hidden p-3 rounded-xl transition-all ${
                isTransparentActive 
                  ? 'bg-white/10 backdrop-blur-md border border-white/10 text-white' 
                  : 'bg-luxury-cream border border-gray-100 text-luxury-black'
              }`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
               <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-luxury-black p-12 flex flex-col justify-between"
          >
             <div className="flex justify-end">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-4 bg-white/5 rounded-full text-white hover:bg-white/10 transition-all"
                >
                   <X className="w-6 h-6" />
                </button>
             </div>

             <nav className="space-y-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                   <Link 
                     to="/" 
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="text-2xl font-serif font-medium text-white/40 hover:text-luxury-gold transition-all"
                   >
                      Home
                   </Link>
                </motion.div>
                {navItems.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i + 1) * 0.1 }}
                    key={item.label}
                  >
                     <Link 
                       to={item.path} 
                       onClick={() => setIsMobileMenuOpen(false)}
                       className="text-4xl md:text-5xl font-serif font-medium text-white/40 hover:text-luxury-gold transition-all"
                     >
                        {item.label}
                     </Link>
                  </motion.div>
                ))}
             </nav>

             <div className="space-y-8 pt-10 border-t border-white/5 text-center">
                <div className="flex flex-col items-center gap-6 text-white/40">
                   <GoldButton className="px-10 py-4 text-[11px]" onClick={() => { setIsMobileMenuOpen(false); navigate('/search'); }}>RESERVE NOW</GoldButton>
                   <div className="flex gap-4 items-center opacity-50">
                      <Globe className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Global • EN</span>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
