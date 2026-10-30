"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next); setServerError("");
    if (Object.keys(next).length) return;
    setBusy(true);
    const res = await signIn("credentials", { username: form.username.trim(), password: form.password, redirect: false });
    setBusy(false);
    if (res?.ok) { router.replace("/dashboard"); router.refresh(); return; }
    setServerError(res?.error === "CredentialsSignin" ? "Invalid username or password." : "Could not reach the authentication service. Please try again.");
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper variant="outlined" sx={{ width: "100%", maxWidth: 400, p: { xs: 3, sm: 4 } }}>
        <Typography variant="h1" sx={{ fontSize: 24, mb: 3 }}>Sign in</Typography>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: "grid", gap: 2 }}>
          <TextField label="Username" name="username" autoComplete="username" value={form.username} onChange={onChange} error={!!errors.username} helperText={errors.username} autoFocus />
          <TextField label="Password" name="password" type={show ? "text" : "password"} autoComplete="current-password" value={form.password} onChange={onChange} error={!!errors.password} helperText={errors.password}
            InputProps={{ endAdornment: <InputAdornment position="end"><IconButton aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)} edge="end">{show ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
          <Button type="submit" variant="contained" size="large" disabled={busy}>{busy ? <CircularProgress size={22} color="inherit" /> : "Sign in"}</Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>Test account: emilys / emilyspass</Typography>
      </Paper>
    </Box>
  );
}
