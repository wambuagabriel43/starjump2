import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Plus, Edit, Trash2, Save, X, Calendar, Clock, MapPin } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

const EventsManager: React.FC = () => {
  const { content, updateContent } = useContent();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: ''
  });

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      image: event.image
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: ''
    });
  };

  const handleSave = () => {
    if (isAddingNew) {
      const newEvent: Event = {
        id: Math.max(...content.events.map(e => e.id), 0) + 1,
        ...formData
      };
      updateContent('events', [...content.events, newEvent]);
    } else if (editingEvent) {
      const updatedEvents = content.events.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...formData }
          : event
      );
      updateContent('events', updatedEvents);
    }
    
    setEditingEvent(null);
    setIsAddingNew(false);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: ''
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = content.events.filter(event => event.id !== id);
      updateContent('events', updatedEvents);
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setIsAddingNew(false);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Manager</h1>
          <p className="text-gray-600 mt-2">Manage upcoming events and activities</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-royal-blue text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Edit Form */}
      {(editingEvent || isAddingNew) && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isAddingNew ? 'Add New Event' : 'Edit Event'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="Event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                    placeholder="July 15, 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                    placeholder="10:00 AM - 4:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="Event location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300 resize-none"
                  placeholder="Event description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Calendar className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-royal-blue mb-2">
                    {formData.title || 'Event Title'}
                  </h3>
                  <div className="space-y-1 mb-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formData.date || 'Event Date'}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {formData.time || 'Event Time'}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {formData.location || 'Event Location'}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {formData.description || 'Event description will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="grid gap-6">
        {content.events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-1 mb-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{event.description}</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsManager;