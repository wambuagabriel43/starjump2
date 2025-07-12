import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Image, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase, Slider } from '../../lib/supabase';
import { useSliders } from '../../hooks/useSupabaseData';

const SlidersManager: React.FC = () => {
  const { sliders, loading, error, refetch } = useSliders();
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Slider>>({
    title: '',
    subtitle: '',
    image_url: '',
    order_position: 0,
    active: true
  });

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      image_url: slider.image_url,
      order_position: slider.order_position,
      active: slider.active
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingSlider(null);
    const nextPosition = Math.max(...sliders.map(s => s.order_position), 0) + 1;
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      order_position: nextPosition,
      active: true
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('sliders')
          .insert([formData]);
        
        if (error) throw error;
        alert('Slider added successfully!');
      } else if (editingSlider) {
        const { error } = await supabase
          .from('sliders')
          .update(formData)
          .eq('id', editingSlider.id);
        
        if (error) throw error;
        alert('Slider updated successfully!');
      }
      
      handleCancel();
      refetch();
    } catch (err) {
      alert('Error saving slider: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;
    
    try {
      const { error } = await supabase
        .from('sliders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      alert('Slider deleted successfully!');
      refetch();
    } catch (err) {
      alert('Error deleting slider: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const slider = sliders.find(s => s.id === id);
    if (!slider) return;

    const newPosition = direction === 'up' 
      ? slider.order_position - 1 
      : slider.order_position + 1;

    try {
      const { error } = await supabase
        .from('sliders')
        .update({ order_position: newPosition })
        .eq('id', id);
      
      if (error) throw error;
      refetch();
    } catch (err) {
      alert('Error reordering slider: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleCancel = () => {
    setEditingSlider(null);
    setIsAddingNew(false);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      order_position: 0,
      active: true
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sliders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-red-600">Error loading sliders: {error}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Homepage Sliders</h1>
          <p className="text-gray-600 mt-2">Manage homepage slider images and content</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-royal-blue text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Edit Form */}
      {(editingSlider || isAddingNew) && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isAddingNew ? 'Add New Slide' : 'Edit Slide'}
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
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="Slide title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300 resize-none"
                  placeholder="Slide subtitle or description"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Position
                </label>
                <input
                  type="number"
                  value={formData.order_position || 0}
                  onChange={(e) => setFormData({ ...formData, order_position: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active || false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active (visible on website)
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
              <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Image className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h2 className="text-2xl font-bold mb-2">{formData.title || 'Slide Title'}</h2>
                    <p className="text-lg">{formData.subtitle || 'Slide subtitle'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sliders List */}
      <div className="grid gap-6">
        {sliders
          .sort((a, b) => a.order_position - b.order_position)
          .map((slider) => (
          <div key={slider.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={slider.image_url}
                  alt={slider.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{slider.title}</h3>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                    Position {slider.order_position}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    slider.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {slider.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{slider.subtitle}</p>
                <p className="text-xs text-gray-500 truncate">{slider.image_url}</p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleReorder(slider.id, 'up')}
                    className="bg-gray-100 text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors duration-300"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(slider.id, 'down')}
                    className="bg-gray-100 text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors duration-300"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(slider)}
                    className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slider.id)}
                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sliders.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sliders yet</h3>
          <p className="text-gray-600">Get started by adding your first slide.</p>
        </div>
      )}
    </div>
  );
};

export default SlidersManager;