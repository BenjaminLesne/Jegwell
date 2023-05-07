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
    },
  },
  plugins: [],
} satisfies Config;