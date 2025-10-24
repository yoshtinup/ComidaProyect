import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'medium', text = 'Cargando datos...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg className="w-full h-full text-gray-600" fill="none" viewBox="0 0 24 24">
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-['Plus_Jakarta_Sans']`}>
          {text}
        </p>
      )}
    </div>
  );
};

const LoadingSkeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
};

const DashboardLoading = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <LoadingSkeleton className="h-4 w-24 mb-4" />
            <LoadingSkeleton className="h-8 w-16 mb-2" />
            <LoadingSkeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <LoadingSkeleton className="h-6 w-32 mb-4" />
            <LoadingSkeleton className="h-64 w-full" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <LoadingSkeleton className="h-6 w-48 mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <LoadingSkeleton className="h-4 w-8" />
              <LoadingSkeleton className="h-4 w-32" />
              <LoadingSkeleton className="h-4 w-16" />
              <LoadingSkeleton className="h-4 w-20" />
              <LoadingSkeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  text: PropTypes.string
};

LoadingSkeleton.propTypes = {
  className: PropTypes.string
};

export { LoadingSpinner, LoadingSkeleton, DashboardLoading };
export default LoadingSpinner;
