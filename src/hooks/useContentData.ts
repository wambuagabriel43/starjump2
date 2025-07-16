import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Debug logging function
const debugLog = (message: string, data?: any) => {
  console.log(`[ContentData] ${message}`, data || '');
};

// Global state manager for content updates
const contentUpdateListeners = new Map<string, Set<() => void>>();

export const notifyContentUpdate = (key: string) => {
  debugLog(`Notifying content update for key: ${key}`);
  const listeners = contentUpdateListeners.get(key);
  if (listeners) {
    debugLog(`Found ${listeners.size} listeners for key: ${key}`);
    listeners.forEach(listener => listener());
  } else {
    debugLog(`No listeners found for key: ${key}`);
  }
};

export const subscribeToContentUpdates = (key: string, callback: () => void) => {
  debugLog(`Subscribing to content updates for key: ${key}`);
  if (!contentUpdateListeners.has(key)) {
    contentUpdateListeners.set(key, new Set());
  }
  contentUpdateListeners.get(key)!.add(callback);
  
  return () => {
    debugLog(`Unsubscribing from content updates for key: ${key}`);
    const listeners = contentUpdateListeners.get(key);
    if (listeners) {
      listeners.delete(callback);
    }
  };
};

// Enhanced types for comprehensive content management
export interface PageContentBlock {
  id: string
  page_slug: string
  section_key: string
  content_type: string
  title?: string
  subtitle?: string
  content_text?: string
  image_url?: string
  video_url?: string
  button_text?: string
  button_link?: string
  order_position: number
  metadata: any
  active: boolean
  created_at: string
  updated_at: string
}

export interface ComponentContent {
  id: string
  component_name: string
  content_key: string
  content_type: string
  title?: string
  content_text?: string
  image_url?: string
  metadata: any
  active: boolean
  created_at: string
  updated_at: string
}

