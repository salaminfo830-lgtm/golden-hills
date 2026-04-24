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

  const filtersParam = searchParams.get('filters') || '';

  useEffect(() => {
    fetchAvailableRooms();
  }, [checkIn, checkOut, guests, typeFilter, maxPrice, sortBy, filtersParam]);

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
      
      // Filter by popular checkboxes (Breakfast, Cancellation, etc.)
      const activeFilters = filtersParam.split(',').filter(Boolean);
      const matchesPopular = activeFilters.length === 0 || activeFilters.every(f => {
        if (f === 'Breakfast Included') return room.breakfast_included || true; // Simulation if column missing
        if (f === 'Free Cancellation') return room.free_cancellation || true;
        if (f === 'No Prepayment') return room.no_prepayment || true;
        return true;
      });

      return matchesType && matchesPrice && matchesCapacity && matchesPopular;
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
    <div className="min-h-screen bg-[#F5F5F7] font-apple selection:bg-luxury-gold selection:text-white">
      {/* Top Search Banner (Booking.com style) */}
      <div className="bg-[#050B18] pt-28 pb-8 relative z-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-lg transition-all text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">Search Sanctuaries</h1>
          </div>

          <div className="bg-[#C9A84C] p-1.5 rounded-2xl flex flex-col md:flex-row gap-1.5 shadow-2xl">
            {/* Dates */}
            <div className="flex-1 bg-white rounded-xl px-4 py-3 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex-1 flex items-center">
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => handleSearchUpdate({ checkIn: e.target.value })}
                  className="bg-transparent text-sm font-bold text-[#050B18] outline-none cursor-pointer w-full"
                />
                <span className="text-gray-300 mx-2">—</span>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => handleSearchUpdate({ checkOut: e.target.value })}
                  className="bg-transparent text-sm font-bold text-[#050B18] outline-none cursor-pointer w-full"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="md:w-64 bg-white rounded-xl px-4 py-3 flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <select 
                value={guests}
                onChange={(e) => handleSearchUpdate({ guests: e.target.value })}
                className="bg-transparent text-sm font-bold text-[#050B18] outline-none cursor-pointer w-full appearance-none"
              >
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guests</option>)}
              </select>
            </div>

            {/* Search Button */}
            <button 
              onClick={fetchAvailableRooms}
              className="bg-[#050B18] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" /> Search
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar (Filters) */}
          <aside className="lg:w-[320px] shrink-0 space-y-4">
            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 relative h-32 cursor-pointer group flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-blue-900/20" />
               <button className="relative z-10 bg-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-gray-50">
                 <MapPin className="w-4 h-4 text-[#C9A84C]" /> Show on map
               </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-[#050B18]">Filter by:</h3>
              </div>

              <div className="p-6 space-y-8">
                {/* Your Budget */}
                <div>
                  <h4 className="font-bold text-sm text-[#050B18] mb-4">Your budget (per night)</h4>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      min="10000" 
                      max="200000" 
                      step="5000"
                      value={maxPrice}
                      onChange={(e) => handleSearchUpdate({ maxPrice: e.target.value })}
                      className="w-full accent-[#C9A84C] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">DZD 10,000</span>
                      <span className="font-bold text-[#C9A84C]">{formatPrice(maxPrice)}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Popular Filters */}
                <div>
                  <h4 className="font-bold text-sm text-[#050B18] mb-4">Popular filters</h4>
                  <div className="space-y-3">
                    {['Breakfast Included', 'Free Cancellation', 'No Prepayment'].map((filter, i) => {
                      const isActive = searchParams.get('filters')?.includes(filter);
                      return (
                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={isActive || false}
                            onChange={(e) => {
                              const current = searchParams.get('filters') ? searchParams.get('filters').split(',') : [];
                              if (e.target.checked) {
                                handleSearchUpdate({ filters: [...current, filter].join(',') });
                              } else {
                                handleSearchUpdate({ filters: current.filter(f => f !== filter).join(',') });
                              }
                            }}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${isActive ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-gray-300 group-hover:border-[#C9A84C]'}`}>
                            {isActive && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                          </div>
                          <span className="text-sm text-gray-700">{filter}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Room Type */}
                <div>
                  <h4 className="font-bold text-sm text-[#050B18] mb-4">Room Type</h4>
                  <div className="space-y-3">
                    {['All', 'Queen Room', 'King Suite', 'Multi-Bedroom Suite'].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="roomType"
                          checked={typeFilter === type}
                          onChange={() => handleSearchUpdate({ type })}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${typeFilter === type ? 'border-[#C9A84C]' : 'border-gray-300 group-hover:border-[#C9A84C]'}`}>
                          {typeFilter === type && <div className="w-2.5 h-2.5 bg-[#C9A84C] rounded-full" />}
                        </div>
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </aside>

          {/* Main Content (Results List) */}
          <main className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold text-[#050B18]">
                Setif: {rooms.length} properties found
              </h2>
              
              <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                <span className="pl-3 pr-2 text-sm text-gray-500 font-medium">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => handleSearchUpdate({ sortBy: e.target.value })}
                  className="bg-transparent text-sm font-bold text-[#050B18] outline-none cursor-pointer appearance-none py-2 pr-8 pl-2"
                >
                  <option value="price-low">Price (lowest first)</option>
                  <option value="price-high">Price (highest first)</option>
                  <option value="capacity">Highest Capacity</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-gray-200" />
                ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {rooms.map((room, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={room.id}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col md:flex-row"
                    >
                      {/* Left Image */}
                      <div className="md:w-72 h-64 md:h-auto relative shrink-0 cursor-pointer" onClick={() => navigate(`/room/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}>
                        <img 
                          src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} 
                          className="w-full h-full object-cover" 
                          alt={room.type} 
                        />
                        {i === 0 && (
                          <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                            Popular Choice
                          </div>
                        )}
                      </div>
                      
                      {/* Middle & Right Content Wrapper */}
                      <div className="p-4 md:p-5 flex-1 flex flex-col sm:flex-row gap-6">
                         
                         {/* Middle Details */}
                         <div className="flex-1 space-y-3 cursor-pointer" onClick={() => navigate(`/room/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}>
                            <div className="flex justify-between items-start">
                               <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-[#C9A84C] text-[#C9A84C]" />)}
                                  </div>
                                  <h3 className="text-xl font-bold text-[#006CE4] hover:text-[#004CB8] underline-offset-4">{room.type}</h3>
                                  <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-1">
                                     <span className="font-medium underline decoration-dotted">Setif City Center</span>
                                     <span className="text-gray-500">• 1.2 km from center</span>
                                  </div>
                               </div>
                            </div>

                            <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded-lg inline-block border border-gray-100">
                               <p className="font-bold mb-1">{room.capacity} Guests • Entire Suite</p>
                               <p>1 extra-large double bed • Private bathroom • Air conditioning</p>
                            </div>

                            <div className="space-y-1">
                               <p className="text-xs font-bold text-green-700">Free cancellation</p>
                               <p className="text-xs text-green-700">You can cancel later, so lock in this great price today!</p>
                               {i % 2 === 0 && (
                                  <p className="text-xs font-bold text-red-600 mt-1">Only {Math.floor(Math.random() * 3) + 1} left at this price on our site</p>
                               )}
                            </div>
                         </div>

                         {/* Right Pricing */}
                         <div className="sm:w-48 flex flex-col justify-between sm:items-end border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-4">
                            <div className="flex flex-row sm:flex-col justify-between sm:justify-start sm:items-end w-full gap-2">
                               <div className="flex items-center gap-2 bg-[#003B95] text-white p-1 rounded-lg">
                                  <div className="px-2 font-bold text-sm">9.4</div>
                                  <div className="pr-2 text-xs flex flex-col leading-tight">
                                     <span>Superb</span>
                                     <span className="font-normal text-[10px] text-white/80">142 reviews</span>
                                  </div>
                               </div>
                               
                               <div className="text-right mt-2">
                                  <p className="text-xs text-gray-500 mb-0.5">1 night, {guests} adults</p>
                                  <div className="flex items-center justify-end gap-2">
                                     <span className="text-sm text-red-600 line-through">{formatPrice(room.price * 1.2)}</span>
                                     <span className="text-xl font-bold text-[#050B18]">{formatPrice(room.price)}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">+DZD 2,000 taxes and charges</p>
                               </div>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/room/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
                              }}
                              className="w-full mt-4 bg-[#006CE4] hover:bg-[#004CB8] text-white py-2.5 px-4 rounded font-bold text-sm transition-colors shadow-sm"
                            >
                              See availability <ChevronRight className="w-4 h-4 inline" />
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {!loading && rooms.length === 0 && (
                <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#050B18]">No properties found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or search dates.</p>
                  <button 
                    onClick={() => handleSearchUpdate({ type: 'All', maxPrice: '200000' })}
                    className="mt-4 px-6 py-2 bg-[#006CE4] text-white rounded font-bold text-sm"
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
