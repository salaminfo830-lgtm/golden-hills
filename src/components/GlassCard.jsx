import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, variant = 'light', delay = 0 }) => {
  const variants = {
    light: 'glass',
    dark: 'glass-dark',
    gold: 'glass-gold',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={twMerge(
        'rounded-[2rem] p-8',
        variants[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
