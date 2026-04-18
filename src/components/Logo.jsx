import { motion } from 'framer-motion';

const Logo = ({ className = "", textVisible = true, inverse = false }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative shrink-0"
      >
        <img 
          src="/logo.jpg" 
          alt="Golden Hills" 
          className={`w-12 h-12 md:w-16 md:h-16 object-contain rounded-xl drop-shadow-md transition-all duration-500 ${inverse ? 'brightness-0 invert' : ''}`} 
        />
      </motion.div>
      
      {textVisible && (
        <div className={`flex flex-col leading-none transition-colors duration-500 ${inverse ? 'text-white' : 'text-luxury-black'}`}>
          <span className="text-xl md:text-2xl font-elegant font-bold tracking-tight">
            GOLDEN <span className="text-luxury-gold">HILLS</span>
          </span>
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 mt-1">
            Luxury Sanctuary • Setif
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
