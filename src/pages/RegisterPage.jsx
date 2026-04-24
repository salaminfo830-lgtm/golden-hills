import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, User, Phone, 
  Briefcase, Loader2, CheckCircle, 
  ChevronRight, ArrowLeft, ShieldCheck,
  Smartphone, Bell, Heart, Globe
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState('guest'); // 'guest' or 'staff'
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
    department: 'Front Desk',
    preferences: {
      newsletters: true,
      smsAlerts: false,
      language: 'English'
    }
  });

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // More permissive regex: at least 8 chars, 1 upper, 1 lower, 1 digit, 1 special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please provide a valid biometric email identity.");
      setLoading(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      setError("All identity fields are mandatory for entry.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = formData.email.trim().toLowerCase();
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            role: identity
          }
        }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase.from('Profile').insert([{
        id: authData.user?.id,
        email: formData.email,
        full_name: `${formData.firstName} ${formData.lastName}`,
        role: identity
      }]);
      if (profileError) throw profileError;

      if (identity === 'staff') {
        const { error: dbError } = await supabase.from('Staff').insert([{
          id: authData.user?.id,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          status: 'Pending Approval',
          role: 'staff',
          permissions: []
        }]);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('Guest').insert([{
          id: authData.user?.id,
          full_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        }]);
        if (dbError) throw dbError;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          className="max-w-2xl w-full bg-white p-12 md:p-24 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-3 gold-gradient" />
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-luxury-black mb-8 leading-tight">
            {identity === 'guest' ? 'Welcome to the Sanctuary' : 'Application Received'}
          </h2>
          <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto leading-relaxed">
            {identity === 'guest' 
              ? 'Your account has been successfully created. Your journey into the gilded heart of Algerian luxury begins now.' 
              : 'Your staff credentials have been submitted. Our administrative team will review your application shortly.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <GoldButton onClick={() => navigate('/login')} className="px-12 py-5 shadow-2xl">LOG IN SECURELY</GoldButton>
            <button onClick={() => navigate('/')} className="px-12 py-5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all">RETURN HOME</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      {/* Left Visual Side */}
      <div className="hidden lg:flex w-[45%] relative items-center justify-center bg-luxury-black overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
           <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Hotel Luxury" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent opacity-90" />
        
        <div className="relative z-10 px-20 text-center">
          <Logo inverse className="mx-auto mb-16 scale-[1.5]" />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight italic">
                {step === 1 && "The Genesis"}
                {step === 2 && "Identity Protocol"}
                {step === 3 && "Personal Portrait"}
                {step === 4 && "Final Excellence"}
              </h2>
              <p className="text-white/50 text-lg font-light leading-relaxed max-w-sm mx-auto uppercase tracking-[0.2em] text-[10px]">
                {step === 1 && "Select your access tier to the Golden Hills."}
                {step === 2 && "Secure your digital signature for the sanctuary."}
                {step === 3 && (identity === 'staff' ? "Assign your department for operations." : "Tell us about your preferences.")}
                {step === 4 && "Agree to our terms of absolute excellence."}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-20 flex justify-center gap-4">
             {[1,2,3,4].map(s => (
               <div key={s} className={`h-1 transition-all duration-700 rounded-full ${step === s ? 'w-16 bg-luxury-gold shadow-[0_0_15px_rgba(201,168,76,0.5)]' : 'w-6 bg-white/10'}`} />
             ))}
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 relative flex flex-col bg-[#FAF9F6] p-8 md:p-16 lg:p-24 overflow-y-auto">
        <div className="mb-12">
           <Link to="/" className="inline-flex items-center gap-4 group text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-luxury-gold transition-all">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Grand Entrance
           </Link>
        </div>

        <div className="max-w-2xl w-full mx-auto my-auto py-10 lg:py-0">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12 md:space-y-16"
              >
                <div className="space-y-4 md:space-y-6 text-center md:text-left">
                  <h3 className="text-4xl md:text-5xl font-serif text-luxury-black leading-tight">Begin Your <br/><span className="italic gold-text-gradient">Grand Journey</span></h3>
                  <p className="text-gray-400 text-lg font-light tracking-wide">Select your specialized access tier to continue.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div 
                    onClick={() => setIdentity('guest')}
                    className={`p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border-2 cursor-pointer transition-all duration-700 relative group ${identity === 'guest' ? 'border-luxury-gold bg-white shadow-[0_40px_80px_rgba(201,168,76,0.12)] scale-[1.02]' : 'border-gray-100 bg-white/50 hover:bg-white hover:border-luxury-gold/20'}`}
                  >
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center mb-8 md:mb-10 transition-all duration-700 ${identity === 'guest' ? 'bg-luxury-gold text-white rotate-[360deg]' : 'bg-gray-100 text-gray-400 group-hover:bg-luxury-gold/10 group-hover:text-luxury-gold'}`}>
                       <Heart className="w-7 md:w-8 h-7 md:h-8" />
                    </div>
                    <h4 className="text-xl md:text-2xl font-serif mb-3">The Guest</h4>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light">Experience the full grandeur of our suites and curated services.</p>
                    {identity === 'guest' && <motion.div layoutId="check" className="absolute top-6 md:top-8 right-6 md:right-8 text-luxury-gold"><CheckCircle className="w-6 md:w-8 h-6 md:h-8" /></motion.div>}
                  </div>

                  <div 
                    onClick={() => setIdentity('staff')}
                    className={`p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border-2 cursor-pointer transition-all duration-700 relative group ${identity === 'staff' ? 'border-luxury-gold bg-white shadow-[0_40px_80px_rgba(201,168,76,0.12)] scale-[1.02]' : 'border-gray-100 bg-white/50 hover:bg-white hover:border-luxury-gold/20'}`}
                  >
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center mb-8 md:mb-10 transition-all duration-700 ${identity === 'staff' ? 'bg-luxury-gold text-white rotate-[360deg]' : 'bg-gray-100 text-gray-400 group-hover:bg-luxury-gold/10 group-hover:text-luxury-gold'}`}>
                       <Briefcase className="w-7 md:w-8 h-7 md:h-8" />
                    </div>
                    <h4 className="text-xl md:text-2xl font-serif mb-3">The Personnel</h4>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light">Operational access for the guardians of Golden Hills excellence.</p>
                    {identity === 'staff' && <motion.div layoutId="check" className="absolute top-6 md:top-8 right-6 md:right-8 text-luxury-gold"><CheckCircle className="w-6 md:w-8 h-6 md:h-8" /></motion.div>}
                  </div>
                </div>

                <GoldButton onClick={nextStep} className="w-full py-5 md:py-6 text-[11px] md:text-xs shadow-2xl tracking-[0.3em]">
                  CONTINUE TO PROTOCOL <ChevronRight className="inline-block ml-3 w-5 h-5" />
                </GoldButton>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-10 md:space-y-12"
              >
                <div className="space-y-4 md:space-y-6 text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-serif text-luxury-black leading-tight italic">Security Credentials</h3>
                  <p className="text-gray-400 text-lg font-light tracking-wide">Establish your secure digital handshake with the Sanctuary.</p>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] pl-4">Digital Identity (Email)</label>
                    <div className="relative group">
                      <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="input-luxury w-full pl-20 md:pl-24 h-16 md:h-20 text-base rounded-[2rem] border-gray-100/50 bg-white shadow-sm focus:shadow-xl transition-all" 
                        placeholder={identity === 'staff' ? "personnel@goldenhills.dz" : "excellence@goldenhills.dz"} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] pl-4">Access Key</label>
                      <div className="relative group">
                        <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                        <input 
                          type="password" 
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="input-luxury w-full pl-20 md:pl-24 h-16 md:h-20 text-base rounded-[2rem] border-gray-100/50 bg-white shadow-sm focus:shadow-xl transition-all" 
                          placeholder="••••••••" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] pl-4">Verify Key</label>
                      <div className="relative group">
                        <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                        <input 
                          type="password" 
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="input-luxury w-full pl-20 md:pl-24 h-16 md:h-20 text-base rounded-[2rem] border-gray-100/50 bg-white shadow-sm focus:shadow-xl transition-all" 
                          placeholder="••••••••" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                   <button onClick={prevStep} className="px-12 py-5 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-50 transition-all">Previous</button>
                   <GoldButton onClick={nextStep} className="flex-1 py-5 md:py-6 text-[11px] md:text-xs shadow-2xl tracking-[0.3em]">
                     NEXT STEP <ChevronRight className="inline-block ml-3 w-5 h-5" />
                   </GoldButton>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-10 md:space-y-12"
              >
                <div className="space-y-4 md:space-y-6 text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-serif text-luxury-black leading-tight italic">Personal Portrait</h3>
                  <p className="text-gray-400 text-lg font-light tracking-wide">Tell us how you should be addressed within the Sanctuary.</p>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] pl-4">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="input-luxury w-full h-16 md:h-20 px-8 text-base rounded-[2rem] border-gray-100/50 bg-white shadow-sm focus:shadow-xl transition-all" 
                        placeholder="Amine" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] pl-4">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="input-luxury w-full h-16 md:h-20 px-8 text-base rounded-[2rem] border-gray-100/50 bg-white shadow-sm focus:shadow-xl transition-all" 
                        placeholder="Benali" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] pl-4">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="input-luxury w-full pl-20 md:pl-24 h-16 md:h-20 text-base rounded-[2rem] border-gray-100/50 bg-white shadow-sm focus:shadow-xl transition-all" 
                        placeholder="+213 6 XX XX XX XX" 
                      />
                    </div>
                  </div>

                  {identity === 'staff' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] pl-4">Department Assignment</label>
                      <div className="relative group">
                        <Briefcase className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                        <select 
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="input-luxury w-full pl-20 md:pl-24 h-16 md:h-20 text-base rounded-[2rem] border-gray-100/50 bg-white shadow-sm focus:shadow-xl transition-all appearance-none cursor-pointer"
                        >
                          <option>Front Desk</option>
                          <option>Housekeeping</option>
                          <option>Kitchen</option>
                          <option>Security</option>
                          <option>Finance</option>
                          <option>Administration</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                   <button onClick={prevStep} className="px-12 py-5 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-50 transition-all">Previous</button>
                   <GoldButton onClick={nextStep} className="flex-1 py-5 md:py-6 text-[11px] md:text-xs shadow-2xl tracking-[0.3em]">
                     NEXT STEP <ChevronRight className="inline-block ml-3 w-5 h-5" />
                   </GoldButton>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12 md:space-y-16"
              >
                <div className="space-y-4 md:space-y-6 text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-serif text-luxury-black leading-tight italic">Final Excellence</h3>
                  <p className="text-gray-400 text-lg font-light tracking-wide">Refine your experience preferences before completing your registration.</p>
                </div>

                <div className="space-y-6 md:space-y-8">
                   <div className="flex items-center justify-between p-8 md:p-10 rounded-[2.5rem] border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-6 md:gap-8">
                        <div className="p-4 md:p-5 bg-luxury-gold/10 text-luxury-gold rounded-2xl group-hover:scale-110 transition-transform"><Bell className="w-5 md:w-6 h-5 md:h-6" /></div>
                        <div>
                          <p className="font-serif text-lg text-luxury-black">Event Invitations</p>
                          <p className="text-xs md:text-sm text-gray-400 font-light">Exclusive galas and cultural showcases.</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={formData.preferences.newsletters}
                          onChange={(e) => setFormData({...formData, preferences: {...formData.preferences, newsletters: e.target.checked}})}
                          className="w-8 h-8 rounded-full border-gray-200 text-luxury-gold focus:ring-luxury-gold cursor-pointer transition-all" 
                        />
                      </div>
                   </div>

                   <div className="p-8 md:p-10 bg-luxury-gold/[0.03] rounded-[2.5rem] border border-luxury-gold/10 flex items-start gap-6">
                      <ShieldCheck className="text-luxury-gold w-6 md:w-8 h-6 md:h-8 shrink-0 mt-1" />
                      <p className="text-xs md:text-sm text-luxury-gold/70 font-light leading-relaxed">
                        By formalizing this request, you agree to uphold the <span className="font-bold text-luxury-gold">Terms of Absolute Excellence</span> and the Golden Hills privacy protocols.
                      </p>
                   </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {error}
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-6">
                   <button onClick={prevStep} className="px-12 py-5 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gray-50 transition-all">Previous</button>
                   <GoldButton onClick={handleRegister} disabled={loading} className="flex-1 py-5 md:py-6 text-[11px] md:text-xs shadow-2xl tracking-[0.3em]">
                     {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "COMPLETE PROTOCOL"}
                   </GoldButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 md:mt-20 pt-6 md:pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center md:text-left">
             <p>© 2026 Golden Hills Excellence</p>
             <p className="flex items-center gap-2"><Smartphone className="w-3 h-3" /> Secure Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
