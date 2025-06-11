import React from 'react';
import { TimeSlot } from '../../types';

interface TimeSlotGridProps {
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ 
  timeSlots, 
  selectedSlot, 
  onSlotSelect 
}) => {
  const availableSlots = timeSlots.filter(slot => !slot.isBooked);

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No available time slots for the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {availableSlots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => onSlotSelect(slot)}
          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:shadow-md ${
            selectedSlot?.id === slot.id
              ? 'border-gold-500 bg-gold-500 text-white shadow-md'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gold-300 hover:bg-gold-50'
          }`}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
};