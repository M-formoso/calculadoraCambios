/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#D4D4D4",
        input: "#D4D4D4",
        ring: "#007BFF",
        background: "#F0F0F0",
        foreground: "#1A1A1A",
        primary: {
          DEFAULT: "#007BFF",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#28A745",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#E5E5E5",
          foreground: "#737373",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A1A",
        },
        whatsapp: "#25D366",
        telegram: "#0088CC",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
