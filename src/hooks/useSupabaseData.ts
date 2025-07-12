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
      try {
        let query = supabase
          .from('site_assets')
          .select('*')
          .eq('active', true)

        if (assetType) {
          query = query.eq('asset_type', assetType)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error
        setAssets(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [assetType])

  return { assets, loading, error, refetch: () => window.location.reload() }
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
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
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error, refetch: () => window.location.reload() }
}