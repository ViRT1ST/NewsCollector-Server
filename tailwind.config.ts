/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'lt-page-gradient': 'linear-gradient(to right, #d397ad, #b38fbc, #729abb)',
      },
      colors: {
        'lt-page-bg': '#b6b2af',
        'lt-page-fg': '#000',
        'lt-nav-bg': '#dbd8d7',
        'lt-nav-fg': '#000',
        'lt-article-bg-a': '#dbd9d7',
        'lt-article-bg-b': '#e2e0df',
        'lt-article-fg-time': '#822424',
        'lt-article-fg-source': '#7d1c53',
        'lt-article-fg-link-normal': '#111',
        'lt-article-fg-link-visited': '#9e9794',
        'lt-btn-default-fg': '#444',
        'lt-btn-default-bg': '#fff',
        'lt-btn-danger-fg': '#fff',
        'lt-btn-danger-bg': '#dc3545',
        'lt-btn-safe-fg': '#fff',
        'lt-btn-safe-bg': '#198754',
        'dt-page-bg': '#192024',
        'dt-page-fg': '#fff',
        'dt-nav-bg': '#282e33',
        'dt-nav-fg': '#fff',
        'dt-article-bg-a': '#232e33',
        'dt-article-bg-b': '#263238',
        'dt-article-fg-time': '#c778A5',
        'dt-article-fg-source': '#d38871',
        'dt-article-fg-link-normal': '#8998b4',
        'dt-article-fg-link-visited': '#3e515b',
        'dt-btn-default-fg': '#8da885',
        'dt-btn-default-bg': '#8da885',
        'dt-btn-danger-fg': '#fff',
        'dt-btn-danger-bg': '#dc3545',
        'dt-btn-safe-fg': '#fff',
        'dt-btn-safe-bg': '#198754',
      },
      transitionProperty: {
        height: 'height, maxHeight',
        spacing: 'margin, padding',
      }
    },
    fontFamily: {
      'opensans': ['var(--font-open-sans)', 'system-ui', 'sans-serif'],
      'lato': ['var(--font-lato)', 'system-ui', 'sans-serif'],
      'roboto': ['var(--font-roboto)', 'system-ui', 'sans-serif'],
    },

    // animation classes
    animation: {
      'fade-in-out': 'fadeInOut 4s ease-in-out',
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'self-rotate': 'selfRotate 1.0s infinite linear'
    },

    // actual animation
    keyframes: {
      fadeInOut: {
        '0%': { opacity: 0 },
        '5%': { opacity: 1 },
        '80%': { opacity: 1 },
        '100%': { opacity: 0 },
      },
      fadeIn: {
        '0%': { opacity: 0 },
        '5%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      selfRotate: {
        '0%': {
          transform: 'rotate(0deg)'
        },
        '100%': {
          transform: 'rotate(360deg)'
        }
      }
    },
  },
  plugins: [],
};
