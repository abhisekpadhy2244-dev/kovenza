import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        header: "var(--header-bg)",
        logo: "var(--logo)",
        nav: "var(--nav-text)",
        heading: "var(--heading)",
        body: "var(--body-text)",
        page: "var(--page-bg)",
        alt: "var(--alt-section-bg)",
        button: "var(--button-bg)",
        "button-text": "var(--button-text)",
        hover: "var(--hover)",
        highlight: "var(--highlight)",
        dark: "var(--dark-section-bg)",
        "dark-text": "var(--dark-section-text)",
        decor: "var(--decor)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "80rem",
      },
      minHeight: {
        tap: "44px",
      },
    },
  },
  plugins: [],
};

export default config;
