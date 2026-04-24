import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const GoldButton = ({ children, className, onClick, outline = false, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      {...props}
      className={twMerge(
        'relative px-5 md:px-7 py-2 md:py-2.5 rounded-full font-semibold transition-all duration-500 overflow-hidden group tracking-widest text-[11px] uppercase',
        outline 
          ? 'border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white shadow-sm'
          : 'bg-gradient-to-r from-luxury-gold-vibrant via-luxury-gold-shimmer to-luxury-gold text-white shadow-xl shadow-luxury-gold/30 hover:shadow-luxury-gold/50',
        className
      )}
    >
      {!outline && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default GoldButton;
