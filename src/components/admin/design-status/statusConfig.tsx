
import React from 'react';
import { 
  Clock, 
  Eye, 
  Star, 
  CheckCircle
} from 'lucide-react';
import type { StatusInfo } from './types';

export const getStatusInfo = (status: string, mockupsCount: number, selectionsCount: number): StatusInfo => {
  switch (status) {
    case 'pending_review':
      return {
        icon: <Clock className="h-4 w-4" />,
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Pending Review',
        description: 'Waiting for admin to create mockups'
      };
    case 'mockups_ready':
      return {
        icon: <Eye className="h-4 w-4" />,
        color: 'bg-blue-100 text-blue-800',
        label: 'Ready for Creator',
        description: 'Mockups created, waiting for creator selection'
      };
    case 'selected':
      return {
        icon: <Star className="h-4 w-4" />,
        color: 'bg-purple-100 text-purple-800',
        label: 'Selected',
        description: 'Creator has selected their favorite mockup'
      };
    case 'published':
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'bg-green-100 text-green-800',
        label: 'Published',
        description: 'Live on the store and available for purchase'
      };
    default:
      return {
        icon: <Clock className="h-4 w-4" />,
        color: 'bg-gray-100 text-gray-800',
        label: status,
        description: 'Unknown status'
      };
  }
};
