import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",  // Fixed double slash
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Fixed double slash
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Corrected wildcard placement
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Added wildcard **
    "./app/payment_success/**/*.{js,ts,jsx,tsx,mdx}", // Corrected wildcard placement
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
