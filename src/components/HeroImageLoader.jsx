import { useState, useEffect } from 'react'
import './HeroImageLoader.css'

/**
 * HeroImageLoader Component
 *
 * Loading placeholder with animated "apeforest" text
 * Controlled by parent component via isLoading prop
 */
const HeroImageLoader = ({ isLoading }) => {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'apeforest'

  useEffect(() => {
    if (!isLoading) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        // Reset and repeat animation
        currentIndex = 0
      }
    }, 150) // Speed of typing animation

    return () => clearInterval(interval)
  }, [isLoading])

  // Hide when not loading
  if (!isLoading) {
    return null
  }

  return (
    <div className="hero-image-loader">
      <div className="hero-image-loader__content">
        <div className="hero-image-loader__text">
          {displayText}
          <span className="hero-image-loader__cursor">|</span>
        </div>
      </div>
    </div>
  )
}

export default HeroImageLoader
