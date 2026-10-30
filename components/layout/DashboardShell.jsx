"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { AppBar, Avatar, Box, Breadcrumbs, Button, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import Menu from "@mui/icons-material/Menu";
import Dashboard from "@mui/icons-material/SpaceDashboardOutlined";
import People from "@mui/icons-material/PeopleOutline";
import Inventory from "@mui/icons-material/Inventory2Outlined";
import Logout from "@mui/icons-material/Logout";
import { useAuthStore } from "@/store/authStore";

const W = 232;
const NAV = [{ href: "/dashboard", label: "Overview", icon: <Dashboard /> }, { href: "/dashboard/users", label: "Users", icon: <People /> }, { href: "/dashboard/products", label: "Products", icon: <Inventory /> }];

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const { data, status } = useSession();
  const setSession = useAuthStore((s) => s.setSession);
  const clear = useAuthStore((s) => s.clear);
  const [open, setOpen] = useState(false);
  // Keep Zustand in sync with the Auth.js session (also covers page refresh).
  useEffect(() => { setSession(status, data); }, [status, data, setSession]);

  const active = (h) => (h === "/dashboard" ? pathname === h : pathname.startsWith(h));
  const crumbs = pathname.split("/").filter(Boolean).slice(1);
  const nav = (
    <Box sx={{ p: 1.5 }}>
      <Typography sx={{ px: 1.5, py: 2, fontWeight: 600 }}>Admin Console</Typography>
      <List component="nav" aria-label="Main navigation">
        {NAV.map((n) => (
          <ListItemButton key={n.href} component={Link} href={n.href} selected={active(n.href)} onClick={() => setOpen(false)}
            sx={{ borderRadius: 1.5, mb: 0.5, "&.Mui-selected": { bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.main" } }, "&.Mui-selected .MuiListItemIcon-root": { color: "inherit" } }}>
            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{n.icon}</ListItemIcon><ListItemText primary={n.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
  const paper = { sx: { width: W, borderRight: "1px solid", borderColor: "divider" } };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer variant="permanent" PaperProps={paper} sx={{ display: { xs: "none", md: "block" }, width: W, flexShrink: 0 }}>{nav}</Drawer>
      <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} ModalProps={{ keepMounted: true }} PaperProps={paper} sx={{ display: { md: "none" } }}>{nav}</Drawer>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Toolbar variant="dense" sx={{ gap: 1, minHeight: 56 }}>
            <IconButton aria-label="Open navigation" onClick={() => setOpen(true)} sx={{ display: { md: "none" } }}><Menu /></IconButton>
            <Breadcrumbs sx={{ flexGrow: 1, fontSize: 13 }} aria-label="Breadcrumb">
              {crumbs.length === 0 ? <Typography sx={{ fontSize: 13 }}>Overview</Typography> : crumbs.map((c, i) => {
                const href = "/dashboard/" + crumbs.slice(0, i + 1).join("/");
                const label = /^\d+$/.test(c) ? `#${c}` : c[0].toUpperCase() + c.slice(1);
                return i === crumbs.length - 1 ? <Typography key={href} sx={{ fontSize: 13 }}>{label}</Typography> : <Link key={href} href={href} style={{ color: "inherit" }}>{label}</Link>;
              })}
            </Breadcrumbs>
            <Avatar src={data?.user?.image} alt="" sx={{ width: 28, height: 28 }} />
            <Typography sx={{ display: { xs: "none", sm: "block" }, fontSize: 13 }}>{data?.user?.name}</Typography>
            <Button size="small" startIcon={<Logout />} onClick={async () => { clear(); await signOut({ callbackUrl: "/login" }); }}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}
