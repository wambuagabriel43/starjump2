import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText, Eye, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { 
  usePageContent, 
  useSiteContent, 
  useStaticEvents, 
  useBlogPosts, 
  useComponentContent,
  useUILabels,
  renderContentByType, 
  notifyContentUpdate 
} from '../../hooks/useContentData';
import type { 
  PageContentBlock, 
  SiteContent, 
  StaticEvent, 
  BlogPost,
  ComponentContent,
  UILabel
} from '../../hooks/useContentData';

const ContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pages' | 'components' | 'ui_labels' | 'site' | 'events' | 'blog'>('pages');
  const [selectedPage, setSelectedPage] = useState('home');
  const [selectedComponent, setSelectedComponent] = useState('header');
  
  // Data hooks
  const { content: pageContent, loading: pageLoading, refetch: refetchPage } = usePageContent(selectedPage);
  const { content: componentContent, loading: componentLoading, refetch: refetchComponent } = useComponentContent(selectedComponent);
  const { labels: uiLabels, loading: labelsLoading, refetch: refetchLabels } = useUILabels();
  const { content: siteContent, loading: siteLoading, refetch: refetchSite } = useSiteContent();
  const { events: staticEvents, loading: eventsLoading, refetch: refetchEvents } = useStaticEvents();
  const { posts: blogPosts, loading: blogLoading, refetch: refetchBlog } = useBlogPosts();

  // Form states
  const [editingContent, setEditingContent] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const pages = [
    { slug: 'home', name: 'Home Page' },
    { slug: 'about', name: 'About Us' },
    { slug: 'corporate', name: 'Corporate' },
    { slug: 'events', name: 'Events' },
    { slug: 'booking', name: 'Booking' },
    { slug: 'shop', name: 'Shop' },
    { slug: 'blog', name: 'Blog' },
    { slug: 'contact', name: 'Contact' },
    { slug: 'privacy-policy', name: 'Privacy Policy' },
    { slug: 'terms-conditions', name: 'Terms & Conditions' }
  ];

  const components = [
    { name: 'header', label: 'Header' },
    { name: 'footer', label: 'Footer' },
    { name: 'navigation', label: 'Navigation' }
  ];

  const labelCategories = [
    { key: 'buttons', label: 'Buttons' },
    { key: 'forms', label: 'Form Labels' },
    { key: 'messages', label: 'Messages' },
    { key: 'navigation', label: 'Navigation' }
  ];

  const contentTypes = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'hero_section', label: 'Hero Section' },
    { value: 'section_header', label: 'Section Header' },
    { value: 'text', label: 'Text Content' },
    { value: 'text_with_image', label: 'Text with Image' },
    { value: 'mission_vision', label: 'Mission/Vision' },
    { value: 'values_grid', label: 'Values Grid' },
    { value: 'team_grid', label: 'Team Grid' },
    { value: 'services_grid', label: 'Services Grid' },
    { value: 'client_types', label: 'Client Types' },
    { value: 'contact_info', label: 'Contact Info Cards' },
    { value: 'contact_form', label: 'Contact Form' },
    { value: 'locations_grid', label: 'Locations Grid' },
    { value: 'business_hours', label: 'Business Hours' },
    { value: 'features_section', label: 'Features Section' },
    { value: 'newsletter_section', label: 'Newsletter Section' },
    { value: 'form_section', label: 'Form Section' },
    { value: 'help_section', label: 'Help Section' },
    { value: 'success_section', label: 'Success Section' },
    { value: 'legal_section', label: 'Legal Section' },
    { value: 'contact_info_cards', label: 'Contact Info Cards' },
    { value: 'business_hours_section', label: 'Business Hours' },
    { value: 'client_types_grid', label: 'Client Types Grid' },
    { value: 'cta', label: 'Call to Action' },
    { value: 'cta_section', label: 'CTA Section' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' }
  ];

  const handleSavePageContent = async () => {
    console.log('[ContentManager] Starting to save page content:', formData);
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('page_content_blocks')
          .insert([{
            ...formData,
            page_slug: selectedPage
          }]);
        
        if (error) throw error;
        console.log('[ContentManager] Page content added successfully');
        alert('Content added successfully!');
      } else if (editingContent) {
        const { error } = await supabase
          .from('page_content_blocks')
          .update(formData)
          .eq('id', editingContent.id);
        
        if (error) throw error;
        console.log('[ContentManager] Page content updated successfully');
        alert('Content updated successfully!');
      }
      
      handleCancel();
      refetchPage();
      
      // Notify all components using this page's content to refresh
      console.log('[ContentManager] Notifying content update for page:', selectedPage);
      notifyContentUpdate(`page_${selectedPage}`);
      
    } catch (err) {
      console.error('[ContentManager] Error saving page content:', err);
      alert('Error saving content: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveComponentContent = async () => {
    console.log('[ContentManager] Starting to save component content:', formData);
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('component_content')
          .insert([{
            ...formData,
            component_name: selectedComponent
          }]);
        
        if (error) throw error;
        console.log('[ContentManager] Component content added successfully');
        alert('Component content added successfully!');
      } else if (editingContent) {
        const { error } = await supabase
          .from('component_content')
          .update(formData)
          .eq('id', editingContent.id);
        
        if (error) throw error;
        console.log('[ContentManager] Component content updated successfully');
        alert('Component content updated successfully!');
      }
      
      handleCancel();
      refetchComponent();
      
      // Notify all components using this component's content to refresh
      console.log('[ContentManager] Notifying content update for component:', selectedComponent);
      notifyContentUpdate(`component_${selectedComponent}`);
      
    } catch (err) {
      console.error('[ContentManager] Error saving component content:', err);
      alert('Error saving content: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveUILabel = async () => {
    console.log('[ContentManager] Starting to save UI label:', formData);
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('ui_labels')
          .insert([formData]);
        
        if (error) throw error;
        console.log('[ContentManager] UI label added successfully');
        alert('UI label added successfully!');
      } else if (editingContent) {
        const { error } = await supabase
          .from('ui_labels')
          .update(formData)
          .eq('id', editingContent.id);
        
        if (error) throw error;
        console.log('[ContentManager] UI label updated successfully');
        alert('UI label updated successfully!');
      }
      
      handleCancel();
      refetchLabels();
      
      // Notify all components using UI labels to refresh
      console.log('[ContentManager] Notifying content update for UI labels');
      notifyContentUpdate('ui_labels');
      
    } catch (err) {
      console.error('[ContentManager] Error saving UI label:', err);
      alert('Error saving UI label: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSiteContent = async () => {
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('site_content')
          .insert([formData]);
        
        if (error) throw error;
        console.log('Site content added successfully');
        alert('Site content added successfully!');
      } else if (editingContent) {
        const { error } = await supabase
          .from('site_content')
          .update(formData)
          .eq('id', editingContent.id);
        
        if (error) throw error;
        console.log('Site content updated successfully');
        alert('Site content updated successfully!');
      }
      
      handleCancel();
      refetchSite();
      
      // Notify all components using site content to refresh
      notifyContentUpdate('site_content');
      
      console.log('[ContentManager] Site content saved and notification sent');
    } catch (err) {
      console.error('Error saving site content:', err);
      alert('Error saving site content: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEvent = async () => {
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('static_events')
          .insert([formData]);
        
        if (error) throw error;
        console.log('Event added successfully');
        alert('Event added successfully!');
      } else if (editingContent) {
        const { error } = await supabase
          .from('static_events')
          .update(formData)
          .eq('id', editingContent.id);
        
        if (error) throw error;
        console.log('Event updated successfully');
        alert('Event updated successfully!');
      }
      
      handleCancel();
      refetchEvents();
      
      // Notify all components using static events to refresh
      notifyContentUpdate('static_events');
      
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Error saving event: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBlogPost = async () => {
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('blog_posts')
          .insert([formData]);
        
        if (error) throw error;
        console.log('Blog post added successfully');
        alert('Blog post added successfully!');
      } else if (editingContent) {
        const { error } = await supabase
          .from('blog_posts')
          .update(formData)
          .eq('id', editingContent.id);
        
        if (error) throw error;
        console.log('Blog post updated successfully');
        alert('Blog post updated successfully!');
      }
      
      handleCancel();
      refetchBlog();
      
      // Notify all components using blog posts to refresh
      notifyContentUpdate('blog_posts');
      
    } catch (err) {
      console.error('Error saving blog post:', err);
      alert('Error saving blog post: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (table: string, id: string, refetchFn: () => void) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      console.log(`Item deleted from ${table} successfully`);
      alert('Item deleted successfully!');
      refetchFn();
      
      // Notify components to refresh based on table
      if (table === 'page_content_blocks') {
        notifyContentUpdate(`page_${selectedPage}`);
      } else if (table === 'component_content') {
        notifyContentUpdate(`component_${selectedComponent}`);
      } else if (table === 'ui_labels') {
        notifyContentUpdate('ui_labels');
      } else if (table === 'site_content') {
        notifyContentUpdate('site_content');
      } else if (table === 'static_events') {
        notifyContentUpdate('static_events');
      } else if (table === 'blog_posts') {
        notifyContentUpdate('blog_posts');
      }
      
    } catch (err) {
      console.error(`Error deleting from ${table}:`, err);
      alert('Error deleting item: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleEdit = (item: any) => {
    setEditingContent(item);
    setFormData(item);
    setIsAddingNew(false);
  };

  const handleAddNew = (type: string) => {
    setIsAddingNew(true);
    setEditingContent(null);
    
    if (type === 'page') {
      setFormData({
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
    } else if (type === 'component') {
      setFormData({
        content_key: '',
        content_type: 'text',
        title: '',
        content_text: '',
        metadata: {},
        active: true
      });
    } else if (type === 'ui_label') {
      setFormData({
        category: 'buttons',
        label_key: '',
        label_text: '',
        context: '',
        active: true
      });
    } else if (type === 'site') {
      setFormData({
        content_key: '',
        content_type: 'text',
        title: '',
        content_text: '',
        metadata: {},
        active: true
      });
    } else if (type === 'event') {
      setFormData({
        title: '',
        description: '',
        image_url: '',
        date: '',
        time: '',
        location: '',
        category: 'General',
        featured: false,
        attendees: '',
        price_text: 'Free',
        button_primary_text: 'Learn More',
        button_primary_link: '#',
        button_secondary_text: 'Register',
        button_secondary_link: '#',
        active: true
      });
    } else if (type === 'blog') {
      setFormData({
        title: '',
        excerpt: '',
        content_text: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        read_time: '5 min read',
        category: 'General',
        image_url: '',
        featured: false,
        tags: [],
        active: true
      });
    }
  };

  const handleCancel = () => {
    setEditingContent(null);
    setIsAddingNew(false);
    setFormData({});
  };

  const renderPageContent = () => (
    <div className="space-y-6">
      {/* Page Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Page</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pages.map((page) => (
            <button
              key={page.slug}
              onClick={() => setSelectedPage(page.slug)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                selectedPage === page.slug
                  ? 'bg-royal-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {pages.find(p => p.slug === selectedPage)?.name} Content
          </h3>
          <button
            onClick={() => handleAddNew('page')}
            className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Content Block</span>
          </button>
        </div>

        <div className="space-y-4">
          {pageContent.map((content) => (
            <div key={content.id} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-royal-blue text-white px-2 py-1 rounded text-xs font-bold">
                    {content.content_type}
                  </span>
                  <span className="font-medium text-gray-900">
                    {content.section_key} - {content.title || 'No Title'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Order: {content.order_position}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(content)}
                    className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200 transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('page_content_blocks', content.id, refetchPage)}
                    className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {content.content_text || 'No content'}
              </p>
              {content.metadata && Object.keys(content.metadata).length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Metadata: {Object.keys(content.metadata).join(', ')}
                </div>
              )}
            </div>
          ))}
          
          {pageContent.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content blocks</h3>
              <p className="text-gray-600">Add your first content block to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderComponentContent = () => (
    <div className="space-y-6">
      {/* Component Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Component</h3>
        <div className="grid grid-cols-3 gap-3">
          {components.map((component) => (
            <button
              key={component.name}
              onClick={() => setSelectedComponent(component.name)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                selectedComponent === component.name
                  ? 'bg-royal-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {component.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {components.find(c => c.name === selectedComponent)?.label} Content
          </h3>
          <button
            onClick={() => handleAddNew('component')}
            className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Content</span>
          </button>
        </div>

        <div className="space-y-4">
          {componentContent.map((content) => (
            <div key={content.id} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {content.content_type}
                  </span>
                  <span className="font-medium text-gray-900">
                    {content.content_key} - {content.title || 'No Title'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(content)}
                    className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200 transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('component_content', content.id, refetchComponent)}
                    className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {content.content_text || 'No content'}
              </p>
            </div>
          ))}
          
          {componentContent.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No component content</h3>
              <p className="text-gray-600">Add your first content item to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUILabels = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">UI Labels & Text</h3>
          <button
            onClick={() => handleAddNew('ui_label')}
            className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Label</span>
          </button>
        </div>

        {/* Group by category */}
        {labelCategories.map((category) => {
          const categoryLabels = uiLabels.filter(label => label.category === category.key);
          if (categoryLabels.length === 0) return null;
          
          return (
            <div key={category.key} className="mb-8">
              <h4 className="text-md font-semibold text-gray-800 mb-4">{category.label}</h4>
              <div className="space-y-2">
                {categoryLabels.map((label) => (
                  <div key={label.id} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{label.label_key}</span>
                          {label.context && (
                            <span className="text-xs text-gray-500">({label.context})</span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm">{label.label_text}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(label)}
                          className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200 transition-colors duration-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('ui_labels', label.id, refetchLabels)}
                          className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 transition-colors duration-300"
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
        })}
      </div>
    </div>
  );

  const renderSiteContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Global Site Content</h3>
          <button
            onClick={() => handleAddNew('site')}
            className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Site Content</span>
          </button>
        </div>

        <div className="space-y-4">
          {siteContent.map((content) => (
            <div key={content.id} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {content.content_type}
                  </span>
                  <span className="font-medium text-gray-900">{content.content_key}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(content)}
                    className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200 transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('site_content', content.id, refetchSite)}
                    className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {content.content_text || 'No content'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Static Events</h3>
          <button
            onClick={() => handleAddNew('event')}
            className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
        </div>

        <div className="grid gap-4">
          {staticEvents.map((event) => (
            <div key={event.id} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    {event.featured && (
                      <span className="bg-star-yellow text-royal-blue px-2 py-1 rounded text-xs font-bold">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  <div className="text-xs text-gray-500">
                    {event.date} • {event.location} • {event.category}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200 transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('static_events', event.id, refetchEvents)}
                    className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBlogPosts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Blog Posts</h3>
          <button
            onClick={() => handleAddNew('blog')}
            className="bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Blog Post</span>
          </button>
        </div>

        <div className="grid gap-4">
          {blogPosts.map((post) => (
            <div key={post.id} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{post.title}</h4>
                    {post.featured && (
                      <span className="bg-star-yellow text-royal-blue px-2 py-1 rounded text-xs font-bold">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                  <div className="text-xs text-gray-500">
                    By {post.author} • {new Date(post.date).toLocaleDateString()} • {post.category}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200 transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('blog_posts', post.id, refetchBlog)}
                    className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200 transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditForm = () => {
    if (!editingContent && !isAddingNew) return null;

    const getSaveHandler = () => {
      switch (activeTab) {
        case 'pages': return handleSavePageContent;
        case 'components': return handleSaveComponentContent;
        case 'ui_labels': return handleSaveUILabel;
        case 'site': return handleSaveSiteContent;
        case 'events': return handleSaveEvent;
        case 'blog': return handleSaveBlogPost;
        default: return () => {};
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {isAddingNew ? 'Add New' : 'Edit'} {activeTab === 'pages' ? 'Page Content' : activeTab === 'components' ? 'Component Content' : activeTab === 'ui_labels' ? 'UI Label' : activeTab === 'site' ? 'Site Content' : activeTab === 'events' ? 'Event' : 'Blog Post'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {activeTab === 'pages' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Key</label>
                  <input
                    type="text"
                    value={formData.section_key || ''}
                    onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    placeholder="e.g., hero, featured_section"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select
                    value={formData.content_type || 'text'}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                  >
                    {contentTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Text</label>
                  <textarea
                    value={formData.content_text || ''}
                    onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                    placeholder="Enter the main content text. Use \n\n for paragraph breaks."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Position</label>
                    <input
                      type="number"
                      value={formData.order_position || 0}
                      onChange={(e) => setFormData({ ...formData, order_position: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="page-active"
                      checked={formData.active !== false}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                    />
                    <label htmlFor="page-active" className="ml-2 block text-sm text-gray-900">
                      Active (visible on website)
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metadata (JSON) - For complex content like team members, values, etc.
                  </label>
                  <textarea
                    value={typeof formData.metadata === 'object' ? JSON.stringify(formData.metadata, null, 2) : formData.metadata || '{}'}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setFormData({ ...formData, metadata: parsed });
                      } catch {
                        setFormData({ ...formData, metadata: e.target.value });
                      }
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none font-mono text-sm"
                    placeholder='{"buttons": [{"text": "Click Me", "link": "/page"}]}'
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use JSON format for complex data like buttons, team members, values, etc.
                  </p>
                </div>
                {formData.content_type === 'cta' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                      <input
                        type="text"
                        value={formData.button_text || ''}
                        onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                      <input
                        type="text"
                        value={formData.button_link || ''}
                        onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'components' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Key</label>
                  <input
                    type="text"
                    value={formData.content_key || ''}
                    onChange={(e) => setFormData({ ...formData, content_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    placeholder="e.g., logo_text, company_description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Text</label>
                  <textarea
                    value={formData.content_text || ''}
                    onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                  />
                </div>
              </>
            )}

            {activeTab === 'ui_labels' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category || 'buttons'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                  >
                    {labelCategories.map((category) => (
                      <option key={category.key} value={category.key}>{category.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Label Key</label>
                  <input
                    type="text"
                    value={formData.label_key || ''}
                    onChange={(e) => setFormData({ ...formData, label_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    placeholder="e.g., book_now, contact_us"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Label Text</label>
                  <input
                    type="text"
                    value={formData.label_text || ''}
                    onChange={(e) => setFormData({ ...formData, label_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    placeholder="e.g., Book Now, Contact Us"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
                  <input
                    type="text"
                    value={formData.context || ''}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    placeholder="e.g., Main navigation, CTA buttons"
                  />
                </div>
              </>
            )}

            {activeTab === 'site' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Key</label>
                  <input
                    type="text"
                    value={formData.content_key || ''}
                    onChange={(e) => setFormData({ ...formData, content_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    placeholder="e.g., company_description, contact_phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Text</label>
                  <textarea
                    value={formData.content_text || ''}
                    onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                  />
                </div>
              </>
            )}

            {activeTab === 'events' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="text"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      placeholder="December 15-17, 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="text"
                      value={formData.time || ''}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                      placeholder="10:00 AM - 6:00 PM"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
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
              </>
            )}

            {activeTab === 'blog' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={formData.content_text || ''}
                    onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="blog-featured"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                  />
                  <label htmlFor="blog-featured" className="ml-2 block text-sm text-gray-900">
                    Featured Post
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex space-x-3">
            <button
              onClick={getSaveHandler()}
              disabled={isSaving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
        <p className="text-gray-600 mt-2">Manage all website content from one place</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'pages', label: 'Page Content', icon: FileText },
              { key: 'components', label: 'Components', icon: Eye },
              { key: 'ui_labels', label: 'UI Labels', icon: FileText },
              { key: 'site', label: 'Site Content', icon: Eye },
              { key: 'events', label: 'Events', icon: Calendar },
              { key: 'blog', label: 'Blog Posts', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                    activeTab === tab.key
                      ? 'border-royal-blue text-royal-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pages' && renderPageContent()}
          {activeTab === 'components' && renderComponentContent()}
          {activeTab === 'ui_labels' && renderUILabels()}
          {activeTab === 'site' && renderSiteContent()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'blog' && renderBlogPosts()}
        </div>
      </div>

      {renderEditForm()}
    </div>
  );
};

export default ContentManager;