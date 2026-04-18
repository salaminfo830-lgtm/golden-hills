import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, AlertCircle, Info, Clock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const NotificationMenu = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    const subscription = supabase
      .channel(`public:Notification:user_id=eq.${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'Notification',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('Notification')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error) {
        setNotifications(data || []);
        setUnreadCount((data || []).filter(n => !n.read).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('Notification')
      .update({ read: true })
      .eq('id', id);
    
    if (!error) {
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('Notification')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (!error) {
      fetchNotifications();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer group"
      >
        <div className={`p-2.5 rounded-xl transition-colors ${isOpen ? 'bg-luxury-gold text-white' : 'bg-gray-100/80 group-hover:bg-luxury-gold/10 text-gray-600 group-hover:text-luxury-gold'}`}>
          <Bell className="w-5 h-5" />
        </div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-gold text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce-subtle">
            {unreadCount}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-[#fafafa]">
                 <div>
                    <h3 className="text-lg font-bold font-serif text-luxury-black">Notifications</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-0.5">Stay Updated</p>
                 </div>
                 {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest hover:underline"
                    >
                      Mark all as read
                    </button>
                 )}
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {loading ? (
                  <div className="p-20 flex flex-col items-center justify-center opacity-40">
                    <Loader2 className="w-8 h-8 animate-spin text-luxury-gold mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Syncing status...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-20 text-center opacity-40">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-5 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${!notif.read ? 'bg-luxury-gold/5' : ''}`}
                      >
                         <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notif.read ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                           {getIcon(notif.type)}
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                               <p className={`text-sm font-bold ${!notif.read ? 'text-luxury-black' : 'text-gray-500'}`}>{notif.title}</p>
                               {!notif.read && <div className="w-2 h-2 bg-luxury-gold rounded-full shrink-0" />}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">{notif.message}</p>
                            <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
                               <Clock className="w-3 h-3" />
                               {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 text-center">
                 <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-luxury-gold transition-colors">
                   View All Security Logs
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationMenu;
