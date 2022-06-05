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
      heading: ['Alike Angular', 'serif'],
      toggle: ['Share Tech', 'sans-serif'],
      weatherheader: ['Rhodium Libre', 'sans-serif'],
      name: ['Rye', 'serif'],
      stats: ['Roboto_Slab', 'serif'],
    },
    extend: {
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        17: '4.25rem',
        18: '4.5rem',
        22: '5.5rem',
      },
      screens: {
        mobile: '425px',
      },
      flexGrow: {
        '4/3': 4 / 3,
        2: 2,
      },
    },
  },
  variants: {},
};
