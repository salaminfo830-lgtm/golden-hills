import React from 'react';
import { MapPin, AlertCircle, ShieldCheck, Calendar, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';

const BookingSummary = ({ room, nights, guests, checkIn, checkOut, isMobileExpanded, setIsMobileExpanded, hasSpaBenefit }) => {
  const basePrice = room.price * nights;
  const serviceFee = basePrice * 0.1;
  const discount = basePrice * 0.05;
  const total = basePrice + serviceFee - discount;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="lg:col-span-5 relative">
      {/* Mobile Collapsible Trigger */}
      <button 
        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        className="lg:hidden w-full bg-white border border-luxury-gold/20 p-6 rounded-[2rem] flex justify-between items-center shadow-lg mb-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-luxury-gold/20">
            <img src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} className="w-full h-full object-cover" alt="Suite" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Stay</p>
            <p className="text-lg font-serif font-bold text-luxury-gold">{formatPrice(total)}</p>
          </div>
        </div>
        {isMobileExpanded ? <ChevronUp className="w-6 h-6 text-luxury-gold" /> : <ChevronDown className="w-6 h-6 text-luxury-gold" />}
      </button>

      <div className={`${isMobileExpanded ? 'block' : 'hidden'} lg:block sticky top-44 space-y-8`}>
        <GlassCard className="bg-white border-luxury-gold/10 p-10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
          
          <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-10 shadow-xl border border-white/40">
            <img src={room.image_url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070'} className="w-full h-full object-cover" alt="Suite" />
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-3xl font-serif font-bold text-luxury-black mb-2">{room.type}</h3>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">
                <MapPin className="w-4 h-4 text-luxury-gold/50" /> Golden Hills • Setif, DZ
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Check-In</p>
                <p className="text-sm font-bold text-luxury-black">{checkIn}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Check-Out</p>
                <p className="text-sm font-bold text-luxury-black">{checkOut}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Guests</p>
                <p className="text-sm font-bold text-luxury-black">{guests} Members</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                <p className="text-sm font-bold text-luxury-black">{nights} Evenings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium italic underline underline-offset-4 decoration-luxury-gold/30">{formatPrice(room.price)} x {nights} nights</span>
                <span className="font-bold text-luxury-black">{formatPrice(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium flex items-center gap-2">Gilded Service Protocol (10%) <AlertCircle className="w-3.5 h-3.5 text-luxury-gold/40" /></span>
                <span className="font-bold text-luxury-black">{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-green-600 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                <span className="font-bold uppercase tracking-widest text-xs">GHE Web Privilege</span>
                <span className="font-bold">- {formatPrice(discount)}</span>
              </div>

              {hasSpaBenefit && (
                <div className="bg-luxury-gold/10 p-4 rounded-2xl border border-luxury-gold/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest leading-none mb-1">Gilded Bonus</p>
                     <p className="text-xs font-bold text-luxury-black">1 Free Hour of Spa Ritual Included</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-end pt-10 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 mb-1">Total Sanctuary Investment</p>
                  <p className="text-4xl font-serif font-bold text-luxury-gold">{formatPrice(total)}</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4 px-6">
          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <ShieldCheck className="w-5 h-5 text-luxury-gold/40" /> SSL SECURED
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Calendar className="w-5 h-5 text-luxury-gold/40" /> INSTANT CONFIRM
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
