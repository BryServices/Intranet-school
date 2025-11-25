import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-textSecLight dark:text-textSecDark ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full h-14 bg-gray-50 dark:bg-white/5 
            border border-borderLight dark:border-borderDark 
            rounded-[18px] 
            px-4 ${icon ? 'pl-12' : ''} 
            text-textMainLight dark:text-textMainDark 
            placeholder-gray-400 
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
            transition-all duration-200
          `}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
