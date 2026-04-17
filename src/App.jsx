import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { TransitionProvider } from './contexts/TransitionContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import HowItWorks from './pages/HowItWorks'
import Marketplace from './pages/Marketplace'
import ConceptoArte from './pages/ConceptoArte'
import Map from './pages/Map'
import TreeCardDemo from './pages/TreeCardDemo'

// Wrapper component to handle language switching
function LanguageWrapper({ children }) {
  const { locale } = useParams()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (locale && ['en', 'pt', 'it'].includes(locale)) {
      i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  return children
}

function App() {
  return (
    <Router>
      <TransitionProvider>
        <ScrollToTop />
        <LanguageWrapper>
          <Header />
          <PageTransition>
            {/* Redirect root to default language (English) */}
            <Route path="/" element={<><Home /><Footer /></>} />

            {/* Localized routes */}
            <Route path="/:locale" element={<><Home /><Footer /></>} />
            <Route path="/:locale/about-us" element={<><AboutUs /><Footer /></>} />
            <Route path="/:locale/how-it-works" element={<><HowItWorks /><Footer /></>} />
            <Route path="/:locale/marketplace" element={<><Marketplace /><Footer /></>} />
            <Route path="/:locale/conceito-arte" element={<><ConceptoArte /><Footer /></>} />
            <Route path="/:locale/map" element={<><Map /><Footer /></>} />
            <Route path="/:locale/tree-card-demo" element={<><TreeCardDemo /><Footer /></>} />

            {/* Fallback: redirect old routes without locale to English version */}
            <Route path="/about-us" element={<Navigate to="/en/about-us" replace />} />
            <Route path="/how-it-works" element={<Navigate to="/en/how-it-works" replace />} />
            <Route path="/marketplace" element={<Navigate to="/en/marketplace" replace />} />
            <Route path="/conceito-arte" element={<Navigate to="/en/conceito-arte" replace />} />
            <Route path="/map" element={<Navigate to="/en/map" replace />} />
            <Route path="/tree-card-demo" element={<Navigate to="/en/tree-card-demo" replace />} />
          </PageTransition>
        </LanguageWrapper>
        <Analytics />
      </TransitionProvider>
    </Router>
  )
}

export default App
