import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Phone, Mail, MapPin, 
  Instagram, Facebook, Twitter, ShieldCheck,
  Globe, MessageCircle
} from 'lucide-react';
import Logo from './Logo';
import Navbar from './Navbar';

const BrochureLayout = ({ children }) => {
  const navItems = [
    { label: 'Suites', path: '/suites' },
    { label: 'Dining', path: '/dining' },
    { label: 'Spa', path: '/spa' },
    { label: 'About', path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-luxury-cream/10 text-luxury-black font-sans selection:bg-luxury-gold selection:text-white">
      <Navbar />

      {/* Page Content */}
      <main className="relative z-10 pt-20">
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
                        <p className="text-sm text-white/40 leading-relaxed">Boulevard des Champs d'azur, <br/>Setif 19000, Algeria</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-luxury-gold shrink-0" />
                        <p className="text-sm text-white/40">+213 36 12 34 56</p>
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
