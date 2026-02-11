/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Brand Primary
          700: '#1d4ed8',
        },
        secondary: '#4b5563',
        success: {
          50: '#ecfdf5',
          600: '#059669',
        },
        danger: {
          50: '#fef2f2',
          600: '#dc2626',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6', // Background
          200: '#e5e7eb', // Border
          500: '#6b7280', // Text Muted
          800: '#1f2937', // Text Main
          900: '#111827', // Headings
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '800' }], // 36px
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }], // 24px
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // 20px
        'body': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'small': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      }
    },
  },
  plugins: [],
}