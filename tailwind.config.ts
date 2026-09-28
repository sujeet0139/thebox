import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#173b2a",
        moss: "#7f9b73",
        bark: "#8a6846",
        sand: "#efe3d1",
        cream: "#f8f1e7",
        gold: "#c59a5c",
        ink: "#2f241a",
      },
      boxShadow: {
        soft: "0 26px 80px rgba(23, 59, 42, 0.12)",
      },
      backgroundImage: {
        "eco-grid":
          "linear-gradient(rgba(23,59,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(23,59,42,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;

