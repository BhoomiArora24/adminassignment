"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Card, CardContent, Chip, Rating, Skeleton, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { EmptyState, ErrorState, Field } from "@/components/common/ui";
import { useProductsStore } from "@/store/productsStore";
import { titleCase } from "@/lib/api";

function Gallery({ images, title }) {
  const [i, setI] = useState(0);
  const [broken, setBroken] = useState({});
  if (!images.length) return <Box sx={{ aspectRatio: "1", bgcolor: "#F2F2EC", borderRadius: 2 }} role="img" aria-label="No image available" />;
  return (
    <Box>
      {broken[i]
        ? <Box sx={{ aspectRatio: "1", bgcolor: "#F2F2EC", borderRadius: 2, display: "grid", placeItems: "center" }} role="img" aria-label="Image failed to load"><Typography color="text.secondary">Image unavailable</Typography></Box>
        : <Box component="img" src={images[i]} alt={`${title} – image ${i + 1} of ${images.length}`} onError={() => setBroken((b) => ({ ...b, [i]: true }))} sx={{ width: "100%", aspectRatio: "1", objectFit: "contain", bgcolor: "#F2F2EC", borderRadius: 2, border: "1px solid", borderColor: "divider" }} />}
      <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }} role="group" aria-label="Product images">
        {images.map((img, k) => (
          <Box key={img} component="button" type="button" onClick={() => setI(k)} aria-label={`Show image ${k + 1}`} aria-pressed={k === i}
            sx={{ p: 0, width: 56, height: 56, borderRadius: 1, cursor: "pointer", bgcolor: "#F2F2EC", border: "2px solid", borderColor: k === i ? "primary.main" : "divider", overflow: "hidden", "&:focus-visible": { outline: "2px solid #747D60", outlineOffset: 2 } }}>
            <Box component="img" src={img} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function ProductDetails({ id }) {
  const fetchProduct = useProductsStore((s) => s.fetchProduct);
  const [state, setState] = useState({ p: null, error: null, loading: true });
  const load = useCallback(() => {
    setState({ p: null, error: null, loading: true });
    fetchProduct(id).then((p) => setState({ p, error: null, loading: false })).catch((e) => setState({ p: null, error: e.message, loading: false }));
  }, [id, fetchProduct]);
  useEffect(load, [load]);
  const { p, error, loading } = state;

  return (
    <>
      <Button component={Link} href="/dashboard/products" startIcon={<ArrowBack />} sx={{ mb: 2 }}>Back to Products</Button>
      {loading ? <Skeleton variant="rounded" height={420} />
        : error === "Not found" ? <EmptyState title="Product not found" hint={`No product with ID “${id}”.`} />
        : error ? <ErrorState message={error} onRetry={load} />
        : (
          <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
            <Gallery images={p.images?.length ? p.images : [p.thumbnail].filter(Boolean)} title={p.title} />
            <Box>
              <Typography variant="h1">{p.title}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}><Rating value={p.rating} precision={0.1} readOnly size="small" aria-label={`Rated ${p.rating} out of 5`} /><Typography color="text.secondary">{p.rating}</Typography></Box>
              <Typography variant="h2" component="div">${(p.price * (1 - (p.discountPercentage || 0) / 100)).toFixed(2)} <Typography component="span" color="text.secondary" sx={{ textDecoration: "line-through", fontSize: 14 }}>${p.price}</Typography> <Chip size="small" color="success" label={`${p.discountPercentage}% off`} /></Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>{p.description}</Typography>
              <Card sx={{ mb: 2 }}><CardContent>
                <Field label="Category">{titleCase(p.category)}</Field><Field label="Brand">{p.brand}</Field><Field label="SKU">{p.sku}</Field>
                <Field label="Stock">{p.stock} · {p.availabilityStatus}</Field><Field label="Weight">{p.weight && `${p.weight} oz`}</Field>
                <Field label="Dimensions">{p.dimensions && `${p.dimensions.width} × ${p.dimensions.height} × ${p.dimensions.depth}`}</Field>
                <Field label="Warranty">{p.warrantyInformation}</Field><Field label="Shipping">{p.shippingInformation}</Field><Field label="Returns">{p.returnPolicy}</Field>
              </CardContent></Card>
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>{p.tags?.map((t) => <Chip key={t} size="small" variant="outlined" label={t} />)}</Box>
            </Box>
          </Box>
        )}
    </>
  );
}
