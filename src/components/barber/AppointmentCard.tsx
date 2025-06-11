import React from 'react';
import { Clock, User, Phone, DollarSign } from 'lucide-react';
import { Appointment, Service, Barber } from '../../types';

interface AppointmentCardProps {
  appointment: Appointment;
  service: Service;
  barber: Barber;
  onStatusChange: (appointmentId: string, status: Appointment['status']) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  service,
  barber,
  onStatusChange
}) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={barber.avatar}
            alt={barber.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{appointment.customerName}</h3>
            <p className="text-sm text-gray-600">{service.name}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[appointment.status]}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{appointment.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>{barber.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>{appointment.customerPhone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>${service.price}</span>
        </div>
      </div>

      {appointment.status === 'confirmed' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onStatusChange(appointment.id, 'completed')}
            className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Mark Complete
          </button>
          <button
            onClick={() => onStatusChange(appointment.id, 'cancelled')}
            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};