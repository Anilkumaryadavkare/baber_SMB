import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(service)}
      className={`cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? 'border-gold-500 bg-gold-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gold-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{service.description}</p>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-barber-600">
              <Clock className="w-4 h-4" />
              <span>{service.duration} min</span>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <DollarSign className="w-4 h-4" />
              <span>{service.price}</span>
            </div>
          </div>
        </div>
        
        {isSelected && (
          <div className="flex-shrink-0 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};