export interface UILabel {
  id: string
  category: string
  label_key: string
  label_text: string
  context?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface StaticEvent {
  id: string
  title: string
  description: string
  image_url: string
  date: string
  time?: string
  location: string
  category: string
  featured: boolean
  attendees?: string
  price_text: string
  button_primary_text: string
  button_primary_link: string
  button_secondary_text: string
  button_secondary_link: string
  active: boolean
  created_at: string
}

export interface SiteContent {
  id: string
  content_key: string
  content_type: string
  title?: string
  content_text?: string
  metadata: any
  active: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt?: string
  content_text: string
  author: string
  date: string
  read_time: string
  category: string
  image_url?: string
  featured: boolean
  tags: string[]
  active: boolean
  created_at: string
  updated_at: string
}

// Hook for page content blocks with enhanced error handling
export const usePageContent = (pageSlug: string, sectionKey?: string) => {
  const [content, setContent] = useState<PageContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchContent = async () => {
      debugLog(`Starting fetch for page: ${pageSlug}, section: ${sectionKey || 'all'}`);
      setLoading(true)
      setError(null)
      try {
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey || !supabase) {
          debugLog('Supabase not configured, using empty content');
          setContent([])
          setLoading(false)
          return
        }

        let query = supabase
          .from('page_sections')
          .select('*')
          .eq('page_id', pageSlug)
          .eq('active', true)
          .order('order_position', { ascending: true })

        if (sectionKey) {
          query = query.eq('section_key', sectionKey)
        }

        const { data, error } = await query

        if (error) {
          debugLog('Error fetching page content:', error);
          throw error
        }
        
        debugLog(`Successfully fetched ${data?.length || 0} content blocks for page: ${pageSlug}`, data);
        
        // Transform page_sections data to match PageContentBlock interface
        const transformedData = (data || []).map(item => ({
          id: item.id,
          page_slug: item.page_id,
          section_key: item.section_type,
          content_type: item.section_type,
          title: item.title,
          subtitle: item.subtitle,
          content_text: item.content_text,
          image_url: item.image_url,
          video_url: item.video_url,
          button_text: item.settings?.button_text,
          button_link: item.settings?.button_link,
          order_position: item.order_position,
          metadata: item.custom_data || {},
          active: item.active,
          created_at: item.created_at,
          updated_at: item.updated_at
        }))
        
        setContent(transformedData)
      } catch (err) {
        debugLog('Exception fetching page content:', err);
        setError(err instanceof Error ? err.message : 'An error occurred')
        setContent([])
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [pageSlug, sectionKey, refreshTrigger])

  // Subscribe to content updates
  useEffect(() => {
    const unsubscribe = subscribeToContentUpdates(`page_${pageSlug}`, () => {
      debugLog(`Content update notification received for page: ${pageSlug}`);
      setRefreshTrigger(prev => prev + 1)
    })
    
    return unsubscribe
  }, [pageSlug])

  const refetch = async () => {
    debugLog(`Manual refetch triggered for page: ${pageSlug}`);
    setRefreshTrigger(prev => prev + 1)
  }

  return { content, loading, error, refetch }
}

// Hook for component content
export const useComponentContent = (componentName: string, contentKey?: string) => {
  const [content, setContent] = useState<ComponentContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchContent = async () => {
      debugLog(`Starting fetch for component: ${componentName}, key: ${contentKey || 'all'}`);
      setLoading(true)
      setError(null)
      try {
        if (!supabase) {
          debugLog('Supabase not configured, using empty content');
          setContent([])
          setLoading(false)
          return
        }

        let query = supabase
          .from('component_content')
          .select('*')
          .eq('component_name', componentName)
          .eq('active', true)

        if (contentKey) {
          query = query.eq('content_key', contentKey)
        }

        const { data, error } = await query

        if (error) {
          debugLog('Error fetching component content:', error);
          throw error
        }
        
        debugLog(`Successfully fetched ${data?.length || 0} component content items for: ${componentName}`, data);
        setContent(data || [])
      } catch (err) {
        debugLog('Exception fetching component content:', err);
        setError(err instanceof Error ? err.message : 'An error occurred')
        setContent([])
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [componentName, contentKey, refreshTrigger])

  // Subscribe to content updates
  useEffect(() => {
    const unsubscribe = subscribeToContentUpdates(`component_${componentName}`, () => {
      debugLog(`Component content update notification received for: ${componentName}`);
      setRefreshTrigger(prev => prev + 1)
    })
    
    return unsubscribe
  }, [componentName])

  const refetch = async () => {
    debugLog(`Manual refetch triggered for component: ${componentName}`);
    setRefreshTrigger(prev => prev + 1)
  }

  return { content, loading, error, refetch }
}

// Hook for UI labels
export const useUILabels = (category?: string) => {
  const [labels, setLabels] = useState<UILabel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchLabels = async () => {
      debugLog(`Starting fetch for UI labels, category: ${category || 'all'}`);
      setLoading(true)
      setError(null)
      try {
        if (!supabase) {
          debugLog('Supabase not configured, using empty labels');
          setLabels([])
          setLoading(false)
          return
        }

        let query = supabase
          .from('ui_labels')
          .select('*')
          .eq('active', true)

        if (category) {
          query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) {
          debugLog('Error fetching UI labels:', error);
          throw error
        }
        
        debugLog(`Successfully fetched ${data?.length || 0} UI labels`, data);
        setLabels(data || [])
      } catch (err) {
        debugLog('Exception fetching UI labels:', err);
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLabels([])
      } finally {
        setLoading(false)
      }
    }

    fetchLabels()
  }, [category, refreshTrigger])

  // Subscribe to content updates
  useEffect(() => {
    const unsubscribe = subscribeToContentUpdates('ui_labels', () => {
      debugLog('UI labels update notification received');
      setRefreshTrigger(prev => prev + 1)
    })
    
    return unsubscribe
  }, [])

  const refetch = async () => {
    debugLog('Manual refetch triggered for UI labels');
    setRefreshTrigger(prev => prev + 1)
  }

  return { labels, loading, error, refetch }
}

