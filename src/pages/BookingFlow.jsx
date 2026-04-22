import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, CheckCircle2, CreditCard, 
  User, Mail, Phone, Calendar, 
  MapPin, ShieldCheck, Loader2, ArrowRight
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
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    requests: ''
  });

  const checkIn = searchParams.get('checkIn') || '12 Oct 2026';
  const checkOut = searchParams.get('checkOut') || '18 Oct 2026';
  const guests = searchParams.get('guests') || '2';
  const nights = 6; // Mock calculation for now

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
    fetchRoom();
  }, [roomId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
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
      const { data: newGuest } = await supabase
        .from('Guest')
        .insert([{ 
          full_name: formData.fullName, 
          email: formData.email, 
          phone: formData.phone 
        }])
        .select()
        .single();
      guestId = newGuest?.id;
    }

    // 2. Create Reservation
    const { error } = await supabase.from('Reservation').insert([{
      guest_id: guestId,
      guest_name: formData.fullName,
      room_id: parseInt(roomId),
      room_type: room.type,
      start_date: new Date(checkIn).toISOString(),
      end_date: new Date(checkOut).toISOString(),
      guests_count: parseInt(guests),
      nights: nights,
      total_price: room.price * nights,
      status: 'Confirmed',
      source: 'Direct Site'
    }]);

    if (!error) {
      setStep(3);
    } else {
      alert("Error creating reservation: " + error.message);
    }
    setSubmitting(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(price);
  };

  if (loading || !room) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-20">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-luxury-black font-bold text-[10px] uppercase tracking-widest transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Selection
          </button>
          <Logo className="scale-90" />
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-2.5 h-2.5 rounded-full ${step >= s ? 'bg-luxury-gold' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-32 md:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Flow */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-bold text-luxury-black">Guest Details</h2>
                    <p className="text-gray-400 font-medium">Please provide your information to secure your sanctuary.</p>
                  </div>

                  <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            required
                            type="text" 
                            placeholder="John Doe" 
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-14 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm" 
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            required
                            type="email" 
                            placeholder="john@example.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-14 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          required
                          type="tel" 
                          placeholder="+213 --- --- ---" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-white border border-gray-100 rounded-2xl px-14 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-1">Special Requests (Optional)</label>
                      <textarea 
                        rows="4" 
                        placeholder="Dietary requirements, early check-in, etc."
                        value={formData.requests}
                        onChange={(e) => setFormData({...formData, requests: e.target.value})}
                        className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-luxury-gold outline-none transition-all shadow-sm resize-none"
                      />
                    </div>
                    <GoldButton type="submit" className="w-full py-5 shadow-lg flex items-center justify-center gap-3">
                      CONTINUE TO SUMMARY <ArrowRight className="w-4 h-4" />
                    </GoldButton>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-bold text-luxury-black">Confirm Reservation</h2>
                    <p className="text-gray-400 font-medium">Verify your details and finalise your booking.</p>
                  </div>

                  <GlassCard className="bg-white border-gray-100 p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Guest</p>
                        <p className="font-bold text-luxury-black">{formData.fullName}</p>
                        <p className="text-sm text-gray-500">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Dates</p>
                        <p className="font-bold text-luxury-black">{checkIn} — {checkOut}</p>
                        <p className="text-sm text-gray-500">{nights} Nights</p>
                      </div>
                    </div>
                    
                    <div className="pt-8 border-t border-gray-50">
                      <div className="flex items-center gap-4 text-luxury-gold mb-6">
                        <CreditCard className="w-6 h-6" />
                        <h4 className="font-bold">Payment Method</h4>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-luxury-gold/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-8 bg-luxury-black rounded flex items-center justify-center text-white font-bold text-[8px] uppercase">Card</div>
                           <span className="font-bold text-sm">Pay at Property</span>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-luxury-gold p-1 flex items-center justify-center">
                           <div className="w-full h-full bg-luxury-gold rounded-full" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-10 py-5 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <GoldButton 
                      onClick={handleBooking}
                      disabled={submitting}
                      className="flex-1 py-5 shadow-lg flex items-center justify-center gap-3"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CONFIRM BOOKING'}
                    </GoldButton>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8 py-10"
                >
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-8">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-serif font-bold text-luxury-black">Reservation Confirmed!</h2>
                    <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed font-medium">
                      Your gilded stay at Golden Hills is secured. A confirmation email has been sent to {formData.email}.
                    </p>
                  </div>
                  <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <GoldButton className="px-12 py-5" onClick={() => navigate('/')}>RETURN TO HOME</GoldButton>
                    <button className="px-12 py-5 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">VIEW BOOKING HISTORY</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Booking Summary Sidebar */}
          <aside className="space-y-8">
            <GlassCard className="bg-white border-gray-100 p-8 shadow-sm space-y-8">
              <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                <img src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-luxury-black mb-1">{room.type}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Golden Hills Setif, Algeria
                </p>
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">{formatPrice(room.price)} x {nights} nights</span>
                  <span className="font-bold text-luxury-black">{formatPrice(room.price * nights)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Service Charge (10%)</span>
                  <span className="font-bold text-luxury-black">{formatPrice(room.price * nights * 0.1)}</span>
                </div>
                <div className="flex justify-between text-lg pt-4 border-t border-gray-50">
                  <span className="font-serif font-bold text-luxury-black">Total</span>
                  <span className="font-bold text-luxury-gold">{formatPrice(room.price * nights * 1.1)}</span>
                </div>
              </div>
            </GlassCard>

            <div className="px-8 space-y-4">
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-luxury-gold" /> Secure GHE-256 Encryption
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Calendar className="w-4 h-4 text-luxury-gold" /> Flexible Cancellation Policy
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
