import React from 'react';
import { Bed, CheckCircle2, AlertTriangle, Hammer, Droplets, User, MoreVertical, Search, Filter } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';
import { motion } from 'framer-motion';

const RoomsSystem = () => {
  const rooms = [
    { id: 101, type: 'Royal Suite', status: 'Clean', occupancy: 'Occupied', housekeeper: 'Fatima Z.' },
    { id: 102, type: 'Deluxe Heritage', status: 'Dirty', occupancy: 'Vacant', housekeeper: 'Waitlist' },
    { id: 103, type: 'Executive Panorama', status: 'Maintenance', occupancy: 'Vacant', housekeeper: 'Yassine K.' },
    { id: 104, type: 'Standard Sapphire', status: 'Clean', occupancy: 'Vacant', housekeeper: 'Fatima Z.' },
    { id: 105, type: 'Royal Suite', status: 'In-Progress', occupancy: 'Occupied', housekeeper: 'Amine B.' },
  ];

  const statusColors = {
    'Clean': 'bg-green-50 text-green-600 border-green-100',
    'Dirty': 'bg-red-50 text-red-600 border-red-100',
    'Maintenance': 'bg-orange-50 text-orange-600 border-orange-100',
    'In-Progress': 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Rooms & Housekeeping</h2>
          <p className="text-gray-400 font-medium">Real-time room status and inventory management</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-100 font-bold text-sm shadow-sm hover:border-luxury-gold transition-colors">
             <Filter className="w-4 h-4" /> Filter
           </button>
           <button className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-luxury-black text-white font-bold text-sm shadow-lg shadow-black/20">
             Quick Assign
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Rooms', value: '150', icon: <Bed />, color: 'text-luxury-gold' },
           { label: 'Need Cleaning', value: '12', icon: <Droplets />, color: 'text-red-500' },
           { label: 'Maintenance', value: '4', icon: <Hammer />, color: 'text-orange-500' },
           { label: 'Ready', value: '134', icon: <CheckCircle2 />, color: 'text-green-500' },
         ].map((stat, i) => (
           <GlassCard key={i} className="flex items-center gap-6 bg-white border-gray-100">
              <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
           </GlassCard>
         ))}
      </div>

      <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden overflow-x-auto">
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
            {rooms.map((room, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-white font-bold text-xs">
                        {room.id}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{room.type}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Floor 1</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[room.status]}`}>
                     {room.status}
                   </span>
                </td>
                <td className="px-8 py-6">
                   <p className={`text-sm font-bold ${room.occupancy === 'Occupied' ? 'text-luxury-gold' : 'text-gray-400'}`}>
                     {room.occupancy}
                   </p>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-3 h-3 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{room.housekeeper}</span>
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

      {/* Mobile Card View (shown only on mobile) */}
      <div className="md:hidden space-y-4">
         {rooms.map((room, i) => (
           <GlassCard key={i} className="bg-white border-gray-100 p-6 space-y-4">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center text-white font-bold">
                       {room.id}
                    </div>
                    <div>
                       <h4 className="font-bold">{room.type}</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase">{room.occupancy}</p>
                    </div>
                 </div>
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[room.status]}`}>
                    {room.status}
                 </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                       <User className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{room.housekeeper}</span>
                 </div>
                 <GoldButton outline className="px-4 py-1.5 text-[10px]">Update</GoldButton>
              </div>
           </GlassCard>
         ))}
      </div>
    </div>
  );
};

export default RoomsSystem;
