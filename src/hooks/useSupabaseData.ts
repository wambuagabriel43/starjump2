import { useState, useEffect } from 'react'
import { supabase, Event, Product, Slider, InfoSection, SiteAsset, SiteSetting } from '../lib/supabase'

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })

        if (error) throw error
        setEvents(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return { events, loading, error, refetch: () => window.location.reload() }
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error, refetch: () => window.location.reload() }
}

export const useSliders = () => {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const { data, error } = await supabase
          .from('sliders')
          .select('*')
          .eq('active', true)
          .order('order_position', { ascending: true })

        if (error) throw error
        setSliders(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSliders()
  }, [])

  return { sliders, loading, error, refetch: () => window.location.reload() }
}

export const useInfoSection = (sectionKey: string) => {
  const [infoSection, setInfoSection] = useState<InfoSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInfoSection = async () => {
      try {
        const { data, error } = await supabase
          .from('info_sections')
          .select('*')
          .eq('section_key', sectionKey)
          .eq('active', true)
          .single()

        if (error && error.code !== 'PGRST116') throw error
        setInfoSection(data || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchInfoSection()
  }, [sectionKey])

  return { infoSection, loading, error, refetch: () => window.location.reload() }
}

export const useSiteAssets = (assetType?: string) => {
  const [assets, setAssets] = useState<SiteAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true)
      setError(null)
      try {
        // Check if Supabase is properly configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          console.warn('Supabase not configured, using empty assets array')
          setAssets([])
          setLoading(false)
          return
        }

        let query = supabase
          .from('site_assets')
          .select('*')
          .eq('active', true)

        if (assetType) {
          query = query.eq('asset_type', assetType)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase query error:', error)
          throw new Error(`Database error: ${error.message}`)
        }
        setAssets(data || [])
      } catch (err) {
        console.error('Error fetching site assets:', err)
        if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
          setError('Unable to connect to database. Please check your internet connection or contact support.')
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred while loading site assets')
        }
        // Set empty array as fallback
        setAssets([])
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [assetType])

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase not configured, using empty assets array')
        setAssets([])
        setLoading(false)
        return
      }

      let query = supabase
        .from('site_assets')
        .select('*')
        .eq('active', true)

      if (assetType) {
        query = query.eq('asset_type', assetType)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase query error:', error)
        throw new Error(`Database error: ${error.message}`)
      }
      setAssets(data || [])
    } catch (err) {
      console.error('Error refetching site assets:', err)
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to database. Please check your internet connection or contact support.')
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred while loading site assets')
      }
      // Set empty array as fallback
      setAssets([])
    } finally {
      setLoading(false)
    }
  }

  return { assets, loading, error, refetch }
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      setError(null)
      try {
        // Check if Supabase is properly configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          console.warn('Supabase not configured, using default settings')
          setSettings({})
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('site_settings')
          .select('*')

        if (error) throw error
        
        const settingsMap = (data || []).reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value
          return acc
        }, {} as Record<string, string>)
        
        setSettings(settingsMap)
      } catch (err) {
        console.error('Error fetching site settings:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        // Set empty settings as fallback
        setSettings({})
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase not configured, using default settings')
        setSettings({})
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')

      if (error) throw error
      
      const settingsMap = (data || []).reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value
        return acc
      }, {} as Record<string, string>)
      
      setSettings(settingsMap)
    } catch (err) {
      console.error('Error refetching site settings:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Set empty settings as fallback
      setSettings({})
    } finally {
      setLoading(false)
    }
  }

  return { settings, loading, error, refetch }
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true)
      setError(null)
      try {
        // Check if Supabase is properly configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          console.warn('Supabase not configured, using empty menu items')
          setMenuItems([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('active', true)
          .order('order_position', { ascending: true })

        if (error) {
          console.error('Supabase menu items query error:', error)
          throw new Error(`Database error: ${error.message}`)
        }
        setMenuItems(data || [])
      } catch (err) {
        console.error('Error fetching menu items:', err)
        if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
          setError('Unable to connect to database. Please check your internet connection or contact support.')
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred while loading menu items')
        }
        // Use empty menu items as fallback
        setMenuItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase not configured, using empty menu items')
        setMenuItems([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('active', true)
        .order('order_position', { ascending: true })

      if (error) {
        console.error('Supabase menu items query error:', error)
        throw new Error(`Database error: ${error.message}`)
      }
      setMenuItems(data || [])
    } catch (err) {
      console.error('Error refetching menu items:', err)
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to database. Please check your internet connection or contact support.')
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred while loading menu items')
      }
      // Use empty menu items as fallback
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  return { menuItems, loading, error, refetch }
}