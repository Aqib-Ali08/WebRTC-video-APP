import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#818cf8',     // Modern Indigo
            light: '#a5b4fc',
            dark: '#4f46e5',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#22d3ee',     // Vibrant Cyan
            light: '#67e8f9',
            dark: '#0891b2',
        },
        background: {
            default: '#0b0f19',  // Deep Dark Space BG
            paper: '#151e33',    // Card / Container BG (Lighter dark)
        },
        text: {
            primary: '#F8FAFC',  // Bright Text
            secondary: '#94A3B8', // Muted Text
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
            color: '#94A3B8',
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
                    borderRadius: 8,
                    textTransform: 'none',  // No uppercase by default
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundImage: 'none',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default theme;
