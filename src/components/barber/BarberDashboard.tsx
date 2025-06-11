import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Clock, Settings, MessageSquare } from 'lucide-react';
import { Appointment, Service, Barber } from '../../types';
import { services, barbers, initialAppointments, generateInitialTimeSlots } from '../../data/mockData';
import { MockApiService } from '../../services/mockApiService';
import { AppointmentCard } from './AppointmentCard';
import { AvailabilityManager } from './AvailabilityManager';
import { ServiceManager } from './ServiceManager';

interface BarberDashboardProps {
  onNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

export const BarberDashboard: React.FC<BarberDashboardProps> = ({ onNotification }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'availability' | 'services'>('overview');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const todayAppointments = appointments.filter(apt => apt.date === selectedDate);
  const totalRevenue = todayAppointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => {
      const service = services.find(s => s.id === apt.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const handleStatusChange = async (appointmentId: string, status: Appointment['status']) => {
    try {
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status } : apt
      ));
      
      if (status === 'completed') {
        onNotification('success', 'Appointment marked as completed');
      } else if (status === 'cancelled') {
        // Send cancellation message
        const appointment = appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
          await MockApiService.sendMessage(
            appointment.customerPhone,
            `Hi ${appointment.customerName}, your appointment on ${appointment.date} at ${appointment.time} has been cancelled. Please contact us to reschedule.`
          );
        }
        onNotification('info', 'Appointment cancelled and customer notified');
      }
    } catch (error) {
      onNotification('error', 'Failed to update appointment status');
    }
  };

  const sendReminderToAll = async () => {
    const upcomingAppointments = appointments.filter(
      apt => apt.status === 'confirmed' && apt.date === selectedDate && !apt.reminderSent
    );

    let sentCount = 0;
    for (const appointment of upcomingAppointments) {
      try {
        await MockApiService.sendReminder(appointment);
        setAppointments(prev => prev.map(apt => 
          apt.id === appointment.id ? { ...apt, reminderSent: true } : apt
        ));
        sentCount++;
      } catch (error) {
        console.error('Failed to send reminder', error);
      }
    }

    if (sentCount > 0) {
      onNotification('success', `Sent ${sentCount} reminder${sentCount > 1 ? 's' : ''}`);
    } else {
      onNotification('info', 'No reminders to send');
    }
  };

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Active Customers',
      value: new Set(appointments.map(apt => apt.customerId)).size,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: "Today's Revenue",
      value: `$${totalRevenue}`,
      icon: DollarSign,
      color: 'text-yellow-600'
    },
    {
      title: 'Avg. Service Time',
      value: '48 min',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Barber Dashboard</h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
          />
          <button
            onClick={sendReminderToAll}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Reminders</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Calendar },
            { id: 'appointments', label: 'Appointments', icon: Users },
            { id: 'availability', label: 'Availability', icon: Clock },
            { id: 'services', label: 'Services', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Appointments Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-gold-600 hover:text-gold-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments scheduled for today.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayAppointments.slice(0, 4).map(appointment => {
                  const service = services.find(s => s.id === appointment.serviceId)!;
                  const barber = barbers.find(b => b.id === appointment.barberId)!;
                  return (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      service={service}
                      barber={barber}
                      onStatusChange={handleStatusChange}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Appointments for {new Date(selectedDate).toLocaleDateString()}
            </h2>
            
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments scheduled for this date.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayAppointments.map(appointment => {
                  const service = services.find(s => s.id === appointment.serviceId)!;
                  const barber = barbers.find(b => b.id === appointment.barberId)!;
                  return (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      service={service}
                      barber={barber}
                      onStatusChange={handleStatusChange}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'availability' && (
        <div className="animate-fade-in">
          <AvailabilityManager onNotification={onNotification} />
        </div>
      )}

      {activeTab === 'services' && (
        <div className="animate-fade-in">
          <ServiceManager onNotification={onNotification} />
        </div>
      )}
    </div>
  );
};