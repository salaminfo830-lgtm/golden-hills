import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Calendar, Settings, LogOut, 
  ChevronRight, Star, MapPin, Phone, 
  Mail, ShieldCheck, Sparkles, Clock,
  LayoutDashboard, CreditCard, Bell,
  MessageSquare, Loader2, Compass,
  Gift, Heart, Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';

const GuestDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('Profile')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // Fetch Bookings (Using Guest table link)
      const { data: guestData } = await supabase
        .from('Guest')
        .select('id')
        .eq('email', user.email)
        .single();

      if (guestData) {
        const { data: reservations } = await supabase
          .from('Reservation')
          .select('*, room:Room(*)')
          .eq('guest_id', guestData.id)
          .order('start_date', { ascending: false });
        setBookings(reservations || []);
      }

      setLoading(false);
    };
    getData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-luxury-cream">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-cream/20 flex font-apple">
      {/* Gilded Sidebar */}
      <aside className="hidden lg:flex w-80 bg-luxury-black flex-col border-r border-white/5">
        <div className="p-10">
          <Logo inverse className="scale-90 origin-left" />
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'overview', label: 'Sanctuary Overview', icon: LayoutDashboard },
            { id: 'bookings', label: 'My Reservations', icon: Calendar },
            { id: 'rewards', label: 'Gilded Rewards', icon: Gift },
            { id: 'concierge', label: 'Concierge Chat', icon: MessageSquare },
            { id: 'settings', label: 'Profile Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all text-xs font-bold uppercase tracking-[0.2em] ${
                activeTab === item.id 
                ? 'bg-luxury-gold text-white shadow-gold' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-[1.5rem] bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-12 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-1">Member Portal</h2>
            <h1 className="text-2xl font-serif font-bold text-luxury-black">Welcome Back, {profile?.full_name?.split(' ')[0] || 'Guest'}</h1>
          </div>
          <div className="flex items-center gap-8">
            <button className="relative p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-luxury-gold rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
               <div className="text-right">
                  <p className="text-xs font-bold text-luxury-black">{profile?.full_name}</p>
                  <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest italic">Gilded Member</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-luxury-gold flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                  {profile?.full_name?.[0]}
               </div>
            </div>
          </div>
        </header>

        <div className="p-12 max-w-7xl">
           <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <GlassCard className="bg-white p-8 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                           <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Stays</p>
                           <h3 className="text-4xl font-serif font-bold text-luxury-black">{bookings.length}</h3>
                        </div>
                     </GlassCard>
                     <GlassCard className="bg-luxury-black p-8 space-y-6 text-white border-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full blur-3xl translate-x-16 -translate-y-16" />
                        <div className="w-12 h-12 rounded-2xl bg-luxury-gold flex items-center justify-center text-white">
                           <Gift className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Rewards Balance</p>
                           <h3 className="text-4xl font-serif font-bold text-luxury-gold">4,850 <span className="text-xs uppercase tracking-widest ml-2 font-sans font-bold">Points</span></h3>
                        </div>
                     </GlassCard>
                     <GlassCard className="bg-white p-8 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                           <Star className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status Tier</p>
                           <h3 className="text-4xl font-serif font-bold text-luxury-black">Gilded</h3>
                        </div>
                     </GlassCard>
                  </div>

                  {/* Next Stay Card */}
                  <div className="space-y-8">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" /> Upcoming Sanctuary Access
                     </h3>
                     
                     {bookings.filter(b => new Date(b.start_date) > new Date()).length > 0 ? (
                       <GlassCard className="bg-white p-0 overflow-hidden border-luxury-gold/10">
                          <div className="flex flex-col lg:flex-row">
                             <div className="lg:w-1/3 aspect-video lg:aspect-auto">
                                <img src={bookings.find(b => new Date(b.start_date) > new Date())?.room?.image_url || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070"} className="w-full h-full object-cover" alt="Suite" />
                             </div>
                             <div className="flex-1 p-10 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <h4 className="text-3xl font-serif font-bold text-luxury-black mb-2">{bookings[0].room_type}</h4>
                                      <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                         <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-luxury-gold" /> Golden Hills Setif</span>
                                         <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-luxury-gold" /> Check-in at 14:00</span>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="px-6 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">Confirmed</div>
                                   </div>
                                </div>

                                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-gray-50">
                                   <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Arrival</p>
                                      <p className="font-bold text-luxury-black">{new Date(bookings[0].start_date).toLocaleDateString()}</p>
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Departure</p>
                                      <p className="font-bold text-luxury-black">{new Date(bookings[0].end_date).toLocaleDateString()}</p>
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Guests</p>
                                      <p className="font-bold text-luxury-black">{bookings[0].guests_count} Personnel</p>
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmation</p>
                                      <p className="font-bold text-luxury-gold">#GHE-{bookings[0].id.toString().substr(0,6).toUpperCase()}</p>
                                   </div>
                                </div>

                                <div className="mt-10 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 flex items-center justify-center text-luxury-gold"><ShieldCheck className="w-5 h-5" /></div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium Check-in Enabled</p>
                                   </div>
                                   <GoldButton className="px-10 py-4 text-[10px]">MODIFY RESERVATION</GoldButton>
                                </div>
                             </div>
                          </div>
                       </GlassCard>
                     ) : (
                       <GlassCard className="bg-white p-20 text-center space-y-8">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                             <Compass className="w-10 h-10 text-gray-200" />
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-2xl font-serif font-bold text-luxury-black">No Active Journeys</h4>
                             <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium">Your sanctuary awaits. Discover our latest suites for your next visit.</p>
                          </div>
                          <GoldButton className="px-12 py-5 text-[10px]" onClick={() => navigate('/search')}>EXPLORE SUITES</GoldButton>
                       </GlassCard>
                     )}
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-8">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" /> Exclusive Experiences for You
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group relative aspect-video rounded-[3rem] overflow-hidden cursor-pointer shadow-xl">
                           <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Spa" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                              <p className="text-luxury-gold font-bold text-[10px] uppercase tracking-widest mb-3">Wellness</p>
                              <h4 className="text-3xl font-serif font-bold text-white mb-4">Gilded Hammam Ritual</h4>
                              <p className="text-white/60 text-sm font-medium mb-6">Enjoy a private traditional session with member-exclusive aromatherapy.</p>
                              <div className="flex items-center gap-3 text-white font-bold text-[10px] uppercase tracking-widest">
                                 Book Experience <ArrowRight className="w-4 h-4 text-luxury-gold" />
                              </div>
                           </div>
                        </div>
                        <div className="group relative aspect-video rounded-[3rem] overflow-hidden cursor-pointer shadow-xl">
                           <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Dining" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                              <p className="text-luxury-gold font-bold text-[10px] uppercase tracking-widest mb-3">Gastronomy</p>
                              <h4 className="text-3xl font-serif font-bold text-white mb-4">Chef's Table: Setif Flavors</h4>
                              <p className="text-white/60 text-sm font-medium mb-6">A curated 7-course journey through authentic Algerian cuisine.</p>
                              <div className="flex items-center gap-3 text-white font-bold text-[10px] uppercase tracking-widest">
                                 Reserve Table <ArrowRight className="w-4 h-4 text-luxury-gold" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="flex justify-between items-center">
                     <h3 className="text-4xl font-serif font-bold text-luxury-black">Reservation History</h3>
                     <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all">All Stays</button>
                        <button className="px-6 py-3 bg-white/50 text-gray-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-transparent hover:border-gray-100 transition-all">Archived</button>
                     </div>
                  </div>

                  <div className="space-y-6">
                     {bookings.length > 0 ? bookings.map((booking) => (
                       <GlassCard key={booking.id} className="bg-white p-8 group hover:border-luxury-gold/30 transition-all duration-500">
                          <div className="flex items-center gap-10">
                             <div className="w-24 h-24 rounded-[2rem] overflow-hidden shrink-0 border border-gray-100">
                                <img src={booking.room?.image_url || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070"} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8">
                                <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suite Type</p>
                                   <p className="font-bold text-luxury-black">{booking.room_type}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dates</p>
                                   <p className="font-bold text-luxury-black">{new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Stay</p>
                                   <p className="font-bold text-luxury-black font-serif">{formatPrice(booking.total_price)}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                   <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                                      booking.status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                   }`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                      {booking.status}
                                   </div>
                                </div>
                             </div>
                             <div className="flex gap-4">
                                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all"><Heart className="w-5 h-5" /></button>
                                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-luxury-black hover:bg-gray-100 transition-all"><ChevronRight className="w-5 h-5" /></button>
                             </div>
                          </div>
                       </GlassCard>
                     )) : (
                       <div className="py-20 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                          <p className="text-gray-400 font-medium italic">Your history is currently empty. Start your journey today.</p>
                       </div>
                     )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-4xl"
                >
                  <div className="space-y-12">
                     <div className="space-y-4">
                        <h3 className="text-4xl font-serif font-bold text-luxury-black">Identity Portal</h3>
                        <p className="text-gray-400 font-medium text-lg italic">"Manage your personal credentials and gilded preferences."</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1 space-y-6">
                           <div className="aspect-square rounded-[3rem] bg-luxury-gold flex items-center justify-center text-white text-8xl font-serif font-bold shadow-2xl relative group cursor-pointer overflow-hidden">
                              {profile?.full_name?.[0]}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <span className="text-[10px] font-bold uppercase tracking-widest">Update Portrait</span>
                              </div>
                           </div>
                           <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">Gilded Member Since 2026</p>
                        </div>
                        <div className="md:col-span-2 space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Full Name</label>
                                 <input type="text" value={profile?.full_name} className="input-luxury w-full h-16" readOnly />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Email Address</label>
                                 <input type="email" value={user?.email} className="input-luxury w-full h-16" readOnly />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Mobile Phone</label>
                              <input type="tel" value="+213 550 44 88 22" className="input-luxury w-full h-16" readOnly />
                           </div>
                           <div className="pt-8 flex gap-6 border-t border-gray-100">
                              <GoldButton className="px-12 py-5 text-[10px]">SAVE CHANGES</GoldButton>
                              <button className="px-12 py-5 bg-white border border-gray-100 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center gap-3">
                                 <Trash2 className="w-4 h-4" /> Deactivate Account
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default GuestDashboard;
