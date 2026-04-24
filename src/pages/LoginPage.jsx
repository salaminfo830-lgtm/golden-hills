import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shield, Mail, Lock, ArrowRight, Loader2, Key, UserCircle } from 'lucide-react';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.error || null);
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [attempts, setAttempts] = useState(Number(localStorage.getItem('login_attempts') || 0));
  const [cooldown, setCooldown] = useState(Number(localStorage.getItem('login_cooldown') || 0));
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setIsResetting(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (cooldown > Date.now()) {
      const minutes = Math.ceil((cooldown - Date.now()) / 60000);
      setError(`Security Lockout: Please wait ${minutes} minute(s) before retrying.`);
      setLoading(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('login_attempts', newAttempts.toString());

      await supabase.from('SecurityLog').insert([{
        event: `Failed Login Attempt: ${cleanEmail}`,
        status: 'Warning',
        location: 'Login Portal'
      }]);

      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 5 * 60 * 1000; // 5 minutes
        setCooldown(lockoutTime);
        localStorage.setItem('login_cooldown', lockoutTime.toString());
        setError("Security Lockout: 5 failed attempts. Access restricted for 5 minutes.");
      } else {
        setError(`${authError.message} (${5 - newAttempts} attempts remaining)`);
      }
      setLoading(false);
      return;
    }

    // Success
    setAttempts(0);
    localStorage.removeItem('login_attempts');
    localStorage.removeItem('login_cooldown');

    await supabase.from('SecurityLog').insert([{
      event: `Authorized Login: ${cleanEmail}`,
      status: 'Success',
      location: 'Login Portal'
    }]);

    const user = authData.user;
    const userId = user?.id;
    const userEmail = user?.email;
    const from = location.state?.from;
    
    // 0. Emergency bypass for primary admin account (matches ProtectedRoute)
    if (userEmail === 'admin@gmail.com') {
      navigate(from || '/admin');
      return;
    }

    // 1. Check Profile for Role
    let { data: profileData } = await supabase.from('Profile').select('role').eq('id', userId).single();
    
    // Fallback for seeded admin account by email if ID lookup failed (common in seeded environments)
    if (!profileData && userEmail === 'fares@goldenhills.dz') {
      profileData = { role: 'admin' };
    }
    
    if (profileData?.role === 'admin') {
      navigate(from || '/admin');
      return;
    }

    // 2. Check Staff Table
    const { data: staffData } = await supabase.from('Staff').select('status, role').eq('id', userId).single();
    if (staffData) {
      if (staffData.status === 'Pending Approval' || staffData.status === 'Rejected') {
        navigate('/status');
        return;
      }
      navigate(from || '/staff');
      return;
    }

    // 3. Default to Guest / Dashboard
    navigate(from || '/dashboard');
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address to recover your key.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      setError(error.message);
    } else {
      setError("Recovery protocol initiated. Check your email.");
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError(error.message);
    } else {
      setError("Access key updated successfully. You can now log in.");
      setIsResetting(false);
      setNewPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-luxury-cream flex font-sans">
      {/* Visual Column */}
      <div className="hidden lg:flex w-1/2 relative bg-luxury-black overflow-hidden items-center justify-center">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "linear" }}
          className="absolute inset-0 opacity-40"
        >
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Hotel View" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-transparent to-transparent" />
        
        <div className="relative z-10 p-24 text-center">
          <Logo inverse className="mx-auto mb-12 scale-150" />
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-tight">Welcome Back to <br /> <span className="italic">the Sanctuary</span></h2>
          <p className="text-white/40 text-lg max-w-md mx-auto font-medium leading-relaxed uppercase tracking-[0.2em]">Authentic Algerian Grandeur • Setif</p>
        </div>

        <div className="absolute bottom-12 left-12 flex gap-10 text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
          <span>GHE-SECURITY</span>
          <span>EST. 2017</span>
        </div>
      </div>

      {/* Form Column */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-white relative">
        <Link to="/" className="absolute top-6 md:top-10 right-6 md:right-10 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-luxury-gold transition-colors">
          Exit to Public Portal
        </Link>

        <div className="w-full max-w-md space-y-12">
          <div className="text-center md:text-left space-y-3 md:space-y-4">
            <h1 className="text-3xl md:text-4xl font-medium text-luxury-black">
              {isResetting ? "Update Access Key" : "Authorized Access"}
            </h1>
            <p className="text-gray-400 font-medium text-base md:text-lg">
              {isResetting ? "Set a new secure key for your account." : "Secure your session with your credentials."}
            </p>
          </div>

          <form onSubmit={isResetting ? handleUpdatePassword : handleLogin} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {error}
              </motion.div>
            )}

            <div className="space-y-6">
              {!isResetting ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.3em] pl-2">Email Identity</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-luxury w-full pl-16 h-16"
                        placeholder="concierge@goldenhills.dz"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.3em]">Access Key</label>
                      <button 
                        type="button" 
                        onClick={handleResetPassword}
                        className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest hover:underline transition-all"
                      >
                        Recover Key
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-luxury w-full pl-16 h-16"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.3em] pl-2">New Access Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-luxury w-full pl-16 h-16"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <GoldButton 
              type="submit" 
              className="w-full py-4 md:py-5 shadow-2xl flex items-center justify-center gap-4 text-[10px] md:text-xs tracking-[0.2em]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>{isResetting ? "UPDATE ACCESS KEY" : "INITIALIZE SESSION"} <ArrowRight className="w-4 h-4" /></>
              )}
            </GoldButton>
          </form>

          <div className="pt-12 border-t border-gray-50 text-center space-y-6">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
              <Shield className="w-4 h-4 text-luxury-gold/50" /> End-to-End Encrypted Secure Portal
            </p>
            <p className="text-sm font-medium text-gray-500">
              New to the Golden Hills? <Link to="/register" className="text-luxury-gold font-bold hover:underline">Apply for membership</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
