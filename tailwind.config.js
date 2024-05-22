/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "color-background": "var(--color-background)",
        "color-text": "var(--color-text)",
        "color-text-faded": "var(--color-text-faded)",
        "color-border": "var(--color-border)",
        "color-card-background": "var(--color-card-background)",
        "color-icon-fill": "var(--color-icon-fill)",
        "color-icon-fill-red": "var(--color-icon-fill-red)"
      },
    },
    screens: {
      'tablet': '640px',
      'laptop': '1024px',
    },
  },
  plugins: [],
}

