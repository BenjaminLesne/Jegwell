import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#AC8C30",
        secondary: "#F8EFE6",
        ternary: "#333",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "10%": {
            opacity: "1",
          },

          "50%": {
            opacity: "1",
          },

          "100%": {
            opacity: "0",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 2s forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;