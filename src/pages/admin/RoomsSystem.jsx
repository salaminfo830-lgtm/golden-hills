import { useState, useEffect } from 'react';
import { 
  Plus, Search, MoreVertical, 
  Bed, CheckCircle2,
  Loader2, User, Droplets, Hammer
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const RoomsSystem = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchRooms();

    const subscription = supabase
      .channel('public:Room')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Room' }, payload => {
        console.log('Real-time room update:', payload);
        fetchRooms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('Room')
      .select('*')
      .order('number', { ascending: true });
    
    if (!error) {
      setRooms(data);
    }
    setLoading(false);
  };

  const filteredRooms = filter === 'All' 
    ? rooms 
    : rooms.filter(r => r.status === filter);

  const statusColors = {
    'Vacant': 'bg-green-50 text-green-600 border-green-100',
    'Occupied': 'bg-blue-50 text-blue-600 border-blue-100',
    'Cleaning': 'bg-orange-50 text-orange-600 border-orange-100',
    'Maintenance': 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Rooms & Housekeeping</h2>
          <p className="text-gray-400 font-medium tracking-wide">Live occupancy & inventory management</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline className="flex-1 md:flex-none py-3 px-6 text-[10px] cursor-not-allowed opacity-50">EXPORT DATA</GoldButton>
           <GoldButton className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2 cursor-not-allowed opacity-50">
             <Plus className="w-4 h-4" /> ADD ROOM
           </GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Rooms', value: rooms.length, icon: <Bed />, color: 'text-luxury-gold' },
           { label: 'Need Cleaning', value: rooms.filter(r => r.status === 'Cleaning').length, icon: <Droplets />, color: 'text-orange-500' },
           { label: 'Maintenance', value: rooms.filter(r => r.status === 'Maintenance').length, icon: <Hammer />, color: 'text-red-500' },
           { label: 'Ready', value: rooms.filter(r => r.status === 'Vacant').length, icon: <CheckCircle2 />, color: 'text-green-500' },
         ].map((stat, i) => (
           <GlassCard key={i} className="flex items-center gap-6 bg-white border-gray-100">
              <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-2xl font-bold">{loading ? '...' : stat.value}</h3>
              </div>
           </GlassCard>
         ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex gap-2 bg-gray-100/50 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {['All', 'Vacant', 'Occupied', 'Cleaning', 'Maintenance'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === f ? 'bg-white text-luxury-gold shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
         </div>
         <div className="relative w-full md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-luxury-gold transition-colors" />
            <input type="text" placeholder="Search parameters..." className="w-full bg-white border border-gray-100 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium outline-none focus:border-luxury-gold transition-all" />
         </div>
      </div>

      <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden overflow-x-auto hidden lg:block">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-[#fafafa] border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Room Info</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Occupancy</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Assigned Staff</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                   <Loader2 className="w-8 h-8 text-luxury-gold animate-spin mx-auto mb-4" />
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Live Inventory</p>
                </td>
              </tr>
            ) : filteredRooms.map((room) => (
              <tr key={room.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-white font-bold text-xs">
                        {room.number}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{room.type}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Floor {room.number[0]}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[room.status] || 'bg-gray-100'}`}>
                     {room.status}
                   </span>
                </td>
                <td className="px-8 py-6">
                   <p className={`text-sm font-bold ${room.status === 'Occupied' ? 'text-luxury-gold' : 'text-gray-400'}`}>
                     {room.status === 'Occupied' ? 'Occupied' : 'Vacant'}
                   </p>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-100">
                        <User className="w-3 h-3 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{room.housekeeper || 'Unassigned'}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-luxury-black">
                     <MoreVertical className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Grid View for Tablet/Mobile or alternative layout */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
         {filteredRooms.map((room) => (
           <GlassCard key={room.id} className="bg-white border-gray-100 p-6 space-y-4">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center text-white font-bold">
                       {room.number}
                    </div>
                    <div>
                       <h4 className="font-bold">{room.type}</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Floor {room.number[0]}</p>
                    </div>
                 </div>
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[room.status] || 'bg-gray-100'}`}>
                    {room.status}
                 </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">{room.housekeeper || 'Unassigned'}</span>
                 </div>
                 <GoldButton outline className="px-4 py-1.5 text-[10px]">DETAILS</GoldButton>
              </div>
           </GlassCard>
         ))}
      </div>
    </div>
  );
};

export default RoomsSystem;
