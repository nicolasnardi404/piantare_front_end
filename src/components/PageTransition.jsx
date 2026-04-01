import { motion, AnimatePresence } from 'motion/react'
import { useLocation, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useTransition } from '../contexts/TransitionContext'
import HeroImageLoader from './HeroImageLoader'
import './PageTransition.css'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const { shouldShowInitialLoader, isPageReady } = useTransition()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Animation variants for simple crossfade
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  }

  const pageTransition = {
    duration: 0.3,
    ease: 'easeInOut',
  }

  return (
    <>
      {/* Initial load screen - only shown on first visit */}
      {shouldShowInitialLoader && <HeroImageLoader isLoading={!isPageReady} />}

      {/* Page content with crossfade animation */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="page-transition-wrapper"
            style={{ position: 'absolute', width: '100%', top: 0 }}
          >
            <Routes location={location}>
              {children}
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

export default PageTransition
