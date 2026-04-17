import React from 'react';
import { Calendar, Filter, Plus, Search, ChevronLeft, ChevronRight, MoreHorizontal, User, Bed, Clock } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const ReservationsSystem = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold">Reservation Hub</h2>
          <p className="text-gray-400 font-medium">Global booking synchronization </p>
        </div>
        <GoldButton className="flex items-center gap-2 px-8">
          <Plus className="w-4 h-4" /> NEW BOOKING
        </GoldButton>
      </div>

      {/* Calendar Strip Mockup */}
      <GlassCard className="bg-white border-gray-100 p-6">
         <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <h3 className="text-xl font-bold">October 2026</h3>
               <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
               </div>
            </div>
            <div className="flex gap-4">
               <span className="flex items-center gap-2 text-xs font-bold text-gray-400"><div className="w-3 h-3 rounded bg-luxury-gold" /> Check-in</span>
               <span className="flex items-center gap-2 text-xs font-bold text-gray-400"><div className="w-3 h-3 rounded bg-blue-500" /> Stay</span>
               <span className="flex items-center gap-2 text-xs font-bold text-gray-400"><div className="w-3 h-3 rounded bg-orange-500" /> Check-out</span>
            </div>
         </div>
         
         <div className="grid grid-cols-7 gap-4 mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
         </div>
         <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 35 }).map((_, i) => {
               const day = i - 3;
               const isCurrent = day === 12;
               const hasBooking = day >= 12 && day <= 18;
               return (
                  <div key={i} className={`h-24 rounded-2xl border p-2 transition-all relative group cursor-pointer ${
                    day < 1 || day > 31 ? 'opacity-20 bg-gray-50 border-transparent' : 
                    isCurrent ? 'bg-luxury-gold/5 border-luxury-gold ring-2 ring-luxury-gold/20' : 'bg-white border-gray-100 hover:border-luxury-gold/50'
                  }`}>
                     {day > 0 && day <= 31 && (
                       <>
                         <span className={`text-xs font-bold ${isCurrent ? 'text-luxury-gold' : 'text-gray-400'}`}>{day}</span>
                         {hasBooking && (
                           <div className={`mt-2 h-10 rounded-lg ${day === 12 ? 'bg-luxury-gold' : day === 18 ? 'bg-orange-500' : 'bg-blue-500'} p-2 text-[8px] font-bold text-white overflow-hidden leading-tight`}>
                              {day === 12 ? 'CHECK-IN: BENALI' : 'SUITE 405'}
                           </div>
                         )}
                       </>
                     )}
                  </div>
               );
            })}
         </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold">Pending Requests</h3>
                  <div className="flex gap-2 text-xs font-bold text-gray-400 cursor-pointer hover:text-luxury-gold transition-colors">
                     View All <ChevronRight className="w-4 h-4" />
                  </div>
               </div>
               <div className="divide-y divide-gray-50">
                  {[
                    { name: 'Alice Cooper', info: '2 Guests • 3 Nights', type: 'Luxury Double', date: 'Oct 20 - 23', status: 'Pending Approval' },
                    { name: 'Robert Fox', info: '1 Guest • 1 Night', type: 'Studio Gold', date: 'Oct 15 - 16', status: 'Requires Payment' },
                    { name: 'Yasmine Dris', info: '4 Guests • 2 Suites', type: 'Royal Heritage', date: 'Oct 25 - 30', status: 'Vip Request' },
                  ].map((req, i) => (
                    <div key={i} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                       <div className="flex gap-6 items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 p-1">
                             <User className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-800">{req.name}</h4>
                             <p className="text-xs text-gray-400 font-medium">{req.info}</p>
                          </div>
                          <div className="hidden md:block pl-6 border-l border-gray-100 uppercase tracking-widest text-[10px] font-bold text-gray-300">
                             <p>{req.type}</p>
                             <p className="text-luxury-gold">{req.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-[10px] font-bold uppercase tracking-tighter px-3 py-1 bg-white border border-gray-100 rounded-full text-gray-400 italic shadow-sm">
                             {req.status}
                          </span>
                          <GoldButton outline className="px-6 py-2 text-[10px]">RESERVE</GoldButton>
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>
         </div>

         <div className="space-y-8">
            <GlassCard className="bg-white border-gray-100 p-8 shadow-sm">
               <h3 className="text-xl font-bold mb-8">Booking Sources</h3>
               <div className="space-y-8">
                  {[
                    { label: 'Direct Site', val: '72%', color: 'bg-luxury-gold' },
                    { label: 'Booking.com', val: '18%', color: 'bg-blue-600' },
                    { label: 'Expedia', val: '10%', color: 'bg-orange-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                          <span>{item.label}</span>
                          <span className="text-luxury-gold">{item.val}</span>
                       </div>
                       <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: item.val }}
                             transition={{ duration: 1 }}
                             className={`h-full ${item.color}`}
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>

            <GlassCard className="gold-gradient text-white p-8">
               <div className="flex items-center gap-3 mb-6 font-bold">
                  <Star className="text-white" />
                  <h3>Occupancy Forecast</h3>
               </div>
               <p className="text-xs opacity-80 leading-relaxed mb-6">
                  Based on historical data for Setif region, we expect <span className="font-bold underline">100% occupancy</span> during next week's festival season.
               </p>
               <GoldButton outline className="w-full border-white/40 text-white hover:bg-white hover:text-luxury-gold">ANALYZE TRENDS</GoldButton>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

export default ReservationsSystem;
