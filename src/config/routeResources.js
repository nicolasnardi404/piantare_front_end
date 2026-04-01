/**
 * Route Resources Configuration
 *
 * Maps routes to their critical resources for prefetching
 * Used by PrefetchLink to intelligently preload assets
 */
export const routeResources = {
  // Home page
  '/en': ['/images/cerebro_planta.webp'],
  '/pt': ['/images/cerebro_planta.webp'],
  '/it': ['/images/cerebro_planta.webp'],

  // Marketplace
  '/en/marketplace': ['/images/marketplace_hero.webp'],
  '/pt/marketplace': ['/images/marketplace_hero.webp'],
  '/it/marketplace': ['/images/marketplace_hero.webp'],

  // How It Works
  '/en/how-it-works': ['/images/how_it_work_hero.webp'],
  '/pt/how-it-works': ['/images/how_it_work_hero.webp'],
  '/it/how-it-works': ['/images/how_it_work_hero.webp'],

  // About Us
  '/en/about-us': [],
  '/pt/about-us': [],
  '/it/about-us': [],

  // Map
  '/en/map': [],
  '/pt/map': [],
  '/it/map': [],
}

/**
 * Get resources for a specific route
 * @param {string} route - The route path
 * @returns {Array} - Array of resource URLs
 */
export const getResourcesForRoute = (route) => {
  return routeResources[route] || []
}

export default routeResources
