"use client";
import { memo } from "react";
import Link from "next/link";
import { Avatar, Box, Button, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// memo: rows only re-render when their own user object changes (list identity is stable from the cache).
const Row = memo(function Row({ u }) {
  return (
    <TableRow hover>
      <TableCell><Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}><Avatar src={u.image} alt="" sx={{ width: 32, height: 32 }} />{u.firstName} {u.lastName}</Box></TableCell>
      <TableCell>{u.email}</TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" }, textTransform: "capitalize" }}>{u.gender}</TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{u.phone}</TableCell>
      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{u.company?.name}</TableCell>
      <TableCell align="right"><Button component={Link} href={`/dashboard/users/${u.id}`} size="small" aria-label={`View ${u.firstName} ${u.lastName}`}>View</Button></TableCell>
    </TableRow>
  );
});

export default function UsersTable({ users, loading }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Users" aria-busy={loading}>
        <TableHead><TableRow>
          <TableCell>Name</TableCell><TableCell>Email</TableCell>
          <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Gender</TableCell>
          <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Phone</TableCell>
          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Company</TableCell><TableCell />
        </TableRow></TableHead>
        <TableBody>
          {loading ? Array.from({ length: 10 }, (_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton height={32} /></TableCell></TableRow>) : users.map((u) => <Row key={u.id} u={u} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
