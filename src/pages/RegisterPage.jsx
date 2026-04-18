import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Briefcase, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import GoldButton from '../components/GoldButton';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Housekeeping'
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
          }
        }
      });

      if (authError) throw authError;

      // 2. Insert into Staff table as Pending Approval
      const { error: dbError } = await supabase.from('Staff').insert([{
        id: authData.user?.id, // Link the auth user ID to the Staff record
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        status: 'Pending Approval',
        role: 'staff',
        permissions: [] // No access until approved
      }]);

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 text-center">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="w-10 h-10 text-green-500" />
           </div>
           <h2 className="text-3xl font-elegant font-bold text-luxury-black mb-4">Request Submitted</h2>
           <p className="text-gray-500 mb-8">Your registration has been sent to the Administration. You will be able to access your systems once your department head approves the request.</p>
           <GoldButton onClick={() => navigate('/login')} className="w-full py-3">RETURN TO LOGIN</GoldButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans">
      {/* Left side - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-luxury-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img src="/logo.jpg" alt="Golden Hills" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
        <div className="relative z-20 text-center px-12">
           <img src="/logo.jpg" alt="Logo" className="w-32 h-32 object-contain mx-auto mb-8 drop-shadow-2xl brightness-0 invert" />
           <h1 className="text-5xl font-elegant font-bold text-white mb-6 tracking-wide">Join Our Excellence</h1>
           <p className="text-white/70 text-lg max-w-md mx-auto font-light leading-relaxed">System integration portal for Golden Hills staff and personnel.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link to="/" className="absolute top-8 left-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-luxury-gold transition-colors">
           ← Return to Portal
        </Link>
        
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-elegant font-bold tracking-tight text-luxury-black mb-2">Staff Registration</h2>
            <p className="text-gray-500 text-sm">Submit your details to request system access.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl border border-red-100 flex items-start gap-3">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 pl-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} type="text" className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all shadow-sm" placeholder="John" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 pl-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} type="text" className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all shadow-sm" placeholder="Doe" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 pl-1">Department</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all shadow-sm appearance-none cursor-pointer">
                  <option>Housekeeping</option>
                  <option>Kitchen</option>
                  <option>Security</option>
                  <option>Finance</option>
                  <option>Administration</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all shadow-sm" placeholder="employee@goldenhills.dz" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 pl-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all shadow-sm" placeholder="+213 XX XX XX XX" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 pl-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" minLength={6} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all shadow-sm" placeholder="••••••••" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 pl-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} type="password" minLength={6} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all shadow-sm" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <GoldButton type="submit" disabled={loading} className="w-full py-4 mt-4 shadow-lg flex items-center justify-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SUBMIT REQUEST'}
            </GoldButton>
            
            <p className="text-center text-xs text-gray-500 pt-4">
              Already approved? <Link to="/login" className="text-luxury-gold font-bold hover:underline">Log in securely</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
