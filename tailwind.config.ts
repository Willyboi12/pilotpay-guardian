import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(210 40% 98%)",
        card: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        primary: "hsl(221.2 83.2% 53.3%)",
      },
    },
  },
  plugins: [],
};

export default config;
