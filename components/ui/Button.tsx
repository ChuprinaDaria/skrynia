import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-inter font-semibold transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-oxblood focus:ring-offset-2 focus:ring-offset-deep-black disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-oxblood text-ivory hover:bg-oxblood/90 hover:shadow-oxblood-glow active:scale-[0.98]',
    secondary: 'bg-sage text-deep-black hover:bg-sage/90 hover:shadow-lg active:scale-[0.98]',
    ghost: 'bg-transparent text-ivory border-2 border-ivory hover:bg-ivory hover:text-deep-black active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
