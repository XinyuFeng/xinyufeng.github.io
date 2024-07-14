import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx,css}", "./app/*.tsx", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
