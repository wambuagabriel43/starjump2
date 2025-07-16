import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Add a global state manager for content updates
const contentUpdateListeners = new Map<string, Set<() => void>>();

export const notifyContentUpdate = (key: string) => {
  const listeners = contentUpdateListeners.get(key);
  if (listeners) {
    listeners.forEach(listener => listener());
  }
};

export const subscribeToContentUpdates = (key: string, callback: () => void) => {
  if (!contentUpdateListeners.has(key)) {
    contentUpdateListeners.set(key, new Set());
  }
  contentUpdateListeners.get(key)!.add(callback);
  
  return () => {
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
      setLoading(true)
      setError(null)
      try {
        // Check if Supabase is configured
        if (!supabase) {
          console.warn('Supabase not configured, using empty content')
          setContent([])
          setLoading(false)
          return
        }

        let query = supabase
          .from('page_content_blocks')
          .select('*')
          .eq('page_slug', pageSlug)
          .eq('active', true)
          .order('order_position', { ascending: true })

        if (sectionKey) {
          query = query.eq('section_key', sectionKey)
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching page content:', error)
          throw error
        }
        
        console.log(`Fetched ${data?.length || 0} content blocks for page: ${pageSlug}`)
        setContent(data || [])
      } catch (err) {
        console.error('Error fetching page content:', err)
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
      console.log(`Content update notification received for page: ${pageSlug}`)
      setRefreshTrigger(prev => prev + 1)
    })
    
    return unsubscribe
  }, [pageSlug])

  const refetch = async () => {
    console.log(`Manual refetch triggered for page: ${pageSlug}`)
    setLoading(true)
    setError(null)
    try {
      if (!supabase) {
        console.warn('Supabase not configured, using empty content')
        setContent([])
        setLoading(false)
        return
      }

      let query = supabase
        .from('page_content_blocks')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('active', true)
        .order('order_position', { ascending: true })

      if (sectionKey) {
        query = query.eq('section_key', sectionKey)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error refetching page content:', error)
        throw error
      }
      
      console.log(`Refetched ${data?.length || 0} content blocks for page: ${pageSlug}`)
      setContent(data || [])
    } catch (err) {
      console.error('Error refetching page content:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setContent([])
    } finally {
      setLoading(false)
    }
  }

  return { content, loading, error, refetch }
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
        console.error('Error refetching static events:', error)
        throw error
      }
      
      console.log(`Refetched ${data?.length || 0} static events`)
      setEvents(data || [])
    } catch (err) {
      console.error('Error refetching static events:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setEvents([])
    } finally {
      setLoading(false)
    }
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
        console.error('Error refetching site content:', error)
        throw error
      }
      
      console.log(`Refetched ${data?.length || 0} site content items`)
      setContent(data || [])
    } catch (err) {
      console.error('Error refetching site content:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setContent([])
    } finally {
      setLoading(false)
    }
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
        console.error('Error refetching blog posts:', error)
        throw error
      }
      
      console.log(`Refetched ${data?.length || 0} blog posts`)
      setPosts(data || [])
    } catch (err) {
      console.error('Error refetching blog posts:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  return { posts, loading, error, refetch }
}

// Utility function to get single content item
export const getContentByKey = (content: SiteContent[], key: string): string => {
  const item = content.find(c => c.content_key === key)
  return item?.content_text || ''
}

// Utility function to get page content by section
export const getPageContentBySection = (content: PageContentBlock[], sectionKey: string): PageContentBlock | null => {
  return content.find(c => c.section_key === sectionKey) || null
}

// Utility function to render content based on type
export const renderContentByType = (content: PageContentBlock) => {
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
        image_url: content.metadata?.image_url,
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
    case 'contact_info':
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
    default:
      return {
        title: content.title,
        subtitle: content.subtitle,
        content: content.content_text
      }
  }
}