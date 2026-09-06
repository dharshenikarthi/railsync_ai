/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        railway: {
          blue: '#002D62',       // 25% Primary Railway Blue
          deep: '#0B2545',       // Deep Railway Navy
          navy: '#003865',       // Classic Railway Blue
          accent: '#0284C7',     // Interactive Railway Sky Blue
          light: '#E0F2FE',      // Soft Railway Ice Tint
          canvas: '#F8FAFC',     // 60% White / Light Grey Canvas
          card: '#FFFFFF',       // 60% Pure White Card Surface
          muted: '#F1F5F9',      // 60% Light Grey Secondary Surface
          border: '#E2E8F0',     // Light Grey Border
          dark: '#0F172A',       // 10% Dark Grey Heading & Structure
          slate: '#1E293B',      // 10% Dark Slate Elements
          body: '#334155',       // 10% Dark Grey High-Contrast Typography
          subtext: '#64748B',    // 10% Neutral Grey Secondary Typography
          green: '#10B981',      // 5% Status Safe / Approved Green
          emerald: '#059669',    // 5% Deep Status Green
          yellow: '#F59E0B',     // 5% Status Warning / Caution Yellow
          amber: '#D97706',      // 5% Deep Status Amber
          red: '#EF4444',        // 5% Status Critical / Defect Red
          crimson: '#DC2626'     // 5% Deep Status Red
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(0, 45, 98, 0.1), 0 8px 10px -6px rgba(0, 45, 98, 0.05)',
        'blue-glow': '0 4px 20px -2px rgba(0, 45, 98, 0.25)',
      }
    },
  },
  plugins: [],
}

