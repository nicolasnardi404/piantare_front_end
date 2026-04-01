import { Link } from 'react-router-dom'
import { useCallback } from 'react'

/**
 * PrefetchLink Component
 *
 * Enhanced Link component that prefetches resources on hover
 * Improves perceived performance by loading next page resources in advance
 *
 * @param {string} to - Route to navigate to
 * @param {Array} prefetchImages - Array of image URLs to prefetch on hover
 * @param {Object} ...props - Additional Link props
 */
const PrefetchLink = ({ to, prefetchImages = [], children, ...props }) => {
  const handleMouseEnter = useCallback(() => {
    // Prefetch images on hover
    if (prefetchImages && prefetchImages.length > 0) {
      prefetchImages.forEach(imageUrl => {
        const img = new Image()
        img.src = imageUrl
      })
    }
  }, [prefetchImages])

  return (
    <Link
      to={to}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  )
}

export default PrefetchLink
