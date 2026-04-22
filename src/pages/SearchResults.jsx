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
  });

  const checkIn = searchParams.get('checkIn') || 'Today';
  const checkOut = searchParams.get('checkOut') || 'Tomorrow';
  const guests = searchParams.get('guests') || '2';

  useEffect(() => {
    fetchAvailableRooms();
  }, [searchParams]);

  const fetchAvailableRooms = async () => {
    setLoading(true);
    const startDate = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')).toISOString() : new Date().toISOString();
    const endDate = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')).toISOString() : new Date(Date.now() + 86400000).toISOString();

    const { data: allRooms, error: roomError } = await supabase
      .from('Room')
      .select('*, amenities:Amenity(*)')
      .order('price', { ascending: true });

    if (roomError) {
      setLoading(false);
      return;
    }

    const { data: overlappingRes } = await supabase
      .from('Reservation')
      .select('room_id')
      .filter('start_date', 'lt', endDate)
      .filter('end_date', 'gt', startDate);

    const reservedRoomIds = overlappingRes?.map(r => r.room_id).filter(id => id !== null) || [];
    const available = allRooms?.filter(room => !reservedRoomIds.includes(room.id)) || [];
    setRooms(available);
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
    <div className="min-h-screen bg-luxury-cream/30 selection:bg-luxury-gold selection:text-white">
      {/* Search Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-b border-luxury-gold/10 py-6">
        <div className="container mx-auto px-8 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 w-full lg:w-auto">
            <Link to="/" className="p-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <Logo className="scale-90 origin-left" />
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50/80 p-2 rounded-3xl w-full lg:w-auto border border-gray-100">
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-xs font-bold whitespace-nowrap">
              <Calendar className="w-4 h-4 text-luxury-gold" />
              <span className="text-luxury-black">{checkIn} — {checkOut}</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-xs font-bold whitespace-nowrap">
              <Users className="w-4 h-4 text-luxury-gold" />
              <span className="text-luxury-black">{guests} Guests</span>
            </div>
            <button className="h-12 w-12 bg-luxury-gold text-white rounded-2xl hover:scale-105 transition-all shadow-lg flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 pt-44 pb-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-12 shrink-0">
            <div className="sticky top-44">
              <div className="space-y-12">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" /> Suite Categories
                  </h3>
                  <div className="space-y-3">
                    {['All', 'Classic Room', 'Junior Suite', 'Senior Suite', 'Royal Suite'].map((type) => (
                      <button 
                        key={type}
                        onClick={() => setFilters({...filters, type})}
                        className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all border-2 ${
                          filters.type === type ? 'bg-white border-luxury-gold text-luxury-gold shadow-xl' : 'bg-white/50 border-gray-100 text-gray-500 hover:border-luxury-gold/30'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-widest">{type}</span>
                        {filters.type === type && <Sparkles className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
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
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Min: 0 DZD</span>
                      <span className="text-xs font-bold text-luxury-gold uppercase tracking-widest underline decoration-2 underline-offset-4">{formatPrice(filters.priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <GlassCard className="bg-luxury-black text-white p-10 border-0 relative overflow-hidden group rounded-[2.5rem]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-luxury-gold/20 rounded-full translate-x-20 -translate-y-20 blur-3xl group-hover:scale-150 transition-all duration-1000" />
                  <div className="relative z-10 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-luxury-gold/20 flex items-center justify-center border border-luxury-gold/30">
                      <ShieldCheck className="text-luxury-gold w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif font-bold mb-2">Gilded Privilege</h4>
                      <p className="text-white/40 text-xs leading-relaxed">Members enjoy 15% lower rates and complimentary late check-out.</p>
                    </div>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold hover:border-luxury-gold transition-all">JOIN MEMBERSHIP</button>
                  </div>
                </GlassCard>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="text-5xl font-serif font-bold text-luxury-black mb-4">Discovery</h2>
                <p className="text-gray-400 font-medium text-lg">Found {filteredRooms.length} available sanctuaries for your dates.</p>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-sm">
                Sort by <ChevronRight className="w-4 h-4 text-luxury-gold" /> <span className="text-luxury-black cursor-pointer hover:text-luxury-gold transition-colors">Lowest Price</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-[450px] bg-white rounded-[3rem] animate-pulse shadow-sm border border-gray-100" />
                ))
              ) : filteredRooms.map((room, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={room.id}
                >
                  <GlassCard className="group p-0 bg-white border-gray-100 overflow-hidden hover:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] hover:border-luxury-gold/30 transition-all duration-700 cursor-pointer rounded-[3rem]">
                    <div className="flex flex-col lg:flex-row h-full">
                      <div className="lg:w-[40%] relative overflow-hidden h-[300px] lg:h-auto">
                        <img 
                          src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                          alt={room.type} 
                        />
                        <div className="absolute top-8 left-8 px-6 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold border border-luxury-gold/10">
                          {room.type}
                        </div>
                        <div className="absolute bottom-8 left-8 flex gap-2">
                           {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-luxury-gold fill-current" />)}
                        </div>
                      </div>
                      
                      <div className="flex-1 p-10 lg:p-14 flex flex-col justify-between">
                        <div className="space-y-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-4xl font-serif font-bold text-luxury-black mb-4">{room.type}</h3>
                              <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-luxury-gold" /> {room.capacity || 2} Guests</span>
                                <span className="flex items-center gap-2"><Wind className="w-4 h-4 text-luxury-gold" /> Climate Controlled</span>
                                <span className="flex items-center gap-2 text-green-600"><CheckCircle className="w-4 h-4" /> Free Cancellation</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-4xl font-serif font-bold text-luxury-gold mb-1">{formatPrice(room.price)}</p>
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Per Evening</p>
                            </div>
                          </div>

                          <p className="text-gray-500 text-lg leading-relaxed line-clamp-2 italic">
                            {room.description || 'Experience a sanctuary where timeless Algerian elegance meets modern 5-star refinement.'}
                          </p>

                          {/* Urgency Badge */}
                          <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-50 border border-orange-100 rounded-2xl text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                             <AlertCircle className="w-4 h-4 animate-pulse" /> Only {Math.floor(Math.random() * 3) + 1} Suites left at this rate
                          </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-gray-50 flex flex-wrap items-center justify-between gap-10">
                          <div className="flex gap-6">
                            {['Wind', 'Coffee', 'Waves'].map((iconName, idx) => (
                              <div key={idx} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-luxury-gold border border-gray-100 hover:bg-luxury-gold/10 hover:border-luxury-gold transition-colors">
                                <Wind className="w-5 h-5" />
                              </div>
                            ))}
                          </div>
                          <GoldButton 
                            className="px-16 py-6 text-xs shadow-xl hover:scale-105 transition-all"
                            onClick={() => navigate(`/room/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                          >
                            RESERVE THIS SUITE
                          </GoldButton>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
              
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

const CheckCircle = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default SearchResults;
