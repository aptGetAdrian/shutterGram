// color design tokens export
export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#FAFAFA", // Instagram's light background
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C7C7C7", // Instagram's light mode border
    300: "#A3A3A3",
    400: "#8E8E8E", // Instagram's secondary text
    500: "#666666",
    600: "#4D4D4D",
    700: "#262626", // Instagram's dark text
    800: "#121212", // Instagram's dark mode background
    900: "#0A0A0A",
    1000: "#000000",
  },
  primary: {
    50: "#E0F7FF",
    100: "#B3E6FF",
    200: "#80D4FF",
    300: "#4DC2FF",
    400: "#1E9FFF",
    500: "#0095F6", // Instagram's primary blue
    600: "#0081DC",
    700: "#0068B3",
    800: "#00508A",
    900: "#003761",
  },
  accent: {
    500: "#ED4956", // Instagram's red (for likes, errors)
  },
  secondary: {
    500: "#8E3AC2", // Instagram's purple (for stories)
  }
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode (Instagram dark mode)
            primary: {
              dark: colorTokens.primary[300],
              main: colorTokens.primary[500],
              light: colorTokens.primary[700],
            },
            neutral: {
              dark: colorTokens.grey[0],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[800], // Dark background
              alt: colorTokens.grey[900], // Slightly darker for elements
            },
            error: {
              main: colorTokens.accent[500], // Instagram's error red
            },
          }
        : {
            // palette values for light mode (Instagram light mode)
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500], // Instagram blue
              light: colorTokens.primary[300],
            },
            neutral: {
              dark: colorTokens.grey[700], // Dark text
              main: colorTokens.grey[400], // Secondary text
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[200], // Borders
              light: colorTokens.grey[10], // Background
            },
            background: {
              default: colorTokens.grey[10], // Instagram's light background
              alt: colorTokens.grey[0], // White for cards
            },
            error: {
              main: colorTokens.accent[500], // Instagram's error red
            },
          }),
    },
    typography: {
      fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","), // Instagram's font stack
      fontSize: 14, // Instagram's base font size
      h1: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
        fontSize: 28,
        fontWeight: 600, // Instagram uses medium weight for headings
      },
      h2: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 600,
      },
      h3: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 600,
      },
      h4: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
        fontSize: 18,
        fontWeight: 600,
      },
      h5: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 600,
      },
      h6: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 600,
      },
      button: {
        textTransform: 'none', // Instagram doesn't uppercase buttons
        fontWeight: 600, // Instagram's button weight
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8, // Instagram's button border radius
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Instagram's card border radius
          },
        },
      },
    },
  };
};