import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, Filter, Calendar, Users, 
  ChevronRight, Star, Wind, Coffee,
  SlidersHorizontal, Loader2, ArrowLeft
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
  });

  const checkIn = searchParams.get('checkIn') || 'Today';
  const checkOut = searchParams.get('checkOut') || 'Tomorrow';
  const guests = searchParams.get('guests') || '2';

  useEffect(() => {
    fetchAvailableRooms();
  }, [searchParams]);

  const fetchAvailableRooms = async () => {
    setLoading(true);
    
    // Parse dates (default to next few days if missing)
    const startDate = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')).toISOString() : new Date().toISOString();
    const endDate = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')).toISOString() : new Date(Date.now() + 86400000).toISOString();

    // 1. Get all rooms
    const { data: allRooms, error: roomError } = await supabase
      .from('Room')
      .select('*, amenities:Amenity(*)')
      .order('price', { ascending: true });

    if (roomError) {
      console.error(roomError);
      setLoading(false);
      return;
    }

    // 2. Get reservations overlapping the requested dates
    // overlap if (start_a < end_b) AND (end_a > start_b)
    const { data: overlappingRes, error: resError } = await supabase
      .from('Reservation')
      .select('room_id')
      .filter('start_date', 'lt', endDate)
      .filter('end_date', 'gt', startDate);

    if (resError) {
      console.error(resError);
      setRooms(allRooms || []);
    } else {
      const reservedRoomIds = overlappingRes?.map(r => r.room_id).filter(id => id !== null) || [];
      const available = allRooms?.filter(room => !reservedRoomIds.includes(room.id)) || [];
      setRooms(available);
    }
    
    setLoading(false);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesType = filters.type === 'All' || room.type === filters.type;
    const matchesPrice = room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1];
    return matchesType && matchesPrice;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Search Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <Logo className="scale-75 origin-left" />
          </div>
          
          <div className="flex items-center gap-3 bg-gray-100/50 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-bold whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
              <span>{checkIn} — {checkOut}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-bold whitespace-nowrap">
              <Users className="w-3.5 h-3.5 text-luxury-gold" />
              <span>{guests} Guests</span>
            </div>
            <button className="p-2 bg-luxury-gold text-white rounded-xl hover:scale-105 transition-transform shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-32 md:pt-40 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-10 shrink-0">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Filter by Type</h3>
              <div className="space-y-3">
                {['All', 'Heritage Deluxe', 'Royal Gold Suite', 'Presidential Panorama'].map((type) => (
                  <button 
                    key={type}
                    onClick={() => setFilters({...filters, type})}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border ${
                      filters.type === type ? 'bg-white border-luxury-gold/30 text-luxury-gold shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm font-bold">{type}</span>
                    {filters.type === type && <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Price Range</h3>
              <div className="px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100000" 
                  step="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                  className="w-full accent-luxury-gold" 
                />
                <div className="flex justify-between mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span>0 DZD</span>
                  <span className="text-luxury-black font-bold">{formatPrice(filters.priceRange[1])}</span>
                </div>
              </div>
            </div>

            <GlassCard className="bg-luxury-black text-white p-8 border-0 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/20 rounded-full translate-x-16 -translate-y-16 blur-3xl group-hover:scale-125 transition-transform" />
              <p className="text-luxury-gold font-bold text-[10px] uppercase tracking-widest mb-2 relative z-10">Limited Offer</p>
              <h4 className="text-xl font-serif font-bold mb-4 relative z-10">Get 15% off <br />your first stay</h4>
              <p className="text-white/40 text-xs mb-6 relative z-10">Use code: GOLDEN26</p>
              <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-luxury-gold pb-1 relative z-10 hover:text-luxury-gold transition-colors">Learn more</button>
            </GlassCard>
          </aside>

          {/* Results Grid */}
          <main className="flex-1 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-serif font-bold text-luxury-black">Available Sanctuaries</h2>
                <p className="text-sm text-gray-400 font-medium">Found {filteredRooms.length} luxury options for your dates</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Sort by: <span className="text-luxury-black cursor-pointer hover:text-luxury-gold">Price Low to High</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse shadow-sm border border-gray-100" />
                ))
              ) : filteredRooms.map((room) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={room.id}
                >
                  <GlassCard className="group p-0 bg-white border-gray-100 overflow-hidden hover:shadow-2xl hover:border-luxury-gold/20 transition-all duration-500 cursor-pointer">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="md:w-1/3 relative overflow-hidden">
                        <img 
                          src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt={room.type} 
                        />
                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-luxury-gold">
                          {room.type}
                        </div>
                      </div>
                      
                      <div className="flex-1 p-8 md:p-10 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="flex items-center gap-1 text-luxury-gold mb-2">
                              <Star className="w-3 h-3 fill-current" />
                              <Star className="w-3 h-3 fill-current" />
                              <Star className="w-3 h-3 fill-current" />
                              <Star className="w-3 h-3 fill-current" />
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-luxury-black mb-2">{room.type}</h3>
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Up to 2 Guests</span>
                              <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> AC & Heating</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-luxury-gold">{formatPrice(room.price)}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">/ Night</p>
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
                          {room.description || 'Our heritage suites offer a sanctuary of calm, with gold-leaf accents and the finest Algerian marble. Experience the pinnacle of luxury.'}
                        </p>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-6">
                          <div className="flex gap-4">
                            {room.amenities?.slice(0, 3).map((amenity, i) => (
                              <div key={i} className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-luxury-gold border border-gray-100">
                                <Star className="w-4 h-4" />
                              </div>
                            ))}
                            {room.amenities?.length > 3 && (
                              <span className="text-[10px] font-bold text-gray-300 mt-2">+{room.amenities.length - 3} MORE</span>
                            )}
                          </div>
                          <GoldButton 
                            className="px-10 py-4 text-[10px] shadow-lg"
                            onClick={() => navigate(`/room/${room.id}`)}
                          >
                            SELECT THIS SANCTUARY
                          </GoldButton>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
              
              {!loading && filteredRooms.length === 0 && (
                <div className="py-20 text-center">
                  <h3 className="text-2xl font-serif font-bold text-gray-400 mb-4">No Sanctuaries Match Your Criteria</h3>
                  <button 
                    onClick={() => setFilters({ type: 'All', priceRange: [0, 200000] })}
                    className="text-luxury-gold font-bold uppercase text-[10px] tracking-widest border-b border-luxury-gold pb-1 hover:text-luxury-black transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
