import React from 'react';
import { Scissors, User, Calendar, Settings } from 'lucide-react';

interface HeaderProps {
  currentView: 'barber' | 'customer';
  onViewChange: (view: 'barber' | 'customer') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-gradient-to-r from-barber-800 to-barber-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Scissors className="w-8 h-8 text-gold-400" />
              <h1 className="text-xl font-bold">Elite Barber Shop</h1>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange('customer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === 'customer'
                  ? 'bg-gold-500 text-white shadow-md'
                  : 'text-barber-100 hover:bg-barber-700 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Customer</span>
            </button>

            <button
              onClick={() => onViewChange('barber')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === 'barber'
                  ? 'bg-gold-500 text-white shadow-md'
                  : 'text-barber-100 hover:bg-barber-700 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Barber Dashboard</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};