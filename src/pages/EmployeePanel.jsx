import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/GlassCard';
import { 
  CheckCircle2, Clock, MapPin, 
  MessageSquare, Star, Calendar,
  Utensils, Bed, Wind, AlertCircle,
  MoreVertical, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const EmployeePanel = () => {
  return (
    <DashboardLayout userType="Employee">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personalized Info & Active Tasks */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Welcome & Shift Card */}
          <GlassCard className="gold-gradient text-white border-0">
             <div className="flex justify-between items-start">
                <div>
                   <h2 className="text-3xl font-serif font-bold mb-2">Bonjour, Salim!</h2>
                   <p className="text-white/80">You are currently on the <span className="font-bold">Morning Shift</span> (08:00 - 16:00)</p>
                   <div className="flex gap-6 mt-6">
                      <div className="text-center">
                         <p className="text-2xl font-bold">12</p>
                         <p className="text-[10px] uppercase font-bold text-white/60">Tasks Total</p>
                      </div>
                      <div className="text-center border-l border-white/20 pl-6">
                         <p className="text-2xl font-bold">8</p>
                         <p className="text-[10px] uppercase font-bold text-white/60">Completed</p>
                      </div>
                      <div className="text-center border-l border-white/20 pl-6">
                         <p className="text-2xl font-bold">4</p>
                         <p className="text-[10px] uppercase font-bold text-white/60">Remaining</p>
                      </div>
                   </div>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md flex flex-col items-center">
                   <Clock className="w-8 h-8 mb-2" />
                   <span className="text-xl font-bold">14:45</span>
                </div>
             </div>
          </GlassCard>

          {/* Task Board Integration */}
          <div>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold">My Daily Tasks</h3>
               <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-luxury-gold">All</span>
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-400">High Priority</span>
               </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               {[
                 { title: 'Room 304 Cleaning', area: '3rd Floor', time: '15:00', priority: 'High', type: <Bed className="w-4 h-4" /> },
                 { title: 'Restock Mini-bar', area: 'Room 210', time: '15:30', priority: 'Normal', type: <Utensils className="w-4 h-4" /> },
                 { title: 'Check AC Filter', area: 'Lobby Lounge', time: '16:00', priority: 'Normal', type: <Wind className="w-4 h-4" /> },
                 { title: 'Emergency Towels', area: 'Room 405', time: 'ASAP', priority: 'High', type: <Bed className="w-4 h-4" /> },
               ].map((task, i) => (
                 <motion.div
                   key={i}
                   whileHover={{ x: 5 }}
                   className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm group"
                 >
                   <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-luxury-gold/10 text-luxury-gold'}`}>
                         {task.type}
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-800">{task.title}</h4>
                         <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {task.area}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                         {task.priority}
                      </span>
                      <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 hover:text-luxury-gold hover:border-luxury-gold transition-colors">
                         <CheckCircle2 className="w-5 h-5" />
                      </button>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: Guest Requests & Schedules */}
        <div className="space-y-8">
           
           {/* Live Guest Requests Integration */}
           <GlassCard className="bg-white border-gray-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold">Guest Requests</h3>
                 <span className="p-1 rounded bg-orange-50 text-orange-500 text-[10px] font-bold tracking-widest uppercase">Live</span>
              </div>
              <div className="space-y-6">
                 {[
                   { user: 'Room 405', req: 'More coffee capsules', time: '5m' },
                   { user: 'Room 102', req: 'Extra Pillows', time: '12m' },
                   { user: 'Lobby', req: 'Taxi to Airport', time: '20m' },
                 ].map((req, i) => (
                   <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-bold text-xs shrink-0">
                         {req.user.split(' ')[1]}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between">
                            <h5 className="font-bold text-sm text-gray-700">{req.user}</h5>
                            <span className="text-[10px] text-gray-300 font-bold">{req.time} ago</span>
                         </div>
                         <p className="text-xs text-gray-400 mt-1 leading-tight">{req.req}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <GoldButton className="w-full mt-6 py-2 text-xs" outline>ACCEPT NEXT REQUEST</GoldButton>
           </GlassCard>

           {/* Personal Schedule System */}
           <GlassCard className="bg-luxury-black text-white border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 gold-gradient blur-3xl opacity-20 -mr-16 -mt-16" />
              <h3 className="text-xl font-bold mb-6">Weekly Schedule</h3>
              <div className="space-y-3">
                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                   <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-white/10 border border-white/20' : 'opacity-40'}`}>
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'gold-gradient' : 'bg-white/10'}`}>
                            {day}
                         </div>
                         <span className="text-sm font-medium">Morning Shift</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/40">08:00 - 16:00</span>
                   </div>
                 ))}
              </div>
           </GlassCard>

           {/* Internal Comms / Bulletin */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Board Bulletin</h3>
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                 </div>
                 <div>
                    <h5 className="text-sm font-bold">Staff Meeting Tomorrow</h5>
                    <p className="text-xs text-gray-500 mt-1">General meeting at 10 AM regarding the new booking system updates.</p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeePanel;
