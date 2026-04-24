import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, MoreVertical, 
  Bed, CheckCircle2,
  Loader2, User, Droplets, Hammer,
  X, Trash2, Edit3, Upload, Sparkles
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
  const [toast, setToast] = useState(null); // { message, type }
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

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
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('rooms')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error detail:', uploadError);
          throw new Error(uploadError.message || 'Storage upload failed');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('rooms')
          .getPublicUrl(filePath);
        
        console.log('Successfully uploaded room image. Public URL:', publicUrl);
        uploadedUrls.push(publicUrl);
      }

      if (isGallery) {
        setNewRoom(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...uploadedUrls] }));
        showToast(`Added ${uploadedUrls.length} images to gallery`, 'success');
      } else {
        setNewRoom(prev => ({ ...prev, image_url: uploadedUrls[0] }));
        showToast('Primary sanctuary photo updated', 'success');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('UPLOAD FAILED: ' + error.message, 'error');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingRoom && editingRoom.id) {
        const { error } = await supabase
          .from('Room')
          .update({ ...newRoom, updated_at: new Date().toISOString() })
          .eq('id', editingRoom.id);
        
        if (error) throw error;
        
        showToast('Room updated successfully!', 'success');
        setShowAddModal(false);
        setEditingRoom(null);
        resetForm();
        fetchRooms();
      } else {
        const { error } = await supabase.from('Room').insert([{ 
          ...newRoom, 
          updated_at: new Date().toISOString() 
        }]);
        
        if (error) throw error;
        
        showToast('New room added to inventory!', 'success');
        setShowAddModal(false);
        resetForm();
        fetchRooms();
      }
    } catch (error) {
      console.error('Error saving room:', error);
      showToast('FAILED TO SAVE: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewRoom({ 
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
    <div className="space-y-12 font-apple">
      {/* Apple-Style Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">Inventory</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Sanctuary Management</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#050B18] tracking-tight">Fleet Intelligence</h2>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button 
             onClick={fetchRooms} 
             className="btn-apple-secondary flex-1 md:flex-none py-3.5 px-6"
           >
             Sync Database
           </button>
           {userType === 'Admin' && (
             <button 
               onClick={() => { setEditingRoom(null); resetForm(); setShowAddModal(true); }} 
               className="btn-apple-primary flex-1 md:flex-none py-3.5 px-8 flex items-center justify-center gap-2"
             >
               <Plus className="w-4 h-4" /> <span>Provision Sanctuary</span>
             </button>
           )}
        </div>
      </div>

      {/* KPI Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Inventory', value: rooms.length, icon: <Bed />, color: 'text-[#C9A84C]' },
           { label: 'Transit / Cleaning', value: rooms.filter(r => r.status === 'Cleaning').length, icon: <Droplets />, color: 'text-orange-500' },
           { label: 'System Alert', value: rooms.filter(r => r.status === 'Maintenance').length, icon: <Hammer />, color: 'text-red-500' },
           { label: 'Market Ready', value: rooms.filter(r => r.status === 'Vacant').length, icon: <CheckCircle2 />, color: 'text-green-500' },
         ].map((stat, i) => (
           <div key={i} className="apple-card p-8 flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl bg-[#F5F5F7] flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#050B18] tracking-tight">{loading ? '...' : stat.value}</h3>
              </div>
           </div>
         ))}
      </div>

      {/* Logic Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex gap-1 bg-[#F5F5F7] p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {['All', 'Vacant', 'Occupied', 'Cleaning', 'Maintenance'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === f ? 'bg-white text-[#050B18] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
         </div>
      </div>

      {/* Desktop Directory */}
      <div className="apple-card p-0 overflow-hidden hidden lg:block border-none shadow-2xl shadow-gray-100">
        <table className="table-apple">
          <thead>
            <tr>
              <th className="pl-10">Sanctuary Architecture</th>
              <th>Capacity</th>
              <th>Flow Status</th>
              <th>Capital Value</th>
              <th className="pr-10 text-right">Operations</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-32 text-center bg-white">
                   <Loader2 className="w-10 h-10 text-[#C9A84C] animate-spin mx-auto mb-4" />
                   <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">Streaming Inventory Data</p>
                </td>
              </tr>
            ) : filteredRooms.map((room) => (
              <tr key={room.id} className="group">
                <td className="pl-10 py-6">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F5F5F7] border border-gray-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                        {room.image_url ? (
                          <img src={room.image_url} alt={room.number} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#050B18] flex items-center justify-center text-[#C9A84C] font-bold text-xs uppercase">
                            GH {room.number}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#050B18] tracking-tight">{room.type}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Level {room.number[0]} / Sanctuary {room.number}</p>
                      </div>
                   </div>
                </td>
                <td>
                   <span className="text-xs font-bold text-[#050B18]/60 uppercase tracking-widest">{room.capacity || 2} Residency</span>
                </td>
                <td>
                   <button 
                     onClick={() => handleStatusChange(room.id, room.status)}
                     className={`badge-apple ${
                        room.status === 'Vacant' ? 'bg-green-50 text-green-600 border-green-100' :
                        room.status === 'Occupied' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        room.status === 'Cleaning' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-red-50 text-red-600 border-red-100'
                     }`}>
                     {room.status}
                   </button>
                </td>
                <td>
                   <p className="text-sm font-bold text-[#050B18] tracking-tight">
                     {room.price ? `${room.price.toLocaleString()} DZD` : '---'}
                   </p>
                </td>
                <td className="pr-10 py-6 text-right">
                   {userType === 'Admin' ? (
                     <div className="flex items-center justify-end gap-3">
                       <button onClick={() => handleEditRoom(room)} className="p-3 bg-[#F5F5F7] text-gray-400 hover:text-[#050B18] rounded-xl transition-all">
                         <Edit3 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDeleteRoom(room.id)} className="p-3 bg-[#F5F5F7] text-gray-400 hover:text-red-500 rounded-xl transition-all">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   ) : (
                     <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Read Only</span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-8">
         {filteredRooms.map((room) => (
           <div key={room.id} className="apple-card p-8 space-y-6">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                       {room.image_url ? (
                         <img src={room.image_url} alt={room.number} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full bg-[#050B18] flex items-center justify-center text-[#C9A84C] font-bold text-xs">
                            {room.number}
                         </div>
                       )}
                    </div>
                    <div>
                       <h4 className="font-bold text-[#050B18] tracking-tight">{room.type}</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Room {room.number}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => handleStatusChange(room.id, room.status)}
                   className={`badge-apple ${
                      room.status === 'Vacant' ? 'bg-green-50 text-green-600 border-green-100' :
                      room.status === 'Occupied' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      room.status === 'Cleaning' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      'bg-red-50 text-red-600 border-red-100'
                   }`}>
                    {room.status}
                 </button>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                 <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-300" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{room.housekeeper || 'Unassigned'}</span>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleEditRoom(room)} className="p-2 text-gray-300 hover:text-[#050B18] transition-all"><Edit3 className="w-4 h-4"/></button>
                    <button onClick={() => handleDeleteRoom(room.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                 </div>
              </div>
           </div>
         ))}
      </div>      {/* Sanctuary Provisioning Side Panel */}
      <AnimatePresence>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => { setShowAddModal(false); setEditingRoom(null); }} 
             className="absolute inset-0 bg-[#050B18]/40 backdrop-blur-md" 
           />
           <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="relative w-full max-w-xl h-full apple-card p-0 flex flex-col border-none shadow-2xl"
           >
              <div className="p-8 border-b border-gray-50 bg-white flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-2xl font-bold text-[#050B18] tracking-tight">{editingRoom ? 'Update Architecture' : 'Provision Sanctuary'}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{editingRoom ? `Overriding Room ${editingRoom.number}` : 'Sanctuary Deployment'}</p>
                 </div>
                 <button onClick={() => { setShowAddModal(false); setEditingRoom(null); }} className="p-3 bg-[#F5F5F7] rounded-full text-gray-400 hover:text-[#050B18] transition-all">
                   <X className="w-6 h-6"/>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                 <form id="add-room-form" onSubmit={handleAddRoom} className="space-y-10">
                    {/* Visual Asset Preview */}
                    <div className="relative h-60 bg-[#F5F5F7] rounded-3xl overflow-hidden shadow-2xl group">
                       {newRoom.image_url ? (
                         <img src={newRoom.image_url} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                       ) : (
                         <div className="w-full h-full bg-[#050B18] flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-[#C9A84C]/20" />
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent opacity-80" />
                       <div className="absolute bottom-8 left-10 right-10 z-10">
                          <h4 className="text-3xl font-bold text-white tracking-tight">{newRoom.type || 'Sanctuary Designation'}</h4>
                          <div className="flex justify-between items-center mt-2">
                             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Room {newRoom.number || '---'}</p>
                             <p className="text-lg font-bold text-white tracking-tight">{newRoom.price ? `${newRoom.price.toLocaleString()} DZD` : '---'}</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Ident Number</label>
                           <input required placeholder="e.g. 401" value={newRoom.number} onChange={e=>setNewRoom({...newRoom, number: e.target.value})} type="text" className="input-apple w-full" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Capital Value (DZD)</label>
                           <input required type="number" placeholder="250000" value={newRoom.price} onChange={e=>setNewRoom({...newRoom, price: Number(e.target.value)})} className="input-apple w-full" />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Visual Asset (Primary URL)</label>
                         <div className="flex gap-3">
                            <div className="relative flex-1">
                               <input 
                                 placeholder="https://images.unsplash.com/photo-..." 
                                 value={newRoom.image_url} 
                                 onChange={e=>setNewRoom({...newRoom, image_url: e.target.value})} 
                                 type="text" 
                                 className="input-apple w-full pr-12" 
                               />
                               {newRoom.image_url && (
                                 <button 
                                   type="button"
                                   onClick={() => setNewRoom({...newRoom, image_url: ''})}
                                   className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 p-1"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               )}
                            </div>
                            <input type="file" hidden ref={fileInputRef} onChange={(e) => handleFileUpload(e, false)} accept="image/*" />
                            <button 
                              type="button"
                              onClick={() => fileInputRef.current.click()}
                              className="btn-apple-secondary px-6 py-4 flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              <span className="text-[10px] font-bold uppercase tracking-widest">{uploading ? 'Processing' : 'Direct Upload'}</span>
                            </button>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Asset Gallery</label>
                         <div className="grid grid-cols-4 gap-4 mb-4">
                            {newRoom.gallery && newRoom.gallery.map((img, idx) => (
                              <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden group border border-gray-100 shadow-sm">
                                <img src={img} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-[#050B18]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                  <button 
                                    type="button"
                                    onClick={() => setNewRoom(prev => ({ ...prev, image_url: img }))}
                                    className="bg-white text-[#050B18] p-2 rounded-xl hover:scale-110 transition-transform"
                                  >
                                    <Sparkles className="w-4 h-4" />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setNewRoom(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }))}
                                    className="bg-white text-red-500 p-2 rounded-xl hover:scale-110 transition-transform"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                {newRoom.image_url === img && (
                                  <div className="absolute top-2 left-2 bg-[#C9A84C] text-white text-[7px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest">
                                    Primary
                                  </div>
                                )}
                              </div>
                            ))}
                            <label className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A84C]/40 hover:bg-[#F5F5F7] transition-all group">
                               <input type="file" hidden multiple onChange={(e) => handleFileUpload(e, true)} accept="image/*" />
                               <Plus className="w-6 h-6 text-gray-300 group-hover:text-[#C9A84C] transition-colors mb-1" />
                               <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Add Assets</span>
                            </label>
                         </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Architecture Class (Room Name)</label>
                        <input 
                          list="room-categories"
                          value={newRoom.type} 
                          onChange={e=>setNewRoom({...newRoom, type: e.target.value})} 
                          placeholder="e.g. Royal Gold Suite"
                          className="input-apple w-full"
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

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Technical Specifications (Features)</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                           {newRoom.features && newRoom.features.map((feat, idx) => (
                             <span key={idx} className="badge-apple bg-[#C9A84C]/10 text-[#C9A84C] flex items-center gap-2">
                                {feat}
                                <button type="button" onClick={() => setNewRoom(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))}>
                                   <X className="w-3 h-3" />
                                </button>
                             </span>
                           ))}
                        </div>
                        <input 
                          type="text" 
                          placeholder="Type and press Enter to add specs" 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (e.target.value.trim()) {
                                setNewRoom(prev => ({ ...prev, features: [...(prev.features || []), e.target.value.trim()] }));
                                e.target.value = '';
                              }
                            }
                          }}
                          className="input-apple w-full" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Initial Status</label>
                           <select value={newRoom.status} onChange={e=>setNewRoom({...newRoom, status: e.target.value})} className="input-apple w-full appearance-none">
                             <option>Vacant</option>
                             <option>Maintenance</option>
                             <option>Cleaning</option>
                           </select>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Custodial Sync</label>
                           <input type="text" placeholder="e.g. Lead Custodian" value={newRoom.housekeeper} onChange={e=>setNewRoom({...newRoom, housekeeper: e.target.value})} className="input-apple w-full" />
                         </div>
                      </div>
                    </div>
                 </form>
              </div>

              <div className="p-8 bg-white border-t border-gray-50 shrink-0">
                 <button 
                   form="add-room-form" 
                   type="submit" 
                   disabled={loading || uploading}
                   className="btn-apple-primary w-full py-4 flex items-center justify-center gap-2"
                 >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (uploading ? 'Assets Syncing...' : 'Save Sanctuary Record')}
                 </button>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Luxury Toast Hub */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-12 right-12 z-[300] px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-5 border-none ${
              toast.type === 'success' 
                ? 'bg-[#050B18] text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-6 h-6 text-[#C9A84C]" /> : <X className="w-6 h-6" />}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default RoomsSystem;
