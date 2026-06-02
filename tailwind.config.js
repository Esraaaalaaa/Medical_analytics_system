/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa',
        foreground: '#000000',
        border: '#d1d5db',
        input: '#ffffff',
        primary: {
          DEFAULT: '#0d1b3e',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#c0152a',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#e2e8f0',
          foreground: '#475569',
        },
        card: '#ffffff',
      },
      fontFamily: {
        body: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        headings: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
