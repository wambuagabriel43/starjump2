import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText, Eye, Image, Type, Layout, MessageSquare } from 'lucide-react';

interface ContentSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  order_position: number;
  active: boolean;
  metadata?: any;
}

interface PageContent {
  [pageSlug: string]: ContentSection[];
}

const ContentManager: React.FC = () => {
  // Initialize with some default content structure
  const [pageContent, setPageContent] = useState<PageContent>({
    home: [
      {
        id: 'home_hero',
        type: 'hero',
        title: 'Welcome to Star Jump Kenya',
        subtitle: 'Kenya\'s Premier Children\'s Entertainment',
        content: 'Bringing joy and excitement to every celebration across Kenya with our premium play equipment and professional services.',
        order_position: 1,
        active: true
      },
      {
        id: 'home_features',
        type: 'features',
        title: 'Why Choose Star Jump?',
        content: 'Safety certified equipment, professional setup, and unforgettable experiences for children across Kenya.',
        order_position: 2,
        active: true
      }
    ],
    about: [
      {
        id: 'about_hero',
        type: 'hero',
        title: 'About Star Jump',
        content: 'Kenya\'s premier provider of fun stations and children\'s play areas, bringing joy and excitement to every celebration since 2018.',
        order_position: 1,
        active: true
      },
      {
        id: 'about_story',
        type: 'text_with_image',
        title: 'Our Story',
        content: 'Star Jump was born from a simple belief: every child deserves to experience pure joy and wonder. Founded in Nairobi in 2018, we started with a single bouncy castle and a dream to make celebrations unforgettable.',
        image_url: 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
        order_position: 2,
        active: true
      }
    ],
    corporate: [
      {
        id: 'corporate_hero',
        type: 'hero',
        title: 'Corporate Solutions',
        content: 'Transform your institution with premium play solutions. From permanent installations to event rentals, we create engaging experiences for your community.',
        order_position: 1,
        active: true
      }
    ],
    events: [
      {
        id: 'events_hero',
        type: 'hero',
        title: 'Upcoming Events',
        content: 'Join us at exciting events across Kenya! From festivals to corporate gatherings, experience the magic of Star Jump.',
        order_position: 1,
        active: true
      }
    ],
    shop: [
      {
        id: 'shop_hero',
        type: 'hero',
        title: 'Fun Shop',
        content: 'Discover our premium collection of play equipment and accessories. Quality guaranteed, fun delivered across Kenya!',
        order_position: 1,
        active: true
      }
    ],
    blog: [
      {
        id: 'blog_hero',
        type: 'hero',
        title: 'Star Jump Blog',
        content: 'Insights, tips, and stories from Kenya\'s leading children\'s entertainment experts',
        order_position: 1,
        active: true
      }
    ],
    contact: [
      {
        id: 'contact_hero',
        type: 'hero',
        title: 'Contact Us',
        content: 'Get in touch with Kenya\'s premier children\'s entertainment experts. We\'re here to make your event magical!',
        order_position: 1,
        active: true
      }
    ],
    booking: [
      {
        id: 'booking_hero',
        type: 'hero',
        title: 'Book Your Fun Space',
        content: 'Fill out the form below and we\'ll get back to you with availability and pricing in KES!',
        order_position: 1,
        active: true
      }
    ]
  });

  const [selectedPage, setSelectedPage] = useState('home');
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [sectionForm, setSectionForm] = useState({
    type: 'text',
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    button_text: '',
    button_link: '',
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
    setSectionForm({
      type: 'text',
      title: '',
      subtitle: '',
      content: '',
      image_url: '',
      button_text: '',
      button_link: '',
      active: true
    });
  };

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section);
    setIsAddingSection(false);
    setSectionForm({
      type: section.type,
      title: section.title,
      subtitle: section.subtitle || '',
      content: section.content,
      image_url: section.image_url || '',
      button_text: section.button_text || '',
      button_link: section.button_link || '',
      active: section.active
    });
  };

  const handleSaveSection = async () => {
    setIsSaving(true);
    
    try {
      const sections = pageContent[selectedPage] || [];
      const newSection: ContentSection = {
        id: editingSection?.id || `${selectedPage}_${Date.now()}`,
        type: sectionForm.type,
        title: sectionForm.title,
        subtitle: sectionForm.subtitle,
        content: sectionForm.content,
        image_url: sectionForm.image_url,
        button_text: sectionForm.button_text,
        button_link: sectionForm.button_link,
        order_position: editingSection?.order_position || sections.length + 1,
        active: sectionForm.active,
        metadata: {}
      };

      let updatedSections;
      if (editingSection) {
        updatedSections = sections.map(s => 
          s.id === editingSection.id ? newSection : s
        );
      } else {
        updatedSections = [...sections, newSection];
      }

      setPageContent(prev => ({
        ...prev,
        [selectedPage]: updatedSections
      }));

      // Save to localStorage for persistence
      localStorage.setItem('starjump_page_content', JSON.stringify({
        ...pageContent,
        [selectedPage]: updatedSections
      }));

      alert('Section saved successfully!');
      handleCancelSection();
    } catch (err) {
      alert('Error saving section: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    const sections = pageContent[selectedPage] || [];
    const updatedSections = sections.filter(s => s.id !== sectionId);

    setPageContent(prev => ({
      ...prev,
      [selectedPage]: updatedSections
    }));

    // Save to localStorage
    localStorage.setItem('starjump_page_content', JSON.stringify({
      ...pageContent,
      [selectedPage]: updatedSections
    }));

    alert('Section deleted successfully!');
  };

  const handleCancelSection = () => {
    setEditingSection(null);
    setIsAddingSection(false);
    setSectionForm({
      type: 'text',
      title: '',
      subtitle: '',
      content: '',
      image_url: '',
      button_text: '',
      button_link: '',
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

  // Load from localStorage on component mount
  React.useEffect(() => {
    const saved = localStorage.getItem('starjump_page_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPageContent(parsed);
      } catch (err) {
        console.error('Error loading saved content:', err);
      }
    }
  }, []);

  const currentSections = pageContent[selectedPage] || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
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
                    Manage content sections for this page
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

                  {(sectionForm.type === 'cta' || sectionForm.type === 'hero') && (
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
              
              <div className="space-y-4">
                {currentSections.map((section, index) => {
                  const TypeIcon = getTypeIcon(section.type);
                  return (
                    <div key={section.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="bg-royal-blue text-white px-2 py-1 rounded text-xs font-bold">
                            {index + 1}
                          </span>
                          <TypeIcon className="h-4 w-4 text-royal-blue" />
                          <span className="font-medium text-gray-900">{section.title || 'Untitled Section'}</span>
                          <span className="text-sm text-gray-500">({section.type})</span>
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
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {section.content || 'No content'}
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

                {currentSections.length === 0 && (
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

export default ContentManager;