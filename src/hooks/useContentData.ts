import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Types for content data
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

// Hook for component-specific content
export const useComponentContent = (componentName: string) => {
  const [content, setContent] = useState<ComponentContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey || !supabase) {
          console.warn(`Supabase not configured for component ${componentName}, using empty content`)
          setContent([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('component_content')
          .select('*')
          .eq('component_name', componentName)
          .eq('active', true)
          .order('created_at', { ascending: true })

        if (error) {
          console.error(`Error fetching component content for ${componentName}:`, error)
          throw error
        }
        
        setContent(data || [])
      } catch (err) {
        console.error(`Exception fetching component content for ${componentName}:`, err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setContent([])
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [componentName])

  return { content, loading, error }
}

// Hook for UI labels
export const useUILabels = () => {
  const [labels, setLabels] = useState<UILabel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLabels = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey || !supabase) {
          console.warn('Supabase not configured for UI labels, using empty labels')
          setLabels([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('ui_labels')
          .select('*')
          .eq('active', true)
          .order('category', { ascending: true })

        if (error) {
          console.error('Error fetching UI labels:', error)
          throw error
        }
        
        setLabels(data || [])
      } catch (err) {
        console.error('Exception fetching UI labels:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLabels([])
      } finally {
        setLoading(false)
      }
    }

    fetchLabels()
  }, [])

  return { labels, loading, error }
}

// Hook for site content
export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey || !supabase) {
          console.warn('Supabase not configured for site content, using empty content')
          setContent([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error fetching site content:', error)
          throw error
        }
        
        setContent(data || [])
      } catch (err) {
        console.error('Exception fetching site content:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setContent([])
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  return { content, loading, error }
}

// Hook for blog posts
export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey || !supabase) {
          console.warn('Supabase not configured for blog posts, using dummy data')
          setPosts(getDummyBlogPosts())
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
          // Fall back to dummy data if database query fails
          setPosts(getDummyBlogPosts())
        } else {
          setPosts(data || getDummyBlogPosts())
        }
      } catch (err) {
        console.error('Exception fetching blog posts:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setPosts(getDummyBlogPosts())
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return { posts, loading, error }
}

// Helper function to get component content by key
export const getComponentContentByKey = (content: ComponentContent[], key: string): string | null => {
  const item = content.find(c => c.content_key === key)
  return item?.content_text || null
}

// Helper function to get UI label by key
export const getUILabel = (labels: UILabel[], key: string): string | null => {
  const label = labels.find(l => l.label_key === key)
  return label?.label_text || null
}

// Helper function to get site content by key
export const getContentByKey = (content: SiteContent[], key: string): string | null => {
  const item = content.find(c => c.content_key === key)
  return item?.content_text || null
}

// Dummy blog posts data for fallback
const getDummyBlogPosts = (): BlogPost[] => [
  {
    id: '1',
    title: 'Planning the Perfect Children\'s Birthday Party in Kenya',
    excerpt: 'Essential tips for creating magical birthday celebrations that kids will remember forever.',
    content_text: 'Planning a children\'s birthday party in Kenya can be both exciting and overwhelming. Here are our top tips for creating an unforgettable celebration...',
    author: 'Sarah Wanjiku',
    date: '2024-01-15',
    read_time: '5 min read',
    category: 'Parenting Tips',
    image_url: 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    featured: true,
    tags: ['birthday', 'party planning', 'children', 'kenya'],
    active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Safety First: Equipment Standards for Children\'s Play Areas',
    excerpt: 'Understanding the safety standards and certifications that make play equipment safe for children.',
    content_text: 'When it comes to children\'s play equipment, safety is our top priority. Here\'s what you need to know about safety standards...',
    author: 'David Kimani',
    date: '2024-01-10',
    read_time: '7 min read',
    category: 'Safety',
    image_url: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    featured: true,
    tags: ['safety', 'equipment', 'standards', 'children'],
    active: true,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '3',
    title: 'Corporate Events: Bringing Fun to the Workplace',
    excerpt: 'How to incorporate play and entertainment into corporate events and team building activities.',
    content_text: 'Corporate events don\'t have to be boring. Here\'s how to add fun elements that engage employees and their families...',
    author: 'Grace Achieng',
    date: '2024-01-05',
    read_time: '6 min read',
    category: 'Corporate',
    image_url: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    featured: false,
    tags: ['corporate', 'team building', 'events', 'workplace'],
    active: true,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    id: '4',
    title: 'Mall Events: Creating Memorable Shopping Experiences',
    excerpt: 'How shopping malls can use play areas and events to attract families and increase foot traffic.',
    content_text: 'Shopping malls across Kenya are discovering the power of family-friendly entertainment. Here\'s how play areas can transform the shopping experience...',
    author: 'Sarah Wanjiku',
    date: '2023-12-28',
    read_time: '4 min read',
    category: 'Events',
    image_url: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    featured: false,
    tags: ['malls', 'retail', 'family entertainment', 'kenya'],
    active: true,
    created_at: '2023-12-28T10:00:00Z',
    updated_at: '2023-12-28T10:00:00Z'
  },
  {
    id: '5',
    title: 'Building Partnerships: Working with Schools and Communities',
    excerpt: 'Our approach to creating lasting partnerships with educational institutions and community organizations.',
    content_text: 'At Star Jump, we believe in building strong relationships with schools and communities across Kenya. Here\'s how we work together...',
    author: 'David Kimani',
    date: '2023-12-20',
    read_time: '5 min read',
    category: 'Partnerships',
    image_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
    featured: false,
    tags: ['partnerships', 'schools', 'community', 'education'],
    active: true,
    created_at: '2023-12-20T10:00:00Z',
    updated_at: '2023-12-20T10:00:00Z'
  }
]