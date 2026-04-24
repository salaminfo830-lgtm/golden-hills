import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Calendar, Settings, LogOut, 
  ChevronRight, Star, MapPin, Phone, 
  Mail, ShieldCheck, Sparkles, Clock,
  LayoutDashboard, CreditCard, Bell,
  MessageSquare, Loader2, Compass,
  Gift, Heart, Trash2, Menu, X,
  Camera, CheckCircle2, AlertCircle,
  HelpCircle, CreditCard as CardIcon,
  ArrowRight, Waves, Coffee
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';

const GuestDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [guest, setGuest] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    email: ''
  });

  const fetchData = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      navigate('/login');
      return;
    }
    setUser(authUser);

    // Fetch Profile & Guest data
    const [profileRes, guestRes] = await Promise.all([
      supabase.from('Profile').select('*').eq('id', authUser.id).maybeSingle(),
      supabase.from('Guest').select('*').eq('id', authUser.id).maybeSingle()
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setEditForm(prev => ({ 
        ...prev, 
        full_name: profileRes.data.full_name || '',
        email: authUser.email || '' 
      }));
    }

    if (guestRes.data) {
      setGuest(guestRes.data);
      setEditForm(prev => ({ ...prev, phone: guestRes.data.phone || '' }));
    }

    // Fetch Reservations
    const { data: reservations } = await supabase
      .from('Reservation')
      .select('*, room:Room(*)')
      .eq('guest_id', authUser.id)
      .order('created_at', { ascending: false });
    
    setBookings(reservations || []);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    let reservationSubscription;
    
    const setupSubscription = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        reservationSubscription = supabase
          .channel('guest_reservations')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'Reservation',
            filter: `guest_id=eq.${authUser.id}`
          }, () => fetchData())
          .subscribe();
      }
    };

    setupSubscription();

    return () => {
      if (reservationSubscription) supabase.removeChannel(reservationSubscription);
    };
  }, [fetchData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error: profileError } = await supabase
        .from('Profile')
        .update({ full_name: editForm.full_name })
        .eq('id', user.id);

      const { error: guestError } = await supabase
        .from('Guest')
        .update({ 
          full_name: editForm.full_name,
          phone: editForm.phone 
        })
        .eq('id', user.id);

      if (profileError || guestError) throw new Error("Update Protocol Failed");

      setNotification({ type: 'success', message: 'Identity credentials updated successfully.' });
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('dz-DZ', { style: 'currency', currency: 'DZD' }).format(amount);
  };

  const getPoints = () => {
    return bookings.reduce((acc, b) => acc + Math.floor(b.total_price / 1000), 0);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Sanctuary Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Reservations', icon: Calendar },
    { id: 'rewards', label: 'Gilded Rewards', icon: Gift },
    { id: 'concierge', label: 'Concierge Protocol', icon: MessageSquare },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex overflow-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-luxury-black/60 backdrop-blur-md z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 w-80 bg-luxury-black z-[70] transition-transform duration-500
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col border-r border-white/5
      `}>
        <div className="p-10 flex justify-between items-center">
          <Logo inverse className="scale-90 origin-left" />
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all text-[10px] font-bold uppercase tracking-[0.3em] ${
                activeTab === item.id 
                ? 'bg-luxury-gold text-white shadow-2xl shadow-luxury-gold/20' 
                : 'text-white/30 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 space-y-4">
          <Link to="/" className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 text-white/40 hover:text-luxury-gold transition-all text-[9px] font-bold uppercase tracking-[0.3em]">
            <Compass className="w-4 h-4" /> Public Portal
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 transition-all hover:text-white text-[9px] font-bold uppercase tracking-[0.3em]"
          >
            <LogOut className="w-4 h-4" /> End Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-[#FDFBF7]">
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-6 lg:px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-gray-50 rounded-xl">
              <Menu className="w-6 h-6 text-luxury-black" />
            </button>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-1">GHE Member Hub</p>
              <h1 className="text-xl lg:text-2xl font-serif font-bold text-luxury-black">Hello, {profile?.full_name?.split(' ')[0] || 'Member'}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <button className="relative p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-luxury-gold rounded-full border-2 border-white shadow-sm" />
            </button>
            
            <div className="h-10 w-px bg-gray-100" />

            <div className="flex items-center gap-4 pl-2 lg:pl-4">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-luxury-black leading-tight">{profile?.full_name}</p>
                  <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em] italic">Gilded Status</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-luxury-gold flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg rotate-3">
                  {profile?.full_name?.[0]}
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <div className="p-6 lg:p-12 max-w-7xl mx-auto min-h-full pb-24">
           {notification && (
             <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className={`mb-10 p-6 rounded-2xl flex items-center gap-4 border ${notification.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}
             >
               {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
               <p className="text-[10px] font-bold uppercase tracking-widest">{notification.message}</p>
             </motion.div>
           )}

           <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-16"
                >
                  {/* Stats Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <GlassCard className="bg-white p-8 space-y-6 group hover:border-luxury-gold/30 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-luxury-gold/5 flex items-center justify-center text-luxury-gold border border-luxury-gold/10 group-hover:bg-luxury-gold group-hover:text-white transition-all">
                           <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-1">Stay History</p>
                           <h3 className="text-4xl font-serif font-bold text-luxury-black">{bookings.length} <span className="text-sm font-sans font-medium text-gray-300">Sanctuaries</span></h3>
                        </div>
                     </GlassCard>
                     <GlassCard className="bg-luxury-black p-8 space-y-6 text-white border-0 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-luxury-gold/10 rounded-full blur-3xl translate-x-16 -translate-y-16 group-hover:bg-luxury-gold/20 transition-all" />
                        <div className="w-14 h-14 rounded-2xl bg-luxury-gold flex items-center justify-center text-white shadow-xl shadow-luxury-gold/20">
                           <Gift className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-1">Gilded Balance</p>
                           <h3 className="text-4xl font-serif font-bold text-luxury-gold">{getPoints().toLocaleString()} <span className="text-[10px] uppercase tracking-[0.3em] ml-2 font-sans font-bold text-white/60">Points</span></h3>
                        </div>
                     </GlassCard>
                     <GlassCard className="bg-white p-8 space-y-6 border-luxury-gold/10 relative">
                        <div className="w-14 h-14 rounded-2xl bg-luxury-gold/5 flex items-center justify-center text-luxury-gold border border-luxury-gold/10">
                           <Star className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-1">Member Status</p>
                           <h3 className="text-4xl font-serif font-bold text-luxury-black">Gilded Elite</h3>
                        </div>
                        <div className="absolute top-8 right-8">
                           <Sparkles className="w-6 h-6 text-luxury-gold animate-pulse" />
                        </div>
                     </GlassCard>
                  </div>

                  {/* Next Stay */}
                  <div className="space-y-10">
                     <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-gray-400 flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-luxury-gold shadow-gold" /> Active Sanctuary Access
                        </h3>
                        {bookings.length > 0 && <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest hover:underline">View All Reservations</button>}
                     </div>
                     
                     {bookings.filter(b => new Date(b.end_date) >= new Date()).length > 0 ? (
                       <GlassCard className="bg-white p-0 overflow-hidden border-luxury-gold/10 shadow-2xl">
                          <div className="flex flex-col lg:flex-row">
                             <div className="lg:w-2/5 aspect-[4/3] lg:aspect-auto relative">
                                <img 
                                  src={bookings.find(b => new Date(b.end_date) >= new Date())?.room?.image_url || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070"} 
                                  className="w-full h-full object-cover" 
                                  alt="Suite" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10 lg:hidden">
                                   <h4 className="text-3xl font-serif font-bold text-white">{bookings[0].room_type}</h4>
                                </div>
                             </div>
                             <div className="flex-1 p-8 lg:p-14 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                   <div className="hidden lg:block">
                                      <h4 className="text-4xl font-serif font-bold text-luxury-black mb-4 tracking-tight">{bookings[0].room_type}</h4>
                                      <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                         <span className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-luxury-gold" /> Golden Hills Sétif</span>
                                         <span className="flex items-center gap-2.5"><Clock className="w-4 h-4 text-luxury-gold" /> Sanctuary Entry 14:00</span>
                                         <span className="flex items-center gap-2.5 text-luxury-gold"><ShieldCheck className="w-4 h-4" /> Verified Presence</span>
                                      </div>
                                   </div>
                                   <div className="text-right w-full lg:w-auto">
                                      <div className={`
                                        px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border
                                        ${bookings[0].status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}
                                      `}>
                                        {bookings[0].status}
                                      </div>
                                   </div>
                                </div>

                                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-y border-gray-50">
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ritual Arrival</p>
                                      <p className="text-lg font-bold text-luxury-black">{new Date(bookings[0].start_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                   </div>
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grand Departure</p>
                                      <p className="text-lg font-bold text-luxury-black">{new Date(bookings[0].end_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                   </div>
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guest Count</p>
                                      <p className="text-lg font-bold text-luxury-black">{bookings[0].guests_count} Elite Guest{bookings[0].guests_count > 1 ? 's' : ''}</p>
                                   </div>
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registry Key</p>
                                      <p className="text-lg font-bold text-luxury-gold tracking-widest">#GH-{bookings[0].id.toString().substr(0,8).toUpperCase()}</p>
                                   </div>
                                </div>

                                <div className="mt-12 flex flex-col sm:flex-row items-center gap-8">
                                   <GoldButton className="w-full sm:w-auto px-12 py-5 text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl">
                                      MANAGE PROTOCOL <ChevronRight className="w-4 h-4" />
                                   </GoldButton>
                                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/10">
                                      <HelpCircle className="w-5 h-5 text-luxury-gold" />
                                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Need assistance with your stay?</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </GlassCard>
                     ) : (
                       <GlassCard className="bg-white p-24 text-center space-y-10 border-dashed border-2 border-gray-100">
                          <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto rotate-12 transition-transform hover:rotate-0">
                             <Compass className="w-10 h-10 text-gray-200" />
                          </div>
                          <div className="space-y-3">
                             <h4 className="text-3xl font-serif font-bold text-luxury-black">The Sanctuary is Silent</h4>
                             <p className="text-gray-400 max-sm mx-auto text-base font-medium italic">"No journeys currently scheduled. Your gilded retreat awaits discovery."</p>
                          </div>
                          <GoldButton className="px-14 py-6 text-[10px] tracking-[0.4em]" onClick={() => navigate('/search')}>INITIATE NEW JOURNEY</GoldButton>
                       </GlassCard>
                     )}
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                     <div>
                        <h3 className="text-4xl font-serif font-bold text-luxury-black">Registry Ledger</h3>
                        <p className="text-gray-400 font-medium italic">A complete chronicle of your presence at Golden Hills.</p>
                     </div>
                     <div className="flex gap-4 w-full sm:w-auto">
                        <div className="flex-1 sm:flex-none px-8 py-4 bg-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] border border-luxury-gold text-luxury-gold flex items-center justify-center">All Stays</div>
                        <div className="flex-1 sm:flex-none px-8 py-4 bg-white/50 text-gray-400 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] border border-transparent hover:border-gray-100 transition-all flex items-center justify-center cursor-pointer">Invoices</div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     {bookings.length > 0 ? bookings.map((booking) => (
                       <GlassCard key={booking.id} className="bg-white p-8 group hover:border-luxury-gold/30 transition-all duration-700 relative overflow-hidden">
                          <div className="flex flex-col lg:flex-row items-center gap-10">
                             <div className="w-full lg:w-32 h-32 rounded-[2.5rem] overflow-hidden shrink-0 border border-gray-100 shadow-sm relative group">
                                <img src={booking.room?.image_url || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070"} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-125" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                             </div>
                             
                             <div className="flex-1 grid grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-12">
                                <div className="space-y-1">
                                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">Suite Architecture</p>
                                   <p className="font-bold text-luxury-black text-lg">{booking.room_type}</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">Temporal Window</p>
                                   <p className="font-bold text-luxury-black">{new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">Settlement</p>
                                   <p className="font-bold text-luxury-black text-lg">{formatCurrency(booking.total_price)}</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">Ledger Status</p>
                                   <div className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border shadow-sm ${
                                      booking.status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                   }`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-400'}`} />
                                      {booking.status}
                                   </div>
                                </div>
                             </div>
                             
                             <div className="flex gap-4 w-full lg:w-auto">
                                <button className="flex-1 lg:flex-none p-5 bg-gray-50 rounded-2xl text-gray-400 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all border border-transparent hover:border-luxury-gold/10"><Heart className="w-5 h-5 mx-auto" /></button>
                                <button className="flex-1 lg:flex-none p-5 bg-gray-50 rounded-2xl text-gray-400 hover:text-luxury-black hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"><ChevronRight className="w-5 h-5 mx-auto" /></button>
                             </div>
                          </div>
                       </GlassCard>
                     )) : (
                       <div className="py-32 text-center bg-white/50 rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
                          <Compass className="w-12 h-12 text-gray-200" />
                          <p className="text-gray-400 font-medium italic text-lg">Your history is currently empty. Start your journey today.</p>
                          <GoldButton className="px-12 py-5 text-[10px]" onClick={() => navigate('/search')}>EXPLORE SUITES</GoldButton>
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
                  className="max-w-5xl"
                >
                  <div className="space-y-16">
                     <div className="space-y-4">
                        <h3 className="text-4xl font-serif font-bold text-luxury-black">Identity Ledger</h3>
                        <p className="text-gray-400 font-medium text-lg italic">"Manage your personal credentials and gilded preferences for future stay protocols."</p>
                     </div>

                     <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-12 gap-16">
                        <div className="md:col-span-4 space-y-8">
                           <div className="aspect-square rounded-[4rem] bg-luxury-gold flex items-center justify-center text-white text-9xl font-serif font-bold shadow-2xl relative group cursor-pointer overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-700">
                              {profile?.full_name?.[0]}
                              <div className="absolute inset-0 bg-luxury-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                 <Camera className="w-10 h-10 text-luxury-gold" />
                                 <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Update Portrait</span>
                              </div>
                           </div>
                           <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 space-y-6">
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                 <span>Membership Level</span>
                                 <span className="text-luxury-gold">Elite Gilded</span>
                              </div>
                              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                 <div className="h-full w-[75%] bg-luxury-gold rounded-full" />
                              </div>
                              <p className="text-[10px] text-center text-gray-300 font-bold uppercase tracking-[0.3em]">750 Points to Next Tier</p>
                           </div>
                        </div>

                        <div className="md:col-span-8 space-y-12">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                              <div className="space-y-4">
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.5em] pl-2">Full Legal Name</label>
                                 <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                                    <input 
                                      type="text" 
                                      value={editForm.full_name} 
                                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                                      className="input-luxury w-full h-16 pl-16 rounded-2xl bg-white border-gray-100 focus:border-luxury-gold transition-all outline-none font-bold text-sm" 
                                      required
                                    />
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.5em] pl-2">Digital Address</label>
                                 <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 transition-colors" />
                                    <input 
                                      type="email" 
                                      value={editForm.email} 
                                      className="input-luxury w-full h-16 pl-16 rounded-2xl bg-gray-50 border-transparent cursor-not-allowed font-bold text-sm text-gray-400" 
                                      readOnly 
                                    />
                                 </div>
                                 <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pl-2">Protocol: Email change requires verified support</p>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.5em] pl-2">Mobile Sanctuary Line</label>
                              <div className="relative group">
                                 <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                                 <input 
                                   type="tel" 
                                   value={editForm.phone} 
                                   onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                   className="input-luxury w-full h-16 pl-16 rounded-2xl bg-white border-gray-100 focus:border-luxury-gold transition-all outline-none font-bold text-sm" 
                                   placeholder="+213 --- --- ---"
                                 />
                              </div>
                           </div>
                           
                           <div className="pt-10 flex flex-col sm:flex-row gap-6 border-t border-gray-50">
                              <GoldButton type="submit" disabled={submitting} className="flex-1 py-6 text-[10px] tracking-[0.3em] shadow-xl flex items-center justify-center gap-4">
                                 {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>UPDATE IDENTITY PROTOCOL <ShieldCheck className="w-5 h-5" /></>}
                              </GoldButton>
                              <button type="button" className="px-12 py-6 bg-white border border-red-100 text-red-400 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 group">
                                 <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> TERMINATE ACCOUNT
                              </button>
                           </div>
                        </div>
                     </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'rewards' && (
                <motion.div
                  key="rewards"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-16"
                >
                  <div className="flex flex-col lg:flex-row gap-12">
                     <div className="lg:w-1/3 space-y-8">
                        <GlassCard className="bg-luxury-black p-10 text-white border-0 relative overflow-hidden h-full flex flex-col justify-between min-h-[400px]">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                           <div className="relative z-10 space-y-8">
                              <div className="w-16 h-16 rounded-3xl bg-luxury-gold flex items-center justify-center shadow-2xl">
                                 <Sparkles className="w-8 h-8 text-white" />
                              </div>
                              <div className="space-y-2">
                                 <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Gilded Balance</p>
                                 <h3 className="text-6xl font-serif font-bold text-luxury-gold">{getPoints().toLocaleString()}</h3>
                                 <p className="text-xs font-bold text-white/60 uppercase tracking-widest italic">Points Available for Redemption</p>
                              </div>
                           </div>
                           <div className="relative z-10 pt-12 border-t border-white/5 space-y-6">
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                 <span className="text-white/40">Next Tier: Platinum</span>
                                 <span className="text-luxury-gold">Level 4</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full w-[60%] bg-luxury-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                              </div>
                           </div>
                        </GlassCard>
                     </div>
                     
                     <div className="lg:w-2/3 space-y-10">
                        <div className="space-y-2">
                           <h3 className="text-4xl font-serif font-bold text-luxury-black">Ritual Rewards</h3>
                           <p className="text-gray-400 font-medium italic">Exclusive protocols available for your point redemption.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           {[
                             { title: 'Spa Sanctuary Access', points: 500, icon: Waves, sub: 'Private 60min Hammam' },
                             { title: 'Epicurean Breakfast', points: 300, icon: Coffee, sub: 'In-Suite Signature Menu' },
                             { title: 'Airport Limousine', points: 800, icon: MapPin, sub: 'Private Chauffeur Service' },
                             { title: 'Suite Upgrade', points: 1500, icon: Sparkles, sub: 'Next Available Tier' }
                           ].map((item, i) => (
                             <GlassCard key={i} className="bg-white p-8 group hover:border-luxury-gold/30 transition-all flex flex-col justify-between">
                                <div className="space-y-6">
                                   <div className="flex justify-between items-start">
                                      <div className="w-12 h-12 rounded-2xl bg-luxury-gold/5 flex items-center justify-center text-luxury-gold border border-luxury-gold/10 group-hover:bg-luxury-gold group-hover:text-white transition-all">
                                         <item.icon className="w-6 h-6" />
                                      </div>
                                      <div className="text-right">
                                         <p className="text-xl font-serif font-bold text-luxury-black">{item.points}</p>
                                         <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Points Required</p>
                                      </div>
                                   </div>
                                   <div className="space-y-1">
                                      <h5 className="text-lg font-bold text-luxury-black">{item.title}</h5>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.sub}</p>
                                   </div>
                                </div>
                                <button className="mt-8 w-full py-4 bg-gray-50 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-all">Redeem Protocol</button>
                             </GlassCard>
                           ))}
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'concierge' && (
                <motion.div
                  key="concierge"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-6xl h-[700px] flex flex-col"
                >
                  <GlassCard className="flex-1 bg-white p-0 overflow-hidden border-luxury-gold/10 flex flex-col shadow-2xl rounded-[3rem]">
                     <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-[#FDFBF7]/50">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-2xl bg-luxury-black flex items-center justify-center text-luxury-gold relative">
                              <Logo inverse className="scale-50" />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                           </div>
                           <div>
                              <h4 className="text-xl font-serif font-bold text-luxury-black">Gilded Concierge</h4>
                              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Support Online
                              </p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-gray-100"><Phone className="w-5 h-5" /></button>
                           <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-gray-100"><HelpCircle className="w-5 h-5" /></button>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-[#FDFBF7]/30">
                        <div className="flex justify-center">
                           <span className="px-6 py-2 bg-gray-50 rounded-full text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em]">Identity Verified — Session Encrypted</span>
                        </div>
                        
                        <div className="flex items-start gap-5 max-w-[80%]">
                           <div className="w-10 h-10 rounded-xl bg-luxury-black flex items-center justify-center shrink-0 shadow-lg"><Logo inverse className="scale-[0.35]" /></div>
                           <div className="space-y-2">
                              <div className="bg-white p-6 rounded-3xl rounded-tl-none border border-gray-100 shadow-sm">
                                 <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                                    "Welcome back to the Golden Hills digital sanctuary, {profile?.full_name?.split(' ')[0] || 'Guest'}. My name is Meriem, your dedicated concierge today. How may I refine your experience?"
                                 </p>
                              </div>
                              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pl-2">Concierge Meriem • 09:41</p>
                           </div>
                        </div>

                        <div className="flex items-start gap-5 max-w-[80%] ml-auto flex-row-reverse">
                           <div className="w-10 h-10 rounded-xl bg-luxury-gold flex items-center justify-center shrink-0 shadow-lg text-white font-bold text-sm">{profile?.full_name?.[0]}</div>
                           <div className="space-y-2 text-right">
                              <div className="bg-luxury-gold p-6 rounded-3xl rounded-tr-none text-white shadow-gold shadow-lg">
                                 <p className="text-sm font-bold tracking-tight">
                                    I would like to request a high floor for my next stay and perhaps a table at the Heritage restaurant for Friday.
                                 </p>
                              </div>
                              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pr-2">You • 09:42</p>
                           </div>
                        </div>

                        <div className="flex items-start gap-5 max-w-[80%]">
                           <div className="w-10 h-10 rounded-xl bg-luxury-black flex items-center justify-center shrink-0 shadow-lg"><Logo inverse className="scale-[0.35]" /></div>
                           <div className="space-y-2">
                              <div className="bg-white p-6 rounded-3xl rounded-tl-none border border-gray-100 shadow-sm">
                                 <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                                    "A wonderful choice. I have updated your permanent preference for high-floor suites. Regarding the Heritage restaurant, we have a table with an overlook view available at 20:00. Shall I confirm the reservation for your party?"
                                 </p>
                              </div>
                              <div className="flex gap-3 mt-4">
                                 <button className="px-6 py-2 bg-luxury-gold text-white rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg">Yes, Confirm Protocol</button>
                                 <button className="px-6 py-2 bg-gray-50 text-gray-400 rounded-full text-[9px] font-bold uppercase tracking-widest border border-gray-100">Other Time</button>
                              </div>
                              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pl-2">Concierge Meriem • 09:43</p>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 border-t border-gray-50 bg-white">
                        <div className="flex items-center gap-4 relative">
                           <div className="flex-1 relative group">
                              <input 
                                type="text" 
                                placeholder="Communicate with concierge..." 
                                className="w-full h-16 bg-gray-50 rounded-[2rem] px-10 pr-20 outline-none border-2 border-transparent focus:border-luxury-gold/20 transition-all font-bold text-sm"
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                 <button className="p-3 text-gray-300 hover:text-luxury-gold transition-colors"><Sparkles className="w-5 h-5" /></button>
                                 <button className="p-3 bg-luxury-gold text-white rounded-2xl shadow-lg shadow-luxury-gold/20 hover:scale-105 transition-all"><ArrowRight className="w-5 h-5" /></button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </GlassCard>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default GuestDashboard;
