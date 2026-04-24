import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search, Filter, Calendar, Users, 
  ChevronRight, Star, Wind, Coffee,
  SlidersHorizontal, Loader2, ArrowLeft,
  MapPin, ShieldCheck, Sparkles, AlertCircle,
  Waves, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // URL-driven state
  const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const guests = searchParams.get('guests') || '2';
  const typeFilter = searchParams.get('type') || 'All';
  const maxPrice = searchParams.get('maxPrice') || '200000';
  const sortBy = searchParams.get('sortBy') || 'price-low';

  const [localFilters, setLocalFilters] = useState({
    type: typeFilter,
    maxPrice: parseInt(maxPrice),
    sortBy: sortBy
  });

  const fallbackRooms = [
    {
      id: 'fallback-1',
      type: 'Heritage Deluxe',
      price: 25000,
      capacity: 2,
      description: 'Experience a sanctuary where timeless Algerian elegance meets modern 4-star refinement.',
      image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'
    },
    {
      id: 'fallback-2',
      type: 'Royal Gold Suite',
      price: 45000,
      capacity: 2,
      description: 'Expansive views of the high plateau with dedicated living spaces and premium amenities.',
      image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2070'
    }
  ];

  useEffect(() => {
    fetchAvailableRooms();
  }, [checkIn, checkOut, guests, typeFilter, maxPrice, sortBy]);

  const fetchAvailableRooms = async () => {
    setLoading(true);
    
    // 1. Fetch all rooms
    let { data: allRooms, error: roomError } = await supabase
      .from('Room')
      .select('*, amenities:Amenity(*)');

    if (roomError) {
      const { data: simpleRooms } = await supabase.from('Room').select('*');
      allRooms = simpleRooms;
    }

    if (!allRooms || allRooms.length === 0) {
      setRooms(fallbackRooms);
      setLoading(false);
      return;
    }

    // 2. Fetch overlapping reservations
    const { data: overlappingRes } = await supabase
      .from('Reservation')
      .select('room_id')
      .filter('start_date', 'lt', new Date(checkOut).toISOString())
      .filter('end_date', 'gt', new Date(checkIn).toISOString());

    const reservedRoomIds = overlappingRes?.map(r => r.room_id) || [];
    
    // 3. Filter and Sort
    let processedRooms = allRooms.filter(room => !reservedRoomIds.includes(room.id));

    // Apply Filters
    processedRooms = processedRooms.filter(room => {
      const matchesType = typeFilter === 'All' || room.type === typeFilter;
      const matchesPrice = room.price <= parseInt(maxPrice);
      const matchesCapacity = (room.capacity || 2) >= parseInt(guests);
      return matchesType && matchesPrice && matchesCapacity;
    });

    // Apply Sorting
    processedRooms.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'capacity') return (b.capacity || 0) - (a.capacity || 0);
      return 0;
    });

    setRooms(processedRooms);
    setLoading(false);
  };

  const handleSearchUpdate = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      updated.set(key, value);
    });
    setSearchParams(updated);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] selection:bg-luxury-gold selection:text-white">
      {/* Search Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-2xl border-b border-luxury-gold/10 py-6">
        <div className="container mx-auto px-6 md:px-8 flex flex-col xl:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 w-full xl:w-auto justify-between xl:justify-start">
            <Link to="/" className="p-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <Logo className="scale-90" />
            <div className="xl:hidden h-10 w-px bg-gray-100" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50/50 p-2 rounded-[2rem] w-full xl:w-auto border border-gray-100">
            <div className="flex items-center gap-4 w-full md:w-auto bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
              <Calendar className="w-4 h-4 text-luxury-gold" />
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => handleSearchUpdate({ checkIn: e.target.value })}
                className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none cursor-pointer"
              />
              <span className="text-gray-300 mx-2">—</span>
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => handleSearchUpdate({ checkOut: e.target.value })}
                className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
              <Users className="w-4 h-4 text-luxury-gold" />
              <select 
                value={guests}
                onChange={(e) => handleSearchUpdate({ guests: e.target.value })}
                className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none"
              >
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guests</option>)}
              </select>
            </div>

            <button 
              onClick={fetchAvailableRooms}
              className="h-14 w-full md:w-14 bg-luxury-gold text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-luxury-gold/20 flex items-center justify-center shrink-0"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 md:px-8 pt-64 xl:pt-48 pb-20">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-12 shrink-0">
            <div className="lg:sticky lg:top-48">
              <div className="space-y-12">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" /> Suite Selection
                  </h3>
                  <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0">
                    {['All', 'Queen Room', 'King Suite', 'Multi-Bedroom Suite'].map((type) => (
                      <button 
                        key={type}
                        onClick={() => handleSearchUpdate({ type })}
                        className={`flex items-center justify-between px-6 py-5 rounded-2xl transition-all border-2 whitespace-nowrap min-w-max lg:min-w-0 ${
                          typeFilter === type ? 'bg-white border-luxury-gold text-luxury-gold shadow-xl shadow-luxury-gold/5' : 'bg-white/50 border-gray-100 text-gray-500 hover:border-luxury-gold/30'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{type}</span>
                        {typeFilter === type && <Sparkles className="w-4 h-4 hidden lg:block" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" /> Price Boundary
                  </h3>
                  <div className="px-2 space-y-6">
                    <input 
                      type="range" 
                      min="10000" 
                      max="200000" 
                      step="5000"
                      value={maxPrice}
                      onChange={(e) => handleSearchUpdate({ maxPrice: e.target.value })}
                      className="w-full accent-luxury-gold h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Up to</span>
                      <span className="text-sm font-bold text-luxury-gold underline decoration-2 underline-offset-8">{formatPrice(maxPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block pt-8">
                  <GlassCard className="bg-luxury-black text-white p-10 border-0 relative overflow-hidden group rounded-[3rem]">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-luxury-gold/20 rounded-full translate-x-20 -translate-y-20 blur-3xl" />
                    <div className="relative z-10 space-y-6">
                      <ShieldCheck className="text-luxury-gold w-10 h-10" />
                      <div>
                        <h4 className="text-2xl font-serif font-bold mb-3">Gilded Member</h4>
                        <p className="text-white/40 text-xs leading-relaxed font-medium">Unlock exclusive sanctuaries and 15% preferred pricing.</p>
                      </div>
                      <button 
                        onClick={() => navigate('/register')}
                        className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold hover:border-luxury-gold transition-all"
                      >
                        ENROLL NOW
                      </button>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-gray-100 pb-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-serif font-medium text-luxury-black mb-4 tracking-tight">Available Sanctuaries</h2>
                <p className="text-gray-400 font-medium text-lg italic">Curating {rooms.length} exclusive experiences for your stay.</p>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-sm w-full md:w-auto">
                <SlidersHorizontal className="w-4 h-4 text-luxury-gold" />
                <span className="h-4 w-px bg-gray-100" />
                <select 
                  value={sortBy}
                  onChange={(e) => handleSearchUpdate({ sortBy: e.target.value })}
                  className="bg-transparent outline-none cursor-pointer text-luxury-black hover:text-luxury-gold transition-colors appearance-none"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="capacity">Highest Capacity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-[450px] bg-white rounded-[3rem] animate-pulse border border-gray-100" />
                ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {rooms.map((room, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      key={room.id}
                    >
                      <GlassCard 
                        onClick={() => navigate(`/room/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                        className="group p-0 bg-white border-gray-100 overflow-hidden hover:shadow-[0_50px_100px_-30px_rgba(212,175,55,0.15)] hover:border-luxury-gold/30 transition-all duration-1000 cursor-pointer rounded-[3rem]"
                      >
                        <div className="flex flex-col lg:flex-row min-h-[450px]">
                          <div className="lg:w-[45%] relative overflow-hidden h-[300px] lg:h-auto">
                            <img 
                              src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out" 
                              alt={room.type} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            
                            <div className="absolute top-8 left-8 flex flex-col gap-3">
                              <div className="px-6 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold border border-luxury-gold/10">
                                {room.type}
                              </div>
                              {i === 0 && (
                                <div className="px-6 py-2 bg-luxury-gold text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] shadow-lg shadow-luxury-gold/30 animate-pulse">
                                  Most Coveted
                                </div>
                              )}
                            </div>

                            <div className="absolute bottom-8 left-8 flex items-center gap-1.5 text-luxury-gold">
                               {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                            </div>
                          </div>
                          
                          <div className="flex-1 p-10 lg:p-16 flex flex-col justify-between">
                            <div className="space-y-8">
                              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div>
                                  <h3 className="text-3xl lg:text-4xl font-serif font-bold text-luxury-black mb-4 leading-tight">{room.type}</h3>
                                  <div className="flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                    <span className="flex items-center gap-3"><Users className="w-4 h-4 text-luxury-gold" /> {room.capacity} Guests</span>
                                    <span className="flex items-center gap-3"><Wind className="w-4 h-4 text-luxury-gold" /> Climate Ritual</span>
                                    <span className="flex items-center gap-3 text-green-600 font-extrabold italic">Flexible Protocol</span>
                                  </div>
                                </div>
                                <div className="text-left md:text-right">
                                  <p className="text-3xl lg:text-4xl font-serif font-bold text-luxury-gold mb-1">{formatPrice(room.price)}</p>
                                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Per Evening</p>
                                </div>
                              </div>

                              <p className="text-gray-500 text-lg leading-relaxed font-medium line-clamp-3 italic">
                                "{room.description || 'Experience a sanctuary where timeless Algerian elegance meets modern refinement. A masterpiece of hospitality designed for the discerning traveler.'}"
                              </p>

                              <div className="inline-flex items-center gap-4 px-6 py-3 bg-orange-50 border border-orange-100 rounded-2xl text-orange-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                                 <AlertCircle className="w-4 h-4 animate-pulse" /> Highly Coveted: Only {Math.floor(Math.random() * 2) + 1} remaining
                              </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-gray-50 flex flex-wrap items-center justify-between gap-8">
                              <div className="flex gap-4">
                                {[Coffee, Waves, Wifi].map((Icon, idx) => (
                                  <div key={idx} className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-luxury-gold border border-gray-100 hover:bg-luxury-gold hover:text-white transition-all duration-500">
                                    <Icon className="w-5 h-5" />
                                  </div>
                                ))}
                              </div>
                              <GoldButton 
                                className="w-full sm:w-auto px-16 py-6 text-xs shadow-2xl"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/room/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
                                }}
                              >
                                ENTER SANCTUARY
                              </GoldButton>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {!loading && rooms.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-40 text-center space-y-10"
                >
                  <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                    <Search className="w-12 h-12 text-gray-200" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif font-bold text-luxury-black tracking-tight">No Sanctuaries Available</h3>
                    <p className="text-gray-400 max-w-lg mx-auto text-lg italic font-medium">All our exclusive suites are currently reserved for these dates. Please explore alternative dates for your stay.</p>
                  </div>
                  <button 
                    onClick={() => handleSearchUpdate({ type: 'All', maxPrice: '200000' })}
                    className="text-luxury-gold font-bold uppercase text-[10px] tracking-[0.5em] border-b-2 border-luxury-gold pb-3 hover:text-luxury-black hover:border-luxury-black transition-all"
                  >
                    RESET SEARCH PROTOCOLS
                  </button>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
