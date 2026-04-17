import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import GoldButton from '../components/GoldButton';
import GlassCard from '../components/GlassCard';
import Logo from '../components/Logo';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-white-warm flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-luxury-gold/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxury-gold/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Logo className="mb-6 justify-center scale-110" />
          <h1 className="text-3xl font-serif font-bold text-luxury-black tracking-tight">System Access</h1>
          <p className="text-gray-400 font-medium text-sm mt-2 uppercase tracking-widest">Administrator Portal</p>
        </div>

        <GlassCard className="bg-white/80 border-luxury-gold/20 p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-luxury-gold transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-luxury-gold focus:bg-white transition-all text-sm font-medium"
                  placeholder="admin@golden-hills.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest pl-1">Secret Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-luxury-gold transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-luxury-gold focus:bg-white transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-[10px] font-bold text-gray-400 hover:text-luxury-gold uppercase tracking-widest transition-colors">Forgot Secret?</button>
            </div>

            <GoldButton 
              type="submit" 
              className="w-full py-4 shadow-gold flex items-center justify-center gap-3"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>AUTHORIZE SESSION <ArrowRight className="w-4 h-4" /></>
              )}
            </GoldButton>
          </form>

          <p className="mt-8 text-[10px] text-center text-gray-400 uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-luxury-gold" /> End-to-End Encrypted Authentication
          </p>
        </GlassCard>

        <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Golden Hills Hotel © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
