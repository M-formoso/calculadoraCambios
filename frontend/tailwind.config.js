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
        primary: {
          DEFAULT: "#007BFF",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#28A745",
          foreground: "#FFFFFF",
        },
        background: "#F0F0F0",
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
