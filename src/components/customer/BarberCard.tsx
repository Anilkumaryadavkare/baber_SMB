import React from 'react';
import { Star } from 'lucide-react';
import { Barber } from '../../types';

interface BarberCardProps {
  barber: Barber;
  isSelected: boolean;
  onSelect: (barber: Barber) => void;
}

export const BarberCard: React.FC<BarberCardProps> = ({ barber, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(barber)}
      className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? 'border-gold-500 bg-gold-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gold-300'
      }`}
    >
      <div className="flex items-center space-x-4">
        <img
          src={barber.avatar}
          alt={barber.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{barber.name}</h3>
          <div className="flex items-center space-x-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{barber.rating}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {barber.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-2 py-1 bg-barber-100 text-barber-700 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
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