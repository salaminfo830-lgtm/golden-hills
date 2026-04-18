import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Calendar, Users, Home, 
  Settings, LogOut, Bell, Search,
  ClipboardList, Utensils, 
  Bed, ShieldCheck, Mail
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import Logo from './Logo';

const sidebarItems = [
  { icon: <Home className="w-5 h-5" />, label: 'Overview', path: '/admin' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Reservations', path: '/admin/reservations' },
  { icon: <Bed className="w-5 h-5" />, label: 'Rooms & Housekeeping', path: '/admin/rooms' },
  { icon: <Utensils className="w-5 h-5" />, label: 'Kitchen & F&B', path: '/admin/kitchen' },
  { icon: <Users className="w-5 h-5" />, label: 'Human Resources', path: '/admin/hr' },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Finance & Analytics', path: '/admin/finance' },
  { icon: <ShieldCheck className="w-5 h-5" />, label: 'Security & Systems', path: '/admin/security' },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
];

const DashboardLayout = ({ children, userType = 'Admin' }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 300 : 100 }}
        className="hidden lg:flex bg-white border-r border-gray-100 flex-col z-30 transition-all duration-500 relative"
      >
        <div className="p-8 mb-4 h-32 flex items-center justify-center border-b border-gray-50">
             <Logo textVisible={isSidebarOpen} className={isSidebarOpen ? '' : 'justify-center'} />
        </div>

        <nav className="flex-1 px-4 space-y-1">
           {(userType === 'Admin' ? sidebarItems : [
             { icon: <Home className="w-5 h-5" />, label: 'My Tasks', path: '/staff' },
             { icon: <Calendar className="w-5 h-5" />, label: 'My Shift', path: '/staff/shift' },
             { icon: <Mail className="w-5 h-5" />, label: 'Messages', path: '/staff/messages' },
             { icon: <ClipboardList className="w-5 h-5" />, label: 'Checklist', path: '/staff/checklist' },
           ]).map((item, idx) => (
             <Link 
                key={idx} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                  currentPath === item.path 
                    ? 'bg-luxury-gold/10 text-luxury-gold border-r-4 border-luxury-gold shadow-sm' 
                    : 'text-gray-400 hover:text-luxury-black hover:bg-gray-50'
                }`}
             >
               <div className={`shrink-0 ${currentPath === item.path ? 'text-luxury-gold' : 'group-hover:text-luxury-gold'} transition-colors`}>{item.icon}</div>
               {isSidebarOpen && <span className="font-bold text-sm tracking-wide uppercase transition-opacity">{item.label}</span>}
             </Link>
           ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
           <Link to="/" className="flex items-center gap-4 px-4 py-4 text-gray-400 hover:text-red-500 transition-colors w-full rounded-2xl hover:bg-red-50">
             <LogOut className="w-5 h-5 shrink-0" />
             {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-wide">Exit Systems</span>}
           </Link>
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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isMobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 lg:hidden flex flex-col border-r border-gray-100"
      >
        <div className="p-8 flex justify-center border-b border-gray-50">
            <Logo />
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-8">
           {(userType === 'Admin' ? sidebarItems : [
             { icon: <Home className="w-5 h-5" />, label: 'My Tasks', path: '/staff' },
             { icon: <Calendar className="w-5 h-5" />, label: 'My Shift', path: '/staff/shift' },
             { icon: <Mail className="w-5 h-5" />, label: 'Messages', path: '/staff/messages' },
             { icon: <ClipboardList className="w-5 h-5" />, label: 'Checklist', path: '/staff/checklist' },
           ]).map((item, idx) => (
             <Link 
               key={idx} 
               to={item.path} 
               onClick={() => setMobileOpen(false)} 
               className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                 currentPath === item.path ? 'bg-luxury-gold/10 text-luxury-gold' : 'text-gray-400 hover:text-luxury-black'
               }`}
              >
                {item.icon} <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
             </Link>
           ))}
        </nav>
        <div className="p-6 border-t border-gray-100">
           <Link to="/" className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-red-500 transition-colors w-full rounded-2xl hover:bg-red-50">
             <LogOut className="w-5 h-5 shrink-0" />
             <span className="font-bold text-xs uppercase tracking-widest">Exit Systems</span>
           </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#fafafa]">
        {/* Topbar */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-3xl border-b border-gray-100/50 z-20 px-4 md:px-8 py-3 md:py-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm min-h-[60px] md:min-h-[70px] gap-2 md:gap-0">
            <div className="flex items-center justify-between w-full md:w-auto">
             <div className="flex items-center gap-3 md:gap-5">
               <button onClick={() => window.innerWidth > 1024 ? setSidebarOpen(!isSidebarOpen) : setMobileOpen(true)} className="p-2.5 glass-vapor hover:bg-gray-100 rounded-xl transition-all text-gray-700 shadow-sm active:scale-95 border border-gray-100">
                 <MenuIcon />
               </button>
               <div className="flex flex-col">
                 <h2 className="text-sm md:text-lg font-elegant font-bold text-gray-800 tracking-tight leading-none mb-1">Golden Hills <span className="text-luxury-gold inline italic">Sanctuary</span></h2>
                 <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400">Integrated Control Panel</p>
               </div>
             </div>
             
             {/* Mobile only Bell */}
             <div className="relative cursor-pointer group md:hidden p-2 bg-gray-100/80 rounded-xl">
               <Bell className="w-5 h-5 text-gray-600" />
               <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-luxury-gold rounded-full border-2 border-white animate-pulse" />
             </div>
           </div>

           <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
             <div className="flex items-center bg-gray-100/80 px-4 py-2.5 rounded-2xl border border-gray-200 focus-within:border-luxury-gold/50 transition-colors w-full md:w-auto">
               <Search className="w-4 h-4 text-gray-500 mr-3 shrink-0" />
               <input type="text" placeholder="Search systems..." className="bg-transparent border-none outline-none text-xs w-full min-w-0 md:w-48 font-medium text-gray-700 placeholder-gray-400 focus:ring-0" />
             </div>
             <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 md:border-l md:border-gray-200 md:pl-6 w-full md:w-auto bg-white md:bg-transparent rounded-2xl p-2 md:p-0 shadow-sm md:shadow-none border border-gray-100 md:border-none">
                <div className="relative cursor-pointer group hidden md:block">
                  <div className="p-2.5 bg-gray-100/80 rounded-xl group-hover:bg-luxury-gold/10 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600 group-hover:text-luxury-gold" />
                  </div>
                  <span className="absolute top-0 right-0 w-3 h-3 bg-luxury-gold rounded-full border-[3px] border-white animate-pulse" />
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-3">
                    <div className="w-10 md:w-11 h-10 md:h-11 shrink-0 rounded-2xl gold-gradient p-[2px] shadow-sm">
                      <div className="w-full h-full bg-white rounded-[14px] overflow-hidden flex items-center justify-center">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fares" alt="User" className="w-full h-full object-cover bg-gray-50" />
                      </div>
                    </div>
                    <div className="flex flex-col text-left md:text-right">
                      <p className="text-xs md:text-sm font-bold text-gray-900 tracking-wide">Fares Ahmed</p>
                      <div className="flex items-center gap-1 md:justify-end">
                         <Mail className="w-3 h-3 text-gray-400 hidden md:block" />
                         <p className="text-[10px] md:text-xs text-gray-500 font-medium truncate max-w-[120px] md:max-w-none">fares@goldenhills.dz</p>
                      </div>
                      <p className="text-[10px] md:text-[11px] text-gray-400 font-medium hidden md:block">+213 36 00 00 00</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                     <p className="text-[10px] md:text-xs text-luxury-gold font-bold uppercase tracking-wider bg-luxury-gold/10 px-2 py-1 rounded-lg">{userType}</p>
                     <p className="text-[9px] text-gray-400 font-medium md:hidden mt-1">+213 36 00 00 00</p>
                  </div>
                </div>
             </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-3 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full overflow-x-hidden">
           {children}
        </div>
      </main>
    </div>
  );
};

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export default DashboardLayout;
