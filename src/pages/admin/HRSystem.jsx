import React from 'react';
import { Users, UserPlus, Phone, Mail, Award, Clock, MoreVertical, Search } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const HRSystem = () => {
  const staff = [
    { name: 'Amine Kaci', role: 'Head of Concierge', dept: 'Guest Services', status: 'On Shift', phone: '+213 555 123 456' },
    { name: 'Zahra Mansouri', role: 'Sous Chef', dept: 'Kitchen', status: 'Off Shift', phone: '+213 555 987 654' },
    { name: 'Karim Bouzid', role: 'Accountant', dept: 'Finance', status: 'On Shift', phone: '+213 555 456 789' },
    { name: 'Lila Saidani', role: 'Housekeeping Supervisor', dept: 'Rooms', status: 'On Shift', phone: '+213 555 321 654' },
    { name: 'Omar Fekir', role: 'Security Manager', dept: 'Security', status: 'Vacation', phone: '+213 555 789 123' },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Human Resources</h2>
          <p className="text-gray-400 font-medium tracking-wide text-sm font-semibold">Manage your world-class hospitality team</p>
        </div>
        <GoldButton className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 md:py-3">
          <UserPlus className="w-4 h-4" /> ADD NEW STAFF
        </GoldButton>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         {[
           { label: 'Total Staff', value: '156', color: 'text-luxury-black' },
           { label: 'On Shift', value: '42', color: 'text-green-500' },
           { label: 'Pending Leave', value: '8', color: 'text-blue-400' },
           { label: 'Open Positions', value: '12', color: 'text-orange-400' },
         ].map((stat, i) => (
           <GlassCard key={i} className="bg-white border-gray-100 p-4 md:p-6 text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">{stat.label}</p>
              <h3 className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
           </GlassCard>
         ))}
      </div>

      <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 bg-[#fafafa]">
           <div className="flex bg-white px-5 py-3 rounded-2xl border border-gray-100 w-full md:w-1/3 focus-within:border-luxury-gold transition-all shadow-inner">
              <Search className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
              <input type="text" placeholder="Search employee..." className="bg-transparent border-none outline-none text-xs w-full font-bold uppercase tracking-widest placeholder:text-gray-300" />
           </div>
           <div className="flex gap-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold border-b-2 border-luxury-gold px-2 py-1 shrink-0">All Staff</button>
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 hover:text-luxury-black px-2 py-1 transition-colors shrink-0">By Department</button>
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 hover:text-luxury-black px-2 py-1 transition-colors shrink-0">Performance</button>
           </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fafafa] border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 font-serif">
                <th className="px-8 py-5">Employee Details</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5">Shift Status</th>
                <th className="px-8 py-5">Channels</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {staff.map((emp, i) => (
                 <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-white border border-gray-100 overflow-hidden shrink-0 transition-all p-0.5">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} alt={emp.name} className="w-full h-full object-cover rounded-xl" />
                          </div>
                          <div>
                             <p className="font-bold text-sm text-luxury-black">{emp.name}</p>
                             <p className="text-[10px] text-gray-400 tracking-widest font-bold uppercase">{emp.role}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">{emp.dept}</td>
                    <td className="px-8 py-5">
                       <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                          emp.status === 'On Shift' ? 'bg-green-50 text-green-600 border-green-100' : 
                          emp.status === 'Off Shift' ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-blue-50 text-blue-500 border-blue-100'
                       }`}>
                          {emp.status}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex gap-4 text-gray-300">
                          <div className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer hover:text-luxury-gold"><Phone className="w-4 h-4" /></div>
                          <div className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer hover:text-luxury-gold"><Mail className="w-4 h-4" /></div>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <button className="p-3 hover:bg-white rounded-xl transition-all text-gray-300 hover:text-luxury-black group-hover:shadow-sm">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-50">
           {staff.map((emp, i) => (
             <div key={i} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 p-0.5">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} alt={emp.name} className="w-full h-full rounded-xl" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-800">{emp.name}</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{emp.role}</p>
                      </div>
                   </div>
                   <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                      emp.status === 'On Shift' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                   }`}>
                      {emp.status}
                   </span>
                </div>
                <div className="flex justify-between items-center bg-[#fafafa] p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{emp.dept}</span>
                    <div className="flex gap-3 text-gray-400">
                       <Phone className="w-4 h-4" />
                       <Mail className="w-4 h-4" />
                    </div>
                </div>
             </div>
           ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default HRSystem;
