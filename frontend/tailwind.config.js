/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-surface-variant": "#ccc3d8",
        "outline": "#958da1",
        "surface-container-low": "#191c22",
        "secondary-fixed": "#acedff",
        "secondary-fixed-dim": "#4cd7f6",
        "on-secondary-fixed-variant": "#004e5c",
        "surface-container-highest": "#32353c",
        "surface-bright": "#363940",
        "on-secondary-container": "#00424e",
        "secondary": "#4cd7f6",
        "on-error-container": "#ffdad6",
        "on-surface": "#e0e2eb",
        "on-primary-fixed-variant": "#5a00c6",
        "tertiary": "#4edea3",
        "surface": "#10131a",
        "background": "#10131a",
        "surface-container-lowest": "#0b0e14",
        "primary-container": "#7c3aed",
        "surface-dim": "#10131a",
        "secondary-container": "#03b5d3",
        "error-container": "#93000a",
        "inverse-primary": "#732ee4",
        "on-tertiary-fixed": "#002113",
        "primary": "#d2bbff",
        "error": "#ffb4ab",
        "tertiary-fixed": "#6ffbbe",
        "on-error": "#690005",
        "on-primary": "#3f008e",
        "surface-variant": "#32353c",
        "tertiary-fixed-dim": "#4edea3",
        "primary-fixed": "#eaddff",
        "on-secondary": "#003640",
        "on-primary-fixed": "#25005a",
        "on-tertiary-container": "#76ffc2",
        "surface-container-high": "#272a31",
        "inverse-surface": "#e0e2eb",
        "on-tertiary-fixed-variant": "#005236",
        "tertiary-container": "#007650",
        "primary-fixed-dim": "#d2bbff",
        "surface-tint": "#d2bbff",
        "on-secondary-fixed": "#001f26",
        "surface-container": "#1d2026",
        "on-tertiary": "#003824",
        "inverse-on-surface": "#2d3037",
        "on-background": "#e0e2eb",
        "outline-variant": "#4a4455",
        "on-primary-container": "#ede0ff"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: [],
}
