import { createTheme } from "@mui/material/styles";
import { primaryColor, secondaryColor } from "./colors";

const commonShape = { borderRadius: 12 };

const commonTypography = {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600, letterSpacing: "-0.02em" },
    body1: { lineHeight: 1.6 },
    button: { fontWeight: 500, textTransform: "none" as const },
};

const commonComponents = {
    MuiButton: {
        styleOverrides: {
            root: {
                boxShadow: "none",
                "&:hover": { boxShadow: "0 2px 8px rgba(46, 125, 50, 0.2)" },
            },
            contained: {
                background: `linear-gradient(135deg, ${primaryColor.main} 0%, ${primaryColor.dark[100]} 100%)`,
                "&:hover": {
                    background: `linear-gradient(135deg, ${primaryColor.dark[100]} 0%, ${primaryColor.dark[200]} 100%)`,
                },
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: { boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                "& .MuiOutlinedInput-root": {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: primaryColor.light[200],
                    },
                },
            },
        },
    },
};

export const theme = createTheme({
    palette: {
        mode: "light", // Change to "dark" if you want dark mode as default
        primary: {
            light: primaryColor.light[200],
            main: primaryColor.main,
            dark: primaryColor.dark[200],
        },
        secondary: {
            light: secondaryColor.light[200],
            main: secondaryColor.main,
            dark: secondaryColor.dark[200],
        },
        background: {
            default: "#FFFFFF",
            paper: "#F8FAFC",
        },
        text: {
            primary: "#2C3E50",
            secondary: "#5D6D7E",
        },
        divider: "rgba(2, 6, 23, 0.12)",
        success: { main: "#27AE60" },
        info: { main: "#3498DB" },
        warning: { main: "#F39C12" },
        error: { main: "#E74C3C" },
    },
    shape: commonShape,
    typography: commonTypography,
    components: commonComponents,
});

export default theme;
