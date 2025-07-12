import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Save, Plus, Trash2, Edit, X } from 'lucide-react';

const InfoSectionManager: React.FC = () => {
  const { content, updateContent } = useContent();
  const [formData, setFormData] = useState(content.infoSection);
  const [editingBenefit, setEditingBenefit] = useState<number | null>(null);
  const [newBenefit, setNewBenefit] = useState('');

  const handleSave = () => {
    updateContent('infoSection', formData);
    alert('Info section updated successfully!');
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, newBenefit.trim()]
      });
      setNewBenefit('');
    }
  };

  const handleEditBenefit = (index: number, value: string) => {
    const updatedBenefits = [...formData.benefits];
    updatedBenefits[index] = value;
    setFormData({
      ...formData,
      benefits: updatedBenefits
    });
    setEditingBenefit(null);
  };

  const handleDeleteBenefit = (index: number) => {
    const updatedBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      benefits: updatedBenefits
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Info Section Manager</h1>
        <p className="text-gray-600 mt-2">Manage company information and benefits section</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Section Content</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="Section title"
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
                  placeholder="Section description"
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
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Events
                </label>
                <input
                  type="text"
                  value={formData.stats.events}
                  onChange={(e) => setFormData({
                    ...formData,
                    stats: { ...formData.stats, events: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="500+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  value={formData.stats.experience}
                  onChange={(e) => setFormData({
                    ...formData,
                    stats: { ...formData.stats, experience: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="10+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support
                </label>
                <input
                  type="text"
                  value={formData.stats.support}
                  onChange={(e) => setFormData({
                    ...formData,
                    stats: { ...formData.stats, support: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                  placeholder="24/7"
                />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Benefits List</h2>
            
            <div className="space-y-3 mb-4">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {editingBenefit === index ? (
                    <input
                      type="text"
                      defaultValue={benefit}
                      onBlur={(e) => handleEditBenefit(index, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEditBenefit(index, e.currentTarget.value);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-gray-700">{benefit}</span>
                  )}
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingBenefit(index)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBenefit(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddBenefit();
                  }
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                placeholder="Add new benefit"
              />
              <button
                onClick={handleAddBenefit}
                className="bg-royal-blue text-white px-4 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300"
              >
                <Plus className="h-5 w-5" />
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
            
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="h-48 bg-gray-100 rounded-xl overflow-hidden">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span>Image Preview</span>
                  </div>
                )}
              </div>

              {/* Content Preview */}
              <div>
                <h3 className="text-2xl font-bold text-royal-blue mb-4">
                  {formData.title || 'Section Title'}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {formData.description || 'Section description will appear here...'}
                </p>

                {/* Benefits Preview */}
                <div className="space-y-3 mb-6">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-royal-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-gray-700 pt-1">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-star-yellow">
                      {formData.stats.events}
                    </div>
                    <div className="text-sm text-gray-600">Happy Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-star-yellow">
                      {formData.stats.experience}
                    </div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-star-yellow">
                      {formData.stats.support}
                    </div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSectionManager;