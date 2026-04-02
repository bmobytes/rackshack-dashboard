/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'rack-bg': '#0d0d14',
        'rack-surface': '#13131f',
        'rack-border': '#1e1e2e',
        'rack-muted': '#6c6c8a',
      }
    }
  },
  plugins: []
};
