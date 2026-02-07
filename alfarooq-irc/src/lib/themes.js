// This file holds the color configuration for your website
export const themes = [
  {
    id: 'default',
    name: 'Default Blue',
    // Matches your existing blue
    colors: {
      '--color-primary': '#3333cc',
    '--color-littleprimary': '#1E429F',
    '--color-lightprimary': '#EBF5FF',
    }
  },
 {
    id: 'maroon',
    name: 'Maroon',
    // Rich Maroon Shades
    colors: {
      '--color-primary': '#800000',      // Deep Maroon
      '--color-littleprimary': '#5c0000', // Darker Maroon
      '--color-lightprimary': '#ffefef', // Very Light Blush
    }
  },
  {
    id: 'forest-green',
    name: 'Dark Emerald',
    // Professional Dark Green
    colors: {
      '--color-primary': '#064e3b',      // Forest Green
      '--color-littleprimary': '#065f46', 
      '--color-lightprimary': '#ecfdf5', 
    }
  },
  {
    id: 'mustard-gold',
    name: 'Deep Amber',
    // Rich Yellow/Gold shade
    colors: {
      '--color-primary': '#92400e',      // Dark Amber/Mustard
      '--color-littleprimary': '#78350f', 
      '--color-lightprimary': '#fffbeb', 
    }
  }
];