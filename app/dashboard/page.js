"use client";
import { useEffect } from "react";
import { TablePagination } from "@mui/material";
import { EmptyState, ErrorState, PageHeader, SearchField } from "@/components/common/ui";
import UsersTable from "@/components/users/UsersTable";
import { useUsersStore } from "@/store/usersStore";
import { PAGE_SIZE } from "@/lib/api";

export default function UsersPage() {
  const items = useUsersStore((s) => s.items), total = useUsersStore((s) => s.total), loading = useUsersStore((s) => s.loading);
  const error = useUsersStore((s) => s.error), q = useUsersStore((s) => s.q), page = useUsersStore((s) => s.page);
  const setQuery = useUsersStore((s) => s.setQuery), setPage = useUsersStore((s) => s.setPage), fetchUsers = useUsersStore((s) => s.fetchUsers);
  // q/page live in the store, so the search survives navigating to a detail page and back.
  useEffect(() => { fetchUsers(); }, [q, page, fetchUsers]);

  return (
    <>
      <PageHeader title="Users" subtitle={loading ? "Loading…" : `${total} ${total === 1 ? "user" : "users"}${q ? ` matching “${q}”` : ""}`}>
        <SearchField label="Search users" value={q} onChange={setQuery} />
      </PageHeader>
      {error ? <ErrorState message={error} onRetry={() => fetchUsers(true)} />
        : !loading && items.length === 0 ? <EmptyState title="No users found" hint="Try a different search." />
        : <>
            <UsersTable users={items} loading={loading} />
            <TablePagination component="div" count={total} page={page} rowsPerPage={PAGE_SIZE} rowsPerPageOptions={[PAGE_SIZE]} onPageChange={(_, p) => setPage(p)} />
          </>}
    </>
  );
}
