import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const Logo = ({ className = "", textVisible = true, inverse = false }) => {
  const { settings } = useSettings();
  
  const hotelName = settings?.hotel_name || "GOLDEN HILLS";
  const logoUrl = settings?.logo_url || "/brand-logo.jpg";
  const [firstName, ...restName] = hotelName.split(' ');
  const lastName = restName.join(' ');

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative shrink-0"
      >
        <img 
          src={logoUrl} 
          alt={hotelName} 
          className={`w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-700 ${
            inverse ? 'drop-shadow-lg opacity-100' : 'drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)]'
          }`} 
        />
        {!inverse && (
          <div className="absolute inset-0 rounded-full bg-luxury-gold/10 blur-2xl animate-pulse" />
        )}
      </motion.div>
      
      {textVisible && (
        <div className={`flex flex-col leading-tight transition-colors duration-700 ${inverse ? 'text-white' : 'text-luxury-black'}`}>
          <span className="text-xl md:text-2xl font-serif font-bold tracking-tighter uppercase">
            {firstName} <span className="text-luxury-gold italic font-normal">{lastName}</span>
          </span>
          <span className={`text-[9px] uppercase tracking-[0.6em] font-bold mt-1 transition-opacity duration-700 ${
            inverse ? 'text-white/40' : 'text-gray-400'
          }`}>
            {settings?.address?.split(',')[1] || "Sétif"} • {settings?.address?.split(',')[2] || "Algeria"}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
