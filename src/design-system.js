/**
 * Design System Configuration
 *
 * This file contains all design tokens for the Apeforest project.
 * Use these constants to maintain consistency across the application.
 */

export const typography = {
  fonts: {
    primary: "'Roboto Slab', serif",
    mono: "'Fira Mono', monospace",
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const colors = {
  // Primary palette
  sage: {
    light: '#81A782',
    dark: '#4B6E4C',
  },
  terracotta: '#84624A',
  sand: '#BDA687',
  mint: '#ADC8AE',
  offwhite: '#E9E4D8',

  // Semantic colors
  primary: '#4B6E4C',      // sage-dark
  secondary: '#81A782',    // sage-light
  accent: '#84624A',       // terracotta
  background: '#ADC8AE',   // mint
  surface: '#BDA687',      // sand
  light: '#E9E4D8',        // offwhite
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export default {
  typography,
  colors,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
};
