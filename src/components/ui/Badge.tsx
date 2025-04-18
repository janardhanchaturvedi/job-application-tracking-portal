import React from 'react';
import { JobStatus } from '../../types';

interface BadgeProps {
  status: JobStatus;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  const getStatusStyles = (): string => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Offer Received':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusStyles()} ${className}`}
    >
      {status}
    </span>
  );
};

export default Badge;