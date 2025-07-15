import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText, Eye, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PageContent {
  id: string;
  page_slug: string;
  content_data: any;
  meta_title: string;
  meta_description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ContentSection {
  id: string;
  type: string;
  title: string;
  content: string;
  image_url?: string;
  settings?: any;
}

const PageManager: React.FC = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    { type: 'image_text', name: 'Image + Text', description: 'Image with accompanying text' },
    { type: 'gallery', name: 'Image Gallery', description: 'Collection of images' },
    { type: 'cta', name: 'Call to Action', description: 'Action-focused section' },
    { type: 'features', name: 'Features List', description: 'List of features or benefits' },
    { type: 'testimonials', name: 'Testimonials', description: 'Customer reviews and quotes' },
    { type: 'contact_form', name: 'Contact Form', description: 'Contact or inquiry form' }
  ];

  const [sectionForm, setSectionForm] = useState({
    type: 'text',
    title: '',
    content: '',
    image_url: '',
    settings: {}
  });

  React.useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug');

      if (error) throw error;
      setPages(data || []);
    } catch (err) {
      console.error('Error fetching pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPageIfNotExists = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .upsert([{
          page_slug: slug,
          content_data: { sections: [] },
          meta_title: availablePages.find(p => p.slug === slug)?.name || slug,
          meta_description: availablePages.find(p => p.slug === slug)?.description || '',
          status: 'published'
        }], { onConflict: 'page_slug' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating page:', err);
      return null;
    }
  };

  const handleSelectPage = async (slug: string) => {
    let page = pages.find(p => p.page_slug === slug);
    
    if (!page) {
      page = await createPageIfNotExists(slug);
      if (page) {
        setPages(prev => [...prev, page]);
      }
    }
    
    setSelectedPage(page || null);
  };

  const handleAddSection = () => {
    setIsAddingSection(true);
    setEditingSection(null);
    setSectionForm({
      type: 'text',
      title: '',
      content: '',
      image_url: '',
      settings: {}
    });
  };

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section);
    setIsAddingSection(false);
    setSectionForm({
      type: section.type,
      title: section.title,
      content: section.content,
      image_url: section.image_url || '',
      settings: section.settings || {}
    });
  };

  const handleSaveSection = async () => {
    if (!selectedPage) return;

    setIsSaving(true);
    try {
      const sections = selectedPage.content_data.sections || [];
      const newSection = {
        id: editingSection?.id || `section_${Date.now()}`,
        ...sectionForm
      };

      let updatedSections;
      if (editingSection) {
        updatedSections = sections.map((s: ContentSection) => 
          s.id === editingSection.id ? newSection : s
        );
      } else {
        updatedSections = [...sections, newSection];
      }

      const { error } = await supabase
        .from('page_content')
        .update({
          content_data: { sections: updatedSections }
        })
        .eq('id', selectedPage.id);

      if (error) throw error;

      // Update local state
      const updatedPage = {
        ...selectedPage,
        content_data: { sections: updatedSections }
      };
      setSelectedPage(updatedPage);
      setPages(prev => prev.map(p => p.id === selectedPage.id ? updatedPage : p));

      alert('Section saved successfully!');
      handleCancelSection();
    } catch (err) {
      alert('Error saving section: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!selectedPage || !confirm('Are you sure you want to delete this section?')) return;

    try {
      const sections = selectedPage.content_data.sections || [];
      const updatedSections = sections.filter((s: ContentSection) => s.id !== sectionId);

      const { error } = await supabase
        .from('page_content')
        .update({
          content_data: { sections: updatedSections }
        })
        .eq('id', selectedPage.id);

      if (error) throw error;

      const updatedPage = {
        ...selectedPage,
        content_data: { sections: updatedSections }
      };
      setSelectedPage(updatedPage);
      setPages(prev => prev.map(p => p.id === selectedPage.id ? updatedPage : p));

      alert('Section deleted successfully!');
    } catch (err) {
      alert('Error deleting section: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleCancelSection = () => {
    setEditingSection(null);
    setIsAddingSection(false);
    setSectionForm({
      type: 'text',
      title: '',
      content: '',
      image_url: '',
      settings: {}
    });
  };

  const handleUpdatePageMeta = async (metaTitle: string, metaDescription: string) => {
    if (!selectedPage) return;

    try {
      const { error } = await supabase
        .from('page_content')
        .update({
          meta_title: metaTitle,
          meta_description: metaDescription
        })
        .eq('id', selectedPage.id);

      if (error) throw error;

      const updatedPage = {
        ...selectedPage,
        meta_title: metaTitle,
        meta_description: metaDescription
      };
      setSelectedPage(updatedPage);
      setPages(prev => prev.map(p => p.id === selectedPage.id ? updatedPage : p));

      alert('Page metadata updated successfully!');
    } catch (err) {
      alert('Error updating metadata: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Page Management</h1>
        <p className="text-gray-600 mt-2">Manage content for all website pages</p>
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
                  onClick={() => handleSelectPage(page.slug)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-300 ${
                    selectedPage?.page_slug === page.slug
                      ? 'bg-royal-blue text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium">{page.name}</div>
                  <div className={`text-sm ${
                    selectedPage?.page_slug === page.slug ? 'text-white/80' : 'text-gray-600'
                  }`}>
                    {page.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page Content Management */}
        <div className="lg:col-span-3">
          {selectedPage ? (
            <div className="space-y-6">
              {/* Page Meta Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {availablePages.find(p => p.slug === selectedPage.page_slug)?.name} Settings
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-royal-blue" />
                    <span className="text-sm text-gray-600">SEO & Meta</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title (SEO)
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedPage.meta_title}
                      onBlur={(e) => handleUpdatePageMeta(e.target.value, selectedPage.meta_description)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300"
                      placeholder="Page title for search engines"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      defaultValue={selectedPage.meta_description}
                      onBlur={(e) => handleUpdatePageMeta(selectedPage.meta_title, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none transition-colors duration-300 resize-none"
                      placeholder="Brief description for search engines"
                    />
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Content Sections</h2>
                  <button
                    onClick={handleAddSection}
                    className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Section</span>
                  </button>
                </div>

                {/* Section Form */}
                {(editingSection || isAddingSection) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
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
                          Section Type
                        </label>
                        <select
                          value={sectionForm.type}
                          onChange={(e) => setSectionForm({ ...sectionForm, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                        >
                          {sectionTypes.map((type) => (
                            <option key={type.type} value={type.type}>{type.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={sectionForm.title}
                          onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                          placeholder="Section title"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={sectionForm.content}
                          onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                          placeholder="Section content"
                        />
                      </div>

                      {(sectionForm.type === 'hero' || sectionForm.type === 'image_text' || sectionForm.type === 'gallery') && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                          </label>
                          <input
                            type="url"
                            value={sectionForm.image_url}
                            onChange={(e) => setSectionForm({ ...sectionForm, image_url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3 mt-4">
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
                <div className="space-y-4">
                  {selectedPage.content_data?.sections?.map((section: ContentSection, index: number) => (
                    <div key={section.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="bg-royal-blue text-white px-2 py-1 rounded text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900">{section.title || 'Untitled Section'}</span>
                          <span className="text-sm text-gray-500">({section.type})</span>
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
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {section.content || 'No content'}
                      </p>
                    </div>
                  ))}

                  {(!selectedPage.content_data?.sections || selectedPage.content_data.sections.length === 0) && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No content sections</h3>
                      <p className="text-gray-600">Add your first content section to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Page</h3>
              <p className="text-gray-600">Choose a page from the sidebar to start managing its content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageManager;