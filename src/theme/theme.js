import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#12312B',
      light: '#28584F',
      dark: '#071F1B',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E95F2A',
      light: '#FF8758',
      dark: '#B73C12',
      contrastText: '#ffffff',
    },
    success: {
      main: '#0E7C66',
    },
    warning: {
      main: '#F2B705',
    },
    background: {
      default: '#F8F3EA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#17211F',
      secondary: '#5B665F',
    },
    divider: '#E7DDCF',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
      letterSpacing: '-0.02em',
      lineHeight: 1.02,
    },
    h2: {
      fontWeight: 700,
      fontSize: 'clamp(1.7rem, 3vw, 2.5rem)',
      letterSpacing: '-0.01em',
      lineHeight: 1.12,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.35rem',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1.12rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1.08rem',
      lineHeight: 1.65,
    },
    body2: {
      fontSize: '0.98rem',
      lineHeight: 1.5,
      color: '#5B665F',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          minHeight: '48px',
          padding: '12px 24px',
          boxShadow: 'none',
          transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(18, 49, 43, 0.16)',
          },
          '&:focus-visible': {
            outline: '3px solid rgba(233, 95, 42, 0.35)',
            outlineOffset: '3px',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#B73C12',
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow: '0 18px 48px rgba(49, 35, 20, 0.08)',
          border: '1px solid #E7DDCF',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          minHeight: 36,
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: '#fff',
            fontSize: '1.05rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
            fontWeight: 600,
          },
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
    },
  },
});

export default theme;
