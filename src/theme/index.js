import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0EA5A4",
      secondary: "#1F2937",
      opaque: 'rgba(0, 0, 0, 0.8)',
    },
    secondary: {
      main: "#0F766E",
    },
    emphasis: {
      main: "#F43F5E",
    },
    light: {
      main: '#FFF',
      secondary: '#e3e3e3',
      disabled: '#F4F5F8',
      opaque: '#8a8a8a',
    },
    dark: {
      main: '#000',
      text: '#252839',
    },
    success: {
      main: '#4BB543'
    },
    error: {
      main: '#ff3333'
    },
    warning: {
      main: '#ffcc00'
    }
  },
  typography: {
    fontFamily: `'Open Sans', sans-serif`, // Fonte padrão para o texto
    h1: { fontFamily: `'Open Sans', sans-serif` },
    h2: { fontFamily: `'Open Sans', sans-serif` },
    h3: { fontFamily: `'Open Sans', sans-serif` },
    h4: { fontFamily: `'Open Sans', sans-serif` },
    h5: { fontFamily: `'Open Sans', sans-serif` },
    h6: { fontFamily: `'Open Sans', sans-serif` },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, Arial, sans-serif', // Aplica a fonte Inter
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, Arial, sans-serif', // Aplica a fonte Inter
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, Arial, sans-serif', // Aplica a fonte Inter
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, Arial, sans-serif', // Aplica a fonte Inter
        },
      },
    },
  },
});

export default theme;
