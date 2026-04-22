import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, CheckCircle2, CreditCard, 
  User, Mail, Phone, Calendar, 
  MapPin, ShieldCheck, Loader2, ArrowRight,
  Shield, Sparkles, AlertCircle, Info,
  MessageSquare, PlaneTakeoff, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';

const BookingFlow = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [room, setRoom] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    requests: '',
    paymentMethod: 'property'
  });

  const checkInStr = searchParams.get('checkIn') || '12 Oct 2026';
  const checkOutStr = searchParams.get('checkOut') || '18 Oct 2026';
  const guests = searchParams.get('guests') || '2';

  // Calculate nights
  const getNights = (d1, d2) => {
    try {
      const date1 = new Date(d1);
      const date2 = new Date(d2);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    } catch (e) {
      return 1;
    }
  };

  const nights = getNights(checkInStr, checkOutStr);

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from('Room')
        .select('*')
        .eq('id', roomId)
        .single();
      
      if (!error) setRoom(data);
      setLoading(false);
    };
    const fetchBank = async () => {
      const { data } = await supabase
        .from('BankAccount')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();
      if (data) setBankAccount(data);
    };
    fetchRoom();
    fetchBank();
  }, [roomId]);

  const handleBooking = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    
    try {
      // 1. Find or Create Guest
      let guestId = null;
      const { data: existingGuest } = await supabase
        .from('Guest')
        .select('id')
        .eq('email', formData.email)
        .single();
      
      if (existingGuest) {
        guestId = existingGuest.id;
      } else {
        const { data: newGuest, error: guestError } = await supabase
          .from('Guest')
          .insert([{ 
            full_name: formData.fullName, 
            email: formData.email, 
            phone: formData.phone 
          }])
          .select()
          .single();
        if (guestError) throw guestError;
        guestId = newGuest?.id;
      }

      const { data: reservation, error: resError } = await supabase.from('Reservation').insert([{
        guest_id: guestId,
        guest_name: formData.fullName,
        room_id: parseInt(roomId),
        room_type: room.type,
        start_date: new Date(checkInStr).toISOString(),
        end_date: new Date(checkOutStr).toISOString(),
        guests_count: parseInt(guests),
        nights: nights,
        total_price: room.price * nights * 1.05,
        status: 'Confirmed',
        source: 'Luxury Web Portal',
        payment_method: formData.paymentMethod === 'bank' ? 'Bank Transfer' : 'Pay at Property',
        payment_status: 'Unpaid'
      }]).select().single();

      if (resError) throw resError;

      // 3. Create Payment Request if Bank Transfer
      if (formData.paymentMethod === 'bank') {
        await supabase.from('PaymentRequest').insert([{
          reservation_id: reservation.id,
          guest_id: guestId,
          amount: room.price * nights * 1.05,
          status: 'Pending'
        }]);
      }
      
      setStep(3);
      window.scrollTo(0, 0);
    } catch (error) {
      setError("Reservation Protocol Interrupted: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  if (loading || !room) {
    return (
      <div className="h-screen flex items-center justify-center bg-luxury-cream">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-cream/30 font-sans pb-32">
      {/* Precision Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-b border-luxury-gold/10 py-6">
        <div className="container mx-auto px-8 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-gray-400 hover:text-luxury-black font-bold text-[10px] uppercase tracking-[0.3em] transition-all">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Selection
          </button>
          <Logo className="scale-90" />
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-3 mr-6">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                   <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${step >= s ? 'bg-luxury-gold border-luxury-gold text-white shadow-gold' : 'bg-white border-gray-100 text-gray-300'}`}>
                      {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                   </div>
                   {s < 3 && <div className={`w-8 h-px ${step > s ? 'bg-luxury-gold' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
               <Shield className="w-5 h-5 text-luxury-gold/50" />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 pt-44">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {step !== 3 ? (
              <motion.div 
                key="booking-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-16"
              >
                {/* Main Flow (Step 1 & 2) */}
                <div className="lg:col-span-7 space-y-12">
                   {step === 1 && (
                     <div className="space-y-12">
                        <div className="space-y-4">
                           <h1 className="text-5xl font-serif font-bold text-luxury-black">Guest Identity</h1>
                           <p className="text-gray-400 font-medium text-lg italic">"Your comfort is our priority. Please provide your official credentials."</p>
                        </div>

                        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setStep(2); window.scrollTo(0, 0); }}>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Full Legal Name</label>
                                 <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                                    <input 
                                      required
                                      type="text" 
                                      placeholder="Ex: Mourad Brahimi" 
                                      value={formData.fullName}
                                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                      className="input-luxury w-full pl-16 h-16" 
                                    />
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Email Address</label>
                                 <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                                    <input 
                                      required
                                      type="email" 
                                      placeholder="mourad@gmail.com" 
                                      value={formData.email}
                                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                                      className="input-luxury w-full pl-16 h-16" 
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Mobile Connection</label>
                              <div className="relative group">
                                 <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-luxury-gold transition-colors" />
                                 <input 
                                   required
                                   type="tel" 
                                   placeholder="+213 --- --- ---" 
                                   value={formData.phone}
                                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                   className="input-luxury w-full pl-16 h-16" 
                                 />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2 flex items-center justify-between">
                                 Concierge Requests (Optional)
                                 <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3 text-luxury-gold" /> Personalized Care</span>
                              </label>
                              <textarea 
                                rows="4" 
                                placeholder="Dietary preferences, high floor request, or any special celebration details..."
                                value={formData.requests}
                                onChange={(e) => setFormData({...formData, requests: e.target.value})}
                                className="w-full bg-white border-2 border-gray-100 rounded-[2rem] px-8 py-6 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm resize-none"
                              />
                           </div>
                           {error && <p className="text-red-500 text-xs font-bold text-center">⚠️ {error}</p>}
                           <GoldButton type="submit" className="w-full py-6 shadow-2xl flex items-center justify-center gap-4 text-xs tracking-[0.2em]">
                              PROCEED TO FINAL REVIEW <ArrowRight className="w-4 h-4" />
                           </GoldButton>
                        </form>
                     </div>
                   )}

                   {step === 2 && (
                     <div className="space-y-12">
                        <div className="space-y-4">
                           <h1 className="text-5xl font-serif font-bold text-luxury-black">Final Confirmation</h1>
                           <p className="text-gray-400 font-medium text-lg italic">"Review your sanctuary details before we secure your arrival."</p>
                        </div>

                        <div className="space-y-8">
                           <GlassCard className="bg-white border-gray-100 p-10 rounded-[3rem] space-y-10 shadow-sm">
                              <div className="grid grid-cols-2 gap-10">
                                 <div className="space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em]">Primary Guest</p>
                                    <p className="text-2xl font-serif font-bold text-luxury-black">{formData.fullName}</p>
                                    <p className="text-sm font-medium text-gray-400">{formData.email}</p>
                                 </div>
                                 <div className="space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em]">Timeline</p>
                                    <p className="text-2xl font-serif font-bold text-luxury-black">{checkInStr} — {checkOutStr}</p>
                                    <p className="text-sm font-medium text-luxury-gold uppercase tracking-widest">{nights} Luxury Evenings</p>
                                 </div>
                              </div>
                              
                              <div className="pt-10 border-t border-gray-50 space-y-8">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-luxury-gold">
                                       <CreditCard className="w-6 h-6" />
                                       <h4 className="text-[10px] font-bold uppercase tracking-[0.4em]">Financial Settlement</h4>
                                    </div>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-4 py-1.5 rounded-full uppercase tracking-widest">No Prepayment Required</span>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div 
                                      onClick={() => setFormData({...formData, paymentMethod: 'property'})}
                                      className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group ${formData.paymentMethod === 'property' ? 'bg-luxury-gold/5 border-luxury-gold' : 'bg-white border-gray-100 hover:border-luxury-gold/30'}`}
                                    >
                                       <div className="flex justify-between items-start mb-6">
                                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.paymentMethod === 'property' ? 'bg-luxury-gold text-white' : 'bg-gray-50 text-gray-400'}`}>
                                             <MapPin className="w-6 h-6" />
                                          </div>
                                          {formData.paymentMethod === 'property' && <div className="w-5 h-5 rounded-full bg-luxury-gold flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                                       </div>
                                       <h5 className="font-bold text-luxury-black mb-1">Pay at Property</h5>
                                       <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">Secure your booking now and settle the balance upon arrival in Setif.</p>
                                    </div>
                                    <div 
                                      onClick={() => setFormData({...formData, paymentMethod: 'bank'})}
                                      className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group ${formData.paymentMethod === 'bank' ? 'bg-luxury-gold/5 border-luxury-gold' : 'bg-white border-gray-100 hover:border-luxury-gold/30'}`}
                                    >
                                       <div className="flex justify-between items-start mb-6">
                                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.paymentMethod === 'bank' ? 'bg-luxury-gold text-white' : 'bg-gray-50 text-gray-400'}`}>
                                             <CreditCard className="w-6 h-6" />
                                          </div>
                                          {formData.paymentMethod === 'bank' && <div className="w-5 h-5 rounded-full bg-luxury-gold flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                                       </div>
                                       <h5 className="font-bold text-luxury-black mb-1">Bank Transfer</h5>
                                       <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">Transfer directly to our corporate account and upload proof.</p>
                                    </div>
                                 </div>
                              </div>
                           </GlassCard>

                           <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2.5rem] flex items-center gap-6">
                              <Info className="w-6 h-6 text-blue-500 shrink-0" />
                              <p className="text-xs text-blue-600 font-medium leading-relaxed">By confirming, you agree to our 24-hour cancellation policy. No charges will be made to your card for "Pay at Property" selections.</p>
                           </div>

                           {error && <p className="text-red-500 text-xs font-bold text-center">⚠️ {error}</p>}

                           <div className="flex gap-6">
                              <button 
                                onClick={() => setStep(1)}
                                className="px-12 h-16 bg-white border-2 border-gray-100 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-50 transition-colors"
                              >
                                Back
                              </button>
                              <GoldButton 
                                onClick={handleBooking}
                                disabled={submitting}
                                className="flex-1 h-16 shadow-2xl flex items-center justify-center gap-4 text-xs tracking-[0.2em]"
                              >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>AUTHENTICATE RESERVATION <Sparkles className="w-5 h-5" /></>}
                              </GoldButton>
                           </div>
                        </div>
                     </div>
                   )}
                </div>

                {/* Sticky Summary Sidebar */}
                <div className="lg:col-span-5">
                   <div className="sticky top-44 space-y-8">
                      <GlassCard className="bg-white border-luxury-gold/10 p-10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
                         
                         <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-10 shadow-xl border border-white/40">
                           <img src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} className="w-full h-full object-cover" alt="Suite" />
                         </div>

                         <div className="space-y-10">
                            <div>
                               <h3 className="text-3xl font-serif font-bold text-luxury-black mb-2">{room.type}</h3>
                               <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                                  <MapPin className="w-4 h-4 text-luxury-gold/50" /> Golden Hills • Setif, DZ
                               </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-gray-100">
                               <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-400 font-medium italic underline underline-offset-4 decoration-luxury-gold/30">{formatPrice(room.price)} x {nights} nights</span>
                                  <span className="font-bold text-luxury-black">{formatPrice(room.price * nights)}</span>
                               </div>
                               <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-400 font-medium flex items-center gap-2">Gilded Service Protocol (10%) <AlertCircle className="w-3.5 h-3.5 text-luxury-gold/40" /></span>
                                  <span className="font-bold text-luxury-black">{formatPrice(room.price * nights * 0.1)}</span>
                               </div>
                               <div className="flex justify-between items-center text-sm text-green-600 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                                  <span className="font-bold uppercase tracking-widest text-[9px]">GHE Web Privilege</span>
                                  <span className="font-bold">- {formatPrice(room.price * nights * 0.05)}</span>
                               </div>
                               
                               <div className="flex justify-between items-end pt-10 border-t border-gray-100">
                                  <div>
                                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-1">Total Sanctuary Investment</p>
                                     <p className="text-4xl font-serif font-bold text-luxury-gold">{formatPrice(room.price * nights * 1.05)}</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </GlassCard>

                      <div className="grid grid-cols-2 gap-4 px-6">
                         <div className="flex items-center gap-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            <ShieldCheck className="w-5 h-5 text-luxury-gold/40" /> SSL SECURED
                         </div>
                         <div className="flex items-center gap-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            <Calendar className="w-5 h-5 text-luxury-gold/40" /> INSTANT CONFIRM
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto"
              >
                 <div className="bg-white p-12 md:p-24 rounded-[4rem] shadow-2xl border border-luxury-gold/10 relative overflow-hidden text-center space-y-12">
                    <div className="absolute top-0 left-0 w-full h-4 gold-gradient" />
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl" />
                    
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10, stiffness: 100 }}
                      className="w-32 h-32 bg-luxury-gold rounded-full flex items-center justify-center mx-auto text-white shadow-gold relative"
                    >
                       <CheckCircle2 className="w-16 h-16" />
                       <motion.div 
                         animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                         transition={{ duration: 2, repeat: Infinity }}
                         className="absolute inset-0 rounded-full bg-luxury-gold"
                       />
                    </motion.div>

                    <div className="space-y-6 relative z-10">
                       <h2 className="text-6xl md:text-8xl font-serif font-bold text-luxury-black tracking-tighter">Sanctuary Secured</h2>
                       <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto italic">
                          "Welcome to the Golden Hills, {formData.fullName.split(' ')[0]}. Your presence is highly anticipated."
                       </p>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-gray-50 relative z-10">
                          <div className="space-y-2">
                             <PlaneTakeoff className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Confirmation Key</p>
                             <p className="text-xl font-bold font-serif">#GH-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                          </div>
                          <div className="space-y-2">
                             <Bell className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Status</p>
                             <p className="text-sm font-bold">{formData.paymentMethod === 'bank' ? 'Pending Transfer' : 'Pay at Property'}</p>
                          </div>
                          <div className="space-y-2">
                             <ShieldCheck className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Arrival Support</p>
                             <p className="text-sm font-bold">24/7 Gilded Concierge</p>
                          </div>
                       </div>

                       {formData.paymentMethod === 'bank' && bankAccount && (
                         <div className="bg-luxury-gold/5 border border-luxury-gold/20 p-10 rounded-[3rem] text-left space-y-6 relative z-10">
                            <h4 className="text-xl font-serif font-bold text-luxury-black">Bank Transfer Credentials</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bank Name</p>
                                  <p className="text-sm font-bold text-gray-700">{bankAccount.bank_name}</p>
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Holder</p>
                                  <p className="text-sm font-bold text-gray-700">{bankAccount.account_holder}</p>
                               </div>
                               <div className="md:col-span-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">IBAN (Official)</p>
                                  <p className="text-sm font-mono font-bold text-luxury-gold bg-white p-4 rounded-xl border border-luxury-gold/10 break-all">{bankAccount.iban}</p>
                               </div>
                            </div>
                            <p className="text-[10px] text-gray-400 italic">Please upload your transfer proof in the member portal or email it to reserve@goldenhills.dz</p>
                         </div>
                       )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                       <GoldButton className="px-16 py-6 text-xs shadow-2xl" onClick={() => navigate('/')}>RETURN TO PUBLIC PORTAL</GoldButton>
                       <Link to="/register" className="px-16 py-6 bg-white border-2 border-gray-100 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-50 transition-all flex items-center justify-center">ENABLE MEMBER PRIVILEGES</Link>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