// Hook for static events
export const useStaticEvents = () => {
  const [events, setEvents] = useState<StaticEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!supabase) {
          console.warn('Supabase not configured, using empty events')
          setEvents([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('static_events')
          .select('*')
          .eq('active', true)
          .order('date', { ascending: true })

        if (error) {
          console.error('Error fetching static events:', error)
          throw error
        }
        
        console.log(`Fetched ${data?.length || 0} static events`)
        setEvents(data || [])
      } catch (err) {
        console.error('Error fetching static events:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [refreshTrigger])

  // Subscribe to content updates
  useEffect(() => {
    const unsubscribe = subscribeToContentUpdates('static_events', () => {
      console.log('Static events update notification received')
      setRefreshTrigger(prev => prev + 1)
    })
    
    return unsubscribe
  }, [])

  const refetch = async () => {
    console.log('Manual refetch triggered for static events')
    setRefreshTrigger(prev => prev + 1)
  }

  return { events, loading, error, refetch }
}

// Hook for site content
export const useSiteContent = (contentKey?: string) => {
  const [content, setContent] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!supabase) {
          console.warn('Supabase not configured, using empty site content')
          setContent([])
          setLoading(false)
          return
        }

        let query = supabase
          .from('site_content')
          .select('*')
          .eq('active', true)

        if (contentKey) {
          query = query.eq('content_key', contentKey)
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching site content:', error)
          throw error
        }
        
        console.log(`Fetched ${data?.length || 0} site content items`)
        setContent(data || [])
      } catch (err) {
        console.error('Error fetching site content:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setContent([])
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [contentKey, refreshTrigger])

  // Subscribe to content updates
  useEffect(() => {
    const unsubscribe = subscribeToContentUpdates('site_content', () => {
      console.log('Site content update notification received')
      setRefreshTrigger(prev => prev + 1)
    })
    
    return unsubscribe
  }, [])

  const refetch = async () => {
    console.log('Manual refetch triggered for site content')
    setRefreshTrigger(prev => prev + 1)
  }

  return { content, loading, error, refetch }
}

// Hook for blog posts
export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!supabase) {
          console.warn('Supabase not configured, using empty blog posts')
          setPosts([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('active', true)
          .order('date', { ascending: false })

        if (error) {
          console.error('Error fetching blog posts:', error)
          throw error
        }
        
        console.log(`Fetched ${data?.length || 0} blog posts`)
        setPosts(data || [])
      } catch (err) {
        console.error('Error fetching blog posts:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [refreshTrigger])

  // Subscribe to content updates
  useEffect(() => {
    const unsubscribe = subscribeToContentUpdates('blog_posts', () => {
      console.log('Blog posts update notification received')
      setRefreshTrigger(prev => prev + 1)
    })
    
    return unsubscribe
  }, [])

  const refetch = async () => {
    console.log('Manual refetch triggered for blog posts')
    setRefreshTrigger(prev => prev + 1)
  }

  return { posts, loading, error, refetch }
}

// Utility functions
export const getContentByKey = (content: SiteContent[], key: string): string => {
  const item = content.find(c => c.content_key === key)
  return item?.content_text || ''
}

export const getPageContentBySection = (content: PageContentBlock[], sectionKey: string): PageContentBlock | null => {
  return content.find(c => c.section_key === sectionKey) || null
}

export const getComponentContentByKey = (content: ComponentContent[], key: string): string => {
  const item = content.find(c => c.content_key === key)
  return item?.content_text || ''
}

export const getUILabel = (labels: UILabel[], key: string): string => {
  const label = labels.find(l => l.label_key === key)
  return label?.label_text || key
}

// Utility function to render content based on type
export const renderContentByType = (content: PageContentBlock | any) => {
  if (!content) return {}
  
  switch (content.content_type) {
    case 'hero_section':
      return {
        title: content.title,
        subtitle: content.subtitle,
        description: content.content_text,
        buttons: content.metadata?.buttons || []
      }
    case 'text_with_image':
      return {
        title: content.title,
        content: content.content_text,
        image_url: content.metadata?.image_url || content.image_url,
        layout: content.metadata?.layout || 'left-image'
      }
    case 'values_grid':
      return {
        title: content.title,
        subtitle: content.subtitle,
        values: content.metadata?.values || []
      }
    case 'team_grid':
      return {
        title: content.title,
        subtitle: content.subtitle,
        members: content.metadata?.members || []
      }
    case 'services_grid':
      return {
        title: content.title,
        subtitle: content.subtitle,
        services: content.metadata?.services || []
      }
    case 'contact_info_cards':
      return {
        title: content.title,
        cards: content.metadata?.cards || []
      }
    case 'locations_grid':
      return {
        title: content.title,
        subtitle: content.subtitle,
        locations: content.metadata?.locations || []
      }
    case 'cta_section':
      return {
        title: content.title,
        description: content.content_text,
        buttons: content.metadata?.buttons || []
      }
    case 'features_section':
      return {
        title: content.title,
        subtitle: content.subtitle,
        features: content.metadata?.features || []
      }
    case 'client_types_grid':
      return {
        title: content.title,
        subtitle: content.subtitle,
        client_types: content.metadata?.client_types || []
      }
    case 'business_hours_section':
      return {
        title: content.title,
        hours: content.metadata?.hours || []
      }
    case 'legal_section':
      return {
        title: content.title,
        content: content.content_text,
        types: content.metadata?.types || [],
        cancellation_policy: content.metadata?.cancellation_policy || []
      }
    case 'help_section':
      return {
        title: content.title,
        steps: content.metadata?.steps || []
      }
    default:
      return {
        title: content.title,
        subtitle: content.subtitle,
        content: content.content_text,
        metadata: content.metadata || {}
      }
  }
}