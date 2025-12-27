
// Primary Color:  Dark Blue Theme
export const primaryColor = {
  main: 'rgb(0, 33, 71)', // Main dark blue background
  rgb: '0, 33, 71',
  hsl: 'hsl(208, 100%, 14%)',
  light: {
    100: '#E3F2FD', // Light blue for accents
    200: '#BBDEFB', // Medium light blue
    300: '#90CAF9', // Bright blue for highlights
  },
  dark: {
    100: 'rgb(0, 28, 60)', // Slightly darker blue
    200: 'rgb(0, 23, 50)', // Much darker blue
    300: 'rgb(0, 18, 40)', // Darkest blue
  },
  alpha: {
    8: 'rgba(0, 33, 71, 0.08)',
    16: 'rgba(0, 33, 71, 0.16)',
    32: 'rgba(0, 33, 71, 0.32)',
    48: 'rgba(0, 33, 71, 0.48)',
  },
};

// Secondary Color: Light colors for text and UI elements on dark background
export const secondaryColor = {
  main: '#FFFFFF', // Pure white for primary text
  rgb: '255, 255, 255',
  hsl: 'hsl(0, 0%, 100%)',
  light: {
    100: '#FFFFFF', // Pure white
    200: '#F5F5F5', // Very light gray
    300: '#E0E0E0', // Light gray for secondary elements
  },
  dark: {
    100: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white
    200: 'rgba(255, 255, 255, 0.7)', // More transparent white for secondary text
    300: 'rgba(255, 255, 255, 0.5)', // Subtle white for tertiary text
  },
  alpha: {
    8: 'rgba(255, 255, 255, 0.08)',
    16: 'rgba(255, 255, 255, 0.16)',
    32: 'rgba(255, 255, 255, 0.32)',
    48: 'rgba(255, 255, 255, 0.48)',
  },
};
