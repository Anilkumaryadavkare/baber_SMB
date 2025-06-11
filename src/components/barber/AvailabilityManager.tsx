import React, { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Barber } from '../../types';
import { barbers } from '../../data/mockData';

interface AvailabilitySlot {
  id: string;
  barberId: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface AvailabilityManagerProps {
  onNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ onNotification }) => {
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');

  const addAvailabilitySlot = () => {
    if (!selectedBarber) {
      onNotification('error', 'Please select a barber');
      return;
    }

    if (startTime >= endTime) {
      onNotification('error', 'End time must be after start time');
      return;
    }

    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      barberId: selectedBarber,
      date: selectedDate,
      startTime,
      endTime
    };

    setAvailabilitySlots(prev => [...prev, newSlot]);
    onNotification('success', 'Availability slot added successfully');
  };

  const removeAvailabilitySlot = (id: string) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== id));
    onNotification('info', 'Availability slot removed');
  };

  const getBarberName = (barberId: string) => {
    return barbers.find(b => b.id === barberId)?.name || 'Unknown Barber';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Availability</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barber</label>
            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            >
              <option value="">Select Barber</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>{barber.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={addAvailabilitySlot}
              className="w-full bg-gold-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gold-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Availability Slots</h3>
        
        {availabilitySlots.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No availability slots configured yet.</p>
        ) : (
          <div className="space-y-3">
            {availabilitySlots.map(slot => (
              <div key={slot.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-barber-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(slot.date).toLocaleDateString()} • {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {getBarberName(slot.barberId)}
                  </div>
                </div>
                
                <button
                  onClick={() => removeAvailabilitySlot(slot.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};