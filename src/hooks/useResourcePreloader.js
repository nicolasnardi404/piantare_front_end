import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useResourcePreloader Hook
 *
 * Centralized hook for preloading images and other resources
 * Handles image loading with fallbacks and prevents memory leaks
 *
 * @param {Array<Object>} resources - Array of resource objects to preload
 *   Each object should have:
 *   - url: string (primary resource URL)
 *   - fallback: string (optional fallback URL)
 *   - type: 'image' (future: 'video', 'font', etc.)
 *
 * @returns {Object} - { isLoading, progress, error, preload }
 */
const useResourcePreloader = (resources = []) => {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)
  const resourcesRef = useRef([])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      // Cancel any pending image loads
      resourcesRef.current.forEach(img => {
        if (img instanceof Image) {
          img.onload = null
          img.onerror = null
        }
      })
    }
  }, [])

  const preloadImage = useCallback((resource) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      resourcesRef.current.push(img)

      img.onload = () => {
        if (mountedRef.current) {
          resolve({ url: resource.url, status: 'loaded' })
        }
      }

      img.onerror = () => {
        // Try fallback if available
        if (resource.fallback) {
          const fallbackImg = new Image()
          resourcesRef.current.push(fallbackImg)

          fallbackImg.onload = () => {
            if (mountedRef.current) {
              resolve({ url: resource.fallback, status: 'loaded-fallback' })
            }
          }

          fallbackImg.onerror = () => {
            if (mountedRef.current) {
              reject(new Error(`Failed to load ${resource.url} and fallback ${resource.fallback}`))
            }
          }

          fallbackImg.src = resource.fallback
        } else {
          if (mountedRef.current) {
            reject(new Error(`Failed to load ${resource.url}`))
          }
        }
      }

      img.src = resource.url
    })
  }, [])

  const preload = useCallback(async () => {
    if (!resources || resources.length === 0) {
      setIsLoading(false)
      setProgress(100)
      return
    }

    setIsLoading(true)
    setProgress(0)
    setError(null)

    try {
      let loadedCount = 0
      const totalResources = resources.length

      const promises = resources.map(async (resource) => {
        try {
          const result = await preloadImage(resource)
          loadedCount++
          if (mountedRef.current) {
            setProgress((loadedCount / totalResources) * 100)
          }
          return result
        } catch (err) {
          loadedCount++
          if (mountedRef.current) {
            setProgress((loadedCount / totalResources) * 100)
          }
          console.warn(`Resource failed to load:`, err)
          throw err
        }
      })

      await Promise.all(promises)

      if (mountedRef.current) {
        setIsLoading(false)
        setProgress(100)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message)
        setIsLoading(false)
      }
    }
  }, [resources, preloadImage])

  // Auto-preload on mount and when resources change
  useEffect(() => {
    preload()
  }, [preload])

  return {
    isLoading,
    progress,
    error,
    preload, // Allow manual re-trigger if needed
  }
}

export default useResourcePreloader
