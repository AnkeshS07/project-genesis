import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1f2e',
          muted: '#5b6475',
        },
        paper: {
          DEFAULT: '#f7f4ef',
          deep: '#ebe4d8',
        },
        accent: {
          DEFAULT: '#2f6f4e',
          soft: '#d9ebe1',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
