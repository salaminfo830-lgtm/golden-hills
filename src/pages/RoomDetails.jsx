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
  const [relatedRooms, setRelatedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const guests = searchParams.get('guests') || '2';

  const getNights = (d1, d2) => {
    const diff = Math.abs(new Date(d2) - new Date(d1));
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  const nights = getNights(checkIn, checkOut);
  const basePrice = room ? room.price * nights : 0;
  const taxes = basePrice * 0.10;
  const serviceFee = basePrice * 0.05;
  const totalAmount = basePrice + taxes + serviceFee;

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
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Fetch Room Details
      if (id && id.startsWith('fallback-')) {
        const fallbackRooms = [
          {
            id: 'fallback-1',
            type: 'Heritage Deluxe',
            price: 25000,
            capacity: 2,
            description: 'Experience a sanctuary where timeless Algerian elegance meets modern 4-star refinement.',
            image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070',
            amenities: []
          },
          {
            id: 'fallback-2',
            type: 'Royal Gold Suite',
            price: 45000,
            capacity: 2,
            description: 'Expansive views of the high plateau with dedicated living spaces and premium amenities.',
            image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2070',
            amenities: []
          }
        ];
        const roomData = fallbackRooms.find(r => r.id === id);
        if (!roomData) {
          navigate('/search');
          return;
        }
        setRoom({
          ...roomData,
          images: [roomData.image_url]
        });
        setRelatedRooms([]);
        setIsAvailable(true);
        setLoading(false);
        return;
      }

      const { data: roomData, error: roomError } = await supabase
        .from('Room')
        .select('*, amenities:Amenity(*)')
        .eq('id', isNaN(id) ? id : parseInt(id))
        .single();

      if (roomError || !roomData) {
        console.error("Room fetch error:", roomError);
        navigate('/search');
        return;
      }

      // 2. Check Availability
      const { data: overlapping } = await supabase
        .from('Reservation')
        .select('id')
        .eq('room_id', id)
        .filter('start_date', 'lt', new Date(checkOut).toISOString())
        .filter('end_date', 'gt', new Date(checkIn).toISOString());

      setIsAvailable(overlapping?.length === 0);

      // 3. Fetch Related Rooms
      const { data: related } = await supabase
        .from('Room')
        .select('*')
        .neq('id', id)
        .limit(3);

      setRoom({
        ...roomData,
        images: [roomData.image_url, ...(roomData.gallery || [])].filter(Boolean)
      });
      setRelatedRooms(related || []);
      setLoading(false);
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, checkIn, checkOut, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(price);
  };

  if (loading || !room) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-luxury-gold selection:text-white pb-24 lg:pb-0">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-luxury-gold/10 py-6">
        <div className="container mx-auto px-6 md:px-8 flex justify-between items-center">
          <Link to={`/search?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`} className="flex items-center gap-3 group text-xs font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-luxury-black transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Discovery Portal</span>
          </Link>
          <Logo className="scale-90" />
          <div className="flex items-center gap-6">
             <button className="p-3 hover:bg-gray-50 rounded-2xl transition-colors"><Heart className="w-5 h-5 text-gray-400" /></button>
             <GoldButton 
               className="hidden lg:flex px-12 py-4 text-xs"
               onClick={() => isAvailable && navigate(`/book/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
               disabled={!isAvailable}
             >
               {isAvailable ? 'RESERVE SANCTUARY' : 'FULLY RESERVED'}
             </GoldButton>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* Immersive Gallery */}
        <section className="container mx-auto px-6 md:px-8 mb-20">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[750px]">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-9 rounded-[3rem] overflow-hidden relative group cursor-pointer shadow-2xl"
                onClick={() => setIsLightboxOpen(true)}
              >
                 <img src={room.images[selectedImage]} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" alt="Primary Sanctuary" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                 <div className="absolute bottom-10 left-10 text-white flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center"><Maximize2 className="w-6 h-6" /></div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Visual Exploration</p>
                      <p className="text-sm font-medium italic">Click to expand sanctuary view</p>
                    </div>
                 </div>
              </motion.div>
              <div className="lg:col-span-3 flex lg:flex-col gap-6 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0">
                 {room.images.map((img, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     onClick={() => setSelectedImage(i)}
                     className={`min-w-[180px] lg:min-w-0 flex-1 rounded-[2rem] overflow-hidden relative cursor-pointer group shadow-xl border-2 transition-all duration-500 ${selectedImage === i ? 'border-luxury-gold' : 'border-transparent'}`}
                   >
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Detail" />
                      <div className={`absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors ${selectedImage === i ? 'bg-transparent' : ''}`} />
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        <section className="container mx-auto px-6 md:px-8">
           <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">
              
              {/* Left Side: Content */}
              <div className="lg:col-span-8 space-y-20">
                 <div className="space-y-8">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-1.5 text-luxury-gold">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                       </div>
                       <div className="h-px w-16 bg-luxury-gold/20" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 italic font-medium">Gilded Excellence • Level IV</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-luxury-black leading-tight">
                       {room.type} <br /> <span className="italic font-normal text-luxury-gold">Sanctuary</span>
                    </h1>
                    <div className="flex flex-wrap gap-10 py-10 border-y border-gray-100">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-luxury-gold border border-gray-100"><MapPin className="w-5 h-5" /></div>
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Position</p>
                             <p className="text-sm font-bold text-luxury-black">North Wing • High Floor</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-luxury-gold border border-gray-100"><Sun className="w-5 h-5" /></div>
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Exposure</p>
                             <p className="text-sm font-bold text-luxury-black">Highland Panorama</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-luxury-gold border border-gray-100"><Sparkles className="w-5 h-5" /></div>
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Vibe</p>
                             <p className="text-sm font-bold text-luxury-black">Refined Tranquility</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-12">
                    <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">The Art of Stillness</h3>
                    <p className="text-gray-500 text-xl md:text-2xl leading-relaxed font-medium italic max-w-4xl">
                       "{room.description || 'Experience a sanctuary where timeless Algerian elegance meets modern refinement. Featuring gold-leafed accents, expansive views of the Setif highlands, and a private traditional hammam experience.'}"
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-16">
                       <div className="space-y-8">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-gold flex items-center gap-4">
                             <div className="w-2 h-2 rounded-full bg-luxury-gold" /> Gilded Amenities
                          </h4>
                          <div className="grid gap-8">
                             {(room.amenities?.length > 0 ? room.amenities : [
                                { name: 'Select Comfort Bed', icon: 'Sparkles' },
                                { name: 'Egyptian Cotton Ritual', icon: 'Sparkles' },
                                { name: 'Gilded WiFi Access', icon: 'Wifi' },
                                { name: 'In-Suite Nespresso', icon: 'Coffee' }
                             ]).map((a, i) => (
                               <div key={i} className="flex items-center gap-6 group">
                                  <div className="w-14 h-14 rounded-[1.25rem] bg-gray-50 flex items-center justify-center text-luxury-gold border border-gray-100 group-hover:bg-luxury-gold group-hover:text-white transition-all duration-500">
                                     {amenityIcons[a.icon] || <CheckCircle2 className="w-6 h-6" />}
                                  </div>
                                  <span className="text-sm font-bold text-luxury-black/70 tracking-widest uppercase">{a.name}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-8">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-gold flex items-center gap-4">
                             <div className="w-2 h-2 rounded-full bg-luxury-gold" /> Exclusive Privileges
                          </h4>
                          <ul className="space-y-8">
                             {[
                               'Personal Gilded Concierge 24/7',
                               'In-Room Traditional Tea Ritual',
                               'Priority Spa & Wellness Access',
                               'Luxury Transport Allocation'
                             ].map((text, i) => (
                               <li key={i} className="flex items-start gap-5 text-sm font-bold text-gray-500 italic">
                                  <Sparkles className="w-5 h-5 text-luxury-gold shrink-0 mt-0.5" /> {text}
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                 </div>

                 {/* Reviews Section */}
                 <div className="space-y-12 pt-20 border-t border-gray-50">
                    <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Guest Chronicles</h3>
                        <p className="text-gray-400 font-medium italic">Unfiltered perspectives from our esteemed visitors.</p>
                      </div>
                      <div className="flex items-center gap-4 text-luxury-gold">
                        <div className="text-4xl font-serif font-bold">4.9</div>
                        <div className="space-y-1">
                          <div className="flex gap-1"><Star className="w-3 h-3 fill-current" /> <Star className="w-3 h-3 fill-current" /> <Star className="w-3 h-3 fill-current" /> <Star className="w-3 h-3 fill-current" /> <Star className="w-3 h-3 fill-current" /></div>
                          <p className="text-[10px] font-bold uppercase tracking-widest">Global Rating</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      {[
                        { name: 'Amine R.', date: 'Oct 2026', comment: 'An absolute sanctuary. The panoramic views of the highlands at sunset are unmatched in Sétif.' },
                        { name: 'Sarah L.', date: 'Sept 2026', comment: 'Every detail is intentional. From the Egyptian cotton sheets to the private hammam experience, it was pure bliss.' }
                      ].map((rev, i) => (
                        <GlassCard key={i} className="p-8 rounded-[2rem] border-gray-100 bg-gray-50/30 space-y-6">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-luxury-black">{rev.name}</span>
                            <span className="text-[10px] font-bold text-gray-400">{rev.date}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-500 italic leading-relaxed">"{rev.comment}"</p>
                        </GlassCard>
                      ))}
                    </div>
                 </div>
              </div>

              {/* Right Side: Sticky Booking Panel */}
              <div className="lg:col-span-4 relative">
                 <div className="lg:sticky lg:top-40 space-y-8">
                    <GlassCard className="bg-white p-10 xl:p-14 shadow-[0_50px_100px_-30px_rgba(212,175,55,0.15)] border-luxury-gold/20 rounded-[3.5rem] relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-2 bg-luxury-gold" />
                       <div className="space-y-10">
                          <div className="flex justify-between items-end">
                             <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-3">Sanctuary Rate</p>
                                <h3 className="text-4xl font-serif font-bold text-luxury-black tracking-tight">{formatPrice(room.price)}</h3>
                             </div>
                             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">/ Evening</p>
                          </div>

                          <div className="space-y-4">
                             <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">
                                   <span>Stay Protocol</span>
                                   <Calendar className="w-4 h-4 text-luxury-gold" />
                                </div>
                                <div className="flex items-center justify-between">
                                   <div className="space-y-1">
                                      <p className="text-xs font-bold text-luxury-black uppercase tracking-widest">{checkIn} — {checkOut}</p>
                                      <p className="text-[10px] font-medium text-gray-400 italic">{nights} Evenings • {guests} Guests</p>
                                   </div>
                                </div>
                             </div>
                             
                             <div className="p-6 bg-luxury-gold/5 rounded-[2rem] border border-luxury-gold/10 space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold">
                                   <span>Gilded Benefits</span>
                                   <Sparkles className="w-4 h-4" />
                                </div>
                                <ul className="space-y-2">
                                   <li className="flex items-center gap-3 text-[10px] font-bold text-luxury-gold/80 italic uppercase tracking-widest"><CheckCircle2 className="w-3.5 h-3.5" /> Breakfast Excellence</li>
                                   <li className="flex items-center gap-3 text-[10px] font-bold text-luxury-gold/80 italic uppercase tracking-widest"><CheckCircle2 className="w-3.5 h-3.5" /> Gilded WiFi Ritual</li>
                                </ul>
                             </div>
                          </div>

                          <div className="space-y-8">
                             <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                                <span className="text-lg font-serif font-bold text-luxury-black">Investment Total</span>
                                <span className="text-2xl font-serif font-bold text-luxury-gold">{formatPrice(totalAmount)}</span>
                             </div>
                             <GoldButton 
                               className="w-full py-7 shadow-2xl text-[10px] tracking-[0.3em]"
                               onClick={() => isAvailable && navigate(`/book/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                               disabled={!isAvailable}
                             >
                                 {isAvailable ? 'INITIATE RESERVATION' : 'CURRENTLY RESERVED'} <ArrowRight className="ml-4 w-4 h-4" />
                             </GoldButton>
                          </div>

                          <div className="flex items-center justify-center gap-8 text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300">
                             <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-luxury-gold/30" /> 100% Encrypted</span>
                             <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-luxury-gold/30" /> Instant Confirm</span>
                          </div>
                       </div>
                    </GlassCard>

                    <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem] flex items-center gap-6 group">
                       <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform duration-700">
                          <Clock className="w-7 h-7 text-orange-500 animate-pulse" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">High Volatility</p>
                          <p className="text-xs text-orange-600/70 font-medium leading-relaxed italic">This sanctuary is highly coveted. Rates are subject to immediate adjustment.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Related Sanctuaries */}
        <section className="container mx-auto px-6 md:px-8 py-32 space-y-16">
          <div className="text-center space-y-4">
            <h4 className="text-luxury-gold font-bold text-[10px] uppercase tracking-[0.5em]">Explore Alternatives</h4>
            <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tight">Similar Sanctuaries</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {relatedRooms.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/room/${r.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                className="group cursor-pointer space-y-6"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative shadow-xl">
                  <img src={r.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={r.type} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">Gilded Suite</p>
                      <h4 className="text-xl font-serif font-bold">{r.type}</h4>
                    </div>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl border-t border-luxury-gold/10 p-4 z-[60] flex items-center justify-between gap-6 px-8 py-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{nights} nights total</p>
          <p className="text-xl font-serif font-bold text-luxury-gold">{formatPrice(totalAmount)}</p>
        </div>
        <GoldButton 
          className="px-12 py-5 text-[10px] tracking-widest shadow-xl"
          onClick={() => isAvailable && navigate(`/book/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
          disabled={!isAvailable}
        >
          {isAvailable ? 'BOOK NOW' : 'RESERVED'}
        </GoldButton>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-luxury-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-20"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors" onClick={() => setIsLightboxOpen(false)}>
              <Maximize2 className="w-8 h-8 rotate-45" />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={room.images[selectedImage]} 
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" 
              alt="Sanctuary Detail" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomDetails;
