/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#12957D',
          hover: '#0F7A65',
          light: '#E4FFC1',
        },
        secondary: {
          DEFAULT: '#69B1FF',
          dark: '#4096FF',
        },
        accent: {
          orange: '#FF8D24',
          red: '#FF5D5D',
          yellow: '#FFB700',
          green: '#52C41A',
          purple: '#CB5DFF',
        },
        background: {
          DEFAULT: '#FFFFFF',
          elevated: '#F5F5F5',
          dark: '#1F2937',
        },
        text: {
          primary: '#1F2556',
          secondary: '#64748B',
          disabled: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 32px 0 rgba(158, 218, 207, 0.38)',
        'card2': '0 20px 38px 0 rgba(28, 39, 49, 0.14)',
        'input': '0 0 0 4px rgba(18, 149, 125, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}