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
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          className="max-w-2xl w-full bg-white p-10 md:p-20 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 gold-gradient" />
          <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-luxury-black mb-6">
            {identity === 'guest' ? 'Welcome to the Sanctuary' : 'Application Received'}
          </h2>
          <p className="text-gray-500 text-base md:text-lg mb-10 md:mb-12 max-w-md mx-auto leading-relaxed">
            {identity === 'guest' 
              ? 'Your account has been successfully created. You can now explore our gilded suites.' 
              : 'Your staff credentials have been submitted for administrative review.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <GoldButton onClick={() => navigate('/login')} className="px-10 py-4 shadow-xl">LOG IN SECURELY</GoldButton>
            <button onClick={() => navigate('/')} className="px-10 py-4 bg-gray-50 rounded-2xl text-[10px] font-bold uppercase tracking-widest">HOME</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      {/* Left Visual Side */}
      <div className="hidden lg:flex w-[40%] relative items-center justify-center bg-luxury-black overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute inset-0 opacity-60"
        >
           <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Hotel Luxury" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-90" />
        
        <div className="relative z-10 px-16 text-center">
          <Logo inverse className="mx-auto mb-12 scale-125" />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-white leading-tight">
                {step === 1 && "Choose Your Path"}
                {step === 2 && "Identity & Security"}
                {step === 3 && "Personal Details"}
                {step === 4 && "Final Touches"}
              </h2>
              <p className="text-white/60 text-base font-light leading-relaxed">
                {step === 1 && "Select how you would like to experience Golden Hills."}
                {step === 2 && "Secure your access to our exclusive sanctuary."}
                {step === 3 && "Tell us more about yourself."}
                {step === 4 && "Tailor your experience."}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-16 flex justify-center gap-3">
             {[1,2,3,4].map(s => (
               <div key={s} className={`h-1 transition-all duration-500 rounded-full ${step === s ? 'w-10 bg-luxury-gold' : 'w-4 bg-white/20'}`} />
             ))}
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 relative flex flex-col bg-luxury-cream/30 p-6 md:p-12 lg:p-20 overflow-y-auto">
        <div className="mb-12 lg:mb-0">
           <Link to="/" className="flex items-center gap-3 group text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-luxury-black transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
           </Link>
        </div>

        <div className="max-w-xl w-full mx-auto my-auto py-10 lg:py-0">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 md:space-y-12"
              >
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-3xl md:text-5xl font-bold text-luxury-black">Begin Your Journey</h3>
                  <p className="text-gray-500 text-base md:text-lg">Select your account type.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div 
                    onClick={() => setIdentity('guest')}
                    className={`p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 relative group ${identity === 'guest' ? 'border-luxury-gold bg-white shadow-xl md:shadow-2xl' : 'border-gray-100 bg-white/50 hover:bg-white hover:border-luxury-gold/30'}`}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8 transition-colors ${identity === 'guest' ? 'bg-luxury-gold text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-luxury-gold/10 group-hover:text-luxury-gold'}`}>
                       <Heart className="w-5 md:w-6 h-5 md:h-6" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold mb-2">Guest Account</h4>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">Book suites and manage stays.</p>
                    {identity === 'guest' && <motion.div layoutId="check" className="absolute top-4 md:top-6 right-4 md:right-6 text-luxury-gold"><CheckCircle className="w-5 md:w-6 h-5 md:h-6" /></motion.div>}
                  </div>

                  <div 
                    onClick={() => setIdentity('staff')}
                    className={`p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 relative group ${identity === 'staff' ? 'border-luxury-gold bg-white shadow-xl md:shadow-2xl' : 'border-gray-100 bg-white/50 hover:bg-white hover:border-luxury-gold/30'}`}
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8 transition-colors ${identity === 'staff' ? 'bg-luxury-gold text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-luxury-gold/10 group-hover:text-luxury-gold'}`}>
                       <Briefcase className="w-5 md:w-6 h-5 md:h-6" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold mb-2">Personnel Portal</h4>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">Operations access.</p>
                    {identity === 'staff' && <motion.div layoutId="check" className="absolute top-4 md:top-6 right-4 md:right-6 text-luxury-gold"><CheckCircle className="w-5 md:w-6 h-5 md:h-6" /></motion.div>}
                  </div>
                </div>

                <GoldButton onClick={nextStep} className="w-full py-4 md:py-5 text-[10px] md:text-xs shadow-xl">
                  CONTINUE <ChevronRight className="inline-block ml-2 w-4 h-4" />
                </GoldButton>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 md:space-y-10"
              >
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-luxury-black">Security Credentials</h3>
                  <p className="text-gray-500 text-sm md:text-base">Provide your secure access key.</p>
                </div>

                <div className="space-y-5 md:space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="input-luxury w-full pl-14 md:pl-16 h-14 md:h-16 text-sm md:text-base" 
                        placeholder="excellence@goldenhills.dz" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="password" 
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="input-luxury w-full pl-14 md:pl-16 h-14 md:h-16 text-sm md:text-base" 
                          placeholder="••••••••" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Confirm Key</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="password" 
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="input-luxury w-full pl-14 md:pl-16 h-14 md:h-16 text-sm md:text-base" 
                          placeholder="••••••••" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
                   <button onClick={prevStep} className="px-10 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Back</button>
                   <GoldButton onClick={nextStep} className="flex-1 py-4 md:py-5 text-[10px] md:text-xs shadow-xl">
                     NEXT <ChevronRight className="inline-block ml-2 w-4 h-4" />
                   </GoldButton>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 md:space-y-10"
              >
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-luxury-black">Identity</h3>
                  <p className="text-gray-500 text-sm md:text-base">How should we address you?</p>
                </div>

                <div className="space-y-5 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="input-luxury w-full h-14 md:h-16 text-sm" 
                        placeholder="Amine" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="input-luxury w-full h-14 md:h-16 text-sm" 
                        placeholder="Benali" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="input-luxury w-full pl-14 md:pl-16 h-14 md:h-16 text-sm" 
                        placeholder="+213 6 XX XX XX XX" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
                   <button onClick={prevStep} className="px-10 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Back</button>
                   <GoldButton onClick={nextStep} className="flex-1 py-4 md:py-5 text-[10px] md:text-xs shadow-xl">
                     NEXT <ChevronRight className="inline-block ml-2 w-4 h-4" />
                   </GoldButton>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 md:space-y-12"
              >
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-luxury-black">Preferences</h3>
                  <p className="text-gray-400 text-sm md:text-base">Tailor your experience.</p>
                </div>

                <div className="space-y-4 md:space-y-6">
                   <div className="flex items-center justify-between p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 bg-white/50 group">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="p-3 md:p-4 bg-blue-50 text-blue-500 rounded-xl md:rounded-2xl"><Bell className="w-4 md:w-5 h-4 md:h-5" /></div>
                        <div>
                          <p className="font-bold text-sm md:text-base text-luxury-black">Notifications</p>
                          <p className="text-[10px] md:text-xs text-gray-400">Events and galas.</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={formData.preferences.newsletters}
                        onChange={(e) => setFormData({...formData, preferences: {...formData.preferences, newsletters: e.target.checked}})}
                        className="w-5 md:w-6 h-5 md:h-6 rounded-lg border-gray-200 text-luxury-gold focus:ring-luxury-gold" 
                      />
                   </div>

                   <div className="p-6 md:p-8 bg-luxury-gold/5 rounded-[1.5rem] md:rounded-[2rem] border border-luxury-gold/10 flex items-start gap-4">
                      <ShieldCheck className="text-luxury-gold w-5 md:w-6 h-5 md:h-6 shrink-0 mt-1" />
                      <p className="text-[10px] md:text-xs text-luxury-gold/80 font-medium leading-relaxed">
                        By registering, you agree to our Terms of Excellence.
                      </p>
                   </div>
                </div>

                {error && <p className="text-red-500 text-[10px] md:text-xs font-bold text-center">⚠️ {error}</p>}

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                   <button onClick={prevStep} className="px-10 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Back</button>
                   <GoldButton onClick={handleRegister} disabled={loading} className="flex-1 py-4 md:py-5 text-[10px] md:text-xs shadow-xl">
                     {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "COMPLETE"}
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
