import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, variant = 'light', delay = 0 }) => {
  const variants = {
    light: 'bg-white/10 border-white/20 backdrop-blur-md',
    dark: 'bg-black/40 border-white/5 backdrop-blur-lg',
    gold: 'bg-luxury-gold/5 border-luxury-gold/20 backdrop-blur-md',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={twMerge(
        'rounded-2xl border p-6 shadow-xl',
        variants[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
