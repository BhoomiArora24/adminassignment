"use client";
import { useEffect } from "react";
import { Box, MenuItem, Skeleton, TablePagination, TextField } from "@mui/material";
import { EmptyState, ErrorState, PageHeader, SearchField } from "@/components/common/ui";
import ProductCard from "@/components/products/ProductCard";
import { useProductsStore } from "@/store/productsStore";
import { PAGE_SIZE, titleCase } from "@/lib/api";

export default function ProductsPage() {
  const s = useProductsStore();
  const { items, total, loading, error, q, category, page, categories, setQuery, setCategory, setPage, fetchProducts, fetchCategories } = s;
  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [q, category, page, fetchProducts]);
  const grid = { display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" } };

  return (
    <>
      <PageHeader title="Products" subtitle={loading ? "Loading…" : `${total} ${total === 1 ? "product" : "products"}`}>
        <SearchField label="Search products" value={q} onChange={setQuery} />
        <TextField select size="small" label="Category" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ minWidth: 180 }}>
          <MenuItem value="">All categories</MenuItem>
          {categories.map((c) => <MenuItem key={c} value={c}>{titleCase(c)}</MenuItem>)}
        </TextField>
      </PageHeader>
      {error ? <ErrorState message={error} onRetry={() => fetchProducts(true)} />
        : loading ? <Box sx={grid}>{Array.from({ length: PAGE_SIZE }, (_, i) => <Skeleton key={i} variant="rounded" height={280} />)}</Box>
        : items.length === 0 ? <EmptyState title="No products found" hint="Try a different search or category." />
        : <>
            <Box sx={grid}>{items.map((p) => <ProductCard key={p.id} p={p} />)}</Box>
            <TablePagination component="div" count={total} page={page} rowsPerPage={PAGE_SIZE} rowsPerPageOptions={[PAGE_SIZE]} onPageChange={(_, p) => setPage(p)} />
          </>}
    </>
  );
}
