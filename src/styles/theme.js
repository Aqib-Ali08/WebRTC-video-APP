import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6366F1',     // Elegant Indigo
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#38BDF8',     // Accent Blue
        },
        background: {
            default: '#F3F4F6',  // Light Grayish BG
            paper: '#FFFFFF',    // Card / Container BG
        },
        text: {
            primary: '#111827',  // Dark Text
            secondary: '#6B7280' // Muted Text
        },
        success: {
            main: '#10B981',     // Emerald
        },
        error: {
            main: '#EF4444',     // Red Alert
        },
    },

    typography: {
        fontFamily: `'Poppins', sans-serif`,
        h1: {
            fontWeight: 700,
            fontSize: '3rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2.25rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.875rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1rem',
        },
        body1: {
            fontSize: '1rem',
        },
        body2: {
            fontSize: '0.875rem',
        },
    },

    shape: {
        borderRadius: 12,  // Elegant Curves
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',  // No uppercase by default
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme;
