import { motion } from 'framer-motion';
import { Bed, Users, ChevronRight, Star } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import GoldButton from '../components/GoldButton';

const SuitesPage = () => {
  const allSuites = [
    { id: 0, name: 'Royal Gold Suite', price: '$450', size: '120m²', type: 'Signature', img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070' },
    { id: 1, name: 'Heritage Deluxe', price: '$320', size: '85m²', type: 'Premium', img: 'https://images.unsplash.com/photo-1590490360182-c33d59735288?auto=format&fit=crop&q=80&w=1974' },
    { id: 2, name: 'Presidential Panorama', price: '$850', size: '250m²', type: 'Elite', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070' },
    { id: 3, name: 'Executive Hillside', price: '$280', size: '65m²', type: 'Business', img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=2070' },
    { id: 4, name: 'Sapphire Garden Room', price: '$190', size: '45m²', type: 'Standard', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=2070' },
    { id: 5, name: 'Imperial Family Wing', price: '$550', size: '180m²', type: 'Group', img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1974' },
  ];

  return (
    <div className="min-h-screen bg-luxury-white-warm text-luxury-black font-sans">
      <nav className="p-6 flex justify-between items-center glass sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Logo textVisible={false} className="w-8 h-8" />
          <span className="font-serif font-bold text-xl tracking-tighter">GOLDEN HILLS</span>
        </Link>
        <div className="flex gap-6">
           <GoldButton outline className="hidden md:block px-8 py-2 text-[10px]" onClick={() => window.location.href='/#contact'}>CHECK AVAILABILITY</GoldButton>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-20">
        <div className="text-left mb-16 max-w-3xl">
           <h4 className="text-luxury-gold font-serif italic text-xl mb-4">Accommodations</h4>
           <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-8">Refined Sanctuaries</h1>
           <p className="text-gray-500 text-lg">Every room at Golden Hills is a masterpiece of design, offering a unique blend of heritage craftsmanship and cutting-edge comfort.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
           {allSuites.map((suite, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="group"
             >
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-xl">
                   <img src={suite.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={suite.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                      <div className="flex justify-between items-end">
                         <div>
                            <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-widest">{suite.type} Selection</span>
                            <h3 className="text-2xl font-serif font-bold text-white">{suite.name}</h3>
                         </div>
                         <div className="text-right">
                            <p className="text-white text-xl font-bold">{suite.price}</p>
                            <p className="text-white/40 text-[10px] uppercase font-bold">per night</p>
                         </div>
                      </div>
                   </div>
                   <div className="absolute top-6 right-6 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star className="w-4 h-4 text-luxury-gold fill-current" />
                   </div>
                </div>
                
                <div className="px-2 space-y-6">
                   <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      <span className="flex items-center gap-2"><Bed className="w-4 h-4 text-luxury-gold" /> {suite.size}</span>
                      <span className="flex items-center gap-2"><Users className="w-4 h-4 text-luxury-gold" /> 2-4 Guests</span>
                   </div>
                   <p className="text-gray-500 text-sm italic font-medium">Equipped with the finest Saffron textiles and Carrara marble bathrooms.</p>
                   <Link 
                     to={`/room/${suite.id}`} 
                     className="inline-flex items-center gap-2 text-luxury-gold font-bold uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all"
                   >
                     EXPLORE SUITE <ChevronRight className="w-4 h-4" />
                   </Link>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      <section className="bg-white py-32">
         <div className="container mx-auto px-6 text-center">
            <GlassCard className="max-w-4xl mx-auto p-16 border-luxury-gold/20 shadow-none bg-luxury-white-cream/30">
               <h2 className="text-4xl font-serif font-bold mb-6 italic">Group Bookings</h2>
               <p className="text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed font-medium text-lg">Planning a delegation or a large family retreat? We offer exclusive wings and interconnecting suites for the ultimate shared luxury experience.</p>
               <GoldButton className="px-12">INQUIRE FOR GROUPS</GoldButton>
            </GlassCard>
         </div>
      </section>
    </div>
  );
};

export default SuitesPage;
