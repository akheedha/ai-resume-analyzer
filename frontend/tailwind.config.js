module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        "background-secondary": "#0B0F0C",
        surface: "#111412",
        elevated: "#171B18",
        "brand-primary": "#22C55E",
        "brand-dark": "#16A34A",
        "brand-soft": "#4ADE80",
        "text-primary": "#F5F7F6",
        "text-secondary": "#A7B0AA",
        muted: "#6F7772",
        border: "#252A27",
      },
      boxShadow: { panel: "0 16px 40px rgba(0, 0, 0, 0.22)" },
    },
  },
  plugins: [],
};
