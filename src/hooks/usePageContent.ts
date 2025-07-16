import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface PageContentBlock {
  id: string
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

// Hook for page-specific content using dedicated tables
export const usePageContent = (pageSlug: string) => {
  const [content, setContent] = useState<PageContentBlock[]>([])
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
          console.warn(`Supabase not configured for ${pageSlug}, using empty content`)
          setContent([])
          setLoading(false)
          return
        }

        // Map page slug to table name
        const tableName = `${pageSlug}_content`
        
        console.log(`[usePageContent] Fetching from table: ${tableName}`)

        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('active', true)
          .order('order_position', { ascending: true })

        if (error) {
          console.error(`Error fetching ${pageSlug} content:`, error)
          throw error
        }
        
        console.log(`[usePageContent] Successfully fetched ${data?.length || 0} content blocks for ${pageSlug}`)
        setContent(data || [])
      } catch (err) {
        console.error(`Exception fetching ${pageSlug} content:`, err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setContent([])
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [pageSlug])

  const refetch = () => {
    console.log(`[usePageContent] Manual refetch triggered for ${pageSlug}`)
    setLoading(true)
    setError(null)
    // Re-trigger the effect
    const fetchContent = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey || !supabase) {
          setContent([])
          setLoading(false)
          return
        }

        const tableName = `${pageSlug}_content`
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('active', true)
          .order('order_position', { ascending: true })

        if (error) throw error
        setContent(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setContent([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchContent()
  }

  return { content, loading, error, refetch }
}

// Utility function to get content by section key
export const getContentBySection = (content: PageContentBlock[], sectionKey: string): PageContentBlock | null => {
  return content.find(block => block.section_key === sectionKey) || null
}

// Utility function to render content based on type
export const renderContentByType = (content: PageContentBlock | null) => {
  if (!content) return { title: '', content: '', metadata: {} }
  
  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    content: content.content_text || '',
    image_url: content.image_url || '',
    button_text: content.button_text || '',
    button_link: content.button_link || '',
    metadata: content.metadata || {}
  }
}