import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Clock, MapPin, 
  Utensils, Bed, Wind, AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';

const StaffDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: staffData } = await supabase
          .from('Staff')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        setUser(staffData || { name: authUser.user_metadata.full_name || 'Staff Member' });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center opacity-40">
        <Loader2 className="w-10 h-10 text-luxury-gold animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Identifying Personnel...</p>
      </div>
    );
  }

  return (
    <DashboardLayout userType={user?.role?.toUpperCase() || 'EMPLOYEE'}>
      <div className="space-y-10 max-w-6xl mx-auto">
        
        {/* Elite Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
           <div>
              <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.3em] mb-3">Service Excellence Portal</p>
              <h1 className="text-3xl md:text-5xl font-elegant font-bold text-luxury-black leading-tight">Bonjour, {user?.name?.split(' ')[0] || 'Member'}</h1>
              <p className="text-[10px] md:text-base text-gray-400 font-medium mt-2">Personalized Operations Dashboard • <span className="text-luxury-gold italic text-[10px] md:text-sm">{user?.department || 'General'} Sector</span></p>
           </div>
           <div className="flex gap-4">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center min-w-[120px]">
                 <p className="text-2xl font-bold text-luxury-black">12</p>
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Daily Tasks</p>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center min-w-[120px]">
                 <p className="text-2xl font-bold text-green-500">8</p>
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Completed</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Operational Flow */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Active Commitments */}
            <div>
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-elegant font-bold text-luxury-black">Priority Engagements</h3>
                  <div className="h-[1px] flex-1 bg-gray-100 mx-6 hidden md:block" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Focus</span>
               </div>
               
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { title: 'Room 304 Cleaning', area: '3rd Floor', time: '15:00', priority: 'High', type: <Bed className="w-5 h-5" /> },
                    { title: 'Restock Mini-bar', area: 'Room 210', time: '15:30', priority: 'Normal', type: <Utensils className="w-5 h-5" /> },
                    { title: 'Check AC Filter', area: 'Lobby Lounge', time: '16:00', priority: 'Normal', type: <Wind className="w-5 h-5" /> },
                    { title: 'Emergency Towels', area: 'Room 405', time: 'ASAP', priority: 'High', type: <Bed className="w-5 h-5" /> },
                  ].map((task, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 8 }}
                      className="bg-white p-8 rounded-[1.5rem] border border-gray-100 flex items-center justify-between transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] group"
                    >
                      <div className="flex items-center gap-8">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${task.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-[#fafafa] text-gray-300 group-hover:text-luxury-gold group-hover:bg-luxury-gold/5'}`}>
                            {task.type}
                         </div>
                         <div>
                            <h4 className="text-lg font-bold text-luxury-black group-hover:text-luxury-gold transition-colors">{task.title}</h4>
                            <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                               <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {task.area}</span>
                               <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {task.time}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <span className={`text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${task.priority === 'High' ? 'border-red-100 bg-red-50 text-red-500' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                            {task.priority}
                         </span>
                         <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-200 hover:text-green-500 hover:border-green-500 transition-all active:scale-90">
                            <CheckCircle2 className="w-5 h-5" />
                         </button>
                      </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* Internal Bulletin */}
            <div className="bg-[#fafafa] border border-gray-100 p-10 rounded-[2.5rem] flex items-start gap-8">
               <div className="w-16 h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center text-luxury-gold shrink-0 shadow-sm">
                  <AlertCircle className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-xl font-elegant font-bold text-luxury-black mb-2">Management Bulletin</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">Dear Team, please prepare for the VIP arrival in the Royal Wing tomorrow at 10 AM. All common areas must be inspected by 08:30.</p>
                  <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest mt-4 italic">— General Management</p>
               </div>
            </div>
          </div>

          {/* Side Intelligence */}
          <div className="space-y-12">
             
             {/* Guest Request Stream */}
             <div className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-elegant font-bold text-luxury-black">Direct Requests</h3>
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="space-y-8">
                   {[
                     { user: 'Room 405', req: 'More coffee capsules', time: '5m' },
                     { user: 'Room 102', req: 'Extra Pillows', time: '12m' },
                     { user: 'Lobby', req: 'Taxi to Airport', time: '20m' },
                   ].map((req, i) => (
                     <div key={i} className="flex gap-6 group cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-luxury-gold font-bold text-xs shrink-0 group-hover:bg-luxury-gold group-hover:text-white transition-all">
                           {req.user.split(' ')[1] || 'L'}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-1">
                              <h5 className="font-bold text-sm text-luxury-black">{req.user}</h5>
                              <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">{req.time} ago</span>
                           </div>
                           <p className="text-xs text-gray-400 font-medium leading-relaxed">{req.req}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <GoldButton className="w-full mt-10 py-4 text-[10px]" outline>DISPATCH NEXT TASK</GoldButton>
             </div>

             {/* Personal Rosters */}
             <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-300 pl-4">Weekly Roster</h3>
                <div className="space-y-3">
                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                     <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${i === 0 ? 'bg-white border-luxury-gold shadow-sm ring-4 ring-luxury-gold/5' : 'bg-transparent border-gray-50 opacity-40'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-luxury-gold text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {day}
                           </div>
                           <span className="text-sm font-bold text-luxury-black leading-none">Morning Shift</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 tracking-tighter">08:00 — 16:00</span>
                     </div>
                   ))}
                </div>
             </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
