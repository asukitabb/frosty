/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        frosty: {
          cream: "#FFF8F0",
          mint: "#B8E8E0",
          lavender: "#D4C4F4",
          peach: "#FFD8C8",
          sky: "#C8E7FF",
          rose: "#F8C8DC",
          ink: "#2D3142",
          glass: "rgba(255, 255, 255, 0.45)",
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(45, 49, 66, 0.12)",
        "glass-inset": "inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
