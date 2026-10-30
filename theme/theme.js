"use client";
import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    background: { default: "#F7F7F3", paper: "#FFFFFF" },
    primary: { main: "#747D60", contrastText: "#FFFFFF" },
    text: { primary: "#252823", secondary: "#777B73" },
    divider: "#E7E8E1",
    success: { main: "#5E7F5A" }, warning: { main: "#B7832F" }, error: { main: "#B4503F" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif', fontSize: 14,
    h1: { fontSize: "1.75rem", fontWeight: 500 }, h2: { fontSize: "1.25rem", fontWeight: 500 },
    h3: { fontSize: "1rem", fontWeight: 500 }, button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: "@media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important}}" },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: { defaultProps: { variant: "outlined" } },
    MuiButtonBase: { styleOverrides: { root: { "&.Mui-focusVisible": { outline: "2px solid #747D60", outlineOffset: 2 } } } },
    MuiTableCell: { styleOverrides: { head: { color: "#777B73", fontWeight: 500, fontSize: 12 } } },
  },
});
export default theme;
