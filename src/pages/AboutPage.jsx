import { motion } from 'framer-motion';
import { Star, MapPin, Award, History } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-luxury-white-warm text-luxury-black">
      <nav className="p-6 flex justify-between items-center glass sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Logo textVisible={false} className="w-8 h-8" />
          <span className="font-serif font-bold text-xl tracking-tighter">GOLDEN HILLS</span>
        </Link>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500">
           <Link to="/suites" className="hover:text-luxury-gold transition-colors">Suites</Link>
           <Link to="/dining" className="hover:text-luxury-gold transition-colors">Dining</Link>
           <Link to="/spa" className="hover:text-luxury-gold transition-colors">Wellness</Link>
        </div>
      </nav>

      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[0.3] scale-110"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070")' }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center text-white px-6">
           <motion.h4 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-luxury-gold font-serif italic text-xl mb-4"
           >
             Since 1998
           </motion.h4>
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-5xl md:text-7xl font-serif font-bold tracking-tight"
           >
             A Legacy of <br /> Golden Hospitality
           </motion.h1>
        </div>
      </section>

      <div className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10">
              <div className="flex items-center gap-4 text-luxury-gold">
                 <History className="w-8 h-8" />
                 <h2 className="text-3xl font-serif font-bold italic">The Golden Story</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Golden Hills Hotel Setif was founded with a singular vision: to create a sanctuary where the rugged beauty of the Algerian hills meets the refined elegance of international luxury. For over two decades, we have been the preferred destination for royalty, diplomats, and discerning travelers seeking a true &quot;Golden&quot; experience.
              </p>
              <div className="grid grid-cols-2 gap-10 pt-10">
                 <div className="space-y-2">
                    <p className="text-4xl font-serif font-bold text-luxury-gold">25+</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Years of Excellence</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-4xl font-serif font-bold text-luxury-gold">5☆</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Premium Rating</p>
                 </div>
              </div>
           </div>
           
           <div className="relative">
              <GlassCard className="aspect-[4/5] p-0 overflow-hidden border-0 shadow-2xl relative z-10">
                 <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="History" />
              </GlassCard>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 gold-gradient rounded-full blur-3xl opacity-20 -z-0" />
           </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-10">
           {[
             { icon: <Award />, title: 'Setif Heritage Award', year: '2019' },
             { icon: <MapPin />, title: 'Hillside Sanctuary', year: 'Built 1998' },
             { icon: <Star />, title: 'Royal Gold Certification', year: 'Annually' }
           ].map((item, i) => (
             <GlassCard key={i} className="text-center bg-white border-gray-100 p-10 hover:border-luxury-gold/50 transition-colors">
                <div className="w-16 h-16 glass-gold rounded-full flex items-center justify-center mx-auto mb-6 text-luxury-gold">
                   {item.icon}
                </div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-xs font-bold text-luxury-gold uppercase tracking-widest">{item.year}</p>
             </GlassCard>
           ))}
        </div>
      </div>
      
      <footer className="py-20 bg-luxury-black text-white text-center">
         <p className="text-sm font-bold opacity-40 uppercase tracking-[0.4em]">Stay Golden</p>
      </footer>
    </div>
  );
};

export default AboutPage;
