function createColorScale(prefix) {
  const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const scale = {};
  for (const step of steps) {
    scale[step] = ({ opacityValue }) => {
      if (opacityValue !== undefined) {
        return `rgba(var(--color-${prefix}-${step}-rgb), ${opacityValue})`;
      }
      return `var(--color-${prefix}-${step})`;
    };
  }
  scale.DEFAULT = ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(--color-${prefix}-600-rgb), ${opacityValue})`;
    }
    return `var(--color-${prefix}-600)`;
  };
  return scale;
}

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
        primary: createColorScale('primary'),
        brand: createColorScale('primary'),
        indigo: createColorScale('primary'),
        accent: createColorScale('accent'),
        brandAccent: createColorScale('accent'),
        purple: createColorScale('accent'),
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
