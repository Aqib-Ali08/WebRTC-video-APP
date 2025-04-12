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
        fontSize: 16, // base font size

        h1: {
            fontWeight: 700,
            fontSize: '3rem', // 48px
            lineHeight: 1.2,
        },
        h2: {
            fontWeight: 600,
            fontSize: '2.4rem', // 38.4px
            lineHeight: 1.3,
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.92rem', // 30.7px
            lineHeight: 1.35,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.54rem', // 24.6px
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.23rem', // 19.7px
            lineHeight: 1.45,
        },
        h6: {
            fontWeight: 500,
            fontSize: '1rem', // 16px
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem', // 16px
            fontWeight: 400,
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem', // 14px
            fontWeight: 400,
            lineHeight: 1.6,
        },
        caption: {
            fontSize: '0.75rem', // 12px
            fontWeight: 400,
            color: '#6B7280',
            lineHeight: 1.4,
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
