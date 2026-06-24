import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  gradientFrom?: string;
  gradientTo?: string;
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md',
  gradientFrom = 'blue-600',
  gradientTo = 'purple-600'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center">
        <div className={`relative ${sizeClasses[size]} mx-auto mb-4`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-full animate-ping opacity-75`}></div>
          <div className={`relative ${sizeClasses[size]} bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-full flex items-center justify-center`}>
            <Loader2 className={`${iconSizes[size]} animate-spin text-white`} />
          </div>
        </div>
        <p className="text-base font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}
