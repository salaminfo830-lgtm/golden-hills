import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Calendar, Users, Home, 
  Settings, LogOut, Bell, Search,
  ClipboardList, Coffee, Utensils, 
  Bed, ShieldCheck, Mail
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const sidebarItems = [
  { icon: <Home />, label: 'Overview', path: '/admin' },
  { icon: <Calendar />, label: 'Reservations', path: '/admin/reservations' },
  { icon: <Bed />, label: 'Rooms & Housekeeping', path: '/admin/rooms' },
  { icon: <Utensils />, label: 'Kitchen & F&B', path: '/admin/kitchen' },
  { icon: <Users />, label: 'Human Resources', path: '/admin/hr' },
  { icon: <BarChart3 />, label: 'Finance & Analytics', path: '/admin/finance' },
  { icon: <ShieldCheck />, label: 'Security & Systems', path: '/admin/security' },
  { icon: <Settings />, label: 'Settings', path: '/admin/settings' },
];

const DashboardLayout = ({ children, userType = 'Admin' }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="glass-dark bg-luxury-black border-r border-white/10 flex flex-col z-30"
      >
        <div className="p-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center text-white font-serif text-2xl font-bold shrink-0">G</div>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-serif font-bold tracking-tight text-xl whitespace-nowrap"
            >
              GOLDEN HILLS
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
           {(userType === 'Admin' ? sidebarItems : [
             { icon: <Home />, label: 'My Tasks', path: '/staff' },
             { icon: <Calendar />, label: 'My Shift', path: '/staff/shift' },
             { icon: <Mail />, label: 'Messages', path: '/staff/messages' },
             { icon: <ClipboardList />, label: 'Checklist', path: '/staff/checklist' },
           ]).map((item, idx) => (
             <Link 
                key={idx} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  currentPath === item.path 
                    ? 'gold-gradient text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
             >
               <div className="shrink-0">{item.icon}</div>
               {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
             </Link>
           ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
           <button className="flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full rounded-xl hover:bg-red-500/10">
             <LogOut className="shrink-0" />
             {isSidebarOpen && <span className="font-medium">Logout</span>}
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-20 px-8 py-4 flex justify-between items-center">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
               <MenuIcon />
             </button>
             <h2 className="text-xl font-bold text-gray-800">{userType} Dashboard</h2>
           </div>

           <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
               <Search className="w-5 h-5 text-gray-400 mr-2" />
               <input type="text" placeholder="Search systems..." className="bg-transparent border-none outline-none text-sm w-48" />
             </div>
             <div className="relative cursor-pointer hover:scale-110 transition-transform">
               <Bell className="w-6 h-6 text-gray-500" />
               <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
             </div>
             <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
               <div className="text-right">
                 <p className="text-sm font-bold text-gray-800">Fares Ahmed</p>
                 <p className="text-xs text-luxury-gold font-medium uppercase tracking-tighter">{userType}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-luxury-gold/20 overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fares" alt="User" />
               </div>
             </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
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
