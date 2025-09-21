import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'secondary', 
  children, 
  className = '', 
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
      default:
        return 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  return (
    <button
      className={`
        px-3 py-1.5 text-sm font-medium border rounded-md
        transition-colors duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;