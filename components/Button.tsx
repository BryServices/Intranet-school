import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // Added 'group' for child hover effects and 'tracking-wide' for better typography
  const baseStyles = "h-14 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center text-[16px] tracking-wide active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:shadow-xl",
    secondary: "bg-gray-100 dark:bg-white/10 text-textMainLight dark:text-white hover:bg-gray-200 dark:hover:bg-white/20",
    danger: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50",
    ghost: "bg-transparent text-primary hover:bg-primary/5",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;