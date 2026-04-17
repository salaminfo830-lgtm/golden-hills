import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, Star, Coffee, Wind, 
  Tv, Waves, MapPin, CheckCircle2, 
  Calendar, Users, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import GoldButton from '../components/GoldButton';
import GlassCard from '../components/GlassCard';
import Logo from '../components/Logo';

const RoomDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data for the room
  const room = {
    name: 'Royal Gold Suite',
    price: '$450',
    description: 'The Royal Gold Suite is the pinnacle of luxury in Setif. Featuring gold-leafed ceilings, expansive panoramic views of the city hills, and a private traditional hammam. Designed for those who demand the finest attention to detail.',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070',
      'https://images.unsplash.com/photo-1590490360182-c33d59735288?auto=format&fit=crop&q=80&w=1974',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070'
    ],
    amenities: [
      { icon: <Wind className="w-5 h-5" />, label: 'Climate Control' },
      { icon: <Coffee className="w-5 h-5" />, label: 'Nespresso Bar' },
      { icon: <Tv className="w-5 h-5" />, label: '65" OLED TV' },
      { icon: <Waves className="w-5 h-5" />, label: 'Spa Access' },
      { icon: <Star className="w-5 h-5" />, label: 'Butler 24/7' },
      { icon: <ShieldCheck className="w-5 h-5" />, label: 'VIP Security' }
    ]
  };

  return (
    <div className="min-h-screen bg-luxury-white-warm font-sans">
      {/* Mini Nav */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-500 glass py-3 lg:py-4">
        <div className="container mx-auto px-6 flex justify-between items-center text-luxury-black">
          <Link to="/" className="flex items-center gap-2 hover:text-luxury-gold transition-colors font-bold text-xs uppercase tracking-widest shrink-0">
            <ChevronLeft className="w-4 h-4 translate-y-[-1px]" /> <span className="hidden sm:inline">Back</span>
          </Link>
          <Logo className="scale-75 md:scale-90" />
          <GoldButton className="px-6 py-2 text-[10px] md:text-xs">BOOK NOW</GoldButton>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24 md:pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          
          {/* Gallery Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square md:aspect-[16/10] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/40"
            >
              <img src={room.images[selectedImage]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Suite Primary" />
            </motion.div>
            <div className="grid grid-cols-3 gap-4 px-2">
              {room.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-video rounded-2xl overflow-hidden cursor-pointer transition-all ${selectedImage === i ? 'ring-2 ring-luxury-gold p-1 bg-luxury-gold/10' : 'opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover rounded-xl" alt="Suite Thumb" />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-center">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-10"
            >
              <div>
                <div className="flex items-center gap-1.5 text-luxury-gold mb-6 md:mb-8">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] ml-3 text-luxury-black/40">Heritage Selection</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 text-luxury-black tracking-tight">{room.name}</h1>
                <div className="inline-flex items-baseline gap-2 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/60">
                  <span className="text-3xl md:text-4xl text-luxury-gold font-bold">{room.price}</span> 
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">/ Per Night</span>
                </div>
              </div>

              <p className="text-gray-500 leading-relaxed text-base md:text-xl font-medium max-w-xl">
                {room.description}
              </p>

              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Exclusive Amenities</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                   {room.amenities.map((item, i) => (
                     <div key={i} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-luxury-gold shrink-0 shadow-sm group-hover:shadow-md transition-all">
                          {item.icon}
                        </div>
                        <span className="text-xs md:text-sm font-bold tracking-wide text-luxury-black/70 group-hover:text-luxury-black transition-colors">{item.label}</span>
                     </div>
                   ))}
                </div>
              </div>

              {/* Booking Widget (Mobile Friendly) */}
              <GlassCard className="bg-white/80 border-luxury-gold/20 p-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-luxury-gold/10 transition-colors" />
                 <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest pl-1">Arrival</label>
                      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                         <Calendar className="w-4 h-4 text-luxury-gold opacity-50" />
                         <span className="font-bold text-sm text-luxury-black">12 Oct 2026</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest pl-1">Departure</label>
                      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                         <Calendar className="w-4 h-4 text-luxury-gold opacity-50" />
                         <span className="font-bold text-sm text-luxury-black">18 Oct 2026</span>
                      </div>
                    </div>
                 </div>
                 <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Estimated Stay (6 Nights)</p>
                      <p className="text-3xl font-bold text-luxury-black">$2,700</p>
                    </div>
                    <GoldButton className="w-full md:w-auto px-16 py-4 shadow-gold flex items-center justify-center gap-3">
                      RESERVE SUITE <ArrowRight className="w-4 h-4" />
                    </GoldButton>
                 </div>
                 <p className="mt-8 text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                   <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" /> Best Rate Guaranteed & Secure Booking
                 </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cross-Sell */}
      <section className="bg-luxury-black py-24 md:py-32 mt-20 text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-luxury-gold/20 to-transparent" />
         </div>
         <div className="container mx-auto px-6 text-center relative z-10">
            <h4 className="text-luxury-gold font-serif italic text-lg mb-4">Complete Individualist</h4>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 tracking-tight">Enhance Your Stay</h2>
            <p className="text-white/50 mb-16 max-w-xl mx-auto font-medium text-lg leading-relaxed px-4">
              Discover our curated excellence packages designed to make your visit to Golden Hills truly legendary.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
               {[
                 { label: 'Gourmet Breakfast', detail: 'Artisanal local flavors' },
                 { label: 'Spa Retreat', detail: 'Hammam & Aromatherapy' },
                 { label: 'Royal Transport', detail: 'VIP Airport Transfer' }
               ].map((pkg, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -10 }}
                   className="px-10 py-8 glass rounded-[2.5rem] cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-luxury-gold/30 text-left min-w-[280px]"
                 >
                    <p className="text-luxury-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">Package {i + 1}</p>
                    <p className="text-xl font-bold text-white mb-1">{pkg.label}</p>
                    <p className="text-sm text-white/40 font-medium">{pkg.detail}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default RoomDetails;
