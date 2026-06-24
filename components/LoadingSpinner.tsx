'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  variant?: 'default' | 'gradient' | 'dots';
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  variant = 'gradient'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (variant === 'gradient') {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
        <div className={`relative ${sizeClasses[size]}`}>
          {/* Outer spinning ring with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin opacity-75"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full animate-pulse"></div>
          
          {/* Center white circle */}
          <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
            <Loader2 className={`${iconSizeClasses[size]} text-purple-500 animate-spin`} />
          </div>
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-bounce delay-200"></div>
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-75"></div>
        <div className={`relative ${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg`}>
          <Loader2 className={`${iconSizeClasses[size]} text-white animate-spin`} />
        </div>
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-700 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
}
