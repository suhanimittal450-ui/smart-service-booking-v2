/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#060818',
          card: '#0d1128',
          soft: '#10142e',
        },
        accent: {
          purple: '#7C3AED',
          indigo: '#4F46E5',
          cyan: '#22D3EE',
        },
        text: {
          soft: '#94A3B8',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(124, 58, 237, 0.35)',
      },
    },
  },
  plugins: [],
}
