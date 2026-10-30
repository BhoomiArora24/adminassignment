"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Box, Button, Card, CardContent, Chip, Skeleton, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { EmptyState, ErrorState, Field } from "@/components/common/ui";
import { useUsersStore } from "@/store/usersStore";

const Section = ({ title, children }) => (
  <Card><CardContent><Typography variant="h3" sx={{ mb: 1 }}>{title}</Typography>{children}</CardContent></Card>
);

export default function UserProfile({ id }) {
  const fetchUser = useUsersStore((s) => s.fetchUser);
  const [state, setState] = useState({ user: null, error: null, loading: true });
  const load = useCallback(() => {
    setState({ user: null, error: null, loading: true });
    fetchUser(id).then((user) => setState({ user, error: null, loading: false })).catch((e) => setState({ user: null, error: e.message, loading: false }));
  }, [id, fetchUser]);
  useEffect(load, [load]);
  const { user: u, error, loading } = state;

  return (
    <>
      <Button component={Link} href="/dashboard/users" startIcon={<ArrowBack />} sx={{ mb: 2 }}>Back to Users</Button>
      {loading ? <Skeleton variant="rounded" height={320} />
        : error === "Not found" ? <EmptyState title="User not found" hint={`No user with ID “${id}”.`} />
        : error ? <ErrorState message={error} onRetry={load} />
        : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar src={u.image} alt={`${u.firstName} ${u.lastName}`} sx={{ width: 72, height: 72 }} />
              <Box><Typography variant="h1">{u.firstName} {u.lastName}</Typography><Typography color="text.secondary" component="div">@{u.username} <Chip size="small" label={u.role} /></Typography></Box>
            </Box>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
              <Section title="Contact"><Field label="Email">{u.email}</Field><Field label="Phone">{u.phone}</Field><Field label="Age">{u.age}</Field><Field label="Gender">{u.gender}</Field><Field label="Birth date">{u.birthDate}</Field></Section>
              <Section title="Address"><Field label="Street">{u.address?.address}</Field><Field label="City">{u.address?.city}</Field><Field label="State">{u.address?.state}</Field><Field label="Postal code">{u.address?.postalCode}</Field><Field label="Country">{u.address?.country}</Field></Section>
              <Section title="Company"><Field label="Company">{u.company?.name}</Field><Field label="Title">{u.company?.title}</Field><Field label="Department">{u.company?.department}</Field></Section>
              <Section title="Other"><Field label="University">{u.university}</Field><Field label="Eye color">{u.eyeColor}</Field><Field label="Hair">{u.hair && `${u.hair.color}, ${u.hair.type}`}</Field><Field label="Height / Weight">{u.height && `${u.height} cm / ${u.weight} kg`}</Field><Field label="Blood group">{u.bloodGroup}</Field></Section>
            </Box>
          </>
        )}
    </>
  );
}
