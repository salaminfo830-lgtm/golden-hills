import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans overflow-hidden">
      {/* Visual Column */}
      <div className="hidden lg:flex w-1/2 relative bg-luxury-black overflow-hidden items-center justify-center">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Hotel View" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-luxury-black/60 to-transparent" />
        
        <div className="relative z-10 p-24 text-center">
          <Logo inverse className="mx-auto mb-16 scale-[1.8]" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <h2 className="text-5xl md:text-6xl font-serif text-white mb-8 leading-tight italic">The Sanctuary <br/> <span className="not-italic font-light opacity-80">Awaits Your Return</span></h2>
            <div className="w-24 h-1 bg-luxury-gold mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(201,168,76,0.5)]" />
            <p className="text-white/40 text-sm max-w-md mx-auto font-medium leading-relaxed uppercase tracking-[0.4em]">Authentic Algerian Grandeur • Setif</p>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-12 flex gap-12 text-[10px] font-bold text-white/10 uppercase tracking-[0.5em]">
          <span>GHE-SECURITY-V3</span>
          <span>EST. 2017</span>
        </div>
      </div>

      {/* Form Column */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-24 bg-[#FAF9F6] relative overflow-y-auto">
        <Link to="/" className="absolute top-10 right-12 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-luxury-gold transition-all flex items-center gap-3 group">
          Exit to Public Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </Link>

        <div className="w-full max-w-lg space-y-16 py-20">
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif text-luxury-black leading-tight">
              {isResetting ? "Update Your <br/><span className='italic gold-text-gradient'>Access Key</span>" : "Authorized <br/><span className='italic gold-text-gradient'>Access Portal</span>"}
            </h1>
            <p className="text-gray-400 font-light text-lg tracking-wide max-w-sm">
              {isResetting ? "Establish a new secure key for your digital signature." : "Secure your active session within the Sanctuary's encrypted core."}
            </p>
          </div>

          <form onSubmit={isResetting ? handleUpdatePassword : handleLogin} className="space-y-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-4 shadow-sm"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" /> {error}
              </motion.div>
            )}

            <div className="space-y-8">
              {!isResetting ? (
                <>
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase font-bold text-gray-400 tracking-[0.3em] pl-6">Email Identity</label>
                    <div className="relative group">
                      <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-luxury w-full pl-20 h-20 text-lg rounded-[2.5rem] bg-white border-gray-100/50 shadow-sm focus:shadow-2xl transition-all"
                        placeholder="concierge@goldenhills.dz"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-6">
                      <label className="text-[11px] uppercase font-bold text-gray-400 tracking-[0.3em]">Access Key</label>
                      <button 
                        type="button" 
                        onClick={handleResetPassword}
                        className="text-[11px] font-bold text-luxury-gold uppercase tracking-[0.2em] hover:opacity-70 transition-all"
                      >
                        Recover Key
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-luxury w-full pl-20 h-20 text-lg rounded-[2.5rem] bg-white border-gray-100/50 shadow-sm focus:shadow-2xl transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <label className="text-[11px] uppercase font-bold text-gray-400 tracking-[0.3em] pl-6">New Access Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-luxury w-full pl-20 h-20 text-lg rounded-[2.5rem] bg-white border-gray-100/50 shadow-sm focus:shadow-2xl transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <GoldButton 
              type="submit" 
              className="w-full py-6 md:py-7 shadow-[0_30px_60px_-15px_rgba(201,168,76,0.3)] flex items-center justify-center gap-5 text-xs md:text-sm tracking-[0.4em] rounded-[2.5rem]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>{isResetting ? "UPDATE ACCESS KEY" : "INITIALIZE SESSION"} <ArrowRight className="w-5 h-5" /></>
              )}
            </GoldButton>
          </form>

          <div className="pt-16 border-t border-gray-100 text-center space-y-8">
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.4em] flex items-center justify-center gap-4">
              <Shield className="w-5 h-5 text-luxury-gold/40" /> End-to-End Encrypted Secure Portal
            </p>
            <p className="text-base font-light text-gray-500">
              New to the Golden Hills? <Link to="/register" className="text-luxury-gold font-bold hover:underline tracking-wide">Apply for Membership</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
