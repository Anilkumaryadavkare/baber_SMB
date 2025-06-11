import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Service, Barber, TimeSlot } from '../../types';
import { services, barbers, generateInitialTimeSlots } from '../../data/mockData';
import { MockApiService } from '../../services/mockApiService';
import { ServiceCard } from './ServiceCard';
import { BarberCard } from './BarberCard';
import { TimeSlotGrid } from './TimeSlotGrid';
import { BookingForm } from './BookingForm';

interface CustomerBookingProps {
  onNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

export const CustomerBooking: React.FC<CustomerBookingProps> = ({ onNotification }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'service' | 'barber' | 'datetime' | 'booking'>('service');

  useEffect(() => {
    setTimeSlots(generateInitialTimeSlots());
  }, []);

  const filteredTimeSlots = timeSlots.filter(
    slot => slot.date === selectedDate && 
    (!selectedBarber || slot.barberId === selectedBarber.id)
  );

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('barber');
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setStep('datetime');
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('booking');
  };

  const handleBooking = async (name: string, phone: string) => {
    if (!selectedService || !selectedBarber || !selectedSlot) return;

    setIsLoading(true);
    try {
      const appointment = await MockApiService.createAppointment({
        customerId: 'temp_customer',
        customerName: name,
        customerPhone: phone,
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        date: selectedSlot.date,
        time: selectedSlot.time,
        status: 'confirmed',
        reminderSent: false
      });

      // Block the time slot
      await MockApiService.blockTimeSlot(selectedSlot.id);
      
      // Update local state
      setTimeSlots(prev => prev.map(slot => 
        slot.id === selectedSlot.id 
          ? { ...slot, isBooked: true, customerName: name, customerPhone: phone }
          : slot
      ));

      onNotification('success', 'Appointment booked successfully! Confirmation sent via WhatsApp.');
      
      // Reset form
      setSelectedService(null);
      setSelectedBarber(null);
      setSelectedSlot(null);
      setStep('service');
    } catch (error) {
      onNotification('error', 'Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextWeek = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 7);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const prevWeek = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 7);
    if (date >= new Date()) {
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  };

  const goBack = () => {
    if (step === 'booking') setStep('datetime');
    else if (step === 'datetime') setStep('barber');
    else if (step === 'barber') setStep('service');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['Service', 'Barber', 'Date & Time', 'Booking'].map((label, index) => {
            const stepNames = ['service', 'barber', 'datetime', 'booking'];
            const currentIndex = stepNames.indexOf(step);
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={label} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? 'bg-gold-500 text-white' : 'bg-gray-200 text-gray-500'
                } ${isCurrent ? 'ring-4 ring-gold-200' : ''}`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-gold-600' : 'text-gray-500'
                }`}>
                  {label}
                </span>
                {index < 3 && (
                  <div className={`mx-4 h-0.5 w-16 ${
                    index < currentIndex ? 'bg-gold-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {step !== 'service' && (
          <button
            onClick={goBack}
            className="mb-4 flex items-center space-x-2 text-barber-600 hover:text-barber-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        {step === 'service' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedService?.id === service.id}
                  onSelect={handleServiceSelect}
                />
              ))}
            </div>
          </div>
        )}

        {step === 'barber' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Barber</h2>
            <p className="text-gray-600 mb-6">Selected: {selectedService?.name}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
                onClick={() => handleBarberSelect({ id: 'any', name: 'Any Available', specialties: [], avatar: '', rating: 0 })}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg ${
                  selectedBarber?.id === 'any'
                    ? 'border-gold-500 bg-gold-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gold-300'
                }`}
              >
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Any Available Barber</h3>
                  <p className="text-sm text-gray-600">Get the next available appointment</p>
                </div>
              </div>
              {barbers.map((barber) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  isSelected={selectedBarber?.id === barber.id}
                  onSelect={handleBarberSelect}
                />
              ))}
            </div>
          </div>
        )}

        {step === 'datetime' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
            <p className="text-gray-600 mb-6">
              {selectedService?.name} with {selectedBarber?.name}
            </p>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevWeek}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={new Date(selectedDate) <= new Date()}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-semibold">
                  Week of {new Date(selectedDate).toLocaleDateString()}
                </h3>
                <button
                  onClick={nextWeek}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() + i);
                  const dateString = date.toISOString().split('T')[0];
                  const isToday = dateString === new Date().toISOString().split('T')[0];
                  const isPast = date < new Date();
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateString)}
                      disabled={isPast}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDate === dateString
                          ? 'bg-gold-500 text-white'
                          : isPast
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 hover:border-gold-300 hover:bg-gold-50'
                      } ${isToday ? 'ring-2 ring-blue-200' : ''}`}
                    >
                      <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="font-bold">{date.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Available Times</h4>
              <TimeSlotGrid
                timeSlots={filteredTimeSlots}
                selectedSlot={selectedSlot}
                onSlotSelect={handleSlotSelect}
              />
            </div>
          </div>
        )}

        {step === 'booking' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Appointment Summary</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Service:</span> {selectedService?.name}</p>
                <p><span className="font-medium">Barber:</span> {selectedBarber?.name}</p>
                <p><span className="font-medium">Date:</span> {new Date(selectedSlot?.date || '').toLocaleDateString()}</p>
                <p><span className="font-medium">Time:</span> {selectedSlot?.time}</p>
                <p><span className="font-medium">Duration:</span> {selectedService?.duration} minutes</p>
                <p><span className="font-medium">Price:</span> ${selectedService?.price}</p>
              </div>
            </div>

            <BookingForm onSubmit={handleBooking} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
};