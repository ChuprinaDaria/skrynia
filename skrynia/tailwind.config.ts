import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Earthy Luxury Palette
        'deep-black': '#0B0C10',
        'ivory': '#FFFFF0',
        'oxblood': '#660000',
        'sage': '#7A8B8B',
        'coral': '#C77966',
        // Additional shades for UI states
        'footer-black': '#1A1C20',
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'rutenia': ['Rutenia', 'Playfair Display', 'Cinzel', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'rotate-slow': 'rotate 2s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'oxblood-glow': '0 0 10px rgba(102, 0, 0, 0.5)',
        'oxblood-glow-lg': '0 0 20px rgba(102, 0, 0, 0.6)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
