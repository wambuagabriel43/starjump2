import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText, Eye, Image, Type, Layout, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePageContent, PageContentBlock } from '../../hooks/usePageContent';

const PageContentManager: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const { content, loading, error, refetch } = usePageContent(selectedPage);
  const [editingSection, setEditingSection] = useState<PageContentBlock | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [sectionForm, setSectionForm] = useState({
    section_key: '',
    content_type: 'text',
    title: '',
    subtitle: '',
    content_text: '',
    image_url: '',
    button_text: '',
    button_link: '',
    order_position: 0,
    active: true
  });

  const availablePages = [
    { slug: 'home', name: 'Home Page', description: 'Main landing page content' },
    { slug: 'about', name: 'About Us', description: 'Company information and team' },
    { slug: 'corporate', name: 'Corporate', description: 'B2B services and solutions' },
    { slug: 'events', name: 'Events', description: 'Events page content and layout' },
    { slug: 'shop', name: 'Shop', description: 'Product catalog and shopping' },
    { slug: 'blog', name: 'Blog', description: 'Blog layout and featured content' },
    { slug: 'contact', name: 'Contact Us', description: 'Contact information and forms' },
    { slug: 'booking', name: 'Booking', description: 'Booking form and process' }
  ];

  const sectionTypes = [
    { type: 'hero', name: 'Hero Section', description: 'Large banner with title and CTA' },
    { type: 'text', name: 'Text Content', description: 'Rich text content block' },
    { type: 'text_with_image', name: 'Text + Image', description: 'Text content with accompanying image' },
    { type: 'features', name: 'Features List', description: 'List of features or benefits' },
    { type: 'cta', name: 'Call to Action', description: 'Action-focused section' },
    { type: 'gallery', name: 'Image Gallery', description: 'Collection of images' },
    { type: 'testimonials', name: 'Testimonials', description: 'Customer reviews and quotes' },
    { type: 'contact_form', name: 'Contact Form', description: 'Contact or inquiry form' }
  ];

  const handleAddSection = () => {
    setIsAddingSection(true);
    setEditingSection(null);
    const nextPosition = Math.max(...content.map(s => s.order_position), 0) + 1;
    setSectionForm({
      section_key: '',
      content_type: 'text',
      title: '',
      subtitle: '',
      content_text: '',
      image_url: '',
      button_text: '',
      button_link: '',
      order_position: nextPosition,
      active: true
    });
  };

  const handleEditSection = (section: PageContentBlock) => {
    setEditingSection(section);
    setIsAddingSection(false);
    setSectionForm({
      section_key: section.section_key,
      content_type: section.content_type,
      title: section.title || '',
      subtitle: section.subtitle || '',
      content_text: section.content_text || '',
      image_url: section.image_url || '',
      button_text: section.button_text || '',
      button_link: section.button_link || '',
      order_position: section.order_position,
      active: section.active
    });
  };

  const handleSaveSection = async () => {
    if (!sectionForm.section_key.trim()) {
      alert('Section key is required');
      return;
    }

    setIsSaving(true);
    try {
      const tableName = `${selectedPage}_content`;
      
      if (isAddingSection) {
        const { error } = await supabase
          .from(tableName)
          .insert([sectionForm]);
        
        if (error) throw error;
        alert('Section added successfully!');
      } else if (editingSection) {
        const { error } = await supabase
          .from(tableName)
          .update(sectionForm)
          .eq('id', editingSection.id);
        
        if (error) throw error;
        alert('Section updated successfully!');
      }
      
      handleCancelSection();
      refetch();
    } catch (err) {
      alert('Error saving section: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    
    try {
      const tableName = `${selectedPage}_content`;
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', sectionId);
      
      if (error) throw error;
      alert('Section deleted successfully!');
      refetch();
    } catch (err) {
      alert('Error deleting section: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleCancelSection = () => {
    setEditingSection(null);
    setIsAddingSection(false);
    setSectionForm({
      section_key: '',
      content_type: 'text',
      title: '',
      subtitle: '',
      content_text: '',
      image_url: '',
      button_text: '',
      button_link: '',
      order_position: 0,
      active: true
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hero': return Layout;
      case 'text': return Type;
      case 'text_with_image': return Image;
      case 'cta': return MessageSquare;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Page Content Manager</h1>
        <p className="text-gray-600 mt-2">Manage content for all website pages using dedicated database tables</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Page Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Page</h2>
            <div className="space-y-2">
              {availablePages.map((page) => (
                <button
                  key={page.slug}
                  onClick={() => setSelectedPage(page.slug)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-300 ${
                    selectedPage === page.slug
                      ? 'bg-royal-blue text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium">{page.name}</div>
                  <div className={`text-sm ${
                    selectedPage === page.slug ? 'text-white/80' : 'text-gray-600'
                  }`}>
                    {page.description}
                  </div>
                  <div className="text-xs mt-1 font-mono opacity-60">
                    Table: {page.slug}_content
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Management */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {availablePages.find(p => p.slug === selectedPage)?.name} Content
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Managing content from table: <code className="bg-gray-100 px-2 py-1 rounded">{selectedPage}_content</code>
                  </p>
                </div>
                <button
                  onClick={handleAddSection}
                  className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Section</span>
                </button>
              </div>
            </div>

            {/* Section Form */}
            {(editingSection || isAddingSection) && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingSection ? 'Edit Section' : 'Add New Section'}
                  </h3>
                  <button
                    onClick={handleCancelSection}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Key *
                    </label>
                    <input
                      type="text"
                      value={sectionForm.section_key}
                      onChange={(e) => setSectionForm({ ...sectionForm, section_key: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      placeholder="hero, about_us, features, etc."
                      disabled={!!editingSection}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={sectionForm.content_type}
                      onChange={(e) => setSectionForm({ ...sectionForm, content_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    >
                      {sectionTypes.map((type) => (
                        <option key={type.type} value={type.type}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      placeholder="Section title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle (Optional)
                    </label>
                    <input
                      type="text"
                      value={sectionForm.subtitle}
                      onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      placeholder="Section subtitle"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={sectionForm.content_text}
                      onChange={(e) => setSectionForm({ ...sectionForm, content_text: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                      placeholder="Section content"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={sectionForm.image_url}
                      onChange={(e) => setSectionForm({ ...sectionForm, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Position
                    </label>
                    <input
                      type="number"
                      value={sectionForm.order_position}
                      onChange={(e) => setSectionForm({ ...sectionForm, order_position: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      min="0"
                    />
                  </div>

                  {(sectionForm.content_type === 'cta' || sectionForm.content_type === 'hero') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Text (Optional)
                        </label>
                        <input
                          type="text"
                          value={sectionForm.button_text}
                          onChange={(e) => setSectionForm({ ...sectionForm, button_text: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                          placeholder="Button text"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Link (Optional)
                        </label>
                        <input
                          type="text"
                          value={sectionForm.button_link}
                          onChange={(e) => setSectionForm({ ...sectionForm, button_link: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                          placeholder="/contact"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={sectionForm.active}
                      onChange={(e) => setSectionForm({ ...sectionForm, active: e.target.checked })}
                      className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      Active (visible on website)
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleSaveSection}
                    disabled={isSaving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Section'}</span>
                  </button>
                  <button
                    onClick={handleCancelSection}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Existing Sections */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Sections</h3>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">Error loading content: {error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {content.map((section, index) => {
                  const TypeIcon = getTypeIcon(section.content_type);
                  return (
                    <div key={section.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="bg-royal-blue text-white px-2 py-1 rounded text-xs font-bold">
                            {section.order_position}
                          </span>
                          <TypeIcon className="h-4 w-4 text-royal-blue" />
                          <span className="font-medium text-gray-900">{section.title || section.section_key}</span>
                          <span className="text-sm text-gray-500">({section.content_type})</span>
                          {!section.active && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSection(section)}
                            className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200 transition-colors duration-300"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 transition-colors duration-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        <strong>Key:</strong> {section.section_key}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {section.content_text || 'No content'}
                      </p>
                      {section.image_url && (
                        <div className="mt-2">
                          <img 
                            src={section.image_url} 
                            alt={section.title}
                            className="h-16 w-24 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {content.length === 0 && !error && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No content sections</h3>
                    <p className="text-gray-600">Add your first content section to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContentManager;