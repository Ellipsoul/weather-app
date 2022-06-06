/* eslint-disable quotes */
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
      temperature: ['Angkor', 'serif'],
      weatherdescription: ['Armata', 'sans-serif'],
    },
    backgroundImage: {
      sunnyDay: "url('./assets/weather_images/sunny_day.png')",
      sunnyNight: "url('./assets/weather_images/sunny_night.png')",
      cloudyDay: "url('./assets/weather_images/cloudy_day.png')",
      cloudyNight: "url('./assets/weather_images/cloudy_night.png')",
      rainyDay: "url('./assets/weather_images/rainy_day.png')",
      rainyNight: "url('./assets/weather_images/rainy_night.png')",
      mistyDay: "url('./assets/weather_images/misty_day.png')",
      mistyNight: "url('./assets/weather_images/misty_night.png')",
      snowyDay: "url('./assets/weather_images/snowy_day.png')",
      snowyNight: "url('./assets/weather_images/snowy_night.png')",
      stormyDay: "url('./assets/weather_images/stormy_day.png')",
      stormyNight: "url('./assets/weather_images/stormy_night.png')",
    },
    extend: {
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        17: '4.25rem',
        18: '4.5rem',
        22: '5.5rem',
        108: '27rem',
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
