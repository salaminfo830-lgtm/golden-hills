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
import Navbar from '../components/Logo'; // Reuse Logo for navbar simplicity or create a simpler Nav

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
      { icon: <Wind />, label: 'Climate Control' },
      { icon: <Coffee />, label: 'Nespresso Machine' },
      { icon: <Tv />, label: '65" Smart TV' },
      { icon: <Waves />, label: 'Private Spa Access' },
      { icon: <Star />, label: 'Butler Service' },
      { icon: <ShieldCheck />, label: 'High-Security Safe' }
    ]
  };

  return (
    <div className="min-h-screen bg-luxury-white-warm">
      {/* Mini Nav */}
      <nav className="p-6 flex justify-between items-center glass sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-luxury-gold hover:text-luxury-black transition-colors font-bold">
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </Link>
        <div className="text-xl font-serif font-bold text-luxury-black">GOLDEN <span className="text-luxury-gold">HILLS</span></div>
        <GoldButton className="px-6 py-2 text-xs">BOOK NOW</GoldButton>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Gallery Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img src={room.images[selectedImage]} className="w-full h-full object-cover" alt="Suite Primary" />
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              {room.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-video rounded-xl overflow-hidden cursor-pointer transition-all ${selectedImage === i ? 'ring-4 ring-luxury-gold scale-95' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Suite Thumb" />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-2 text-luxury-gold mb-2">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold uppercase tracking-widest ml-2">Heritage Luxury Selection</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{room.name}</h1>
              <p className="text-3xl text-luxury-gold font-bold">{room.price} <span className="text-sm text-gray-400 font-normal">/ night</span></p>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">
              {room.description}
            </p>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Suite Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {room.amenities.map((item, i) => (
                   <div key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 rounded-lg bg-luxury-gold/10 flex items-center justify-center text-luxury-gold shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Booking Widget (Mobile Friendly) */}
            <GlassCard className="bg-white border-luxury-gold/20 p-8 shadow-xl">
               <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Check-in</label>
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                       <Calendar className="w-4 h-4 text-luxury-gold" />
                       <span className="font-bold text-sm">12 Oct 2026</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Check-out</label>
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                       <Calendar className="w-4 h-4 text-luxury-gold" />
                       <span className="font-bold text-sm">18 Oct 2026</span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs text-gray-400">Total for 6 nights</p>
                    <p className="text-2xl font-bold text-luxury-black">$2,700</p>
                  </div>
                  <GoldButton className="px-12">RESERVE SUITE</GoldButton>
               </div>
               <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
                 <CheckCircle2 className="w-3 h-3 text-green-500" /> Fully refundable until 24h before check-in.
               </p>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Cross-Sell */}
      <section className="bg-luxury-black py-24 mt-20 text-white overflow-hidden relative">
         <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">Enhance Your Stay</h2>
            <p className="text-white/60 mb-12 max-w-xl mx-auto">Discover our curated packages to make your visit to Golden Hills truly unforgettable.</p>
            <div className="flex flex-wrap justify-center gap-6">
               <div className="px-8 py-4 glass rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">Gourmet Breakfast</div>
               <div className="px-8 py-4 glass rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border-luxury-gold/30">Spa Retreat</div>
               <div className="px-8 py-4 glass rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">Airport Transfer</div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default RoomDetails;
