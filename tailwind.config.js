module.exports = {
  mode: 'jit',
  important: true, // Might be necessary to overwrite material design defaults
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    container: {
      padding: '2rem',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['"Fira Code"', 'serif'],
      title: ['Changa', 'sans-serif'],
      slogan: ['Chivo', 'sans-serif'],
    },
    extend: {
      screens: {
        mobile: '425px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
      },
    },
  },
  variants: {},
};
