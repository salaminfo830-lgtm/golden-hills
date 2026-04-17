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
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold">Human Resources</h2>
          <p className="text-gray-400">Manage your world-class hospitality team</p>
        </div>
        <GoldButton className="flex items-center gap-2 px-6">
          <UserPlus className="w-4 h-4" /> ADD NEW STAFF
        </GoldButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Staff', value: '156', color: 'text-luxury-gold' },
           { label: 'On Shift', value: '42', color: 'text-green-500' },
           { label: 'Pending Leave', value: '8', color: 'text-blue-500' },
           { label: 'Open Positions', value: '12', color: 'text-orange-500' },
         ].map((stat, i) => (
           <GlassCard key={i} className="bg-white border-gray-100 py-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
           </GlassCard>
         ))}
      </div>

      <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <div className="flex bg-white px-4 py-2 rounded-xl border border-gray-200 w-1/3">
              <Search className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <input type="text" placeholder="Search employee..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
           </div>
           <div className="flex gap-4">
              <button className="text-xs font-bold uppercase tracking-widest text-luxury-gold border-b-2 border-luxury-gold px-2 py-1">All Staff</button>
              <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-luxury-black px-2 py-1 transition-colors">By Department</button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-8 py-4">Employee</th>
                <th className="px-8 py-4">Department</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Contact</th>
                <th className="px-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {staff.map((emp, i) => (
                 <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-4 text-sm font-bold">
                          <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 overflow-hidden shrink-0">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} alt={emp.name} />
                          </div>
                          <div>
                             <p>{emp.name}</p>
                             <p className="text-[10px] text-gray-400 tracking-wide font-medium">{emp.role}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-gray-600">{emp.dept}</td>
                    <td className="px-8 py-4">
                       <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                          emp.status === 'On Shift' ? 'bg-green-50 text-green-600' : 
                          emp.status === 'Off Shift' ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-500'
                       }`}>
                          {emp.status}
                       </span>
                    </td>
                    <td className="px-8 py-4">
                       <div className="flex gap-2 text-gray-300">
                          <Phone className="w-4 h-4 hover:text-luxury-gold cursor-pointer transition-colors" />
                          <Mail className="w-4 h-4 hover:text-luxury-gold cursor-pointer transition-colors" />
                       </div>
                    </td>
                    <td className="px-8 py-4">
                       <button className="p-2 hover:bg-white rounded-lg transition-all text-gray-300 hover:text-luxury-black">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default HRSystem;
