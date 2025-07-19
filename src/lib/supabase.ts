import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
  console.error('Current values:', { supabaseUrl, supabaseAnonKey })
  // Don't throw error, let the app continue with fallback behavior
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any // This will cause hooks to handle the missing configuration gracefully

// Database types for Star Jump Kenya
export interface Event {
  id: string
  title: string
  description: string
  image_url: string
  date: string
  time: string
  location: string
  category: string
  featured: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  image_url: string
  price_kes: number
  category: string
  rating: number
  in_stock: boolean
  featured: boolean
  created_at: string
}

export interface Slider {
  id: string
  title: string
  subtitle: string
  image_url: string
  order_position: number
  active: boolean
  created_at: string
}

export interface InfoSection {
  id: string
  title: string
  subtitle: string
  content_text: string
  image_url: string
  layout: 'left-image' | 'right-image'
  section_key: string
  active: boolean
  created_at: string
}

export interface SiteAsset {
  id: string
  asset_type: string
  image_url: string
  placement_hint: string
  menu_item: string
  position_x: number
  position_y: number
  width: number | null
  height: number | null
  z_index: number
  active: boolean
  created_at: string
}

export interface SiteSetting {
  id: string
  setting_key: string
  setting_value: string
  setting_type: string
  description: string
  created_at: string
  updated_at: string
}

// Helper functions for Kenya-specific formatting
export const formatKES = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Debug function to check Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseAnonKey?.substring(0, 20) + '...');
    
    const { data, error } = await supabase.from('events').select('count').limit(1);
    console.log('Connection test result:', { data, error });
    return { success: !error, error };
  } catch (err) {
    console.error('Connection test exception:', err);
    return { success: false, error: err };
  }
};

export const kenyanLocations = [
  'Greenspan Mall, Nairobi',
  'Garden City Mall, Nairobi',
  'Galleria Mall, Nairobi'
]

export const eventCategories = [
  'General',
  'Festival',
  'School Event',
  'Corporate',
  'Community',
  'Mall Event',
  'Birthday Party',
  'Wedding'
]

export const productCategories = [
  'Bouncy Castle',
  'Slide',
  'Trampoline',
  'Apparel',
  'Accessories',
  'Games',
  'Party Supplies'
]

// Required storage buckets for the application
export const requiredStorageBuckets = [
  'logos',
  'menu-graphics', 
  'footer-images',
  'general-uploads',
  'blog-images',
  'event-images',
  'product-images'
]

// Function to create storage buckets if they don't exist
export const createStorageBucketsIfNeeded = async () => {
  if (!supabase) return { success: false, error: 'Supabase not configured' }
  
  try {
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    if (listError) throw listError
    
    const existingBucketNames = existingBuckets?.map(b => b.name) || []
    const missingBuckets = requiredStorageBuckets.filter(bucket => !existingBucketNames.includes(bucket))
    
    const results = []
    for (const bucketName of missingBuckets) {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      })
      
      if (error) {
        console.warn(`Could not create bucket ${bucketName}:`, error)
        results.push({ bucket: bucketName, success: false, error: error.message })
      } else {
        console.log(`Created bucket: ${bucketName}`)
        results.push({ bucket: bucketName, success: true })
      }
    }
    
    return { 
      success: true, 
      created: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results 
    }
  } catch (err) {
    console.error('Error creating storage buckets:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Storage bucket helpers
export const uploadFile = async (bucket: string, file: File, path?: string) => {
  console.log('uploadFile called with:', { bucket, fileName: file.name, fileSize: file.size, path });
  
  const fileName = path || `${Date.now()}-${file.name}`
  
  // Ensure file is valid
  if (!file || file.size === 0) {
    console.error('Invalid file provided');
    throw new Error('Invalid file provided')
  }

  // Check file size (5MB limit for most buckets, 10MB for general)
  const maxSize = bucket === 'general-uploads' ? 10485760 : 5242880
  if (file.size > maxSize) {
    console.error('File size exceeds limit:', file.size, 'max:', maxSize);
    throw new Error(`File size exceeds limit of ${maxSize / 1048576}MB`)
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    console.error('Invalid file type:', file.type);
    throw new Error('Only image files are allowed')
  }
  console.log('Attempting upload to bucket:', bucket, 'with filename:', fileName);
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  console.log('Upload result:', { data, error });
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  console.log('Generated public URL:', publicUrl);
  
  // Verify the URL is accessible
  try {
    const response = await fetch(publicUrl, { method: 'HEAD' });
    if (!response.ok) {
      console.warn('Uploaded file may not be immediately accessible:', response.status);
    }
  } catch (err) {
    console.warn('Could not verify file accessibility:', err);
  }
  
  return { fileName: data.path, publicUrl }
}

export const deleteFile = async (bucket: string, fileName: string) => {
  if (!fileName) {
    throw new Error('No file name provided')
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])

  if (error) throw error
}

export const getPublicUrl = (bucket: string, fileName: string) => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return publicUrl
}