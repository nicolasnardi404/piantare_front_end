import { createContext, useContext, useState, useRef, useEffect } from 'react'

const TransitionContext = createContext(null)

/**
 * TransitionProvider
 *
 * Simple state management for initial page load animation
 * Shows typing animation only on first visit
 */
export const TransitionProvider = ({ children }) => {
  const [minLoadTimeElapsed, setMinLoadTimeElapsed] = useState(false)
  const minLoadTimerRef = useRef(null)
  const isFirstVisit = useRef(false)

  // Check if this is the first visit in this session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('apeforest_visited')

    if (!hasVisited) {
      // First visit - show loader
      isFirstVisit.current = true
      sessionStorage.setItem('apeforest_visited', 'true')

      // Minimum display time for initial loader (1800ms)
      minLoadTimerRef.current = setTimeout(() => {
        setMinLoadTimeElapsed(true)
      }, 1800)
    } else {
      // Already visited - skip loader
      isFirstVisit.current = false
      setMinLoadTimeElapsed(true)
    }

    return () => {
      if (minLoadTimerRef.current) {
        clearTimeout(minLoadTimerRef.current)
      }
    }
  }, [])

  const value = {
    // Show loader only if first visit AND min time hasn't elapsed
    shouldShowInitialLoader: isFirstVisit.current && !minLoadTimeElapsed,
    // Page is ready when not first visit OR min time has elapsed
    isPageReady: !isFirstVisit.current || minLoadTimeElapsed,
  }

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  )
}

/**
 * useTransition Hook
 *
 * Access transition context from any component
 */
export const useTransition = () => {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider')
  }
  return context
}

export default TransitionContext
