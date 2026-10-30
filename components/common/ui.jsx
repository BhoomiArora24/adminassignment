"use client";
import { useEffect, useState } from "react";
import { Alert, Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";

export const ErrorState = ({ message, onRetry }) => (
  <Alert severity="error" role="alert" action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}>{message}</Alert>
);
export const EmptyState = ({ title = "No results", hint }) => (
  <Box sx={{ textAlign: "center", py: 8 }} role="status"><Typography variant="h3">{title}</Typography>{hint && <Typography color="text.secondary" sx={{ mt: 0.5 }}>{hint}</Typography>}</Box>
);
export const PageHeader = ({ title, subtitle, children }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-end", justifyContent: "space-between", mb: 3 }}>
    <Box><Typography variant="h1" component="h1">{title}</Typography>{subtitle && <Typography color="text.secondary">{subtitle}</Typography>}</Box>
    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>{children}</Box>
  </Box>
);
export const Field = ({ label, children }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 1, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
    <Typography color="text.secondary" sx={{ fontSize: 13 }}>{label}</Typography>
    <Typography sx={{ textAlign: "right" }}>{children ?? "—"}</Typography>
  </Box>
);

// Debounced input; `value` is the committed store value so external resets (e.g. choosing a category) clear the box.
export function SearchField({ value, onChange, label, delay = 350 }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  useEffect(() => {
    if (v === value) return;
    const t = setTimeout(() => onChange(v), delay);
    return () => clearTimeout(t);
  }, [v, value, onChange, delay]);
  return (
    <TextField size="small" label={label} value={v} onChange={(e) => setV(e.target.value)} sx={{ minWidth: { sm: 280 }, width: { xs: "100%", sm: "auto" } }}
      InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
        endAdornment: v ? <InputAdornment position="end"><IconButton size="small" aria-label="Clear search" onClick={() => { setV(""); onChange(""); }}><Close fontSize="small" /></IconButton></InputAdornment> : null }} />
  );
}
