import { Service, Barber, TimeSlot, Appointment } from '../types';

export const services: Service[] = [
  {
    id: 'haircut',
    name: 'Classic Haircut',
    duration: 45,
    price: 35,
    description: 'Professional haircut with wash and style'
  },
  {
    id: 'beard-haircut',
    name: 'Haircut + Beard Trim',
    duration: 60,
    price: 50,
    description: 'Complete grooming with haircut and beard styling'
  },
  {
    id: 'beard-only',
    name: 'Beard Trim & Style',
    duration: 30,
    price: 25,
    description: 'Precision beard trimming and styling'
  },
  {
    id: 'hot-towel',
    name: 'Hot Towel Shave',
    duration: 45,
    price: 40,
    description: 'Traditional hot towel shave experience'
  },
  {
    id: 'deluxe',
    name: 'Deluxe Package',
    duration: 90,
    price: 75,
    description: 'Complete grooming: haircut, beard, hot towel, and styling'
  },
  {
    id: 'kids',
    name: 'Kids Haircut',
    duration: 30,
    price: 20,
    description: 'Special haircut service for children under 12'
  }
];

export const barbers: Barber[] = [
  {
    id: 'mike',
    name: 'Mike Johnson',
    specialties: ['Classic Cuts', 'Beard Styling'],
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.8
  },
  {
    id: 'carlos',
    name: 'Carlos Rodriguez',
    specialties: ['Modern Styles', 'Hot Towel Shaves'],
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.9
  },
  {
    id: 'david',
    name: 'David Kim',
    specialties: ['Fade Cuts', 'Kids Cuts'],
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.7
  }
];

// Generate initial time slots for the next 7 days
export const generateInitialTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const dateString = date.toISOString().split('T')[0];
    
    // Skip Sundays (assuming closed)
    if (date.getDay() === 0) continue;
    
    // Generate time slots from 9 AM to 6 PM
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        barbers.forEach(barber => {
          slots.push({
            id: `${dateString}-${timeString}-${barber.id}`,
            time: timeString,
            date: dateString,
            barberId: barber.id,
            isBooked: Math.random() < 0.2, // 20% chance of being pre-booked
            customerName: Math.random() < 0.2 ? 'John Doe' : undefined,
            customerPhone: Math.random() < 0.2 ? '+1234567890' : undefined,
          });
        });
      }
    }
  }
  
  return slots;
};

export const initialAppointments: Appointment[] = [
  {
    id: 'app1',
    customerId: 'cust1',
    customerName: 'John Smith',
    customerPhone: '+1234567890',
    barberId: 'mike',
    serviceId: 'haircut',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    status: 'confirmed',
    reminderSent: false,
    createdAt: new Date().toISOString()
  }
];