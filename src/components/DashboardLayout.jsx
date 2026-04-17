import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Calendar, Users, Home, 
  Settings, LogOut, Bell, Search,
  ClipboardList, Coffee, Utensils, 
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
        className="hidden lg:flex bg-luxury-black border-r border-white/10 flex-col z-30 transition-all duration-500 relative"
      >
        <div className="p-8 mb-4">
          <Logo inverse textVisible={isSidebarOpen} />
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
                    ? 'bg-gradient-to-r from-luxury-gold/20 to-transparent text-luxury-gold border-r-4 border-luxury-gold' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
             >
               <div className={`shrink-0 ${currentPath === item.path ? 'text-luxury-gold' : 'group-hover:text-luxury-gold'} transition-colors`}>{item.icon}</div>
               {isSidebarOpen && <span className="font-bold text-sm tracking-wide uppercase transition-opacity">{item.label}</span>}
             </Link>
           ))}
        </nav>

        <div className="p-6 border-t border-white/10">
           <Link to="/" className="flex items-center gap-4 px-4 py-4 text-white/40 hover:text-white transition-colors w-full rounded-2xl hover:bg-white/5">
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
        className="fixed inset-y-0 left-0 w-[280px] bg-luxury-black/95 backdrop-blur-2xl z-50 lg:hidden flex flex-col border-r border-white/10"
      >
        <div className="p-8"><Logo inverse /></div>
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
                 currentPath === item.path ? 'bg-luxury-gold/10 text-luxury-gold' : 'text-white/60 hover:text-white'
               }`}
              >
                {item.icon} <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
             </Link>
           ))}
        </nav>
        <div className="p-6 border-t border-white/10">
           <Link to="/" className="flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-colors w-full rounded-2xl">
             <LogOut className="w-5 h-5 shrink-0" />
             <span className="font-bold text-xs uppercase tracking-widest">Exit Systems</span>
           </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#fafafa]">
        {/* Topbar */}
        <header className="sticky top-0 bg-white/60 backdrop-blur-2xl border-b border-gray-100/50 z-20 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-4">
             <button onClick={() => window.innerWidth > 1024 ? setSidebarOpen(!isSidebarOpen) : setMobileOpen(true)} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
               <MenuIcon />
             </button>
             <div className="hidden md:block">
               <h2 className="text-lg font-serif font-bold text-gray-800 tracking-tight">Golden Hills <span className="text-luxury-gold">Systems</span></h2>
               <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Integrated v2.0</p>
             </div>
           </div>

           <div className="flex items-center gap-2 md:gap-6">
             <div className="hidden lg:flex items-center bg-gray-100/50 px-5 py-2.5 rounded-2xl border border-gray-100 focus-within:border-luxury-gold transition-colors">
               <Search className="w-4 h-4 text-gray-400 mr-3" />
               <input type="text" placeholder="Global system search..." className="bg-transparent border-none outline-none text-xs w-64 font-medium" />
             </div>
             <div className="flex items-center gap-4 border-l border-gray-100 pl-4 md:pl-6">
                <div className="relative cursor-pointer group">
                  <div className="p-2.5 bg-gray-100/50 rounded-xl group-hover:bg-luxury-gold/10 transition-colors">
                    <Bell className="w-5 h-5 text-gray-500 group-hover:text-luxury-gold transition-colors" />
                  </div>
                  <span className="absolute top-0 right-0 w-3 h-3 bg-luxury-gold rounded-full border-4 border-white animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-bold text-gray-800 tracking-wide">Fares Ahmed</p>
                    <p className="text-[10px] text-luxury-gold font-bold uppercase">{userType}</p>
                  </div>
                  <div className="w-10 md:w-11 h-10 md:h-11 rounded-2xl gold-gradient p-[2px]">
                    <div className="w-full h-full bg-white rounded-[14px] overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fares" alt="User" />
                    </div>
                  </div>
                </div>
             </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-10 max-w-[1600px] mx-auto">
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
