
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "h-[52px] rounded-2xl font-bold transition-all duration-300 flex items-center justify-center text-[15px] tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden";
  
  const variants = {
    primary: "bg-[#5B4DBC] text-white shadow-[0_4px_14px_0_rgba(91,77,188,0.39)] hover:shadow-[0_6px_20px_rgba(91,77,188,0.23)] hover:bg-[#4d41a5] border border-transparent",
    secondary: "bg-white dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-sm",
    danger: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-transparent hover:border-red-200",
    success: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 border border-transparent hover:border-green-200",
    ghost: "bg-transparent text-primary hover:bg-primary/5 hover:text-primary/80",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Shine Effect for Primary Button */}
      {variant === 'primary' && !props.disabled && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      )}
      
      <span className="relative z-20 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
