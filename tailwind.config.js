/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
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
        mac: {
          bg: '#0e1117',
          surface: '#161922',
          panel: '#1c212d',
          card: '#222736',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          accent: '#0a84ff',
          accentHover: '#409cff',
          accentMuted: 'rgba(10, 132, 255, 0.15)',
          warning: '#ff9f0a',
          danger: '#ff453a',
          success: '#30d158',
          textMuted: '#868e9e',
          textSecondary: '#aab2c0',
        },
      },
      boxShadow: {
        rim: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'rim-subtle': 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'rim-active': 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        macos: '0 12px 32px -8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
};
