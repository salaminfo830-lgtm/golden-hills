import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, CheckCircle2, CreditCard, 
  User, Mail, Phone, Calendar, 
  MapPin, ShieldCheck, Loader2, ArrowRight,
  Shield, Sparkles, AlertCircle, Info,
  MessageSquare, PlaneTakeoff, Bell, Upload,
  DollarSign, Landmark, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from '../lib/supabase';
import GlassCard from '../components/GlassCard';
import GoldButton from '../components/GoldButton';
import Logo from '../components/Logo';
import BookingSummary from '../components/BookingSummary';

const BookingFlow = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [room, setRoom] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);
  const [isMobileSummaryExpanded, setIsMobileSummaryExpanded] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    requests: '',
    paymentMethod: 'paypal' // Default to PayPal for premium feel
  });

  const [validationErrors, setValidationErrors] = useState({});

  const checkInStr = searchParams.get('checkIn') || '12 Oct 2026';
  const checkOutStr = searchParams.get('checkOut') || '18 Oct 2026';
  const guestsCount = searchParams.get('guests') || '2';

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
  const totalAmount = room ? room.price * nights * 1.05 : 0;
  const hasSpaBenefit = nights >= 3;

  useEffect(() => {
    const fetchData = async () => {
      const [roomRes, bankRes, settingsRes] = await Promise.all([
        supabase.from('Room').select('*').eq('id', roomId).single(),
        supabase.from('BankAccount').select('*').eq('is_active', true).limit(1).single(),
        supabase.from('Settings').select('*').eq('id', 'global').single()
      ]);
      
      if (roomRes.data) setRoom(roomRes.data);
      if (bankRes.data) setBankAccount(bankRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      setLoading(false);
    };

    const prefillUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('Profile').select('*').eq('id', user.id).single();
        if (profile) {
          setFormData(prev => ({
            ...prev,
            fullName: profile.full_name || '',
            email: user.email || '',
          }));
          
          const { data: guest } = await supabase.from('Guest').select('phone').eq('id', user.id).single();
          if (guest) {
            setFormData(prev => ({ ...prev, phone: guest.phone || '' }));
          }
        }
      }
    };

    fetchData();
    prefillUser();
  }, [roomId]);

  const validateStep1 = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else {
      setStep(step + 1);
    }
    window.scrollTo(0, 0);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const createBooking = async (paymentDetails = null) => {
    setSubmitting(true);
    setError(null);
    
    try {
      let guestId = null;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        guestId = user.id;
      } else {
        const { data: existingGuest } = await supabase.from('Guest').select('id').eq('email', formData.email).single();
        if (existingGuest) {
          guestId = existingGuest.id;
        } else {
          const { data: newGuest } = await supabase.from('Guest').insert([{ 
            id: crypto.randomUUID(),
            full_name: formData.fullName, 
            email: formData.email, 
            phone: formData.phone 
          }]).select().single();
          guestId = newGuest?.id;
        }
      }

      // Create Reservation
      const reservationId = crypto.randomUUID();
      const { data: reservation, error: resError } = await supabase.from('Reservation').insert([{
        id: reservationId,
        guest_id: guestId,
        guest_name: formData.fullName,
        room_id: parseInt(roomId),
        room_type: room.type,
        start_date: new Date(checkInStr).toISOString(),
        end_date: new Date(checkOutStr).toISOString(),
        guests_count: parseInt(guestsCount),
        nights: nights,
        total_price: totalAmount,
        status: formData.paymentMethod === 'paypal' ? 'Confirmed' : (formData.paymentMethod === 'bank' ? 'Pending Approval' : 'Confirmed'),
        payment_method: formData.paymentMethod === 'paypal' ? 'PayPal' : (formData.paymentMethod === 'bank' ? 'Bank Transfer' : 'Pay at Hotel'),
        payment_status: formData.paymentMethod === 'paypal' ? 'Paid' : 'Unpaid',
        special_requests: formData.requests,
        reference_number: paymentDetails?.id || null
      }]).select().single();

      if (resError) throw resError;

      // Handle Bank Transfer Proof Upload
      if (formData.paymentMethod === 'bank' && proofFile) {
        const fileExt = proofFile.name.split('.').pop();
        const fileName = `${reservationId}.${fileExt}`;
        const filePath = `proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, proofFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('payment-proofs').getPublicUrl(filePath);
          await supabase.from('PaymentRequest').insert([{
            reservation_id: reservationId,
            guest_id: guestId,
            amount: totalAmount,
            status: 'Pending',
            proof_url: publicUrl
          }]);
        }
      }

      // Log the event
      await supabase.from('AuditLog').insert([{
        action: 'Booking Created',
        entity_type: 'Reservation',
        entity_id: reservationId,
        details: { method: formData.paymentMethod, amount: totalAmount }
      }]);

      setStep(4); // Success screen
    } catch (err) {
      setError("System Protocol Interrupted: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !room) {
    return (
      <div className="h-screen flex items-center justify-center bg-luxury-cream">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ "client-id": settings?.paypal_client_id || "test", currency: "USD" }}>
      <div className="min-h-screen bg-luxury-cream/30 font-sans pb-32">
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-b border-luxury-gold/10 py-6">
          <div className="container mx-auto px-8 flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-gray-400 hover:text-luxury-black font-bold text-xs uppercase tracking-[0.3em] transition-all">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            <Logo className="scale-90" />
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-3 mr-6">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-luxury-gold border-luxury-gold text-white shadow-gold' : 'bg-white border-gray-100 text-gray-300'}`}>
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
              {step < 4 ? (
                <motion.div 
                  key="booking-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-16"
                >
                  {/* Left Column: Form Steps */}
                  <div className="lg:col-span-7 space-y-12">
                    {step === 1 && (
                      <div className="space-y-12">
                        <div className="space-y-4">
                          <h1 className="text-5xl font-serif font-bold text-luxury-black">Guest Identity</h1>
                          <p className="text-gray-400 font-medium text-lg italic">"Your comfort is our priority. Please provide your official credentials."</p>
                        </div>

                        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <label className="text-xs uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Full Legal Name</label>
                              <div className="relative group">
                                <User className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${validationErrors.fullName ? 'text-red-400' : 'text-gray-300 group-focus-within:text-luxury-gold'}`} />
                                <input 
                                  required
                                  type="text" 
                                  placeholder="Ex: Mourad Brahimi" 
                                  value={formData.fullName}
                                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                  className={`input-luxury w-full pl-16 h-16 ${validationErrors.fullName ? 'border-red-200 bg-red-50' : ''}`} 
                                />
                              </div>
                              {validationErrors.fullName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-2">{validationErrors.fullName}</p>}
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Email Address</label>
                              <div className="relative group">
                                <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${validationErrors.email ? 'text-red-400' : 'text-gray-300 group-focus-within:text-luxury-gold'}`} />
                                <input 
                                  required
                                  type="email" 
                                  placeholder="mourad@gmail.com" 
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                  className={`input-luxury w-full pl-16 h-16 ${validationErrors.email ? 'border-red-200 bg-red-50' : ''}`} 
                                />
                              </div>
                              {validationErrors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-2">{validationErrors.email}</p>}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Mobile Connection</label>
                            <div className="relative group">
                              <Phone className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${validationErrors.phone ? 'text-red-400' : 'text-gray-300 group-focus-within:text-luxury-gold'}`} />
                              <input 
                                required
                                type="tel" 
                                placeholder="+213 --- --- ---" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className={`input-luxury w-full pl-16 h-16 ${validationErrors.phone ? 'border-red-200 bg-red-50' : ''}`} 
                              />
                            </div>
                            {validationErrors.phone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-2">{validationErrors.phone}</p>}
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs uppercase font-bold text-gray-400 tracking-[0.4em] pl-2 flex items-center justify-between">
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
                          <GoldButton type="submit" className="w-full py-6 shadow-2xl flex items-center justify-center gap-4 text-xs tracking-[0.2em]">
                            CHOOSE PAYMENT METHOD <ArrowRight className="w-4 h-4" />
                          </GoldButton>
                        </form>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-12">
                        <div className="space-y-4">
                          <h1 className="text-5xl font-serif font-bold text-luxury-black">Settlement</h1>
                          <p className="text-gray-400 font-medium text-lg italic">"Select your preferred method for financial verification."</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          <div 
                            onClick={() => setFormData({...formData, paymentMethod: 'paypal'})}
                            className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center gap-8 ${formData.paymentMethod === 'paypal' ? 'bg-luxury-gold/5 border-luxury-gold shadow-lg shadow-luxury-gold/5' : 'bg-white border-gray-100 hover:border-luxury-gold/30'}`}
                          >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${formData.paymentMethod === 'paypal' ? 'bg-luxury-gold text-white' : 'bg-gray-50 text-gray-400'}`}>
                              <Wallet className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-xl font-bold text-luxury-black mb-1">PayPal Checkout</h5>
                              <p className="text-xs text-gray-400 uppercase tracking-widest">Instant confirmation with secure global protocol.</p>
                            </div>
                            {formData.paymentMethod === 'paypal' && <div className="w-6 h-6 rounded-full bg-luxury-gold flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                          </div>

                          <div 
                            onClick={() => setFormData({...formData, paymentMethod: 'bank'})}
                            className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center gap-8 ${formData.paymentMethod === 'bank' ? 'bg-luxury-gold/5 border-luxury-gold shadow-lg shadow-luxury-gold/5' : 'bg-white border-gray-100 hover:border-luxury-gold/30'}`}
                          >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${formData.paymentMethod === 'bank' ? 'bg-luxury-gold text-white' : 'bg-gray-50 text-gray-400'}`}>
                              <Landmark className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-xl font-bold text-luxury-black mb-1">Corporate Bank Transfer</h5>
                              <p className="text-xs text-gray-400 uppercase tracking-widest">Direct settlement with manual verification.</p>
                            </div>
                            {formData.paymentMethod === 'bank' && <div className="w-6 h-6 rounded-full bg-luxury-gold flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                          </div>

                          <div 
                            onClick={() => setFormData({...formData, paymentMethod: 'property'})}
                            className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center gap-8 ${formData.paymentMethod === 'property' ? 'bg-luxury-gold/5 border-luxury-gold shadow-lg shadow-luxury-gold/5' : 'bg-white border-gray-100 hover:border-luxury-gold/30'}`}
                          >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${formData.paymentMethod === 'property' ? 'bg-luxury-gold text-white' : 'bg-gray-50 text-gray-400'}`}>
                              <MapPin className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-xl font-bold text-luxury-black mb-1">Settle at Property</h5>
                              <p className="text-xs text-gray-400 uppercase tracking-widest">Pay upon arrival in Sétif. No prepayment needed.</p>
                            </div>
                            {formData.paymentMethod === 'property' && <div className="w-6 h-6 rounded-full bg-luxury-gold flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                          </div>
                        </div>

                        <div className="flex gap-6">
                          <button onClick={() => setStep(1)} className="px-12 h-16 bg-white border-2 border-gray-100 rounded-[2rem] text-xs font-bold uppercase tracking-[0.3em] hover:bg-gray-50 transition-all">Back</button>
                          <GoldButton onClick={handleNextStep} className="flex-1 h-16 shadow-2xl flex items-center justify-center gap-4 text-xs tracking-[0.2em]">
                            CONTINUE TO VERIFICATION <ArrowRight className="w-4 h-4" />
                          </GoldButton>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-12">
                        <div className="space-y-4">
                          <h1 className="text-5xl font-serif font-bold text-luxury-black">Verification</h1>
                          <p className="text-gray-400 font-medium text-lg italic">"Finalize your booking with the selected protocol."</p>
                        </div>

                        {formData.paymentMethod === 'paypal' && (
                          <div className="space-y-8">
                            <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem] flex items-center gap-6">
                              <Info className="w-8 h-8 text-blue-500" />
                              <p className="text-sm text-blue-700 font-medium leading-relaxed">
                                You are using PayPal Secure Checkout. Your total is <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}</strong>. Confirmation is instant.
                              </p>
                            </div>
                            <PayPalButtons 
                              style={{ layout: "vertical", shape: "pill", color: "gold" }}
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  purchase_units: [{
                                    amount: { value: totalAmount.toFixed(2) },
                                    description: `Booking for ${room.type} at Golden Hills`
                                  }]
                                });
                              }}
                              onApprove={(data, actions) => {
                                return actions.order.capture().then((details) => {
                                  createBooking(details);
                                });
                              }}
                              onError={(err) => {
                                setError("PayPal Security Block: " + err.message);
                              }}
                            />
                          </div>
                        )}

                        {formData.paymentMethod === 'bank' && (
                          <div className="space-y-8">
                            <GlassCard className="p-10 rounded-[3rem] border-luxury-gold/20 bg-luxury-gold/5 space-y-8">
                              <div className="flex items-center gap-4 text-luxury-gold">
                                <Landmark className="w-8 h-8" />
                                <h4 className="text-xl font-serif font-bold text-luxury-black">Bank Credentials</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bank Name</p>
                                  <p className="text-sm font-bold text-luxury-black">{bankAccount?.bank_name}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Holder</p>
                                  <p className="text-sm font-bold text-luxury-black">{bankAccount?.account_holder}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">IBAN</p>
                                  <p className="text-sm font-mono font-bold text-luxury-gold bg-white p-4 rounded-xl border border-luxury-gold/10 break-all">{bankAccount?.iban}</p>
                                </div>
                              </div>

                              <div className="pt-8 border-t border-luxury-gold/10 space-y-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Upload Transfer Proof (Required)</label>
                                <div className="relative group">
                                  <input 
                                    type="file" 
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden" 
                                    id="proof-upload"
                                  />
                                  <label 
                                    htmlFor="proof-upload"
                                    className={`w-full h-32 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${proofFile ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-luxury-gold group-hover:bg-luxury-gold/5'}`}
                                  >
                                    {proofFile ? (
                                      <>
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        <span className="text-sm font-bold text-green-600">{proofFile.name}</span>
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-8 h-8 text-gray-300 group-hover:text-luxury-gold" />
                                        <span className="text-sm font-bold text-gray-400">Click to select proof image or PDF</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </GlassCard>
                            
                            <div className="flex gap-6">
                              <button onClick={() => setStep(2)} className="px-12 h-16 bg-white border-2 border-gray-100 rounded-[2rem] text-xs font-bold uppercase tracking-[0.3em]">Back</button>
                              <GoldButton 
                                disabled={!proofFile || submitting} 
                                onClick={() => createBooking()} 
                                className="flex-1 h-16 shadow-2xl flex items-center justify-center gap-4 text-xs tracking-[0.2em]"
                              >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>SUBMIT FOR VERIFICATION <ShieldCheck className="w-5 h-5" /></>}
                              </GoldButton>
                            </div>
                          </div>
                        )}

                        {formData.paymentMethod === 'property' && (
                          <div className="space-y-8">
                            <div className="bg-luxury-gold/5 border border-luxury-gold/10 p-10 rounded-[3rem] space-y-6">
                              <div className="flex items-center gap-4 text-luxury-gold">
                                <Info className="w-8 h-8" />
                                <h4 className="text-xl font-serif font-bold text-luxury-black">Pay at Arrival Policy</h4>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                Your booking will be held with a status of <strong>"Reserved - Pay on Arrival"</strong>. Please note that arrivals after 18:00 (6 PM) without prior notice may be subject to our No-Show policy, releasing the room back to availability.
                              </p>
                              <div className="p-6 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
                                <DollarSign className="w-6 h-6 text-luxury-gold" />
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Zero Prepayment Required Today</p>
                              </div>
                            </div>

                            <div className="flex gap-6">
                              <button onClick={() => setStep(2)} className="px-12 h-16 bg-white border-2 border-gray-100 rounded-[2rem] text-xs font-bold uppercase tracking-[0.3em]">Back</button>
                              <GoldButton 
                                disabled={submitting} 
                                onClick={() => createBooking()} 
                                className="flex-1 h-16 shadow-2xl flex items-center justify-center gap-4 text-xs tracking-[0.2em]"
                              >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>CONFIRM MY SANCTUARY <Sparkles className="w-5 h-5" /></>}
                              </GoldButton>
                            </div>
                          </div>
                        )}

                        {error && (
                          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-600">
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Sticky Summary */}
                  <BookingSummary 
                    room={room}
                    nights={nights}
                    guests={guestsCount}
                    checkIn={checkInStr}
                    checkOut={checkOutStr}
                    isMobileExpanded={isMobileSummaryExpanded}
                    setIsMobileExpanded={setIsMobileSummaryExpanded}
                    hasSpaBenefit={hasSpaBenefit}
                  />
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
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Confirmation Key</p>
                          <p className="text-xl font-bold font-serif">#GH-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                        </div>
                        <div className="space-y-2">
                          <Bell className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Protocol Status</p>
                          <p className="text-sm font-bold">
                            {formData.paymentMethod === 'paypal' ? 'Confirmed & Paid' : 
                             (formData.paymentMethod === 'bank' ? 'Awaiting Verification' : 'Reserved - Pay at Arrival')}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <ShieldCheck className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Arrival Support</p>
                          <p className="text-sm font-bold">24/7 Gilded Concierge</p>
                        </div>
                      </div>

                      <div className="bg-luxury-gold/5 border border-luxury-gold/20 p-10 rounded-[3rem] text-left space-y-6 relative z-10">
                        <div className="flex items-center gap-4 text-luxury-gold mb-2">
                          <Calendar className="w-6 h-6" />
                          <h4 className="text-xl font-serif font-bold text-luxury-black">Next Steps</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                          A confirmation document has been dispatched to <strong>{formData.email}</strong>. You can monitor your sanctuary status and manage your services through your private member portal.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                      <GoldButton className="px-16 py-6 text-xs shadow-2xl" onClick={() => navigate('/')}>RETURN TO PUBLIC PORTAL</GoldButton>
                      <Link to="/GuestDashboard" className="px-16 py-6 bg-white border-2 border-gray-100 rounded-[2rem] text-xs font-bold uppercase tracking-[0.4em] hover:bg-gray-50 transition-all flex items-center justify-center">MANAGE MY BOOKINGS</Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default BookingFlow;
