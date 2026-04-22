import { motion } from 'framer-motion';

const Logo = ({ className = "", textVisible = true, inverse = false }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative shrink-0"
      >
        <img 
          src="/logo-premium.png" 
          alt="Golden Hills" 
          className={`w-12 h-12 md:w-14 md:h-14 object-contain transition-all duration-700 ${
            inverse ? 'brightness-0 invert opacity-90' : 'drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)]'
          }`} 
        />
        {!inverse && (
          <div className="absolute inset-0 rounded-full bg-luxury-gold/10 blur-2xl animate-pulse" />
        )}
      </motion.div>
      
      {textVisible && (
        <div className={`flex flex-col leading-tight transition-colors duration-700 ${inverse ? 'text-white' : 'text-luxury-black'}`}>
          <span className="text-2xl md:text-3xl font-serif font-bold tracking-tighter">
            GOLDEN <span className="text-luxury-gold italic font-normal">HILLS</span>
          </span>
          <span className={`text-[9px] uppercase tracking-[0.6em] font-bold mt-1 transition-opacity duration-700 ${
            inverse ? 'text-white/40' : 'text-gray-400'
          }`}>
            Sétif • Algeria
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
