/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#1E2D4F',
        'primary-dark': '#0F1B35',
        'primary-light': '#E5EAF2',
        orange: '#F97316',
        'orange-dark': '#C2410C',
        secondary: '#1E40AF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        bg: '#F5F5F5',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Poppins_400Regular'],
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
        'poppins-extrabold': ['Poppins_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
