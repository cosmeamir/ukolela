import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7ff',
          100: '#dcebff',
          200: '#b6d3ff',
          300: '#8ebbff',
          400: '#629cff',
          500: '#3d7dff',
          600: '#245fe6',
          700: '#1949b4',
          800: '#143b8a',
          900: '#132f69'
        }
      }
    }
  },
  plugins: []
};

export default config;
