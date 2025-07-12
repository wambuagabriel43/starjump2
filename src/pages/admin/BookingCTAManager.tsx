import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Save, Plus, Trash2, Edit, X } from 'lucide-react';

const BookingCTAManager: React.FC = () => {
  const { content, updateContent } = useContent();
  const [formData, setFormData] = useState(content.bookingCTA);
  const [editingFeature, setEditingFeature] = useState<number | null>(null);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });

  const handleSave = () => {
    updateContent('bookingCTA', formData);
    alert('Booking CTA section updated successfully!');
  };

  const handleAddFeature = () => {
    if (newFeature.title.trim() && newFeature.description.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, { ...newFeature }]
      });
      setNewFeature({ title: '', description: '' });
    }
  };

  const handleEditFeature = (index: number, feature: { title: string; description: string }) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = feature;
    setFormData({
      ...formData,
      features: updatedFeatures
    });
    setEditingFeature(null);
  };

  const handleDeleteFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking CTA Manager</h1>
        <p className="text-gray-600 mt-2">Manage the booking call-to-action section</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">CTA Content</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="CTA title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300 resize-none"
                  placeholder="CTA description"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Features List</h2>
            
            <div className="space-y-4 mb-6">
              {formData.features.map((feature, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  {editingFeature === index ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        defaultValue={feature.title}
                        placeholder="Feature title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                        onBlur={(e) => {
                          const title = e.target.value;
                          const description = e.target.nextElementSibling?.value || feature.description;
                          handleEditFeature(index, { title, description });
                        }}
                      />
                      <textarea
                        defaultValue={feature.description}
                        placeholder="Feature description"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                        onBlur={(e) => {
                          const description = e.target.value;
                          const title = e.target.previousElementSibling?.value || feature.title;
                          handleEditFeature(index, { title, description });
                        }}
                      />
                      <button
                        onClick={() => setEditingFeature(null)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                      <div className="flex space-x-1 ml-4">
                        <button
                          onClick={() => setEditingFeature(index)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFeature(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={newFeature.title}
                onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                placeholder="New feature title"
              />
              <textarea
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300 resize-none"
                placeholder="New feature description"
              />
              <button
                onClick={handleAddFeature}
                className="w-full bg-royal-blue text-white px-4 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Feature</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Save className="h-5 w-5" />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Preview</h2>
            
            <div className="bg-gradient-to-br from-bright-orange to-fun-pink rounded-xl p-6 text-white mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {formData.title || 'CTA Title'}
              </h3>
              <p className="text-white/95">
                {formData.description || 'CTA description will appear here...'}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-bold text-royal-blue">What's Included:</h4>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-royal-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-royal-blue">{feature.title}</h5>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-royal-blue to-blue-600 rounded-xl p-6 text-white text-center">
              <h4 className="text-xl font-bold mb-2">Ready to Book?</h4>
              <p className="mb-4 opacity-90">
                Fill out our quick booking form and we'll get back to you within 2 hours.
              </p>
              <button className="bg-gradient-to-r from-star-yellow to-bright-orange text-royal-blue font-bold px-8 py-3 rounded-full">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCTAManager;