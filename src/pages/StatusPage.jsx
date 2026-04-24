import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Clock, LogOut, 
  Mail, Phone, ShieldCheck,
  RefreshCcw, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import GoldButton from '../components/GoldButton';

const StatusPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [staffInfo, setStaffInfo] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('Staff')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      // If not staff, maybe they shouldn't be here
      navigate('/');
      return;
    }

    setStaffInfo(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <RefreshCcw className="w-10 h-10 text-luxury-gold animate-spin" />
      </div>
    );
  }

  const isPending = staffInfo.status === 'Pending Approval';
  const isRejected = staffInfo.status === 'Rejected';

  return (
    <div className="min-h-screen bg-luxury-cream flex flex-col font-sans relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-luxury-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-luxury-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      {/* Top Header */}
      <header className="p-8 md:p-12 flex justify-between items-center relative z-10">
        <Logo className="scale-90" />
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-luxury-black transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-3xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-luxury-gold/10"
        >
          <div className={`h-2 w-full ${isRejected ? 'bg-red-500' : 'gold-gradient'}`} />
          
          <div className="p-10 md:p-20 text-center space-y-10">
            {/* Icon */}
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center relative ${isRejected ? 'bg-red-50' : 'bg-luxury-gold/5'}`}>
              {isPending ? (
                <Clock className="w-10 h-10 text-luxury-gold animate-pulse" />
              ) : isRejected ? (
                <ShieldAlert className="w-10 h-10 text-red-500" />
              ) : (
                <ShieldCheck className="w-10 h-10 text-luxury-gold" />
              )}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute inset-0 rounded-full ${isRejected ? 'bg-red-500' : 'bg-luxury-gold'}`}
              />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-luxury-black tracking-tight">
                {isPending ? "Security Review in Progress" : "Access Request Refused"}
              </h1>
              <p className="text-gray-400 text-lg md:text-xl font-medium italic max-w-xl mx-auto leading-relaxed">
                {isPending 
                  ? `"Your application for the Golden Hills Personnel Portal is currently undergoing administrative verification."`
                  : `"We regret to inform you that your access request has been declined by the security board."`}
              </p>
            </div>

            {/* Personnel Card */}
            <div className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Personnel Identity</p>
                <p className="font-bold text-luxury-black text-lg">{staffInfo.name}</p>
                <p className="text-sm text-gray-500">{staffInfo.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Department</p>
                <p className="font-bold text-luxury-gold text-lg">{staffInfo.department}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role: {staffInfo.role}</p>
              </div>
            </div>

            {/* Actions / Info */}
            <div className="pt-6">
              {isPending ? (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-400">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-luxury-gold/50" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Email notification on update</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-luxury-gold/50" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">HR Support: +213 21 00 00</span>
                    </div>
                  </div>
                  <GoldButton onClick={fetchStatus} className="px-12 py-5 text-xs shadow-xl flex items-center justify-center gap-3 mx-auto">
                    <RefreshCcw className="w-4 h-4" /> REFRESH STATUS
                  </GoldButton>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4 text-left">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                    <p className="text-sm text-red-600 font-medium leading-relaxed">
                      If you believe this is an error in biometric validation or personnel records, please contact the Administration Office directly.
                    </p>
                  </div>
                  <GoldButton outline onClick={() => navigate('/')} className="px-12 py-5 text-xs mx-auto">
                    RETURN TO PUBLIC SITE
                  </GoldButton>
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-8 bg-gray-50/50 border-t border-gray-100 text-center">
             <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em]">GHE-SECURITY-PROTOCOL • VERSION 2.6.4</p>
          </div>
        </motion.div>
      </main>

      <footer className="p-12 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic opacity-50">"Excellence is not an act, but a habit."</p>
      </footer>
    </div>
  );
};

export default StatusPage;
