import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Plus, Edit, Trash2, Save, X, Image } from 'lucide-react';

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

const SliderManager: React.FC = () => {
  const { content, updateContent } = useContent();
  const [editingSlide, setEditingSlide] = useState<SlideData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Omit<SlideData, 'id'>>({
    image: '',
    title: '',
    subtitle: ''
  });

  const handleEdit = (slide: SlideData) => {
    setEditingSlide(slide);
    setFormData({
      image: slide.image,
      title: slide.title,
      subtitle: slide.subtitle
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingSlide(null);
    setFormData({
      image: '',
      title: '',
      subtitle: ''
    });
  };

  const handleSave = () => {
    if (isAddingNew) {
      const newSlide: SlideData = {
        id: Math.max(...content.slides.map(s => s.id), 0) + 1,
        ...formData
      };
      updateContent('slides', [...content.slides, newSlide]);
    } else if (editingSlide) {
      const updatedSlides = content.slides.map(slide =>
        slide.id === editingSlide.id
          ? { ...slide, ...formData }
          : slide
      );
      updateContent('slides', updatedSlides);
    }
    
    setEditingSlide(null);
    setIsAddingNew(false);
    setFormData({ image: '', title: '', subtitle: '' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      const updatedSlides = content.slides.filter(slide => slide.id !== id);
      updateContent('slides', updatedSlides);
    }
  };

  const handleCancel = () => {
    setEditingSlide(null);
    setIsAddingNew(false);
    setFormData({ image: '', title: '', subtitle: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Image Slider Manager</h1>
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
      {(editingSlide || isAddingNew) && (
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="Slide title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300 resize-none"
                  placeholder="Slide subtitle or description"
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
              <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden">
                {formData.image ? (
                  <img
                    src={formData.image}
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

      {/* Slides List */}
      <div className="grid gap-6">
        {content.slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{slide.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{slide.subtitle}</p>
                <p className="text-xs text-gray-500 truncate">{slide.image}</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
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

export default SliderManager;