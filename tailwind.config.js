/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // Keep the custom colors too, or map them?
          // User wanted specific hex codes: #1e3a5f.
          // In index.css I defined --primary as 215 52% 25% which is approx #1e3a5f.
          // I should probably ensure consistency. 
          // I will keep the user's specific hexes as 'custom-primary' or just override.
          // Let's stick to the variables for the base system and add the specific ones as extensions if needed.
          // Actually, the user's code uses things like 'text-[#1e3a5f]'.
          // But I also used `bg-primary` in my components.
          // Let's map 'primary' to the variable for consistency with shadcn components.
          // But I need to preserve the specific hexes if they are different?
          // I'll map primary to the variable, and ensure the variable matches the hex.
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom branding colors
        brand: {
          blue: '#1e3a5f',
          lightBlue: '#2d5a8a',
          gold: '#d4af37',
          lightGold: '#e8c963',
        },
        // Maintain compatibility with user's specific hex usage via extending if they use class names?
        // User used arbitrary values mostly.
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

