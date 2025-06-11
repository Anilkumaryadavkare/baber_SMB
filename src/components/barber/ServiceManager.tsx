import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { Service } from '../../types';
import { services as initialServices } from '../../data/mockData';

interface ServiceManagerProps {
  onNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({ onNotification }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const startEdit = (service: Service) => {
    setIsEditing(service.id);
    setEditForm(service);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editForm.name || !editForm.duration || !editForm.price) {
      onNotification('error', 'Please fill in all required fields');
      return;
    }

    setServices(prev => prev.map(service => 
      service.id === isEditing ? { ...service, ...editForm } : service
    ));
    setIsEditing(null);
    setEditForm({});
    onNotification('success', 'Service updated successfully');
  };

  const addService = () => {
    if (!editForm.name || !editForm.duration || !editForm.price) {
      onNotification('error', 'Please fill in all required fields');
      return;
    }

    const newService: Service = {
      id: Date.now().toString(),
      name: editForm.name,
      duration: editForm.duration!,
      price: editForm.price!,
      description: editForm.description || ''
    };

    setServices(prev => [...prev, newService]);
    setShowAddForm(false);
    setEditForm({});
    onNotification('success', 'Service added successfully');
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    onNotification('info', 'Service deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Service Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gold-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gold-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gold-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                placeholder="Enter service name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={editForm.duration || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                placeholder="Duration in minutes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                value={editForm.price || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                placeholder="Price in dollars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={editForm.description || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                placeholder="Service description"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={addService}
              className="bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Add Service
            </button>
            <button
              onClick={() => { setShowAddForm(false); setEditForm({}); }}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            {isEditing === service.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={editForm.duration || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                  <input
                    type="number"
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 bg-green-500 text-white py-1 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-500 text-white py-1 px-3 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEdit(service)}
                      className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-barber-600">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{service.price}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};