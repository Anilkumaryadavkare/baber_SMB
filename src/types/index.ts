export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  specialties: string[];
  avatar: string;
  rating: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  date: string;
  barberId: string;
  serviceId?: string;
  isBooked: boolean;
  customerName?: string;
  customerPhone?: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  reminderSent: boolean;
  createdAt: string;
}

export interface AvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
  barberId: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}