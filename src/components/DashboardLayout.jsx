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
      .channel('dashboard-security-status')
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
    <div className="flex h-screen bg-[#FBFBFD] overflow-hidden font-apple text-[#050B18]">
      {/* Premium Apple-Style Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="hidden lg:flex bg-[#050B18] flex-col z-30 transition-all duration-500 relative shadow-[20px_0_50px_-20px_rgba(0,0,0,0.3)]"
      >
        <div className="p-8 mb-4 flex items-center justify-center">
             <Logo inverse textVisible={isSidebarOpen} className={isSidebarOpen ? 'scale-90' : 'scale-100'} />
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
           <div className={`text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-6 transition-opacity ${isSidebarOpen ? 'px-4' : 'opacity-0'}`}>
              Management
           </div>
           {menuItems.map((item, idx) => {
             const isActive = currentPath === item.path || (item.path !== '/admin' && item.path !== '/staff' && currentPath.startsWith(item.path));
             return (
               <Link 
                  key={idx} 
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                    isActive 
                      ? 'bg-white/10 text-[#C9A84C]' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
               >
                 <div className={`shrink-0 transition-all duration-300 ${isActive ? 'scale-110 text-[#C9A84C]' : 'group-hover:scale-110'}`}>
                    {item.icon}
                 </div>
                 {isSidebarOpen && (
                   <span className={`font-bold text-[11px] uppercase tracking-[0.15em] transition-opacity ${isActive ? 'text-white' : ''}`}>
                      {item.label}
                   </span>
                 )}
                 {isActive && (
                   <motion.div 
                     layoutId="active-pill" 
                     className="absolute left-0 w-1 h-6 bg-[#C9A84C] rounded-r-full"
                   />
                 )}
               </Link>
             );
           })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
           {isSidebarOpen && (
             <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                   <Shield className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Security Mode</p>
                   <p className="text-[10px] font-bold text-white uppercase tracking-tight">ENCLAVE SECURE</p>
                </div>
             </div>
           )}
           <button 
             onClick={handleLogout}
             className="flex items-center gap-4 px-4 py-3.5 text-white/30 hover:text-red-400 transition-all w-full rounded-2xl hover:bg-red-400/10 group"
           >
             <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
             {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-[0.2em]">Sign Out</span>}
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
            className="fixed inset-0 bg-[#050B18]/60 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isMobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-[300px] bg-[#050B18] z-50 lg:hidden flex flex-col"
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
               className={`flex items-center gap-5 px-6 py-5 rounded-2xl transition-all ${
                 currentPath === item.path ? 'bg-white/10 text-[#C9A84C]' : 'text-white/40 hover:text-white'
               }`}
              >
                {item.icon} <span className="font-bold text-xs uppercase tracking-[0.2em]">{item.label}</span>
             </Link>
           ))}
        </nav>
        <div className="p-8 border-t border-white/5">
           <button onClick={handleLogout} className="flex items-center gap-5 px-6 py-5 text-white/30 hover:text-red-400 transition-all w-full rounded-2xl hover:bg-red-400/10">
             <LogOut className="w-5 h-5 shrink-0" />
             <span className="font-bold text-xs uppercase tracking-[0.2em]">Logout</span>
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#FBFBFD]">
        {/* Elite Apple-Style Topbar */}
        <header className={`sticky top-0 z-20 transition-all duration-500 px-8 py-4 flex items-center justify-between ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm' : 'bg-transparent'}`}>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => window.innerWidth > 1024 ? setSidebarOpen(!isSidebarOpen) : setMobileOpen(true)} 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm hover:border-[#C9A84C] transition-all group"
              >
                {isSidebarOpen ? <Menu className="w-4 h-4 text-gray-400 group-hover:text-[#C9A84C]" /> : <Command className="w-4 h-4 text-[#C9A84C]" />}
              </button>
              
              <div className="hidden md:block">
                 <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-[#050B18] tracking-tight">Golden Hills</h2>
                    <span className="text-gray-300">/</span>
                    <h2 className="text-lg font-medium text-gray-400 tracking-tight">Dashboard</h2>
                     <div className={`ml-4 flex items-center gap-2 px-2.5 py-1 rounded-full border ${lockdownActive ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${lockdownActive ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${lockdownActive ? 'text-red-600' : 'text-green-600'}`}>
                          {lockdownActive ? 'Lockdown' : 'Nominal'}
                        </span>
                     </div>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               {/* Global Search */}
               <div className="hidden lg:flex items-center bg-[#F5F5F7] px-4 py-2 rounded-xl border border-transparent focus-within:bg-white focus-within:border-[#C9A84C]/30 transition-all w-64">
                  <Search className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                  <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs w-full font-medium text-[#050B18] placeholder-gray-400 focus:ring-0" />
               </div>

               <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                  <NotificationMenu userId={user?.id} />
                  
                  <div className="flex items-center gap-3 ml-2">
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] font-bold text-[#050B18] leading-none mb-1">{user?.full_name}</p>
                      <p className="text-[9px] text-[#C9A84C] font-bold uppercase tracking-widest">{userType}</p>
                    </div>
                    <div className="relative group">
                       <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] p-[1px] shadow-sm group-hover:scale-105 transition-transform cursor-pointer overflow-hidden border border-gray-100">
                          {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-[#C9A84C] text-sm bg-white">
                              {user?.full_name?.[0]}
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
               </div>
            </div>
        </header>

        {/* Dynamic Canvas Area */}
        <div 
          id="dashboard-main-content"
          className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10 relative"
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
