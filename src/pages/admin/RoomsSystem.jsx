import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, MoreVertical, 
  Bed, CheckCircle2,
  Loader2, User, Droplets, Hammer,
  X, Trash2, Edit3, Upload
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import GoldButton from '../../components/GoldButton';

const RoomsSystem = ({ userType = 'Admin' }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [editingRoom, setEditingRoom] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Add Room Form State
  const [newRoom, setNewRoom] = useState({
    number: '',
    type: 'Heritage Deluxe',
    price: 320,
    status: 'Vacant',
    occupancy: 'Clean',
    housekeeper: '',
    image_url: '',
    description: '',
    capacity: 2,
    gallery: [],
    features: []
  });

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
      setRooms(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const uploadedUrls = [];
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `rooms/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('rooms')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('rooms')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }

      if (isGallery) {
        setNewRoom(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...uploadedUrls] }));
      } else {
        setNewRoom(prev => ({ ...prev, image_url: uploadedUrls[0] }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (editingRoom && editingRoom.id) {
      const { error } = await supabase
        .from('Room')
        .update({ ...newRoom, updated_at: new Date().toISOString() })
        .eq('id', editingRoom.id);
      
      if (!error) {
        setShowAddModal(false);
        setEditingRoom(null);
        setNewRoom({ number: '', type: 'Heritage Deluxe', price: 320, status: 'Vacant', occupancy: 'Clean', housekeeper: '', image_url: '', description: '', capacity: 2, gallery: [] });
        fetchRooms();
      } else {
        alert("Error updating room: " + error.message);
        setLoading(false);
      }
    } else {
      const { error } = await supabase.from('Room').insert([{ 
        ...newRoom, 
        updated_at: new Date().toISOString() 
      }]);
      if (!error) {
        setShowAddModal(false);
        setNewRoom({ number: '', type: 'Heritage Deluxe', price: 320, status: 'Vacant', occupancy: 'Clean', housekeeper: '', image_url: '', description: '', capacity: 2, gallery: [] });
        fetchRooms();
      } else {
        alert("Error adding room: " + error.message);
        setLoading(false);
      }
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setNewRoom({
      number: room.number,
      type: room.type,
      price: room.price,
      status: room.status,
      occupancy: room.occupancy,
      housekeeper: room.housekeeper || '',
      image_url: room.image_url || '',
      description: room.description || '',
      capacity: room.capacity || 2,
      gallery: room.gallery || [],
      features: room.features || []
    });
    setShowAddModal(true);
  };

  const handleDeleteRoom = async (id) => {
    if(window.confirm("Are you sure you want to delete this room?")) {
       setLoading(true);
       await supabase.from('Room').delete().eq('id', id);
       fetchRooms();
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const statuses = ['Vacant', 'Occupied', 'Cleaning', 'Maintenance'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    await supabase.from('Room').update({ status: statuses[nextIdx] }).eq('id', id);
    fetchRooms(); // or rely on realtime
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
    <div className="space-y-8 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Rooms & Housekeeping</h2>
          <p className="text-gray-400 font-medium tracking-wide">Live occupancy & inventory management</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <GoldButton outline onClick={fetchRooms} className="flex-1 md:flex-none py-3 px-6 text-[10px]">REFRESH</GoldButton>
           {userType === 'Admin' && (
             <GoldButton onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none py-3 px-8 text-[10px] flex items-center justify-center gap-2">
               <Plus className="w-4 h-4" /> ADD ROOM
             </GoldButton>
           )}
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
      </div>

      <GlassCard className="bg-white border-gray-100 p-0 overflow-hidden overflow-x-auto hidden lg:block">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-[#fafafa] border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Room Info</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Capacity</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</th>
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
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 shadow-sm group relative">
                        {room.image_url ? (
                          <img src={room.image_url} alt={room.number} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full gold-gradient flex items-center justify-center text-white font-bold text-xs">
                            {room.number}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{room.type}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Floor {room.number[0]}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className="text-sm font-bold text-gray-600">{room.capacity || 2} Pax</span>
                </td>
                <td className="px-8 py-6">
                   <button 
                     onClick={() => handleStatusChange(room.id, room.status)}
                     className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border hover:opacity-80 transition-opacity ${statusColors[room.status] || 'bg-gray-100'}`}>
                     {room.status}
                   </button>
                </td>
                <td className="px-8 py-6">
                   <p className="text-[10px] text-gray-400 font-medium max-w-[150px] truncate italic">
                     {room.description || 'No description provided...'}
                   </p>
                </td>
                <td className="px-8 py-6">
                   {userType === 'Admin' ? (
                     <div className="flex items-center gap-2">
                       <button onClick={() => handleEditRoom(room)} className="p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors text-gray-400 hover:text-luxury-gold">
                         <Edit3 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDeleteRoom(room.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   ) : (
                     <button className="px-4 py-1.5 text-[10px] font-bold rounded-lg border border-gray-200 text-gray-400">RESTRICTED</button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
         {filteredRooms.map((room) => (
           <GlassCard key={room.id} className="bg-white border-gray-100 p-6 space-y-4">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                       {room.image_url ? (
                         <img src={room.image_url} alt={room.number} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full gold-gradient flex items-center justify-center text-white font-bold">
                            {room.number}
                         </div>
                       )}
                    </div>
                    <div>
                       <h4 className="font-bold">{room.type}</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Floor {room.number[0]}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => handleStatusChange(room.id, room.status)}
                   className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border hover:opacity-80 transition-opacity ${statusColors[room.status] || 'bg-gray-100'}`}>
                    {room.status}
                 </button>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">{room.housekeeper || 'Unassigned'}</span>
                 </div>
                 <button onClick={() => handleDeleteRoom(room.id)} className="text-red-500 p-2"><Trash2 className="w-4 h-4"/></button>
              </div>
           </GlassCard>
         ))}
      </div>

      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
           {/* Backdrop */}
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setShowAddModal(false)} 
             className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
           />
           
           {/* Drawer */}
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-lg h-full bg-[#fafafa] shadow-2xl flex flex-col border-l border-luxury-gold/20"
           >
              {/* Header */}
              <div className="p-8 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-2xl font-bold font-serif text-luxury-black">Add New Room</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Inventory Management</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-luxury-black hover:bg-gray-100 transition-colors">
                   <X className="w-5 h-5"/>
                 </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                 <form id="add-room-form" onSubmit={handleAddRoom} className="space-y-8">
                   
                   {/* Preview Card */}
                   <div className="relative h-48 bg-gray-100 rounded-3xl overflow-hidden shadow-xl group border border-gray-200">
                      {newRoom.image_url ? (
                        <img src={newRoom.image_url} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full gold-gradient" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-8 right-8 z-10 flex justify-between items-end">
                         <div>
                            <h4 className="text-3xl font-serif font-bold tracking-tight text-white">{newRoom.type}</h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mt-1">Room {newRoom.number || '---'}</p>
                         </div>
                         <p className="text-2xl font-bold text-luxury-gold">{newRoom.price ? `$${newRoom.price.toLocaleString()}` : '---'}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Room Number</label>
                          <input required placeholder="e.g. 401" value={newRoom.number} onChange={e=>setNewRoom({...newRoom, number: e.target.value})} type="text" className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Nightly Rate (USD)</label>
                          <input required type="number" placeholder="320" value={newRoom.price} onChange={e=>setNewRoom({...newRoom, price: Number(e.target.value)})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Room Photography</label>
                        <div className="flex gap-4">
                           <input 
                             placeholder="https://images.unsplash.com/photo-..." 
                             value={newRoom.image_url} 
                             onChange={e=>setNewRoom({...newRoom, image_url: e.target.value})} 
                             type="text" 
                             className="flex-1 bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" 
                           />
                           <input
                             type="file"
                             hidden
                             ref={fileInputRef}
                             onChange={handleFileUpload}
                             accept="image/*"
                           />
                           <GoldButton 
                             type="button"
                             outline 
                             onClick={() => fileInputRef.current.click()}
                             className="px-6 py-4 flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px]"
                           >
                             {uploading ? <Loader2 className="w-4 h-4 animate-spin text-luxury-gold" /> : <Upload className="w-4 h-4" />}
                             <span className="text-[10px] font-bold uppercase tracking-widest">{uploading ? 'Uploading...' : 'Upload'}</span>
                           </GoldButton>
                        </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Room Name</label>
                       <input 
                         list="room-categories"
                         value={newRoom.type} 
                         onChange={e=>setNewRoom({...newRoom, type: e.target.value})} 
                         placeholder="e.g. Sapphire Garden View"
                         className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm"
                       />
                       <datalist id="room-categories">
                         <option value="Heritage Deluxe" />
                         <option value="Royal Gold Suite" />
                         <option value="Presidential Panorama" />
                         <option value="Executive Hillside" />
                         <option value="Sapphire Garden Room" />
                         <option value="Imperial Family Wing" />
                       </datalist>
                     </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Room Features & Amenities</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                           {newRoom.features && newRoom.features.map((feat, idx) => (
                             <span key={idx} className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-[10px] font-bold rounded-full flex items-center gap-2">
                                {feat}
                                <button type="button" onClick={() => setNewRoom(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))}>
                                   <X className="w-3 h-3" />
                                </button>
                             </span>
                           ))}
                        </div>
                        <input 
                          type="text" 
                          placeholder="Type and press Enter to add features" 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (e.target.value.trim()) {
                                setNewRoom(prev => ({ ...prev, features: [...(prev.features || []), e.target.value.trim()] }));
                                e.target.value = '';
                              }
                            }
                          }}
                          className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm mb-6" 
                        />
                      </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Initial Status</label>
                          <select value={newRoom.status} onChange={e=>setNewRoom({...newRoom, status: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm cursor-pointer appearance-none">
                            <option>Vacant</option>
                            <option>Maintenance</option>
                            <option>Cleaning</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Housekeeper</label>
                          <input type="text" placeholder="e.g. Amina K." value={newRoom.housekeeper} onChange={e=>setNewRoom({...newRoom, housekeeper: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-colors shadow-sm" />
                        </div>
                     </div>
                   </div>
                 </form>
              </div>

              {/* Footer */}
              <div className="p-8 bg-white border-t border-gray-100 shrink-0">
                 <GoldButton form="add-room-form" type="submit" className="w-full py-4 shadow-lg text-sm flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SAVE ROOM TO SYSTEM'}
                 </GoldButton>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
};

export default RoomsSystem;
