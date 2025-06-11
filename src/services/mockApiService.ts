import { TimeSlot, Appointment, Service } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  // Mock messaging service (WhatsApp/SMS)
  static async sendMessage(phone: string, message: string, type: 'whatsapp' | 'sms' = 'whatsapp'): Promise<boolean> {
    await delay(1000);
    console.log(`Sending ${type} to ${phone}: ${message}`);
    return Math.random() > 0.1; // 90% success rate
  }

  // Mock calendar blocking service
  static async blockTimeSlot(slotId: string): Promise<boolean> {
    await delay(500);
    console.log(`Blocking time slot: ${slotId}`);
    return true;
  }

  // Mock appointment creation
  static async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    await delay(800);
    const newAppointment: Appointment = {
      ...appointment,
      id: `app_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    // Send confirmation message
    const confirmationMessage = `Hi ${appointment.customerName}! Your appointment at Elite Barber Shop is confirmed for ${appointment.date} at ${appointment.time}. We'll send you a reminder 15 minutes before. See you soon!`;
    await this.sendMessage(appointment.customerPhone, confirmationMessage);
    
    return newAppointment;
  }

  // Mock reminder service
  static async sendReminder(appointment: Appointment): Promise<boolean> {
    await delay(300);
    const reminderMessage = `Reminder: Your appointment at Elite Barber Shop is in 15 minutes (${appointment.time}). See you soon!`;
    return await this.sendMessage(appointment.customerPhone, reminderMessage);
  }

  // Mock availability slots generation
  static async generateAvailableSlots(serviceId: string, date: string, barberId?: string): Promise<TimeSlot[]> {
    await delay(600);
    // This would normally call the backend Python service with Vertex AI
    console.log(`Generating slots for service: ${serviceId}, date: ${date}, barber: ${barberId}`);
    return [];
  }

  // Mock Vertex AI integration for smart scheduling
  static async optimizeSchedule(appointments: Appointment[], services: Service[]): Promise<string[]> {
    await delay(1200);
    console.log('Using Vertex AI for schedule optimization...');
    return ['Schedule optimized for maximum efficiency', 'Recommended 15-minute breaks between long services'];
  }
}