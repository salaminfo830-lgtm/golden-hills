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
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    requests: '',
    paymentMethod: 'paypal' 
  });

  const [validationErrors, setValidationErrors] = useState({});

  const checkInStr = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const checkOutStr = searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const guestsCount = searchParams.get('guests') || '2';

  const getNights = (d1, d2) => {
    try {
      const date1 = new Date(d1);
      const date2 = new Date(d2);
      const diffTime = Math.abs(date2 - date1);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    } catch (e) {
      return 1;
    }
  };

  const nights = getNights(checkInStr, checkOutStr);
  const basePrice = room ? room.price * nights : 0;
  const taxes = basePrice * 0.10;
  const serviceFee = basePrice * 0.05;
  const totalAmount = basePrice + taxes + serviceFee;
  const hasSpaBenefit = nights >= 3;

  useEffect(() => {
    const fetchData = async () => {
      const [roomRes, bankRes, settingsRes] = await Promise.all([
        supabase.from('Room').select('*').eq('id', roomId).single(),
        supabase.from('BankAccount').select('*').eq('is_active', true).limit(1).maybeSingle(),
        supabase.from('Settings').select('*').eq('id', 'global').maybeSingle()
      ]);
      
      if (roomRes.data) setRoom(roomRes.data);
      if (bankRes.data) setBankAccount(bankRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      setLoading(false);
    };

    const prefillUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('Profile').select('*').eq('id', user.id).maybeSingle();
        if (profile) {
          setFormData(prev => ({
            ...prev,
            fullName: profile.full_name || '',
            email: user.email || '',
          }));
          
          const { data: guest } = await supabase.from('Guest').select('phone').eq('id', user.id).maybeSingle();
          if (guest) {
            setFormData(prev => ({ ...prev, phone: guest.phone || '' }));
          }
        }
      }
    };

    fetchData();
    prefillUser();
    window.scrollTo(0, 0);
  }, [roomId]);

  const validateStep1 = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid format";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2) setStep(3);
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
      // 1. FINAL AVAILABILITY LOCK (Check again before insert)
      const { data: overlapping } = await supabase
        .from('Reservation')
        .select('id')
        .eq('room_id', roomId)
        .filter('start_date', 'lt', new Date(checkOutStr).toISOString())
        .filter('end_date', 'gt', new Date(checkInStr).toISOString());

      if (overlapping && overlapping.length > 0) {
        throw new Error("This sanctuary has just been reserved by another guest. Please explore alternative dates.");
      }

      let guestId = null;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        guestId = user.id;
      } else {
        const { data: existingGuest } = await supabase.from('Guest').select('id').eq('email', formData.email).maybeSingle();
        if (existingGuest) {
          guestId = existingGuest.id;
        } else {
          const { data: newGuest, error: guestError } = await supabase.from('Guest').insert([{ 
            id: crypto.randomUUID(),
            full_name: formData.fullName, 
            email: formData.email, 
            phone: formData.phone 
          }]).select().single();
          if (guestError) throw guestError;
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
        status: formData.paymentMethod === 'bank' ? 'Pending Approval' : 'Confirmed',
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

      setStep(4); 
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !room) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ "client-id": settings?.paypal_client_id || "test", currency: "USD" }}>
      <div className="min-h-screen bg-[#FDFBF7] pb-32">
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-2xl border-b border-luxury-gold/10 py-6">
          <div className="container mx-auto px-8 flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="group flex items-center gap-4 text-gray-400 hover:text-luxury-black font-bold text-[10px] uppercase tracking-[0.4em] transition-all">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO SANCTUARY
            </button>
            <Logo className="scale-90" />
            <div className="flex items-center gap-10">
              <div className="hidden xl:flex gap-6 items-center">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-bold transition-all duration-700 ${step >= s ? 'bg-luxury-gold text-white shadow-lg shadow-luxury-gold/30' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}>
                      {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && <div className={`w-12 h-px ${step > s ? 'bg-luxury-gold' : 'bg-gray-100'}`} />}
                  </div>
                ))}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-luxury-gold/5 flex items-center justify-center border border-luxury-gold/10">
                <Shield className="w-5 h-5 text-luxury-gold/50" />
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-8 pt-48">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {step < 4 ? (
                <motion.div 
                  key="booking-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24"
                >
                  {/* Left Column: Form Steps */}
                  <div className="lg:col-span-7 space-y-16">
                    {step === 1 && (
                      <div className="space-y-16">
                        <div className="space-y-6">
                          <h1 className="text-5xl md:text-6xl font-serif font-bold text-luxury-black tracking-tight">Identity Protocol</h1>
                          <p className="text-gray-400 font-medium text-lg italic">"Your comfort is our priority. Please provide your official credentials for the guest list."</p>
                        </div>

                        <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Full Legal Name</label>
                              <div className="relative group">
                                <User className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${validationErrors.fullName ? 'text-red-400' : 'text-gray-300 group-focus-within:text-luxury-gold'}`} />
                                <input 
                                  required
                                  type="text" 
                                  placeholder="Ex: Mourad Brahimi" 
                                  value={formData.fullName}
                                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                  className={`input-luxury w-full pl-16 h-16 rounded-2xl ${validationErrors.fullName ? 'border-red-200 bg-red-50' : 'bg-white border-gray-100'}`} 
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Digital Address</label>
                              <div className="relative group">
                                <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${validationErrors.email ? 'text-red-400' : 'text-gray-300 group-focus-within:text-luxury-gold'}`} />
                                <input 
                                  required
                                  type="email" 
                                  placeholder="mourad@gmail.com" 
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                  className={`input-luxury w-full pl-16 h-16 rounded-2xl ${validationErrors.email ? 'border-red-200 bg-red-50' : 'bg-white border-gray-100'}`} 
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2">Mobile Sanctuary Line</label>
                            <div className="relative group">
                              <Phone className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${validationErrors.phone ? 'text-red-400' : 'text-gray-300 group-focus-within:text-luxury-gold'}`} />
                              <input 
                                required
                                type="tel" 
                                placeholder="+213 --- --- ---" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className={`input-luxury w-full pl-16 h-16 rounded-2xl ${validationErrors.phone ? 'border-red-200 bg-red-50' : 'bg-white border-gray-100'}`} 
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] pl-2 flex items-center justify-between">
                              Concierge Requests (Optional)
                              <span className="flex items-center gap-1.5 text-luxury-gold"><Sparkles className="w-3 h-3" /> Personalized Protocol</span>
                            </label>
                            <textarea 
                              rows="4" 
                              placeholder="Dietary preferences, high floor request, or any special celebration details..."
                              value={formData.requests}
                              onChange={(e) => setFormData({...formData, requests: e.target.value})}
                              className="w-full bg-white border-2 border-gray-100 rounded-3xl px-8 py-6 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm resize-none"
                            />
                          </div>
                          <GoldButton type="submit" className="w-full py-7 shadow-2xl flex items-center justify-center gap-4 text-[10px] tracking-[0.3em]">
                            CHOOSE PAYMENT METHOD <ArrowRight className="w-4 h-4" />
                          </GoldButton>
                        </form>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-16">
                        <div className="space-y-6">
                          <h1 className="text-5xl md:text-6xl font-serif font-bold text-luxury-black tracking-tight">Settlement</h1>
                          <p className="text-gray-400 font-medium text-lg italic">"Select your preferred financial ritual for confirmation."</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                          {[
                            { id: 'paypal', title: 'Gilded Digital Settlement', sub: 'Instant confirmation with secure global protocol.', icon: Wallet },
                            { id: 'bank', title: 'Corporate Bank Protocol', sub: 'Direct transfer with manual verified approval.', icon: Landmark },
                            { id: 'property', title: 'Settle at Property', sub: 'Pay upon arrival at our Sétif sanctuary.', icon: MapPin }
                          ].map((method) => (
                            <div 
                              key={method.id}
                              onClick={() => setFormData({...formData, paymentMethod: method.id})}
                              className={`p-10 rounded-[3rem] border-2 transition-all duration-500 cursor-pointer flex items-center gap-10 ${formData.paymentMethod === method.id ? 'bg-luxury-gold/5 border-luxury-gold shadow-2xl shadow-luxury-gold/10 scale-[1.02]' : 'bg-white border-gray-50 hover:border-luxury-gold/20'}`}
                            >
                              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${formData.paymentMethod === method.id ? 'bg-luxury-gold text-white rotate-6' : 'bg-gray-50 text-gray-400'}`}>
                                <method.icon className="w-10 h-10" />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-2xl font-serif font-bold text-luxury-black mb-1">{method.title}</h5>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{method.sub}</p>
                              </div>
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${formData.paymentMethod === method.id ? 'bg-luxury-gold border-luxury-gold' : 'border-gray-100'}`}>
                                {formData.paymentMethod === method.id && <CheckCircle2 className="w-5 h-5 text-white" />}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-8">
                          <button onClick={() => setStep(1)} className="px-14 h-20 bg-white border border-gray-100 rounded-3xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-50 transition-all">BACK</button>
                          <GoldButton onClick={handleNextStep} className="flex-1 h-20 shadow-2xl flex items-center justify-center gap-4 text-[10px] tracking-[0.3em]">
                            CONTINUE TO VERIFICATION <ArrowRight className="w-4 h-4" />
                          </GoldButton>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-16">
                        <div className="space-y-6">
                          <h1 className="text-5xl md:text-6xl font-serif font-bold text-luxury-black tracking-tight">Final Verification</h1>
                          <p className="text-gray-400 font-medium text-lg italic">"Finalize your booking with the selected protocol."</p>
                        </div>

                        {formData.paymentMethod === 'paypal' && (
                          <div className="space-y-10">
                            <div className="bg-blue-50/50 border border-blue-100 p-10 rounded-[3rem] flex items-center gap-8">
                              <div className="w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                                <Wallet className="w-8 h-8" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">Secure Digital Channel</p>
                                <p className="text-sm text-blue-800 font-medium leading-relaxed italic">
                                  Your transaction is handled via PayPal Secure Tunnel. Confirmation is immediate upon success.
                                </p>
                              </div>
                            </div>
                            <div className="max-w-md mx-auto">
                               <PayPalButtons 
                                style={{ layout: "vertical", shape: "pill", color: "gold" }}
                                createOrder={(data, actions) => {
                                  return actions.order.create({
                                    purchase_units: [{
                                      amount: { value: totalAmount.toFixed(2) },
                                      description: `Sanctuary Stay: ${room.type} at Golden Hills`
                                    }]
                                  });
                                }}
                                onApprove={(data, actions) => {
                                  return actions.order.capture().then((details) => {
                                    createBooking(details);
                                  });
                                }}
                                onError={(err) => setError("PayPal Protocol Exception: " + err.message)}
                              />
                            </div>
                            <button onClick={() => setStep(2)} className="w-full text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-luxury-black transition-colors">Change Payment Protocol</button>
                          </div>
                        )}

                        {formData.paymentMethod === 'bank' && (
                          <div className="space-y-10">
                            <GlassCard className="p-12 rounded-[4rem] border-luxury-gold/10 bg-white shadow-2xl space-y-10">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-luxury-gold/5 text-luxury-gold flex items-center justify-center border border-luxury-gold/10">
                                  <Landmark className="w-8 h-8" />
                                </div>
                                <h4 className="text-2xl font-serif font-bold text-luxury-black">GHE Bank Credentials</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Official Bank</p>
                                  <p className="text-lg font-bold text-luxury-black tracking-tight">{bankAccount?.bank_name || 'BEA - Sétif Branch'}</p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Beneficiary</p>
                                  <p className="text-lg font-bold text-luxury-black tracking-tight">{bankAccount?.account_holder || 'Hôtel Golden Hills Luxury Group'}</p>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Corporate IBAN</p>
                                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between group">
                                     <p className="text-sm font-mono font-bold text-luxury-gold break-all select-all">{bankAccount?.iban || 'DZ91 0020 0012 3456 7890 1234'}</p>
                                     <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-luxury-gold uppercase tracking-widest">Copy</button>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-10 border-t border-gray-50 space-y-8">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Official Protocol Proof (Mandatory)</label>
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
                                    className={`w-full h-48 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-700 ${proofFile ? 'border-green-300 bg-green-50/30' : 'border-gray-200 hover:border-luxury-gold group-hover:bg-luxury-gold/5'}`}
                                  >
                                    {proofFile ? (
                                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20"><CheckCircle2 className="w-8 h-8" /></div>
                                        <span className="text-sm font-bold text-green-600 tracking-tight">{proofFile.name}</span>
                                      </motion.div>
                                    ) : (
                                      <>
                                        <Upload className="w-10 h-10 text-gray-200 group-hover:text-luxury-gold transition-colors" />
                                        <div className="text-center space-y-1">
                                          <span className="text-sm font-bold text-gray-400 group-hover:text-luxury-black transition-colors">Dispatch Transfer Receipt</span>
                                          <p className="text-[10px] text-gray-300 uppercase tracking-widest">Image or PDF format accepted</p>
                                        </div>
                                      </>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </GlassCard>
                            
                            <div className="flex gap-8">
                              <button onClick={() => setStep(2)} className="px-14 h-20 bg-white border border-gray-100 rounded-3xl text-[10px] font-bold uppercase tracking-[0.4em]">BACK</button>
                              <GoldButton 
                                disabled={!proofFile || submitting} 
                                onClick={() => createBooking()} 
                                className="flex-1 h-20 shadow-2xl flex items-center justify-center gap-4 text-[10px] tracking-[0.3em]"
                              >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>TRANSMIT PROTOCOL <ShieldCheck className="w-5 h-5" /></>}
                              </GoldButton>
                            </div>
                          </div>
                        )}

                        {formData.paymentMethod === 'property' && (
                          <div className="space-y-10">
                            <div className="bg-luxury-gold/5 border border-luxury-gold/10 p-12 rounded-[4rem] space-y-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                              <div className="flex items-center gap-6 text-luxury-gold">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/10"><Info className="w-8 h-8" /></div>
                                <h4 className="text-2xl font-serif font-bold text-luxury-black">Pay at Arrival Policy</h4>
                              </div>
                              <p className="text-lg text-gray-500 leading-relaxed font-medium italic">
                                "Your stay will be secured under our Exclusive Flexible Protocol. Please finalize the settlement upon your grand entrance at the Golden Hills reception."
                              </p>
                              <div className="grid gap-6">
                                {[
                                  { icon: Clock, title: 'Check-In Ritual', sub: 'Room held until 18:00 on arrival day.' },
                                  { icon: DollarSign, title: 'Zero Prepayment', sub: 'No immediate financial dispatch required today.' }
                                ].map((item, i) => (
                                  <div key={i} className="p-6 bg-white rounded-3xl border border-gray-50 flex items-center gap-6">
                                    <div className="w-12 h-12 bg-luxury-gold/5 text-luxury-gold rounded-2xl flex items-center justify-center"><item.icon className="w-6 h-6" /></div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-bold text-luxury-black uppercase tracking-widest">{item.title}</p>
                                      <p className="text-[10px] text-gray-400 font-medium italic leading-none">{item.sub}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-8">
                              <button onClick={() => setStep(2)} className="px-14 h-20 bg-white border border-gray-100 rounded-3xl text-[10px] font-bold uppercase tracking-[0.4em]">BACK</button>
                              <GoldButton 
                                disabled={submitting} 
                                onClick={() => createBooking()} 
                                className="flex-1 h-20 shadow-2xl flex items-center justify-center gap-4 text-[10px] tracking-[0.3em]"
                              >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>FINALIZE RESERVATION <Sparkles className="w-5 h-5" /></>}
                              </GoldButton>
                            </div>
                          </div>
                        )}

                        {error && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-100 p-8 rounded-3xl flex items-center gap-6 text-red-600">
                            <AlertCircle className="w-8 h-8 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-[0.4em] leading-none mb-1">Protocol Exception</p>
                              <p className="text-sm font-medium italic">{error}</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Sticky Summary */}
                  <div className="lg:col-span-5 relative">
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
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-white p-12 md:p-24 rounded-[5rem] shadow-[0_100px_150px_-50px_rgba(212,175,55,0.2)] border border-luxury-gold/10 relative overflow-hidden text-center space-y-16">
                    <div className="absolute top-0 left-0 w-full h-4 bg-luxury-gold shadow-lg" />
                    <div className="absolute -top-32 -left-32 w-80 h-80 bg-luxury-gold/5 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-luxury-gold/5 rounded-full blur-[100px]" />
                    
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
                      className="w-40 h-40 bg-luxury-gold rounded-[3rem] flex items-center justify-center mx-auto text-white shadow-2xl relative rotate-3"
                    >
                      <CheckCircle2 className="w-20 h-20" />
                      <motion.div 
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 rounded-[3rem] bg-luxury-gold"
                      />
                    </motion.div>

                    <div className="space-y-8 relative z-10">
                      <h2 className="text-6xl md:text-8xl font-serif font-medium text-luxury-black tracking-tighter leading-[0.9]">Presence <br /> <span className="italic text-luxury-gold">Secured</span></h2>
                      <p className="text-gray-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto italic leading-relaxed">
                        "Your arrival is highly anticipated, {formData.fullName.split(' ')[0]}. A master suite is currently being prepared to your exact specifications."
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-y border-gray-100 relative z-10">
                        <div className="space-y-3">
                          <PlaneTakeoff className="w-7 h-7 text-luxury-gold mx-auto" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">Sanctuary Key</p>
                          <p className="text-2xl font-serif font-bold text-luxury-black tracking-widest uppercase">#GH-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                        </div>
                        <div className="space-y-3">
                          <Bell className="w-7 h-7 text-luxury-gold mx-auto" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">Sanctuary State</p>
                          <p className="text-sm font-bold uppercase tracking-widest text-luxury-black">
                            {formData.paymentMethod === 'paypal' ? 'Confirmed & Gilded' : 
                             (formData.paymentMethod === 'bank' ? 'Awaiting Protocol' : 'Pay at Arrival')}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <ShieldCheck className="w-7 h-7 text-luxury-gold mx-auto" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">Concierge Service</p>
                          <p className="text-sm font-bold uppercase tracking-widest text-luxury-black">24/7 Gilded Support</p>
                        </div>
                      </div>

                      <div className="bg-[#FDFBF7] p-12 rounded-[4rem] text-left space-y-8 relative z-10 border border-gray-100">
                        <div className="flex items-center gap-6 text-luxury-gold">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100"><Mail className="w-6 h-6" /></div>
                          <div className="space-y-1">
                            <h4 className="text-2xl font-serif font-bold text-luxury-black tracking-tight">The Gilded Scroll</h4>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Confirmation Sent</p>
                          </div>
                        </div>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium italic">
                          "An official digital scroll has been dispatched to <strong>{formData.email}</strong>. It contains all the necessary rituals for your check-in and stay."
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-8 relative z-10 pt-8">
                      <GoldButton className="px-20 py-7 text-[10px] tracking-[0.4em] shadow-2xl" onClick={() => navigate('/')}>RETURN TO PUBLIC PORTAL</GoldButton>
                      <button onClick={() => navigate('/GuestDashboard')} className="px-20 py-7 bg-white border border-gray-100 rounded-[2.5rem] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-50 transition-all shadow-sm">PRIVATE MEMBER DASHBOARD</button>
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
