
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, icon, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-wide transition-colors group-focus-within:text-primary">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary group-focus-within:scale-110 transition-all duration-300 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full h-[52px] 
            bg-gray-50 dark:bg-white/5 
            border border-transparent
            rounded-2xl
            px-4 ${icon ? 'pl-12' : ''} 
            text-textMainLight dark:text-textMainDark font-medium
            placeholder-gray-400/70
            
            /* Focus States */
            focus:outline-none 
            focus:bg-white dark:focus:bg-black/20 
            focus:border-primary/50
            focus:ring-4 focus:ring-primary/10
            
            /* Hover States */
            hover:bg-gray-100 dark:hover:bg-white/10
            
            transition-all duration-200 ease-out
            shadow-sm
            ${className}
          `}
          {...props}
        />
        {/* Ligne de focus animée en bas (optionnel, style Material, ici désactivé pour garder le style Apple/Modern) */}
      </div>
    </div>
  );
};

export default Input;
