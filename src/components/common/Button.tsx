import React from 'react';
import { Icons, type IconName } from '../../icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-md hover:shadow-lg',
    outline: 'bg-white hover:bg-gray-50 text-text-primary border-2 border-gray-200 hover:border-primary',
    ghost: 'bg-transparent hover:bg-gray-100 text-text-primary',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const Icon = icon ? Icons[icon] : null;

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Icons.RefreshCw 
          className="animate-spin mr-2" 
          size={iconSizes[size]} 
        />
      )}
      
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className="mr-2" size={iconSizes[size]} />
      )}
      
      {children}
      
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="ml-2" size={iconSizes[size]} />
      )}
    </button>
  );
};