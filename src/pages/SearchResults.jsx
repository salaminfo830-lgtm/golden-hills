import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, Filter, Calendar, Users, 
  ChevronRight, Star, Wind, Coffee,
  SlidersHorizontal, Loader2, ArrowLeft,
  MapPin, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'All',
    priceRange: [0, 200000],
    sortBy: 'price-low'
  });

  const checkIn = searchParams.get('checkIn') || 'Today';
  const checkOut = searchParams.get('checkOut') || 'Tomorrow';
  const guests = searchParams.get('guests') || '2';

  const fallbackRooms = [
    {
      id: 'fallback-1',
      type: 'Heritage Deluxe',
      price: 25000,
      capacity: 2,
      description: 'Experience a sanctuary where timeless Algerian elegance meets modern 5-star refinement.',
      image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'
    },
    {
      id: 'fallback-2',
      type: 'Royal Gold Suite',
      price: 45000,
      capacity: 2,
      description: 'Expansive views of the high plateau with dedicated living spaces and premium amenities.',
      image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2070'
    },
    {
      id: 'fallback-3',
      type: 'Presidential Panorama',
      price: 120000,
      capacity: 4,
      description: 'The pinnacle of luxury in Setif. A sprawling residence offering absolute privacy and 24/7 bespoke service.',
      image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070'
    }
  ];

  useEffect(() => {
    fetchAvailableRooms();
  }, [searchParams]);

  const fetchAvailableRooms = async () => {
    setLoading(true);
    const startDate = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')).toISOString() : new Date().toISOString();
    const endDate = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')).toISOString() : new Date(Date.now() + 86400000).toISOString();

    let { data: allRooms, error: roomError } = await supabase
      .from('Room')
      .select('*, amenities:Amenity(*)')
      .order('price', { ascending: true });

    if (roomError) {
      console.warn('Room fetch with amenities failed, retrying without join:', roomError.message);
      const { data: simpleRooms, error: simpleError } = await supabase
        .from('Room')
        .select('*')
        .order('price', { ascending: true });
      allRooms = simpleRooms;
      roomError = simpleError;
    }

    let finalRooms = allRooms;

    if (roomError || !allRooms || allRooms.length === 0) {
      finalRooms = fallbackRooms;
    } else {
      const { data: overlappingRes } = await supabase
        .from('Reservation')
        .select('room_id')
        .filter('start_date', 'lt', endDate)
        .filter('end_date', 'gt', startDate);

      const reservedRoomIds = overlappingRes?.map(r => r.room_id).filter(id => id !== null) || [];
      finalRooms = allRooms.filter(room => !reservedRoomIds.includes(room.id));
    }
    
    setRooms(finalRooms);
    setLoading(false);
  };

  const filteredRooms = rooms
    .filter(room => {
      const matchesType = filters.type === 'All' || room.type === filters.type;
      const matchesPrice = room.price <= filters.priceRange[1];
      const matchesCapacity = (room.capacity || 2) >= parseInt(guests);
      return matchesType && matchesPrice && matchesCapacity;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      if (filters.sortBy === 'capacity') return (b.capacity || 0) - (a.capacity || 0);
      return 0;
    });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-luxury-cream/30 selection:bg-luxury-gold selection:text-white">
      {/* Search Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-b border-luxury-gold/10 py-4 md:py-6">
        <div className="container mx-auto px-6 md:px-8 flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex items-center gap-6 md:gap-8 w-full lg:w-auto">
            <Link to="/" className="p-2.5 md:p-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <Logo className="scale-75 md:scale-90 origin-left" />
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 bg-gray-50/80 p-1.5 md:p-2 rounded-3xl w-full lg:w-auto border border-gray-100 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-[10px] md:text-xs font-bold whitespace-nowrap">
              <Calendar className="w-3.5 md:w-4 h-3.5 md:h-4 text-luxury-gold" />
              <span className="text-luxury-black">{checkIn} — {checkOut}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-[10px] md:text-xs font-bold whitespace-nowrap">
              <Users className="w-3.5 md:w-4 h-3.5 md:h-4 text-luxury-gold" />
              <span className="text-luxury-black">{guests} Guests</span>
            </div>
            <button className="h-10 md:h-12 w-10 md:w-12 bg-luxury-gold text-white rounded-2xl hover:scale-105 transition-all shadow-lg flex items-center justify-center shrink-0">
              <Search className="w-4 md:w-5 h-4 md:h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 md:px-8 pt-64 lg:pt-44 pb-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-10 lg:space-y-12 shrink-0">
            <div className="lg:sticky lg:top-44">
              <div className="space-y-10 lg:space-y-12">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" /> Suite Categories
                  </h3>
                  <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0">
                    {['All', 'Heritage Deluxe', 'Royal Gold Suite', 'Presidential Panorama'].map((type) => (
                      <button 
                        key={type}
                        onClick={() => setFilters({...filters, type})}
                        className={`flex items-center justify-between px-6 py-4 lg:py-5 rounded-2xl transition-all border-2 whitespace-nowrap min-w-max lg:min-w-0 ${
                          filters.type === type ? 'bg-white border-luxury-gold text-luxury-gold shadow-xl' : 'bg-white/50 border-gray-100 text-gray-500 hover:border-luxury-gold/30'
                        }`}
                      >
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{type}</span>
                        {filters.type === type && <Sparkles className="w-4 h-4 hidden lg:block" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:block">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" /> Investment
                  </h3>
                  <div className="px-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="150000" 
                      step="5000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                      className="w-full accent-luxury-gold h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                    />
                    <div className="flex justify-between mt-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Min: 0 USD</span>
                      <span className="text-xs font-bold text-luxury-gold uppercase tracking-widest underline decoration-2 underline-offset-4">{formatPrice(filters.priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <GlassCard className="bg-luxury-black text-white p-8 lg:p-10 border-0 relative overflow-hidden group rounded-[2rem] lg:rounded-[2.5rem]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-luxury-gold/20 rounded-full translate-x-20 -translate-y-20 blur-3xl group-hover:scale-150 transition-all duration-1000" />
                  <div className="relative z-10 space-y-6">
                    <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-2xl bg-luxury-gold/20 flex items-center justify-center border border-luxury-gold/30">
                      <ShieldCheck className="text-luxury-gold w-5 lg:w-6 h-5 lg:h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl lg:text-2xl font-serif font-bold mb-2">Gilded Privilege</h4>
                      <p className="text-white/40 text-[10px] lg:text-xs leading-relaxed">Members enjoy 15% lower rates and complimentary late check-out.</p>
                    </div>
                    <button 
                      onClick={() => navigate('/register')}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold hover:border-luxury-gold transition-all"
                    >
                      JOIN MEMBERSHIP
                    </button>
                  </div>
                </GlassCard>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1 space-y-8 lg:space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="w-full md:w-auto">
                <h2 className="text-3xl lg:text-5xl font-serif font-bold text-luxury-black mb-2 lg:mb-4">Discovery</h2>
                <p className="text-gray-400 font-medium text-sm lg:text-lg">Found {filteredRooms.length} available sanctuaries.</p>
              </div>
              <div className="flex items-center gap-4 lg:gap-6 text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 bg-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl border border-gray-100 shadow-sm w-full md:w-auto justify-between md:justify-start">
                <span className="flex items-center gap-2">Sort <ChevronRight className="w-4 h-4 text-luxury-gold" /></span>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="text-luxury-black cursor-pointer hover:text-luxury-gold transition-colors bg-transparent outline-none appearance-none font-bold"
                >
                  <option value="price-low">Lowest Price</option>
                  <option value="price-high">Highest Price</option>
                  <option value="capacity">Capacity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:gap-10">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-[400px] lg:h-[450px] bg-white rounded-[2rem] lg:rounded-[3rem] animate-pulse shadow-sm border border-gray-100" />
                ))
              ) : (
                filteredRooms.map((room, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={room.id}
                  >
                  <GlassCard 
                    onClick={() => navigate(`/room/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                    className="group p-0 bg-white border-gray-100 overflow-hidden hover:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] hover:border-luxury-gold/30 transition-all duration-700 cursor-pointer rounded-[2rem] lg:rounded-[3rem]"
                  >
                    <div className="flex flex-col lg:flex-row h-full">
                      <div className="lg:w-[40%] relative overflow-hidden h-[250px] lg:h-auto">
                        <img 
                          src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                          alt={room.type} 
                        />
                        <div className="absolute top-6 lg:top-8 left-6 lg:left-8 px-4 lg:px-6 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold border border-luxury-gold/10">
                          {room.type}
                        </div>
                        <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 flex gap-1.5 lg:gap-2">
                           {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 lg:w-3 h-2.5 lg:h-3 text-luxury-gold fill-current" />)}
                        </div>
                      </div>
                      
                      <div className="flex-1 p-8 lg:p-14 flex flex-col justify-between">
                        <div className="space-y-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                              <h3 className="text-2xl lg:text-4xl font-serif font-bold text-luxury-black mb-2 lg:mb-4">{room.type}</h3>
                              <div className="flex flex-wrap gap-4 lg:gap-6 text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-luxury-gold" /> {room.capacity || 2} Guests</span>
                                <span className="flex items-center gap-2"><Wind className="w-4 h-4 text-luxury-gold" /> Climate Controlled</span>
                                <span className="flex items-center gap-2 text-green-600"> Free Cancellation</span>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-3xl lg:text-4xl font-serif font-bold text-luxury-gold mb-1">{formatPrice(room.price)}</p>
                              <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Per Evening</p>
                            </div>
                          </div>

                          <p className="text-gray-500 text-base lg:text-lg leading-relaxed line-clamp-2 italic">
                            {room.description || 'Experience a sanctuary where timeless Algerian elegance meets modern 5-star refinement.'}
                          </p>

                          {/* Urgency Badge */}
                          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-orange-50 border border-orange-100 rounded-2xl text-orange-600 text-[9px] font-bold uppercase tracking-widest">
                             <AlertCircle className="w-4 h-4 animate-pulse" /> Only {Math.floor(Math.random() * 3) + 1} left at this rate
                          </div>
                        </div>

                        <div className="mt-8 lg:mt-12 pt-8 lg:pt-10 border-t border-gray-50 flex flex-wrap items-center justify-between gap-6 lg:gap-10">
                          <div className="flex gap-4 lg:gap-6">
                            {['Wind', 'Coffee', 'Waves'].map((iconName, idx) => (
                              <div key={idx} className="w-10 lg:w-12 h-10 lg:h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-luxury-gold border border-gray-100">
                                <Wind className="w-4 lg:w-5 h-4 lg:h-5" />
                              </div>
                            ))}
                          </div>
                          <GoldButton 
                            className="w-full sm:w-auto px-10 lg:px-16 py-4 lg:py-6 text-[10px] lg:text-xs shadow-xl"
                            onClick={() => navigate(`/room/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                          >
                            RESERVE THIS SUITE
                          </GoldButton>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
              
              {!loading && filteredRooms.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center space-y-8"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10 text-gray-200" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-luxury-black mb-4">No Sanctuaries Available</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">All suites are currently reserved for the selected dates. Please consider alternative dates for your stay.</p>
                  </div>
                  <button 
                    onClick={() => setFilters({ type: 'All', priceRange: [0, 200000] })}
                    className="text-luxury-gold font-bold uppercase text-[10px] tracking-[0.4em] border-b-2 border-luxury-gold pb-2 hover:text-luxury-black transition-colors"
                  >
                    Reset Discovery Parameters
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
