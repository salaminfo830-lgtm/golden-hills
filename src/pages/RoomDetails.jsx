import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, Star, Coffee, Wind, 
  Tv, Waves, 
  Calendar, ShieldCheck, ArrowRight, ArrowLeft,
  Wifi, Bath, Sun, Loader2, MapPin,
  Maximize2, Sparkles, Heart, Share2,
  CheckCircle2, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import GoldButton from '../components/GoldButton';
import GlassCard from '../components/GlassCard';
import Logo from '../components/Logo';

const RoomDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const checkIn = searchParams.get('checkIn') || '12 Oct 2026';
  const checkOut = searchParams.get('checkOut') || '18 Oct 2026';
  const guests = searchParams.get('guests') || '2';

  const amenityIcons = {
    'Wifi': <Wifi className="w-5 h-5" />,
    'Tv': <Tv className="w-5 h-5" />,
    'Coffee': <Coffee className="w-5 h-5" />,
    'Waves': <Waves className="w-5 h-5" />,
    'Wind': <Wind className="w-5 h-5" />,
    'Sun': <Sun className="w-5 h-5" />,
    'Bath': <Bath className="w-5 h-5" />,
  };

  useEffect(() => {
    const fallbackRooms = [
      {
        id: 'fallback-1',
        type: 'Classic Room',
        price: 25000,
        capacity: 2,
        description: 'Experience a sanctuary where timeless Algerian elegance meets modern 4-star refinement.',
        image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070',
        amenities: []
      },
      {
        id: 'fallback-2',
        type: 'Junior Suite',
        price: 45000,
        capacity: 2,
        description: 'Expansive views of the high plateau with dedicated living spaces and premium amenities.',
        image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2070',
        amenities: []
      },
      {
        id: 'fallback-3',
        type: 'Royal Suite',
        price: 120000,
        capacity: 4,
        description: 'The pinnacle of luxury in Setif. A sprawling residence offering absolute privacy and 24/7 bespoke service.',
        image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070',
        amenities: []
      }
    ];

    const fetchRoom = async () => {
      // Try with amenities join first
      let { data, error } = await supabase
        .from('Room')
        .select('*, amenities:Amenity(*)')
        .eq('id', id)
        .single();
      
      if (error) {
        console.warn('Room fetch with amenities failed, retrying without join:', error.message);
        const { data: simpleData, error: simpleError } = await supabase
          .from('Room')
          .select('*')
          .eq('id', id)
          .single();
        data = simpleData;
        error = simpleError;
      }
      
      if (error || !data) {
        const fallback = fallbackRooms.find(r => r.id === id);
        if (fallback) {
           data = fallback;
        } else {
           console.error('Room not found in DB or fallback:', id);
           navigate('/');
           return;
        }
      }

      const roomImages = [];
      if (data.image_url) roomImages.push(data.image_url);
      if (data.gallery && Array.isArray(data.gallery)) {
        data.gallery.forEach(img => {
          if (img !== data.image_url) roomImages.push(img);
        });
      }

      const roomData = {
        ...data,
        images: roomImages.length > 0 ? roomImages : [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070',
          'https://images.unsplash.com/photo-1590490360182-c33d59735288?auto=format&fit=crop&q=80&w=1974',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2070'
        ]
      };
      setRoom(roomData);
      setLoading(false);
    };
    fetchRoom();
  }, [id, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  if (loading || !room) {
    return (
      <div className="h-screen flex items-center justify-center bg-luxury-cream">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-luxury-gold selection:text-white">
      {/* Premium Header */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-700 bg-white/80 backdrop-blur-2xl border-b border-luxury-gold/10 py-4 md:py-6">
        <div className="container mx-auto px-6 md:px-8 flex justify-between items-center">
          <Link to="/search" className="flex items-center gap-3 group text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-luxury-black transition-all">
            <ArrowLeft className="w-3.5 md:w-4 h-3.5 md:h-4 group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Discovery Portal</span>
          </Link>
          <Logo className="scale-75 md:scale-90" />
          <div className="flex items-center gap-4 md:gap-8">
             <button className="p-2 md:p-3 hover:bg-gray-50 rounded-2xl transition-colors"><Share2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /></button>
             <button className="p-2 md:p-3 hover:bg-gray-50 rounded-2xl transition-colors"><Heart className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /></button>
             <GoldButton 
               className="hidden sm:flex px-6 md:px-10 py-2.5 md:py-3 text-xs md:text-sm"
               onClick={() => navigate(`/book/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
             >
               RESERVE
             </GoldButton>
          </div>
        </div>
      </nav>

      <main className="pt-28 md:pt-32 pb-32">
        {/* Immersive Gallery Grid */}
        <section className="container mx-auto px-6 md:px-8 mb-12 md:mb-20">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 h-auto lg:h-[700px]">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-8 aspect-[4/3] lg:aspect-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden relative group cursor-zoom-in shadow-2xl"
              >
                 <img src={room.images[selectedImage]} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="Primary" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                 <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 text-white flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl glass flex items-center justify-center"><Maximize2 className="w-4 md:w-5 h-4 md:h-5" /></div>
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.4em]">Expand Sanctuary View</span>
                 </div>
              </motion.div>
              <div className="lg:col-span-4 flex lg:grid lg:grid-rows-3 gap-4 lg:gap-8 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0">
                 {room.images.slice(1, 4).map((img, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     onClick={() => {
                       setSelectedImage(room.images.indexOf(img));
                     }}
                     className="min-w-[150px] md:min-w-[200px] lg:min-w-0 flex-1 rounded-2xl md:rounded-[2.5rem] overflow-hidden relative cursor-pointer group shadow-xl border border-gray-100 aspect-video lg:aspect-auto"
                   >
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Detail" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-6 md:px-8">
           <div className="grid lg:grid-cols-3 gap-16 lg:gap-24">
              
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-12 md:space-y-16">
                 <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1 text-luxury-gold">
                          {[1,2,3,4].map(s => <Star key={s} className="w-3 md:w-3.5 h-3 md:h-3.5 fill-current" />)}
                       </div>
                       <div className="h-px w-12 bg-luxury-gold/20" />
                       <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Official 4-Star Gilded Rating</span>
                    </div>
                    <h1 className="text-4xl md:text-8xl font-serif font-bold text-luxury-black leading-[1.1]">
                       {room.type} <br /> <span className="italic font-normal text-luxury-gold">Sanctuary</span>
                    </h1>
                    <div className="flex flex-wrap gap-6 md:gap-10 py-6 md:py-8 border-y border-gray-100">
                       <div className="flex items-center gap-3 md:gap-4">
                          <MapPin className="text-luxury-gold w-4 md:w-5 h-4 md:h-5" />
                          <div>
                             <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Location</p>
                             <p className="text-sm font-bold">North Wing • High Floor</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 md:gap-4">
                          <Sun className="text-luxury-gold w-4 md:w-5 h-4 md:h-5" />
                          <div>
                             <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Exposure</p>
                             <p className="text-sm font-bold">Highland & City Panorama</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 md:gap-4">
                          <Sparkles className="text-luxury-gold w-4 md:w-5 h-4 md:h-5" />
                          <div>
                             <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Vibe</p>
                             <p className="text-sm font-bold">Refined Tranquility</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8 md:space-y-10">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold">A Masterpiece of Hospitality</h3>
                    <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium italic">
                       "{room.description || 'Experience a sanctuary where timeless Algerian elegance meets modern 4-star refinement. Featuring gold-leafed ceilings, expansive panoramic views of the Setif highlands, and a private traditional hammam.'}"
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                       <div className="space-y-6">
                          <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-luxury-gold flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" /> Gilded Amenities
                          </h4>
                          <div className="grid grid-cols-1 gap-6">
                             {(room.amenities && room.amenities.length > 0 ? room.amenities : [
                               { name: 'Gilded WiFi', icon: 'Wifi' },
                               { name: 'Imperial TV', icon: 'Tv' },
                               { name: 'Nespresso Bar', icon: 'Coffee' }
                             ]).map((a, i) => (
                               <div key={i} className="flex items-center gap-5 group">
                                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-luxury-gold border border-gray-100 group-hover:bg-luxury-gold group-hover:text-white transition-all duration-500">
                                     {amenityIcons[a.icon] || <CheckCircle2 className="w-5 h-5" />}
                                  </div>
                                  <span className="text-sm font-bold text-luxury-black/70">{a.name}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-6">
                          <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-luxury-gold flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" /> Exclusive Privileges
                          </h4>
                          <ul className="space-y-6">
                             {[
                               'Personal Concierge 24/7',
                               'In-Room Traditional Tea',
                               'Priority Spa Access',
                               'Luxury Transport Priority'
                             ].map((text, i) => (
                               <li key={i} className="flex items-start gap-4 text-sm font-bold text-gray-500 italic">
                                  <Sparkles className="w-4 h-4 text-luxury-gold shrink-0 mt-1" /> {text}
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column - Booking Card */}
              <div className="lg:col-span-1">
                 <div className="lg:sticky lg:top-44 space-y-8">
                    <GlassCard className="bg-white p-8 md:p-12 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] border-luxury-gold/10 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-2 gold-gradient" />
                       <div className="space-y-8 md:space-y-10">
                          <div className="flex justify-between items-end">
                             <div>
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">Sanctuary Rate</p>
                                <h3 className="text-3xl md:text-5xl font-serif font-bold text-luxury-black">{formatPrice(room.price)}</h3>
                             </div>
                             <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">/ Evening</p>
                          </div>

                          <div className="space-y-6">
                             <div className="p-5 md:p-6 bg-gray-50 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                   <span>Your Stay</span>
                                   <button className="text-luxury-gold hover:underline">Edit</button>
                                </div>
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <Calendar className="w-4 h-4 text-luxury-gold" />
                                      <span className="font-bold text-xs md:text-sm">{checkIn} — {checkOut}</span>
                                   </div>
                                </div>
                             </div>
                             
                             <div className="p-5 md:p-6 bg-luxury-gold/5 rounded-[1.5rem] md:rounded-[2rem] border border-luxury-gold/10 space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-luxury-gold">
                                   <span>Included Benefits</span>
                                   <Sparkles className="w-4 h-4" />
                                </div>
                                <ul className="space-y-2">
                                   <li className="flex items-center gap-3 text-xs font-bold text-luxury-gold/80 italic"><CheckCircle2 className="w-3 h-3" /> Breakfast Excellence</li>
                                   <li className="flex items-center gap-3 text-xs font-bold text-luxury-gold/80 italic"><CheckCircle2 className="w-3 h-3" /> Secure Gilded WiFi</li>
                                </ul>
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div className="flex justify-between items-center text-lg md:text-xl font-bold">
                                <span className="font-serif">Total Investment</span>
                                <span className="text-luxury-gold">{formatPrice(room.price * 6)}</span>
                             </div>
                             <GoldButton 
                               className="w-full py-5 md:py-6 text-xs md:text-sm shadow-2xl"
                               onClick={() => navigate(`/book/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                             >
                                 CONFIRM RESERVATION <ArrowRight className="ml-3 w-4 h-4" />
                             </GoldButton>
                          </div>

                          <div className="flex items-center justify-center gap-4 md:gap-6 text-xs font-bold uppercase tracking-widest text-gray-300">
                             <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-luxury-gold/40" /> 100% Secure</span>
                             <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-luxury-gold/40" /> Instant Confirm</span>
                          </div>
                       </div>
                    </GlassCard>

                    {/* Urgency Card */}
                    <div className="bg-orange-50 border border-orange-100 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-6 group">
                       <div className="w-12 md:w-14 h-12 md:h-14 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                          <Clock className="w-5 md:w-6 h-5 md:h-6 text-orange-500 animate-pulse" />
                       </div>
                       <div>
                          <p className="text-xs md:text-sm font-bold text-orange-600 mb-1">High Demand</p>
                          <p className="text-xs text-orange-600/70 font-medium leading-relaxed">This suite is highly coveted. Don't miss your chance.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Cross-Sell Experience */}
      <section className="bg-luxury-black py-20 md:py-32 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
         <div className="container mx-auto px-6 md:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
               <div>
                  <h4 className="text-luxury-gold font-bold text-xs uppercase tracking-[0.4em] mb-6">Complete The Vision</h4>
                  <h2 className="text-4xl md:text-7xl font-serif font-bold mb-8 md:mb-10 leading-tight">Elevate Your <br /> Stay in Setif</h2>
                  <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-10 md:mb-12 italic">
                     "True luxury is found in the moments between. Curate your experience with our exclusive add-ons."
                  </p>
                  <GoldButton outline className="px-10 md:px-12 py-4 md:py-5 text-xs md:text-sm text-white border-white/20 hover:border-luxury-gold transition-all">DISCOVER ADD-ONS</GoldButton>
               </div>
               <div className="grid grid-cols-2 gap-6 md:gap-8">
                  {[
                    { label: 'Royal Transport', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070' },
                    { label: 'Gilded Spa Ritual', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2070' }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -10 }}
                      className="aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative group cursor-pointer"
                    >
                       <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.label} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 md:p-8">
                          <p className="text-base md:text-lg font-bold text-white uppercase tracking-widest">{item.label}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default RoomDetails;
