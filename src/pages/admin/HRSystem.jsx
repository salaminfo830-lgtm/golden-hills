import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Search, 
  Mail, Phone, MoreVertical, 
  Clock, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const HRSystem = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchStaff();

    const subscription = supabase
      .channel('public:Staff')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Staff' }, () => fetchStaff())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from('Staff')
      .select('*')
      .order('name', { ascending: true });
    
    if (!error) {
      setStaff(data);
    }
    setLoading(false);
  };

  const filteredStaff = filter === 'All' 
    ? staff 
    : staff.filter(s => s.department === filter);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Human Resources</h2>
          <p className="text-gray-400 font-medium tracking-wide">Live personnel management & shift monitoring</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline className="flex-1 md:flex-none py-3 px-6 text-[10px] cursor-not-allowed opacity-50">VIEW SCHEDULES</GoldButton>
           <GoldButton className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2 cursor-not-allowed opacity-50">
             <UserPlus className="w-4 h-4" /> RECRUIT NEW
           </GoldButton>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="flex gap-2 bg-gray-100/50 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {['All', 'Administration', 'Housekeeping', 'Kitchen', 'Security', 'Finance'].map((dept) => (
              <button 
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === dept ? 'bg-white text-luxury-gold shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {dept}
              </button>
            ))}
         </div>
         <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-luxury-gold transition-colors" />
            <input type="text" placeholder="Search departments, names, roles..." className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium outline-none focus:border-luxury-gold transition-all" />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         <AnimatePresence mode="popLayout">
           {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-gray-50 shadow-sm">
                <Loader2 className="w-8 h-8 text-luxury-gold animate-spin mb-4" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accessing Personnel Files</p>
             </div>
           ) : filteredStaff.length === 0 ? (
             <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-medium">No personnel found in {filter} department.</p>
             </div>
           ) : filteredStaff.map((person) => (
             <motion.div
               layout
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               key={person.id}
             >
                <GlassCard className="bg-white border-gray-100 p-8 hover:border-luxury-gold/30 transition-all group overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-luxury-gold/10 transition-colors" />
                   
                   <div className="flex gap-6 items-center mb-10 relative z-10">
                      <div className="w-16 h-16 rounded-[1.5rem] gold-gradient p-[2px] shrink-0">
                         <div className="w-full h-full bg-white rounded-[1.3rem] overflow-hidden">
                            <img src={person.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt={person.name} />
                         </div>
                      </div>
                      <div>
                         <h3 className="text-xl font-serif font-bold text-gray-800 tracking-tight group-hover:text-luxury-gold transition-colors">{person.name}</h3>
                         <span className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em]">{person.role}</span>
                      </div>
                   </div>

                   <div className="space-y-4 mb-10 relative z-10">
                      <div className="flex items-center gap-4 text-xs">
                         <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><Mail className="w-4 h-4" /></div>
                         <span className="font-medium text-gray-600">{person.email || 'internal@golden-hills.com'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                         <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><Phone className="w-4 h-4" /></div>
                         <span className="font-medium text-gray-600">{person.phone || '+213 XXX XXX XXX'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                         <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                         <span className="font-medium text-gray-600">{person.department} Department</span>
                      </div>
                   </div>

                   <div className="flex justify-between items-center pt-6 border-t border-gray-50 relative z-10">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${person.status === 'On Shift' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{person.status}</span>
                      </div>
                      <div className="flex gap-2">
                         <button className="p-2.5 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all text-gray-400 hover:text-luxury-gold">
                            <Clock className="w-4 h-4" />
                         </button>
                         <button className="p-2.5 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all text-gray-400 hover:text-luxury-gold">
                            <MoreVertical className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </GlassCard>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>
    </div>
  );
};

export default HRSystem;
