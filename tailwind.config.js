/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        textMain: 'var(--color-text)',
        accent: 'var(--color-accent)',
        primary: '#EF7C5D', // Brand coral remains constant but can be muted in dark mode if needed
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        retro: ['"Bebas Neue"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        'pill': '100px',
      }
    },
  },
  plugins: [],
}
