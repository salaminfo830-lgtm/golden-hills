import { motion } from 'framer-motion';
import { Bed, Users, ChevronRight, Star, Maximize2, Wind, ShieldCheck, Map } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';
import BrochureLayout from '../components/BrochureLayout';
import GoldButton from '../components/GoldButton';

const SuitesPage = () => {
  const allSuites = [
    { 
      id: 0, 
      name: 'The Royal Gold Suite', 
      price: '$450', 
      size: '120m²', 
      type: 'Signature', 
      desc: 'Our crown jewel, featuring panoramic views of the Setif hills and bespoke saffron silk furnishings.',
      img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070',
      features: ['Private Terrace', 'Jacuzzi', 'Butler Service']
    },
    { 
      id: 1, 
      name: 'Heritage Deluxe', 
      price: '$320', 
      size: '85m²', 
      type: 'Premium', 
      desc: 'A fusion of traditional Algerian craftsmanship and contemporary minimalist design.',
      img: 'https://images.unsplash.com/photo-1590490360182-c33d59735288?auto=format&fit=crop&q=80&w=1974',
      features: ['Hill View', 'Rain Shower', 'Local Art']
    },
    { 
      id: 2, 
      name: 'Presidential Panorama', 
      price: '$850', 
      size: '250m²', 
      type: 'Elite', 
      desc: 'The ultimate sanctuary for world leaders and luxury connoisseurs. Spanning a private wing.',
      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070',
      features: ['Library', 'Dining Room', 'Private Spa']
    },
    { 
      id: 3, 
      name: 'Executive Hillside', 
      price: '$280', 
      size: '65m²', 
      type: 'Business', 
      desc: 'Precision and comfort for the modern executive. Integrated technology meet timeless elegance.',
      img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=2070',
      features: ['Office Nook', 'Fiber WiFi', 'Coffee Bar']
    },
    { 
      id: 4, 
      name: 'Sapphire Garden Room', 
      price: '$190', 
      size: '45m²', 
      type: 'Standard', 
      desc: 'A serene retreat overlooking our manicured sapphire gardens and infinity pool.',
      img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=2070',
      features: ['Garden Access', 'Mini Bar', 'King Bed']
    },
    { 
      id: 5, 
      name: 'Imperial Family Wing', 
      price: '$550', 
      size: '180m²', 
      type: 'Group', 
      desc: 'Connecting suites designed for families who refuse to compromise on privacy or luxury.',
      img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1974',
      features: ['Kitchenette', '3 Bedrooms', 'Play Area']
    },
  ];

  return (
    <BrochureLayout>
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-end justify-center overflow-hidden bg-luxury-black">
         <motion.div 
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.6 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070")' }}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-luxury-cream/10 via-transparent to-transparent" />
         <div className="container mx-auto px-12 pb-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
               <h4 className="text-luxury-gold font-serif italic text-2xl mb-4">Accommodations</h4>
               <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tighter leading-none">The Sanctuaries</h1>
            </motion.div>
         </div>
      </section>

      {/* Intro Context */}
      <section className="py-32 container mx-auto px-12">
         <div className="max-w-4xl">
            <p className="text-2xl md:text-4xl font-serif text-luxury-black leading-tight">
               Every residence at Golden Hills is a <span className="italic text-luxury-gold">masterpiece of architectural soul</span>, blending the rugged beauty of Algeria with the delicate touch of high-craft luxury.
            </p>
         </div>
      </section>

      {/* Grid of Suites */}
      <section className="pb-40 container mx-auto px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-40">
           {allSuites.map((suite, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 1, delay: i % 2 * 0.2 }}
               className="group flex flex-col"
             >
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group-hover:shadow-[0_80px_120px_-20px_rgba(0,0,0,0.25)] transition-all duration-700">
                   <img src={suite.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt={suite.name} />
                   <div className="absolute top-10 right-10 flex flex-col gap-3">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 flex flex-col items-center justify-center text-white">
                         <span className="text-[10px] font-bold">{suite.price.split('$')[1]}</span>
                         <span className="text-[6px] font-bold uppercase tracking-widest opacity-60">USD</span>
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="absolute bottom-12 left-12 right-12 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <GoldButton className="w-full py-5 shadow-gold">BOOK THIS SUITE</GoldButton>
                   </div>
                </div>
                
                <div className="space-y-8">
                   <div className="flex justify-between items-start">
                      <div>
                         <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-2 block">{suite.type} Selection</span>
                         <h3 className="text-4xl font-serif font-bold text-luxury-black group-hover:italic transition-all duration-500">{suite.name}</h3>
                      </div>
                      <Star className="w-5 h-5 text-luxury-gold fill-current" />
                   </div>
                   
                   <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
                      {suite.desc}
                   </p>

                   <div className="flex flex-wrap gap-8 pt-4">
                      <div className="flex items-center gap-3">
                         <Maximize2 className="w-4 h-4 text-luxury-gold" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{suite.size}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Wind className="w-4 h-4 text-luxury-gold" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pure Air System</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Privacy</span>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex gap-4">
                         {suite.features.map(f => (
                           <span key={f} className="text-[9px] font-bold uppercase tracking-tighter bg-gray-50 px-3 py-1 rounded-full text-gray-400">{f}</span>
                         ))}
                      </div>
                      <Link 
                        to={`/room/${suite.id}`} 
                        className="flex items-center gap-2 text-luxury-black font-bold uppercase tracking-[0.3em] text-[9px] hover:text-luxury-gold transition-colors group/link"
                      >
                         Discovery Profile <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Signature Guest Experience */}
      <section className="bg-luxury-black py-40 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-luxury-gold opacity-[0.03] rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3" />
         <div className="container mx-auto px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
               <div className="space-y-10">
                  <h4 className="text-luxury-gold font-serif italic text-2xl">The Golden Standard</h4>
                  <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight">Crafted for the <br/>Discerning Traveler</h2>
                  <p className="text-white/40 text-xl leading-relaxed">
                     Our service model is invisible yet omnipresent. From the moment you land in Setif until your final departure, every detail is anticipated by your dedicated suite concierge.
                  </p>
                  <div className="grid grid-cols-2 gap-12 pt-10">
                     <div className="space-y-4">
                        <div className="w-12 h-px bg-luxury-gold" />
                        <h5 className="font-bold uppercase tracking-widest text-xs">24/7 Butler</h5>
                        <p className="text-white/20 text-sm italic">Always at your service.</p>
                     </div>
                     <div className="space-y-4">
                        <div className="w-12 h-px bg-luxury-gold" />
                        <h5 className="font-bold uppercase tracking-widest text-xs">Airport Enclave</h5>
                        <p className="text-white/20 text-sm italic">Direct suite transfer.</p>
                     </div>
                  </div>
               </div>
               <div className="relative">
                  <div className="aspect-[4/5] rounded-[4rem] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-1000 shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Service" />
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 hidden xl:block">
                     <p className="text-luxury-gold text-4xl font-serif font-bold italic mb-4">99%</p>
                     <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Guest Delight index 2025</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Map Integration (Decorative) */}
      <section className="py-40 bg-white">
         <div className="container mx-auto px-12 text-center">
            <Map className="w-12 h-12 text-luxury-gold mx-auto mb-8" />
            <h2 className="text-4xl font-serif font-bold mb-16">Located in the heart of Heritage</h2>
            <div className="h-[500px] w-full rounded-[4rem] bg-luxury-cream/20 overflow-hidden relative group cursor-crosshair">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2074" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" alt="Map" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-32 h-32 rounded-full border border-luxury-gold flex items-center justify-center bg-white/80 backdrop-blur-md shadow-2xl animate-pulse">
                      <Logo textVisible={false} className="w-10 h-10" />
                   </div>
                </div>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-luxury-black text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-2xl">
                   Discover Our Vicinity
                </div>
            </div>
         </div>
      </section>
    </BrochureLayout>
  );
};

export default SuitesPage;
