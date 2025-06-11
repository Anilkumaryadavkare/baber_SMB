import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { CustomerBooking } from './components/customer/CustomerBooking';
import { BarberDashboard } from './components/barber/BarberDashboard';
import { NotificationToast } from './components/common/NotificationToast';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const [currentView, setCurrentView] = useState<'barber' | 'customer'>('customer');
  const { notifications, addNotification, removeNotification } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {currentView === 'customer' ? (
          <CustomerBooking onNotification={addNotification} />
        ) : (
          <BarberDashboard onNotification={addNotification} />
        )}
      </main>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </div>
  );
}

export default App;