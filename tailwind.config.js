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
          bg: 'var(--mac-bg)',
          surface: 'var(--mac-surface)',
          panel: 'var(--mac-panel)',
          card: 'var(--mac-card)',
          border: 'var(--mac-border)',
          borderSubtle: 'var(--mac-border-subtle)',
          borderHover: 'var(--mac-border-hover)',
          text: 'var(--mac-text)',
          textSecondary: 'var(--mac-text-secondary)',
          textMuted: 'var(--mac-text-muted)',
          accent: '#0066cc',
          accentHover: '#0077ed',
          accentMuted: 'rgba(0, 102, 204, 0.1)',
          warning: '#f59e0b',
          danger: '#ef4444',
          success: '#10b981',
        },
      },
      boxShadow: {
        rim: 'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        macos: '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)',
        'macos-card': '0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.02)',
      },
    },
  },
  plugins: [],
};
