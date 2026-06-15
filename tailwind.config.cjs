
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Warm, organic editorial base
        paper: '#F6EFE4',     // warm cream background
        sand: '#EBE0CE',      // soft sand panels
        sandDeep: '#DCCDB4',  // deeper sand / borders
        ink: '#1B1714',       // warm near-black text
        inkSoft: '#5A4F45',   // muted body text
        inkFaint: '#8C7E6E',  // captions / labels

        // Brand red (kept) + warm accents
        main: '#DC0000',
        darkAccent: '#850000',
        ember: '#C0392B',     // warm terracotta-red for soft accents
        glow: '#FF3B30',      // bright marker glow

        // Legacy tokens still referenced around the app
        lightShade: '#F6EFE4',
        lightAccent: '#59CE8F',
        darkShade: '#1B1714',
        danger: '#F44336',
        success: '#777A38',
        warning: '#F56A00',
        photosPrimary: 'black',
        photosSecondary: '#F2E3DB',
        photosAccent: '#E86A33',
        photosLinks: '#263A29'
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        tightest: '-0.04em'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 1.2s ease forwards'
      }
    }
  },
  plugins: []
};
