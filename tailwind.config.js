/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      colors: {
        cinnamon: {
          canvas: '#fcfaf6',
          chrome: '#f6f2ea',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e6dcce',
          borderSubtle: '#f0e7dc',
          borderHover: '#d8c9b8',
          text: '#2c1a0e',
          textSecondary: '#5e4634',
          textMuted: '#8c7664',
          accent: '#b44b10',
          accentHover: '#d25b18',
          accentMuted: 'rgba(180, 75, 16, 0.08)',
        },
      },
      boxShadow: {
        warm: '0 1px 3px rgba(44, 26, 14, 0.04), 0 1px 2px rgba(44, 26, 14, 0.02)',
        'warm-md': '0 4px 12px -2px rgba(44, 26, 14, 0.06), 0 0 0 1px rgba(230, 220, 206, 0.6)',
        'warm-lg': '0 10px 25px -4px rgba(44, 26, 14, 0.08), 0 0 0 1px rgba(230, 220, 206, 0.8)',
      },
    },
  },
  plugins: [],
};
