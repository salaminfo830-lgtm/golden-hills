import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Calendar, Users, Home, 
  Settings, LogOut, Bell, Search,
  ClipboardList, Utensils, 
  Bed, ShieldCheck, Mail, User as UserIcon,
  Menu, X, ChevronRight, Sparkles,
  Command, Globe, Shield, Activity, Flame, ShieldAlert
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from './Logo';
import NotificationMenu from './NotificationMenu';

const adminItems = [
  { icon: <Home className="w-5 h-5" />, label: 'Intelligence', path: '/admin' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Reservations', path: '/admin/reservations' },
  { icon: <Users className="w-5 h-5" />, label: 'Guest Folio', path: '/admin/guests' },
  { icon: <Bed className="w-5 h-5" />, label: 'Inventory', path: '/admin/rooms' },
  { icon: <Utensils className="w-5 h-5" />, label: 'Dining & Spa', path: '/admin/services' },
  { icon: <Flame className="w-5 h-5" />, label: 'Kitchen Ops', path: '/admin/kitchen' },
  { icon: <Users className="w-5 h-5" />, label: 'Human Assets', path: '/admin/hr' },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Financials', path: '/admin/finance' },
  { icon: <ShieldCheck className="w-5 h-5" />, label: 'Systems', path: '/admin/security' },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
];

const staffItems = [
  { icon: <Activity className="w-5 h-5" />, label: 'My Ops', path: '/staff' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Roster', path: '/staff/shift' },
  { icon: <Mail className="w-5 h-5" />, label: 'Directives', path: '/staff/messages' },
  { icon: <ClipboardList className="w-5 h-5" />, label: 'Checklists', path: '/staff/checklist' },
  { icon: <Bed className="w-5 h-5" />, label: 'Room Logic', path: '/staff/rooms' },
];

const DashboardLayout = ({ children, userType = 'ADMIN' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [lockdownActive, setLockdownActive] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('Profile')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        setUser(profile || { 
          full_name: authUser.user_metadata.full_name || 'Personnel',
          email: authUser.email,
          avatar_url: authUser.user_metadata.avatar_url
        });
      }
    };
    fetchUser();

    // Security Status Subscription
    const fetchSecurityStatus = async () => {
      const { data } = await supabase.from('SecuritySystemStatus').select('lockdown_active').eq('id', 'current').single();
      if (data) setLockdownActive(data.lockdown_active);
    };
    fetchSecurityStatus();

    const securitySubscription = supabase
      .channel('public:SecuritySystemStatus')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'SecuritySystemStatus' }, (payload) => {
        if (payload.new && payload.new.id === 'current') {
          setLockdownActive(payload.new.lockdown_active);
        }
      })
      .subscribe();

    const handleScroll = (e) => {
      setScrolled(e.target.scrollTop > 20);
    };
    
    const container = document.getElementById('dashboard-main-content');
    if (container) container.addEventListener('scroll', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
      supabase.removeChannel(securitySubscription);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const currentPath = location.pathname;
  const menuItems = userType?.toUpperCase() === 'ADMIN' ? adminItems : staffItems;

  return (
    <div className="flex h-screen bg-[#FDFCFB] overflow-hidden font-apple text-luxury-black">
      {/* Premium Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 300 : 100 }}
        className="hidden lg:flex bg-luxury-black flex-col z-30 transition-all duration-500 relative border-r border-white/5 shadow-[20px_0_50px_-20px_rgba(0,0,0,0.2)]"
      >
        <div className="p-10 mb-6 flex items-center justify-center">
             <Logo inverse textVisible={isSidebarOpen} className={isSidebarOpen ? 'scale-100' : 'scale-110'} />
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar">
           <div className={`text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 mb-6 transition-opacity ${isSidebarOpen ? 'px-4' : 'opacity-0'}`}>
              System Architecture
           </div>
           {menuItems.map((item, idx) => {
             const isActive = currentPath === item.path || (item.path !== '/admin' && item.path !== '/staff' && currentPath.startsWith(item.path));
             return (
               <Link 
                  key={idx} 
                  to={item.path}
                  className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group relative ${
                    isActive 
                      ? 'bg-luxury-gold text-white shadow-gold' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
               >
                 <div className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                 </div>
                 {isSidebarOpen && (
                   <span className="font-bold text-[10px] uppercase tracking-[0.2em] transition-opacity">
                      {item.label}
                   </span>
                 )}
                 {isActive && isSidebarOpen && (
                   <motion.div layoutId="active-indicator" className="absolute right-4">
                      <ChevronRight className="w-4 h-4 opacity-50" />
                   </motion.div>
                 )}
               </Link>
             );
           })}
        </nav>

        <div className="p-8 border-t border-white/5 space-y-4">
           {isSidebarOpen && (
             <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                   <Shield className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Enclave Mode</p>
                   <p className="text-[9px] font-bold text-white uppercase tracking-tighter">SECURE NODE GH-1</p>
                </div>
             </div>
           )}
           <button 
             onClick={handleLogout}
             className="flex items-center gap-4 px-5 py-4 text-white/30 hover:text-red-400 transition-all w-full rounded-[1.25rem] hover:bg-red-400/10 group"
           >
             <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
             {isSidebarOpen && <span className="font-bold text-[10px] uppercase tracking-[0.3em]">Terminate</span>}
           </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-luxury-black/60 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isMobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-[300px] bg-luxury-black z-50 lg:hidden flex flex-col"
      >
        <div className="p-10 flex justify-center border-b border-white/5">
            <Logo inverse />
        </div>
        <nav className="flex-1 px-6 space-y-3 mt-10">
           {menuItems.map((item, idx) => (
             <Link 
               key={idx} 
               to={item.path} 
               onClick={() => setMobileOpen(false)} 
               className={`flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all ${
                 currentPath === item.path ? 'bg-luxury-gold text-white shadow-gold' : 'text-white/40 hover:text-white'
               }`}
              >
                {item.icon} <span className="font-bold text-xs uppercase tracking-[0.2em]">{item.label}</span>
             </Link>
           ))}
        </nav>
        <div className="p-8 border-t border-white/5">
           <button onClick={handleLogout} className="flex items-center gap-5 px-6 py-5 text-white/30 hover:text-red-400 transition-all w-full rounded-[1.5rem] hover:bg-red-400/10">
             <LogOut className="w-5 h-5 shrink-0" />
             <span className="font-bold text-xs uppercase tracking-[0.2em]">Logout</span>
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-luxury-cream/10">
        {/* Elite Topbar */}
        <header className={`sticky top-0 z-20 transition-all duration-300 px-8 py-5 flex items-center justify-between ${scrolled ? 'bg-white/90 backdrop-blur-2xl border-b border-gray-100 shadow-sm' : 'bg-transparent'}`}>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => window.innerWidth > 1024 ? setSidebarOpen(!isSidebarOpen) : setMobileOpen(true)} 
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-luxury-gold transition-all group"
              >
                {isSidebarOpen ? <Menu className="w-5 h-5 text-gray-400 group-hover:text-luxury-gold" /> : <Command className="w-5 h-5 text-luxury-gold" />}
              </button>
              
              <div className="hidden md:block">
                 <p className="text-[9px] font-bold text-luxury-gold uppercase tracking-[0.4em] mb-1">Golden Hills Internal Systems</p>
                 <div className="flex items-center gap-3">
                    <h2 className="text-xl font-serif font-bold text-luxury-black">Operations Enclave</h2>
                     <div className={`flex items-center gap-2 px-2 py-0.5 rounded-full border ${lockdownActive ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${lockdownActive ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className={`text-[8px] font-bold uppercase tracking-tighter ${lockdownActive ? 'text-red-600' : 'text-green-600'}`}>
                          {lockdownActive ? 'EMERGENCY LOCKDOWN' : 'System Nominal'}
                        </span>
                     </div>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
               {/* Global Intelligence Search */}
               <div className="hidden lg:flex items-center bg-white px-6 py-3 rounded-2xl border border-gray-100 focus-within:border-luxury-gold/50 focus-within:ring-4 focus-within:ring-luxury-gold/5 transition-all w-80">
                  <Search className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                  <input type="text" placeholder="Search archives..." className="bg-transparent border-none outline-none text-xs w-full font-bold text-luxury-black placeholder-gray-300 focus:ring-0" />
               </div>

               <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                  <div className="relative group cursor-pointer">
                     <NotificationMenu userId={user?.id} />
                  </div>
                  
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-luxury-black leading-none mb-1">{user?.full_name}</p>
                      <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest italic">{userType}</p>
                    </div>
                    <div className="relative group">
                       <div className="w-12 h-12 rounded-2xl gold-gradient p-[1.5px] shadow-lg group-hover:scale-105 transition-transform cursor-pointer">
                          <div className="w-full h-full bg-white rounded-[0.9rem] overflow-hidden flex items-center justify-center">
                            {user?.avatar_url ? (
                              <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-luxury-cream/30 flex items-center justify-center font-serif font-bold text-luxury-gold text-lg">
                                {user?.full_name?.[0]}
                              </div>
                            )}
                          </div>
                       </div>
                       {/* Subtle Online Badge */}
                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full" />
                    </div>
                  </div>
               </div>
            </div>
        </header>

        {/* Dynamic Canvas Area */}
        <div 
          id="dashboard-main-content"
          className="flex-1 overflow-y-auto no-scrollbar p-8 lg:p-12 relative"
        >
           <div className="max-w-7xl mx-auto w-full">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);
