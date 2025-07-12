import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Calendar, Clock, MapPin } from 'lucide-react';
import { supabase, Event, kenyanLocations, eventCategories } from '../../lib/supabase';
import { useEvents } from '../../hooks/useSupabaseData';

const SupabaseEventsManager: React.FC = () => {
  const { events, loading, error, refetch } = useEvents();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    image_url: '',
    date: '',
    time: '',
    location: '',
    category: 'General',
    featured: false
  });

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      image_url: event.image_url,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      featured: event.featured
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      date: '',
      time: '',
      location: kenyanLocations[0],
      category: 'General',
      featured: false
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('events')
          .insert([formData]);
        
        if (error) throw error;
        alert('Event added successfully!');
      } else if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(formData)
          .eq('id', editingEvent.id);
        
        if (error) throw error;
        alert('Event updated successfully!');
      }
      
      handleCancel();
      refetch();
    } catch (err) {
      alert('Error saving event: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      alert('Event deleted successfully!');
      refetch();
    } catch (err) {
      alert('Error deleting event: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setIsAddingNew(false);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      date: '',
      time: '',
      location: '',
      category: 'General',
      featured: false
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events from Supabase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-red-600">Error loading events: {error}</p>
          <button 
            onClick={refetch}
            className="mt-4 bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Manager (Supabase)</h1>
          <p className="text-gray-600 mt-2">Manage upcoming events and activities in Kenya</p>
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
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="Event title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.time || ''}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                    placeholder="10:00 AM - 4:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Kenya) *
                </label>
                <select
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  required
                >
                  <option value="">Select location</option>
                  {kenyanLocations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category || 'General'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                >
                  {eventCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300 resize-none"
                  placeholder="Event description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Event
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
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
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-royal-blue text-white px-2 py-1 rounded-full text-xs font-bold">
                      {formData.category || 'Category'}
                    </span>
                    {formData.featured && (
                      <span className="bg-star-yellow text-royal-blue px-2 py-1 rounded-full text-xs font-bold">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-royal-blue mb-2">
                    {formData.title || 'Event Title'}
                  </h3>
                  <div className="space-y-1 mb-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formData.date ? new Date(formData.date).toLocaleDateString() : 'Event Date'}
                    </div>
                    {formData.time && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {formData.time}
                      </div>
                    )}
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
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  {event.featured && (
                    <span className="bg-star-yellow text-royal-blue px-2 py-1 rounded-full text-xs font-bold">
                      Featured
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                    {event.category}
                  </span>
                </div>
                <div className="space-y-1 mb-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  {event.time && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                  )}
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

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600">Get started by adding your first event in Kenya.</p>
        </div>
      )}
    </div>
  );
};

export default SupabaseEventsManager;