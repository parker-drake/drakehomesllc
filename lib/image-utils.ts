/**
 * Image optimization utilities for better performance
 * Reduces image sizes and converts to modern formats (WebP)
 */

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
}

/**
 * Optimize Supabase Storage images using Supabase's built-in image transformation
 * 
 * @param url - The original Supabase image URL
 * @param options - Optimization options (width, height, quality, format)
 * @returns Optimized image URL with transformation parameters
 * 
 * @example
 * // Resize to 800px wide, 80% quality, WebP format
 * optimizeSupabaseImage(imageUrl, { width: 800, quality: 80 })
 * 
 * // Specific dimensions for hero images
 * optimizeSupabaseImage(imageUrl, { width: 1920, height: 1080, quality: 85 })
 */
export function optimizeSupabaseImage(
  url: string | undefined | null,
  options: ImageOptimizationOptions = {}
): string {
  // Return empty string if no URL provided
  if (!url) return ''
  
  // Only optimize Supabase URLs
  if (!url.includes('supabase.co')) return url
  
  const {
    width,
    height,
    quality = 80,
    format = 'webp'
  } = options

  try {
    const urlObj = new URL(url)
    const params = urlObj.searchParams

    // Add transformation parameters
    if (width) params.set('width', width.toString())
    if (height) params.set('height', height.toString())
    params.set('quality', quality.toString())
    if (format) params.set('format', format)

    return urlObj.toString()
  } catch (error) {
    console.error('Error optimizing image URL:', error)
    return url
  }
}

/**
 * Get responsive srcset for an image
 * Generates multiple sizes for responsive images
 */
export function getResponsiveSrcSet(
  url: string | undefined | null,
  sizes: number[] = [400, 800, 1200, 1920]
): string {
  if (!url) return ''
  if (!url.includes('supabase.co')) return url

  return sizes
    .map(size => `${optimizeSupabaseImage(url, { width: size, quality: 80 })} ${size}w`)
    .join(', ')
}

/**
 * Predefined image size presets for common use cases
 */
export const IMAGE_PRESETS = {
  // Homepage hero slider
  hero: { width: 1920, height: 1080, quality: 85 },
  
  // Property listing cards
  card: { width: 600, height: 400, quality: 80 },
  
  // Property detail page main image
  detail: { width: 1200, height: 800, quality: 85 },
  
  // Thumbnails
  thumbnail: { width: 300, height: 200, quality: 75 },
  
  // Admin preview
  adminPreview: { width: 150, height: 150, quality: 70 },
  
  // Gallery images
  gallery: { width: 800, height: 600, quality: 85 },
  
  // Plan images
  plan: { width: 800, height: 600, quality: 85 },
}

/**
 * Quick helpers for common scenarios
 */
export const optimizeForHero = (url: string) => 
  optimizeSupabaseImage(url, IMAGE_PRESETS.hero)

export const optimizeForCard = (url: string) => 
  optimizeSupabaseImage(url, IMAGE_PRESETS.card)

export const optimizeForDetail = (url: string) => 
  optimizeSupabaseImage(url, IMAGE_PRESETS.detail)

export const optimizeForThumbnail = (url: string) => 
  optimizeSupabaseImage(url, IMAGE_PRESETS.thumbnail)

export const optimizeForGallery = (url: string) => 
  optimizeSupabaseImage(url, IMAGE_PRESETS.gallery)

