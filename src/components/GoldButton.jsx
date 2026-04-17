import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const GoldButton = ({ children, className, onClick, outline = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={twMerge(
        'relative px-8 py-3 rounded-full font-medium transition-all duration-300 overflow-hidden group',
        outline 
          ? 'border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white'
          : 'gold-gradient text-white shadow-lg shadow-luxury-gold/20 hover:shadow-luxury-gold/40',
        className
      )}
    >
      {!outline && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default GoldButton;
