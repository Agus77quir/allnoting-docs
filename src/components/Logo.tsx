
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'text-only';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'default' }) => {
  if (variant === 'text-only') {
    return (
      <span className={`font-bold text-xl tracking-tight ${className}`}>
        Allnoting
      </span>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </div>
        <span className="font-bold text-lg tracking-tight">Allnoting</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path 
              d="M3 3H13V4.5H3V3Z" 
              fill="currentColor"
            />
            <path 
              d="M3 6H10V7.5H3V6Z" 
              fill="currentColor"
            />
            <path 
              d="M3 9H8V10.5H3V9Z" 
              fill="currentColor"
            />
            <path 
              d="M3 12H6V13.5H3V12Z" 
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      <span className="font-bold text-xl tracking-tight">Allnoting</span>
    </div>
  );
};

export default Logo;
