import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = "w-auto h-auto", textVisible = true, inverse = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative shrink-0"
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_4px_10px_rgba(212,175,55,0.3)] transition-all duration-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" className={inverse ? 'text-white/20' : 'text-luxury-gold/20'} />
          
          {/* Stylized 'G' & Hill Silhouette */}
          <path 
            d="M30 75C30 75 40 50 70 50C80 50 85 60 85 70V75H30Z" 
            className="fill-luxury-gold hover:fill-luxury-gold-light transition-colors duration-500"
          />
          <path 
            d="M15 75C15 75 25 35 55 35C65 35 70 45 70 55V75H15Z" 
            className="fill-luxury-gold-dark opacity-80"
          />
          
          {/* Logo Monogram */}
          <text 
            x="50" 
            y="65" 
            textAnchor="middle" 
            className="fill-white font-serif font-bold text-2xl"
          >
            G
          </text>
          
          {/* Shimmer Effect */}
          <motion.circle 
            cx="30" 
            cy="30" 
            r="1.5" 
            className="fill-white"
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </svg>
      </motion.div>
      
      {textVisible && (
        <div className={`flex flex-col leading-none transition-colors duration-500 ${inverse ? 'text-white' : 'text-luxury-black'}`}>
          <span className="text-lg md:text-xl font-serif font-bold tracking-tighter">
            GOLDEN <span className="text-luxury-gold">HILLS</span>
          </span>
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold opacity-60 mt-0.5">
            Setif Luxury Hotel
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
