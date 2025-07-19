import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText, Globe, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useComponentContent, useSiteContent, useUILabels } from '../../hooks/useContentData';

const ContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'component' | 'site' | 'ui'>('component');
  const { content: componentContent, loading: componentLoading, error: componentError } = useComponentContent('header');
  const { content: siteContent, loading: siteLoading, error: siteError } = useSiteContent();
  const { labels: uiLabels, loading: uiLoading, error: uiError } = useUILabels();
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('header');

  const [formData, setFormData] = useState({
    component_name: 'header',
    content_key: '',
    content_type: 'text',
    title: '',
    content_text: '',
    image_url: '',
    metadata: {},
    active: true
  });

  const availableComponents = [
    'header', 'footer', 'navigation', 'sidebar', 'hero', 'cta', 'testimonials'
  ];

  const contentTypes = [
    { value: 'text', label: 'Text Content' },
    { value: 'html', label: 'HTML Content' },
    { value: 'image', label: 'Image' },
    { value: 'link', label: 'Link/URL' },
    { value: 'json', label: 'JSON Data' }
  ];

  const uiCategories = [
    'navigation', 'buttons', 'forms', 'status', 'messages', 'labels'
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let table = '';
      let data = {};

      switch (activeTab) {
        case 'component':
          table = 'component_content';
          data = {
            component_name: formData.component_name,
            content_key: formData.content_key,
            content_type: formData.content_type,
            title: formData.title,
            content_text: formData.content_text,
            image_url: formData.image_url,
            metadata: formData.metadata,
            active: formData.active
          };
          break;
        case 'site':
          table = 'site_content';
          data = {
            content_key: formData.content_key,
            content_type: formData.content_type,
            title: formData.title,
            content_text: formData.content_text,
            metadata: formData.metadata,
            active: formData.active
          };
          break;
        case 'ui':
          table = 'ui_labels';
          data = {
            category: formData.component_name, // Reusing component_name field for category
            label_key: formData.content_key,
            label_text: formData.content_text,
            context: formData.title, // Reusing title field for context
            active: formData.active
          };
          break;
      }

      if (isAddingNew) {
        const { error } = await supabase.from(table).insert([data]);
        if (error) throw error;
        alert('Content added successfully!');
      } else if (editingItem) {
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
        alert('Content updated successfully!');
      }

      handleCancel();
      window.location.reload(); // Refresh to show changes
    } catch (err) {
      alert('Error saving content: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      let table = '';
      switch (activeTab) {
        case 'component': table = 'component_content'; break;
        case 'site': table = 'site_content'; break;
        case 'ui': table = 'ui_labels'; break;
      }

      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      alert('Content deleted successfully!');
      window.location.reload();
    } catch (err) {
      alert('Error deleting content: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsAddingNew(false);
    
    if (activeTab === 'ui') {
      setFormData({
        component_name: item.category,
        content_key: item.label_key,
        content_type: 'text',
        title: item.context || '',
        content_text: item.label_text,
        image_url: '',
        metadata: {},
        active: item.active
      });
    } else {
      setFormData({
        component_name: item.component_name || selectedComponent,
        content_key: item.content_key,
        content_type: item.content_type || 'text',
        title: item.title || '',
        content_text: item.content_text || '',
        image_url: item.image_url || '',
        metadata: item.metadata || {},
        active: item.active
      });
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingItem(null);
    setFormData({
      component_name: activeTab === 'ui' ? 'general' : selectedComponent,
      content_key: '',
      content_type: 'text',
      title: '',
      content_text: '',
      image_url: '',
      metadata: {},
      active: true
    });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAddingNew(false);
    setFormData({
      component_name: activeTab === 'ui' ? 'general' : selectedComponent,
      content_key: '',
      content_type: 'text',
      title: '',
      content_text: '',
      image_url: '',
      metadata: {},
      active: true
    });
  };

  const renderContentList = () => {
    let items: any[] = [];
    let loading = false;
    let error = null;

    switch (activeTab) {
      case 'component':
        items = componentContent;
        loading = componentLoading;
        error = componentError;
        break;
      case 'site':
        items = siteContent;
        loading = siteLoading;
        error = siteError;
        break;
      case 'ui':
        items = uiLabels;
        loading = uiLoading;
        error = uiError;
        break;
    }

    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {activeTab === 'ui' ? item.label_key : item.content_key}
                </span>
                <span className="text-sm text-gray-500">
                  ({activeTab === 'ui' ? item.category : item.content_type})
                </span>
                {!item.active && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                    Inactive
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200 transition-colors duration-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 transition-colors duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {activeTab === 'ui' ? item.label_text : (item.content_text || item.title || 'No content')}
            </p>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600">Add your first content item to get started.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
        <p className="text-gray-600 mt-2">Manage component content, site-wide content, and UI labels</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('component')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'component'
                ? 'border-royal-blue text-royal-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Component Content
          </button>
          <button
            onClick={() => setActiveTab('site')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'site'
                ? 'border-royal-blue text-royal-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Globe className="h-4 w-4 inline mr-2" />
            Site Content
          </button>
          <button
            onClick={() => setActiveTab('ui')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ui'
                ? 'border-royal-blue text-royal-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Tag className="h-4 w-4 inline mr-2" />
            UI Labels
          </button>
        </nav>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Content List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === 'component' && 'Component Content'}
                {activeTab === 'site' && 'Site Content'}
                {activeTab === 'ui' && 'UI Labels'}
              </h2>
              <button
                onClick={handleAddNew}
                className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add New</span>
              </button>
            </div>

            {activeTab === 'component' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Component
                </label>
                <select
                  value={selectedComponent}
                  onChange={(e) => setSelectedComponent(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                >
                  {availableComponents.map((comp) => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>
            )}

            {renderContentList()}
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-1">
          {(editingItem || isAddingNew) ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isAddingNew ? 'Add New' : 'Edit'} {activeTab === 'component' ? 'Component' : activeTab === 'site' ? 'Site' : 'UI'} Content
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {activeTab === 'component' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Component Name
                    </label>
                    <select
                      value={formData.component_name}
                      onChange={(e) => setFormData({ ...formData, component_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    >
                      {availableComponents.map((comp) => (
                        <option key={comp} value={comp}>{comp}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeTab === 'ui' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.component_name}
                      onChange={(e) => setFormData({ ...formData, component_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    >
                      {uiCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'ui' ? 'Label Key' : 'Content Key'} *
                  </label>
                  <input
                    type="text"
                    value={formData.content_key}
                    onChange={(e) => setFormData({ ...formData, content_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    placeholder={activeTab === 'ui' ? 'button_submit' : 'hero_title'}
                    required
                  />
                </div>

                {activeTab !== 'ui' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={formData.content_type}
                      onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    >
                      {contentTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'ui' ? 'Context' : 'Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    placeholder={activeTab === 'ui' ? 'Button context' : 'Content title'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'ui' ? 'Label Text' : 'Content'} *
                  </label>
                  <textarea
                    value={formData.content_text}
                    onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                    placeholder={activeTab === 'ui' ? 'Submit' : 'Content text'}
                    required
                  />
                </div>

                {activeTab !== 'ui' && formData.content_type === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select Content</h3>
              <p className="text-gray-600">Choose content to edit or add new content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManager;